'use client';

import React from 'react';
import { CheckCircle2, FlaskConical, Pill } from 'lucide-react';

// --- Types & Interfaces ---
export interface ItemObatSerah {
  no: number;
  namaObat: string;
  kfa: string;
  bentukKekuatan: string;
  aturanPakai: string;
  jumlahDiserahkan: number;
  satuan: string;
  status: 'Siap Diserahkan' | 'Belum Siap';
}

export interface ItemRacikanSerah {
  no: number;
  namaRacikan: string;
  bentukRacikan: string;
  aturanPakai: string;
  jumlahDiserahkan: number;
  satuan: string;
  status: 'Siap Diserahkan' | 'Belum Siap';
}

interface ObatYangDiserahkanProps {
  nonRacikanList?: ItemObatSerah[];
  racikanList?: ItemRacikanSerah[];
  onLihatKomposisi?: (no: number) => void;
}

export default function ObatYangDiserahkanComponent({
  nonRacikanList,
  racikanList,
  onLihatKomposisi,
}: ObatYangDiserahkanProps) {
  // Data default acuan dari gambar
  const defaultNonRacikan: ItemObatSerah[] = [
    {
      no: 1,
      namaObat: 'Paracetamol',
      kfa: 'KFA: 9300089500012',
      bentukKekuatan: 'Tablet 500 mg',
      aturanPakai: '3 x sehari sesudah makan',
      jumlahDiserahkan: 10,
      satuan: 'Tablet',
      status: 'Siap Diserahkan',
    },
    {
      no: 2,
      namaObat: 'Cetirizine',
      kfa: 'KFA: 9300023400017',
      bentukKekuatan: 'Tablet 10 mg',
      aturanPakai: '1 x sehari malam hari',
      jumlahDiserahkan: 5,
      satuan: 'Tablet',
      status: 'Siap Diserahkan',
    },
  ];

  const defaultRacikan: ItemRacikanSerah[] = [
    {
      no: 1,
      namaRacikan: 'Racikan 1 - Puyer',
      bentukRacikan: 'Puyer',
      aturanPakai: '3 x sehari sesudah makan',
      jumlahDiserahkan: 10,
      satuan: 'Bungkus',
      status: 'Siap Diserahkan',
    },
  ];

  const nonRacikanItems = nonRacikanList || defaultNonRacikan;
  const racikanItems = racikanList || defaultRacikan;

  // Total Kalkulasi
  const totalItemCount = nonRacikanItems.length + racikanItems.length;
  const totalJumlahObat =
    nonRacikanItems.reduce((acc, curr) => acc + curr.jumlahDiserahkan, 0) +
    racikanItems.reduce((acc, curr) => acc + curr.jumlahDiserahkan, 0);

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-5 font-sans">
      
      {/* Section Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          B
        </div>
        <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
          OBAT YANG DISERAHKAN
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        
        {/* SUB-SECTION 1: NON-RACIKAN */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-600 tracking-wider uppercase">
              NON-RACIKAN
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
              {nonRacikanItems.length} Item
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="p-3 w-10 text-center">No.</th>
                  <th className="p-3">Obat</th>
                  <th className="p-3">Bentuk / Kekuatan</th>
                  <th className="p-3">Aturan Pakai</th>
                  <th className="p-3 text-center">Jumlah Diserahkan</th>
                  <th className="p-3">Satuan</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {nonRacikanItems.map((item) => (
                  <tr key={item.no} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-800 text-center">{item.no}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{item.namaObat}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">{item.kfa}</span>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{item.bentukKekuatan}</td>
                    <td className="p-3 font-medium text-slate-700">{item.aturanPakai}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{item.jumlahDiserahkan}</td>
                    <td className="p-3 text-slate-600">{item.satuan}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUB-SECTION 2: RACIKAN */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-700 tracking-wider uppercase">
              RACIKAN
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
              {racikanItems.length} Item
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="p-3 w-10 text-center">No.</th>
                  <th className="p-3">Racikan</th>
                  <th className="p-3">Bentuk Racikan</th>
                  <th className="p-3">Aturan Pakai</th>
                  <th className="p-3 text-center">Jumlah Diserahkan</th>
                  <th className="p-3">Satuan</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {racikanItems.map((item) => (
                  <tr key={item.no} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-800 text-center">{item.no}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{item.namaRacikan}</span>
                        <button
                          type="button"
                          onClick={() => onLihatKomposisi && onLihatKomposisi(item.no)}
                          className="text-cyan-600 hover:text-cyan-700 text-[11px] font-semibold text-left mt-0.5 transition-colors cursor-pointer w-fit"
                        >
                          Lihat Komposisi
                        </button>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{item.bentukRacikan}</td>
                    <td className="p-3 font-medium text-slate-700">{item.aturanPakai}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{item.jumlahDiserahkan}</td>
                    <td className="p-3 text-slate-600">{item.satuan}</td>
                    <td className="p-3 text-center">
                      <span className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border border-purple-200/60">
                        <CheckCircle2 className="w-3 h-3 text-purple-600" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUMMARY FOOTER PANEL */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Total Item :</span>
            <span className="font-bold text-slate-900 text-sm">{totalItemCount} item</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Total Jumlah Obat :</span>
            <span className="font-extrabold text-slate-900 text-sm">{totalJumlahObat}</span>
            <span className="text-slate-400 font-medium">(Tablet/Bungkus)</span>
          </div>
        </div>

      </div>

    </div>
  );
}