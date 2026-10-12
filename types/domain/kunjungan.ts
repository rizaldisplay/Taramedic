// src/types/domain/kunjungan.ts

interface Opsi {
  id: number;
  nama: string;
}

interface DokterOpsi extends Opsi {
  poliId: number;
}

/** Response GET /registration/options */
interface VisitOptions {
  poli: Opsi[];
  dokter: DokterOpsi[];
  jenisLayanan: string[];
  caraMasuk: string[];
  penjamin: string[];
  jenisPembayaran: string[];
  prioritas: string[];
  loket: Opsi[];
  lokasi: Opsi[];
  petugas: { id: number | null; nama: string };
}

/** Nilai select disimpan sebagai string ('' = belum dipilih) */
interface VisitForm {
  poliId: string;
  dokterId: string;
  jenisLayanan: string;
  caraMasuk: string;
  penjamin: string;
  jenisPembayaran: string;
  prioritas: string;
  loketId: string;
  lokasiId: string;
}

type VisitFormErrors = Partial<Record<keyof VisitForm, string>>;

interface RegisterVisitPayload {
  patientId: number;
  form: VisitForm;
  /** ID tiket antrean yang sedang dilayani */
  tiketId?: string;
}

interface VisitResult {
  id: number;
  nomorKunjungan: string;
  tanggal: string;
  poli: string;
  dokter: string;
  lokasi: string;
}

interface VisitRejectValue {
  message: string;
  fieldErrors?: VisitFormErrors;
}

export type {
  Opsi,
  DokterOpsi,
  VisitOptions,
  VisitForm,
  VisitFormErrors,
  RegisterVisitPayload,
  VisitResult,
  VisitRejectValue,
};
