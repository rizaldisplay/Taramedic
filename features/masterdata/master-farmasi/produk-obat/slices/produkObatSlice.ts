// Lokasi: src/features/masterdata/master-farmasi/produk-obat/slices/produkObatSlice.ts
// Daftarkan di store: reducer: { ..., produkObat: produkObatReducer }
//
// Pembagian kerja daftar:
//  - Server  : search + status (dan batas LIMIT_BARIS baris). Berubah -> fetchProduk() ulang.
//  - Klien   : filter formularium/sediaan/rute/produsen, urutan, dan halaman atas baris yang sudah dimuat.
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { RootState } from '@/store';
import type { ApiRejectValue } from '@/types/domain/sdmk';
import type {
  ClientFilters, PanelMode, ProdukObatErrors, ProdukObatForm, ProdukObatItem, ProdukObatListResponse,
  SortDir, SortKey, StatusProduk,
} from '@/types/domain/produkObat';
import {
  initialFilters, initialProduk, itemToForm, LIMIT_BARIS, mapServerErrors, normalisasiKekuatan, normalisasiKfa,
  normalisasiKodeLokal, toPayload, validateProduk,
} from '../utils/produkObatHelpers';

const BASE = '/farmasi/produk-obat';

// ---------------------------------------------------------------- State
export interface ProdukObatState {
  items: ProdukObatItem[];
  /** Jumlah yang cocok di server (bisa lebih besar dari items.length bila dipotong batas endpoint) */
  total: number;
  listLoading: boolean;
  listError: string | null;
  currentRequestId: string | null;

  search: string;
  statusFilter: StatusProduk | '';
  filters: ClientFilters;
  sortKey: SortKey;
  sortDir: SortDir;
  page: number;
  perPage: number;

  /** Panel kanan: form tambah/ubah atau detail produk terpilih */
  panel: PanelMode;
  selected: ProdukObatItem | null;

  form: ProdukObatForm;
  errors: ProdukObatErrors;
  editingId: number | null;
  saving: boolean;
  togglingId: number | null;
}

const initialState: ProdukObatState = {
  items: [], total: 0, listLoading: false, listError: null, currentRequestId: null,
  search: '', statusFilter: '', filters: initialFilters, sortKey: 'nama', sortDir: 'asc', page: 1, perPage: 20,
  panel: 'form', selected: null,
  form: initialProduk, errors: {}, editingId: null, saving: false, togglingId: null,
};

// ---------------------------------------------------------------- Helper
type ThunkCfg = { rejectValue: ApiRejectValue; state: RootState };
const sel = (getState: () => RootState) => getState().produkObat as ProdukObatState;

const toReject = (err: unknown, fallback: string): ApiRejectValue => {
  const error = typeof err === 'object' && err !== null
    ? err as { message?: unknown; response?: { data?: { message?: unknown; errors?: unknown } } }
    : undefined;
  const body = error?.response?.data;
  const fieldErrors = body?.errors && typeof body.errors === 'object' && !Array.isArray(body.errors)
    ? Object.fromEntries(Object.entries(body.errors).map(([key, value]) => [
      key,
      Array.isArray(value) ? String(value[0] ?? '') : String(value),
    ]))
    : undefined;
  const message = typeof body?.message === 'string'
    ? body.message
    : typeof error?.message === 'string' ? error.message : fallback;
  return { message, fieldErrors };
};

/** Ganti baris di daftar (bila sedang dimuat) agar perubahan langsung terlihat sebelum refetch selesai. */
const replaceItem = (s: ProdukObatState, item: ProdukObatItem) => {
  const i = s.items.findIndex((x) => x.id === item.id);
  if (i !== -1) s.items[i] = item;
  if (s.selected?.id === item.id) s.selected = item;
};

// ---------------------------------------------------------------- Thunks
export const fetchProduk = createAsyncThunk<ProdukObatListResponse, void, ThunkCfg>(
  'produkObat/fetchList',
  async (_, { getState, rejectWithValue }) => {
    const s = sel(getState);
    try {
      const res = await api.get(BASE, {
        params: { search: s.search || undefined, status: s.statusFilter || undefined, limit: LIMIT_BARIS },
      });
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal memuat produk obat')); }
  },
);

export const saveProduk = createAsyncThunk<ProdukObatItem, void, ThunkCfg>(
  'produkObat/save',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const s = sel(getState);
    const errors = validateProduk(s.form);
    if (Object.keys(errors).length) {
      return rejectWithValue({ message: 'Data belum lengkap. Periksa kolom yang ditandai merah.', fieldErrors: errors as Record<string, string> });
    }
    try {
      const body = toPayload(s.form);
      const res = s.editingId ? await api.put(`${BASE}/${s.editingId}`, body) : await api.post(BASE, body);
      dispatch(fetchProduk());
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal menyimpan produk obat')); }
  },
);

export const toggleProdukStatus = createAsyncThunk<ProdukObatItem, ProdukObatItem, ThunkCfg>(
  'produkObat/toggleStatus',
  async (item, { dispatch, rejectWithValue }) => {
    try {
      const status: StatusProduk = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
      const res = await api.put(`${BASE}/${item.id}/status`, { status });
      dispatch(fetchProduk());
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal mengubah status')); }
  },
);

// ---------------------------------------------------------------- Slice
const NORMALISASI: Partial<Record<keyof ProdukObatForm, (v: string) => string>> = {
  kfaCode: normalisasiKfa, kodeLokal: normalisasiKodeLokal, kekuatan: normalisasiKekuatan,
};

const produkObatSlice = createSlice({
  name: 'produkObat',
  initialState,
  reducers: {
    // ---- daftar
    setSearch(s, a: PayloadAction<string>) { s.search = a.payload; s.page = 1; },
    setStatusFilter(s, a: PayloadAction<StatusProduk | ''>) { s.statusFilter = a.payload; s.page = 1; },
    setFilter(s, a: PayloadAction<{ key: keyof ClientFilters; value: string }>) {
      (s.filters as Record<string, string>)[a.payload.key] = a.payload.value;
      s.page = 1;
    },
    resetFilters(s) { s.filters = initialFilters; s.page = 1; },
    /** Klik header kolom: kolom sama membalik arah, kolom lain mulai dari A-Z. */
    sortBy(s, a: PayloadAction<SortKey>) {
      if (s.sortKey === a.payload) s.sortDir = s.sortDir === 'asc' ? 'desc' : 'asc';
      else { s.sortKey = a.payload; s.sortDir = 'asc'; }
      s.page = 1;
    },
    setSortKey(s, a: PayloadAction<SortKey>) { s.sortKey = a.payload; s.page = 1; },
    toggleSortDir(s) { s.sortDir = s.sortDir === 'asc' ? 'desc' : 'asc'; s.page = 1; },
    setPage(s, a: PayloadAction<number>) { s.page = Math.max(1, a.payload); },
    setPerPage(s, a: PayloadAction<number>) { s.perPage = a.payload; s.page = 1; },

    // ---- panel kanan
    selectItem(s, a: PayloadAction<ProdukObatItem>) {
      s.selected = a.payload; s.panel = 'detail'; s.editingId = null; s.form = initialProduk; s.errors = {};
    },
    closeDetail(s) { s.selected = null; s.panel = 'form'; },
    openCreate(s) {
      s.selected = null; s.panel = 'form'; s.editingId = null; s.form = initialProduk; s.errors = {};
    },
    startEdit(s, a: PayloadAction<ProdukObatItem>) {
      s.selected = a.payload; s.panel = 'form'; s.editingId = a.payload.id; s.form = itemToForm(a.payload); s.errors = {};
    },
    /** Batal/kembali dari form: saat mengubah kembali ke detail, saat menambah cukup mengosongkan form. */
    cancelForm(s) {
      s.panel = s.editingId !== null && s.selected ? 'detail' : 'form';
      s.editingId = null; s.form = initialProduk; s.errors = {};
    },
    setField(s, a: PayloadAction<{ field: keyof ProdukObatForm; value: string }>) {
      const { field, value } = a.payload;
      (s.form as Record<string, unknown>)[field] = NORMALISASI[field]?.(value) ?? value;
      delete s.errors[field];
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchProduk.pending, (s, a) => { s.listLoading = true; s.listError = null; s.currentRequestId = a.meta.requestId; })
      .addCase(fetchProduk.fulfilled, (s, a) => {
        if (s.currentRequestId !== a.meta.requestId) return; // respons basi
        s.listLoading = false; s.currentRequestId = null;
        s.items = a.payload.data; s.total = a.payload.meta.total;
        if (s.selected) s.selected = a.payload.data.find((x) => x.id === s.selected?.id) ?? s.selected;
      })
      .addCase(fetchProduk.rejected, (s, a) => {
        if (s.currentRequestId !== a.meta.requestId) return;
        s.listLoading = false; s.currentRequestId = null;
        s.listError = a.payload?.message ?? 'Gagal memuat produk obat';
      });

    b.addCase(saveProduk.pending, (s) => { s.saving = true; })
      .addCase(saveProduk.fulfilled, (s, a) => {
        s.saving = false; s.editingId = null; s.form = initialProduk; s.errors = {};
        replaceItem(s, a.payload);
        s.selected = a.payload; s.panel = 'detail'; // tampilkan hasil simpan
      })
      .addCase(saveProduk.rejected, (s, a) => { s.saving = false; s.errors = mapServerErrors(a.payload?.fieldErrors); });

    b.addCase(toggleProdukStatus.pending, (s, a) => { s.togglingId = a.meta.arg.id; })
      .addCase(toggleProdukStatus.fulfilled, (s, a) => { s.togglingId = null; replaceItem(s, a.payload); })
      .addCase(toggleProdukStatus.rejected, (s) => { s.togglingId = null; });
  },
});

export const {
  setSearch, setStatusFilter, setFilter, resetFilters, sortBy, setSortKey, toggleSortDir, setPage, setPerPage,
  selectItem, closeDetail, openCreate, startEdit, cancelForm, setField,
} = produkObatSlice.actions;
export default produkObatSlice.reducer;
