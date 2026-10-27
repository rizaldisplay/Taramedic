/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import Cookies from 'js-cookie';
import axios from 'axios';

// --- Type Definitions ---

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  roles: string[]; // [UPDATE] Menyesuaikan dengan backend (array of role slugs)
}

export interface AuthState {
  user: User | null;
  userIdForOtp: number | null;
  maskedPhone: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  step: 'LOGIN' | 'OTP';
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface VerifyOtpPayload {
  user_id: number;
  otp: string;
}

export interface AuthSuccessResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    authorization: {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    };
  };
}

// Response login sekarang bisa dua jenis (Dengan OTP atau Langsung Token)
export interface LoginResponse {
  status: boolean;
  message: string;
  is_2fa?: boolean; 
  data: any; 
}

const initialState: AuthState = {
  user: null,
  userIdForOtp: null,
  maskedPhone: null,
  accessToken: Cookies.get('access_token') || null,
  refreshToken: Cookies.get('refresh_token') || null,
  step: 'LOGIN',
  loading: false,
  error: null,
  isAuthenticated: !!Cookies.get('access_token'),
};

export const loginCredentials = createAsyncThunk(
  'auth/loginCredentials',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.message || 'Kredensial tidak valid');
      }
      return rejectWithValue('Gagal terhubung ke server');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: VerifyOtpPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthSuccessResponse>('/auth/verify-otp', payload);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.message || 'Kode OTP salah atau expired');
      }
      return rejectWithValue('Gagal memverifikasi OTP');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState, dispatch }) => {
    const state = getState() as { auth: AuthState };
    try {
      await api.post('/auth/logout', {
        refresh_token: state.auth.refreshToken,
      });
    } catch (err) {} 
    finally {
      dispatch(authSlice.actions.resetAuth());
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetToLoginStep: (state) => {
      state.step = 'LOGIN';
      state.userIdForOtp = null;
      state.maskedPhone = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.userIdForOtp = null;
      state.maskedPhone = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.step = 'LOGIN';
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;

      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Step 1: Login Credentials ---
      .addCase(loginCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCredentials.fulfilled, (state, action) => {
        state.loading = false;
        
        // [UPDATE] Cek apakah user wajib OTP atau tidak
        if (action.payload.is_2fa) {
          state.step = 'OTP'; 
          state.userIdForOtp = action.payload.data.user_id;
          state.maskedPhone = action.payload.data.phone_number;
        } else {
          // Jika tidak 2FA, token langsung diberikan oleh backend
          const { user, authorization } = action.payload.data;
          state.isAuthenticated = true;
          state.user = user;
          state.accessToken = authorization.access_token;
          state.refreshToken = authorization.refresh_token;

          Cookies.set('access_token', authorization.access_token, { expires: 1, path: '/' });
          Cookies.set('refresh_token', authorization.refresh_token, { expires: 30, path: '/' });
        }
      })
      .addCase(loginCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Step 2: Verify OTP ---
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<AuthSuccessResponse>) => {
        const { user, authorization } = action.payload.data;
        state.loading = false;
        state.isAuthenticated = true;
        state.user = user;
        state.accessToken = authorization.access_token;
        state.refreshToken = authorization.refresh_token;

        Cookies.set('access_token', authorization.access_token, { expires: 1, path: '/' });
        Cookies.set('refresh_token', authorization.refresh_token, { expires: 30, path: '/' });
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetToLoginStep, clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;