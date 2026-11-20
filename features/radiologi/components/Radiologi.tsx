'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Clock,
  FileCheck2,
  FileText,
  FolderArchive,
  FolderOpen,
  RotateCcw,
  ScanLine,
  Search,
  X,
} from 'lucide-react';

export type RadiologyMainTab =
  | 'permintaan'
  | 'penjadwalan'
  | 'antrean'
  | 'input_hasil'
  | 'verifikasi_hasil'
  | 'laporan'
  | 'arsip_order';

export type RadiologyArchiveSubTab = 'dibatalkan' | 'ditolak';

export type RadiologyOrderStatus =
  | 'menunggu_verifikasi'
  | 'terjadwal'
  | 'dalam_pemeriksaan'
  | 'menunggu_input_hasil'
  | 'menunggu_verifikasi_hasil'
  | 'selesai'
  | 'dibatalkan'
  | 'ditolak';

export type RadiologyPriority = 'REGULER' | 'SEGERA' | 'CITO';

export interface RadiologyOrderItem {
  id: string;
  noOrder: string;
  noRm: string;
  noKunjungan?: string;
  namaPasien: string;
  pemeriksaan: string;
  modalitas: string;
  unitAsal: string;
  dokterPeminta: string;
  prioritas: RadiologyPriority;
  status: RadiologyOrderStatus;
  tanggalLabel: string;
  tanggalSort?: number;
  ringkasanHasil?: string;
  catatanKlinis?: string;
}

const DEFAULT_RADIOLOGY_ORDERS: RadiologyOrderItem[] = [
  {
    id: 'rad-rep-1',
    noOrder: 'RAD-20261114-000001',
    noRm: 'RM00000002',
    noKunjungan: 'KJ-20261114-000002',
    namaPasien: 'Suparni',
    pemeriksaan: 'Abdomen 3 Posisi',
    modalitas: 'Digital Radiography',
    unitAsal: 'Poli Umum',
    dokterPeminta: 'dr. Altharrazka Kenigara Rizfan',
    prioritas: 'REGULER',
    status: 'selesai',
    tanggalLabel: '15 Nov 2026',
    tanggalSort: 20261115,
    ringkasanHasil:
      'Distribusi udara usus normal, tidak tampak ileus obstruktif maupun tanda pneumoperitoneum.',
    catatanKlinis: 'Keluhan nyeri abdomen difus.',
  },
  {
    id: 'rad-rep-2',
    noOrder: 'RAD-20261114-000001',
    noRm: 'RM00000002',
    noKunjungan: 'KJ-20261120-000008',
    namaPasien: 'Suparni',
    pemeriksaan: 'Abdomen AP Supine',
    modalitas: 'Digital Radiography',
    unitAsal: 'Poli Umum',
    dokterPeminta: 'dr. Altharrazka Kenigara Rizfan',
    prioritas: 'REGULER',
    status: 'selesai',
    tanggalLabel: '20 Nov 2026',
    tanggalSort: 20261120,
    ringkasanHasil:
      'Kontur ginjal kanan kiri tampak baik, bayangan psoas simetris, tidak tampak opak batu radioopak.',
    catatanKlinis: 'Evaluasi kontrol abdomen.',
  },
];

const MAIN_TABS: {
  key: RadiologyMainTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'permintaan', label: 'Permintaan', icon: ClipboardList },
  { key: 'penjadwalan', label: 'Penjadwalan', icon: Calendar },
  { key: 'antrean', label: 'Antrean Pemeriksaan', icon: Activity },
  { key: 'input_hasil', label: 'Input Hasil', icon: FileText },
  { key: 'verifikasi_hasil', label: 'Verifikasi Hasil', icon: FileCheck2 },
  { key: 'laporan', label: 'Laporan', icon: FileText },
  { key: 'arsip_order', label: 'Arsip Order', icon: FolderArchive },
];

const TAB_CONFIG: Record<
  RadiologyMainTab,
  {
    sectionTitle: string;
    emptyTitle: string;
    emptySubtitle: string;
    showStatusFilter: boolean;
    defaultStatus: string;
    statusOptions: { value: string; label: string }[];
  }
> = {
  permintaan: {
    sectionTitle: 'Daftar Pemeriksaan Radiologi',
    emptyTitle: 'Belum ada permintaan radiologi',
    emptySubtitle:
      'Data pada area ini akan muncul sesuai status pemeriksaan Radiologi.',
    showStatusFilter: true,
    defaultStatus: 'menunggu_verifikasi',
    statusOptions: [
      { value: 'semua', label: 'Semua status' },
      { value: 'menunggu_verifikasi', label: 'Menunggu verifikasi' },
      { value: 'terjadwal', label: 'Terjadwal' },
      { value: 'selesai', label: 'Selesai' },
    ],
  },
  penjadwalan: {
    sectionTitle: 'Penjadwalan Radiologi',
    emptyTitle: 'Belum ada penjadwalan radiologi',
    emptySubtitle:
      'Data pada area ini akan muncul sesuai status pemeriksaan Radiologi.',
    showStatusFilter: true,
    defaultStatus: 'semua',
    statusOptions: [
      { value: 'semua', label: 'Semua status' },
      { value: 'terjadwal', label: 'Terjadwal' },
      { value: 'menunggu_verifikasi', label: 'Menunggu verifikasi' },
    ],
  },
  antrean: {
    sectionTitle: 'Antrean Pemeriksaan',
    emptyTitle: 'Belum ada antrean pemeriksaan',
    emptySubtitle:
      'Data pada area ini akan muncul sesuai status pemeriksaan Radiologi.',
    showStatusFilter: true,
    defaultStatus: 'semua',
    statusOptions: [
      { value: 'semua', label: 'Semua status' },
      { value: 'dalam_pemeriksaan', label: 'Dalam Pemeriksaan' },
      { value: 'terjadwal', label: 'Siap Diperiksa' },
    ],
  },
  input_hasil: {
    sectionTitle: 'Input Hasil Radiologi',
    emptyTitle: 'Belum ada input hasil radiologi',
    emptySubtitle:
      'Data pada area ini akan muncul sesuai status pemeriksaan Radiologi.',
    showStatusFilter: true,
    defaultStatus: 'semua',
    statusOptions: [
      { value: 'semua', label: 'Semua status' },
      { value: 'menunggu_input_hasil', label: 'Menunggu Input Hasil' },
      { value: 'dalam_pemeriksaan', label: 'Dalam Pemeriksaan' },
    ],
  },
  verifikasi_hasil: {
    sectionTitle: 'Verifikasi Hasil Radiologi',
    emptyTitle: 'Belum ada verifikasi hasil radiologi',
    emptySubtitle:
      'Data pada area ini akan muncul sesuai status pemeriksaan Radiologi.',
    showStatusFilter: false,
    defaultStatus: 'semua',
    statusOptions: [{ value: 'semua', label: 'Semua status' }],
  },
  laporan: {
    sectionTitle: 'Laporan Radiologi',
    emptyTitle: 'Belum ada laporan radiologi',
    emptySubtitle:
      'Data pada area ini akan muncul sesuai status pemeriksaan Radiologi.',
    showStatusFilter: true,
    defaultStatus: 'semua',
    statusOptions: [
      { value: 'semua', label: 'Semua status' },
      { value: 'selesai', label: 'Selesai' },
    ],
  },
  arsip_order: {
    sectionTitle: 'Arsip Order Radiologi',
    emptyTitle: 'Belum ada arsip order radiologi',
    emptySubtitle:
      'Data pada area ini akan muncul sesuai status pemeriksaan Radiologi.',
    showStatusFilter: false,
    defaultStatus: 'semua',
    statusOptions: [{ value: 'semua', label: 'Semua status' }],
  },
};

function getStatusBadgeClass(status: RadiologyOrderStatus): {
  label: string;
  pillClass: string;
} {
  switch (status) {
    case 'selesai':
      return {
        label: 'Selesai',
        pillClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
      };
    case 'dalam_pemeriksaan':
      return {
        label: 'Dalam Pemeriksaan',
        pillClass: 'bg-violet-50 border border-violet-200/80 text-violet-700',
      };
    case 'terjadwal':
      return {
        label: 'Terjadwal',
        pillClass: 'bg-[#edf7fc] border border-[#b8e6ef] text-[#008ba6]',
      };
    case 'dibatalkan':
    case 'ditolak':
      return {
        label: status === 'dibatalkan' ? 'Dibatalkan' : 'Ditolak',
        pillClass: 'bg-rose-50 border border-rose-200/80 text-rose-600',
      };
    default:
      return {
        label: 'Menunggu Verifikasi',
        pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
      };
  }
}

export default function ModulRadiologi({
  initialOrders = DEFAULT_RADIOLOGY_ORDERS,
  onOpenOrder,
}: {
  initialOrders?: RadiologyOrderItem[];
  onOpenOrder?: (order: RadiologyOrderItem) => void;
}) {
  const [orders] = useState<RadiologyOrderItem[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<RadiologyMainTab>('permintaan');
  const [archiveSubTab, setArchiveSubTab] =
    useState<RadiologyArchiveSubTab>('dibatalkan');

  const [statusFilter, setStatusFilter] = useState<string>(
    TAB_CONFIG.permintaan.defaultStatus,
  );
  const [modalityFilter, setModalityFilter] = useState<string>('semua');
  const [priorityFilter, setPriorityFilter] = useState<string>('semua');
  const [periodFilter, setPeriodFilter] = useState<string>('semua');
  const [sortOrder, setSortOrder] = useState<string>('prioritas_jadwal');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedReport, setSelectedReport] =
    useState<RadiologyOrderItem | null>(null);

  const tabCfg = TAB_CONFIG[activeTab];

  const handleSelectMainTab = (nextTab: RadiologyMainTab) => {
    setActiveTab(nextTab);
    setStatusFilter(TAB_CONFIG[nextTab].defaultStatus);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setStatusFilter(TAB_CONFIG[activeTab].defaultStatus);
    setModalityFilter('semua');
    setPriorityFilter('semua');
    setPeriodFilter('semua');
    setSortOrder('prioritas_jadwal');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const kpiMetrics = useMemo(() => {
    const totalOrder = orders.filter(
      (o) => o.status !== 'dibatalkan' && o.status !== 'ditolak',
    ).length;
    const menungguPemeriksaan = orders.filter(
      (o) => o.status === 'menunggu_verifikasi' || o.status === 'terjadwal',
    ).length;
    const dalamPemeriksaan = orders.filter(
      (o) =>
        o.status === 'dalam_pemeriksaan' ||
        o.status === 'menunggu_input_hasil' ||
        o.status === 'menunggu_verifikasi_hasil',
    ).length;
    const selesai = orders.filter((o) => o.status === 'selesai').length;

    return {
      totalOrder,
      menungguPemeriksaan,
      dalamPemeriksaan,
      selesai,
    };
  }, [orders]);

  const tabRelevantOrders = useMemo(() => {
    if (activeTab === 'laporan') {
      return orders.filter((o) => o.status === 'selesai');
    }
    if (activeTab === 'arsip_order') {
      return orders.filter((o) => o.status === archiveSubTab);
    }
    if (activeTab === 'permintaan') {
      return orders.filter((o) => o.status === 'menunggu_verifikasi');
    }
    if (activeTab === 'penjadwalan') {
      return orders.filter((o) => o.status === 'terjadwal');
    }
    if (activeTab === 'antrean') {
      return orders.filter((o) => o.status === 'dalam_pemeriksaan');
    }
    if (activeTab === 'input_hasil') {
      return orders.filter(
        (o) =>
          o.status === 'menunggu_input_hasil' ||
          o.status === 'dalam_pemeriksaan',
      );
    }
    if (activeTab === 'verifikasi_hasil') {
      return orders.filter((o) => o.status === 'menunggu_verifikasi_hasil');
    }
    return orders;
  }, [orders, activeTab, archiveSubTab]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = tabRelevantOrders.filter((item) => {
      if (
        tabCfg.showStatusFilter &&
        statusFilter !== 'semua' &&
        item.status !== statusFilter
      ) {
        return false;
      }

      if (modalityFilter !== 'semua' && item.modalitas !== modalityFilter) {
        return false;
      }

      if (priorityFilter !== 'semua' && item.prioritas !== priorityFilter) {
        return false;
      }

      if (periodFilter === 'nov_2026' && !item.tanggalLabel.includes('Nov 2026')) {
        return false;
      }

      if (!q) return true;
      return (
        item.namaPasien.toLowerCase().includes(q) ||
        item.noRm.toLowerCase().includes(q) ||
        (item.noKunjungan ?? '').toLowerCase().includes(q) ||
        item.noOrder.toLowerCase().includes(q) ||
        item.pemeriksaan.toLowerCase().includes(q) ||
        item.modalitas.toLowerCase().includes(q) ||
        item.dokterPeminta.toLowerCase().includes(q)
      );
    });

    if (sortOrder === 'tanggal_terbaru') {
      return [...list].sort(
        (a, b) => (b.tanggalSort ?? 0) - (a.tanggalSort ?? 0),
      );
    }
    if (sortOrder === 'tanggal_terlama') {
      return [...list].sort(
        (a, b) => (a.tanggalSort ?? 0) - (b.tanggalSort ?? 0),
      );
    }
    return list;
  }, [
    tabRelevantOrders,
    tabCfg.showStatusFilter,
    statusFilter,
    modalityFilter,
    priorityFilter,
    periodFilter,
    searchQuery,
    sortOrder,
  ]);

  const totalCount = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, safePage, pageSize]);

  const isTableView = activeTab === 'laporan';

  const kpiCards = [
    {
      title: 'Total Order',
      value: kpiMetrics.totalOrder,
      subtitle: 'Semua Permintaan',
      cardClass: 'bg-[#f4f9ff] border-[#d6e8fc]',
      iconBoxClass: 'bg-white border-[#c4defb] text-[#0077b6]',
      icon: ClipboardList,
    },
    {
      title: 'Menunggu Pemeriksaan',
      value: kpiMetrics.menungguPemeriksaan,
      subtitle: 'Order perlu ditindaklanjuti',
      cardClass:
        activeTab === 'penjadwalan'
          ? 'bg-[#fffdf6] border-[#009bb8] ring-1 ring-[#009bb8]/30'
          : 'bg-[#fffcf2] border-[#f6e6b8]',
      iconBoxClass: 'bg-white border-[#f0d896] text-amber-600',
      icon: Clock,
    },
    {
      title: 'Dalam Pemeriksaan',
      value: kpiMetrics.dalamPemeriksaan,
      subtitle: 'Sedang diproses',
      cardClass: 'bg-[#f8f6ff] border-[#e4ddfc]',
      iconBoxClass: 'bg-white border-[#d5cbf9] text-violet-600',
      icon: Activity,
    },
    {
      title: 'Selesai',
      value: kpiMetrics.selesai,
      subtitle: 'Pemeriksaan selesai',
      cardClass: 'bg-[#f3fbf6] border-[#cdebd9]',
      iconBoxClass: 'bg-white border-[#b6e1c8] text-emerald-600',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-3.5">
      {/* =====================================================================
          1. TOP NAVIGATION BAR (7 TABS RADIOLOGI)
         ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.02)] px-5">
        <nav
          role="tablist"
          aria-label="Navigasi Modul Radiologi"
          className="flex items-center gap-6 overflow-x-auto"
        >
          {MAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectMainTab(tab.key)}
                className={`relative py-3.5 inline-flex items-center gap-2 text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#0077b6] font-bold'
                    : 'text-slate-500 font-medium hover:text-[#0f3d56]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-[#0077b6]' : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>

                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0077b6] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* =====================================================================
          2. SUB-PILLS KHUSUS TAB "ARSIP ORDER" (DIBATALKAN / DITOLAK)
         ===================================================================== */}
      {activeTab === 'arsip_order' && (
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => {
              setArchiveSubTab('dibatalkan');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
              archiveSubTab === 'dibatalkan'
                ? 'bg-[#edf7fc] border-[#009bb8] text-[#0077b6]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Dibatalkan
          </button>

          <button
            type="button"
            onClick={() => {
              setArchiveSubTab('ditolak');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
              archiveSubTab === 'ditolak'
                ? 'bg-[#edf7fc] border-[#009bb8] text-[#0077b6]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Ditolak
          </button>
        </div>
      )}

      {/* =====================================================================
          3. 4 KARTU METRIK RINGKASAN RADIOLOGI
         ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpiCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`rounded-xl border px-4 py-3.5 flex items-center gap-3.5 transition-all ${card.cardClass}`}
            >
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${card.iconBoxClass}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#0f3d56]">{card.title}</p>
                <p className="text-lg font-extrabold text-[#0f3d56] mt-0.5 tabular-nums leading-tight">
                  {card.value}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {card.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          4. KARTU UTAMA DAFTAR / PENJADWALAN / ANTREAN / HASIL / LAPORAN / ARSIP
         ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.02)] overflow-hidden">
        {/* Header Section Title + Search Input */}
        <div className="px-6 pt-5 pb-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-sm sm:text-base font-extrabold text-[#0f3d56]">
            {tabCfg.sectionTitle}
          </h1>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari Nama Pasien, No. RM, No. Kunjungan, No. Order, ata"
              className="w-full pl-8 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                aria-label="Hapus pencarian radiologi"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div
          className={`px-6 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end ${
            tabCfg.showStatusFilter
              ? 'lg:grid-cols-[1.15fr_1.15fr_1fr_1.15fr_1.15fr_auto]'
              : 'lg:grid-cols-[1.2fr_1fr_1.2fr_1.2fr_1.3fr]'
          }`}
        >
          {tabCfg.showStatusFilter && (
            <div>
              <label className="block text-[11px] font-bold text-[#0f3d56] mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  aria-label="Filter status radiologi"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  {tabCfg.statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#0f3d56] mb-1.5">
              Modalitas
            </label>
            <div className="relative">
              <select
                aria-label="Filter modalitas radiologi"
                value={modalityFilter}
                onChange={(e) => {
                  setModalityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="semua">Semua Modalitas</option>
                <option value="Digital Radiography">Digital Radiography</option>
                <option value="USG">USG</option>
                <option value="CT Scan">CT Scan</option>
                <option value="Panoramic Dental">Panoramic Dental</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0f3d56] mb-1.5">
              Prioritas
            </label>
            <div className="relative">
              <select
                aria-label="Filter prioritas radiologi"
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="semua">Semua prioritas</option>
                <option value="REGULER">Reguler</option>
                <option value="SEGERA">Segera</option>
                <option value="CITO">Cito</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0f3d56] mb-1.5">
              Periode Pemeriksaan
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                aria-label="Filter periode pemeriksaan radiologi"
                value={periodFilter}
                onChange={(e) => {
                  setPeriodFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-8 pr-8 py-2 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="semua">Semua Tanggal</option>
                <option value="nov_2026">November 2026</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0f3d56] mb-1.5">
              Urutkan
            </label>
            <div className="relative">
              <select
                aria-label="Urutkan data radiologi"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="prioritas_jadwal">Prioritas &amp; Jadwal</option>
                <option value="tanggal_terbaru">Tanggal Terbaru</option>
                <option value="tanggal_terlama">Tanggal Terlama</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>

        {/* Konten Area: Tabel (pada Laporan jika ada data) atau Empty State */}
        <div className="border-t border-slate-200/80">
          {isTableView && paginatedOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[980px]">
                <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="pl-6 pr-3 py-3">NO. ORDER</th>
                    <th className="px-3 py-3">NO. RM</th>
                    <th className="px-3 py-3">NAMA PASIEN</th>
                    <th className="px-3 py-3">PEMERIKSAAN</th>
                    <th className="px-3 py-3">MODALITAS</th>
                    <th className="px-3 py-3">UNIT ASAL</th>
                    <th className="px-3 py-3">DOKTER PEMINTA</th>
                    <th className="px-3 py-3">PRIORITAS</th>
                    <th className="px-3 py-3">STATUS</th>
                    <th className="px-3 py-3">TANGGAL</th>
                    <th className="pl-3 pr-6 py-3 text-right">TINDAKAN</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/70 text-xs">
                  {paginatedOrders.map((row) => {
                    const statusBadge = getStatusBadgeClass(row.status);

                    return (
                      <tr
                        key={row.id}
                        className="bg-white hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="pl-6 pr-3 py-4 align-middle font-mono font-bold text-[#0f3d56] whitespace-nowrap">
                          {row.noOrder}
                        </td>

                        <td className="px-3 py-4 align-middle font-mono text-slate-500 whitespace-nowrap">
                          {row.noRm}
                        </td>

                        <td className="px-3 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                          {row.namaPasien}
                        </td>

                        <td className="px-3 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                          {row.pemeriksaan}
                        </td>

                        <td className="px-3 py-4 align-middle whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-slate-200/90 bg-slate-50/60 text-[11px] font-semibold text-slate-600 leading-tight">
                            {row.modalitas}
                          </span>
                        </td>

                        <td className="px-3 py-4 align-middle text-slate-500 whitespace-nowrap">
                          {row.unitAsal}
                        </td>

                        <td className="px-3 py-4 align-middle text-slate-600 whitespace-nowrap">
                          {row.dokterPeminta}
                        </td>

                        <td className="px-3 py-4 align-middle whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {row.prioritas}
                          </span>
                        </td>

                        <td className="px-3 py-4 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusBadge.pillClass}`}
                          >
                            {statusBadge.label}
                          </span>
                        </td>

                        <td className="px-3 py-4 align-middle text-slate-500 tabular-nums whitespace-nowrap">
                          {row.tanggalLabel}
                        </td>

                        <td className="pl-3 pr-6 py-4 align-middle text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              onOpenOrder?.(row);
                              setSelectedReport(row);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>Buka</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center min-h-[260px]">
              {/* Ilustrasi Dokumen + Ikon Radiasi */}
              <div className="relative w-12 h-12 rounded-xl bg-[#edf7fc] border border-[#cde7f6] flex items-center justify-center text-[#0077b6] mb-3">
                <FileText className="w-6 h-6" />
                <span className="w-5 h-5 rounded-full bg-white border border-[#b8e2f6] text-[#008ba6] flex items-center justify-center absolute -bottom-1 -right-1 shadow-2xs">
                  <ScanLine className="w-3 h-3" />
                </span>
              </div>

              <p className="text-xs font-extrabold text-[#0f3d56]">
                {tabCfg.emptyTitle}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {tabCfg.emptySubtitle}
              </p>
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3 tabular-nums">
            {totalCount === 0 ? (
              <span>0 data</span>
            ) : (
              <span>
                {(safePage - 1) * pageSize + 1}&ndash;
                {Math.min(safePage * pageSize, totalCount)} dari{' '}
                <strong className="font-bold text-[#0f3d56]">
                  {totalCount}
                </strong>{' '}
                Pemeriksaan
              </span>
            )}

            <div className="flex items-center gap-2">
              <span>Per Halaman</span>
              <div className="relative">
                <select
                  aria-label="Jumlah data radiologi per halaman"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safePage <= 1 || totalCount === 0}
              aria-label="Halaman pertama radiologi"
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1 || totalCount === 0}
              aria-label="Halaman sebelumnya radiologi"
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                type="button"
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded-lg border text-xs font-bold cursor-pointer ${
                  pg === safePage
                    ? 'bg-[#edf7fc] border-[#009bb8] text-[#0077b6]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages || totalCount === 0}
              aria-label="Halaman berikutnya radiologi"
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage >= totalPages || totalCount === 0}
              aria-label="Halaman terakhir radiologi"
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          5. MODAL LAPORAN HASIL RADIOLOGI (SAAT TOMBOL "BUKA" DIKLIK)
         ===================================================================== */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  LAPORAN RADIOLOGI
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56] mt-0.5">
                  {selectedReport.pemeriksaan}
                </h2>
                <p className="text-slate-500 mt-0.5 font-mono">
                  {selectedReport.noOrder} &middot; {selectedReport.noRm} &middot;{' '}
                  <span className="font-sans font-bold text-[#0f3d56]">
                    {selectedReport.namaPasien}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
                <div>
                  <p className="text-[11px] text-slate-400">Modalitas</p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {selectedReport.modalitas}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Tanggal</p>
                  <p className="font-bold text-[#0f3d56] mt-0.5 tabular-nums">
                    {selectedReport.tanggalLabel}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Unit Asal</p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {selectedReport.unitAsal}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Dokter Peminta</p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {selectedReport.dokterPeminta}
                  </p>
                </div>
              </div>

              {selectedReport.catatanKlinis && (
                <div>
                  <p className="text-[11px] font-bold text-[#0f3d56] mb-1">
                    Catatan Klinis
                  </p>
                  <p className="text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200/70">
                    {selectedReport.catatanKlinis}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[11px] font-bold text-[#0f3d56] mb-1">
                  Ekspertise / Ringkasan Hasil
                </p>
                <p className="text-slate-700 bg-[#edf7fc]/60 rounded-lg p-3 border border-[#b8e6ef] leading-relaxed">
                  {selectedReport.ringkasanHasil ||
                    'Hasil pemeriksaan radiologi telah diverifikasi dan diterbitkan.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}