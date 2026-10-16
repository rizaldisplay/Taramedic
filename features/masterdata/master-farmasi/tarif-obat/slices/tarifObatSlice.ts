// Lokasi: src/features/masterdata/master-farmasi/tarif-obat/slices/tarifObatSlice.ts
// Daftarkan di store: reducer: { ..., tarifObat: tarifObatReducer }
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { RootState } from '@/store';
import type { ApiRejectValue } from '@/types/domain/sdmk';
import type {
  RiwayatTarifItem, RiwayatTarifResponse, StatusTarif, TarifObatErrors, TarifObatForm, TarifObatItem,
  TarifObatListResponse, TarifObatOptions,
} from '@/types/domain/tarifObat';
import { initialTarif, itemToForm, normalisasiTarif, toPayload, validateTarif } from '../utils/tarifObatHelpers';

const BASE = '/farmasi/tarif-obat';

// ---------------------------------------------------------------- State
export interface RiwayatState {
  open: boolean;
  /** Tarif yang riwayatnya sedang ditampilkan */
  forId: number | null;
  forLabel: string | null;
  items: RiwayatTarifItem[];
  loading: boolean;
  error: string | null;
  requestId: string | null;
}

export interface TarifObatState {
  items: TarifObatItem[];
  meta: TarifObatListResponse['meta'];
  listLoading: boolean;
  listError: string | null;
  currentRequestId: string | null;

  search: string;
  penjaminFilter: string;
  statusFilter: StatusTarif | '';
  page: number;
  perPage: number;

  options: TarifObatOptions | null;

  form: TarifObatForm;
  errors: TarifObatErrors;
  editingId: number | null;
  saving: boolean;
  togglingId: number | null;

  riwayat: RiwayatState;
}

const initialState: TarifObatState = {
  items: [], meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 0 }, listLoading: false, listError: null, currentRequestId: null,
  search: '', penjaminFilter: '', statusFilter: '', page: 1, perPage: 10,
  options: null,
  form: initialTarif, errors: {}, editingId: null, saving: false, togglingId: null,
  riwayat: { open: false, forId: null, forLabel: null, items: [], loading: false, error: null, requestId: null },
};

// ---------------------------------------------------------------- Helper
type ThunkCfg = { rejectValue: ApiRejectValue; state: RootState };
const sel = (getState: () => RootState) => getState().tarifObat as TarifObatState;

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

export const labelTarif = (x: Pick<TarifObatItem, 'obatNama' | 'penjamin' | 'satuan'>) => `${x.obatNama} · ${x.penjamin} · ${x.satuan}`;

// ---------------------------------------------------------------- Thunks
export const fetchTarif = createAsyncThunk<TarifObatListResponse, void, ThunkCfg>(
  'tarifObat/fetchList',
  async (_, { getState, rejectWithValue }) => {
    const s = sel(getState);
    try {
      const res = await api.get(BASE, {
        params: {
          search: s.search || undefined, penjamin: s.penjaminFilter || undefined, status: s.statusFilter || undefined,
          page: s.page, perPage: s.perPage,
        },
      });
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal memuat tarif obat')); }
  },
);

/** Pilihan obat & penjamin. Dimuat sekali; { force: true } memuat ulang. */
export const fetchTarifOptions = createAsyncThunk<TarifObatOptions, { force?: boolean } | void, ThunkCfg>(
  'tarifObat/fetchOptions',
  async (_, { rejectWithValue }) => {
    try { return (await api.get(`${BASE}/options`)).data; }
    catch (err) { return rejectWithValue(toReject(err, 'Gagal memuat pilihan obat')); }
  },
  { condition: (arg, { getState }) => !!(arg && arg.force) || !sel(getState).options },
);

export const fetchRiwayat = createAsyncThunk<RiwayatTarifResponse, TarifObatItem, ThunkCfg>(
  'tarifObat/fetchRiwayat',
  async (item, { rejectWithValue }) => {
    try { return (await api.get(`${BASE}/${item.id}/riwayat`)).data; }
    catch (err) { return rejectWithValue(toReject(err, 'Gagal memuat riwayat tarif')); }
  },
);

export const saveTarif = createAsyncThunk<TarifObatItem, void, ThunkCfg>(
  'tarifObat/save',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const s = sel(getState);
    const editing = s.editingId !== null ? s.items.find((x) => x.id === s.editingId) ?? null : null;
    const errors = validateTarif(s.form, s.items, editing);
    if (Object.keys(errors).length) {
      return rejectWithValue({ message: 'Data belum lengkap. Periksa kolom yang ditandai merah.', fieldErrors: errors as Record<string, string> });
    }
    try {
      const body = toPayload(s.form);
      const res = s.editingId ? await api.put(`${BASE}/${s.editingId}`, body) : await api.post(BASE, body);
      const saved = res.data as TarifObatItem;
      dispatch(fetchTarif());
      dispatch(fetchRiwayat(saved)); // tampilkan jejak perubahan yang baru saja terjadi
      return saved;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal menyimpan tarif obat')); }
  },
);

export const toggleTarifStatus = createAsyncThunk<TarifObatItem, TarifObatItem, ThunkCfg>(
  'tarifObat/toggleStatus',
  async (item, { getState, dispatch, rejectWithValue }) => {
    try {
      const status: StatusTarif = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
      const res = await api.put(`${BASE}/${item.id}/status`, { status });
      dispatch(fetchTarif());
      if (sel(getState).riwayat.forId === item.id) dispatch(fetchRiwayat(res.data as TarifObatItem));
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal mengubah status')); }
  },
);

// ---------------------------------------------------------------- Slice
const tarifObatSlice = createSlice({
  name: 'tarifObat',
  initialState,
  reducers: {
    // ---- daftar (semua server-side; ubah filter -> fetchTarif ulang di komponen)
    setSearch(s, a: PayloadAction<string>) { s.search = a.payload; s.page = 1; },
    setPenjaminFilter(s, a: PayloadAction<string>) { s.penjaminFilter = a.payload; s.page = 1; },
    setStatusFilter(s, a: PayloadAction<StatusTarif | ''>) { s.statusFilter = a.payload; s.page = 1; },
    setPage(s, a: PayloadAction<number>) { s.page = Math.max(1, a.payload); },
    setPerPage(s, a: PayloadAction<number>) { s.perPage = a.payload; s.page = 1; },

    // ---- form
    setField(s, a: PayloadAction<{ field: keyof TarifObatForm; value: string }>) {
      const { field, value } = a.payload;
      (s.form as Record<string, string>)[field] = field === 'tarif' ? normalisasiTarif(value) : value;
      delete s.errors[field];
      // Memilih obat mengisi satuan otomatis (hanya bila satuan masih kosong), mis. Tablet -> tablet.
      if (field === 'obatId' && !s.form.satuan) {
        s.form.satuan = s.options?.obat.find((o) => o.value === value)?.satuan ?? '';
      }
      // Tanggal yang diubah memengaruhi pemeriksaan tumpang tindih yang ditempelkan pada "Berlaku mulai".
      if (field === 'berlakuSampai' || field === 'penjamin' || field === 'satuan' || field === 'obatId') delete s.errors.berlakuMulai;
    },
    startEdit(s, a: PayloadAction<TarifObatItem>) { s.editingId = a.payload.id; s.form = itemToForm(a.payload); s.errors = {}; },
    resetForm(s) { s.editingId = null; s.form = initialTarif; s.errors = {}; },

    // ---- riwayat
    toggleRiwayat(s) { s.riwayat.open = !s.riwayat.open; },
  },
  extraReducers: (b) => {
    b.addCase(fetchTarif.pending, (s, a) => { s.listLoading = true; s.listError = null; s.currentRequestId = a.meta.requestId; })
      .addCase(fetchTarif.fulfilled, (s, a) => {
        if (s.currentRequestId !== a.meta.requestId) return; // respons basi
        s.listLoading = false; s.currentRequestId = null;
        s.items = a.payload.data; s.meta = a.payload.meta;
        // Halaman melewati batas (data berkurang): mundur ke halaman terakhir -> komponen memicu muat ulang.
        if (a.payload.meta.lastPage >= 1 && s.page > a.payload.meta.lastPage) s.page = a.payload.meta.lastPage;
      })
      .addCase(fetchTarif.rejected, (s, a) => {
        if (s.currentRequestId !== a.meta.requestId) return;
        s.listLoading = false; s.currentRequestId = null;
        s.listError = a.payload?.message ?? 'Gagal memuat tarif obat';
      });

    b.addCase(fetchTarifOptions.fulfilled, (s, a) => { s.options = a.payload; });

    b.addCase(saveTarif.pending, (s) => { s.saving = true; })
      .addCase(saveTarif.fulfilled, (s) => { s.saving = false; s.editingId = null; s.form = initialTarif; s.errors = {}; })
      .addCase(saveTarif.rejected, (s, a) => { s.saving = false; s.errors = (a.payload?.fieldErrors ?? {}) as TarifObatErrors; });

    b.addCase(toggleTarifStatus.pending, (s, a) => { s.togglingId = a.meta.arg.id; })
      .addCase(toggleTarifStatus.fulfilled, (s, a) => {
        s.togglingId = null;
        const i = s.items.findIndex((x) => x.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })
      .addCase(toggleTarifStatus.rejected, (s) => { s.togglingId = null; });

    b.addCase(fetchRiwayat.pending, (s, a) => {
      const r = s.riwayat;
      if (r.forId !== a.meta.arg.id) r.items = []; // jangan tampilkan riwayat tarif lain sementara memuat
      r.open = true; r.forId = a.meta.arg.id; r.forLabel = labelTarif(a.meta.arg);
      r.loading = true; r.error = null; r.requestId = a.meta.requestId;
    })
      .addCase(fetchRiwayat.fulfilled, (s, a) => {
        if (s.riwayat.requestId !== a.meta.requestId) return;
        s.riwayat.loading = false; s.riwayat.requestId = null; s.riwayat.items = a.payload.data;
      })
      .addCase(fetchRiwayat.rejected, (s, a) => {
        if (s.riwayat.requestId !== a.meta.requestId) return;
        s.riwayat.loading = false; s.riwayat.requestId = null;
        s.riwayat.error = a.payload?.message ?? 'Gagal memuat riwayat tarif';
      });
  },
});

export const { setSearch, setPenjaminFilter, setStatusFilter, setPage, setPerPage, setField, startEdit, resetForm, toggleRiwayat } = tarifObatSlice.actions;
export default tarifObatSlice.reducer;
