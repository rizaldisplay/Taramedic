'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Code2,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Info,
  ListFilter,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Stethoscope,
  Upload,
  X,
} from 'lucide-react';

export type TindakanStatusKey = 'aktif' | 'nonaktif';
export type TindakanMappingStatusKey =
  | 'perlu_review'
  | 'tervalidasi_lokal'
  | 'belum_dipetakan';
export type TindakanDetailTabKey = 'ringkasan' | 'tarif' | 'riwayat';
export type TindakanSortFieldKey = 'kode' | 'nama' | 'kategori' | 'tarifUmum';

export interface TindakanHistoryEntry {
  id: string;
  tanggal: string;
  aktivitas: string;
  oleh: string;
}

export interface MasterTindakanItem {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  status: TindakanStatusKey;
  referensi: string;
  ringkasan: string;
  unitScopeCode: string;
  unitScopeLabel: string;
  profesi: string;
  icd9Code: string;
  icd9Version: string;
  kptlCode: string;
  snomedCode: string;
  mappingStatus: TindakanMappingStatusKey;
  penagihan: 'Billable' | 'Non-billable';
  butuhBmhp: boolean;
  tarifUmum: number;
  tarifBpjs?: number;
  sumber: string;
  berlakuMulai: string;
  berlakuSampai: string;
  riwayat: TindakanHistoryEntry[];
}

const DEFAULT_TINDAKAN_LIST: MasterTindakanItem[] = [
  {
    id: 'tnd-1',
    kode: 'TND-0001',
    nama: 'Konsultasi dokter spesialis anak',
    kategori: 'Konsultasi',
    status: 'aktif',
    referensi: 'Klinis',
    ringkasan: 'Konsultasi klinis oleh dokter spesialis anak.',
    unitScopeCode: 'POLI-ANAK',
    unitScopeLabel: 'Poli Anak',
    profesi: 'Belum diatur',
    icd9Code: '89.7',
    icd9Version: '2011',
    kptlCode: 'KPTL.01.01.002',
    snomedCode: '410620009',
    mappingStatus: 'perlu_review',
    penagihan: 'Billable',
    butuhBmhp: false,
    tarifUmum: 140000,
    tarifBpjs: undefined,
    sumber: 'Katalog klinis internal',
    berlakuMulai: '1 Jan 2026',
    berlakuSampai: 'Tanpa batas akhir',
    riwayat: [
      {
        id: 'hist-1',
        tanggal: '1 Jan 2026',
        aktivitas:
          'Entri tindakan ditambahkan dari Katalog klinis internal (Mapping KPTL & SNOMED CT lokal).',
        oleh: 'Administrator Sistem',
      },
    ],
  },
  {
    id: 'tnd-2',
    kode: 'TND-0002',
    nama: 'Edukasi pasien dan keluarga',
    kategori: 'Edukasi',
    status: 'aktif',
    referensi: 'Klinis',
    ringkasan:
      'Pemberian komunikasi, informasi, dan edukasi klinis kepada pasien serta keluarga.',
    unitScopeCode: 'SEMUA-UNIT',
    unitScopeLabel: 'Semua unit',
    profesi: 'Belum diatur',
    icd9Code: '87.44',
    icd9Version: '2011',
    kptlCode: 'KPTL.01.02.004',
    snomedCode: '409073007',
    mappingStatus: 'perlu_review',
    penagihan: 'Billable',
    butuhBmhp: false,
    tarifUmum: 25000,
    tarifBpjs: undefined,
    sumber: 'Katalog klinis internal',
    berlakuMulai: '1 Jan 2026',
    berlakuSampai: 'Tanpa batas akhir',
    riwayat: [
      {
        id: 'hist-2',
        tanggal: '1 Jan 2026',
        aktivitas: 'Entri tindakan ditambahkan dari Katalog klinis internal.',
        oleh: 'Administrator Sistem',
      },
    ],
  },
  {
    id: 'tnd-3',
    kode: 'TND-0003',
    nama: 'Pemeriksaan fisik lanjutan',
    kategori: 'Pemeriksaan',
    status: 'aktif',
    referensi: 'Klinis',
    ringkasan:
      'Evaluasi pemeriksaan fisik lanjutan terfokus sesuai indikasi medis pasien.',
    unitScopeCode: 'SEMUA-UNIT',
    unitScopeLabel: 'Semua unit',
    profesi: 'Belum diatur',
    icd9Code: '89.9',
    icd9Version: '2011',
    kptlCode: 'KPTL.01.01.008',
    snomedCode: '5880005',
    mappingStatus: 'perlu_review',
    penagihan: 'Billable',
    butuhBmhp: false,
    tarifUmum: 60000,
    tarifBpjs: undefined,
    sumber: 'Katalog klinis internal',
    berlakuMulai: '1 Jan 2026',
    berlakuSampai: 'Tanpa batas akhir',
    riwayat: [
      {
        id: 'hist-3',
        tanggal: '1 Jan 2026',
        aktivitas: 'Entri tindakan ditambahkan dari Katalog klinis internal.',
        oleh: 'Administrator Sistem',
      },
    ],
  },
];

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function getMappingLabel(status: TindakanMappingStatusKey): string {
  switch (status) {
    case 'tervalidasi_lokal':
      return 'Tervalidasi lokal';
    case 'belum_dipetakan':
      return 'Belum dipetakan';
    case 'perlu_review':
    default:
      return 'Perlu review';
  }
}

export default function DaftarTindakanDanProsedur({
  initialItems = DEFAULT_TINDAKAN_LIST,
  onAddTindakan,
  onUpdateTindakan,
}: {
  initialItems?: MasterTindakanItem[];
  onAddTindakan?: (item: MasterTindakanItem) => void;
  onUpdateTindakan?: (item: MasterTindakanItem) => void;
}) {
  const [items, setItems] = useState<MasterTindakanItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialItems[0]?.id ?? null,
  );
  const [detailTab, setDetailTab] = useState<TindakanDetailTabKey>('ringkasan');

  // State Pencarian, 4 Filter & Urutkan
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TindakanStatusKey>(
    'ALL',
  );
  const [mappingFilter, setMappingFilter] = useState<
    'ALL' | TindakanMappingStatusKey
  >('ALL');
  const [scopeFilter, setScopeFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<TindakanSortFieldKey>('kode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal Tambah & Edit Tindakan
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterTindakanItem | null>(
    null,
  );

  // Form State Tambah Tindakan
  const [newKode, setNewKode] = useState('TND-0004');
  const [newNama, setNewNama] = useState('');
  const [newKategori, setNewKategori] = useState('Konsultasi');
  const [newScopeCode, setNewScopeCode] = useState('SEMUA-UNIT');
  const [newScopeLabel, setNewScopeLabel] = useState('Semua unit');
  const [newIcd9Code, setNewIcd9Code] = useState('');
  const [newKptlCode, setNewKptlCode] = useState('');
  const [newSnomedCode, setNewSnomedCode] = useState('');
  const [newTarifUmum, setNewTarifUmum] = useState<number>(75000);
  const [newRingkasan, setNewRingkasan] = useState('');

  const importFileInputRef = useRef<HTMLInputElement | null>(null);

  // Opsi unik Kategori & Scope untuk filter dropdown
  const categoryOptions = useMemo(
    () => Array.from(new Set(items.map((item) => item.kategori))),
    [items],
  );
  const scopeOptions = useMemo(
    () => Array.from(new Set(items.map((item) => item.unitScopeLabel))),
    [items],
  );

  // Filter & Urutkan Data
  const processedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (categoryFilter !== 'ALL' && item.kategori !== categoryFilter) {
        return false;
      }

      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (mappingFilter !== 'ALL' && item.mappingStatus !== mappingFilter) {
        return false;
      }

      if (scopeFilter !== 'ALL' && item.unitScopeLabel !== scopeFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.kode.toLowerCase().includes(q) ||
          item.nama.toLowerCase().includes(q) ||
          item.icd9Code.toLowerCase().includes(q) ||
          item.kptlCode.toLowerCase().includes(q) ||
          item.snomedCode.toLowerCase().includes(q) ||
          item.kategori.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      let compare = 0;
      if (sortField === 'kode') {
        compare = a.kode.localeCompare(b.kode, 'en', { numeric: true });
      } else if (sortField === 'nama') {
        compare = a.nama.localeCompare(b.nama, 'id');
      } else if (sortField === 'kategori') {
        compare = a.kategori.localeCompare(b.kategori, 'id');
      } else {
        compare = a.tarifUmum - b.tarifUmum;
      }
      return sortDirection === 'asc' ? compare : -compare;
    });
  }, [
    items,
    categoryFilter,
    statusFilter,
    mappingFilter,
    scopeFilter,
    searchQuery,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalItems = processedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return processedItems.slice(startIdx, startIdx + pageSize);
  }, [processedItems, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  // Item terpilih untuk panel kanan
  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return items.find((item) => item.id === selectedId) ?? null;
  }, [items, selectedId]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setMappingFilter('ALL');
    setScopeFilter('ALL');
    setSortField('kode');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  const handleToggleItemStatus = (target: MasterTindakanItem) => {
    const nextStatus: TindakanStatusKey =
      target.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: MasterTindakanItem = {
      ...target,
      status: nextStatus,
      riwayat: [
        {
          id: `hist-${Date.now()}`,
          tanggal: '19 Nov 2026',
          aktivitas: `Status tindakan diubah menjadi ${
            nextStatus === 'aktif' ? 'Aktif' : 'Nonaktif'
          }.`,
          oleh: 'Administrator Sistem',
        },
        ...target.riwayat,
      ],
    };

    setItems((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onUpdateTindakan?.(updated);
  };

  const handleOpenAddModal = () => {
    const nextSeq = String(items.length + 1).padStart(4, '0');
    setNewKode(`TND-${nextSeq}`);
    setNewNama('');
    setNewKategori('Konsultasi');
    setNewScopeCode('SEMUA-UNIT');
    setNewScopeLabel('Semua unit');
    setNewIcd9Code('');
    setNewKptlCode('');
    setNewSnomedCode('');
    setNewTarifUmum(75000);
    setNewRingkasan('');
    setIsAddModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKode.trim() || !newNama.trim()) return;

    const created: MasterTindakanItem = {
      id: `tnd-${Date.now()}`,
      kode: newKode.trim().toUpperCase(),
      nama: newNama.trim(),
      kategori: newKategori,
      status: 'aktif',
      referensi: 'Klinis',
      ringkasan:
        newRingkasan.trim() || `${newNama.trim()} sesuai standar klinis.`,
      unitScopeCode: newScopeCode,
      unitScopeLabel: newScopeLabel,
      profesi: 'Belum diatur',
      icd9Code: newIcd9Code.trim() || '89.0',
      icd9Version: '2011',
      kptlCode: newKptlCode.trim() || 'KPTL.01.01.001',
      snomedCode: newSnomedCode.trim() || '386053000',
      mappingStatus: 'perlu_review',
      penagihan: 'Billable',
      butuhBmhp: false,
      tarifUmum: Math.max(0, Number(newTarifUmum) || 0),
      tarifBpjs: undefined,
      sumber: 'Katalog klinis internal',
      berlakuMulai: '19 Nov 2026',
      berlakuSampai: 'Tanpa batas akhir',
      riwayat: [
        {
          id: `hist-${Date.now()}`,
          tanggal: '19 Nov 2026',
          aktivitas: 'Tindakan baru dibuat pada Katalog klinis internal.',
          oleh: 'Administrator Sistem',
        },
      ],
    };

    setItems((prev) => [...prev, created]);
    setSelectedId(created.id);
    setDetailTab('ringkasan');
    onAddTindakan?.(created);
    setIsAddModalOpen(false);
  };

  // CSV Template & Ekspor Data
  const handleDownloadCsv = (onlyTemplate: boolean) => {
    const header =
      'kode,nama_tindakan,kategori,unit_scope,icd9_cm,kptl,snomed_ct,tarif_umum,status';
    const rows = onlyTemplate
      ? [
          'TND-0001,Konsultasi dokter spesialis anak,Konsultasi,Poli Anak,89.7,KPTL.01.01.002,410620009,140000,aktif',
        ]
      : processedItems.map(
          (item) =>
            `${item.kode},"${item.nama.replace(/"/g, '""')}",${
              item.kategori
            },"${item.unitScopeLabel}",${item.icd9Code},${item.kptlCode},${
              item.snomedCode
            },${item.tarifUmum},${item.status}`,
        );

    const blob = new Blob([[header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = onlyTemplate
      ? 'template-master-tindakan.csv'
      : 'data-master-tindakan-prosedur.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV Impor
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const lines = reader.result
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length <= 1) return;

      const imported: MasterTindakanItem[] = lines.slice(1).map((line, idx) => {
        const cols = line
          .split(',')
          .map((c) => c.replace(/^"|"$/g, '').trim());
        const scopeLabel = cols[3] || 'Semua unit';
        return {
          id: `tnd-imp-${Date.now()}-${idx}`,
          kode: (cols[0] || `TND-IMP-${idx + 1}`).toUpperCase(),
          nama: cols[1] || 'Tindakan Klinis Baru',
          kategori: cols[2] || 'Tindakan Medis',
          status:
            cols[8]?.toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif',
          referensi: 'Klinis',
          ringkasan: `${cols[1] || 'Tindakan Klinis Baru'} (Impor CSV).`,
          unitScopeCode: scopeLabel.toUpperCase().replace(/\s+/g, '-'),
          unitScopeLabel: scopeLabel,
          profesi: 'Belum diatur',
          icd9Code: cols[4] || '89.0',
          icd9Version: '2011',
          kptlCode: cols[5] || 'KPTL.01.01.001',
          snomedCode: cols[6] || '386053000',
          mappingStatus: 'perlu_review',
          penagihan: 'Billable',
          butuhBmhp: false,
          tarifUmum: Number(cols[7]) || 0,
          tarifBpjs: undefined,
          sumber: 'Katalog klinis internal (Impor CSV)',
          berlakuMulai: '19 Nov 2026',
          berlakuSampai: 'Tanpa batas akhir',
          riwayat: [
            {
              id: `hist-imp-${Date.now()}-${idx}`,
              tanggal: '19 Nov 2026',
              aktivitas: 'Diimpor melalui berkas CSV Master Tindakan.',
              oleh: 'Administrator Sistem',
            },
          ],
        };
      });

      setItems((prev) => [...prev, ...imported]);
      if (imported[0]) setSelectedId(imported[0].id);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. BANNER INFORMASI ATAS
         ===================================================================== */}
      <div className="rounded-xl border border-sky-200/80 bg-[#f0f8fc] px-4 py-3 flex items-center gap-2.5 text-xs text-[#0f3d56]">
        <Info className="w-4 h-4 text-[#008ba6] shrink-0" />
        <p>
          Tarif tindakan disimpan terpisah dari tarif layanan dan dikaitkan ke
          ID master tindakan. Mapping KPTL dan SNOMED CT bersifat lokal.
        </p>
      </div>

      {/* =====================================================================
          2. GRID UTAMA 2 KOLOM: DAFTAR TINDAKAN (KIRI) & DETAIL (KANAN)
         ===================================================================== */}
      <div
        className={`grid grid-cols-1 ${
          selectedItem ? 'xl:grid-cols-[1.65fr_1fr]' : 'grid-cols-1'
        } gap-4 items-start`}
      >
        {/* ===================================================================
            KOLOM KIRI: DAFTAR TINDAKAN & PROSEDUR
           =================================================================== */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header Kartu Kiri */}
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                Daftar Tindakan &amp; Prosedur
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Terminologi klinis lokal dengan mapping kode yang terukur.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadCsv(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                <span>Template</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadCsv(false)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Ekspor Data</span>
              </button>

              <input
                ref={importFileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImportCsv}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => importFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Impor</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah tindakan</span>
              </button>
            </div>
          </div>

          {/* Search Bar & 4 Kartu Filter */}
          <div className="px-5 pb-4 space-y-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari kode, nama tindakan, ICD-9-CM, KPTL, SNOMED CT..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>

            {/* 4 Kartu Filter Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Filter 1: Kategori */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-2.5">
                <label
                  htmlFor="filter-tindakan-kategori"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f3d56] mb-1.5"
                >
                  <ListFilter className="w-3.5 h-3.5 text-[#008ba6]" />
                  <span>Kategori</span>
                </label>
                <div className="relative">
                  <select
                    id="filter-tindakan-kategori"
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="ALL">Semua kategori</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 2: Status */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-2.5">
                <label
                  htmlFor="filter-tindakan-status"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f3d56] mb-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#008ba6]" />
                  <span>Status</span>
                </label>
                <div className="relative">
                  <select
                    id="filter-tindakan-status"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(
                        e.target.value as 'ALL' | TindakanStatusKey,
                      );
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="ALL">Semua status</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 3: Mapping */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-2.5">
                <label
                  htmlFor="filter-tindakan-mapping"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f3d56] mb-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#008ba6]" />
                  <span>Mapping</span>
                </label>
                <div className="relative">
                  <select
                    id="filter-tindakan-mapping"
                    value={mappingFilter}
                    onChange={(e) => {
                      setMappingFilter(
                        e.target.value as 'ALL' | TindakanMappingStatusKey,
                      );
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="ALL">Semua mapping</option>
                    <option value="perlu_review">Perlu review</option>
                    <option value="tervalidasi_lokal">Tervalidasi lokal</option>
                    <option value="belum_dipetakan">Belum dipetakan</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Filter 4: Unit / Scope */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-2.5">
                <label
                  htmlFor="filter-tindakan-scope"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f3d56] mb-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#008ba6]" />
                  <span>Unit / Scope</span>
                </label>
                <div className="relative">
                  <select
                    id="filter-tindakan-scope"
                    value={scopeFilter}
                    onChange={(e) => {
                      setScopeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="ALL">Semua scope</option>
                    {scopeOptions.map((scope) => (
                      <option key={scope} value={scope}>
                        {scope}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Sub-bar Jumlah Data + Urutkan + Reset Filter */}
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <ListFilter className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Menampilkan{' '}
                  <strong className="font-bold text-[#0f3d56]">
                    {totalItems}
                  </strong>{' '}
                  data
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">Urutkan</span>

                <div className="relative w-32">
                  <select
                    aria-label="Urutkan Tindakan"
                    value={sortField}
                    onChange={(e) =>
                      setSortField(e.target.value as TindakanSortFieldKey)
                    }
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="kode">Kode</option>
                    <option value="nama">Nama</option>
                    <option value="kategori">Kategori</option>
                    <option value="tarifUmum">Tarif Umum</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSortDirection((prev) =>
                      prev === 'asc' ? 'desc' : 'asc',
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      sortDirection === 'desc' ? 'rotate-180' : ''
                    }`}
                  />
                  <span>{sortDirection === 'asc' ? 'Naik' : 'Turun'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabel Daftar Tindakan & Prosedur */}
          <div className="overflow-x-auto border-t border-slate-200/80">
            <table className="w-full text-left border-collapse min-w-[960px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pl-5 pr-3 py-3.5 min-w-[230px]">
                    TINDAKAN / PROSEDUR
                  </th>
                  <th className="px-3 py-3.5">KATEGORI</th>
                  <th className="px-3 py-3.5">UNIT / SCOPE</th>
                  <th className="px-3 py-3.5">PROFESI</th>
                  <th className="px-3 py-3.5">ICD-9-CM</th>
                  <th className="px-3 py-3.5">PENAGIHAN</th>
                  <th className="px-3 py-3.5">BMHP</th>
                  <th className="px-3 py-3.5">UMUM</th>
                  <th className="px-3 py-3.5">BPJS</th>
                  <th className="pl-3 pr-5 py-3.5">STATUS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-12 px-5 text-center text-slate-400"
                    >
                      Tidak ada tindakan atau prosedur yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#edf7fc]'
                            : 'hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        {/* TINDAKAN / PROSEDUR */}
                        <td className="pl-5 pr-3 py-4 align-middle">
                          <p className="font-mono text-xs font-extrabold text-[#008ba6]">
                            {item.kode}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                            {item.nama}
                          </p>
                        </td>

                        {/* KATEGORI */}
                        <td className="px-3 py-4 align-middle text-[#0f3d56] whitespace-nowrap">
                          {item.kategori}
                        </td>

                        {/* UNIT / SCOPE */}
                        <td className="px-3 py-4 align-middle text-[#0f3d56] whitespace-nowrap">
                          {item.unitScopeLabel}
                        </td>

                        {/* PROFESI */}
                        <td className="px-3 py-4 align-middle text-slate-500 whitespace-nowrap">
                          {item.profesi}
                        </td>

                        {/* ICD-9-CM */}
                        <td className="px-3 py-4 align-middle whitespace-nowrap">
                          <span className="font-bold text-[#0f3d56]">
                            {item.icd9Code}
                          </span>{' '}
                          <span className="text-[11px] text-slate-400">
                            versi {item.icd9Version}
                          </span>
                        </td>

                        {/* PENAGIHAN */}
                        <td className="px-3 py-4 align-middle text-[#0f3d56] whitespace-nowrap">
                          {item.penagihan}
                        </td>

                        {/* BMHP */}
                        <td className="px-3 py-4 align-middle text-[#0f3d56] whitespace-nowrap">
                          {item.butuhBmhp ? 'Ya' : 'Tidak'}
                        </td>

                        {/* UMUM */}
                        <td className="px-3 py-4 align-middle font-bold text-emerald-700 tabular-nums whitespace-nowrap">
                          {formatRupiah(item.tarifUmum)}
                        </td>

                        {/* BPJS */}
                        <td className="px-3 py-4 align-middle whitespace-nowrap">
                          {typeof item.tarifBpjs === 'number' ? (
                            <span className="font-bold text-[#0f3d56] tabular-nums">
                              {formatRupiah(item.tarifBpjs)}
                            </span>
                          ) : (
                            <span className="font-medium text-amber-600">
                              Belum diatur
                            </span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="pl-3 pr-5 py-4 align-middle whitespace-nowrap">
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
                  {startNumber}–{endNumber}
                </strong>{' '}
                dari{' '}
                <strong className="font-semibold text-slate-700">
                  {totalItems}
                </strong>{' '}
                Hasil
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="per-halaman-tindakan">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-tindakan"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
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
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                aria-label="Halaman sebelumnya"
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
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
                          ? 'bg-[#e6f6f9] border-[#009bb8] text-[#008ba6]'
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
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={safePage >= totalPages}
                aria-label="Halaman terakhir"
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================================
            KOLOM KANAN: PANEL DETAIL TINDAKAN & PROSEDUR
           =================================================================== */}
        {selectedItem && (
          <aside className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 space-y-4">
            {/* Header Detail */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#e6f6f9] text-[#008ba6] flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-extrabold text-[#0f3d56] leading-snug">
                    {selectedItem.nama}
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    {selectedItem.kode}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Tutup panel detail"
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Kartu Mini Metadata */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5">
                <p className="text-[11px] text-slate-400">Kategori</p>
                <p className="text-xs font-bold text-[#0f3d56] mt-0.5">
                  {selectedItem.kategori}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5">
                <p className="text-[11px] text-slate-400">Status</p>
                <p className="text-xs font-bold text-[#0f3d56] mt-0.5">
                  {selectedItem.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5">
                <p className="text-[11px] text-slate-400">Referensi</p>
                <p className="text-xs font-bold text-[#0f3d56] mt-0.5">
                  {selectedItem.referensi}
                </p>
              </div>
            </div>

            {/* Ringkasan */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                RINGKASAN
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedItem.ringkasan}
              </p>
            </div>

            {/* Tab Switcher: Ringkasan | Tarif | Riwayat */}
            <div
              role="tablist"
              aria-label="Detail Tindakan Tabs"
              className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200/80 bg-slate-50/70 p-1 text-xs"
            >
              {(
                [
                  { key: 'ringkasan', label: 'Ringkasan' },
                  { key: 'tarif', label: 'Tarif' },
                  { key: 'riwayat', label: 'Riwayat' },
                ] as const
              ).map((tab) => {
                const isActive = detailTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setDetailTab(tab.key)}
                    className={`py-2 rounded-lg text-center transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#e6f6f9] text-[#008ba6] font-bold'
                        : 'text-slate-600 font-semibold hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Konten Tab Detail */}
            {detailTab === 'ringkasan' && (
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  MAPPING LOKAL
                </p>

                <dl className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">ICD-9-CM</dt>
                    <dd className="font-bold text-[#0f3d56] text-right">
                      {selectedItem.icd9Code} · {selectedItem.icd9Version}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">KPTL</dt>
                    <dd className="font-mono font-bold text-[#0f3d56] text-right">
                      {selectedItem.kptlCode}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">SNOMED CT</dt>
                    <dd className="font-mono font-bold text-[#0f3d56] text-right">
                      {selectedItem.snomedCode}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Status mapping lokal</dt>
                    <dd className="font-bold text-[#0f3d56] text-right">
                      {getMappingLabel(selectedItem.mappingStatus)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Scope unit / poli</dt>
                    <dd className="font-bold text-[#0f3d56] text-right">
                      {selectedItem.unitScopeCode} ·{' '}
                      {selectedItem.unitScopeLabel}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Profesi berwenang</dt>
                    <dd className="font-bold text-[#0f3d56] text-right">
                      {selectedItem.profesi === 'Belum diatur'
                        ? 'Belum dikonfigurasi'
                        : selectedItem.profesi}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Penagihan</dt>
                    <dd className="font-bold text-[#0f3d56] text-right">
                      {selectedItem.penagihan}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Kebutuhan BMHP</dt>
                    <dd className="font-bold text-[#0f3d56] text-right">
                      {selectedItem.butuhBmhp
                        ? 'Memerlukan BMHP'
                        : 'Tidak memerlukan BMHP'}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Sumber</dt>
                    <dd className="font-bold text-[#0f3d56] text-right">
                      {selectedItem.sumber}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Berlaku</dt>
                    <dd className="font-bold text-[#0f3d56] text-right">
                      {selectedItem.berlakuMulai} s.d.{' '}
                      {selectedItem.berlakuSampai}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {detailTab === 'tarif' && (
              <div className="space-y-3 text-xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  TARIF TERKAIT MASTER TINDAKAN
                </p>

                <div className="rounded-xl border border-slate-200/90 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tarif Umum</span>
                    <span className="font-extrabold text-emerald-700 tabular-nums">
                      {formatRupiah(selectedItem.tarifUmum)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tarif BPJS / JKN</span>
                    <span className="font-bold text-amber-600">
                      {typeof selectedItem.tarifBpjs === 'number'
                        ? formatRupiah(selectedItem.tarifBpjs)
                        : 'Belum diatur'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Mode Penagihan</span>
                    <span className="font-bold text-[#0f3d56]">
                      {selectedItem.penagihan}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Komponen BMHP</span>
                    <span className="font-bold text-[#0f3d56]">
                      {selectedItem.butuhBmhp
                        ? 'Termasuk / Terpisah BMHP'
                        : 'Tidak memerlukan BMHP'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'riwayat' && (
              <div className="space-y-2.5 text-xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  RIWAYAT PERUBAHAN LOKAL
                </p>

                <div className="space-y-2">
                  {selectedItem.riwayat.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-slate-200/90 p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{entry.tanggal}</span>
                        <span>{entry.oleh}</span>
                      </div>
                      <p className="text-xs text-[#0f3d56] leading-relaxed">
                        {entry.aktivitas}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kotak Catatan Mapping Lokal */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex items-start gap-2.5 text-[11px] text-slate-500">
              <Info className="w-4 h-4 text-[#008ba6] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Mapping ini bersifat lokal dan tidak membuktikan bahwa data
                telah dikirim atau diterima SATUSEHAT.
              </p>
            </div>

            {/* Tombol Aksi Bawah Panel Detail */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setEditingItem(selectedItem)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleItemStatus(selectedItem)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
              >
                {selectedItem.status === 'aktif' ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                    <span>Nonaktifkan</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-[#008ba6]" />
                    <span>Aktifkan</span>
                  </>
                )}
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* =====================================================================
          3. MODAL TAMBAH TINDAKAN & PROSEDUR
         ===================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  MASTER TINDAKAN &amp; PROSEDUR
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Tambah Tindakan Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateSubmit}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Tindakan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newKode}
                    onChange={(e) => setNewKode(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Tindakan / Prosedur{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newNama}
                    onChange={(e) => setNewNama(e.target.value)}
                    placeholder="Contoh: Nebulisasi saluran napas"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newKategori}
                    onChange={(e) => setNewKategori(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Konsultasi">Konsultasi</option>
                    <option value="Edukasi">Edukasi</option>
                    <option value="Pemeriksaan">Pemeriksaan</option>
                    <option value="Tindakan Medis">Tindakan Medis</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unit / Scope
                  </label>
                  <select
                    value={newScopeCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setNewScopeCode(code);
                      setNewScopeLabel(
                        code === 'POLI-ANAK'
                          ? 'Poli Anak'
                          : code === 'POLI-UMUM'
                            ? 'Poli Umum'
                            : 'Semua unit',
                      );
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="SEMUA-UNIT">Semua unit</option>
                    <option value="POLI-ANAK">Poli Anak</option>
                    <option value="POLI-UMUM">Poli Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tarif Umum (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={newTarifUmum}
                    onChange={(e) =>
                      setNewTarifUmum(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ICD-9-CM
                  </label>
                  <input
                    type="text"
                    value={newIcd9Code}
                    onChange={(e) => setNewIcd9Code(e.target.value)}
                    placeholder="Contoh: 93.94"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode KPTL
                  </label>
                  <input
                    type="text"
                    value={newKptlCode}
                    onChange={(e) => setNewKptlCode(e.target.value)}
                    placeholder="KPTL.01.01.009"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    SNOMED CT
                  </label>
                  <input
                    type="text"
                    value={newSnomedCode}
                    onChange={(e) => setNewSnomedCode(e.target.value)}
                    placeholder="56251003"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ringkasan Klinis
                </label>
                <textarea
                  rows={2}
                  value={newRingkasan}
                  onChange={(e) => setNewRingkasan(e.target.value)}
                  placeholder="Deskripsi singkat tindakan klinis..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Tindakan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. MODAL EDIT TINDAKAN & MAPPING LOKAL
         ===================================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingItem.kode}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Tindakan &amp; Mapping Lokal
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updated: MasterTindakanItem = {
                  ...editingItem,
                  riwayat: [
                    {
                      id: `hist-${Date.now()}`,
                      tanggal: '19 Nov 2026',
                      aktivitas:
                        'Detail tindakan dan mapping terminologi lokal diperbarui.',
                      oleh: 'Administrator Sistem',
                    },
                    ...editingItem.riwayat,
                  ],
                };
                setItems((prev) =>
                  prev.map((item) => (item.id === updated.id ? updated : item)),
                );
                onUpdateTindakan?.(updated);
                setEditingItem(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Tindakan / Prosedur
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.nama}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      nama: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ICD-9-CM
                  </label>
                  <input
                    type="text"
                    value={editingItem.icd9Code}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        icd9Code: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    KPTL
                  </label>
                  <input
                    type="text"
                    value={editingItem.kptlCode}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        kptlCode: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    SNOMED CT
                  </label>
                  <input
                    type="text"
                    value={editingItem.snomedCode}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        snomedCode: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status Mapping Lokal
                  </label>
                  <select
                    value={editingItem.mappingStatus}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        mappingStatus: e.target
                          .value as TindakanMappingStatusKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="perlu_review">Perlu review</option>
                    <option value="tervalidasi_lokal">Tervalidasi lokal</option>
                    <option value="belum_dipetakan">Belum dipetakan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tarif Umum (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={editingItem.tarifUmum}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tarifUmum: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ringkasan
                </label>
                <textarea
                  rows={2}
                  value={editingItem.ringkasan}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      ringkasan: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}