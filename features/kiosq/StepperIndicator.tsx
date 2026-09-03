import React from 'react';
import { KiosqStep } from '@/types/kiosk';

interface StepperIndicatorProps {
  step: KiosqStep;
}

export const StepperIndicator: React.FC<StepperIndicatorProps> = ({ step }) => {
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto select-none">
      
      {/* Keterangan Langkah */}
      <div className="text-center text-xs sm:text-sm font-semibold text-slate-500 mb-2">
        Langkah {step} dari 3
      </div>
      
      {/* Baris Progress Bar */}
      <div className="flex justify-between gap-2 mb-2">
        <div 
          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
            step >= 1 ? 'bg-cyan-600 shadow-xs' : 'bg-slate-200/80'
          }`}
        />
        <div 
          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
            step >= 2 ? 'bg-cyan-600 shadow-xs' : 'bg-slate-200/80'
          }`}
        />
        <div 
          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
            step >= 3 ? 'bg-cyan-600 shadow-xs' : 'bg-slate-200/80'
          }`}
        />
      </div>
      
      {/* Label Step */}
      <div className="flex justify-between text-[11px] sm:text-xs font-bold transition-colors">
        <span className={`w-1/3 text-left ${step >= 1 ? 'text-cyan-600' : 'text-slate-400'}`}>
          1. Status Pasien
        </span>
        <span className={`w-1/3 text-center ${step >= 2 ? 'text-cyan-600' : 'text-slate-400'}`}>
          2. Penjamin
        </span>
        <span className={`w-1/3 text-right ${step >= 3 ? 'text-cyan-600' : 'text-slate-400'}`}>
          3. Nomor Antrean
        </span>
      </div>

    </div>
  );
};