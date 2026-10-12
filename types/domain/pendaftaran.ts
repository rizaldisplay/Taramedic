// ----------------------------------------------------------------------
// Type domain Pendaftaran Pasien
// Lokasi yang disarankan: src/types/domain/pendaftaran.ts
// ----------------------------------------------------------------------

type JenisIdentitas = 'NIK' | 'TANPA_NIK' | 'WNA';
type JenisKelamin = 'Laki-laki' | 'Perempuan';

/** Data pasien sebagaimana disimpan di backend (sudah punya id & nomor RM) */
interface Pendaftaran {
    id: number;
    nomorRM: string;
    jenisIdentitas: JenisIdentitas;
    /** NIK (jenis NIK), nomor paspor (WNA), atau kosong (Tanpa NIK) */
    nik: string;
    namaLengkap: string;
    tempatLahir: string;
    /** Di backend: YYYY-MM-DD. Di form: DD-MM-YYYY */
    tanggalLahir: string;
    jenisKelamin: JenisKelamin;
    /** Alamat Sesuai Identitas */
    alamatLengkap: string;
    /** Provinsi s/d desaKelurahan berisi KODE wilayah (mis. Kemendagri), bukan nama */
    provinsi: string;
    kabupatenKota: string;
    kecamatan: string;
    desaKelurahan: string;
    rt: string;
    rw: string;
    kodePos: string;
    /** Kontak Pasien */
    nomorHP: string;
    email: string;
    /** Data Administrasi */
    nomorKK: string;
    statusPerkawinan: string;
    kewarganegaraan: string;
    bahasa: string;
    /** Kontak Darurat  */
    namaKontakDarurat: string;
    hubunganKontakDarurat: string;
    nomorHPKontakDarurat: string;
}

/**
 * Data yang diisi di form (belum punya id & nomor RM).
 * jenisKelamin boleh kosong sebelum dipilih agar petugas tidak
 * tanpa sengaja menyimpan nilai default.
 */
type PendaftaranForm = Omit<Pendaftaran, 'id' | 'nomorRM' | 'jenisKelamin'> & {
    jenisKelamin: JenisKelamin | '';
};

/** Pesan error per field, kuncinya sama dengan PendaftaranForm */
type PendaftaranFormErrors = Partial<Record<keyof PendaftaranForm, string>>;

// ---- Wilayah (dropdown bertingkat) ----------------------------------
type WilayahLevel = 'provinsi' | 'kabupaten' | 'kecamatan' | 'desa';

interface Wilayah {
    kode: string;
    nama: string;
}

// ---- Cek NIK ---------------------------------------------------------
type NikStatus = 'idle' | 'checking' | 'available' | 'exists' | 'error';

interface CekNikResult {
    terdaftar: boolean;
    pasien: Pendaftaran | null;
}

// ---- Payload & error API ---------------------------------------------
interface SimpanPasienPayload {
    data: PendaftaranForm;
    /** ID tiket antrean yang sedang dilayani (opsional, untuk menautkan pasien ke antrean) */
    tiketId?: string;
}

interface ApiRejectValue {
    message: string;
    fieldErrors?: PendaftaranFormErrors;
}

export type {
    Pendaftaran,
    PendaftaranForm,
    PendaftaranFormErrors,
    JenisIdentitas,
    JenisKelamin,
    Wilayah,
    WilayahLevel,
    NikStatus,
    CekNikResult,
    SimpanPasienPayload,
    ApiRejectValue,
};
