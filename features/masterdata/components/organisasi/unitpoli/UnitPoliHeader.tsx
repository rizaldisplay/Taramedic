'use client';
// Lokasi: src/features/masterdata/components/unitpoli/UnitPoliHeader.tsx
import React from 'react';

export function UnitPoliHeader() {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-1">Master data · Organisasi</p>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Unit &amp; Poli</h2>
        <p className="text-sm text-slate-600">Kelola unit dan poli yang menjadi scope layanan serta filter antrean.</p>
      </div>
      <span className="self-start md:self-end px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold border border-cyan-100">
        Organisasi · lokal
      </span>
    </div>
  );
}
