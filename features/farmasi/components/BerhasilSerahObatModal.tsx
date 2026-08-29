'use client';

import React from 'react';
import { 
  X, 
  Check, 
  CheckCircle2, 
  Printer 
} from 'lucide-react';

// --- Types & Interfaces ---
export interface BerhasilSerahObatData {
  noAntrean: string;
  waktuSerah: string;
  diserahkanOleh: string;
  jabatanApoteker?: string;
  isSatuSehatReady?: boolean;
}

export interface BerhasilSerahObatModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<BerhasilSerahObatData>;
  onCetakBukti?: () => void;
  onSelesai?: () => void;
  onLihatDetailPengiriman?: () => void;
}

export default function BerhasilSerahObatModal({
  isOpen,
  onClose,
  data,
  onCetakBukti,
  onSelesai,
  onLihatDetailPengiriman,
}: BerhasilSerahObatModalProps) {
  if (!isOpen) return null;

  // Data default acuan dari gambar screenshot
  const info: BerhasilSerahObatData = {
    noAntrean: data?.noAntrean ?? 'A013',
    waktuSerah: data?.waktuSerah ?? '16/08/2026, 08:43 WIB',
    diserahkanOleh: data?.diserahkanOleh ?? 'Siti Rahma, A.Md.Kep',
    jabatanApoteker: data?.jabatanApoteker ?? '(Apoteker)',
    isSatuSehatReady: data?.isSatuSehatReady ?? true,
  };

  const handleSelesai = () => {
    if (onSelesai) onSelesai();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto border border-slate-100 transition-all transform animate-in fade-in zoom-in-95 duration-200 relative p-6 sm:p-8">
        
        {/* Tombol Close (X) di Pojok Kanan Atas */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Main Layout */}
        <div className="flex flex-col items-center text-center gap-5">
          
          {/* Ikon Sukses Hijau dengan Hiasan Confetti Visual SVG */}
          <div className="relative flex items-center justify-center mt-2">
            
            {/* Element Dekoratif Confetti Kecil */}
            <div className="absolute -top-1 -left-8 text-cyan-400 opacity-70 text-xs">✦</div>
            <div className="absolute top-4 -left-12 text-emerald-400 opacity-80 text-xs font-bold rotate-45">■</div>
            <div className="absolute -bottom-1 -left-6 text-sky-400 opacity-70 text-xs">◆</div>
            
            <div className="absolute -top-2 -right-8 text-indigo-400 opacity-70 text-xs">◆</div>
            <div className="absolute top-3 -right-12 text-emerald-500 opacity-80 text-xs">✦</div>
            <div className="absolute -bottom-1 -right-6 text-cyan-400 opacity-70 text-xs">●</div>

            {/* Circle Badge Hijau Utama */}
            <div className="w-20 h-20 rounded-full bg-emerald-100/70 border-4 border-emerald-50 flex items-center justify-center shadow-xs">
              <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                <Check className="w-8 h-8 text-white stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-22px font-extrabold text-slate-900 tracking-tight">
              Obat Berhasil Diserahkan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Semua obat telah diserahkan kepada penerima.
            </p>
          </div>

          {/* Banner Informasi Kunjungan / Penyerahan (Green Tint Box) */}
          <div className="w-full bg-emerald-50/60 border border-emerald-100/90 rounded-2xl p-4 grid grid-cols-3 gap-2 divide-x divide-emerald-200/60 text-xs">
            
            {/* No. Antrean */}
            <div className="flex flex-col items-center justify-center px-1">
              <span className="text-[11px] text-slate-500 font-medium mb-1">No. Antrean</span>
              <span className="font-extrabold text-slate-900 text-sm">{info.noAntrean}</span>
            </div>

            {/* Waktu Serah */}
            <div className="flex flex-col items-center justify-center px-1">
              <span className="text-[11px] text-slate-500 font-medium mb-1">Waktu Serah</span>
              <span className="font-bold text-slate-900 text-[11px] leading-snug">{info.waktuSerah}</span>
            </div>

            {/* Diserahkan Oleh */}
            <div className="flex flex-col items-center justify-center px-1">
              <span className="text-[11px] text-slate-500 font-medium mb-1">Diserahkan oleh</span>
              <span className="font-bold text-slate-900 text-[11px] leading-tight">
                {info.diserahkanOleh}
              </span>
              {info.jabatanApoteker && (
                <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                  {info.jabatanApoteker}
                </span>
              )}
            </div>

          </div>

          {/* Box Notifikasi SATUSEHAT */}
          <div className="w-full bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Data telah tersimpan dan siap dikirim ke SATUSEHAT.</span>
            </div>

            <button
              type="button"
              onClick={onLihatDetailPengiriman}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              Lihat Detail Pengiriman
            </button>
          </div>

          {/* Action Buttons Footer */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            {/* Tombol Cetak Bukti Serah Obat */}
            <button
              type="button"
              onClick={onCetakBukti}
              className="w-full py-2.5 px-4 border border-cyan-200 bg-white hover:bg-cyan-50/50 text-cyan-600 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-600" />
              <span>Cetak Bukti Serah Obat</span>
            </button>

            {/* Tombol Selesai */}
            <button
              type="button"
              onClick={handleSelesai}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Selesai</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}