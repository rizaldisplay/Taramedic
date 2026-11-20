'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Eye,
  FlaskConical,
  Package,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';

export type LabRequestStatus =
  | 'baru'
  | 'menunggu_spesimen'
  | 'spesimen_diterima'
  | 'sedang_diproses'
  | 'siap_diterbitkan'
  | 'selesai'
  | 'dibatalkan';

export type LabPeriodFilter =
  | 'semua'
  | 'hari_ini'
  | '7_hari'
  | '30_hari';

export type LabSortOrder = 'terbaru' | 'terlama' | 'pasien_az';

export interface LabExamItem {
  id: string;
  namaPemeriksaan: string;
  hasil?: string;
  nilaiRujukan?: string;
  kritis?: boolean;
}

export interface LabRequestItem {
  id: string;
  nomorPermintaan: string;
  pasien: string;
  noRm: string;
  noKunjungan: string;
  unitAsal: string;
  dokterPeminta: string;
  jumlahItem: number;
  jumlahKritis?: number;
  status: LabRequestStatus;
  tanggalLabel: string;
  isToday?: boolean;
  isLast7Days?: boolean;
  pemeriksaan: LabExamItem[];
  catatan?: string;
}

const LAB_STATUS_META: Record<
  LabRequestStatus,
  { label: string; pillClass: string }
> = {
  baru: {
    label: 'Baru',
    pillClass: 'bg-sky-50 border border-sky-200/80 text-sky-700',
  },
  menunggu_spesimen: {
    label: 'Menunggu Spesimen',
    pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  spesimen_diterima: {
    label: 'Spesimen Diterima',
    pillClass: 'bg-[#edf7fc] border border-[#b8e6ef] text-[#008ba6]',
  },
  sedang_diproses: {
    label: 'Sedang Diproses',
    pillClass: 'bg-violet-50 border border-violet-200/80 text-violet-700',
  },
  siap_diterbitkan: {
    label: 'Siap Diterbitkan',
    pillClass: 'bg-teal-50 border border-teal-200/80 text-teal-700',
  },
  selesai: {
    label: 'Selesai',
    pillClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  dibatalkan: {
    label: 'Dibatalkan',
    pillClass: 'bg-rose-50 border border-rose-200/80 text-rose-600',
  },
};

const DEFAULT_LAB_REQUESTS: LabRequestItem[] = [
  {
    id: 'lab-3',
    nomorPermintaan: 'LAB-20261113-000003',
    pasien: 'Suparni',
    noRm: 'RM00000002',
    noKunjungan: 'KJ-20261105-000005',
    unitAsal: 'Poli Umum',
    dokterPeminta: 'Superadmin · info@taramedic.id',
    jumlahItem: 2,
    status: 'dibatalkan',
    tanggalLabel: '13 Nov 2026, 08.45',
    isLast7Days: true,
    isLast30Days: true,
    catatan: 'Permintaan dibatalkan atas permintaan dokter unit asal.',
    pemeriksaan: [
      {
        id: 'ex-3a',
        namaPemeriksaan: 'Darah Lengkap (CBC)',
        nilaiRujukan: 'Hb 12.0–16.0 g/dL',
      },
      {
        id: 'ex-3b',
        namaPemeriksaan: 'Gula Darah Puasa (GDP)',
        nilaiRujukan: '70–100 mg/dL',
      },
    ],
  } as LabRequestItem & { isLast30Days?: boolean },
  {
    id: 'lab-2',
    nomorPermintaan: 'LAB-20261113-000002',
    pasien: 'Suparni',
    noRm: 'RM00000002',
    noKunjungan: 'KJ-20261105-000005',
    unitAsal: 'Poli Umum',
    dokterPeminta: 'Superadmin · info@taramedic.id',
    jumlahItem: 2,
    status: 'selesai',
    tanggalLabel: '13 Nov 2026, 08.45',
    isLast7Days: true,
    pemeriksaan: [
      {
        id: 'ex-2a',
        namaPemeriksaan: 'Kolesterol Total',
        hasil: '185 mg/dL',
        nilaiRujukan: '< 200 mg/dL',
      },
      {
        id: 'ex-2b',
        namaPemeriksaan: 'Asam Urat',
        hasil: '5.4 mg/dL',
        nilaiRujukan: '2.4–6.0 mg/dL',
      },
    ],
  },
  {
    id: 'lab-1',
    nomorPermintaan: 'LAB-20261113-000001',
    pasien: 'Suparni',
    noRm: 'RM00000002',
    noKunjungan: 'KJ-20261105-000005',
    unitAsal: 'Poli Umum',
    dokterPeminta: 'Superadmin · info@taramedic.id',
    jumlahItem: 1,
    jumlahKritis: 1,
    status: 'selesai',
    tanggalLabel: '13 Nov 2026, 08.45',
    isLast7Days: true,
    catatan: 'Terdapat 1 nilai hasil kritis yang perlu segera dikomunikasikan.',
    pemeriksaan: [
      {
        id: 'ex-1a',
        namaPemeriksaan: 'Gula Darah Sewaktu (GDS)',
        hasil: '342 mg/dL',
        nilaiRujukan: '70–140 mg/dL',
        kritis: true,
      },
    ],
  },
];

const KPI_CARDS: {
  key: 'permintaan_hari_ini' | 'menunggu_spesimen' | 'sedang_diproses' | 'siap_diterbitkan' | 'terbit_hari_ini';
  label: string;
  cardClass: string;
  iconBoxClass: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: 'permintaan_hari_ini',
    label: 'Permintaan hari ini',
    cardClass: 'bg-[#f4f9ff] border-[#d6e8fc]',
    iconBoxClass: 'bg-white border-[#c4defb] text-[#0077b6]',
    icon: ClipboardList,
  },
  {
    key: 'menunggu_spesimen',
    label: 'Menunggu spesimen',
    cardClass: 'bg-[#fffcf2] border-[#f6e6b8]',
    iconBoxClass: 'bg-white border-[#f0d896] text-amber-600',
    icon: Package,
  },
  {
    key: 'sedang_diproses',
    label: 'Sedang diproses',
    cardClass: 'bg-[#f8f6ff] border-[#e4ddfc]',
    iconBoxClass: 'bg-white border-[#d5cbf9] text-violet-600',
    icon: Activity,
  },
  {
    key: 'siap_diterbitkan',
    label: 'Siap diterbitkan',
    cardClass: 'bg-[#f3fbf6] border-[#cdebd9]',
    iconBoxClass: 'bg-white border-[#b6e1c8] text-emerald-600',
    icon: Clock,
  },
  {
    key: 'terbit_hari_ini',
    label: 'Terbit hari ini',
    cardClass: 'bg-[#f2f9fd] border-[#cfe6f7]',
    iconBoxClass: 'bg-white border-[#bcdbf2] text-[#008ba6]',
    icon: CheckCircle2,
  },
];

const STATUS_TABS: { key: 'semua' | LabRequestStatus; label: string }[] = [
  { key: 'semua', label: 'Semua' },
  { key: 'baru', label: 'Baru' },
  { key: 'menunggu_spesimen', label: 'Menunggu Spesimen' },
  { key: 'spesimen_diterima', label: 'Spesimen Diterima' },
  { key: 'sedang_diproses', label: 'Sedang Diproses' },
  { key: 'siap_diterbitkan', label: 'Siap Diterbitkan' },
  { key: 'selesai', label: 'Selesai' },
  { key: 'dibatalkan', label: 'Dibatalkan' },
];

export default function Laboratorium({
  initialRequests = DEFAULT_LAB_REQUESTS,
  onReload,
  onViewRequest,
}: {
  initialRequests?: LabRequestItem[];
  onReload?: () => Promise<void> | void;
  onViewRequest?: (item: LabRequestItem) => void;
}) {
  const [requests] = useState<LabRequestItem[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<'semua' | LabRequestStatus>('semua');
  const [statusFilter, setStatusFilter] = useState<'semua' | LabRequestStatus>(
    'semua',
  );
  const [periodFilter, setPeriodFilter] = useState<LabPeriodFilter>('semua');
  const [sortOrder, setSortOrder] = useState<LabSortOrder>('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isReloading, setIsReloading] = useState(false);
  const [detailItem, setDetailItem] = useState<LabRequestItem | null>(null);

  const pageSize = 10;

  const kpiCounts = useMemo(() => {
    return {
      permintaan_hari_ini: requests.filter((r) => r.isToday).length,
      menunggu_spesimen: requests.filter((r) => r.status === 'menunggu_spesimen')
        .length,
      sedang_diproses: requests.filter((r) => r.status === 'sedang_diproses')
        .length,
      siap_diterbitkan: requests.filter((r) => r.status === 'siap_diterbitkan')
        .length,
      terbit_hari_ini: requests.filter((r) => r.isToday && r.status === 'selesai')
        .length,
    };
  }, [requests]);

  const tabCounts = useMemo(() => {
    const counts: Record<'semua' | LabRequestStatus, number> = {
      semua: requests.length,
      baru: 0,
      menunggu_spesimen: 0,
      spesimen_diterima: 0,
      sedang_diproses: 0,
      siap_diterbitkan: 0,
      selesai: 0,
      dibatalkan: 0,
    };
    for (const r of requests) {
      counts[r.status] += 1;
    }
    return counts;
  }, [requests]);

  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = requests.filter((r) => {
      if (activeTab !== 'semua' && r.status !== activeTab) return false;
      if (statusFilter !== 'semua' && r.status !== statusFilter) return false;

      if (periodFilter === 'hari_ini' && !r.isToday) return false;
      if (periodFilter === '7_hari' && !r.isLast7Days && !r.isToday)
        return false;

      if (!q) return true;
      return (
        r.pasien.toLowerCase().includes(q) ||
        r.noRm.toLowerCase().includes(q) ||
        r.noKunjungan.toLowerCase().includes(q) ||
        r.nomorPermintaan.toLowerCase().includes(q) ||
        r.unitAsal.toLowerCase().includes(q) ||
        r.dokterPeminta.toLowerCase().includes(q) ||
        r.pemeriksaan.some((p) => p.namaPemeriksaan.toLowerCase().includes(q))
      );
    });

    if (sortOrder === 'terlama') {
      return [...list].reverse();
    }
    if (sortOrder === 'pasien_az') {
      return [...list].sort((a, b) => a.pasien.localeCompare(b.pasien, 'id'));
    }
    return list;
  }, [requests, activeTab, statusFilter, periodFilter, sortOrder, searchQuery]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, safePage]);

  const handleResetFilter = () => {
    setActiveTab('semua');
    setStatusFilter('semua');
    setPeriodFilter('semua');
    setSortOrder('terbaru');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await onReload?.();
    } finally {
      setTimeout(() => setIsReloading(false), 350);
    }
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. BANNER HEADER LABORATORIUM & 5 KARTU KPI WARNA PASTEL
         ===================================================================== */}
      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200/90 bg-gradient-to-r from-[#f3f9fc] via-white to-[#f6fbf9] px-5 py-4 flex items-center gap-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 text-[#0077b6] flex items-center justify-center shrink-0 shadow-2xs">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] leading-tight">
              Laboratorium
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Permintaan, pemeriksaan, hasil, dan penerbitan pasien dalam satu
              alur klinis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            const value = kpiCounts[card.key];

            return (
              <div
                key={card.key}
                className={`rounded-xl border px-4 py-3.5 flex items-center gap-3.5 ${card.cardClass}`}
              >
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${card.iconBoxClass}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">
                    {card.label}
                  </p>
                  <p className="text-lg font-extrabold text-[#0f3d56] mt-0.5 tabular-nums leading-none">
                    {value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. KARTU UTAMA DAFTAR PERMINTAAN LABORATORIUM
         ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Top Row: Judul + Pill Counter + Search Input */}
        <div className="px-6 pt-5 pb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Daftar Permintaan Laboratorium
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#edf7fc] border border-[#b8e6ef] text-[11px] font-bold text-[#0077b6] tabular-nums">
                  {requests.length} permintaan
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar pasien dan pemeriksaan berasal dari permintaan
                Laboratorium yang tersimpan.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Nama pasien, No. RM, No. Kunjungan, No. Permintaan, atau pemeriksa"
              className="w-full pl-8 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                aria-label="Hapus pencarian laboratorium"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Row: Status, Periode Permintaan, Urutkan & Reset Filter */}
        <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="block text-[11px] font-bold text-[#0f3d56] mb-1.5">
              Status
            </label>
            <div className="relative">
              <select
                aria-label="Filter status laboratorium"
                value={statusFilter}
                onChange={(e) => {
                  const val = e.target.value as 'semua' | LabRequestStatus;
                  setStatusFilter(val);
                  setActiveTab(val);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="semua">Semua Status</option>
                <option value="baru">Baru</option>
                <option value="menunggu_spesimen">Menunggu Spesimen</option>
                <option value="spesimen_diterima">Spesimen Diterima</option>
                <option value="sedang_diproses">Sedang Diproses</option>
                <option value="siap_diterbitkan">Siap Diterbitkan</option>
                <option value="selesai">Selesai</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0f3d56] mb-1.5">
              Periode Permintaan
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                aria-label="Filter periode permintaan laboratorium"
                value={periodFilter}
                onChange={(e) => {
                  setPeriodFilter(e.target.value as LabPeriodFilter);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-8 pr-8 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="semua">Semua Tanggal</option>
                <option value="hari_ini">Hari Ini</option>
                <option value="7_hari">7 Hari Terakhir</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0f3d56] mb-1.5">
              Urutkan
            </label>
            <div className="relative">
              <select
                aria-label="Urutkan permintaan laboratorium"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as LabSortOrder)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="pasien_az">Nama Pasien (A–Z)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetFilter}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Sub-Tabs Status Permintaan */}
        <div
          role="tablist"
          aria-label="Filter Tab Status Laboratorium"
          className="px-6 border-b border-slate-200/80 flex items-center gap-5 overflow-x-auto"
        >
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = tabCounts[tab.key];

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveTab(tab.key);
                  setStatusFilter(tab.key);
                  setCurrentPage(1);
                }}
                className={`relative pb-3 pt-1 inline-flex items-center gap-1.5 text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#0077b6] font-extrabold'
                    : 'text-slate-500 font-semibold hover:text-[#0f3d56]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                    isActive
                      ? 'bg-[#e6f6f9] text-[#0077b6]'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>

                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0077b6]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tabel Permintaan Laboratorium */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
              <tr>
                <th className="pl-6 pr-3 py-3">No. Permintaan</th>
                <th className="px-3 py-3">Pasien</th>
                <th className="px-3 py-3">No. RM</th>
                <th className="px-3 py-3">No. Kunjungan</th>
                <th className="px-3 py-3">Unit asal</th>
                <th className="px-3 py-3">Dokter peminta</th>
                <th className="px-3 py-3">Item</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Tanggal</th>
                <th className="pl-3 pr-6 py-3 text-right">Tindakan</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-12 px-6 text-center text-slate-400"
                  >
                    Tidak ada permintaan laboratorium yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const statusMeta = LAB_STATUS_META[item.status];

                  return (
                    <tr
                      key={item.id}
                      className="bg-white hover:bg-slate-50/70 transition-colors"
                    >
                      {/* No. Permintaan */}
                      <td className="pl-6 pr-3 py-4 align-middle font-mono font-semibold text-[#0f3d56] whitespace-nowrap">
                        {item.nomorPermintaan}
                      </td>

                      {/* Pasien */}
                      <td className="px-3 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                        {item.pasien}
                      </td>

                      {/* No. RM */}
                      <td className="px-3 py-4 align-middle font-mono text-slate-600 whitespace-nowrap">
                        {item.noRm}
                      </td>

                      {/* No. Kunjungan */}
                      <td className="px-3 py-4 align-middle font-mono text-slate-600">
                        <span className="inline-block max-w-[125px] leading-snug">
                          {item.noKunjungan}
                        </span>
                      </td>

                      {/* Unit asal */}
                      <td className="px-3 py-4 align-middle text-slate-600 whitespace-nowrap">
                        {item.unitAsal}
                      </td>

                      {/* Dokter peminta */}
                      <td className="px-3 py-4 align-middle text-slate-500 whitespace-nowrap">
                        {item.dokterPeminta}
                      </td>

                      {/* Item + Indikator Kritis */}
                      <td className="px-3 py-4 align-middle whitespace-nowrap">
                        <p className="text-[#0f3d56] font-medium tabular-nums">
                          {item.jumlahItem} pemeriksaan
                        </p>
                        {(item.jumlahKritis ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-0.5 tabular-nums">
                            <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                            <span>{item.jumlahKritis} kritis</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4 align-middle whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusMeta.pillClass}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>

                      {/* Tanggal */}
                      <td className="px-3 py-4 align-middle text-slate-500 tabular-nums whitespace-nowrap">
                        {item.tanggalLabel}
                      </td>

                      {/* Tindakan */}
                      <td className="pl-3 pr-6 py-4 align-middle text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            onViewRequest?.(item);
                            setDetailItem(item);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination + Tombol Reload Kanan Bawah */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between gap-4 text-xs text-slate-500">
          <span className="tabular-nums">
            {totalItems === 0
              ? '0 dari 0'
              : `${(safePage - 1) * pageSize + 1}–${Math.min(
                  safePage * pageSize,
                  totalItems,
                )} dari ${totalItems}`}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1 || totalItems === 0}
              aria-label="Halaman sebelumnya laboratorium"
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 font-bold text-[#0f3d56] tabular-nums">
              {safePage}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages || totalItems === 0}
              aria-label="Halaman berikutnya laboratorium"
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => void handleReload()}
              aria-label="Muat ulang daftar laboratorium"
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 cursor-pointer ml-0.5"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isReloading ? 'animate-spin text-[#008ba6]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. MODAL DETAIL HASIL & PEMERIKSAAN LABORATORIUM
         ===================================================================== */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  DETAIL PERMINTAAN LABORATORIUM
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <h3 className="text-base font-extrabold font-mono text-[#0f3d56]">
                    {detailItem.nomorPermintaan}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      LAB_STATUS_META[detailItem.status].pillClass
                    }`}
                  >
                    {LAB_STATUS_META[detailItem.status].label}
                  </span>
                </div>
                <p className="text-slate-500 mt-1">
                  <strong className="text-[#0f3d56]">{detailItem.pasien}</strong>{' '}
                  &middot; <span className="font-mono">{detailItem.noRm}</span>{' '}
                  &middot; Kunjungan{' '}
                  <span className="font-mono">{detailItem.noKunjungan}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
                <div>
                  <p className="text-[11px] text-slate-400">Unit Asal</p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {detailItem.unitAsal}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Dokter Peminta</p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {detailItem.dokterPeminta}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-extrabold text-[#0f3d56]">
                  Daftar Pemeriksaan ({detailItem.pemeriksaan.length})
                </p>
                {detailItem.pemeriksaan.map((ex) => (
                  <div
                    key={ex.id}
                    className={`rounded-xl border p-3 flex items-center justify-between gap-3 ${
                      ex.kritis
                        ? 'border-rose-200 bg-rose-50/50'
                        : 'border-slate-200/80 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-[#0f3d56]">
                          {ex.namaPemeriksaan}
                        </p>
                        {ex.kritis && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            Kritis
                          </span>
                        )}
                      </div>
                      {ex.nilaiRujukan && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Rujukan: {ex.nilaiRujukan}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Hasil</p>
                      <p
                        className={`font-extrabold tabular-nums ${
                          ex.kritis ? 'text-rose-600' : 'text-[#0f3d56]'
                        }`}
                      >
                        {ex.hasil ?? '—'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {detailItem.catatan && (
                <p className="text-[11px] text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-200/70">
                  {detailItem.catatan}
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDetailItem(null)}
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