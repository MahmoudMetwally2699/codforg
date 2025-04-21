import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';
import { setCategories, setPriceRange, setSort } from '../store/slices/filtersSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import type { RootState, AppDispatch } from '../store/store';

export const Filters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories = [], priceRange = { min: 0, max: 1000 }, sort = 'latest' } = useSelector((state: RootState) => state.filters || {});
  const availableCategories = useSelector((state: RootState) => state.products?.categories || []);

  const debouncedFetch = useCallback(
    debounce(() => {
      dispatch(fetchProducts());
    }, 300),
    [dispatch]
  );

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...categories, category]
      : categories.filter((c: string) => c !== category);
    dispatch(setCategories(newCategories));
    debouncedFetch();
  };

  const handlePriceChange = (value: number) => {
    dispatch(setPriceRange({ ...priceRange, max: value }));
    debouncedFetch();
  };

  const handleSortChange = (value: string) => {
    dispatch(setSort(value as any));
    debouncedFetch();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {availableCategories.map((category: string) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={categories.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange.max}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">${priceRange.min}</span>
          <span className="text-sm text-gray-600">${priceRange.max}</span>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="latest">Latest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};
