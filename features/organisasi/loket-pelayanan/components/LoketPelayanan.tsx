'use client';

import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Pencil,
  Power,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';

export type CounterStatusKey = 'aktif' | 'nonaktif';

export interface ServiceCounterItem {
  id: string;
  urutan: number;
  kode: string;
  namaCounter: string;
  labelLayanan: string;
  status: CounterStatusKey;
}

const DEFAULT_SERVICE_COUNTERS: ServiceCounterItem[] = [
  {
    id: 'cnt-1',
    urutan: 1,
    kode: 'LOKET-01',
    namaCounter: 'Loket 1',
    labelLayanan: 'LOKET 01',
    status: 'aktif',
  },
  {
    id: 'cnt-2',
    urutan: 1,
    kode: 'POLI-01',
    namaCounter: 'Ruang Poli 1',
    labelLayanan: 'Ruang Poli 1',
    status: 'aktif',
  },
  {
    id: 'cnt-3',
    urutan: 1,
    kode: 'FARMASI-01',
    namaCounter: 'Loket Farmasi 1',
    labelLayanan: 'Loket Farmasi 1',
    status: 'aktif',
  },
  {
    id: 'cnt-4',
    urutan: 1,
    kode: 'KASIR-01',
    namaCounter: 'Loket Kasir 1',
    labelLayanan: 'LOKET KASIR 01',
    status: 'aktif',
  },
  {
    id: 'cnt-5',
    urutan: 2,
    kode: 'LOKET-02',
    namaCounter: 'Loket 2',
    labelLayanan: 'LOKET 02',
    status: 'aktif',
  },
  {
    id: 'cnt-6',
    urutan: 2,
    kode: 'POLI-02',
    namaCounter: 'Ruang Poli 2',
    labelLayanan: 'Ruang Poli 2',
    status: 'aktif',
  },
  {
    id: 'cnt-7',
    urutan: 3,
    kode: 'LOKET-03',
    namaCounter: 'Loket 3',
    labelLayanan: 'LOKET 03',
    status: 'aktif',
  },
];

function formatTwoDigitOrder(order: number): string {
  return String(Math.max(1, order)).padStart(2, '0');
}

export default function MasterLoketPelayanan({
  initialCounters = DEFAULT_SERVICE_COUNTERS,
  onAddCounter,
  onUpdateCounter,
  onDeleteCounter,
}: {
  initialCounters?: ServiceCounterItem[];
  onAddCounter?: (counter: ServiceCounterItem) => void;
  onUpdateCounter?: (counter: ServiceCounterItem) => void;
  onDeleteCounter?: (id: string) => void;
}) {
  const [counters, setCounters] =
    useState<ServiceCounterItem[]>(initialCounters);

  // State Form Inline Tambah Loket
  const [formKode, setFormKode] = useState('');
  const [formNamaLoket, setFormNamaLoket] = useState('');
  const [formLabelLayanan, setFormLabelLayanan] = useState('');
  const [formUrutan, setFormUrutan] = useState<number>(1);
  const [formAktif, setFormAktif] = useState<boolean>(true);

  // State Filter & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CounterStatusKey>(
    'ALL',
  );
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State Dropdown Aksi & Modal Edit
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingCounter, setEditingCounter] =
    useState<ServiceCounterItem | null>(null);

  // Filter daftar loket berdasarkan pencarian & status
  const filteredCounters = useMemo(() => {
    return counters.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.kode.toLowerCase().includes(q) ||
          item.namaCounter.toLowerCase().includes(q) ||
          item.labelLayanan.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [counters, statusFilter, searchQuery]);

  const activeCountersCount = useMemo(
    () => counters.filter((item) => item.status === 'aktif').length,
    [counters],
  );

  // Pagination
  const totalItems = filteredCounters.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedCounters = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredCounters.slice(startIdx, startIdx + pageSize);
  }, [filteredCounters, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  const handleAddCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKode.trim() || !formNamaLoket.trim()) return;

    const normalizedCode = formKode
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '-');

    const created: ServiceCounterItem = {
      id: `cnt-${Date.now()}`,
      urutan: Math.max(1, Number(formUrutan) || 1),
      kode: normalizedCode,
      namaCounter: formNamaLoket.trim(),
      labelLayanan:
        formLabelLayanan.trim() || normalizedCode.replace(/-/g, ' '),
      status: formAktif ? 'aktif' : 'nonaktif',
    };

    setCounters((prev) => [...prev, created]);
    onAddCounter?.(created);

    setFormKode('');
    setFormNamaLoket('');
    setFormLabelLayanan('');
    setFormUrutan(1);
    setFormAktif(true);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* 1. HEADER KARTU */}
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
            Loket Pelayanan
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>
              {totalItems} hasil · {activeCountersCount} aktif
            </span>
            <span>CRUD konfigurasi</span>
          </div>
        </div>

        {/* 2. FORM INLINE TAMBAH LOKET */}
        <form
          onSubmit={handleAddCounterSubmit}
          className="px-5 py-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_84px_auto_auto] gap-3 items-end text-xs"
        >
          {/* Kode */}
          <div>
            <label
              htmlFor="loket-kode"
              className="block font-bold text-[#0f3d56] mb-1.5"
            >
              Kode
            </label>
            <input
              id="loket-kode"
              type="text"
              required
              value={formKode}
              onChange={(e) => setFormKode(e.target.value)}
              placeholder="mis. LOKET-03"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
          </div>

          {/* Nama loket */}
          <div>
            <label
              htmlFor="loket-nama"
              className="block font-bold text-[#0f3d56] mb-1.5"
            >
              Nama loket
            </label>
            <input
              id="loket-nama"
              type="text"
              required
              value={formNamaLoket}
              onChange={(e) => setFormNamaLoket(e.target.value)}
              placeholder="Nama internal"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
          </div>

          {/* Label pada layanan */}
          <div>
            <label
              htmlFor="loket-label"
              className="block font-bold text-[#0f3d56] mb-1.5"
            >
              Label pada layanan
            </label>
            <input
              id="loket-label"
              type="text"
              value={formLabelLayanan}
              onChange={(e) => setFormLabelLayanan(e.target.value)}
              placeholder="Nama yang tampil"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
          </div>

          {/* Urutan */}
          <div>
            <label
              htmlFor="loket-urutan"
              className="block font-bold text-[#0f3d56] mb-1.5"
            >
              Urutan
            </label>
            <input
              id="loket-urutan"
              type="number"
              min={1}
              value={formUrutan}
              onChange={(e) =>
                setFormUrutan(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-[#0f3d56] tabular-nums focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
          </div>

          {/* Checkbox Aktif */}
          <label className="h-[34px] inline-flex items-center gap-2 px-1 text-xs font-bold text-[#0f3d56] select-none cursor-pointer">
            <input
              type="checkbox"
              checked={formAktif}
              onChange={(e) => setFormAktif(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#009bb8] focus:ring-[#009bb8]/25 cursor-pointer"
            />
            <span>Aktif</span>
          </label>

          {/* Tombol Tambah */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </form>

        {/* 3. BAR PENCARIAN & FILTER STATUS */}
        <div className="px-5 py-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-4 items-end">
          {/* Input Cari Kode atau Nama Loket */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 mb-1.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari Kode atau Nama Loket..."
              className="w-full bg-transparent border-b border-transparent focus:border-[#009bb8] py-1 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Dropdown Filter Status */}
          <div>
            <label
              htmlFor="filter-loket-status"
              className="block text-xs font-bold text-[#0f3d56] mb-1.5"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="filter-loket-status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(
                    e.target.value as 'ALL' | CounterStatusKey,
                  );
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. TABEL LOKET PELAYANAN */}
        <div className="overflow-x-auto border-t border-slate-200/80">
          <table className="w-full text-left border-collapse min-w-[740px]">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">URUTAN</th>
                <th className="px-4 py-3.5">KODE</th>
                <th className="px-4 py-3.5">NAMA COUNTER</th>
                <th className="px-4 py-3.5">LABEL LAYANAN</th>
                <th className="px-4 py-3.5">STATUS</th>
                <th className="px-5 py-3.5 text-right">AKSI</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 text-xs">
              {paginatedCounters.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 px-5 text-center text-slate-400"
                  >
                    Tidak ada data Loket Pelayanan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                paginatedCounters.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* URUTAN */}
                    <td className="px-5 py-4 align-middle font-mono text-slate-600 font-medium whitespace-nowrap">
                      {formatTwoDigitOrder(item.urutan)}
                    </td>

                    {/* KODE */}
                    <td className="px-4 py-4 align-middle font-mono text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap">
                      {item.kode}
                    </td>

                    {/* NAMA COUNTER */}
                    <td className="px-4 py-4 align-middle font-semibold text-slate-700 whitespace-nowrap">
                      {item.namaCounter}
                    </td>

                    {/* LABEL LAYANAN */}
                    <td className="px-4 py-4 align-middle text-slate-600 whitespace-nowrap">
                      {item.labelLayanan}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4 align-middle whitespace-nowrap">
                      {item.status === 'aktif' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-700">
                          Nonaktif
                        </span>
                      )}
                    </td>

                    {/* AKSI */}
                    <td className="px-5 py-4 align-middle text-right whitespace-nowrap">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          aria-label={`Aksi ${item.namaCounter}`}
                          onClick={() =>
                            setOpenMenuId((prev) =>
                              prev === item.id ? null : item.id,
                            )
                          }
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {openMenuId === item.id && (
                          <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-30 text-left text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCounter(item);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5 text-[#008ba6]" />
                              <span>Edit Loket</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const nextStatus: CounterStatusKey =
                                  item.status === 'aktif'
                                    ? 'nonaktif'
                                    : 'aktif';
                                const updated = {
                                  ...item,
                                  status: nextStatus,
                                };
                                setCounters((prev) =>
                                  prev.map((cnt) =>
                                    cnt.id === item.id ? updated : cnt,
                                  ),
                                );
                                onUpdateCounter?.(updated);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                            >
                              <Power className="w-3.5 h-3.5 text-amber-600" />
                              <span>
                                {item.status === 'aktif'
                                  ? 'Nonaktifkan'
                                  : 'Aktifkan'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setCounters((prev) =>
                                  prev.filter((cnt) => cnt.id !== item.id),
                                );
                                onDeleteCounter?.(item.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 hover:bg-rose-50 flex items-center gap-2 font-semibold text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. FOOTER PAGINATION */}
        <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              <strong className="font-semibold text-slate-700">
                {startNumber}–{endNumber}
              </strong>{' '}
              dari{' '}
              <strong className="font-semibold text-slate-700">
                {totalItems}
              </strong>{' '}
              Loket
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="per-halaman-loket">Per Halaman</label>
              <div className="relative">
                <select
                  id="per-halaman-loket"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safePage <= 1}
              aria-label="Halaman pertama"
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              aria-label="Halaman sebelumnya"
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
              (page) => {
                const isCurrent = page === safePage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-[#e6f6f9] border-[#009bb8] text-[#008ba6]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              },
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={safePage >= totalPages}
              aria-label="Halaman berikutnya"
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage >= totalPages}
              aria-label="Halaman terakhir"
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* MODAL EDIT LOKET PELAYANAN */}
      {editingCounter && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingCounter.kode}
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Loket Pelayanan
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingCounter(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCounters((prev) =>
                  prev.map((item) =>
                    item.id === editingCounter.id ? editingCounter : item,
                  ),
                );
                onUpdateCounter?.(editingCounter);
                setEditingCounter(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Loket
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCounter.kode}
                    onChange={(e) =>
                      setEditingCounter({
                        ...editingCounter,
                        kode: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Urutan
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingCounter.urutan}
                    onChange={(e) =>
                      setEditingCounter({
                        ...editingCounter,
                        urutan: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Counter (Internal)
                </label>
                <input
                  type="text"
                  required
                  value={editingCounter.namaCounter}
                  onChange={(e) =>
                    setEditingCounter({
                      ...editingCounter,
                      namaCounter: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Label pada Layanan
                </label>
                <input
                  type="text"
                  required
                  value={editingCounter.labelLayanan}
                  onChange={(e) =>
                    setEditingCounter({
                      ...editingCounter,
                      labelLayanan: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={editingCounter.status}
                  onChange={(e) =>
                    setEditingCounter({
                      ...editingCounter,
                      status: e.target.value as CounterStatusKey,
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCounter(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}