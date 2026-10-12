// Lokasi: src/features/pendaftaran/utils/kunjunganHelpers.ts
import type { KunjunganForm, KunjunganFormErrors } from '@/types/domain/kunjungan';

export const initialKunjunganForm: KunjunganForm = {
  poliId: '',
  dokterId: '',
  jenisLayanan: '',
  caraMasuk: '',
  penjaminId: '',
  jenisPembayaran: '',
  prioritas: 'NORMAL',
  loketId: '',
  lokasiId: '',
};

const FIELD_LABEL: Record<keyof KunjunganForm, string> = {
  poliId: 'Poli/Unit Tujuan',
  dokterId: 'Dokter / Nakes',
  jenisLayanan: 'Jenis Layanan',
  caraMasuk: 'Cara Masuk',
  penjaminId: 'Penjamin',
  jenisPembayaran: 'Jenis Pembayaran',
  prioritas: 'Prioritas',
  loketId: 'Loket Pendaftaran',
  lokasiId: 'Lokasi Pelayanan',
};

/** Nama field form -> nama field di API (snake_case) */
const FORM_TO_API: Record<keyof KunjunganForm, string> = {
  poliId: 'poli_id',
  dokterId: 'dokter_id',
  jenisLayanan: 'jenis_layanan',
  caraMasuk: 'cara_masuk',
  penjaminId: 'penjamin_id',
  jenisPembayaran: 'jenis_pembayaran',
  prioritas: 'prioritas',
  loketId: 'loket_id',
  lokasiId: 'lokasi_pelayanan_id',
};

const API_TO_FORM = Object.fromEntries(
  Object.entries(FORM_TO_API).map(([form, api]) => [api, form]),
) as Record<string, keyof KunjunganForm>;

/** Semua field wajib diisi */
export const validateKunjungan = (form: KunjunganForm): KunjunganFormErrors => {
  const errors: KunjunganFormErrors = {};
  (Object.keys(FIELD_LABEL) as (keyof KunjunganForm)[]).forEach((field) => {
    if (!form[field]) errors[field] = `${FIELD_LABEL[field]} wajib dipilih`;
  });
  return errors;
};

export const toKunjunganPayload = (form: KunjunganForm, tiketId?: string) => ({
  poli_id: Number(form.poliId),
  dokter_id: Number(form.dokterId),
  jenis_layanan: form.jenisLayanan,
  cara_masuk: form.caraMasuk,
  penjamin_id: Number(form.penjaminId),
  jenis_pembayaran: form.jenisPembayaran,
  prioritas: form.prioritas,
  loket_id: Number(form.loketId),
  lokasi_pelayanan_id: Number(form.lokasiId),
  tiket_id: tiketId || null,
});

/** Error validasi Laravel { poli_id: ['...'] } -> { poliId: '...' } */
export const flattenKunjunganErrors = (
  errors?: Record<string, string[] | string>,
): KunjunganFormErrors => {
  const result: KunjunganFormErrors = {};
  if (!errors) return result;
  Object.entries(errors).forEach(([key, value]) => {
    const field = API_TO_FORM[key];
    if (field) result[field] = Array.isArray(value) ? value[0] : value;
  });
  return result;
};

/** Tanggal "16 Agustus 2026" dan jam "08:03 WIB" (zona Asia/Jakarta) */
export const formatTanggalWaktu = (date: Date): { tanggal: string; jam: string } => {
  const tanggal = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  const jam = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace('.', ':');
  return { tanggal, jam: `${jam} WIB` };
};
