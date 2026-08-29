'use client';

import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown,
  ChevronRight,
  Info, 
  User, 
  Smile, 
  Eye, 
  Ear, 
  Activity, 
  Heart, 
  Wind, 
  Disc, 
  Move, 
  Brain, 
  Grid 
} from 'lucide-react';

export default function PemeriksaanDokter() {
  const [activeTab, setActiveTab] = useState('keadaan-umum');

  const menuItems = [
    { id: 'keadaan-umum', label: 'Keadaan Umum', icon: User },
    { id: 'kepala', label: 'Kepala', icon: Smile },
    { id: 'mata', label: 'Mata', icon: Eye },
    { id: 'tht', label: 'THT', icon: Ear },
    { id: 'thoraks', label: 'Thoraks', icon: Activity },
    { id: 'jantung', label: 'Jantung', icon: Heart },
    { id: 'paru', label: 'Paru', icon: Wind },
    { id: 'abdomen', label: 'Abdomen', icon: Disc },
    { id: 'ekstremitas', label: 'Ekstremitas', icon: Move },
    { id: 'neurologis', label: 'Neurologis', icon: Brain },
    { id: 'lainnya', label: 'Lainnya', icon: Grid },
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-5 h-5 bg-cyan-600 text-white rounded text-xs font-bold shadow-sm">
            B
          </div>
          <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
            Pemeriksaan Dokter
          </h2>
          <span className="bg-cyan-50 text-cyan-600 text-[10px] px-2 py-0.5 rounded font-semibold border border-cyan-100">
            Input Dokter
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
          <span className="hidden sm:inline">Waktu Pemeriksaan: 08:45 WIB</span>
          <button className="p-1 hover:bg-gray-100 rounded border border-transparent hover:border-gray-200 transition-colors">
            <ChevronUp size={14} />
          </button>
        </div>
      </div>

      {/* Body Section (Sidebar + Content) */}
      <div className="flex flex-col md:flex-row min-h-[450px]">
        {/* Left Sidebar (Tabs) */}
        <div className="w-full md:w-48 border-r border-gray-100 bg-white py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-colors
                  ${isActive 
                    ? 'bg-cyan-50/50 text-cyan-700 border-l-[3px] border-cyan-600' 
                    : 'text-gray-600 hover:bg-gray-50 border-l-[3px] border-transparent'
                  }`}
              >
                <Icon size={16} className={isActive ? 'text-cyan-600' : 'text-gray-400'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-5 bg-white">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Form Section */}
            <div className="xl:col-span-2 flex flex-col gap-5">
              
              <div className="border-b border-gray-100 pb-2">
                <h3 className="font-semibold text-sm text-gray-800">Keadaan Umum</h3>
              </div>
              
              {/* Dropdowns Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-500 font-semibold">Status Gizi</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-200 rounded-md px-2.5 py-1.5 pr-7 text-[13px] text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all cursor-pointer">
                      <option>Normal</option>
                      <option>Kurang</option>
                      <option>Berlebih</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-500 font-semibold">Kesadaran</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-200 rounded-md px-2.5 py-1.5 pr-7 text-[13px] text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all cursor-pointer">
                      <option>Compos Mentis</option>
                      <option>Apatis</option>
                      <option>Delirium</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-500 font-semibold">Keadaan Umum</label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-200 rounded-md px-2.5 py-1.5 pr-7 text-[13px] text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all cursor-pointer">
                      <option>Baik</option>
                      <option>Sedang</option>
                      <option>Buruk</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-500 font-semibold truncate">Tingkat Nyeri (NRS 0-10)</label>
                  <div className="flex items-center border border-gray-200 rounded-md px-1 py-0.5 focus-within:ring-1 focus-within:ring-cyan-500 focus-within:border-cyan-500 transition-all bg-white">
                    <input 
                      type="number" 
                      defaultValue={2} 
                      min={0}
                      max={10}
                      className="w-10 text-center text-[13px] font-semibold text-gray-800 focus:outline-none bg-transparent" 
                    />
                    <div className="flex items-center gap-1 px-1.5 border-l border-gray-100 text-[12px] text-gray-500">
                      <ChevronRight size={12} className="text-gray-300" />
                      <span>Ringan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 font-semibold">Postur / Sikap</label>
                <div className="relative">
                  <textarea 
                    className="w-full border border-gray-200 rounded-md p-2 text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all min-h-[70px] resize-y"
                    defaultValue="Pasien tampak sadar, kooperatif, tidak tampak distress."
                  />
                  <div className="absolute bottom-2 right-2 text-[10px] text-gray-400 font-medium bg-white px-1">
                    59 / 500
                  </div>
                </div>
              </div>

              {/* Tanda Vital (Diukur Ulang) */}
              <div className="flex flex-col gap-2 pt-1">
                <h4 className="text-[13px] font-semibold text-gray-800">Tanda Vital (diukur ulang)</h4>
                
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                  {/* Kotak Input TD */}
                  <div className="border border-gray-200 rounded-md p-2 bg-white focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all cursor-text">
                    <p className="text-[10px] text-gray-500 mb-1 font-medium">TD</p>
                    <div className="flex items-baseline justify-between gap-1">
                      <input type="text" defaultValue="118/78" className="w-14 font-bold text-[13px] text-gray-900 outline-none bg-transparent p-0" />
                      <span className="text-[9px] text-gray-400 font-semibold">mmHg</span>
                    </div>
                  </div>

                  {/* Kotak Input Nadi */}
                  <div className="border border-gray-200 rounded-md p-2 bg-white focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all cursor-text">
                    <p className="text-[10px] text-gray-500 mb-1 font-medium">Nadi</p>
                    <div className="flex items-baseline justify-between gap-1">
                      <input type="text" defaultValue="88" className="w-10 font-bold text-[13px] text-gray-900 outline-none bg-transparent p-0" />
                      <span className="text-[9px] text-gray-400 font-semibold">x/menit</span>
                    </div>
                  </div>

                  {/* Kotak Input Respirasi */}
                  <div className="border border-gray-200 rounded-md p-2 bg-white focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all cursor-text">
                    <p className="text-[10px] text-gray-500 mb-1 font-medium">Respirasi</p>
                    <div className="flex items-baseline justify-between gap-1">
                      <input type="text" defaultValue="20" className="w-10 font-bold text-[13px] text-gray-900 outline-none bg-transparent p-0" />
                      <span className="text-[9px] text-gray-400 font-semibold">x/menit</span>
                    </div>
                  </div>

                  {/* Kotak Input Suhu */}
                  <div className="border border-gray-200 rounded-md p-2 bg-white focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all cursor-text">
                    <p className="text-[10px] text-gray-500 mb-1 font-medium">Suhu</p>
                    <div className="flex items-baseline justify-between gap-1">
                      <input type="text" defaultValue="36.6" className="w-10 font-bold text-[13px] text-gray-900 outline-none bg-transparent p-0" />
                      <span className="text-[9px] text-gray-400 font-semibold">&deg;C</span>
                    </div>
                  </div>

                  {/* Kotak Input SpO2 */}
                  <div className="border border-gray-200 rounded-md p-2 bg-white focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all cursor-text">
                    <p className="text-[10px] text-gray-500 mb-1 font-medium">SpO2</p>
                    <div className="flex items-baseline justify-between gap-1">
                      <input type="text" defaultValue="98" className="w-10 font-bold text-[13px] text-gray-900 outline-none bg-transparent p-0" />
                      <span className="text-[9px] text-gray-400 font-semibold">%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <input type="checkbox" id="no-measure" className="w-3.5 h-3.5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 cursor-pointer" />
                  <label htmlFor="no-measure" className="text-[12px] text-gray-600 cursor-pointer select-none">
                    Vital sign tidak diukur ulang
                  </label>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors ml-1">
                    <Info size={12} />
                  </button>
                </div>
              </div>

            </div>

            {/* Peta Tubuh Section */}
            <div className="xl:col-span-1 flex flex-col gap-2 border-t xl:border-t-0 xl:border-l border-gray-100 pt-5 xl:pt-0 xl:pl-5">
              <h3 className="text-[13px] font-semibold text-gray-800">Peta Tubuh</h3>
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center h-full min-h-[250px] bg-slate-50/50">
                <div className="w-full h-40 bg-white rounded-md border border-dashed border-gray-300 flex items-center justify-center mb-4 shadow-sm">
                  <span className="text-[11px] text-gray-400 font-medium">SVG Anatomi Tubuh</span>
                </div>
                
                <p className="text-[12px] font-semibold text-emerald-600 text-center">
                  Tidak ada temuan pada peta tubuh
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}