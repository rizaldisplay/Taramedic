// Lokasi: src/types/domain/lokasiPelayanan.ts
// Master data Lokasi Pelayanan (lokasi fisik pelayanan, terpisah dari unit klinis). Bisa berjenjang: Gedung > Lantai > Ruang.

export type TipeLokasi = 'Gedung' | 'Lantai' | 'Ruang' | 'Area Lainnya';
export type StatusLokasi = 'Aktif' | 'Nonaktif';

export interface LokasiForm {
  kode: string;
  nama: string;
  tipe: TipeLokasi | '';
  indukId: string; // '' = tingkat atas
  fasyankesId: string;
  /** Hanya untuk tipe Ruang; '' = tidak terikat poli */
  poliId: string;
  deskripsi: string;
  status: StatusLokasi;
}

export type LokasiErrors = Partial<Record<keyof LokasiForm, string>>;

export interface LokasiItem {
  id: number;
  kode: string;
  nama: string;
  tipe: TipeLokasi;
  indukId: string | null;
  indukNama: string | null;
  fasyankesId: string | null;
  fasyankesNama: string | null;
  poliId: string | null;
  poliNama: string | null;
  deskripsi: string | null;
  status: StatusLokasi;
}

export interface LokasiListResponse {
  data: LokasiItem[];
  meta: { currentPage: number; lastPage: number; perPage: number; total: number };
  ringkasan: { aktif: number; total: number };
}

export interface LokasiOptions {
  fasyankes: { value: string; label: string }[];
  /** Poli aktif; hanya relevan untuk lokasi bertipe Ruang */
  poli: { value: string; label: string }[];
  /** Semua lokasi aktif, dipakai sebagai pilihan "Induk". indukId dipakai untuk mencegah siklus. */
  induk: { value: string; label: string; indukId: string | null }[];
}
