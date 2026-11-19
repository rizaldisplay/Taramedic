'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ArrowLeftRight,
  Box,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  ClipboardEdit,
  ClipboardList,
  Landmark,
  Package,
  PackageMinus,
  PackagePlus,
  Pencil,
  RotateCcw,
  Search,
  Stethoscope,
  Trash2,
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

export type DrugSubTabKey =
  | 'daftar_obat'
  | 'penerimaan'
  | 'pengeluaran'
  | 'transfer'
  | 'koreksi_stok'
  | 'opname'
  | 'pemusnahan'
  | 'saldo_awal';

export type DrugTrackingMode = 'Lot-aware' | 'Non-lot';

export interface DrugStockItem {
  id: string;
  kodeItem: string;
  namaItem: string;
  kategori: string;
  jenisStok: 'Obat';
  kodeMasterObat: string;
  namaMasterObat: string;
  saldoAgregat: number;
  satuan: string;
  reorderPoint?: number;
  pelacakan: DrugTrackingMode;
  status: 'aktif' | 'nonaktif';
}

const DEFAULT_DRUG_ITEMS: DrugStockItem[] = [
  {
    id: 'drug-1',
    kodeItem: 'OBT-0010',
    namaItem: 'Amlodipine 5 mg Tablet',
    kategori: 'Obat Dalam',
    jenisStok: 'Obat',
    kodeMasterObat: 'OBT-0010',
    namaMasterObat: 'Amlodipine 5 mg Tablet',
    saldoAgregat: 65,
    satuan: 'Tablet',
    reorderPoint: 20,
    pelacakan: 'Lot-aware',
    status: 'aktif',
  },
  {
    id: 'drug-2',
    kodeItem: 'MED-72',
    namaItem: 'Ambroxol 30 mg Tablet',
    kategori: 'Obat',
    jenisStok: 'Obat',
    kodeMasterObat: 'OBT-0023',
    namaMasterObat: 'Ambroxol 30 mg Tablet',
    saldoAgregat: 60,
    satuan: 'Tablet',
    reorderPoint: 20,
    pelacakan: 'Lot-aware',
    status: 'aktif',
  },
  {
    id: 'drug-3',
    kodeItem: 'OBT-0004',
    namaItem: 'Amoxicillin 500 mg Kapsul',
    kategori: 'Tanpa kategori',
    jenisStok: 'Obat',
    kodeMasterObat: 'OBT-0004',
    namaMasterObat: 'Amoxicillin 500 mg Kapsul',
    saldoAgregat: 0,
    satuan: 'Kapsul',
    reorderPoint: 30,
    pelacakan: 'Lot-aware',
    status: 'aktif',
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

const SUB_TAB_LABELS: Record<DrugSubTabKey, string> = {
  daftar_obat: 'Daftar Obat',
  penerimaan: 'Penerimaan',
  pengeluaran: 'Pengeluaran',
  transfer: 'Transfer',
  koreksi_stok: 'Koreksi Stok',
  opname: 'Opname',
  pemusnahan: 'Pemusnahan',
  saldo_awal: 'Saldo Awal',
};

export default function DaftarObat({
  initialItems = DEFAULT_DRUG_ITEMS,
  onMainTabChange,
  onSubTabChange,
  onUpdateItem,
  onToggleArchiveItem,
  onDeletePermanentItem,
}: {
  initialItems?: DrugStockItem[];
  onMainTabChange?: (tab: InventoryMainTabKey) => void;
  onSubTabChange?: (subTab: DrugSubTabKey) => void;
  onUpdateItem?: (item: DrugStockItem) => void;
  onToggleArchiveItem?: (item: DrugStockItem) => void;
  onDeletePermanentItem?: (item: DrugStockItem) => void;
}) {
  const [activeMainTab, setActiveMainTab] =
    useState<InventoryMainTabKey>('obat');
  const [activeSubTab, setActiveSubTab] =
    useState<DrugSubTabKey>('daftar_obat');

  const [items, setItems] = useState<DrugStockItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State Modal Edit Item Obat
  const [editingItem, setEditingItem] = useState<DrugStockItem | null>(null);
  const [formKodeItem, setFormKodeItem] = useState('');
  const [formNamaItem, setFormNamaItem] = useState('');
  const [formKategori, setFormKategori] = useState('');
  const [formKodeMaster, setFormKodeMaster] = useState('');
  const [formNamaMaster, setFormNamaMaster] = useState('');
  const [formSatuan, setFormSatuan] = useState('Tablet');
  const [formReorderPoint, setFormReorderPoint] = useState('20');
  const [formPelacakan, setFormPelacakan] =
    useState<DrugTrackingMode>('Lot-aware');

  // State Modal Konfirmasi Hapus Permanen
  const [deletingItem, setDeletingItem] = useState<DrugStockItem | null>(null);

  // Filter item berdasarkan pencarian dan status nonaktif
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!showInactive && item.status !== 'aktif') {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const isMatch =
          item.kodeItem.toLowerCase().includes(q) ||
          item.namaItem.toLowerCase().includes(q) ||
          item.kategori.toLowerCase().includes(q) ||
          item.kodeMasterObat.toLowerCase().includes(q) ||
          item.namaMasterObat.toLowerCase().includes(q);
        if (!isMatch) return false;
      }

      return true;
    });
  }, [items, showInactive, searchQuery]);

  // Pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredItems.slice(startIdx, startIdx + pageSize);
  }, [filteredItems, safePage, pageSize]);

  const startItemNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItemNumber = Math.min(safePage * pageSize, totalItems);

  const handleSelectMainTab = (tab: InventoryMainTabKey) => {
    setActiveMainTab(tab);
    onMainTabChange?.(tab);
  };

  const handleSelectSubTab = (subTab: DrugSubTabKey) => {
    setActiveSubTab(subTab);
    onSubTabChange?.(subTab);
  };

  const openEditModal = (item: DrugStockItem) => {
    setEditingItem(item);
    setFormKodeItem(item.kodeItem);
    setFormNamaItem(item.namaItem);
    setFormKategori(item.kategori);
    setFormKodeMaster(item.kodeMasterObat);
    setFormNamaMaster(item.namaMasterObat);
    setFormSatuan(item.satuan);
    setFormReorderPoint(String(item.reorderPoint ?? 0));
    setFormPelacakan(item.pelacakan);
  };

  const handleSaveEditForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formNamaItem.trim()) return;

    const updated: DrugStockItem = {
      ...editingItem,
      kodeItem: formKodeItem.trim() || editingItem.kodeItem,
      namaItem: formNamaItem.trim(),
      kategori: formKategori.trim() || 'Tanpa kategori',
      kodeMasterObat: formKodeMaster.trim() || editingItem.kodeMasterObat,
      namaMasterObat: formNamaMaster.trim() || formNamaItem.trim(),
      satuan: formSatuan.trim() || editingItem.satuan,
      reorderPoint: Math.max(0, Number(formReorderPoint) || 0),
      pelacakan: formPelacakan,
    };

    setItems((prev) =>
      prev.map((it) => (it.id === editingItem.id ? updated : it)),
    );
    onUpdateItem?.(updated);
    setEditingItem(null);
  };

  const handleToggleArchive = (item: DrugStockItem) => {
    const updated: DrugStockItem = {
      ...item,
      status: item.status === 'aktif' ? 'nonaktif' : 'aktif',
    };

    setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
    onToggleArchiveItem?.(updated);
  };

  const handleConfirmDeletePermanent = () => {
    if (!deletingItem) return;
    setItems((prev) => prev.filter((it) => it.id !== deletingItem.id));
    onDeletePermanentItem?.(deletingItem);
    setDeletingItem(null);
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

  const DRUG_SUB_TABS: {
    key: DrugSubTabKey;
    label: string;
    Icon: React.ElementType;
  }[] = [
    { key: 'daftar_obat', label: 'Daftar Obat', Icon: Box },
    { key: 'penerimaan', label: 'Penerimaan', Icon: Package },
    { key: 'pengeluaran', label: 'Pengeluaran', Icon: Package },
    { key: 'transfer', label: 'Transfer', Icon: ArrowLeftRight },
    { key: 'koreksi_stok', label: 'Koreksi Stok', Icon: ClipboardEdit },
    { key: 'opname', label: 'Opname', Icon: ClipboardCheck },
    { key: 'pemusnahan', label: 'Pemusnahan', Icon: PackageMinus },
    { key: 'saldo_awal', label: 'Saldo Awal', Icon: PackagePlus },
  ];

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-3">
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

      {/* 2. KONTEN MODUL OBAT */}
      {activeMainTab === 'obat' ? (
        <div className="space-y-3">
          {/* Sub-Tab Navigasi Obat */}
          <div className="bg-slate-50/90 rounded-xl border border-slate-200/90 px-4 sm:px-5">
            <div
              role="tablist"
              aria-label="Sub-navigasi Manajemen Obat"
              className="flex items-center gap-5 sm:gap-6 overflow-x-auto"
            >
              {DRUG_SUB_TABS.map(({ key, label, Icon }) => {
                const isActive = activeSubTab === key;

                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelectSubTab(key)}
                    className={`relative py-3 inline-flex items-center gap-2 text-xs whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#008ba6] font-bold'
                        : 'text-slate-500 font-semibold hover:text-slate-700'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
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

          {/* Konten Sub-Tab Daftar Obat */}
          {activeSubTab === 'daftar_obat' ? (
            <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
              {/* Header + Search + Checkbox + Badge Hasil */}
              <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] leading-snug">
                    Daftar Obat
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola identitas item dan status aktif tanpa menghapus
                    referensi ledger.
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:w-80 md:w-96 xl:w-[440px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Cari kode atau nama item"
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

                  {/* Checkbox Tampilkan Nonaktif */}
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 select-none cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={showInactive}
                      onChange={(e) => {
                        setShowInactive(e.target.checked);
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-[#009bb8] focus:ring-[#009bb8]/25 cursor-pointer"
                    />
                    <span>Tampilkan nonaktif</span>
                  </label>

                  {/* Pill Jumlah Hasil */}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700 whitespace-nowrap">
                    {filteredItems.length} hasil
                  </span>
                </div>
              </div>

              {/* Tabel Daftar Obat */}
              <div className="overflow-x-auto border-t border-slate-200/80">
                <table className="w-full text-left border-collapse min-w-[920px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">ITEM</th>
                      <th className="px-4 py-3.5">JENIS STOK</th>
                      <th className="px-4 py-3.5">MASTER OBAT</th>
                      <th className="px-4 py-3.5">SALDO AGREGAT</th>
                      <th className="px-4 py-3.5">PELACAKAN</th>
                      <th className="px-4 py-3.5">STATUS</th>
                      <th className="px-5 py-3.5">AKSI</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {paginatedItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 px-5 text-center text-slate-500"
                        >
                          Tidak ada item obat yang sesuai dengan pencarian atau
                          filter status.
                        </td>
                      </tr>
                    ) : (
                      paginatedItems.map((item) => {
                        const isBelowReorder =
                          typeof item.reorderPoint === 'number' &&
                          item.reorderPoint > 0 &&
                          item.saldoAgregat < item.reorderPoint;

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            {/* ITEM */}
                            <td className="px-5 py-4 align-middle whitespace-nowrap">
                              <p className="font-bold text-[#0f3d56]">
                                {item.namaItem}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {item.kodeItem} · {item.kategori}
                              </p>
                            </td>

                            {/* JENIS STOK */}
                            <td className="px-4 py-4 align-middle whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                                {item.jenisStok}
                              </span>
                            </td>

                            {/* MASTER OBAT */}
                            <td className="px-4 py-4 align-middle whitespace-nowrap">
                              <p className="text-[11px] font-medium text-slate-500">
                                {item.kodeMasterObat}
                              </p>
                              <p className="text-slate-600 mt-0.5">
                                {item.namaMasterObat}
                              </p>
                            </td>

                            {/* SALDO AGREGAT */}
                            <td className="px-4 py-4 align-middle whitespace-nowrap">
                              <p className="font-bold text-[#0f3d56] tabular-nums">
                                {item.saldoAgregat.toLocaleString('id-ID')}{' '}
                                {item.satuan}
                              </p>
                              {isBelowReorder && (
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Di bawah reorder {item.reorderPoint}
                                </p>
                              )}
                            </td>

                            {/* PELACAKAN */}
                            <td className="px-4 py-4 align-middle whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                                {item.pelacakan}
                              </span>
                            </td>

                            {/* STATUS */}
                            <td className="px-4 py-4 align-middle whitespace-nowrap">
                              {item.status === 'aktif' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                                  Aktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                                  Nonaktif
                                </span>
                              )}
                            </td>

                            {/* AKSI */}
                            <td className="px-5 py-4 align-middle whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(item)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleArchive(item)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                                >
                                  {item.status === 'aktif' ? (
                                    <>
                                      <Archive className="w-3.5 h-3.5 text-slate-500" />
                                      <span>Arsipkan</span>
                                    </>
                                  ) : (
                                    <>
                                      <RotateCcw className="w-3.5 h-3.5 text-[#008ba6]" />
                                      <span>Aktifkan</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDeletingItem(item)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200/80 bg-white hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Hapus Permanen</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
                    Item
                  </span>

                  <div className="flex items-center gap-2">
                    <label htmlFor="per-halaman-obat">Per Halaman</label>
                    <div className="relative">
                      <select
                        id="per-halaman-obat"
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
            </section>
          ) : (
            /* Placeholder Sub-Tab Obat Lainnya */
            <section className="bg-white rounded-xl border border-slate-200/90 p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mx-auto mb-3">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#0f3d56]">
                {SUB_TAB_LABELS[activeSubTab]} Obat
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Hubungkan ke sub-komponen{' '}
                <code className="text-[#008ba6]">{activeSubTab}</code> melalui
                prop <code className="text-[#008ba6]">onSubTabChange</code>.
              </p>
            </section>
          )}
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

      {/* 3. MODAL EDIT IDENTITAS ITEM OBAT */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  DAFTAR OBAT
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Identitas Item Obat
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditForm} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Item
                  </label>
                  <input
                    type="text"
                    required
                    value={formKodeItem}
                    onChange={(e) => setFormKodeItem(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori Obat
                  </label>
                  <input
                    type="text"
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value)}
                    placeholder="Contoh: Obat Dalam / Obat"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Item Obat
                </label>
                <input
                  type="text"
                  required
                  value={formNamaItem}
                  onChange={(e) => setFormNamaItem(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Master Obat
                  </label>
                  <input
                    type="text"
                    value={formKodeMaster}
                    onChange={(e) => setFormKodeMaster(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Master Obat
                  </label>
                  <input
                    type="text"
                    value={formNamaMaster}
                    onChange={(e) => setFormNamaMaster(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Satuan Dasar
                  </label>
                  <input
                    type="text"
                    value={formSatuan}
                    onChange={(e) => setFormSatuan(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Batas Reorder
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formReorderPoint}
                    onChange={(e) => setFormReorderPoint(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mode Pelacakan
                  </label>
                  <div className="relative">
                    <select
                      value={formPelacakan}
                      onChange={(e) =>
                        setFormPelacakan(e.target.value as DrugTrackingMode)
                      }
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="Lot-aware">Lot-aware</option>
                      <option value="Non-lot">Non-lot</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL KONFIRMASI HAPUS PERMANEN */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-5">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <h3 className="text-base font-extrabold text-[#0f3d56]">
                Hapus Permanen Item Obat?
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Anda akan menghapus permanen{' '}
                <strong className="text-slate-700">
                  {deletingItem.namaItem} ({deletingItem.kodeItem})
                </strong>
                . Pastikan item ini belum memiliki referensi transaksi ledger
                aktif; gunakan <strong>Arsipkan</strong> jika hanya ingin
                menonaktifkan item.
              </p>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingItem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeletePermanent}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Ya, Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}