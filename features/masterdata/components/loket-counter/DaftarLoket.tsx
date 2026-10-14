'use client';
// Lokasi: src/features/masterdata/components/lokasi/DaftarLokasi.tsx
import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import {
  fetchLoket, resetForm, setPage, setSearch, setStatusFilter, setTipeFilter, startEdit, toggleLoketStatus,
} from '@/features/masterdata/master-organisasi/loket-counter/slices/loketCounterSclice';
import { OPSI_TIPE } from '@/features/masterdata/master-organisasi/loket-counter/utils/loketCounterHelpers';
import { StatusBadge } from '../sdmk/SdmkFields';
import type { LoketItem, StatusLoket, TipeLoket } from '@/types/domain/loketCounter';

const pad = (n: number) => String(n).padStart(2, '0');

export default function DaftarLokasi() {
  const dispatch = useAppDispatch();
  const {
    items, meta, ringkasan, listLoading, listError, search, statusFilter, tipeFilter, page, perPage, togglingId, editingId,
  } = useAppSelector((s) => s.loketCounter);
  const [q, setQ] = useState(search);

  // Debounce pencarian
  useEffect(() => {
    const t = setTimeout(() => { if (q !== search) dispatch(setSearch(q.trim())); }, 350);
    return () => clearTimeout(t);
  }, [q, search, dispatch]);

  useEffect(() => { dispatch(fetchLoket()); }, [dispatch, search, statusFilter, tipeFilter, page, perPage]);

  const ubahStatus = (x: LoketItem) => {
    dispatch(toggleLoketStatus(x)).unwrap()
      .then(() => dispatch(showNotification({
        title: 'Status Diperbarui', message: `${x.nama} ${x.status === 'Aktif' ? 'dinonaktifkan' : 'diaktifkan'}.`, type: 'success',
      })))
      .catch((e: { message: string }) => dispatch(showNotification({ title: 'Gagal', message: e.message, type: 'error' })));
  };

  const mulaiTambah = () => {
    dispatch(resetForm());
    document.querySelector<HTMLInputElement>('form[aria-labelledby="judul-form-loket"] input')?.focus();
  };

  const offset = (meta.currentPage - 1) * meta.perPage;

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm" aria-labelledby="judul-lokasi">
      <div className="p-5 flex items-center justify-between gap-4 border-b border-slate-200">
        <h3 id="judul-loket" className="text-lg font-bold text-[#0b2756]">Loket / Counter</h3>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">{ringkasan.aktif} aktif · {ringkasan.total} total</span>
          <button type="button" onClick={mulaiTambah}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-semibold text-white">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kode atau nama"
            aria-label="Cari loket / counter"
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
        </div>
        <select aria-label="Filter tipe" value={tipeFilter} onChange={(e) => dispatch(setTipeFilter(e.target.value as TipeLoket | ''))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">Semua tipe</option>
          {OPSI_TIPE.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select aria-label="Filter status" value={statusFilter} onChange={(e) => dispatch(setStatusFilter(e.target.value as StatusLoket | ''))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">Semua status</option>
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
        </select>
      </div>

      <ul className="divide-y divide-slate-100" aria-busy={listLoading}>
        {listLoading && items.length === 0 && (
          <li className="py-12 text-center text-slate-400 text-sm"><Loader2 className="inline animate-spin mr-2" size={16} />Memuat...</li>
        )}
        {listError && <li role="alert" className="py-8 text-center text-red-500 text-xs">{listError}</li>}
        {!listLoading && !listError && items.length === 0 && (
          <li className="py-12 text-center text-xs text-slate-400">Belum ada loket / counter yang cocok.</li>
        )}
        {items.map((x, i) => (
          <li key={x.id} className={`px-5 py-4 flex items-center gap-4 ${editingId === x.id ? 'bg-cyan-50/60' : ''}`}>
            <span className="w-9 h-9 shrink-0 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-bold flex items-center justify-center">
              {pad(offset + i + 1)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-sm text-slate-800">{x.nama}</span>
                <span className="text-xs text-slate-400">{x.kode}</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100 text-[11px] font-semibold">{x.tipe}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {x.deskripsi ? ` · ${x.deskripsi}` : ''}
              </p>
            </div>
            <StatusBadge status={x.status} />
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => dispatch(startEdit(x))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
              <button type="button" disabled={togglingId === x.id} onClick={() => ubahStatus(x)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 min-w-[84px]">
                {togglingId === x.id ? <Loader2 size={12} className="inline animate-spin" /> : x.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="p-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {meta.total === 0 ? 'Tidak ada data' : `Menampilkan ${offset + 1} - ${offset + items.length} dari ${meta.total} data`}
        </span>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1} onClick={() => dispatch(setPage(page - 1))}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs disabled:opacity-40">Sebelumnya</button>
          <button type="button" disabled={page >= meta.lastPage} onClick={() => dispatch(setPage(page + 1))}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs disabled:opacity-40">Berikutnya</button>
        </div>
      </div>
    </section>
  );
}
