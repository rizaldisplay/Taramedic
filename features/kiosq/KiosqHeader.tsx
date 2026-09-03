import React from 'react';

export const KiosqHeader = () => {
  return (
    <header className="w-full shrink-0 px-6 py-4 sm:px-10 sm:py-5 border-b border-slate-100 flex justify-between items-center bg-white select-none">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png"
          alt="Logo Taramedic"
          className="h-8 sm:h-10 lg:h-12 w-auto object-contain cursor-pointer"
        />
      </div>

      {/* Label Kiosk */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-wider uppercase bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
          MESIN ANTREAN
        </span>
      </div>

    </header>
  );
};