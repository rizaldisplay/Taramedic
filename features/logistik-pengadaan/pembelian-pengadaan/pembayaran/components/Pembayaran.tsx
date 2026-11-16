'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  FileText,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';

export type ProcurementOpsTabKey =
  | 'permintaan'
  | 'retur'
  | 'faktur'
  | 'pembayaran'
  | 'umur_utang';

export type PaymentDecisionStatus =
  | 'draf'
  | 'menunggu_persetujuan'
  | 'disahkan'
  | 'dibatalkan';

export type PaymentMethodType =
  | 'Transfer Bank (Manual)'
  | 'Tunai / Kas Klinik'
  | 'Giro / Cek'
  | 'Virtual Account';

export interface OpenInvoiceOption {
  id: string;
  nomorFaktur: string;
  nomorPenerimaan: string;
  pemasok: string;
  gudang: string;
  jatuhTempo: string;
  sisaTagihan: number;
}

export interface PaymentAllocationLine {
  id: string;
  fakturId: string;
  nomorFaktur: string;
  nomorPenerimaan: string;
  sisaSebelumBayar: number;
  nominalAlokasi: number;
}

export interface SupplierPaymentItem {
  id: string;
  nomorPembayaran: string;
  pemasok: string;
  gudang: string;
  tanggal: string;
  metode: PaymentMethodType;
  referensiInternal?: string;
  totalAlokasi: number;
  status: PaymentDecisionStatus;
  catatan?: string;
  alokasi: PaymentAllocationLine[];
}

const OPEN_SUPPLIER_INVOICES: OpenInvoiceOption[] = [
  {
    id: 'inv-1',
    nomorFaktur: 'INV-20261029-91F40B',
    nomorPenerimaan: 'GRN-20261029-88A12C',
    pemasok: 'PT. Alkesindo Farma Tara',
    gudang: 'Depo Farmasi',
    jatuhTempo: '29 Nov 2026',
    sisaTagihan: 30000000,
  },
  {
    id: 'inv-2',
    nomorFaktur: 'INV-20261029-3C72D1',
    nomorPenerimaan: 'GRN-20261029-41C90E',
    pemasok: 'PT. Alkesindo Farma Tara',
    gudang: 'Depo Farmasi',
    jatuhTempo: '29 Nov 2026',
    sisaTagihan: 1800000,
  },
  {
    id: 'inv-3',
    nomorFaktur: 'INV-20261011-5E18A9',
    nomorPenerimaan: 'GRN-20261011-77D51B',
    pemasok: 'PT. Alkesindo Farma Tara',
    gudang: 'Depo Farmasi',
    jatuhTempo: '11 Nov 2026',
    sisaTagihan: 5600000,
  },
];

const PAYMENT_STATUS_META: Record<
  PaymentDecisionStatus,
  { label: string; badgeClass: string }
> = {
  draf: {
    label: 'Draf',
    badgeClass: 'bg-slate-100 border border-slate-200/80 text-slate-600',
  },
  menunggu_persetujuan: {
    label: 'Menunggu Persetujuan',
    badgeClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  disahkan: {
    label: 'Disahkan · Teralokasi',
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

function formatDateID(dateISO: string): string {
  const date = new Date(dateISO);
  if (Number.isNaN(date.getTime())) return dateISO;
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AlokasiPembayaran({
  initialPayments = [],
  openInvoices = OPEN_SUPPLIER_INVOICES,
  permintaanCount = 3,
  returCount = 0,
  fakturCount = 0,
  umurUtangCount = 0,
  onReload,
  onCreatePayment,
  onApprovePayment,
  onRejectPayment,
  onTabChange,
}: {
  initialPayments?: SupplierPaymentItem[];
  openInvoices?: OpenInvoiceOption[];
  permintaanCount?: number;
  returCount?: number;
  fakturCount?: number;
  umurUtangCount?: number;
  onReload?: () => Promise<void> | void;
  onCreatePayment?: (payment: SupplierPaymentItem) => void;
  onApprovePayment?: (payment: SupplierPaymentItem) => void;
  onRejectPayment?: (payment: SupplierPaymentItem) => void;
  onTabChange?: (tab: ProcurementOpsTabKey) => void;
}) {
  const [activeTab, setActiveTab] =
    useState<ProcurementOpsTabKey>('pembayaran');
  const [payments, setPayments] =
    useState<SupplierPaymentItem[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );
  const [isReloading, setIsReloading] = useState(false);

  // State Modal Catat Pembayaran / Mulai Rekam
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formPemasok, setFormPemasok] = useState('PT. Alkesindo Farma Tara');
  const [formTanggal, setFormTanggal] = useState('2026-11-16');
  const [formMetode, setFormMetode] = useState<PaymentMethodType>(
    'Transfer Bank (Manual)',
  );
  const [formReferensi, setFormReferensi] = useState('');
  const [formCatatan, setFormCatatan] = useState('');
  const [formAllocations, setFormAllocations] = useState<
    {
      fakturId: string;
      nominalAlokasi: string;
    }[]
  >([]);

  const supplierOptions = useMemo(() => {
    const names = Array.from(new Set(openInvoices.map((inv) => inv.pemasok)));
    return names.length > 0 ? names : ['PT. Alkesindo Farma Tara'];
  }, [openInvoices]);

  const invoicesForSelectedSupplier = useMemo(
    () => openInvoices.filter((inv) => inv.pemasok === formPemasok),
    [openInvoices, formPemasok],
  );

  // Filter daftar pembayaran
  const filteredPayments = useMemo(() => {
    if (searchQuery.trim() === '') return payments;
    const q = searchQuery.toLowerCase();

    return payments.filter(
      (item) =>
        item.nomorPembayaran.toLowerCase().includes(q) ||
        item.pemasok.toLowerCase().includes(q) ||
        item.gudang.toLowerCase().includes(q) ||
        item.metode.toLowerCase().includes(q) ||
        item.alokasi.some((a) => a.nomorFaktur.toLowerCase().includes(q)),
    );
  }, [payments, searchQuery]);

  // Rekam terpilih untuk panel kanan
  const selectedPayment = useMemo(
    () => payments.find((p) => p.id === selectedPaymentId) ?? null,
    [payments, selectedPaymentId],
  );

  const formTotalAlokasi = useMemo(() => {
    return formAllocations.reduce(
      (sum, row) => sum + Math.max(0, Number(row.nominalAlokasi) || 0),
      0,
    );
  }, [formAllocations]);

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

  const openCreatePaymentModal = () => {
    const defaultSupplier = supplierOptions[0] ?? 'PT. Alkesindo Farma Tara';
    const matchingInvoices = openInvoices.filter(
      (inv) => inv.pemasok === defaultSupplier,
    );
    const todayISO = new Date().toISOString().slice(0, 10);

    setFormPemasok(defaultSupplier);
    setFormTanggal(todayISO);
    setFormMetode('Transfer Bank (Manual)');
    setFormReferensi('');
    setFormCatatan('');

    if (matchingInvoices.length > 0) {
      setFormAllocations([
        {
          fakturId: matchingInvoices[0].id,
          nominalAlokasi: String(matchingInvoices[0].sisaTagihan),
        },
      ]);
    } else {
      setFormAllocations([]);
    }

    setIsCreateModalOpen(true);
  };

  const handleSupplierSelectChange = (nextSupplier: string) => {
    setFormPemasok(nextSupplier);
    const matching = openInvoices.filter((inv) => inv.pemasok === nextSupplier);
    if (matching.length > 0) {
      setFormAllocations([
        {
          fakturId: matching[0].id,
          nominalAlokasi: String(matching[0].sisaTagihan),
        },
      ]);
    } else {
      setFormAllocations([]);
    }
  };

  const handleAddAllocationRow = () => {
    const usedIds = new Set(formAllocations.map((a) => a.fakturId));
    const nextInvoice =
      invoicesForSelectedSupplier.find((inv) => !usedIds.has(inv.id)) ??
      invoicesForSelectedSupplier[0];

    if (!nextInvoice) return;

    setFormAllocations((prev) => [
      ...prev,
      {
        fakturId: nextInvoice.id,
        nominalAlokasi: String(nextInvoice.sisaTagihan),
      },
    ]);
  };

  const handleRemoveAllocationRow = (idx: number) => {
    if (formAllocations.length <= 1) return;
    setFormAllocations((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();

    const validLines: PaymentAllocationLine[] = formAllocations
      .map((row, idx) => {
        const inv = openInvoices.find((item) => item.id === row.fakturId);
        const nominal = Math.max(0, Number(row.nominalAlokasi) || 0);
        if (!inv || nominal <= 0) return null;

        return {
          id: `alloc-${Date.now()}-${idx}`,
          fakturId: inv.id,
          nomorFaktur: inv.nomorFaktur,
          nomorPenerimaan: inv.nomorPenerimaan,
          sisaSebelumBayar: inv.sisaTagihan,
          nominalAlokasi: nominal,
        };
      })
      .filter((item): item is PaymentAllocationLine => item !== null);

    if (validLines.length === 0) return;

    const totalAlokasi = validLines.reduce(
      (sum, item) => sum + item.nominalAlokasi,
      0,
    );
    const firstInvoice = openInvoices.find(
      (inv) => inv.id === validLines[0].fakturId,
    );

    const datePrefix = formTanggal.replace(/-/g, '');
    const hexSuffix = Math.random().toString(16).slice(2, 10).toUpperCase();

    const created: SupplierPaymentItem = {
      id: `pay-${Date.now()}`,
      nomorPembayaran: `PAY-${datePrefix}-${hexSuffix}`,
      pemasok: formPemasok,
      gudang: firstInvoice?.gudang ?? 'Depo Farmasi',
      tanggal: formatDateID(formTanggal),
      metode: formMetode,
      referensiInternal: formReferensi.trim() || undefined,
      totalAlokasi,
      status: 'menunggu_persetujuan',
      catatan: formCatatan.trim() || undefined,
      alokasi: validLines,
    };

    setPayments((prev) => [created, ...prev]);
    setSelectedPaymentId(created.id);
    onCreatePayment?.(created);
    setIsCreateModalOpen(false);
  };

  const handleApprovePaymentClick = (payment: SupplierPaymentItem) => {
    const updated: SupplierPaymentItem = {
      ...payment,
      status: 'disahkan',
    };

    setPayments((prev) =>
      prev.map((item) => (item.id === payment.id ? updated : item)),
    );
    onApprovePayment?.(updated);
  };

  const handleRejectPaymentClick = (payment: SupplierPaymentItem) => {
    const updated: SupplierPaymentItem = {
      ...payment,
      status: 'dibatalkan',
    };

    setPayments((prev) =>
      prev.map((item) => (item.id === payment.id ? updated : item)),
    );
    onRejectPayment?.(updated);
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
      count: fakturCount,
      Icon: FileText,
    },
    {
      key: 'pembayaran',
      label: 'Pembayaran',
      count: payments.length,
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

      {/* 2. KONTEN UTAMA ALOKASI PEMBAYARAN */}
      {activeTab === 'pembayaran' ? (
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header & Search Bar */}
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  JEJAK OPERASIONAL · KEPUTUSAN PEMBAYARAN
                </p>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                  Alokasi pembayaran
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mencatat keputusan pembayaran dan alokasinya saja. Tidak ada
                  transfer uang atau koneksi bank.
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
                  onClick={openCreatePaymentModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                  <span>Catat pembayaran</span>
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
                {filteredPayments.length} rekam
              </span>
            </div>
          </div>

          {/* Split-Pane Bawah: Tabel / Empty State (Kiri) + Panel Tinjauan (Kanan) */}
          <div className="border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] min-h-[380px]">
            {/* KOLOM KIRI: TABEL PEMBAYARAN & EMPTY STATE */}
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">PEMBAYARAN</th>
                      <th className="px-4 py-3.5">TANGGAL</th>
                      <th className="px-4 py-3.5">METODE</th>
                      <th className="px-4 py-3.5">ALOKASI</th>
                      <th className="px-5 py-3.5">STATUS</th>
                    </tr>
                  </thead>

                  {filteredPayments.length > 0 && (
                    <tbody className="divide-y divide-slate-200/70 text-xs">
                      {filteredPayments.map((pay) => {
                        const isSelected = selectedPayment?.id === pay.id;
                        const statusMeta = PAYMENT_STATUS_META[pay.status];

                        return (
                          <tr
                            key={pay.id}
                            onClick={() => setSelectedPaymentId(pay.id)}
                            className={`transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#f0f9fb]/65 border-l-[3px] border-l-[#009bb8]'
                                : 'hover:bg-slate-50/90'
                            }`}
                          >
                            {/* Pembayaran */}
                            <td className="px-5 py-4 align-middle whitespace-nowrap">
                              <p className="font-extrabold text-[#0f3d56]">
                                {pay.nomorPembayaran}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {pay.pemasok}
                              </p>
                            </td>

                            {/* Tanggal */}
                            <td className="px-4 py-4 align-middle text-slate-600 font-medium whitespace-nowrap">
                              {pay.tanggal}
                            </td>

                            {/* Metode */}
                            <td className="px-4 py-4 align-middle text-slate-700 font-medium whitespace-nowrap">
                              {pay.metode}
                            </td>

                            {/* Alokasi */}
                            <td className="px-4 py-4 align-middle whitespace-nowrap">
                              <p className="font-bold text-[#0f3d56] tabular-nums">
                                {formatRupiah(pay.totalAlokasi)}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {pay.alokasi.length} faktur terikat
                              </p>
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
              {filteredPayments.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-14">
                  <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mb-3.5">
                    <ClipboardList className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <h2 className="text-sm sm:text-[15px] font-bold text-[#0f3d56]">
                    {searchQuery
                      ? 'Rekam pembayaran tidak ditemukan'
                      : 'Belum ada rekam di sini'}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                    {searchQuery
                      ? 'Coba ubah kata kunci pencarian nomor pembayaran, pemasok, atau metode.'
                      : 'Rekam yang tersimpan akan tampil di ruang kerja ini.'}
                  </p>

                  {!searchQuery && (
                    <button
                      type="button"
                      onClick={openCreatePaymentModal}
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
              {!selectedPayment ? (
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
                /* Detail Rekam Pembayaran & Alokasi Terpilih */
                <div className="p-5 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3.5 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-[#008ba6]">
                          KEPUTUSAN &amp; ALOKASI PEMBAYARAN
                        </span>
                        <h2 className="text-sm sm:text-[15px] font-extrabold text-[#0f3d56] mt-0.5">
                          {selectedPayment.nomorPembayaran}
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Dicatat {selectedPayment.tanggal}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentId(null)}
                        aria-label="Tutup panel tinjauan"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ringkasan Pemasok, Metode & Total Alokasi */}
                    <div className="mt-3.5 rounded-xl border border-slate-200/80 bg-[#f8fafc] p-3.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Status Keputusan
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            PAYMENT_STATUS_META[selectedPayment.status]
                              .badgeClass
                          }`}
                        >
                          {PAYMENT_STATUS_META[selectedPayment.status].label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Pemasok
                        </span>
                        <span className="font-semibold text-slate-700 text-right truncate max-w-[175px]">
                          {selectedPayment.pemasok}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Metode Pencatatan
                        </span>
                        <span className="font-semibold text-slate-700">
                          {selectedPayment.metode}
                        </span>
                      </div>

                      {selectedPayment.referensiInternal && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400">
                            No. Referensi / Voucher
                          </span>
                          <span className="font-bold text-[#008ba6]">
                            {selectedPayment.referensiInternal}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70">
                        <span className="text-[11px] text-slate-400">
                          Total Dialokasikan
                        </span>
                        <span className="text-sm font-extrabold text-[#0f3d56] tabular-nums">
                          {formatRupiah(selectedPayment.totalAlokasi)}
                        </span>
                      </div>
                    </div>

                    {/* Daftar Faktur yang Dialokasikan */}
                    <div className="mt-4">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Alokasi ke Faktur Pemasok (
                        {selectedPayment.alokasi.length})
                      </h3>

                      <div className="space-y-2 max-h-[190px] overflow-y-auto pr-0.5">
                        {selectedPayment.alokasi.map((alloc) => (
                          <div
                            key={alloc.id}
                            className="rounded-xl border border-slate-200/80 bg-white p-3 flex items-start justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-[#008ba6]">
                                {alloc.nomorPenerimaan}
                              </span>
                              <p className="font-bold text-[#0f3d56] leading-snug mt-0.5">
                                {alloc.nomorFaktur}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                                Sisa tagihan awal:{' '}
                                {formatRupiah(alloc.sisaSebelumBayar)}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-lg bg-[#f0f9fb] border border-cyan-200/70 font-extrabold text-[#008ba6] tabular-nums whitespace-nowrap">
                              {formatRupiah(alloc.nominalAlokasi)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedPayment.catatan && (
                      <p className="mt-3 text-[11px] text-slate-500 bg-slate-50 rounded-lg border border-slate-200/70 px-3 py-2">
                        <strong className="text-slate-600">Catatan:</strong>{' '}
                        {selectedPayment.catatan}
                      </p>
                    )}
                  </div>

                  {/* Tindakan Sesuai Kewenangan */}
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    {selectedPayment.status === 'menunggu_persetujuan' ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleRejectPaymentClick(selectedPayment)
                          }
                          className="px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 text-xs font-bold text-rose-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Batalkan</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleApprovePaymentClick(selectedPayment)
                          }
                          className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Sahkan Alokasi</span>
                        </button>
                      </div>
                    ) : selectedPayment.status === 'disahkan' ? (
                      <div className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-700 text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Keputusan pembayaran &amp; alokasi disahkan</span>
                      </div>
                    ) : (
                      <div className="w-full py-2.5 px-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-700 text-xs font-bold flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Pencatatan pembayaran dibatalkan</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      ) : (
        /* Placeholder saat Tab Permintaan / Retur / Faktur / Umur Utang dipilih */
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

      {/* 3. MODAL CATAT PEMBAYARAN & ALOKASI */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  KEPUTUSAN PEMBAYARAN
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Catat Alokasi Pembayaran Pemasok
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
              onSubmit={handleSubmitCreatePayment}
              className="p-5 space-y-3.5 text-xs"
            >
              {/* Pemasok, Tanggal & Metode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pemasok
                  </label>
                  <div className="relative">
                    <select
                      value={formPemasok}
                      onChange={(e) =>
                        handleSupplierSelectChange(e.target.value)
                      }
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      {supplierOptions.map((sup) => (
                        <option key={sup} value={sup}>
                          {sup}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tanggal Keputusan
                  </label>
                  <input
                    type="date"
                    required
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Metode Pencatatan
                  </label>
                  <div className="relative">
                    <select
                      value={formMetode}
                      onChange={(e) =>
                        setFormMetode(e.target.value as PaymentMethodType)
                      }
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="Transfer Bank (Manual)">
                        Transfer Bank (Manual)
                      </option>
                      <option value="Tunai / Kas Klinik">
                        Tunai / Kas Klinik
                      </option>
                      <option value="Giro / Cek">Giro / Cek</option>
                      <option value="Virtual Account">Virtual Account</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor Referensi / Voucher Internal (Opsional)
                </label>
                <input
                  type="text"
                  value={formReferensi}
                  onChange={(e) => setFormReferensi(e.target.value)}
                  placeholder="Contoh: BKK-2026-11-004 atau nomor bukti transfer manual..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              {/* Baris Alokasi ke Faktur */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-700">
                      Alokasi ke Faktur Belum Lunas
                    </label>
                    {invoicesForSelectedSupplier.length >
                      formAllocations.length && (
                      <button
                        type="button"
                        onClick={handleAddAllocationRow}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008ba6] hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah faktur</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-[#008ba6] tabular-nums">
                    Total Alokasi: {formatRupiah(formTotalAlokasi)}
                  </span>
                </div>

                {invoicesForSelectedSupplier.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-slate-400">
                    Tidak ada faktur terbuka untuk pemasok ini.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[185px] overflow-y-auto pr-0.5">
                    {formAllocations.map((row, idx) => {
                      const matchedInv = openInvoices.find(
                        (inv) => inv.id === row.fakturId,
                      );

                      return (
                        <div
                          key={`${row.fakturId}-${idx}`}
                          className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-2.5 grid grid-cols-1 sm:grid-cols-[1fr_140px_32px] gap-2 items-center"
                        >
                          <div>
                            <div className="relative">
                              <select
                                value={row.fakturId}
                                onChange={(e) => {
                                  const nextId = e.target.value;
                                  const nextInv = openInvoices.find(
                                    (i) => i.id === nextId,
                                  );
                                  setFormAllocations((prev) =>
                                    prev.map((r, i) =>
                                      i === idx
                                        ? {
                                            fakturId: nextId,
                                            nominalAlokasi: nextInv
                                              ? String(nextInv.sisaTagihan)
                                              : r.nominalAlokasi,
                                          }
                                        : r,
                                    ),
                                  );
                                }}
                                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                              >
                                {invoicesForSelectedSupplier.map((inv) => (
                                  <option key={inv.id} value={inv.id}>
                                    {inv.nomorFaktur} (Sisa{' '}
                                    {formatRupiah(inv.sisaTagihan)})
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            {matchedInv && (
                              <p className="text-[10px] text-slate-400 mt-1 px-0.5">
                                {matchedInv.nomorPenerimaan} · Jatuh tempo{' '}
                                {matchedInv.jatuhTempo}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">
                              Nominal Alokasi (Rp)
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={matchedInv?.sisaTagihan}
                              required
                              value={row.nominalAlokasi}
                              onChange={(e) =>
                                setFormAllocations((prev) =>
                                  prev.map((r, i) =>
                                    i === idx
                                      ? { ...r, nominalAlokasi: e.target.value }
                                      : r,
                                  ),
                                )
                              }
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-right font-bold tabular-nums focus:outline-none focus:border-[#009bb8]"
                            />
                          </div>

                          <button
                            type="button"
                            disabled={formAllocations.length <= 1}
                            onClick={() => handleRemoveAllocationRow(idx)}
                            title="Hapus alokasi faktur"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer justify-self-end"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Keputusan Pembayaran (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Catatan jadwal pencairan atau keterangan alokasi utang..."
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
                  <span>Simpan Alokasi Pembayaran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}