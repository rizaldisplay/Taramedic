import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
// Import slice fitur lain di sini jika ada:
// import rekamMedisReducer from '@/features/rekam-medis/rekamMedisSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      // rekamMedis: rekamMedisReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Type Definitions
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];