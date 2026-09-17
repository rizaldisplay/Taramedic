/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StatusPasien, JenisPenjamin, PrinterStatus } from '@/types/common'; // Sesuaikan path
import { TicketData } from '@/types/kiosk';
import { RootState } from '@/store';

interface KioskState {
    step: number; // 1: Status Pasien, 2: Penjamin, 3: Sukses/Print
    statusPasien: StatusPasien | null;
    jenisPenjamin: JenisPenjamin | null;
    nomorAntrean: TicketData | null;
    printerStatus: PrinterStatus;
}

const initialState: KioskState = {
    step: 0,
    statusPasien: null,
    jenisPenjamin: null,
    nomorAntrean: null,
    printerStatus: 'idle',
};

// 1. Buat Thunk untuk memanggil API
export const submitPendaftaranKiosk = createAsyncThunk(
  'kiosk/submitPendaftaran',
  async (penjaminTerpilih: JenisPenjamin, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const statusPasien = state.kiosk.statusPasien;

      const response = await fetch('http://localhost:8000/api/antrean/daftar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          statusPasien,
          jenisPenjamin: penjaminTerpilih,
          isPasienBaru: statusPasien === 'Baru'
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal mendaftar antrean');
      }

      // Ambil seluruh objek data dari Laravel
      return result.data; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const kioskSlice = createSlice({
    name: 'kiosk',
    initialState,
    reducers: {
        mulaiKiosk: (state) => {
            state.step = 1;
        },
        // Step 1: Set Status Pasien & lanjut ke Step 2
        pilihStatusPasien: (state, action: PayloadAction<StatusPasien>) => {
            state.statusPasien = action.payload;
            state.step = 2;
        },
        
        // Step 2: Set Penjamin (belum lanjut step karena butuh API call untuk generate nomor)
        pilihPenjamin: (state, action: PayloadAction<JenisPenjamin>) => {
            state.jenisPenjamin = action.payload;
        },

        // Step 3: Set Nomor Antrean dari hasil API/Lib & lanjut ke Step 3 (Layar Berhasil)
        setNomorAntreanSukses: (state, action: PayloadAction<TicketData>) => {
            state.nomorAntrean = action.payload;
            state.step = 3;
        },

        // Tombol Kembali di Step 2
        kembaliKeStepSebelumnya: (state) => {
            if (state.step > 1) {
                state.step -= 1;
                // Reset data jika mundur agar state tetap bersih
                if (state.step === 1) state.statusPasien = null;
                if (state.step === 2) state.jenisPenjamin = null;
            }
        },

        // Action untuk mengatur status printer (pairing, connecting, dll)
        setPrinterStatus: (state, action: PayloadAction<PrinterStatus>) => {
            state.printerStatus = action.payload;
        },

        // Tombol Selesai atau Timeout (kembali ke layar awal)
        resetKiosk: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
    builder
      .addCase(submitPendaftaranKiosk.pending, (state) => {
        // Bisa tambahkan state.isLoading = true di sini jika mau
      })
      .addCase(submitPendaftaranKiosk.fulfilled, (state, action) => {
        // API Sukses: Simpan nomor dan pindah ke layar Pendaftaran Berhasil (Step 3)
        state.nomorAntrean = action.payload;
        state.step = 3; 
      })
      .addCase(submitPendaftaranKiosk.rejected, (state, action) => {
        // Tangani error di sini (misal tampilkan toast error)
        console.error("Error pendaftaran:", action.payload);
      });
  },
});

export const {
    mulaiKiosk,
    pilihStatusPasien,
    pilihPenjamin,
    setNomorAntreanSukses,
    kembaliKeStepSebelumnya,
    setPrinterStatus,
    resetKiosk,
} = kioskSlice.actions;

export default kioskSlice.reducer;