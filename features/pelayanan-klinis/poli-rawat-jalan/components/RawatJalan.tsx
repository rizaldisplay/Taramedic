/* eslint-disable react-hooks/purity */
'use client';

import React, { useMemo, useState } from 'react';
import {
  Users,
  Check,
  Clock,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ClipboardList,
  User,
  Megaphone,
  X,
  Volume2,
  CheckCircle2,
  SkipForward,
} from 'lucide-react';

export type PoliQueueStatus = 'menunggu' | 'dipanggil' | 'lewati' | 'selesai';
export type QueueTabFilter = 'semua' | 'menunggu' | 'dipanggil' | 'lewati';
export type QueueSortBy = 'waktu_asc' | 'waktu_desc' | 'nomor_asc';

export interface PoliQueueItem {
  id: string;
  nomorAntrean: string;
  namaPasien: string;
  nomorRM: string;
  jenisKelamin?: 'L' | 'P';
  usia?: string;
  penjamin?: 'BPJS' | 'Umum' | 'Asuransi';
  poliId: string;
  namaPoli?: string;
  status: PoliQueueStatus;
  waktuDaftar: string;
  estimasiTunggu?: string;
}

export interface PoliRoomOption {
  id: string;
  nama: string;
  dokter?: string;
}

const DEFAULT_ROOMS: PoliRoomOption[] = [
  { id: 'POLI-UMUM-1', nama: 'Poli Umum 1', dokter: 'dr. Andi Pratama' },
  { id: 'POLI-ANAK-1', nama: 'Poli Anak', dokter: 'dr. Siti Rahmawati, Sp.A' },
  { id: 'POLI-GIGI-1', nama: 'Poli Gigi', dokter: 'drg. Budi Santoso' },
  {
    id: 'POLI-PD-1',
    nama: 'Poli Penyakit Dalam',
    dokter: 'dr. Hendra Wijaya, Sp.PD',
  },
];

const STATUS_BADGE_MAP: Record<
  PoliQueueStatus,
  { label: string; className: string }
> = {
  menunggu: {
    label: 'Menunggu',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  dipanggil: {
    label: 'Dipanggil',
    className: 'bg-cyan-50 text-[#008ba6] border-cyan-200',
  },
  lewati: {
    label: 'Dilewati',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  selesai: {
    label: 'Selesai',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

export default function AntreanPoliDashboard({
  initialQueue = [],
  rooms = DEFAULT_ROOMS,
  avgServiceMinutes = 10,
  onCallNext,
  onRecallPatient,
  onCompletePatient,
  onSkipPatient,
}: {
  initialQueue?: PoliQueueItem[];
  rooms?: PoliRoomOption[];
  avgServiceMinutes?: number;
  onCallNext?: (patient: PoliQueueItem, roomId: string) => void;
  onRecallPatient?: (patient: PoliQueueItem, roomId: string) => void;
  onCompletePatient?: (patient: PoliQueueItem) => void;
  onSkipPatient?: (patient: PoliQueueItem) => void;
}) {
  const [queueList, setQueueList] = useState<PoliQueueItem[]>(initialQueue);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<QueueTabFilter>('semua');
  const [penjaminFilter, setPenjaminFilter] = useState<string>('all');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [sortBy, setSortBy] = useState<QueueSortBy>('waktu_asc');
  const [showSortPopover, setShowSortPopover] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  // Ringkasan KPI Atas
  const metrics = useMemo(() => {
    const total = queueList.length;
    const selesai = queueList.filter((q) => q.status === 'selesai').length;
    const activeRemaining = queueList.filter(
      (q) => q.status === 'menunggu' || q.status === 'dipanggil',
    ).length;

    if (activeRemaining === 0) {
      return {
        total,
        selesai,
        estimasiLabel: 'Selesai',
        estimasiSubtext: 'Tidak ada antrean menunggu atau dilayani',
      };
    }

    const totalMinutes = activeRemaining * avgServiceMinutes;
    const finishTime = new Date(Date.now() + totalMinutes * 60_000);
    const formattedFinish = finishTime
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace('.', ':');

    return {
      total,
      selesai,
      estimasiLabel: `${formattedFinish} WIB`,
      estimasiSubtext: `Estimasi ±${totalMinutes} menit (${activeRemaining} pasien)`,
    };
  }, [queueList, avgServiceMinutes]);

  // Jumlah badge per tab status
  const tabCounts = useMemo(() => {
    const semua = queueList.filter((q) => q.status !== 'selesai').length;
    const menunggu = queueList.filter((q) => q.status === 'menunggu').length;
    const dipanggil = queueList.filter((q) => q.status === 'dipanggil').length;
    const lewati = queueList.filter((q) => q.status === 'lewati').length;
    return { semua, menunggu, dipanggil, lewati };
  }, [queueList]);

  // Pasien yang sedang dipanggil pada ruang poli aktif
  const activeCalledPatient = useMemo(() => {
    if (!selectedRoomId) {
      return queueList.find((q) => q.status === 'dipanggil') ?? null;
    }
    return (
      queueList.find(
        (q) => q.status === 'dipanggil' && q.poliId === selectedRoomId,
      ) ?? null
    );
  }, [queueList, selectedRoomId]);

  // Filter & Sorting tabel antrean
  const filteredQueue = useMemo(() => {
    const filtered = queueList.filter((item) => {
      if (selectedRoomId && item.poliId !== selectedRoomId) return false;

      if (activeTab === 'semua' && item.status === 'selesai') return false;
      if (activeTab !== 'semua' && item.status !== activeTab) return false;

      if (penjaminFilter !== 'all' && item.penjamin !== penjaminFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.namaPasien.toLowerCase().includes(q) ||
          item.nomorRM.toLowerCase().includes(q) ||
          item.nomorAntrean.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'nomor_asc') {
        return a.nomorAntrean.localeCompare(b.nomorAntrean);
      }
      if (sortBy === 'waktu_desc') {
        return b.waktuDaftar.localeCompare(a.waktuDaftar);
      }
      return a.waktuDaftar.localeCompare(b.waktuDaftar);
    });
  }, [queueList, selectedRoomId, activeTab, penjaminFilter, searchQuery, sortBy]);

  // Aksi Panggil Antrean Berikutnya
  const handleCallNext = () => {
    if (!selectedRoomId) return;

    const nextCandidate = queueList.find(
      (q) =>
        (q.status === 'menunggu' || q.status === 'lewati') &&
        (!q.poliId || q.poliId === selectedRoomId),
    );

    if (!nextCandidate) return;

    setQueueList((prev) =>
      prev.map((item) => {
        if (item.status === 'dipanggil' && item.poliId === selectedRoomId) {
          return { ...item, status: 'selesai' };
        }
        if (item.id === nextCandidate.id) {
          return { ...item, status: 'dipanggil', poliId: selectedRoomId };
        }
        return item;
      }),
    );

    onCallNext?.(nextCandidate, selectedRoomId);
  };

  const handleCompleteCurrent = () => {
    if (!activeCalledPatient) return;
    setQueueList((prev) =>
      prev.map((item) =>
        item.id === activeCalledPatient.id
          ? { ...item, status: 'selesai' }
          : item,
      ),
    );
    onCompletePatient?.(activeCalledPatient);
  };

  const handleSkipCurrent = () => {
    if (!activeCalledPatient) return;
    setQueueList((prev) =>
      prev.map((item) =>
        item.id === activeCalledPatient.id
          ? { ...item, status: 'lewati' }
          : item,
      ),
    );
    onSkipPatient?.(activeCalledPatient);
  };

  const TABS: { key: QueueTabFilter; label: string }[] = [
    { key: 'semua', label: 'Semua' },
    { key: 'menunggu', label: 'Menunggu' },
    { key: 'dipanggil', label: 'Dipanggil' },
    { key: 'lewati', label: 'Lewati' },
  ];

  return (
    <div className="w-full h-full font-sans text-slate-700">
      {/* 1. BARIS KARTU STATISTIK ATAS (3 KOLOM) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Card 1: Total Antrean */}
        <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#e6f6fa] border border-cyan-100 text-[#008ba6] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Total Antrean
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-[#0f3d56] tabular-nums leading-none">
                {metrics.total}
              </span>
              <span className="text-xs font-medium text-slate-500">Pasien</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Hari Ini</p>
          </div>
        </div>

        {/* Card 2: Sudah Dilayani */}
        <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Sudah Dilayani
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-[#0f3d56] tabular-nums leading-none">
                {metrics.selesai}
              </span>
              <span className="text-xs font-medium text-slate-500">Pasien</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Hari Ini</p>
          </div>
        </div>

        {/* Card 3: Estimasi Selesai */}
        <div className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Estimasi Selesai
            </p>
            <p className="text-xl sm:text-[22px] font-extrabold text-[#0f3d56] leading-tight mt-0.5">
              {metrics.estimasiLabel}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {metrics.estimasiSubtext}
            </p>
          </div>
        </div>
      </div>

      {/* 2. KONTEN UTAMA: DAFTAR ANTREAN POLI (KIRI) & PANEL PANGGILAN (KANAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">
        {/* KOLOM KIRI: DAFTAR ANTREAN POLI */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header Section */}
          <div className="px-5 pt-5 pb-4 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-[17px] font-bold text-[#0f3d56]">
                Daftar Antrean Poli
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pasien Terdaftar untuk Pelayanan Hari Ini
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {filteredQueue.length} Pasien Ditampilkan
            </span>
          </div>

          {/* Baris Pencarian, Filter & Urutkan */}
          <div className="px-5 pb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Nama Pasien, No. RM..."
                className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tombol Filter & Urutkan */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowFilterPopover((prev) => !prev);
                    setShowSortPopover(false);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    penjaminFilter !== 'all'
                      ? 'border-[#009bb8] bg-[#f0f9fb] text-[#008ba6]'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>

                {showFilterPopover && (
                  <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-20 text-xs">
                    <p className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400">
                      Penjamin
                    </p>
                    {(['all', 'BPJS', 'Umum', 'Asuransi'] as const).map(
                      (opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setPenjaminFilter(opt);
                            setShowFilterPopover(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            penjaminFilter === opt
                              ? 'bg-[#f0f9fb] text-[#008ba6] font-bold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {opt === 'all' ? 'Semua Penjamin' : opt}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* Urutkan Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowSortPopover((prev) => !prev);
                    setShowFilterPopover(false);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                >
                  <span>Urutkan</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showSortPopover && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-20 text-xs">
                    {[
                      { key: 'waktu_asc', label: 'Waktu Daftar (Terlama)' },
                      { key: 'waktu_desc', label: 'Waktu Daftar (Terbaru)' },
                      { key: 'nomor_asc', label: 'Nomor Antrean (A-Z)' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.key as QueueSortBy);
                          setShowSortPopover(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          sortBy === opt.key
                            ? 'bg-[#f0f9fb] text-[#008ba6] font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sub-Tabs Status Antrean */}
          <div
            role="tablist"
            aria-label="Filter Status Antrean Poli"
            className="px-5 border-b border-slate-200/80 flex items-center gap-6 overflow-x-auto"
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
                  onClick={() => setActiveTab(tab.key)}
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

          {/* Tabel Daftar Antrean Poli */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">NO. ANTREAN</th>
                  <th className="px-4 py-3">PASIEN</th>
                  <th className="px-4 py-3">INFO PASIEN</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">WAKTU DAFTAR</th>
                  <th className="px-5 py-3">ESTIMASI TUNGGU</th>
                </tr>
              </thead>

              {filteredQueue.length > 0 && (
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredQueue.map((item) => {
                    const badge = STATUS_BADGE_MAP[item.status];
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/90 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-extrabold text-[#0f3d56]">
                          {item.nomorAntrean}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-800">
                            {item.namaPasien}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            RM: {item.nomorRM}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          <span>
                            {item.jenisKelamin || '-'} · {item.usia || '-'}
                          </span>
                          {item.penjamin && (
                            <span className="ml-2 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                              {item.penjamin}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 tabular-nums">
                          {item.waktuDaftar}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 font-medium">
                          {item.estimasiTunggu || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>

          {/* Empty State Tabel */}
          {filteredQueue.length === 0 && (
            <div className="min-h-[340px] flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mb-3.5">
                <ClipboardList className="w-6 h-6 stroke-[1.75]" />
              </div>
              <p className="text-sm font-bold text-[#0f3d56]">
                Belum ada antrean poli.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Antrean pasien Poli akan tampil di sini.
              </p>
            </div>
          )}
        </section>

        {/* KOLOM KANAN: PANEL PANGGILAN PASIEN */}
        <aside className="bg-white rounded-xl border border-slate-200/90 border-t-[3px] border-t-[#009bb8] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          {/* Status Pasien Sedang Dipanggil */}
          {!activeCalledPatient ? (
            <div className="flex flex-col items-center justify-center text-center pt-3 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 flex items-center justify-center text-[#008ba6] mb-2.5">
                <User className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-bold text-[#0f3d56]">
                Belum Ada Pasien Dipanggil
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Panggil antrean berikutnya untuk memulai layanan.
              </p>
            </div>
          ) : (
            <div className="text-center pt-2 pb-5 border-b border-slate-100">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f0f9fb] border border-cyan-200/70 text-[#008ba6] text-[10px] font-bold uppercase tracking-wider">
                Sedang Dilayani
              </span>
              <div className="text-4xl font-black text-[#008ba6] tracking-tight my-2 tabular-nums">
                {activeCalledPatient.nomorAntrean}
              </div>
              <p className="text-sm font-bold text-[#0f3d56]">
                {activeCalledPatient.namaPasien}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No. RM: {activeCalledPatient.nomorRM}
              </p>

              {/* Tombol Kontrol Pasien Aktif */}
              <div className="grid grid-cols-3 gap-1.5 mt-4">
                <button
                  type="button"
                  onClick={() =>
                    onRecallPatient?.(activeCalledPatient, selectedRoomId)
                  }
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-[#f0f9fb] hover:border-[#009bb8]/40 text-[11px] font-semibold text-slate-700 hover:text-[#008ba6] transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#008ba6]" />
                  <span>Panggil</span>
                </button>
                <button
                  type="button"
                  onClick={handleSkipCurrent}
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-amber-50 text-[11px] font-semibold text-amber-700 transition-colors cursor-pointer"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Lewati</span>
                </button>
                <button
                  type="button"
                  onClick={handleCompleteCurrent}
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-[11px] font-semibold text-white transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selesai</span>
                </button>
              </div>
            </div>
          )}

          {/* Pilihan Ruang Poli Aktif & Tombol Panggil */}
          <div className="pt-4">
            <label
              htmlFor="ruang-poli-aktif"
              className="block text-xs font-bold text-slate-600 mb-2"
            >
              Ruang Poli Aktif
            </label>
            <div className="relative mb-3.5">
              <select
                id="ruang-poli-aktif"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-xs sm:text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
              >
                <option value="">Pilih Ruang Poli</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.nama}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              disabled={!selectedRoomId}
              onClick={handleCallNext}
              className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-[13px] font-semibold transition-all ${
                !selectedRoomId
                  ? 'bg-[#86cbd8] text-white cursor-not-allowed'
                  : 'bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white shadow-xs cursor-pointer'
              }`}
            >
              <Megaphone className="w-4 h-4 shrink-0" />
              <span>
                {!selectedRoomId
                  ? 'Pilih Ruang Poli Terlebih Dahulu'
                  : 'Panggil Antrean Berikutnya'}
              </span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}