import React from 'react';
import { Wallet } from 'lucide-react';
import { Penjamin } from '@/types/kiosk';

interface Props {
  onSelect: (val: Penjamin) => void;
  selected: Penjamin;
}

export const StepPenjamin: React.FC<Props> = ({ onSelect, selected }) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-right-8 duration-300">
      
      {/* Title & Subtitle */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-2">
        Pilih Penjamin
      </h2>
      <p className="text-xs sm:text-sm lg:text-base text-slate-500 mb-6 sm:mb-8">
        Bagaimana biaya kunjungan Anda akan ditanggung?
      </p>

      {/* Grid Kartu Pilihan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Option: BPJS Kesehatan */}
        <button
          type="button"
          onClick={() => onSelect('BPJS')}
          className={`
            group relative flex flex-col items-center justify-between
            p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border-2 transition-all cursor-pointer
            min-h-[220px] sm:min-h-[260px] lg:min-h-[280px] select-none
            active:scale-[0.98]
            ${
              selected === 'BPJS'
                ? 'border-cyan-600 bg-cyan-50/60 shadow-md shadow-cyan-900/5'
                : 'border-slate-200 hover:border-cyan-400 hover:bg-slate-50/80 shadow-xs'
            }
          `}
        >
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="h-14 sm:h-16 lg:h-20 flex items-center justify-center mb-2">
              <img
                src="/logo/bpjs.png"
                alt="Logo BPJS Kesehatan"
                className="h-full w-auto max-w-[140px] sm:max-w-[160px] object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              BPJS Kesehatan
            </span>
          </div>

          <div className="w-full bg-slate-100/80 group-hover:bg-slate-200/60 rounded-xl p-2.5 sm:p-3 text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed transition-colors">
            Pastikan kepesertaan BPJS Anda aktif.
          </div>
        </button>

        {/* Option: Pasien Umum */}
        <button
          type="button"
          onClick={() => onSelect('Umum')}
          className={`
            group relative flex flex-col items-center justify-between
            p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border-2 transition-all cursor-pointer
            min-h-[220px] sm:min-h-[260px] lg:min-h-[280px] select-none
            active:scale-[0.98]
            ${
              selected === 'Umum'
                ? 'border-cyan-600 bg-cyan-50/60 shadow-md shadow-cyan-900/5'
                : 'border-slate-200 hover:border-cyan-400 hover:bg-slate-50/80 shadow-xs'
            }
          `}
        >
          <div className="flex-1 flex flex-col items-center justify-center w-full my-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
              <Wallet className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" strokeWidth={1.75} />
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 mb-0.5">
              Umum
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Pembayaran pribadi
            </p>
          </div>
        </button>

      </div>
    </div>
  );
};