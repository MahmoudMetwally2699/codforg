import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { ObjectId } from 'mongodb';

const router = Router();

router.post('/', auth, async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const { cartItems, totalAmount } = req.body;
  const userId = req.user.email;
  const db = req.app.locals.db;

  try {
    const order = {
      userId,
      items: cartItems,
      totalAmount,
      status: 'pending',
      createdAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);
    const io = req.app.get('io');
    io.emit('orderCreated', { ...order, _id: result.insertedId });

    // Clear user's cart after order creation
    await db.collection('carts').deleteMany({ userId });

    res.json({ orderId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/', auth, async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const userId = req.user.email;
  const db = req.app.locals.db;

  try {
    const userOrders = await db.collection('orders').find({ userId }).toArray();
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export const ordersRouter = router;
