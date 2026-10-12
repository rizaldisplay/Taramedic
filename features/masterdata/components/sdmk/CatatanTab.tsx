'use client';
// Lokasi: src/features/masterdata/components/sdmk/CatatanTab.tsx
// Tab 7 wizard SDMK: catatan internal + ringkasan kelengkapan data.
import React from 'react';
import { Check, Circle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCatatan } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import { Label, Section } from '@/features/masterdata/components/sdmk/SdmkFields';

const MAX = 2000;

export default function CatatanTab() {
  const dispatch = useAppDispatch();
  const { catatan, detail } = useAppSelector((s) => s.sdmk);

  const checklist = [
    { label: 'Identitas tersimpan', ok: !!detail },
    { label: 'Profesi & kompetensi diisi', ok: !!detail?.profesi.profesi },
    { label: 'STR tersimpan', ok: !!detail?.str },
    { label: 'Memiliki SIP', ok: (detail?.sip.length ?? 0) > 0 },
    { label: 'Memiliki penempatan', ok: (detail?.penempatan.length ?? 0) > 0 },
    { label: 'Jadwal praktik diatur', ok: (detail?.jadwalHari.some((h: { aktif: boolean }) => h.aktif)) ?? false },
    { label: 'Terhubung ke SATUSEHAT', ok: detail?.integrasi.statusIhs === 'terhubung' },
  ];

  return (
    <div className="space-y-8">
      <Section title="Catatan Internal">
        <div>
          <Label text="Catatan (opsional)" />
          <textarea rows={6} maxLength={MAX} value={catatan} onChange={(e) => dispatch(setCatatan(e.target.value))}
            placeholder="Catatan internal untuk SDMK ini"
            className="mt-1.5 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800 resize-none" />
          <p className="text-[11px] text-slate-400 text-right mt-1">{catatan.length}/{MAX}</p>
        </div>
      </Section>
      <Section title="Kelengkapan Data">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {checklist.map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-sm text-slate-700">
              {c.ok ? <Check size={16} className="text-emerald-600" /> : <Circle size={16} className="text-slate-300" />}
              <span className={c.ok ? '' : 'text-slate-400'}>{c.label}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
