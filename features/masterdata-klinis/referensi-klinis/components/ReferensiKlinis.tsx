'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ShieldCheck,
} from 'lucide-react';

export type ReferensiSortFieldKey = 'nama' | 'kelompok' | 'kode';

export interface ClinicalReferenceAttribute {
  key: string;
  value: string;
}

export interface ClinicalReferenceItem {
  id: string;
  nama: string;
  kelompok: string;
  kode: string;
  ringkasan: string;
  badgeText?: string;
  attributes: ClinicalReferenceAttribute[];
}

const DEFAULT_REFERENSI_KLINIS_LIST: ClinicalReferenceItem[] = [
  {
    id: 'apatis',
    nama: 'Apatis',
    kelompok: 'Status kesadaran klinis',
    kode: 'apatis',
    ringkasan: 'Respons lambat dan minat berkurang',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'apatis' },
      { key: 'label', value: 'Apatis' },
      { key: 'description', value: 'Respons lambat dan minat berkurang' },
    ],
  },
  {
    id: '29463-7',
    nama: 'Berat badan',
    kelompok: 'Kode observasi vital',
    kode: '29463-7',
    ringkasan: 'kg',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '29463-7' },
      { key: 'label', value: 'Berat badan' },
      { key: 'unit', value: 'kg' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
  {
    id: 'calf',
    nama: 'Betis',
    kelompok: 'Zona anatomi',
    kode: 'calf',
    ringkasan: 'Depan / Belakang',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'calf' },
      { key: 'label', value: 'Betis' },
      { key: 'view', value: 'Depan / Belakang' },
    ],
  },
  {
    id: 'compos-mentis',
    nama: 'Compos Mentis',
    kelompok: 'Status kesadaran klinis',
    kode: 'compos-mentis',
    ringkasan: 'Sadar penuh dan orientasi baik',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'compos-mentis' },
      { key: 'label', value: 'Compos Mentis' },
      { key: 'description', value: 'Sadar penuh dan orientasi baik' },
    ],
  },
  {
    id: 'chest',
    nama: 'Dada',
    kelompok: 'Zona anatomi',
    kode: 'chest',
    ringkasan: 'Depan',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'chest' },
      { key: 'label', value: 'Dada' },
      { key: 'view', value: 'Depan' },
    ],
  },
  {
    id: 'delirium',
    nama: 'Delirium',
    kelompok: 'Status kesadaran klinis',
    kode: 'delirium',
    ringkasan: 'Gelisah, disorientasi, dan kacau',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'delirium' },
      { key: 'label', value: 'Delirium' },
      { key: 'description', value: 'Gelisah, disorientasi, dan kacau' },
    ],
  },
  {
    id: '8867-4',
    nama: 'Denyut nadi',
    kelompok: 'Kode observasi vital',
    kode: '8867-4',
    ringkasan: 'bpm',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '8867-4' },
      { key: 'label', value: 'Denyut nadi' },
      { key: 'unit', value: 'bpm' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
  {
    id: '9279-1',
    nama: 'Frekuensi napas',
    kelompok: 'Kode observasi vital',
    kode: '9279-1',
    ringkasan: 'x/menit',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '9279-1' },
      { key: 'label', value: 'Frekuensi napas' },
      { key: 'unit', value: 'x/menit' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
  {
    id: 'triase-merah',
    nama: 'Gawat Darurat (Merah)',
    kelompok: 'Kategori triase',
    kode: 'triase-merah',
    ringkasan: 'Ancaman nyawa segera, penanganan 0 menit',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'triase-merah' },
      { key: 'label', value: 'Gawat Darurat (Merah)' },
      {
        key: 'description',
        value: 'Ancaman nyawa segera, penanganan 0 menit',
      },
    ],
  },
  {
    id: 'triase-kuning',
    nama: 'Gawat Tidak Darurat (Kuning)',
    kelompok: 'Kategori triase',
    kode: 'triase-kuning',
    ringkasan: 'Kondisi serius stabil, observasi ketat',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'triase-kuning' },
      { key: 'label', value: 'Gawat Tidak Darurat (Kuning)' },
      {
        key: 'description',
        value: 'Kondisi serius stabil, observasi ketat',
      },
    ],
  },
  {
    id: 'IM',
    nama: 'Intramuskular (IM)',
    kelompok: 'Rute pemberian obat',
    kode: 'IM',
    ringkasan: 'Injeksi ke jaringan otot',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'IM' },
      { key: 'label', value: 'Intramuskular (IM)' },
      { key: 'description', value: 'Injeksi ke jaringan otot' },
    ],
  },
  {
    id: 'IV',
    nama: 'Intravena (IV)',
    kelompok: 'Rute pemberian obat',
    kode: 'IV',
    ringkasan: 'Pemberian langsung ke pembuluh darah vena',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'IV' },
      { key: 'label', value: 'Intravena (IV)' },
      {
        key: 'description',
        value: 'Pemberian langsung ke pembuluh darah vena',
      },
    ],
  },
  {
    id: 'head',
    nama: 'Kepala',
    kelompok: 'Zona anatomi',
    kode: 'head',
    ringkasan: 'Depan / Belakang / Samping',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'head' },
      { key: 'label', value: 'Kepala' },
      { key: 'view', value: 'Depan / Belakang / Samping' },
    ],
  },
  {
    id: 'coma',
    nama: 'Koma',
    kelompok: 'Status kesadaran klinis',
    kode: 'coma',
    ringkasan: 'Tidak sadar dan tidak ada respons rangsang',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'coma' },
      { key: 'label', value: 'Koma' },
      {
        key: 'description',
        value: 'Tidak sadar dan tidak ada respons rangsang',
      },
    ],
  },
  {
    id: 'neck',
    nama: 'Leher',
    kelompok: 'Zona anatomi',
    kode: 'neck',
    ringkasan: 'Depan / Belakang',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'neck' },
      { key: 'label', value: 'Leher' },
      { key: 'view', value: 'Depan / Belakang' },
    ],
  },
  {
    id: 'upper-arm',
    nama: 'Lengan atas',
    kelompok: 'Zona anatomi',
    kode: 'upper-arm',
    ringkasan: 'Kanan / Kiri',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'upper-arm' },
      { key: 'label', value: 'Lengan atas' },
      { key: 'view', value: 'Kanan / Kiri' },
    ],
  },
  {
    id: 'forearm',
    nama: 'Lengan bawah',
    kelompok: 'Zona anatomi',
    kode: 'forearm',
    ringkasan: 'Kanan / Kiri',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'forearm' },
      { key: 'label', value: 'Lengan bawah' },
      { key: 'view', value: 'Kanan / Kiri' },
    ],
  },
  {
    id: '9843-4',
    nama: 'Lingkar kepala',
    kelompok: 'Kode observasi vital',
    kode: '9843-4',
    ringkasan: 'cm',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '9843-4' },
      { key: 'label', value: 'Lingkar kepala' },
      { key: 'unit', value: 'cm' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
  {
    id: '8280-0',
    nama: 'Lingkar perut',
    kelompok: 'Kode observasi vital',
    kode: '8280-0',
    ringkasan: 'cm',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '8280-0' },
      { key: 'label', value: 'Lingkar perut' },
      { key: 'unit', value: 'cm' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
  {
    id: 'PO',
    nama: 'Oral (PO)',
    kelompok: 'Rute pemberian obat',
    kode: 'PO',
    ringkasan: 'Diminum melalui mulut',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'PO' },
      { key: 'label', value: 'Oral (PO)' },
      { key: 'description', value: 'Diminum melalui mulut' },
    ],
  },
  {
    id: 'thigh',
    nama: 'Paha',
    kelompok: 'Zona anatomi',
    kode: 'thigh',
    ringkasan: 'Depan / Belakang',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'thigh' },
      { key: 'label', value: 'Paha' },
      { key: 'view', value: 'Depan / Belakang' },
    ],
  },
  {
    id: 'abdomen',
    nama: 'Perut (Abdomen)',
    kelompok: 'Zona anatomi',
    kode: 'abdomen',
    ringkasan: 'Depan',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'abdomen' },
      { key: 'label', value: 'Perut (Abdomen)' },
      { key: 'view', value: 'Depan' },
    ],
  },
  {
    id: 'back',
    nama: 'Punggung',
    kelompok: 'Zona anatomi',
    kode: 'back',
    ringkasan: 'Belakang',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'back' },
      { key: 'label', value: 'Punggung' },
      { key: 'view', value: 'Belakang' },
    ],
  },
  {
    id: '59408-5',
    nama: 'Saturasi oksigen (SpO2)',
    kelompok: 'Kode observasi vital',
    kode: '59408-5',
    ringkasan: '%',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '59408-5' },
      { key: 'label', value: 'Saturasi oksigen (SpO2)' },
      { key: 'unit', value: '%' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
  {
    id: '72514-3',
    nama: 'Skala nyeri NRS 0-10',
    kelompok: 'Instrumen pengkajian nyeri',
    kode: '72514-3',
    ringkasan: 'skor',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '72514-3' },
      { key: 'label', value: 'Skala nyeri NRS 0-10' },
      { key: 'unit', value: 'skor' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
  {
    id: 'somnolent',
    nama: 'Somnolen',
    kelompok: 'Status kesadaran klinis',
    kode: 'somnolent',
    ringkasan: 'Cenderung mengantuk, mudah dibangunkan',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'somnolent' },
      { key: 'label', value: 'Somnolen' },
      {
        key: 'description',
        value: 'Cenderung mengantuk, mudah dibangunkan',
      },
    ],
  },
  {
    id: 'stupor',
    nama: 'Sopor / Stupor',
    kelompok: 'Status kesadaran klinis',
    kode: 'stupor',
    ringkasan: 'Respons hanya terhadap rangsang nyeri kuat',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'stupor' },
      { key: 'label', value: 'Sopor / Stupor' },
      {
        key: 'description',
        value: 'Respons hanya terhadap rangsang nyeri kuat',
      },
    ],
  },
  {
    id: 'SC',
    nama: 'Subkutan (SC)',
    kelompok: 'Rute pemberian obat',
    kode: 'SC',
    ringkasan: 'Injeksi di bawah jaringan kulit',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: 'SC' },
      { key: 'label', value: 'Subkutan (SC)' },
      { key: 'description', value: 'Injeksi di bawah jaringan kulit' },
    ],
  },
  {
    id: '8310-5',
    nama: 'Suhu tubuh',
    kelompok: 'Kode observasi vital',
    kode: '8310-5',
    ringkasan: '°C',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '8310-5' },
      { key: 'label', value: 'Suhu tubuh' },
      { key: 'unit', value: '°C' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
  {
    id: '8462-4',
    nama: 'Tekanan darah diastolik',
    kelompok: 'Kode observasi vital',
    kode: '8462-4',
    ringkasan: 'mmHg',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '8462-4' },
      { key: 'label', value: 'Tekanan darah diastolik' },
      { key: 'unit', value: 'mmHg' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
  {
    id: '8480-6',
    nama: 'Tekanan darah sistolik',
    kelompok: 'Kode observasi vital',
    kode: '8480-6',
    ringkasan: 'mmHg',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '8480-6' },
      { key: 'label', value: 'Tekanan darah sistolik' },
      { key: 'unit', value: 'mmHg' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
  {
    id: '8302-2',
    nama: 'Tinggi badan',
    kelompok: 'Kode observasi vital',
    kode: '8302-2',
    ringkasan: 'cm',
    badgeText: 'Referensi sistem',
    attributes: [
      { key: 'id', value: '8302-2' },
      { key: 'label', value: 'Tinggi badan' },
      { key: 'unit', value: 'cm' },
      { key: 'system', value: 'http://loinc.org' },
    ],
  },
];

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

export default function ReferensiKlinisMaster({
  initialReferences = DEFAULT_REFERENSI_KLINIS_LIST,
  onSelectReference,
}: {
  initialReferences?: ClinicalReferenceItem[];
  onSelectReference?: (item: ClinicalReferenceItem) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(
    initialReferences[0]?.id ?? '',
  );

  // Filter & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<ReferensiSortFieldKey>('nama');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Opsi Kelompok Referensi Unik
  const groupOptions = useMemo(() => {
    const groups = Array.from(
      new Set(initialReferences.map((item) => item.kelompok)),
    );
    return groups.sort((a, b) => a.localeCompare(b, 'id'));
  }, [initialReferences]);

  // Filter & Urutkan Data
  const processedReferences = useMemo(() => {
    const filtered = initialReferences.filter((item) => {
      if (groupFilter !== 'ALL' && item.kelompok !== groupFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.nama.toLowerCase().includes(q) ||
          item.kode.toLowerCase().includes(q) ||
          item.kelompok.toLowerCase().includes(q) ||
          item.ringkasan.toLowerCase().includes(q) ||
          item.attributes.some((attr) =>
            attr.value.toLowerCase().includes(q),
          );
        if (!match) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      let compare = 0;
      if (sortField === 'nama') {
        compare = a.nama.localeCompare(b.nama, 'id');
      } else if (sortField === 'kelompok') {
        compare = a.kelompok.localeCompare(b.kelompok, 'id');
      } else {
        compare = a.kode.localeCompare(b.kode, 'en', { numeric: true });
      }
      return sortDirection === 'asc' ? compare : -compare;
    });
  }, [
    initialReferences,
    groupFilter,
    searchQuery,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalItems = processedReferences.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedReferences = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return processedReferences.slice(startIdx, startIdx + pageSize);
  }, [processedReferences, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  // Item terpilih untuk panel Detail Referensi Klinis
  const selectedReference = useMemo(() => {
    return (
      initialReferences.find((item) => item.id === selectedId) ??
      processedReferences[0] ??
      initialReferences[0] ??
      null
    );
  }, [initialReferences, selectedId, processedReferences]);

  const handleRowSelect = (item: ClinicalReferenceItem) => {
    setSelectedId(item.id);
    onSelectReference?.(item);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. BANNER STATUS ACUAN LOKAL ATAS
         ===================================================================== */}
      <div className="rounded-xl border border-sky-200/80 bg-[#f0f8fc] px-4 py-3 text-xs text-[#0f3d56] space-y-1">
        <ShieldCheck className="w-4 h-4 text-[#008ba6]" />
        <p>
          Referensi ini digunakan sebagai acuan lokal; tampilannya bukan bukti
          sinkronisasi ke SATUSEHAT.
        </p>
      </div>

      {/* =====================================================================
          2. GRID UTAMA 2 KOLOM: DAFTAR REFERENSI (KIRI) & DETAIL (KANAN)
         ===================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4 items-start">
        {/* ===================================================================
            KOLOM KIRI: TABEL REFERENSI KLINIS
           =================================================================== */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header Kartu Kiri */}
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
              Referensi Klinis
            </h1>

            <span className="text-xs font-medium text-slate-500 tabular-nums">
              {totalItems} hasil dimuat
            </span>
          </div>

          {/* Bar Pencarian, Kelompok Referensi, dan Urutkan */}
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
                placeholder="Cari Istilah, Kode, Unit, atau Deskripsi..."
                className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>

            {/* Kelompok Referensi + Urutkan */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter Kelompok Referensi */}
              <div className="relative flex-1 min-w-[220px]">
                <select
                  aria-label="Filter Kelompok Referensi"
                  value={groupFilter}
                  onChange={(e) => {
                    setGroupFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value="ALL">Semua Kelompok Referensi</option>
                  {groupOptions.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Urutkan */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Urutkan
                </span>

                <div className="relative w-44">
                  <select
                    aria-label="Urutkan Referensi Klinis"
                    value={sortField}
                    onChange={(e) =>
                      setSortField(e.target.value as ReferensiSortFieldKey)
                    }
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="nama">Nama Referensi</option>
                    <option value="kelompok">Kelompok</option>
                    <option value="kode">Kode</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSortDirection((prev) =>
                      prev === 'asc' ? 'desc' : 'asc',
                    )
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
          </div>

          {/* Tabel Referensi Klinis */}
          <div className="overflow-x-auto border-t border-slate-200/80">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pl-5 pr-3 py-3.5">NAMA REFERENSI</th>
                  <th className="px-3 py-3.5">KELOMPOK</th>
                  <th className="px-3 py-3.5">KODE</th>
                  <th className="pl-3 pr-5 py-3.5">RINGKASAN</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedReferences.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 px-5 text-center text-slate-400"
                    >
                      Tidak ada referensi klinis yang sesuai filter pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedReferences.map((item) => {
                    const isSelected = selectedReference?.id === item.id;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleRowSelect(item)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#edf7fc]'
                            : 'hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        {/* NAMA REFERENSI */}
                        <td className="pl-5 pr-3 py-4 align-middle font-bold text-[#008ba6] whitespace-nowrap">
                          {item.nama}
                        </td>

                        {/* KELOMPOK */}
                        <td className="px-3 py-4 align-middle text-slate-600 whitespace-nowrap">
                          {item.kelompok}
                        </td>

                        {/* KODE */}
                        <td className="px-3 py-4 align-middle font-mono text-slate-600 whitespace-nowrap">
                          {item.kode}
                        </td>

                        {/* RINGKASAN */}
                        <td className="pl-3 pr-5 py-4 align-middle text-slate-500">
                          {item.ringkasan}
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
                Hasil Dimuat
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="per-halaman-referensi">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-referensi"
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
                    key={`ref-ellipsis-${idx}`}
                    className="px-1 text-slate-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => setCurrentPage(entry)}
                    className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
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
            KOLOM KANAN: PANEL DETAIL REFERENSI KLINIS
           =================================================================== */}
        <aside className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 space-y-4">
          {/* Header Detail */}
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
              Detail Referensi Klinis
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              Master klinis
            </span>
          </div>

          {!selectedReference ? (
            <div className="py-14 text-center text-xs text-slate-400">
              Pilih referensi klinis di tabel untuk melihat detail atributnya.
            </div>
          ) : (
            <>
              {/* Identitas Kelompok, Nama Referensi & Badge */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    {selectedReference.kelompok}
                  </p>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#008ba6] mt-0.5 leading-snug">
                    {selectedReference.nama}
                  </h3>
                </div>

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#e6f6f9] border border-cyan-200/80 text-[11px] font-semibold text-[#008ba6]">
                  {selectedReference.badgeText || 'Referensi sistem'}
                </span>
              </div>

              {/* Metadata Kelompok & Kode */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <p className="text-xs font-bold text-slate-400">Kelompok</p>
                  <p className="text-xs sm:text-[13px] text-[#0f3d56] mt-1">
                    {selectedReference.kelompok}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400">Kode</p>
                  <p className="text-xs sm:text-[13px] font-mono text-[#0f3d56] mt-1">
                    {selectedReference.kode}
                  </p>
                </div>
              </div>

              {/* Callout Read-Only Sistem */}
              <div className="rounded-xl border border-sky-200/80 bg-[#f0f8fc] p-3.5 text-xs text-[#0f3d56] space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#008ba6]" />
                <p className="leading-relaxed">
                  Referensi bersumber dari master data klinis sistem dan tampil
                  hanya-baca pada halaman ini.
                </p>
              </div>

              {/* Kartu Atribut Referensi (id, label, description / unit / view) */}
              <div className="space-y-2.5">
                {selectedReference.attributes.map((attr) => (
                  <div
                    key={`${selectedReference.id}-${attr.key}`}
                    className="rounded-xl border border-slate-200/90 bg-white p-3.5"
                  >
                    <p className="text-xs font-bold text-slate-500">
                      {attr.key}
                    </p>
                    <p className="text-xs sm:text-[13px] text-[#0f3d56] mt-1 leading-relaxed break-words">
                      {attr.value}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}