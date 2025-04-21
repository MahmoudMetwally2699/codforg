import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

export const login = createAsyncThunk<
  string,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;

      if (!token) {
        return rejectWithValue('Login failed: No token received');
      }

      localStorage.setItem('token', token);
      return token;
    } catch (err: any) {
      console.error('Login error:', err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please check your credentials.'
      );
    }
  }
);

export const signup = createAsyncThunk<
  { token: string; user: { email: string } },
  { email: string; password: string; confirmPassword: string },
  { rejectValue: string }
>(
  'auth/signup',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', credentials, {
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: (status) => status < 500
      });

      if (response.status === 400) {
        return rejectWithValue(response.data.error || 'Validation failed');
      }

      if (!response.data.token) {
        return rejectWithValue('Server response missing token');
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { token, user };
    } catch (err: any) {
      console.error('Signup error:', err);
      return rejectWithValue(
        err.response?.data?.error ||
        err.message ||
        'Failed to create account'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    loading: false,
    error: null as string | null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Login failed';
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Signup failed';
      });
  },
});

export const { logout } = authSlice.actions;

// Add selector for error state
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
