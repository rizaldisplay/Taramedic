// sdmk.types.ts

// ==========================================
// TAB 1: IDENTITAS
// ==========================================
export type JenisKelamin = 'Laki-laki' | 'Perempuan';

export interface IdentitasPribadi {
  nik: string; // Wajib: 16 digit NIK
  namaLengkap: string; // Wajib
  gelarDepan?: string;
  gelarBelakang?: string;
  tempatLahir?: string;
  tanggalLahir?: string; // Format: YYYY-MM-DD
  jenisKelamin: JenisKelamin; // Wajib
  kewarganegaraan: string; // Wajib, default: 'Indonesia'
  noHp?: string;
  email?: string;
  alamatLengkap: string; // Wajib
  provinsi?: string;
  kabupatenKota?: string;
  kecamatan?: string;
  kelurahanDesa?: string;
  rt?: string;
  rw?: string;
  kodePos?: string;
}

export interface KontakDarurat {
  namaKontak: string; // Wajib
  hubungan?: string;
  noHpKontak: string; // Wajib
}

export interface IdentitasSdmk {
  sdmkId: string; // Dibuat otomatis oleh sistem
  fotoProfilUrl?: string; // URL atau path file
  pribadi: IdentitasPribadi;
  kontakDarurat: KontakDarurat;
}

// ==========================================
// TAB 2: PROFESI & KOMPETENSI
// ==========================================
export type StatusSdmk = 'Draf' | 'Aktif' | 'Nonaktif';

export interface KompetensiTambahan {
  id?: string;
  namaSertifikat: string;
  fileUrl?: string;
}

export interface ProfesiKompetensi {
  jenisSdmk: string; // Wajib, cth: 'Tenaga Medis'
  kodeProfesiInternal?: string;
  profesi: string; // Wajib, cth: 'Dokter, Perawat, Apoteker'
  pendidikanTerakhir: string; // Wajib
  kompetensiUtama: string; // Wajib
  institusiPendidikan?: string;
  spesialisasi?: string;
  tahunLulus?: number;
  subSpesialisasi?: string;
  statusSdmk: StatusSdmk; // Wajib
  kompetensiTambahan?: KompetensiTambahan[];
}

// ==========================================
// TAB 3: REGISTRASI & PERIZINAN
// ==========================================
export interface SuratTandaRegistrasi {
  nomorStr: string; // Wajib
  tanggalTerbit: string; // Wajib
  berlakuHingga: string; // Wajib
  organisasiPenerbit: string; // Wajib
  statusStr: string; // cth: 'Menunggu verifikasi'
  tanggalVerifikasi?: string;
}

export interface SuratIzinPraktik {
  id?: string;
  nomorSip: string; // Wajib
  jenisSip: string; // Wajib
  tanggalTerbit: string; // Wajib
  berlakuHingga: string; // Wajib
  statusSip: string; // Wajib, cth: 'Aktif'
  tempatTerbit?: string;
  namaFasilitas: string; // Wajib
  unitPoli: string; // Wajib
  lokasiRuangan?: string;
  alamatPraktik?: string;
  lampiranDokumenUrl?: string; // File SIP
}

export interface RegistrasiPerizinan {
  str: SuratTandaRegistrasi;
  sip: SuratIzinPraktik[]; // Bisa lebih dari satu SIP
  sertifikatLainOpsional?: string;
  lampiranSertifikatLainUrl?: string;
}

// ==========================================
// TAB 4: PENEMPATAN
// ==========================================
export interface Penempatan {
  id?: string;
  fasyankes: string; // Wajib
  unitPoli: string; // Wajib
  lokasiRuangan?: string;
  peranDiUnit?: string;
  jabatan?: string;
  statusPenempatan: string; // Wajib, cth: 'Aktif'
  tanggalMulai?: string;
  tanggalBerakhir?: string;
  penanggungJawabUnit?: string;
  catatan?: string;
}

// ==========================================
// TAB 5: JADWAL PRAKTIK
// ==========================================
export type TipeJadwal = 'Berulang (Mingguan)' | 'Satu kali / khusus';
export type JenisPasienDilayani = 'Umum' | 'BPJS' | 'Asuransi' | 'Perusahaan';

export interface SlotWaktu {
  id?: string;
  hari: string; // Wajib, cth: 'Senin', 'Selasa'
  jamMulai: string; // Wajib, cth: '08:00 AM'
  jamSelesai: string; // Wajib, cth: '12:00 PM'
  jamIstirahatMulai?: string;
  jamIstirahatSelesai?: string;
  kapasitasKuota?: number;
  kuotaOnline?: number;
  berlakuMulai?: string;
  berlakuHingga?: string;
  statusSlot: string; // cth: 'Aktif'
}

export interface JadwalPraktik {
  tipeJadwal: TipeJadwal;
  kapasitasPerHari?: number;
  durasiLayananPerPasien?: string; // cth: '15 menit'
  statusJadwal: string; // cth: 'Aktif'
  jenisPasienDilayani: JenisPasienDilayani[];
  jadwalMingguan: SlotWaktu[];
}

// ==========================================
// TAB 6: INTEGRASI
// ==========================================
export interface IntegrasiSatuSehat {
  nomorIhs?: string;
  namaDiSatuSehat?: string;
  kesiapanData?: string; // cth: 'Belum dinilai'
}

export interface IntegrasiBpjs {
  nomorProvider?: string;
  namaDiBpjs?: string;
  jenisProvider?: string;
  statusKredensial?: string; // cth: 'Belum dikonfigurasi'
}

export interface IntegrasiFhir {
  endpointBaseUrl?: string;
  versiFhir?: string; // cth: 'R4'
  autentikasiClientId?: string;
  statusKoneksi?: string;
}

export interface IntegrasiSistem {
  satuSehat: IntegrasiSatuSehat;
  bpjsKesehatan: IntegrasiBpjs;
  koneksiApiFhir: IntegrasiFhir;
}

// ==========================================
// TAB 7: CATATAN
// ==========================================
export interface CatatanSdmk {
  catatanInternal?: string;
}

// ==========================================
// ROOT INTERFACE / MASTER TYPE
// ==========================================
export interface SdmkRegistrationData {
  identitas: IdentitasSdmk;
  profesiKompetensi: ProfesiKompetensi;
  registrasiPerizinan: RegistrasiPerizinan;
  daftarPenempatan: Penempatan[]; // Format Array karena bisa banyak penempatan
  jadwalPraktik: JadwalPraktik;
  integrasi: IntegrasiSistem;
  catatan: CatatanSdmk;
}