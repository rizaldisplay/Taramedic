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
  PackageMinus,
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

export type SupplierReturnStatus =
  | 'draf'
  | 'menunggu_persetujuan'
  | 'disetujui'
  | 'ditolak';

export interface PostedReceivingOption {
  id: string;
  nomorPenerimaan: string;
  nomorPO: string;
  pemasok: string;
  gudang: string;
  tanggalPosting: string;
  items: {
    kodeBarang: string;
    namaBarang: string;
    satuan: string;
    qtyDiterima: number;
    noBatch: string;
  }[];
}

export interface SupplierReturnLineItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  noBatch: string;
  qtyRetur: number;
  satuan: string;
  alasanItem: string;
}

export interface SupplierReturnItem {
  id: string;
  nomorRetur: string;
  nomorPenerimaan: string;
  pemasok: string;
  gudang: string;
  tanggalRetur: string;
  alasanUtama: string;
  status: SupplierReturnStatus;
  stokNegatifDibukukan: boolean;
  catatan?: string;
  items: SupplierReturnLineItem[];
}

const POSTED_RECEIVINGS: PostedReceivingOption[] = [
  {
    id: 'grn-1',
    nomorPenerimaan: 'GRN-20261029-88A12C',
    nomorPO: 'PO-20261029-E247633F',
    pemasok: 'PT. Alkesindo Farma Tara',
    gudang: 'Depo Farmasi',
    tanggalPosting: '29 Okt 2026',
    items: [
      {
        kodeBarang: 'ALK-0102',
        namaBarang: 'Paket Alat Kesehatan & Habis Pakai Klinik',
        satuan: 'Paket',
        qtyDiterima: 10,
        noBatch: 'BTH-2026-09A',
      },
    ],
  },
  {
    id: 'grn-2',
    nomorPenerimaan: 'GRN-20261029-41C90E',
    nomorPO: 'PO-20261029-D3B7A5AC',
    pemasok: 'PT. Alkesindo Farma Tara',
    gudang: 'Depo Farmasi',
    tanggalPosting: '29 Okt 2026',
    items: [
      {
        kodeBarang: 'OBT-0048',
        namaBarang: 'Amoxicillin 500 mg Kaplet (Box 100)',
        satuan: 'Box',
        qtyDiterima: 30,
        noBatch: 'AMX-2610-02',
      },
    ],
  },
  {
    id: 'grn-3',
    nomorPenerimaan: 'GRN-20261011-77D51B',
    nomorPO: 'PO-20261011-A0EA6FA5',
    pemasok: 'PT. Alkesindo Farma Tara',
    gudang: 'Depo Farmasi',
    tanggalPosting: '11 Okt 2026',
    items: [
      {
        kodeBarang: 'BHP-0045',
        namaBarang: 'Spuit Disposible 3 cc OneMed (Box 100)',
        satuan: 'Box',
        qtyDiterima: 50,
        noBatch: 'SPT-2610-11',
      },
      {
        kodeBarang: 'BHP-0019',
        namaBarang: 'Alkohol Swab Steril (Box 100)',
        satuan: 'Box',
        qtyDiterima: 100,
        noBatch: 'ALK-2610-08',
      },
    ],
  },
];

const RETURN_STATUS_META: Record<
  SupplierReturnStatus,
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
  disetujui: {
    label: 'Disetujui · Stok Dibukukan',
    badgeClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  ditolak: {
    label: 'Ditolak',
    badgeClass: 'bg-rose-50 border border-rose-200/80 text-rose-700',
  },
};

export default function ReturPemasok({
  initialReturns = [],
  postedReceivings = POSTED_RECEIVINGS,
  permintaanCount = 3,
  fakturCount = 0,
  pembayaranCount = 0,
  umurUtangCount = 0,
  onReload,
  onCreateReturn,
  onApproveReturn,
  onRejectReturn,
  onTabChange,
}: {
  initialReturns?: SupplierReturnItem[];
  postedReceivings?: PostedReceivingOption[];
  permintaanCount?: number;
  fakturCount?: number;
  pembayaranCount?: number;
  umurUtangCount?: number;
  onReload?: () => Promise<void> | void;
  onCreateReturn?: (ret: SupplierReturnItem) => void;
  onApproveReturn?: (ret: SupplierReturnItem) => void;
  onRejectReturn?: (ret: SupplierReturnItem) => void;
  onTabChange?: (tab: ProcurementOpsTabKey) => void;
}) {
  const [activeTab, setActiveTab] = useState<ProcurementOpsTabKey>('retur');
  const [returns, setReturns] = useState<SupplierReturnItem[]>(initialReturns);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  // State Modal Buat Retur / Mulai Rekam
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReceivingId, setSelectedReceivingId] = useState<string>(
    postedReceivings[0]?.id ?? '',
  );
  const [formAlasanUtama, setFormAlasanUtama] = useState(
    'Kemasan cacat / rusak saat penerimaan',
  );
  const [formCatatan, setFormCatatan] = useState('');
  const [formLines, setFormLines] = useState<
    {
      kodeBarang: string;
      namaBarang: string;
      noBatch: string;
      qtyRetur: string;
      satuan: string;
      alasanItem: string;
    }[]
  >([]);

  // Filter daftar retur
  const filteredReturns = useMemo(() => {
    if (searchQuery.trim() === '') return returns;
    const q = searchQuery.toLowerCase();

    return returns.filter(
      (item) =>
        item.nomorRetur.toLowerCase().includes(q) ||
        item.nomorPenerimaan.toLowerCase().includes(q) ||
        item.pemasok.toLowerCase().includes(q) ||
        item.gudang.toLowerCase().includes(q),
    );
  }, [returns, searchQuery]);

  // Rekam retur terpilih pada panel kanan
  const selectedReturn = useMemo(
    () => returns.find((r) => r.id === selectedReturnId) ?? null,
    [returns, selectedReturnId],
  );

  const selectedReceivingObj = useMemo(
    () =>
      postedReceivings.find((grn) => grn.id === selectedReceivingId) ??
      postedReceivings[0] ??
      null,
    [postedReceivings, selectedReceivingId],
  );

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

  const openCreateReturnModal = () => {
    const defaultGrn = postedReceivings[0] ?? null;
    if (defaultGrn) {
      setSelectedReceivingId(defaultGrn.id);
      setFormLines(
        defaultGrn.items.map((it) => ({
          kodeBarang: it.kodeBarang,
          namaBarang: it.namaBarang,
          noBatch: it.noBatch,
          qtyRetur: '1',
          satuan: it.satuan,
          alasanItem: 'Kemasan penyok / segel terbuka',
        })),
      );
    } else {
      setFormLines([]);
    }
    setFormAlasanUtama('Kemasan cacat / rusak saat penerimaan');
    setFormCatatan('');
    setIsCreateModalOpen(true);
  };

  const handleReceivingDropdownChange = (grnId: string) => {
    setSelectedReceivingId(grnId);
    const found = postedReceivings.find((g) => g.id === grnId);
    if (!found) return;

    setFormLines(
      found.items.map((it) => ({
        kodeBarang: it.kodeBarang,
        namaBarang: it.namaBarang,
        noBatch: it.noBatch,
        qtyRetur: '1',
        satuan: it.satuan,
        alasanItem: 'Kemasan penyok / segel terbuka',
      })),
    );
  };

  const handleRemoveReturnLine = (idx: number) => {
    if (formLines.length <= 1) return;
    setFormLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitNewReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReceivingObj) return;

    const validLines = formLines.filter(
      (l) => l.namaBarang.trim() !== '' && Number(l.qtyRetur) > 0,
    );
    if (validLines.length === 0) return;

    const todayLabel = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const hexSuffix = Math.random().toString(16).slice(2, 10).toUpperCase();

    const created: SupplierReturnItem = {
      id: `ret-${Date.now()}`,
      nomorRetur: `RTR-${datePrefix}-${hexSuffix}`,
      nomorPenerimaan: selectedReceivingObj.nomorPenerimaan,
      pemasok: selectedReceivingObj.pemasok,
      gudang: selectedReceivingObj.gudang,
      tanggalRetur: todayLabel,
      alasanUtama: formAlasanUtama,
      status: 'menunggu_persetujuan',
      stokNegatifDibukukan: false,
      catatan: formCatatan.trim() || undefined,
      items: validLines.map((line, idx) => ({
        id: `reti-${Date.now()}-${idx}`,
        kodeBarang: line.kodeBarang,
        namaBarang: line.namaBarang,
        noBatch: line.noBatch,
        qtyRetur: Math.max(1, Number(line.qtyRetur) || 1),
        satuan: line.satuan,
        alasanItem: line.alasanItem.trim() || formAlasanUtama,
      })),
    };

    setReturns((prev) => [created, ...prev]);
    setSelectedReturnId(created.id);
    onCreateReturn?.(created);
    setIsCreateModalOpen(false);
  };

  const handleApproveAndPostNegativeStock = (ret: SupplierReturnItem) => {
    const updated: SupplierReturnItem = {
      ...ret,
      status: 'disetujui',
      stokNegatifDibukukan: true,
    };

    setReturns((prev) =>
      prev.map((item) => (item.id === ret.id ? updated : item)),
    );
    onApproveReturn?.(updated);
  };

  const handleRejectReturnClick = (ret: SupplierReturnItem) => {
    const updated: SupplierReturnItem = {
      ...ret,
      status: 'ditolak',
      stokNegatifDibukukan: false,
    };

    setReturns((prev) =>
      prev.map((item) => (item.id === ret.id ? updated : item)),
    );
    onRejectReturn?.(updated);
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
      count: returns.length,
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

      {/* 2. KONTEN UTAMA RETUR PEMASOK */}
      {activeTab === 'retur' ? (
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header & Search Bar */}
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  JEJAK OPERASIONAL · PENGEMBALIAN KE PEMASOK
                </p>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                  Retur pemasok
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Retur hanya dari penerimaan yang sudah diposting; persetujuan
                  membukukan pergerakan stok negatif tersendiri.
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
                  onClick={openCreateReturnModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                  <span>Buat retur</span>
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
                {filteredReturns.length} rekam
              </span>
            </div>
          </div>

          {/* Split-Pane Bawah: Tabel / Empty State (Kiri) + Panel Tinjauan (Kanan) */}
          <div className="border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] min-h-[380px]">
            {/* KOLOM KIRI: TABEL RETUR & EMPTY STATE */}
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[660px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">RETUR</th>
                      <th className="px-4 py-3.5">PENERIMAAN</th>
                      <th className="px-4 py-3.5">PEMASOK</th>
                      <th className="px-4 py-3.5">GUDANG</th>
                      <th className="px-5 py-3.5">STATUS</th>
                    </tr>
                  </thead>

                  {filteredReturns.length > 0 && (
                    <tbody className="divide-y divide-slate-200/70 text-xs">
                      {filteredReturns.map((ret) => {
                        const isSelected = selectedReturn?.id === ret.id;
                        const statusMeta = RETURN_STATUS_META[ret.status];

                        return (
                          <tr
                            key={ret.id}
                            onClick={() => setSelectedReturnId(ret.id)}
                            className={`transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#f0f9fb]/65 border-l-[3px] border-l-[#009bb8]'
                                : 'hover:bg-slate-50/90'
                            }`}
                          >
                            {/* Retur */}
                            <td className="px-5 py-4 align-middle whitespace-nowrap">
                              <p className="font-extrabold text-[#0f3d56]">
                                {ret.nomorRetur}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {ret.items.length} item · {ret.tanggalRetur}
                              </p>
                            </td>

                            {/* Penerimaan */}
                            <td className="px-4 py-4 align-middle font-semibold text-[#008ba6] whitespace-nowrap">
                              {ret.nomorPenerimaan}
                            </td>

                            {/* Pemasok */}
                            <td className="px-4 py-4 align-middle font-medium text-slate-700 whitespace-nowrap">
                              {ret.pemasok}
                            </td>

                            {/* Gudang */}
                            <td className="px-4 py-4 align-middle text-slate-600 font-medium whitespace-nowrap">
                              {ret.gudang}
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
              {filteredReturns.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-14">
                  <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mb-3.5">
                    <ClipboardList className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <h2 className="text-sm sm:text-[15px] font-bold text-[#0f3d56]">
                    {searchQuery
                      ? 'Rekam retur tidak ditemukan'
                      : 'Belum ada rekam di sini'}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                    {searchQuery
                      ? 'Coba ubah kata kunci pencarian nomor retur, pemasok, atau gudang.'
                      : 'Rekam yang tersimpan akan tampil di ruang kerja ini.'}
                  </p>

                  {!searchQuery && (
                    <button
                      type="button"
                      onClick={openCreateReturnModal}
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
              {!selectedReturn ? (
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
                /* Detail Rekam Retur Terpilih */
                <div className="p-5 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3.5 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-[#008ba6]">
                          DETAIL RETUR PEMASOK
                        </span>
                        <h2 className="text-sm sm:text-[15px] font-extrabold text-[#0f3d56] mt-0.5">
                          {selectedReturn.nomorRetur}
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Dibuat {selectedReturn.tanggalRetur}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedReturnId(null)}
                        aria-label="Tutup panel tinjauan"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Hubungan ke Penerimaan, Stok & Pemasok */}
                    <div className="mt-3.5 rounded-xl border border-slate-200/80 bg-[#f8fafc] p-3.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Status Retur
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            RETURN_STATUS_META[selectedReturn.status].badgeClass
                          }`}
                        >
                          {RETURN_STATUS_META[selectedReturn.status].label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Referensi Penerimaan
                        </span>
                        <span className="font-bold text-[#008ba6]">
                          {selectedReturn.nomorPenerimaan}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Pemasok
                        </span>
                        <span className="font-semibold text-slate-700 text-right truncate max-w-[175px]">
                          {selectedReturn.pemasok}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Gudang Asal
                        </span>
                        <span className="font-bold text-[#0f3d56]">
                          {selectedReturn.gudang}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                        <span className="text-[11px] text-slate-400">
                          Jurnal Stok Negatif
                        </span>
                        <span
                          className={`font-bold ${
                            selectedReturn.stokNegatifDibukukan
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {selectedReturn.stokNegatifDibukukan
                            ? 'Sudah Dibukukan'
                            : 'Belum Dibukukan'}
                        </span>
                      </div>
                    </div>

                    {/* Rincian Item yang Diretur */}
                    <div className="mt-4">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Item Dikembalikan ({selectedReturn.items.length})
                      </h3>

                      <div className="space-y-2 max-h-[190px] overflow-y-auto pr-0.5">
                        {selectedReturn.items.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-slate-200/80 bg-white p-3 flex items-start justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-[#008ba6]">
                                {item.kodeBarang} · Batch {item.noBatch}
                              </p>
                              <p className="font-bold text-[#0f3d56] leading-snug mt-0.5">
                                {item.namaBarang}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Alasan: {item.alasanItem}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200/70 font-extrabold text-rose-700 whitespace-nowrap">
                              -{item.qtyRetur} {item.satuan}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedReturn.catatan && (
                      <p className="mt-3 text-[11px] text-slate-500 bg-slate-50 rounded-lg border border-slate-200/70 px-3 py-2">
                        <strong className="text-slate-600">Catatan:</strong>{' '}
                        {selectedReturn.catatan}
                      </p>
                    )}
                  </div>

                  {/* Tindakan Sesuai Kewenangan */}
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    {selectedReturn.status === 'menunggu_persetujuan' ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleRejectReturnClick(selectedReturn)
                          }
                          className="px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 text-xs font-bold text-rose-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleApproveAndPostNegativeStock(selectedReturn)
                          }
                          className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <PackageMinus className="w-4 h-4 shrink-0" />
                          <span>Setujui &amp; Bukukan Stok</span>
                        </button>
                      </div>
                    ) : selectedReturn.status === 'disetujui' ? (
                      <div className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-700 text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Pergerakan stok negatif telah dibukukan</span>
                      </div>
                    ) : (
                      <div className="w-full py-2.5 px-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-700 text-xs font-bold flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Pengajuan retur ditolak</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      ) : (
        /* Placeholder saat Tab Permintaan / Faktur / Pembayaran / Umur Utang dipilih */
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

      {/* 3. MODAL BUAT RETUR PEMASOK */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  PENGEMBALIAN KE PEMASOK
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Buat Dokumen Retur Pemasok
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
              onSubmit={handleSubmitNewReturn}
              className="p-5 space-y-3.5 text-xs"
            >
              {/* Pilih Penerimaan yang Sudah Diposting */}
              <div>
                <label
                  htmlFor="pilih-grn-retur"
                  className="block font-bold text-slate-700 mb-1"
                >
                  Penerimaan Terposting (Sumber Retur)
                </label>
                <div className="relative">
                  <select
                    id="pilih-grn-retur"
                    value={selectedReceivingId}
                    onChange={(e) =>
                      handleReceivingDropdownChange(e.target.value)
                    }
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-9 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    {postedReceivings.map((grn) => (
                      <option key={grn.id} value={grn.id}>
                        {grn.nomorPenerimaan} · {grn.pemasok} ({grn.gudang} ·{' '}
                        {grn.tanggalPosting})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Info Otomatis Pemasok, Gudang & Alasan Utama */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pemasok
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedReceivingObj?.pemasok ?? '-'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Gudang Asal
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedReceivingObj?.gudang ?? '-'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alasan Utama
                  </label>
                  <div className="relative">
                    <select
                      value={formAlasanUtama}
                      onChange={(e) => setFormAlasanUtama(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="Kemasan cacat / rusak saat penerimaan">
                        Kemasan cacat / rusak
                      </option>
                      <option value="Mendekati tanggal kedaluwarsa (ED)">
                        Mendekati kedaluwarsa (ED)
                      </option>
                      <option value="Tidak sesuai spesifikasi pesanan (PO)">
                        Tidak sesuai spesifikasi PO
                      </option>
                      <option value="Penarikan batch dari prinsipal">
                        Recall / penarikan batch
                      </option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Daftar Item yang Akan Diretur */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Rincian Barang yang Dikembalikan
                </label>

                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-0.5">
                  {formLines.map((line, idx) => (
                    <div
                      key={`${line.kodeBarang}-${idx}`}
                      className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-2.5 grid grid-cols-1 sm:grid-cols-[1fr_95px_72px_32px] gap-2 items-center"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-[#008ba6]">
                          {line.kodeBarang} · Batch {line.noBatch}
                        </p>
                        <p className="font-bold text-[#0f3d56] truncate">
                          {line.namaBarang}
                        </p>
                      </div>

                      <input
                        type="text"
                        value={line.alasanItem}
                        onChange={(e) =>
                          setFormLines((prev) =>
                            prev.map((r, i) =>
                              i === idx
                                ? { ...r, alasanItem: e.target.value }
                                : r,
                            ),
                          )
                        }
                        placeholder="Alasan..."
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#009bb8]"
                      />

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={1}
                          required
                          value={line.qtyRetur}
                          onChange={(e) =>
                            setFormLines((prev) =>
                              prev.map((r, i) =>
                                i === idx
                                  ? { ...r, qtyRetur: e.target.value }
                                  : r,
                              ),
                            )
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold focus:outline-none focus:border-[#009bb8]"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={formLines.length <= 1}
                        onClick={() => handleRemoveReturnLine(idx)}
                        title="Hapus baris item"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer justify-self-end"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Nomor berita acara pengembalian atau keterangan ke pemasok..."
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
                  <span>Simpan &amp; Ajukan Retur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}