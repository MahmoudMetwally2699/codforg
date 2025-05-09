import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, selectAuthError } from '../store/slices/authSlice';
import type { AppDispatch } from '../store/store';

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const authError = useSelector(selectAuthError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">Welcome back</h2>
          <p className="mt-2 text-center text-gray-600">Please sign in to your account</p>
        </div>
        {(error || authError) && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded mb-4">
            {error || authError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300
                     rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition-colors duration-200"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300
                     rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition-colors duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm
                     font-medium text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
