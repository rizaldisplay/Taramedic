'use client';

import React from 'react';
import { X, CheckCircle2, Printer } from 'lucide-react';

// --- Types & Interfaces ---
export interface ItemObatDetail {
  no: number;
  namaObat: string;
  bentukKekuatan: string;
  aturanPakai: string;
  jumlahDiserahkan: number;
  satuan: string;
}

export interface ItemRacikanDetail {
  no: number;
  namaRacikan: string;
  bentukRacikan: string;
  aturanPakai: string;
  jumlahDiserahkan: number;
  satuan: string;
}

export interface DetailRiwayatData {
  // Informasi Resep
  noResep: string;
  tanggalResep: string;
  waktuResep: string;
  dokter: string;
  poli: string;
  noAntrean: string;

  // Informasi Penyerahan
  waktuSerah: string;
  diserahkanOleh: string;
  diterimaOleh: string;
  noIdentitasPenerima: string;
  caraTerima: string;
  status: string;

  // Daftar Obat
  nonRacikanList: ItemObatDetail[];
  racikanList: ItemRacikanDetail[];

  // Catatan
  catatanFarmasi?: string;
}

export interface DetailRiwayatResepModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<DetailRiwayatData>;
  onCetakBukti?: () => void;
  onLihatKomposisi?: (no: number) => void;
}

export default function DetailRiwayatResepModal({
  isOpen,
  onClose,
  data,
  onCetakBukti,
  onLihatKomposisi,
}: DetailRiwayatResepModalProps) {
  if (!isOpen) return null;

  // Data default acuan dari gambar
  const detail: DetailRiwayatData = {
    noResep: data?.noResep ?? 'RSP/20260816/00045',
    tanggalResep: data?.tanggalResep ?? '16/08/2026',
    waktuResep: data?.waktuResep ?? '08:20 WIB',
    dokter: data?.dokter ?? 'dr. Bima, Sp.A',
    poli: data?.poli ?? 'Poli Anak',
    noAntrean: data?.noAntrean ?? 'A013',

    waktuSerah: data?.waktuSerah ?? '16/08/2026, 08:43 WIB',
    diserahkanOleh: data?.diserahkanOleh ?? 'Siti Rahma, A.Md.Kep (Apoteker)',
    diterimaOleh: data?.diterimaOleh ?? 'Dewi Amalia (Ibu Kandung)',
    noIdentitasPenerima: data?.noIdentitasPenerima ?? '3275016205880002',
    caraTerima: data?.caraTerima ?? 'Langsung',
    status: data?.status ?? 'Selesai',

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

    catatanFarmasi: data?.catatanFarmasi ?? 'Tidak ada catatan.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-slate-100 transition-all transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Detail Riwayat Resep</h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-6 max-h-[82vh] overflow-y-auto bg-slate-50/30">
          
          {/* Banner Status Selesai */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Resep telah selesai dan obat telah diserahkan kepada pasien.</span>
          </div>

          {/* Grid Informasi Resep & Informasi Penyerahan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            
            {/* INFORMASI RESEP */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
                INFORMASI RESEP
              </h3>
              
              <div className="space-y-2 text-slate-700">
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">No. Resep</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-bold text-slate-900">{detail.noResep}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">Tanggal Resep</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-800">{detail.tanggalResep}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">Waktu Resep</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-800">{detail.waktuResep}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">Dokter</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-800">{detail.dokter}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">Poli</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-800">{detail.poli}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-medium">No. Antrean</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 font-semibold text-slate-800">{detail.noAntrean}</span>
                </div>
              </div>
            </div>

            {/* INFORMASI PENYERAHAN */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
                INFORMASI PENYERAHAN
              </h3>
              
              <div className="space-y-2 text-slate-700">
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500 font-medium">Waktu Serah</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-semibold text-slate-800">{detail.waktuSerah}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500 font-medium">Diserahkan oleh</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-semibold text-slate-800">{detail.diserahkanOleh}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500 font-medium">Diterima oleh</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-semibold text-slate-800">{detail.diterimaOleh}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500 font-medium">No. Identitas Penerima (KTP)</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-semibold font-mono text-slate-800">{detail.noIdentitasPenerima}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500 font-medium">Cara Terima</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-semibold text-slate-800">{detail.caraTerima}</span>
                </div>

                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-500 font-medium">Status</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <div className="col-span-6">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border border-emerald-200/60 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {detail.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CARD OBAT YANG DISERAHKAN */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col gap-4">
            <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase border-b border-slate-100 pb-2">
              OBAT YANG DISERAHKAN
            </h3>

            {/* A. NON-RACIKAN */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                  A
                </span>
                <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                  NON-RACIKAN
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  ({detail.nonRacikanList.length} item)
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80">
                    <tr>
                      <th className="p-3 w-10 text-center">No.</th>
                      <th className="p-3">Nama Obat</th>
                      <th className="p-3">Bentuk / Kekuatan</th>
                      <th className="p-3">Aturan Pakai</th>
                      <th className="p-3 text-center">Jumlah Diserahkan</th>
                      <th className="p-3">Satuan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {detail.nonRacikanList.map((item) => (
                      <tr key={item.no} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 font-semibold text-slate-800 text-center">{item.no}</td>
                        <td className="p-3 font-bold text-slate-900">{item.namaObat}</td>
                        <td className="p-3 font-medium text-slate-700">{item.bentukKekuatan}</td>
                        <td className="p-3 font-medium text-slate-700">{item.aturanPakai}</td>
                        <td className="p-3 text-center font-bold text-slate-800">{item.jumlahDiserahkan}</td>
                        <td className="p-3 text-slate-600">{item.satuan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* B. RACIKAN */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                  B
                </span>
                <span className="text-xs font-bold text-purple-700 tracking-wider uppercase">
                  RACIKAN
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  ({detail.racikanList.length} item)
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80">
                    <tr>
                      <th className="p-3 w-10 text-center">No.</th>
                      <th className="p-3">Nama Racikan</th>
                      <th className="p-3">Bentuk Racikan</th>
                      <th className="p-3">Aturan Pakai</th>
                      <th className="p-3 text-center">Jumlah Diserahkan</th>
                      <th className="p-3">Satuan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {detail.racikanList.map((item) => (
                      <tr key={item.no} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 font-semibold text-slate-800 text-center">{item.no}</td>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{item.namaRacikan}</span>
                            <button
                              type="button"
                              onClick={() => onLihatKomposisi && onLihatKomposisi(item.no)}
                              className="text-blue-600 hover:text-blue-700 text-[11px] font-semibold text-left mt-0.5 transition-colors cursor-pointer w-fit"
                            >
                              Lihat Komposisi
                            </button>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-700">{item.bentukRacikan}</td>
                        <td className="p-3 font-medium text-slate-700">{item.aturanPakai}</td>
                        <td className="p-3 text-center font-bold text-slate-800">{item.jumlahDiserahkan}</td>
                        <td className="p-3 text-slate-600">{item.satuan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* CARD CATATAN FARMASI */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col gap-2">
            <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
              CATATAN FARMASI
            </h3>
            <p className="text-xs font-medium text-slate-600">
              {detail.catatanFarmasi}
            </p>
          </div>

          {/* CARD DOKUMEN & ACTION BUTTONS */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
              DOKUMEN
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              {/* Tombol Cetak Bukti */}
              <button
                type="button"
                onClick={onCetakBukti}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-blue-600 font-semibold text-xs rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Lihat / Cetak Bukti Serah Obat</span>
              </button>

              {/* Tombol Tutup Modal */}
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-32 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}