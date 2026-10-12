'use client';
// Lokasi: src/features/masterdata/components/sdmk/SdmkHistoryModal.tsx
// Dipakai tombol "Riwayat SDMK" dan "Audit Trail" di header.
import React from 'react';
import { Loader2, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeHistory } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';

export default function SdmkHistoryModal() {
  const dispatch = useAppDispatch();
  const { historyOpen, historyItems, historyLoading, selectedId, detail } = useAppSelector((s) => s.sdmk);
  if (!historyOpen) return null;
  const judul = historyOpen === 'history' ? 'Riwayat SDMK' : 'Audit Trail';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label={judul}>
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-[#0b2756]">{judul}</h2>
            <p className="text-xs text-slate-500 mt-1">{selectedId && detail ? `${detail.identitas.namaLengkap} (${detail.sdmkId})` : 'Seluruh SDMK'}</p>
          </div>
          <button type="button" aria-label="Tutup" onClick={() => dispatch(closeHistory())} className="text-slate-400 hover:text-slate-700 p-1"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto p-6">
          {historyLoading ? (
            <div className="flex justify-center py-12 text-slate-400 gap-2 text-sm"><Loader2 className="animate-spin" size={18} /> Memuat...</div>
          ) : historyItems.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-12">Belum ada catatan.</p>
          ) : (
            <ol className="space-y-3">
              {historyItems.map((h) => (
                <li key={h.id} className="border border-slate-200 rounded-lg px-4 py-3">
                  <div className="flex justify-between text-xs text-slate-500"><span>{h.waktu}</span><span>{h.oleh}</span></div>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{h.aksi}</p>
                  {h.keterangan && <p className="text-xs text-slate-600 mt-0.5">{h.keterangan}</p>}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
