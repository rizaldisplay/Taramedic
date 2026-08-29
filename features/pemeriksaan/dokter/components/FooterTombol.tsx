"use client";

import React from "react";
import { ArrowRight, FileText, Trash2, Stethoscope, RotateCcw } from "lucide-react";

interface FooterTombolProps {
  onSimpanDraft?: () => void;
  onReset?: () => void;
  onBatalkanKunjungan?: () => void;
  onLanjutPemeriksaan?: () => void;
}

export default function FooterTombol({
  onSimpanDraft,
  onReset,
  onBatalkanKunjungan,
  onLanjutPemeriksaan,
}: FooterTombolProps) {
  return (
    <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white border-t border-slate-200 p-3 sm:p-4 z-40 shadow-lg transition-all duration-300 font-sans">
      <div className="max-w-[1440px] mx-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Tombol Sekunder (Kiri: Simpan Draft & Reset) */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onSimpanDraft}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-xs cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-taramedic-200 bg-taramedic-50/60 text-taramedic-700 text-xs font-bold hover:bg-taramedic-100/70 active:bg-taramedic-200/60 transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-taramedic" />
            <span>Reset Perubahan</span>
          </button>
        </div>

        {/* Tombol Aksi Utama (Kanan: Batalkan & Lanjut - Bersisian Horizontal) */}
        <div className="flex flex-row items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBatalkanKunjungan}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-rose-200 bg-rose-50/60 text-rose-700 text-xs font-bold hover:bg-rose-100/70 active:bg-rose-200/50 transition-all shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Batalkan Kunjungan</span>
          </button>

          <button
            type="button"
            onClick={onLanjutPemeriksaan}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-taramedic hover:bg-taramedic-600 active:bg-taramedic-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Lanjut Pemeriksaan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}