/* eslint-disable @typescript-eslint/no-explicit-any */
// Lokasi yang disarankan: src/features/registration/slices/registrationSlice.ts
import { createSlice, createAsyncThunk, current, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { RootState } from '@/store';
import type { PatientDetail } from '@/types/domain/pasien';
import type {
  Pendaftaran,
  PendaftaranForm,
  PendaftaranFormErrors,
  Wilayah,
  WilayahLevel,
  NikStatus,
  CekNikResult,
  SimpanPasienPayload,
  ApiRejectValue,
} from '@/types/domain/pendaftaran';
import { updatePatient } from './patientSlice';
import {
  detailToForm,
  initialPendaftaranForm,
  flattenFieldErrors,
  toPendaftaranPayload,
  WILAYAH_CHILD,
  WILAYAH_ENDPOINT,
  WILAYAH_FIELD,
  WILAYAH_PARENT_FIELD,
} from '../utils/pendaftaranHelpers';

// ----------------------------------------------------------------------
// 1. State
// ----------------------------------------------------------------------
export interface RegistrationState {
  /** create = pasien baru, edit = ubah data pasien yang ada */
  mode: 'create' | 'edit';
  editingId: number | null;
  form: PendaftaranForm;
  errors: PendaftaranFormErrors;

  // Cek NIK
  nikStatus: NikStatus;
  nikMessage: string | null;
  pasienTerdaftar: Pendaftaran | null;

  // Dropdown wilayah bertingkat
  wilayah: Record<WilayahLevel, Wilayah[]>;
  wilayahLoading: Record<WilayahLevel, boolean>;

  // Simpan pasien
  saving: boolean;
  savedPatient: Pendaftaran | null;
  error: string | null;
}

const initialState: RegistrationState = {
  mode: 'create',
  editingId: null,
  form: initialPendaftaranForm,
  errors: {},
  nikStatus: 'idle',
  nikMessage: null,
  pasienTerdaftar: null,
  wilayah: { provinsi: [], kabupaten: [], kecamatan: [], desa: [] },
  wilayahLoading: { provinsi: false, kabupaten: false, kecamatan: false, desa: false },
  saving: false,
  savedPatient: null,
  error: null,
};

// ----------------------------------------------------------------------
// 2. Async Thunks
// ----------------------------------------------------------------------

// Cek apakah NIK sudah terdaftar sebagai pasien.
// Ekspektasi response: { terdaftar: boolean, pasien: Pendaftaran | null }
// exceptId: abaikan pasien ini (mode ubah data, agar NIK miliknya sendiri tidak dianggap duplikat)
export const cekNik = createAsyncThunk<
  CekNikResult,
  { nik: string; exceptId?: number },
  { rejectValue: string }
>(
  'registration/cekNik',
  async ({ nik, exceptId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/patients/check-nik/${nik}`, {
        params: exceptId ? { exceptId } : undefined,
      });
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memeriksa NIK';
      console.error(`Error Cek NIK:`, errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

// Ambil daftar wilayah per level (provinsi -> kabupaten -> kecamatan -> desa)
// Ekspektasi response: Wilayah[] atau { data: Wilayah[] }
export const fetchWilayah = createAsyncThunk<
  { level: WilayahLevel; items: Wilayah[] },
  { level: WilayahLevel; parentKode?: string },
  { rejectValue: string }
>('registration/fetchWilayah', async ({ level, parentKode }, { rejectWithValue }) => {
  try {
    const response = await api.get(WILAYAH_ENDPOINT[level](parentKode));
    const items: Wilayah[] = response.data?.data ?? response.data ?? [];
    return { level, items };
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || `Gagal memuat data ${level}`;
    console.error(`Error Fetch Wilayah (${level}):`, errorMessage);
    return rejectWithValue(errorMessage);
  }
});

// Simpan pasien baru. Ekspektasi response: Pendaftaran (lengkap dengan id & nomorRM)
export const simpanPasien = createAsyncThunk<
  Pendaftaran,
  SimpanPasienPayload,
  { rejectValue: ApiRejectValue }
>('registration/simpanPasien', async ({ data, tiketId }, { rejectWithValue }) => {
  try {
    const response = await api.post('/patients', {
      ...toPendaftaranPayload(data),
      tiketId,
    });
    return response.data;
  } catch (err: any) {
    const body = err.response?.data;
    const message = body?.message || err.message || 'Gagal menyimpan data pasien';
    console.error('Error Simpan Pasien:', message);
    return rejectWithValue({ message, fieldErrors: flattenFieldErrors(body?.errors) });
  }
});

// ----------------------------------------------------------------------
// 3. Helper reducer
// ----------------------------------------------------------------------
const resetNikState = (state: RegistrationState) => {
  state.nikStatus = 'idle';
  state.nikMessage = null;
  state.pasienTerdaftar = null;
};

/** Kosongkan nilai & daftar opsi dari level tertentu sampai level paling bawah */
const clearWilayahFrom = (state: RegistrationState, startLevel: WilayahLevel) => {
  let level: WilayahLevel | null = startLevel;
  while (level) {
    const field = WILAYAH_FIELD[level];
    state.form[field] = '';
    state.wilayah[level] = [];
    delete state.errors[field];
    level = WILAYAH_CHILD[level];
  }
};

// ----------------------------------------------------------------------
// 4. Slice
// ----------------------------------------------------------------------
export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    // Ubah satu field form. Semua nilai form bertipe string.
    setField: (state, action: PayloadAction<{ field: keyof PendaftaranForm; value: string }>) => {
      const { field, value } = action.payload;

      Object.assign(state.form, { [field]: value });
      delete state.errors[field];

      switch (field) {
        case 'jenisIdentitas':
          // Ganti jenis identitas -> nomor identitas & hasil cek NIK tidak berlaku lagi
          state.form.nik = '';
          state.form.kewarganegaraan = value === 'WNA' ? 'WNA' : 'WNI';
          delete state.errors.nik;
          resetNikState(state);
          break;
        case 'nik':
          resetNikState(state);
          break;
        // Dropdown bertingkat: ubah induk -> anak-anaknya dikosongkan
        case 'provinsi':
          clearWilayahFrom(state, 'kabupaten');
          break;
        case 'kabupatenKota':
          clearWilayahFrom(state, 'kecamatan');
          break;
        case 'kecamatan':
          clearWilayahFrom(state, 'desa');
          break;
      }
    },

    setErrors: (state, action: PayloadAction<PendaftaranFormErrors>) => {
      state.errors = action.payload;
    },

    // Reset form saat modal ditutup / setelah berhasil simpan.
    // Daftar provinsi dipertahankan supaya tidak fetch ulang.
    resetForm: (state) => {
      const provinsi = current(state).wilayah.provinsi;
      return {
        ...initialState,
        wilayah: { ...initialState.wilayah, provinsi },
      };
    },

    // Isi form dari data pasien yang akan diubah. Opsi kabupaten/kecamatan/desa
    // dimuat ulang oleh komponen lewat fetchWilayah.
    loadForEdit: (state, action: PayloadAction<PatientDetail>) => {
      state.mode = 'edit';
      state.editingId = action.payload.id;
      state.form = detailToForm(action.payload);
      state.errors = {};
      state.error = null;
      resetNikState(state);
      state.wilayah.kabupaten = [];
      state.wilayah.kecamatan = [];
      state.wilayah.desa = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Cek NIK ----
      .addCase(cekNik.pending, (state) => {
        state.nikStatus = 'checking';
        state.nikMessage = null;
        state.pasienTerdaftar = null;
      })
      .addCase(cekNik.fulfilled, (state, action) => {
        // Abaikan jika NIK di form sudah berubah selama request berjalan
        if (state.form.nik !== action.meta.arg.nik) return;

        if (action.payload.terdaftar && action.payload.pasien) {
          state.nikStatus = 'exists';
          state.pasienTerdaftar = action.payload.pasien;
          state.nikMessage = `NIK sudah terdaftar atas nama ${action.payload.pasien.namaLengkap} (No. RM ${action.payload.pasien.nomorRM}).`;
        } else {
          state.nikStatus = 'available';
          state.nikMessage = 'NIK belum terdaftar. Silakan lengkapi data pasien.';
        }
      })
      .addCase(cekNik.rejected, (state, action) => {
        state.nikStatus = 'error';
        state.nikMessage = action.payload || 'Terjadi kesalahan saat memeriksa NIK';
      })

      // ---- Wilayah ----
      .addCase(fetchWilayah.pending, (state, action) => {
        state.wilayahLoading[action.meta.arg.level] = true;
      })
      .addCase(fetchWilayah.fulfilled, (state, action) => {
        const { level, items } = action.payload;
        state.wilayahLoading[level] = false;

        // Buang response basi (induk sudah diganti sebelum response tiba)
        const parentField = WILAYAH_PARENT_FIELD[level];
        if (parentField && state.form[parentField] !== action.meta.arg.parentKode) return;

        state.wilayah[level] = items;
      })
      .addCase(fetchWilayah.rejected, (state, action) => {
        state.wilayahLoading[action.meta.arg.level] = false;
        state.error = action.payload || 'Gagal memuat data wilayah';
      })

      // ---- Simpan pasien ----
      .addCase(simpanPasien.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.savedPatient = null;
      })
      .addCase(simpanPasien.fulfilled, (state, action) => {
        state.saving = false;
        state.savedPatient = action.payload;
      })
      .addCase(simpanPasien.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || 'Terjadi kesalahan saat menyimpan pasien';
        if (action.payload?.fieldErrors) {
          state.errors = { ...state.errors, ...action.payload.fieldErrors };
        }
      })

      // ---- Ubah pasien (thunk ada di patientSlice) ----
      .addCase(updatePatient.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || 'Terjadi kesalahan saat menyimpan perubahan';
        if (action.payload?.fieldErrors) {
          state.errors = { ...state.errors, ...action.payload.fieldErrors };
        }
      });
  },
});

export const { setField, setErrors, resetForm, loadForEdit } = registrationSlice.actions;

export default registrationSlice.reducer;

// ----------------------------------------------------------------------
// 5. Selectors
// ----------------------------------------------------------------------
export const selectRegistration = (state: RootState): RegistrationState => state.registration;

export const selectNikTerdaftar = (state: RootState): boolean =>
  state.registration.nikStatus === 'exists';
