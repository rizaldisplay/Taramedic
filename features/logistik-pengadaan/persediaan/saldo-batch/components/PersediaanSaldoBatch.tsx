'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Boxes,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  ClipboardList,
  History,
  Landmark,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Unlock,
  Wrench,
  X,
} from 'lucide-react';

export type InventoryMainTabKey =
  | 'dasbor'
  | 'obat'
  | 'alkes_bmhp'
  | 'alat_reusable'
  | 'saldo_batch'
  | 'transaksi_stok'
  | 'persetujuan_opname'
  | 'gudang';

export type LotEligibilityStatus = 'AVAILABLE' | 'EXPIRED' | 'BLOCKED';
export type StockReservationStatus = 'ACTIVE' | 'RELEASED';

export interface StockLotItem {
  id: string;
  kodeItem: string;
  namaItem: string;
  jenisItem: 'Obat' | 'Alkes' | 'BMHP';
  status: LotEligibilityStatus;
  isExpired: boolean;
  gudang: string;
  gudangKode: string;
  batch: string;
  kedaluwarsa: string;
  fisik: number;
  ditahan: number;
  satuan: string;
  nilaiUnit: number;
  alasanBlokir?: string;
}

export interface StockReservationItem {
  id: string;
  referensiJudul: string;
  referensiKode: string;
  lotId: string;
  batch: string;
  gudangLabel: string;
  expiryLabel: string;
  jumlah: number;
  satuan: string;
  status: StockReservationStatus;
  dibuatWaktu: string;
  dibuatOleh: string;
  lifecycleInfo: string;
}

const DEFAULT_LOTS: StockLotItem[] = [
  {
    id: 'lot-1',
    kodeItem: 'OBT-0010',
    namaItem: 'Amlodipine 5 mg Tablet',
    jenisItem: 'Obat',
    status: 'AVAILABLE',
    isExpired: false,
    gudang: 'Depo Farmasi',
    gudangKode: 'Gudang ID 63',
    batch: '4567',
    kedaluwarsa: '27 Des 2030',
    fisik: 60,
    ditahan: 0,
    satuan: 'Tablet',
    nilaiUnit: 30000,
  },
  {
    id: 'lot-2',
    kodeItem: 'OBT-0010',
    namaItem: 'Amlodipine 5 mg Tablet',
    jenisItem: 'Obat',
    status: 'EXPIRED',
    isExpired: true,
    gudang: 'Depo Farmasi',
    gudangKode: 'Gudang ID 63',
    batch: '01234',
    kedaluwarsa: '15 Okt 2026',
    fisik: 5,
    ditahan: 0,
    satuan: 'Tablet',
    nilaiUnit: 30000,
  },
  {
    id: 'lot-3',
    kodeItem: 'MED-72',
    namaItem: 'Ambroxol 30 mg Tablet',
    jenisItem: 'Obat',
    status: 'EXPIRED',
    isExpired: true,
    gudang: 'Depo Farmasi',
    gudangKode: 'Gudang ID 63',
    batch: '04321',
    kedaluwarsa: '15 Okt 2026',
    fisik: 0,
    ditahan: 0,
    satuan: 'Tablet',
    nilaiUnit: 500000,
  },
  {
    id: 'lot-4',
    kodeItem: 'MED-72',
    namaItem: 'Ambroxol 30 mg Tablet',
    jenisItem: 'Obat',
    status: 'AVAILABLE',
    isExpired: false,
    gudang: 'Depo Farmasi',
    gudangKode: 'Gudang ID 63',
    batch: '4568',
    kedaluwarsa: '02 Jan 2032',
    fisik: 60,
    ditahan: 0,
    satuan: 'Tablet',
    nilaiUnit: 500000,
  },
];

const DEFAULT_RESERVATIONS: StockReservationItem[] = [
  {
    id: 'res-1',
    referensiJudul: 'pharmacy_order',
    referensiKode: '129',
    lotId: 'lot-1',
    batch: '4567',
    gudangLabel: 'Gudang ID 63',
    expiryLabel: 'Expiry 27 Des 2030',
    jumlah: 10,
    satuan: 'Tablet',
    status: 'RELEASED',
    dibuatWaktu: '29 Okt 22:15 WIB',
    dibuatOleh: 'fc25bb9e-1b73-418c-9f16-a7ec8c690b78',
    lifecycleInfo: 'Dilepas 01 Nov 02:27 WIB · 9f33bd7a-9...',
  },
  {
    id: 'res-2',
    referensiJudul: 'vjhjgg',
    referensiKode: 'bjkbkkl',
    lotId: 'lot-1',
    batch: '4567',
    gudangLabel: 'Gudang ID 63',
    expiryLabel: 'Expiry 27 Des 2030',
    jumlah: 7,
    satuan: 'Tablet',
    status: 'RELEASED',
    dibuatWaktu: '29 Okt 20:33 WIB',
    dibuatOleh: '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
    lifecycleInfo: 'Dilepas 01 Nov 02:27 WIB · 9f33bd7a-9...',
  },
  {
    id: 'res-3',
    referensiJudul: 'Amlodipine 5 mg Tablet',
    referensiKode: 'Amlodipine 5 mg Tablet',
    lotId: 'lot-4',
    batch: '4568',
    gudangLabel: 'Gudang ID 63',
    expiryLabel: 'Expiry 02 Jan 2032',
    jumlah: 30,
    satuan: 'Tablet',
    status: 'RELEASED',
    dibuatWaktu: '29 Okt 19:39 WIB',
    dibuatOleh: '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
    lifecycleInfo: 'Dilepas 01 Nov 02:26 WIB · 9f33bd7a-9...',
  },
  {
    id: 'res-4',
    referensiJudul: 'test',
    referensiKode: 'teset',
    lotId: 'lot-1',
    batch: '4567',
    gudangLabel: 'Gudang ID 63',
    expiryLabel: 'Expiry 27 Des 2030',
    jumlah: 30,
    satuan: 'Tablet',
    status: 'RELEASED',
    dibuatWaktu: '29 Okt 19:34 WIB',
    dibuatOleh: '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
    lifecycleInfo: 'Dilepas 01 Nov 02:26 WIB · 9f33bd7a-9...',
  },
  {
    id: 'res-5',
    referensiJudul: 'test4',
    referensiKode: 'test4',
    lotId: 'lot-3',
    batch: '04321',
    gudangLabel: 'Gudang ID 63',
    expiryLabel: 'Expiry 15 Okt 2026',
    jumlah: 10,
    satuan: 'Tablet',
    status: 'RELEASED',
    dibuatWaktu: '11 Okt 02:37 WIB',
    dibuatOleh: '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
    lifecycleInfo: 'Dilepas 11 Okt 02:45 WIB · Replit Agent',
  },
  {
    id: 'res-6',
    referensiJudul: 'test3',
    referensiKode: 'test3',
    lotId: 'lot-2',
    batch: '01234',
    gudangLabel: 'Gudang ID 63',
    expiryLabel: 'Expiry 15 Okt 2026',
    jumlah: 15,
    satuan: 'Tablet',
    status: 'RELEASED',
    dibuatWaktu: '11 Okt 02:37 WIB',
    dibuatOleh: '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
    lifecycleInfo: 'Dilepas 11 Okt 02:45 WIB · Replit Agent',
  },
  {
    id: 'res-7',
    referensiJudul: 'test',
    referensiKode: 'tes2',
    lotId: 'lot-3',
    batch: '04321',
    gudangLabel: 'Gudang ID 63',
    expiryLabel: 'Expiry 15 Okt 2026',
    jumlah: 10,
    satuan: 'Tablet',
    status: 'RELEASED',
    dibuatWaktu: '11 Okt 02:33 WIB',
    dibuatOleh: '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
    lifecycleInfo: 'Dilepas 11 Okt 02:35 WIB · 9f33bd7a-9...',
  },
  {
    id: 'res-8',
    referensiJudul: 'test',
    referensiKode: 'test',
    lotId: 'lot-2',
    batch: '01234',
    gudangLabel: 'Gudang ID 63',
    expiryLabel: 'Expiry 15 Okt 2026',
    jumlah: 10,
    satuan: 'Tablet',
    status: 'RELEASED',
    dibuatWaktu: '11 Okt 02:32 WIB',
    dibuatOleh: '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
    lifecycleInfo: 'Dilepas 11 Okt 02:36 WIB · 9f33bd7a-9...',
  },
];

const MAIN_TAB_LABELS: Record<InventoryMainTabKey, string> = {
  dasbor: 'Dasbor',
  obat: 'Obat',
  alkes_bmhp: 'Alkes & BMHP',
  alat_reusable: 'Alat reusable',
  saldo_batch: 'Saldo & batch',
  transaksi_stok: 'Transaksi Stok',
  persetujuan_opname: 'Persetujuan Opname',
  gudang: 'Gudang',
};

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

function getEligibleAvailableQty(lot: StockLotItem): number {
  if (lot.status !== 'AVAILABLE' || lot.isExpired) return 0;
  return Math.max(0, lot.fisik - lot.ditahan);
}

function getCurrentTimeWIB(): string {
  const now = new Date();
  const datePart = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
  });
  const timePart = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${datePart} ${timePart.replace('.', ':')} WIB`;
}

export default function SaldoDanBatch({
  initialLots = DEFAULT_LOTS,
  initialReservations = DEFAULT_RESERVATIONS,
  currentActorLabel = 'Admin Farmasi',
  onMainTabChange,
  onToggleBlockLot,
  onCreateReservation,
  onReleaseReservation,
}: {
  initialLots?: StockLotItem[];
  initialReservations?: StockReservationItem[];
  currentActorLabel?: string;
  onMainTabChange?: (tab: InventoryMainTabKey) => void;
  onToggleBlockLot?: (lot: StockLotItem, reason: string) => void;
  onCreateReservation?: (reservation: StockReservationItem) => void;
  onReleaseReservation?: (
    reservation: StockReservationItem,
    reason: string,
  ) => void;
}) {
  const [activeMainTab, setActiveMainTab] =
    useState<InventoryMainTabKey>('saldo_batch');

  const [lots, setLots] = useState<StockLotItem[]>(initialLots);
  const [reservations, setReservations] =
    useState<StockReservationItem[]>(initialReservations);

  // Filter & Pagination Semua Consumable (Lot-Level)
  const [lotSearchQuery, setLotSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [lotPageSize, setLotPageSize] = useState<number>(10);
  const [lotCurrentPage, setLotCurrentPage] = useState<number>(1);

  // Pagination Reservasi Stok
  const [resPageSize, setResPageSize] = useState<number>(10);
  const [resCurrentPage, setResCurrentPage] = useState<number>(1);

  // Modal Blokir / Buka Blokir Lot
  const [blockingLot, setBlockingLot] = useState<StockLotItem | null>(null);
  const [blockReason, setBlockReason] = useState('');

  // Modal + Reservasi
  const [isCreateResModalOpen, setIsCreateResModalOpen] = useState(false);
  const [resRefTitle, setResRefTitle] = useState('pharmacy_order');
  const [resRefCode, setResRefCode] = useState('');
  const [resLotId, setResLotId] = useState('');
  const [resQty, setResQty] = useState('1');

  // Modal Lepas Reservasi Aktif
  const [releasingRes, setReleasingRes] =
    useState<StockReservationItem | null>(null);
  const [releaseReason, setReleaseReason] = useState('');

  const warehouseOptions = useMemo(() => {
    return Array.from(new Set(lots.map((l) => l.gudang)));
  }, [lots]);

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      if (selectedWarehouse !== 'ALL' && lot.gudang !== selectedWarehouse) {
        return false;
      }

      if (lotSearchQuery.trim() !== '') {
        const q = lotSearchQuery.toLowerCase();
        const match =
          lot.namaItem.toLowerCase().includes(q) ||
          lot.kodeItem.toLowerCase().includes(q) ||
          lot.batch.toLowerCase().includes(q) ||
          lot.gudang.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [lots, selectedWarehouse, lotSearchQuery]);

  // Pagination Lot
  const totalLots = filteredLots.length;
  const totalLotPages = Math.max(1, Math.ceil(totalLots / lotPageSize));
  const safeLotPage = Math.min(lotCurrentPage, totalLotPages);

  const paginatedLots = useMemo(() => {
    const startIdx = (safeLotPage - 1) * lotPageSize;
    return filteredLots.slice(startIdx, startIdx + lotPageSize);
  }, [filteredLots, safeLotPage, lotPageSize]);

  const lotStartNumber = totalLots === 0 ? 0 : (safeLotPage - 1) * lotPageSize + 1;
  const lotEndNumber = Math.min(safeLotPage * lotPageSize, totalLots);

  // Pagination Reservasi
  const totalReservations = reservations.length;
  const totalResPages = Math.max(1, Math.ceil(totalReservations / resPageSize));
  const safeResPage = Math.min(resCurrentPage, totalResPages);

  const paginatedReservations = useMemo(() => {
    const startIdx = (safeResPage - 1) * resPageSize;
    return reservations.slice(startIdx, startIdx + resPageSize);
  }, [reservations, safeResPage, resPageSize]);

  const resStartNumber =
    totalReservations === 0 ? 0 : (safeResPage - 1) * resPageSize + 1;
  const resEndNumber = Math.min(safeResPage * resPageSize, totalReservations);

  // Lot yang memenuhi syarat reservasi (AVAILABLE, tidak kedaluwarsa, tersedia > 0)
  const eligibleLotsForReservation = useMemo(
    () => lots.filter((l) => getEligibleAvailableQty(l) > 0),
    [lots],
  );

  const selectedReservationLot = useMemo(
    () =>
      eligibleLotsForReservation.find((l) => l.id === resLotId) ??
      eligibleLotsForReservation[0] ??
      null,
    [eligibleLotsForReservation, resLotId],
  );

  const handleSelectMainTab = (tab: InventoryMainTabKey) => {
    setActiveMainTab(tab);
    onMainTabChange?.(tab);
  };

  const openBlockLotModal = (lot: StockLotItem) => {
    setBlockingLot(lot);
    setBlockReason('');
  };

  const handleConfirmToggleBlockLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockingLot || !blockReason.trim()) return;

    const nextStatus: LotEligibilityStatus =
      blockingLot.status === 'BLOCKED'
        ? blockingLot.isExpired
          ? 'EXPIRED'
          : 'AVAILABLE'
        : 'BLOCKED';

    const updatedLot: StockLotItem = {
      ...blockingLot,
      status: nextStatus,
      alasanBlokir:
        nextStatus === 'BLOCKED' ? blockReason.trim() : undefined,
    };

    setLots((prev) =>
      prev.map((l) => (l.id === blockingLot.id ? updatedLot : l)),
    );
    onToggleBlockLot?.(updatedLot, blockReason.trim());
    setBlockingLot(null);
  };

  const openCreateReservationModal = () => {
    const firstEligible = eligibleLotsForReservation[0];
    setResRefTitle('pharmacy_order');
    setResRefCode('');
    setResLotId(firstEligible?.id ?? '');
    setResQty('1');
    setIsCreateResModalOpen(true);
  };

  const handleSubmitCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReservationLot) return;

    const maxAllowed = getEligibleAvailableQty(selectedReservationLot);
    const qty = Math.min(maxAllowed, Math.max(1, Number(resQty) || 0));
    if (qty <= 0) return;

    const nowLabel = getCurrentTimeWIB();
    const newReservation: StockReservationItem = {
      id: `res-${Date.now()}`,
      referensiJudul: resRefTitle.trim() || 'pharmacy_order',
      referensiKode:
        resRefCode.trim() || String(Math.floor(100 + Math.random() * 900)),
      lotId: selectedReservationLot.id,
      batch: selectedReservationLot.batch,
      gudangLabel: selectedReservationLot.gudangKode,
      expiryLabel: `Expiry ${selectedReservationLot.kedaluwarsa}`,
      jumlah: qty,
      satuan: selectedReservationLot.satuan,
      status: 'ACTIVE',
      dibuatWaktu: nowLabel,
      dibuatOleh: currentActorLabel,
      lifecycleInfo: `Ditahan ${nowLabel} · ${currentActorLabel}`,
    };

    setLots((prev) =>
      prev.map((l) =>
        l.id === selectedReservationLot.id
          ? { ...l, ditahan: l.ditahan + qty }
          : l,
      ),
    );
    setReservations((prev) => [newReservation, ...prev]);
    setResCurrentPage(1);
    onCreateReservation?.(newReservation);
    setIsCreateResModalOpen(false);
  };

  const handleConfirmReleaseReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!releasingRes || !releaseReason.trim()) return;

    const nowLabel = getCurrentTimeWIB();
    const updatedRes: StockReservationItem = {
      ...releasingRes,
      status: 'RELEASED',
      lifecycleInfo: `Dilepas ${nowLabel} · ${currentActorLabel} (${releaseReason.trim()})`,
    };

    setLots((prev) =>
      prev.map((l) =>
        l.id === releasingRes.lotId
          ? { ...l, ditahan: Math.max(0, l.ditahan - releasingRes.jumlah) }
          : l,
      ),
    );
    setReservations((prev) =>
      prev.map((r) => (r.id === releasingRes.id ? updatedRes : r)),
    );
    onReleaseReservation?.(updatedRes, releaseReason.trim());
    setReleasingRes(null);
  };

  const MAIN_TABS: {
    key: InventoryMainTabKey;
    label: string;
    Icon: React.ElementType;
  }[] = [
    { key: 'dasbor', label: 'Dasbor', Icon: Boxes },
    { key: 'obat', label: 'Obat', Icon: Stethoscope },
    { key: 'alkes_bmhp', label: 'Alkes & BMHP', Icon: ClipboardList },
    { key: 'alat_reusable', label: 'Alat reusable', Icon: Wrench },
    { key: 'saldo_batch', label: 'Saldo & batch', Icon: Boxes },
    { key: 'transaksi_stok', label: 'Transaksi Stok', Icon: ArrowLeftRight },
    {
      key: 'persetujuan_opname',
      label: 'Persetujuan Opname',
      Icon: ClipboardCheck,
    },
    { key: 'gudang', label: 'Gudang', Icon: Landmark },
  ];

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-3.5">
      {/* 1. BARIS TAB NAVIGASI UTAMA MODUL INVENTARIS */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-4 sm:px-5">
        <div
          role="tablist"
          aria-label="Navigasi Modul Inventaris"
          className="flex items-center gap-5 sm:gap-6 overflow-x-auto"
        >
          {MAIN_TABS.map(({ key, label, Icon }) => {
            const isActive = activeMainTab === key;

            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectMainTab(key)}
                className={`relative py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#008ba6] font-bold'
                    : 'text-slate-500 font-semibold hover:text-slate-700'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#008ba6]' : 'text-slate-400'
                  }`}
                />
                <span>{label}</span>

                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. KONTEN UTAMA SALDO & BATCH */}
      {activeMainTab === 'saldo_batch' ? (
        <div className="space-y-4">
          {/* BAGIAN ATAS: SEMUA CONSUMABLE (SALDO LOT-LEVEL) */}
          <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
            {/* Header & Filter Bar */}
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                    SALDO LOT-LEVEL
                  </p>
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                    Semua consumable
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Status kelayakan dan saldo dapat ditelusuri per lot.
                  </p>
                </div>

                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700 whitespace-nowrap shrink-0">
                  {filteredLots.length} lot
                </span>
              </div>

              {/* Search & Filter Gudang */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={lotSearchQuery}
                    onChange={(e) => {
                      setLotSearchQuery(e.target.value);
                      setLotCurrentPage(1);
                    }}
                    placeholder="Cari Item atau Batch"
                    className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
                  />
                  {lotSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setLotSearchQuery('');
                        setLotCurrentPage(1);
                      }}
                      aria-label="Hapus pencarian lot"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative sm:w-56">
                  <select
                    aria-label="Filter Gudang"
                    value={selectedWarehouse}
                    onChange={(e) => {
                      setSelectedWarehouse(e.target.value);
                      setLotCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-xs sm:text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="ALL">Semua Gudang</option>
                    {warehouseOptions.map((wh) => (
                      <option key={wh} value={wh}>
                        {wh}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Tabel Saldo Lot-Level */}
            <div className="overflow-x-auto border-t border-slate-200/80">
              <table className="w-full text-left border-collapse min-w-[1040px]">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">ITEM / STATUS</th>
                    <th className="px-4 py-3.5">GUDANG</th>
                    <th className="px-4 py-3.5">BATCH</th>
                    <th className="px-4 py-3.5">KEDALUWARSA</th>
                    <th className="px-4 py-3.5">FISIK</th>
                    <th className="px-4 py-3.5">DITAHAN</th>
                    <th className="px-4 py-3.5">TERSEDIA</th>
                    <th className="px-4 py-3.5">NILAI UNIT</th>
                    <th className="px-5 py-3.5">KELAYAKAN</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/70 text-xs">
                  {paginatedLots.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-12 px-5 text-center text-slate-500"
                      >
                        Tidak ada lot stok yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    paginatedLots.map((lot) => {
                      const tersediaQty = getEligibleAvailableQty(lot);

                      return (
                        <tr
                          key={lot.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          {/* ITEM / STATUS */}
                          <td className="px-5 py-4 align-middle whitespace-nowrap">
                            <p className="font-bold text-[#0f3d56]">
                              {lot.namaItem}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {lot.kodeItem} · {lot.jenisItem}
                            </p>
                            <div className="mt-1">
                              {lot.status === 'AVAILABLE' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold tracking-wide text-emerald-700">
                                  AVAILABLE
                                </span>
                              )}
                              {lot.status === 'EXPIRED' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-[10px] font-bold tracking-wide text-rose-700">
                                  EXPIRED
                                </span>
                              )}
                              {lot.status === 'BLOCKED' && (
                                <span
                                  title={lot.alasanBlokir}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] font-bold tracking-wide text-amber-700"
                                >
                                  BLOCKED
                                </span>
                              )}
                            </div>
                          </td>

                          {/* GUDANG */}
                          <td className="px-4 py-4 align-middle text-slate-700 font-medium whitespace-nowrap">
                            {lot.gudang}
                          </td>

                          {/* BATCH */}
                          <td className="px-4 py-4 align-middle font-mono text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                            {lot.batch}
                          </td>

                          {/* KEDALUWARSA */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                lot.isExpired
                                  ? 'bg-rose-50 border border-rose-200/80 text-rose-700'
                                  : 'bg-emerald-50 border border-emerald-200/80 text-emerald-700'
                              }`}
                            >
                              {lot.kedaluwarsa}
                            </span>
                          </td>

                          {/* FISIK */}
                          <td className="px-4 py-4 align-middle text-slate-700 font-medium tabular-nums whitespace-nowrap">
                            {lot.fisik.toLocaleString('id-ID')} {lot.satuan}
                          </td>

                          {/* DITAHAN */}
                          <td className="px-4 py-4 align-middle text-slate-600 tabular-nums whitespace-nowrap">
                            {lot.ditahan.toLocaleString('id-ID')} {lot.satuan}
                          </td>

                          {/* TERSEDIA */}
                          <td className="px-4 py-4 align-middle font-bold text-[#0f3d56] tabular-nums whitespace-nowrap">
                            {tersediaQty.toLocaleString('id-ID')} {lot.satuan}
                          </td>

                          {/* NILAI UNIT */}
                          <td className="px-4 py-4 align-middle text-slate-700 font-medium tabular-nums whitespace-nowrap">
                            {formatRupiah(lot.nilaiUnit)}
                          </td>

                          {/* KELAYAKAN */}
                          <td className="px-5 py-4 align-middle whitespace-nowrap">
                            {lot.status === 'BLOCKED' ? (
                              <button
                                type="button"
                                onClick={() => openBlockLotModal(lot)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-xs font-semibold text-amber-800 transition-colors cursor-pointer"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Buka blokir</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openBlockLotModal(lot)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                              >
                                <Lock className="w-3.5 h-3.5 text-slate-500" />
                                <span>Blokir lot</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Pagination Semua Consumable */}
            <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  <strong className="font-semibold text-slate-700">
                    {lotStartNumber}–{lotEndNumber}
                  </strong>{' '}
                  dari{' '}
                  <strong className="font-semibold text-slate-700">
                    {totalLots}
                  </strong>{' '}
                  Lot
                </span>

                <div className="flex items-center gap-2">
                  <label htmlFor="per-halaman-lot">Per Halaman</label>
                  <div className="relative">
                    <select
                      id="per-halaman-lot"
                      value={lotPageSize}
                      onChange={(e) => {
                        setLotPageSize(Number(e.target.value));
                        setLotCurrentPage(1);
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
                  onClick={() => setLotCurrentPage(1)}
                  disabled={safeLotPage <= 1}
                  aria-label="Halaman pertama lot"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLotCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={safeLotPage <= 1}
                  aria-label="Halaman sebelumnya lot"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from(
                  { length: totalLotPages },
                  (_, idx) => idx + 1,
                ).map((page) => {
                  const isCurrent = page === safeLotPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setLotCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#f0f9fb] border-[#009bb8] text-[#008ba6]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() =>
                    setLotCurrentPage((p) => Math.min(totalLotPages, p + 1))
                  }
                  disabled={safeLotPage >= totalLotPages}
                  aria-label="Halaman berikutnya lot"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setLotCurrentPage(totalLotPages)}
                  disabled={safeLotPage >= totalLotPages}
                  aria-label="Halaman terakhir lot"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* BAGIAN BAWAH: GRID 2 KOLOM (RESERVASI STOK + KONVENSI & AUDIT) */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 items-start">
            {/* KOLOM KIRI: RESERVASI STOK */}
            <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden min-w-0">
              <div className="px-5 py-4 flex items-center justify-between gap-3">
                <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                  Reservasi Stok
                </h2>

                <button
                  type="button"
                  onClick={openCreateReservationModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                  <span>Reservasi</span>
                </button>
              </div>

              <div className="overflow-x-auto border-t border-slate-200/80">
                <table className="w-full text-left border-collapse min-w-[880px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">REFERENSI</th>
                      <th className="px-4 py-3.5">LOT / GUDANG</th>
                      <th className="px-4 py-3.5">JUMLAH</th>
                      <th className="px-4 py-3.5">STATUS</th>
                      <th className="px-4 py-3.5">DIBUAT</th>
                      <th className="px-5 py-3.5">LIFECYCLE</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {paginatedReservations.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 px-5 text-center text-slate-500"
                        >
                          Belum ada catatan reservasi stok.
                        </td>
                      </tr>
                    ) : (
                      paginatedReservations.map((res) => (
                        <tr
                          key={res.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          {/* REFERENSI */}
                          <td className="px-5 py-4 align-middle whitespace-nowrap">
                            <p className="font-bold text-[#0f3d56]">
                              {res.referensiJudul}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {res.referensiKode}
                            </p>
                          </td>

                          {/* LOT / GUDANG */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <p className="font-mono text-[11px] font-semibold text-slate-700">
                              {res.batch}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {res.gudangLabel}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {res.expiryLabel}
                            </p>
                          </td>

                          {/* JUMLAH */}
                          <td className="px-4 py-4 align-middle font-bold text-[#0f3d56] tabular-nums whitespace-nowrap">
                            {res.jumlah.toLocaleString('id-ID')}
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            {res.status === 'ACTIVE' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f0f9fb] border border-cyan-200/80 text-[10px] font-bold tracking-wide text-[#008ba6]">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[10px] font-bold tracking-wide text-slate-600">
                                RELEASED
                              </span>
                            )}
                          </td>

                          {/* DIBUAT */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <p className="text-slate-700 font-medium">
                              {res.dibuatWaktu}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                              {res.dibuatOleh}
                            </p>
                          </td>

                          {/* LIFECYCLE */}
                          <td className="px-5 py-4 align-middle whitespace-nowrap">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] text-slate-400">
                                {res.lifecycleInfo}
                              </span>

                              {res.status === 'ACTIVE' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReleasingRes(res);
                                    setReleaseReason('');
                                  }}
                                  className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 cursor-pointer shrink-0"
                                >
                                  Lepas
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Pagination Reservasi Stok */}
              <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    <strong className="font-semibold text-slate-700">
                      {resStartNumber}–{resEndNumber}
                    </strong>{' '}
                    dari{' '}
                    <strong className="font-semibold text-slate-700">
                      {totalReservations}
                    </strong>{' '}
                    Reservasi
                  </span>

                  <div className="flex items-center gap-2">
                    <label htmlFor="per-halaman-reservasi">Per Halaman</label>
                    <div className="relative">
                      <select
                        id="per-halaman-reservasi"
                        value={resPageSize}
                        onChange={(e) => {
                          setResPageSize(Number(e.target.value));
                          setResCurrentPage(1);
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
                    onClick={() => setResCurrentPage(1)}
                    disabled={safeResPage <= 1}
                    aria-label="Halaman pertama reservasi"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setResCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={safeResPage <= 1}
                    aria-label="Halaman sebelumnya reservasi"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from(
                    { length: totalResPages },
                    (_, idx) => idx + 1,
                  ).map((page) => {
                    const isCurrent = page === safeResPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setResCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[#f0f9fb] border-[#009bb8] text-[#008ba6]'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setResCurrentPage((p) => Math.min(totalResPages, p + 1))
                    }
                    disabled={safeResPage >= totalResPages}
                    aria-label="Halaman berikutnya reservasi"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setResCurrentPage(totalResPages)}
                    disabled={safeResPage >= totalResPages}
                    aria-label="Halaman terakhir reservasi"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* KOLOM KANAN: KONVENSI & AUDIT */}
            <aside className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                  Konvensi &amp; Audit
                </h2>
              </div>

              <ul className="p-5 space-y-4 text-xs text-slate-500 leading-relaxed">
                <li className="flex items-start gap-3">
                  <CalendarClock className="w-4 h-4 text-[#008ba6] shrink-0 mt-0.5" />
                  <span>
                    Expiry dijaga per lot. Lot kedaluwarsa tidak memenuhi
                    eligibility untuk reservasi atau issue.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <Boxes className="w-4 h-4 text-[#008ba6] shrink-0 mt-0.5" />
                  <span>
                    Fisik adalah saldo di gudang; ditahan merupakan kuantitas
                    reservasi aktif; tersedia adalah saldo yang dapat
                    dialokasikan.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#008ba6] shrink-0 mt-0.5" />
                  <span>
                    Blokir lot mengeluarkannya dari eligibility. Setiap
                    perubahan status mencatat alasan.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <History className="w-4 h-4 text-[#008ba6] shrink-0 mt-0.5" />
                  <span>
                    Reservasi yang dilepas tetap tercatat beserta pelaku, waktu,
                    alasan, dan histori event.
                  </span>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      ) : (
        /* Placeholder Tab Utama Inventaris Lainnya */
        <section className="bg-white rounded-xl border border-slate-200/90 p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mx-auto mb-3">
            <Boxes className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#0f3d56]">
            Modul {MAIN_TAB_LABELS[activeMainTab]}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hubungkan ke tampilan modul{' '}
            <code className="text-[#008ba6]">{activeMainTab}</code> melalui prop{' '}
            <code className="text-[#008ba6]">onMainTabChange</code>.
          </p>
        </section>
      )}

      {/* 3. MODAL BLOKIR / BUKA BLOKIR LOT */}
      {blockingLot && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  KELAYAKAN LOT · AUDIT TRAIL
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  {blockingLot.status === 'BLOCKED'
                    ? 'Buka Blokir Lot Stok'
                    : 'Blokir Lot Stok'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBlockingLot(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleConfirmToggleBlockLot}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-1">
                <p className="font-bold text-[#0f3d56]">
                  {blockingLot.namaItem}
                </p>
                <p className="text-[11px] text-slate-500">
                  Batch{' '}
                  <strong className="font-mono">{blockingLot.batch}</strong> ·{' '}
                  {blockingLot.gudang} · Fisik {blockingLot.fisik}{' '}
                  {blockingLot.satuan}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alasan Perubahan Status (Wajib untuk Audit)
                </label>
                <textarea
                  rows={3}
                  required
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder={
                    blockingLot.status === 'BLOCKED'
                      ? 'Contoh: Hasil pemeriksaan ulang QC dinyatakan layak edar...'
                      : 'Contoh: Kemasan sekunder rusak / karantina inspeksi mutu...'
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBlockingLot(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
                >
                  {blockingLot.status === 'BLOCKED'
                    ? 'Sahkan Buka Blokir'
                    : 'Sahkan Blokir Lot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL + RESERVASI STOK */}
      {isCreateResModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  ALOKASI &amp; PENAHANAN LOT
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Buat Reservasi Stok Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateResModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitCreateReservation}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sumber / Tipe Referensi
                  </label>
                  <input
                    type="text"
                    required
                    value={resRefTitle}
                    onChange={(e) => setResRefTitle(e.target.value)}
                    placeholder="Contoh: pharmacy_order"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ID / Kode Referensi
                  </label>
                  <input
                    type="text"
                    required
                    value={resRefCode}
                    onChange={(e) => setResRefCode(e.target.value)}
                    placeholder="Contoh: 130 atau ORD-2026-01"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Lot Eligible (Tersedia &amp; Belum Kedaluwarsa)
                </label>
                {eligibleLotsForReservation.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-3 text-slate-500">
                    Tidak ada lot yang memenuhi eligibility untuk reservasi saat
                    ini.
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedReservationLot?.id ?? ''}
                      onChange={(e) => {
                        setResLotId(e.target.value);
                        setResQty('1');
                      }}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      {eligibleLotsForReservation.map((lot) => (
                        <option key={lot.id} value={lot.id}>
                          {lot.namaItem} · Batch {lot.batch} (Tersedia:{' '}
                          {getEligibleAvailableQty(lot)} {lot.satuan})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}
              </div>

              {selectedReservationLot && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">
                      Kuantitas Ditahan ({selectedReservationLot.satuan})
                    </label>
                    <span className="text-[11px] font-semibold text-[#008ba6]">
                      Maks. tersedia:{' '}
                      {getEligibleAvailableQty(selectedReservationLot)}{' '}
                      {selectedReservationLot.satuan}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={getEligibleAvailableQty(selectedReservationLot)}
                    required
                    value={resQty}
                    onChange={(e) => setResQty(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-[#0f3d56] tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateResModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedReservationLot}
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] disabled:opacity-40 text-white text-xs font-semibold cursor-pointer"
                >
                  Simpan Reservasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL LEPAS RESERVASI AKTIF */}
      {releasingRes && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  LIFECYCLE RESERVASI
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Lepas Reservasi Stok
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReleasingRes(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleConfirmReleaseReservation}
              className="p-5 space-y-3.5 text-xs"
            >
              <p className="text-slate-500 leading-relaxed">
                Melepas reservasi{' '}
                <strong className="text-slate-700">
                  {releasingRes.referensiJudul} ({releasingRes.referensiKode})
                </strong>{' '}
                sebanyak{' '}
                <strong className="text-slate-700">
                  {releasingRes.jumlah} {releasingRes.satuan}
                </strong>{' '}
                pada batch{' '}
                <strong className="font-mono text-slate-700">
                  {releasingRes.batch}
                </strong>
                .
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alasan Pelepasan (Tercatat di Audit Trail)
                </label>
                <input
                  type="text"
                  required
                  value={releaseReason}
                  onChange={(e) => setReleaseReason(e.target.value)}
                  placeholder="Contoh: Resep dibatalkan pasien / selesai dialokasikan"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReleasingRes(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
                >
                  Konfirmasi Lepas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}