'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  FileSpreadsheet,
  FileText,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';

export type ProcurementOpsTabKey =
  | 'permintaan'
  | 'retur'
  | 'faktur'
  | 'pembayaran'
  | 'umur_utang';

export type SupplierInvoiceStatus =
  | 'draf'
  | 'menunggu_verifikasi'
  | 'belum_lunas'
  | 'dibayar_sebagian'
  | 'lunas';

export interface PostedReceivingForInvoice {
  id: string;
  nomorPenerimaan: string;
  nomorPO: string;
  pemasok: string;
  gudang: string;
  tempoHari: number;
  tanggalPosting: string;
  items: {
    id: string;
    kodeBarang: string;
    namaBarang: string;
    satuan: string;
    qtyDiterima: number;
    hargaSatuanPO: number;
  }[];
}

export interface SupplierInvoiceLineItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  satuan: string;
  qtyDitagih: number;
  hargaSatuan: number;
}

export interface SupplierInvoiceItem {
  id: string;
  nomorFaktur: string;
  nomorPenerimaan: string;
  pemasok: string;
  gudang: string;
  tanggalFaktur: string;
  jatuhTempo: string;
  totalTagihan: number;
  totalDibayar: number;
  status: SupplierInvoiceStatus;
  catatan?: string;
  items: SupplierInvoiceLineItem[];
}

const POSTED_RECEIVINGS_FOR_INVOICE: PostedReceivingForInvoice[] = [
  {
    id: 'grn-1',
    nomorPenerimaan: 'GRN-20261029-88A12C',
    nomorPO: 'PO-20261029-E247633F',
    pemasok: 'PT. Alkesindo Farma Tara',
    gudang: 'Depo Farmasi',
    tempoHari: 31,
    tanggalPosting: '29 Okt 2026',
    items: [
      {
        id: 'grni-1',
        kodeBarang: 'ALK-0102',
        namaBarang: 'Paket Alat Kesehatan & Habis Pakai Klinik',
        satuan: 'Paket',
        qtyDiterima: 10,
        hargaSatuanPO: 3000000,
      },
    ],
  },
  {
    id: 'grn-2',
    nomorPenerimaan: 'GRN-20261029-41C90E',
    nomorPO: 'PO-20261029-D3B7A5AC',
    pemasok: 'PT. Alkesindo Farma Tara',
    gudang: 'Depo Farmasi',
    tempoHari: 31,
    tanggalPosting: '29 Okt 2026',
    items: [
      {
        id: 'grni-2',
        kodeBarang: 'OBT-0048',
        namaBarang: 'Amoxicillin 500 mg Kaplet (Box 100)',
        satuan: 'Box',
        qtyDiterima: 30,
        hargaSatuanPO: 60000,
      },
    ],
  },
  {
    id: 'grn-3',
    nomorPenerimaan: 'GRN-20261011-77D51B',
    nomorPO: 'PO-20261011-A0EA6FA5',
    pemasok: 'PT. Alkesindo Farma Tara',
    gudang: 'Depo Farmasi',
    tempoHari: 31,
    tanggalPosting: '11 Okt 2026',
    items: [
      {
        id: 'grni-3a',
        kodeBarang: 'BHP-0045',
        namaBarang: 'Spuit Disposible 3 cc OneMed (Box 100)',
        satuan: 'Box',
        qtyDiterima: 50,
        hargaSatuanPO: 64000,
      },
      {
        id: 'grni-3b',
        kodeBarang: 'BHP-0019',
        namaBarang: 'Alkohol Swab Steril (Box 100)',
        satuan: 'Box',
        qtyDiterima: 100,
        hargaSatuanPO: 24000,
      },
    ],
  },
];

const INVOICE_STATUS_META: Record<
  SupplierInvoiceStatus,
  { label: string; badgeClass: string }
> = {
  draf: {
    label: 'Draf',
    badgeClass: 'bg-slate-100 border border-slate-200/80 text-slate-600',
  },
  menunggu_verifikasi: {
    label: 'Menunggu Verifikasi',
    badgeClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  belum_lunas: {
    label: 'Terverifikasi · Belum Lunas',
    badgeClass: 'bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6]',
  },
  dibayar_sebagian: {
    label: 'Dibayar Sebagian',
    badgeClass: 'bg-sky-50 border border-sky-200/80 text-sky-700',
  },
  lunas: {
    label: 'Lunas',
    badgeClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
};

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

function addDaysToISO(baseDateISO: string, days: number): string {
  const date = new Date(baseDateISO);
  if (Number.isNaN(date.getTime())) return baseDateISO;
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDateID(dateISO: string): string {
  const date = new Date(dateISO);
  if (Number.isNaN(date.getTime())) return dateISO;
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function FakturPemasok({
  initialInvoices = [],
  postedReceivings = POSTED_RECEIVINGS_FOR_INVOICE,
  permintaanCount = 3,
  returCount = 0,
  pembayaranCount = 0,
  umurUtangCount = 0,
  onReload,
  onCreateInvoice,
  onVerifyInvoice,
  onProceedToPayment,
  onTabChange,
}: {
  initialInvoices?: SupplierInvoiceItem[];
  postedReceivings?: PostedReceivingForInvoice[];
  permintaanCount?: number;
  returCount?: number;
  pembayaranCount?: number;
  umurUtangCount?: number;
  onReload?: () => Promise<void> | void;
  onCreateInvoice?: (invoice: SupplierInvoiceItem) => void;
  onVerifyInvoice?: (invoice: SupplierInvoiceItem) => void;
  onProceedToPayment?: (invoice: SupplierInvoiceItem) => void;
  onTabChange?: (tab: ProcurementOpsTabKey) => void;
}) {
  const [activeTab, setActiveTab] = useState<ProcurementOpsTabKey>('faktur');
  const [invoices, setInvoices] =
    useState<SupplierInvoiceItem[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [isReloading, setIsReloading] = useState(false);

  // State Modal Catat Faktur / Mulai Rekam
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReceivingId, setSelectedReceivingId] = useState<string>(
    postedReceivings[0]?.id ?? '',
  );
  const [formNomorFaktur, setFormNomorFaktur] = useState('');
  const [formTanggalFaktur, setFormTanggalFaktur] = useState('2026-11-16');
  const [formJatuhTempo, setFormJatuhTempo] = useState('2026-12-17');
  const [formCatatan, setFormCatatan] = useState('');
  const [formLines, setFormLines] = useState<
    {
      id: string;
      kodeBarang: string;
      namaBarang: string;
      satuan: string;
      qtyDitagih: string;
      hargaSatuan: string;
    }[]
  >([]);

  // Filter daftar faktur
  const filteredInvoices = useMemo(() => {
    if (searchQuery.trim() === '') return invoices;
    const q = searchQuery.toLowerCase();

    return invoices.filter(
      (item) =>
        item.nomorFaktur.toLowerCase().includes(q) ||
        item.nomorPenerimaan.toLowerCase().includes(q) ||
        item.pemasok.toLowerCase().includes(q) ||
        item.gudang.toLowerCase().includes(q),
    );
  }, [invoices, searchQuery]);

  // Rekam faktur terpilih pada panel kanan
  const selectedInvoice = useMemo(
    () => invoices.find((inv) => inv.id === selectedInvoiceId) ?? null,
    [invoices, selectedInvoiceId],
  );

  const selectedReceivingObj = useMemo(
    () =>
      postedReceivings.find((grn) => grn.id === selectedReceivingId) ??
      postedReceivings[0] ??
      null,
    [postedReceivings, selectedReceivingId],
  );

  const formCalculatedTotal = useMemo(() => {
    return formLines.reduce((sum, line) => {
      const qty = Math.max(0, Number(line.qtyDitagih) || 0);
      const price = Math.max(0, Number(line.hargaSatuan) || 0);
      return sum + qty * price;
    }, 0);
  }, [formLines]);

  const handleSelectTab = (tab: ProcurementOpsTabKey) => {
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

  const populateLinesFromReceiving = (
    grn: PostedReceivingForInvoice | null,
    baseDateISO: string,
  ) => {
    if (!grn) {
      setFormLines([]);
      return;
    }
    setFormJatuhTempo(addDaysToISO(baseDateISO, grn.tempoHari));
    setFormLines(
      grn.items.map((it) => ({
        id: it.id,
        kodeBarang: it.kodeBarang,
        namaBarang: it.namaBarang,
        satuan: it.satuan,
        qtyDitagih: String(it.qtyDiterima),
        hargaSatuan: String(it.hargaSatuanPO),
      })),
    );
  };

  const openCreateInvoiceModal = () => {
    const defaultGrn = postedReceivings[0] ?? null;
    const todayISO = new Date().toISOString().slice(0, 10);
    const hexSuffix = Math.random().toString(16).slice(2, 8).toUpperCase();

    setFormNomorFaktur(
      `INV-${todayISO.replace(/-/g, '')}-${hexSuffix}`,
    );
    setFormTanggalFaktur(todayISO);
    setFormCatatan('');

    if (defaultGrn) {
      setSelectedReceivingId(defaultGrn.id);
      populateLinesFromReceiving(defaultGrn, todayISO);
    } else {
      setFormLines([]);
    }

    setIsCreateModalOpen(true);
  };

  const handleReceivingChange = (grnId: string) => {
    setSelectedReceivingId(grnId);
    const found = postedReceivings.find((g) => g.id === grnId) ?? null;
    populateLinesFromReceiving(found, formTanggalFaktur);
  };

  const handleTanggalFakturChange = (nextDateISO: string) => {
    setFormTanggalFaktur(nextDateISO);
    if (selectedReceivingObj) {
      setFormJatuhTempo(
        addDaysToISO(nextDateISO, selectedReceivingObj.tempoHari),
      );
    }
  };

  const handleSubmitCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReceivingObj) return;

    const validLines: SupplierInvoiceLineItem[] = formLines
      .filter((l) => Number(l.qtyDitagih) > 0)
      .map((l, idx) => ({
        id: `invi-${Date.now()}-${idx}`,
        kodeBarang: l.kodeBarang,
        namaBarang: l.namaBarang,
        satuan: l.satuan,
        qtyDitagih: Math.max(1, Number(l.qtyDitagih) || 1),
        hargaSatuan: Math.max(0, Number(l.hargaSatuan) || 0),
      }));

    if (validLines.length === 0) return;

    const totalNominal = validLines.reduce(
      (sum, item) => sum + item.qtyDitagih * item.hargaSatuan,
      0,
    );

    const created: SupplierInvoiceItem = {
      id: `inv-${Date.now()}`,
      nomorFaktur:
        formNomorFaktur.trim() ||
        `INV-${Date.now().toString().slice(-8)}`,
      nomorPenerimaan: selectedReceivingObj.nomorPenerimaan,
      pemasok: selectedReceivingObj.pemasok,
      gudang: selectedReceivingObj.gudang,
      tanggalFaktur: formatDateID(formTanggalFaktur),
      jatuhTempo: formatDateID(formJatuhTempo),
      totalTagihan: totalNominal,
      totalDibayar: 0,
      status: 'menunggu_verifikasi',
      catatan: formCatatan.trim() || undefined,
      items: validLines,
    };

    setInvoices((prev) => [created, ...prev]);
    setSelectedInvoiceId(created.id);
    onCreateInvoice?.(created);
    setIsCreateModalOpen(false);
  };

  const handleVerifyInvoiceClick = (invoice: SupplierInvoiceItem) => {
    const updated: SupplierInvoiceItem = {
      ...invoice,
      status: 'belum_lunas',
    };

    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoice.id ? updated : inv)),
    );
    onVerifyInvoice?.(updated);
  };

  const TOP_TABS: {
    key: ProcurementOpsTabKey;
    label: string;
    count: number;
    Icon: React.ElementType;
  }[] = [
    {
      key: 'permintaan',
      label: 'Permintaan',
      count: permintaanCount,
      Icon: ClipboardList,
    },
    {
      key: 'retur',
      label: 'Retur',
      count: returCount,
      Icon: RotateCcw,
    },
    {
      key: 'faktur',
      label: 'Faktur',
      count: invoices.length,
      Icon: FileText,
    },
    {
      key: 'pembayaran',
      label: 'Pembayaran',
      count: pembayaranCount,
      Icon: Wallet,
    },
    {
      key: 'umur_utang',
      label: 'Umur Utang',
      count: umurUtangCount,
      Icon: Clock,
    },
  ];

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-3.5">
      {/* 1. BARIS TAB NAVIGASI ATAS */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-4 sm:px-5">
        <div
          role="tablist"
          aria-label="Navigasi Jejak Operasional Pengadaan"
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

      {/* 2. KONTEN UTAMA FAKTUR PEMASOK */}
      {activeTab === 'faktur' ? (
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header & Search Bar */}
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  JEJAK OPERASIONAL · TAGIHAN ATAS BARANG DITERIMA
                </p>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                  Faktur pemasok
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Faktur diikat ke baris penerimaan yang sudah diposting.
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
                  <span>Muat Ulang</span>
                </button>

                <button
                  type="button"
                  onClick={openCreateInvoiceModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                  <span>Catat faktur</span>
                </button>
              </div>
            </div>

            {/* Baris Search + Jumlah Rekam */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nomor, pemasok, gudang..."
                  className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Hapus pencarian"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <span className="text-xs font-medium text-slate-500 whitespace-nowrap sm:px-2">
                {filteredInvoices.length} rekam
              </span>
            </div>
          </div>

          {/* Split-Pane Bawah: Tabel / Empty State (Kiri) + Panel Tinjauan (Kanan) */}
          <div className="border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] min-h-[380px]">
            {/* KOLOM KIRI: TABEL FAKTUR & EMPTY STATE */}
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">FAKTUR</th>
                      <th className="px-4 py-3.5">PENERIMAAN</th>
                      <th className="px-4 py-3.5">PEMASOK</th>
                      <th className="px-4 py-3.5">JATUH TEMPO</th>
                      <th className="px-4 py-3.5">SISA</th>
                      <th className="px-5 py-3.5">STATUS</th>
                    </tr>
                  </thead>

                  {filteredInvoices.length > 0 && (
                    <tbody className="divide-y divide-slate-200/70 text-xs">
                      {filteredInvoices.map((inv) => {
                        const isSelected = selectedInvoice?.id === inv.id;
                        const statusMeta = INVOICE_STATUS_META[inv.status];
                        const sisaTagihan = Math.max(
                          0,
                          inv.totalTagihan - inv.totalDibayar,
                        );

                        return (
                          <tr
                            key={inv.id}
                            onClick={() => setSelectedInvoiceId(inv.id)}
                            className={`transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#f0f9fb]/65 border-l-[3px] border-l-[#009bb8]'
                                : 'hover:bg-slate-50/90'
                            }`}
                          >
                            {/* Faktur */}
                            <td className="px-5 py-4 align-middle whitespace-nowrap">
                              <p className="font-extrabold text-[#0f3d56]">
                                {inv.nomorFaktur}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {inv.items.length} baris · {inv.tanggalFaktur}
                              </p>
                            </td>

                            {/* Penerimaan */}
                            <td className="px-4 py-4 align-middle font-semibold text-[#008ba6] whitespace-nowrap">
                              {inv.nomorPenerimaan}
                            </td>

                            {/* Pemasok */}
                            <td className="px-4 py-4 align-middle whitespace-nowrap">
                              <p className="font-medium text-slate-700">
                                {inv.pemasok}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {inv.gudang}
                              </p>
                            </td>

                            {/* Jatuh Tempo */}
                            <td className="px-4 py-4 align-middle text-slate-600 font-medium whitespace-nowrap">
                              {inv.jatuhTempo}
                            </td>

                            {/* Sisa */}
                            <td className="px-4 py-4 align-middle font-bold text-[#0f3d56] tabular-nums whitespace-nowrap">
                              {formatRupiah(sisaTagihan)}
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4 align-middle whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusMeta.badgeClass}`}
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
              </div>

              {/* Empty State Sesuai Gambar Saat Belum Ada Rekam */}
              {filteredInvoices.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-14">
                  <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mb-3.5">
                    <ClipboardList className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <h2 className="text-sm sm:text-[15px] font-bold text-[#0f3d56]">
                    {searchQuery
                      ? 'Rekam faktur tidak ditemukan'
                      : 'Belum ada rekam di sini'}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                    {searchQuery
                      ? 'Coba ubah kata kunci pencarian nomor faktur, pemasok, atau gudang.'
                      : 'Rekam yang tersimpan akan tampil di ruang kerja ini.'}
                  </p>

                  {!searchQuery && (
                    <button
                      type="button"
                      onClick={openCreateInvoiceModal}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.2]" />
                      <span>Mulai rekam</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* KOLOM KANAN: PANEL TINJAUAN REKAM */}
            <aside className="border-t lg:border-t-0 lg:border-l border-slate-200/80 bg-white flex flex-col">
              {!selectedInvoice ? (
                /* Empty State Sesuai Gambar */
                <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 py-10">
                  <ShieldCheck className="w-6 h-6 text-[#008ba6] stroke-[1.8] mb-3" />
                  <h2 className="text-sm sm:text-[15px] font-extrabold text-[#0f3d56]">
                    Pilih rekam untuk ditinjau
                  </h2>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-[270px]">
                    Status, hubungan ke stok/pemasok, dan tindakan yang sesuai
                    kewenangan akan tampil di sini.
                  </p>
                </div>
              ) : (
                /* Detail Faktur Pemasok Terpilih */
                <div className="p-5 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3.5 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-[#008ba6]">
                          DETAIL FAKTUR PEMASOK
                        </span>
                        <h2 className="text-sm sm:text-[15px] font-extrabold text-[#0f3d56] mt-0.5">
                          {selectedInvoice.nomorFaktur}
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Tanggal faktur {selectedInvoice.tanggalFaktur}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceId(null)}
                        aria-label="Tutup panel tinjauan"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ringkasan Keterikatan Penerimaan & Utang */}
                    <div className="mt-3.5 rounded-xl border border-slate-200/80 bg-[#f8fafc] p-3.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Status Faktur
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            INVOICE_STATUS_META[selectedInvoice.status]
                              .badgeClass
                          }`}
                        >
                          {INVOICE_STATUS_META[selectedInvoice.status].label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Referensi Penerimaan
                        </span>
                        <span className="font-bold text-[#008ba6]">
                          {selectedInvoice.nomorPenerimaan}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Pemasok
                        </span>
                        <span className="font-semibold text-slate-700 text-right truncate max-w-[175px]">
                          {selectedInvoice.pemasok}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Jatuh Tempo
                        </span>
                        <span className="font-bold text-slate-700">
                          {selectedInvoice.jatuhTempo}
                        </span>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200/70 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            Total Tagihan
                          </span>
                          <span className="font-semibold text-slate-700 tabular-nums">
                            {formatRupiah(selectedInvoice.totalTagihan)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            Sisa Utang Faktur
                          </span>
                          <span className="text-sm font-extrabold text-[#0f3d56] tabular-nums">
                            {formatRupiah(
                              Math.max(
                                0,
                                selectedInvoice.totalTagihan -
                                  selectedInvoice.totalDibayar,
                              ),
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Baris Penerimaan Terikat */}
                    <div className="mt-4">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Baris Penerimaan Terikat (
                        {selectedInvoice.items.length})
                      </h3>

                      <div className="space-y-2 max-h-[185px] overflow-y-auto pr-0.5">
                        {selectedInvoice.items.map((line) => (
                          <div
                            key={line.id}
                            className="rounded-xl border border-slate-200/80 bg-white p-3 flex items-start justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-[#008ba6]">
                                {line.kodeBarang}
                              </span>
                              <p className="font-bold text-[#0f3d56] leading-snug mt-0.5">
                                {line.namaBarang}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {line.qtyDitagih} {line.satuan} ×{' '}
                                {formatRupiah(line.hargaSatuan)}
                              </p>
                            </div>
                            <span className="font-bold text-slate-700 tabular-nums whitespace-nowrap">
                              {formatRupiah(
                                line.qtyDitagih * line.hargaSatuan,
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedInvoice.catatan && (
                      <p className="mt-3 text-[11px] text-slate-500 bg-slate-50 rounded-lg border border-slate-200/70 px-3 py-2">
                        <strong className="text-slate-600">Catatan:</strong>{' '}
                        {selectedInvoice.catatan}
                      </p>
                    )}
                  </div>

                  {/* Tindakan Sesuai Kewenangan */}
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    {selectedInvoice.status === 'menunggu_verifikasi' ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleVerifyInvoiceClick(selectedInvoice)
                        }
                        className="w-full py-2.5 px-4 rounded-xl bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4 shrink-0" />
                        <span>Verifikasi &amp; Posting Utang</span>
                      </button>
                    ) : selectedInvoice.status === 'belum_lunas' ||
                      selectedInvoice.status === 'dibayar_sebagian' ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (onProceedToPayment) {
                            onProceedToPayment(selectedInvoice);
                          } else {
                            handleSelectTab('pembayaran');
                          }
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                      >
                        <span>Catat Pembayaran Faktur</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    ) : (
                      <div className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-700 text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Faktur pemasok telah lunas</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      ) : (
        /* Placeholder saat Tab Permintaan / Retur / Pembayaran / Umur Utang dipilih */
        <section className="bg-white rounded-xl border border-slate-200/90 p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#0f3d56] capitalize">
            Modul {activeTab.replace('_', ' ')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hubungkan ke tampilan sub-modul{' '}
            <code className="text-[#008ba6]">{activeTab}</code> melalui prop{' '}
            <code className="text-[#008ba6]">onTabChange</code>.
          </p>
        </section>
      )}

      {/* 3. MODAL CATAT FAKTUR PEMASOK */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  TAGIHAN ATAS BARANG DITERIMA
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Catat Faktur Pemasok
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
              onSubmit={handleSubmitCreateInvoice}
              className="p-5 space-y-3.5 text-xs"
            >
              {/* Pilih Penerimaan Terposting */}
              <div>
                <label
                  htmlFor="pilih-grn-faktur"
                  className="block font-bold text-slate-700 mb-1"
                >
                  Baris Penerimaan Terposting
                </label>
                <div className="relative">
                  <select
                    id="pilih-grn-faktur"
                    value={selectedReceivingId}
                    onChange={(e) => handleReceivingChange(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-9 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    {postedReceivings.map((grn) => (
                      <option key={grn.id} value={grn.id}>
                        {grn.nomorPenerimaan} · {grn.pemasok} ({grn.gudang} ·
                        Tempo {grn.tempoHari} hari)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Nomor Faktur, Tanggal Faktur & Jatuh Tempo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Faktur Pemasok
                  </label>
                  <input
                    type="text"
                    required
                    value={formNomorFaktur}
                    onChange={(e) => setFormNomorFaktur(e.target.value)}
                    placeholder="Nomor invoice / faktur pajak..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tanggal Faktur
                  </label>
                  <input
                    type="date"
                    required
                    value={formTanggalFaktur}
                    onChange={(e) =>
                      handleTanggalFakturChange(e.target.value)
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    required
                    value={formJatuhTempo}
                    onChange={(e) => setFormJatuhTempo(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              {/* Rincian Baris Penerimaan yang Ditagih */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">
                    Baris Penerimaan yang Ditagih
                  </label>
                  <span className="text-[11px] font-bold text-[#008ba6] tabular-nums">
                    Total Faktur: {formatRupiah(formCalculatedTotal)}
                  </span>
                </div>

                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-0.5">
                  {formLines.map((line, idx) => (
                    <div
                      key={line.id}
                      className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-2.5 grid grid-cols-1 sm:grid-cols-[1fr_76px_125px] gap-2 items-center"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-[#008ba6]">
                          {line.kodeBarang} · {line.satuan}
                        </p>
                        <p className="font-bold text-[#0f3d56] truncate">
                          {line.namaBarang}
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">
                          Qty
                        </label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={line.qtyDitagih}
                          onChange={(e) =>
                            setFormLines((prev) =>
                              prev.map((r, i) =>
                                i === idx
                                  ? { ...r, qtyDitagih: e.target.value }
                                  : r,
                              ),
                            )
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold focus:outline-none focus:border-[#009bb8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">
                          Harga Satuan (Rp)
                        </label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={line.hargaSatuan}
                          onChange={(e) =>
                            setFormLines((prev) =>
                              prev.map((r, i) =>
                                i === idx
                                  ? { ...r, hargaSatuan: e.target.value }
                                  : r,
                              ),
                            )
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-right font-semibold tabular-nums focus:outline-none focus:border-[#009bb8]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Faktur (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Nomor seri faktur pajak atau keterangan penagihan..."
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simpan Faktur Pemasok</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}