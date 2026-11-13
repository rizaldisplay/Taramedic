'use client';

import React from 'react';
import { HelpCircle, Lock } from 'lucide-react';

export const KiosqFooter = ({
  onHelpClick,
}: {
  onHelpClick?: () => void;
}) => {
  return (
    <footer className="w-full shrink-0 bg-transparent select-none">
      <div className="max-w-6xl mx-auto px-6 py-4 sm:px-10 sm:py-5 flex flex-wrap items-center justify-between gap-4">
        {/* Kiri: Privasi Terjaga */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1877b8] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs sm:text-[13px] font-extrabold text-[#0f2942] leading-tight">
              Privasi terjaga
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tiket antrean tidak menampilkan data pribadi.
            </p>
          </div>
        </div>

        {/* Kanan: Kartu Butuh Bantuan */}
        <button
          type="button"
          onClick={onHelpClick}
          className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50/90 active:scale-[0.99] px-4 py-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)] text-left transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#e6f4f8] text-[#007a99] flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs sm:text-[13px] font-extrabold text-[#0f2942] leading-tight">
              Butuh bantuan?
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Silakan hubungi petugas klinik.
            </p>
          </div>
        </button>
      </div>
    </footer>
  );
};