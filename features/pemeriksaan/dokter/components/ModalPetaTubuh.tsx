'use client';

import React, { useState } from 'react';
import {
  X,
  Info,
  Target,
  Trash2,
  MoreVertical,
} from 'lucide-react';

type MarkerCategory = 'Keluhan' | 'Temuan Perawat' | 'Temuan Dokter';

interface BodyMarker {
  id: string;
  category: MarkerCategory;
  title: string;
  time: string;
  author: 'Perawat' | 'Dokter';
  x: number; // Persentase posisi X (0-100)
  y: number; // Persentase posisi Y (0-100)
  view: 'depan' | 'belakang';
}

interface ModalPetaTubuhProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalPetaTubuh({ isOpen, onClose }: ModalPetaTubuhProps) {
  // Mode marker aktif untuk menambah titik baru
  const [activeTool, setActiveTool] = useState<MarkerCategory | 'hapus'>('Keluhan');

  // Initial Mock Data penanda tubuh sesuai gambar
  const [markers, setMarkers] = useState<BodyMarker[]>([
    {
      id: '1',
      category: 'Keluhan',
      title: 'Nyeri kepala',
      time: '08:20 WIB',
      author: 'Perawat',
      x: 43.5,
      y: 11,
      view: 'depan',
    },
    {
      id: '2',
      category: 'Temuan Perawat',
      title: 'Nyeri tekan ringan di abdomen bawah',
      time: '08:25 WIB',
      author: 'Perawat',
      x: 43.5,
      y: 45,
      view: 'depan',
    },
    {
      id: '3',
      category: 'Temuan Dokter',
      title: 'Tidak ada ruam pada kulit',
      time: '08:45 WIB',
      author: 'Dokter',
      x: 50.5,
      y: 28,
      view: 'belakang',
    },
  ]);

  if (!isOpen) return null;

  // Helper Warna Kategori
  const getCategoryTheme = (category: MarkerCategory) => {
    switch (category) {
      case 'Keluhan':
        return {
          bgBadge: 'bg-red-50/80 text-red-600 border-red-100',
          dotBg: 'bg-red-500',
          pingBg: 'bg-red-400',
          borderActive: 'border-red-500 bg-red-50/30 text-red-600',
          pinColor: 'border-red-500 bg-red-50 text-red-600',
        };
      case 'Temuan Perawat':
        return {
          bgBadge: 'bg-amber-50/80 text-amber-600 border-amber-100',
          dotBg: 'bg-amber-500',
          pingBg: 'bg-amber-400',
          borderActive: 'border-amber-500 bg-amber-50/30 text-amber-600',
          pinColor: 'border-amber-500 bg-amber-50 text-amber-600',
        };
      case 'Temuan Dokter':
        return {
          bgBadge: 'bg-purple-50/80 text-purple-600 border-purple-100',
          dotBg: 'bg-purple-600',
          pingBg: 'bg-purple-400',
          borderActive: 'border-purple-600 bg-purple-50/30 text-purple-600',
          pinColor: 'border-purple-600 bg-purple-50 text-purple-600',
        };
    }
  };

  // Handler Klik Canvas Tubuh (Menambah Point)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>, view: 'depan' | 'belakang') => {
    if (activeTool === 'hapus') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker: BodyMarker = {
      id: Date.now().toString(),
      category: activeTool,
      title: `Temuan Baru (${view === 'depan' ? 'Depan' : 'Belakang'})`,
      time: '08:50 WIB',
      author: 'Dokter',
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
      view,
    };

    setMarkers([...markers, newMarker]);
  };

  // Hapus Satu Marker
  const handleRemoveMarker = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMarkers(markers.filter((m) => m.id !== id));
  };

  // Hapus Semua Marker
  const handleClearAll = () => {
    setMarkers([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Container Modal */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h2 className="text-base font-bold text-slate-800">
            Peta Tubuh
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info Banner Top */}
        <div className="px-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
            <div className="flex items-center gap-2 font-medium">
              <Info size={15} className="text-blue-600 shrink-0" />
              <span>Klik pada bagian tubuh untuk menandai lokasi keluhan atau temuan.</span>
            </div>

            {/* Legend Penanda */}
            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Keluhan Pasien</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Temuan Perawat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <span>Temuan Dokter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body Layout 3 Kolom */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* KOLOM 1: DAFTAR TEMUAN (3/12) */}
          <div className="lg:col-span-3 flex flex-col justify-between border border-gray-200/80 rounded-2xl p-4 bg-white min-h-[460px]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-4">
                DAFTAR TEMUAN
              </h3>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {markers.map((item) => {
                  const theme = getCategoryTheme(item.category);
                  return (
                    <div
                      key={item.id}
                      className={`border rounded-xl p-3 bg-white relative transition-all shadow-2xs ${theme.bgBadge}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${theme.dotBg}`} />
                          <span className="text-[11px] font-bold text-gray-800">{item.category}</span>
                        </div>
                        <button
                          onClick={(e) => handleRemoveMarker(item.id, e)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>

                      <p className="text-[12px] font-bold text-gray-900 mt-1.5 leading-tight">
                        {item.title}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium mt-2">
                        <span>{item.time}</span>
                        <span>{item.author}</span>
                      </div>
                    </div>
                  );
                })}

                {markers.length === 0 && (
                  <p className="text-xs text-center text-gray-400 py-10 font-medium">
                    Belum ada temuan ditandai.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleClearAll}
              className="w-full py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer mt-4"
            >
              Bersihkan Semua
            </button>
          </div>


          {/* KOLOM 2: ANATOMI TUBUH (7/12) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 items-center justify-items-center bg-white min-h-[460px]">
            
            {/* TAMPAK DEPAN */}
            <div className="flex flex-col items-center w-full">
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                TAMPAK DEPAN
              </h4>
              
              <div
                onClick={(e) => handleCanvasClick(e, 'depan')}
                className="relative w-full max-w-[210px] h-[400px] cursor-crosshair flex items-center justify-center group"
              >
                {/* SVG Outline Body Front */}
                <svg viewBox="0 0 200 450" className="w-full h-full stroke-gray-300 fill-none stroke-[1.5] group-hover:stroke-gray-400 transition-colors">
                  {/* Head */}
                  <ellipse cx="100" cy="45" rx="22" ry="28" />
                  {/* Neck */}
                  <path d="M90 70 L90 85 M110 70 L110 85" />
                  {/* Shoulders & Torso */}
                  <path d="M90 85 Q60 90 48 115 L42 180 L35 250 L28 290 L40 292 L48 240 L55 180 L60 170 L60 260 L68 285 L65 410 L85 410 L95 280 L100 260 L105 280 L115 410 L135 410 L132 285 L140 260 L140 170 L145 180 L152 240 L160 292 L172 290 L165 250 L158 180 L152 115 Q140 90 110 85" />
                  {/* Chest & Abdomen Lines */}
                  <path d="M75 140 Q100 150 125 140" strokeDasharray="2 2" />
                  <circle cx="100" cy="225" r="3" className="stroke-gray-300 fill-gray-300" />
                  {/* Face details */}
                  <circle cx="92" cy="42" r="1.5" className="fill-gray-300 stroke-none" />
                  <circle cx="108" cy="42" r="1.5" className="fill-gray-300 stroke-none" />
                  <path d="M96 55 Q100 58 104 55" />
                </svg>

                {/* Markers Overlay Depan */}
                {markers
                  .filter((m) => m.view === 'depan')
                  .map((m) => {
                    const theme = getCategoryTheme(m.category);
                    return (
                      <div
                        key={m.id}
                        style={{ left: `${m.x}%`, top: `${m.y}%` }}
                        onClick={(e) => {
                          if (activeTool === 'hapus') {
                            handleRemoveMarker(m.id, e);
                          }
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/pin"
                      >
                        <span className={`relative flex h-5 w-5 items-center justify-center`}>
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${theme.pingBg}`} />
                          <span className={`relative inline-flex rounded-full h-4 w-4 border-2 ${theme.pinColor} items-center justify-center`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />
                          </span>
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* TAMPAK BELAKANG */}
            <div className="flex flex-col items-center w-full">
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                TAMPAK BELAKANG
              </h4>

              <div
                onClick={(e) => handleCanvasClick(e, 'belakang')}
                className="relative w-full max-w-[210px] h-[400px] cursor-crosshair flex items-center justify-center group"
              >
                {/* SVG Outline Body Back */}
                <svg viewBox="0 0 200 450" className="w-full h-full stroke-gray-300 fill-none stroke-[1.5] group-hover:stroke-gray-400 transition-colors">
                  {/* Head Back */}
                  <ellipse cx="100" cy="45" rx="22" ry="28" />
                  {/* Neck */}
                  <path d="M90 70 L90 85 M110 70 L110 85" />
                  {/* Shoulders & Torso */}
                  <path d="M90 85 Q60 90 48 115 L42 180 L35 250 L28 290 L40 292 L48 240 L55 180 L60 170 L60 250 L68 285 L65 410 L85 410 L95 285 L100 260 L105 285 L115 410 L135 410 L132 285 L140 250 L140 170 L145 180 L152 240 L160 292 L172 290 L165 250 L158 180 L152 115 Q140 90 110 85" />
                  {/* Spine Line */}
                  <path d="M100 85 L100 240" strokeDasharray="3 3" />
                  {/* Shoulder blades */}
                  <path d="M80 120 Q70 140 85 160 M120 120 Q130 140 115 160" />
                </svg>

                {/* Markers Overlay Belakang */}
                {markers
                  .filter((m) => m.view === 'belakang')
                  .map((m) => {
                    const theme = getCategoryTheme(m.category);
                    return (
                      <div
                        key={m.id}
                        style={{ left: `${m.x}%`, top: `${m.y}%` }}
                        onClick={(e) => {
                          if (activeTool === 'hapus') {
                            handleRemoveMarker(m.id, e);
                          }
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/pin"
                      >
                        <span className={`relative flex h-5 w-5 items-center justify-center`}>
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${theme.pingBg}`} />
                          <span className={`relative inline-flex rounded-full h-4 w-4 border-2 ${theme.pinColor} items-center justify-center`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />
                          </span>
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>


          {/* KOLOM 3: BILAH ALAT / TOOLBAR MARKER (2/12) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            
            {/* Tool: Keluhan */}
            <button
              onClick={() => setActiveTool('Keluhan')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTool === 'Keluhan'
                  ? 'border-red-500 bg-red-50/40 text-red-600 shadow-xs'
                  : 'border-gray-200/80 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Target size={22} className={activeTool === 'Keluhan' ? 'text-red-500' : 'text-red-400'} />
              <span className="text-xs font-bold mt-2">Keluhan</span>
            </button>

            {/* Tool: Temuan Perawat */}
            <button
              onClick={() => setActiveTool('Temuan Perawat')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTool === 'Temuan Perawat'
                  ? 'border-amber-500 bg-amber-50/40 text-amber-600 shadow-xs'
                  : 'border-gray-200/80 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Target size={22} className={activeTool === 'Temuan Perawat' ? 'text-amber-500' : 'text-amber-400'} />
              <span className="text-xs font-bold mt-2 text-center leading-tight">
                Temuan Perawat
              </span>
            </button>

            {/* Tool: Temuan Dokter */}
            <button
              onClick={() => setActiveTool('Temuan Dokter')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTool === 'Temuan Dokter'
                  ? 'border-purple-600 bg-purple-50/40 text-purple-600 shadow-xs'
                  : 'border-gray-200/80 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Target size={22} className={activeTool === 'Temuan Dokter' ? 'text-purple-600' : 'text-purple-400'} />
              <span className="text-xs font-bold mt-2 text-center leading-tight">
                Temuan Dokter
              </span>
            </button>

            {/* Tool: Hapus */}
            <button
              onClick={() => setActiveTool('hapus')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTool === 'hapus'
                  ? 'border-slate-600 bg-slate-100 text-slate-800 shadow-xs'
                  : 'border-gray-200/80 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Trash2 size={22} className="text-gray-500" />
              <span className="text-xs font-bold mt-2">Hapus</span>
            </button>

          </div>

        </div>

        {/* Info Banner Bottom (Regulasi SATUSEHAT) */}
        <div className="px-6 pb-4">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/40 border border-blue-100/60 text-[11px] text-blue-900 leading-relaxed">
            <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <span>
              <strong>Catatan:</strong> Peta tubuh merupakan bagian dari dokumentasi pemeriksaan fisik. Data ini akan tersimpan dalam rekam medis sesuai Permenkes No. 24 Tahun 2022 dan terintegrasi dengan SATUSEHAT.
            </span>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex justify-end px-6 py-3.5 border-t border-gray-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}