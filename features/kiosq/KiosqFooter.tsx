import React from 'react';
import { Info } from 'lucide-react';

export const KiosqFooter = () => {
  return (
    <footer className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <Info className="w-4 h-4 text-slate-400" />
        <span>
          Tiket ini tidak menampilkan data pribadi.{' '}
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Butuh bantuan? Hubungi petugas.
          </span>
        </span>
      </div>
    </footer>
  );
};