'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eraser,
  Eye,
  EyeOff,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

export type FormulariumStatusKey = 'aktif' | 'nonaktif';

export interface FormulariumReferensiItem {
  id: string;
  kategori: string;
  kode: string;
  nama: string;
  deskripsi: string;
  approvalRequired: boolean;
  status: FormulariumStatusKey;
}

const DEFAULT_FORMULARIUM_LIST: FormulariumReferensiItem[] = [
  {
    id: 'form-1',
    kategori: 'Formularium & Restriksi',
    kode: 'FORM-STD',
    nama: 'Formularium klinik',
    deskripsi: 'Obat standar yang dapat diresepkan sesuai kewenangan dokter.',
    approvalRequired: false,
    status: 'aktif',
  },
  {
    id: 'form-2',
    kategori: 'Formularium & Restriksi',
    kode: 'FORM-APPROVAL',
    nama: 'Perlu persetujuan',
    deskripsi:
      'Obat memerlukan persetujuan dokter penanggung jawab atau farmasi.',
    approvalRequired: true,
    status: 'aktif',
  },
  {
    id: 'form-3',
    kategori: 'Formularium & Restriksi',
    kode: 'FORM-RESTRICTED',
    nama: 'Restriksi unit layanan',
    deskripsi: 'Obat hanya tersedia untuk unit atau layanan yang ditetapkan.',
    approvalRequired: true,
    status: 'aktif',
  },
];

const KATEGORI_REFERENSI_OPTIONS = [
  'Formularium & Restriksi',
  'Golongan Obat',
  'Kategori Terapi',
  'Aturan Pakai',
];

export default function FormulariumDanRestriksi({
  initialItems = DEFAULT_FORMULARIUM_LIST,
  onAddReferensi,
  onUpdateReferensi,
  onDeleteReferensi,
}: {
  initialItems?: FormulariumReferensiItem[];
  onAddReferensi?: (item: FormulariumReferensiItem) => void;
  onUpdateReferensi?: (item: FormulariumReferensiItem) => void;
  onDeleteReferensi?: (id: string) => void;
}) {
  const [items, setItems] = useState<FormulariumReferensiItem[]>(initialItems);

  // Pencarian, Filter Status & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | FormulariumStatusKey
  >('ALL');
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dropdown Aksi Baris
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // State Form Panel Kanan (Tambah / Edit Referensi)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formKategori, setFormKategori] = useState<string>(
    'Formularium & Restriksi',
  );
  const [formKode, setFormKode] = useState<string>('');
  const [formNama, setFormNama] = useState<string>('');
  const [formDeskripsi, setFormDeskripsi] = useState<string>('');
  const [formApprovalRequired, setFormApprovalRequired] =
    useState<boolean>(false);

  const kodeInputRef = useRef<HTMLInputElement | null>(null);

  // Tutup dropdown menu saat klik di luar
  useEffect(() => {
    if (!openMenuId) return;
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [openMenuId]);

  // Hitung item aktif & hasil filter
  const activeCount = useMemo(
    () => items.filter((item) => item.status === 'aktif').length,
    [items],
  );

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
          item.deskripsi.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [items, statusFilter, searchQuery]);

  // Pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredItems.slice(startIdx, startIdx + pageSize);
  }, [filteredItems, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  const isFormValid = formKode.trim() !== '' && formNama.trim() !== '';

  const handleClearForm = () => {
    setEditingId(null);
    setFormKategori('Formularium & Restriksi');
    setFormKode('');
    setFormNama('');
    setFormDeskripsi('');
    setFormApprovalRequired(false);
  };

  const handleFocusAddForm = () => {
    handleClearForm();
    setTimeout(() => {
      kodeInputRef.current?.focus();
    }, 30);
  };

  const handleStartEdit = (item: FormulariumReferensiItem) => {
    setEditingId(item.id);
    setFormKategori(item.kategori);
    setFormKode(item.kode);
    setFormNama(item.nama);
    setFormDeskripsi(item.deskripsi);
    setFormApprovalRequired(item.approvalRequired);
    setOpenMenuId(null);
    setTimeout(() => {
      kodeInputRef.current?.focus();
    }, 30);
  };

  const handleToggleStatus = (target: FormulariumReferensiItem) => {
    const nextStatus: FormulariumStatusKey =
      target.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: FormulariumReferensiItem = {
      ...target,
      status: nextStatus,
    };
    setItems((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onUpdateReferensi?.(updated);
    setOpenMenuId(null);
  };

  const handleDeleteItem = (target: FormulariumReferensiItem) => {
    setItems((prev) => prev.filter((item) => item.id !== target.id));
    if (editingId === target.id) {
      handleClearForm();
    }
    onDeleteReferensi?.(target.id);
    setOpenMenuId(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const normalizedKode = formKode.trim().toUpperCase().replace(/\s+/g, '-');

    if (editingId) {
      const existing = items.find((i) => i.id === editingId);
      if (!existing) return;

      const updated: FormulariumReferensiItem = {
        ...existing,
        kategori: formKategori,
        kode: normalizedKode,
        nama: formNama.trim(),
        deskripsi:
          formDeskripsi.trim() ||
          `Referensi ${formNama.trim()} pada katalog klinik.`,
        approvalRequired: formApprovalRequired,
      };

      setItems((prev) =>
        prev.map((item) => (item.id === editingId ? updated : item)),
      );
      onUpdateReferensi?.(updated);
      handleClearForm();
      return;
    }

    const created: FormulariumReferensiItem = {
      id: `form-${Date.now()}`,
      kategori: formKategori,
      kode: normalizedKode,
      nama: formNama.trim(),
      deskripsi:
        formDeskripsi.trim() ||
        `Referensi ${formNama.trim()} pada katalog klinik.`,
      approvalRequired: formApprovalRequired,
      status: 'aktif',
    };

    setItems((prev) => [...prev, created]);
    onAddReferensi?.(created);
    handleClearForm();
  };

  return (
    <div className="w-full h-full font-sans text-slate-700">
      {/* =====================================================================
          GRID UTAMA 2 KOLOM: DAFTAR FORMULARIUM (KIRI) & FORM REFERENSI (KANAN)
         ===================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 items-start">
        {/* ===================================================================
            KOLOM KIRI: FORMULARIUM & RESTRIKSI
           =================================================================== */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header Kartu Kiri */}
          <div className="px-5 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
              Formularium &amp; Restriksi
            </h1>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500 tabular-nums">
                {activeCount} aktif &middot; {totalItems} hasil
              </span>

              <button
                type="button"
                onClick={handleFocusAddForm}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Deskripsi Sub-header */}
          <div className="px-5 py-3 border-b border-slate-200/70 text-xs text-slate-500">
            Kelola formularium dan restriksi obat, termasuk kebutuhan
            persetujuan sebelum obat diproses.
          </div>

          {/* Bar Pencarian & Filter Status */}
          <div className="px-5 py-3.5 grid grid-cols-1 md:grid-cols-[1fr_1.45fr] gap-4 items-end text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari Kode, Nama, Deskripsi..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>

            {/* Dropdown Status */}
            <div>
              <label
                htmlFor="filter-formularium-status"
                className="block text-[11px] font-bold text-[#0f3d56] mb-1.5"
              >
                Status
              </label>
              <div className="relative">
                <select
                  id="filter-formularium-status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(
                      e.target.value as 'ALL' | FormulariumStatusKey,
                    );
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value="ALL">Semua status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tabel Formularium & Restriksi */}
          <div className="overflow-x-auto border-t border-slate-200/80">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pl-5 pr-3 py-3.5">KODE</th>
                  <th className="px-3 py-3.5">NAMA</th>
                  <th className="px-3 py-3.5">DESKRIPSI / METADATA</th>
                  <th className="px-3 py-3.5">STATUS</th>
                  <th className="pl-3 pr-5 py-3.5 text-right">AKSI</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 px-5 text-center text-slate-400"
                    >
                      Tidak ada referensi formularium yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => {
                    const isMenuOpen = openMenuId === item.id;
                    const isBeingEdited = editingId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isBeingEdited
                            ? 'bg-[#edf7fc]'
                            : 'bg-white hover:bg-slate-50/80'
                        }`}
                      >
                        {/* KODE */}
                        <td className="pl-5 pr-3 py-4 align-middle font-mono text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                          {item.kode}
                        </td>

                        {/* NAMA */}
                        <td className="px-3 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                          {item.nama}
                        </td>

                        {/* DESKRIPSI / METADATA */}
                        <td className="px-3 py-4 align-middle">
                          <p className="text-slate-500 leading-snug">
                            {item.deskripsi}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            <span className="font-bold text-[#0f3d56]">
                              Approval Required:
                            </span>{' '}
                            <span className="font-mono">
                              {item.approvalRequired ? 'true' : 'false'}
                            </span>
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="px-3 py-4 align-middle whitespace-nowrap">
                          {item.status === 'aktif' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                              Nonaktif
                            </span>
                          )}
                        </td>

                        {/* AKSI */}
                        <td
                          className="pl-3 pr-5 py-4 align-middle text-right whitespace-nowrap relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(isMenuOpen ? null : item.id)
                            }
                            aria-label={`Aksi untuk ${item.nama}`}
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-5 top-12 z-30 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 text-xs text-left">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(item)}
                                className="w-full px-3.5 py-2 flex items-center gap-2 text-[#0f3d56] hover:bg-slate-50 font-semibold cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                                <span>Edit Referensi</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(item)}
                                className="w-full px-3.5 py-2 flex items-center gap-2 text-[#0f3d56] hover:bg-slate-50 font-semibold cursor-pointer"
                              >
                                {item.status === 'aktif' ? (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Nonaktifkan</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3.5 h-3.5 text-[#008ba6]" />
                                    <span>Aktifkan</span>
                                  </>
                                )}
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item)}
                                className="w-full px-3.5 py-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50/70 font-semibold cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          )}
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
              <span className="tabular-nums">
                <strong className="font-semibold text-slate-700">
                  {startNumber}&ndash;{endNumber}
                </strong>{' '}
                dari{' '}
                <strong className="font-semibold text-slate-700">
                  {totalItems}
                </strong>{' '}
                Item Master
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="per-halaman-formularium">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-formularium"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
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
            KOLOM KANAN: PANEL TAMBAH / EDIT REFERENSI
           =================================================================== */}
        <aside className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5">
          {/* Header Panel Kanan */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200/70">
            <h2 className="text-base font-extrabold text-[#0f3d56] leading-snug">
              {editingId ? 'Edit Referensi' : 'Tambah Referensi'}
            </h2>
            <span className="text-[11px] text-slate-400 text-right leading-tight">
              Tersimpan di database
            </span>
          </div>

          {/* Form Tambah / Edit Referensi */}
          <form onSubmit={handleFormSubmit} className="pt-4 space-y-3.5 text-xs">
            {/* Kategori */}
            <div>
              <label
                htmlFor="referensi-kategori"
                className="block font-bold text-[#0f3d56] mb-1.5"
              >
                Kategori
              </label>
              <div className="relative">
                <select
                  id="referensi-kategori"
                  value={formKategori}
                  onChange={(e) => setFormKategori(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  {KATEGORI_REFERENSI_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Kode & Nama (2 Kolom) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  htmlFor="referensi-kode"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Kode
                </label>
                <input
                  ref={kodeInputRef}
                  id="referensi-kode"
                  type="text"
                  value={formKode}
                  onChange={(e) => setFormKode(e.target.value)}
                  placeholder="KODE-001"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="referensi-nama"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Nama
                </label>
                <input
                  id="referensi-nama"
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Nama referensi"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label
                htmlFor="referensi-deskripsi"
                className="block font-bold text-[#0f3d56] mb-1.5"
              >
                Deskripsi
              </label>
              <textarea
                id="referensi-deskripsi"
                rows={3}
                value={formDeskripsi}
                onChange={(e) => setFormDeskripsi(e.target.value)}
                placeholder="Keterangan atau aturan penggunaan..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>

            {/* Checkbox Memerlukan persetujuan */}
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0f3d56] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formApprovalRequired}
                onChange={(e) => setFormApprovalRequired(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#009bb8] focus:ring-[#009bb8]"
              />
              <span>Memerlukan persetujuan</span>
            </label>

            {/* Tombol Bersihkan & Tambah / Simpan Referensi */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleClearForm}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5 text-slate-500" />
                <span>{editingId ? 'Batal' : 'Bersihkan'}</span>
              </button>

              <button
                type="submit"
                disabled={!isFormValid}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] disabled:bg-[#7cc6d6] disabled:cursor-not-allowed text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {editingId ? 'Simpan perubahan' : 'Tambah referensi'}
                </span>
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}