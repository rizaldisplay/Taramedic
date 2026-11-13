'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  History,
  MapPin,
  Megaphone,
  Pill,
  Search,
  User,
  Volume2,
  X,
} from 'lucide-react';

export type PharmacyQueueStatus =
  | 'baru'
  | 'dipanggil'
  | 'diproses'
  | 'siap_diserahkan'
  | 'selesai';

export type PharmacyTabFilter = 'semua' | PharmacyQueueStatus;

export interface PharmacyQueueItem {
  id: string;
  nomorAntrean: string;
  nomorResep: string;
  namaPasien: string;
  noRM: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  usia: string;
  penjamin: 'Umum' | 'BPJS' | 'Asuransi';
  noKunjungan: string;
  poli: string;
  dokter: string;
  waktuDiterima: string;
  tanggalDiterima: string;
  jumlahItem: number;
  status: PharmacyQueueStatus;
  loketDipanggil?: string;
}

export interface PharmacyCounterOption {
  id: string;
  nama: string;
}

const DEFAULT_COUNTERS: PharmacyCounterOption[] = [
  { id: 'LOKET-1', nama: 'Loket 1 - Obat Non-Racikan' },
  { id: 'LOKET-2', nama: 'Loket 2 - Obat Racikan' },
  { id: 'LOKET-3', nama: 'Loket 3 - BPJS & Prioritas' },
];

const DEFAULT_PRESCRIPTION_QUEUE: PharmacyQueueItem[] = [
  {
    id: 'rx-1',
    nomorAntrean: 'B002',
    nomorResep: 'RX-20261109-0003',
    namaPasien: 'Suparna',
    noRM: 'RM00000002',
    jenisKelamin: 'Laki-laki',
    usia: '36 th',
    penjamin: 'Umum',
    noKunjungan: 'KJ-20261109-000003',
    poli: 'Poli Umum',
    dokter: 'dr. Altharrazka Kenigara Rizfan',
    waktuDiterima: '18:53 WIB',
    tanggalDiterima: '09 Nov 2026',
    jumlahItem: 1,
    status: 'baru',
  },
];

const STATUS_META: Record<
  PharmacyQueueStatus,
  {
    label: string;
    pillClass: string;
    callStatusText: string;
  }
> = {
  baru: {
    label: 'Baru',
    pillClass: 'bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6]',
    callStatusText: 'Belum dipanggil',
  },
  dipanggil: {
    label: 'Dipanggil',
    pillClass: 'bg-amber-50 border border-amber-200 text-amber-700',
    callStatusText: 'Sedang dipanggil',
  },
  diproses: {
    label: 'Diproses',
    pillClass: 'bg-sky-50 border border-sky-200 text-sky-700',
    callStatusText: 'Sedang diracik / disiapkan',
  },
  siap_diserahkan: {
    label: 'Siap diserahkan',
    pillClass: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
    callStatusText: 'Siap diserahkan ke pasien',
  },
  selesai: {
    label: 'Selesai',
    pillClass: 'bg-slate-100 border border-slate-200 text-slate-600',
    callStatusText: 'Selesai diserahkan',
  },
};

export default function DaftarAntreanResep({
  initialQueue = DEFAULT_PRESCRIPTION_QUEUE,
  counters = DEFAULT_COUNTERS,
  onCallQueue,
  onStartProcessPrescription,
}: {
  initialQueue?: PharmacyQueueItem[];
  counters?: PharmacyCounterOption[];
  onCallQueue?: (item: PharmacyQueueItem, counter: PharmacyCounterOption) => void;
  onStartProcessPrescription?: (item: PharmacyQueueItem) => void;
}) {
  const [queueList, setQueueList] =
    useState<PharmacyQueueItem[]>(initialQueue);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<PharmacyTabFilter>('semua');
  const [selectedQueueId, setSelectedQueueId] = useState<string>(
    initialQueue[0]?.id ?? '',
  );
  const [selectedLoketId, setSelectedLoketId] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Hitung badge per tab status
  const tabCounts = useMemo(() => {
    const semua = queueList.filter((q) => q.status !== 'selesai').length;
    const baru = queueList.filter((q) => q.status === 'baru').length;
    const dipanggil = queueList.filter((q) => q.status === 'dipanggil').length;
    const diproses = queueList.filter((q) => q.status === 'diproses').length;
    const siap_diserahkan = queueList.filter(
      (q) => q.status === 'siap_diserahkan',
    ).length;
    const selesai = queueList.filter((q) => q.status === 'selesai').length;

    return {
      semua,
      baru,
      dipanggil,
      diproses,
      siap_diserahkan,
      selesai,
    };
  }, [queueList]);

  // Filter tabel berdasarkan tab & pencarian
  const filteredQueue = useMemo(() => {
    return queueList.filter((item) => {
      if (activeTab === 'semua' && item.status === 'selesai') return false;
      if (activeTab !== 'semua' && item.status !== activeTab) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.namaPasien.toLowerCase().includes(q) ||
          item.nomorAntrean.toLowerCase().includes(q) ||
          item.nomorResep.toLowerCase().includes(q) ||
          item.noRM.toLowerCase().includes(q) ||
          item.noKunjungan.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [queueList, activeTab, searchQuery]);

  // Pagination
  const totalItems = filteredQueue.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedQueue = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredQueue.slice(startIdx, startIdx + pageSize);
  }, [filteredQueue, safePage, pageSize]);

  const startItemNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItemNumber = Math.min(safePage * pageSize, totalItems);

  // Item aktif pada panel Kontroler Pemanggil Farmasi (kanan)
  const activePrescription = useMemo(() => {
    return (
      queueList.find((q) => q.id === selectedQueueId) ??
      queueList.find((q) => q.status !== 'selesai') ??
      null
    );
  }, [queueList, selectedQueueId]);

  // Daftar panggilan selesai terakhir (maks. 3 panggilan)
  const recentCompletedCalls = useMemo(() => {
    return queueList.filter((q) => q.status === 'selesai').slice(0, 3);
  }, [queueList]);

  // Antrean berikutnya yang siap dipanggil
  const nextWaitingPatient = useMemo(() => {
    return (
      queueList.find(
        (q) =>
          q.id !== activePrescription?.id &&
          (q.status === 'baru' || q.status === 'siap_diserahkan'),
      ) ?? null
    );
  }, [queueList, activePrescription]);

  const selectedCounter = useMemo(
    () => counters.find((c) => c.id === selectedLoketId) ?? null,
    [counters, selectedLoketId],
  );

  const handleCallQueue = () => {
    if (!activePrescription || !selectedCounter) return;

    const updatedItem: PharmacyQueueItem = {
      ...activePrescription,
      status: 'dipanggil',
      loketDipanggil: selectedCounter.nama,
    };

    setQueueList((prev) =>
      prev.map((item) =>
        item.id === activePrescription.id ? updatedItem : item,
      ),
    );

    onCallQueue?.(updatedItem, selectedCounter);
  };

  const handleStartProcess = (item: PharmacyQueueItem) => {
    const updatedItem: PharmacyQueueItem = {
      ...item,
      status: 'diproses',
    };

    setSelectedQueueId(item.id);
    setQueueList((prev) =>
      prev.map((q) => (q.id === item.id ? updatedItem : q)),
    );

    onStartProcessPrescription?.(updatedItem);
  };

  const TABS: { key: PharmacyTabFilter; label: string }[] = [
    { key: 'semua', label: 'Semua' },
    { key: 'baru', label: 'Baru' },
    { key: 'dipanggil', label: 'Dipanggil' },
    { key: 'diproses', label: 'Diproses' },
    { key: 'siap_diserahkan', label: 'Siap diserahkan' },
    { key: 'selesai', label: 'Selesai' },
  ];

  const activeStatusMeta = activePrescription
    ? STATUS_META[activePrescription.status]
    : null;

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 items-start">
        {/* KOLOM KIRI: DAFTAR ANTREAN RESEP */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header Section */}
          <div className="px-5 pt-5 pb-4 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-[17px] font-bold text-[#0f3d56]">
                Daftar Antrean Resep
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Resep Pasien yang Menunggu Pelayanan Farmasi
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {totalItems} Resep Ditampilkan
            </span>
          </div>

          {/* Search Bar */}
          <div className="px-5 pb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari Pasien, Nomor Antrean, atau RM..."
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sub-Tabs Status Resep */}
          <div
            role="tablist"
            aria-label="Filter Status Antrean Resep"
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

          {/* Tabel Daftar Antrean Resep */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[820px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">ANTREAN / RESEP</th>
                  <th className="px-4 py-3">PASIEN</th>
                  <th className="px-4 py-3">NO. KUNJUNGAN</th>
                  <th className="px-4 py-3">POLI / DOKTER</th>
                  <th className="px-4 py-3">WAKTU DITERIMA</th>
                  <th className="px-4 py-3">ITEM</th>
                  <th className="px-5 py-3 text-center">STATUS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedQueue.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-14 px-4 text-center text-slate-500"
                    >
                      Tidak ada antrean resep yang sesuai dengan pencarian atau
                      filter.
                    </td>
                  </tr>
                ) : (
                  paginatedQueue.map((item) => {
                    const isSelected = activePrescription?.id === item.id;
                    const statusBadge = STATUS_META[item.status];

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedQueueId(item.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#f0f9fb]/50 border-l-[3px] border-l-[#009bb8]'
                            : 'hover:bg-slate-50/90'
                        }`}
                      >
                        {/* Antrean / Resep + Tombol Pilih Proses */}
                        <td className="px-5 py-4 align-top whitespace-nowrap">
                          <p className="text-sm font-extrabold text-[#008ba6] leading-tight">
                            {item.nomorAntrean}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {item.nomorResep}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQueueId(item.id);
                            }}
                            className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-200/90 bg-white hover:bg-[#f0f9fb] text-[11px] font-bold text-[#008ba6] shadow-2xs transition-colors cursor-pointer"
                          >
                            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                            <span>Pilih proses</span>
                          </button>
                        </td>

                        {/* Pasien */}
                        <td className="px-4 py-4 align-top whitespace-nowrap">
                          <p className="font-bold text-slate-800">
                            {item.namaPasien}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {item.noRM}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {item.jenisKelamin} · {item.usia} · {item.penjamin}
                          </p>
                        </td>

                        {/* No. Kunjungan */}
                        <td className="px-4 py-4 align-middle font-bold text-[#008ba6] whitespace-nowrap">
                          {item.noKunjungan}
                        </td>

                        {/* Poli / Dokter */}
                        <td className="px-4 py-4 align-top whitespace-nowrap">
                          <p className="font-bold text-slate-800">
                            {item.poli}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {item.dokter}
                          </p>
                        </td>

                        {/* Waktu Diterima */}
                        <td className="px-4 py-4 align-top whitespace-nowrap">
                          <p className="font-bold text-slate-800 tabular-nums">
                            {item.waktuDiterima}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {item.tanggalDiterima}
                          </p>
                        </td>

                        {/* Item */}
                        <td className="px-4 py-4 align-middle font-semibold text-slate-700 whitespace-nowrap">
                          {item.jumlahItem} item
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 align-middle text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusBadge.pillClass}`}
                          >
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
            <div className="flex flex-wrap items-center gap-3">
              <span>
                <strong className="font-semibold text-slate-700">
                  {startItemNumber}–{endItemNumber}
                </strong>{' '}
                dari{' '}
                <strong className="font-semibold text-slate-700">
                  {totalItems}
                </strong>{' '}
                Resep
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="per-halaman-resep">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-resep"
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

        {/* KOLOM KANAN: ANTREAN SAAT INI & KONTROLER PEMANGGIL FARMASI */}
        <aside className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          {/* Header Panel Kanan */}
          <div className="flex items-center gap-2 mb-3.5">
            <Clock className="w-4 h-4 text-[#008ba6] shrink-0" />
            <h2 className="text-sm sm:text-[15px] font-bold text-[#0f3d56]">
              Antrean Saat Ini
            </h2>
          </div>

          {activePrescription && activeStatusMeta ? (
            <>
              {/* Label Kontroler & Status Pill */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  KONTROLER PEMANGGIL FARMASI
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${activeStatusMeta.pillClass}`}
                >
                  {activeStatusMeta.label}
                </span>
              </div>

              {/* Nomor Antrean Besar */}
              <div className="text-2xl sm:text-[26px] font-extrabold text-[#008ba6] tracking-tight mt-1 tabular-nums">
                {activePrescription.nomorAntrean}
              </div>

              {/* Info Pasien & Avatar */}
              <div className="flex items-start justify-between gap-3 mt-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0f3d56] truncate">
                    {activePrescription.namaPasien}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activePrescription.noRM} · {activePrescription.jenisKelamin}
                    , {activePrescription.usia}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activePrescription.penjamin} · {activePrescription.poli}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 stroke-[1.8]" />
                </div>
              </div>

              {/* Kotak Ringkasan Resep */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 mt-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-[#008ba6]" />
                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                      RINGKASAN RESEP
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">
                    {activeStatusMeta.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2.5">
                  <div>
                    <p className="text-[11px] text-slate-400">Nomor resep</p>
                    <p className="text-xs font-bold text-[#0f3d56] mt-0.5">
                      {activePrescription.nomorResep}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Jumlah item</p>
                    <p className="text-xs font-bold text-[#0f3d56] mt-0.5">
                      {activePrescription.jumlahItem} item
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Panggilan */}
              <div className="flex items-center gap-2 mt-3.5 text-xs font-bold text-slate-600">
                <Volume2 className="w-4 h-4 text-[#008ba6] shrink-0" />
                <span>{activeStatusMeta.callStatusText}</span>
              </div>

              {/* Tombol Mulai Proses Resep */}
              <button
                type="button"
                onClick={() => handleStartProcess(activePrescription)}
                className={`w-full mt-2.5 py-2.5 px-4 rounded-xl text-xs sm:text-[13px] font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  activePrescription.status === 'baru'
                    ? 'bg-slate-100 hover:bg-slate-200/70 text-slate-500'
                    : 'bg-[#f0f9fb] hover:bg-cyan-100/70 border border-cyan-200/80 text-[#008ba6]'
                }`}
              >
                <Pill className="w-4 h-4" />
                <span>Mulai proses resep</span>
              </button>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs text-slate-400">
              Belum ada antrean resep aktif dipilih.
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-slate-100 my-4" />

          {/* Loket Farmasi */}
          <div>
            <label
              htmlFor="pilih-loket-farmasi"
              className="flex items-center gap-1.5 text-xs font-bold text-[#0f3d56] mb-2"
            >
              <MapPin className="w-4 h-4 text-[#008ba6]" />
              <span>Loket Farmasi</span>
            </label>

            <div className="relative">
              <select
                id="pilih-loket-farmasi"
                value={selectedLoketId}
                onChange={(e) => setSelectedLoketId(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs sm:text-[13px] font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
              >
                <option value="">Pilih Loket Farmasi</option>
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
          <div className="border-t border-slate-100 my-4" />

          {/* Panggilan Terakhir */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#008ba6]" />
                <span className="text-xs font-bold text-[#0f3d56]">
                  Panggilan Terakhir
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Maks. 3 panggilan
              </span>
            </div>

            {recentCompletedCalls.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3.5 py-3 text-xs text-slate-400">
                Belum ada panggilan selesai hari ini.
              </div>
            ) : (
              <div className="space-y-2">
                {recentCompletedCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2 text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-[#008ba6]">
                        {call.nomorAntrean}
                      </span>
                      <span className="ml-2 font-semibold text-slate-700">
                        {call.namaPasien}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {call.waktuDiterima}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-4" />

          {/* BERIKUTNYA */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#0f3d56] mb-2.5">
              BERIKUTNYA
            </p>

            {!nextWaitingPatient ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3.5 py-3 text-xs text-slate-400">
                Belum ada pasien lain yang siap dipanggil.
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedQueueId(nextWaitingPatient.id)}
                className="w-full text-left rounded-xl border border-slate-200/90 hover:border-[#009bb8]/50 bg-[#f8fafc] hover:bg-[#f0f9fb]/60 px-3.5 py-2.5 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs font-extrabold text-[#008ba6]">
                    {nextWaitingPatient.nomorAntrean} ·{' '}
                    <span className="text-[#0f3d56]">
                      {nextWaitingPatient.namaPasien}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {nextWaitingPatient.nomorResep} ·{' '}
                    {nextWaitingPatient.jumlahItem} item
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#008ba6]" />
              </button>
            )}
          </div>

          {/* Tombol Utama Panggil Antrean */}
          <button
            type="button"
            disabled={!selectedLoketId || !activePrescription}
            onClick={handleCallQueue}
            className={`w-full mt-4 py-3 px-4 rounded-xl text-xs sm:text-[13px] font-bold inline-flex items-center justify-center gap-2 transition-all ${
              !selectedLoketId || !activePrescription
                ? 'bg-[#86cbd8] text-white cursor-not-allowed'
                : 'bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white shadow-xs cursor-pointer'
            }`}
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>Panggil Antrean</span>
          </button>

          <p className="text-[11px] text-slate-500 mt-2">
            {!selectedLoketId
              ? 'Pilih loket Farmasi sebelum memanggil antrean.'
              : `Siap memanggil ${activePrescription?.nomorAntrean ?? ''} ke ${selectedCounter?.nama}.`}
          </p>
        </aside>
      </div>
    </div>
  );
}