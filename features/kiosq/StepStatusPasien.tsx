import React from 'react';
import { User, Users } from 'lucide-react';
import { StatusPasien } from '@/types/kiosk';

interface Props {
  onSelect: (val: StatusPasien) => void;
  selected: StatusPasien;
}

export const StepStatusPasien: React.FC<Props> = ({ onSelect, selected }) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Title & Subtitle */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-2">
        Pilih Status Pasien
      </h2>
      <p className="text-xs sm:text-sm lg:text-base text-slate-500 mb-6 sm:mb-8">
        Apakah Anda sudah pernah berobat di klinik ini?
      </p>

      {/* Grid Kartu Pilihan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Option: Pasien Baru */}
        <button
          type="button"
          onClick={() => onSelect('Baru')}
          className={`
            group relative flex flex-col items-center justify-center
            p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border-2 transition-all cursor-pointer
            min-h-[200px] sm:min-h-[240px] lg:min-h-[260px] select-none
            active:scale-[0.98]
            ${
              selected === 'Baru'
                ? 'border-cyan-600 bg-cyan-50/60 shadow-md shadow-cyan-900/5'
                : 'border-slate-200 hover:border-cyan-400 hover:bg-slate-50/80 shadow-xs'
            }
          `}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
            <User className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" strokeWidth={1.75} />
          </div>
          
          <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 mb-1">
            Pasien Baru
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-[200px] leading-relaxed">
            Belum pernah memiliki rekam medis di klinik ini
          </p>
        </button>

        {/* Option: Pasien Lama */}
        <button
          type="button"
          onClick={() => onSelect('Lama')}
          className={`
            group relative flex flex-col items-center justify-center
            p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border-2 transition-all cursor-pointer
            min-h-[200px] sm:min-h-[240px] lg:min-h-[260px] select-none
            active:scale-[0.98]
            ${
              selected === 'Lama'
                ? 'border-cyan-600 bg-cyan-50/60 shadow-md shadow-cyan-900/5'
                : 'border-slate-200 hover:border-cyan-400 hover:bg-slate-50/80 shadow-xs'
            }
          `}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" strokeWidth={1.75} />
          </div>

          <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 mb-1">
            Pasien Lama
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-[200px] leading-relaxed">
            Sudah memiliki rekam medis sebelumnya
          </p>
        </button>

      </div>
    </div>
  );
};