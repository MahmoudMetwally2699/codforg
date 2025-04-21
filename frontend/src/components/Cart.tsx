import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import type { RootState, AppDispatch } from '../store/store';
import { updateCart, toggleCart } from '../store/slices/cartSlice';
import type { CartItem } from '../types';

const wsUrl = process.env.NODE_ENV === 'production'
  ? 'https://codforg-fzerokgvz-mahmoudmetwally2699s-projects.vercel.app'
  : 'http://localhost:3001';

const socket = io(wsUrl, {
  withCredentials: true,
  autoConnect: false,
  transports: ['polling', 'websocket'],
  path: '/socket.io',
  auth: {
    token: localStorage.getItem('token')
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message);
  // Retry connection with updated token
  socket.auth = { token: localStorage.getItem('token') };
  socket.connect();
});

socket.connect();

export const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, isOpen } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    socket.on('cartUpdated', (data) => {
      if (data?.cart) {
        dispatch(updateCart(data.cart));
      }
    });

    return () => {
      socket.off('cartUpdated');
    };
  }, [dispatch]);

  const cartItems = Array.isArray(items) ? items.filter(item => item?.product) : [];
  const total = cartItems.reduce((sum, item) =>
    sum + (item.product?.price || 0) * (item.quantity || 0), 0
  );

  console.log('Cart Items:', cartItems); // Add this for debugging

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => dispatch(toggleCart())}
      />

      <div className="fixed right-0 top-0 h-screen w-72 sm:w-80 md:w-96 bg-white shadow-lg z-50">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Shopping Cart ({cartItems.length})
            </h2>
            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent" />
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-sm">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.product.title}</h3>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-blue-600 font-bold">
                        ${((item.product.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">Total:</span>
              <span className="text-lg font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
            <button className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
