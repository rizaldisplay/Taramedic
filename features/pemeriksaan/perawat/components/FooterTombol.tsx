"use client";

import { ArrowRight, FileText } from "lucide-react";

export default function FooterTombol() {
  return (
    <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-slate-200 p-3 sm:p-4 z-40 transition-all duration-300">
      {/* 
        Gunakan flex-col-reverse di mobile agar tombol utama (Kirim) ada di atas tombol sekunder (Draft).
        Di layar sm (tablet) ke atas, kembali menjadi flex-row (kiri-kanan).
      */}
      <div className="max-w-[1440px] mx-auto flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Tombol Kiri: Draft */}
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-md border border-slate-300 bg-white text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors">
          <FileText className="w-4 h-4" />
          Simpan Draft
        </button>

        {/* Wrapper Kanan: Action Utama & Deskripsi */}
        <div className="w-full sm:w-auto flex flex-col items-center sm:items-end w-full">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 rounded-md bg-slate-500 hover:bg-slate-600 text-white text-xs sm:text-sm font-bold transition-colors">
            <span>Selesaikan & Kirim ke Dokter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          {/* Teks bantuan: rata tengah di mobile, rata kanan di desktop */}
          <span className="text-[10px] text-slate-400 mt-1.5 sm:mt-0.5 text-center sm:text-right leading-tight">
            Pastikan data sudah lengkap sebelum dikirim ke dokter.
          </span>
        </div>

      </div>
    </div>
  );
}