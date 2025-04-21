import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '../../types';

const initialState: FilterState = {
  categories: [],
  priceRange: { min: 0, max: 1000 },
  sort: 'latest',
  page: 1,
  search: ''
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{min: number, max: number}>) => {
      state.priceRange = action.payload;
    },
    setSort: (state, action: PayloadAction<FilterState['sort']>) => {
      state.sort = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    }
  }
});

export const { setCategories, setPriceRange, setSort, setPage, setSearchQuery } = filtersSlice.actions;
export default filtersSlice.reducer;
