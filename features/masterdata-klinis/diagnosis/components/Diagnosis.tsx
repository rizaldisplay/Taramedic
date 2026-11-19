'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';

export type Icd10StatusKey = 'aktif' | 'nonaktif';
export type Icd10MappingStatusKey = 'belum_dipetakan' | 'tervalidasi_lokal';
export type Icd10SortFieldKey = 'kode' | 'diagnosis' | 'diperbarui';

export interface Icd10DiagnosisItem {
  id: string;
  kode: string;
  terminologi: string;
  versi: string;
  diagnosis: string;
  definisi?: string;
  status: Icd10StatusKey;
  mappingStatus: Icd10MappingStatusKey;
  sumber: string;
  dibuat: string;
  diperbarui: string;
}

const DEFAULT_ICD10_LIST: Icd10DiagnosisItem[] = [
  {
    id: 'icd-a00',
    kode: 'A00',
    terminologi: 'ICD-10-WHO',
    versi: 'ICD10_2010',
    diagnosis: 'Cholera',
    definisi: undefined,
    status: 'aktif',
    mappingStatus: 'belum_dipetakan',
    sumber: 'Workbook e-Klaim ICD-10; VERSION=ICD10_2010',
    dibuat: '15 Okt 2026',
    diperbarui: '19 Nov 2026',
  },
  {
    id: 'icd-a00-0',
    kode: 'A00.0',
    terminologi: 'ICD-10-WHO',
    versi: 'ICD10_2010',
    diagnosis: 'Cholera due to vibrio cholerae 01, biovar cholerae',
    definisi: undefined,
    status: 'aktif',
    mappingStatus: 'belum_dipetakan',
    sumber: 'Workbook e-Klaim ICD-10; VERSION=ICD10_2010',
    dibuat: '15 Okt 2026',
    diperbarui: '19 Nov 2026',
  },
  {
    id: 'icd-a00-1',
    kode: 'A00.1',
    terminologi: 'ICD-10-WHO',
    versi: 'ICD10_2010',
    diagnosis: 'Cholera due to vibrio cholerae 01, biovar eltor',
    definisi: undefined,
    status: 'aktif',
    mappingStatus: 'belum_dipetakan',
    sumber: 'Workbook e-Klaim ICD-10; VERSION=ICD10_2010',
    dibuat: '15 Okt 2026',
    diperbarui: '19 Nov 2026',
  },
  {
    id: 'icd-a00-9',
    kode: 'A00.9',
    terminologi: 'ICD-10-WHO',
    versi: 'ICD10_2010',
    diagnosis: 'Cholera, unspecified',
    definisi: undefined,
    status: 'aktif',
    mappingStatus: 'belum_dipetakan',
    sumber: 'Workbook e-Klaim ICD-10; VERSION=ICD10_2010',
    dibuat: '15 Okt 2026',
    diperbarui: '19 Nov 2026',
  },
  {
    id: 'icd-a01',
    kode: 'A01',
    terminologi: 'ICD-10-WHO',
    versi: 'ICD10_2010',
    diagnosis: 'Typhoid and paratyphoid fevers',
    definisi: undefined,
    status: 'aktif',
    mappingStatus: 'belum_dipetakan',
    sumber: 'Workbook e-Klaim ICD-10; VERSION=ICD10_2010',
    dibuat: '15 Okt 2026',
    diperbarui: '19 Nov 2026',
  },
  {
    id: 'icd-a01-0',
    kode: 'A01.0',
    terminologi: 'ICD-10-WHO',
    versi: 'ICD10_2010',
    diagnosis: 'Typhoid fever',
    definisi: 'Infeksi akut sistemik yang disebabkan oleh Salmonella typhi.',
    status: 'aktif',
    mappingStatus: 'tervalidasi_lokal',
    sumber: 'Workbook e-Klaim ICD-10; VERSION=ICD10_2010',
    dibuat: '15 Okt 2026',
    diperbarui: '19 Nov 2026',
  },
  {
    id: 'icd-a01-1',
    kode: 'A01.1',
    terminologi: 'ICD-10-WHO',
    versi: 'ICD10_2010',
    diagnosis: 'Paratyphoid fever A',
    definisi: undefined,
    status: 'aktif',
    mappingStatus: 'belum_dipetakan',
    sumber: 'Workbook e-Klaim ICD-10; VERSION=ICD10_2010',
    dibuat: '15 Okt 2026',
    diperbarui: '19 Nov 2026',
  },
  {
    id: 'icd-a02-0',
    kode: 'A02.0',
    terminologi: 'ICD-10-WHO',
    versi: 'ICD10_2010',
    diagnosis: 'Salmonella enteritis',
    definisi: undefined,
    status: 'aktif',
    mappingStatus: 'belum_dipetakan',
    sumber: 'Workbook e-Klaim ICD-10; VERSION=ICD10_2010',
    dibuat: '15 Okt 2026',
    diperbarui: '19 Nov 2026',
  },
  {
    id: 'icd-a09',
    kode: 'A09',
    terminologi: 'ICD-10-WHO',
    versi: 'ICD10_2010',
    diagnosis:
      'Other gastroenteritis and colitis of infectious and unspecified origin',
    definisi:
      'Diare dan gastroenteritis yang diduga berasal dari infeksi saluran cerna.',
    status: 'aktif',
    mappingStatus: 'tervalidasi_lokal',
    sumber: 'Workbook e-Klaim ICD-10; VERSION=ICD10_2010',
    dibuat: '15 Okt 2026',
    diperbarui: '19 Nov 2026',
  },
  {
    id: 'icd-j00',
    kode: 'J00',
    terminologi: 'ICD-10-WHO',
    versi: 'ICD10_2010',
    diagnosis: 'Acute nasopharyngitis [common cold]',
    definisi: 'Infeksi saluran pernapasan atas akut pada mukosa hidung dan faring.',
    status: 'aktif',
    mappingStatus: 'tervalidasi_lokal',
    sumber: 'Workbook e-Klaim ICD-10; VERSION=ICD10_2010',
    dibuat: '15 Okt 2026',
    diperbarui: '19 Nov 2026',
  },
];

function formatNumberId(value: number): string {
  return value.toLocaleString('id-ID');
}

function buildPaginationPages(
  currentPage: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, 'ellipsis', totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', currentPage, 'ellipsis', totalPages];
}

export default function MasterDiagnosisIcd10({
  initialDiagnoses = DEFAULT_ICD10_LIST,
  catalogTotalCount = 18542,
  onAddDiagnosis,
  onUpdateDiagnosis,
}: {
  initialDiagnoses?: Icd10DiagnosisItem[];
  catalogTotalCount?: number;
  onAddDiagnosis?: (item: Icd10DiagnosisItem) => void;
  onUpdateDiagnosis?: (item: Icd10DiagnosisItem) => void;
}) {
  const [diagnoses, setDiagnoses] =
    useState<Icd10DiagnosisItem[]>(initialDiagnoses);
  const [selectedId, setSelectedId] = useState<string>(
    initialDiagnoses[0]?.id ?? '',
  );

  // Filter & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Icd10StatusKey>(
    'ALL',
  );
  const [terminologyFilter, setTerminologyFilter] = useState<string>(
    'ICD-10-WHO',
  );
  const [sortField, setSortField] = useState<Icd10SortFieldKey>('kode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Menu & Modal State
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] =
    useState<Icd10DiagnosisItem | null>(null);

  // Form Tambah Diagnosis Baru
  const [newKode, setNewKode] = useState('');
  const [newTerminologi, setNewTerminologi] = useState('ICD-10-WHO');
  const [newVersi, setNewVersi] = useState('ICD10_2010');
  const [newDiagnosisName, setNewDiagnosisName] = useState('');
  const [newDefinisi, setNewDefinisi] = useState('');
  const [newMappingStatus, setNewMappingStatus] =
    useState<Icd10MappingStatusKey>('belum_dipetakan');

  const importFileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter & Sort Daftar Diagnosis
  const isDefaultUnfiltered =
    searchQuery.trim() === '' &&
    statusFilter === 'ALL' &&
    terminologyFilter === 'ICD-10-WHO';

  const processedDiagnoses = useMemo(() => {
    const filtered = diagnoses.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (
        terminologyFilter !== 'ALL' &&
        item.terminologi !== terminologyFilter
      ) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.kode.toLowerCase().includes(q) ||
          item.diagnosis.toLowerCase().includes(q) ||
          (item.definisi ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      let compare = 0;
      if (sortField === 'kode') {
        compare = a.kode.localeCompare(b.kode, 'en', { numeric: true });
      } else if (sortField === 'diagnosis') {
        compare = a.diagnosis.localeCompare(b.diagnosis, 'en');
      } else {
        compare = a.diperbarui.localeCompare(b.diperbarui, 'id');
      }
      return sortDirection === 'asc' ? compare : -compare;
    });
  }, [
    diagnoses,
    statusFilter,
    terminologyFilter,
    searchQuery,
    sortField,
    sortDirection,
  ]);

  // Total katalog (mendukung tampilan skala katalog penuh 18.542 saat tanpa filter)
  const effectiveTotalResults = useMemo(() => {
    const delta = diagnoses.length - initialDiagnoses.length;
    if (isDefaultUnfiltered && catalogTotalCount > diagnoses.length) {
      return Math.max(0, catalogTotalCount + delta);
    }
    return processedDiagnoses.length;
  }, [
    isDefaultUnfiltered,
    catalogTotalCount,
    diagnoses.length,
    initialDiagnoses.length,
    processedDiagnoses.length,
  ]);

  const totalPages = Math.max(1, Math.ceil(effectiveTotalResults / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  // Item halaman aktif (untuk demo lokal, halaman berikutnya memutar sampel jika data lokal terbatas)
  const paginatedDiagnoses = useMemo(() => {
    if (processedDiagnoses.length === 0) return [];
    const directStart = (safePage - 1) * pageSize;
    if (directStart < processedDiagnoses.length) {
      return processedDiagnoses.slice(directStart, directStart + pageSize);
    }
    const wrappedStart = directStart % processedDiagnoses.length;
    return Array.from({ length: pageSize }, (_, idx) => {
      const source =
        processedDiagnoses[(wrappedStart + idx) % processedDiagnoses.length];
      return source;
    }).filter(Boolean);
  }, [processedDiagnoses, safePage, pageSize]);

  const startNumber =
    effectiveTotalResults === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, effectiveTotalResults);

  // Item terpilih untuk panel Detail Diagnosis kanan
  const selectedDiagnosis = useMemo(() => {
    return (
      diagnoses.find((d) => d.id === selectedId) ??
      processedDiagnoses[0] ??
      diagnoses[0] ??
      null
    );
  }, [diagnoses, selectedId, processedDiagnoses]);

  // Toggle status aktif / nonaktif
  const handleToggleStatus = (target: Icd10DiagnosisItem) => {
    const nextStatus: Icd10StatusKey =
      target.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: Icd10DiagnosisItem = {
      ...target,
      status: nextStatus,
      diperbarui: '19 Nov 2026',
    };

    setDiagnoses((prev) =>
      prev.map((d) => (d.id === target.id ? updated : d)),
    );
    onUpdateDiagnosis?.(updated);
    setOpenRowMenuId(null);
  };

  // Toggle validasi mapping lokal
  const handleToggleLocalMapping = (target: Icd10DiagnosisItem) => {
    const nextMapping: Icd10MappingStatusKey =
      target.mappingStatus === 'belum_dipetakan'
        ? 'tervalidasi_lokal'
        : 'belum_dipetakan';
    const updated: Icd10DiagnosisItem = {
      ...target,
      mappingStatus: nextMapping,
      diperbarui: '19 Nov 2026',
    };

    setDiagnoses((prev) =>
      prev.map((d) => (d.id === target.id ? updated : d)),
    );
    onUpdateDiagnosis?.(updated);
    setOpenRowMenuId(null);
  };

  // Tambah Diagnosis Baru
  const handleCreateDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKode.trim() || !newDiagnosisName.trim()) return;

    const created: Icd10DiagnosisItem = {
      id: `icd-${Date.now()}`,
      kode: newKode.trim().toUpperCase(),
      terminologi: newTerminologi,
      versi: newVersi.trim() || 'ICD10_2010',
      diagnosis: newDiagnosisName.trim(),
      definisi: newDefinisi.trim() || undefined,
      status: 'aktif',
      mappingStatus: newMappingStatus,
      sumber: `Input Manual Master Klinis; VERSION=${
        newVersi.trim() || 'ICD10_2010'
      }`,
      dibuat: '19 Nov 2026',
      diperbarui: '19 Nov 2026',
    };

    setDiagnoses((prev) => [created, ...prev]);
    setSelectedId(created.id);
    onAddDiagnosis?.(created);
    setNewKode('');
    setNewDiagnosisName('');
    setNewDefinisi('');
    setNewMappingStatus('belum_dipetakan');
    setIsAddModalOpen(false);
    setCurrentPage(1);
  };

  // Ekspor & Template CSV
  const handleDownloadCsv = (onlyTemplate: boolean) => {
    const header = 'kode,terminologi,versi,diagnosis,definisi,status';
    const rows = onlyTemplate
      ? [
          'A00,ICD-10-WHO,ICD10_2010,Cholera,Infeksi saluran cerna akut oleh Vibrio cholerae,aktif',
        ]
      : processedDiagnoses.map(
          (d) =>
            `${d.kode},${d.terminologi},${d.versi},"${d.diagnosis.replace(
              /"/g,
              '""',
            )}","${(d.definisi ?? '').replace(/"/g, '""')}",${d.status}`,
        );

    const blob = new Blob([[header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = onlyTemplate
      ? 'template-icd10-2010.csv'
      : 'master-diagnosis-icd10-2010.csv';
    link.click();
    URL.revokeObjectURL(url);
    setIsMoreActionsOpen(false);
  };

  // Impor CSV
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

      const imported: Icd10DiagnosisItem[] = lines.slice(1).map((line, idx) => {
        const cols = line
          .split(',')
          .map((c) => c.replace(/^"|"$/g, '').trim());
        return {
          id: `icd-imp-${Date.now()}-${idx}`,
          kode: (cols[0] || `Z00.${idx}`).toUpperCase(),
          terminologi: cols[1] || 'ICD-10-WHO',
          versi: cols[2] || 'ICD10_2010',
          diagnosis: cols[3] || 'Diagnosis Impor',
          definisi: cols[4] || undefined,
          status:
            cols[5]?.toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif',
          mappingStatus: 'belum_dipetakan',
          sumber: 'Impor Workbook ICD-10; VERSION=ICD10_2010',
          dibuat: '19 Nov 2026',
          diperbarui: '19 Nov 2026',
        };
      });

      setDiagnoses((prev) => [...imported, ...prev]);
      if (imported[0]) setSelectedId(imported[0].id);
      setCurrentPage(1);
    };
    reader.readAsText(file);
    e.target.value = '';
    setIsMoreActionsOpen(false);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. BANNER STATUS VALIDASI LOKAL ATAS
         ===================================================================== */}
      <div className="rounded-xl border border-sky-200/80 bg-[#f0f8fc] px-4 py-3 text-xs text-[#0f3d56] space-y-1">
        <ShieldCheck className="w-4 h-4 text-[#008ba6]" />
        <p>
          Status mapping terminologi menunjukkan validasi lokal; belum ada klaim
          sinkronisasi SATUSEHAT.
        </p>
      </div>

      {/* =====================================================================
          2. GRID UTAMA 2 KOLOM: TABEL KATALOG (KIRI) & DETAIL DIAGNOSIS (KANAN)
         ===================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4 items-start">
        {/* ===================================================================
            KOLOM KIRI: MASTER DIAGNOSIS ICD-10 2010
           =================================================================== */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header Kartu Kiri */}
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
              Master Diagnosis ICD-10 2010
            </h1>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-medium text-slate-500 tabular-nums">
                {formatNumberId(effectiveTotalResults)} hasil
              </span>

              {/* Dropdown Aksi Lainnya */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMoreActionsOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
                  <span>Aksi Lainnya</span>
                </button>

                {isMoreActionsOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 z-30 text-xs">
                    <button
                      type="button"
                      onClick={() => handleDownloadCsv(true)}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                      <span>Unduh Template CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadCsv(false)}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ekspor Katalog CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => importFileInputRef.current?.click()}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span>Impor Workbook CSV</span>
                    </button>
                  </div>
                )}

                <input
                  ref={importFileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleImportCsv}
                  className="hidden"
                />
              </div>

              {/* Tombol + Tambah */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Bar Pencarian, Filter Status/Terminologi, dan Urutkan */}
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
                placeholder="Cari Kode, Diagnosis, atau Definisi..."
                className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>

            {/* Filter Dropdown Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[190px_190px] gap-2.5">
              <div className="relative">
                <select
                  aria-label="Filter Status Diagnosis"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as 'ALL' | Icd10StatusKey);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter Terminologi ICD-10"
                  value={terminologyFilter}
                  onChange={(e) => {
                    setTerminologyFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value="ICD-10-WHO">ICD-10-WHO</option>
                  <option value="ALL">Semua Terminologi</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Urutkan Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">
                Urutkan
              </span>

              <div className="relative w-44">
                <select
                  aria-label="Urutkan berdasarkan"
                  value={sortField}
                  onChange={(e) =>
                    setSortField(e.target.value as Icd10SortFieldKey)
                  }
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value="kode">Kode</option>
                  <option value="diagnosis">Diagnosis</option>
                  <option value="diperbarui">Diperbarui</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={() =>
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
              >
                {sortDirection === 'asc' ? (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 text-slate-500" />
                    <span>Naik</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
                    <span>Turun</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabel Master Diagnosis */}
          <div className="overflow-x-auto border-t border-slate-200/80">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pl-5 pr-3 py-3 w-36">KODE / VERSI</th>
                  <th className="px-3 py-3">DIAGNOSIS</th>
                  <th className="px-3 py-3 w-28">STATUS</th>
                  <th className="pl-3 pr-5 py-3 w-28 text-left">AKSI</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedDiagnoses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 px-5 text-center text-slate-400"
                    >
                      Tidak ada kode diagnosis yang sesuai filter pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedDiagnoses.map((item, rowIdx) => {
                    const isSelected = selectedDiagnosis?.id === item.id;

                    return (
                      <tr
                        key={`${item.id}-${safePage}-${rowIdx}`}
                        onClick={() => setSelectedId(item.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#edf7fc]'
                            : 'hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        {/* KODE / VERSI */}
                        <td className="pl-5 pr-3 py-4 align-top">
                          <p className="font-mono text-xs font-extrabold text-[#008ba6]">
                            {item.kode}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                            {item.terminologi} ·
                            <br />
                            {item.versi}
                          </p>
                        </td>

                        {/* DIAGNOSIS */}
                        <td className="px-3 py-4 align-top">
                          <p className="text-xs sm:text-[13px] font-bold text-[#0f3d56] leading-snug">
                            {item.diagnosis}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {item.definisi || 'Definisi belum diisi'}
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="px-3 py-4 align-middle whitespace-nowrap">
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
                        <td
                          className="pl-3 pr-5 py-4 align-middle whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="relative inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedId(item.id);
                                setEditingDiagnosis(item);
                              }}
                              aria-label={`Edit ${item.kode}`}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setOpenRowMenuId((prev) =>
                                  prev === item.id ? null : item.id,
                                )
                              }
                              aria-label={`Opsi lainnya untuk ${item.kode}`}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {openRowMenuId === item.id && (
                              <div className="absolute right-0 top-9 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 z-30 text-xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedId(item.id);
                                    setOpenRowMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                                >
                                  Lihat Detail
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleLocalMapping(item)}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                                >
                                  {item.mappingStatus === 'belum_dipetakan'
                                    ? 'Validasi Mapping Lokal'
                                    : 'Tandai Belum Dipetakan'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(item)}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                                >
                                  {item.status === 'aktif'
                                    ? 'Nonaktifkan Kode'
                                    : 'Aktifkan Kode'}
                                </button>
                              </div>
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

          {/* Footer Pagination */}
          <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-3">
              <span>
                <strong className="font-semibold text-slate-700">
                  {formatNumberId(startNumber)}–{formatNumberId(endNumber)}
                </strong>{' '}
                dari{' '}
                <strong className="font-semibold text-slate-700">
                  {formatNumberId(effectiveTotalResults)}
                </strong>{' '}
                Hasil
              </span>

              <span className="text-slate-400">Katalog ICD-10 versi 2010</span>

              <div className="flex items-center gap-2">
                <label htmlFor="per-halaman-icd10">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-icd10"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value={5}>5</option>
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

              {buildPaginationPages(safePage, totalPages).map((entry, idx) =>
                entry === 'ellipsis' ? (
                  <span
                    key={`icd-ellipsis-${idx}`}
                    className="px-1 text-slate-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => setCurrentPage(entry)}
                    className={`min-w-8 h-8 px-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                      entry === safePage
                        ? 'bg-[#e6f6f9] border-[#009bb8] text-[#008ba6]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {entry}
                  </button>
                ),
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
            KOLOM KANAN: PANEL DETAIL DIAGNOSIS
           =================================================================== */}
        <aside className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 space-y-4">
          {/* Header Detail Diagnosis */}
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
              Detail Diagnosis
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              Master klinis
            </span>
          </div>

          {!selectedDiagnosis ? (
            <div className="py-14 text-center text-xs text-slate-400">
              Pilih kode diagnosis di tabel untuk melihat rinciannya.
            </div>
          ) : (
            <>
              {/* Identitas Kode, Nama Diagnosis & Badge Status */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400">
                    {selectedDiagnosis.kode} · {selectedDiagnosis.terminologi} ·{' '}
                    {selectedDiagnosis.versi}
                  </p>
                  <h3 className="text-base font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                    {selectedDiagnosis.diagnosis}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedDiagnosis.status === 'aktif' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                      Nonaktif
                    </span>
                  )}

                  {selectedDiagnosis.mappingStatus === 'belum_dipetakan' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-700">
                      Belum dipetakan
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200/80 text-[11px] font-semibold text-[#0284c7]">
                      Tervalidasi lokal
                    </span>
                  )}
                </div>
              </div>

              {/* Metadata Sumber, Dibuat, Diperbarui */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
                <div>
                  <p className="text-xs font-bold text-slate-400">Sumber</p>
                  <p className="text-xs sm:text-[13px] text-[#0f3d56] mt-1 leading-relaxed">
                    {selectedDiagnosis.sumber}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400">Dibuat</p>
                  <p className="text-xs sm:text-[13px] text-[#0f3d56] mt-1">
                    {selectedDiagnosis.dibuat}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-bold text-slate-400">Diperbarui</p>
                  <p className="text-xs sm:text-[13px] text-[#0f3d56] mt-1">
                    {selectedDiagnosis.diperbarui}
                  </p>
                </div>
              </div>

              {/* Box Definisi */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-3.5">
                <p className="text-xs font-bold text-slate-500">Definisi</p>
                <p className="text-xs sm:text-[13px] text-[#0f3d56] mt-1 leading-relaxed">
                  {selectedDiagnosis.definisi || 'Definisi belum diisi.'}
                </p>
              </div>

              {/* Callout Status Mapping Lokal */}
              <div className="rounded-xl border border-sky-200/80 bg-[#f0f8fc] p-3.5 text-xs text-[#0f3d56] space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#008ba6]" />
                <p className="leading-relaxed">
                  Status mapping hanya menampilkan validasi lokal; bukan bukti
                  sinkronisasi SATUSEHAT.
                </p>
              </div>

              {/* Tombol Aksi Bawah */}
              <div className="pt-1 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedDiagnosis)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  {selectedDiagnosis.status === 'aktif' ? (
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

                <button
                  type="button"
                  onClick={() => setEditingDiagnosis(selectedDiagnosis)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit diagnosis</span>
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* =====================================================================
          3. MODAL TAMBAH DIAGNOSIS ICD-10
         ===================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  MASTER KLINIS · ICD-10
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Tambah Diagnosis Baru
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
              onSubmit={handleCreateDiagnosis}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode ICD-10 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newKode}
                    onChange={(e) => setNewKode(e.target.value)}
                    placeholder="Contoh: A02.1"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Terminologi
                  </label>
                  <select
                    value={newTerminologi}
                    onChange={(e) => setNewTerminologi(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="ICD-10-WHO">ICD-10-WHO</option>
                    <option value="ICD-10-IM">ICD-10-IM</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Versi
                  </label>
                  <input
                    type="text"
                    value={newVersi}
                    onChange={(e) => setNewVersi(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Diagnosis <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newDiagnosisName}
                  onChange={(e) => setNewDiagnosisName(e.target.value)}
                  placeholder="Contoh: Salmonella sepsis"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status Mapping Lokal
                </label>
                <select
                  value={newMappingStatus}
                  onChange={(e) =>
                    setNewMappingStatus(
                      e.target.value as Icd10MappingStatusKey,
                    )
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                >
                  <option value="belum_dipetakan">Belum dipetakan</option>
                  <option value="tervalidasi_lokal">Tervalidasi lokal</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Definisi Klinis (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={newDefinisi}
                  onChange={(e) => setNewDefinisi(e.target.value)}
                  placeholder="Isi definisi klinis atau catatan pengkodean..."
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
                  Simpan Diagnosis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. MODAL EDIT DIAGNOSIS ICD-10
         ===================================================================== */}
      {editingDiagnosis && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingDiagnosis.kode} · {editingDiagnosis.terminologi}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Diagnosis
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDiagnosis(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updated: Icd10DiagnosisItem = {
                  ...editingDiagnosis,
                  diperbarui: '19 Nov 2026',
                };
                setDiagnoses((prev) =>
                  prev.map((item) => (item.id === updated.id ? updated : item)),
                );
                onUpdateDiagnosis?.(updated);
                setEditingDiagnosis(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Diagnosis
                </label>
                <input
                  type="text"
                  required
                  value={editingDiagnosis.diagnosis}
                  onChange={(e) =>
                    setEditingDiagnosis({
                      ...editingDiagnosis,
                      diagnosis: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status Master
                  </label>
                  <select
                    value={editingDiagnosis.status}
                    onChange={(e) =>
                      setEditingDiagnosis({
                        ...editingDiagnosis,
                        status: e.target.value as Icd10StatusKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Validasi Mapping Lokal
                  </label>
                  <select
                    value={editingDiagnosis.mappingStatus}
                    onChange={(e) =>
                      setEditingDiagnosis({
                        ...editingDiagnosis,
                        mappingStatus: e.target.value as Icd10MappingStatusKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="belum_dipetakan">Belum dipetakan</option>
                    <option value="tervalidasi_lokal">Tervalidasi lokal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Definisi
                </label>
                <textarea
                  rows={3}
                  value={editingDiagnosis.definisi ?? ''}
                  onChange={(e) =>
                    setEditingDiagnosis({
                      ...editingDiagnosis,
                      definisi: e.target.value || undefined,
                    })
                  }
                  placeholder="Definisi belum diisi."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDiagnosis(null)}
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