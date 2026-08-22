'use client';

import React from 'react';
import { Stethoscope, FileText, Info } from 'lucide-react';

interface InstruksiDokterProps {
  instruksi?: string;
  isEditable?: boolean;
  onInstruksiChange?: (value: string) => void;
}

export default function InstruksiDokterComponent({
  instruksi = "Minum obat sesudah makan. Kontrol kembali jika demam tidak turun dalam 3 hari atau keluhan bertambah.",
  isEditable = false,
  onInstruksiChange,
}: InstruksiDokterProps) {
  return (
    <div className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4 font-sans">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            C
          </div>
          <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase flex items-center gap-1.5">
            INSTRUKSI KHUSUS DARI DOKTER
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
          <span>E-Resep Dokter</span>
        </div>
      </div>

      {/* Box Instruksi Teks */}
      {isEditable ? (
        <div className="relative">
          <textarea
            value={instruksi}
            onChange={(e) => onInstruksiChange && onInstruksiChange(e.target.value)}
            rows={3}
            className="w-full text-xs font-semibold text-slate-800 p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none leading-relaxed placeholder:text-slate-400"
            placeholder="Tulis instruksi khusus..."
          />
        </div>
      ) : (
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-4 flex items-start gap-3">
          <div className="p-1.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
            {instruksi || "Tidak ada instruksi khusus dari dokter."}
          </p>
        </div>
      )}

    </div>
  );
}