/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/pendaftaran/slices/visitSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type {
  RegisterVisitPayload,
  VisitForm,
  VisitFormErrors,
  VisitOptions,
  VisitRejectValue,
  VisitResult,
} from '@/types/domain/kunjungan';

// ----------------------------------------------------------------------
// 1. Form & validasi
// ----------------------------------------------------------------------
export const initialVisitForm: VisitForm = {
  poliId: '',
  dokterId: '',
  jenisLayanan: '',
  caraMasuk: '',
  penjamin: '',
  jenisPembayaran: '',
  prioritas: 'Normal',
  loketId: '',
  lokasiId: '',
};

const VISIT_LABELS: Record<keyof VisitForm, string> = {
  poliId: 'Poli/Unit tujuan',
  dokterId: 'Dokter / Nakes',
  jenisLayanan: 'Jenis layanan',
  caraMasuk: 'Cara masuk',
  penjamin: 'Penjamin',
  jenisPembayaran: 'Jenis pembayaran',
  prioritas: 'Prioritas',
  loketId: 'Loket pendaftaran',
  lokasiId: 'Lokasi pelayanan',
};

export function validateVisitForm(form: VisitForm): VisitFormErrors {
  const errors: VisitFormErrors = {};
  (Object.keys(VISIT_LABELS) as (keyof VisitForm)[]).forEach((field) => {
    if (!form[field]) errors[field] = `${VISIT_LABELS[field]} wajib dipilih`;
  });
  return errors;
}

// ----------------------------------------------------------------------
// 2. State
// ----------------------------------------------------------------------
export interface VisitState {
  options: VisitOptions | null;
  optionsLoading: boolean;
  optionsError: string | null;

  form: VisitForm;
  errors: VisitFormErrors;

  submitting: boolean;
  error: string | null;
  lastVisit: VisitResult | null;
}

const initialState: VisitState = {
  options: null,
  optionsLoading: false,
  optionsError: null,
  form: initialVisitForm,
  errors: {},
  submitting: false,
  error: null,
  lastVisit: null,
};

// ----------------------------------------------------------------------
// 3. Async Thunks
// ----------------------------------------------------------------------

// Semua opsi dropdown pendaftaran kunjungan + nama petugas yang login
export const fetchVisitOptions = createAsyncThunk<VisitOptions, void, { rejectValue: string }>(
  'visit/fetchOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/registration/options');
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Gagal memuat opsi pendaftaran';
      console.error('Error Fetch Visit Options:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

// Daftarkan kunjungan untuk pasien terpilih
export const registerVisit = createAsyncThunk<
  VisitResult,
  RegisterVisitPayload,
  { rejectValue: VisitRejectValue }
>('visit/register', async ({ patientId, form, tiketId }, { rejectWithValue }) => {
  try {
    const response = await api.post('/visits', { patientId, tiketId, ...form });
    return response.data;
  } catch (err: any) {
    const body = err.response?.data;
    const message = body?.message || err.message || 'Gagal mendaftarkan kunjungan';
    console.error(`Error Register Visit (Pasien ${patientId}):`, message);

    const fieldErrors: VisitFormErrors = {};
    Object.entries(body?.errors ?? {}).forEach(([field, messages]) => {
      const first = Array.isArray(messages) ? messages[0] : messages;
      if (typeof first === 'string') (fieldErrors as Record<string, string>)[field] = first;
    });

    return rejectWithValue({ message, fieldErrors });
  }
});

// ----------------------------------------------------------------------
// 4. Slice
// ----------------------------------------------------------------------
export const visitSlice = createSlice({
  name: 'visit',
  initialState,
  reducers: {
    setVisitField: (
      state,
      action: PayloadAction<{ field: keyof VisitForm; value: string }>,
    ) => {
      const { field, value } = action.payload;
      state.form[field] = value;
      delete state.errors[field];

      // Ganti poli -> dokter yang sudah dipilih tidak berlaku lagi
      if (field === 'poliId') {
        state.form.dokterId = '';
        delete state.errors.dokterId;
      }
    },

    setVisitErrors: (state, action: PayloadAction<VisitFormErrors>) => {
      state.errors = action.payload;
    },

    // Tombol "Kosongkan Formulir"
    resetVisitForm: (state) => {
      state.form = initialVisitForm;
      state.errors = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitOptions.pending, (state) => {
        state.optionsLoading = true;
        state.optionsError = null;
      })
      .addCase(fetchVisitOptions.fulfilled, (state, action) => {
        state.optionsLoading = false;
        state.options = action.payload;
      })
      .addCase(fetchVisitOptions.rejected, (state, action) => {
        state.optionsLoading = false;
        state.optionsError = action.payload || 'Gagal memuat opsi pendaftaran';
      })

      .addCase(registerVisit.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(registerVisit.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastVisit = action.payload;
      })
      .addCase(registerVisit.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Terjadi kesalahan saat mendaftarkan kunjungan';
        if (action.payload?.fieldErrors) {
          state.errors = { ...state.errors, ...action.payload.fieldErrors };
        }
      });
  },
});

export const { setVisitField, setVisitErrors, resetVisitForm } = visitSlice.actions;

export default visitSlice.reducer;
