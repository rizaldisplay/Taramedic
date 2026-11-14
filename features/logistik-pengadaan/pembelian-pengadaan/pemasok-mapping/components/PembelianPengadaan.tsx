'use client';

import React, { useMemo, useState } from 'react';
import {
  Archive,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';

export type ProcurementTabKey =
  | 'pemasok_mapping'
  | 'pesanan_pembelian'
  | 'penerimaan';

export type SupplierType =
  | 'Distributor'
  | 'Prinsipal'
  | 'PBF'
  | 'Apotek Rekanan';

export type SupplierStatusFilter = 'aktif' | 'arsip' | 'semua';

export interface SupplierProductMapping {
  id: string;
  kodeProduk: string;
  namaProduk: string;
  satuan: string;
  hargaBeli: number;
  leadTimeHari: number;
}

export interface SupplierItem {
  id: string;
  kodePemasok: string;
  namaPemasok: string;
  jenis: SupplierType;
  telepon: string;
  email: string;
  tempoHari: number;
  alamat?: string;
  status: 'aktif' | 'arsip';
  produkDipasok: SupplierProductMapping[];
}

const DEFAULT_SUPPLIERS: SupplierItem[] = [
  {
    id: 'sup-1',
    kodePemasok: 'SUP-000033',
    namaPemasok: 'PT. Alkesindo Farma Tara',
    jenis: 'Distributor',
    telepon: '081511210080',
    email: 'farmatara@gmail.com',
    tempoHari: 31,
    alamat: 'Jl. Raya Industri Medis No. 18, Malang',
    status: 'aktif',
    produkDipasok: [
      {
        id: 'map-1',
        kodeProduk: 'OBT-0012',
        namaProduk: 'Paracetamol 500 mg Tablet (Box 100)',
        satuan: 'Box',
        hargaBeli: 28500,
        leadTimeHari: 2,
      },
      {
        id: 'map-2',
        kodeProduk: 'BHP-0045',
        namaProduk: 'Spuit Disposible 3 cc OneMed (Box 100)',
        satuan: 'Box',
        hargaBeli: 64000,
        leadTimeHari: 1,
      },
    ],
  },
];

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default function DirektoriPemasok({
  initialSuppliers = DEFAULT_SUPPLIERS,
  purchaseOrderCount = 3,
  receivingCount = 3,
  onSaveSupplier,
  onToggleArchiveSupplier,
  onUpdateSupplierProducts,
  onTabChange,
}: {
  initialSuppliers?: SupplierItem[];
  purchaseOrderCount?: number;
  receivingCount?: number;
  onSaveSupplier?: (supplier: SupplierItem, isNew: boolean) => void;
  onToggleArchiveSupplier?: (supplier: SupplierItem) => void;
  onUpdateSupplierProducts?: (
    supplierId: string,
    products: SupplierProductMapping[],
  ) => void;
  onTabChange?: (tab: ProcurementTabKey) => void;
}) {
  const [activeTab, setActiveTab] =
    useState<ProcurementTabKey>('pemasok_mapping');
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(initialSuppliers);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<SupplierStatusFilter>('aktif');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Pemasok terpilih di panel kanan
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null,
  );

  // Modal Tambah / Ubah Pemasok
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierItem | null>(
    null,
  );
  const [formNama, setFormNama] = useState('');
  const [formKode, setFormKode] = useState('');
  const [formJenis, setFormJenis] = useState<SupplierType>('Distributor');
  const [formTelepon, setFormTelepon] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTempo, setFormTempo] = useState('30');
  const [formAlamat, setFormAlamat] = useState('');

  // Form Tambah Produk Mapping pada panel kanan
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdKode, setNewProdKode] = useState('');
  const [newProdNama, setNewProdNama] = useState('');
  const [newProdSatuan, setNewProdSatuan] = useState('Box');
  const [newProdHarga, setNewProdHarga] = useState('');
  const [newProdLeadTime, setNewProdLeadTime] = useState('2');

  const activeSupplierCount = useMemo(
    () => suppliers.filter((s) => s.status === 'aktif').length,
    [suppliers],
  );

  // Filter pemasok
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((item) => {
      if (statusFilter !== 'semua' && item.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.kodePemasok.toLowerCase().includes(q) ||
          item.namaPemasok.toLowerCase().includes(q) ||
          item.jenis.toLowerCase().includes(q) ||
          item.telepon.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [suppliers, statusFilter, searchQuery]);

  // Pagination
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedSuppliers = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredSuppliers.slice(startIdx, startIdx + pageSize);
  }, [filteredSuppliers, safePage, pageSize]);

  const startItemNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItemNumber = Math.min(safePage * pageSize, totalItems);

  const selectedSupplier = useMemo(
    () => suppliers.find((s) => s.id === selectedSupplierId) ?? null,
    [suppliers, selectedSupplierId],
  );

  const handleSelectTab = (tab: ProcurementTabKey) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Buka modal tambah pemasok
  const openCreateSupplierModal = () => {
    setEditingSupplier(null);
    const nextNumber = String(33 + suppliers.length).padStart(6, '0');
    setFormKode(`SUP-${nextNumber}`);
    setFormNama('');
    setFormJenis('Distributor');
    setFormTelepon('');
    setFormEmail('');
    setFormTempo('30');
    setFormAlamat('');
    setIsSupplierModalOpen(true);
  };

  // Buka modal edit pemasok
  const openEditSupplierModal = (supplier: SupplierItem) => {
    setEditingSupplier(supplier);
    setFormKode(supplier.kodePemasok);
    setFormNama(supplier.namaPemasok);
    setFormJenis(supplier.jenis);
    setFormTelepon(supplier.telepon);
    setFormEmail(supplier.email);
    setFormTempo(String(supplier.tempoHari));
    setFormAlamat(supplier.alamat ?? '');
    setIsSupplierModalOpen(true);
  };

  const handleSaveSupplierForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) return;

    const tempoParsed = Math.max(0, Number(formTempo) || 0);

    if (editingSupplier) {
      const updated: SupplierItem = {
        ...editingSupplier,
        kodePemasok: formKode.trim() || editingSupplier.kodePemasok,
        namaPemasok: formNama.trim(),
        jenis: formJenis,
        telepon: formTelepon.trim(),
        email: formEmail.trim(),
        tempoHari: tempoParsed,
        alamat: formAlamat.trim(),
      };

      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingSupplier.id ? updated : s)),
      );
      onSaveSupplier?.(updated, false);
    } else {
      const created: SupplierItem = {
        id: `sup-${Date.now()}`,
        kodePemasok: formKode.trim() || `SUP-${Date.now().toString().slice(-6)}`,
        namaPemasok: formNama.trim(),
        jenis: formJenis,
        telepon: formTelepon.trim(),
        email: formEmail.trim(),
        tempoHari: tempoParsed,
        alamat: formAlamat.trim(),
        status: 'aktif',
        produkDipasok: [],
      };

      setSuppliers((prev) => [created, ...prev]);
      setSelectedSupplierId(created.id);
      onSaveSupplier?.(created, true);
    }

    setIsSupplierModalOpen(false);
  };

  const handleToggleArchive = (supplier: SupplierItem) => {
    const updated: SupplierItem = {
      ...supplier,
      status: supplier.status === 'aktif' ? 'arsip' : 'aktif',
    };

    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplier.id ? updated : s)),
    );
    if (selectedSupplierId === supplier.id && updated.status === 'arsip') {
      setSelectedSupplierId(null);
    }
    onToggleArchiveSupplier?.(updated);
  };

  // Tambah produk mapping ke pemasok terpilih
  const handleAddMappedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !newProdNama.trim()) return;

    const newMapping: SupplierProductMapping = {
      id: `map-${Date.now()}`,
      kodeProduk:
        newProdKode.trim() || `PRD-${Date.now().toString().slice(-4)}`,
      namaProduk: newProdNama.trim(),
      satuan: newProdSatuan.trim() || 'Box',
      hargaBeli: Math.max(0, Number(newProdHarga) || 0),
      leadTimeHari: Math.max(1, Number(newProdLeadTime) || 1),
    };

    const updatedProducts = [...selectedSupplier.produkDipasok, newMapping];

    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === selectedSupplier.id
          ? { ...s, produkDipasok: updatedProducts }
          : s,
      ),
    );
    onUpdateSupplierProducts?.(selectedSupplier.id, updatedProducts);

    setNewProdKode('');
    setNewProdNama('');
    setNewProdSatuan('Box');
    setNewProdHarga('');
    setNewProdLeadTime('2');
    setIsAddingProduct(false);
  };

  const handleRemoveMappedProduct = (mappingId: string) => {
    if (!selectedSupplier) return;

    const updatedProducts = selectedSupplier.produkDipasok.filter(
      (p) => p.id !== mappingId,
    );

    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === selectedSupplier.id
          ? { ...s, produkDipasok: updatedProducts }
          : s,
      ),
    );
    onUpdateSupplierProducts?.(selectedSupplier.id, updatedProducts);
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
      count: activeSupplierCount,
      Icon: Users,
    },
    {
      key: 'pesanan_pembelian',
      label: 'Pesanan Pembelian',
      count: purchaseOrderCount,
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
          aria-label="Navigasi Pengadaan & Pemasok"
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

      {/* 2. KONTEN UTAMA DIREKTORI PEMASOK */}
      {activeTab === 'pemasok_mapping' ? (
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header & Search Filter Bar */}
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  DIREKTORI PEMASOK
                </p>
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                  Pemasok &amp; Produk Pemasok
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola identitas pemasok dan produk yang disediakannya.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateSupplierModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.2]" />
                <span>Pemasok Baru</span>
              </button>
            </div>

            {/* Search Input + Status Dropdown */}
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari kode, nama, kontak, telepon, atau email"
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

              <div className="relative sm:w-48 shrink-0">
                <select
                  aria-label="Filter status pemasok"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as SupplierStatusFilter);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-xs sm:text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
                >
                  <option value="aktif">Pemasok aktif</option>
                  <option value="arsip">Pemasok diarsipkan</option>
                  <option value="semua">Semua pemasok</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Split Pane Bawah: Tabel Pemasok (Kiri) + Produk Pemasok (Kanan) */}
          <div className="border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] min-h-[360px]">
            {/* KOLOM KIRI: TABEL & PAGINATION */}
            <div className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[660px]">
                  <thead className="bg-slate-50 border-y border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-4 py-3">PEMASOK</th>
                      <th className="px-4 py-3">JENIS</th>
                      <th className="px-4 py-3">KONTAK</th>
                      <th className="px-4 py-3">TEMPO</th>
                      <th className="px-4 py-3">STATUS</th>
                      <th className="px-4 py-3 text-right">AKSI</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {paginatedSuppliers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 px-4 text-center text-slate-500"
                        >
                          Tidak ada data pemasok yang sesuai dengan pencarian
                          atau filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedSuppliers.map((supplier) => {
                        const isSelected = selectedSupplier?.id === supplier.id;

                        return (
                          <tr
                            key={supplier.id}
                            onClick={() => {
                              setSelectedSupplierId(supplier.id);
                              setIsAddingProduct(false);
                            }}
                            className={`transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#f0f9fb]/60 border-l-[3px] border-l-[#009bb8]'
                                : 'hover:bg-slate-50/90'
                            }`}
                          >
                            {/* Pemasok */}
                            <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                              <p className="font-bold text-[#0f3d56]">
                                {supplier.namaPemasok}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {supplier.kodePemasok}
                              </p>
                            </td>

                            {/* Jenis */}
                            <td className="px-4 py-3.5 align-middle text-slate-600 font-medium whitespace-nowrap">
                              {supplier.jenis}
                            </td>

                            {/* Kontak */}
                            <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                              <p className="font-semibold text-slate-700 tabular-nums">
                                {supplier.telepon || '-'}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {supplier.email || '-'}
                              </p>
                            </td>

                            {/* Tempo */}
                            <td className="px-4 py-3.5 align-middle text-slate-600 font-medium whitespace-nowrap">
                              {supplier.tempoHari} hari
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                              {supplier.status === 'aktif' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                                  Aktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                                  Arsip
                                </span>
                              )}
                            </td>

                            {/* Aksi Ubah & Arsip */}
                            <td className="px-4 py-3.5 align-middle text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditSupplierModal(supplier);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Ubah</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleArchive(supplier);
                                  }}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                                    supplier.status === 'aktif'
                                      ? 'border-rose-200/80 bg-white hover:bg-rose-50 text-rose-600'
                                      : 'border-cyan-200/80 bg-white hover:bg-[#f0f9fb] text-[#008ba6]'
                                  }`}
                                >
                                  {supplier.status === 'aktif' ? (
                                    <>
                                      <Archive className="w-3.5 h-3.5" />
                                      <span>Arsip</span>
                                    </>
                                  ) : (
                                    <>
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      <span>Pulihkan</span>
                                    </>
                                  )}
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
                    Pemasok
                  </span>

                  <div className="flex items-center gap-2">
                    <label htmlFor="per-halaman-pemasok">Per Halaman</label>
                    <div className="relative">
                      <select
                        id="per-halaman-pemasok"
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

            {/* KOLOM KANAN: PRODUK PEMASOK TERPILIH / EMPTY STATE */}
            <aside className="border-t lg:border-t-0 lg:border-l border-slate-200/80 bg-white flex flex-col">
              {!selectedSupplier ? (
                /* Empty State Sesuai Gambar */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-8">
                  <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mb-3.5">
                    <ClipboardList className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <h2 className="text-sm sm:text-[15px] font-bold text-[#0f3d56]">
                    Pilih Pemasok
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed">
                    Pilih pemasok untuk melihat dan mengelola produk yang
                    dipasok.
                  </p>
                </div>
              ) : (
                /* Detail Produk Pemasok Terpilih */
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3.5 border-b border-slate-100">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-[#008ba6]">
                          {selectedSupplier.kodePemasok}
                        </span>
                        <h2 className="text-sm sm:text-[15px] font-extrabold text-[#0f3d56] truncate">
                          {selectedSupplier.namaPemasok}
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {selectedSupplier.jenis} · Tempo{' '}
                          {selectedSupplier.tempoHari} hari
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedSupplierId(null)}
                        title="Tutup panel pemasok"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Header Daftar Produk Mapping */}
                    <div className="flex items-center justify-between gap-2 mt-4 mb-3">
                      <div>
                        <h3 className="text-xs font-bold text-[#0f3d56]">
                          Produk yang Dipasok
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {selectedSupplier.produkDipasok.length} item terdaftar
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAddingProduct((v) => !v)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#f0f9fb] hover:bg-cyan-100/80 border border-cyan-200/80 text-[11px] font-bold text-[#008ba6] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Produk</span>
                      </button>
                    </div>

                    {/* Form Inline Tambah Produk Mapping */}
                    {isAddingProduct && (
                      <form
                        onSubmit={handleAddMappedProduct}
                        className="mb-3.5 rounded-xl border border-cyan-200/90 bg-[#f0f9fb]/50 p-3 space-y-2.5 text-xs"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newProdKode}
                            onChange={(e) => setNewProdKode(e.target.value)}
                            placeholder="Kode (cth: OBT-01)"
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#009bb8]"
                          />
                          <input
                            type="text"
                            value={newProdSatuan}
                            onChange={(e) => setNewProdSatuan(e.target.value)}
                            placeholder="Satuan (Box/Botol)"
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#009bb8]"
                          />
                        </div>

                        <input
                          type="text"
                          required
                          value={newProdNama}
                          onChange={(e) => setNewProdNama(e.target.value)}
                          placeholder="Nama obat atau alkes..."
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#009bb8]"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            min={0}
                            value={newProdHarga}
                            onChange={(e) => setNewProdHarga(e.target.value)}
                            placeholder="Harga beli (Rp)"
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#009bb8]"
                          />
                          <input
                            type="number"
                            min={1}
                            value={newProdLeadTime}
                            onChange={(e) => setNewProdLeadTime(e.target.value)}
                            placeholder="Lead time (hari)"
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#009bb8]"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setIsAddingProduct(false)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-[11px] font-semibold cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Simpan</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {/* List Produk Dipasok */}
                    {selectedSupplier.produkDipasok.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center text-xs text-slate-400">
                        Belum ada produk yang di-mapping ke pemasok ini.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-0.5">
                        {selectedSupplier.produkDipasok.map((prod) => (
                          <div
                            key={prod.id}
                            className="rounded-xl border border-slate-200/80 bg-white p-3 flex items-start justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-[#008ba6]">
                                {prod.kodeProduk} · {prod.satuan}
                              </span>
                              <p className="font-bold text-[#0f3d56] mt-0.5 leading-snug">
                                {prod.namaProduk}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-1 tabular-nums">
                                {formatRupiah(prod.hargaBeli)} · Estimasi kirim{' '}
                                {prod.leadTimeHari} hari
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveMappedProduct(prod.id)}
                              title="Hapus produk dari pemasok"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      ) : (
        /* Placeholder Ringkas saat Tab Pesanan Pembelian / Penerimaan diklik */
        <section className="bg-white rounded-xl border border-slate-200/90 p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mx-auto mb-3">
            {activeTab === 'pesanan_pembelian' ? (
              <ClipboardList className="w-5 h-5" />
            ) : (
              <Package className="w-5 h-5" />
            )}
          </div>
          <h2 className="text-base font-bold text-[#0f3d56]">
            {activeTab === 'pesanan_pembelian'
              ? 'Daftar Pesanan Pembelian (PO)'
              : 'Daftar Penerimaan Barang'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hubungkan ke sub-komponen{' '}
            {activeTab === 'pesanan_pembelian'
              ? 'PesananPembelian'
              : 'PenerimaanBarang'}{' '}
            melalui prop <code className="text-[#008ba6]">onTabChange</code>.
          </p>
        </section>
      )}

      {/* 3. MODAL TAMBAH / UBAH PEMASOK */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  DIREKTORI PEMASOK
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  {editingSupplier ? 'Ubah Data Pemasok' : 'Pemasok Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSupplierModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveSupplierForm}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Pemasok
                  </label>
                  <input
                    type="text"
                    required
                    value={formKode}
                    onChange={(e) => setFormKode(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis Pemasok
                  </label>
                  <div className="relative">
                    <select
                      value={formJenis}
                      onChange={(e) =>
                        setFormJenis(e.target.value as SupplierType)
                      }
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="Distributor">Distributor</option>
                      <option value="PBF">PBF (Pedagang Besar Farmasi)</option>
                      <option value="Prinsipal">Prinsipal</option>
                      <option value="Apotek Rekanan">Apotek Rekanan</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Pemasok
                </label>
                <input
                  type="text"
                  required
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Contoh: PT. Alkesindo Farma Tara"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    value={formTelepon}
                    onChange={(e) => setFormTelepon(e.target.value)}
                    placeholder="0815..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="email@pemasok.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tempo (Hari)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formTempo}
                    onChange={(e) => setFormTempo(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alamat (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formAlamat}
                  onChange={(e) => setFormAlamat(e.target.value)}
                  placeholder="Alamat lengkap kantor atau gudang pemasok..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
                >
                  {editingSupplier ? 'Simpan Perubahan' : 'Simpan Pemasok'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}