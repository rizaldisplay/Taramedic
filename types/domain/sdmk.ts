// ----------------------------------------------------------------------
// Type domain SDMK (Sumber Daya Manusia Kesehatan)
// Lokasi: src/types/domain/sdmk.ts
// Tanggal di backend: YYYY-MM-DD. Tanggal di form: DD-MM-YYYY.
// Kode wilayah (provinsi..desa) berisi KODE Kemendagri dari Wilayah.id.
// ----------------------------------------------------------------------

export type SdmkTabKey =
  | 'identitas'
  | 'profesi'
  | 'registrasi'
  | 'penempatan'
  | 'jadwal'
  | 'integrasi'
  | 'catatan';

export type StatusSdmk = 'Aktif' | 'Tidak Aktif' | 'Cuti' | 'Berakhir Kontrak';
export type StatusIzin = 'Aktif' | 'Akan Berakhir' | 'Tidak Aktif';
export type StatusPenempatan = 'Aktif' | 'Nonaktif';
export type StatusJadwal = 'Aktif' | 'Tidak Aktif';
export type Hari = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
export type StatusIhs = 'belum' | 'terhubung' | 'gagal';
export type StatusStr = 'Valid' | 'Kedaluwarsa' | 'Belum Diverifikasi';

export interface Opsi {
  value: string;
  label: string;
}

/** Opsi dropdown dari backend (GET /sdmk/options) */
export interface SdmkOptions {
  jenisSdmk: Opsi[];
  profesi: (Opsi & { jenisSdmk: string; kode: string })[];
  kompetensiUtama: Opsi[];
  spesialisasi: Opsi[];
  subSpesialisasi: (Opsi & { spesialisasi: string })[];
  tingkatPendidikan: Opsi[];
  kewarganegaraan: Opsi[];
  hubungan: Opsi[];
  organisasiPenerbitStr: Opsi[];
  jenisSip: Opsi[];
  fasyankes: Opsi[];
  poli: (Opsi & { fasyankes?: string })[];
  ruangan: (Opsi & { poli?: string })[];
  peranUnit: Opsi[];
  jabatan: Opsi[];
  tipeJadwal: Opsi[];
  durasiLayanan: Opsi[];
  jenisPasien: Opsi[];
  polaJadwal: Opsi[];
  mappingSpesialisasi: Opsi[];
  tipePraktisi: Opsi[];
}

// ---------------------------- Form (tab) ------------------------------

export interface IdentitasForm {
  nik: string;
  namaLengkap: string;
  gelarDepan: string;
  gelarBelakang: string;
  tempatLahir: string;
  tanggalLahir: string; // DD-MM-YYYY
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  kewarganegaraan: string;
  nomorHP: string;
  email: string;
  alamatLengkap: string;
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  desaKelurahan: string;
  rt: string;
  rw: string;
  kodePos: string;
  namaKontakDarurat: string;
  hubunganKontakDarurat: string;
  nomorHPKontakDarurat: string;
}

export interface ProfesiForm {
  jenisSdmk: string;
  profesi: string;
  kompetensiUtama: string;
  spesialisasi: string;
  subSpesialisasi: string;
  tingkatPendidikan: string;
  institusi: string;
  tahunLulus: string;
  status: StatusSdmk;
}

export interface StrForm {
  nomorStr: string;
  tanggalTerbit: string;
  berlakuHingga: string;
  organisasiPenerbit: string;
}

export interface SipForm {
  nomorSip: string;
  jenisSip: string;
  tanggalTerbit: string;
  berlakuHingga: string;
  status: StatusIzin;
  tempatTerbit: string;
  nomorSk: string;
  tanggalSk: string;
  fasyankes: string;
  poli: string;
  ruangan: string;
  alamatPraktik: string;
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  desaKelurahan: string;
  kodePos: string;
  telepon: string;
  emailFasilitas: string;
}

export interface KompetensiForm {
  nama: string;
  penyelenggara: string;
  tanggalPeroleh: string;
  berlakuHingga: string;
}

export interface PenempatanForm {
  fasyankes: string;
  poli: string;
  ruangan: string;
  peran: string;
  jabatan: string;
  status: StatusPenempatan;
  tanggalMulai: string;
  tanggalBerakhir: string;
  penanggungJawabUnit: boolean;
  catatan: string;
}

export interface JadwalSettingForm {
  tipeJadwal: string;
  kapasitasPerHari: string;
  durasiLayanan: string;
  jenisPasien: string[];
  status: StatusJadwal;
}

export interface JadwalHariForm {
  hari: Hari;
  aktif: boolean;
  jamMulai: string;
  jamSelesai: string;
  durasiSlot: string;
  kuota: string;
  kuotaOnline: string;
  istirahatMulai: string;
  istirahatSelesai: string;
  jenisPasien: string[];
  status: StatusJadwal;
}

export interface SlotForm {
  hari: Hari;
  jamMulai: string;
  jamSelesai: string;
  adaIstirahat: boolean;
  istirahatMulai: string;
  istirahatSelesai: string;
  durasiLayanan: string;
  kuota: string;
  kuotaOnline: string;
  jenisPasien: string[];
  berlakuMulai: string;
  berlakuHingga: string;
  pola: string;
  status: StatusJadwal;
}

export interface IntegrasiForm {
  mappingSpesialisasi: string;
  mappingTipePraktisi: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

// --------------------------- Data dari server -------------------------

export interface SdmkListItem {
  id: number;
  sdmkId: string; // mis. SDMK-000001
  namaLengkap: string; // sudah termasuk gelar
  profesi: string;
  spesialisasi: string | null;
  status: StatusSdmk;
  statusIzin: StatusIzin;
  nomorStr: string | null;
  tempatPraktikUtama: string | null;
  statusIhs: StatusIhs;
  inisial: string;
}

export interface SdmkStats {
  total: number;
  aktif: number;
  tidakAktif: number;
  izinSegeraBerakhir: number;
  izinKadaluwarsa: number;
  belumTersinkron: number;
}

export interface Kompetensi extends KompetensiForm {
  id: number;
  dokumenUrl: string | null;
}

export interface Str extends StrForm {
  status: StatusStr;
  tanggalVerifikasi: string | null;
}

export interface Sip extends SipForm {
  id: number;
  dokumenUrl: string | null;
  tempatPraktik: string;
  wilayah: string;
}

export interface Penempatan extends PenempatanForm {
  id: number;
  fasyankesNama: string;
  poliNama: string;
  ruanganNama: string;
}

export interface Slot extends SlotForm {
  id: number;
}

export interface ApiLog {
  id: number;
  waktu: string;
  aksi: string;
  status: 'Berhasil' | 'Gagal';
  pesan: string | null;
}

export interface Integrasi extends IntegrasiForm {
  statusIhs: StatusIhs;
  ihsNumber: string | null;
  organizationId: string | null;
  terakhirSinkron: string | null;
  logs: ApiLog[];
}

export interface SdmkDetail {
  id: number;
  sdmkId: string;
  identitas: IdentitasForm & { fotoUrl: string | null };
  profesi: ProfesiForm & { kodeProfesi: string };
  kompetensi: Kompetensi[];
  str: Str | null;
  sip: Sip[];
  sertifikatLain: string;
  penempatan: Penempatan[];
  jadwalSetting: JadwalSettingForm | null;
  jadwalHari: JadwalHariForm[];
  slots: Slot[];
  integrasi: Integrasi;
  catatan: string;
  statusIzin: StatusIzin;
  createdAt: string;
  updatedAt: string;
}

export interface SdmkHistoryItem {
  id: number;
  waktu: string;
  aksi: string;
  oleh: string;
  keterangan: string | null;
}

export interface Paginated<T> {
  data: T[];
  meta: { currentPage: number; lastPage: number; perPage: number; total: number };
}

export interface ApiRejectValue {
  message: string;
  fieldErrors?: Record<string, string>;
}
