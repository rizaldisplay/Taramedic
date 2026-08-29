import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function KeluhanUtama() {
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
        <Info className="w-4 h-4 text-cyan-600" />
        <h3 className="text-sm font-bold text-cyan-600 tracking-wide uppercase">
          Keluhan Utama
        </h3>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Kolom Kiri: Data dari Perawat (Read-Only) */}
        <div className="lg:col-span-1 flex flex-col">
          <label className="text-xs text-gray-500 font-medium mb-2">
            Dari Perawat &bull; 08:25 WIB
          </label>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 h-full min-h-[90px]">
            <p className="text-sm font-medium text-gray-800 leading-snug">
              Demam sejak 2 hari, badan terasa lemas.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Input Anamnesis Dokter */}
        <div className="lg:col-span-2 flex flex-col relative">
          <label className="text-xs text-gray-500 font-medium mb-2">
            Anamnesis Dokter (Tambahan / Perkembangan)
          </label>
          <div className="relative h-full">
            <textarea
              value={catatanDokter}
              onChange={handleInputChange}
              placeholder="Tuliskan anamnesis dokter mengenai keluhan utama pasien..."
              className="w-full h-full min-h-[90px] border border-gray-200 rounded-lg p-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 resize-none transition-shadow"
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