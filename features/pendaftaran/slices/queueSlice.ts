/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ItemAntrean, StatusAntreanHarian } from '@/types/domain/antrean'; // Adjust import path

// ----------------------------------------------------------------------
// 1. Initial State Interface & Data
// ----------------------------------------------------------------------
export interface QueueState extends StatusAntreanHarian {
  activeTab: 'Menunggu' | 'Terlewati';
  loading: boolean;
  error: string | null;
}

const initialState: QueueState = {
  menunggu: 0,
  terlewati: 0,
  antreanSaatIni: null,
  daftarAntrean: [],
  activeTab: 'Menunggu',
  loading: false,
  error: null,
};

// ----------------------------------------------------------------------
// 2. Async Thunks (Persiapan API Call ke Backend)
// ----------------------------------------------------------------------

// Fetch status antrean harian saat halaman di-load
export const fetchQueueStatus = createAsyncThunk<
  StatusAntreanHarian,
  void,
  { rejectValue: string }
>('queue/fetchStatus', async (_, { rejectWithValue }) => {
  try {
    // Ganti dengan API call riil: const response = await api.get('/queue/today');
    // return response.data;
    
    // Mock Data untuk simulasi:
    return {
      menunggu: 16,
      terlewati: 2,
      antreanSaatIni: {
        id: 'q-013',
        nomorAntrean: 'A013',
        statusAntrean: 'Di Panggil',
        waktuAmbil: '08:03:21',
        waktuPanggil: '08:03:21',
        estimasiTunggu: null,
        isPasienBaru: false,
        waitTimeColor: 'text-green-500',
        pemanggilanKe: 1,
      },
      daftarAntrean: [
        { id: 'q-014', nomorAntrean: 'A014', statusAntrean: 'Menunggu', waktuAmbil: '08:42', estimasiTunggu: '3 mnt', isPasienBaru: true, waitTimeColor: 'text-green-500', pemanggilanKe: 0 },
        { id: 'q-015', nomorAntrean: 'A015', statusAntrean: 'Menunggu', waktuAmbil: '08:44', estimasiTunggu: '1 mnt', isPasienBaru: false, waitTimeColor: 'text-green-500', pemanggilanKe: 0 },
        { id: 'q-016', nomorAntrean: 'A016', statusAntrean: 'Menunggu', waktuAmbil: '08:46', estimasiTunggu: '< 1 mnt', isPasienBaru: true, waitTimeColor: 'text-green-500', pemanggilanKe: 0 },
      ],
    };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Gagal mengambil data antrean');
  }
});

// Memanggil antrean berikutnya
export const callNextQueue = createAsyncThunk<
  ItemAntrean | null,
  void,
  { rejectValue: string }
>('queue/callNext', async (_, { rejectWithValue }) => {
  try {
    // const response = await api.post('/queue/next');
    // return response.data;
    return null; // Handle via reducers or return backend updated item
  } catch (err: any) {
    return rejectWithValue(err.message || 'Gagal memanggil antrean berikutnya');
  }
});

// ----------------------------------------------------------------------
// 3. Queue Slice Definition
// ----------------------------------------------------------------------
export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    // Switch tab tampilan UI antara 'MENUNGGU' dan 'TERLEWATI'
    setActiveTab: (state, action: PayloadAction<'Menunggu' | 'Terlewati'>) => {
      state.activeTab = action.payload;
    },

    // Memanggil antrean berikutnya (Synchronous / Client-side optimization)
    panggilBerikutnya: (state) => {
      const nextIndex = state.daftarAntrean.findIndex(
        (item) => item.statusAntrean === 'Menunggu'
      );

      if (nextIndex !== -1) {
        const nextItem = state.daftarAntrean[nextIndex];
        
        // Update antrean saat ini
        state.antreanSaatIni = {
          ...nextItem,
          statusAntrean: 'Di Panggil',
          waktuPanggil: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };

        // Hapus dari list antrean menunggu
        state.daftarAntrean.splice(nextIndex, 1);
        state.menunggu = Math.max(0, state.menunggu - 1);
      }
    },

    // Aksi tombol "PANGGIL ULANG"
    panggilUlang: (state) => {
      if (state.antreanSaatIni) {
        state.antreanSaatIni.waktuPanggil  = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        state.antreanSaatIni.pemanggilanKe = state.antreanSaatIni.pemanggilanKe + 1;
      }
    },

    // Aksi tombol "HADIR" -> Pasien dikonfirmasi dan siap lanjut pendaftaran
    tandaiHadir: (state) => {
      if (state.antreanSaatIni) {
        state.antreanSaatIni.statusAntrean = 'Hadir';
      }
    },

    // Aksi tombol "LEWATI" -> Pindahkan nomor aktif ke list terlewati
    lewatiAntrean: (state) => {
      if (state.antreanSaatIni) {
        const skippedItem: ItemAntrean = {
          ...state.antreanSaatIni,
          statusAntrean: 'Terlewati',
        };

        state.daftarAntrean.push(skippedItem);
        state.terlewati += 1;
        state.antreanSaatIni = null;
      }
    },

    // Panggil langsung antrean tertentu dari daftar bawah
    panggilNomorSpesifik: (state, action: PayloadAction<string>) => {
      const targetIndex = state.daftarAntrean.findIndex((item) => item.id === action.payload);
      
      if (targetIndex !== -1) {
        const targetItem = state.daftarAntrean[targetIndex];
        
        // Jika antrean saat ini ada dan belum diselesaikan, kembalikan ke list atau sesuaikan aturan
        state.antreanSaatIni = {
          ...targetItem,
          statusAntrean: 'Di Panggil',
          waktuPanggil: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };

        state.daftarAntrean.splice(targetIndex, 1);
        if (targetItem.statusAntrean === 'Menunggu') {
          state.menunggu = Math.max(0, state.menunggu - 1);
        } else if (targetItem.statusAntrean === 'Terlewati') {
          state.terlewati = Math.max(0, state.terlewati - 1);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Queue Status
      .addCase(fetchQueueStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueueStatus.fulfilled, (state, action: PayloadAction<StatusAntreanHarian>) => {
        state.loading = false;
        state.menunggu = action.payload.menunggu;
        state.terlewati = action.payload.terlewati;
        state.antreanSaatIni = action.payload.antreanSaatIni;
        state.daftarAntrean = action.payload.daftarAntrean;
      })
      .addCase(fetchQueueStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Terjadi kesalahan saat mengambil antrean';
      });
  },
});



export const {
  setActiveTab,
  panggilBerikutnya,
  panggilUlang,
  tandaiHadir,
  lewatiAntrean,
  panggilNomorSpesifik,
} = queueSlice.actions;

export default queueSlice.reducer;

// ----------------------------------------------------------------------
// 4. Selectors
// ----------------------------------------------------------------------

// Import RootState dari file store utama kamu (sesuaikan path)
import type { RootState } from '@/store'; 

// Selector untuk mengambil 1 item antrean berikutnya yang berstatus 'Menunggu'
export const selectNextInQueue = (state: RootState): ItemAntrean | null => {
  return (
    state.queue.daftarAntrean.find((item) => item.statusAntrean === 'Menunggu') || null
  );
};