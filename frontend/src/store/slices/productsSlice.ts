import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';
import axios, { AxiosError } from 'axios';
import { Product } from '../../types';

export const fetchProducts = createAsyncThunk<
  { products: Product[]; total: number },
  void,
  { rejectValue: string }
>(
  'products/fetchProducts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { filters } = getState() as any;
      const response = await api.get('/products', {
        params: {
          categories: filters?.categories || [],
          minPrice: filters?.priceRange?.min || 0,
          maxPrice: filters?.priceRange?.max || 1000,
          sort: filters?.sort || 'latest',
          page: filters?.page || 1,
          search: filters?.search || ''
        },
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.code === 'ECONNREFUSED') {
          return rejectWithValue('Backend server is not running. Please start the server and try again.');
        }
        return rejectWithValue(axiosError.message || 'Network error occurred');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [] as Product[],
    total: 0,
    loading: false,
    error: null as string | null,
    categories: [] as string[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch products';
      });
  },
});

export default productsSlice.reducer;
