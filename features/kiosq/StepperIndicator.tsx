import React from 'react';
import { KiosqStep } from '@/types/kiosk';

interface StepperIndicatorProps {
  step: KiosqStep;
}

export const StepperIndicator: React.FC<StepperIndicatorProps> = ({ step }) => {
  return (
    <div className="mt-6 mb-10 w-full max-w-xs mx-auto">
      <div className="text-center text-sm text-slate-500 mb-4">
        Langkah {step} dari 3
      </div>
      
      <div className="flex justify-between gap-2 mb-2">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-cyan-600' : 'bg-slate-100'}`}></div>
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-cyan-600' : 'bg-slate-100'}`}></div>
        <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-cyan-600' : 'bg-slate-100'}`}></div>
      </div>
      
      <div className="flex justify-between text-[10px] font-medium px-1">
        <span className={step >= 1 ? 'text-cyan-600' : 'text-slate-400'}>1. Status Pasien</span>
        <span className={step >= 2 ? 'text-cyan-600' : 'text-slate-400'}>2. Penjamin</span>
        <span className={step >= 3 ? 'text-cyan-600' : 'text-slate-400'}>3. Nomor Antrean</span>
      </div>
    </div>
  );
};