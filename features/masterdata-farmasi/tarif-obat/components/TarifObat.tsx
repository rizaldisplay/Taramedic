'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleDollarSign,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Upload,
  X,
} from 'lucide-react';

export type TarifObatPenjaminKey = 'Umum' | 'BPJS' | 'Asuransi';
export type TarifObatStatusKey = 'aktif' | 'nonaktif';

export interface TarifObatItem {
  id: string;
  kodeObat: string;
  namaObat: string;
  penjamin: TarifObatPenjaminKey;
  satuan: string;
  tarif: number;
  berlakuMulai: string;
  berlakuSampai?: string; // kosong / undefined => "seterusnya"
  status: TarifObatStatusKey;
}

const DEFAULT_TARIF_OBAT_LIST: TarifObatItem[] = [
  {
    id: 'obt-tarif-1',
    kodeObat: 'OBT-0001',
    namaObat: 'Paracetamol 500 mg Tablet',
    penjamin: 'Umum',
    satuan: 'Tablet',
    tarif: 500,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif',
  },
  {
    id: 'obt-tarif-2',
    kodeObat: 'OBT-0002',
    namaObat: 'Ibuprofen 400 mg Tablet',
    penjamin: 'Umum',
    satuan: 'Tablet',
    tarif: 700,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif',
  },
  {
    id: 'obt-tarif-3',
    kodeObat: 'OBT-0003',
    namaObat: 'Asam mefenamat 500 mg Tablet',
    penjamin: 'Umum',
    satuan: 'Tablet',
    tarif: 800,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif',
  },
  {
    id: 'obt-tarif-4',
    kodeObat: 'OBT-0004',
    namaObat: 'Amoxicillin 500 mg Kapsul',
    penjamin: 'Umum',
    satuan: 'Kapsul',
    tarif: 1000,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif',
  },
  {
    id: 'obt-tarif-5',
    kodeObat: 'OBT-0005',
    namaObat: 'Cefadroxil 500 mg Kapsul',
    penjamin: 'Umum',
    satuan: 'Kapsul',
    tarif: 1500,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif',
  },
  {
    id: 'obt-tarif-6',
    kodeObat: 'OBT-0006',
    namaObat: 'Ciprofloxacin 500 mg Tablet',
    penjamin: 'Umum',
    satuan: 'Tablet',
    tarif: 1200,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif',
  },
  {
    id: 'obt-tarif-7',
    kodeObat: 'OBT-0007',
    namaObat: 'Azithromycin 500 mg Tablet',
    penjamin: 'Umum',
    satuan: 'Tablet',
    tarif: 3500,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif',
  },
  {
    id: 'obt-tarif-8',
    kodeObat: 'OBT-0008',
    namaObat: 'Metformin 500 mg Tablet',
    penjamin: 'Umum',
    satuan: 'Tablet',
    tarif: 500,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif',
  },
  {
    id: 'obt-tarif-9',
    kodeObat: 'OBT-0009',
    namaObat: 'Glimepiride 2 mg Tablet',
    penjamin: 'Umum',
    satuan: 'Tablet',
    tarif: 600,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif',
  },
  {
    id: 'obt-tarif-10',
    kodeObat: 'OBT-0010',
    namaObat: 'Amlodipine 5 mg Tablet',
    penjamin: 'Umum',
    satuan: 'Tablet',
    tarif: 500,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif',
  },
  ...[
    { kode: 'OBT-0011', nama: 'Amlodipine 10 mg Tablet', satuan: 'Tablet', tarif: 800 },
    { kode: 'OBT-0012', nama: 'Captopril 25 mg Tablet', satuan: 'Tablet', tarif: 400 },
    { kode: 'OBT-0013', nama: 'Simvastatin 10 mg Tablet', satuan: 'Tablet', tarif: 600 },
    { kode: 'OBT-0014', nama: 'Atorvastatin 20 mg Tablet', satuan: 'Tablet', tarif: 1800 },
    { kode: 'OBT-0015', nama: 'Omeprazole 20 mg Kapsul', satuan: 'Kapsul', tarif: 900 },
    { kode: 'OBT-0016', nama: 'Lansoprazole 30 mg Kapsul', satuan: 'Kapsul', tarif: 1400 },
    { kode: 'OBT-0017', nama: 'Ranitidine 150 mg Tablet', satuan: 'Tablet', tarif: 500 },
    { kode: 'OBT-0018', nama: 'Antasida Doen Tablet Kunyah', satuan: 'Tablet', tarif: 300 },
    { kode: 'OBT-0019', nama: 'Domperidone 10 mg Tablet', satuan: 'Tablet', tarif: 500 },
    { kode: 'OBT-0020', nama: 'Ondansetron 4 mg Tablet', satuan: 'Tablet', tarif: 1600 },
    { kode: 'OBT-0021', nama: 'Cetirizine 10 mg Tablet', satuan: 'Tablet', tarif: 500 },
    { kode: 'OBT-0022', nama: 'Loratadine 10 mg Tablet', satuan: 'Tablet', tarif: 700 },
    { kode: 'OBT-0023', nama: 'Dexamethasone 0.5 mg Tablet', satuan: 'Tablet', tarif: 300 },
    { kode: 'OBT-0024', nama: 'Methylprednisolone 4 mg Tablet', satuan: 'Tablet', tarif: 700 },
    { kode: 'OBT-0025', nama: 'Ambroxol 30 mg Tablet', satuan: 'Tablet', tarif: 400 },
    { kode: 'OBT-0026', nama: 'Acetylcysteine 200 mg Kapsul', satuan: 'Kapsul', tarif: 1200 },
    { kode: 'OBT-0027', nama: 'Salbutamol 2 mg Tablet', satuan: 'Tablet', tarif: 400 },
    { kode: 'OBT-0028', nama: 'Vitamin C 500 mg Tablet', satuan: 'Tablet', tarif: 600 },
    { kode: 'OBT-0029', nama: 'Vitamin B Complex Tablet', satuan: 'Tablet', tarif: 400 },
    { kode: 'OBT-0030', nama: 'Zinc Sulfate 20 mg Tablet Dispersibel', satuan: 'Tablet', tarif: 700 },
    { kode: 'OBT-0031', nama: 'Oralit Serbuk Sachet', satuan: 'Sachet', tarif: 1000 },
    { kode: 'OBT-0032', nama: 'Paracetamol Sirup 120 mg/5 mL', satuan: 'Botol', tarif: 8500 },
  ].map((item, idx) => ({
    id: `obt-tarif-${idx + 11}`,
    kodeObat: item.kode,
    namaObat: item.nama,
    penjamin: 'Umum' as TarifObatPenjaminKey,
    satuan: item.satuan,
    tarif: item.tarif,
    berlakuMulai: '2026-10-08',
    berlakuSampai: undefined,
    status: 'aktif' as TarifObatStatusKey,
  })),
];

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function getPaginationPages(
  currentPage: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, 'ellipsis', totalPages - 1, totalPages];
  }

  return [1, currentPage, 'ellipsis', totalPages];
}

export default function TarifObatPerPenjamin({
  initialItems = DEFAULT_TARIF_OBAT_LIST,
  hasActiveDrugProducts = false,
  onUpdateTarif,
  onAddTarif,
}: {
  initialItems?: TarifObatItem[];
  hasActiveDrugProducts?: boolean;
  onUpdateTarif?: (item: TarifObatItem) => void;
  onAddTarif?: (item: TarifObatItem) => void;
}) {
  const [items, setItems] = useState<TarifObatItem[]>(initialItems);

  // State Pencarian & 2 Filter Utama
  const [searchQuery, setSearchQuery] = useState('');
  const [penjaminFilter, setPenjaminFilter] = useState<
    'ALL' | TarifObatPenjaminKey
  >('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TarifObatStatusKey>(
    'ALL',
  );

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dropdown Aksi Baris & Modal Edit / Tambah
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<TarifObatItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form Tambah Tarif Baru
  const [newKodeObat, setNewKodeObat] = useState('');
  const [newNamaObat, setNewNamaObat] = useState('');
  const [newPenjamin, setNewPenjamin] = useState<TarifObatPenjaminKey>('Umum');
  const [newSatuan, setNewSatuan] = useState('Tablet');
  const [newTarif, setNewTarif] = useState<number>(1000);
  const [newBerlakuMulai, setNewBerlakuMulai] = useState('2026-11-19');
  const [newBerlakuSampai, setNewBerlakuSampai] = useState('');

  const importFileInputRef = useRef<HTMLInputElement | null>(null);

  // Tutup dropdown menu saat klik di luar
  useEffect(() => {
    if (!openMenuId) return;
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [openMenuId]);

  // Filter Data Tarif Obat
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (penjaminFilter !== 'ALL' && item.penjamin !== penjaminFilter) {
        return false;
      }

      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.namaObat.toLowerCase().includes(q) ||
          item.kodeObat.toLowerCase().includes(q) ||
          item.satuan.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [items, penjaminFilter, statusFilter, searchQuery]);

  // Pagination Calculation
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredItems.slice(startIdx, startIdx + pageSize);
  }, [filteredItems, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);
  const paginationPages = useMemo(
    () => getPaginationPages(safePage, totalPages),
    [safePage, totalPages],
  );

  const handleToggleStatus = (target: TarifObatItem) => {
    const nextStatus: TarifObatStatusKey =
      target.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: TarifObatItem = { ...target, status: nextStatus };
    setItems((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onUpdateTarif?.(updated);
    setOpenMenuId(null);
  };

  // CSV Template & Ekspor Data (mengikuti hasil filter yang aktif)
  const handleDownloadCsv = (onlyTemplate: boolean) => {
    const header =
      'kode_obat,nama_obat,penjamin,satuan,tarif,berlaku_mulai,berlaku_sampai,status';
    const rows = onlyTemplate
      ? [
          'OBT-0001,Paracetamol 500 mg Tablet,Umum,Tablet,500,2026-10-08,,aktif',
        ]
      : filteredItems.map(
          (item) =>
            `${item.kodeObat},"${item.namaObat.replace(/"/g, '""')}",${
              item.penjamin
            },${item.satuan},${item.tarif},${item.berlakuMulai},${
              item.berlakuSampai ?? ''
            },${item.status}`,
        );

    const blob = new Blob([[header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = onlyTemplate
      ? 'template-tarif-obat-penjamin.csv'
      : 'tarif-obat-per-penjamin.csv';
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

      const imported: TarifObatItem[] = lines.slice(1).map((line, idx) => {
        const cols = line
          .split(',')
          .map((c) => c.replace(/^"|"$/g, '').trim());
        const penjaminRaw = cols[2];
        const validPenjamin: TarifObatPenjaminKey =
          penjaminRaw === 'BPJS' || penjaminRaw === 'Asuransi'
            ? penjaminRaw
            : 'Umum';

        return {
          id: `obt-imp-${Date.now()}-${idx}`,
          kodeObat: (cols[0] || `OBT-IMP-${idx + 1}`).toUpperCase(),
          namaObat: cols[1] || 'Produk Obat Baru',
          penjamin: validPenjamin,
          satuan: cols[3] || 'Tablet',
          tarif: Math.max(0, Number(cols[4]) || 0),
          berlakuMulai: cols[5] || '2026-11-19',
          berlakuSampai: cols[6] || undefined,
          status:
            cols[7]?.toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif',
        };
      });

      setItems((prev) => [...imported, ...prev]);
      setCurrentPage(1);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKodeObat.trim() || !newNamaObat.trim()) return;

    const created: TarifObatItem = {
      id: `obt-tarif-${Date.now()}`,
      kodeObat: newKodeObat.trim().toUpperCase(),
      namaObat: newNamaObat.trim(),
      penjamin: newPenjamin,
      satuan: newSatuan.trim() || 'Tablet',
      tarif: Math.max(0, Number(newTarif) || 0),
      berlakuMulai: newBerlakuMulai || '2026-11-19',
      berlakuSampai: newBerlakuSampai.trim() || undefined,
      status: 'aktif',
    };

    setItems((prev) => [created, ...prev]);
    onAddTarif?.(created);
    setIsAddModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700">
      {/* =====================================================================
          KARTU UTAMA TARIF OBAT PER PENJAMIN
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        <div className="px-5 py-4 space-y-4">
          {/* -----------------------------------------------------------------
              1. HEADER: JUDUL KIRI & SEARCH INPUT KANAN
             ----------------------------------------------------------------- */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
              Tarif Obat per Penjamin
            </h1>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari Nama, Kode, Satuan"
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>
          </div>

          {/* -----------------------------------------------------------------
              2. BANNER INFORMASI TARIF LOKAL
             ----------------------------------------------------------------- */}
          <div className="rounded-xl border border-sky-200/80 bg-[#f2f7fb] px-4 py-3.5 space-y-1.5 text-xs text-[#0f3d56]">
            <CircleDollarSign className="w-4 h-4 text-[#008ba6]" />
            <p className="leading-relaxed">
              Tarif lokal untuk invoice internal. Tarif Umum tidak otomatis
              dipakai untuk BPJS atau Asuransi.
            </p>
          </div>

          {/* -----------------------------------------------------------------
              3. SUB-BAR KETERANGAN & TOMBOL TEMPLATE / EKSPOR / IMPOR
             ----------------------------------------------------------------- */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <p className="text-slate-500">
              Template dan ekspor mengikuti hasil filter yang aktif.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadCsv(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                <span>Template</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadCsv(false)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] transition-colors cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Impor</span>
              </button>

              {hasActiveDrugProducts && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Tarif</span>
                </button>
              )}
            </div>
          </div>

          {/* -----------------------------------------------------------------
              4. DUA FILTER DROPDOWN LEBAR (PENJAMIN & STATUS)
             ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="relative">
              <select
                aria-label="Filter Penjamin"
                value={penjaminFilter}
                onChange={(e) => {
                  setPenjaminFilter(
                    e.target.value as 'ALL' | TarifObatPenjaminKey,
                  );
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Penjamin</option>
                <option value="Umum">Umum</option>
                <option value="BPJS">BPJS</option>
                <option value="Asuransi">Asuransi</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                aria-label="Filter Status Tarif"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'ALL' | TarifObatStatusKey);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* -----------------------------------------------------------------
              5. BANNER PERINGATAN PRODUK OBAT AKTIF
             ----------------------------------------------------------------- */}
          {!hasActiveDrugProducts && (
            <div className="rounded-xl border border-rose-200/80 bg-[#fdf3f2] px-4 py-3 text-xs text-rose-700">
              Daftar produk obat aktif belum dapat dimuat. Tarif baru tidak
              dapat ditambahkan sampai data tersedia.
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------------
            6. TABEL TARIF OBAT PER PENJAMIN
           ------------------------------------------------------------------- */}
        <div className="overflow-x-auto border-t border-slate-200/80">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pl-5 pr-3 py-3.5">OBAT</th>
                <th className="px-3 py-3.5">PENJAMIN</th>
                <th className="px-3 py-3.5">SATUAN</th>
                <th className="px-3 py-3.5">TARIF</th>
                <th className="px-3 py-3.5">MASA BERLAKU</th>
                <th className="px-3 py-3.5">STATUS</th>
                <th className="pl-3 pr-5 py-3.5">AKSI</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 px-5 text-center text-slate-400"
                  >
                    Tidak ada data tarif obat yang sesuai dengan filter aktif.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const isMenuOpen = openMenuId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="bg-white hover:bg-slate-50/80 transition-colors"
                    >
                      {/* OBAT */}
                      <td className="pl-5 pr-3 py-3.5 align-middle">
                        <p className="font-bold text-[#0f3d56] leading-snug">
                          {item.namaObat}
                        </p>
                        <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                          {item.kodeObat}
                        </p>
                      </td>

                      {/* PENJAMIN */}
                      <td className="px-3 py-3.5 align-middle text-[#0f3d56] whitespace-nowrap">
                        {item.penjamin}
                      </td>

                      {/* SATUAN */}
                      <td className="px-3 py-3.5 align-middle text-[#0f3d56] whitespace-nowrap">
                        {item.satuan}
                      </td>

                      {/* TARIF */}
                      <td className="px-3 py-3.5 align-middle font-semibold text-[#0f3d56] tabular-nums whitespace-nowrap">
                        {formatRupiah(item.tarif)}
                      </td>

                      {/* MASA BERLAKU */}
                      <td className="px-3 py-3.5 align-middle text-[#0f3d56] tabular-nums whitespace-nowrap">
                        {item.berlakuMulai} &ndash;{' '}
                        {item.berlakuSampai || 'seterusnya'}
                      </td>

                      {/* STATUS */}
                      <td className="px-3 py-3.5 align-middle whitespace-nowrap">
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
                        className="pl-3 pr-5 py-3.5 align-middle whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(isMenuOpen ? null : item.id)
                          }
                          aria-label={`Aksi untuk ${item.namaObat}`}
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-5 top-12 z-30 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(item);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 text-left flex items-center gap-2 text-[#0f3d56] hover:bg-slate-50 font-semibold cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5 text-slate-500" />
                              <span>Edit Tarif</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(item)}
                              className="w-full px-3.5 py-2 text-left flex items-center gap-2 text-[#0f3d56] hover:bg-slate-50 font-semibold cursor-pointer"
                            >
                              {item.status === 'aktif' ? (
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
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* -------------------------------------------------------------------
            7. FOOTER PAGINATION
           ------------------------------------------------------------------- */}
        <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          {/* Kiri: 1–10 dari 32 Tarif + Per Halaman */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="tabular-nums">
              <strong className="font-semibold text-slate-700">
                {startNumber}&ndash;{endNumber}
              </strong>{' '}
              dari{' '}
              <strong className="font-semibold text-slate-700">
                {totalItems}
              </strong>{' '}
              Tarif
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="per-halaman-tarif-obat">Per Halaman</label>
              <div className="relative">
                <select
                  id="per-halaman-tarif-obat"
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

          {/* Kanan: « < [1] [2] ... [4] > » */}
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

            {paginationPages.map((entry, idx) => {
              if (entry === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1.5 text-slate-400 select-none"
                  >
                    ...
                  </span>
                );
              }

              const isCurrent = entry === safePage;
              return (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setCurrentPage(entry)}
                  className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#e6f6f9] border-[#009bb8] text-[#008ba6]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {entry}
                </button>
              );
            })}

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

      {/* =====================================================================
          MODAL EDIT TARIF OBAT
         ===================================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono font-bold text-[#008ba6]">
                  {editingItem.kodeObat}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Tarif Obat
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
                setItems((prev) =>
                  prev.map((item) =>
                    item.id === editingItem.id ? editingItem : item,
                  ),
                );
                onUpdateTarif?.(editingItem);
                setEditingItem(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Produk Obat
                </label>
                <input
                  type="text"
                  disabled
                  value={editingItem.namaObat}
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Penjamin
                  </label>
                  <select
                    value={editingItem.penjamin}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        penjamin: e.target.value as TarifObatPenjaminKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Umum">Umum</option>
                    <option value="BPJS">BPJS</option>
                    <option value="Asuransi">Asuransi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tarif ({editingItem.satuan})
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    required
                    value={editingItem.tarif}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tarif: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Berlaku Mulai
                  </label>
                  <input
                    type="date"
                    required
                    value={editingItem.berlakuMulai}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        berlakuMulai: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Berlaku Sampai (Opsional)
                  </label>
                  <input
                    type="date"
                    value={editingItem.berlakuSampai ?? ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        berlakuSampai: e.target.value || undefined,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
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

      {/* =====================================================================
          MODAL TAMBAH TARIF OBAT (JIKA DATA PRODUK OBAT AKTIF TERSEDIA)
         ===================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  TARIF OBAT LOKAL
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Tambah Tarif Obat Baru
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
                    Kode Obat <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newKodeObat}
                    onChange={(e) => setNewKodeObat(e.target.value)}
                    placeholder="OBT-0033"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Obat <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newNamaObat}
                    onChange={(e) => setNewNamaObat(e.target.value)}
                    placeholder="Contoh: Ibuprofen Sirup 100 mg/5 mL"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Penjamin
                  </label>
                  <select
                    value={newPenjamin}
                    onChange={(e) =>
                      setNewPenjamin(e.target.value as TarifObatPenjaminKey)
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Umum">Umum</option>
                    <option value="BPJS">BPJS</option>
                    <option value="Asuransi">Asuransi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    required
                    value={newSatuan}
                    onChange={(e) => setNewSatuan(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tarif (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    required
                    value={newTarif}
                    onChange={(e) =>
                      setNewTarif(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Berlaku Mulai
                  </label>
                  <input
                    type="date"
                    required
                    value={newBerlakuMulai}
                    onChange={(e) => setNewBerlakuMulai(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Berlaku Sampai (Opsional)
                  </label>
                  <input
                    type="date"
                    value={newBerlakuSampai}
                    onChange={(e) => setNewBerlakuSampai(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
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
                  Simpan Tarif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}