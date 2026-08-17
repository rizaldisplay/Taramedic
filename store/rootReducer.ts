import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
// Tambahkan reducer fitur lain di sini, contoh:
// import dashboardReducer from '@/features/dashboard/dashboardSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  // dashboard: dashboardReducer,
});