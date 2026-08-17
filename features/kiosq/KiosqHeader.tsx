import React from 'react';
import { HeartHandshake } from 'lucide-react';

export const KiosqHeader = () => {
  return (
    <header className="px-6 py-5 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-2">
        <HeartHandshake className="w-7 h-7 text-blue-600" />
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-800 leading-none">TARAMEDIC</h1>
          <p className="text-[7px] text-slate-500 uppercase tracking-widest font-medium mt-0.5">
            Excellent Medical IT Partner
          </p>
        </div>
      </div>
      <div className="text-xs font-bold text-slate-700 tracking-wider">
        MESIN ANTREAN
      </div>
    </header>
  );
};