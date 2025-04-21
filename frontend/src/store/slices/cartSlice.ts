import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/axios';
import { CartItem } from '../../types';

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    try {
      const response = await api.post('/cart/add', {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  }
);

const initialState = {
  items: [] as CartItem[],
  loading: false,
  error: null as string | null,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload || [];
      state.loading = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.isOpen = true;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to cart';
      });
  },
});

export const { updateCart, toggleCart } = cartSlice.actions;

export default cartSlice.reducer;
