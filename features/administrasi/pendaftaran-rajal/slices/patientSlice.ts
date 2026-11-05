/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/pendaftaran/slices/patientSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { ApiRejectValue, PendaftaranForm } from '@/types/domain/pendaftaran';
import type {
  PaginationMeta,
  PatientDetail,
  PatientListItem,
  PatientSearchParams,
  PatientSearchResult,
} from '@/types/domain/pasien';
import { flattenFieldErrors, toPendaftaranPayload } from '../utils/pendaftaranHelpers';

// ----------------------------------------------------------------------
// 1. State
// ----------------------------------------------------------------------
export interface PatientState {
  searchQuery: string;
  searchResults: PatientListItem[];
  /** Pasien yang dipilih: dipakai panel "Data Pasien" & pendaftaran kunjungan */
  selectedPatient: PatientListItem | null;
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
  /** Hanya response dari request pencarian terakhir yang dipakai (hindari balapan debounce) */
  currentSearchRequestId: string | null;

  /** Data lengkap untuk modal detail / ubah data */
  detail: {
    data: PatientDetail | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: PatientState = {
  searchQuery: '',
  searchResults: [],
  selectedPatient: null,
  pagination: { currentPage: 1, perPage: 10, totalData: 0, lastPage: 1 },
  loading: false,
  error: null,
  currentSearchRequestId: null,
  detail: { data: null, loading: false, error: null },
};

const getErrorMessage = (err: any, fallback: string): string =>
  err.response?.data?.message || err.message || fallback;

// ----------------------------------------------------------------------
// 2. Async Thunks
// ----------------------------------------------------------------------

// Cari pasien (nama / NIK / No. RM / No. HP), berhalaman
export const searchPatients = createAsyncThunk<
  PatientSearchResult,
  PatientSearchParams,
  { rejectValue: string }
>('patient/search', async ({ query, page, limit }, { rejectWithValue }) => {
  try {
    const response = await api.get('/patients', {
      params: { query: query.trim(), page, limit },
    });
    return response.data;
  } catch (err: any) {
    const errorMessage = getErrorMessage(err, 'Gagal mencari data pasien');
    console.error('Error Search Patients:', errorMessage);
    return rejectWithValue(errorMessage);
  }
});

// Data ringkas satu pasien. select = true -> jadikan pasien terpilih.
export const fetchPatientSummary = createAsyncThunk<
  PatientListItem,
  { id: number; select?: boolean },
  { rejectValue: string }
>('patient/fetchSummary', async ({ id }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/patients/${id}/summary`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, 'Gagal memuat data pasien'));
  }
});

// Data lengkap satu pasien (modal detail & ubah data)
export const fetchPatientDetail = createAsyncThunk<PatientDetail, number, { rejectValue: string }>(
  'patient/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'Gagal memuat data lengkap pasien');
      console.error(`Error Fetch Patient Detail (${id}):`, errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

// Ubah data pasien. No. RM & No. IHS tidak bisa diubah (diabaikan backend).
export const updatePatient = createAsyncThunk<
  PatientDetail,
  { id: number; data: PendaftaranForm },
  { rejectValue: ApiRejectValue }
>('patient/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/patients/${id}`, toPendaftaranPayload(data));
    return response.data;
  } catch (err: any) {
    const body = err.response?.data;
    const message = body?.message || err.message || 'Gagal menyimpan perubahan data pasien';
    console.error(`Error Update Patient (${id}):`, message);
    return rejectWithValue({ message, fieldErrors: flattenFieldErrors(body?.errors) });
  }
});

// ----------------------------------------------------------------------
// 3. Slice
// ----------------------------------------------------------------------
export const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = Math.max(1, action.payload);
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.perPage = action.payload;
      state.pagination.currentPage = 1;
    },
    selectPatient: (state, action: PayloadAction<PatientListItem>) => {
      state.selectedPatient = action.payload;
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },
    clearDetail: (state) => {
      state.detail = { data: null, loading: false, error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Pencarian ----
      .addCase(searchPatients.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentSearchRequestId = action.meta.requestId;
      })
      .addCase(searchPatients.fulfilled, (state, action) => {
        if (state.currentSearchRequestId !== action.meta.requestId) return; // response basi

        const { data, meta } = action.payload;
        state.loading = false;
        state.currentSearchRequestId = null;
        state.searchResults = data;
        state.pagination = { ...meta };

        // Halaman melewati batas (data berkurang): mundur ke halaman terakhir -> memicu pencarian ulang
        if (meta.lastPage >= 1 && meta.currentPage > meta.lastPage) {
          state.pagination.currentPage = meta.lastPage;
        }
      })
      .addCase(searchPatients.rejected, (state, action) => {
        if (state.currentSearchRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.currentSearchRequestId = null;
        state.error = action.payload || 'Terjadi kesalahan saat mencari pasien';
      })

      // ---- Ringkasan pasien ----
      .addCase(fetchPatientSummary.fulfilled, (state, action) => {
        const item = action.payload;

        const index = state.searchResults.findIndex((p) => p.id === item.id);
        if (index !== -1) state.searchResults[index] = item;

        if (action.meta.arg.select || state.selectedPatient?.id === item.id) {
          state.selectedPatient = item;
        }
      })

      // ---- Detail lengkap ----
      .addCase(fetchPatientDetail.pending, (state, action) => {
        state.detail.loading = true;
        state.detail.error = null;
        if (state.detail.data?.id !== action.meta.arg) state.detail.data = null;
      })
      .addCase(fetchPatientDetail.fulfilled, (state, action) => {
        state.detail.loading = false;
        state.detail.data = action.payload;
      })
      .addCase(fetchPatientDetail.rejected, (state, action) => {
        state.detail.loading = false;
        state.detail.error = action.payload || 'Gagal memuat data lengkap pasien';
      })

      // ---- Ubah pasien ----
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.detail.data = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setPage,
  setPerPage,
  selectPatient,
  clearSelectedPatient,
  clearDetail,
} = patientSlice.actions;

export default patientSlice.reducer;
