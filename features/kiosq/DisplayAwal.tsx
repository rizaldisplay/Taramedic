import React from 'react';
import Image from 'next/image';
import { ArrowRight, MousePointerClick } from 'lucide-react';

interface DisplayAwalProps {
  onClickMulai: () => void;
}

export default function DisplayAwal({ onClickMulai }: DisplayAwalProps) {
  return (
    // <main> menampung seluruh area body di bawah header
    <main className="relative flex flex-col items-center w-full min-h-[85vh] px-6 py-10 bg-gradient-to-b from-white to-[#eef6fc] overflow-hidden font-sans">
      
      {/* --- Aksen Latar Belakang (Opsional/Sederhana) --- */}
      <div className="absolute top-20 left-10 w-32 h-10 bg-white opacity-40 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-10 w-48 h-48 bg-white opacity-40 rounded-full blur-2xl"></div>

      {/* --- Bagian Teks Judul --- */}
      <div className="flex flex-col items-center mt-4 z-10 w-full max-w-md text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B215E] tracking-tight">
          Selamat Datang
        </h1>

        {/* Garis Dekoratif Hijau */}
        <div className="flex items-center gap-1.5 mt-5 mb-6">
          <div className="h-1.5 w-14 bg-cyan-500 rounded-full"></div>
          <div className="h-1.5 w-2 bg-cyan-500 rounded-full"></div>
        </div>

        {/* Subjudul */}
        <p className="text-[#3b4c68] max-w-xs sm:max-w-sm text-sm sm:text-base font-medium leading-relaxed">
          Selamat datang. Silakan pilih layanan untuk mengambil nomor antrean.
        </p>
      </div>

      {/* --- Bagian Ilustrasi Tengah --- */}
      <div className="relative w-full max-w-md flex-grow flex items-center justify-center my-8 z-10 min-h-[250px]">
        {/* Placeholder Ilustrasi: Ganti src dengan path aset gambarmu di folder public */}
        <div className="w-full h-full absolute inset-0 flex items-center justify-center">
            {/* Hapus div dashed ini dan gunakan komponen <Image /> di bawahnya jika aset sudah ada */}
            {/* <div className="w-4/5 h-4/5 border-2 border-dashed border-gray-300 bg-white/50 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <span className="text-sm font-semibold mb-2">[Area Ilustrasi Medis]</span>
                <span className="text-xs">Ganti dengan komponen &lt;Image /&gt;</span>
            </div> */}
            
            {/* Contoh penggunaan saat aset gambar sudah siap: */}
            <Image 
                  src="/images/clinic-hero.png" 
                  alt="Ilustrasi Klinik" 
                  fill 
                  className="object-contain" 
                  priority 
                />
        </div>
      </div>

      {/* --- Bagian Tombol Aksi & Instruksi --- */}
      <div className="w-full max-w-sm flex flex-col items-center z-10 mt-auto pb-4">
        
        {/* Tombol Mulai */}
        <button 
          className="w-full bg-cyan-500 hover:bg-cyan-600 active:scale-95 transition-all text-white rounded-[2rem] p-3 shadow-lg border-[6px] border-white flex items-center justify-center relative group"
          onClick={onClickMulai}
        >
          {/* Ikon Panah Kiri (dalam lingkaran) */}
          <div className="absolute left-3 w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
             <ArrowRight className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          
          {/* Teks Tombol */}
          <span className="text-3xl font-extrabold tracking-wide ml-8">Mulai</span>
        </button>

        {/* Teks Instruksi Bawah */}
        <div className="flex items-center gap-2 mt-6 text-[#0B215E]">
          <MousePointerClick className="w-6 h-6" />
          <span className="font-bold text-sm">Sentuh layar untuk memulai</span>
        </div>
        
      </div>
    </main>
  );
}