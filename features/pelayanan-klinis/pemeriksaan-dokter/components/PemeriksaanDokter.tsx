/* eslint-disable react-hooks/purity */
'use client';

import React, { useMemo, useState } from 'react';
import {
  ClipboardCheck,
  Pill,
  Calendar,
  Clock,
  Stethoscope,
  Check,
  ClipboardList,
  Search,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  X,
} from 'lucide-react';

export type DoctorTopTab = 'pemeriksaan' | 'klarifikasi_farmasi' | 'kontrol';

export type DoctorExamStatus =
  | 'menunggu_dokter'
  | 'pemeriksaan_berlangsung'
  | 'selesai';

export type PenjaminType = 'Umum' | 'BPJS' | 'Asuransi';
export type SortOrder = 'terbaru' | 'terlama' | 'antrean_asc' | 'nama_asc';
export type PeriodFilter = 'all' | 'today' | '7days' | 'this_month';

export interface DoctorVisitItem {
  id: string;
  noAntrean: string;
  tanggalLabel: string; // Contoh: "09 Nov 2026"
  tanggalISO: string; // Contoh: "2026-11-09"
  noKunjungan: string;
  namaPasien: string;
  nikPasien?: string;
  noRM: string;
  poli: string;
  dokter: string;
  penjamin: PenjaminType;
  status: DoctorExamStatus;
}

export interface PharmacyClarificationItem {
  id: string;
  noResep: string;
  noKunjungan: string;
  namaPasien: string;
  noRM: string;
  catatanFarmasi: string;
  waktuPermintaan: string;
}

export interface UpcomingControlItem {
  id: string;
  tanggalRencana: string;
  namaPasien: string;
  noRM: string;
  poli: string;
  dokter: string;
  keterangan?: string;
}

const DEFAULT_DOCTOR_VISITS: DoctorVisitItem[] = [
  {
    id: 'doc-vis-1',
    noAntrean: 'B002',
    tanggalLabel: '09 Nov 2026',
    tanggalISO: '2026-11-09',
    noKunjungan: 'KJ-20261109-000003',
    namaPasien: 'Suparna',
    nikPasien: '',
    noRM: 'RM00000002',
    poli: 'Poli Umum',
    dokter: 'dr. Altharrazka Kenigara Rizfan',
    penjamin: 'Umum',
    status: 'selesai',
  },
];

const STATUS_DISPLAY: Record<
  DoctorExamStatus,
  { label: string; className: string }
> = {
  menunggu_dokter: {
    label: 'Menunggu Dokter',
    className:
      'bg-amber-50 text-amber-700 border border-amber-200/90 px-3 py-1 rounded-md text-xs font-semibold',
  },
  pemeriksaan_berlangsung: {
    label: 'Pemeriksaan Berlangsung',
    className:
      'bg-[#f0f9fb] text-[#008ba6] border border-cyan-200/80 px-3 py-1 rounded-md text-xs font-semibold',
  },
  selesai: {
    label: 'Selesai',
    className:
      'bg-slate-50 text-slate-600 border border-slate-200/80 px-3 py-1 rounded-md text-xs font-medium',
  },
};

const PENJAMIN_COLOR: Record<PenjaminType, string> = {
  Umum: 'text-emerald-600',
  BPJS: 'text-[#008ba6]',
  Asuransi: 'text-amber-600',
};

export default function DaftarPemeriksaanDokter({
  initialData = DEFAULT_DOCTOR_VISITS,
  clarifications = [],
  upcomingControls = [],
  onSelectVisit,
}: {
  initialData?: DoctorVisitItem[];
  clarifications?: PharmacyClarificationItem[];
  upcomingControls?: UpcomingControlItem[];
  onSelectVisit?: (visit: DoctorVisitItem) => void;
}) {
  const [activeTopTab, setActiveTopTab] = useState<DoctorTopTab>('pemeriksaan');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DoctorExamStatus>(
    'all',
  );
  const [poliFilter, setPoliFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('terbaru');
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Daftar Poli dinamis
  const poliOptions = useMemo(() => {
    const unique = Array.from(new Set(initialData.map((item) => item.poli)));
    return unique.length > 0 ? unique : ['Poli Umum'];
  }, [initialData]);

  // Statistik KPI 4 Kartu
  const kpiStats = useMemo(() => {
    const menungguDokter = initialData.filter(
      (v) => v.status === 'menunggu_dokter',
    ).length;
    const berlangsung = initialData.filter(
      (v) => v.status === 'pemeriksaan_berlangsung',
    ).length;
    const selesai = initialData.filter((v) => v.status === 'selesai').length;
    const totalHandoff = initialData.length;

    return { menungguDokter, berlangsung, selesai, totalHandoff };
  }, [initialData]);

  // Filter & Sorting Data Pemeriksaan Dokter
  const filteredVisits = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);

    const filtered = initialData.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (poliFilter !== 'all' && item.poli !== poliFilter) return false;

      if (periodFilter === 'today' && item.tanggalISO !== todayStr) {
        return false;
      }
      if (periodFilter === '7days') {
        const diffDays =
          (Date.now() - new Date(item.tanggalISO).getTime()) /
          (1000 * 60 * 60 * 24);
        if (diffDays > 7) return false;
      }
      if (periodFilter === 'this_month') {
        if (item.tanggalISO.slice(0, 7) !== todayStr.slice(0, 7)) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.namaPasien.toLowerCase().includes(q) ||
          (item.nikPasien && item.nikPasien.toLowerCase().includes(q)) ||
          item.noRM.toLowerCase().includes(q) ||
          item.noKunjungan.toLowerCase().includes(q) ||
          item.noAntrean.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === 'terlama') {
        return a.noKunjungan.localeCompare(b.noKunjungan);
      }
      if (sortOrder === 'antrean_asc') {
        return a.noAntrean.localeCompare(b.noAntrean);
      }
      if (sortOrder === 'nama_asc') {
        return a.namaPasien.localeCompare(b.namaPasien);
      }
      return b.noKunjungan.localeCompare(a.noKunjungan);
    });
  }, [
    initialData,
    statusFilter,
    poliFilter,
    periodFilter,
    searchQuery,
    sortOrder,
  ]);

  // Kalkulasi Pagination
  const totalItems = filteredVisits.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedVisits = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return filteredVisits.slice(startIndex, startIndex + pageSize);
  }, [filteredVisits, safePage, pageSize]);

  const startItemNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItemNumber = Math.min(safePage * pageSize, totalItems);

  const handleResetPage = () => setCurrentPage(1);

  const TOP_TABS: {
    key: DoctorTopTab;
    label: string;
    count: number;
    Icon: React.ElementType;
  }[] = [
    {
      key: 'pemeriksaan',
      label: 'Pemeriksaan',
      count: initialData.length,
      Icon: ClipboardCheck,
    },
    {
      key: 'klarifikasi_farmasi',
      label: 'Klarifikasi Farmasi',
      count: clarifications.length,
      Icon: Pill,
    },
    {
      key: 'kontrol',
      label: 'Kontrol & Kunjungan Mendatang',
      count: upcomingControls.length,
      Icon: Calendar,
    },
  ];

  return (
    <div className="w-full h-full font-sans text-slate-700">
      {/* 1. TAB NAVIGASI ATAS */}
      <div
        role="tablist"
        aria-label="Navigasi Pemeriksaan Dokter"
        className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] mb-4 flex items-center divide-x divide-slate-200/80 overflow-x-auto"
      >
        {TOP_TABS.map(({ key, label, count, Icon }) => {
          const isActive = activeTopTab === key;

          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTopTab(key)}
              className={`relative px-5 py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#008ba6] font-bold'
                  : 'text-slate-500 font-semibold hover:text-slate-700 hover:bg-slate-50/70'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-[#008ba6]' : 'text-slate-400'
                }`}
              />
              <span>{label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive
                    ? 'bg-cyan-100/80 text-[#007b94]'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>

              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#009bb8] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* KONTEN TAB 1: PEMERIKSAAN */}
      {activeTopTab === 'pemeriksaan' && (
        <>
          {/* 2. BARIS KARTU KPI ATAS (4 KOLOM) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            {/* Card 1: Menunggu dokter */}
            <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500">
                  Menunggu dokter
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-[#0f3d56] tabular-nums">
                    {kpiStats.menungguDokter}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    kunjungan
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Pemeriksaan berlangsung */}
            <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center shrink-0">
                <Stethoscope className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500">
                  Pemeriksaan berlangsung
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-[#0f3d56] tabular-nums">
                    {kpiStats.berlangsung}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    kunjungan
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Selesai */}
            <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500">Selesai</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-[#0f3d56] tabular-nums">
                    {kpiStats.selesai}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    kunjungan
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Total handoff */}
            <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#e6f6fa] border border-cyan-100 text-[#008ba6] flex items-center justify-center shrink-0">
                <ClipboardList className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500">
                  Total handoff
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-[#0f3d56] tabular-nums">
                    {kpiStats.totalHandoff}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    kunjungan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. CARD UTAMA: DAFTAR PEMERIKSAAN DOKTER */}
          <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
            {/* Header Judul, Jumlah Ditemukan & Search */}
            <div className="px-5 pt-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <h2 className="text-base sm:text-[17px] font-bold text-[#0f3d56]">
                  Daftar Pemeriksaan Dokter
                </h2>
                <span className="text-xs font-medium text-slate-400">
                  {totalItems} kunjungan ditemukan
                </span>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleResetPage();
                  }}
                  placeholder="Cari Pasien, RM, Antrean..."
                  className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      handleResetPage();
                    }}
                    aria-label="Hapus pencarian"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Baris 4 Filter Dropdown */}
            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.75fr] gap-3.5">
              {/* Filter Status */}
              <div>
                <label
                  htmlFor="filter-status-dokter"
                  className="block text-xs font-bold text-slate-600 mb-1.5"
                >
                  Status
                </label>
                <div className="relative">
                  <select
                    id="filter-status-dokter"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(
                        e.target.value as 'all' | DoctorExamStatus,
                      );
                      handleResetPage();
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-xs sm:text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="menunggu_dokter">Menunggu Dokter</option>
                    <option value="pemeriksaan_berlangsung">
                      Pemeriksaan Berlangsung
                    </option>
                    <option value="selesai">Selesai</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter Poli */}
              <div>
                <label
                  htmlFor="filter-poli-dokter"
                  className="block text-xs font-bold text-slate-600 mb-1.5"
                >
                  Poli
                </label>
                <div className="relative">
                  <select
                    id="filter-poli-dokter"
                    value={poliFilter}
                    onChange={(e) => {
                      setPoliFilter(e.target.value);
                      handleResetPage();
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-xs sm:text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
                  >
                    <option value="all">Semua Poli</option>
                    {poliOptions.map((poli) => (
                      <option key={poli} value={poli}>
                        {poli}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter Periode Kunjungan */}
              <div>
                <label
                  htmlFor="filter-periode-dokter"
                  className="block text-xs font-bold text-slate-600 mb-1.5"
                >
                  Periode Kunjungan
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="filter-periode-dokter"
                    value={periodFilter}
                    onChange={(e) => {
                      setPeriodFilter(e.target.value as PeriodFilter);
                      handleResetPage();
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-10 pr-9 py-2.5 text-xs sm:text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
                  >
                    <option value="all">Semua Tanggal</option>
                    <option value="today">Hari Ini</option>
                    <option value="7days">7 Hari Terakhir</option>
                    <option value="this_month">Bulan Ini</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Urutkan */}
              <div>
                <label
                  htmlFor="urutkan-dokter"
                  className="block text-xs font-bold text-slate-600 mb-1.5"
                >
                  Urutkan
                </label>
                <div className="relative">
                  <select
                    id="urutkan-dokter"
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value as SortOrder);
                      handleResetPage();
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-xs sm:text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="terlama">Terlama</option>
                    <option value="antrean_asc">No. Antrean (A-Z)</option>
                    <option value="nama_asc">Nama Pasien (A-Z)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Tabel Data Pemeriksaan Dokter */}
            <div className="overflow-x-auto border-t border-slate-200/80">
              <table className="w-full text-left border-collapse min-w-[1060px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-center">No. Antrean</th>
                    <th className="px-4 py-3 text-center">No. Kunjungan</th>
                    <th className="px-4 py-3 text-center">Nama Pasien</th>
                    <th className="px-4 py-3 text-center">NIK Pasien</th>
                    <th className="px-4 py-3 text-center">No. RM</th>
                    <th className="px-4 py-3 text-center">Poli</th>
                    <th className="px-4 py-3 text-center">Dokter</th>
                    <th className="px-4 py-3 text-center">Penjamin</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/70 text-xs">
                  {paginatedVisits.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-12 px-4 text-center text-slate-500"
                      >
                        Tidak ada data pemeriksaan dokter yang cocok dengan
                        filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedVisits.map((visit) => {
                      const statusBadge = STATUS_DISPLAY[visit.status];

                      return (
                        <tr
                          key={visit.id}
                          onClick={() => onSelectVisit?.(visit)}
                          className="divide-x divide-slate-100 hover:bg-[#f0f9fb]/50 transition-colors cursor-pointer"
                        >
                          {/* No. Antrean + Tanggal */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/90 border border-slate-200/70">
                              <span className="font-extrabold text-[#0f3d56]">
                                {visit.noAntrean}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {visit.tanggalLabel}
                              </span>
                            </div>
                          </td>

                          {/* No. Kunjungan */}
                          <td className="px-4 py-3.5 font-bold text-[#008ba6] whitespace-nowrap">
                            {visit.noKunjungan}
                          </td>

                          {/* Nama Pasien */}
                          <td className="px-4 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                            {visit.namaPasien}
                          </td>

                          {/* NIK Pasien */}
                          <td className="px-4 py-3.5 text-slate-600 tabular-nums whitespace-nowrap">
                            {visit.nikPasien || '—'}
                          </td>

                          {/* No. RM */}
                          <td className="px-4 py-3.5 font-medium text-slate-600 whitespace-nowrap">
                            {visit.noRM}
                          </td>

                          {/* Poli */}
                          <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                            {visit.poli}
                          </td>

                          {/* Dokter */}
                          <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                            {visit.dokter}
                          </td>

                          {/* Penjamin */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`font-bold ${PENJAMIN_COLOR[visit.penjamin]}`}
                            >
                              {visit.penjamin}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5 text-center whitespace-nowrap">
                            <span className={statusBadge.className}>
                              {statusBadge.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Pagination */}
            <div className="px-5 py-3.5 border-t border-slate-200/80 bg-white flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              {/* Kiri: Info Jumlah & Per Halaman */}
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  <strong className="font-semibold text-slate-700">
                    {startItemNumber}–{endItemNumber}
                  </strong>{' '}
                  dari{' '}
                  <strong className="font-semibold text-slate-700">
                    {totalItems}
                  </strong>{' '}
                  Kunjungan
                </span>

                <div className="flex items-center gap-2">
                  <label htmlFor="per-halaman-dokter">Per Halaman</label>
                  <div className="relative">
                    <select
                      id="per-halaman-dokter"
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
                      <option value={50}>50</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Kanan: Tombol Navigasi Halaman */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={safePage <= 1}
                  aria-label="Halaman pertama"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  aria-label="Halaman sebelumnya"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
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
                            ? 'bg-[#f0f9fb] border-[#009bb8] text-[#008ba6]'
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
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safePage >= totalPages}
                  aria-label="Halaman terakhir"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* KONTEN TAB 2: KLARIFIKASI FARMASI */}
      {activeTopTab === 'klarifikasi_farmasi' && (
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-[17px] font-bold text-[#0f3d56]">
                Klarifikasi Farmasi
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar permintaan konfirmasi atau penyesuaian resep dari unit
                farmasi
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {clarifications.length} permintaan
            </span>
          </div>

          {clarifications.length === 0 ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mb-3">
                <Pill className="w-5 h-5 stroke-[1.8]" />
              </div>
              <p className="text-sm font-bold text-[#0f3d56]">
                Tidak ada klarifikasi farmasi
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Permintaan klarifikasi resep dari apoteker akan tampil di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[780px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">No. Resep</th>
                    <th className="px-4 py-3">No. Kunjungan</th>
                    <th className="px-4 py-3">Pasien</th>
                    <th className="px-4 py-3">Catatan Farmasi</th>
                    <th className="px-4 py-3">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 text-xs">
                  {clarifications.map((item) => (
                    <tr
                      key={item.id}
                      className="divide-x divide-slate-100 hover:bg-[#f0f9fb]/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-bold text-[#008ba6]">
                        {item.noResep}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-600">
                        {item.noKunjungan}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-700">
                          {item.namaPasien}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {item.noRM}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {item.catatanFarmasi}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 tabular-nums">
                        {item.waktuPermintaan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* KONTEN TAB 3: KONTROL & KUNJUNGAN MENDATANG */}
      {activeTopTab === 'kontrol' && (
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-[17px] font-bold text-[#0f3d56]">
                Kontrol &amp; Kunjungan Mendatang
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Jadwal kontrol ulang pasien yang telah direncanakan dokter
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {upcomingControls.length} jadwal
            </span>
          </div>

          {upcomingControls.length === 0 ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 stroke-[1.8]" />
              </div>
              <p className="text-sm font-bold text-[#0f3d56]">
                Belum ada jadwal kontrol mendatang
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Rencana kontrol pasien berikutnya akan ditampilkan di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[780px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Tanggal Rencana</th>
                    <th className="px-4 py-3">Pasien</th>
                    <th className="px-4 py-3">Poli</th>
                    <th className="px-4 py-3">Dokter</th>
                    <th className="px-4 py-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 text-xs">
                  {upcomingControls.map((ctrl) => (
                    <tr
                      key={ctrl.id}
                      className="divide-x divide-slate-100 hover:bg-[#f0f9fb]/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-bold text-[#008ba6]">
                        {ctrl.tanggalRencana}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-700">
                          {ctrl.namaPasien}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {ctrl.noRM}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {ctrl.poli}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {ctrl.dokter}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">
                        {ctrl.keterangan || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}