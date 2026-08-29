'use client';

import React from 'react';
import { 
  X, 
  Info, 
  Printer, 
  Download, 
  QrCode 
} from 'lucide-react';

// --- Interfaces & Types ---
export interface ItemObatBukti {
  no: number;
  namaObat: string;
  bentukKekuatan: string;
  aturanPakai: string;
  jumlahDiserahkan: number;
  satuan: string;
}

export interface ItemRacikanBukti {
  no: number;
  namaRacikan: string;
  bentukRacikan: string;
  aturanPakai: string;
  jumlahDiserahkan: number;
  satuan: string;
}

export interface BuktiSerahObatData {
  noBso: string;
  noAntrian: string;
  namaPasien: string;
  tanggalLahir: string;
  poli: string;
  dokter: string;
  waktuSerah: string;
  diserahkanOleh: string;
  diserahkanKepada: string;
  noIdentitasKtp: string;
  
  nonRacikanList: ItemObatBukti[];
  racikanList: ItemRacikanBukti[];
  
  totalJumlahItem: string;
  totalJumlahObat: number;
  
  catatanEdukasi: string[];
  penerimaNama: string;
}

export interface CetakBuktiSerahObatModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<BuktiSerahObatData>;
  onCetak?: () => void;
  onDownloadPdf?: () => void;
}

export default function CetakBuktiSerahObatModal({
  isOpen,
  onClose,
  data,
  onCetak,
  onDownloadPdf,
}: CetakBuktiSerahObatModalProps) {
  if (!isOpen) return null;

  // Data default acuan dari gambar screenshot
  const bukti: BuktiSerahObatData = {
    noBso: data?.noBso ?? 'No. BSO/20260816/00045',
    noAntrian: data?.noAntrian ?? 'A013',
    namaPasien: data?.namaPasien ?? 'Rizka Amalia',
    tanggalLahir: data?.tanggalLahir ?? '02/03/2016 (8 thn)',
    poli: data?.poli ?? 'Poli Anak',
    dokter: data?.dokter ?? 'dr. Bima, Sp.A',

    waktuSerah: data?.waktuSerah ?? '16/08/2026, 08:43 WIB',
    diserahkanOleh: data?.diserahkanOleh ?? 'Siti Rahma, A.Md.Kep (Apoteker)',
    diserahkanKepada: data?.diserahkanKepada ?? 'Dewi Amalia (Ibu Kandung)',
    noIdentitasKtp: data?.noIdentitasKtp ?? '3275016205880002',

    nonRacikanList: data?.nonRacikanList ?? [
      {
        no: 1,
        namaObat: 'Paracetamol',
        bentukKekuatan: 'Tablet 500 mg',
        aturanPakai: '3 x sehari sesudah makan',
        jumlahDiserahkan: 10,
        satuan: 'Tablet',
      },
      {
        no: 2,
        namaObat: 'Cetirizine',
        bentukKekuatan: 'Tablet 10 mg',
        aturanPakai: '1 x sehari malam hari',
        jumlahDiserahkan: 5,
        satuan: 'Tablet',
      },
    ],

    racikanList: data?.racikanList ?? [
      {
        no: 1,
        namaRacikan: 'Racikan 1 - Puyer',
        bentukRacikan: 'Puyer',
        aturanPakai: '3 x sehari sesudah makan',
        jumlahDiserahkan: 10,
        satuan: 'Bungkus',
      },
    ],

    totalJumlahItem: data?.totalJumlahItem ?? '3 item',
    totalJumlahObat: data?.totalJumlahObat ?? 25,

    catatanEdukasi: data?.catatanEdukasi ?? [
      'Minum obat sesuai aturan pakai.',
      'Simpan obat di tempat sejuk dan kering, terhindar dari sinar matahari langsung.',
      'Jauhkan dari jangkauan anak-anak.',
      'Jika timbul efek samping atau keluhan lain, segera konsultasikan ke dokter.',
    ],

    penerimaNama: data?.penerimaNama ?? 'Dewi Amalia',
  };

  const handlePrint = () => {
    if (onCetak) {
      onCetak();
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-slate-100 transition-all transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Cetak Bukti Serah Obat</h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-5 max-h-[82vh] overflow-y-auto bg-slate-50/30">
          
          {/* Info Banner */}
          <div className="bg-cyan-50/70 border border-cyan-100 rounded-xl p-3 flex items-center gap-2.5 text-cyan-700 text-xs font-medium">
            <Info className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>Preview bukti serah obat. Pastikan data sudah benar sebelum dicetak.</span>
          </div>

          {/* DOCUMENT SHEET PREVIEW (Lembar Dokumen Fisik BSO) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col gap-5 text-xs text-slate-800">
            
            {/* Header Dokumen: Logo, Judul & QR Code */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              {/* Branding Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  ✦
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-cyan-600 tracking-wider text-sm">TARAMEDIC</span>
                  <span className="text-[10px] text-slate-400 font-medium">Excellent Medical Partner</span>
                </div>
              </div>

              {/* Judul Dokumen */}
              <div className="text-center">
                <h1 className="font-extrabold text-slate-900 text-base uppercase tracking-tight">
                  BUKTI SERAH OBAT
                </h1>
                <span className="text-slate-500 font-mono text-xs font-semibold">{bukti.noBso}</span>
              </div>

              {/* QR Code */}
              <div className="p-1 bg-slate-50 border border-slate-200 rounded-lg">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
            </div>

            {/* Grid Informasi Pasien & Penyerahan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 border-b border-slate-100 pb-4">
              
              {/* Kolom Kiri: Info Pasien */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">No. Antrian</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-extrabold text-slate-900">{bukti.noAntrian}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">Nama Pasien</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-bold text-slate-900">{bukti.namaPasien}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">Tanggal Lahir</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-800">{bukti.tanggalLahir}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">Poli</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-800">{bukti.poli}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">Dokter</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-800">{bukti.dokter}</span>
                </div>
              </div>

              {/* Kolom Kanan: Info Penyerahan */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500 font-medium">Waktu Serah</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-semibold text-slate-800">{bukti.waktuSerah}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500 font-medium">Diserahkan oleh</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-semibold text-slate-800">{bukti.diserahkanOleh}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500 font-medium">Diserahkan kepada</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-slate-900">{bukti.diserahkanKepada}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500 font-medium">No. Identitas (KTP)</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-semibold font-mono text-slate-800">{bukti.noIdentitasKtp}</span>
                </div>
              </div>

            </div>

            {/* TABEL OBAT YANG DISERAHKAN */}
            <div className="flex flex-col gap-3">
              <h3 className="font-extrabold text-slate-900 text-xs tracking-wider uppercase">
                OBAT YANG DISERAHKAN
              </h3>

              {/* Non-Racikan */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase">
                  NON-RACIKAN
                </span>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                        <th className="p-2 w-8 text-center">No.</th>
                        <th className="p-2">Nama Obat</th>
                        <th className="p-2">Bentuk / Kekuatan</th>
                        <th className="p-2">Aturan Pakai</th>
                        <th className="p-2 text-center">Jumlah Diserahkan</th>
                        <th className="p-2">Satuan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                      {bukti.nonRacikanList.map((item) => (
                        <tr key={item.no}>
                          <td className="p-2 text-center text-slate-500 font-normal">{item.no}</td>
                          <td className="p-2 font-bold">{item.namaObat}</td>
                          <td className="p-2 font-normal text-slate-700">{item.bentukKekuatan}</td>
                          <td className="p-2 font-normal text-slate-700">{item.aturanPakai}</td>
                          <td className="p-2 text-center font-bold">{item.jumlahDiserahkan}</td>
                          <td className="p-2 font-normal text-slate-600">{item.satuan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Racikan */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase">
                  RACIKAN
                </span>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                        <th className="p-2 w-8 text-center">No.</th>
                        <th className="p-2">Nama Racikan</th>
                        <th className="p-2">Bentuk Racikan</th>
                        <th className="p-2">Aturan Pakai</th>
                        <th className="p-2 text-center">Jumlah Diserahkan</th>
                        <th className="p-2">Satuan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                      {bukti.racikanList.map((item) => (
                        <tr key={item.no}>
                          <td className="p-2 text-center text-slate-500 font-normal">{item.no}</td>
                          <td className="p-2 font-bold">{item.namaRacikan}</td>
                          <td className="p-2 font-normal text-slate-700">{item.bentukRacikan}</td>
                          <td className="p-2 font-normal text-slate-700">{item.aturanPakai}</td>
                          <td className="p-2 text-center font-bold">{item.jumlahDiserahkan}</td>
                          <td className="p-2 font-normal text-slate-600">{item.satuan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Summary Row */}
              <div className="flex items-center gap-6 text-xs pt-1 font-semibold">
                <div>
                  <span className="text-slate-500 font-medium">Total Jumlah Item : </span>
                  <span className="font-bold text-slate-900">{bukti.totalJumlahItem}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Total Jumlah Obat : </span>
                  <span className="font-bold text-slate-900">{bukti.totalJumlahObat}</span>
                  <span className="text-slate-400 font-normal ml-1">(Tablet/Bungkus)</span>
                </div>
              </div>
            </div>

            {/* GRID CATATAN EDUKASI & TANDA TANGAN PENERIMA */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-t border-slate-100 pt-4">
              
              {/* Catatan Edukasi (8 COLS) */}
              <div className="md:col-span-8 flex flex-col gap-1.5 pr-2">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  CATATAN / EDUKASI
                </h4>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 leading-relaxed">
                  {bukti.catatanEdukasi.map((poin, idx) => (
                    <li key={idx}>{poin}</li>
                  ))}
                </ul>
              </div>

              {/* Tanda Tangan Penerima (4 COLS) */}
              <div className="md:col-span-4 flex flex-col items-center justify-end text-center border-l border-slate-100 pl-4 min-h-[100px]">
                <span className="text-[11px] text-slate-500 font-medium mb-2">
                  Tanda Tangan Penerima
                </span>

                {/* Signature Graphic */}
                <div className="h-12 flex items-center justify-center my-1">
                  <svg className="w-28 h-10 text-slate-800" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M10 25 C 20 10, 25 35, 35 15 C 45 5, 40 30, 55 20 C 65 10, 70 30, 85 15 C 90 25, 95 10, 80 35" />
                  </svg>
                </div>

                <span className="font-bold text-slate-900 text-xs">
                  ( {bukti.penerimaNama} )
                </span>
              </div>

            </div>

          </div>

          {/* Action Buttons Bar Modal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Tombol Cetak */}
              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-cyan-600 font-bold text-xs rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-cyan-600" />
                <span>Cetak</span>
              </button>

              {/* Tombol Download PDF */}
              <button
                type="button"
                onClick={onDownloadPdf}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-cyan-600 font-bold text-xs rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-600" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-32 py-2.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}