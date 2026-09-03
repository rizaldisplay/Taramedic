import React from 'react';
import { HeartHandshake } from 'lucide-react';

export const KiosqHeader = () => {
  return (
    <header className="px-6 py-5 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-2">
              <img
                src="/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png"
                alt="Logo Taramedic"
                className="h-10 w-auto object-contain cursor-pointer"
              />
      </div>
      <div className="text-xs font-bold text-slate-700 tracking-wider">
        MESIN ANTREAN
      </div>
    </header>
  );
};