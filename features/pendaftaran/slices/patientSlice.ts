/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Pasien, HasilPencarianPasien } from '@/types/domain/pasien'; // Sesuaikan path import

// ----------------------------------------------------------------------
// 1. Initial State Interface & Data
// ----------------------------------------------------------------------
export interface PatientState {
  searchQuery: string;
  searchResults: HasilPencarianPasien[];
  selectedPatient: Pasien | null;
  pagination: {
    currentPage: number;
    perPage: number;
    totalData: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  searchQuery: '',
  searchResults: [],
  selectedPatient: null,
  pagination: {
    currentPage: 1,
    perPage: 5,
    totalData: 0,
  },
  loading: false,
  error: null,
};

// ----------------------------------------------------------------------
// 2. Async Thunk (Pencarian Pasien ke Backend)
// ----------------------------------------------------------------------
export const searchPatients = createAsyncThunk<
  { data: HasilPencarianPasien[]; total: number },
  { query: string; page?: number; limit?: number },
  { rejectValue: string }
>('patient/searchPatients', async ({ query, page = 1, limit = 5 }, { rejectWithValue }) => {
  try {
    // Master Mock Data
    const allMockPatients: HasilPencarianPasien[] = [
      {
        nomorRM: 'RM000036',
        namaLengkap: 'Rizka Amalia',
        jenisKelamin: 'P',
        tanggalLahir: '02-03-2016',
        usiaString: '8 th',
        nik: '3271000000009012',
        noTelepon: '081500000000',
        penjaminUtama: 'BPJS',
        alamat: 'Jl. Melati No. 12, Bandung',
        status: 'Aktif',
        tanggalKunjunganTerakhir: '11-08-2026',
        poliKunjunganTerakhir: 'Poli Anak',
        satuSehat: {
          statusTerhubung: true,
          ihsNumber: 'PXXXXXXXXX',
          nikDukcapil: '3271000000009012',
          terakhirSinkron: '16-08-2026 07:58 WIB',
        },
      },
      {
        nomorRM: 'RM000112',
        namaLengkap: 'Raka Pratama',
        jenisKelamin: 'L',
        tanggalLahir: '10-05-2017',
        usiaString: '7 th',
        nik: '3271000000009012',
        noTelepon: '081200000000',
        penjaminUtama: 'BPJS',
        alamat: 'Jl. Mawar No. 4, Bandung',
        status: 'Aktif',
        tanggalKunjunganTerakhir: '03-08-2026',
        poliKunjunganTerakhir: 'Poli Anak',
      },
      {
        nomorRM: 'RM000205',
        namaLengkap: 'Rizka A.',
        jenisKelamin: 'P',
        tanggalLahir: '14-11-2017',
        usiaString: '7 th',
        nik: '3271000000001102',
        noTelepon: '081300000000',
        penjaminUtama: 'UMUM',
        alamat: 'Jl. Anggrek No. 8, Bandung',
        status: 'Aktif',
        tanggalKunjunganTerakhir: '25-07-2026',
        poliKunjunganTerakhir: 'Poli Umum',
      },
    ];

    // Filter berdasarkan Nama, NIK, atau No RM
    const cleanQuery = query.toLowerCase().trim();
    const filtered = cleanQuery
      ? allMockPatients.filter(
          (p) =>
            p.namaLengkap.toLowerCase().includes(cleanQuery) ||
            p.nomorRM.toLowerCase().includes(cleanQuery) ||
            p.nik.includes(cleanQuery)
        )
      : allMockPatients;

    return {
      data: filtered,
      total: filtered.length,
    };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Gagal mencari data pasien');
  }
});

// ----------------------------------------------------------------------
// 3. Patient Slice Definition
// ----------------------------------------------------------------------
export const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    // Set query pencarian
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    // Memilih pasien dari hasil pencarian (menampilkan detail di Card Kanan)
    selectPatient: (state, action: PayloadAction<Pasien | null>) => {
      state.selectedPatient = action.payload;
    },

    // Reset pasien yang dipilih
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },

    // Pengaturan Halaman Paginasi
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },

    setPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.perPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
        state.pagination.totalData = action.payload.total;

        // Auto selection pasien pertama jika belum ada yang dipilih
        if (!state.selectedPatient && action.payload.data.length > 0) {
          state.selectedPatient = action.payload.data[0];
        }
      })
      .addCase(searchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Gagal memuat hasil pencarian';
      });
  },
});

export const {
  setSearchQuery,
  selectPatient,
  clearSelectedPatient,
  setPage,
  setPerPage,
} = patientSlice.actions;

export default patientSlice.reducer;

// ----------------------------------------------------------------------
// 4. Selectors
// ----------------------------------------------------------------------
import type { RootState } from '@/store';

export const selectSelectedPatient = (state: RootState) => 
  (state as RootState & { patient: PatientState }).patient.selectedPatient;
export const selectPatientSearchResults = (state: RootState) =>
  (state as RootState & { patient: PatientState }).patient.searchResults;
export const selectSatuSehatStatus = (state: RootState) =>
  (state as RootState & { patient: PatientState }).patient.selectedPatient?.satuSehat;