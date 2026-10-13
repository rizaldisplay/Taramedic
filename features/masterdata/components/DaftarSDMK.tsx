'use client';
// Lokasi: src/features/masterdata/components/DaftarSDMK.tsx
// (File ini tidak ada di unggahan; dibuat mengikuti pola CariPasien/DataPasien.)
import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchSdmkDetail, fetchSdmkList, openWizardCreate, selectSdmk, setPage, setSearch, setStatusFilter,
} from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import type { StatusSdmk } from '@/types/domain/sdmk';
import { StatusBadge } from '@/features/masterdata/components/sdmk/SdmkFields';
import TambahSDMKModal from './sdmk/tambahSDMKModal';

const STATUS: (StatusSdmk | '')[] = ['', 'Aktif', 'Tidak Aktif', 'Cuti', 'Berakhir Kontrak'];

export default function DaftarSDMK() {
  const dispatch = useAppDispatch();
  const { items, meta, listLoading, listError, search, statusFilter, page, perPage, selectedId } = useAppSelector((s) => s.sdmk);
  const [q, setQ] = useState(search);

  // Debounce pencarian
  useEffect(() => {
    const t = setTimeout(() => { if (q !== search) dispatch(setSearch(q.trim())); }, 350);
    return () => clearTimeout(t);
  }, [q, search, dispatch]);

  useEffect(() => { dispatch(fetchSdmkList()); }, [dispatch, search, statusFilter, page, perPage]);

  const pilih = (id: number) => { dispatch(selectSdmk(id)); dispatch(fetchSdmkDetail(id)); };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, SDMK ID, atau nomor STR"
            aria-label="Cari SDMK" className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
        </div>
        <div className="flex gap-3">
          <select aria-label="Filter status" value={statusFilter} onChange={(e) => dispatch(setStatusFilter(e.target.value as StatusSdmk | ''))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
            {STATUS.map((s) => <option key={s} value={s}>{s || 'Semua status'}</option>)}
          </select>
          <button type="button" onClick={() => dispatch(openWizardCreate())}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-semibold text-white">
            <Plus size={16} /> Tambah SDMK
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" aria-busy={listLoading}>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
            <tr><th className="px-5 py-3">SDMK</th><th className="px-5 py-3">Profesi</th><th className="px-5 py-3">No. STR</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Izin</th><th className="px-5 py-3">SATUSEHAT</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listLoading && items.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-slate-400"><Loader2 className="inline animate-spin mr-2 text-cyan-600" size={16} />Memuat...</td></tr>
            )}
            {listError && <tr><td colSpan={6} role="alert" className="py-8 text-center text-red-500 text-xs">{listError}</td></tr>}
            {!listLoading && !listError && items.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-xs text-slate-400">Tidak ada SDMK yang cocok.</td></tr>}
            {items.map((x) => (
              <tr key={x.id} onClick={() => pilih(x.id)} tabIndex={0} aria-selected={selectedId === x.id}
                onKeyDown={(e) => { if (e.key === 'Enter') pilih(x.id); }}
                className={`cursor-pointer hover:bg-slate-50 ${selectedId === x.id ? 'bg-cyan-50/60' : ''}`}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold flex items-center justify-center">{x.inisial}</span>
                    <div><p className="font-semibold text-slate-800 text-xs">{x.namaLengkap}</p><p className="text-[11px] text-slate-400">{x.sdmkId}</p></div>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-slate-600">{x.profesi}{x.spesialisasi ? ` · ${x.spesialisasi}` : ''}</td>
                <td className="px-5 py-3 text-xs text-slate-600">{x.nomorStr ?? '-'}</td>
                <td className="px-5 py-3"><StatusBadge status={x.status} /></td>
                <td className="px-5 py-3"><StatusBadge status={x.statusIzin} /></td>
                <td className="px-5 py-3"><StatusBadge status={x.statusIhs} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {meta.total === 0 ? 'Tidak ada data' : `Menampilkan ${(meta.currentPage - 1) * meta.perPage + 1} - ${(meta.currentPage - 1) * meta.perPage + items.length} dari ${meta.total} data`}
        </span>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1} onClick={() => dispatch(setPage(page - 1))} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs disabled:opacity-40">Sebelumnya</button>
          <button type="button" disabled={page >= meta.lastPage} onClick={() => dispatch(setPage(page + 1))} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs disabled:opacity-40">Berikutnya</button>
        </div>
      </div>

      <TambahSDMKModal />
    </div>
  );
}
