'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  AlignLeft,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleDollarSign,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Info,
  ListFilter,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from 'lucide-react';

export type LayananStatusKey = 'aktif' | 'nonaktif';
export type LayananDetailTabKey = 'ringkasan' | 'tarif' | 'riwayat';
export type LayananSortFieldKey = 'kode' | 'nama' | 'tarifUmum' | 'status';

export interface LayananHistoryEntry {
  id: string;
  tanggal: string;
  aktivitas: string;
  oleh: string;
}

export interface MasterLayananItem {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  kategori: string;
  referensi: string;
  domain: string;
  tarifUmum: number;
  tarifBpjsInternal?: number;
  tarifAsuransiInternal?: number;
  status: LayananStatusKey;
  riwayat: LayananHistoryEntry[];
}

const DEFAULT_LAYANAN_LIST: MasterLayananItem[] = [
  {
    id: 'lay-1',
    kode: 'DISPENSING',
    nama: 'Dispensing Obat',
    deskripsi: undefined,
    kategori: 'Layanan',
    referensi: 'Organisasi',
    domain: 'Organization',
    tarifUmum: 1000,
    tarifBpjsInternal: undefined,
    tarifAsuransiInternal: undefined,
    status: 'aktif',
    riwayat: [
      {
        id: 'hist-lay-1',
        tanggal: '19 Nov 2026',
        aktivitas: 'Referensi layanan operasional dibuat pada katalog klinik.',
        oleh: 'Administrator Sistem',
      },
    ],
  },
  {
    id: 'lay-2',
    kode: 'KONSULTASI',
    nama: 'Konsultasi Dokter',
    deskripsi: undefined,
    kategori: 'Layanan',
    referensi: 'Organisasi',
    domain: 'Organization',
    tarifUmum: 50000,
    tarifBpjsInternal: undefined,
    tarifAsuransiInternal: undefined,
    status: 'aktif',
    riwayat: [
      {
        id: 'hist-lay-2',
        tanggal: '19 Nov 2026',
        aktivitas: 'Referensi layanan operasional dibuat pada katalog klinik.',
        oleh: 'Administrator Sistem',
      },
    ],
  },
  {
    id: 'lay-3',
    kode: 'RJ-UMUM',
    nama: 'Pemeriksaan Umum',
    deskripsi: undefined,
    kategori: 'Layanan',
    referensi: 'Organisasi',
    domain: 'Organization',
    tarifUmum: 15000,
    tarifBpjsInternal: undefined,
    tarifAsuransiInternal: undefined,
    status: 'aktif',
    riwayat: [
      {
        id: 'hist-lay-3',
        tanggal: '19 Nov 2026',
        aktivitas: 'Referensi layanan operasional dibuat pada katalog klinik.',
        oleh: 'Administrator Sistem',
      },
    ],
  },
  {
    id: 'lay-4',
    kode: 'VAKSINASI',
    nama: 'Vaksinasi',
    deskripsi: undefined,
    kategori: 'Layanan',
    referensi: 'Organisasi',
    domain: 'Organization',
    tarifUmum: 40000,
    tarifBpjsInternal: undefined,
    tarifAsuransiInternal: undefined,
    status: 'aktif',
    riwayat: [
      {
        id: 'hist-lay-4',
        tanggal: '19 Nov 2026',
        aktivitas: 'Referensi layanan operasional dibuat pada katalog klinik.',
        oleh: 'Administrator Sistem',
      },
    ],
  },
];

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function DaftarLayananMaster({
  initialItems = DEFAULT_LAYANAN_LIST,
  onAddLayanan,
  onUpdateLayanan,
}: {
  initialItems?: MasterLayananItem[];
  onAddLayanan?: (item: MasterLayananItem) => void;
  onUpdateLayanan?: (item: MasterLayananItem) => void;
}) {
  const [items, setItems] = useState<MasterLayananItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialItems[0]?.id ?? null,
  );
  const [detailTab, setDetailTab] = useState<LayananDetailTabKey>('ringkasan');

  // Filter, Pencarian & Urutkan
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | LayananStatusKey>(
    'ALL',
  );
  const [sortField, setSortField] = useState<LayananSortFieldKey>('kode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal Tambah & Edit Layanan
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterLayananItem | null>(
    null,
  );

  // Form State Tambah Layanan
  const [newKode, setNewKode] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newDeskripsi, setNewDeskripsi] = useState('');
  const [newTarifUmum, setNewTarifUmum] = useState<number>(0);
  const [newTarifBpjs, setNewTarifBpjs] = useState<string>('');
  const [newTarifAsuransi, setNewTarifAsuransi] = useState<string>('');

  const importFileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter & Urutkan Data
  const processedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.kode.toLowerCase().includes(q) ||
          item.nama.toLowerCase().includes(q) ||
          (item.deskripsi ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      let compare = 0;
      if (sortField === 'kode') {
        compare = a.kode.localeCompare(b.kode, 'en', { numeric: true });
      } else if (sortField === 'nama') {
        compare = a.nama.localeCompare(b.nama, 'id');
      } else if (sortField === 'tarifUmum') {
        compare = a.tarifUmum - b.tarifUmum;
      } else {
        compare = a.status.localeCompare(b.status);
      }
      return sortDirection === 'asc' ? compare : -compare;
    });
  }, [items, statusFilter, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalItems = processedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return processedItems.slice(startIdx, startIdx + pageSize);
  }, [processedItems, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  // Item terpilih untuk panel kanan
  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return items.find((item) => item.id === selectedId) ?? null;
  }, [items, selectedId]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSortField('kode');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  const handleToggleItemStatus = (target: MasterLayananItem) => {
    const nextStatus: LayananStatusKey =
      target.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: MasterLayananItem = {
      ...target,
      status: nextStatus,
      riwayat: [
        {
          id: `hist-${Date.now()}`,
          tanggal: '19 Nov 2026',
          aktivitas: `Status layanan diubah menjadi ${
            nextStatus === 'aktif' ? 'Aktif' : 'Nonaktif'
          }.`,
          oleh: 'Administrator Sistem',
        },
        ...target.riwayat,
      ],
    };

    setItems((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onUpdateLayanan?.(updated);
  };

  const handleOpenAddModal = () => {
    setNewKode('');
    setNewNama('');
    setNewDeskripsi('');
    setNewTarifUmum(0);
    setNewTarifBpjs('');
    setNewTarifAsuransi('');
    setIsAddModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKode.trim() || !newNama.trim()) return;

    const parsedBpjs =
      newTarifBpjs.trim() === ''
        ? undefined
        : Math.max(0, Number(newTarifBpjs) || 0);
    const parsedAsuransi =
      newTarifAsuransi.trim() === ''
        ? undefined
        : Math.max(0, Number(newTarifAsuransi) || 0);

    const created: MasterLayananItem = {
      id: `lay-${Date.now()}`,
      kode: newKode.trim().toUpperCase().replace(/\s+/g, '-'),
      nama: newNama.trim(),
      deskripsi: newDeskripsi.trim() || undefined,
      kategori: 'Layanan',
      referensi: 'Organisasi',
      domain: 'Organization',
      tarifUmum: Math.max(0, Number(newTarifUmum) || 0),
      tarifBpjsInternal: parsedBpjs,
      tarifAsuransiInternal: parsedAsuransi,
      status: 'aktif',
      riwayat: [
        {
          id: `hist-${Date.now()}`,
          tanggal: '19 Nov 2026',
          aktivitas: 'Layanan operasional baru ditambahkan ke katalog klinik.',
          oleh: 'Administrator Sistem',
        },
      ],
    };

    setItems((prev) => [...prev, created]);
    setSelectedId(created.id);
    setDetailTab('ringkasan');
    onAddLayanan?.(created);
    setIsAddModalOpen(false);
  };

  // CSV Template & Ekspor Data
  const handleDownloadCsv = (onlyTemplate: boolean) => {
    const header =
      'kode,nama_layanan,deskripsi,tarif_umum,tarif_bpjs_internal,tarif_asuransi_internal,status';
    const rows = onlyTemplate
      ? ['DISPENSING,Dispensing Obat,,1000,,,aktif']
      : processedItems.map(
          (item) =>
            `${item.kode},"${item.nama.replace(/"/g, '""')}","${(
              item.deskripsi ?? ''
            ).replace(/"/g, '""')}",${item.tarifUmum},${
              item.tarifBpjsInternal ?? ''
            },${item.tarifAsuransiInternal ?? ''},${item.status}`,
        );

    const blob = new Blob([[header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = onlyTemplate
      ? 'template-daftar-layanan.csv'
      : 'data-daftar-layanan.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV Impor
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const imported: MasterLayananItem[] = lines.slice(1).map((line, idx) => {
        const cols = line
          .split(',')
          .map((c) => c.replace(/^"|"$/g, '').trim());
        return {
          id: `lay-imp-${Date.now()}-${idx}`,
          kode: (cols[0] || `LAY-${idx + 1}`).toUpperCase(),
          nama: cols[1] || 'Layanan Klinik Baru',
          deskripsi: cols[2] || undefined,
          kategori: 'Layanan',
          referensi: 'Organisasi',
          domain: 'Organization',
          tarifUmum: Number(cols[3]) || 0,
          tarifBpjsInternal:
            cols[4] && cols[4] !== '' ? Number(cols[4]) : undefined,
          tarifAsuransiInternal:
            cols[5] && cols[5] !== '' ? Number(cols[5]) : undefined,
          status:
            cols[6]?.toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif',
          riwayat: [
            {
              id: `hist-imp-${Date.now()}-${idx}`,
              tanggal: '19 Nov 2026',
              aktivitas: 'Layanan diimpor melalui berkas CSV.',
              oleh: 'Administrator Sistem',
            },
          ],
        };
      });

      setItems((prev) => [...prev, ...imported]);
      if (imported[0]) setSelectedId(imported[0].id);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. BANNER INFORMASI TARIF LAYANAN ATAS
         ===================================================================== */}
      <div className="rounded-xl border border-sky-200/80 bg-[#f0f8fc] px-4 py-3 flex items-center gap-2.5 text-xs text-[#0f3d56]">
        <Info className="w-4 h-4 text-[#008ba6] shrink-0" />
        <p>
          Tarif layanan Umum, BPJS internal, dan Asuransi internal adalah tarif
          klinik, bukan klaim atau tarif resmi penjamin.
        </p>
      </div>

      {/* =====================================================================
          2. GRID UTAMA 2 KOLOM: DAFTAR LAYANAN (KIRI) & DETAIL LAYANAN (KANAN)
         ===================================================================== */}
      <div
        className={`grid grid-cols-1 ${
          selectedItem ? 'xl:grid-cols-[1.65fr_1fr]' : 'grid-cols-1'
        } gap-4 items-start`}
      >
        {/* ===================================================================
            KOLOM KIRI: DAFTAR LAYANAN
           =================================================================== */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header Kartu Kiri */}
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                Daftar Layanan
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Referensi organisasi untuk alur operasional klinik.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadCsv(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                <span>Template</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadCsv(false)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Ekspor Data</span>
              </button>

              <input
                ref={importFileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImportCsv}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => importFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Impor</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah layanan</span>
              </button>
            </div>
          </div>

          {/* Search Input & Filter Status */}
          <div className="px-5 pb-4 space-y-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari kode, nama, deskripsi layanan..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>

            {/* Kartu Filter Status */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-3">
              <label
                htmlFor="filter-layanan-status"
                className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f3d56] mb-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#008ba6]" />
                <span>Status</span>
              </label>
              <div className="relative">
                <select
                  id="filter-layanan-status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(
                      e.target.value as 'ALL' | LayananStatusKey,
                    );
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value="ALL">Semua status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Sub-bar Jumlah Data + Urutkan + Reset Filter */}
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <ListFilter className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Menampilkan{' '}
                  <strong className="font-bold text-[#0f3d56]">
                    {totalItems}
                  </strong>{' '}
                  data
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">Urutkan</span>

                <div className="relative w-32">
                  <select
                    aria-label="Urutkan Daftar Layanan"
                    value={sortField}
                    onChange={(e) =>
                      setSortField(e.target.value as LayananSortFieldKey)
                    }
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="kode">Kode</option>
                    <option value="nama">Layanan</option>
                    <option value="tarifUmum">Tarif Umum</option>
                    <option value="status">Status</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSortDirection((prev) =>
                      prev === 'asc' ? 'desc' : 'asc',
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      sortDirection === 'desc' ? 'rotate-180' : ''
                    }`}
                  />
                  <span>{sortDirection === 'asc' ? 'Naik' : 'Turun'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabel Daftar Layanan */}
          <div className="overflow-x-auto border-t border-slate-200/80">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pl-5 pr-3 py-3.5">KODE</th>
                  <th className="px-3 py-3.5">LAYANAN</th>
                  <th className="px-3 py-3.5">UMUM</th>
                  <th className="px-3 py-3.5">BPJS INTERNAL</th>
                  <th className="px-3 py-3.5">ASURANSI INTERNAL</th>
                  <th className="px-3 py-3.5">STATUS</th>
                  <th className="pl-3 pr-5 py-3.5">AKSI</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 px-5 text-center text-slate-400"
                    >
                      Tidak ada layanan yang sesuai filter pencarian.
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
                            ? 'bg-[#edf7fc] border-l-[3px] border-l-[#008ba6]'
                            : 'hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        {/* KODE */}
                        <td className="pl-5 pr-3 py-4 align-middle font-mono text-xs font-extrabold text-[#008ba6] whitespace-nowrap">
                          {item.kode}
                        </td>

                        {/* LAYANAN */}
                        <td className="px-3 py-4 align-middle">
                          <p className="font-bold text-[#0f3d56]">
                            {item.nama}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {item.deskripsi || 'Tanpa deskripsi'}
                          </p>
                        </td>

                        {/* UMUM */}
                        <td className="px-3 py-4 align-middle font-bold text-emerald-700 tabular-nums whitespace-nowrap">
                          {formatRupiah(item.tarifUmum)}
                        </td>

                        {/* BPJS INTERNAL */}
                        <td className="px-3 py-4 align-middle whitespace-nowrap">
                          {typeof item.tarifBpjsInternal === 'number' ? (
                            <span className="font-bold text-[#0f3d56] tabular-nums">
                              {formatRupiah(item.tarifBpjsInternal)}
                            </span>
                          ) : (
                            <span className="font-medium text-amber-600">
                              Belum diatur
                            </span>
                          )}
                        </td>

                        {/* ASURANSI INTERNAL */}
                        <td className="px-3 py-4 align-middle whitespace-nowrap">
                          {typeof item.tarifAsuransiInternal === 'number' ? (
                            <span className="font-bold text-[#0f3d56] tabular-nums">
                              {formatRupiah(item.tarifAsuransiInternal)}
                            </span>
                          ) : (
                            <span className="font-medium text-amber-600">
                              Belum diatur
                            </span>
                          )}
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
                          className="pl-3 pr-5 py-4 align-middle whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedId(item.id);
                              setEditingItem(item);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-500" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
                Hasil
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="per-halaman-layanan">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-layanan"
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
            KOLOM KANAN: PANEL DETAIL LAYANAN
           =================================================================== */}
        {selectedItem && (
          <aside className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 space-y-4">
            {/* Header Detail */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#e6f6f9] text-[#008ba6] flex items-center justify-center shrink-0">
                  <AlignLeft className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-extrabold text-[#0f3d56] leading-snug">
                    {selectedItem.nama}
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-0.5 uppercase">
                    {selectedItem.kode}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Tutup detail layanan"
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Kartu Mini Metadata */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5">
                <p className="text-[11px] text-slate-400">Kategori</p>
                <p className="text-xs font-bold text-[#0f3d56] mt-0.5">
                  {selectedItem.kategori}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5">
                <p className="text-[11px] text-slate-400">Status</p>
                <p className="text-xs font-bold text-[#0f3d56] mt-0.5">
                  {selectedItem.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5">
                <p className="text-[11px] text-slate-400">Referensi</p>
                <p className="text-xs font-bold text-[#0f3d56] mt-0.5">
                  {selectedItem.referensi}
                </p>
              </div>
            </div>

            {/* Ringkasan */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                RINGKASAN
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedItem.deskripsi ||
                  'Belum ada deskripsi untuk referensi ini.'}
              </p>
            </div>

            {/* Tab Switcher: Ringkasan | Tarif | Riwayat */}
            <div
              role="tablist"
              aria-label="Detail Layanan Tabs"
              className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200/80 bg-slate-50/70 p-1 text-xs"
            >
              {(
                [
                  { key: 'ringkasan', label: 'Ringkasan' },
                  { key: 'tarif', label: 'Tarif' },
                  { key: 'riwayat', label: 'Riwayat' },
                ] as const
              ).map((tab) => {
                const isActive = detailTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setDetailTab(tab.key)}
                    className={`py-2 rounded-lg text-center transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#e6f6f9] text-[#008ba6] font-bold'
                        : 'text-slate-600 font-semibold hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Konten Tab Ringkasan */}
            {detailTab === 'ringkasan' && (
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  REFERENSI OPERASIONAL
                </p>

                <dl className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Kode layanan</dt>
                    <dd className="font-mono font-bold text-[#0f3d56] text-right">
                      {selectedItem.kode}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Domain</dt>
                    <dd className="font-bold text-[#0f3d56] text-right">
                      {selectedItem.domain}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Status</dt>
                    <dd className="font-bold text-[#0f3d56] text-right">
                      {selectedItem.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </dd>
                  </div>
                </dl>

                {/* Kotak Catatan Tarif Layanan */}
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 flex items-center gap-2.5 text-[11px] text-amber-900/80">
                  <CircleDollarSign className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="leading-relaxed">
                    Tarif layanan dikelola terpisah berdasarkan penjamin, unit /
                    poli, dan masa berlaku.
                  </p>
                </div>

                {/* Tombol Nonaktifkan / Aktifkan Bawah Kanan */}
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleToggleItemStatus(selectedItem)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                  >
                    {selectedItem.status === 'aktif' ? (
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
                </div>
              </div>
            )}

            {/* Konten Tab Tarif */}
            {detailTab === 'tarif' && (
              <div className="space-y-3 text-xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  RINCIAN TARIF KLINIK
                </p>

                <div className="rounded-xl border border-slate-200/90 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Umum</span>
                    <span className="font-extrabold text-emerald-700 tabular-nums">
                      {formatRupiah(selectedItem.tarifUmum)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">BPJS Internal</span>
                    {typeof selectedItem.tarifBpjsInternal === 'number' ? (
                      <span className="font-bold text-[#0f3d56] tabular-nums">
                        {formatRupiah(selectedItem.tarifBpjsInternal)}
                      </span>
                    ) : (
                      <span className="font-medium text-amber-600">
                        Belum diatur
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Asuransi Internal</span>
                    {typeof selectedItem.tarifAsuransiInternal === 'number' ? (
                      <span className="font-bold text-[#0f3d56] tabular-nums">
                        {formatRupiah(selectedItem.tarifAsuransiInternal)}
                      </span>
                    ) : (
                      <span className="font-medium text-amber-600">
                        Belum diatur
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingItem(selectedItem)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-500" />
                    <span>Atur Tarif Layanan</span>
                  </button>
                </div>
              </div>
            )}

            {/* Konten Tab Riwayat */}
            {detailTab === 'riwayat' && (
              <div className="space-y-2.5 text-xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  RIWAYAT PERUBAHAN
                </p>

                <div className="space-y-2">
                  {selectedItem.riwayat.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-slate-200/90 p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{entry.tanggal}</span>
                        <span>{entry.oleh}</span>
                      </div>
                      <p className="text-xs text-[#0f3d56] leading-relaxed">
                        {entry.aktivitas}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* =====================================================================
          3. MODAL TAMBAH LAYANAN BARU
         ===================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  REFERENSI ORGANISASI
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Tambah Layanan Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateSubmit}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Layanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newKode}
                    onChange={(e) => setNewKode(e.target.value)}
                    placeholder="Contoh: RJ-GIGI"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Layanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newNama}
                    onChange={(e) => setNewNama(e.target.value)}
                    placeholder="Contoh: Pemeriksaan Poli Gigi"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tarif Umum (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={newTarifUmum}
                    onChange={(e) =>
                      setNewTarifUmum(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    BPJS Internal (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={newTarifBpjs}
                    onChange={(e) => setNewTarifBpjs(e.target.value)}
                    placeholder="Belum diatur"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Asuransi Internal (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={newTarifAsuransi}
                    onChange={(e) => setNewTarifAsuransi(e.target.value)}
                    placeholder="Belum diatur"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi Layanan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={newDeskripsi}
                  onChange={(e) => setNewDeskripsi(e.target.value)}
                  placeholder="Kosongkan jika tanpa deskripsi..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. MODAL EDIT LAYANAN & TARIF INTERNAL
         ===================================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingItem.kode}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Layanan &amp; Tarif Klinik
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
                const updated: MasterLayananItem = {
                  ...editingItem,
                  riwayat: [
                    {
                      id: `hist-${Date.now()}`,
                      tanggal: '19 Nov 2026',
                      aktivitas: 'Informasi dan tarif layanan diperbarui.',
                      oleh: 'Administrator Sistem',
                    },
                    ...editingItem.riwayat,
                  ],
                };
                setItems((prev) =>
                  prev.map((item) => (item.id === updated.id ? updated : item)),
                );
                onUpdateLayanan?.(updated);
                setEditingItem(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Layanan
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
                    Status
                  </label>
                  <select
                    value={editingItem.status}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.value as LayananStatusKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tarif Umum (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={editingItem.tarifUmum}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tarifUmum: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    BPJS Internal (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={editingItem.tarifBpjsInternal ?? ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tarifBpjsInternal:
                          e.target.value === ''
                            ? undefined
                            : Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    placeholder="Belum diatur"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Asuransi Internal (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={editingItem.tarifAsuransiInternal ?? ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tarifAsuransiInternal:
                          e.target.value === ''
                            ? undefined
                            : Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    placeholder="Belum diatur"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi Layanan
                </label>
                <textarea
                  rows={2}
                  value={editingItem.deskripsi ?? ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      deskripsi: e.target.value || undefined,
                    })
                  }
                  placeholder="Tanpa deskripsi"
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