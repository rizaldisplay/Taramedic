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
  x: number; // Persentase posisi X (0-100) dari keseluruhan gambar
  y: number; // Persentase posisi Y (0-100) dari keseluruhan gambar
  view: 'depan' | 'belakang';
}

interface ModalPetaTubuhProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalPetaTubuh({ isOpen, onClose }: ModalPetaTubuhProps) {
  // Mode marker aktif untuk menambah titik baru atau menghapus
  const [activeTool, setActiveTool] = useState<MarkerCategory | 'hapus'>('Keluhan');

  // Initial Mock Data disesuaikan dengan gambar referensi
  const [markers, setMarkers] = useState<BodyMarker[]>([
    {
      id: 'mock-1',
      category: 'Keluhan',
      title: 'Nyeri kepala',
      time: '08:20 WIB',
      author: 'Perawat',
      x: 25, // Posisi kepala tampak depan (kiri)
      y: 15,
      view: 'depan',
    },
    {
      id: 'mock-2',
      category: 'Temuan Perawat',
      title: 'Nyeri tekan ringan di abdomen bawah',
      time: '08:25 WIB',
      author: 'Perawat',
      x: 25, // Posisi perut bawah tampak depan (kiri)
      y: 48,
      view: 'depan',
    },
    {
      id: 'mock-3',
      category: 'Temuan Dokter',
      title: 'Tidak ada ruam pada kulit',
      time: '08:45 WIB',
      author: 'Dokter',
      x: 75, // Posisi punggung tengah tampak belakang (kanan)
      y: 38,
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
          pinColor: 'border-red-500 bg-red-50 text-red-600',
        };
      case 'Temuan Perawat':
        return {
          bgBadge: 'bg-amber-50/80 text-amber-600 border-amber-100',
          dotBg: 'bg-amber-500',
          pingBg: 'bg-amber-400',
          pinColor: 'border-amber-500 bg-amber-50 text-amber-600',
        };
      case 'Temuan Dokter':
        return {
          bgBadge: 'bg-purple-50/80 text-purple-600 border-purple-100',
          dotBg: 'bg-purple-600',
          pingBg: 'bg-purple-400',
          pinColor: 'border-purple-600 bg-purple-50 text-purple-600',
        };
    }
  };

  // Handler Klik Canvas Tubuh PNG (Menambah Point)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'hapus') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Clamp memastikan titik tidak melebihi 0 - 100
    const x = Math.min(100, Math.max(0, Math.round(rawX)));
    const y = Math.min(100, Math.max(0, Math.round(rawY)));

    // Asumsi: Gambar setengah kiri adalah depan, setengah kanan adalah belakang
    const view = x < 50 ? 'depan' : 'belakang';
    
    // Waktu realtime saat titik ditambahkan
    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const newMarker: BodyMarker = {
      id: Date.now().toString(),
      category: activeTool as MarkerCategory,
      title: `Temuan Baru (${view === 'depan' ? 'Depan' : 'Belakang'})`,
      time: currentTime,
      author: activeTool === 'Temuan Perawat' ? 'Perawat' : 'Dokter',
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
      view,
    };

    setMarkers([...markers, newMarker]);
  };

  // Hapus Satu Marker
  const handleRemoveMarker = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Cegah propagasi agar tidak memicu handleCanvasClick
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  // Hapus Semua Marker
  const handleClearAll = () => {
    setMarkers([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
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
                      className={`border rounded-xl p-3 bg-white relative transition-all shadow-sm ${theme.bgBadge}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${theme.dotBg}`} />
                          <span className="text-[11px] font-bold text-gray-800">{item.category}</span>
                        </div>
                        <button
                          onClick={(e) => handleRemoveMarker(item.id, e)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                          title="Hapus"
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

          {/* KOLOM 2: ANATOMI TUBUH DENGAN PNG (7/12) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white min-h-[460px]">
            <div
              onClick={handleCanvasClick}
              className={`relative w-full max-w-[550px] aspect-[3/2] bg-white border border-gray-100 rounded-2xl flex items-center justify-center overflow-hidden transition-all group ${
                activeTool === 'hapus' ? 'cursor-default' : 'cursor-crosshair hover:border-blue-300'
              }`}
            >
              {/* Gambar Model Tubuh PNG */}
              <img
                src="/images/Model%20Tubuh.png"
                alt="Peta Tubuh"
                className="w-full h-full object-contain pointer-events-none opacity-90"
              />

              {/* Pin Markers Render */}
              {markers.map((m) => {
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
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin transition-transform ${
                      activeTool === 'hapus' ? 'cursor-pointer hover:scale-125' : 'pointer-events-none'
                    }`}
                  >
                    <span className="relative flex h-6 w-6 items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${theme.pingBg}`} />
                      <span className={`relative inline-flex rounded-full h-4 w-4 border-2 ${theme.pinColor} items-center justify-center shadow-sm`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Label Tampak Depan dan Belakang di bawah gambar */}
            <div className="mt-4 flex w-full max-w-[550px] justify-around">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Tampak Depan
              </span>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Tampak Belakang
              </span>
            </div>
          </div>


          {/* KOLOM 3: BILAH ALAT / TOOLBAR MARKER (2/12) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            
            {/* Tool: Keluhan */}
            <button
              onClick={() => setActiveTool('Keluhan')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTool === 'Keluhan'
                  ? 'border-red-500 bg-red-50/40 text-red-600 shadow-sm'
                  : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
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
                  ? 'border-amber-500 bg-amber-50/40 text-amber-600 shadow-sm'
                  : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
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
                  ? 'border-purple-600 bg-purple-50/40 text-purple-600 shadow-sm'
                  : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
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
                  ? 'border-slate-600 bg-slate-100 text-slate-800 shadow-sm'
                  : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
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
        <div className="flex justify-end px-6 py-3.5 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}