interface Pendaftaran {
    id: number;
    nomorRM: string;
    jenisIdentitas: string
    nik: string;
    namaLengkap: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: string;
    /** Alamat Sesuai Identitas */
    alamatLengkap: string;
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


export type { Pendaftaran };