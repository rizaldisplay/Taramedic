'use client';

import React, { useState, useRef } from 'react';
import { UserCheck, Edit3, RotateCcw } from 'lucide-react';

// --- Types & Interfaces ---
export type JenisPenerima = 'Pasien' | 'Orang tua / Wali' | 'Pendamping';

export interface PenerimaObatData {
  jenisPenerima: JenisPenerima;
  nama: string;
  hubungan: string;
  noIdentitasKtp: string;
  tandaTanganUrl?: string;
}

interface PenerimaObatProps {
  initialData?: Partial<PenerimaObatData>;
  onChangeData?: (data: PenerimaObatData) => void;
}

export default function PenerimaObatComponent({
  initialData,
  onChangeData,
}: PenerimaObatProps) {
  // --- Form State ---
  const [jenisPenerima, setJenisPenerima] = useState<JenisPenerima>(
    initialData?.jenisPenerima || 'Orang tua / Wali'
  );
  const [nama, setNama] = useState<string>(initialData?.nama || 'Dewi Amalia');
  const [hubungan, setHubungan] = useState<string>(initialData?.hubungan || 'Ibu Kandung');
  const [noIdentitasKtp, setNoIdentitasKtp] = useState<string>(
    initialData?.noIdentitasKtp || '3275016205880002'
  );

  // --- Canvas Signature Pad State ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasSignature, setHasSignature] = useState<boolean>(true); // Pre-filled dummy signature state

  // Canvas Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b'; // Slate 800

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col gap-4 font-sans">
      
      {/* Header Section Sidebar */}
      <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase border-b border-slate-100 pb-3">
        <UserCheck className="w-4 h-4 text-cyan-600 shrink-0" />
        <span>PENERIMA OBAT</span>
      </div>

      <div className="flex flex-col gap-3.5 text-xs">
        
        {/* Radio Filter Jenis Penerima */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-slate-500">
            Obat diserahkan kepada:
          </label>
          <div className="flex items-center gap-3 text-[11px] flex-wrap">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="jenisPenerima"
                checked={jenisPenerima === 'Pasien'}
                onChange={() => setJenisPenerima('Pasien')}
                className="text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
              <span className="text-slate-700 font-medium">Pasien</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="jenisPenerima"
                checked={jenisPenerima === 'Orang tua / Wali'}
                onChange={() => setJenisPenerima('Orang tua / Wali')}
                className="text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
              <span className="text-slate-700 font-medium">Orang tua / Wali</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="jenisPenerima"
                checked={jenisPenerima === 'Pendamping'}
                onChange={() => setJenisPenerima('Pendamping')}
                className="text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
              <span className="text-slate-700 font-medium">Pendamping</span>
            </label>
          </div>
        </div>

        {/* Input Nama & Hubungan (Side-by-Side) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Nama
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama penerima..."
              className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Hubungan
            </label>
            <input
              type="text"
              value={hubungan}
              onChange={(e) => setHubungan(e.target.value)}
              placeholder="e.g. Ibu Kandung"
              className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-white"
            />
          </div>
        </div>

        {/* Input No. Identitas KTP */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            No. Identitas (KTP)
          </label>
          <input
            type="text"
            value={noIdentitasKtp}
            onChange={(e) => setNoIdentitasKtp(e.target.value)}
            placeholder="32750..."
            className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 font-mono outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-white"
          />
        </div>

        {/* Tanda Tangan Pad Digital */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-medium text-slate-500">
              Tanda Tangan Penerima
            </label>
            <button
              type="button"
              onClick={clearCanvas}
              className="text-[10px] text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          </div>

          <div className="relative border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden group">
            <canvas
              ref={canvasRef}
              width={280}
              height={90}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[90px] cursor-crosshair touch-none"
            />

            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[11px] text-slate-400 font-medium">
                Goreskan tanda tangan di sini
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}