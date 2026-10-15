'use client';
// Lokasi: src/features/masterdata/components/produk-obat/DaftarProdukObat.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Loader2, Plus, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import {
  fetchProduk, openCreate, resetFilters, selectItem, setFilter, setPage, setPerPage, setSearch, setSortKey,
  setStatusFilter, sortBy, startEdit, toggleProdukStatus, toggleSortDir,
} from '@/features/masterdata/master-farmasi/produk-obat/slices/produkObatSlice';
import {
  adaFilterAktif, buildFilterOptions, filterItems, jenisProduk, labelRute, LIMIT_BARIS, OPSI_FORMULARIUM,
  OPSI_PER_HALAMAN, OPSI_URUTAN, ringkasKekuatan, sortItems,
} from '@/features/masterdata/master-farmasi/produk-obat/utils/produkObatHelpers';
import { btnPrimary, PillFormularium, PillStatus } from './produkObatUi';
import type { ClientFilters, ProdukObatItem, SortKey, StatusProduk } from '@/types/domain/produkObat';

const selectCls = 'border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500';

function SortableHeader({
  label,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
}) {
  const aktif = sortKey === label;
  return (
    <th scope="col" aria-sort={aktif ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-5 py-3 font-semibold">
      <button type="button" onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 text-xs tracking-wide hover:text-slate-800 ${aktif ? 'text-slate-700' : 'text-slate-500'}`}>
        {label}
        {aktif && sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} className={aktif ? '' : 'text-slate-300'} />}
      </button>
    </th>
  );
}

export default function DaftarProdukObat() {
  const dispatch = useAppDispatch();
  const {
    items, total, listLoading, listError, search, statusFilter, filters, sortKey, sortDir, page, perPage,
    selected, togglingId,
  } = useAppSelector((s) => s.produkObat);
  const [q, setQ] = useState(search);

  // Debounce pencarian (dikirim ke server)
  useEffect(() => {
    const t = setTimeout(() => { if (q.trim() !== search) dispatch(setSearch(q.trim())); }, 350);
    return () => clearTimeout(t);
  }, [q, search, dispatch]);

  // Hanya search & status yang memicu muat ulang; sisanya diproses di klien.
  useEffect(() => { dispatch(fetchProduk()); }, [dispatch, search, statusFilter]);

  const opsi = useMemo(() => buildFilterOptions(items, filters), [items, filters]);
  const hasil = useMemo(() => sortItems(filterItems(items, filters), sortKey, sortDir), [items, filters, sortKey, sortDir]);

  const lastPage = Math.max(1, Math.ceil(hasil.length / perPage));
  const current = Math.min(page, lastPage);
  const offset = (current - 1) * perPage;
  const baris = hasil.slice(offset, offset + perPage);
  const terpotong = total > items.length;

  const setF = (key: keyof ClientFilters) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    dispatch(setFilter({ key, value: e.target.value }));

  const ubahStatus = (x: ProdukObatItem) => {
    dispatch(toggleProdukStatus(x)).unwrap()
      .then(() => dispatch(showNotification({
        title: 'Status Diperbarui', message: `${x.nama} ${x.status === 'Aktif' ? 'dinonaktifkan' : 'diaktifkan'}.`, type: 'success',
      })))
      .catch((e: { message: string }) => dispatch(showNotification({ title: 'Gagal', message: e.message, type: 'error' })));
  };

  const mulaiTambah = () => {
    dispatch(openCreate());
    requestAnimationFrame(() => document.querySelector<HTMLInputElement>('form[aria-labelledby="judul-form-produk"] input')?.focus());
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm" aria-labelledby="judul-produk-obat">
      <div className="p-5 flex items-center justify-between gap-4 border-b border-slate-200">
        <h3 id="judul-produk-obat" className="text-lg font-bold text-[#0b2756]">Produk Obat / Snapshot KFA</h3>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs text-slate-400">Maks. {LIMIT_BARIS} baris</span>
          <button type="button" onClick={mulaiTambah} className={btnPrimary}><Plus size={16} /> Tambah</button>
        </div>
      </div>

      {/* Filter */}
      <div className="px-5 pt-4 pb-3 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-60">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari produk obat"
            placeholder="Cari nama, kode KFA, kode lokal, atau zat aktif…"
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
        </div>
        <select aria-label="Filter status" value={statusFilter} onChange={(e) => dispatch(setStatusFilter(e.target.value as StatusProduk | ''))} className={selectCls}>
          <option value="">Semua status</option>
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
        </select>
        <select aria-label="Filter formularium" value={filters.formularium} onChange={setF('formularium')} className={selectCls}>
          <option value="">Semua formularium</option>
          {OPSI_FORMULARIUM.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select aria-label="Filter sediaan" value={filters.sediaan} onChange={setF('sediaan')} className={selectCls}>
          <option value="">Semua sediaan</option>
          {opsi.sediaan.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select aria-label="Filter rute" value={filters.rute} onChange={setF('rute')} className={selectCls}>
          <option value="">Semua rute</option>
          {opsi.rute.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select aria-label="Filter produsen" value={filters.produsen} onChange={setF('produsen')} className={selectCls}>
          <option value="">Semua produsen</option>
          {opsi.produsen.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div className="px-5 pb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="urutan-produk" className="text-xs font-semibold text-slate-500">Urutkan</label>
        <select id="urutan-produk" value={sortKey} onChange={(e) => dispatch(setSortKey(e.target.value as SortKey))} className={selectCls}>
          {OPSI_URUTAN.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button type="button" onClick={() => dispatch(toggleSortDir())} aria-label={`Arah urutan: ${sortDir === 'asc' ? 'naik' : 'turun'}`}
          className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50">
          {sortDir === 'asc' ? 'A–Z' : 'Z–A'}
        </button>
        {adaFilterAktif(filters) && (
          <button type="button" onClick={() => dispatch(resetFilters())} className="text-xs font-semibold text-cyan-700 hover:underline">
            Hapus filter
          </button>
        )}
      </div>

      <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span aria-live="polite">
          {hasil.length === 0 ? 'Tidak ada hasil' : `Menampilkan ${offset + 1}–${offset + baris.length} dari ${hasil.length} hasil dimuat`}
        </span>
        <span>Data dapat berubah setelah sinkronisasi KFA</span>
      </div>
      {terpotong && (
        <p role="status" className="mx-5 mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Ada {total} produk yang cocok, tetapi hanya {items.length} yang dimuat. Persempit pencarian atau filter status untuk melihat sisanya.
        </p>
      )}

      {/* Tabel */}
      <div className="overflow-x-auto border-t border-slate-200" aria-busy={listLoading}>
        <table className="w-full min-w-190 text-left">
          <thead className="border-b border-slate-200">
            <tr>
              <SortableHeader label="Produk / kode" sortKey="nama" sortDir={sortDir} onSort={(key) => dispatch(sortBy(key))} />
              <SortableHeader label="Zat aktif" sortKey="zatAktif" sortDir={sortDir} onSort={(key) => dispatch(sortBy(key))} />
              <SortableHeader label="Sediaan" sortKey="bentukSediaan" sortDir={sortDir} onSort={(key) => dispatch(sortBy(key))} />
              <SortableHeader label="Status katalog" sortKey="statusFormularium" sortDir={sortDir} onSort={(key) => dispatch(sortBy(key))} />
              <th scope="col" className="px-5 py-3"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listLoading && items.length === 0 && (
              <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                <Loader2 className="inline animate-spin mr-2" size={16} />Memuat...
              </td></tr>
            )}
            {listError && <tr><td colSpan={5} role="alert" className="py-8 text-center text-red-500 text-xs">{listError}</td></tr>}
            {!listLoading && !listError && baris.length === 0 && (
              <tr><td colSpan={5} className="py-12 text-center text-xs text-slate-400">Belum ada produk obat yang cocok.</td></tr>
            )}
            {baris.map((x) => (
              <tr key={x.id} className={`align-top ${selected?.id === x.id ? 'bg-cyan-50/60' : ''}`}>
                <td className="px-5 py-4 max-w-65">
                  <button type="button" onClick={() => dispatch(selectItem(x))}
                    className="text-left font-semibold text-sm text-cyan-800 hover:underline">{x.nama}</button>
                  <p className="text-xs text-slate-400 mt-1 wrap-break-word">KFA {x.kfaCode} · Lokal {x.kodeLokal}</p>
                  <p className="text-xs text-slate-500 mt-1">{x.produsen ?? 'Produsen belum diisi'}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700 max-w-55">
                  <p className="wrap-break-word">{x.zatAktif}</p>
                  <p className="text-xs text-slate-400 mt-1">{jenisProduk(x)}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">
                  <p className="font-semibold">{ringkasKekuatan(x)}</p>
                  <p className="text-xs text-slate-400 mt-1">{x.bentukSediaan} · {labelRute(x)}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <PillFormularium value={x.statusFormularium} />
                    <PillStatus value={x.status} />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">snapshot</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col items-end gap-2">
                    <button type="button" onClick={() => dispatch(startEdit(x))}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                    <button type="button" disabled={togglingId === x.id} onClick={() => ubahStatus(x)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 min-w-23">
                      {togglingId === x.id ? <Loader2 size={12} className="inline animate-spin" /> : x.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          Total hasil dimuat: <strong className="text-slate-700">{items.length}</strong> · Batas endpoint {LIMIT_BARIS} baris
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="baris-produk" className="text-xs text-slate-500">Baris</label>
          <select id="baris-produk" value={perPage} onChange={(e) => dispatch(setPerPage(Number(e.target.value)))}
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white">
            {OPSI_PER_HALAMAN.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button type="button" aria-label="Halaman sebelumnya" disabled={current <= 1} onClick={() => dispatch(setPage(current - 1))}
            className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg disabled:opacity-40"><ChevronLeft size={14} /></button>
          <span aria-label={`Halaman ${current} dari ${lastPage}`}
            className="min-w-8 h-8 px-2 flex items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-xs font-semibold text-cyan-700">{current}</span>
          <button type="button" aria-label="Halaman berikutnya" disabled={current >= lastPage} onClick={() => dispatch(setPage(current + 1))}
            className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg disabled:opacity-40"><ChevronRight size={14} /></button>
        </div>
      </div>
    </section>
  );
}
