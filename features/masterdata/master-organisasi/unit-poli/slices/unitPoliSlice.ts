// Lokasi: src/features/masterdata/slices/unitPoliSlice.ts
// Daftarkan di store: reducer: { ..., unitPoli: unitPoliReducer }
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { RootState } from '@/store';
import type { ApiRejectValue } from '@/types/domain/sdmk';
import type {
  JenisUnit, StatusUnit, UnitPoliErrors, UnitPoliForm, UnitPoliItem, UnitPoliListResponse, UnitPoliOptions,
} from '@/types/domain/unitPoli';
import { initialUnitPoli, itemToForm, normalisasiKode, toPayload, validateUnitPoli } from '../utils/unitPoliHelpers';

// ---------------------------------------------------------------- State
export interface UnitPoliState {
  items: UnitPoliItem[];
  meta: UnitPoliListResponse['meta'];
  ringkasan: UnitPoliListResponse['ringkasan'];
  listLoading: boolean;
  listError: string | null;
  search: string;
  statusFilter: StatusUnit | '';
  jenisFilter: JenisUnit | '';
  page: number;
  perPage: number;

  options: UnitPoliOptions | null;

  form: UnitPoliForm;
  errors: UnitPoliErrors;
  editingId: number | null;
  saving: boolean;
  togglingId: number | null;
}

const initialState: UnitPoliState = {
  items: [], meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 0 }, ringkasan: { aktif: 0, total: 0 },
  listLoading: false, listError: null, search: '', statusFilter: '', jenisFilter: '', page: 1, perPage: 10,
  options: null,
  form: initialUnitPoli, errors: {}, editingId: null, saving: false, togglingId: null,
};

// ---------------------------------------------------------------- Helper
type ThunkCfg = { rejectValue: ApiRejectValue; state: RootState };
const sel = (getState: () => RootState): UnitPoliState => getState().unitPoli;

const toReject = (err: unknown, fallback: string): ApiRejectValue => {
  const error = err as {
    message?: string;
    response?: { data?: { message?: string; errors?: Record<string, string[]> } };
  };
  const body = error?.response?.data;
  const fieldErrors = body?.errors
    ? Object.fromEntries(Object.entries(body.errors).map(([k, v]) => [k, v[0]]))
    : undefined;
  return { message: body?.message || error?.message || fallback, fieldErrors };
};

// ---------------------------------------------------------------- Thunks
let listRequestId = 0;

export const fetchUnitPoli = createAsyncThunk<UnitPoliListResponse & { requestId: number }, void, ThunkCfg>(
  'unitPoli/fetchList',
  async (_, { getState, rejectWithValue }) => {
    const s = sel(getState);
    const requestId = ++listRequestId;
    try {
      const res = await api.get('/unit-poli', {
        params: {
          search: s.search || undefined, status: s.statusFilter || undefined, jenis: s.jenisFilter || undefined,
          page: s.page, perPage: s.perPage,
        },
      });
      return { ...res.data, requestId };
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal memuat Unit & Poli')); }
  },
);

export const fetchUnitPoliOptions = createAsyncThunk<UnitPoliOptions, void, ThunkCfg>(
  'unitPoli/fetchOptions',
  async (_, { rejectWithValue }) => {
    try { return (await api.get('/unit-poli/options')).data; }
    catch (err) { return rejectWithValue(toReject(err, 'Gagal memuat pilihan fasyankes')); }
  },
  { condition: (_, { getState }) => !sel(getState).options },
);

export const saveUnitPoli = createAsyncThunk<UnitPoliItem, void, ThunkCfg>(
  'unitPoli/save',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const s = sel(getState);
    const errors = validateUnitPoli(s.form);
    if (Object.keys(errors).length) {
      return rejectWithValue({ message: 'Data belum lengkap. Periksa kolom yang ditandai merah.', fieldErrors: errors as Record<string, string> });
    }
    try {
      const body = toPayload(s.form);
      const res = s.editingId ? await api.put(`/unit-poli/${s.editingId}`, body) : await api.post('/unit-poli', body);
      dispatch(fetchUnitPoli());
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal menyimpan Unit & Poli')); }
  },
);

export const toggleUnitPoliStatus = createAsyncThunk<UnitPoliItem, UnitPoliItem, ThunkCfg>(
  'unitPoli/toggleStatus',
  async (item, { dispatch, rejectWithValue }) => {
    try {
      const status: StatusUnit = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
      const res = await api.put(`/unit-poli/${item.id}/status`, { status });
      dispatch(fetchUnitPoli());
      return res.data;
    } catch (err) { return rejectWithValue(toReject(err, 'Gagal mengubah status')); }
  },
);

// ---------------------------------------------------------------- Slice
const unitPoliSlice = createSlice({
  name: 'unitPoli',
  initialState,
  reducers: {
    setField(s, a: PayloadAction<{ field: keyof UnitPoliForm; value: string | boolean }>) {
      const { field, value } = a.payload;
      (s.form as Record<string, unknown>)[field] = field === 'kode' ? normalisasiKode(String(value)) : value;
      delete s.errors[field];
    },
    startEdit(s, a: PayloadAction<UnitPoliItem>) {
      s.editingId = a.payload.id; s.form = itemToForm(a.payload); s.errors = {};
    },
    resetForm(s) { s.editingId = null; s.form = initialUnitPoli; s.errors = {}; },
    setSearch(s, a: PayloadAction<string>) { s.search = a.payload; s.page = 1; },
    setStatusFilter(s, a: PayloadAction<StatusUnit | ''>) { s.statusFilter = a.payload; s.page = 1; },
    setJenisFilter(s, a: PayloadAction<JenisUnit | ''>) { s.jenisFilter = a.payload; s.page = 1; },
    setPage(s, a: PayloadAction<number>) { s.page = a.payload; },
  },
  extraReducers: (b) => {
    b.addCase(fetchUnitPoli.pending, (s) => { s.listLoading = true; s.listError = null; })
      .addCase(fetchUnitPoli.fulfilled, (s, a) => {
        if (a.payload.requestId !== listRequestId) return; // respons basi
        s.listLoading = false; s.items = a.payload.data; s.meta = a.payload.meta; s.ringkasan = a.payload.ringkasan;
      })
      .addCase(fetchUnitPoli.rejected, (s, a) => { s.listLoading = false; s.listError = a.payload?.message ?? 'Gagal memuat Unit & Poli'; });

    b.addCase(fetchUnitPoliOptions.fulfilled, (s, a) => { s.options = a.payload; });

    b.addCase(saveUnitPoli.pending, (s) => { s.saving = true; })
      .addCase(saveUnitPoli.fulfilled, (s) => { s.saving = false; s.editingId = null; s.form = initialUnitPoli; s.errors = {}; })
      .addCase(saveUnitPoli.rejected, (s, a) => { s.saving = false; s.errors = (a.payload?.fieldErrors ?? {}) as UnitPoliErrors; });

    b.addCase(toggleUnitPoliStatus.pending, (s, a) => { s.togglingId = a.meta.arg.id; })
      .addCase(toggleUnitPoliStatus.fulfilled, (s) => { s.togglingId = null; })
      .addCase(toggleUnitPoliStatus.rejected, (s) => { s.togglingId = null; });
  },
});

export const { setField, startEdit, resetForm, setSearch, setStatusFilter, setJenisFilter, setPage } = unitPoliSlice.actions;
export default unitPoliSlice.reducer;
