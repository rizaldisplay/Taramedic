import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import queueaReducer from '@/features/pendaftaran/slices/queueSlice';
import patientReducer from '@/features/pendaftaran/slices/patientSlice';
import kioskReducer from '@/features/kiosq/slice/kioskSlice';
import notificationReducer from '@/features/notification/notificationSlice';
import registrasiPasienReducer from '@/features/pendaftaran/slices/registrationSlice';
import visitReducer from '@/features/pendaftaran/slices/visitSlice';
import sdmkReducer from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import unitPoliReducer from '@/features/masterdata/master-organisasi/unit-poli/slices/unitPoliSlice';
import LokasiPelayananReducer from '@/features/masterdata/master-organisasi/lokasi-pelayanan/slices/lokasiPelayananSlice';
import LoketCounterReducer from '@/features/masterdata/master-organisasi/loket-counter/slices/loketCounterSclice';
// Import slice fitur lain di sini jika ada:
// import rekamMedisReducer from '@/features/rekam-medis/rekamMedisSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      queue: queueaReducer,
      patient: patientReducer,
      kiosk: kioskReducer,
      notification: notificationReducer,
      registration: registrasiPasienReducer,
      visit: visitReducer,
      sdmk: sdmkReducer,
      unitPoli: unitPoliReducer,
      lokasiPelayanan: LokasiPelayananReducer,
      loketCounter: LoketCounterReducer,
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