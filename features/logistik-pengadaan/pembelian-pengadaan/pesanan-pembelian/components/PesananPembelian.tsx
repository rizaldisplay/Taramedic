'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Clock,
  Eye,
  FileText,
  History,
  Info,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  X,
  XCircle,
} from 'lucide-react';

export type PurchaseOrderStatus =
  | 'draft'
  | 'diajukan'
  | 'disetujui'
  | 'diterima_sebagian'
  | 'diterima_penuh'
  | 'ditutup';

export interface PurchaseOrderLineItem {
  id: string;
  namaProduk: string;
  kodeProduk: string;
  satuan: string;
  hargaSatuan: number;
  dipesan: number;
  diterima: number;
}

export interface PurchaseOrderReceiptLog {
  id: string;
  nomorGr: string;
  statusLabel: string;
  waktuLabel: string;
  ringkasan: string;
}

export interface PurchaseOrderItem {
  id: string;
  nomorPo: string;
  jumlahBaris: number;
  expectedLabel: string;
  pemasok: string;
  tanggalLabel: string;
  gudang: string;
  subtotal: number;
  diskon: number;
  pajakPpn: number;
  total: number;
  status: PurchaseOrderStatus;
  dibuatOleh: string;
  items: PurchaseOrderLineItem[];
  riwayatPenerimaan: PurchaseOrderReceiptLog[];
}

const PO_STATUS_META: Record<
  PurchaseOrderStatus,
  { label: string; pillClass: string }
> = {
  draft: {
    label: 'Draf',
    pillClass: 'bg-slate-100 border border-slate-200/80 text-slate-600',
  },
  diajukan: {
    label: 'Diajukan',
    pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  disetujui: {
    label: 'Disetujui',
    pillClass: 'bg-[#edf7fc] border border-[#b8e6ef] text-[#008ba6]',
  },
  diterima_sebagian: {
    label: 'Diterima Sebagian',
    pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-800',
  },
  diterima_penuh: {
    label: 'Diterima Penuh',
    pillClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  ditutup: {
    label: 'Ditutup',
    pillClass: 'bg-rose-50 border border-rose-200/80 text-rose-600',
  },
};

const DEFAULT_PURCHASE_ORDERS: PurchaseOrderItem[] = [
  {
    id: 'po-1',
    nomorPo: 'PO-20261029-E247633F',
    jumlahBaris: 1,
    expectedLabel: '29 Okt 2026',
    pemasok: 'PT. Alkesindo Farma Tara',
    tanggalLabel: '29 Okt 2026',
    gudang: 'Depo Farmasi',
    subtotal: 30000000,
    diskon: 0,
    pajakPpn: 0,
    total: 30000000,
    status: 'diterima_penuh',
    dibuatOleh: 'Superadmin · info@taramedic.id',
    items: [
      {
        id: 'pol-1',
        namaProduk: 'Ambroxol 30 mg Tablet',
        kodeProduk: 'PMS · 002',
        satuan: 'Tablet',
        hargaSatuan: 500000,
        dipesan: 60,
        diterima: 60,
      },
    ],
    riwayatPenerimaan: [
      {
        id: 'gr-1',
        nomorGr: 'Penerimaan #GR-20261029-10CCA3A6',
        statusLabel: 'Diposting',
        waktuLabel: '29 Okt 2026 19:38 WIB',
        ringkasan: '60 tablet diterima · Depo Farmasi',
      },
    ],
  },
  {
    id: 'po-2',
    nomorPo: 'PO-20261029-D3B7A5AC',
    jumlahBaris: 1,
    expectedLabel: '29 Okt 2026',
    pemasok: 'PT. Alkesindo Farma Tara',
    tanggalLabel: '29 Okt 2026',
    gudang: 'Depo Farmasi',
    subtotal: 1800000,
    diskon: 0,
    pajakPpn: 0,
    total: 1800000,
    status: 'diterima_penuh',
    dibuatOleh: 'Superadmin · info@taramedic.id',
    items: [
      {
        id: 'pol-2',
        namaProduk: 'Amlodipine 5 mg Tablet',
        kodeProduk: 'PMS · 010',
        satuan: 'Tablet',
        hargaSatuan: 30000,
        dipesan: 60,
        diterima: 60,
      },
    ],
    riwayatPenerimaan: [
      {
        id: 'gr-2',
        nomorGr: 'Penerimaan #GR-20261029-22B84E11',
        statusLabel: 'Diposting',
        waktuLabel: '29 Okt 2026 20:10 WIB',
        ringkasan: '60 tablet diterima · Depo Farmasi',
      },
    ],
  },
  {
    id: 'po-3',
    nomorPo: 'PO-20261011-A0EA6FA5',
    jumlahBaris: 2,
    expectedLabel: '11 Okt 2026',
    pemasok: 'PT. Alkesindo Farma Tara',
    tanggalLabel: '11 Okt 2026',
    gudang: 'Depo Farmasi',
    subtotal: 5600000,
    diskon: 0,
    pajakPpn: 0,
    total: 5600000,
    status: 'diterima_penuh',
    dibuatOleh: 'Superadmin · info@taramedic.id',
    items: [
      {
        id: 'pol-3a',
        namaProduk: 'Amoxicillin 500 mg Kapsul',
        kodeProduk: 'PMS · 004',
        satuan: 'Kapsul',
        hargaSatuan: 40000,
        dipesan: 100,
        diterima: 100,
      },
      {
        id: 'pol-3b',
        namaProduk: 'Kasa Steril 16x16 cm',
        kodeProduk: 'PMS · 019',
        satuan: 'Box',
        hargaSatuan: 160000,
        dipesan: 10,
        diterima: 10,
      },
    ],
    riwayatPenerimaan: [
      {
        id: 'gr-3',
        nomorGr: 'Penerimaan #GR-20261011-77C19F02',
        statusLabel: 'Diposting',
        waktuLabel: '11 Okt 2026 14:22 WIB',
        ringkasan: '110 item diterima · Depo Farmasi',
      },
    ],
  },
];

function formatRupiah(nominal: number): string {
  return `Rp ${nominal.toLocaleString('id-ID')}`;
}

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

export default function PesananPembelian({
  initialOrders = DEFAULT_PURCHASE_ORDERS,
  onReload,
  onCreatePo,
  onViewDetailPo,
  onViewReceiptHistory,
  onClosePo,
}: {
  initialOrders?: PurchaseOrderItem[];
  onReload?: () => Promise<void> | void;
  onCreatePo?: (po: PurchaseOrderItem) => void;
  onViewDetailPo?: (po: PurchaseOrderItem) => void;
  onViewReceiptHistory?: (po: PurchaseOrderItem) => void;
  onClosePo?: (po: PurchaseOrderItem) => void;
}) {
  const [orders, setOrders] = useState<PurchaseOrderItem[]>(initialOrders);
  const [selectedPoId, setSelectedPoId] = useState<string | null>(
    initialOrders[0]?.id ?? null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isReloading, setIsReloading] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal Tambah PO & Sub-modal Info Detail / Riwayat
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [infoModalMode, setInfoModalMode] = useState<
    'detail' | 'riwayat' | null
  >(null);

  // State form Buat PO
  const [newPemasok, setNewPemasok] = useState('PT. Alkesindo Farma Tara');
  const [newGudang, setNewGudang] = useState('Depo Farmasi');
  const [newExpectedLabel, setNewExpectedLabel] = useState('25 Nov 2026');
  const [newNamaProduk, setNewNamaProduk] = useState('');
  const [newKodeProduk, setNewKodeProduk] = useState('PMS · 025');
  const [newSatuan, setNewSatuan] = useState('Tablet');
  const [newHargaSatuan, setNewHargaSatuan] = useState<number>(25000);
  const [newDipesan, setNewDipesan] = useState<number>(40);
  const [newDiskon, setNewDiskon] = useState<number>(0);
  const [newPajakPpn, setNewPajakPpn] = useState<number>(0);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((po) => {
      return (
        po.nomorPo.toLowerCase().includes(q) ||
        po.pemasok.toLowerCase().includes(q) ||
        po.gudang.toLowerCase().includes(q)
      );
    });
  }, [orders, searchQuery]);

  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, safePage, pageSize]);

  const selectedPo = useMemo(() => {
    if (!selectedPoId) return null;
    return orders.find((o) => o.id === selectedPoId) ?? null;
  }, [orders, selectedPoId]);

  const selectedPoSummary = useMemo(() => {
    if (!selectedPo) return null;

    const totalOrderedQty = selectedPo.items.reduce(
      (sum, itm) => sum + itm.dipesan,
      0,
    );
    const totalReceivedQty = selectedPo.items.reduce(
      (sum, itm) => sum + itm.diterima,
      0,
    );
    const totalRemainingQty = Math.max(0, totalOrderedQty - totalReceivedQty);

    const progressPercent =
      totalOrderedQty > 0
        ? Math.min(100, Math.round((totalReceivedQty / totalOrderedQty) * 100))
        : 0;

    const unitLabel =
      selectedPo.items[0]?.satuan.toLowerCase() || 'item';

    return {
      totalOrderedQty,
      totalReceivedQty,
      totalRemainingQty,
      progressPercent,
      unitLabel,
    };
  }, [selectedPo]);

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await onReload?.();
    } finally {
      setTimeout(() => setIsReloading(false), 350);
    }
  };

  const handleCreatePoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNamaProduk.trim()) return;

    const now = new Date();
    const suffix = Math.random().toString(16).substring(2, 8).toUpperCase();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const poNumber = `PO-${y}${m}${d}-${suffix}`;

    const qty = Math.max(1, Number(newDipesan) || 1);
    const price = Math.max(0, Number(newHargaSatuan) || 0);
    const subtotal = qty * price;
    const disc = Math.max(0, Number(newDiskon) || 0);
    const ppn = Math.max(0, Number(newPajakPpn) || 0);
    const grandTotal = Math.max(0, subtotal - disc + ppn);

    const created: PurchaseOrderItem = {
      id: `po-${Date.now()}`,
      nomorPo: poNumber,
      jumlahBaris: 1,
      expectedLabel: newExpectedLabel.trim() || formatDateIndoShort(now),
      pemasok: newPemasok.trim() || 'PT. Alkesindo Farma Tara',
      tanggalLabel: formatDateIndoShort(now),
      gudang: newGudang.trim() || 'Depo Farmasi',
      subtotal,
      diskon: disc,
      pajakPpn: ppn,
      total: grandTotal,
      status: 'disetujui',
      dibuatOleh: 'Superadmin · info@taramedic.id',
      items: [
        {
          id: `pol-${Date.now()}`,
          namaProduk: newNamaProduk.trim(),
          kodeProduk: newKodeProduk.trim() || 'PMS · 001',
          satuan: newSatuan.trim() || 'Tablet',
          hargaSatuan: price,
          dipesan: qty,
          diterima: 0,
        },
      ],
      riwayatPenerimaan: [],
    };

    setOrders((prev) => [created, ...prev]);
    setSelectedPoId(created.id);
    onCreatePo?.(created);

    setNewNamaProduk('');
    setNewDiskon(0);
    setNewPajakPpn(0);
    setIsCreateModalOpen(false);
  };

  const handleClosePoClick = () => {
    if (!selectedPo) return;
    const updated: PurchaseOrderItem = {
      ...selectedPo,
      status: 'ditutup',
    };
    setOrders((prev) =>
      prev.map((item) => (item.id === selectedPo.id ? updated : item)),
    );
    onClosePo?.(updated);
  };

  const selectedStatusMeta = selectedPo ? PO_STATUS_META[selectedPo.status] : null;

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* ===================================================================
            1. HEADER HALAMAN: EYEBROW, JUDUL, SUBJUDUL & AKSI KANAN ATAS
           =================================================================== */}
        <div className="px-6 pt-5 pb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              PERMINTAAN PENGADAAN
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5">
              Pesanan Pembelian
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Draft &rarr; diajukan &rarr; disetujui &rarr; diterima sebagian /
              penuh.
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
              <span>Muat ulang</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat PO</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            2. BARIS PENCARIAN PO / PEMASOK
           =================================================================== */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nomor PO atau pemasok"
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                aria-label="Hapus pencarian PO"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ===================================================================
            3. SPLIT LAYOUT: TABEL PO KIRI & DRAWER RINCIAN PO KANAN
           =================================================================== */}
        <div
          className={`border-t border-slate-200/80 grid grid-cols-1 ${
            selectedPo ? 'xl:grid-cols-[1fr_430px]' : ''
          }`}
        >
          {/* KOLOM KIRI: TABEL PESANAN PEMBELIAN & PAGINATION */}
          <div
            className={`flex flex-col justify-between ${
              selectedPo
                ? 'border-b xl:border-b-0 xl:border-r border-slate-200/80'
                : ''
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="pl-6 pr-3 py-3.5">NOMOR PO</th>
                    <th className="px-3 py-3.5">PEMASOK</th>
                    <th className="px-3 py-3.5">TANGGAL</th>
                    <th className="px-3 py-3.5">GUDANG</th>
                    <th className="px-3 py-3.5">TOTAL</th>
                    <th className="pl-3 pr-6 py-3.5">STATUS</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/70 text-xs">
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 px-6 text-center text-slate-400"
                      >
                        Tidak ada pesanan pembelian yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((po) => {
                      const isSelected = selectedPo?.id === po.id;
                      const statusMeta = PO_STATUS_META[po.status];

                      return (
                        <tr
                          key={po.id}
                          onClick={() => setSelectedPoId(po.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#edf7fc]/85'
                              : 'bg-white hover:bg-slate-50/70'
                          }`}
                        >
                          {/* NOMOR PO */}
                          <td className="pl-6 pr-3 py-4 align-middle whitespace-nowrap">
                            <p className="font-mono font-bold text-[#0f3d56]">
                              {po.nomorPo}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                              {po.jumlahBaris} baris &middot; expected{' '}
                              {po.expectedLabel}
                            </p>
                          </td>

                          {/* PEMASOK */}
                          <td className="px-3 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                            {po.pemasok}
                          </td>

                          {/* TANGGAL */}
                          <td className="px-3 py-4 align-middle text-[#0f3d56] tabular-nums whitespace-nowrap">
                            {po.tanggalLabel}
                          </td>

                          {/* GUDANG */}
                          <td className="px-3 py-4 align-middle text-[#0f3d56] font-medium whitespace-nowrap">
                            {po.gudang}
                          </td>

                          {/* TOTAL */}
                          <td className="px-3 py-4 align-middle font-extrabold text-[#0f3d56] tabular-nums whitespace-nowrap">
                            {formatRupiah(po.total)}
                          </td>

                          {/* STATUS */}
                          <td className="pl-3 pr-6 py-4 align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusMeta.pillClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-3 tabular-nums">
                <span>
                  {totalItems === 0
                    ? '0'
                    : `${(safePage - 1) * pageSize + 1}–${Math.min(
                        safePage * pageSize,
                        totalItems,
                      )}`}{' '}
                  dari{' '}
                  <strong className="font-bold text-[#0f3d56]">
                    {totalItems}
                  </strong>{' '}
                  Pesanan
                </span>

                <div className="flex items-center gap-2">
                  <span>Per Halaman</span>
                  <div className="relative">
                    <select
                      aria-label="Jumlah baris PO per halaman"
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
                  disabled={safePage <= 1}
                  aria-label="Halaman pertama PO"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  aria-label="Halaman sebelumnya PO"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg border text-xs font-bold cursor-pointer ${
                        page === safePage
                          ? 'bg-[#edf7fc] border-[#009bb8] text-[#008ba6]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage >= totalPages}
                  aria-label="Halaman berikutnya PO"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safePage >= totalPages}
                  aria-label="Halaman terakhir PO"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: DRAWER RINCIAN PESANAN PEMBELIAN */}
          {selectedPo && selectedStatusMeta && selectedPoSummary && (
            <aside className="bg-white flex flex-col justify-between text-xs">
              {/* Top Header Rincian PO + Tombol Close [X] */}
              <div className="px-5 py-4 border-b border-slate-200/80 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    RINCIAN PESANAN PEMBELIAN
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#edf7fc] text-[#008ba6] inline-flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </span>
                    <h2 className="text-sm font-extrabold font-mono text-[#0f3d56]">
                      {selectedPo.nomorPo}
                    </h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${selectedStatusMeta.pillClass}`}
                    >
                      {selectedStatusMeta.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedPo.pemasok}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPoId(null)}
                  aria-label="Tutup rincian pesanan pembelian"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body Rincian PO */}
              <div className="p-5 space-y-4 overflow-y-auto max-h-[780px]">
                {/* 2 Kartu Metrik: Total PO & Jumlah Item */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200/90 bg-white px-3.5 py-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <FileText className="w-3.5 h-3.5 text-[#008ba6]" />
                      <span>Total PO</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#0f3d56] mt-1 tabular-nums">
                      {formatRupiah(selectedPo.total)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200/90 bg-white px-3.5 py-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <ClipboardList className="w-3.5 h-3.5 text-[#008ba6]" />
                      <span>Jumlah Item</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#0f3d56] mt-1 tabular-nums">
                      {selectedPo.jumlahBaris} item
                    </p>
                  </div>
                </div>

                {/* Informasi Pesanan */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0f3d56] mb-2.5">
                    <Info className="w-3.5 h-3.5 text-[#008ba6]" />
                    <span>Informasi Pesanan</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[11px] text-slate-400">
                        Tanggal Diterima (Expected)
                      </p>
                      <p className="font-bold text-[#0f3d56] mt-0.5 tabular-nums">
                        {selectedPo.expectedLabel}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-400">Dibuat Oleh</p>
                      <p className="font-bold text-[#0f3d56] mt-0.5 break-all">
                        {selectedPo.dibuatOleh}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ringkasan Nilai */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0f3d56]">
                    <FileText className="w-3.5 h-3.5 text-[#008ba6]" />
                    <span>Ringkasan Nilai</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold text-[#0f3d56] tabular-nums">
                      {formatRupiah(selectedPo.subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Diskon</span>
                    <span className="font-bold text-[#0f3d56] tabular-nums">
                      {formatRupiah(selectedPo.diskon)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Pajak (PPN)</span>
                    <span className="font-bold text-[#0f3d56] tabular-nums">
                      {formatRupiah(selectedPo.pajakPpn)}
                    </span>
                  </div>

                  <div className="rounded-lg bg-[#edf7fc] px-3 py-2 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0f3d56]">
                      Total PO
                    </span>
                    <span className="text-sm font-extrabold text-[#0f3d56] tabular-nums">
                      {formatRupiah(selectedPo.total)}
                    </span>
                  </div>
                </div>

                {/* Daftar Barang */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0f3d56] mb-2.5">
                    <Box className="w-3.5 h-3.5 text-[#008ba6]" />
                    <span>
                      Daftar Barang ({selectedPo.items.length} Item)
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="border-b border-slate-100 text-[10px] font-bold text-slate-400">
                        <tr>
                          <th className="py-1.5 pr-2">No</th>
                          <th className="py-1.5 px-2">Produk</th>
                          <th className="py-1.5 px-2 text-right">Harga Satuan</th>
                          <th className="py-1.5 px-2 text-right">Dipesan</th>
                          <th className="py-1.5 px-2 text-right">Diterima</th>
                          <th className="py-1.5 px-2 text-right">Sisa</th>
                          <th className="py-1.5 pl-2 text-right">Progres</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedPo.items.map((itm, idx) => {
                          const sisa = Math.max(0, itm.dipesan - itm.diterima);
                          const pct =
                            itm.dipesan > 0
                              ? Math.min(
                                  100,
                                  Math.round((itm.diterima / itm.dipesan) * 100),
                                )
                              : 0;

                          return (
                            <tr key={itm.id}>
                              <td className="py-2 pr-2 text-slate-400 tabular-nums align-top">
                                {idx + 1}
                              </td>
                              <td className="py-2 px-2 align-top">
                                <p className="font-bold text-[#0f3d56]">
                                  {itm.namaProduk}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {itm.kodeProduk} &middot; {itm.satuan}
                                </p>
                              </td>
                              <td className="py-2 px-2 text-right font-semibold text-[#0f3d56] tabular-nums whitespace-nowrap align-top">
                                {formatRupiah(itm.hargaSatuan)}
                              </td>
                              <td className="py-2 px-2 text-right font-semibold text-[#0f3d56] tabular-nums align-top">
                                {itm.dipesan}
                              </td>
                              <td className="py-2 px-2 text-right font-semibold text-[#0f3d56] tabular-nums align-top">
                                {itm.diterima}
                              </td>
                              <td className="py-2 px-2 text-right font-semibold text-[#0f3d56] tabular-nums align-top">
                                {sisa}
                              </td>
                              <td className="py-2 pl-2 text-right align-top">
                                <div className="w-12 ml-auto h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-[#0f3d56] tabular-nums">
                                  {pct}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Progres Penerimaan */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0f3d56]">
                    <PackageCheck className="w-3.5 h-3.5 text-[#008ba6]" />
                    <span>Progres Penerimaan</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-slate-500">
                        Rata-rata pemenuhan item
                      </span>
                      <span className="font-extrabold text-[#0f3d56] tabular-nums">
                        {selectedPoSummary.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{
                          width: `${selectedPoSummary.progressPercent}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-slate-200/80 px-2.5 py-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <FileText className="w-3 h-3 text-[#008ba6]" />
                        <span>Dipesan</span>
                      </div>
                      <p className="text-xs font-extrabold text-[#0f3d56] mt-1 tabular-nums">
                        {selectedPoSummary.totalOrderedQty}{' '}
                        {selectedPoSummary.unitLabel}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200/80 px-2.5 py-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Diterima</span>
                      </div>
                      <p className="text-xs font-extrabold text-[#0f3d56] mt-1 tabular-nums">
                        {selectedPoSummary.totalReceivedQty}{' '}
                        {selectedPoSummary.unitLabel}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200/80 px-2.5 py-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Box className="w-3 h-3 text-slate-400" />
                        <span>Sisa</span>
                      </div>
                      <p className="text-xs font-extrabold text-[#0f3d56] mt-1 tabular-nums">
                        {selectedPoSummary.totalRemainingQty}{' '}
                        {selectedPoSummary.unitLabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Riwayat Penerimaan */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0f3d56]">
                    <Clock className="w-3.5 h-3.5 text-[#008ba6]" />
                    <span>Riwayat Penerimaan</span>
                  </div>

                  {selectedPo.riwayatPenerimaan.length === 0 ? (
                    <p className="text-[11px] text-slate-400">
                      Belum ada riwayat penerimaan barang.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPo.riwayatPenerimaan.map((gr) => (
                        <div
                          key={gr.id}
                          className="rounded-lg border border-slate-200/80 p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="text-[11px] font-bold text-[#0f3d56]">
                                {gr.nomorGr}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-bold">
                                {gr.statusLabel}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                              {gr.waktuLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1.5 pl-5">
                            {gr.ringkasan}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Action Buttons Rincian PO */}
              <div className="px-5 py-3.5 border-t border-slate-200/80 bg-white flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onViewDetailPo?.(selectedPo);
                    setInfoModalMode('detail');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lihat Detail Po</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onViewReceiptHistory?.(selectedPo);
                    setInfoModalMode('riwayat');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lihat Riwayat Penerimaan</span>
                </button>

                <button
                  type="button"
                  onClick={handleClosePoClick}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50/70 text-[11px] font-bold text-rose-600 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Tutup PO</span>
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* =====================================================================
          4. MODAL BUAT PO BARU
         ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  PESANAN PEMBELIAN BARU
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Buat Purchase Order (PO)
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

            <form onSubmit={handleCreatePoSubmit} className="p-5 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Pemasok
                  </label>
                  <input
                    type="text"
                    required
                    value={newPemasok}
                    onChange={(e) => setNewPemasok(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={newNamaProduk}
                    onChange={(e) => setNewNamaProduk(e.target.value)}
                    placeholder="Contoh: Ambroxol 30 mg Tablet"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Expected Diterima
                  </label>
                  <input
                    type="text"
                    value={newExpectedLabel}
                    onChange={(e) => setNewExpectedLabel(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Kode Produk
                  </label>
                  <input
                    type="text"
                    value={newKodeProduk}
                    onChange={(e) => setNewKodeProduk(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    value={newSatuan}
                    onChange={(e) => setNewSatuan(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Jumlah Dipesan
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newDipesan}
                    onChange={(e) => setNewDipesan(Number(e.target.value) || 1)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Harga Satuan (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newHargaSatuan}
                    onChange={(e) =>
                      setNewHargaSatuan(Number(e.target.value) || 0)
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Diskon (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newDiskon}
                    onChange={(e) => setNewDiskon(Number(e.target.value) || 0)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    PPN (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newPajakPpn}
                    onChange={(e) =>
                      setNewPajakPpn(Number(e.target.value) || 0)
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
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
                  Simpan PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. MODAL LIHAT DETAIL PO / RIWAYAT PENERIMAAN
         ===================================================================== */}
      {infoModalMode && selectedPo && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {infoModalMode === 'detail'
                    ? 'DETAIL DOKUMEN PO'
                    : 'RIWAYAT PENERIMAAN BARANG'}
                </p>
                <h2 className="text-base font-extrabold font-mono text-[#0f3d56]">
                  {selectedPo.nomorPo}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInfoModalMode(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {infoModalMode === 'detail' ? (
                <>
                  <p className="text-slate-600">
                    Pemasok:{' '}
                    <strong className="text-[#0f3d56]">
                      {selectedPo.pemasok}
                    </strong>
                  </p>
                  <p className="text-slate-600">
                    Gudang:{' '}
                    <strong className="text-[#0f3d56]">
                      {selectedPo.gudang}
                    </strong>
                  </p>
                  <p className="text-slate-600 tabular-nums">
                    Total PO:{' '}
                    <strong className="text-[#0f3d56]">
                      {formatRupiah(selectedPo.total)}
                    </strong>
                  </p>
                </>
              ) : selectedPo.riwayatPenerimaan.length === 0 ? (
                <p className="text-slate-400">
                  Belum ada catatan penerimaan untuk PO ini.
                </p>
              ) : (
                selectedPo.riwayatPenerimaan.map((gr) => (
                  <div
                    key={gr.id}
                    className="rounded-lg border border-slate-200/80 p-3 space-y-1"
                  >
                    <p className="font-bold text-[#0f3d56]">{gr.nomorGr}</p>
                    <p className="text-[11px] text-slate-400 tabular-nums">
                      {gr.waktuLabel}
                    </p>
                    <p className="text-[11px] text-slate-600">{gr.ringkasan}</p>
                  </div>
                ))
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setInfoModalMode(null)}
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