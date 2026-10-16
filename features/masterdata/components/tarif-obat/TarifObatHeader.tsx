'use client';
// Lokasi: src/features/masterdata/components/tarif-obat/TarifObatHeader.tsx
import React from 'react';

export function TarifObatHeader() {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-1">Master data · Farmasi</p>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Tarif Obat</h2>
        <p className="text-sm text-slate-600">
          Kelola tarif internal menurut penjamin, satuan, dan masa berlaku. Tarif ini bukan nilai klaim.
        </p>
      </div>
      <span className="self-start md:self-end px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold border border-cyan-100">
        Tarif internal · lokal
      </span>
    </div>
  );
}
