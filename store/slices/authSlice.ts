import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginPayload, AuthResponse } from '../../types/auth';
import { api } from '../../services/api';
import axios from 'axios';

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
};

// Async Thunk untuk memanggil API Login Laravel
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.message || 'Kredensial tidak valid');
      }
      return rejectWithValue('Terjadi kesalahan koneksi server');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending State (Set Loading)
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled State (Simpan User & Token ke Redux Store & LocalStorage)
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        const { user, authorization } = action.payload.data;
        state.loading = false;
        state.isAuthenticated = true;
        state.user = user;
        state.accessToken = authorization.access_token;
        state.refreshToken = authorization.refresh_token;

        localStorage.setItem('access_token', authorization.access_token);
        localStorage.setItem('refresh_token', authorization.refresh_token);
      })
      // Rejected State (Tangkap Error dari API)
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;