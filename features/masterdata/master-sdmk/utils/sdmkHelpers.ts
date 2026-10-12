// Lokasi: src/features/masterdata/utils/sdmkHelpers.ts
import type {
  FormErrors, Hari, IdentitasForm, JadwalHariForm, JadwalSettingForm, KompetensiForm,
  PenempatanForm, ProfesiForm, SdmkTabKey, SipForm, SlotForm, StrForm, IntegrasiForm,
} from '@/types/domain/sdmk';
import { isoToTanggal, parseTanggal, tanggalToIso } from '@/features/pendaftaran/utils/pendaftaranHelpers';

export { maskTanggal, parseTanggal, tanggalToIso, isoToTanggal } from '@/features/pendaftaran/utils/pendaftaranHelpers';

export const TABS: { key: SdmkTabKey; label: string }[] = [
  { key: 'identitas', label: 'Identitas' },
  { key: 'profesi', label: 'Profesi & Kompetensi' },
  { key: 'registrasi', label: 'Registrasi & Perizinan' },
  { key: 'penempatan', label: 'Penempatan' },
  { key: 'jadwal', label: 'Jadwal Praktik' },
  { key: 'integrasi', label: 'Integrasi' },
  { key: 'catatan', label: 'Catatan' },
];

export const HARI: Hari[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
export const OPSI_HARI = HARI.map((h) => ({ value: h, label: h }));
export const OPSI_STATUS_SDMK = ['Aktif', 'Tidak Aktif', 'Cuti', 'Berakhir Kontrak'] as const;
export const OPSI_STATUS_IZIN = ['Aktif', 'Akan Berakhir', 'Tidak Aktif'].map((v) => ({ value: v, label: v }));
export const OPSI_STATUS_AKTIF = ['Aktif', 'Nonaktif'].map((v) => ({ value: v, label: v }));
export const OPSI_STATUS_JADWAL = ['Aktif', 'Tidak Aktif'].map((v) => ({ value: v, label: v }));

export const MAX_FILE_BYTES = 2 * 1024 * 1024;
export const FILE_MIME_DOKUMEN = ['application/pdf', 'image/jpeg', 'image/png'];
export const FILE_MIME_FOTO = ['image/jpeg', 'image/png'];

// ------------------------------ Initial ------------------------------
export const initialIdentitas: IdentitasForm = {
  nik: '', namaLengkap: '', gelarDepan: '', gelarBelakang: '', tempatLahir: '', tanggalLahir: '',
  jenisKelamin: 'Laki-laki', kewarganegaraan: '', nomorHP: '', email: '', alamatLengkap: '',
  provinsi: '', kabupatenKota: '', kecamatan: '', desaKelurahan: '', rt: '', rw: '', kodePos: '',
  namaKontakDarurat: '', hubunganKontakDarurat: '', nomorHPKontakDarurat: '',
};
export const initialProfesi: ProfesiForm = {
  jenisSdmk: '', profesi: '', kompetensiUtama: '', spesialisasi: '', subSpesialisasi: '',
  tingkatPendidikan: '', institusi: '', tahunLulus: '', status: 'Aktif',
};
export const initialStr: StrForm = { nomorStr: '', tanggalTerbit: '', berlakuHingga: '', organisasiPenerbit: '' };
export const initialSip: SipForm = {
  nomorSip: '', jenisSip: '', tanggalTerbit: '', berlakuHingga: '', status: 'Aktif', tempatTerbit: '',
  nomorSk: '', tanggalSk: '', fasyankes: '', poli: '', ruangan: '', alamatPraktik: '', provinsi: '',
  kabupatenKota: '', kecamatan: '', desaKelurahan: '', kodePos: '', telepon: '', emailFasilitas: '',
};
export const initialKompetensi: KompetensiForm = { nama: '', penyelenggara: '', tanggalPeroleh: '', berlakuHingga: '' };
export const initialPenempatan: PenempatanForm = {
  fasyankes: '', poli: '', ruangan: '', peran: '', jabatan: '', status: 'Aktif', tanggalMulai: '',
  tanggalBerakhir: '', penanggungJawabUnit: false, catatan: '',
};
export const initialJadwalSetting: JadwalSettingForm = {
  tipeJadwal: '', kapasitasPerHari: '', durasiLayanan: '', jenisPasien: [], status: 'Aktif',
};
export const initialJadwalHari = (): JadwalHariForm[] =>
  HARI.map((hari) => ({
    hari, aktif: false, jamMulai: '', jamSelesai: '', durasiSlot: '', kuota: '', kuotaOnline: '',
    istirahatMulai: '', istirahatSelesai: '', jenisPasien: [], status: 'Aktif',
  }));
export const initialSlot: SlotForm = {
  hari: 'Senin', jamMulai: '', jamSelesai: '', adaIstirahat: false, istirahatMulai: '', istirahatSelesai: '',
  durasiLayanan: '', kuota: '', kuotaOnline: '', jenisPasien: [], berlakuMulai: '', berlakuHingga: '',
  pola: '', status: 'Aktif',
};
export const initialIntegrasi: IntegrasiForm = { mappingSpesialisasi: '', mappingTipePraktisi: '' };

// ------------------------------ Validasi -----------------------------
const HP_REGEX = /^(\+62|62|0)8[0-9]{8,12}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JAM_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const RT_RW_REGEX = /^\d{1,3}$/;

const req = <T,>(f: T, key: keyof T, label: string, e: FormErrors<T>) => {
  const v = f[key];
  if (v === '' || v === null || v === undefined || (Array.isArray(v) && v.length === 0)) {
    e[key] = `${label} wajib diisi`;
  }
};

const cekTanggal = <T,>(f: T, key: keyof T, label: string, e: FormErrors<T>, wajib: boolean) => {
  const v = String(f[key] ?? '');
  if (!v) { if (wajib) e[key] = `${label} wajib diisi`; return; }
  if (!parseTanggal(v)) e[key] = `${label} tidak valid (DD-MM-YYYY)`;
};

const urutTanggal = <T,>(f: T, a: keyof T, b: keyof T, e: FormErrors<T>, msg: string) => {
  const da = parseTanggal(String(f[a] ?? ''));
  const db = parseTanggal(String(f[b] ?? ''));
  if (da && db && db < da && !e[b]) e[b] = msg;
};

export function validateIdentitas(f: IdentitasForm): FormErrors<IdentitasForm> {
  const e: FormErrors<IdentitasForm> = {};
  if (!/^\d{16}$/.test(f.nik)) e.nik = 'NIK harus 16 digit angka';
  req(f, 'namaLengkap', 'Nama lengkap', e);
  cekTanggal(f, 'tanggalLahir', 'Tanggal lahir', e, true);
  const lahir = parseTanggal(f.tanggalLahir);
  if (lahir && lahir > new Date()) e.tanggalLahir = 'Tanggal lahir tidak boleh di masa depan';
  req(f, 'kewarganegaraan', 'Kewarganegaraan', e);
  if (!HP_REGEX.test(f.nomorHP.replace(/[\s-]/g, ''))) e.nomorHP = 'Nomor HP tidak valid (contoh 08123456789)';
  if (f.email && !EMAIL_REGEX.test(f.email)) e.email = 'Format email tidak valid';
  req(f, 'alamatLengkap', 'Alamat lengkap', e);
  req(f, 'provinsi', 'Provinsi', e);
  req(f, 'kabupatenKota', 'Kabupaten/Kota', e);
  req(f, 'kecamatan', 'Kecamatan', e);
  req(f, 'desaKelurahan', 'Kelurahan/Desa', e);
  if (f.rt && !RT_RW_REGEX.test(f.rt)) e.rt = 'RT harus angka';
  if (f.rw && !RT_RW_REGEX.test(f.rw)) e.rw = 'RW harus angka';
  if (f.kodePos && !/^\d{5}$/.test(f.kodePos)) e.kodePos = 'Kode pos 5 digit';
  req(f, 'namaKontakDarurat', 'Nama kontak darurat', e);
  req(f, 'hubunganKontakDarurat', 'Hubungan', e);
  if (!HP_REGEX.test(f.nomorHPKontakDarurat.replace(/[\s-]/g, ''))) e.nomorHPKontakDarurat = 'Nomor HP tidak valid';
  return e;
}

export function validateProfesi(f: ProfesiForm): FormErrors<ProfesiForm> {
  const e: FormErrors<ProfesiForm> = {};
  req(f, 'jenisSdmk', 'Jenis SDMK', e);
  req(f, 'profesi', 'Profesi', e);
  req(f, 'kompetensiUtama', 'Kompetensi utama', e);
  req(f, 'tingkatPendidikan', 'Tingkat pendidikan', e);
  if (f.tahunLulus) {
    const y = Number(f.tahunLulus);
    if (!/^\d{4}$/.test(f.tahunLulus) || y < 1950 || y > new Date().getFullYear()) e.tahunLulus = 'Tahun lulus tidak valid';
  }
  return e;
}

export function validateStr(f: StrForm): FormErrors<StrForm> {
  const e: FormErrors<StrForm> = {};
  req(f, 'nomorStr', 'Nomor STR', e);
  cekTanggal(f, 'tanggalTerbit', 'Tanggal terbit', e, true);
  cekTanggal(f, 'berlakuHingga', 'Berlaku hingga', e, true);
  urutTanggal(f, 'tanggalTerbit', 'berlakuHingga', e, 'Berlaku hingga harus setelah tanggal terbit');
  req(f, 'organisasiPenerbit', 'Organisasi penerbit', e);
  return e;
}

export function validateSip(f: SipForm, adaFile: boolean): FormErrors<SipForm> & { file?: string } {
  const e: FormErrors<SipForm> & { file?: string } = {};
  req(f, 'nomorSip', 'Nomor SIP', e);
  req(f, 'jenisSip', 'Jenis SIP', e);
  cekTanggal(f, 'tanggalTerbit', 'Tanggal terbit', e, true);
  cekTanggal(f, 'berlakuHingga', 'Berlaku hingga', e, true);
  urutTanggal(f, 'tanggalTerbit', 'berlakuHingga', e, 'Berlaku hingga harus setelah tanggal terbit');
  req(f, 'tempatTerbit', 'Tempat terbit', e);
  cekTanggal(f, 'tanggalSk', 'Tanggal SK', e, false);
  req(f, 'fasyankes', 'Fasyankes', e);
  req(f, 'poli', 'Unit/Poli', e);
  req(f, 'alamatPraktik', 'Alamat praktik', e);
  req(f, 'provinsi', 'Provinsi', e);
  req(f, 'kabupatenKota', 'Kabupaten/Kota', e);
  req(f, 'kecamatan', 'Kecamatan', e);
  req(f, 'desaKelurahan', 'Kelurahan/Desa', e);
  if (f.kodePos && !/^\d{5}$/.test(f.kodePos)) e.kodePos = 'Kode pos 5 digit';
  if (f.emailFasilitas && !EMAIL_REGEX.test(f.emailFasilitas)) e.emailFasilitas = 'Format email tidak valid';
  if (!adaFile) e.file = 'File SIP wajib diunggah';
  return e;
}

export function validateKompetensi(f: KompetensiForm): FormErrors<KompetensiForm> {
  const e: FormErrors<KompetensiForm> = {};
  req(f, 'nama', 'Nama kompetensi', e);
  req(f, 'penyelenggara', 'Penyelenggara', e);
  cekTanggal(f, 'tanggalPeroleh', 'Tanggal peroleh', e, true);
  cekTanggal(f, 'berlakuHingga', 'Berlaku hingga', e, false);
  urutTanggal(f, 'tanggalPeroleh', 'berlakuHingga', e, 'Berlaku hingga harus setelah tanggal peroleh');
  return e;
}

export function validatePenempatan(f: PenempatanForm): FormErrors<PenempatanForm> {
  const e: FormErrors<PenempatanForm> = {};
  req(f, 'fasyankes', 'Fasyankes', e);
  req(f, 'poli', 'Unit/Poli', e);
  req(f, 'ruangan', 'Lokasi/Ruangan', e);
  req(f, 'peran', 'Peran', e);
  cekTanggal(f, 'tanggalMulai', 'Tanggal mulai', e, true);
  cekTanggal(f, 'tanggalBerakhir', 'Tanggal berakhir', e, false);
  urutTanggal(f, 'tanggalMulai', 'tanggalBerakhir', e, 'Tanggal berakhir harus setelah tanggal mulai');
  if (f.catatan.length > 255) e.catatan = 'Maksimal 255 karakter';
  return e;
}

export function validateJadwalSetting(f: JadwalSettingForm): FormErrors<JadwalSettingForm> {
  const e: FormErrors<JadwalSettingForm> = {};
  req(f, 'tipeJadwal', 'Tipe jadwal', e);
  if (!/^\d+$/.test(f.kapasitasPerHari) || Number(f.kapasitasPerHari) < 1) e.kapasitasPerHari = 'Kapasitas minimal 1';
  req(f, 'durasiLayanan', 'Durasi layanan', e);
  if (f.jenisPasien.length === 0) e.jenisPasien = 'Pilih minimal satu jenis pasien';
  return e;
}

/** Validasi baris jadwal hari yang aktif. Mengembalikan pesan per hari. */
export function validateJadwalHari(rows: JadwalHariForm[]): Record<string, string> {
  const e: Record<string, string> = {};
  rows.filter((r) => r.aktif).forEach((r) => {
    if (!JAM_REGEX.test(r.jamMulai) || !JAM_REGEX.test(r.jamSelesai)) e[r.hari] = 'Jam wajib diisi (HH:MM)';
    else if (r.jamSelesai <= r.jamMulai) e[r.hari] = 'Jam selesai harus setelah jam mulai';
    else if (!/^\d+$/.test(r.kuota) || Number(r.kuota) < 1) e[r.hari] = 'Kuota minimal 1';
    else if (r.kuotaOnline && Number(r.kuotaOnline) > Number(r.kuota)) e[r.hari] = 'Kuota online melebihi kuota';
    else if (!r.durasiSlot) e[r.hari] = 'Durasi slot wajib diisi';
  });
  return e;
}

export function validateSlot(f: SlotForm): FormErrors<SlotForm> {
  const e: FormErrors<SlotForm> = {};
  if (!JAM_REGEX.test(f.jamMulai)) e.jamMulai = 'Jam mulai wajib (HH:MM)';
  if (!JAM_REGEX.test(f.jamSelesai)) e.jamSelesai = 'Jam selesai wajib (HH:MM)';
  else if (JAM_REGEX.test(f.jamMulai) && f.jamSelesai <= f.jamMulai) e.jamSelesai = 'Harus setelah jam mulai';
  if (f.adaIstirahat) {
    if (!JAM_REGEX.test(f.istirahatMulai)) e.istirahatMulai = 'Wajib (HH:MM)';
    if (!JAM_REGEX.test(f.istirahatSelesai)) e.istirahatSelesai = 'Wajib (HH:MM)';
    else if (f.istirahatSelesai <= f.istirahatMulai) e.istirahatSelesai = 'Harus setelah mulai istirahat';
    else if (f.istirahatMulai < f.jamMulai || f.istirahatSelesai > f.jamSelesai) e.istirahatMulai = 'Istirahat di luar jam praktik';
  }
  req(f, 'durasiLayanan', 'Durasi layanan', e);
  if (!/^\d+$/.test(f.kuota) || Number(f.kuota) < 1) e.kuota = 'Kuota minimal 1';
  if (!/^\d+$/.test(f.kuotaOnline)) e.kuotaOnline = 'Isi angka';
  else if (Number(f.kuotaOnline) > Number(f.kuota)) e.kuotaOnline = 'Melebihi kuota';
  if (f.jenisPasien.length === 0) e.jenisPasien = 'Pilih minimal satu';
  cekTanggal(f, 'berlakuMulai', 'Berlaku mulai', e, true);
  cekTanggal(f, 'berlakuHingga', 'Berlaku hingga', e, false);
  urutTanggal(f, 'berlakuMulai', 'berlakuHingga', e, 'Harus setelah berlaku mulai');
  req(f, 'pola', 'Pola', e);
  return e;
}

// ------------------------------ Payload ------------------------------
const TGL_KEYS = new Set(['tanggalLahir', 'tanggalTerbit', 'berlakuHingga', 'tanggalSk', 'tanggalPeroleh',
  'tanggalMulai', 'tanggalBerakhir', 'berlakuMulai']);

/** Ubah semua field tanggal DD-MM-YYYY → YYYY-MM-DD dan string kosong → null. */
export function toPayload<T extends object>(form: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  Object.entries(form).forEach(([k, v]) => {
    if (typeof v === 'string') {
      const t = v.trim();
      out[k] = t === '' ? null : TGL_KEYS.has(k) ? tanggalToIso(t) : t;
    } else out[k] = v;
  });
  return out;
}

/** Ubah response server (YYYY-MM-DD) → bentuk form (DD-MM-YYYY), null → ''. */
export function fromServer<T extends object>(data: T): T {
  const out: Record<string, unknown> = {};
  Object.entries(data).forEach(([k, v]) => {
    if (v === null || v === undefined) out[k] = '';
    else if (typeof v === 'string' && TGL_KEYS.has(k)) out[k] = isoToTanggal(v);
    else out[k] = v;
  });
  return out as T;
}

/** Laravel { errors: { "field": ["msg"] } } → { field: "msg" } */
export function flattenErrors<T>(errors?: Record<string, string[]>): FormErrors<T> {
  const out: Record<string, string> = {};
  Object.entries(errors ?? {}).forEach(([k, v]) => { out[k] = v[0]; });
  return out as FormErrors<T>;
}

export function validasiFile(file: File, mimes: string[]): string | null {
  if (!mimes.includes(file.type)) return 'Format file tidak didukung';
  if (file.size > MAX_FILE_BYTES) return 'Ukuran file maksimal 2MB';
  return null;
}

/** Perkiraan slot dari jam & durasi, dikurangi istirahat. Murni tampilan (preview). */
export function buatPreviewSlot(r: Pick<JadwalHariForm, 'jamMulai' | 'jamSelesai' | 'durasiSlot' | 'istirahatMulai' | 'istirahatSelesai'>): string[] {
  const toMin = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const fmt = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  const dur = parseInt(r.durasiSlot, 10);
  if (!JAM_REGEX.test(r.jamMulai) || !JAM_REGEX.test(r.jamSelesai) || !dur) return [];
  const [end, bs, be] = [toMin(r.jamSelesai), JAM_REGEX.test(r.istirahatMulai) ? toMin(r.istirahatMulai) : -1,
    JAM_REGEX.test(r.istirahatSelesai) ? toMin(r.istirahatSelesai) : -1];
  const out: string[] = [];
  for (let t = toMin(r.jamMulai); t + dur <= end; t += dur) {
    if (bs >= 0 && t < be && t + dur > bs) continue;
    out.push(`${fmt(t)} - ${fmt(t + dur)}`);
  }
  return out;
}

export const getInisial = (nama: string) =>
  nama.replace(/^(dr\.|drg\.|apt\.|ns\.)\s*/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('');
