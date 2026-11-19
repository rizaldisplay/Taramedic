'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Boxes,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  ClipboardList,
  History,
  Landmark,
  MapPin,
  Pencil,
  Plus,
  Search,
  Stethoscope,
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

export type ReusableAssetStatus =
  | 'tersedia'
  | 'digunakan'
  | 'sterilisasi'
  | 'kalibrasi'
  | 'rusak';

export interface MedicalAssetEventLog {
  id: string;
  tanggal: string;
  jenisEvent:
    | 'Registrasi Awal'
    | 'Sterilisasi'
    | 'Kalibrasi'
    | 'Mutasi Lokasi'
    | 'Pemeliharaan'
    | 'Perubahan Status';
  keterangan: string;
  lokasi: string;
  petugas: string;
}

export interface MedicalAssetItem {
  id: string;
  kodeAset: string;
  namaAlat: string;
  nomorSerial: string;
  merkModel?: string;
  lokasi: string;
  kalibrasiBerikutnya?: string;
  status: ReusableAssetStatus;
  catatan?: string;
  historiEvent: MedicalAssetEventLog[];
}

const ASSET_STATUS_META: Record<
  ReusableAssetStatus,
  { label: string; badgeClass: string }
> = {
  tersedia: {
    label: 'Tersedia',
    badgeClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  digunakan: {
    label: 'Digunakan',
    badgeClass: 'bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6]',
  },
  sterilisasi: {
    label: 'Sterilisasi',
    badgeClass: 'bg-sky-50 border border-sky-200/80 text-sky-700',
  },
  kalibrasi: {
    label: 'Kalibrasi / Servis',
    badgeClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  rusak: {
    label: 'Rusak / Nonaktif',
    badgeClass: 'bg-rose-50 border border-rose-200/80 text-rose-700',
  },
};

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

function formatDateID(dateISO?: string): string {
  if (!dateISO) return '—';
  const date = new Date(dateISO);
  if (Number.isNaN(date.getTime())) return dateISO;
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AlatReusable({
  initialAssets = [],
  onMainTabChange,
  onCreateAsset,
  onRecordAssetEvent,
}: {
  initialAssets?: MedicalAssetItem[];
  onMainTabChange?: (tab: InventoryMainTabKey) => void;
  onCreateAsset?: (asset: MedicalAssetItem) => void;
  onRecordAssetEvent?: (
    asset: MedicalAssetItem,
    event: MedicalAssetEventLog,
  ) => void;
}) {
  const [activeMainTab, setActiveMainTab] =
    useState<InventoryMainTabKey>('alat_reusable');

  const [assets, setAssets] = useState<MedicalAssetItem[]>(initialAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal Tambah Alat Baru
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formKodeAset, setFormKodeAset] = useState('');
  const [formNamaAlat, setFormNamaAlat] = useState('');
  const [formSerial, setFormSerial] = useState('');
  const [formMerkModel, setFormMerkModel] = useState('');
  const [formLokasi, setFormLokasi] = useState('Poli Umum');
  const [formKalibrasi, setFormKalibrasi] = useState('');
  const [formStatus, setFormStatus] = useState<ReusableAssetStatus>('tersedia');
  const [formCatatan, setFormCatatan] = useState('');

  // Modal Histori Event & Catat Event Lifecycle
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [eventJenis, setEventJenis] =
    useState<MedicalAssetEventLog['jenisEvent']>('Sterilisasi');
  const [eventLokasi, setEventLokasi] = useState('');
  const [eventStatusBaru, setEventStatusBaru] =
    useState<ReusableAssetStatus>('tersedia');
  const [eventKeterangan, setEventKeterangan] = useState('');

  // Filter berdasarkan Kode Aset, Nama, atau Serial
  const filteredAssets = useMemo(() => {
    if (searchQuery.trim() === '') return assets;
    const q = searchQuery.toLowerCase();

    return assets.filter(
      (item) =>
        item.kodeAset.toLowerCase().includes(q) ||
        item.namaAlat.toLowerCase().includes(q) ||
        item.nomorSerial.toLowerCase().includes(q) ||
        item.lokasi.toLowerCase().includes(q),
    );
  }, [assets, searchQuery]);

  // Pagination
  const totalItems = filteredAssets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedAssets = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredAssets.slice(startIdx, startIdx + pageSize);
  }, [filteredAssets, safePage, pageSize]);

  const startItemNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItemNumber = Math.min(safePage * pageSize, totalItems);

  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === selectedAssetId) ?? null,
    [assets, selectedAssetId],
  );

  const handleSelectMainTab = (tab: InventoryMainTabKey) => {
    setActiveMainTab(tab);
    onMainTabChange?.(tab);
  };

  const openCreateAssetModal = () => {
    const nextNumber = String(assets.length + 1).padStart(4, '0');
    setFormKodeAset(`AST-${nextNumber}`);
    setFormNamaAlat('');
    setFormSerial('');
    setFormMerkModel('');
    setFormLokasi('Poli Umum');
    setFormKalibrasi('');
    setFormStatus('tersedia');
    setFormCatatan('');
    setIsCreateModalOpen(true);
  };

  const handleSubmitCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNamaAlat.trim()) return;

    const todayLabel = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const initialLog: MedicalAssetEventLog = {
      id: `evt-${Date.now()}`,
      tanggal: todayLabel,
      jenisEvent: 'Registrasi Awal',
      keterangan:
        formCatatan.trim() || 'Registrasi unit alat reusable ke sistem.',
      lokasi: formLokasi.trim() || 'Poli Umum',
      petugas: 'Admin Inventaris',
    };

    const created: MedicalAssetItem = {
      id: `ast-${Date.now()}`,
      kodeAset:
        formKodeAset.trim() || `AST-${Date.now().toString().slice(-4)}`,
      namaAlat: formNamaAlat.trim(),
      nomorSerial: formSerial.trim() || '—',
      merkModel: formMerkModel.trim() || undefined,
      lokasi: formLokasi.trim() || 'Poli Umum',
      kalibrasiBerikutnya: formKalibrasi
        ? formatDateID(formKalibrasi)
        : undefined,
      status: formStatus,
      catatan: formCatatan.trim() || undefined,
      historiEvent: [initialLog],
    };

    setAssets((prev) => [created, ...prev]);
    setCurrentPage(1);
    onCreateAsset?.(created);
    setIsCreateModalOpen(false);
  };

  const openEventHistoryModal = (asset: MedicalAssetItem) => {
    setSelectedAssetId(asset.id);
    setEventJenis('Sterilisasi');
    setEventLokasi(asset.lokasi);
    setEventStatusBaru(asset.status);
    setEventKeterangan('');
  };

  const handleSubmitLifecycleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    const todayLabel = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const nextLocation = eventLokasi.trim() || selectedAsset.lokasi;

    const newEvent: MedicalAssetEventLog = {
      id: `evt-${Date.now()}`,
      tanggal: todayLabel,
      jenisEvent: eventJenis,
      keterangan:
        eventKeterangan.trim() ||
        `Pencatatan ${eventJenis.toLowerCase()} pada unit alat.`,
      lokasi: nextLocation,
      petugas: 'Admin Inventaris',
    };

    const updatedAsset: MedicalAssetItem = {
      ...selectedAsset,
      lokasi: nextLocation,
      status: eventStatusBaru,
      historiEvent: [newEvent, ...selectedAsset.historiEvent],
    };

    setAssets((prev) =>
      prev.map((a) => (a.id === selectedAsset.id ? updatedAsset : a)),
    );
    onRecordAssetEvent?.(updatedAsset, newEvent);
    setEventKeterangan('');
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
          {MAIN_TAB_LABELS &&
            MAIN_TABS.map(({ key, label, Icon }) => {
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

      {/* 2. KONTEN UTAMA ALAT REUSABLE */}
      {activeMainTab === 'alat_reusable' ? (
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header & Search Bar */}
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  SEPARATE REGISTER
                </p>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                  Alat Reusable
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  MedicalAsset lifecycle bukan lot stock: status, lokasi,
                  kalibrasi, dan histori event.
                </p>
              </div>

              {assets.length > 0 && (
                <button
                  type="button"
                  onClick={openCreateAssetModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                  <span>Alat baru</span>
                </button>
              )}
            </div>

            {/* Baris Search + Pill Jumlah Alat */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari Kode Aset, Nama, Serial"
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

              <span className="inline-flex items-center self-start sm:self-auto px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700 whitespace-nowrap">
                {filteredAssets.length} alat
              </span>
            </div>
          </div>

          {/* Area Konten Utama: Empty State atau Tabel Register Alat */}
          {filteredAssets.length === 0 ? (
            /* Empty State Sesuai Gambar */
            <div className="border-t border-slate-200/80 min-h-[360px] flex flex-col items-center justify-center text-center px-6 py-16">
              <div className="w-12 h-12 rounded-full bg-emerald-50/90 border border-emerald-100 text-emerald-700 flex items-center justify-center mb-3.5">
                <Wrench className="w-5 h-5 stroke-[1.8]" />
              </div>

              <h2 className="text-sm sm:text-[15px] font-bold text-[#0f3d56]">
                {searchQuery
                  ? 'Alat Tidak Ditemukan'
                  : 'Register Alat Masih Kosong'}
              </h2>

              <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                {searchQuery
                  ? 'Coba ubah kata kunci kode aset, nama alat, atau nomor serial.'
                  : 'Daftarkan alat reusable untuk memisahkan lifecycle dari stok consumable.'}
              </p>

              {!searchQuery && (
                <button
                  type="button"
                  onClick={openCreateAssetModal}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                  <span>Alat baru</span>
                </button>
              )}
            </div>
          ) : (
            /* Tabel Register MedicalAsset saat Data Tersedia */
            <>
              <div className="overflow-x-auto border-t border-slate-200/80">
                <table className="w-full text-left border-collapse min-w-[820px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">ASET</th>
                      <th className="px-4 py-3.5">LOKASI</th>
                      <th className="px-4 py-3.5">KALIBRASI</th>
                      <th className="px-4 py-3.5">STATUS</th>
                      <th className="px-5 py-3.5 text-right">AKSI</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {paginatedAssets.map((asset) => {
                      const statusMeta = ASSET_STATUS_META[asset.status];

                      return (
                        <tr
                          key={asset.id}
                          onClick={() => openEventHistoryModal(asset)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          {/* ASET */}
                          <td className="px-5 py-4 align-middle whitespace-nowrap">
                            <p className="font-bold text-[#0f3d56]">
                              {asset.namaAlat}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {asset.kodeAset} · SN: {asset.nomorSerial}
                              {asset.merkModel ? ` · ${asset.merkModel}` : ''}
                            </p>
                          </td>

                          {/* LOKASI */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{asset.lokasi}</span>
                            </span>
                          </td>

                          {/* KALIBRASI */}
                          <td className="px-4 py-4 align-middle text-slate-600 font-medium whitespace-nowrap">
                            {asset.kalibrasiBerikutnya ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{asset.kalibrasiBerikutnya}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400">
                                Tidak dijadwalkan
                              </span>
                            )}
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusMeta.badgeClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </td>

                          {/* AKSI */}
                          <td className="px-5 py-4 align-middle text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEventHistoryModal(asset);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                            >
                              <History className="w-3.5 h-3.5 text-[#008ba6]" />
                              <span>
                                Lifecycle ({asset.historiEvent.length})
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer Pagination */}
              <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    <strong className="font-semibold text-slate-700">
                      {startItemNumber}–{endItemNumber}
                    </strong>{' '}
                    dari{' '}
                    <strong className="font-semibold text-slate-700">
                      {totalItems}
                    </strong>{' '}
                    Alat
                  </span>

                  <div className="flex items-center gap-2">
                    <label htmlFor="per-halaman-alat">Per Halaman</label>
                    <div className="relative">
                      <select
                        id="per-halaman-alat"
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
            </>
          )}
        </section>
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

      {/* 3. MODAL REGISTRASI ALAT REUSABLE BARU */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SEPARATE REGISTER · MEDICAL ASSET
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Daftarkan Alat Reusable Baru
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
              onSubmit={handleSubmitCreateAsset}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Aset
                  </label>
                  <input
                    type="text"
                    required
                    value={formKodeAset}
                    onChange={(e) => setFormKodeAset(e.target.value)}
                    placeholder="AST-0001"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Serial (SN)
                  </label>
                  <input
                    type="text"
                    value={formSerial}
                    onChange={(e) => setFormSerial(e.target.value)}
                    placeholder="Contoh: SN-2026-99182"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Alat Reusable
                  </label>
                  <input
                    type="text"
                    required
                    value={formNamaAlat}
                    onChange={(e) => setFormNamaAlat(e.target.value)}
                    placeholder="Contoh: Set Bedah Minor / Stetoskop"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Merk / Model (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formMerkModel}
                    onChange={(e) => setFormMerkModel(e.target.value)}
                    placeholder="Contoh: Littmann Classic III"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lokasi Unit / Ruangan
                  </label>
                  <input
                    type="text"
                    required
                    value={formLokasi}
                    onChange={(e) => setFormLokasi(e.target.value)}
                    placeholder="Poli Umum / UGD"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kalibrasi Berikutnya
                  </label>
                  <input
                    type="date"
                    value={formKalibrasi}
                    onChange={(e) => setFormKalibrasi(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status Awal
                  </label>
                  <div className="relative">
                    <select
                      value={formStatus}
                      onChange={(e) =>
                        setFormStatus(e.target.value as ReusableAssetStatus)
                      }
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="tersedia">Tersedia</option>
                      <option value="digunakan">Digunakan</option>
                      <option value="sterilisasi">Sterilisasi</option>
                      <option value="kalibrasi">Kalibrasi / Servis</option>
                      <option value="rusak">Rusak / Nonaktif</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Registrasi (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Kondisi fisik awal, kelengkapan aksesoris, atau nomor sertifikat kalibrasi..."
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
                  Simpan Alat Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL LIFECYCLE & HISTORI EVENT ALAT */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {selectedAsset.kodeAset} · SN {selectedAsset.nomorSerial}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  {selectedAsset.namaAlat}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssetId(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Form Catat Event Baru */}
              <form
                onSubmit={handleSubmitLifecycleEvent}
                className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 space-y-3"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#0f3d56]">
                  <Pencil className="w-3.5 h-3.5 text-[#008ba6]" />
                  <span>Catat Event Lifecycle Baru</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Jenis Event
                    </label>
                    <div className="relative">
                      <select
                        value={eventJenis}
                        onChange={(e) =>
                          setEventJenis(
                            e.target.value as MedicalAssetEventLog['jenisEvent'],
                          )
                        }
                        className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                      >
                        <option value="Sterilisasi">Sterilisasi</option>
                        <option value="Kalibrasi">Kalibrasi</option>
                        <option value="Mutasi Lokasi">Mutasi Lokasi</option>
                        <option value="Pemeliharaan">Pemeliharaan</option>
                        <option value="Perubahan Status">
                          Perubahan Status
                        </option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Lokasi Terkini
                    </label>
                    <input
                      type="text"
                      value={eventLokasi}
                      onChange={(e) => setEventLokasi(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Status Setelah Event
                    </label>
                    <div className="relative">
                      <select
                        value={eventStatusBaru}
                        onChange={(e) =>
                          setEventStatusBaru(
                            e.target.value as ReusableAssetStatus,
                          )
                        }
                        className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                      >
                        <option value="tersedia">Tersedia</option>
                        <option value="digunakan">Digunakan</option>
                        <option value="sterilisasi">Sterilisasi</option>
                        <option value="kalibrasi">Kalibrasi / Servis</option>
                        <option value="rusak">Rusak / Nonaktif</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={eventKeterangan}
                    onChange={(e) => setEventKeterangan(e.target.value)}
                    placeholder="Keterangan hasil sterilisasi, kalibrasi, atau mutasi..."
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
                  >
                    Catat Event
                  </button>
                </div>
              </form>

              {/* Daftar Histori Event */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Histori Event Alat ({selectedAsset.historiEvent.length})
                </h4>

                <div className="space-y-2 max-h-[210px] overflow-y-auto pr-0.5">
                  {selectedAsset.historiEvent.map((evt) => (
                    <div
                      key={evt.id}
                      className="rounded-xl border border-slate-200/80 bg-white p-3 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#f0f9fb] border border-cyan-200/80 text-[10px] font-bold text-[#008ba6]">
                            {evt.jenisEvent}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {evt.lokasi}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium mt-1">
                          {evt.keterangan}
                        </p>
                      </div>

                      <div className="text-right text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                        <p className="font-semibold text-slate-600">
                          {evt.tanggal}
                        </p>
                        <p>{evt.petugas}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}