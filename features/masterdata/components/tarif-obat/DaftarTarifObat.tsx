'use client';
// Lokasi: src/features/masterdata/components/tarif-obat/DaftarTarifObat.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Ban, CheckCircle2, ChevronLeft, ChevronRight, History, Loader2, Pencil, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import {
  fetchRiwayat, fetchTarif, fetchTarifOptions, labelTarif, setPage, setPenjaminFilter, setPerPage, setSearch,
  setStatusFilter, startEdit, toggleTarifStatus,
} from '@/features/masterdata/master-farmasi/tarif-obat/slices/tarifObatSlice';
import {
  formatRupiah, hariIni, keadaanMasa, masaBerlaku, OPSI_PENJAMIN_BAWAAN, OPSI_PER_HALAMAN,
} from '@/features/masterdata/master-farmasi/tarif-obat/utils/tarifObatHelpers';
import { InfoNote, PillStatus, selectCls } from './tarifObatUi';
import type { StatusTarif, TarifObatItem } from '@/types/domain/tarifObat';

const iconBtn = 'w-9 h-9 flex items-center justify-center border rounded-lg disabled:opacity-50 transition-colors';

export default function DaftarTarifObat() {
  const dispatch = useAppDispatch();
  const {
    items, meta, listLoading, listError, search, penjaminFilter, statusFilter, page, perPage,
    options, editingId, togglingId, riwayat,
  } = useAppSelector((s) => s.tarifObat);
  const [q, setQ] = useState(search);
  const today = useMemo(() => hariIni(), []);

  // Debounce pencarian
  useEffect(() => {
    const t = setTimeout(() => { if (q.trim() !== search) dispatch(setSearch(q.trim())); }, 350);
    return () => clearTimeout(t);
  }, [q, search, dispatch]);

  useEffect(() => { dispatch(fetchTarifOptions()); }, [dispatch]);
  useEffect(() => { dispatch(fetchTarif()); }, [dispatch, search, penjaminFilter, statusFilter, page, perPage]);

  const ubahStatus = (x: TarifObatItem) => {
    dispatch(toggleTarifStatus(x)).unwrap()
      .then(() => dispatch(showNotification({
        title: 'Status Diperbarui', message: `Tarif ${labelTarif(x)} ${x.status === 'Aktif' ? 'dinonaktifkan' : 'diaktifkan'}.`, type: 'success',
      })))
      .catch((e: { message: string }) => dispatch(showNotification({ title: 'Gagal', message: e.message, type: 'error' })));
  };

  const mulaiEdit = (x: TarifObatItem) => {
    dispatch(startEdit(x));
    requestAnimationFrame(() => document.querySelector<HTMLElement>('form[aria-labelledby="judul-form-tarif"] select')?.focus());
  };

  const daftarPenjamin = options?.penjamin ?? OPSI_PENJAMIN_BAWAAN;
  const offset = (meta.currentPage - 1) * meta.perPage;

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm" aria-labelledby="judul-tarif-obat">
      <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200">
        <h3 id="judul-tarif-obat" className="text-lg font-bold text-[#0b2756]">Tarif Obat Per Penjamin</h3>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, kode, satuan…"
            aria-label="Cari tarif obat"
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
        </div>
      </div>

      <div className="p-5 space-y-4">
        <InfoNote>Tarif lokal untuk invoice internal. Tarif Umum tidak otomatis dipakai untuk BPJS atau Asuransi.</InfoNote>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select aria-label="Filter penjamin" value={penjaminFilter} onChange={(e) => dispatch(setPenjaminFilter(e.target.value))} className={selectCls}>
            <option value="">Semua penjamin</option>
            {daftarPenjamin.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select aria-label="Filter status" value={statusFilter} onChange={(e) => dispatch(setStatusFilter(e.target.value as StatusTarif | ''))} className={selectCls}>
            <option value="">Semua status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto" aria-busy={listLoading}>
        <table className="w-full min-w-205 text-left">
          <thead className="border-y border-slate-200">
            <tr className="text-xs uppercase tracking-wider text-slate-500">
              {['Obat', 'Penjamin', 'Satuan', 'Tarif', 'Masa berlaku', 'Status', 'Aksi'].map((h) => (
                <th key={h} scope="col" className="px-5 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listLoading && items.length === 0 && (
              <tr><td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                <Loader2 className="inline animate-spin mr-2" size={16} />Memuat...
              </td></tr>
            )}
            {listError && <tr><td colSpan={7} role="alert" className="py-8 text-center text-red-500 text-xs">{listError}</td></tr>}
            {!listLoading && !listError && items.length === 0 && (
              <tr><td colSpan={7} className="py-12 text-center text-xs text-slate-400">Belum ada tarif obat yang cocok.</td></tr>
            )}
            {items.map((x) => {
              const sedangDiedit = editingId === x.id;
              const riwayatAktif = riwayat.open && riwayat.forId === x.id;
              const keadaan = keadaanMasa(x, today);
              const aktif = x.status === 'Aktif';
              return (
                <tr key={x.id} className={`align-middle ${sedangDiedit ? 'bg-amber-50/40' : ''}`}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-sm text-slate-800">{x.obatNama}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{x.obatKode}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">{x.penjamin}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">{x.satuan}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{formatRupiah(x.tarif)}</td>
                  <td className="px-5 py-4 text-sm text-slate-700 whitespace-nowrap">{masaBerlaku(x)}</td>
                  <td className="px-5 py-4">
                    <PillStatus value={x.status} />
                    {keadaan && keadaan !== 'Berlaku' && (
                      <p className="text-[11px] text-amber-700 mt-1">{keadaan}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => dispatch(fetchRiwayat(x))} title="Riwayat perubahan" aria-label={`Riwayat tarif ${labelTarif(x)}`}
                        aria-pressed={riwayatAktif}
                        className={`${iconBtn} ${riwayatAktif ? 'border-cyan-300 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <History size={15} />
                      </button>
                      <button type="button" onClick={() => mulaiEdit(x)} title="Edit tarif" aria-label={`Edit tarif ${labelTarif(x)}`}
                        className={`${iconBtn} ${sedangDiedit ? 'border-amber-400 ring-2 ring-amber-300 text-amber-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <Pencil size={15} />
                      </button>
                      <button type="button" disabled={togglingId === x.id} onClick={() => ubahStatus(x)}
                        title={aktif ? 'Nonaktifkan tarif' : 'Aktifkan tarif'} aria-label={`${aktif ? 'Nonaktifkan' : 'Aktifkan'} tarif ${labelTarif(x)}`}
                        className={`${iconBtn} border-slate-200 text-slate-600 hover:bg-slate-50`}>
                        {togglingId === x.id ? <Loader2 size={15} className="animate-spin" /> : aktif ? <Ban size={15} /> : <CheckCircle2 size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500" aria-live="polite">
          {meta.total === 0 ? 'Tidak ada data' : `Menampilkan ${offset + 1}–${offset + items.length} dari ${meta.total} tarif`}
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="baris-tarif" className="text-xs text-slate-500">Baris</label>
          <select id="baris-tarif" value={perPage} onChange={(e) => dispatch(setPerPage(Number(e.target.value)))}
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white">
            {OPSI_PER_HALAMAN.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => dispatch(setPage(page - 1))}
            className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg disabled:opacity-40"><ChevronLeft size={14} /></button>
          <span aria-label={`Halaman ${meta.currentPage} dari ${meta.lastPage}`}
            className="min-w-8 h-8 px-2 flex items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-xs font-semibold text-cyan-700">{meta.currentPage}</span>
          <button type="button" aria-label="Halaman berikutnya" disabled={page >= meta.lastPage} onClick={() => dispatch(setPage(page + 1))}
            className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg disabled:opacity-40"><ChevronRight size={14} /></button>
        </div>
      </div>
    </section>
  );
}
