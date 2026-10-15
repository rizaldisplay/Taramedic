// Lokasi: src/types/domain/produkObat.ts
// Master data Farmasi · Produk Obat / snapshot KFA (Kamus Farmasi dan Alat Kesehatan).

export type StatusProduk = 'Aktif' | 'Nonaktif';
export type StatusFormularium = 'Formularium' | 'Non-formularium' | 'Perlu persetujuan';

/** Rute pemberian: kode singkat + label tampil, mis. { kode: 'PO', label: 'Oral' }. */
export interface RuteItem {
  kode: string;
  label: string;
}

export interface ProdukObatForm {
  kfaCode: string;
  kodeLokal: string;
  nama: string;
  namaGenerik: string;
  zatAktif: string;
  kekuatan: string;
  satuan: string;
  bentukSediaan: string;
  status: StatusProduk;
  /** Teks "PO=Oral, IV=Intravena"; diurai menjadi RuteItem[] saat dikirim */
  ruteText: string;
  statusFormularium: StatusFormularium | '';
  produsen: string;
}

export type ProdukObatErrors = Partial<Record<keyof ProdukObatForm, string>>;

export interface ProdukObatItem {
  id: number;
  kfaCode: string;
  kodeLokal: string;
  nama: string;
  namaGenerik: string | null;
  /** Nama dagang/merek; hanya terisi dari sinkronisasi KFA (tidak diedit di form) */
  namaDagang: string | null;
  zatAktif: string;
  kekuatan: string | null;
  satuan: string | null;
  bentukSediaan: string;
  rute: RuteItem[];
  produsen: string | null;
  /** Hanya dari sinkronisasi KFA */
  nomorRegistrasi: string | null;
  statusFormularium: StatusFormularium;
  status: StatusProduk;
  /** Mis. "KFA snapshot · preliminary" */
  sumber: string;
  /** ISO 8601; null = belum pernah disinkronkan */
  sinkronTerakhir: string | null;
}

export interface ProdukObatListResponse {
  data: ProdukObatItem[];
  /** total = jumlah yang cocok di server; limit = batas baris endpoint (data dipotong bila total > limit) */
  meta: { total: number; limit: number };
}

export type SortKey = 'nama' | 'kfaCode' | 'zatAktif' | 'bentukSediaan' | 'statusFormularium';
export type SortDir = 'asc' | 'desc';

/** Filter yang diterapkan di klien pada baris yang sudah dimuat ('' = semua). */
export interface ClientFilters {
  formularium: StatusFormularium | '';
  sediaan: string;
  rute: string;
  produsen: string;
}

export type PanelMode = 'form' | 'detail';
