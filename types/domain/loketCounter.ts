// Lokasi: src/types/domain/lokasiPelayanan.ts
// Master data Lokasi Pelayanan (lokasi fisik pelayanan, terpisah dari unit klinis). Bisa berjenjang: Gedung > Lantai > Ruang.

export type TipeLoket = 'Ruang Pendaftaran' | 'Ruang Poli' | 'Ruang Farmasi' | 'Ruang Kasir';
export type StatusLoket = 'Aktif' | 'Nonaktif';

export interface LoketForm {
  kode: string;
  nama: string;
  tipe: TipeLoket | '';
  counterId: string;
  deskripsi: string;
  status: StatusLoket;
}

export type LoketErrors = Partial<Record<keyof LoketForm, string>>;

export interface LoketItem {
  id: number;
  kode: string;
  nama: string;
  tipe: TipeLoket;
  counterId: string | null;
  counterNama: string | null;
  deskripsi: string | null;
  status: StatusLoket;
}

export interface LoketListResponse {
  data: LoketItem[];
  meta: { currentPage: number; lastPage: number; perPage: number; total: number };
  ringkasan: { aktif: number; total: number };
}

export interface LoketOptions {
  counter: { value: string; label: string }[];
}
