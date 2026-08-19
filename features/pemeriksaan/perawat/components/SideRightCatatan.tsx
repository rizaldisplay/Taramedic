"use client";

import React, { useState } from "react";
import { ArrowLeft, History, Phone } from "lucide-react";
import VisitInfoCard from '@/features/pemeriksaan/perawat/components/InformasiKunjungan';

export default function SideRightCatatan() {
  const [internalNote, setInternalNote] = useState('');

  return (
    <div className="lg:col-span-4 flex flex-col gap-5 sticky top-6">
      {/* Card 1: Informasi Kunjungan */}
      <VisitInfoCard />

      {/* Card 2: Catatan Internal */}
      <div className="w-full bg-white rounded-xl border border-gray-200 shadow-2xs p-5">
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>Catatan Internal</span>
        </h3>

        <div className="flex flex-col gap-2">
          <textarea
            rows={4}
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value.slice(0, 500))}
            placeholder="Tulis catatan internal (tidak tampil di resume medis)..."
            className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="text-right text-[10px] text-gray-400 font-medium">
            {internalNote.length} / 500
          </div>

          <button
            type="button"
            className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg border border-blue-200 transition-all mt-1"
          >
            + Tambah Catatan
          </button>
        </div>
      </div>
    </div>
  );
}
