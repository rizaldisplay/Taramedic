

interface InformasiPendaftaran {
    petugasPendaftaran: string;
    loketPendaftaran: string;
    tanggal: string;
    waktu: string;
}

interface Ecounter {
  idKunjungan: string; 
  poli: string;
  dokterNakes: string;
  jenisLayanan: string;     
  caraMasuk: string;    
  penjamin: string;  
  jenisPembayaran: string;   
  prioritas: string;
  loketPendaftaran: string;
  lokasiPelayanan: string;
  informasiPendaftaran: InformasiPendaftaran;
}

export type { InformasiPendaftaran, Ecounter }
