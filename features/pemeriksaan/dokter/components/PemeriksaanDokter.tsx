"use client";

import React, { useState } from 'react';
import { 
  ChevronUp, 
  User, 
  Smile, 
  Eye, 
  Ear, 
  Activity, 
  Heart, 
  Wind, 
  Scan, 
  Bone, 
  Brain, 
  Stethoscope,
  Info
} from 'lucide-react';

export default function PemeriksaanDokterSection() {
  const [activeTab, setActiveTab] = useState('Keadaan Umum');

  const menuItems = [
    { id: 'Keadaan Umum', icon: User },
    { id: 'Kepala', icon: Smile },
    { id: 'Mata', icon: Eye },
    { id: 'THT', icon: Ear },
    { id: 'Thoraks', icon: Scan },
    { id: 'Jantung', icon: Heart },
    { id: 'Paru', icon: Wind },
    { id: 'Abdomen', icon: Activity },
    { id: 'Ekstremitas', icon: Bone },
    { id: 'Neurologis', icon: Brain },
    { id: 'Pemeriksaan Lainnya', icon: Stethoscope },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col font-sans mt-6">
      
      {/* Header Section B */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white font-bold text-xs rounded">
            B
          </span>
          <h3 className="font-bold text-xs text-blue-600 tracking-wider uppercase">
            PEMERIKSAAN DOKTER
          </h3>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-full border border-blue-100">
            Input Dokter
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Waktu Pemeriksaan : <span className="text-slate-800">08:45 WIB</span></span>
          <button className="p-1 hover:bg-slate-100 rounded-md text-slate-400">
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row min-h-[500px]">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-56 border-r border-slate-100 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 relative' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.id}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Side: Form Inputs */}
            <div className="flex-1 space-y-6">
              
              {/* Row 1: Selects */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4">Keadaan Umum</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-medium">Status Gizi</label>
                    <select className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>Normal</option>
                      <option>Kurang</option>
                      <option>Lebih</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-medium">Kesadaran</label>
                    <select className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>Compos Mentis</option>
                      <option>Apatis</option>
                      <option>Somnolen</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-medium">Keadaan Umum</label>
                    <select className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>Baik</option>
                      <option>Sedang</option>
                      <option>Lemah</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-medium">Tingkat Nyeri (NRS 0-10)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        defaultValue={2}
                        className="w-16 text-xs p-2.5 rounded-lg border border-slate-200 text-center focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                      <span className="text-xs text-slate-400">&gt; Ringan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Textarea */}
              <div className="space-y-1.5 relative">
                <label className="text-[11px] text-slate-500 font-medium">Postur / Sikap</label>
                <textarea 
                  rows={3}
                  defaultValue="Pasien tampak sadar, kooperatif, tidak tampak distress."
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
                <span className="absolute bottom-3 right-3 text-[10px] text-slate-400">
                  59 / 500
                </span>
              </div>

              {/* Row 3: Vital Signs Diukur Ulang */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-800 mb-3">Tanda Vital <span className="text-slate-400 font-normal">(diukur ulang)</span></h4>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                  {/* TD */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <label className="text-[11px] text-slate-500 block mb-1">TD</label>
                    <div className="flex items-baseline gap-1">
                      <input type="text" defaultValue="118/78" className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent" />
                      <span className="text-[10px] text-slate-400">mmHg</span>
                    </div>
                  </div>
                  
                  {/* Nadi */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <label className="text-[11px] text-slate-500 block mb-1">Nadi</label>
                    <div className="flex items-baseline gap-1">
                      <input type="text" defaultValue="88" className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent" />
                      <span className="text-[10px] text-slate-400">x/menit</span>
                    </div>
                  </div>

                  {/* Respirasi */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <label className="text-[11px] text-slate-500 block mb-1">Respirasi</label>
                    <div className="flex items-baseline gap-1">
                      <input type="text" defaultValue="20" className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent" />
                      <span className="text-[10px] text-slate-400">x/menit</span>
                    </div>
                  </div>

                  {/* Suhu */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <label className="text-[11px] text-slate-500 block mb-1">Suhu</label>
                    <div className="flex items-baseline gap-1">
                      <input type="text" defaultValue="36.6" className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent" />
                      <span className="text-[10px] text-slate-400">°C</span>
                    </div>
                  </div>

                  {/* SpO2 */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <label className="text-[11px] text-slate-500 block mb-1">SpO₂</label>
                    <div className="flex items-baseline gap-1">
                      <input type="text" defaultValue="98" className="w-full text-sm font-bold text-slate-800 outline-none bg-transparent" />
                      <span className="text-[10px] text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="vital-skip" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="vital-skip" className="text-[11px] text-slate-600 cursor-pointer">
                    Vital sign tidak diukur ulang
                  </label>
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                </div>
              </div>

            </div>

            {/* Right Side: Peta Tubuh */}
            <div className="w-full lg:w-48 xl:w-56 flex flex-col items-center">
              <h4 className="text-sm font-bold text-slate-800 w-full mb-4">Peta Tubuh</h4>
              
              {/* Body Map Placeholder Box */}
              <div className="w-full flex-1 min-h-[250px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 bg-slate-50">
                {/* SVG Silhouette representation (simplified for demo) */}
                <div className="flex gap-4 mb-6 opacity-30">
                  <User className="w-16 h-32" strokeWidth={1} />
                  <User className="w-16 h-32" strokeWidth={1} />
                </div>
                
                <p className="text-[11px] font-medium text-emerald-600 text-center bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
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