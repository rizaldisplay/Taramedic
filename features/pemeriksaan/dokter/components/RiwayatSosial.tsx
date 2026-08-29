import React, { useState } from 'react';
import { Lock, ChevronDown } from 'lucide-react';

export default function RiwayatSosial() {
  const [keterangan, setKeterangan] = useState('');
  const maxLength = 1000;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setKeterangan(value);
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4 text-cyan-600" />
        <h3 className="text-sm font-bold text-cyan-600 tracking-wide uppercase">
          Riwayat Sosial
        </h3>
      </div>

      {/* Content Section - Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Dropdown: Kebiasaan Merokok */}
        <div className="lg:col-span-1 flex flex-col relative">
          <label className="text-xs text-gray-500 font-medium mb-1.5">
            Kebiasaan Merokok
          </label>
          <div className="relative">
            <select className="w-full h-[42px] border border-gray-200 rounded-lg pl-3 pr-8 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 appearance-none bg-white cursor-pointer transition-shadow">
              <option value="Tidak merokok">Tidak merokok</option>
              <option value="Perokok aktif">Perokok aktif</option>
              <option value="Perokok pasif">Perokok pasif</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dropdown: Kebiasaan Alkohol */}
        <div className="lg:col-span-1 flex flex-col relative">
          <label className="text-xs text-gray-500 font-medium mb-1.5">
            Kebiasaan Alkohol
          </label>
          <div className="relative">
            <select className="w-full h-[42px] border border-gray-200 rounded-lg pl-3 pr-8 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 appearance-none bg-white cursor-pointer transition-shadow">
              <option value="Tidak">Tidak</option>
              <option value="Ya">Ya</option>
              <option value="Kadang-kadang">Kadang-kadang</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dropdown: Aktivitas Fisik */}
        <div className="lg:col-span-1 flex flex-col relative">
          <label className="text-xs text-gray-500 font-medium mb-1.5">
            Aktivitas Fisik
          </label>
          <div className="relative">
            <select className="w-full h-[42px] border border-gray-200 rounded-lg pl-3 pr-8 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 appearance-none bg-white cursor-pointer transition-shadow">
              <option value="Aktivitas ringan">Aktivitas ringan</option>
              <option value="Aktivitas sedang">Aktivitas sedang</option>
              <option value="Aktivitas berat">Aktivitas berat</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Text Input: Keterangan Lain */}
        <div className="lg:col-span-3 flex flex-col relative">
          <label className="text-xs text-gray-500 font-medium mb-1.5">
            Keterangan Lain (Sosial / Lingkungan / Pekerjaan Orang Tua, dll.)
          </label>
          <div className="relative h-[42px]">
            <input
              type="text"
              value={keterangan}
              onChange={handleInputChange}
              placeholder="Tuliskan keterangan tambahan riwayat sosial pasien..."
              className="w-full h-full border border-gray-200 rounded-lg pl-3.5 pr-14 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
            />
            {/* Character Counter */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400">
              {keterangan.length} / {maxLength}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}