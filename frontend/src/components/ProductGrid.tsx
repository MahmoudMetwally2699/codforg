import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import type { Product } from '../types';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlistItem } from '../store/slices/wishlistSlice';
import { StarRating } from './StarRating';

export const ProductGrid: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products = [], loading = false, error = null } = useSelector((state: RootState) => state.products || {});

  // Add console log for debugging
  console.log('Products:', products);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
      Error: {error}
    </div>
  );

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px] bg-gray-50 rounded-lg">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <p className="text-gray-600">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.isArray(products) && products.map((product: Product) => (
        <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover rounded-t-xl"
              loading="lazy"
            />
            <button
              onClick={() => dispatch(toggleWishlistItem(product))}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white
                       shadow-sm hover:shadow transition-all duration-200"
            >
              <svg
                className={`w-4 h-4 ${product.isWishlisted ? 'text-red-500' : 'text-gray-400'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          <div className="p-4">
            <h3 className="text-base font-medium text-gray-800 truncate">{product.title}</h3>
            <p className="text-lg font-bold text-blue-600 mt-1">
              ${product.price.toFixed(2)}
            </p>
            <div className="flex items-center mt-2">
              <StarRating rating={product.rating} />
              <span className="ml-1 text-xs text-gray-500">({product.rating})</span>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                           bg-blue-100 text-blue-800">
                {product.category}
              </span>
            </div>
            <button
              onClick={() => dispatch(addToCart({ productId: product.id, quantity: 1 }))}
              className="w-full mt-3 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm
                       font-medium rounded-lg transition-colors duration-200 flex items-center
                       justify-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
