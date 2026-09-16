import { JenisKelamin, JenisPenjamin, StatusPasien } from '../common';

interface IntegrasiSatuSehat {
  statusTerhubung: boolean;
  ihsNumber: string;          // "PXXXXXXXXX"
  nikDukcapil: string;
  terakhirSinkron: string;    // "16-08-2026 07:58 WIB"
}

interface Pasien {
  nomorRM: string;            // Nomor Rekam Medis, contoh: "RM000036"
  namaLengkap: string;
  jenisKelamin: JenisKelamin;
  tanggalLahir: string;       // "DD-MM-YYYY" (02-03-2016)
  usiaString: string;         // Contoh: "8 th"
  nik: string;                // "3271********9012"
  noTelepon: string;          // "0815********"
  penjaminUtama: JenisPenjamin;
  alamat: string;
  status: StatusPasien;
  satuSehat?: IntegrasiSatuSehat;
}

interface HasilPencarianPasien extends Pasien {
  tanggalKunjunganTerakhir?: string; // "11-08-2026"
  poliKunjunganTerakhir?: string;    // "Poli Anak"
}

export type { Pasien, HasilPencarianPasien };