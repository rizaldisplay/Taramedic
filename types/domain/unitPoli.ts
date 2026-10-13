// Lokasi: src/types/domain/unitPoli.ts
// Master data Unit & Poli (scope layanan dan filter antrean).

export type JenisUnit = 'Poli' | 'Penunjang' | 'Rawat Inap' | 'Administrasi' | 'Lainnya';
export type StatusUnit = 'Aktif' | 'Nonaktif';

export interface UnitPoliForm {
  kode: string;
  nama: string;
  jenis: JenisUnit | '';
  fasyankesId: string;
  deskripsi: string;
  untukAntrean: boolean;
  status: StatusUnit;
}

export type UnitPoliErrors = Partial<Record<keyof UnitPoliForm, string>>;

export interface UnitPoliItem {
  id: number;
  kode: string;
  nama: string;
  jenis: JenisUnit;
  fasyankesId: string | null;
  fasyankesNama: string | null;
  deskripsi: string | null;
  untukAntrean: boolean;
  status: StatusUnit;
}

export interface UnitPoliListResponse {
  data: UnitPoliItem[];
  meta: { currentPage: number; lastPage: number; perPage: number; total: number };
  ringkasan: { aktif: number; total: number };
}

export interface UnitPoliOptions {
  fasyankes: { value: string; label: string }[];
}
