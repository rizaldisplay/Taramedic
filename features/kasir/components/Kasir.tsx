/* eslint-disable react-hooks/purity */
'use client';

import React, { useMemo, useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  FileText,
  Megaphone,
  RefreshCw,
  Search,
  User,
  UserCheck,
  X,
} from 'lucide-react';

export type KasirVisitStatus =
  | 'belum_didaftarkan'
  | 'menunggu'
  | 'sedang_diproses'
  | 'selesai'
  | 'dilewati';

export type BillingStatus = 'menunggu_pembayaran' | 'lunas' | 'sebagian';

export type KasirTabFilter =
  | 'semua'
  | 'tagihan_susulan'
  | 'menunggu'
  | 'sedang_diproses'
  | 'selesai'
  | 'dilewati';

export type DatePeriodFilter = 'today' | 'all' | '7days' | 'this_month';
export type SortByOption = 'nomor_antrean' | 'terbaru' | 'terlama' | 'nama_asc';

export interface KasirVisitItem {
  id: string;
  nomorAntrean: string;
  tanggalLabel: string; // Contoh: "09 Nov 2026"
  tanggalISO: string; // Contoh: "2026-11-09"
  namaPasien: string;
  noRM: string;
  isTagihanSusulan?: boolean;
  tanggalTagihanSusulan?: string;
  poli: string;
  layanan: string;
  dokter: string;
  billingStatus: BillingStatus;
  jumlahItemBilling: number;
  catatanBilling?: string;
  totalTagihan: number;
  penjamin: 'Umum' | 'BPJS' | 'Asuransi';
  sumberKunjungan: string;
  status: KasirVisitStatus;
  serahFarmasiLabel?: string;
  statusFarmasiLabel?: string;
  waktuPanggilan?: string;
}

export interface KasirCounterOption {
  id: string;
  nama: string;
}

export interface CallHistoryEntry {
  id: string;
  nomorAntrean: string;
  namaPasien: string;
  loketNama: string;
  waktuPanggil: string;
}

const DEFAULT_KASIR_COUNTERS: KasirCounterOption[] = [
  { id: 'KASIR-1', nama: 'Loket Kasir 1 - Umum' },
  { id: 'KASIR-2', nama: 'Loket Kasir 2 - BPJS & Asuransi' },
  { id: 'KASIR-3', nama: 'Loket Kasir 3 - Farmasi & Tunai' },
];

const DEFAULT_VISITS: KasirVisitItem[] = [
  {
    id: 'kunj-1',
    nomorAntrean: 'B002',
    tanggalLabel: '09 Nov 2026',
    tanggalISO: '2026-11-09',
    namaPasien: 'Suparna',
    noRM: 'RM00000002',
    isTagihanSusulan: true,
    tanggalTagihanSusulan: '09 Nov 2026',
    poli: 'Poli Umum',
    layanan: 'Konsultasi Dokter',
    dokter: 'dr. Altharrazka Kenigara Rizfan',
    billingStatus: 'menunggu_pembayaran',
    jumlahItemBilling: 2,
    catatanBilling: 'tanpa catatan',
    totalTagihan: 75000,
    penjamin: 'Umum',
    sumberKunjungan: 'Sumber kunjungan',
    status: 'belum_didaftarkan',
    serahFarmasiLabel: 'Belum tercatat',
    statusFarmasiLabel: 'Menunggu review',
  },
];

const VISIT_STATUS_META: Record<
  KasirVisitStatus,
  {
    label: string;
    dotClass: string;
    pillClass: string;
  }
> = {
  belum_didaftarkan: {
    label: 'Belum didaftarkan',
    dotClass: 'bg-slate-400',
    pillClass: 'bg-slate-100 border border-slate-200/80 text-slate-600',
  },
  menunggu: {
    label: 'Menunggu',
    dotClass: 'bg-[#009bb8]',
    pillClass: 'bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6]',
  },
  sedang_diproses: {
    label: 'Sedang diproses',
    dotClass: 'bg-amber-500',
    pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  selesai: {
    label: 'Selesai',
    dotClass: 'bg-emerald-500',
    pillClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  dilewati: {
    label: 'Dilewati',
    dotClass: 'bg-rose-400',
    pillClass: 'bg-rose-50 border border-rose-200/80 text-rose-700',
  },
};

const BILLING_STATUS_META: Record<
  BillingStatus,
  {
    label: string;
    textClass: string;
    badgeClass: string;
  }
> = {
  menunggu_pembayaran: {
    label: 'Menunggu pembayaran',
    textClass: 'text-amber-700',
    badgeClass: 'bg-amber-50 border border-amber-200/80 text-amber-800',
  },
  sebagian: {
    label: 'Dibayar sebagian',
    textClass: 'text-[#008ba6]',
    badgeClass: 'bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6]',
  },
  lunas: {
    label: 'Lunas',
    textClass: 'text-emerald-700',
    badgeClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
};

function formatRupiah(nominal: number): string {
  return `Rp ${nominal.toLocaleString('id-ID')}`;
}

export default function DaftarKunjunganKasir({
  initialData = DEFAULT_VISITS,
  counters = DEFAULT_KASIR_COUNTERS,
  onReload,
  onOpenBilling,
  onCallPatient,
  onRegisterArrival,
}: {
  initialData?: KasirVisitItem[];
  counters?: KasirCounterOption[];
  onReload?: () => Promise<void> | void;
  onOpenBilling?: (visit: KasirVisitItem) => void;
  onCallPatient?: (visit: KasirVisitItem, counter: KasirCounterOption) => void;
  onRegisterArrival?: (visit: KasirVisitItem) => void;
}) {
  const [visits, setVisits] = useState<KasirVisitItem[]>(initialData);
  const [selectedVisitId, setSelectedVisitId] = useState<string>(
    initialData[0]?.id ?? '',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DatePeriodFilter>('today');
  const [poliFilter, setPoliFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortByOption>('nomor_antrean');
  const [activeTab, setActiveTab] = useState<KasirTabFilter>('semua');
  const [selectedLoketId, setSelectedLoketId] = useState<string>('');
  const [callHistory, setCallHistory] = useState<CallHistoryEntry[]>([]);
  const [isReloading, setIsReloading] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Daftar opsi Poli dinamis
  const poliOptions = useMemo(() => {
    const unique = Array.from(new Set(visits.map((v) => v.poli)));
    return unique.length > 0 ? unique : ['Poli Umum'];
  }, [visits]);

  // Hitung badge pada setiap tab
  const tabCounts = useMemo(() => {
    const semua = visits.length;
    const tagihan_susulan = visits.filter((v) => v.isTagihanSusulan).length;
    const menunggu = visits.filter(
      (v) => v.status === 'menunggu' || v.status === 'belum_didaftarkan',
    ).length;
    const sedang_diproses = visits.filter(
      (v) => v.status === 'sedang_diproses',
    ).length;
    const selesai = visits.filter((v) => v.status === 'selesai').length;
    const dilewati = visits.filter((v) => v.status === 'dilewati').length;

    return {
      semua,
      tagihan_susulan,
      menunggu,
      sedang_diproses,
      selesai,
      dilewati,
    };
  }, [visits]);

  // Filter & Urutkan daftar kunjungan
  const filteredVisits = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);

    const filtered = visits.filter((item) => {
      if (activeTab === 'tagihan_susulan' && !item.isTagihanSusulan) {
        return false;
      }
      if (
        activeTab === 'menunggu' &&
        item.status !== 'menunggu' &&
        item.status !== 'belum_didaftarkan'
      ) {
        return false;
      }
      if (activeTab === 'sedang_diproses' && item.status !== 'sedang_diproses') {
        return false;
      }
      if (activeTab === 'selesai' && item.status !== 'selesai') {
        return false;
      }
      if (activeTab === 'dilewati' && item.status !== 'dilewati') {
        return false;
      }

      if (poliFilter !== 'all' && item.poli !== poliFilter) {
        return false;
      }

      if (
        dateFilter === 'today' &&
        !item.isTagihanSusulan &&
        item.tanggalISO !== todayStr
      ) {
        return false;
      }
      if (dateFilter === '7days') {
        const diffDays =
          (Date.now() - new Date(item.tanggalISO).getTime()) /
          (1000 * 60 * 60 * 24);
        if (diffDays > 7) return false;
      }
      if (dateFilter === 'this_month') {
        if (item.tanggalISO.slice(0, 7) !== todayStr.slice(0, 7)) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.namaPasien.toLowerCase().includes(q) ||
          item.noRM.toLowerCase().includes(q) ||
          item.nomorAntrean.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'nama_asc') {
        return a.namaPasien.localeCompare(b.namaPasien);
      }
      if (sortBy === 'terlama') {
        return a.tanggalISO.localeCompare(b.tanggalISO);
      }
      if (sortBy === 'terbaru') {
        return b.tanggalISO.localeCompare(a.tanggalISO);
      }
      return a.nomorAntrean.localeCompare(b.nomorAntrean);
    });
  }, [visits, activeTab, poliFilter, dateFilter, searchQuery, sortBy]);

  // Pagination
  const totalItems = filteredVisits.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedVisits = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return filteredVisits.slice(startIndex, startIndex + pageSize);
  }, [filteredVisits, safePage, pageSize]);

  const startItemNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItemNumber = Math.min(safePage * pageSize, totalItems);

  // Kunjungan terpilih di sidebar kanan
  const selectedVisit = useMemo(() => {
    return (
      visits.find((v) => v.id === selectedVisitId) ??
      filteredVisits[0] ??
      null
    );
  }, [visits, selectedVisitId, filteredVisits]);

  // Antrean berikutnya yang berstatus menunggu
  const waitingQueueList = useMemo(() => {
    return visits.filter(
      (v) => v.id !== selectedVisit?.id && v.status === 'menunggu',
    );
  }, [visits, selectedVisit]);

  const selectedCounter = useMemo(
    () => counters.find((c) => c.id === selectedLoketId) ?? null,
    [counters, selectedLoketId],
  );

  const handleReloadClick = async () => {
    try {
      setIsReloading(true);
      await onReload?.();
    } finally {
      setTimeout(() => setIsReloading(false), 350);
    }
  };

  const handleCallPatientClick = () => {
    if (!selectedVisit || !selectedCounter) return;

    const nowTime = new Date()
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace('.', ':');

    const updatedVisit: KasirVisitItem = {
      ...selectedVisit,
      status: 'sedang_diproses',
      waktuPanggilan: `${nowTime} WIB`,
    };

    setVisits((prev) =>
      prev.map((v) => (v.id === selectedVisit.id ? updatedVisit : v)),
    );

    setCallHistory((prev) =>
      [
        {
          id: `${selectedVisit.id}-${Date.now()}`,
          nomorAntrean: selectedVisit.nomorAntrean,
          namaPasien: selectedVisit.namaPasien,
          loketNama: selectedCounter.nama,
          waktuPanggil: `${nowTime} WIB`,
        },
        ...prev,
      ].slice(0, 3),
    );

    onCallPatient?.(updatedVisit, selectedCounter);
  };

  const handleRegisterArrivalClick = () => {
    if (!selectedVisit) return;

    const updatedVisit: KasirVisitItem = {
      ...selectedVisit,
      status: 'menunggu',
    };

    setVisits((prev) =>
      prev.map((v) => (v.id === selectedVisit.id ? updatedVisit : v)),
    );

    onRegisterArrival?.(updatedVisit);
  };

  const TABS: { key: KasirTabFilter; label: string }[] = [
    { key: 'semua', label: 'Semua' },
    { key: 'tagihan_susulan', label: 'Tagihan susulan' },
    { key: 'menunggu', label: 'Menunggu' },
    { key: 'sedang_diproses', label: 'Sedang diproses' },
    { key: 'selesai', label: 'Selesai' },
    { key: 'dilewati', label: 'Dilewati' },
  ];

  const selectedVisitStatusMeta = selectedVisit
    ? VISIT_STATUS_META[selectedVisit.status]
    : null;
  const selectedBillingMeta = selectedVisit
    ? BILLING_STATUS_META[selectedVisit.billingStatus]
    : null;

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 items-start">
        {/* KOLOM KIRI: DAFTAR KUNJUNGAN */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header Section */}
          <div className="px-5 pt-5 pb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-[17px] font-bold text-[#0f3d56]">
                Daftar Kunjungan
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Tanggal Pelayanan Hari Ini &amp; Tagihan Susulan · Antrean
                Operasional Hari Ini
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleReloadClick()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-slate-500 ${
                  isReloading ? 'animate-spin text-[#008ba6]' : ''
                }`}
              />
              <span>Muat Ulang</span>
            </button>
          </div>

          {/* Baris Search & 3 Filter Dropdown */}
          <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.9fr_0.9fr] gap-3 items-end">
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
                placeholder="Cari Pasien, RM, atau Antrean"
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tanggal Pelayanan */}
            <div>
              <label
                htmlFor="filter-tanggal-pelayanan"
                className="block text-xs font-bold text-slate-600 mb-1.5"
              >
                Tanggal Pelayanan
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="filter-tanggal-pelayanan"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value as DatePeriodFilter);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-10 pr-9 py-2.5 text-xs sm:text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
                >
                  <option value="today">Hari Ini</option>
                  <option value="all">Semua Tanggal</option>
                  <option value="7days">7 Hari Terakhir</option>
                  <option value="this_month">Bulan Ini</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Poli */}
            <div>
              <label
                htmlFor="filter-poli-kasir"
                className="block text-xs font-bold text-slate-600 mb-1.5"
              >
                Poli
              </label>
              <div className="relative">
                <select
                  id="filter-poli-kasir"
                  value={poliFilter}
                  onChange={(e) => {
                    setPoliFilter(e.target.value);
                    setCurrentPage(1);
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

            {/* Urutkan */}
            <div>
              <label
                htmlFor="filter-urutkan-kasir"
                className="block text-xs font-bold text-slate-600 mb-1.5"
              >
                Urutkan
              </label>
              <div className="relative">
                <select
                  id="filter-urutkan-kasir"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortByOption);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-xs sm:text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
                >
                  <option value="nomor_antrean">Nomor Antrean</option>
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                  <option value="nama_asc">Nama Pasien (A-Z)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Sub-Tabs Status */}
          <div
            role="tablist"
            aria-label="Filter Status Kunjungan Kasir"
            className="px-5 border-b border-slate-200/80 flex items-center gap-5 sm:gap-6 overflow-x-auto"
          >
            {TABS.map((tab) => {
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
                    setCurrentPage(1);
                  }}
                  className={`relative pb-3 pt-1 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#008ba6] font-bold'
                      : 'text-slate-500 font-semibold hover:text-slate-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      isActive
                        ? 'bg-cyan-100/80 text-[#007b94]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tabel Daftar Kunjungan */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[820px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold tracking-wider text-slate-500">
                <tr className="divide-x divide-slate-200/60">
                  <th className="px-4 py-3 text-center">Antrean / pasien</th>
                  <th className="px-4 py-3 text-center">Poli / layanan</th>
                  <th className="px-4 py-3 text-center">Billing</th>
                  <th className="px-4 py-3 text-center">Penjamin</th>
                  <th className="px-4 py-3 text-center">Status / waktu</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedVisits.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-14 px-4 text-center text-slate-500"
                    >
                      Tidak ada data kunjungan yang cocok dengan pencarian atau
                      filter.
                    </td>
                  </tr>
                ) : (
                  paginatedVisits.map((visit) => {
                    const isSelected = selectedVisit?.id === visit.id;
                    const statusBadge = VISIT_STATUS_META[visit.status];
                    const billingBadge =
                      BILLING_STATUS_META[visit.billingStatus];

                    return (
                      <tr
                        key={visit.id}
                        onClick={() => setSelectedVisitId(visit.id)}
                        className={`divide-x divide-slate-100 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#f0f9fb]/45 border-l-[3px] border-l-[#009bb8]'
                            : 'hover:bg-slate-50/90'
                        }`}
                      >
                        {/* Kolom 1: Antrean / Pasien + Tagihan Susulan + Buka Billing */}
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-slate-100/90 border border-slate-200/80 px-2.5 py-1.5 text-center shrink-0">
                              <p className="text-xs font-extrabold text-[#0f3d56] leading-tight">
                                {visit.nomorAntrean}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {visit.tanggalLabel}
                              </p>
                            </div>

                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">
                                {visit.namaPasien}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {visit.noRM}
                              </p>
                            </div>
                          </div>

                          {visit.isTagihanSusulan && (
                            <div className="mt-2.5">
                              <span className="inline-block rounded-xl bg-amber-50/90 border border-amber-200/70 px-3 py-1 text-[11px] font-semibold text-amber-800 leading-snug">
                                Tagihan susulan ·{' '}
                                {visit.tanggalTagihanSusulan ||
                                  visit.tanggalLabel}
                              </span>
                            </div>
                          )}

                          <div className="mt-2.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVisitId(visit.id);
                                onOpenBilling?.(visit);
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Buka Billing</span>
                            </button>
                          </div>
                        </td>

                        {/* Kolom 2: Poli / Layanan */}
                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <p className="font-bold text-slate-800">
                            {visit.poli}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {visit.layanan}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {visit.dokter}
                          </p>
                        </td>

                        {/* Kolom 3: Billing */}
                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <p
                            className={`font-bold ${billingBadge.textClass}`}
                          >
                            {billingBadge.label}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {visit.jumlahItemBilling} item ·{' '}
                            {visit.catatanBilling || 'tanpa catatan'}
                          </p>
                        </td>

                        {/* Kolom 4: Penjamin */}
                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <p className="font-bold text-slate-800">
                            {visit.penjamin}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {visit.sumberKunjungan}
                          </p>
                        </td>

                        {/* Kolom 5: Status / Waktu */}
                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusBadge.pillClass}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotClass}`}
                            />
                            <span>{statusBadge.label}</span>
                          </span>
                          <p className="text-[11px] text-slate-400 mt-2">
                            Serah farmasi:{' '}
                            {visit.serahFarmasiLabel || 'Belum tercatat'}
                          </p>
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
                <label htmlFor="per-halaman-kasir">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-kasir"
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

        {/* KOLOM KANAN: KUNJUNGAN TERPILIH & KONTROL LOKET KASIR */}
        <aside className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          {selectedVisit && selectedVisitStatusMeta && selectedBillingMeta ? (
            <>
              {/* Header Kunjungan Terpilih */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-500">
                  KUNJUNGAN TERPILIH
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${selectedVisitStatusMeta.pillClass}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${selectedVisitStatusMeta.dotClass}`}
                  />
                  <span>{selectedVisitStatusMeta.label}</span>
                </span>
              </div>

              {/* Kotak Nomor Antrean & Tanggal */}
              <div className="mt-2.5 inline-block rounded-lg bg-slate-100/90 border border-slate-200/80 px-3 py-1.5 text-center">
                <p className="text-xs font-extrabold text-[#0f3d56] leading-tight">
                  {selectedVisit.nomorAntrean}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {selectedVisit.tanggalLabel}
                </p>
              </div>

              {/* Info Pasien & Avatar */}
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0f3d56] truncate">
                    {selectedVisit.namaPasien}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedVisit.noRM} · {selectedVisit.poli}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {selectedVisit.dokter} · {selectedVisit.layanan}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 stroke-[1.8]" />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 my-4" />

              {/* Ringkasan Billing */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#008ba6]" />
                    <span className="text-xs font-bold text-[#0f3d56]">
                      Ringkasan Billing
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${selectedBillingMeta.badgeClass}`}
                  >
                    {selectedBillingMeta.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-[11px] text-slate-400">Total tagihan</p>
                    <p className="text-sm font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                      {formatRupiah(selectedVisit.totalTagihan)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Penjamin</p>
                    <p className="text-sm font-bold text-[#0f3d56] mt-0.5">
                      {selectedVisit.penjamin}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-[11px] text-slate-400">
                    Status Farmasi (jika ada)
                  </p>
                  <p className="text-xs font-bold text-[#0f3d56] mt-0.5">
                    {selectedVisit.statusFarmasiLabel || 'Menunggu review'}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 my-4" />

              {/* Status Panggilan */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Megaphone className="w-4 h-4 text-[#008ba6] shrink-0" />
                  <span>
                    {selectedVisit.waktuPanggilan
                      ? 'Sudah dipanggil'
                      : 'Belum dipanggil'}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-[#008ba6] shrink-0" />
                  <span>
                    {selectedVisit.waktuPanggilan
                      ? `Dipanggil pukul ${selectedVisit.waktuPanggilan}`
                      : 'Waktu panggilan belum tercatat'}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 my-3.5" />

              {/* Loket Kasir */}
              <div>
                <label
                  htmlFor="pilih-loket-kasir"
                  className="block text-xs font-bold text-[#0f3d56] mb-2"
                >
                  Loket Kasir
                </label>

                <div className="relative">
                  <select
                    id="pilih-loket-kasir"
                    value={selectedLoketId}
                    onChange={(e) => setSelectedLoketId(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs sm:text-[13px] font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
                  >
                    <option value="">Pilih Loket Kasir</option>
                    {counters.map((counter) => (
                      <option key={counter.id} value={counter.id}>
                        {counter.nama}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs font-semibold">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      selectedCounter ? 'bg-[#009bb8]' : 'bg-emerald-500'
                    }`}
                  />
                  <span
                    className={
                      selectedCounter ? 'text-[#008ba6]' : 'text-emerald-700'
                    }
                  >
                    {selectedCounter
                      ? `Aktif: ${selectedCounter.nama}`
                      : 'Loket belum dipilih'}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 my-3.5" />

              {/* Tombol Panggil Pasien & Daftarkan Kedatangan */}
              <div>
                <button
                  type="button"
                  disabled={!selectedCounter}
                  onClick={handleCallPatientClick}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-[13px] font-bold inline-flex items-center justify-center gap-2 transition-all ${
                    !selectedCounter
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white shadow-xs cursor-pointer'
                  }`}
                >
                  <Megaphone className="w-4 h-4 shrink-0" />
                  <span>Panggil pasien</span>
                </button>

                <p className="text-[11px] text-slate-500 mt-2">
                  {!selectedCounter
                    ? 'Pilih loket Kasir untuk memanggil pasien.'
                    : `Siap memanggil ${selectedVisit.nomorAntrean} ke ${selectedCounter.nama}.`}
                </p>

                <button
                  type="button"
                  onClick={handleRegisterArrivalClick}
                  className="w-full mt-2.5 py-2.5 px-4 rounded-xl bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-bold inline-flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Daftarkan kedatangan</span>
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center text-xs text-slate-400">
              Pilih kunjungan pada tabel di sebelah kiri untuk melihat detail.
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-slate-100 my-4" />

          {/* Antrean Berikutnya */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-xs font-bold text-[#0f3d56]">
                Antrean Berikutnya
              </span>
              <span className="text-[11px] text-slate-400">
                {waitingQueueList.length} Pasien Menunggu
              </span>
            </div>

            {waitingQueueList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3.5 py-3 text-xs text-slate-400">
                Belum ada pasien yang menunggu.
              </div>
            ) : (
              <div className="space-y-2">
                {waitingQueueList.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedVisitId(item.id)}
                    className="w-full text-left rounded-xl border border-slate-200/90 hover:border-[#009bb8]/50 bg-[#f8fafc] hover:bg-[#f0f9fb]/60 px-3.5 py-2.5 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-[#008ba6]">
                        {item.nomorAntrean} ·{' '}
                        <span className="text-[#0f3d56]">
                          {item.namaPasien}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.noRM} · {formatRupiah(item.totalTagihan)}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-[#008ba6]">
                      Pilih
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-4" />

          {/* Riwayat Panggilan */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-xs font-bold text-[#0f3d56]">
                Riwayat Panggilan
              </span>
              <span className="text-[11px] text-slate-400">
                Maksimal 3 Panggilan
              </span>
            </div>

            {callHistory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3.5 py-3 text-xs text-slate-400">
                Belum ada riwayat panggilan.
              </div>
            ) : (
              <div className="space-y-2">
                {callHistory.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2 text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-[#008ba6]">
                        {log.nomorAntrean}
                      </span>
                      <span className="ml-2 font-semibold text-slate-700">
                        {log.namaPasien}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {log.loketNama}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-500 tabular-nums">
                      {log.waktuPanggil}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}