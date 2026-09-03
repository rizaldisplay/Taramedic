'use client';

import React, { useState } from 'react';
import { X, Eraser } from 'lucide-react';

export type MarkerType = 'Nyeri' | 'Luka' | 'Memar';

export interface BodyMarker {
  id: string;
  type: MarkerType;
  view: 'front' | 'back';
  x: number; // Persentase koordinat X (0-100) dari keseluruhan gambar (depan+belakang digabung)
  y: number; // Persentase koordinat Y (0-100) dari keseluruhan gambar
  label: string;
  note?: string; // Keterangan khusus untuk titik ini
}

const TOOL_COLORS: Record<MarkerType, { bg: string; border: string; text: string; dot: string }> = {
  Nyeri: { bg: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-700', dot: 'bg-rose-500' },
  Luka: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', dot: 'bg-amber-500' },
  Memar: { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700', dot: 'bg-purple-500' },
};

export default function PemeriksaanPetaTubuh() {
  const [activeTool, setActiveTool] = useState<MarkerType>('Nyeri');
  const [markers, setMarkers] = useState<BodyMarker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  // Marker yang sedang dipilih dicari langsung dari state `markers`,
  // supaya keterangan yang ditampilkan selalu sinkron dengan data yang sebenarnya
  // (bukan state terpisah yang bisa "nyasar").
  const selectedMarker = markers.find((m) => m.id === selectedMarkerId) ?? null;
  const noteValue = selectedMarker?.note ?? '';

  // Handler saat gambar tubuh diklik
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    // Clamp supaya klik tepat di tepi tidak menghasilkan nilai di luar 0-100
    const x = Math.min(100, Math.max(0, Math.round(rawX)));
    const y = Math.min(100, Math.max(0, Math.round(rawY)));

    // Menentukan tampak depan atau belakang berdasarkan posisi klik (kiri/kanan gambar)
    // Asumsi: gambar "Model Tubuh.png" berisi tampak depan di setengah kiri
    // dan tampak belakang di setengah kanan, tepat di titik tengah (50%).
    const view = x < 50 ? 'front' : 'back';
    const viewLabel = view === 'front' ? 'Tampak Depan' : 'Tampak Belakang';

    // Normalisasi X menjadi 0-100% RELATIF terhadap tampak (depan/belakang) itu sendiri,
    // bukan relatif terhadap keseluruhan gambar gabungan — supaya label tidak membingungkan.
    const relativeX = view === 'front' ? Math.round(x * 2) : Math.round((x - 50) * 2);

    const newMarker: BodyMarker = {
      // Random suffix mencegah tabrakan ID kalau dua klik terjadi di milidetik yang sama
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: activeTool,
      view,
      x,
      y,
      label: `${viewLabel} (${relativeX}%, ${y}%)`,
    };

    setMarkers((prev) => [...prev, newMarker]);
    setSelectedMarkerId(newMarker.id);
  };

  // Handler Hapus Marker
  const handleRemoveMarker = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMarkers((prev) => prev.filter((m) => m.id !== id));
    if (selectedMarkerId === id) {
      setSelectedMarkerId(null);
    }
  };

  // Handler Reset Semua Marker
  const handleClearAll = () => {
    setMarkers([]);
    setSelectedMarkerId(null);
  };

  // Handler perubahan keterangan — kini menyimpan langsung ke marker yang dipilih,
  // bukan ke state terpisah yang tidak tersambung ke data marker.
  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedMarkerId) return;
    const value = e.target.value.slice(0, 200);
    setMarkers((prev) =>
      prev.map((m) => (m.id === selectedMarkerId ? { ...m, note: value } : m))
    );
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl border border-gray-200 shadow-sm font-sans">
      {/* Header Bagian G */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-600 text-white font-bold text-xs">
            G
          </span>
          <h2 className="text-sm font-bold tracking-wider text-gray-800 uppercase">
            Pemeriksaan / Peta Tubuh
          </h2>
        </div>
        <span className="text-xs text-gray-400 italic">
          Klik pada gambar untuk menandai lokasi
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Control Panel & Form Inputs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          {/* Opsi Jenis Penanda */}
          <div className="flex flex-wrap gap-2">
            {(['Nyeri', 'Luka', 'Memar'] as MarkerType[]).map((tool) => {
              const isActive = activeTool === tool;
              const color = TOOL_COLORS[tool];

              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => setActiveTool(tool)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? `${color.bg} ${color.border} ${color.text} ring-2 ring-cyan-100 shadow-xs`
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                  {tool}
                </button>
              );
            })}

            {/* Tombol Bersihkan */}
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all"
            >
              <Eraser className="w-3.5 h-3.5 text-gray-400" />
              Bersihkan
            </button>
          </div>

          {/* List Lokasi yang Ditandai */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">
              Lokasi yang ditandai
            </label>
            <div className="min-h-[42px] p-2 bg-gray-50/50 rounded-lg border border-gray-200 flex flex-wrap gap-1.5 items-center">
              {markers.length > 0 ? (
                markers.map((marker) => {
                  const color = TOOL_COLORS[marker.type];
                  const isSelected = selectedMarkerId === marker.id;

                  return (
                    <div
                      key={marker.id}
                      onClick={() => setSelectedMarkerId(marker.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-700 shadow-2xs'
                          : `${color.bg} ${color.border} ${color.text}`
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                      <span>{marker.label}</span>
                      {marker.note && (
                        <span className="text-gray-400 font-normal italic max-w-[120px] truncate">
                          — {marker.note}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleRemoveMarker(marker.id, e)}
                        className="text-gray-400 hover:text-rose-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <span className="text-xs text-gray-400 pl-1">
                  Belum ada lokasi yang ditandai.
                </span>
              )}
            </div>
          </div>

          {/* Input Keterangan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">
              Keterangan{selectedMarker ? ` untuk titik: ${selectedMarker.label}` : ''}
            </label>
            <div className="relative">
              <input
                type="text"
                value={noteValue}
                onChange={handleNoteChange}
                disabled={!selectedMarker}
                placeholder={
                  selectedMarker
                    ? 'Tambah keterangan untuk titik terpilih...'
                    : 'Pilih salah satu titik pada daftar atau gambar terlebih dahulu'
                }
                className="w-full p-2.5 pr-16 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
              />
              <span className="absolute right-2.5 top-2.5 text-[10px] font-medium text-gray-400">
                {noteValue.length} / 200
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Peta Tubuh PNG (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div
            onClick={handleMapClick}
            className="relative w-full max-w-[600px] aspect-[3/2] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center cursor-crosshair overflow-hidden group hover:border-cyan-300 transition-all"
          >
            {/* Background Image (Model Tubuh.png) */}
            <img
              src="/images/Model%20Tubuh.png"
              alt="Peta Tubuh"
              className="w-full h-full object-contain pointer-events-none opacity-80"
            />

            {/* Pin Markers */}
            {markers.map((m) => {
              const color = TOOL_COLORS[m.type];
              const isSelected = selectedMarkerId === m.id;

              return (
                <div
                  key={m.id}
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarkerId(m.id);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform z-20 ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}
                >
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color.dot}`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white ${color.dot} shadow-sm`}
                    />
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex w-full max-w-[600px] justify-around">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Tampak Depan
            </span>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Tampak Belakang
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
