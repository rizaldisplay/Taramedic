// Lokasi: src/features/masterdata/slices/lokasiPelayananSlice.ts
// Daftarkan di store: reducer: { ..., lokasiPelayanan: lokasiPelayananReducer }
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { RootState } from '@/store';
import type { ApiRejectValue } from '@/types/domain/sdmk';
import type {
  LokasiErrors, LokasiForm, LokasiItem, LokasiListResponse, LokasiOptions, StatusLokasi, TipeLokasi,
} from '@/types/domain/lokasiPelayanan';
import { initialLokasi, itemToForm, normalisasiKode, toPayload, validateLokasi } from '../utils/lokasiPelayananHelpers';

// ---------------------------------------------------------------- State
export interface LokasiState {
  items: LokasiItem[];
  meta: LokasiListResponse['meta'];
  ringkasan: LokasiListResponse['ringkasan'];
  listLoading: boolean;
  listError: string | null;
  search: string;
  statusFilter: StatusLokasi | '';
  tipeFilter: TipeLokasi | '';
  page: number;
  perPage: number;

  options: LokasiOptions | null;

  form: LokasiForm;
  errors: LokasiErrors;
  editingId: number | null;
  saving: boolean;
  togglingId: number | null;
}

const initialState: LokasiState = {
  items: [], meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 0 }, ringkasan: { aktif: 0, total: 0 },
  listLoading: false, listError: null, search: '', statusFilter: '', tipeFilter: '', page: 1, perPage: 10,
  options: null,
  form: initialLokasi, errors: {}, editingId: null, saving: false, togglingId: null,
};

// ---------------------------------------------------------------- Helper
type ThunkCfg = { rejectValue: ApiRejectValue; state: RootState };
const sel = (getState: () => RootState) => getState().lokasiPelayanan as LokasiState;

const toReject = (err: unknown, fallback: string): ApiRejectValue => {
  const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } }; message?: string } | null;
  const body = error?.response?.data;
  const fieldErrors = body?.errors
    ? Object.fromEntries(Object.entries(body.errors as Record<string, string[]>).map(([k, v]) => [k, v[0]]))
    : undefined;
  return { message: body?.message || error?.message || fallback, fieldErrors };
};

// ---------------------------------------------------------------- Thunks
let listRequestId = 0;

export const fetchLokasi = createAsyncThunk<LokasiListResponse & { requestId: number }, void, ThunkCfg>(
  'lokasiPelayanan/fetchList',
  async (_, { getState, rejectWithValue }) => {
    const s = sel(getState);
    const requestId = ++listRequestId;
    try {
      const res = await api.get('/lokasi-pelayanan', {
        params: {
          search: s.search || undefined, status: s.statusFilter || undefined, tipe: s.tipeFilter || undefined,
          page: s.page, perPage: s.perPage,
        },
      });
      return { ...res.data, requestId };
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal memuat Lokasi Pelayanan')); }
  },
);

/** Pilihan induk & fasyankes. Dimuat sekali; { force: true } memuat ulang (setelah ada lokasi baru/berubah). */
export const fetchLokasiOptions = createAsyncThunk<LokasiOptions, { force?: boolean } | void, ThunkCfg>(
  'lokasiPelayanan/fetchOptions',
  async (_, { rejectWithValue }) => {
    try { return (await api.get('/lokasi-pelayanan/options')).data; }
    catch (err) { return rejectWithValue(toReject(err, 'Gagal memuat pilihan lokasi')); }
  },
  { condition: (arg, { getState }) => !!(arg && arg.force) || !sel(getState).options },
);

export const saveLokasi = createAsyncThunk<LokasiItem, void, ThunkCfg>(
  'lokasiPelayanan/save',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const s = sel(getState);
    const errors = validateLokasi(s.form, s.editingId, s.options);
    if (Object.keys(errors).length) {
      return rejectWithValue({ message: 'Data belum lengkap. Periksa kolom yang ditandai merah.', fieldErrors: errors as Record<string, string> });
    }
    try {
      const body = toPayload(s.form);
      const res = s.editingId ? await api.put(`/lokasi-pelayanan/${s.editingId}`, body) : await api.post('/lokasi-pelayanan', body);
      dispatch(fetchLokasi());
      dispatch(fetchLokasiOptions({ force: true }));
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal menyimpan Lokasi Pelayanan')); }
  },
);

export const toggleLokasiStatus = createAsyncThunk<LokasiItem, LokasiItem, ThunkCfg>(
  'lokasiPelayanan/toggleStatus',
  async (item, { dispatch, rejectWithValue }) => {
    try {
      const status: StatusLokasi = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
      const res = await api.put(`/lokasi-pelayanan/${item.id}/status`, { status });
      dispatch(fetchLokasi());
      dispatch(fetchLokasiOptions({ force: true }));
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal mengubah status')); }
  },
);

// ---------------------------------------------------------------- Slice
const lokasiSlice = createSlice({
  name: 'lokasiPelayanan',
  initialState,
  reducers: {
    setField(s, a: PayloadAction<{ field: keyof LokasiForm; value: string }>) {
      const { field, value } = a.payload;
      (s.form as Record<string, unknown>)[field] = field === 'kode' ? normalisasiKode(value) : value;
      delete s.errors[field];
    },
    startEdit(s, a: PayloadAction<LokasiItem>) { s.editingId = a.payload.id; s.form = itemToForm(a.payload); s.errors = {}; },
    resetForm(s) { s.editingId = null; s.form = initialLokasi; s.errors = {}; },
    setSearch(s, a: PayloadAction<string>) { s.search = a.payload; s.page = 1; },
    setStatusFilter(s, a: PayloadAction<StatusLokasi | ''>) { s.statusFilter = a.payload; s.page = 1; },
    setTipeFilter(s, a: PayloadAction<TipeLokasi | ''>) { s.tipeFilter = a.payload; s.page = 1; },
    setPage(s, a: PayloadAction<number>) { s.page = a.payload; },
  },
  extraReducers: (b) => {
    b.addCase(fetchLokasi.pending, (s) => { s.listLoading = true; s.listError = null; })
      .addCase(fetchLokasi.fulfilled, (s, a) => {
        if (a.payload.requestId !== listRequestId) return; // respons basi
        s.listLoading = false; s.items = a.payload.data; s.meta = a.payload.meta; s.ringkasan = a.payload.ringkasan;
      })
      .addCase(fetchLokasi.rejected, (s, a) => { s.listLoading = false; s.listError = a.payload?.message ?? 'Gagal memuat Lokasi Pelayanan'; });

    b.addCase(fetchLokasiOptions.fulfilled, (s, a) => { s.options = a.payload; });

    b.addCase(saveLokasi.pending, (s) => { s.saving = true; })
      .addCase(saveLokasi.fulfilled, (s) => { s.saving = false; s.editingId = null; s.form = initialLokasi; s.errors = {}; })
      .addCase(saveLokasi.rejected, (s, a) => { s.saving = false; s.errors = (a.payload?.fieldErrors ?? {}) as LokasiErrors; });

    b.addCase(toggleLokasiStatus.pending, (s, a) => { s.togglingId = a.meta.arg.id; })
      .addCase(toggleLokasiStatus.fulfilled, (s) => { s.togglingId = null; })
      .addCase(toggleLokasiStatus.rejected, (s) => { s.togglingId = null; });
  },
});

export const { setField, startEdit, resetForm, setSearch, setStatusFilter, setTipeFilter, setPage } = lokasiSlice.actions;
export default lokasiSlice.reducer;
