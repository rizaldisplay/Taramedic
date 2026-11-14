'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  FileText,
  Package,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';

export type ProcurementOpsTabKey =
  | 'permintaan'
  | 'retur'
  | 'faktur'
  | 'pembayaran'
  | 'umur_utang';

export type PurchaseRequestStatus =
  | 'draf'
  | 'menunggu_tinjauan'
  | 'disetujui'
  | 'ditolak'
  | 'menjadi_po';

export type PurchaseRequestPriority = 'Normal' | 'Mendesak' | 'Rutin';

export interface PurchaseRequestLineItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  jumlah: number;
  satuan: string;
  stokSaatIni: number;
}

export interface PurchaseRequestItem {
  id: string;
  nomorPR: string;
  untuk: string;
  gudang: string;
  pemasokRekomendasi?: string;
  tanggal: string;
  prioritas: PurchaseRequestPriority;
  status: PurchaseRequestStatus;
  catatan?: string;
  nomorPO?: string;
  items: PurchaseRequestLineItem[];
}

const DEFAULT_PURCHASE_REQUESTS: PurchaseRequestItem[] = [
  {
    id: 'pr-1',
    nomorPR: 'PR-20261029-3F278ECB',
    untuk: '—',
    gudang: 'Depo Farmasi',
    pemasokRekomendasi: 'PT. Alkesindo Farma Tara',
    tanggal: '29 Okt 2026',
    prioritas: 'Normal',
    status: 'disetujui',
    catatan: 'Pengisian ulang kebutuhan rutin harian depo farmasi.',
    items: [
      {
        id: 'pri-1',
        kodeBarang: 'OBT-0012',
        namaBarang: 'Paracetamol 500 mg Tablet (Box 100)',
        jumlah: 10,
        satuan: 'Box',
        stokSaatIni: 3,
      },
    ],
  },
  {
    id: 'pr-2',
    nomorPR: 'PR-20261029-69D9AF16',
    untuk: 'stok',
    gudang: 'Depo Farmasi',
    pemasokRekomendasi: 'PT. Alkesindo Farma Tara',
    tanggal: '29 Okt 2026',
    prioritas: 'Normal',
    status: 'disetujui',
    catatan: 'Buffer stok untuk pelayanan rawat jalan.',
    items: [
      {
        id: 'pri-2',
        kodeBarang: 'OBT-0048',
        namaBarang: 'Amoxicillin 500 mg Kaplet (Box 100)',
        jumlah: 8,
        satuan: 'Box',
        stokSaatIni: 2,
      },
    ],
  },
  {
    id: 'pr-3',
    nomorPR: 'PR-20261010-EEB41C60',
    untuk: 'Supply Klinik',
    gudang: 'Depo Farmasi',
    pemasokRekomendasi: 'PT. Alkesindo Farma Tara',
    tanggal: '10 Okt 2026',
    prioritas: 'Normal',
    status: 'disetujui',
    catatan: 'Kebutuhan bahan habis pakai ruang tindakan & poli.',
    items: [
      {
        id: 'pri-3a',
        kodeBarang: 'BHP-0045',
        namaBarang: 'Spuit Disposible 3 cc OneMed (Box 100)',
        jumlah: 5,
        satuan: 'Box',
        stokSaatIni: 4,
      },
      {
        id: 'pri-3b',
        kodeBarang: 'BHP-0019',
        namaBarang: 'Alkohol Swab Steril (Box 100)',
        jumlah: 6,
        satuan: 'Box',
        stokSaatIni: 5,
      },
    ],
  },
];

const PR_STATUS_META: Record<
  PurchaseRequestStatus,
  { label: string; badgeClass: string }
> = {
  draf: {
    label: 'Draf',
    badgeClass: 'bg-slate-100 border border-slate-200/80 text-slate-600',
  },
  menunggu_tinjauan: {
    label: 'Menunggu Tinjauan',
    badgeClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  disetujui: {
    label: 'Disetujui',
    badgeClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  ditolak: {
    label: 'Ditolak',
    badgeClass: 'bg-rose-50 border border-rose-200/80 text-rose-700',
  },
  menjadi_po: {
    label: 'Sudah Jadi PO',
    badgeClass: 'bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6]',
  },
};

export default function PermintaanPengadaan({
  initialRequests = DEFAULT_PURCHASE_REQUESTS,
  returCount = 0,
  fakturCount = 0,
  pembayaranCount = 0,
  umurUtangCount = 0,
  onReload,
  onCreateRequest,
  onConvertToPO,
  onTabChange,
}: {
  initialRequests?: PurchaseRequestItem[];
  returCount?: number;
  fakturCount?: number;
  pembayaranCount?: number;
  umurUtangCount?: number;
  onReload?: () => Promise<void> | void;
  onCreateRequest?: (request: PurchaseRequestItem) => void;
  onConvertToPO?: (request: PurchaseRequestItem) => void;
  onTabChange?: (tab: ProcurementOpsTabKey) => void;
}) {
  const [activeTab, setActiveTab] =
    useState<ProcurementOpsTabKey>('permintaan');
  const [requests, setRequests] =
    useState<PurchaseRequestItem[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [isReloading, setIsReloading] = useState(false);

  // Modal Permintaan Baru
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formUntuk, setFormUntuk] = useState('');
  const [formGudang, setFormGudang] = useState('Depo Farmasi');
  const [formPemasok, setFormPemasok] = useState('PT. Alkesindo Farma Tara');
  const [formPrioritas, setFormPrioritas] =
    useState<PurchaseRequestPriority>('Normal');
  const [formCatatan, setFormCatatan] = useState('');
  const [formItems, setFormItems] = useState<
    { namaBarang: string; jumlah: string; satuan: string }[]
  >([{ namaBarang: '', jumlah: '1', satuan: 'Box' }]);

  // Filter daftar permintaan
  const filteredRequests = useMemo(() => {
    if (searchQuery.trim() === '') return requests;
    const q = searchQuery.toLowerCase();

    return requests.filter(
      (item) =>
        item.nomorPR.toLowerCase().includes(q) ||
        item.untuk.toLowerCase().includes(q) ||
        item.gudang.toLowerCase().includes(q) ||
        (item.pemasokRekomendasi?.toLowerCase().includes(q) ?? false) ||
        item.items.some((i) => i.namaBarang.toLowerCase().includes(q)),
    );
  }, [requests, searchQuery]);

  // Rekam terpilih untuk panel kanan
  const selectedRequest = useMemo(
    () => requests.find((r) => r.id === selectedRequestId) ?? null,
    [requests, selectedRequestId],
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

  const handleConvertToPOClick = (req: PurchaseRequestItem) => {
    const generatedPO = `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random()
      .toString(16)
      .slice(2, 8)
      .toUpperCase()}`;

    const updated: PurchaseRequestItem = {
      ...req,
      status: 'menjadi_po',
      nomorPO: generatedPO,
    };

    setRequests((prev) =>
      prev.map((item) => (item.id === req.id ? updated : item)),
    );
    onConvertToPO?.(updated);
  };

  const handleAddFormRow = () => {
    setFormItems((prev) => [
      ...prev,
      { namaBarang: '', jumlah: '1', satuan: 'Box' },
    ]);
  };

  const handleRemoveFormRow = (idx: number) => {
    if (formItems.length <= 1) return;
    setFormItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = formItems.filter((i) => i.namaBarang.trim() !== '');
    if (validItems.length === 0) return;

    const todayLabel = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const codeSuffix = Math.random().toString(16).slice(2, 10).toUpperCase();
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const created: PurchaseRequestItem = {
      id: `pr-${Date.now()}`,
      nomorPR: `PR-${datePrefix}-${codeSuffix}`,
      untuk: formUntuk.trim() || '—',
      gudang: formGudang,
      pemasokRekomendasi: formPemasok.trim() || undefined,
      tanggal: todayLabel,
      prioritas: formPrioritas,
      status: 'menunggu_tinjauan',
      catatan: formCatatan.trim() || undefined,
      items: validItems.map((it, idx) => ({
        id: `pri-${Date.now()}-${idx}`,
        kodeBarang: `BRG-${String(idx + 1).padStart(4, '0')}`,
        namaBarang: it.namaBarang.trim(),
        jumlah: Math.max(1, Number(it.jumlah) || 1),
        satuan: it.satuan.trim() || 'Box',
        stokSaatIni: 0,
      })),
    };

    setRequests((prev) => [created, ...prev]);
    setSelectedRequestId(created.id);
    onCreateRequest?.(created);

    setFormUntuk('');
    setFormCatatan('');
    setFormItems([{ namaBarang: '', jumlah: '1', satuan: 'Box' }]);
    setIsCreateModalOpen(false);
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
      count: requests.length,
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

      {/* 2. KONTEN UTAMA PERMINTAAN PENGADAAN */}
      {activeTab === 'permintaan' ? (
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header & Search Bar */}
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  JEJAK OPERASIONAL · KEBUTUHAN KLINIK
                </p>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                  Permintaan pengadaan
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ajukan kebutuhan, minta tinjauan, lalu ubah permintaan
                  disetujui menjadi PO.
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
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                  <span>Permintaan baru</span>
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
                {filteredRequests.length} rekam
              </span>
            </div>
          </div>

          {/* Split-Pane Bawah: Tabel Permintaan (Kiri) + Panel Tinjauan (Kanan) */}
          <div className="border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] min-h-[380px]">
            {/* KOLOM KIRI: TABEL PERMINTAAN PENGADAAN */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[660px]">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">PERMINTAAN</th>
                    <th className="px-4 py-3.5">UNTUK / GUDANG</th>
                    <th className="px-4 py-3.5">TANGGAL</th>
                    <th className="px-4 py-3.5">PRIORITAS</th>
                    <th className="px-5 py-3.5">STATUS</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/70 text-xs">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-14 px-5 text-center text-slate-500"
                      >
                        Tidak ada rekam permintaan pengadaan yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => {
                      const isSelected = selectedRequest?.id === req.id;
                      const statusMeta = PR_STATUS_META[req.status];

                      return (
                        <tr
                          key={req.id}
                          onClick={() => setSelectedRequestId(req.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#f0f9fb]/65 border-l-[3px] border-l-[#009bb8]'
                              : 'hover:bg-slate-50/90'
                          }`}
                        >
                          {/* Permintaan */}
                          <td className="px-5 py-4 align-middle whitespace-nowrap">
                            <p className="font-extrabold text-[#0f3d56]">
                              {req.nomorPR}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {req.items.length} item
                            </p>
                          </td>

                          {/* Untuk / Gudang */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <p className="font-medium text-slate-700">
                              {req.untuk}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {req.gudang}
                            </p>
                          </td>

                          {/* Tanggal */}
                          <td className="px-4 py-4 align-middle text-slate-600 font-medium whitespace-nowrap">
                            {req.tanggal}
                          </td>

                          {/* Prioritas */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <span
                              className={`font-medium ${
                                req.prioritas === 'Mendesak'
                                  ? 'text-amber-700 font-semibold'
                                  : 'text-slate-600'
                              }`}
                            >
                              {req.prioritas}
                            </span>
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
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* KOLOM KANAN: PANEL TINJAUAN REKAM */}
            <aside className="border-t lg:border-t-0 lg:border-l border-slate-200/80 bg-white flex flex-col">
              {!selectedRequest ? (
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
                /* Detail Rekam Terpilih */
                <div className="p-5 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3.5 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-[#008ba6]">
                          DETAIL PERMINTAAN
                        </span>
                        <h2 className="text-sm sm:text-[15px] font-extrabold text-[#0f3d56] mt-0.5">
                          {selectedRequest.nomorPR}
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Diajukan {selectedRequest.tanggal} · Prioritas{' '}
                          {selectedRequest.prioritas}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedRequestId(null)}
                        aria-label="Tutup panel tinjauan"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Hubungan ke Stok / Pemasok */}
                    <div className="mt-3.5 rounded-xl border border-slate-200/80 bg-[#f8fafc] p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Status Tinjauan
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            PR_STATUS_META[selectedRequest.status].badgeClass
                          }`}
                        >
                          {PR_STATUS_META[selectedRequest.status].label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Gudang Tujuan
                        </span>
                        <span className="font-bold text-[#0f3d56]">
                          {selectedRequest.gudang}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          Pemasok Rekomendasi
                        </span>
                        <span className="font-semibold text-slate-700 text-right truncate max-w-[175px]">
                          {selectedRequest.pemasokRekomendasi ||
                            'Belum ditentukan'}
                        </span>
                      </div>

                      {selectedRequest.nomorPO && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
                          <span className="text-[11px] text-slate-400">
                            Referensi PO
                          </span>
                          <span className="font-extrabold text-[#008ba6]">
                            {selectedRequest.nomorPO}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Daftar Item Kebutuhan */}
                    <div className="mt-4">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Rincian Item ({selectedRequest.items.length})
                      </h3>
                      <div className="space-y-2 max-h-[190px] overflow-y-auto pr-0.5">
                        {selectedRequest.items.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-slate-200/80 bg-white p-3 flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-[#008ba6]">
                                {item.kodeBarang}
                              </p>
                              <p className="font-bold text-[#0f3d56] truncate">
                                {item.namaBarang}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Sisa stok depo: {item.stokSaatIni} {item.satuan}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-lg bg-[#f0f9fb] border border-cyan-200/70 font-extrabold text-[#008ba6] whitespace-nowrap">
                              {item.jumlah} {item.satuan}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedRequest.catatan && (
                      <p className="mt-3 text-[11px] text-slate-500 bg-slate-50 rounded-lg border border-slate-200/70 px-3 py-2">
                        <strong className="text-slate-600">Catatan:</strong>{' '}
                        {selectedRequest.catatan}
                      </p>
                    )}
                  </div>

                  {/* Tindakan Sesuai Kewenangan */}
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    {selectedRequest.status === 'disetujui' ? (
                      <button
                        type="button"
                        onClick={() => handleConvertToPOClick(selectedRequest)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                      >
                        <span>Ubah Menjadi PO</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : selectedRequest.status === 'menjadi_po' ? (
                      <div className="w-full py-2.5 px-3.5 rounded-xl bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6] text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Telah dikonversi ke {selectedRequest.nomorPO}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#008ba6] shrink-0" />
                        <span>
                          Menunggu proses persetujuan sesuai rantai kewenangan.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      ) : (
        /* Placeholder saat Tab Retur / Faktur / Pembayaran / Umur Utang dipilih */
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

      {/* 3. MODAL PERMINTAAN BARU */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  JEJAK OPERASIONAL
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Permintaan Pengadaan Baru
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
              onSubmit={handleSubmitNewRequest}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Untuk / Keperluan
                  </label>
                  <input
                    type="text"
                    value={formUntuk}
                    onChange={(e) => setFormUntuk(e.target.value)}
                    placeholder="Cth: Supply Klinik / stok"
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
                      <option value="Poli Umum">Poli Umum</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Prioritas
                  </label>
                  <div className="relative">
                    <select
                      value={formPrioritas}
                      onChange={(e) =>
                        setFormPrioritas(
                          e.target.value as PurchaseRequestPriority,
                        )
                      }
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Mendesak">Mendesak</option>
                      <option value="Rutin">Rutin</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pemasok Rekomendasi (Opsional)
                </label>
                <input
                  type="text"
                  value={formPemasok}
                  onChange={(e) => setFormPemasok(e.target.value)}
                  placeholder="Nama pemasok..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              {/* Rincian Item Kebutuhan */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">
                    Daftar Item Kebutuhan
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFormRow}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008ba6] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah baris item</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-0.5">
                  {formItems.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={row.namaBarang}
                        onChange={(e) =>
                          setFormItems((prev) =>
                            prev.map((r, i) =>
                              i === idx
                                ? { ...r, namaBarang: e.target.value }
                                : r,
                            ),
                          )
                        }
                        placeholder="Nama obat / alkes..."
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#009bb8]"
                      />
                      <input
                        type="number"
                        min={1}
                        required
                        value={row.jumlah}
                        onChange={(e) =>
                          setFormItems((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, jumlah: e.target.value } : r,
                            ),
                          )
                        }
                        className="w-16 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-center focus:outline-none focus:border-[#009bb8]"
                      />
                      <input
                        type="text"
                        value={row.satuan}
                        onChange={(e) =>
                          setFormItems((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, satuan: e.target.value } : r,
                            ),
                          )
                        }
                        placeholder="Satuan"
                        className="w-20 border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-[#009bb8]"
                      />
                      <button
                        type="button"
                        disabled={formItems.length <= 1}
                        onClick={() => handleRemoveFormRow(idx)}
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
                  Catatan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Keterangan tambahan pengajuan..."
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
                  Ajukan Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}