'use client';
// Lokasi: src/features/masterdata/components/tarif-obat/RiwayatTarifObat.tsx
// Jejak perubahan satu tarif; dibuka dari ikon riwayat pada daftar atau otomatis setelah menyimpan.
import React from 'react';
import { ChevronDown, ChevronUp, History, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleRiwayat } from '@/features/masterdata/master-farmasi/tarif-obat/slices/tarifObatSlice';
import { formatTanggalWaktu, LABEL_AKSI, nilaiPerubahan } from '@/features/masterdata/master-farmasi/tarif-obat/utils/tarifObatHelpers';

export default function RiwayatTarifObat() {
  const dispatch = useAppDispatch();
  const { open, forId, forLabel, items, loading, error } = useAppSelector((s) => s.tarifObat.riwayat);

  return (
    <section aria-label="Riwayat perubahan tarif" className="mx-5 mb-5 rounded-xl border border-slate-200">
      <button type="button" onClick={() => dispatch(toggleRiwayat())} aria-expanded={open} aria-controls="isi-riwayat-tarif"
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left">
        <History size={16} className="shrink-0 text-slate-500" aria-hidden />
        <span className="text-sm font-semibold text-[#0b2756]">Riwayat perubahan tarif</span>
        <span className="ml-auto max-w-[45%] truncate text-xs text-slate-400">{forLabel ?? 'Pilih tarif'}</span>
        {open ? <ChevronUp size={15} className="shrink-0 text-slate-400" /> : <ChevronDown size={15} className="shrink-0 text-slate-400" />}
      </button>

      {open && (
        <div id="isi-riwayat-tarif" className="border-t border-slate-100 px-4 py-3" aria-busy={loading}>
          {forId === null && (
            <p className="py-3 text-center text-xs text-slate-400">Klik ikon riwayat pada baris tarif untuk melihat perubahannya.</p>
          )}
          {forId !== null && loading && items.length === 0 && (
            <p className="py-3 text-center text-xs text-slate-400"><Loader2 size={14} className="inline animate-spin mr-2" />Memuat...</p>
          )}
          {error && <p role="alert" className="py-3 text-center text-xs text-red-500">{error}</p>}
          {forId !== null && !loading && !error && items.length === 0 && (
            <p className="py-3 text-center text-xs text-slate-400">Belum ada riwayat.</p>
          )}
          <ol className="space-y-3">
            {items.map((r) => (
              <li key={r.id} className="border-l-2 border-cyan-200 pl-3">
                <p className="text-sm font-semibold text-slate-800">{LABEL_AKSI[r.aksi]}</p>
                <p className="text-[11px] text-slate-400">{r.oleh ?? 'Sistem'} · {formatTanggalWaktu(r.waktu)}</p>
                {r.perubahan.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 text-xs text-slate-600">
                    {r.perubahan.map((p) => (
                      <li key={p.field}>
                        <span className="font-semibold text-slate-700">{p.label}:</span>{' '}
                        {r.aksi === 'dibuat' ? nilaiPerubahan(p, p.ke) : <>{nilaiPerubahan(p, p.dari)} → {nilaiPerubahan(p, p.ke)}</>}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
