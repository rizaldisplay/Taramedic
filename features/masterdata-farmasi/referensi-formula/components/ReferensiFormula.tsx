'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  ClipboardList,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
  FlaskConical,
  Layers,
  MoreVertical,
  Pencil,
  Pill,
  Plus,
  Route,
  Ruler,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';

export type ReferensiFarmasiCategoryKey =
  | 'bahan_aktif'
  | 'bentuk_sediaan'
  | 'signa'
  | 'rute_pemberian'
  | 'satuan'
  | 'golongan_obat'
  | 'kategori_produk'
  | 'subkategori_produk';

export type ReferensiStatusKey = 'aktif' | 'nonaktif';

export interface ReferensiFarmasiItem {
  id: string;
  category: ReferensiFarmasiCategoryKey;
  kode: string;
  nama: string;
  sumberKeterangan: string;
  status: ReferensiStatusKey;
}

interface CategoryMeta {
  key: ReferensiFarmasiCategoryKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBoxClass: string;
  badgeClass: string;
  catalogTotalOffset?: number;
}

const PHARMACY_CATEGORIES: CategoryMeta[] = [
  {
    key: 'bahan_aktif',
    label: 'Bahan Aktif',
    icon: FlaskConical,
    iconBoxClass: 'bg-blue-100/80 text-blue-600',
    badgeClass: 'bg-blue-100/90 text-blue-700',
    catalogTotalOffset: 2192, // 5 sampel awal + 2.192 = 2.197 total referensi KFA
  },
  {
    key: 'bentuk_sediaan',
    label: 'Bentuk Sediaan',
    icon: Pill,
    iconBoxClass: 'bg-purple-50 text-purple-600',
    badgeClass: 'bg-purple-50 text-purple-700',
    catalogTotalOffset: 73, // 5 sampel awal + 73 = 78 total referensi
  },
  {
    key: 'signa',
    label: 'Signa',
    icon: ClipboardList,
    iconBoxClass: 'bg-sky-50 text-sky-600',
    badgeClass: 'bg-sky-50 text-sky-700',
  },
  {
    key: 'rute_pemberian',
    label: 'Rute Pemberian',
    icon: Route,
    iconBoxClass: 'bg-emerald-50 text-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    key: 'satuan',
    label: 'Satuan',
    icon: Ruler,
    iconBoxClass: 'bg-amber-50 text-amber-600',
    badgeClass: 'bg-amber-50 text-amber-700',
  },
  {
    key: 'golongan_obat',
    label: 'Golongan Obat',
    icon: ShieldCheck,
    iconBoxClass: 'bg-rose-50 text-rose-600',
    badgeClass: 'bg-rose-50 text-rose-700',
  },
  {
    key: 'kategori_produk',
    label: 'Kategori Produk',
    icon: Box,
    iconBoxClass: 'bg-teal-50 text-teal-600',
    badgeClass: 'bg-teal-50 text-teal-700',
  },
  {
    key: 'subkategori_produk',
    label: 'Subkategori Produk',
    icon: Layers,
    iconBoxClass: 'bg-indigo-50 text-indigo-600',
    badgeClass: 'bg-indigo-50 text-indigo-700',
  },
];

const INITIAL_REFERENSI_FARMASI: ReferensiFarmasiItem[] = [
  // 1. Bahan Aktif (5 baris utama sesuai tabel + total 2.197 KFA)
  {
    id: 'ref-ba-1',
    category: 'bahan_aktif',
    kode: '91000472',
    nama: '(((1-Methyl-2-(5-Methyl-3-Oxazolidinyl)Ethoxy)Methoxy)Methoxy)Methanol',
    sumberKeterangan:
      'Sumber: KFA Browser SATUSEHAT, snapshot 2026-10-09. Kode KFA: 91000472; UCUM: mg.',
    status: 'aktif',
  },
  {
    id: 'ref-ba-2',
    category: 'bahan_aktif',
    kode: '91000553',
    nama: '((2S,3S,5S)-2-(2-(2,6-Dimethylphenoxy)Acetamido)-5-((S)-3-Methyl-2-(2-Oxotetrahydropyrimidin-1(2H)-Yl)Butanamido)-1,6-Diphenylhexan-3-Yl) 3-Methyl-2-(2-Oxotetrahydropyrimidin-1(2H)-Yl)Butanoate, (S)-',
    sumberKeterangan:
      'Sumber: KFA Browser SATUSEHAT, snapshot 2026-10-09. Kode KFA: 91000553; UCUM: mg.',
    status: 'aktif',
  },
  {
    id: 'ref-ba-3',
    category: 'bahan_aktif',
    kode: '91000557',
    nama: '(-)-Ambroxide',
    sumberKeterangan:
      'Sumber: KFA Browser SATUSEHAT, snapshot 2026-10-09. Kode KFA: 91000557; UCUM: mg.',
    status: 'aktif',
  },
  {
    id: 'ref-ba-4',
    category: 'bahan_aktif',
    kode: '91001120',
    nama: '(1,1-Dimethylethyl)Urea',
    sumberKeterangan:
      'Sumber: KFA Browser SATUSEHAT, snapshot 2026-10-09. Kode KFA: 91001120; UCUM: mg.',
    status: 'aktif',
  },
  {
    id: 'ref-ba-5',
    category: 'bahan_aktif',
    kode: '91001270',
    nama: '(1,2,6,7-3H)-Testosterone',
    sumberKeterangan:
      'Sumber: KFA Browser SATUSEHAT, snapshot 2026-10-09. Kode KFA: 91001270; UCUM: mg.',
    status: 'aktif',
  },

  // 2. Bentuk Sediaan
  {
    id: 'ref-bs-1',
    category: 'bentuk_sediaan',
    kode: 'BS001',
    nama: 'Tablet',
    sumberKeterangan: 'Referensi bentuk sediaan padat oral standar KFA.',
    status: 'aktif',
  },
  {
    id: 'ref-bs-2',
    category: 'bentuk_sediaan',
    kode: 'BS002',
    nama: 'Kapsul',
    sumberKeterangan: 'Referensi bentuk sediaan kapsul keras / lunak oral.',
    status: 'aktif',
  },
  {
    id: 'ref-bs-3',
    category: 'bentuk_sediaan',
    kode: 'BS003',
    nama: 'Sirup',
    sumberKeterangan: 'Referensi bentuk sediaan larutan oral dengan pembawa.',
    status: 'aktif',
  },
  {
    id: 'ref-bs-4',
    category: 'bentuk_sediaan',
    kode: 'BS004',
    nama: 'Injeksi',
    sumberKeterangan: 'Referensi sediaan steril parenteral.',
    status: 'aktif',
  },
  {
    id: 'ref-bs-5',
    category: 'bentuk_sediaan',
    kode: 'BS005',
    nama: 'Salep',
    sumberKeterangan: 'Referensi sediaan semipadat untuk aplikasi topikal.',
    status: 'aktif',
  },

  // 3. Signa (5 item)
  {
    id: 'ref-sg-1',
    category: 'signa',
    kode: '1X1',
    nama: 'Sehari 1 kali 1',
    sumberKeterangan: 'Aturan pakai 1 kali sehari sebanyak 1 unit takaran.',
    status: 'aktif',
  },
  {
    id: 'ref-sg-2',
    category: 'signa',
    kode: '2X1',
    nama: 'Sehari 2 kali 1',
    sumberKeterangan: 'Aturan pakai setiap 12 jam sebanyak 1 unit takaran.',
    status: 'aktif',
  },
  {
    id: 'ref-sg-3',
    category: 'signa',
    kode: '3X1',
    nama: 'Sehari 3 kali 1',
    sumberKeterangan: 'Aturan pakai setiap 8 jam sebanyak 1 unit takaran.',
    status: 'aktif',
  },
  {
    id: 'ref-sg-4',
    category: 'signa',
    kode: '3X1-PC',
    nama: 'Sehari 3 kali 1 (Sesudah Makan)',
    sumberKeterangan: 'Diminum 15–30 menit setelah makan.',
    status: 'aktif',
  },
  {
    id: 'ref-sg-5',
    category: 'signa',
    kode: 'PRN',
    nama: 'Bila perlu (Pro Re Nata)',
    sumberKeterangan: 'Digunakan hanya saat muncul gejala klinis.',
    status: 'aktif',
  },

  // 4. Rute Pemberian (5 item)
  {
    id: 'ref-rt-1',
    category: 'rute_pemberian',
    kode: 'PO',
    nama: 'Oral (Per Oral)',
    sumberKeterangan: 'Pemberian obat melalui mulut / saluran cerna.',
    status: 'aktif',
  },
  {
    id: 'ref-rt-2',
    category: 'rute_pemberian',
    kode: 'IV',
    nama: 'Intravena',
    sumberKeterangan: 'Pemberian langsung ke dalam pembuluh darah vena.',
    status: 'aktif',
  },
  {
    id: 'ref-rt-3',
    category: 'rute_pemberian',
    kode: 'IM',
    nama: 'Intramuskular',
    sumberKeterangan: 'Penyuntikan langsung ke jaringan otot.',
    status: 'aktif',
  },
  {
    id: 'ref-rt-4',
    category: 'rute_pemberian',
    kode: 'TOP',
    nama: 'Topikal',
    sumberKeterangan: 'Aplikasi lokal pada permukaan kulit atau mukosa.',
    status: 'aktif',
  },
  {
    id: 'ref-rt-5',
    category: 'rute_pemberian',
    kode: 'INH',
    nama: 'Inhalasi',
    sumberKeterangan: 'Pemberian melalui saluran pernapasan.',
    status: 'aktif',
  },

  // 5. Satuan (5 item)
  {
    id: 'ref-st-1',
    category: 'satuan',
    kode: 'TAB',
    nama: 'Tablet',
    sumberKeterangan: 'Satuan kemasan / dispensing per tablet.',
    status: 'aktif',
  },
  {
    id: 'ref-st-2',
    category: 'satuan',
    kode: 'CAP',
    nama: 'Kapsul',
    sumberKeterangan: 'Satuan kemasan / dispensing per kapsul.',
    status: 'aktif',
  },
  {
    id: 'ref-st-3',
    category: 'satuan',
    kode: 'BTL',
    nama: 'Botol',
    sumberKeterangan: 'Satuan sediaan cair dalam botol.',
    status: 'aktif',
  },
  {
    id: 'ref-st-4',
    category: 'satuan',
    kode: 'AMP',
    nama: 'Ampul',
    sumberKeterangan: 'Satuan sediaan injeksi dosis tunggal.',
    status: 'aktif',
  },
  {
    id: 'ref-st-5',
    category: 'satuan',
    kode: 'STRIP',
    nama: 'Strip',
    sumberKeterangan: 'Satuan kemasan strip berisi beberapa tablet/kapsul.',
    status: 'aktif',
  },

  // 6. Golongan Obat (5 item)
  {
    id: 'ref-go-1',
    category: 'golongan_obat',
    kode: 'OB-BEBAS',
    nama: 'Obat Bebas',
    sumberKeterangan: 'Dapat diperoleh tanpa resep dokter (lingkaran hijau).',
    status: 'aktif',
  },
  {
    id: 'ref-go-2',
    category: 'golongan_obat',
    kode: 'OB-TERBATAS',
    nama: 'Obat Bebas Terbatas',
    sumberKeterangan: 'Disertai tanda peringatan khusus (lingkaran biru).',
    status: 'aktif',
  },
  {
    id: 'ref-go-3',
    category: 'golongan_obat',
    kode: 'OB-KERAS',
    nama: 'Obat Keras',
    sumberKeterangan: 'Wajib menggunakan resep dokter (lingkaran merah K).',
    status: 'aktif',
  },
  {
    id: 'ref-go-4',
    category: 'golongan_obat',
    kode: 'PSIKOTROPIKA',
    nama: 'Psikotropika',
    sumberKeterangan: 'Obat keras dengan pengawasan pelaporan psikotropika.',
    status: 'aktif',
  },
  {
    id: 'ref-go-5',
    category: 'golongan_obat',
    kode: 'NARKOTIKA',
    nama: 'Narkotika',
    sumberKeterangan: 'Wajib resep asli dan pencatatan khusus narkotika.',
    status: 'aktif',
  },

  // 7. Kategori Produk (6 item)
  {
    id: 'ref-kp-1',
    category: 'kategori_produk',
    kode: 'KAT-OBAT',
    nama: 'Obat-obatan',
    sumberKeterangan: 'Produk sediaan farmasi terapeutik.',
    status: 'aktif',
  },
  {
    id: 'ref-kp-2',
    category: 'kategori_produk',
    kode: 'KAT-BMHP',
    nama: 'Bahan Medis Habis Pakai (BMHP)',
    sumberKeterangan: 'Spuit, kasa steril, infus set, dan habis pakai klinis.',
    status: 'aktif',
  },
  {
    id: 'ref-kp-3',
    category: 'kategori_produk',
    kode: 'KAT-ALKES',
    nama: 'Alat Kesehatan',
    sumberKeterangan: 'Alat medis pendukung pemeriksaan dan terapi.',
    status: 'aktif',
  },
  {
    id: 'ref-kp-4',
    category: 'kategori_produk',
    kode: 'KAT-VIT',
    nama: 'Vitamin & Suplemen',
    sumberKeterangan: 'Suplemen kesehatan dan multivitamin.',
    status: 'aktif',
  },
  {
    id: 'ref-kp-5',
    category: 'kategori_produk',
    kode: 'KAT-TOP',
    nama: 'Perawatan Kulit & Topikal',
    sumberKeterangan: 'Produk dermatologi dan perawatan luar.',
    status: 'aktif',
  },
  {
    id: 'ref-kp-6',
    category: 'kategori_produk',
    kode: 'KAT-NUT',
    nama: 'Nutrisi Medis',
    sumberKeterangan: 'Sediaan nutrisi enteral dan parenteral.',
    status: 'aktif',
  },
];

function formatNumberId(num: number): string {
  return num.toLocaleString('id-ID');
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

export default function ReferensiFarmasi({
  initialItems = INITIAL_REFERENSI_FARMASI,
  onAddReferensi,
  onUpdateReferensi,
  onDeleteReferensi,
}: {
  initialItems?: ReferensiFarmasiItem[];
  onAddReferensi?: (item: ReferensiFarmasiItem) => void;
  onUpdateReferensi?: (item: ReferensiFarmasiItem) => void;
  onDeleteReferensi?: (id: string) => void;
}) {
  const [items, setItems] = useState<ReferensiFarmasiItem[]>(initialItems);
  const [activeCategory, setActiveCategory] =
    useState<ReferensiFarmasiCategoryKey>('bahan_aktif');

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dropdown Aksi Baris & Modal Tambah/Edit
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReferensiFarmasiItem | null>(
    null,
  );

  // Form Modal State
  const [formCategory, setFormCategory] =
    useState<ReferensiFarmasiCategoryKey>('bahan_aktif');
  const [formKode, setFormKode] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formSumber, setFormSumber] = useState('');

  const kodeInputRef = useRef<HTMLInputElement | null>(null);

  // Tutup menu baris saat klik di luar
  useEffect(() => {
    if (!openMenuId) return;
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [openMenuId]);

  // Hitung total badge untuk masing-masing dari 8 kartu kategori
  const categoryCounts = useMemo(() => {
    const map = {} as Record<ReferensiFarmasiCategoryKey, number>;
    for (const cat of PHARMACY_CATEGORIES) {
      const localCount = items.filter((i) => i.category === cat.key).length;
      map[cat.key] = localCount + (cat.catalogTotalOffset ?? 0);
    }
    return map;
  }, [items]);

  const currentCategoryMeta = useMemo(
    () =>
      PHARMACY_CATEGORIES.find((c) => c.key === activeCategory) ??
      PHARMACY_CATEGORIES[0],
    [activeCategory],
  );

  // Filter item berdasarkan kategori aktif & kata kunci pencarian
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (item.category !== activeCategory) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.kode.toLowerCase().includes(q) ||
          item.nama.toLowerCase().includes(q) ||
          item.sumberKeterangan.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [items, activeCategory, searchQuery]);

  // Total hasil: menggunakan total katalog jika tidak sedang mencari
  const effectiveTotalCount = useMemo(() => {
    if (searchQuery.trim() !== '') {
      return filteredItems.length;
    }
    return (
      filteredItems.length + (currentCategoryMeta.catalogTotalOffset ?? 0)
    );
  }, [filteredItems.length, searchQuery, currentCategoryMeta]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(effectiveTotalCount / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    if (filteredItems.length === 0) return [];
    const startIdx = ((safePage - 1) * pageSize) % filteredItems.length;
    const slice = filteredItems.slice(startIdx, startIdx + pageSize);
    return slice.length > 0 ? slice : filteredItems.slice(0, pageSize);
  }, [filteredItems, safePage, pageSize]);

  const startNumber =
    effectiveTotalCount === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, effectiveTotalCount);

  const paginationPages = useMemo(
    () => getPaginationPages(safePage, totalPages),
    [safePage, totalPages],
  );

  const handleSelectCategory = (key: ReferensiFarmasiCategoryKey) => {
    setActiveCategory(key);
    setSearchQuery('');
    setCurrentPage(1);
    setOpenMenuId(null);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormCategory(activeCategory);
    setFormKode('');
    setFormNama('');
    setFormSumber('');
    setIsModalOpen(true);
    setTimeout(() => {
      kodeInputRef.current?.focus();
    }, 30);
  };

  const handleOpenEditModal = (item: ReferensiFarmasiItem) => {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormKode(item.kode);
    setFormNama(item.nama);
    setFormSumber(item.sumberKeterangan);
    setOpenMenuId(null);
    setIsModalOpen(true);
    setTimeout(() => {
      kodeInputRef.current?.focus();
    }, 30);
  };

  const handleToggleStatus = (target: ReferensiFarmasiItem) => {
    const nextStatus: ReferensiStatusKey =
      target.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: ReferensiFarmasiItem = { ...target, status: nextStatus };

    setItems((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onUpdateReferensi?.(updated);
    setOpenMenuId(null);
  };

  const handleDeleteItem = (target: ReferensiFarmasiItem) => {
    setItems((prev) => prev.filter((item) => item.id !== target.id));
    onDeleteReferensi?.(target.id);
    setOpenMenuId(null);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKode.trim() || !formNama.trim()) return;

    if (editingItem) {
      const updated: ReferensiFarmasiItem = {
        ...editingItem,
        category: formCategory,
        kode: formKode.trim(),
        nama: formNama.trim(),
        sumberKeterangan:
          formSumber.trim() ||
          `Referensi ${currentCategoryMeta.label} lokal fasilitas.`,
      };
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      onUpdateReferensi?.(updated);
      setIsModalOpen(false);
      return;
    }

    const created: ReferensiFarmasiItem = {
      id: `ref-${Date.now()}`,
      category: formCategory,
      kode: formKode.trim(),
      nama: formNama.trim(),
      sumberKeterangan:
        formSumber.trim() ||
        `Referensi ${
          PHARMACY_CATEGORIES.find((c) => c.key === formCategory)?.label ??
          'Farmasi'
        } lokal fasilitas.`,
      status: 'aktif',
    };

    setItems((prev) => [created, ...prev]);
    setActiveCategory(formCategory);
    onAddReferensi?.(created);
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. KARTU HEADER & 8 KARTU KATEGORI REFERENSI KANONIS
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Judul & Deskripsi */}
        <div className="px-5 py-4 border-b border-slate-200/80">
          <p className="text-xs font-semibold text-slate-500">
            Referensi Kanonis
          </p>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5">
            Referensi Farmasi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola referensi kanonis yang digunakan oleh produk, resep, dan
            proses Farmasi.
          </p>
        </div>

        {/* Grid 4x2 Kartu Kategori */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PHARMACY_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = activeCategory === cat.key;
            const count = categoryCounts[cat.key] ?? 0;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleSelectCategory(cat.key)}
                className={`w-full rounded-xl border px-3.5 py-3 flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#edf7fc] border-[#009bb8] shadow-[0_1px_2px_rgba(0,155,184,0.08)]'
                    : 'bg-white border-slate-200/90 hover:bg-slate-50/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cat.iconBoxClass}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <span
                    className={`text-xs sm:text-[13px] truncate ${
                      isActive
                        ? 'font-extrabold text-[#008ba6]'
                        : 'font-bold text-[#0f3d56]'
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>

                <span
                  className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums shrink-0 ${cat.badgeClass}`}
                >
                  {formatNumberId(count)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          2. KARTU TABEL DAFTAR REFERENSI KATEGORI AKTIF
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Toolbar Header Kategori Aktif & Search */}
        <div className="px-5 pt-4 pb-3.5 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                {currentCategoryMeta.label}
              </h2>
              <span className="text-xs text-slate-500 tabular-nums">
                {formatNumberId(effectiveTotalCount)} hasil
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Referensi</span>
            </button>
          </div>

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
              placeholder={`Cari ${currentCategoryMeta.label}...`}
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
          </div>
        </div>

        {/* Tabel Referensi dengan Garis Pemisah Kolom */}
        <div className="px-5 pb-4">
          <div className="overflow-x-auto rounded-lg border border-slate-200/80">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
                <tr className="divide-x divide-slate-200/70">
                  <th className="px-4 py-3.5 w-[15%]">Kode</th>
                  <th className="px-4 py-3.5 w-[24%]">Nama Referensi</th>
                  <th className="px-4 py-3.5">Sumber / Keterangan</th>
                  <th className="px-4 py-3.5 w-[105px]">Status</th>
                  <th className="px-4 py-3.5 w-[76px] text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 px-4 text-center text-slate-400"
                    >
                      Belum ada data referensi pada kategori{' '}
                      <strong className="text-slate-600">
                        {currentCategoryMeta.label}
                      </strong>
                      .
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => {
                    const isMenuOpen = openMenuId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className="divide-x divide-slate-200/70 bg-white hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Kode */}
                        <td className="px-4 py-4 align-middle font-mono text-xs text-slate-500 whitespace-nowrap">
                          {item.kode}
                        </td>

                        {/* Nama Referensi */}
                        <td className="px-4 py-4 align-middle font-bold text-[#0f3d56] leading-relaxed break-words">
                          {item.nama}
                        </td>

                        {/* Sumber / Keterangan */}
                        <td className="px-4 py-4 align-middle text-[#0f3d56]/90 leading-relaxed">
                          {item.sumberKeterangan}
                        </td>

                        {/* Status */}
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

                        {/* Aksi */}
                        <td
                          className="px-4 py-4 align-middle text-center whitespace-nowrap relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(isMenuOpen ? null : item.id)
                            }
                            aria-label={`Aksi untuk ${item.nama}`}
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-4 top-12 z-30 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 text-xs text-left">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                className="w-full px-3.5 py-2 flex items-center gap-2 text-[#0f3d56] hover:bg-slate-50 font-semibold cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                                <span>Edit Referensi</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(item)}
                                className="w-full px-3.5 py-2 flex items-center gap-2 text-[#0f3d56] hover:bg-slate-50 font-semibold cursor-pointer"
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

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item)}
                                className="w-full px-3.5 py-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50/70 font-semibold cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
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
        </div>

        {/* Footer Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          {/* Kiri: 1–5 dari 2.197 Referensi + Per Halaman */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="tabular-nums">
              <strong className="font-semibold text-slate-700">
                {formatNumberId(startNumber)}&ndash;{formatNumberId(endNumber)}
              </strong>{' '}
              dari{' '}
              <strong className="font-semibold text-slate-700">
                {formatNumberId(effectiveTotalCount)}
              </strong>{' '}
              Referensi
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="per-halaman-ref-farmasi">Per Halaman</label>
              <div className="relative">
                <select
                  id="per-halaman-ref-farmasi"
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

          {/* Kanan: « < [1] [2] ... [440] > » */}
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
                  className={`min-w-[32px] h-8 px-2 rounded-lg border text-xs font-bold tabular-nums transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#e6f6f9] border-[#009bb8] text-[#008ba6]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {formatNumberId(entry)}
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
          3. MODAL TAMBAH / EDIT REFERENSI FARMASI
         ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  REFERENSI KANONIS FARMASI
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  {editingItem ? 'Edit Referensi' : 'Tambah Referensi Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveModal}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori Referensi
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(
                        e.target.value as ReferensiFarmasiCategoryKey,
                      )
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    {PHARMACY_CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Referensi / KFA <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={kodeInputRef}
                    type="text"
                    required
                    value={formKode}
                    onChange={(e) => setFormKode(e.target.value)}
                    placeholder="Contoh: 91001500"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Referensi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Nama bahan aktif, bentuk sediaan, signa, atau satuan..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sumber / Keterangan
                </label>
                <textarea
                  rows={2}
                  value={formSumber}
                  onChange={(e) => setFormSumber(e.target.value)}
                  placeholder="Sumber: KFA Browser SATUSEHAT atau keterangan internal..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Simpan Referensi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}