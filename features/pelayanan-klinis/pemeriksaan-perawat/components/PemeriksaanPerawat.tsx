/* eslint-disable react-hooks/purity */
'use client';

import React, { useMemo, useState } from 'react';
import {
  ClipboardList,
  Clock,
  Stethoscope,
  Check,
  Search,
  Calendar,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  X,
} from 'lucide-react';

export type NurseExamStatus =
  | 'antrean_perawat'
  | 'menunggu_dokter'
  | 'selesai';

export type PenjaminType = 'Umum' | 'BPJS' | 'Asuransi';
export type SortOrder = 'terbaru' | 'terlama' | 'antrean_asc' | 'nama_asc';
export type PeriodFilter = 'all' | 'today' | '7days' | 'this_month';

export interface NurseVisitItem {
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
  status: NurseExamStatus;
}

const DEFAULT_VISITS: NurseVisitItem[] = [
  {
    id: 'vis-1',
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
  {
    id: 'vis-2',
    noAntrean: 'B001',
    tanggalLabel: '07 Nov 2026',
    tanggalISO: '2026-11-07',
    noKunjungan: 'KJ-20261107-000002',
    namaPasien: 'Suparno',
    nikPasien: '1351502011111496',
    noRM: 'RM00000001',
    poli: 'Poli Umum',
    dokter: 'dr. Altharrazka Kenigara Rizfan',
    penjamin: 'Umum',
    status: 'antrean_perawat',
  },
];

const STATUS_DISPLAY: Record<
  NurseExamStatus,
  { label: string; className: string }
> = {
  antrean_perawat: {
    label: 'Antrean Perawat',
    className:
      'bg-amber-50 text-amber-700 border border-amber-200/90 px-3 py-1 rounded-md text-xs font-semibold',
  },
  menunggu_dokter: {
    label: 'Menunggu Dokter',
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

export default function DaftarPemeriksaanPerawat({
  initialData = DEFAULT_VISITS,
  onSelectVisit,
}: {
  initialData?: NurseVisitItem[];
  onSelectVisit?: (visit: NurseVisitItem) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | NurseExamStatus>(
    'all',
  );
  const [poliFilter, setPoliFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('terbaru');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Daftar Poli dinamis dari data
  const poliOptions = useMemo(() => {
    const unique = Array.from(new Set(initialData.map((item) => item.poli)));
    return unique.length > 0 ? unique : ['Poli Umum'];
  }, [initialData]);

  // Ringkasan KPI Atas
  const kpiStats = useMemo(() => {
    const total = initialData.length;
    const perluDilanjutkan = initialData.filter(
      (v) => v.status === 'antrean_perawat',
    ).length;
    const menungguDokter = initialData.filter(
      (v) => v.status === 'menunggu_dokter',
    ).length;
    const selesai = initialData.filter((v) => v.status === 'selesai').length;

    return { total, perluDilanjutkan, menungguDokter, selesai };
  }, [initialData]);

  // Filter & Urutkan Kunjungan
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

  return (
    <div className="w-full h-full font-sans text-slate-700">
      {/* 1. BARIS KARTU KPI ATAS (4 KOLOM) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {/* Card 1: Total Kunjungan */}
        <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#e6f6fa] border border-cyan-100 text-[#008ba6] flex items-center justify-center shrink-0">
            <ClipboardList className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">
              Total Kunjungan
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-[#0f3d56] tabular-nums">
                {kpiStats.total}
              </span>
              <span className="text-xs font-medium text-slate-400 truncate">
                Semua Kunjungan
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Perlu Dilanjutkan */}
        <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">
              Perlu Dilanjutkan
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-[#0f3d56] tabular-nums">
                {kpiStats.perluDilanjutkan}
              </span>
              <span className="text-xs font-medium text-slate-400 truncate">
                Assessment Perawat
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Menunggu Dokter */}
        <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center shrink-0">
            <Stethoscope className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">
              Menunggu Dokter
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-[#0f3d56] tabular-nums">
                {kpiStats.menungguDokter}
              </span>
              <span className="text-xs font-medium text-slate-400 truncate">
                Serah Terima Tersedia
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Selesai */}
        <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Selesai</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-[#0f3d56] tabular-nums">
                {kpiStats.selesai}
              </span>
              <span className="text-xs font-medium text-slate-400 truncate">
                Pemeriksaan Dokter
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CARD UTAMA: DAFTAR PEMERIKSAAN PERAWAT */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Header Judul & Pencarian Kanan */}
        <div className="px-5 pt-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base sm:text-[17px] font-bold text-[#0f3d56]">
            Daftar Pemeriksaan Perawat
          </h2>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleResetPage();
              }}
              placeholder="Cari Nama, NIK, No. RM, atau No. Kunjungan..."
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
              htmlFor="filter-status-perawat"
              className="block text-xs font-bold text-slate-600 mb-1.5"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="filter-status-perawat"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'all' | NurseExamStatus);
                  handleResetPage();
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-xs sm:text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="antrean_perawat">Antrean Perawat</option>
                <option value="menunggu_dokter">Menunggu Dokter</option>
                <option value="selesai">Selesai</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filter Poli */}
          <div>
            <label
              htmlFor="filter-poli-perawat"
              className="block text-xs font-bold text-slate-600 mb-1.5"
            >
              Poli
            </label>
            <div className="relative">
              <select
                id="filter-poli-perawat"
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
              htmlFor="filter-periode-kunjungan"
              className="block text-xs font-bold text-slate-600 mb-1.5"
            >
              Periode Kunjungan
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="filter-periode-kunjungan"
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
              htmlFor="urutkan-kunjungan"
              className="block text-xs font-bold text-slate-600 mb-1.5"
            >
              Urutkan
            </label>
            <div className="relative">
              <select
                id="urutkan-kunjungan"
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

        {/* Tabel Data Kunjungan */}
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
                    Tidak ada data pemeriksaan perawat yang cocok dengan filter.
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
              <label htmlFor="per-halaman-perawat">Per Halaman</label>
              <div className="relative">
                <select
                  id="per-halaman-perawat"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
    </div>
  );
}