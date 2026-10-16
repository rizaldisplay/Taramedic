'use client';
// Lokasi: src/features/masterdata/components/tarif-obat/tarifObatUi.tsx
// Potongan UI kecil yang dipakai bersama oleh daftar, form, dan riwayat tarif obat.
import React from 'react';
import { CircleDollarSign } from 'lucide-react';
import type { StatusTarif } from '@/types/domain/tarifObat';

export function PillStatus({ value }: { value: StatusTarif }) {
  const tone = value === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200';
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${tone}`}>{value}</span>;
}

/** Kotak informasi biru dengan ikon rupiah. */
export function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div role="note" className="flex gap-2.5 rounded-lg border border-cyan-100 bg-cyan-50/70 px-3 py-2.5 text-xs text-slate-600">
      <CircleDollarSign size={15} className="mt-0.5 shrink-0 text-cyan-600" aria-hidden />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

export const btnPrimary =
  'flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-semibold text-white disabled:opacity-60';
export const btnOutline =
  'px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50';
export const selectCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500';
