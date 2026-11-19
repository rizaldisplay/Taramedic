'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eraser,
  MoreVertical,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

export type LocationStatusKey = 'aktif' | 'nonaktif';

export interface ServiceLocationItem {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  parentLocation?: string;
  status: LocationStatusKey;
}

const DEFAULT_SERVICE_LOCATIONS: ServiceLocationItem[] = [
  {
    id: 'loc-1',
    kode: 'GEDUNG-UTAMA',
    nama: 'Gedung Utama',
    deskripsi: 'Gedung Utama',
    parentLocation: 'Klinik',
    status: 'aktif',
  },
  {
    id: 'loc-2',
    kode: 'PU',
    nama: 'Poli Umum',
    deskripsi: 'Poli Umum',
    status: 'aktif',
  },
  {
    id: 'loc-3',
    kode: 'RUANG-FARMASI',
    nama: 'Ruang Farmasi',
    parentLocation: 'Gedung Utama',
    status: 'aktif',
  },
  {
    id: 'loc-4',
    kode: 'RUANG-POLI-ANAK',
    nama: 'Ruang Poli Anak',
    parentLocation: 'Gedung Utama',
    status: 'aktif',
  },
];

function generateLocationCode(name: string): string {
  const cleaned = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || `LOK-${Date.now().toString().slice(-4)}`;
}

export default function MasterLokasiPelayanan({
  initialLocations = DEFAULT_SERVICE_LOCATIONS,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
}: {
  initialLocations?: ServiceLocationItem[];
  onAddLocation?: (location: ServiceLocationItem) => void;
  onUpdateLocation?: (location: ServiceLocationItem) => void;
  onDeleteLocation?: (id: string) => void;
}) {
  const [locations, setLocations] =
    useState<ServiceLocationItem[]>(initialLocations);

  // Filter & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | LocationStatusKey>(
    'ALL',
  );
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Sidebar Form "Tambah Referensi"
  const [formCategory, setFormCategory] = useState('lokasi_pelayanan');
  const [formNama, setFormNama] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');

  // Modal Edit Lokasi Pelayanan
  const [editingLocation, setEditingLocation] =
    useState<ServiceLocationItem | null>(null);

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  // Filter lokasi berdasarkan kata kunci & status
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (statusFilter !== 'ALL' && loc.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          loc.kode.toLowerCase().includes(q) ||
          loc.nama.toLowerCase().includes(q) ||
          (loc.deskripsi ?? '').toLowerCase().includes(q) ||
          (loc.parentLocation ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [locations, statusFilter, searchQuery]);

  const activeLocationsCount = useMemo(
    () => locations.filter((loc) => loc.status === 'aktif').length,
    [locations],
  );

  // Pagination
  const totalItems = filteredLocations.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedLocations = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredLocations.slice(startIdx, startIdx + pageSize);
  }, [filteredLocations, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  const isSidebarFormValid = formNama.trim().length > 0;

  const handleClearSidebarForm = () => {
    setFormNama('');
    setFormDeskripsi('');
  };

  const handleSubmitSidebarForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSidebarFormValid) return;

    const created: ServiceLocationItem = {
      id: `loc-${Date.now()}`,
      kode: generateLocationCode(formNama),
      nama: formNama.trim(),
      deskripsi: formDeskripsi.trim() || undefined,
      status: 'aktif',
    };

    setLocations((prev) => [...prev, created]);
    onAddLocation?.(created);
    handleClearSidebarForm();
  };

  // Unduh Template & Ekspor CSV
  const handleDownloadCsv = (onlyTemplate: boolean) => {
    const header = 'kode,nama,deskripsi,parent,status';
    const rows = onlyTemplate
      ? ['RUANG-TINDAKAN,Ruang Tindakan,Ruang tindakan medis,Gedung Utama,aktif']
      : locations.map(
          (loc) =>
            `${loc.kode},"${loc.nama.replace(/"/g, '""')}","${(
              loc.deskripsi ?? ''
            ).replace(/"/g, '""')}","${(loc.parentLocation ?? '').replace(
              /"/g,
              '""',
            )}",${loc.status}`,
        );

    const blob = new Blob([[header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = onlyTemplate
      ? 'template-lokasi-pelayanan.csv'
      : 'data-lokasi-pelayanan.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Impor CSV
  const handleImportCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const lines = reader.result
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length <= 1) return;

      const imported: ServiceLocationItem[] = lines.slice(1).map((line, idx) => {
        const cols = line
          .split(',')
          .map((col) => col.replace(/^"|"$/g, '').trim());
        const status: LocationStatusKey =
          cols[4]?.toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif';

        return {
          id: `loc-imp-${Date.now()}-${idx}`,
          kode: cols[0] || generateLocationCode(cols[1] || `LOK-${idx + 1}`),
          nama: cols[1] || 'Lokasi Baru',
          deskripsi: cols[2] || undefined,
          parentLocation: cols[3] || undefined,
          status,
        };
      });

      setLocations((prev) => [...prev, ...imported]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 items-start">
        {/* ===================================================================
            KOLOM KIRI: TABEL MASTER LOKASI PELAYANAN
           =================================================================== */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden min-w-0">
          {/* Header Bar */}
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
              Lokasi Pelayanan
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-1">
                {totalItems} hasil · {activeLocationsCount} aktif
              </span>

              <button
                type="button"
                onClick={() => handleDownloadCsv(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Template
              </button>

              <button
                type="button"
                onClick={() => handleDownloadCsv(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Ekspor</span>
              </button>

              <input
                ref={importInputRef}
                type="file"
                accept=".csv"
                onChange={handleImportCsvFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Impor</span>
              </button>

              <button
                type="button"
                onClick={() => nameInputRef.current?.focus()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Subheader Deskripsi */}
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
            Kelola lokasi fisik pelayanan. Pengaitan lokasi dengan unit tersedia
            di Pengaturan Unit.
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
                htmlFor="filter-lokasi-status"
                className="block text-xs font-bold text-[#0f3d56] mb-1.5"
              >
                Status
              </label>
              <div className="relative">
                <select
                  id="filter-lokasi-status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(
                      e.target.value as 'ALL' | LocationStatusKey,
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

          {/* Tabel Lokasi Pelayanan */}
          <div className="overflow-x-auto border-t border-slate-200/80">
            <table className="w-full text-left border-collapse min-w-[740px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">KODE</th>
                  <th className="px-4 py-3.5">LOKASI PELAYANAN</th>
                  <th className="px-4 py-3.5">DESKRIPSI / INFORMASI</th>
                  <th className="px-4 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5 text-right">AKSI</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedLocations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 px-5 text-center text-slate-400"
                    >
                      Tidak ada data Lokasi Pelayanan yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  paginatedLocations.map((loc) => (
                    <tr
                      key={loc.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* KODE */}
                      <td className="px-5 py-4 align-middle font-mono text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap">
                        {loc.kode}
                      </td>

                      {/* LOKASI PELAYANAN */}
                      <td className="px-4 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                        {loc.nama}
                      </td>

                      {/* DESKRIPSI / INFORMASI */}
                      <td className="px-4 py-4 align-middle">
                        {loc.deskripsi && (
                          <p className="text-slate-500">{loc.deskripsi}</p>
                        )}
                        {loc.parentLocation && (
                          <p
                            className={`text-[11px] text-slate-500 ${
                              loc.deskripsi ? 'mt-0.5' : ''
                            }`}
                          >
                            <strong className="font-bold text-slate-600">
                              Parent:
                            </strong>{' '}
                            {loc.parentLocation}
                          </p>
                        )}
                        {!loc.deskripsi && !loc.parentLocation && (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        {loc.status === 'aktif' ? (
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
                            aria-label={`Aksi ${loc.nama}`}
                            onClick={() =>
                              setOpenMenuId((prev) =>
                                prev === loc.id ? null : loc.id,
                              )
                            }
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 cursor-pointer"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {openMenuId === loc.id && (
                            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-30 text-left text-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLocation(loc);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-[#008ba6]" />
                                <span>Edit Lokasi</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const nextStatus: LocationStatusKey =
                                    loc.status === 'aktif'
                                      ? 'nonaktif'
                                      : 'aktif';
                                  const updated = {
                                    ...loc,
                                    status: nextStatus,
                                  };
                                  setLocations((prev) =>
                                    prev.map((item) =>
                                      item.id === loc.id ? updated : item,
                                    ),
                                  );
                                  onUpdateLocation?.(updated);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                              >
                                <Power className="w-3.5 h-3.5 text-amber-600" />
                                <span>
                                  {loc.status === 'aktif'
                                    ? 'Nonaktifkan'
                                    : 'Aktifkan'}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setLocations((prev) =>
                                    prev.filter((item) => item.id !== loc.id),
                                  );
                                  onDeleteLocation?.(loc.id);
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
                <label htmlFor="per-halaman-lokasi">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-lokasi"
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
            {/* Kategori */}
            <div>
              <label
                htmlFor="sidebar-kategori-lokasi"
                className="block font-bold text-[#0f3d56] mb-1.5"
              >
                Kategori
              </label>
              <div className="relative">
                <select
                  id="sidebar-kategori-lokasi"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value="lokasi_pelayanan">Lokasi Pelayanan</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Nama */}
            <div>
              <label
                htmlFor="sidebar-nama-lokasi"
                className="block font-bold text-[#0f3d56] mb-1.5"
              >
                Nama
              </label>
              <input
                ref={nameInputRef}
                id="sidebar-nama-lokasi"
                type="text"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Nama referensi"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8]"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label
                htmlFor="sidebar-deskripsi-lokasi"
                className="block font-bold text-[#0f3d56] mb-1.5"
              >
                Deskripsi
              </label>
              <textarea
                id="sidebar-deskripsi-lokasi"
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
          MODAL EDIT LOKASI PELAYANAN
         ===================================================================== */}
      {editingLocation && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingLocation.kode}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Lokasi Pelayanan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingLocation(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLocations((prev) =>
                  prev.map((item) =>
                    item.id === editingLocation.id ? editingLocation : item,
                  ),
                );
                onUpdateLocation?.(editingLocation);
                setEditingLocation(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Lokasi
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLocation.kode}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        kode: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingLocation.status}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        status: e.target.value as LocationStatusKey,
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
                  Nama Lokasi Pelayanan
                </label>
                <input
                  type="text"
                  required
                  value={editingLocation.nama}
                  onChange={(e) =>
                    setEditingLocation({
                      ...editingLocation,
                      nama: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Parent Lokasi (Opsional)
                </label>
                <input
                  type="text"
                  value={editingLocation.parentLocation ?? ''}
                  onChange={(e) =>
                    setEditingLocation({
                      ...editingLocation,
                      parentLocation: e.target.value || undefined,
                    })
                  }
                  placeholder="Contoh: Klinik atau Gedung Utama"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi / Informasi
                </label>
                <textarea
                  rows={2}
                  value={editingLocation.deskripsi ?? ''}
                  onChange={(e) =>
                    setEditingLocation({
                      ...editingLocation,
                      deskripsi: e.target.value || undefined,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLocation(null)}
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