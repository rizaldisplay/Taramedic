// Loket: src/types/domain/loketCounter.ts
// Master data Loket / Counter pelayanan (pendaftaran, poli, farmasi, kasir).

export type TipeLoket = 'Ruang Pendaftaran' | 'Ruang Poli' | 'Ruang Farmasi' | 'Ruang Kasir';
export type StatusLoket = 'Aktif' | 'Nonaktif';

export interface LoketForm {
  code: string;
  nama: string;
  tipe: TipeLoket | '';
  deskripsi: string;
  status: StatusLoket;
}

export type LoketErrors = Partial<Record<keyof LoketForm, string>>;

export interface LoketItem {
  id: number;
  code: string;
  nama: string;
  tipe: TipeLoket;
  deskripsi: string | null;
  status: StatusLoket;
}

export interface LoketListResponse {
  data: LoketItem[];
  meta: { currentPage: number; lastPage: number; perPage: number; total: number };
  ringkasan: { aktif: number; total: number };
}

export interface LoketOptions {
  tipe: { value: TipeLoket; label: string }[];
}
