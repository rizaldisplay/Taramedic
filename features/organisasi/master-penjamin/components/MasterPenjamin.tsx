'use client';

import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eraser,
  MoreVertical,
  Pencil,
  Power,
  Search,
  Trash2,
  X,
} from 'lucide-react';

export type PenjaminStatusKey = 'aktif' | 'nonaktif';

export interface MasterPenjaminItem {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  tariffType: string;
  status: PenjaminStatusKey;
}

const DEFAULT_MASTER_PENJAMIN: MasterPenjaminItem[] = [
  {
    id: 'mp-1',
    kode: 'ASURANSI_INTERNAL',
    nama: 'Asuransi · tarif internal klinik',
    deskripsi: 'Bukan nilai klaim atau tarif resmi penjamin.',
    tariffType: 'asuransi',
    status: 'aktif',
  },
  {
    id: 'mp-2',
    kode: 'BPJS_INTERNAL',
    nama: 'BPJS · tarif internal klinik',
    deskripsi: 'Bukan nilai klaim atau tarif resmi penjamin.',
    tariffType: 'bpjs_internal',
    status: 'aktif',
  },
  {
    id: 'mp-3',
    kode: 'UMUM',
    nama: 'Umum',
    deskripsi: 'Tarif internal klinik untuk pasien Umum.',
    tariffType: 'umum',
    status: 'aktif',
  },
];

function slugifyTariffType(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export default function MasterPenjamin({
  initialPenjamins = DEFAULT_MASTER_PENJAMIN,
  onAddPenjamin,
  onUpdatePenjamin,
  onDeletePenjamin,
}: {
  initialPenjamins?: MasterPenjaminItem[];
  onAddPenjamin?: (penjamin: MasterPenjaminItem) => void;
  onUpdatePenjamin?: (penjamin: MasterPenjaminItem) => void;
  onDeletePenjamin?: (id: string) => void;
}) {
  const [penjamins, setPenjamins] =
    useState<MasterPenjaminItem[]>(initialPenjamins);

  // Filter & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PenjaminStatusKey>(
    'ALL',
  );
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Sidebar Form "Tambah Referensi"
  const [formCategory, setFormCategory] = useState('master_penjamin');
  const [formKode, setFormKode] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');

  // Modal Edit Master Penjamin
  const [editingPenjamin, setEditingPenjamin] =
    useState<MasterPenjaminItem | null>(null);

  // Filter daftar penjamin berdasarkan pencarian & status
  const filteredPenjamins = useMemo(() => {
    return penjamins.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.kode.toLowerCase().includes(q) ||
          item.nama.toLowerCase().includes(q) ||
          item.deskripsi.toLowerCase().includes(q) ||
          item.tariffType.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [penjamins, statusFilter, searchQuery]);

  const activePenjaminsCount = useMemo(
    () => penjamins.filter((item) => item.status === 'aktif').length,
    [penjamins],
  );

  // Pagination
  const totalItems = filteredPenjamins.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedPenjamins = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredPenjamins.slice(startIdx, startIdx + pageSize);
  }, [filteredPenjamins, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  const isSidebarFormValid =
    formKode.trim().length > 0 && formNama.trim().length > 0;

  const handleClearSidebarForm = () => {
    setFormKode('');
    setFormNama('');
    setFormDeskripsi('');
  };

  const handleSubmitSidebarForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSidebarFormValid) return;

    const normalizedCode = formKode
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_');

    const created: MasterPenjaminItem = {
      id: `mp-${Date.now()}`,
      kode: normalizedCode,
      nama: formNama.trim(),
      deskripsi:
        formDeskripsi.trim() ||
        `Tarif internal klinik untuk kategori ${formNama.trim()}.`,
      tariffType: slugifyTariffType(normalizedCode) || 'umum',
      status: 'aktif',
    };

    setPenjamins((prev) => [...prev, created]);
    onAddPenjamin?.(created);
    handleClearSidebarForm();
  };

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 items-start">
        {/* ===================================================================
            KOLOM KIRI: TABEL MASTER PENJAMIN
           =================================================================== */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden min-w-0">
          {/* Header Bar */}
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
              Master Penjamin
            </h1>

            <span className="text-xs text-slate-400 font-medium">
              {totalItems} hasil · {activePenjaminsCount} aktif
            </span>
          </div>

          {/* Subheader Deskripsi */}
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
            Kelola kategori penjamin internal yang digunakan untuk menentukan
            tarif klinik.
          </div>

          {/* Filter Bar */}
          <div className="px-5 py-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-4 items-end">
            {/* Input Pencarian */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 mb-1.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari Kode, Nama, atau Deskr"
                className="w-full bg-transparent border-b border-transparent focus:border-[#009bb8] py-1 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Filter Status */}
            <div>
              <label
                htmlFor="filter-penjamin-status"
                className="block text-xs font-bold text-[#0f3d56] mb-1.5"
              >
                Status
              </label>
              <div className="relative">
                <select
                  id="filter-penjamin-status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(
                      e.target.value as 'ALL' | PenjaminStatusKey,
                    );
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value="ALL">Semua status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tabel Master Penjamin */}
          <div className="overflow-x-auto border-t border-slate-200/80">
            <table className="w-full text-left border-collapse min-w-[740px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">KODE</th>
                  <th className="px-4 py-3.5">MASTER PENJAMIN</th>
                  <th className="px-4 py-3.5">DESKRIPSI / INFORMASI</th>
                  <th className="px-4 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5 text-right">AKSI</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedPenjamins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 px-5 text-center text-slate-400"
                    >
                      Tidak ada data Master Penjamin yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  paginatedPenjamins.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* KODE */}
                      <td className="px-5 py-4 align-middle font-mono text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap">
                        {item.kode}
                      </td>

                      {/* MASTER PENJAMIN */}
                      <td className="px-4 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                        {item.nama}
                      </td>

                      {/* DESKRIPSI / INFORMASI */}
                      <td className="px-4 py-4 align-middle">
                        <p className="text-slate-500">{item.deskripsi}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          <strong className="font-bold text-slate-600">
                            Tariff Type:
                          </strong>{' '}
                          {item.tariffType}
                        </p>
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
                            aria-label={`Aksi ${item.nama}`}
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
                                  setEditingPenjamin(item);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-[#008ba6]" />
                                <span>Edit Penjamin</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const nextStatus: PenjaminStatusKey =
                                    item.status === 'aktif'
                                      ? 'nonaktif'
                                      : 'aktif';
                                  const updated = {
                                    ...item,
                                    status: nextStatus,
                                  };
                                  setPenjamins((prev) =>
                                    prev.map((p) =>
                                      p.id === item.id ? updated : p,
                                    ),
                                  );
                                  onUpdatePenjamin?.(updated);
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
                                  setPenjamins((prev) =>
                                    prev.filter((p) => p.id !== item.id),
                                  );
                                  onDeletePenjamin?.(item.id);
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

          {/* Footer Pagination */}
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
                Referensi
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="per-halaman-penjamin">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-penjamin"
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

        {/* ===================================================================
            KOLOM KANAN: SIDEBAR FORM TAMBAH REFERENSI
           =================================================================== */}
        <aside className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-extrabold text-[#0f3d56]">
              Tambah Referensi
            </h2>
            <span className="text-[11px] text-slate-400">
              Tersimpan di database
            </span>
          </div>

          <form
            onSubmit={handleSubmitSidebarForm}
            className="mt-4 space-y-3.5 text-xs"
          >
            {/* Select Kategori */}
            <div>
              <label
                htmlFor="sidebar-kategori-penjamin"
                className="block font-bold text-[#0f3d56] mb-1.5"
              >
                Kategori
              </label>
              <div className="relative">
                <select
                  id="sidebar-kategori-penjamin"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value="master_penjamin">Master Penjamin</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Grid 2 Kolom: Kode + Nama */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  htmlFor="sidebar-kode-penjamin"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Kode
                </label>
                <input
                  id="sidebar-kode-penjamin"
                  type="text"
                  value={formKode}
                  onChange={(e) => setFormKode(e.target.value)}
                  placeholder="KODE-001"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label
                  htmlFor="sidebar-nama-penjamin"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Nama
                </label>
                <input
                  id="sidebar-nama-penjamin"
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Nama referensi"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8]"
                />
              </div>
            </div>

            {/* Textarea Deskripsi */}
            <div>
              <label
                htmlFor="sidebar-deskripsi-penjamin"
                className="block font-bold text-[#0f3d56] mb-1.5"
              >
                Deskripsi
              </label>
              <textarea
                id="sidebar-deskripsi-penjamin"
                rows={3}
                value={formDeskripsi}
                onChange={(e) => setFormDeskripsi(e.target.value)}
                placeholder="Keterangan atau aturan penggunaan..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClearSidebarForm}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5 text-slate-500" />
                <span>Bersihkan</span>
              </button>

              <button
                type="submit"
                disabled={!isSidebarFormValid}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-colors ${
                  isSidebarFormValid
                    ? 'bg-[#009bb8] hover:bg-[#00859e] cursor-pointer shadow-2xs'
                    : 'bg-[#7dc4e3] cursor-not-allowed'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[2.4]" />
                <span>Tambah referensi</span>
              </button>
            </div>
          </form>
        </aside>
      </div>

      {/* =====================================================================
          MODAL EDIT MASTER PENJAMIN
         ===================================================================== */}
      {editingPenjamin && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingPenjamin.kode}
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Master Penjamin
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingPenjamin(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPenjamins((prev) =>
                  prev.map((item) =>
                    item.id === editingPenjamin.id ? editingPenjamin : item,
                  ),
                );
                onUpdatePenjamin?.(editingPenjamin);
                setEditingPenjamin(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Master Penjamin
                </label>
                <input
                  type="text"
                  required
                  value={editingPenjamin.nama}
                  onChange={(e) =>
                    setEditingPenjamin({
                      ...editingPenjamin,
                      nama: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tariff Type
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPenjamin.tariffType}
                    onChange={(e) =>
                      setEditingPenjamin({
                        ...editingPenjamin,
                        tariffType: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingPenjamin.status}
                    onChange={(e) =>
                      setEditingPenjamin({
                        ...editingPenjamin,
                        status: e.target.value as PenjaminStatusKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi / Informasi
                </label>
                <textarea
                  rows={2}
                  value={editingPenjamin.deskripsi}
                  onChange={(e) =>
                    setEditingPenjamin({
                      ...editingPenjamin,
                      deskripsi: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPenjamin(null)}
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