import React from 'react';
import { CheckCircle2, Monitor, Printer, Clock } from 'lucide-react';
import { StatusPasien, Penjamin } from '@/types/kiosk';

interface Props {
  status: StatusPasien;
  penjamin: Penjamin;
  countdown: number;
  onDone: () => void;
}

export const StepSuccess: React.FC<Props> = ({ status, penjamin, countdown, onDone }) => {
  const queueCode = penjamin === 'BPJS' ? 'A081' : 'B042';

  return (
    <div className="w-full max-w-2xl mx-auto text-center flex flex-col items-center justify-between min-h-[420px] sm:min-h-[480px] animate-in zoom-in-95 duration-300 select-none">
      
      {/* Konten Utama (Nomor Antrean & Info) */}
      <div className="flex flex-col items-center justify-center my-auto w-full">
        
        {/* Success Badge */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-xs">
          <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-500" />
        </div>
        
        <h2 className="text-lg sm:text-xl font-bold text-emerald-600 mb-1">
          Pendaftaran Berhasil
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-2">
          Nomor antrean Anda
        </p>
        
        {/* Kode Antrean Raksasa */}
        <div className="text-6xl sm:text-7xl lg:text-8xl font-black text-cyan-600 tracking-tight my-1 sm:my-2 leading-none drop-shadow-xs">
          {queueCode}
        </div>
        
        {/* Metadata Penjamin & Status */}
        <div className="text-xs sm:text-sm font-extrabold text-slate-600 tracking-widest uppercase flex items-center gap-2 mb-6 sm:mb-8 bg-slate-100/80 px-4 py-1.5 rounded-full border border-slate-200/60">
          <span>{penjamin}</span>
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
          <span>PASIEN {status}</span>
        </div>

        {/* Info Panggilan Monitor */}
        <div className="w-full flex items-center gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200/70 p-3.5 sm:p-4 rounded-2xl text-left">
          <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 shrink-0" />
          <p className="leading-snug font-medium">
            Silakan menunggu nomor Anda dipanggil di layar antrean utama.
          </p>
        </div>

      </div>

      {/* Area Bawah (Tombol Aksi & Countdown Timer) */}
      <div className="w-full pt-4 space-y-3 sm:space-y-4 shrink-0 mt-auto">
        
        {/* Tombol Cetak & Selesai */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            className="
              flex items-center justify-center gap-2
              h-12 sm:h-14 px-5 rounded-2xl
              border-2 border-slate-200 bg-white
              font-bold text-sm sm:text-base text-slate-700
              hover:bg-slate-50 hover:border-slate-300
              active:scale-[0.98] transition-all cursor-pointer shadow-xs
            "
          >
            <Printer className="w-5 h-5 text-slate-600" />
            <span>Cetak Tiket</span>
          </button>

          <button 
            type="button"
            onClick={onDone}
            className="
              flex items-center justify-center gap-2
              h-12 sm:h-14 px-5 rounded-2xl
              bg-cyan-700 text-white
              font-bold text-sm sm:text-base
              hover:bg-cyan-800 active:scale-[0.98]
              transition-all cursor-pointer shadow-md shadow-cyan-900/10
            "
          >
            <span>Selesai</span>
          </button>
        </div>

        {/* Auto Reset Countdown Banner */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 bg-cyan-50/70 p-3 rounded-xl border border-cyan-100">
          <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
          <span>
            Layar akan kembali ke halaman awal dalam <strong className="text-cyan-700 font-extrabold">{countdown} detik</strong>.
          </span>
        </div>

      </div>

    </div>
  );
};