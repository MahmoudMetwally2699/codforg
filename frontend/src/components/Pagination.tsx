import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPage } from '../store/slices/filtersSlice';
import type { RootState } from '../store/store';

export const Pagination: React.FC = () => {
  const dispatch = useDispatch();
  const { total } = useSelector((state: RootState) => state.products);
  const { page } = useSelector((state: RootState) => state.filters);
  const totalPages = Math.ceil(total / 9);

  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => dispatch(setPage(i + 1))}
          className={`px-4 py-2 rounded ${
            page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};
