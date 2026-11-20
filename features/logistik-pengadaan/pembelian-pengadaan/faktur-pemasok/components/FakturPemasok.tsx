'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';

export type SupplierInvoiceStatus =
  | 'draft'
  | 'belum_dibayar'
  | 'dibayar_sebagian'
  | 'lunas';

export interface SupplierInvoiceLineItem {
  id: string;
  namaProduk: string;
  qty: number;
  satuan: string;
  hargaSatuan: number;
}

export interface SupplierInvoiceItem {
  id: string;
  nomorFaktur: string;
  nomorPenerimaan: string;
  pemasok: string;
  gudang: string;
  tanggalFakturLabel: string;
  jatuhTempoLabel: string;
  totalTagihan: number;
  sisaTagihan: number;
  status: SupplierInvoiceStatus;
  catatan?: string;
  items: SupplierInvoiceLineItem[];
}

const INVOICE_STATUS_META: Record<
  SupplierInvoiceStatus,
  { label: string; pillClass: string }
> = {
  draft: {
    label: 'Draft',
    pillClass: 'bg-slate-100 border border-slate-200/80 text-slate-600',
  },
  belum_dibayar: {
    label: 'Belum Dibayar',
    pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  dibayar_sebagian: {
    label: 'Dibayar Sebagian',
    pillClass: 'bg-[#edf7fc] border border-[#b8e6ef] text-[#008ba6]',
  },
  lunas: {
    label: 'Lunas',
    pillClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
};

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

export default function FakturPemasok({
  initialInvoices = [],
  onReload,
  onCreateInvoice,
  onMarkPaid,
}: {
  initialInvoices?: SupplierInvoiceItem[];
  onReload?: () => Promise<void> | void;
  onCreateInvoice?: (invoice: SupplierInvoiceItem) => void;
  onMarkPaid?: (invoice: SupplierInvoiceItem) => void;
}) {
  const [invoices, setInvoices] =
    useState<SupplierInvoiceItem[]>(initialInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isReloading, setIsReloading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State Form Catat Faktur Pemasok
  const [nomorFaktur, setNomorFaktur] = useState('');
  const [nomorPenerimaan, setNomorPenerimaan] = useState(
    'GR-20261029-10CCA3A6',
  );
  const [pemasok, setPemasok] = useState('PT. Alkesindo Farma Tara');
  const [gudang, setGudang] = useState('Depo Farmasi');
  const [jatuhTempoLabel, setJatuhTempoLabel] = useState('20 Des 2026');
  const [namaProduk, setNamaProduk] = useState('');
  const [qty, setQty] = useState<number>(60);
  const [satuan, setSatuan] = useState('Tablet');
  const [hargaSatuan, setHargaSatuan] = useState<number>(500000);
  const [catatan, setCatatan] = useState('');

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter((inv) => {
      return (
        inv.nomorFaktur.toLowerCase().includes(q) ||
        inv.nomorPenerimaan.toLowerCase().includes(q) ||
        inv.pemasok.toLowerCase().includes(q) ||
        inv.gudang.toLowerCase().includes(q)
      );
    });
  }, [invoices, searchQuery]);

  const selectedInvoice = useMemo(() => {
    if (!selectedInvoiceId) return null;
    return invoices.find((i) => i.id === selectedInvoiceId) ?? null;
  }, [invoices, selectedInvoiceId]);

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
    if (!namaProduk.trim() || !nomorPenerimaan.trim()) return;

    const now = new Date();
    const suffix = Math.random().toString(16).substring(2, 8).toUpperCase();
    const invNumber =
      nomorFaktur.trim() || `INV-${now.getFullYear()}-${suffix}`;

    const cleanQty = Math.max(1, Number(qty) || 1);
    const cleanPrice = Math.max(0, Number(hargaSatuan) || 0);
    const total = cleanQty * cleanPrice;

    const created: SupplierInvoiceItem = {
      id: `inv-${Date.now()}`,
      nomorFaktur: invNumber,
      nomorPenerimaan: nomorPenerimaan.trim(),
      pemasok: pemasok.trim() || 'Pemasok Umum',
      gudang: gudang.trim() || 'Depo Farmasi',
      tanggalFakturLabel: formatDateIndoShort(now),
      jatuhTempoLabel: jatuhTempoLabel.trim() || formatDateIndoShort(now),
      totalTagihan: total,
      sisaTagihan: total,
      status: 'belum_dibayar',
      catatan: catatan.trim() || undefined,
      items: [
        {
          id: `iitm-${Date.now()}`,
          namaProduk: namaProduk.trim(),
          qty: cleanQty,
          satuan: satuan.trim() || 'Unit',
          hargaSatuan: cleanPrice,
        },
      ],
    };

    setInvoices((prev) => [created, ...prev]);
    setSelectedInvoiceId(created.id);
    onCreateInvoice?.(created);

    setNomorFaktur('');
    setNamaProduk('');
    setCatatan('');
    setIsCreateModalOpen(false);
  };

  const handleMarkPaidClick = () => {
    if (!selectedInvoice) return;
    const updated: SupplierInvoiceItem = {
      ...selectedInvoice,
      sisaTagihan: 0,
      status: 'lunas',
    };
    setInvoices((prev) =>
      prev.map((item) => (item.id === selectedInvoice.id ? updated : item)),
    );
    onMarkPaid?.(updated);
  };

  const selectedStatusMeta = selectedInvoice
    ? INVOICE_STATUS_META[selectedInvoice.status]
    : null;

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* ===================================================================
            1. HEADER HALAMAN: EYEBROW, JUDUL, SUBJUDUL & TOMBOL KANAN ATAS
           =================================================================== */}
        <div className="px-6 pt-5 pb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              JEJAK OPERASIONAL &middot; TAGIHAN ATAS BARANG DITERIMA
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5">
              Faktur pemasok
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Faktur diikat ke baris penerimaan yang sudah diposting.
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
              <span>Catat faktur</span>
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
                aria-label="Hapus pencarian faktur"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-xs text-slate-400 tabular-nums shrink-0">
            {filteredInvoices.length} rekam
          </span>
        </div>

        {/* ===================================================================
            3. SPLIT LAYOUT: RUANG KERJA FAKTUR KIRI & PANEL TINJAUAN KANAN
           =================================================================== */}
        <div className="border-t border-slate-200/80 grid grid-cols-1 xl:grid-cols-[1fr_300px] min-h-[450px]">
          {/* KOLOM KIRI: HEADER TABEL & EMPTY STATE / LIST REKAM */}
          <div className="flex flex-col border-b xl:border-b-0 xl:border-r border-slate-200/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="pl-6 pr-3 py-3">FAKTUR</th>
                    <th className="px-3 py-3">PENERIMAAN</th>
                    <th className="px-3 py-3">PEMASOK</th>
                    <th className="px-3 py-3">JATUH TEMPO</th>
                    <th className="px-3 py-3">SISA</th>
                    <th className="pl-3 pr-6 py-3">STATUS</th>
                  </tr>
                </thead>

                {filteredInvoices.length > 0 && (
                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {filteredInvoices.map((inv) => {
                      const isSelected = selectedInvoice?.id === inv.id;
                      const statusMeta = INVOICE_STATUS_META[inv.status];

                      return (
                        <tr
                          key={inv.id}
                          onClick={() => setSelectedInvoiceId(inv.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#edf7fc]/85'
                              : 'bg-white hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="pl-6 pr-3 py-4 align-middle whitespace-nowrap">
                            <p className="font-mono font-bold text-[#0f3d56]">
                              {inv.nomorFaktur}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {inv.gudang} &middot; {inv.tanggalFakturLabel}
                            </p>
                          </td>

                          <td className="px-3 py-4 align-middle font-mono text-xs font-semibold text-[#0f3d56] whitespace-nowrap">
                            {inv.nomorPenerimaan}
                          </td>

                          <td className="px-3 py-4 align-middle font-semibold text-[#0f3d56] whitespace-nowrap">
                            {inv.pemasok}
                          </td>

                          <td className="px-3 py-4 align-middle text-[#0f3d56] tabular-nums whitespace-nowrap">
                            {inv.jatuhTempoLabel}
                          </td>

                          <td className="px-3 py-4 align-middle font-extrabold text-[#0f3d56] tabular-nums whitespace-nowrap">
                            {formatRupiah(inv.sisaTagihan)}
                          </td>

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
            </div>

            {/* Empty State "Belum ada rekam di sini" saat data kosong */}
            {filteredInvoices.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center mb-3">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <p className="text-xs font-extrabold text-[#0f3d56]">
                  Belum ada rekam di sini
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Rekam yang tersimpan akan tampil di ruang kerja ini.
                </p>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mulai rekam</span>
                </button>
              </div>
            )}
          </div>

          {/* KOLOM KANAN: PILIH REKAM UNTUK DITINJAU / DETAIL FAKTUR TERPILIH */}
          <aside className="bg-white p-5 flex flex-col text-xs">
            {selectedInvoice && selectedStatusMeta ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      REKAM FAKTUR TERPILIH
                    </p>
                    <h2 className="text-sm font-extrabold font-mono text-[#0f3d56] mt-1">
                      {selectedInvoice.nomorFaktur}
                    </h2>
                    <div className="mt-1.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${selectedStatusMeta.pillClass}`}
                      >
                        {selectedStatusMeta.label}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceId(null)}
                    aria-label="Tutup detail faktur"
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Penerimaan</span>
                    <span className="font-mono font-bold text-[#0f3d56]">
                      {selectedInvoice.nomorPenerimaan}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Pemasok</span>
                    <span className="font-bold text-[#0f3d56] text-right">
                      {selectedInvoice.pemasok}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Jatuh tempo</span>
                    <span className="font-bold text-[#0f3d56] tabular-nums">
                      {selectedInvoice.jatuhTempoLabel}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Total tagihan</span>
                    <span className="font-bold text-[#0f3d56] tabular-nums">
                      {formatRupiah(selectedInvoice.totalTagihan)}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Sisa tagihan</span>
                    <span className="font-extrabold text-[#0f3d56] tabular-nums">
                      {formatRupiah(selectedInvoice.sisaTagihan)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedInvoice.items.map((itm) => (
                    <div
                      key={itm.id}
                      className="rounded-xl border border-[#b8e6ef] bg-[#edf7fc]/65 p-3 space-y-1"
                    >
                      <p className="font-bold text-[#0f3d56]">
                        {itm.namaProduk}
                      </p>
                      <p className="text-[11px] text-slate-600 tabular-nums">
                        {itm.qty} {itm.satuan} &times;{' '}
                        {formatRupiah(itm.hargaSatuan)}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedInvoice.catatan && (
                  <p className="text-[11px] text-slate-500">
                    {selectedInvoice.catatan}
                  </p>
                )}

                {selectedInvoice.sisaTagihan > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleMarkPaidClick}
                      className="w-full py-2 px-3 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white text-[11px] font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tandai Lunas</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-2.5" />
                <h2 className="text-xs font-extrabold text-[#0f3d56]">
                  Pilih rekam untuk ditinjau
                </h2>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Status, hubungan ke stok/pemasok, dan tindakan yang sesuai
                  kewenangan akan tampil di sini.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* =====================================================================
          4. MODAL CATAT FAKTUR PEMASOK
         ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  FAKTUR PEMASOK BARU
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Catat Tagihan dari Penerimaan Terposting
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
                    Nomor Faktur
                  </label>
                  <input
                    type="text"
                    value={nomorFaktur}
                    onChange={(e) => setNomorFaktur(e.target.value)}
                    placeholder="Contoh: INV-2026-001"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Nomor Penerimaan (Diposting)
                  </label>
                  <input
                    type="text"
                    required
                    value={nomorPenerimaan}
                    onChange={(e) => setNomorPenerimaan(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    Gudang
                  </label>
                  <input
                    type="text"
                    required
                    value={gudang}
                    onChange={(e) => setGudang(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Jatuh Tempo
                  </label>
                  <input
                    type="text"
                    required
                    value={jatuhTempoLabel}
                    onChange={(e) => setJatuhTempoLabel(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_0.6fr_0.7fr_0.9fr] gap-3">
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
                    Qty
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value) || 1)}
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

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Harga Satuan
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={hargaSatuan}
                    onChange={(e) =>
                      setHargaSatuan(Number(e.target.value) || 0)
                    }
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
                  Simpan Faktur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}