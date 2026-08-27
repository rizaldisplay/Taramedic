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
    <footer className="fixed bottom-0 right-0 left-0 md:left-64 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-3 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Tombol Sekunder (Kiri: Simpan Draft & Reset) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onSimpanDraft}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 active:bg-slate-100 transition-all shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 active:bg-slate-100 transition-all shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Perubahan</span>
          </button>
        </div>

        {/* Tombol Aksi Utama (Kanan: Batalkan & Lanjut) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBatalkanKunjungan}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-red-200 bg-red-50/50 text-red-700 text-xs font-semibold hover:bg-red-100/70 active:bg-red-200/50 transition-all shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Batalkan Kunjungan</span>
          </button>

          <button
            type="button"
            onClick={onLanjutPemeriksaan}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Lanjut Pemeriksaan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}