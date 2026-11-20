'use client';

import React, { useMemo, useState } from 'react';
import {
  Archive,
  ArrowUpDown,
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Download,
  Eye,
  Info,
  Link2,
  Pencil,
  Plus,
  Search,
  ShoppingCart,
  Store,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';

export type PemasokStatus = 'aktif' | 'nonaktif';

export type PemasokJenis =
  | 'Produsen yang menjual langsung'
  | 'Distributor'
  | 'Pedagang Besar Farmasi';

export interface PemasokItem {
  id: string;
  kode: string;
  nama: string;
  jenis: PemasokJenis;
  telepon?: string | null;
  email?: string | null;
  alamat?: string;
  tempoHari: number;
  status: PemasokStatus;
}

export interface ProductMappingItem {
  id: string;
  produkNama: string;
  kodeProduk: string;
  pemasokId: string;
  pemasokNama: string;
  hargaBeli: number;
  satuan: string;
  moq: number;
  leadTimeHari?: number;
  status: PemasokStatus;
}

export type ActivePemasokTab = 'master_pemasok' | 'mapping_produk';

type PemasokSortField = 'kode' | 'nama' | 'jenis' | 'tempoHari' | 'status';
type MappingSortField =
  | 'produkNama'
  | 'pemasokNama'
  | 'hargaBeli'
  | 'moq'
  | 'status';
type SortDirection = 'asc' | 'desc';

const DEFAULT_PEMASOK: PemasokItem[] = [
  {
    id: 'sup-1',
    kode: 'SUP-000167',
    nama: 'Novala',
    jenis: 'Produsen yang menjual langsung',
    telepon: '081511210076',
    email: 'marina.novala@gmail.com',
    alamat: 'Jl. Industri Farmasi No. 12, Jakarta Timur',
    tempoHari: 31,
    status: 'aktif',
  },
  {
    id: 'sup-2',
    kode: 'SUP-000033',
    nama: 'PT. Alkesindo Farma Tara',
    jenis: 'Distributor',
    telepon: null,
    email: 'farmatara@gmail.com',
    alamat: 'Jl. Kesehatan Raya No. 88, Jakarta Pusat',
    tempoHari: 31,
    status: 'aktif',
  },
  {
    id: 'sup-3',
    kode: 'SUP-000166',
    nama: 'test',
    jenis: 'Produsen yang menjual langsung',
    telepon: null,
    email: null,
    alamat: 'Belum diisi',
    tempoHari: 0,
    status: 'nonaktif',
  },
];

const DEFAULT_MAPPINGS: ProductMappingItem[] = [
  {
    id: 'map-1',
    produkNama: 'Ambroxol 30 mg Tablet',
    kodeProduk: 'OBT-0023',
    pemasokId: 'sup-2',
    pemasokNama: 'PT. Alkesindo Farma Tara',
    hargaBeli: 500000,
    satuan: 'Tablet',
    moq: 0,
    leadTimeHari: 3,
    status: 'aktif',
  },
  {
    id: 'map-2',
    produkNama: 'Amlodipine 5 mg Tablet',
    kodeProduk: 'OBT-0010',
    pemasokId: 'sup-2',
    pemasokNama: 'PT. Alkesindo Farma Tara',
    hargaBeli: 30000,
    satuan: 'Tablet',
    moq: 0,
    leadTimeHari: 2,
    status: 'aktif',
  },
  {
    id: 'map-3',
    produkNama: 'Topan Farma',
    kodeProduk: 'TST-009',
    pemasokId: 'sup-1',
    pemasokNama: 'Novala',
    hargaBeli: 30000,
    satuan: 'mg',
    moq: 50,
    leadTimeHari: 5,
    status: 'aktif',
  },
];

function formatRupiah(nominal: number): string {
  return `Rp ${nominal.toLocaleString('id-ID')}`;
}

export default function ManajemenPemasok({
  initialPemasok = DEFAULT_PEMASOK,
  initialMappings = DEFAULT_MAPPINGS,
  defaultTab = 'master_pemasok',
  onCreatePemasok,
  onUpdatePemasok,
  onArchivePemasok,
  onCreateMapping,
  onUpdateMapping,
  onDeleteMapping,
}: {
  initialPemasok?: PemasokItem[];
  initialMappings?: ProductMappingItem[];
  defaultTab?: ActivePemasokTab;
  onCreatePemasok?: (item: PemasokItem) => void;
  onUpdatePemasok?: (item: PemasokItem) => void;
  onArchivePemasok?: (item: PemasokItem) => void;
  onCreateMapping?: (item: ProductMappingItem) => void;
  onUpdateMapping?: (item: ProductMappingItem) => void;
  onDeleteMapping?: (item: ProductMappingItem) => void;
}) {
  const [activeTab, setActiveTab] = useState<ActivePemasokTab>(defaultTab);

  // =========================================================================
  // STATE MASTER PEMASOK
  // =========================================================================
  const [pemasokList, setPemasokList] =
    useState<PemasokItem[]>(initialPemasok);
  const [supSearch, setSupSearch] = useState('');
  const [supStatusFilter, setSupStatusFilter] = useState<'all' | PemasokStatus>(
    'all',
  );
  const [supSortField, setSupSortField] = useState<PemasokSortField>('kode');
  const [supSortDir, setSupSortDir] = useState<SortDirection>('asc');
  const [supPageSize, setSupPageSize] = useState<number>(10);
  const [supPage, setSupPage] = useState<number>(1);

  // Modals Master Pemasok
  const [detailPemasok, setDetailPemasok] = useState<PemasokItem | null>(null);
  const [editingPemasok, setEditingPemasok] = useState<PemasokItem | null>(
    null,
  );
  const [isCreatingPemasok, setIsCreatingPemasok] = useState(false);
  const [newPemasok, setNewPemasok] = useState<PemasokItem>({
    id: '',
    kode: '',
    nama: '',
    jenis: 'Distributor',
    telepon: '',
    email: '',
    alamat: '',
    tempoHari: 30,
    status: 'aktif',
  });

  // =========================================================================
  // STATE MAPPING PRODUK PEMASOK
  // =========================================================================
  const [mappings, setMappings] =
    useState<ProductMappingItem[]>(initialMappings);
  const [mapSearch, setMapSearch] = useState('');
  const [mapSupplierFilter, setMapSupplierFilter] = useState<string>('all');
  const [mapStatusFilter, setMapStatusFilter] = useState<'all' | PemasokStatus>(
    'all',
  );
  const [mapSortField, setMapSortField] =
    useState<MappingSortField>('produkNama');
  const [mapSortDir, setMapSortDir] = useState<SortDirection>('asc');
  const [mapPageSize, setMapPageSize] = useState<number>(5);
  const [mapPage, setMapPage] = useState<number>(1);

  // Modals Mapping Produk Pemasok
  const [detailMapping, setDetailMapping] = useState<ProductMappingItem | null>(
    null,
  );
  const [editingMapping, setEditingMapping] =
    useState<ProductMappingItem | null>(null);
  const [isCreatingMapping, setIsCreatingMapping] = useState(false);
  const [newMapping, setNewMapping] = useState<ProductMappingItem>({
    id: '',
    produkNama: '',
    kodeProduk: '',
    pemasokId: initialPemasok[0]?.id ?? '',
    pemasokNama: initialPemasok[0]?.nama ?? '',
    hargaBeli: 0,
    satuan: 'Tablet',
    moq: 0,
    leadTimeHari: 1,
    status: 'aktif',
  });

  // =========================================================================
  // KPI & DERIVED DATA MASTER PEMASOK
  // =========================================================================
  const supStats = useMemo(() => {
    const total = pemasokList.length;
    const aktif = pemasokList.filter((p) => p.status === 'aktif').length;
    const nonaktif = pemasokList.filter((p) => p.status === 'nonaktif').length;
    return { total, aktif, nonaktif };
  }, [pemasokList]);

  const filteredPemasok = useMemo(() => {
    const q = supSearch.trim().toLowerCase();
    const list = pemasokList.filter((item) => {
      if (supStatusFilter !== 'all' && item.status !== supStatusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.nama.toLowerCase().includes(q) ||
        item.kode.toLowerCase().includes(q) ||
        (item.telepon ?? '').toLowerCase().includes(q) ||
        (item.email ?? '').toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      let cmp = 0;
      if (supSortField === 'tempoHari') {
        cmp = a.tempoHari - b.tempoHari;
      } else {
        cmp = String(a[supSortField]).localeCompare(String(b[supSortField]));
      }
      return supSortDir === 'asc' ? cmp : -cmp;
    });
  }, [pemasokList, supSearch, supStatusFilter, supSortField, supSortDir]);

  const supTotalItems = filteredPemasok.length;
  const supTotalPages = Math.max(1, Math.ceil(supTotalItems / supPageSize));
  const safeSupPage = Math.min(supPage, supTotalPages);
  const paginatedPemasok = useMemo(() => {
    const start = (safeSupPage - 1) * supPageSize;
    return filteredPemasok.slice(start, start + supPageSize);
  }, [filteredPemasok, safeSupPage, supPageSize]);

  // =========================================================================
  // KPI & DERIVED DATA MAPPING PRODUK PEMASOK
  // =========================================================================
  const mapStats = useMemo(() => {
    const total = mappings.length;
    const aktif = mappings.filter((m) => m.status === 'aktif').length;
    const nonaktif = mappings.filter((m) => m.status === 'nonaktif').length;
    return { total, aktif, nonaktif };
  }, [mappings]);

  const supplierFilterOptions = useMemo(() => {
    const map = new Map<string, string>();
    pemasokList.forEach((p) => map.set(p.id, p.nama));
    mappings.forEach((m) => {
      if (!map.has(m.pemasokId)) map.set(m.pemasokId, m.pemasokNama);
    });
    return Array.from(map.entries()).map(([id, nama]) => ({ id, nama }));
  }, [pemasokList, mappings]);

  const filteredMappings = useMemo(() => {
    const q = mapSearch.trim().toLowerCase();
    const list = mappings.filter((item) => {
      if (mapSupplierFilter !== 'all' && item.pemasokId !== mapSupplierFilter) {
        return false;
      }
      if (mapStatusFilter !== 'all' && item.status !== mapStatusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.produkNama.toLowerCase().includes(q) ||
        item.kodeProduk.toLowerCase().includes(q) ||
        item.pemasokNama.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      let cmp = 0;
      if (mapSortField === 'hargaBeli' || mapSortField === 'moq') {
        cmp = a[mapSortField] - b[mapSortField];
      } else {
        cmp = String(a[mapSortField]).localeCompare(String(b[mapSortField]));
      }
      return mapSortDir === 'asc' ? cmp : -cmp;
    });
  }, [
    mappings,
    mapSearch,
    mapSupplierFilter,
    mapStatusFilter,
    mapSortField,
    mapSortDir,
  ]);

  const mapTotalItems = filteredMappings.length;
  const mapTotalPages = Math.max(1, Math.ceil(mapTotalItems / mapPageSize));
  const safeMapPage = Math.min(mapPage, mapTotalPages);
  const paginatedMappings = useMemo(() => {
    const start = (safeMapPage - 1) * mapPageSize;
    return filteredMappings.slice(start, start + mapPageSize);
  }, [filteredMappings, safeMapPage, mapPageSize]);

  // =========================================================================
  // HANDLERS MASTER PEMASOK
  // =========================================================================
  const toggleSupSort = (field: PemasokSortField) => {
    if (supSortField === field) {
      setSupSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSupSortField(field);
      setSupSortDir('asc');
    }
  };

  const openNewPemasokModal = () => {
    const nextCode = `SUP-${String(170 + pemasokList.length).padStart(6, '0')}`;
    setNewPemasok({
      id: `sup-${Date.now()}`,
      kode: nextCode,
      nama: '',
      jenis: 'Distributor',
      telepon: '',
      email: '',
      alamat: '',
      tempoHari: 30,
      status: 'aktif',
    });
    setIsCreatingPemasok(true);
  };

  const handleSaveNewPemasok = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPemasok.nama.trim()) return;
    const created: PemasokItem = {
      ...newPemasok,
      nama: newPemasok.nama.trim(),
      telepon: newPemasok.telepon?.trim() || null,
      email: newPemasok.email?.trim() || null,
    };
    setPemasokList((prev) => [created, ...prev]);
    onCreatePemasok?.(created);
    setIsCreatingPemasok(false);
  };

  const handleSaveEditPemasok = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPemasok) return;
    const updated: PemasokItem = {
      ...editingPemasok,
      telepon: editingPemasok.telepon?.trim() || null,
      email: editingPemasok.email?.trim() || null,
    };
    setPemasokList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
    setMappings((prev) =>
      prev.map((m) =>
        m.pemasokId === updated.id ? { ...m, pemasokNama: updated.nama } : m,
      ),
    );
    onUpdatePemasok?.(updated);
    setEditingPemasok(null);
  };

  const handleArchivePemasok = (target: PemasokItem) => {
    const updated: PemasokItem = { ...target, status: 'nonaktif' };
    setPemasokList((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onArchivePemasok?.(updated);
  };

  // =========================================================================
  // HANDLERS MAPPING PRODUK PEMASOK
  // =========================================================================
  const toggleMapSort = (field: MappingSortField) => {
    if (mapSortField === field) {
      setMapSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setMapSortField(field);
      setMapSortDir('asc');
    }
  };

  const openNewMappingModal = () => {
    const defaultSup = pemasokList[0];
    setNewMapping({
      id: `map-${Date.now()}`,
      produkNama: '',
      kodeProduk: '',
      pemasokId: defaultSup?.id ?? '',
      pemasokNama: defaultSup?.nama ?? '',
      hargaBeli: 0,
      satuan: 'Tablet',
      moq: 0,
      leadTimeHari: 1,
      status: 'aktif',
    });
    setIsCreatingMapping(true);
  };

  const handleSaveNewMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMapping.produkNama.trim() || !newMapping.kodeProduk.trim()) return;
    const matchedSup = pemasokList.find((p) => p.id === newMapping.pemasokId);
    const created: ProductMappingItem = {
      ...newMapping,
      produkNama: newMapping.produkNama.trim(),
      kodeProduk: newMapping.kodeProduk.trim().toUpperCase(),
      pemasokNama: matchedSup?.nama ?? newMapping.pemasokNama,
    };
    setMappings((prev) => [created, ...prev]);
    onCreateMapping?.(created);
    setIsCreatingMapping(false);
  };

  const handleSaveEditMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMapping) return;
    const matchedSup = pemasokList.find(
      (p) => p.id === editingMapping.pemasokId,
    );
    const updated: ProductMappingItem = {
      ...editingMapping,
      pemasokNama: matchedSup?.nama ?? editingMapping.pemasokNama,
    };
    setMappings((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
    onUpdateMapping?.(updated);
    setEditingMapping(null);
  };

  const handleDeleteMapping = (target: ProductMappingItem) => {
    setMappings((prev) => prev.filter((item) => item.id !== target.id));
    onDeleteMapping?.(target);
  };

  const handleExportMappingsCsv = () => {
    const headers = [
      'No',
      'Produk',
      'Kode Produk',
      'Pemasok',
      'Harga Beli',
      'Satuan',
      'MOQ',
      'Status',
    ];
    const rows = filteredMappings.map((m, idx) => [
      String(idx + 1),
      `"${m.produkNama.replace(/"/g, '""')}"`,
      m.kodeProduk,
      `"${m.pemasokNama.replace(/"/g, '""')}"`,
      String(m.hargaBeli),
      m.satuan,
      String(m.moq),
      m.status === 'aktif' ? 'Aktif' : 'Nonaktif',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join(
      '\n',
    );
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mapping-produk-pemasok.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. KARTU UTAMA TAB NAVIGASI, KPI & FILTER / TABEL
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Top Tabs: Master Pemasok & Mapping Produk Pemasok */}
        <div
          role="tablist"
          aria-label="Navigasi Pemasok dan Mapping Produk"
          className="px-5 pt-2 border-b border-slate-200/80 flex items-center gap-6 overflow-x-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'master_pemasok'}
            onClick={() => setActiveTab('master_pemasok')}
            className={`relative py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'master_pemasok'
                ? 'text-[#008ba6] font-extrabold'
                : 'text-slate-500 font-semibold hover:text-[#0f3d56]'
            }`}
          >
            <Store
              className={`w-4 h-4 ${
                activeTab === 'master_pemasok'
                  ? 'text-[#008ba6]'
                  : 'text-slate-400'
              }`}
            />
            <span>Master Pemasok</span>
            {activeTab === 'master_pemasok' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8]" />
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'mapping_produk'}
            onClick={() => setActiveTab('mapping_produk')}
            className={`relative py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'mapping_produk'
                ? 'text-[#008ba6] font-extrabold'
                : 'text-slate-500 font-semibold hover:text-[#0f3d56]'
            }`}
          >
            <ClipboardList
              className={`w-4 h-4 ${
                activeTab === 'mapping_produk'
                  ? 'text-[#008ba6]'
                  : 'text-slate-400'
              }`}
            />
            <span>Mapping Produk Pemasok</span>
            {activeTab === 'mapping_produk' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8]" />
            )}
          </button>
        </div>

        {/* ===================================================================
            TAB 1: MASTER PEMASOK
           =================================================================== */}
        {activeTab === 'master_pemasok' && (
          <div className="p-5 space-y-4">
            {/* Baris 3 KPI Card + 1 Kartu Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.45fr] gap-3.5">
              {/* Total Pemasok */}
              <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#edf7fc] text-[#008ba6] flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Total Pemasok
                  </p>
                  <p className="text-lg font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                    {supStats.total}
                  </p>
                </div>
              </div>

              {/* Pemasok Aktif */}
              <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Pemasok Aktif
                  </p>
                  <p className="text-lg font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                    {supStats.aktif}
                  </p>
                </div>
              </div>

              {/* Pemasok Nonaktif */}
              <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Pemasok Nonaktif
                  </p>
                  <p className="text-lg font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                    {supStats.nonaktif}
                  </p>
                </div>
              </div>

              {/* Kartu Info Master Pemasok */}
              <div className="rounded-xl border border-[#b8e6ef] bg-[#edf7fc]/65 px-4 py-3.5 flex items-start gap-3">
                <Info className="w-4 h-4 text-[#008ba6] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-extrabold text-[#0f3d56]">
                    Master Pemasok
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Kelola identitas perusahaan pemasok (vendor) yang memasok
                    produk ke fasilitas.
                  </p>
                </div>
              </div>
            </div>

            {/* Toolbar Pencarian, Filter Status & Tombol + Pemasok Baru */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={supSearch}
                  onChange={(e) => {
                    setSupSearch(e.target.value);
                    setSupPage(1);
                  }}
                  placeholder="Cari pemasok (nama, kode, kontak, email)..."
                  className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
                {supSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setSupSearch('');
                      setSupPage(1);
                    }}
                    aria-label="Hapus pencarian pemasok"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="relative">
                  <select
                    aria-label="Filter status pemasok"
                    value={supStatusFilter}
                    onChange={(e) => {
                      setSupStatusFilter(
                        e.target.value as 'all' | PemasokStatus,
                      );
                      setSupPage(1);
                    }}
                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-8 py-2 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={openNewPemasokModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pemasok Baru</span>
                </button>
              </div>
            </div>

            {/* Tabel Master Pemasok */}
            <div className="rounded-xl border border-slate-200/90 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[880px]">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSupSort('kode')}
                        className="inline-flex items-center gap-1 hover:text-[#0f3d56] cursor-pointer"
                      >
                        <span>KODE</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSupSort('nama')}
                        className="inline-flex items-center gap-1 text-[#008ba6] hover:text-[#006b80] cursor-pointer"
                      >
                        <span>NAMA PEMASOK</span>
                        <ArrowUpDown className="w-3 h-3 text-[#008ba6]" />
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSupSort('jenis')}
                        className="inline-flex items-center gap-1 hover:text-[#0f3d56] cursor-pointer"
                      >
                        <span>JENIS</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="px-4 py-3">KONTAK</th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSupSort('tempoHari')}
                        className="inline-flex items-center gap-1 hover:text-[#0f3d56] cursor-pointer"
                      >
                        <span>TEMPO</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSupSort('status')}
                        className="inline-flex items-center gap-1 hover:text-[#0f3d56] cursor-pointer"
                      >
                        <span>STATUS</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">AKSI</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/70 text-xs">
                  {paginatedPemasok.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 px-4 text-center text-slate-400"
                      >
                        Tidak ada data pemasok yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    paginatedPemasok.map((item) => {
                      const hasContactDetail = Boolean(
                        item.telepon || item.email,
                      );

                      return (
                        <tr
                          key={item.id}
                          className="bg-white hover:bg-slate-50/70 transition-colors"
                        >
                          {/* KODE */}
                          <td className="px-4 py-4 align-middle font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {item.kode}
                          </td>

                          {/* NAMA PEMASOK */}
                          <td className="px-4 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                            {item.nama}
                          </td>

                          {/* JENIS */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100/90 border border-slate-200/70 text-[11px] font-semibold text-slate-600">
                              {item.jenis}
                            </span>
                          </td>

                          {/* KONTAK */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            {hasContactDetail ? (
                              <div>
                                <p className="font-semibold text-[#0f3d56] tabular-nums">
                                  {item.telepon || '—'}
                                </p>
                                {item.email && (
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    {item.email}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div>
                                <p className="font-semibold text-[#0f3d56]">
                                  —
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Kontak belum diisi
                                </p>
                              </div>
                            )}
                          </td>

                          {/* TEMPO */}
                          <td className="px-4 py-4 align-middle text-[#0f3d56] font-medium tabular-nums whitespace-nowrap">
                            {item.tempoHari} hari
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            {item.status === 'aktif' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold">
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-[11px] font-bold">
                                Nonaktif
                              </span>
                            )}
                          </td>

                          {/* AKSI */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setDetailPemasok(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-[#0f3d56] transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                <span>Detail</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditingPemasok({ ...item })}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-[#0f3d56] transition-colors cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                                <span>Ubah</span>
                              </button>

                              {item.status === 'aktif' && (
                                <button
                                  type="button"
                                  onClick={() => handleArchivePemasok(item)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50/60 text-[11px] font-bold text-rose-600 transition-colors cursor-pointer"
                                >
                                  <Archive className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Arsip</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Master Pemasok */}
            <div className="pt-1 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-3 tabular-nums">
                <span>
                  {supTotalItems === 0
                    ? '0'
                    : `${(safeSupPage - 1) * supPageSize + 1}–${Math.min(
                        safeSupPage * supPageSize,
                        supTotalItems,
                      )}`}{' '}
                  dari{' '}
                  <strong className="font-bold text-[#0f3d56]">
                    {supTotalItems}
                  </strong>{' '}
                  Pemasok
                </span>

                <div className="flex items-center gap-2">
                  <span>Per Halaman</span>
                  <div className="relative">
                    <select
                      aria-label="Jumlah baris pemasok per halaman"
                      value={supPageSize}
                      onChange={(e) => {
                        setSupPageSize(Number(e.target.value));
                        setSupPage(1);
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
                  onClick={() => setSupPage(1)}
                  disabled={safeSupPage <= 1}
                  aria-label="Halaman pertama pemasok"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSupPage((p) => Math.max(1, p - 1))}
                  disabled={safeSupPage <= 1}
                  aria-label="Halaman sebelumnya pemasok"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: supTotalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setSupPage(page)}
                      className={`w-7 h-7 rounded-lg border text-xs font-bold cursor-pointer ${
                        page === safeSupPage
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
                    setSupPage((p) => Math.min(supTotalPages, p + 1))
                  }
                  disabled={safeSupPage >= supTotalPages}
                  aria-label="Halaman berikutnya pemasok"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSupPage(supTotalPages)}
                  disabled={safeSupPage >= supTotalPages}
                  aria-label="Halaman terakhir pemasok"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: MAPPING PRODUK PEMASOK
           =================================================================== */}
        {activeTab === 'mapping_produk' && (
          <div className="p-5 space-y-4">
            {/* Baris 3 KPI Card + 1 Kartu Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.45fr] gap-3.5">
              {/* Total Mapping */}
              <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#edf7fc] text-[#008ba6] flex items-center justify-center shrink-0">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Total Mapping
                  </p>
                  <p className="text-lg font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                    {mapStats.total}
                  </p>
                </div>
              </div>

              {/* Mapping Aktif */}
              <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Mapping Aktif
                  </p>
                  <p className="text-lg font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                    {mapStats.aktif}
                  </p>
                </div>
              </div>

              {/* Mapping Nonaktif */}
              <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Mapping Nonaktif
                  </p>
                  <p className="text-lg font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                    {mapStats.nonaktif}
                  </p>
                </div>
              </div>

              {/* Kartu Info Mapping Produk Pemasok */}
              <div className="rounded-xl border border-[#b8e6ef] bg-[#edf7fc]/65 px-4 py-3.5 flex items-start gap-3">
                <Info className="w-4 h-4 text-[#008ba6] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-extrabold text-[#0f3d56]">
                    Mapping Produk Pemasok
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Hubungkan produk dari Master Produk dengan pemasok, harga,
                    dan ketentuan pembelian.
                  </p>
                </div>
              </div>
            </div>

            {/* Toolbar Pencarian, Filter Pemasok, Filter Status, Ekspor & + Mapping Baru */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={mapSearch}
                  onChange={(e) => {
                    setMapSearch(e.target.value);
                    setMapPage(1);
                  }}
                  placeholder="Cari produk (nama atau kode produk)..."
                  className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
                {mapSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setMapSearch('');
                      setMapPage(1);
                    }}
                    aria-label="Hapus pencarian mapping"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="relative">
                  <select
                    aria-label="Filter pemasok mapping"
                    value={mapSupplierFilter}
                    onChange={(e) => {
                      setMapSupplierFilter(e.target.value);
                      setMapPage(1);
                    }}
                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-8 py-2 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="all">Semua Pemasok</option>
                    {supplierFilterOptions.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.nama}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    aria-label="Filter status mapping"
                    value={mapStatusFilter}
                    onChange={(e) => {
                      setMapStatusFilter(
                        e.target.value as 'all' | PemasokStatus,
                      );
                      setMapPage(1);
                    }}
                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-8 py-2 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={handleExportMappingsCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ekspor</span>
                </button>

                <button
                  type="button"
                  onClick={openNewMappingModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mapping Baru</span>
                </button>
              </div>
            </div>

            {/* Tabel Mapping Produk Pemasok */}
            <div className="rounded-xl border border-slate-200/90 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 w-12">NO</th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleMapSort('produkNama')}
                        className="inline-flex items-center gap-1 text-[#008ba6] hover:text-[#006b80] cursor-pointer"
                      >
                        <span>PRODUK</span>
                        <ArrowUpDown className="w-3 h-3 text-[#008ba6]" />
                      </button>
                    </th>
                    <th className="px-4 py-3">KODE PRODUK</th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleMapSort('pemasokNama')}
                        className="inline-flex items-center gap-1 hover:text-[#0f3d56] cursor-pointer"
                      >
                        <span>PEMASOK</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleMapSort('hargaBeli')}
                        className="inline-flex items-center gap-1 hover:text-[#0f3d56] cursor-pointer"
                      >
                        <span>HARGA BELI</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="px-4 py-3">SATUAN</th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleMapSort('moq')}
                        className="inline-flex items-center gap-1 hover:text-[#0f3d56] cursor-pointer"
                      >
                        <span>MOQ</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleMapSort('status')}
                        className="inline-flex items-center gap-1 hover:text-[#0f3d56] cursor-pointer"
                      >
                        <span>STATUS</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">AKSI</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/70 text-xs">
                  {paginatedMappings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-12 px-4 text-center text-slate-400"
                      >
                        Tidak ada data mapping produk pemasok.
                      </td>
                    </tr>
                  ) : (
                    paginatedMappings.map((item, idx) => {
                      const rowNumber = (safeMapPage - 1) * mapPageSize + idx + 1;

                      return (
                        <tr
                          key={item.id}
                          className="bg-white hover:bg-slate-50/70 transition-colors"
                        >
                          {/* NO */}
                          <td className="px-4 py-4 align-middle text-slate-500 tabular-nums whitespace-nowrap">
                            {rowNumber}
                          </td>

                          {/* PRODUK */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <div className="inline-flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-md bg-[#edf7fc] text-[#008ba6] flex items-center justify-center shrink-0">
                                <Link2 className="w-3.5 h-3.5" />
                              </span>
                              <span className="font-bold text-[#0f3d56]">
                                {item.produkNama}
                              </span>
                            </div>
                          </td>

                          {/* KODE PRODUK */}
                          <td className="px-4 py-4 align-middle font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {item.kodeProduk}
                          </td>

                          {/* PEMASOK */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <Store className="w-3.5 h-3.5 text-[#008ba6] shrink-0" />
                              <span className="font-bold text-[#0f3d56]">
                                {item.pemasokNama}
                              </span>
                            </div>
                          </td>

                          {/* HARGA BELI */}
                          <td className="px-4 py-4 align-middle font-extrabold text-[#0f3d56] tabular-nums whitespace-nowrap">
                            {formatRupiah(item.hargaBeli)}
                          </td>

                          {/* SATUAN */}
                          <td className="px-4 py-4 align-middle text-[#0f3d56] font-medium whitespace-nowrap">
                            {item.satuan}
                          </td>

                          {/* MOQ */}
                          <td className="px-4 py-4 align-middle text-[#0f3d56] font-medium tabular-nums whitespace-nowrap">
                            {item.moq}
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            {item.status === 'aktif' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold">
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-[11px] font-bold">
                                Nonaktif
                              </span>
                            )}
                          </td>

                          {/* AKSI */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setDetailMapping(item)}
                                aria-label={`Detail ${item.produkNama}`}
                                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditingMapping({ ...item })}
                                aria-label={`Ubah ${item.produkNama}`}
                                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteMapping(item)}
                                aria-label={`Hapus ${item.produkNama}`}
                                className="w-7 h-7 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 inline-flex items-center justify-center text-rose-500 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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

            {/* Pagination Mapping */}
            <div className="pt-1 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-3 tabular-nums">
                <span>
                  {mapTotalItems === 0
                    ? '0'
                    : `${(safeMapPage - 1) * mapPageSize + 1}–${Math.min(
                        safeMapPage * mapPageSize,
                        mapTotalItems,
                      )}`}{' '}
                  dari{' '}
                  <strong className="font-bold text-[#0f3d56]">
                    {mapTotalItems}
                  </strong>{' '}
                  Mapping
                </span>

                <div className="flex items-center gap-2">
                  <span>Per Halaman</span>
                  <div className="relative">
                    <select
                      aria-label="Jumlah baris mapping per halaman"
                      value={mapPageSize}
                      onChange={(e) => {
                        setMapPageSize(Number(e.target.value));
                        setMapPage(1);
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
                  onClick={() => setMapPage(1)}
                  disabled={safeMapPage <= 1}
                  aria-label="Halaman pertama mapping"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMapPage((p) => Math.max(1, p - 1))}
                  disabled={safeMapPage <= 1}
                  aria-label="Halaman sebelumnya mapping"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: mapTotalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setMapPage(page)}
                      className={`w-7 h-7 rounded-lg border text-xs font-bold cursor-pointer ${
                        page === safeMapPage
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
                    setMapPage((p) => Math.min(mapTotalPages, p + 1))
                  }
                  disabled={safeMapPage >= mapTotalPages}
                  aria-label="Halaman berikutnya mapping"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMapPage(mapTotalPages)}
                  disabled={safeMapPage >= mapTotalPages}
                  aria-label="Halaman terakhir mapping"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Banner Alur Mapping Produk di Bawah Tabel */}
            <div className="pt-2">
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-3 flex flex-col xl:flex-row items-stretch xl:items-center gap-2.5">
                {/* Step 0: Alur Mapping Produk */}
                <div className="rounded-xl border border-[#b8e6ef] bg-[#edf7fc]/80 px-3.5 py-2.5 flex items-center gap-2.5 shrink-0">
                  <Link2 className="w-4 h-4 text-[#008ba6] shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold text-[#0f3d56]">
                      Alur Mapping Produk
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Keterkaitan data dalam proses pengadaan.
                    </p>
                  </div>
                </div>

                {/* Step 1: Master Produk */}
                <div className="flex-1 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 flex items-center gap-2.5">
                  <Box className="w-4 h-4 text-[#008ba6] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0f3d56] truncate">
                      Master Produk
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      Data produk/obat
                    </p>
                  </div>
                </div>

                <span className="hidden xl:inline text-slate-400 text-xs font-semibold shrink-0">
                  &rarr;
                </span>

                {/* Step 2: Master Pemasok */}
                <div className="flex-1 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-[#008ba6] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0f3d56] truncate">
                      Master Pemasok
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      Data vendor
                    </p>
                  </div>
                </div>

                <span className="hidden xl:inline text-slate-400 text-xs font-semibold shrink-0">
                  &rarr;
                </span>

                {/* Step 3: Mapping Produk Pemasok */}
                <div className="flex-1 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 flex items-center gap-2.5">
                  <Link2 className="w-4 h-4 text-[#008ba6] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0f3d56] truncate">
                      Mapping Produk Pemasok
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      Produk, pemasok, harga, satuan, MOQ, dan lead time
                    </p>
                  </div>
                </div>

                <span className="hidden xl:inline text-slate-400 text-xs font-semibold shrink-0">
                  &rarr;
                </span>

                {/* Step 4: Digunakan di Pengadaan */}
                <div className="flex-1 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4 text-[#008ba6] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0f3d56] truncate">
                      Digunakan di Pengadaan
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      PR &rarr; PO &rarr; Penerimaan &rarr; Faktur &rarr;
                      Pembayaran
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          2. MODAL DETAIL PEMASOK
         ===================================================================== */}
      {detailPemasok && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  DETAIL PEMASOK
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  {detailPemasok.nama}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailPemasok(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-400">Kode</p>
                  <p className="font-mono font-bold text-[#0f3d56] mt-0.5">
                    {detailPemasok.kode}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400">
                    Tempo Pembayaran
                  </p>
                  <p className="font-bold text-[#0f3d56] mt-0.5 tabular-nums">
                    {detailPemasok.tempoHari} hari
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400">Jenis</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {detailPemasok.jenis}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400">
                    Telepon / Email
                  </p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {detailPemasok.telepon || detailPemasok.email || '—'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400">Alamat</p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {detailPemasok.alamat || 'Belum diisi'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDetailPemasok(null)}
                  className="px-4 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. MODAL TAMBAH / UBAH PEMASOK
         ===================================================================== */}
      {(isCreatingPemasok || editingPemasok) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {isCreatingPemasok ? 'TAMBAH PEMASOK BARU' : 'UBAH PEMASOK'}
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  {isCreatingPemasok
                    ? 'Registrasi Vendor Pemasok'
                    : editingPemasok?.nama}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingPemasok(false);
                  setEditingPemasok(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={
                isCreatingPemasok ? handleSaveNewPemasok : handleSaveEditPemasok
              }
              className="p-5 space-y-3.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Kode Pemasok
                  </label>
                  <input
                    type="text"
                    required
                    value={
                      isCreatingPemasok
                        ? newPemasok.kode
                        : editingPemasok?.kode ?? ''
                    }
                    onChange={(e) =>
                      isCreatingPemasok
                        ? setNewPemasok({ ...newPemasok, kode: e.target.value })
                        : editingPemasok &&
                          setEditingPemasok({
                            ...editingPemasok,
                            kode: e.target.value,
                          })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Nama Pemasok
                  </label>
                  <input
                    type="text"
                    required
                    value={
                      isCreatingPemasok
                        ? newPemasok.nama
                        : editingPemasok?.nama ?? ''
                    }
                    onChange={(e) =>
                      isCreatingPemasok
                        ? setNewPemasok({ ...newPemasok, nama: e.target.value })
                        : editingPemasok &&
                          setEditingPemasok({
                            ...editingPemasok,
                            nama: e.target.value,
                          })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Jenis
                  </label>
                  <select
                    value={
                      isCreatingPemasok
                        ? newPemasok.jenis
                        : editingPemasok?.jenis ?? 'Distributor'
                    }
                    onChange={(e) => {
                      const val = e.target.value as PemasokJenis;
                      isCreatingPemasok
                        ? setNewPemasok({ ...newPemasok, jenis: val })
                        : editingPemasok &&
                          setEditingPemasok({ ...editingPemasok, jenis: val });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Produsen yang menjual langsung">
                      Produsen yang menjual langsung
                    </option>
                    <option value="Distributor">Distributor</option>
                    <option value="Pedagang Besar Farmasi">
                      Pedagang Besar Farmasi
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Tempo (hari)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={
                      isCreatingPemasok
                        ? newPemasok.tempoHari
                        : editingPemasok?.tempoHari ?? 0
                    }
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      isCreatingPemasok
                        ? setNewPemasok({ ...newPemasok, tempoHari: val })
                        : editingPemasok &&
                          setEditingPemasok({
                            ...editingPemasok,
                            tempoHari: val,
                          });
                    }}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Status
                  </label>
                  <select
                    value={
                      isCreatingPemasok
                        ? newPemasok.status
                        : editingPemasok?.status ?? 'aktif'
                    }
                    onChange={(e) => {
                      const val = e.target.value as PemasokStatus;
                      isCreatingPemasok
                        ? setNewPemasok({ ...newPemasok, status: val })
                        : editingPemasok &&
                          setEditingPemasok({ ...editingPemasok, status: val });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    value={
                      isCreatingPemasok
                        ? newPemasok.telepon ?? ''
                        : editingPemasok?.telepon ?? ''
                    }
                    onChange={(e) =>
                      isCreatingPemasok
                        ? setNewPemasok({
                            ...newPemasok,
                            telepon: e.target.value,
                          })
                        : editingPemasok &&
                          setEditingPemasok({
                            ...editingPemasok,
                            telepon: e.target.value,
                          })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={
                      isCreatingPemasok
                        ? newPemasok.email ?? ''
                        : editingPemasok?.email ?? ''
                    }
                    onChange={(e) =>
                      isCreatingPemasok
                        ? setNewPemasok({
                            ...newPemasok,
                            email: e.target.value,
                          })
                        : editingPemasok &&
                          setEditingPemasok({
                            ...editingPemasok,
                            email: e.target.value,
                          })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingPemasok(false);
                    setEditingPemasok(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. MODAL DETAIL MAPPING PRODUK PEMASOK
         ===================================================================== */}
      {detailMapping && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  DETAIL MAPPING PRODUK
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  {detailMapping.produkNama}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailMapping(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-400">
                    Kode Produk
                  </p>
                  <p className="font-mono font-bold text-[#0f3d56] mt-0.5">
                    {detailMapping.kodeProduk}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400">
                    Pemasok
                  </p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {detailMapping.pemasokNama}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400">
                    Harga Beli
                  </p>
                  <p className="font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                    {formatRupiah(detailMapping.hargaBeli)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400">
                    Satuan &amp; MOQ
                  </p>
                  <p className="font-semibold text-slate-700 mt-0.5 tabular-nums">
                    {detailMapping.satuan} &middot; MOQ {detailMapping.moq}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDetailMapping(null)}
                  className="px-4 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. MODAL TAMBAH / UBAH MAPPING PRODUK PEMASOK
         ===================================================================== */}
      {(isCreatingMapping || editingMapping) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {isCreatingMapping ? 'MAPPING BARU' : 'UBAH MAPPING'}
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  {isCreatingMapping
                    ? 'Hubungkan Produk dengan Pemasok'
                    : editingMapping?.produkNama}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingMapping(false);
                  setEditingMapping(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={
                isCreatingMapping ? handleSaveNewMapping : handleSaveEditMapping
              }
              className="p-5 space-y-3.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={
                      isCreatingMapping
                        ? newMapping.produkNama
                        : editingMapping?.produkNama ?? ''
                    }
                    onChange={(e) =>
                      isCreatingMapping
                        ? setNewMapping({
                            ...newMapping,
                            produkNama: e.target.value,
                          })
                        : editingMapping &&
                          setEditingMapping({
                            ...editingMapping,
                            produkNama: e.target.value,
                          })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Kode Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={
                      isCreatingMapping
                        ? newMapping.kodeProduk
                        : editingMapping?.kodeProduk ?? ''
                    }
                    onChange={(e) =>
                      isCreatingMapping
                        ? setNewMapping({
                            ...newMapping,
                            kodeProduk: e.target.value,
                          })
                        : editingMapping &&
                          setEditingMapping({
                            ...editingMapping,
                            kodeProduk: e.target.value,
                          })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Pemasok
                  </label>
                  <select
                    value={
                      isCreatingMapping
                        ? newMapping.pemasokId
                        : editingMapping?.pemasokId ?? ''
                    }
                    onChange={(e) => {
                      const sup = pemasokList.find(
                        (p) => p.id === e.target.value,
                      );
                      isCreatingMapping
                        ? setNewMapping({
                            ...newMapping,
                            pemasokId: e.target.value,
                            pemasokNama: sup?.nama ?? '',
                          })
                        : editingMapping &&
                          setEditingMapping({
                            ...editingMapping,
                            pemasokId: e.target.value,
                            pemasokNama: sup?.nama ?? '',
                          });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  >
                    {pemasokList.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Harga Beli (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={
                      isCreatingMapping
                        ? newMapping.hargaBeli
                        : editingMapping?.hargaBeli ?? 0
                    }
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      isCreatingMapping
                        ? setNewMapping({ ...newMapping, hargaBeli: val })
                        : editingMapping &&
                          setEditingMapping({
                            ...editingMapping,
                            hargaBeli: val,
                          });
                    }}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    required
                    value={
                      isCreatingMapping
                        ? newMapping.satuan
                        : editingMapping?.satuan ?? ''
                    }
                    onChange={(e) =>
                      isCreatingMapping
                        ? setNewMapping({ ...newMapping, satuan: e.target.value })
                        : editingMapping &&
                          setEditingMapping({
                            ...editingMapping,
                            satuan: e.target.value,
                          })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    MOQ
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={
                      isCreatingMapping
                        ? newMapping.moq
                        : editingMapping?.moq ?? 0
                    }
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      isCreatingMapping
                        ? setNewMapping({ ...newMapping, moq: val })
                        : editingMapping &&
                          setEditingMapping({ ...editingMapping, moq: val });
                    }}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Status
                  </label>
                  <select
                    value={
                      isCreatingMapping
                        ? newMapping.status
                        : editingMapping?.status ?? 'aktif'
                    }
                    onChange={(e) => {
                      const val = e.target.value as PemasokStatus;
                      isCreatingMapping
                        ? setNewMapping({ ...newMapping, status: val })
                        : editingMapping &&
                          setEditingMapping({ ...editingMapping, status: val });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingMapping(false);
                    setEditingMapping(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                >
                  Simpan Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}