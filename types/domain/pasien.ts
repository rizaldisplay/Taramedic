// src/types/domain/pasien.ts
import type { JenisKelamin, Pendaftaran } from './pendaftaran';

interface SatuSehatInfo {
  statusTerhubung: boolean;
  ihsNumber: string | null;
  /** Sudah diformat backend, mis. "16-08-2026 07:58 WIB" */
  lastSyncAt: string | null;
}

/** Satu baris hasil pencarian + data ringkas untuk panel "Data Pasien". Semua teks siap tampil. */
interface PatientListItem {
  id: number;
  nomorRM: string;
  namaLengkap: string;
  inisial: string;
  jenisKelamin: JenisKelamin;
  /** mis. "8 Tahun" */
  usiaString: string;
  /** DD-MM-YYYY */
  tanggalLahir: string;
  /** Sudah disamarkan, mis. "3271••••••••9012" */
  nik: string;
  nomorHP: string;
  alamatRingkas: string;
  isActive: boolean;
  /** "BPJS" | "UMUM" | "ASURANSI" */
  penjaminUtama: string;
  penjaminLabel: string;
  tanggalKunjunganTerakhir: string | null;
  poliKunjunganTerakhir: string | null;
  satuSehat: SatuSehatInfo;
}

/** Data lengkap (tidak disamarkan) untuk modal detail & ubah data. tanggalLahir = YYYY-MM-DD. */
interface PatientDetail extends Pendaftaran {
  wilayahNama: {
    provinsi: string;
    kabupatenKota: string;
    kecamatan: string;
    desaKelurahan: string;
  };
  isActive: boolean;
  nikTerverifikasi: boolean;
  satuSehat: SatuSehatInfo;
  tanggalRegistrasi: string;
  terakhirDiperbarui: string;
  dibuatOleh: string;
  sumberRegistrasi: string;
}

interface PaginationMeta {
  currentPage: number;
  perPage: number;
  totalData: number;
  lastPage: number;
}

interface PatientSearchParams {
  query: string;
  page: number;
  limit: number;
}

interface PatientSearchResult {
  data: PatientListItem[];
  meta: PaginationMeta;
}

export type {
  SatuSehatInfo,
  PatientListItem,
  PatientDetail,
  PaginationMeta,
  PatientSearchParams,
  PatientSearchResult,
};
