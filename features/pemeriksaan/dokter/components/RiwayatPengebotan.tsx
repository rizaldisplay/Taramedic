import React, { useState } from 'react';
import { Pill } from 'lucide-react';

export default function RiwayatPengobatan() {
  const [catatanDokter, setCatatanDokter] = useState('');
  const maxLength = 1000;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setCatatanDokter(value);
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center gap-2">
        <Pill className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold text-blue-600 tracking-wide uppercase">
          Riwayat Pengobatan
        </h3>
      </div>

      {/* Content Section - Grid 1:1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Kolom Kiri: Data dari Perawat (Read-Only) */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 font-medium mb-2">
            Dari Perawat &bull; 08:25 WIB
          </label>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 h-full min-h-[90px]">
            <p className="text-sm font-medium text-gray-800">
              Tidak ada
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Input Anamnesis Dokter */}
        <div className="flex flex-col relative">
          <label className="text-xs text-gray-500 font-medium mb-2">
            Anamnesis Dokter (Jika ada)
          </label>
          <div className="relative h-full">
            <textarea
              value={catatanDokter}
              onChange={handleInputChange}
              placeholder="Tuliskan riwayat pengobatan sebelumnya..."
              className="w-full h-full min-h-[90px] border border-gray-200 rounded-lg p-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none transition-shadow"
            />
            {/* Character Counter */}
            <div className="absolute bottom-2.5 right-3 text-[10px] font-medium text-gray-400 bg-white px-1">
              {catatanDokter.length} / {maxLength}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}