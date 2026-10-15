// Lokasi: src/features/masterdata/slices/lokasiPelayananSlice.ts
// Daftarkan di store: reducer: { ..., lokasiPelayanan: lokasiPelayananReducer }
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import type { RootState } from "@/store";
import type { ApiRejectValue } from "@/types/domain/sdmk";
import type {
  LoketErrors,
  LoketForm,
  LoketItem,
  LoketListResponse,
  LoketOptions,
  StatusLoket,
  TipeLoket,
} from "@/types/domain/loketCounter";
import {
  initialLoket,
  itemToForm,
  normalisasiKode,
  toPayload,
  validateLoket,
} from "../utils/loketCounterHelpers";


// ---------------------------------------------------------------- State
export interface LoketState {
  items: LoketItem[];
  meta: LoketListResponse['meta'];
  ringkasan: LoketListResponse['ringkasan'];
  listLoading: boolean;
  listError: string | null;
  search: string;
  statusFilter: StatusLoket | '';
  tipeFilter: TipeLoket | '';
  page: number;
  perPage: number;

  options: LoketOptions | null;

  form: LoketForm;
  errors: LoketErrors;
  editingId: number | null;
  saving: boolean;
  togglingId: number | null;
}

const initialState: LoketState = {
  items: [],
  meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 0 },
  ringkasan: { aktif: 0, total: 0 },
  listLoading: false,
  listError: null,
  search: '',
  statusFilter: '',
  tipeFilter: '',
  page: 1,
  perPage: 10,
  options: null,
  form: initialLoket,
  errors: {},
  editingId: null,
  saving: false,
  togglingId: null,
};

// ---------------------------------------------------------------- Helper
type ThunkCfg = { rejectValue: ApiRejectValue; state: RootState };
const sel = (getState: () => RootState) => getState().loketCounter as LoketState;

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

// ---------------------------------------------------------------- Thunks
let listRequestId = 0;

export const fetchLoket = createAsyncThunk<LoketListResponse & { requestId: number }, void, ThunkCfg>(
  'loketCounter/fetchList',
  async (_, { getState, rejectWithValue }) => {
    const s = sel(getState);
    const requestId = ++listRequestId;
    try {
      const res = await api.get('/loket-counter', {
        params: {
          search: s.search || undefined, status: s.statusFilter || undefined, tipe: s.tipeFilter || undefined,
          page: s.page, perPage: s.perPage,
        },
      });
      return { ...res.data, requestId };
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal memuat Loket / Counter')); }
  },
);

/** Pilihan tipe loket. Dimuat sekali; { force: true } memuat ulang. */
export const fetchLoketOptions = createAsyncThunk<LoketOptions, { force?: boolean } | void, ThunkCfg>(
  'loketCounter/fetchOptions',
  async (_, { rejectWithValue }) => {
    try { return (await api.get('/loket-counter/options')).data; }
    catch (err) { return rejectWithValue(toReject(err, 'Gagal memuat pilihan loket')); }
  },
  { condition: (arg, { getState }) => !!(arg && arg.force) || !sel(getState).options },
);

export const saveLoket = createAsyncThunk<LoketItem, void, ThunkCfg>(
  'loketCounter/save',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const s = sel(getState);
    const errors = validateLoket(s.form);
    if (Object.keys(errors).length) {
      return rejectWithValue({ message: 'Data belum lengkap. Periksa kolom yang ditandai merah.', fieldErrors: errors as Record<string, string> });
    }
    try {
      const body = toPayload(s.form);
      console.log(body)
      const res = s.editingId ? await api.put(`/loket-counter/${s.editingId}`, body) : await api.post('/loket-counter', body);
      dispatch(fetchLoket());
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal menyimpan Loket / Counter')); }
  },
);

export const toggleLoketStatus = createAsyncThunk<LoketItem, LoketItem, ThunkCfg>(
  'loketCounter/toggleStatus',
  async (item, { dispatch, rejectWithValue }) => {
    try {
      const status: StatusLoket = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
      const res = await api.put(`/loket-counter/${item.id}/status`, { status });
      dispatch(fetchLoket());
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal mengubah status')); }
  },
);

// ---------------------------------------------------------------- Slice
const loketSlice = createSlice({
  name: 'loketCounter',
  initialState,
  reducers: {
    setField(s, a: PayloadAction<{ field: keyof LoketForm; value: string }>) {
      const { field, value } = a.payload;
      (s.form as Record<string, unknown>)[field] = field === 'code' ? normalisasiKode(value) : value;
      delete s.errors[field];
    },
    startEdit(s, a: PayloadAction<LoketItem>) { s.editingId = a.payload.id; s.form = itemToForm(a.payload); s.errors = {}; },
    resetForm(s) { s.editingId = null; s.form = initialLoket; s.errors = {}; },
    setSearch(s, a: PayloadAction<string>) { s.search = a.payload; s.page = 1; },
    setStatusFilter(s, a: PayloadAction<StatusLoket | ''>) { s.statusFilter = a.payload; s.page = 1; },
    setTipeFilter(s, a: PayloadAction<TipeLoket | ''>) { s.tipeFilter = a.payload; s.page = 1; },
    setPage(s, a: PayloadAction<number>) { s.page = a.payload; },
  },
  extraReducers: (b) => {
    b.addCase(fetchLoket.pending, (s) => { s.listLoading = true; s.listError = null; })
      .addCase(fetchLoket.fulfilled, (s, a) => {
        if (a.payload.requestId !== listRequestId) return; // respons basi
        s.listLoading = false; s.items = a.payload.data; s.meta = a.payload.meta; s.ringkasan = a.payload.ringkasan;
      })
      .addCase(fetchLoket.rejected, (s, a) => { s.listLoading = false; s.listError = a.payload?.message ?? 'Gagal memuat Loket / Counter'; });

    b.addCase(fetchLoketOptions.fulfilled, (s, a) => { s.options = a.payload; });

    b.addCase(saveLoket.pending, (s) => { s.saving = true; })
      .addCase(saveLoket.fulfilled, (s) => { s.saving = false; s.editingId = null; s.form = initialLoket; s.errors = {}; })
      .addCase(saveLoket.rejected, (s, a) => { s.saving = false; s.errors = (a.payload?.fieldErrors ?? {}) as LoketErrors; });

    b.addCase(toggleLoketStatus.pending, (s, a) => { s.togglingId = a.meta.arg.id; })
      .addCase(toggleLoketStatus.fulfilled, (s) => { s.togglingId = null; })
      .addCase(toggleLoketStatus.rejected, (s) => { s.togglingId = null; });
  },
});

export const { setField, startEdit, resetForm, setSearch, setStatusFilter, setTipeFilter, setPage } = loketSlice.actions;
export default loketSlice.reducer;