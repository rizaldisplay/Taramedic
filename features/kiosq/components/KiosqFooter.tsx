import React from 'react';
import { Info } from 'lucide-react';

export const KiosqFooter = () => {
  return (
    <footer className="w-full shrink-0 px-4 py-3.5 sm:px-8 sm:py-5 border-t border-slate-100 bg-slate-50/80">
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-medium text-slate-500 text-center select-none">
        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
        <p className="leading-snug">
          Tiket ini tidak menampilkan data pribadi.{' '}
          <button 
            type="button"
            className="text-cyan-600 font-bold cursor-pointer hover:underline active:text-cyan-700 transition-colors"
          >
            Butuh bantuan? Hubungi petugas.
          </button>
        </p>
      </div>
    </footer>
  );
};