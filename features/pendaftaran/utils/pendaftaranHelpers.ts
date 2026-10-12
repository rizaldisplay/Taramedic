// Lokasi yang disarankan: src/features/registration/utils/pendaftaranHelpers.ts
import type { PatientDetail } from '@/types/domain/pasien';
import type {
  PendaftaranForm,
  PendaftaranFormErrors,
  WilayahLevel,
} from '@/types/domain/pendaftaran';

// ----------------------------------------------------------------------
// 1. Nilai awal form
// ----------------------------------------------------------------------
export const initialPendaftaranForm: PendaftaranForm = {
  jenisIdentitas: 'NIK',
  nik: '',
  namaLengkap: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: '',
  alamatLengkap: '',
  provinsi: '',
  kabupatenKota: '',
  kecamatan: '',
  desaKelurahan: '',
  rt: '',
  rw: '',
  kodePos: '',
  nomorHP: '',
  email: '',
  nomorKK: '',
  statusPerkawinan: '',
  kewarganegaraan: 'WNI',
  bahasa: 'Indonesia',
  namaKontakDarurat: '',
  hubunganKontakDarurat: '',
  nomorHPKontakDarurat: '',
};

// ----------------------------------------------------------------------
// 2. Opsi dropdown statis
// ----------------------------------------------------------------------
export interface Opsi {
  value: string;
  label: string;
}

export const OPSI_JENIS_IDENTITAS: Opsi[] = [
  { value: 'NIK', label: 'NIK' },
  { value: 'TANPA_NIK', label: 'Pasien Tanpa NIK' },
  { value: 'WNA', label: 'WNA' },
];

export const OPSI_JENIS_KELAMIN: Opsi[] = [
  { value: 'Laki-laki', label: 'Laki-laki' },
  { value: 'Perempuan', label: 'Perempuan' },
];

export const OPSI_STATUS_PERKAWINAN: Opsi[] = [
  { value: 'Belum Kawin', label: 'Belum Kawin' },
  { value: 'Kawin', label: 'Kawin' },
  { value: 'Cerai Hidup', label: 'Cerai Hidup' },
  { value: 'Cerai Mati', label: 'Cerai Mati' },
];

export const OPSI_KEWARGANEGARAAN: Opsi[] = [
  { value: 'WNI', label: 'Warga Negara Indonesia (WNI)' },
  { value: 'WNA', label: 'Warga Negara Asing (WNA)' },
];

export const OPSI_BAHASA: Opsi[] = [
  { value: 'Indonesia', label: 'Bahasa Indonesia' },
  { value: 'Jawa', label: 'Bahasa Jawa' },
  { value: 'Sunda', label: 'Bahasa Sunda' },
  { value: 'Madura', label: 'Bahasa Madura' },
  { value: 'Inggris', label: 'Bahasa Inggris' },
  { value: 'Lainnya', label: 'Lainnya' },
];

export const OPSI_HUBUNGAN: Opsi[] = [
  { value: 'Ayah', label: 'Ayah' },
  { value: 'Ibu', label: 'Ibu' },
  { value: 'Suami', label: 'Suami' },
  { value: 'Istri', label: 'Istri' },
  { value: 'Anak', label: 'Anak' },
  { value: 'Saudara', label: 'Saudara Kandung' },
  { value: 'Lainnya', label: 'Lainnya' },
];

// ----------------------------------------------------------------------
// 3. Struktur wilayah bertingkat
// ----------------------------------------------------------------------
type FieldWilayah = 'provinsi' | 'kabupatenKota' | 'kecamatan' | 'desaKelurahan';

/** Level wilayah -> nama field di form */
export const WILAYAH_FIELD: Record<WilayahLevel, FieldWilayah> = {
  provinsi: 'provinsi',
  kabupaten: 'kabupatenKota',
  kecamatan: 'kecamatan',
  desa: 'desaKelurahan',
};

/** Level wilayah -> level di bawahnya */
export const WILAYAH_CHILD: Record<WilayahLevel, WilayahLevel | null> = {
  provinsi: 'kabupaten',
  kabupaten: 'kecamatan',
  kecamatan: 'desa',
  desa: null,
};

/** Level wilayah -> field induknya (dipakai untuk membuang response yang sudah basi) */
export const WILAYAH_PARENT_FIELD: Record<WilayahLevel, FieldWilayah | null> = {
  provinsi: null,
  kabupaten: 'provinsi',
  kecamatan: 'kabupatenKota',
  desa: 'kecamatan',
};

/** Endpoint wilayah. Sesuaikan dengan route backend. */
export const WILAYAH_ENDPOINT: Record<WilayahLevel, (parentKode?: string) => string> = {
  provinsi: () => '/regions/provinces',
  kabupaten: (p) => `/regions/provinces/${p}/regencies`,
  kecamatan: (p) => `/regions/regencies/${p}/districts`,
  desa: (p) => `/regions/districts/${p}/villages`,
};

// ----------------------------------------------------------------------
// 4. Format tanggal (form: DD-MM-YYYY, backend: YYYY-MM-DD)
// ----------------------------------------------------------------------
export const maskTanggal = (raw: string): string => {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`;
};

export const parseTanggal = (value: string): Date | null => {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!m) return null;

  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const date = new Date(year, month - 1, day);

  const valid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return valid ? date : null;
};

export const tanggalToIso = (value: string): string => {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
};

export const isoToTanggal = (iso: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
};

// ----------------------------------------------------------------------
// 5. Validasi
// ----------------------------------------------------------------------
const NIK_REGEX = /^\d{16}$/;
const PASPOR_REGEX = /^[A-Za-z0-9]{5,20}$/;
const HP_REGEX = /^(\+62|62|0)8\d{8,12}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isNikValid = (nik: string) => NIK_REGEX.test(nik);

interface ValidateOptions {
  /** true jika hasil Cek NIK menyatakan NIK sudah terdaftar */
  nikTerdaftar?: boolean;
}

export function validatePendaftaran(
  form: PendaftaranForm,
  { nikTerdaftar = false }: ValidateOptions = {},
): PendaftaranFormErrors {
  const errors: PendaftaranFormErrors = {};
  const kosong = (v: string) => v.trim() === '';

  // Identitas
  if (form.jenisIdentitas === 'NIK') {
    if (kosong(form.nik)) errors.nik = 'NIK wajib diisi';
    else if (!NIK_REGEX.test(form.nik)) errors.nik = 'NIK harus 16 digit angka';
    else if (nikTerdaftar) errors.nik = 'NIK sudah terdaftar sebagai pasien';
  } else if (form.jenisIdentitas === 'WNA') {
    if (kosong(form.nik)) errors.nik = 'Nomor paspor wajib diisi';
    else if (!PASPOR_REGEX.test(form.nik.trim()))
      errors.nik = 'Nomor paspor 5-20 karakter huruf/angka';
  }

  if (kosong(form.namaLengkap)) errors.namaLengkap = 'Nama lengkap wajib diisi';

  if (kosong(form.tanggalLahir)) {
    errors.tanggalLahir = 'Tanggal lahir wajib diisi';
  } else {
    const tgl = parseTanggal(form.tanggalLahir);
    if (!tgl) errors.tanggalLahir = 'Format tanggal harus DD-MM-YYYY dan valid';
    else if (tgl > new Date()) errors.tanggalLahir = 'Tanggal lahir tidak boleh di masa depan';
    else if (tgl.getFullYear() < 1900) errors.tanggalLahir = 'Tahun lahir tidak valid';
  }

  if (!form.jenisKelamin) errors.jenisKelamin = 'Pilih jenis kelamin';

  // Alamat
  if (kosong(form.alamatLengkap)) errors.alamatLengkap = 'Alamat lengkap wajib diisi';
  if (!form.provinsi) errors.provinsi = 'Pilih provinsi';
  if (!form.kabupatenKota) errors.kabupatenKota = 'Pilih kabupaten/kota';
  if (!form.kecamatan) errors.kecamatan = 'Pilih kecamatan';
  if (!form.desaKelurahan) errors.desaKelurahan = 'Pilih desa/kelurahan';
  if (form.rt && !/^\d{1,3}$/.test(form.rt)) errors.rt = 'RT maksimal 3 digit angka';
  if (form.rw && !/^\d{1,3}$/.test(form.rw)) errors.rw = 'RW maksimal 3 digit angka';
  if (form.kodePos && !/^\d{5}$/.test(form.kodePos)) errors.kodePos = 'Kode pos 5 digit angka';

  // Kontak
  if (kosong(form.nomorHP)) errors.nomorHP = 'Nomor HP wajib diisi';
  else if (!HP_REGEX.test(form.nomorHP)) errors.nomorHP = 'Format nomor HP tidak valid (08xxxxxxxxxx)';
  if (form.email && !EMAIL_REGEX.test(form.email)) errors.email = 'Format email tidak valid';

  // Administrasi
  if (form.nomorKK && !NIK_REGEX.test(form.nomorKK)) errors.nomorKK = 'Nomor KK harus 16 digit angka';
  if (!form.kewarganegaraan) errors.kewarganegaraan = 'Pilih kewarganegaraan';

  // Kontak darurat
  if (form.nomorHPKontakDarurat && !HP_REGEX.test(form.nomorHPKontakDarurat))
    errors.nomorHPKontakDarurat = 'Format nomor HP tidak valid (08xxxxxxxxxx)';

  return errors;
}

// ----------------------------------------------------------------------
// 6. Mapping ke payload API
//    Jika backend memakai snake_case, ubah di SATU tempat ini saja.
// ----------------------------------------------------------------------
export function toPendaftaranPayload(form: PendaftaranForm): PendaftaranForm {
  const trimmed = Object.fromEntries(
    Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
  ) as PendaftaranForm;

  return {
    ...trimmed,
    nik: trimmed.jenisIdentitas === 'TANPA_NIK' ? '' : trimmed.nik,
    tanggalLahir: tanggalToIso(trimmed.tanggalLahir),
  };
}

// ----------------------------------------------------------------------
// 7. Error validasi dari backend (format Laravel: { errors: { field: [msg] } })
// ----------------------------------------------------------------------
export function flattenFieldErrors(errors: unknown): PendaftaranFormErrors | undefined {
  if (!errors || typeof errors !== 'object') return undefined;

  const result: Record<string, string> = {};
  for (const [field, messages] of Object.entries(errors as Record<string, unknown>)) {
    const first = Array.isArray(messages) ? messages[0] : messages;
    if (typeof first === 'string') result[field] = first;
  }
  return result as PendaftaranFormErrors;
}

// ----------------------------------------------------------------------
// 8. Data detail pasien -> nilai form (mode ubah data)
// ----------------------------------------------------------------------
export function detailToForm(d: PatientDetail): PendaftaranForm {
  return {
    jenisIdentitas: d.jenisIdentitas,
    nik: d.nik ?? '',
    namaLengkap: d.namaLengkap,
    tempatLahir: d.tempatLahir ?? '',
    tanggalLahir: isoToTanggal(d.tanggalLahir),
    jenisKelamin: d.jenisKelamin,
    alamatLengkap: d.alamatLengkap,
    provinsi: d.provinsi,
    kabupatenKota: d.kabupatenKota,
    kecamatan: d.kecamatan,
    desaKelurahan: d.desaKelurahan,
    rt: d.rt ?? '',
    rw: d.rw ?? '',
    kodePos: d.kodePos ?? '',
    nomorHP: d.nomorHP,
    email: d.email ?? '',
    nomorKK: d.nomorKK ?? '',
    statusPerkawinan: d.statusPerkawinan ?? '',
    kewarganegaraan: d.kewarganegaraan,
    bahasa: d.bahasa ?? '',
    namaKontakDarurat: d.namaKontakDarurat ?? '',
    hubunganKontakDarurat: d.hubunganKontakDarurat ?? '',
    nomorHPKontakDarurat: d.nomorHPKontakDarurat ?? '',
  };
}

export const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
