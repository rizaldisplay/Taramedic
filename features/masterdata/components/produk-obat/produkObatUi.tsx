'use client';
// Lokasi: src/features/masterdata/components/produk-obat/produkObatUi.tsx
// Potongan UI kecil yang dipakai bersama oleh daftar, form, dan detail produk obat.
import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import type { StatusFormularium, StatusProduk } from '@/types/domain/produkObat';

const TONE = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
} as const;

function Pill({ tone, children }: { tone: keyof typeof TONE; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${TONE[tone]}`}>
      {children}
    </span>
  );
}

export const PillFormularium = ({ value }: { value: StatusFormularium }) => (
  <Pill tone={value === 'Formularium' ? 'green' : value === 'Perlu persetujuan' ? 'amber' : 'slate'}>{value}</Pill>
);

export const PillStatus = ({ value }: { value: StatusProduk }) => (
  <Pill tone={value === 'Aktif' ? 'green' : 'slate'}>{value}</Pill>
);

/** Kotak informasi biru dengan ikon perisai. */
export function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div role="note" className="flex gap-2.5 rounded-lg border border-cyan-100 bg-cyan-50/70 px-3 py-2.5 text-xs text-slate-600">
      <ShieldCheck size={15} className="mt-0.5 shrink-0 text-cyan-600" aria-hidden />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

/** Kepala panel kanan: judul, label "KFA · lokal", dan tombol kembali. */
export function PanelHeader({ id, title, backLabel, onBack }: { id: string; title: string; backLabel: string; onBack: () => void }) {
  return (
    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
      <h3 id={id} className="text-lg font-bold text-[#0b2756]">{title}</h3>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-slate-500">KFA · lokal</span>
        <button type="button" onClick={onBack} aria-label={backLabel} title={backLabel}
          className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
          <ArrowLeft size={16} />
        </button>
      </div>
    </div>
  );
}

export const btnPrimary =
  'flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-semibold text-white disabled:opacity-60';
export const btnOutline =
  'px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50';
