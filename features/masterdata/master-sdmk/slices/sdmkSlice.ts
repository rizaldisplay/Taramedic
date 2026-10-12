/* eslint-disable @typescript-eslint/no-explicit-any */
// Lokasi: src/features/masterdata/slices/sdmkSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import type { RootState } from "@/store";
import type { Wilayah, WilayahLevel } from "@/types/domain/pendaftaran";
import type {
  ApiRejectValue,
  FormErrors,
  IdentitasForm,
  IntegrasiForm,
  JadwalHariForm,
  JadwalSettingForm,
  KompetensiForm,
  Paginated,
  PenempatanForm,
  ProfesiForm,
  SdmkDetail,
  SdmkHistoryItem,
  SdmkListItem,
  SdmkOptions,
  SdmkStats,
  SdmkTabKey,
  SipForm,
  SlotForm,
  StatusSdmk,
  StrForm,
} from "@/types/domain/sdmk";
import {
  WILAYAH_CHILD,
  WILAYAH_ENDPOINT,
  WILAYAH_FIELD,
} from "@/features/pendaftaran/utils/pendaftaranHelpers";
import {
  fromServer,
  flattenErrors,
  initialIdentitas,
  initialIntegrasi,
  initialJadwalHari,
  initialJadwalSetting,
  initialKompetensi,
  initialPenempatan,
  initialProfesi,
  initialSip,
  initialSlot,
  initialStr,
  toPayload,
  validateIdentitas,
  validateJadwalHari,
  validateJadwalSetting,
  validateKompetensi,
  validatePenempatan,
  validateProfesi,
  validateSip,
  validateSlot,
  validateStr,
  validasiFile,
  FILE_MIME_DOKUMEN,
  FILE_MIME_FOTO,
} from "../utils/sdmkHelpers";

// ----------------------------------------------------------------------
// 1. State
// ----------------------------------------------------------------------
export type WilayahTarget = "identitas" | "sip";
type WilayahMap = Record<WilayahLevel, Wilayah[]>;
const emptyWilayah = (): WilayahMap => ({
  provinsi: [],
  kabupaten: [],
  kecamatan: [],
  desa: [],
});

export type NikSdmkStatus =
  | "idle"
  | "checking"
  | "available"
  | "exists"
  | "error";

export interface SdmkState {
  // Dashboard
  stats: SdmkStats | null;
  statsLoading: boolean;
  items: SdmkListItem[];
  meta: Paginated<SdmkListItem>["meta"];
  listLoading: boolean;
  listError: string | null;
  search: string;
  statusFilter: StatusSdmk | "";
  page: number;
  perPage: number;

  // Panel detail
  selectedId: number | null;
  detail: SdmkDetail | null;
  detailLoading: boolean;
  detailError: string | null;

  options: SdmkOptions | null;
  optionsError: string | null;

  // Wizard
  wizard: {
    open: boolean;
    sdmkId: number | null;
    activeTab: SdmkTabKey;
    loading: boolean;
  };
  /** Kunci aksi yang sedang berjalan, mis. 'identitas', 'sip', 'verifyStr'. Null = idle */
  saving: string | null;

  identitas: IdentitasForm;
  identitasErrors: FormErrors<IdentitasForm>;
  fotoUrl: string | null;
  nikStatus: NikSdmkStatus;
  nikMessage: string | null;

  profesi: ProfesiForm;
  profesiErrors: FormErrors<ProfesiForm>;
  kodeProfesi: string;
  kompetensiForm: KompetensiForm;
  kompetensiErrors: FormErrors<KompetensiForm>;

  str: StrForm;
  strErrors: FormErrors<StrForm>;
  sertifikatLain: string;
  sipModal: { open: boolean; editingId: number | null };
  sipForm: SipForm;
  sipErrors: FormErrors<SipForm> & { file?: string };

  penempatanForm: PenempatanForm;
  penempatanErrors: FormErrors<PenempatanForm>;
  penempatanEditingId: number | null;

  jadwalSetting: JadwalSettingForm;
  jadwalSettingErrors: FormErrors<JadwalSettingForm>;
  jadwalHari: JadwalHariForm[];
  jadwalHariErrors: Record<string, string>;
  slotModal: { open: boolean; editingId: number | null };
  slotForm: SlotForm;
  slotErrors: FormErrors<SlotForm>;

  integrasi: IntegrasiForm;
  catatan: string;

  wilayah: Record<WilayahTarget, WilayahMap>;

  historyOpen: "history" | "audit" | null;
  historyItems: SdmkHistoryItem[];
  historyLoading: boolean;
}

const initialState: SdmkState = {
  stats: null,
  statsLoading: false,
  items: [],
  meta: { currentPage: 1, lastPage: 1, perPage: 10, total: 0 },
  listLoading: false,
  listError: null,
  search: "",
  statusFilter: "",
  page: 1,
  perPage: 10,
  selectedId: null,
  detail: null,
  detailLoading: false,
  detailError: null,
  options: null,
  optionsError: null,
  wizard: { open: false, sdmkId: null, activeTab: "identitas", loading: false },
  saving: null,
  identitas: initialIdentitas,
  identitasErrors: {},
  fotoUrl: null,
  nikStatus: "idle",
  nikMessage: null,
  profesi: initialProfesi,
  profesiErrors: {},
  kodeProfesi: "",
  kompetensiForm: initialKompetensi,
  kompetensiErrors: {},
  str: initialStr,
  strErrors: {},
  sertifikatLain: "",
  sipModal: { open: false, editingId: null },
  sipForm: initialSip,
  sipErrors: {},
  penempatanForm: initialPenempatan,
  penempatanErrors: {},
  penempatanEditingId: null,
  jadwalSetting: initialJadwalSetting,
  jadwalSettingErrors: {},
  jadwalHari: initialJadwalHari(),
  jadwalHariErrors: {},
  slotModal: { open: false, editingId: null },
  slotForm: initialSlot,
  slotErrors: {},
  integrasi: initialIntegrasi,
  catatan: "",
  wilayah: { identitas: emptyWilayah(), sip: emptyWilayah() },
  historyOpen: null,
  historyItems: [],
  historyLoading: false,
};

// ----------------------------------------------------------------------
// 2. Helper thunk
// ----------------------------------------------------------------------
type ThunkCfg = { rejectValue: ApiRejectValue; state: RootState };

const toReject = (err: any, fallback: string): ApiRejectValue => {
  const body = err?.response?.data;
  return {
    message: body?.message || err?.message || fallback,
    fieldErrors: body?.errors
      ? (flattenErrors(body.errors) as Record<string, string>)
      : undefined,
  };
};

const localReject = (errors: Record<string, unknown>): ApiRejectValue => ({
  message: "Data belum lengkap. Periksa kolom yang ditandai merah.",
  fieldErrors: errors as Record<string, string>,
});

const hasErrors = (e: object) => Object.keys(e).length > 0;

/** Hanya untuk field bertipe string/boolean. File dikirim terpisah. */
const toFormData = (
  payload: Record<string, unknown>,
  file?: { name: string; file: File } | null,
  method?: "PUT",
) => {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    fd.append(k, typeof v === "boolean" ? (v ? "1" : "0") : String(v));
  });
  if (file) fd.append(file.name, file.file);
  if (method) fd.append("_method", method);
  return fd;
};

const sdmk = (getState: () => RootState) =>
  (getState() as any).sdmk as SdmkState;

// ----------------------------------------------------------------------
// 3. Thunks — dashboard & detail
// ----------------------------------------------------------------------
export const fetchStats = createAsyncThunk<SdmkStats, void, ThunkCfg>(
  "sdmk/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return (await api.get("/sdmk/stats")).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal memuat statistik SDMK"));
    }
  },
);

let listRequestId = 0;
export const fetchSdmkList = createAsyncThunk<
  Paginated<SdmkListItem> & { requestId: number },
  void,
  ThunkCfg
>(
  "sdmk/fetchList",
  async (_, { getState, rejectWithValue }) => {
    const s = sdmk(getState);
    const requestId = ++listRequestId;
    try {
      const res = await api.get("/sdmk", {
        params: {
          search: s.search || undefined,
          status: s.statusFilter || undefined,
          page: s.page,
          perPage: s.perPage,
        },
      });
      return { ...res.data, requestId };
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal memuat daftar SDMK"));
    }
  },
  { condition: () => true },
);

export const fetchSdmkDetail = createAsyncThunk<SdmkDetail, number, ThunkCfg>(
  "sdmk/fetchDetail",
  async (id, { rejectWithValue }) => {
    try {
      return (await api.get(`/sdmk/${id}`)).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal memuat detail SDMK"));
    }
  },
);

export const fetchOptions = createAsyncThunk<SdmkOptions, void, ThunkCfg>(
  "sdmk/fetchOptions",
  async (_, { rejectWithValue }) => {
    try {
      return (await api.get("/sdmk/options")).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal memuat pilihan data"));
    }
  },
  { condition: (_, { getState }) => !sdmk(getState).options },
);

export const fetchWilayahSdmk = createAsyncThunk<
  { target: WilayahTarget; level: WilayahLevel; items: Wilayah[] },
  { target: WilayahTarget; level: WilayahLevel; parentKode?: string },
  ThunkCfg
>(
  "sdmk/fetchWilayah",
  async ({ target, level, parentKode }, { rejectWithValue }) => {
    try {
      const res = await api.get(WILAYAH_ENDPOINT[level](parentKode));
      return { target, level, items: res.data?.data ?? res.data ?? [] };
    } catch (err) {
      return rejectWithValue(toReject(err, `Gagal memuat data ${level}`));
    }
  },
);

export const cekNikSdmk = createAsyncThunk<
  { terdaftar: boolean; nama?: string },
  { nik: string; exceptId?: number },
  ThunkCfg
>("sdmk/cekNik", async ({ nik, exceptId }, { rejectWithValue }) => {
  try {
    return (
      await api.get(`/sdmk/check-nik/${nik}`, {
        params: exceptId ? { exceptId } : undefined,
      })
    ).data;
  } catch (err) {
    return rejectWithValue(toReject(err, "Gagal memeriksa NIK"));
  }
});

// ----------------------------------------------------------------------
// 4. Thunks — simpan per tab (semua mengembalikan SdmkDetail terbaru)
// ----------------------------------------------------------------------
export const saveIdentitas = createAsyncThunk<SdmkDetail, void, ThunkCfg>(
  "sdmk/saveIdentitas",
  async (_, { getState, rejectWithValue }) => {
    const s = sdmk(getState);
    const errors = validateIdentitas(s.identitas);
    if (s.nikStatus === "exists")
      errors.nik = "NIK sudah terdaftar sebagai SDMK";
    if (hasErrors(errors)) return rejectWithValue(localReject(errors));
    try {
      const body = toPayload(s.identitas);
      const res = s.wizard.sdmkId
        ? await api.put(`/sdmk/${s.wizard.sdmkId}/identitas`, body)
        : await api.post("/sdmk", body);
      return res.data;
    } catch (err: any) {
      console.error("=== ERROR BACKEND SDMK ===");
      console.error("Status:", err.response?.status);
      console.error("Response data:", err.response?.data);
      console.error("Message:", err.message);
      console.error("Request URL:", err.config?.url);
      console.error("Request method:", err.config?.method);

      return rejectWithValue(toReject(err, "Gagal menyimpan identitas"));
    }
  },
);

export const uploadFoto = createAsyncThunk<SdmkDetail, File, ThunkCfg>(
  "sdmk/uploadFoto",
  async (file, { getState, rejectWithValue }) => {
    const id = sdmk(getState).wizard.sdmkId;
    if (!id)
      return rejectWithValue({
        message: "Simpan identitas terlebih dahulu sebelum mengunggah foto",
      });
    const bad = validasiFile(file, FILE_MIME_FOTO);
    if (bad) return rejectWithValue({ message: bad });
    try {
      console.log(file);

      // 1. Gunakan FormData native bawaan browser
      const formData = new FormData();
      formData.append("foto", file);

      // 2. Kirim dengan explicit header
      const response = await api.post(`/sdmk/${id}/foto`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (err: any) {
      console.error("=== ERROR BACKEND SDMK ===");
      console.error("Status:", err.response?.status);
      console.error("Response data:", err.response?.data);
      console.error("Message:", err.message);
      console.error("Request URL:", err.config?.url);
      console.error("Request method:", err.config?.method);

      return rejectWithValue(toReject(err, "Gagal mengunggah foto"));
    }
  },
);

export const saveProfesi = createAsyncThunk<SdmkDetail, void, ThunkCfg>(
  "sdmk/saveProfesi",
  async (_, { getState, rejectWithValue }) => {
    const s = sdmk(getState);
    if (!s.wizard.sdmkId)
      return rejectWithValue({ message: "Simpan identitas terlebih dahulu" });
    const errors = validateProfesi(s.profesi);
    if (hasErrors(errors)) return rejectWithValue(localReject(errors));
    try {
      return (
        await api.put(`/sdmk/${s.wizard.sdmkId}/profesi`, toPayload(s.profesi))
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menyimpan profesi"));
    }
  },
);

export const addKompetensi = createAsyncThunk<
  SdmkDetail,
  File | null | undefined,
  ThunkCfg
>("sdmk/addKompetensi", async (file, { getState, rejectWithValue }) => {
  const s = sdmk(getState);
  if (!s.wizard.sdmkId)
    return rejectWithValue({ message: "Simpan identitas terlebih dahulu" });
  const errors = validateKompetensi(s.kompetensiForm);
  if (hasErrors(errors)) return rejectWithValue(localReject(errors));
  if (file) {
    const bad = validasiFile(file, FILE_MIME_DOKUMEN);
    if (bad) return rejectWithValue({ message: bad });
  }
  try {
    return (
      await api.post(
        `/sdmk/${s.wizard.sdmkId}/kompetensi`,
        toFormData(
          toPayload(s.kompetensiForm),
          file ? { name: "dokumen", file } : null,
        ),
      )
    ).data;
  } catch (err) {
    return rejectWithValue(toReject(err, "Gagal menambah kompetensi"));
  }
});

export const deleteKompetensi = createAsyncThunk<SdmkDetail, number, ThunkCfg>(
  "sdmk/deleteKompetensi",
  async (kid, { getState, rejectWithValue }) => {
    try {
      return (
        await api.delete(
          `/sdmk/${sdmk(getState).wizard.sdmkId}/kompetensi/${kid}`,
        )
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menghapus kompetensi"));
    }
  },
);

export const saveStr = createAsyncThunk<SdmkDetail, void, ThunkCfg>(
  "sdmk/saveStr",
  async (_, { getState, rejectWithValue }) => {
    const s = sdmk(getState);
    if (!s.wizard.sdmkId)
      return rejectWithValue({ message: "Simpan identitas terlebih dahulu" });
    const errors = validateStr(s.str);
    if (hasErrors(errors)) return rejectWithValue(localReject(errors));
    try {
      return (
        await api.put(`/sdmk/${s.wizard.sdmkId}/str`, {
          ...toPayload(s.str),
          sertifikatLain: s.sertifikatLain || null,
        })
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menyimpan STR"));
    }
  },
);

export const verifyStr = createAsyncThunk<SdmkDetail, void, ThunkCfg>(
  "sdmk/verifyStr",
  async (_, { getState, rejectWithValue }) => {
    try {
      return (
        await api.post(`/sdmk/${sdmk(getState).wizard.sdmkId}/str/verify`)
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal memverifikasi STR"));
    }
  },
);

export const saveSip = createAsyncThunk<
  SdmkDetail,
  { file?: File | null },
  ThunkCfg
>("sdmk/saveSip", async ({ file }, { getState, rejectWithValue }) => {
  const s = sdmk(getState);
  if (!s.wizard.sdmkId)
    return rejectWithValue({ message: "Simpan identitas terlebih dahulu" });
  const editingId = s.sipModal.editingId;
  const adaFile =
    !!file ||
    (editingId !== null &&
      !!s.detail?.sip.find((x) => x.id === editingId)?.dokumenUrl);
  const errors = validateSip(s.sipForm, adaFile);
  if (file) {
    const bad = validasiFile(file, FILE_MIME_DOKUMEN);
    if (bad) errors.file = bad;
  }
  if (hasErrors(errors)) return rejectWithValue(localReject(errors));
  try {
    const payload = toPayload(s.sipForm);
    const fileArg = file ? { name: "dokumen", file } : null;
    const base = `/sdmk/${s.wizard.sdmkId}/sip`;
    return (
      editingId
        ? await api.post(
            `${base}/${editingId}`,
            toFormData(payload, fileArg, "PUT"),
          )
        : await api.post(base, toFormData(payload, fileArg))
    ).data;
  } catch (err) {
    return rejectWithValue(toReject(err, "Gagal menyimpan SIP"));
  }
});

export const deleteSip = createAsyncThunk<SdmkDetail, number, ThunkCfg>(
  "sdmk/deleteSip",
  async (sid, { getState, rejectWithValue }) => {
    try {
      return (
        await api.delete(`/sdmk/${sdmk(getState).wizard.sdmkId}/sip/${sid}`)
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menghapus SIP"));
    }
  },
);

export const savePenempatan = createAsyncThunk<SdmkDetail, void, ThunkCfg>(
  "sdmk/savePenempatan",
  async (_, { getState, rejectWithValue }) => {
    const s = sdmk(getState);
    if (!s.wizard.sdmkId)
      return rejectWithValue({ message: "Simpan identitas terlebih dahulu" });
    const errors = validatePenempatan(s.penempatanForm);
    if (hasErrors(errors)) return rejectWithValue(localReject(errors));
    try {
      const base = `/sdmk/${s.wizard.sdmkId}/penempatan`;
      const body = toPayload(s.penempatanForm);
      return (
        s.penempatanEditingId
          ? await api.put(`${base}/${s.penempatanEditingId}`, body)
          : await api.post(base, body)
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menyimpan penempatan"));
    }
  },
);

export const deletePenempatan = createAsyncThunk<SdmkDetail, number, ThunkCfg>(
  "sdmk/deletePenempatan",
  async (pid, { getState, rejectWithValue }) => {
    try {
      return (
        await api.delete(
          `/sdmk/${sdmk(getState).wizard.sdmkId}/penempatan/${pid}`,
        )
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menghapus penempatan"));
    }
  },
);

export const saveJadwal = createAsyncThunk<SdmkDetail, void, ThunkCfg>(
  "sdmk/saveJadwal",
  async (_, { getState, rejectWithValue }) => {
    const s = sdmk(getState);
    if (!s.wizard.sdmkId)
      return rejectWithValue({ message: "Simpan identitas terlebih dahulu" });
    const e1 = validateJadwalSetting(s.jadwalSetting);
    const e2 = validateJadwalHari(s.jadwalHari);
    if (hasErrors(e1) || hasErrors(e2))
      return rejectWithValue({
        message: "Jadwal belum lengkap. Periksa kolom yang ditandai merah.",
        fieldErrors: {
          ...e1,
          ...Object.fromEntries(
            Object.entries(e2).map(([k, v]) => [`hari.${k}`, v]),
          ),
        } as Record<string, string>,
      });
    try {
      return (
        await api.put(`/sdmk/${s.wizard.sdmkId}/jadwal`, {
          setting: toPayload(s.jadwalSetting),
          hari: s.jadwalHari.map(toPayload),
        })
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menyimpan jadwal"));
    }
  },
);

export const saveSlot = createAsyncThunk<SdmkDetail, void, ThunkCfg>(
  "sdmk/saveSlot",
  async (_, { getState, rejectWithValue }) => {
    const s = sdmk(getState);
    if (!s.wizard.sdmkId)
      return rejectWithValue({ message: "Simpan identitas terlebih dahulu" });
    const errors = validateSlot(s.slotForm);
    if (hasErrors(errors)) return rejectWithValue(localReject(errors));
    try {
      const base = `/sdmk/${s.wizard.sdmkId}/slots`;
      const body = toPayload(s.slotForm);
      return (
        s.slotModal.editingId
          ? await api.put(`${base}/${s.slotModal.editingId}`, body)
          : await api.post(base, body)
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menyimpan slot waktu"));
    }
  },
);

export const deleteSlot = createAsyncThunk<SdmkDetail, number, ThunkCfg>(
  "sdmk/deleteSlot",
  async (sid, { getState, rejectWithValue }) => {
    try {
      return (
        await api.delete(`/sdmk/${sdmk(getState).wizard.sdmkId}/slots/${sid}`)
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menghapus slot"));
    }
  },
);

export const saveIntegrasi = createAsyncThunk<SdmkDetail, void, ThunkCfg>(
  "sdmk/saveIntegrasi",
  async (_, { getState, rejectWithValue }) => {
    const s = sdmk(getState);
    if (!s.wizard.sdmkId)
      return rejectWithValue({ message: "Simpan identitas terlebih dahulu" });
    try {
      return (
        await api.put(
          `/sdmk/${s.wizard.sdmkId}/integrasi`,
          toPayload(s.integrasi),
        )
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menyimpan integrasi"));
    }
  },
);

export const verifyIhs = createAsyncThunk<SdmkDetail, void, ThunkCfg>(
  "sdmk/verifyIhs",
  async (_, { getState, rejectWithValue }) => {
    try {
      return (
        await api.post(`/sdmk/${sdmk(getState).wizard.sdmkId}/integrasi/verify`)
      ).data;
    } catch (err) {
      return rejectWithValue(
        toReject(err, "Gagal memverifikasi IHS ke SATUSEHAT"),
      );
    }
  },
);

export const saveCatatan = createAsyncThunk<SdmkDetail, void, ThunkCfg>(
  "sdmk/saveCatatan",
  async (_, { getState, rejectWithValue }) => {
    const s = sdmk(getState);
    if (!s.wizard.sdmkId)
      return rejectWithValue({ message: "Simpan identitas terlebih dahulu" });
    if (s.catatan.length > 2000)
      return rejectWithValue({ message: "Catatan maksimal 2000 karakter" });
    try {
      return (
        await api.put(`/sdmk/${s.wizard.sdmkId}/catatan`, {
          catatan: s.catatan || null,
        })
      ).data;
    } catch (err) {
      return rejectWithValue(toReject(err, "Gagal menyimpan catatan"));
    }
  },
);

export const fetchHistory = createAsyncThunk<
  SdmkHistoryItem[],
  "history" | "audit",
  ThunkCfg
>("sdmk/fetchHistory", async (kind, { getState, rejectWithValue }) => {
  const id = sdmk(getState).selectedId;
  try {
    return (
      (await api.get(id ? `/sdmk/${id}/${kind}` : `/sdmk/${kind}`)).data
        ?.data ?? []
    );
  } catch (err) {
    return rejectWithValue(toReject(err, "Gagal memuat riwayat"));
  }
});

// ----------------------------------------------------------------------
// 5. Helper reducer
// ----------------------------------------------------------------------
type RegionHolder = {
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  desaKelurahan: string;
};
const regionHolder = (s: SdmkState, t: WilayahTarget): RegionHolder =>
  t === "identitas" ? s.identitas : s.sipForm;
const regionErrors = (
  s: SdmkState,
  t: WilayahTarget,
): Record<string, string | undefined> =>
  (t === "identitas" ? s.identitasErrors : s.sipErrors) as any;

const clearWilayahFrom = (
  s: SdmkState,
  t: WilayahTarget,
  start: WilayahLevel,
) => {
  let level: WilayahLevel | null = start;
  while (level) {
    const field = WILAYAH_FIELD[level];
    regionHolder(s, t)[field] = "";
    s.wilayah[t][level] = [];
    delete regionErrors(s, t)[field];
    level = WILAYAH_CHILD[level];
  }
};

const setRegionField = (
  s: SdmkState,
  t: WilayahTarget,
  field: keyof RegionHolder,
  value: string,
) => {
  regionHolder(s, t)[field] = value;
  delete regionErrors(s, t)[field];
  if (field === "provinsi") clearWilayahFrom(s, t, "kabupaten");
  if (field === "kabupatenKota") clearWilayahFrom(s, t, "kecamatan");
  if (field === "kecamatan") clearWilayahFrom(s, t, "desa");
};
const isRegionField = (f: string): f is keyof RegionHolder =>
  ["provinsi", "kabupatenKota", "kecamatan", "desaKelurahan"].includes(f);

const pick = <T extends object>(src: any, base: T): T => {
  const out: any = {};
  (Object.keys(base) as (keyof T)[]).forEach((k) => {
    out[k] = src?.[k] ?? base[k];
  });
  return out;
};

/** Sinkronkan seluruh form dengan data server (setelah fetch/simpan). */
const hydrate = (s: SdmkState, d: SdmkDetail) => {
  s.identitas = pick(fromServer(d.identitas), initialIdentitas);
  s.fotoUrl = d.identitas.fotoUrl ?? null;
  s.profesi = pick(fromServer(d.profesi), initialProfesi);
  s.kodeProfesi = d.profesi.kodeProfesi ?? "";
  s.str = d.str ? pick(fromServer(d.str), initialStr) : initialStr;
  s.sertifikatLain = d.sertifikatLain ?? "";
  s.jadwalSetting = d.jadwalSetting
    ? pick(fromServer(d.jadwalSetting), initialJadwalSetting)
    : initialJadwalSetting;
  s.jadwalHari = d.jadwalHari.length
    ? d.jadwalHari.map((h) => fromServer(h))
    : initialJadwalHari();
  s.integrasi = pick(fromServer(d.integrasi), initialIntegrasi);
  s.catatan = d.catatan ?? "";
};

const afterMutation = (s: SdmkState, d: SdmkDetail) => {
  s.saving = null;
  s.detail = d;
  s.wizard.sdmkId = d.id;
  if (s.selectedId === d.id || s.selectedId === null) s.selectedId = d.id;
  hydrate(s, d);
};

const resetWizardForms = (s: SdmkState) => {
  Object.assign(s, {
    identitas: initialIdentitas,
    identitasErrors: {},
    fotoUrl: null,
    nikStatus: "idle",
    nikMessage: null,
    profesi: initialProfesi,
    profesiErrors: {},
    kodeProfesi: "",
    kompetensiForm: initialKompetensi,
    kompetensiErrors: {},
    str: initialStr,
    strErrors: {},
    sertifikatLain: "",
    sipModal: { open: false, editingId: null },
    sipForm: initialSip,
    sipErrors: {},
    penempatanForm: initialPenempatan,
    penempatanErrors: {},
    penempatanEditingId: null,
    jadwalSetting: initialJadwalSetting,
    jadwalSettingErrors: {},
    jadwalHari: initialJadwalHari(),
    jadwalHariErrors: {},
    slotModal: { open: false, editingId: null },
    slotForm: initialSlot,
    slotErrors: {},
    integrasi: initialIntegrasi,
    catatan: "",
    saving: null,
  } as Partial<SdmkState>);
  s.wilayah = { identitas: emptyWilayah(), sip: emptyWilayah() };
};

// ----------------------------------------------------------------------
// 6. Slice
// ----------------------------------------------------------------------
const sdmkSlice = createSlice({
  name: "sdmk",
  initialState,
  reducers: {
    // --- dashboard
    setSearch: (s, a: PayloadAction<string>) => {
      s.search = a.payload;
      s.page = 1;
    },
    setStatusFilter: (s, a: PayloadAction<StatusSdmk | "">) => {
      s.statusFilter = a.payload;
      s.page = 1;
    },
    setPage: (s, a: PayloadAction<number>) => {
      s.page = a.payload;
    },
    setPerPage: (s, a: PayloadAction<number>) => {
      s.perPage = a.payload;
      s.page = 1;
    },
    selectSdmk: (s, a: PayloadAction<number | null>) => {
      s.selectedId = a.payload;
      if (a.payload === null) s.detail = null;
    },
    openHistory: (s, a: PayloadAction<"history" | "audit">) => {
      s.historyOpen = a.payload;
      s.historyItems = [];
    },
    closeHistory: (s) => {
      s.historyOpen = null;
    },

    // --- wizard
    openWizardCreate: (s) => {
      resetWizardForms(s);
      s.wizard = {
        open: true,
        sdmkId: null,
        activeTab: "identitas",
        loading: false,
      };
    },
    openWizardEdit: (s, a: PayloadAction<number>) => {
      resetWizardForms(s);
      s.wizard = {
        open: true,
        sdmkId: a.payload,
        activeTab: "identitas",
        loading: true,
      };
    },
    closeWizard: (s) => {
      s.wizard = {
        open: false,
        sdmkId: null,
        activeTab: "identitas",
        loading: false,
      };
      resetWizardForms(s);
    },
    setTab: (s, a: PayloadAction<SdmkTabKey>) => {
      if (a.payload !== "identitas" && !s.wizard.sdmkId) return; // butuh SDMK tersimpan
      s.wizard.activeTab = a.payload;
    },

    // --- identitas
    setIdentitasField: (
      s,
      a: PayloadAction<{ field: keyof IdentitasForm; value: string }>,
    ) => {
      const { field, value } = a.payload;
      if (isRegionField(field)) {
        setRegionField(s, "identitas", field, value);
        return;
      }
      (s.identitas as any)[field] = value;
      delete s.identitasErrors[field];
      if (field === "nik") {
        s.nikStatus = "idle";
        s.nikMessage = null;
      }
    },

    // --- profesi
    setProfesiField: (
      s,
      a: PayloadAction<{ field: keyof ProfesiForm; value: string }>,
    ) => {
      const { field, value } = a.payload;
      (s.profesi as any)[field] = value;
      delete s.profesiErrors[field];
      if (field === "jenisSdmk") {
        s.profesi.profesi = "";
        s.profesi.kompetensiUtama = "";
        s.kodeProfesi = "";
      }
      if (field === "spesialisasi") s.profesi.subSpesialisasi = "";
    },
    setKompetensiField: (
      s,
      a: PayloadAction<{ field: keyof KompetensiForm; value: string }>,
    ) => {
      s.kompetensiForm[a.payload.field] = a.payload.value;
      delete s.kompetensiErrors[a.payload.field];
    },

    // --- registrasi
    setStrField: (
      s,
      a: PayloadAction<{ field: keyof StrForm; value: string }>,
    ) => {
      s.str[a.payload.field] = a.payload.value;
      delete s.strErrors[a.payload.field];
    },
    setSertifikatLain: (s, a: PayloadAction<string>) => {
      s.sertifikatLain = a.payload;
    },
    openSip: (s, a: PayloadAction<number | undefined>) => {
      s.sipErrors = {};
      s.wilayah.sip = emptyWilayah();
      const found = a.payload
        ? s.detail?.sip.find((x) => x.id === a.payload)
        : undefined;
      s.sipForm = found ? pick(fromServer(found), initialSip) : initialSip;
      s.sipModal = { open: true, editingId: found?.id ?? null };
    },
    closeSip: (s) => {
      s.sipModal = { open: false, editingId: null };
      s.sipForm = initialSip;
      s.sipErrors = {};
      s.wilayah.sip = emptyWilayah();
    },
    setSipField: (
      s,
      a: PayloadAction<{ field: keyof SipForm; value: string }>,
    ) => {
      const { field, value } = a.payload;
      if (isRegionField(field)) {
        setRegionField(s, "sip", field, value);
        return;
      }
      (s.sipForm as any)[field] = value;
      delete (s.sipErrors as any)[field];
      if (field === "fasyankes") {
        s.sipForm.poli = "";
        s.sipForm.ruangan = "";
      }
      if (field === "poli") s.sipForm.ruangan = "";
    },
    setSipFileError: (s, a: PayloadAction<string | undefined>) => {
      if (a.payload) s.sipErrors.file = a.payload;
      else delete s.sipErrors.file;
    },

    // --- penempatan
    setPenempatanField: (
      s,
      a: PayloadAction<{
        field: keyof PenempatanForm;
        value: string | boolean;
      }>,
    ) => {
      const { field, value } = a.payload;
      (s.penempatanForm as any)[field] = value;
      delete s.penempatanErrors[field];
      if (field === "fasyankes") {
        s.penempatanForm.poli = "";
        s.penempatanForm.ruangan = "";
      }
      if (field === "poli") s.penempatanForm.ruangan = "";
    },
    editPenempatan: (s, a: PayloadAction<number>) => {
      const p = s.detail?.penempatan.find((x) => x.id === a.payload);
      if (!p) return;
      s.penempatanForm = pick(fromServer(p), initialPenempatan);
      s.penempatanEditingId = p.id;
      s.penempatanErrors = {};
    },
    resetPenempatanForm: (s) => {
      s.penempatanForm = initialPenempatan;
      s.penempatanEditingId = null;
      s.penempatanErrors = {};
    },

    // --- jadwal
    setJadwalSettingField: (
      s,
      a: PayloadAction<{ field: keyof JadwalSettingForm; value: string }>,
    ) => {
      (s.jadwalSetting as any)[a.payload.field] = a.payload.value;
      delete s.jadwalSettingErrors[a.payload.field];
    },
    toggleJenisPasienSetting: (s, a: PayloadAction<string>) => {
      const list = s.jadwalSetting.jenisPasien;
      s.jadwalSetting.jenisPasien = list.includes(a.payload)
        ? list.filter((x) => x !== a.payload)
        : [...list, a.payload];
      delete s.jadwalSettingErrors.jenisPasien;
    },
    toggleHariAktif: (s, a: PayloadAction<number>) => {
      const r = s.jadwalHari[a.payload];
      if (!r) return;
      r.aktif = !r.aktif;
      if (r.aktif) {
        // isi bawaan dari pengaturan umum agar tidak kosong
        r.durasiSlot = r.durasiSlot || s.jadwalSetting.durasiLayanan;
        r.jenisPasien = r.jenisPasien.length
          ? r.jenisPasien
          : [...s.jadwalSetting.jenisPasien];
      }
      delete s.jadwalHariErrors[r.hari];
    },
    setJadwalHariField: (
      s,
      a: PayloadAction<{
        index: number;
        field: keyof JadwalHariForm;
        value: string;
      }>,
    ) => {
      const r = s.jadwalHari[a.payload.index];
      if (!r) return;
      (r as any)[a.payload.field] = a.payload.value;
      delete s.jadwalHariErrors[r.hari];
    },
    openSlot: (s, a: PayloadAction<number | undefined>) => {
      const found = a.payload
        ? s.detail?.slots.find((x) => x.id === a.payload)
        : undefined;
      s.slotForm = found ? pick(fromServer(found), initialSlot) : initialSlot;
      s.slotErrors = {};
      s.slotModal = { open: true, editingId: found?.id ?? null };
    },
    closeSlot: (s) => {
      s.slotModal = { open: false, editingId: null };
      s.slotForm = initialSlot;
      s.slotErrors = {};
    },
    setSlotField: (
      s,
      a: PayloadAction<{ field: keyof SlotForm; value: string | boolean }>,
    ) => {
      (s.slotForm as any)[a.payload.field] = a.payload.value;
      delete s.slotErrors[a.payload.field];
    },
    toggleJenisPasienSlot: (s, a: PayloadAction<string>) => {
      const list = s.slotForm.jenisPasien;
      s.slotForm.jenisPasien = list.includes(a.payload)
        ? list.filter((x) => x !== a.payload)
        : [...list, a.payload];
      delete s.slotErrors.jenisPasien;
    },

    // --- integrasi & catatan
    setIntegrasiField: (
      s,
      a: PayloadAction<{ field: keyof IntegrasiForm; value: string }>,
    ) => {
      s.integrasi[a.payload.field] = a.payload.value;
    },
    setCatatan: (s, a: PayloadAction<string>) => {
      s.catatan = a.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchStats.pending, (s) => {
      s.statsLoading = true;
    })
      .addCase(fetchStats.fulfilled, (s, a) => {
        s.statsLoading = false;
        s.stats = a.payload;
      })
      .addCase(fetchStats.rejected, (s) => {
        s.statsLoading = false;
      });

    b.addCase(fetchSdmkList.pending, (s) => {
      s.listLoading = true;
      s.listError = null;
    })
      .addCase(fetchSdmkList.fulfilled, (s, a) => {
        if (a.payload.requestId !== listRequestId) return; // respons basi
        s.listLoading = false;
        s.items = a.payload.data;
        s.meta = a.payload.meta;
        if (s.selectedId === null && a.payload.data[0])
          s.selectedId = a.payload.data[0].id;
      })
      .addCase(fetchSdmkList.rejected, (s, a) => {
        s.listLoading = false;
        s.listError = a.payload?.message ?? "Gagal memuat daftar SDMK";
      });

    b.addCase(fetchSdmkDetail.pending, (s, a) => {
      if (s.selectedId === a.meta.arg) {
        s.detailLoading = true;
        s.detailError = null;
      }
    })
      .addCase(fetchSdmkDetail.fulfilled, (s, a) => {
        if (s.selectedId === a.payload.id) {
          s.detail = a.payload;
          s.detailLoading = false;
        }
        if (s.wizard.open && s.wizard.sdmkId === a.payload.id) {
          s.wizard.loading = false;
          hydrate(s, a.payload);
          s.detail = a.payload;
        }
      })
      .addCase(fetchSdmkDetail.rejected, (s, a) => {
        s.detailLoading = false;
        s.detailError = a.payload?.message ?? "Gagal memuat detail SDMK";
        s.wizard.loading = false;
      });

    b.addCase(fetchOptions.fulfilled, (s, a) => {
      s.options = a.payload;
      s.optionsError = null;
    }).addCase(fetchOptions.rejected, (s, a) => {
      s.optionsError = a.payload?.message ?? "Gagal memuat pilihan data";
    });

    b.addCase(fetchWilayahSdmk.fulfilled, (s, a) => {
      const { target, level, items } = a.payload;
      const parentKode = a.meta.arg.parentKode;
      // Buang respons basi: induknya sudah berubah saat request berjalan
      const parentField =
        level === "provinsi"
          ? null
          : WILAYAH_FIELD[
              level === "kabupaten"
                ? "provinsi"
                : level === "kecamatan"
                  ? "kabupaten"
                  : "kecamatan"
            ];
      if (parentField && regionHolder(s, target)[parentField] !== parentKode)
        return;
      s.wilayah[target][level] = items;
    });

    b.addCase(cekNikSdmk.pending, (s) => {
      s.nikStatus = "checking";
      s.nikMessage = null;
    })
      .addCase(cekNikSdmk.fulfilled, (s, a) => {
        s.nikStatus = a.payload.terdaftar ? "exists" : "available";
        s.nikMessage = a.payload.terdaftar
          ? `NIK sudah terdaftar${a.payload.nama ? ` atas nama ${a.payload.nama}` : ""}.`
          : "NIK belum terdaftar, dapat dilanjutkan.";
      })
      .addCase(cekNikSdmk.rejected, (s, a) => {
        s.nikStatus = "error";
        s.nikMessage = a.payload?.message ?? "Gagal memeriksa NIK";
      });

    // Pola umum: pending → saving key, fulfilled → sinkron, rejected → simpan error per form
    const wire = (
      thunk: any,
      key: string,
      onError?: (s: SdmkState, fe: Record<string, string>) => void,
      onOk?: (s: SdmkState) => void,
    ) => {
      b.addCase(thunk.pending, (s: SdmkState) => {
        s.saving = key;
      });
      b.addCase(
        thunk.fulfilled,
        (s: SdmkState, a: PayloadAction<SdmkDetail>) => {
          afterMutation(s, a.payload);
          onOk?.(s);
        },
      );
      b.addCase(thunk.rejected, (s: SdmkState, a: any) => {
        s.saving = null;
        if (a.payload?.fieldErrors) onError?.(s, a.payload.fieldErrors);
      });
    };
    wire(saveIdentitas, "identitas", (s, fe) => {
      s.identitasErrors = fe as any;
    });
    wire(uploadFoto, "foto");
    wire(saveProfesi, "profesi", (s, fe) => {
      s.profesiErrors = fe as any;
    });
    wire(
      addKompetensi,
      "kompetensi",
      (s, fe) => {
        s.kompetensiErrors = fe as any;
      },
      (s) => {
        s.kompetensiForm = initialKompetensi;
        s.kompetensiErrors = {};
      },
    );
    wire(deleteKompetensi, "kompetensi");
    wire(saveStr, "str", (s, fe) => {
      s.strErrors = fe as any;
    });
    wire(verifyStr, "verifyStr");
    wire(
      saveSip,
      "sip",
      (s, fe) => {
        s.sipErrors = fe as any;
      },
      (s) => {
        s.sipModal = { open: false, editingId: null };
        s.sipForm = initialSip;
        s.sipErrors = {};
      },
    );
    wire(deleteSip, "sip");
    wire(
      savePenempatan,
      "penempatan",
      (s, fe) => {
        s.penempatanErrors = fe as any;
      },
      (s) => {
        s.penempatanForm = initialPenempatan;
        s.penempatanEditingId = null;
        s.penempatanErrors = {};
      },
    );
    wire(deletePenempatan, "penempatan");
    wire(
      saveJadwal,
      "jadwal",
      (s, fe) => {
        s.jadwalSettingErrors = Object.fromEntries(
          Object.entries(fe).filter(([k]) => !k.startsWith("hari.")),
        ) as any;
        s.jadwalHariErrors = Object.fromEntries(
          Object.entries(fe)
            .filter(([k]) => k.startsWith("hari."))
            .map(([k, v]) => [k.slice(5), v]),
        );
      },
      (s) => {
        s.jadwalSettingErrors = {};
        s.jadwalHariErrors = {};
      },
    );
    wire(
      saveSlot,
      "slot",
      (s, fe) => {
        s.slotErrors = fe as any;
      },
      (s) => {
        s.slotModal = { open: false, editingId: null };
        s.slotForm = initialSlot;
        s.slotErrors = {};
      },
    );
    wire(deleteSlot, "slot");
    wire(saveIntegrasi, "integrasi");
    wire(verifyIhs, "verifyIhs");
    wire(saveCatatan, "catatan");

    b.addCase(fetchHistory.pending, (s) => {
      s.historyLoading = true;
    })
      .addCase(fetchHistory.fulfilled, (s, a) => {
        s.historyLoading = false;
        s.historyItems = a.payload;
      })
      .addCase(fetchHistory.rejected, (s) => {
        s.historyLoading = false;
      });
  },
});

export const {
  setSearch,
  setStatusFilter,
  setPage,
  setPerPage,
  selectSdmk,
  openHistory,
  closeHistory,
  openWizardCreate,
  openWizardEdit,
  closeWizard,
  setTab,
  setIdentitasField,
  setProfesiField,
  setKompetensiField,
  setStrField,
  setSertifikatLain,
  openSip,
  closeSip,
  setSipField,
  setSipFileError,
  setPenempatanField,
  editPenempatan,
  resetPenempatanForm,
  setJadwalSettingField,
  toggleJenisPasienSetting,
  toggleHariAktif,
  setJadwalHariField,
  openSlot,
  closeSlot,
  setSlotField,
  toggleJenisPasienSlot,
  setIntegrasiField,
  setCatatan,
} = sdmkSlice.actions;

export default sdmkSlice.reducer;
