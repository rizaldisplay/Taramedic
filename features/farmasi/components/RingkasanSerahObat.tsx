'use client';

import React from 'react';
import { ClipboardList, UserCheck, Clock, Calendar, CheckCircle2 } from 'lucide-react';

// --- Types & Interfaces ---
export interface SummarySerahData {
  totalNonRacikan: number;
  totalRacikan: number;
  totalJumlahItem: number;
  totalJumlahObat: number;
  waktuSerah: string;
  diserahkanOleh: string;
}

interface RingkasanSerahObatProps {
  data?: Partial<SummarySerahData>;
}

export default function RingkasanSerahObatComponent({
  data,
}: RingkasanSerahObatProps) {
  // Data default acuan dari gambar
  const summary: SummarySerahData = {
    totalNonRacikan: data?.totalNonRacikan ?? 2,
    totalRacikan: data?.totalRacikan ?? 1,
    totalJumlahItem: data?.totalJumlahItem ?? 3,
    totalJumlahObat: data?.totalJumlahObat ?? 25,
    waktuSerah: data?.waktuSerah ?? '16/08/2026, 08:43 WIB',
    diserahkanOleh: data?.diserahkanOleh ?? 'Siti Rahma, A.Md.Kep (Apoteker)',
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col gap-3.5 font-sans">
      
      {/* Header Section Sidebar */}
      <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase border-b border-slate-100 pb-3">
        <ClipboardList className="w-4 h-4 text-blue-600 shrink-0" />
        <span>RINGKASAN SERAH OBAT</span>
      </div>

      {/* List Detail Ringkasan */}
      <div className="space-y-2.5 text-xs">
        
        {/* Total Non-Racikan */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Total Non-Racikan</span>
          <span className="font-bold text-slate-800">{summary.totalNonRacikan} item</span>
        </div>

        {/* Total Racikan */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Total Racikan</span>
          <span className="font-bold text-slate-800">{summary.totalRacikan} item</span>
        </div>

        {/* Total Jumlah Item */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Total Jumlah Item</span>
          <span className="font-bold text-slate-800">{summary.totalJumlahItem} item</span>
        </div>

        {/* Total Jumlah Obat (Tablet/Bungkus) */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Total Jumlah Obat</span>
          <span className="font-extrabold text-blue-600 text-sm bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
            {summary.totalJumlahObat}
          </span>
        </div>

        {/* Divider Line */}
        <div className="border-t border-slate-100 my-1 pt-1"></div>

        {/* Waktu Serah */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Waktu Serah
          </span>
          <span className="font-semibold text-slate-800">{summary.waktuSerah}</span>
        </div>

        {/* Diserahkan Oleh */}
        <div className="flex justify-between items-start gap-2 pt-0.5">
          <span className="text-slate-500 font-medium flex items-center gap-1 shrink-0">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            Diserahkan oleh
          </span>
          <span className="font-semibold text-slate-800 text-right leading-tight">
            {summary.diserahkanOleh}
          </span>
        </div>

      </div>

    </div>
  );
}