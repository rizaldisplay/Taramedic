'use client';

import React, { useMemo, useState } from 'react';
import {
  Archive,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  RotateCcw,
  RotateCw,
  Search,
  X,
} from 'lucide-react';

export type ProdusenStatusKey = 'aktif' | 'arsip';

export interface MasterProdusenItem {
  id: string;
  kode: string;
  nama: string;
  perusahaanTerkait: string;
  kodePerusahaanTerkait: string;
  asal: string;
  status: ProdusenStatusKey;
  jumlahProdukTerhubung: number;
  kontak?: string;
  alamat?: string;
  catatan?: string;
  diperbaruiPada: string;
}

const DEFAULT_PRODUSEN_LIST: MasterProdusenItem[] = [
  {
    id: 'mfr-1',
    kode: 'MFR-000002',
    nama: 'Kalbe Coy',
    perusahaanTerkait: 'PT. Alkesindo Farma Tara',
    kodePerusahaanTerkait: 'SUP-000033',
    asal: 'Indonesia',
    status: 'aktif',
    jumlahProdukTerhubung: 14,
    kontak: '(021) 4287-3888',
    alamat: 'Kawasan Industri Pulogadung, Jakarta Timur',
    catatan: 'Produsen prinsipal farmasi dan alat kesehatan terverifikasi.',
    diperbaruiPada: '19 Nov 2026',
  },
];

export default function MasterProdusen({
  initialItems = DEFAULT_PRODUSEN_LIST,
  onUpdateProdusen,
  onRefresh,
}: {
  initialItems?: MasterProdusenItem[];
  onUpdateProdusen?: (item: MasterProdusenItem) => void;
  onRefresh?: () => void;
}) {
  const [items, setItems] = useState<MasterProdusenItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // State Pencarian, Filter Status & Muat Ulang
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProdusenStatusKey>(
    'aktif',
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal Edit Produsen
  const [editingItem, setEditingItem] = useState<MasterProdusenItem | null>(
    null,
  );

  // Filter Data Produsen
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.kode.toLowerCase().includes(q) ||
          item.nama.toLowerCase().includes(q) ||
          item.perusahaanTerkait.toLowerCase().includes(q) ||
          item.kodePerusahaanTerkait.toLowerCase().includes(q) ||
          item.asal.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [items, statusFilter, searchQuery]);

  // Pagination Calculation
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredItems.slice(startIdx, startIdx + pageSize);
  }, [filteredItems, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  // Item terpilih untuk panel detail kanan
  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return items.find((item) => item.id === selectedId) ?? null;
  }, [items, selectedId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const handleToggleArchiveStatus = (target: MasterProdusenItem) => {
    const nextStatus: ProdusenStatusKey =
      target.status === 'aktif' ? 'arsip' : 'aktif';
    const updated: MasterProdusenItem = {
      ...target,
      status: nextStatus,
      diperbaruiPada: '19 Nov 2026',
    };

    setItems((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onUpdateProdusen?.(updated);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. BANNER INFORMASI ATAS
         ===================================================================== */}
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 px-4 py-3 text-xs text-slate-600">
        Produsen terhubung langsung ke produk; pemasok tetap dikelola terpisah
        di Pembelian.
      </div>

      {/* =====================================================================
          2. BAR PENCARIAN, FILTER STATUS & TOMBOL MUAT ULANG
         ===================================================================== */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari Kode, Nama, atau Perusahaan Terkait"
            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.02)] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
          />
        </div>

        {/* Filter Status Dropdown */}
        <div className="relative min-w-[165px]">
          <select
            aria-label="Filter Status Produsen"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'ALL' | ProdusenStatusKey);
              setCurrentPage(1);
            }}
            className="w-full appearance-none bg-white border border-slate-200/90 rounded-xl pl-3.5 pr-9 py-2.5 text-xs font-semibold text-[#0f3d56] shadow-[0_1px_2px_rgba(15,23,42,0.02)] focus:outline-none focus:border-[#009bb8] cursor-pointer"
          >
            <option value="aktif">Produsen Aktif</option>
            <option value="arsip">Produsen Diarsipkan</option>
            <option value="ALL">Semua Produsen</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Tombol Muat Ulang */}
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition-colors cursor-pointer"
        >
          <RotateCw
            className={`w-3.5 h-3.5 text-[#0f3d56] ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          />
          <span>Muat Ulang</span>
        </button>
      </div>

      {/* =====================================================================
          3. GRID UTAMA 2 KOLOM: TABEL PRODUSEN (KIRI) & PANEL DETAIL (KANAN)
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4 items-stretch">
        {/* ===================================================================
            KOLOM KIRI: TABEL DAFTAR PRODUSEN
           =================================================================== */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
                <tr>
                  <th className="pl-5 pr-3 py-3.5">Produsen</th>
                  <th className="px-3 py-3.5">Perusahaan terkait</th>
                  <th className="px-3 py-3.5">Asal</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="pl-3 pr-5 py-3.5">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 px-5 text-center text-slate-400"
                    >
                      Tidak ada data produsen yang sesuai filter pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#edf7fc]'
                            : 'hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        {/* Produsen */}
                        <td className="pl-5 pr-3 py-4 align-middle">
                          <p className="font-bold text-[#0f3d56] leading-snug">
                            {item.nama}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                            {item.kode}
                          </p>
                        </td>

                        {/* Perusahaan terkait */}
                        <td className="px-3 py-4 align-middle">
                          <p className="text-[#0f3d56] leading-snug">
                            {item.perusahaanTerkait}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                            {item.kodePerusahaanTerkait}
                          </p>
                        </td>

                        {/* Asal */}
                        <td className="px-3 py-4 align-middle text-slate-600 whitespace-nowrap">
                          {item.asal}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-4 align-middle whitespace-nowrap">
                          {item.status === 'aktif' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-700">
                              Diarsipkan
                            </span>
                          )}
                        </td>

                        {/* Aksi */}
                        <td
                          className="pl-3 pr-5 py-4 align-middle whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedId(item.id);
                                setEditingItem(item);
                              }}
                              title="Edit produsen"
                              aria-label={`Edit ${item.nama}`}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleArchiveStatus(item)}
                              title={
                                item.status === 'aktif'
                                  ? 'Arsipkan produsen'
                                  : 'Aktifkan kembali produsen'
                              }
                              aria-label={
                                item.status === 'aktif'
                                  ? `Arsipkan ${item.nama}`
                                  : `Aktifkan ${item.nama}`
                              }
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-amber-50/70 flex items-center justify-center text-amber-700 transition-colors cursor-pointer"
                            >
                              {item.status === 'aktif' ? (
                                <Archive className="w-3.5 h-3.5" />
                              ) : (
                                <RotateCcw className="w-3.5 h-3.5 text-[#008ba6]" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="px-5 py-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-3">
              <span>
                <strong className="font-semibold text-slate-700">
                  {startNumber}–{endNumber}
                </strong>{' '}
                dari{' '}
                <strong className="font-semibold text-slate-700">
                  {totalItems}
                </strong>{' '}
                Produsen
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="per-halaman-produsen">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-produsen"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
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

        {/* ===================================================================
            KOLOM KANAN: PANEL DETAIL PRODUSEN / EMPTY STATE
           =================================================================== */}
        <aside className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-6 flex flex-col justify-between min-h-[240px]">
          {!selectedItem ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-4">
              <Building2 className="w-7 h-7 text-slate-400 mb-2.5 stroke-[1.75]" />
              <h2 className="text-sm font-bold text-[#0f3d56]">
                Pilih produsen
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Detail perusahaan dan status akan tampil di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header Detail */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f6f9] text-[#008ba6] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-extrabold text-[#0f3d56] leading-snug">
                      {selectedItem.nama}
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {selectedItem.kode}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Tutup detail produsen"
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Atribut Detail Perusahaan & Status */}
              <dl className="divide-y divide-slate-200/70 border-t border-b border-slate-200/70 text-xs">
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Status</dt>
                  <dd>
                    {selectedItem.status === 'aktif' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-700">
                        Diarsipkan
                      </span>
                    )}
                  </dd>
                </div>

                <div className="py-2.5 flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Perusahaan terkait</dt>
                  <dd className="text-right">
                    <p className="font-bold text-[#0f3d56]">
                      {selectedItem.perusahaanTerkait}
                    </p>
                    <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                      {selectedItem.kodePerusahaanTerkait}
                    </p>
                  </dd>
                </div>

                <div className="py-2.5 flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Asal negara</dt>
                  <dd className="font-bold text-[#0f3d56]">
                    {selectedItem.asal}
                  </dd>
                </div>

                <div className="py-2.5 flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Produk terhubung</dt>
                  <dd className="font-bold text-[#008ba6] tabular-nums">
                    {selectedItem.jumlahProdukTerhubung} produk
                  </dd>
                </div>

                {selectedItem.kontak && (
                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Kontak</dt>
                    <dd className="font-semibold text-[#0f3d56]">
                      {selectedItem.kontak}
                    </dd>
                  </div>
                )}

                {selectedItem.alamat && (
                  <div className="py-2.5 flex items-start justify-between gap-3">
                    <dt className="text-slate-500 shrink-0">Alamat</dt>
                    <dd className="text-right text-slate-600 leading-relaxed">
                      {selectedItem.alamat}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Tombol Aksi Detail */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingItem(selectedItem)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleArchiveStatus(selectedItem)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  {selectedItem.status === 'aktif' ? (
                    <>
                      <Archive className="w-3.5 h-3.5 text-amber-700" />
                      <span>Arsipkan</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 text-[#008ba6]" />
                      <span>Aktifkan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* =====================================================================
          4. MODAL EDIT PRODUSEN
         ===================================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono font-bold text-[#008ba6]">
                  {editingItem.kode}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Data Produsen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updated: MasterProdusenItem = {
                  ...editingItem,
                  diperbaruiPada: '19 Nov 2026',
                };
                setItems((prev) =>
                  prev.map((item) => (item.id === updated.id ? updated : item)),
                );
                onUpdateProdusen?.(updated);
                setEditingItem(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Produsen <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.nama}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        nama: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Asal Negara
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.asal}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        asal: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Perusahaan Terkait
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.perusahaanTerkait}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        perusahaanTerkait: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Pemasok
                  </label>
                  <input
                    type="text"
                    value={editingItem.kodePerusahaanTerkait}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        kodePerusahaanTerkait: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alamat Perusahaan
                </label>
                <textarea
                  rows={2}
                  value={editingItem.alamat ?? ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      alamat: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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