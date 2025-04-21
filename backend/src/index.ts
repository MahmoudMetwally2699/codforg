import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { productsRouter } from './routes/products';
import { cartRouter } from './routes/cart';
import { categoriesRouter } from './routes/categories';
import { authRouter } from './routes/auth';
import { ordersRouter } from './routes/orders';
import { wishlistRouter } from './routes/wishlist';
import { reviewsRouter } from './routes/reviews';
import { Server } from 'socket.io';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import { connectDB } from './config/db';
import { ObjectId } from 'mongodb';
import { products } from './data/products';

const app = express();
const httpServer = createServer(app);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const allowedOrigins = [
  'http://localhost:3000',
  'https://codforg-i957.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(morgan('dev')); // Add request logging
app.use(limiter); // Apply rate limiting

app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/categories', categoriesRouter);
app.use('/auth', authRouter);
app.use('/orders', ordersRouter);
app.use('/wishlist', wishlistRouter);
app.use('/reviews', reviewsRouter);

const PORT = process.env.PORT || 3001;

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  path: '/socket.io'
});

app.set('io', io); // Make io available to routes

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    // Allow connection without token, but mark socket as unauthenticated
    socket.data.authenticated = false;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    socket.data.user = decoded;
    socket.data.authenticated = true;
    next();
  } catch (err) {
    socket.data.authenticated = false;
    next();
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('cartUpdate', async (data) => {
    try {
      const db = app.locals.db;
      const cart = await db.collection('carts').findOne({ userId: socket.data.user.email });
      if (cart) {
        socket.broadcast.emit('cartUpdated', { userId: socket.data.user.email, cart });
      }
    } catch (error) {
      console.error('Cart update failed:', error);
      socket.emit('error', { message: 'Failed to update cart' });
    }
  });

  socket.on('orderStatus', async (data) => {
    try {
      const db = app.locals.db;
      const order = await db.collection('orders').findOne({
        _id: new ObjectId(data.orderId),
        userId: socket.data.user.email
      });

      if (order) {
        await db.collection('orders').updateOne(
          { _id: new ObjectId(data.orderId) },
          { $set: { status: data.status, updatedAt: new Date() } }
        );
        io.emit('orderStatusUpdated', { ...order, status: data.status });
      }
    } catch (error) {
      console.error('Order status update failed:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Add basic error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  try {
    const db = await connectDB();
    app.locals.db = db;

    // Insert initial products if collection is empty
    const productCount = await db.collection('products').countDocuments();
    if (productCount === 0) {
      // Remove _id from products before insertion
      const productsToInsert = products.map(({ id, ...rest }) => ({
        ...rest,
        productId: id // Keep original id as productId
      }));
      await db.collection('products').insertMany(productsToInsert);
      console.log('Initial products seeded successfully');
    }

    httpServer.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log('Socket.IO server ready');
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
