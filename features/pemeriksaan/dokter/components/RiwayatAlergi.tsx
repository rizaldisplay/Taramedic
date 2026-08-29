import React from 'react';
import { Sparkles, CheckCircle2, Check, Pencil } from 'lucide-react';

export default function RiwayatAlergi() {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-600" />
        <h3 className="text-sm font-bold text-cyan-600 tracking-wide uppercase">
          Riwayat Alergi
        </h3>
      </div>

      {/* Content Section - Grid 1:1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        
        {/* Kolom Kiri: Data dari Perawat */}
        <div className="flex flex-col h-full">
          <label className="text-xs text-gray-500 font-medium mb-2">
            Dari Perawat &bull; 08:25 WIB
          </label>
          {/* Kotak dengan sedikit highlight hijau menandakan aman (tidak ada alergi) */}
          <div className="bg-green-50/50 border border-green-100 rounded-lg p-3.5 h-full min-h-[90px] flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm font-bold text-gray-800">
              Tidak ada alergi
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Aksi Dokter */}
        <div className="flex flex-col h-full">
          <label className="text-xs text-gray-500 font-medium mb-2">
            Konfirmasi / Koreksi oleh Dokter
          </label>
          <div className="flex flex-col gap-2 h-full justify-between">
            {/* Tombol Konfirmasi */}
            <button className="flex-1 flex items-center justify-center gap-2 w-full py-2 px-4 text-sm font-semibold text-green-600 bg-white border border-green-500 rounded-lg hover:bg-green-50 transition-colors">
              <Check className="w-4 h-4" />
              Konfirmasi (Sesuai)
            </button>
            
            {/* Tombol Koreksi / Tambah */}
            <button className="flex-1 flex items-center justify-center gap-2 w-full py-2 px-4 text-sm font-semibold text-cyan-600 bg-white border border-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors">
              <Pencil className="w-4 h-4" />
              Koreksi / Tambah
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}