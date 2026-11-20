'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react';

export type ReceiptStatus = 'draft' | 'diposting' | 'dibatalkan';
export type ReceiptSourceTab = 'semua' | 'dengan_po' | 'tanpa_po';

export interface ReceiptBatchItem {
  id: string;
  namaProduk: string;
  kodeProduk: string;
  nomorBatch: string;
  tanggalKadaluarsa: string;
  qtyDiterima: number;
  satuan: string;
}

export interface ReceiptItem {
  id: string;
  nomorPenerimaan: string;
  gudang: string;
  sumberType: 'po' | 'tanpa_po';
  nomorPo: string | null;
  pemasok: string;
  tanggalLabel: string;
  jumlahItem: number;
  status: ReceiptStatus;
  catatan?: string;
  batches: ReceiptBatchItem[];
}

const RECEIPT_STATUS_META: Record<
  ReceiptStatus,
  { label: string; pillClass: string }
> = {
  draft: {
    label: 'Draft',
    pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  diposting: {
    label: 'Diposting',
    pillClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  dibatalkan: {
    label: 'Dibatalkan',
    pillClass: 'bg-rose-50 border border-rose-200/80 text-rose-600',
  },
};

const DEFAULT_RECEIPTS: ReceiptItem[] = [
  {
    id: 'gr-1',
    nomorPenerimaan: 'GR-20261029-10CCA3A6',
    gudang: 'Depo Farmasi',
    sumberType: 'po',
    nomorPo: 'PO-20261029-E247633F',
    pemasok: 'PT. Alkesindo Farma Tara',
    tanggalLabel: '29 Okt 2026',
    jumlahItem: 1,
    status: 'diposting',
    catatan: 'Barang diterima sesuai surat jalan dan kondisi batch baik.',
    batches: [
      {
        id: 'b-1',
        namaProduk: 'Ambroxol 30 mg Tablet',
        kodeProduk: 'OBT-0023',
        nomorBatch: 'BCH-AMB-2610',
        tanggalKadaluarsa: '15 Okt 2028',
        qtyDiterima: 60,
        satuan: 'Tablet',
      },
    ],
  },
  {
    id: 'gr-2',
    nomorPenerimaan: 'GR-20261029-BBA764A7',
    gudang: 'Depo Farmasi',
    sumberType: 'po',
    nomorPo: 'PO-20261029-D3B7A5AC',
    pemasok: 'PT. Alkesindo Farma Tara',
    tanggalLabel: '29 Okt 2026',
    jumlahItem: 1,
    status: 'diposting',
    catatan: 'Penerimaan penuh batch antihipertensi.',
    batches: [
      {
        id: 'b-2',
        namaProduk: 'Amlodipine 5 mg Tablet',
        kodeProduk: 'OBT-0010',
        nomorBatch: 'BCH-AML-2610',
        tanggalKadaluarsa: '20 Des 2028',
        qtyDiterima: 60,
        satuan: 'Tablet',
      },
    ],
  },
  {
    id: 'gr-3',
    nomorPenerimaan: 'GR-20261011-73299FB3',
    gudang: 'Depo Farmasi',
    sumberType: 'po',
    nomorPo: 'PO-20261011-A0EA6FA5',
    pemasok: 'PT. Alkesindo Farma Tara',
    tanggalLabel: '11 Okt 2026',
    jumlahItem: 2,
    status: 'diposting',
    catatan: '2 item diterima lengkap.',
    batches: [
      {
        id: 'b-3a',
        namaProduk: 'Amoxicillin 500 mg Kapsul',
        kodeProduk: 'OBT-0004',
        nomorBatch: 'BCH-AMX-2609',
        tanggalKadaluarsa: '30 Sep 2028',
        qtyDiterima: 100,
        satuan: 'Kapsul',
      },
      {
        id: 'b-3b',
        namaProduk: 'Kasa Steril 16x16 cm',
        kodeProduk: 'ALK-0019',
        nomorBatch: 'BCH-KSA-2608',
        tanggalKadaluarsa: '01 Agu 2029',
        qtyDiterima: 10,
        satuan: 'Box',
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

export default function PenerimaanBarang({
  initialReceipts = DEFAULT_RECEIPTS,
  onReload,
  onCreateReceipt,
  onPostReceipt,
}: {
  initialReceipts?: ReceiptItem[];
  onReload?: () => Promise<void> | void;
  onCreateReceipt?: (receipt: ReceiptItem) => void;
  onPostReceipt?: (receipt: ReceiptItem) => void;
}) {
  const [receipts, setReceipts] = useState<ReceiptItem[]>(initialReceipts);
  const [activeTab, setActiveTab] = useState<ReceiptSourceTab>('semua');
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(
    null,
  );
  const [isReloading, setIsReloading] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State Form Buat Penerimaan Baru
  const [sumberType, setSumberType] = useState<'po' | 'tanpa_po'>('po');
  const [nomorPo, setNomorPo] = useState('PO-20261120-8812AB');
  const [pemasok, setPemasok] = useState('PT. Alkesindo Farma Tara');
  const [gudang, setGudang] = useState('Depo Farmasi');
  const [namaProduk, setNamaProduk] = useState('');
  const [kodeProduk, setKodeProduk] = useState('OBT-0030');
  const [nomorBatch, setNomorBatch] = useState('BCH-2611-01');
  const [tanggalKadaluarsa, setTanggalKadaluarsa] = useState('15 Nov 2028');
  const [qtyDiterima, setQtyDiterima] = useState<number>(25);
  const [satuan, setSatuan] = useState('Tablet');
  const [catatan, setCatatan] = useState('');

  const tabCounts = useMemo(() => {
    const semua = receipts.length;
    const dengan_po = receipts.filter((r) => r.sumberType === 'po').length;
    const tanpa_po = receipts.filter((r) => r.sumberType === 'tanpa_po').length;
    return { semua, dengan_po, tanpa_po };
  }, [receipts]);

  const filteredReceipts = useMemo(() => {
    if (activeTab === 'dengan_po') {
      return receipts.filter((r) => r.sumberType === 'po');
    }
    if (activeTab === 'tanpa_po') {
      return receipts.filter((r) => r.sumberType === 'tanpa_po');
    }
    return receipts;
  }, [receipts, activeTab]);

  const totalItems = filteredReceipts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedReceipts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredReceipts.slice(start, start + pageSize);
  }, [filteredReceipts, safePage, pageSize]);

  const selectedReceipt = useMemo(() => {
    if (!selectedReceiptId) return null;
    return receipts.find((r) => r.id === selectedReceiptId) ?? null;
  }, [receipts, selectedReceiptId]);

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
    if (!namaProduk.trim()) return;

    const now = new Date();
    const suffix = Math.random().toString(16).substring(2, 10).toUpperCase();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const grNumber = `GR-${y}${m}${d}-${suffix}`;

    const created: ReceiptItem = {
      id: `gr-${Date.now()}`,
      nomorPenerimaan: grNumber,
      gudang: gudang.trim() || 'Depo Farmasi',
      sumberType,
      nomorPo: sumberType === 'po' ? nomorPo.trim() || 'PO-BARU' : null,
      pemasok: pemasok.trim() || 'Pemasok Umum',
      tanggalLabel: formatDateIndoShort(now),
      jumlahItem: 1,
      status: 'draft',
      catatan: catatan.trim() || undefined,
      batches: [
        {
          id: `b-${Date.now()}`,
          namaProduk: namaProduk.trim(),
          kodeProduk: kodeProduk.trim() || 'OBT-0001',
          nomorBatch: nomorBatch.trim() || 'BCH-001',
          tanggalKadaluarsa: tanggalKadaluarsa.trim() || '01 Jan 2028',
          qtyDiterima: Math.max(1, Number(qtyDiterima) || 1),
          satuan: satuan.trim() || 'Unit',
        },
      ],
    };

    setReceipts((prev) => [created, ...prev]);
    setSelectedReceiptId(created.id);
    onCreateReceipt?.(created);

    setNamaProduk('');
    setCatatan('');
    setIsCreateModalOpen(false);
  };

  const handlePostReceiptClick = () => {
    if (!selectedReceipt) return;
    const updated: ReceiptItem = {
      ...selectedReceipt,
      status: 'diposting',
    };
    setReceipts((prev) =>
      prev.map((item) => (item.id === selectedReceipt.id ? updated : item)),
    );
    onPostReceipt?.(updated);
  };

  const TABS: { key: ReceiptSourceTab; label: string }[] = [
    { key: 'semua', label: 'Semua' },
    { key: 'dengan_po', label: 'Dengan PO' },
    { key: 'tanpa_po', label: 'Tanpa PO' },
  ];

  const selectedStatusMeta = selectedReceipt
    ? RECEIPT_STATUS_META[selectedReceipt.status]
    : null;

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* ===================================================================
            1. HEADER HALAMAN: EYEBROW, JUDUL, SUBJUDUL & TOMBOL KANAN ATAS
           =================================================================== */}
        <div className="px-6 pt-5 pb-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              BARANG MASUK &middot; LEDGER PERSEDIAAN
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5">
              Penerimaan
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Catat barang dari PO atau pembelian langsung tanpa PO. Stok
              bertambah setelah draft diposting.
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
              <span>Buat penerimaan</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            2. SUB-TABS FILTER SUMBER: SEMUA / DENGAN PO / TANPA PO
           =================================================================== */}
        <div
          role="tablist"
          aria-label="Filter Sumber Penerimaan Barang"
          className="px-6 border-b border-slate-200/80 flex items-center gap-6"
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
                className={`relative pb-3 pt-1 inline-flex items-center gap-2 text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#008ba6] font-extrabold'
                    : 'text-slate-500 font-semibold hover:text-[#0f3d56]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                    isActive
                      ? 'bg-[#e6f6f9] text-[#008ba6]'
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

        {/* ===================================================================
            3. SPLIT LAYOUT: TABEL PENERIMAAN KIRI & PANEL BATCH KANAN
           =================================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] min-h-[460px]">
          {/* KOLOM KIRI: TABEL & PAGINATION */}
          <div className="flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-slate-200/80">
            <div className="overflow-x-auto flex-1 flex flex-col">
              <table className="w-full text-left border-collapse min-w-[740px]">
                <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="pl-6 pr-3 py-3.5">NOMOR PENERIMAAN</th>
                    <th className="px-3 py-3.5">SUMBER / PO</th>
                    <th className="px-3 py-3.5">PEMASOK</th>
                    <th className="px-3 py-3.5">TANGGAL</th>
                    <th className="px-3 py-3.5">JUMLAH ITEM</th>
                    <th className="pl-3 pr-6 py-3.5">STATUS</th>
                  </tr>
                </thead>

                {paginatedReceipts.length > 0 && (
                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {paginatedReceipts.map((item) => {
                      const isSelected = selectedReceipt?.id === item.id;
                      const statusMeta = RECEIPT_STATUS_META[item.status];

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedReceiptId(item.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#edf7fc]/85'
                              : 'bg-white hover:bg-slate-50/70'
                          }`}
                        >
                          {/* NOMOR PENERIMAAN */}
                          <td className="pl-6 pr-3 py-4 align-middle whitespace-nowrap">
                            <p className="font-mono font-bold text-[#0f3d56]">
                              {item.nomorPenerimaan}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {item.gudang}
                            </p>
                          </td>

                          {/* SUMBER / PO */}
                          <td className="px-3 py-4 align-middle font-mono text-xs text-[#0f3d56] font-semibold whitespace-nowrap">
                            {item.nomorPo || 'Pembelian Langsung'}
                          </td>

                          {/* PEMASOK */}
                          <td className="px-3 py-4 align-middle text-[#0f3d56] font-medium whitespace-nowrap">
                            {item.pemasok}
                          </td>

                          {/* TANGGAL */}
                          <td className="px-3 py-4 align-middle text-[#0f3d56] tabular-nums whitespace-nowrap">
                            {item.tanggalLabel}
                          </td>

                          {/* JUMLAH ITEM */}
                          <td className="px-3 py-4 align-middle text-[#0f3d56] tabular-nums whitespace-nowrap">
                            {item.jumlahItem} item
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
                    })}
                  </tbody>
                )}
              </table>

              {/* Empty State Tabel saat 0 data pada filter */}
              {paginatedReceipts.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center mb-3">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-extrabold text-[#0f3d56]">
                    Tidak Ada Penerimaan Pada Filter Ini.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ubah filter sumber atau buat penerimaan baru.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Pagination */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-3 tabular-nums">
                {totalItems === 0 ? (
                  <span>0 data</span>
                ) : (
                  <span>
                    {(safePage - 1) * pageSize + 1}–
                    {Math.min(safePage * pageSize, totalItems)} dari{' '}
                    <strong className="font-bold text-[#0f3d56]">
                      {totalItems}
                    </strong>{' '}
                    Penerimaan
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <span>Per Halaman</span>
                  <div className="relative">
                    <select
                      aria-label="Jumlah baris penerimaan per halaman"
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
                  disabled={safePage <= 1 || totalItems === 0}
                  aria-label="Halaman pertama penerimaan"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1 || totalItems === 0}
                  aria-label="Halaman sebelumnya penerimaan"
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
                  disabled={safePage >= totalPages || totalItems === 0}
                  aria-label="Halaman berikutnya penerimaan"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safePage >= totalPages || totalItems === 0}
                  aria-label="Halaman terakhir penerimaan"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: DETAIL BATCH PENERIMAAN */}
          <aside className="bg-white p-5 flex flex-col justify-between text-xs">
            {selectedReceipt && selectedStatusMeta ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      DETAIL BATCH PENERIMAAN
                    </p>
                    <h2 className="text-sm font-extrabold font-mono text-[#0f3d56] mt-1">
                      {selectedReceipt.nomorPenerimaan}
                    </h2>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${selectedStatusMeta.pillClass}`}
                      >
                        {selectedStatusMeta.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {selectedReceipt.gudang}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReceiptId(null)}
                    aria-label="Tutup detail batch"
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border-t border-b border-slate-100 text-xs">
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Sumber</span>
                    <span className="font-mono font-bold text-[#0f3d56]">
                      {selectedReceipt.nomorPo || 'Tanpa PO'}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Pemasok</span>
                    <span className="font-bold text-[#0f3d56] text-right">
                      {selectedReceipt.pemasok}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Tanggal</span>
                    <span className="font-bold text-[#0f3d56] tabular-nums">
                      {selectedReceipt.tanggalLabel}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-extrabold text-[#0f3d56]">
                    Rincian Batch ({selectedReceipt.batches.length})
                  </p>

                  {selectedReceipt.batches.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-[#b8e6ef] bg-[#edf7fc]/65 p-3 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-[#0f3d56]">
                            {b.namaProduk}
                          </p>
                          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                            {b.kodeProduk} &middot; Batch {b.nomorBatch}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[11px] font-extrabold text-[#0f3d56] tabular-nums shrink-0">
                          +{b.qtyDiterima} {b.satuan}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Kadaluarsa:{' '}
                        <strong className="text-[#0f3d56]">
                          {b.tanggalKadaluarsa}
                        </strong>
                      </p>
                    </div>
                  ))}
                </div>

                {selectedReceipt.catatan && (
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {selectedReceipt.catatan}
                  </p>
                )}

                {selectedReceipt.status === 'draft' && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handlePostReceiptClick}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Posting ke Persediaan</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center mb-3">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <p className="text-xs font-extrabold text-[#0f3d56]">
                  Pilih Penerimaan
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[230px]">
                  Periksa detail batch sebelum memposting ke persediaan.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* =====================================================================
          4. MODAL BUAT PENERIMAAN BARU
         ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  PENERIMAAN BARANG MASUK
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Catat Penerimaan Barang &amp; Batch
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
                    Sumber Penerimaan
                  </label>
                  <select
                    value={sumberType}
                    onChange={(e) =>
                      setSumberType(e.target.value as 'po' | 'tanpa_po')
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="po">Dengan PO</option>
                    <option value="tanpa_po">Tanpa PO</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    {sumberType === 'po' ? 'Nomor PO' : 'Referensi (opsional)'}
                  </label>
                  <input
                    type="text"
                    disabled={sumberType === 'tanpa_po'}
                    value={sumberType === 'po' ? nomorPo : 'Pembelian Langsung'}
                    onChange={(e) => setNomorPo(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-[#0f3d56] disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Pemasok
                  </label>
                  <input
                    type="text"
                    required
                    value={pemasok}
                    onChange={(e) => setPemasok(e.target.value)}
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
                    value={gudang}
                    onChange={(e) => setGudang(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_0.9fr] gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={namaProduk}
                    onChange={(e) => setNamaProduk(e.target.value)}
                    placeholder="Contoh: Ambroxol 30 mg Tablet"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Kode Produk
                  </label>
                  <input
                    type="text"
                    value={kodeProduk}
                    onChange={(e) => setKodeProduk(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    No. Batch
                  </label>
                  <input
                    type="text"
                    required
                    value={nomorBatch}
                    onChange={(e) => setNomorBatch(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Kadaluarsa
                  </label>
                  <input
                    type="text"
                    required
                    value={tanggalKadaluarsa}
                    onChange={(e) => setTanggalKadaluarsa(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Qty Diterima
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={qtyDiterima}
                    onChange={(e) =>
                      setQtyDiterima(Number(e.target.value) || 1)
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    required
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0f3d56] mb-1">
                  Catatan (opsional)
                </label>
                <textarea
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
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
                  Simpan Draft Penerimaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}