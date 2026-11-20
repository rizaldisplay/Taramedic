'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  X,
} from 'lucide-react';

export type ProcurementRequestStatus =
  | 'draft'
  | 'menunggu_tinjauan'
  | 'disetujui'
  | 'ditolak'
  | 'dikonversi_po';

export type ProcurementPriority = 'Normal' | 'Tinggi' | 'Urgent';

export interface ProcurementRequestItemDetail {
  id: string;
  namaItem: string;
  satuan: string;
  diminta: number;
  diterima: number;
  dialokasikan: number;
}

export interface ProcurementActivityLog {
  id: string;
  tipe: 'draft' | 'diajukan' | 'disetujui' | 'po';
  judul: string;
  waktu: string;
  aktor: string;
  deskripsi: string;
  catatanKeputusan?: string;
}

export interface ProcurementRequestItem {
  id: string;
  nomorPermintaan: string;
  jumlahItem: number;
  pemasok?: string;
  dibutuhkanUntuk: string | null;
  gudang: string;
  tanggalLabel: string;
  prioritas: ProcurementPriority;
  dibutuhkanPada: string | null;
  status: ProcurementRequestStatus;
  catatanUmum?: string;
  items: ProcurementRequestItemDetail[];
  riwayat: ProcurementActivityLog[];
}

const STATUS_META: Record<
  ProcurementRequestStatus,
  { label: string; pillClass: string }
> = {
  draft: {
    label: 'Draf',
    pillClass: 'bg-slate-100 border border-slate-200/80 text-slate-600',
  },
  menunggu_tinjauan: {
    label: 'Menunggu Tinjauan',
    pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  disetujui: {
    label: 'Disetujui',
    pillClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  ditolak: {
    label: 'Ditolak',
    pillClass: 'bg-rose-50 border border-rose-200/80 text-rose-600',
  },
  dikonversi_po: {
    label: 'Jadi PO',
    pillClass: 'bg-[#edf7fc] border border-[#b8e6ef] text-[#008ba6]',
  },
};

const DEFAULT_REQUESTS: ProcurementRequestItem[] = [
  {
    id: 'pr-1',
    nomorPermintaan: 'PR-20261029-3F278ECB',
    jumlahItem: 1,
    pemasok: 'PT. Alkesindo Farma Tara',
    dibutuhkanUntuk: null,
    gudang: 'Depo Farmasi',
    tanggalLabel: '29 Okt 2026',
    prioritas: 'Normal',
    dibutuhkanPada: null,
    status: 'disetujui',
    catatanUmum: 'asfaddsfafd',
    items: [
      {
        id: 'itm-1',
        namaItem: 'Amoxicillin 500 mg Kapsul',
        satuan: 'Kapsul',
        diminta: 1,
        diterima: 0,
        dialokasikan: 0,
      },
    ],
    riwayat: [
      {
        id: 'act-1',
        tipe: 'draft',
        judul: 'Draf permintaan dibuat',
        waktu: '29 Okt 2026 20:17:05 WIB',
        aktor: 'Pengguna tidak ditemukan',
        deskripsi: 'Permintaan dicatat sebagai draf.',
      },
      {
        id: 'act-2',
        tipe: 'diajukan',
        judul: 'Permintaan diajukan',
        waktu: '29 Okt 2026 20:17:08 WIB',
        aktor: 'Pengguna tidak ditemukan',
        deskripsi: 'Permintaan dikirim untuk ditinjau.',
      },
      {
        id: 'act-3',
        tipe: 'disetujui',
        judul: 'Permintaan disetujui',
        waktu: '29 Okt 2026 20:17:13 WIB',
        aktor: 'Pengguna tidak ditemukan',
        deskripsi: 'Keputusan dicatat.',
        catatanKeputusan: 'xXsdffssdfdt',
      },
    ],
  },
  {
    id: 'pr-2',
    nomorPermintaan: 'PR-20261029-69D9AF16',
    jumlahItem: 1,
    pemasok: 'Novala',
    dibutuhkanUntuk: 'stok',
    gudang: 'Depo Farmasi',
    tanggalLabel: '29 Okt 2026',
    prioritas: 'Normal',
    dibutuhkanPada: null,
    status: 'disetujui',
    catatanUmum: 'Penambahan stok rutin harian.',
    items: [
      {
        id: 'itm-2',
        namaItem: 'Paracetamol 500 mg Tablet',
        satuan: 'Tablet',
        diminta: 100,
        diterima: 0,
        dialokasikan: 0,
      },
    ],
    riwayat: [
      {
        id: 'act-21',
        tipe: 'draft',
        judul: 'Draf permintaan dibuat',
        waktu: '29 Okt 2026 09:10:00 WIB',
        aktor: 'Apt. Dwi Lestari',
        deskripsi: 'Permintaan dicatat sebagai draf.',
      },
      {
        id: 'act-22',
        tipe: 'disetujui',
        judul: 'Permintaan disetujui',
        waktu: '29 Okt 2026 10:05:22 WIB',
        aktor: 'Kepala Farmasi',
        deskripsi: 'Keputusan dicatat.',
      },
    ],
  },
  {
    id: 'pr-3',
    nomorPermintaan: 'PR-20261010-EEB41C60',
    jumlahItem: 2,
    pemasok: 'PT. Alkesindo Farma Tara',
    dibutuhkanUntuk: 'Supply Klinik',
    gudang: 'Depo Farmasi',
    tanggalLabel: '10 Okt 2026',
    prioritas: 'Normal',
    dibutuhkanPada: null,
    status: 'disetujui',
    catatanUmum: 'Kebutuhan perlengkapan medis poli.',
    items: [
      {
        id: 'itm-3a',
        namaItem: 'Kasa Steril 16x16 cm',
        satuan: 'Box',
        diminta: 10,
        diterima: 0,
        dialokasikan: 0,
      },
      {
        id: 'itm-3b',
        namaItem: 'Alkohol Swab 70%',
        satuan: 'Box',
        diminta: 5,
        diterima: 0,
        dialokasikan: 0,
      },
    ],
    riwayat: [
      {
        id: 'act-31',
        tipe: 'draft',
        judul: 'Draf permintaan dibuat',
        waktu: '10 Okt 2026 08:30:12 WIB',
        aktor: 'Staf Logistik',
        deskripsi: 'Permintaan dicatat sebagai draf.',
      },
      {
        id: 'act-32',
        tipe: 'disetujui',
        judul: 'Permintaan disetujui',
        waktu: '10 Okt 2026 11:15:40 WIB',
        aktor: 'Kepala Klinik',
        deskripsi: 'Keputusan dicatat.',
      },
    ],
  },
];

function formatDateIndoShort(date: Date): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agt',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  const d = String(date.getDate()).padStart(2, '0');
  const m = months[date.getMonth()] ?? 'Nov';
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

function formatDateTimeWib(date: Date): string {
  const base = formatDateIndoShort(date);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${base} ${hh}:${mm}:${ss} WIB`;
}

export default function PermintaanPengadaan({
  initialRequests = DEFAULT_REQUESTS,
  onReload,
  onCreateRequest,
  onCreatePoFromRequest,
}: {
  initialRequests?: ProcurementRequestItem[];
  onReload?: () => Promise<void> | void;
  onCreateRequest?: (request: ProcurementRequestItem) => void;
  onCreatePoFromRequest?: (request: ProcurementRequestItem) => void;
}) {
  const [requests, setRequests] =
    useState<ProcurementRequestItem[]>(initialRequests);
  const [selectedId, setSelectedId] = useState<string>(
    initialRequests[0]?.id ?? '',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isReloading, setIsReloading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [poFeedback, setPoFeedback] = useState<string | null>(null);

  // Form Permintaan Baru
  const [newGudang, setNewGudang] = useState('Depo Farmasi');
  const [newDibutuhkanUntuk, setNewDibutuhkanUntuk] = useState('');
  const [newPrioritas, setNewPrioritas] =
    useState<ProcurementPriority>('Normal');
  const [newDibutuhkanPada, setNewDibutuhkanPada] = useState('');
  const [newNamaItem, setNewNamaItem] = useState('');
  const [newSatuan, setNewSatuan] = useState('Kapsul');
  const [newDiminta, setNewDiminta] = useState<number>(10);
  const [newCatatan, setNewCatatan] = useState('');

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter((req) => {
      const matchNumber = req.nomorPermintaan.toLowerCase().includes(q);
      const matchSupplier = (req.pemasok ?? '').toLowerCase().includes(q);
      const matchWarehouse = req.gudang.toLowerCase().includes(q);
      const matchFor = (req.dibutuhkanUntuk ?? '').toLowerCase().includes(q);
      const matchItem = req.items.some((i) =>
        i.namaItem.toLowerCase().includes(q),
      );
      return (
        matchNumber || matchSupplier || matchWarehouse || matchFor || matchItem
      );
    });
  }, [requests, searchQuery]);

  const selectedRequest = useMemo(() => {
    return (
      requests.find((r) => r.id === selectedId) ?? filteredRequests[0] ?? null
    );
  }, [requests, selectedId, filteredRequests]);

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await onReload?.();
    } finally {
      setTimeout(() => setIsReloading(false), 350);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNamaItem.trim()) return;

    const now = new Date();
    const randomSuffix = Math.random().toString(16).substring(2, 8).toUpperCase();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const prNumber = `PR-${y}${m}${d}-${randomSuffix}`;

    const created: ProcurementRequestItem = {
      id: `pr-${Date.now()}`,
      nomorPermintaan: prNumber,
      jumlahItem: 1,
      dibutuhkanUntuk: newDibutuhkanUntuk.trim() || null,
      gudang: newGudang.trim() || 'Depo Farmasi',
      tanggalLabel: formatDateIndoShort(now),
      prioritas: newPrioritas,
      dibutuhkanPada: newDibutuhkanPada.trim() || null,
      status: 'disetujui',
      catatanUmum: newCatatan.trim() || undefined,
      items: [
        {
          id: `itm-${Date.now()}`,
          namaItem: newNamaItem.trim(),
          satuan: newSatuan.trim() || 'Unit',
          diminta: Math.max(1, Number(newDiminta) || 1),
          diterima: 0,
          dialokasikan: 0,
        },
      ],
      riwayat: [
        {
          id: `act-${Date.now()}-1`,
          tipe: 'draft',
          judul: 'Draf permintaan dibuat',
          waktu: formatDateTimeWib(now),
          aktor: 'Pengguna tidak ditemukan',
          deskripsi: 'Permintaan dicatat sebagai draf.',
        },
        {
          id: `act-${Date.now()}-2`,
          tipe: 'disetujui',
          judul: 'Permintaan disetujui',
          waktu: formatDateTimeWib(now),
          aktor: 'Pengguna tidak ditemukan',
          deskripsi: 'Keputusan dicatat.',
        },
      ],
    };

    setRequests((prev) => [created, ...prev]);
    setSelectedId(created.id);
    onCreateRequest?.(created);

    setNewNamaItem('');
    setNewDibutuhkanUntuk('');
    setNewDibutuhkanPada('');
    setNewCatatan('');
    setNewDiminta(10);
    setIsCreateModalOpen(false);
  };

  const handleBuatPoClick = () => {
    if (!selectedRequest) return;
    onCreatePoFromRequest?.(selectedRequest);
    setPoFeedback(
      `Draf PO disiapkan dari ${selectedRequest.nomorPermintaan}.`,
    );
    setTimeout(() => setPoFeedback(null), 3500);
  };

  const selectedStatusMeta = selectedRequest
    ? STATUS_META[selectedRequest.status]
    : null;

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* ===================================================================
            1. HEADER HALAMAN: EYEBROW, JUDUL, SUBJUDUL & AKSI KANAN ATAS
           =================================================================== */}
        <div className="px-6 pt-5 pb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              JEJAK OPERASIONAL &middot; KEBUTUHAN KLINIK
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5">
              Permintaan pengadaan
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Ajukan kebutuhan, minta tinjauan, lalu ubah permintaan disetujui
              menjadi PO.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => void handleReload()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-slate-500 ${
                  isReloading ? 'animate-spin text-[#008ba6]' : ''
                }`}
              />
              <span>Muat Ulang</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Permintaan baru</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            2. BARIS PENCARIAN & COUNTER REKAM
           =================================================================== */}
        <div className="px-6 pb-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor, pemasok, gudang..."
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian permintaan"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-xs text-slate-400 tabular-nums shrink-0">
            {filteredRequests.length} rekam
          </span>
        </div>

        {/* ===================================================================
            3. SPLIT LAYOUT: TABEL KIRI & PANEL REKAM TERPILIH KANAN
           =================================================================== */}
        <div className="border-t border-slate-200/80 grid grid-cols-1 xl:grid-cols-[1fr_360px]">
          {/* KOLOM KIRI: TABEL DAFTAR PERMINTAAN */}
          <div className="overflow-x-auto border-b xl:border-b-0 xl:border-r border-slate-200/80">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pl-6 pr-3 py-3.5">PERMINTAAN</th>
                  <th className="px-3 py-3.5">UNTUK / GUDANG</th>
                  <th className="px-3 py-3.5">TANGGAL</th>
                  <th className="px-3 py-3.5">PRIORITAS</th>
                  <th className="pl-3 pr-6 py-3.5">STATUS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 px-6 text-center text-slate-400"
                    >
                      Tidak ada permintaan pengadaan yang cocok dengan
                      pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const isSelected = selectedRequest?.id === req.id;
                    const badge = STATUS_META[req.status];

                    return (
                      <tr
                        key={req.id}
                        onClick={() => setSelectedId(req.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#edf7fc]/85'
                            : 'bg-white hover:bg-slate-50/70'
                        }`}
                      >
                        {/* PERMINTAAN */}
                        <td className="pl-6 pr-3 py-4 align-middle whitespace-nowrap">
                          <p className="font-mono font-bold text-[#0f3d56]">
                            {req.nomorPermintaan}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                            {req.jumlahItem} item
                          </p>
                        </td>

                        {/* UNTUK / GUDANG */}
                        <td className="px-3 py-4 align-middle whitespace-nowrap">
                          <p className="font-semibold text-[#0f3d56]">
                            {req.dibutuhkanUntuk || '—'}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {req.gudang}
                          </p>
                        </td>

                        {/* TANGGAL */}
                        <td className="px-3 py-4 align-middle text-[#0f3d56] tabular-nums whitespace-nowrap">
                          {req.tanggalLabel}
                        </td>

                        {/* PRIORITAS */}
                        <td className="px-3 py-4 align-middle text-[#0f3d56] font-medium whitespace-nowrap">
                          {req.prioritas}
                        </td>

                        {/* STATUS */}
                        <td className="pl-3 pr-6 py-4 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badge.pillClass}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* KOLOM KANAN: REKAM TERPILIH & RIWAYAT PERMINTAAN */}
          <aside className="bg-white p-5 flex flex-col justify-between text-xs">
            {selectedRequest && selectedStatusMeta ? (
              <div className="space-y-4">
                {/* Label REKAM TERPILIH & Nomor PR */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    REKAM TERPILIH
                  </p>
                  <h2 className="text-sm font-extrabold font-mono text-[#0f3d56] mt-1">
                    {selectedRequest.nomorPermintaan}
                  </h2>
                  <div className="mt-1.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${selectedStatusMeta.pillClass}`}
                    >
                      {selectedStatusMeta.label}
                    </span>
                  </div>
                </div>

                {/* Daftar Item Permintaan */}
                <div className="space-y-2">
                  {selectedRequest.items.map((itm) => {
                    const sisa = Math.max(0, itm.diminta - itm.diterima);
                    return (
                      <div
                        key={itm.id}
                        className="rounded-xl border border-[#b8e6ef] bg-[#edf7fc]/65 px-3.5 py-3"
                      >
                        <p className="font-bold text-[#0f3d56]">
                          {itm.namaItem}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {itm.diminta} {itm.satuan}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 tabular-nums">
                          Diminta {itm.diminta} &middot; Diterima {itm.diterima}{' '}
                          &middot; Dialokasikan {itm.dialokasikan} &middot; Sisa{' '}
                          {sisa} {itm.satuan}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Catatan Umum */}
                {selectedRequest.catatanUmum && (
                  <p className="text-xs text-slate-500 break-words">
                    {selectedRequest.catatanUmum}
                  </p>
                )}

                {/* Metadata Key-Value */}
                <div className="divide-y divide-slate-100 border-t border-b border-slate-100 text-xs">
                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <span className="text-slate-400">Gudang</span>
                    <span className="font-bold text-[#0f3d56] text-right">
                      {selectedRequest.gudang}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <span className="text-slate-400">Dibutuhkan untuk</span>
                    <span className="font-semibold text-[#0f3d56] text-right">
                      {selectedRequest.dibutuhkanUntuk || '—'}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <span className="text-slate-400">Tanggal permintaan</span>
                    <span className="font-bold text-[#0f3d56] tabular-nums text-right">
                      {selectedRequest.tanggalLabel}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <span className="text-slate-400">Prioritas</span>
                    <span className="font-bold text-[#0f3d56] text-right">
                      {selectedRequest.prioritas}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between gap-3">
                    <span className="text-slate-400">Dibutuhkan pada</span>
                    <span className="font-semibold text-[#0f3d56] text-right">
                      {selectedRequest.dibutuhkanPada || '—'}
                    </span>
                  </div>
                </div>

                {/* Panel Riwayat Permintaan */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-3.5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-xs font-extrabold text-[#0f3d56]">
                      Riwayat Permintaan
                    </h3>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {selectedRequest.riwayat.length} aktivitas
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {selectedRequest.riwayat.map((act, index) => {
                      const isLast = index === selectedRequest.riwayat.length - 1;

                      return (
                        <div key={act.id} className="flex items-start gap-2.5">
                          {/* Ikon Timeline + Garis Vertikal */}
                          <div className="flex flex-col items-center shrink-0">
                            <span className="w-6 h-6 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-[#008ba6]">
                              {act.tipe === 'draft' && (
                                <RotateCcw className="w-3 h-3" />
                              )}
                              {act.tipe === 'diajukan' && (
                                <Send className="w-3 h-3" />
                              )}
                              {(act.tipe === 'disetujui' ||
                                act.tipe === 'po') && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </span>
                            {!isLast && (
                              <span className="w-px h-7 bg-slate-200 mt-1" />
                            )}
                          </div>

                          {/* Konten Aktivitas */}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#0f3d56] leading-snug">
                              {act.judul}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                              {act.waktu}
                            </p>
                            <p className="text-[11px] font-bold text-[#0f3d56] mt-1">
                              {act.aktor}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {act.deskripsi}
                            </p>

                            {act.catatanKeputusan && (
                              <div className="mt-2 rounded-lg bg-emerald-50/70 border border-emerald-200/70 px-2.5 py-1.5 text-[11px] text-slate-600">
                                <span className="text-slate-400">
                                  Catatan keputusan:{' '}
                                </span>
                                <span className="font-medium text-slate-700">
                                  {act.catatanKeputusan}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tombol Aksi Buat PO dari Permintaan */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {poFeedback && (
                    <p className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                      {poFeedback}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleBuatPoClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buat PO dari permintaan</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-400">
                <FileText className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                Pilih permintaan pada tabel untuk melihat detail.
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* =====================================================================
          4. MODAL PERMINTAAN BARU
         ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  PERMINTAAN PENGADAAN BARU
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Buat Permintaan Kebutuhan Klinik
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Gudang Tujuan
                  </label>
                  <input
                    type="text"
                    required
                    value={newGudang}
                    onChange={(e) => setNewGudang(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Dibutuhkan Untuk (opsional)
                  </label>
                  <input
                    type="text"
                    value={newDibutuhkanUntuk}
                    onChange={(e) => setNewDibutuhkanUntuk(e.target.value)}
                    placeholder="Contoh: Supply Klinik"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Prioritas
                  </label>
                  <select
                    value={newPrioritas}
                    onChange={(e) =>
                      setNewPrioritas(e.target.value as ProcurementPriority)
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Dibutuhkan Pada (opsional)
                  </label>
                  <input
                    type="text"
                    value={newDibutuhkanPada}
                    onChange={(e) => setNewDibutuhkanPada(e.target.value)}
                    placeholder="Contoh: 25 Nov 2026"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_0.8fr_0.7fr] gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Nama Obat / Item
                  </label>
                  <input
                    type="text"
                    required
                    value={newNamaItem}
                    onChange={(e) => setNewNamaItem(e.target.value)}
                    placeholder="Contoh: Amoxicillin 500 mg Kapsul"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    required
                    value={newSatuan}
                    onChange={(e) => setNewSatuan(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newDiminta}
                    onChange={(e) => setNewDiminta(Number(e.target.value) || 1)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0f3d56] mb-1">
                  Catatan (opsional)
                </label>
                <textarea
                  rows={2}
                  value={newCatatan}
                  onChange={(e) => setNewCatatan(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                >
                  Simpan Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}