import React from 'react';
import Image from 'next/image';
import { ArrowRight, MousePointerClick } from 'lucide-react';

interface DisplayAwalProps {
  onClickMulai: () => void;
}

export default function DisplayAwal({ onClickMulai }: DisplayAwalProps) {
  return (
    // Menggunakan div dengan h-full agar pas mengikuti kontainer KiosqFlow
    <div className="relative flex flex-col items-center justify-between w-full h-full flex-1 px-6 py-6 sm:py-8 bg-gradient-to-b from-white via-cyan-50/20 to-slate-100/80 overflow-hidden font-sans select-none">
      
      {/* Aksen Latar Belakang */}
      <div className="absolute top-10 left-10 w-32 h-10 bg-white opacity-40 rounded-full blur-xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-48 h-48 bg-white opacity-40 rounded-full blur-2xl pointer-events-none" />

      {/* 1. Bagian Teks Judul */}
      <div className="flex flex-col items-center mt-2 z-10 w-full max-w-md text-center shrink-0">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B215E] tracking-tight">
          Selamat Datang
        </h1>

        {/* Garis Dekoratif */}
        <div className="flex items-center gap-1.5 mt-3 mb-3">
          <div className="h-1.5 w-12 bg-cyan-500 rounded-full" />
          <div className="h-1.5 w-2 bg-cyan-500 rounded-full" />
        </div>

        {/* Subjudul */}
        <p className="text-[#3b4c68] max-w-xs sm:max-w-sm text-xs sm:text-sm font-medium leading-relaxed">
          Selamat datang. Silakan pilih layanan untuk mengambil nomor antrean.
        </p>
      </div>

      {/* 2. Bagian Ilustrasi Tengah (Flex-1 & Relative Container) */}
      <div className="relative w-full max-w-sm sm:max-w-md flex-1 my-4 z-10 min-h-[180px] max-h-[320px]">
        <Image 
          src="/images/clinic-hero.png" 
          alt="Ilustrasi Klinik" 
          fill 
          className="object-contain" 
          priority 
        />
      </div>

      {/* 3. Bagian Tombol Aksi & Instruksi */}
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center z-10 shrink-0 pb-2">
        
        {/* Tombol Mulai */}
        <button 
          type="button"
          className="w-full bg-cyan-500 hover:bg-cyan-600 active:scale-95 transition-all text-white rounded-full p-2.5 sm:p-3 shadow-lg border-[4px] sm:border-[6px] border-white flex items-center justify-center relative group cursor-pointer"
          onClick={onClickMulai}
        >
          {/* Ikon Panah */}
          <div className="absolute left-2.5 sm:left-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white flex items-center justify-center">
             <ArrowRight className="text-white w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </div>
          
          {/* Teks Tombol */}
          <span className="text-2xl sm:text-3xl font-extrabold tracking-wide ml-8">Mulai</span>
        </button>

        {/* Teks Instruksi Bawah */}
        <div className="flex items-center gap-2 mt-4 text-[#0B215E]">
          <MousePointerClick className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-bold text-xs sm:text-sm">Sentuh layar untuk memulai</span>
        </div>
        
      </div>
    </div>
  );
}