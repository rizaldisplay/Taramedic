'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Package,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Users,
  X,
  XCircle,
} from 'lucide-react';

export type ProcurementTabKey =
  | 'pemasok_mapping'
  | 'pesanan_pembelian'
  | 'penerimaan';

export type PurchaseOrderStatus =
  | 'draft'
  | 'diajukan'
  | 'disetujui'
  | 'diterima_sebagian'
  | 'diterima_penuh'
  | 'dibatalkan';

export interface PurchaseOrderLineItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  satuan: string;
  qtyPesan: number;
  qtyDiterima: number;
  hargaSatuan: number;
}

export interface PurchaseOrderItem {
  id: string;
  nomorPO: string;
  pemasok: string;
  tanggal: string;
  expectedTanggal: string;
  gudang: string;
  status: PurchaseOrderStatus;
  catatan?: string;
  items: PurchaseOrderLineItem[];
}

const DEFAULT_PURCHASE_ORDERS: PurchaseOrderItem[] = [
  {
    id: 'po-1',
    nomorPO: 'PO-20261029-E247633F',
    pemasok: 'PT. Alkesindo Farma Tara',
    tanggal: '29 Okt 2026',
    expectedTanggal: '29 Okt 2026',
    gudang: 'Depo Farmasi',
    status: 'diterima_penuh',
    catatan: 'Pengadaan rutin stok obat & alkes bulanan.',
    items: [
      {
        id: 'poi-1',
        kodeBarang: 'ALK-0102',
        namaBarang: 'Paket Alat Kesehatan & Habis Pakai Klinik',
        satuan: 'Paket',
        qtyPesan: 10,
        qtyDiterima: 10,
        hargaSatuan: 3000000,
      },
    ],
  },
  {
    id: 'po-2',
    nomorPO: 'PO-20261029-D3B7A5AC',
    pemasok: 'PT. Alkesindo Farma Tara',
    tanggal: '29 Okt 2026',
    expectedTanggal: '29 Okt 2026',
    gudang: 'Depo Farmasi',
    status: 'diterima_penuh',
    catatan: 'Restock obat generik pelayanan rawat jalan.',
    items: [
      {
        id: 'poi-2',
        kodeBarang: 'OBT-0048',
        namaBarang: 'Amoxicillin 500 mg Kaplet (Box 100)',
        satuan: 'Box',
        qtyPesan: 30,
        qtyDiterima: 30,
        hargaSatuan: 60000,
      },
    ],
  },
  {
    id: 'po-3',
    nomorPO: 'PO-20261011-A0EA6FA5',
    pemasok: 'PT. Alkesindo Farma Tara',
    tanggal: '11 Okt 2026',
    expectedTanggal: '11 Okt 2026',
    gudang: 'Depo Farmasi',
    status: 'diterima_penuh',
    catatan: 'Kebutuhan spuit dan alkohol swab ruang tindakan.',
    items: [
      {
        id: 'poi-3a',
        kodeBarang: 'BHP-0045',
        namaBarang: 'Spuit Disposible 3 cc OneMed (Box 100)',
        satuan: 'Box',
        qtyPesan: 50,
        qtyDiterima: 50,
        hargaSatuan: 64000,
      },
      {
        id: 'poi-3b',
        kodeBarang: 'BHP-0019',
        namaBarang: 'Alkohol Swab Steril (Box 100)',
        satuan: 'Box',
        qtyPesan: 100,
        qtyDiterima: 100,
        hargaSatuan: 24000,
      },
    ],
  },
];

const PO_STATUS_META: Record<
  PurchaseOrderStatus,
  { label: string; badgeClass: string }
> = {
  draft: {
    label: 'Draft',
    badgeClass: 'bg-slate-100 border border-slate-200/80 text-slate-600',
  },
  diajukan: {
    label: 'Diajukan',
    badgeClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  disetujui: {
    label: 'Disetujui',
    badgeClass: 'bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6]',
  },
  diterima_sebagian: {
    label: 'Diterima Sebagian',
    badgeClass: 'bg-sky-50 border border-sky-200/80 text-sky-700',
  },
  diterima_penuh: {
    label: 'Diterima Penuh',
    badgeClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  dibatalkan: {
    label: 'Dibatalkan',
    badgeClass: 'bg-rose-50 border border-rose-200/80 text-rose-700',
  },
};

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

function calculatePOTotal(items: PurchaseOrderLineItem[]): number {
  return items.reduce((sum, item) => sum + item.qtyPesan * item.hargaSatuan, 0);
}

export default function PesananPembelian({
  initialOrders = DEFAULT_PURCHASE_ORDERS,
  supplierCount = 1,
  receivingCount = 3,
  onReload,
  onCreatePO,
  onLifecycleChange,
  onProceedToReceiving,
  onTabChange,
}: {
  initialOrders?: PurchaseOrderItem[];
  supplierCount?: number;
  receivingCount?: number;
  onReload?: () => Promise<void> | void;
  onCreatePO?: (order: PurchaseOrderItem) => void;
  onLifecycleChange?: (
    order: PurchaseOrderItem,
    nextStatus: PurchaseOrderStatus,
  ) => void;
  onProceedToReceiving?: (order: PurchaseOrderItem) => void;
  onTabChange?: (tab: ProcurementTabKey) => void;
}) {
  const [activeTab, setActiveTab] =
    useState<ProcurementTabKey>('pesanan_pembelian');
  const [orders, setOrders] = useState<PurchaseOrderItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isReloading, setIsReloading] = useState(false);

  // Modal Buat PO
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formPemasok, setFormPemasok] = useState('PT. Alkesindo Farma Tara');
  const [formGudang, setFormGudang] = useState('Depo Farmasi');
  const [formExpectedDate, setFormExpectedDate] = useState('2026-11-16');
  const [formCatatan, setFormCatatan] = useState('');
  const [formLines, setFormLines] = useState<
    {
      kodeBarang: string;
      namaBarang: string;
      satuan: string;
      qtyPesan: string;
      hargaSatuan: string;
    }[]
  >([
    {
      kodeBarang: 'OBT-0012',
      namaBarang: '',
      satuan: 'Box',
      qtyPesan: '10',
      hargaSatuan: '50000',
    },
  ]);

  // Filter berdasarkan pencarian nomor PO atau pemasok
  const filteredOrders = useMemo(() => {
    if (searchQuery.trim() === '') return orders;
    const q = searchQuery.toLowerCase();

    return orders.filter(
      (item) =>
        item.nomorPO.toLowerCase().includes(q) ||
        item.pemasok.toLowerCase().includes(q) ||
        item.gudang.toLowerCase().includes(q),
    );
  }, [orders, searchQuery]);

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredOrders.slice(startIdx, startIdx + pageSize);
  }, [filteredOrders, safePage, pageSize]);

  const startItemNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItemNumber = Math.min(safePage * pageSize, totalItems);

  // Pesanan terpilih di panel kanan
  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  const handleSelectTab = (tab: ProcurementTabKey) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const handleReloadClick = async () => {
    try {
      setIsReloading(true);
      await onReload?.();
    } finally {
      setTimeout(() => setIsReloading(false), 350);
    }
  };

  const handleAdvanceLifecycle = (
    order: PurchaseOrderItem,
    nextStatus: PurchaseOrderStatus,
  ) => {
    const updated: PurchaseOrderItem = {
      ...order,
      status: nextStatus,
      items:
        nextStatus === 'diterima_penuh'
          ? order.items.map((it) => ({ ...it, qtyDiterima: it.qtyPesan }))
          : order.items,
    };

    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? updated : o)),
    );
    onLifecycleChange?.(updated, nextStatus);
  };

  const handleAddLineRow = () => {
    setFormLines((prev) => [
      ...prev,
      {
        kodeBarang: `BRG-${String(prev.length + 1).padStart(4, '0')}`,
        namaBarang: '',
        satuan: 'Box',
        qtyPesan: '1',
        hargaSatuan: '0',
      },
    ]);
  };

  const handleRemoveLineRow = (idx: number) => {
    if (formLines.length <= 1) return;
    setFormLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const validLines = formLines.filter((l) => l.namaBarang.trim() !== '');
    if (validLines.length === 0) return;

    const todayLabel = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const expectedLabel = formExpectedDate
      ? new Date(formExpectedDate).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : todayLabel;

    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const hexSuffix = Math.random().toString(16).slice(2, 10).toUpperCase();

    const created: PurchaseOrderItem = {
      id: `po-${Date.now()}`,
      nomorPO: `PO-${datePrefix}-${hexSuffix}`,
      pemasok: formPemasok.trim() || 'PT. Alkesindo Farma Tara',
      tanggal: todayLabel,
      expectedTanggal: expectedLabel,
      gudang: formGudang,
      status: 'draft',
      catatan: formCatatan.trim() || undefined,
      items: validLines.map((line, idx) => ({
        id: `poi-${Date.now()}-${idx}`,
        kodeBarang:
          line.kodeBarang.trim() || `BRG-${String(idx + 1).padStart(4, '0')}`,
        namaBarang: line.namaBarang.trim(),
        satuan: line.satuan.trim() || 'Box',
        qtyPesan: Math.max(1, Number(line.qtyPesan) || 1),
        qtyDiterima: 0,
        hargaSatuan: Math.max(0, Number(line.hargaSatuan) || 0),
      })),
    };

    setOrders((prev) => [created, ...prev]);
    setSelectedOrderId(created.id);
    setCurrentPage(1);
    onCreatePO?.(created);

    setFormCatatan('');
    setFormLines([
      {
        kodeBarang: 'OBT-0012',
        namaBarang: '',
        satuan: 'Box',
        qtyPesan: '10',
        hargaSatuan: '50000',
      },
    ]);
    setIsCreateModalOpen(false);
  };

  const TOP_TABS: {
    key: ProcurementTabKey;
    label: string;
    count: number;
    Icon: React.ElementType;
  }[] = [
    {
      key: 'pemasok_mapping',
      label: 'Pemasok & Mapping',
      count: supplierCount,
      Icon: Users,
    },
    {
      key: 'pesanan_pembelian',
      label: 'Pesanan Pembelian',
      count: orders.length,
      Icon: ClipboardList,
    },
    {
      key: 'penerimaan',
      label: 'Penerimaan',
      count: receivingCount,
      Icon: Package,
    },
  ];

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-3.5">
      {/* 1. TAB NAVIGASI MODUL PENGADAAN */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-4 sm:px-5">
        <div
          role="tablist"
          aria-label="Navigasi Pengadaan & Pesanan Pembelian"
          className="flex items-center gap-5 sm:gap-7 overflow-x-auto"
        >
          {TOP_TABS.map(({ key, label, count, Icon }) => {
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectTab(key)}
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
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. KONTEN UTAMA PESANAN PEMBELIAN */}
      {activeTab === 'pesanan_pembelian' ? (
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header & Search Bar */}
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  PERMINTAAN PENGADAAN
                </p>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                  Pesanan Pembelian
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Draft → diajukan → disetujui → diterima sebagian / penuh.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => void handleReloadClick()}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                  <span>Buat PO</span>
                </button>
              </div>
            </div>

            {/* Search Input Full-Width */}
            <div className="mt-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nomor PO atau pemasok"
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

          {/* Split-Pane Bawah: Tabel PO (Kiri) + Panel Detail Lifecycle (Kanan) */}
          <div className="border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] min-h-[380px]">
            {/* KOLOM KIRI: TABEL & PAGINATION */}
            <div className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-slate-50/80 border-y border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-4 py-3">NOMOR PO</th>
                      <th className="px-4 py-3">PEMASOK</th>
                      <th className="px-4 py-3">TANGGAL</th>
                      <th className="px-4 py-3">GUDANG</th>
                      <th className="px-4 py-3">TOTAL</th>
                      <th className="px-4 py-3">STATUS</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-14 px-4 text-center text-slate-500"
                        >
                          Tidak ada pesanan pembelian yang sesuai dengan
                          pencarian.
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((order) => {
                        const isSelected = selectedOrder?.id === order.id;
                        const statusMeta = PO_STATUS_META[order.status];
                        const totalNominal = calculatePOTotal(order.items);

                        return (
                          <tr
                            key={order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                            className={`transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#f0f9fb]/65 border-l-[3px] border-l-[#009bb8]'
                                : 'hover:bg-slate-50/90'
                            }`}
                          >
                            {/* Nomor PO */}
                            <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                              <p className="font-extrabold text-[#0f3d56]">
                                {order.nomorPO}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {order.items.length} baris · expected{' '}
                                {order.expectedTanggal}
                              </p>
                            </td>

                            {/* Pemasok */}
                            <td className="px-4 py-3.5 align-middle font-medium text-slate-700 whitespace-nowrap">
                              {order.pemasok}
                            </td>

                            {/* Tanggal */}
                            <td className="px-4 py-3.5 align-middle text-slate-600 font-medium whitespace-nowrap">
                              {order.tanggal}
                            </td>

                            {/* Gudang */}
                            <td className="px-4 py-3.5 align-middle text-slate-600 font-medium whitespace-nowrap">
                              {order.gudang}
                            </td>

                            {/* Total */}
                            <td className="px-4 py-3.5 align-middle font-semibold text-slate-700 tabular-nums whitespace-nowrap">
                              {formatRupiah(totalNominal)}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusMeta.badgeClass}`}
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

              {/* Footer Pagination */}
              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    <strong className="font-semibold text-slate-700">
                      {startItemNumber}–{endItemNumber}
                    </strong>{' '}
                    dari{' '}
                    <strong className="font-semibold text-slate-700">
                      {totalItems}
                    </strong>{' '}
                    Pesanan
                  </span>

                  <div className="flex items-center gap-2">
                    <label htmlFor="per-halaman-po">Per Halaman</label>
                    <div className="relative">
                      <select
                        id="per-halaman-po"
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
            </div>

            {/* KOLOM KANAN: PANEL TINJAUAN PESANAN / EMPTY STATE */}
            <aside className="border-t lg:border-t-0 lg:border-l border-slate-200/80 bg-white flex flex-col">
              {!selectedOrder ? (
                /* Empty State Sesuai Gambar */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-8">
                  <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mb-3.5">
                    <ClipboardList className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <h2 className="text-sm sm:text-[15px] font-bold text-[#0f3d56]">
                    Pilih Pesanan
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-[260px] leading-relaxed">
                    Tinjau baris, sisa kuantitas, lalu jalankan lifecycle sesuai
                    kewenangan.
                  </p>
                </div>
              ) : (
                /* Detail Baris, Sisa Kuantitas & Lifecycle PO Terpilih */
                <div className="p-5 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    {/* Header PO Terpilih */}
                    <div className="flex items-start justify-between gap-2 pb-3.5 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-[#008ba6]">
                          DETAIL PESANAN PEMBELIAN
                        </span>
                        <h2 className="text-sm sm:text-[15px] font-extrabold text-[#0f3d56] mt-0.5">
                          {selectedOrder.nomorPO}
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {selectedOrder.pemasok}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(null)}
                        aria-label="Tutup panel pesanan"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ringkasan Header PO */}
                    <div className="mt-3.5 rounded-xl border border-slate-200/80 bg-[#f8fafc] p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Status Lifecycle
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            PO_STATUS_META[selectedOrder.status].badgeClass
                          }`}
                        >
                          {PO_STATUS_META[selectedOrder.status].label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Gudang Penerima
                        </span>
                        <span className="font-bold text-[#0f3d56]">
                          {selectedOrder.gudang}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Target Tiba (Expected)
                        </span>
                        <span className="font-semibold text-slate-700">
                          {selectedOrder.expectedTanggal}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70">
                        <span className="text-[11px] text-slate-400">
                          Total Nilai PO
                        </span>
                        <span className="text-sm font-extrabold text-[#0f3d56] tabular-nums">
                          {formatRupiah(calculatePOTotal(selectedOrder.items))}
                        </span>
                      </div>
                    </div>

                    {/* Daftar Baris & Sisa Kuantitas */}
                    <div className="mt-4">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Baris Pesanan &amp; Sisa Kuantitas (
                        {selectedOrder.items.length})
                      </h3>

                      <div className="space-y-2 max-h-[210px] overflow-y-auto pr-0.5">
                        {selectedOrder.items.map((line) => {
                          const sisaQty = Math.max(
                            0,
                            line.qtyPesan - line.qtyDiterima,
                          );

                          return (
                            <div
                              key={line.id}
                              className="rounded-xl border border-slate-200/80 bg-white p-3 space-y-1.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <span className="text-[10px] font-bold text-[#008ba6]">
                                    {line.kodeBarang}
                                  </span>
                                  <p className="font-bold text-[#0f3d56] leading-snug">
                                    {line.namaBarang}
                                  </p>
                                </div>
                                <span className="font-bold text-slate-700 tabular-nums whitespace-nowrap">
                                  {formatRupiah(
                                    line.qtyPesan * line.hargaSatuan,
                                  )}
                                </span>
                              </div>

                              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500">
                                  Pesan:{' '}
                                  <strong className="text-slate-700">
                                    {line.qtyPesan} {line.satuan}
                                  </strong>
                                </span>
                                <span className="text-slate-500">
                                  Diterima:{' '}
                                  <strong className="text-emerald-700">
                                    {line.qtyDiterima}
                                  </strong>
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded font-semibold ${
                                    sisaQty > 0
                                      ? 'bg-amber-50 text-amber-700'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  Sisa: {sisaQty}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Aksi Lifecycle Sesuai Status */}
                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                    {selectedOrder.status === 'draft' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleAdvanceLifecycle(selectedOrder, 'dibatalkan')
                          }
                          className="px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 text-xs font-bold text-rose-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Batal</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleAdvanceLifecycle(selectedOrder, 'diajukan')
                          }
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Ajukan Pesanan</span>
                        </button>
                      </div>
                    )}

                    {selectedOrder.status === 'diajukan' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleAdvanceLifecycle(selectedOrder, 'disetujui')
                        }
                        className="w-full py-2.5 px-4 rounded-xl bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Setujui Pesanan (PO)</span>
                      </button>
                    )}

                    {(selectedOrder.status === 'disetujui' ||
                      selectedOrder.status === 'diterima_sebagian') && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onProceedToReceiving) {
                            onProceedToReceiving(selectedOrder);
                          } else {
                            handleAdvanceLifecycle(
                              selectedOrder,
                              'diterima_penuh',
                            );
                          }
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Catat Penerimaan Barang</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {selectedOrder.status === 'diterima_penuh' && (
                      <div className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-700 text-xs font-bold flex items-center justify-center gap-2">
                        <PackageCheck className="w-4 h-4" />
                        <span>Seluruh kuantitas PO telah diterima penuh</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      ) : (
        /* Placeholder saat Tab Pemasok & Mapping atau Penerimaan diklik */
        <section className="bg-white rounded-xl border border-slate-200/90 p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mx-auto mb-3">
            {activeTab === 'pemasok_mapping' ? (
              <Users className="w-5 h-5" />
            ) : (
              <Package className="w-5 h-5" />
            )}
          </div>
          <h2 className="text-base font-bold text-[#0f3d56]">
            {activeTab === 'pemasok_mapping'
              ? 'Direktori Pemasok & Produk Pemasok'
              : 'Penerimaan Barang dari Pemasok'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hubungkan ke komponen{' '}
            <code className="text-[#008ba6]">
              {activeTab === 'pemasok_mapping'
                ? 'DirektoriPemasok'
                : 'PenerimaanBarang'}
            </code>{' '}
            melalui prop <code className="text-[#008ba6]">onTabChange</code>.
          </p>
        </section>
      )}

      {/* 3. MODAL BUAT PO BARU */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  PERMINTAAN PENGADAAN
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Buat Pesanan Pembelian (PO)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitCreatePO}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pemasok
                  </label>
                  <input
                    type="text"
                    required
                    value={formPemasok}
                    onChange={(e) => setFormPemasok(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Gudang Tujuan
                  </label>
                  <div className="relative">
                    <select
                      value={formGudang}
                      onChange={(e) => setFormGudang(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="Depo Farmasi">Depo Farmasi</option>
                      <option value="Gudang Utama">Gudang Utama</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Expected Tanggal Tiba
                  </label>
                  <input
                    type="date"
                    value={formExpectedDate}
                    onChange={(e) => setFormExpectedDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              {/* Baris Item PO */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">
                    Baris Item Pesanan
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineRow}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008ba6] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah baris</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[190px] overflow-y-auto pr-0.5">
                  {formLines.map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[1fr_70px_76px_105px_32px] gap-2 items-center"
                    >
                      <input
                        type="text"
                        required
                        value={row.namaBarang}
                        onChange={(e) =>
                          setFormLines((prev) =>
                            prev.map((r, i) =>
                              i === idx
                                ? { ...r, namaBarang: e.target.value }
                                : r,
                            ),
                          )
                        }
                        placeholder="Nama obat / alkes..."
                        className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#009bb8]"
                      />
                      <input
                        type="number"
                        min={1}
                        required
                        value={row.qtyPesan}
                        onChange={(e) =>
                          setFormLines((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, qtyPesan: e.target.value } : r,
                            ),
                          )
                        }
                        placeholder="Qty"
                        className="border border-slate-200 rounded-lg px-2 py-2 text-xs text-center focus:outline-none focus:border-[#009bb8]"
                      />
                      <input
                        type="text"
                        value={row.satuan}
                        onChange={(e) =>
                          setFormLines((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, satuan: e.target.value } : r,
                            ),
                          )
                        }
                        placeholder="Satuan"
                        className="border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-[#009bb8]"
                      />
                      <input
                        type="number"
                        min={0}
                        value={row.hargaSatuan}
                        onChange={(e) =>
                          setFormLines((prev) =>
                            prev.map((r, i) =>
                              i === idx
                                ? { ...r, hargaSatuan: e.target.value }
                                : r,
                            ),
                          )
                        }
                        placeholder="Harga"
                        className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-right focus:outline-none focus:border-[#009bb8]"
                      />
                      <button
                        type="button"
                        disabled={formLines.length <= 1}
                        onClick={() => handleRemoveLineRow(idx)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan PO (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Catatan pengiriman atau syarat pembayaran..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
                >
                  Simpan sebagai Draft PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}