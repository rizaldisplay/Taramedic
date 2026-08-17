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
  role: string;
}

export interface AuthState {
  user: User | null;
  userIdForOtp: number | null;     // Disimpan setelah Step 1 (Login Password) berhasil
  maskedPhone: string | null;      // Nomor telepon ter-mask untuk tampilan UI Form OTP
  accessToken: string | null;
  refreshToken: string | null;
  step: 'LOGIN' | 'OTP';           // Mengontrol tampilan form di UI (Form Password vs Form OTP)
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

// --- Initial State ---

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

// --- Async Thunks ---

/**
 * Step 1: Login dengan Username & Password -> Trigger WhatsApp OTP
 */
export const loginCredentials = createAsyncThunk(
  'auth/loginCredentials',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data; // Expected response: { status: true, data: { user_id, phone_number } }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.message || 'Kredensial tidak valid');
      }
      return rejectWithValue('Gagal terhubung ke server');
    }
  }
);

/**
 * Step 2: Verifikasi OTP -> Menerbitkan Access Token & Refresh Token
 */
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

/**
 * Step 3: Logout Pengguna
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState, dispatch }) => {
    const state = getState() as { auth: AuthState };
    try {
      await api.post('/auth/logout', {
        refresh_token: state.auth.refreshToken,
      });
    } catch (err) {
      // Mengabaikan error logout API jika token memang sudah kadaluwarsa
    } finally {
      dispatch(authSlice.actions.resetAuth());
    }
  }
);

// --- Auth Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Kembali ke form Login (Username/Password) dari form OTP
    resetToLoginStep: (state) => {
      state.step = 'LOGIN';
      state.userIdForOtp = null;
      state.maskedPhone = null;
      state.error = null;
    },
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
    // Reset seluruh state auth & hapus cookie
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
        state.step = 'OTP'; // Pindah tampilan ke form input OTP
        state.userIdForOtp = action.payload.data.user_id;
        state.maskedPhone = action.payload.data.phone_number;
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

        // Simpan token ke Cookies agar dibaca oleh Next.js middleware & Axios interceptor
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