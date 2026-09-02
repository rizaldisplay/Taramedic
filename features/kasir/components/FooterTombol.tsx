"use client";

import { ArrowRight, FileText, Printer } from "lucide-react";

interface FooterTombolProps {
  onSimpanDraft?: () => void;
  onCetakLabel?: () => void;
  onKirimDokter?: () => void;
}

export default function FooterTombol({
  onSimpanDraft,
  onCetakLabel,
  onKirimDokter,
}: FooterTombolProps) {
  return (
    <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-slate-200/90 p-3 sm:p-4 z-40 shadow-lg transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Tombol Sekunder (Kiri di Desktop, Bawah di Mobile) */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          {/* Tombol Simpan Draft */}
          <button
            onClick={onSimpanDraft}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-xs cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Simpan Draft</span>
          </button>

          {/* Tombol Cetak Label Obat */}
          <button
            onClick={onCetakLabel}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl border border-cyan-200 bg-cyan-50/60 text-cyan-700 text-xs sm:text-sm font-bold hover:bg-cyan-100/70 active:bg-cyan-200/60 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-600" />
            <span>Cetak Label Obat</span>
          </button>
        </div>

        {/* Tombol Aksi Utama & Deskripsi (Kanan di Desktop, Atas di Mobile) */}
        <div className="w-full sm:w-auto flex flex-col items-center sm:items-end">
          <button
            onClick={onKirimDokter}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer"
          >
            <span>Serahkan Obat</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Teks bantuan */}
          <span className="text-[10px] text-slate-400 mt-1 sm:mt-0.5 text-center sm:text-right leading-tight font-medium">
            Pastikan data sudah lengkap sebelum dikirim ke dokter.
          </span>
        </div>

      </div>
    </div>
  );
}