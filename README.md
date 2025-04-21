# E-Commerce Platform

A full-stack e-commerce application built with React, TypeScript, Node.js, and MongoDB.

## Features

### User Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Secure password hashing

### Product Management
- Product listing with pagination
- Category filtering
- Price range filtering
- Search functionality
- Sort products by price and latest

### Shopping Cart
- Real-time cart updates using WebSocket
- Add/remove products
- Update quantities
- Persistent cart storage
- Cart total calculation

### Wishlist
- Add/remove products to wishlist
- Persistent wishlist storage
- Toggle wishlist items

### Reviews & Ratings
- Product ratings system
- User reviews
- Average rating calculation
- Review count tracking

## Technology Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Socket.IO client for real-time features
- Axios for API requests
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- MongoDB for database
- Socket.IO for real-time communication
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codforg
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
```

Backend (.env):
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
```

4. Start the development servers:
```bash
npm run dev
```

## Project Structure

```
codforg/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   └── public/
└── backend/
    ├── src/
    │   ├── routes/
    │   ├── middleware/
    │   ├── config/
    │   └── types/
    └── data/
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy using the Vercel CLI:
```bash
npm run vercel-deploy
```

### Backend (Vercel)
1. Configure vercel.json
2. Set environment variables in Vercel dashboard
3. Deploy using Vercel CLI

## API Documentation

### Authentication
- POST `/auth/login` - User login
- POST `/auth/signup` - User registration

### Products
- GET `/products` - Get products list
- GET `/products/:id` - Get single product

### Cart
- GET `/cart` - Get user's cart
- POST `/cart/add` - Add item to cart
- DELETE `/cart/remove/:productId` - Remove item from cart

### Wishlist
- POST `/wishlist/:productId` - Toggle wishlist item

### Reviews
- POST `/reviews` - Add product review

## Environment Variables

### Frontend
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_WS_URL`: WebSocket URL

### Backend
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `PORT`: Server port
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Allowed CORS origin
- `VERCEL_URL`: Vercel deployment URL

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
