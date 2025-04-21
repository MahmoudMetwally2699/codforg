import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProductGrid } from './components/ProductGrid';
import { Filters } from './components/Filters';
import { SearchBar } from './components/SearchBar';
import { Cart } from './components/Cart';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { PageContainer } from './components/layout/PageContainer';
import { Navbar } from './components/Navbar';
import { Pagination } from './components/Pagination';
import { fetchProducts } from './store/slices/productsSlice';
import { logout } from './store/slices/authSlice';
import type { AppDispatch, RootState } from './store/store';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (!token) {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 lg:px-8 py-6 max-w-7xl">
        <div className="space-y-6">
          <ErrorBoundary>
            <SearchBar />
          </ErrorBoundary>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-64 flex-shrink-0">
              <ErrorBoundary>
                <Filters />
              </ErrorBoundary>
            </aside>

            <div className="flex-1 min-w-0">
              <ErrorBoundary>
                <ProductGrid />
              </ErrorBoundary>
              <div className="mt-8">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </main>
      <ErrorBoundary>
        <Cart />
      </ErrorBoundary>
    </div>
  );
};

export default App;
