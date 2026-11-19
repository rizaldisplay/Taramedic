'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Layers,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  Wrench,
  X,
} from 'lucide-react';

export type RadiologyCatalogTabKey =
  | 'pemeriksaan'
  | 'kategori'
  | 'modalitas'
  | 'proyeksi'
  | 'lokasi_anatomi'
  | 'bahan_kontras'
  | 'mapping';

export type RadiologyRecordStatusKey = 'aktif' | 'nonaktif';

export interface RadiologyCatalogItem {
  id: string;
  tab: RadiologyCatalogTabKey;
  kode: string;
  nama: string;
  subInfo: string;
  status: RadiologyRecordStatusKey;
  urutan: number;
}

export interface RadiologyDeviceItem {
  id: string;
  kodeAlat: string;
  namaPerangkat: string;
  modalitas: string;
  merkTipe: string;
  nomorSeri?: string;
  status: RadiologyRecordStatusKey;
}

export interface RadiologyParameterItem {
  id: string;
  kodeParameter: string;
  namaParameter: string;
  satuan: string;
  tipeInput: 'Angka' | 'Teks' | 'Pilihan';
  keterangan?: string;
}

const RADIOLOGY_UNITS = [
  { id: 'unit-rad-3', label: 'Unit Radiologi UP-000003 · Radiologi' },
  { id: 'unit-rad-4', label: 'Unit Radiologi CT-000004 · CT & USG' },
];

const CATALOG_TABS: Array<{
  key: RadiologyCatalogTabKey;
  label: string;
  singularLabel: string;
  secondaryColumnHeader: string;
}> = [
  {
    key: 'pemeriksaan',
    label: 'Pemeriksaan',
    singularLabel: 'Pemeriksaan',
    secondaryColumnHeader: 'Modalitas / area',
  },
  {
    key: 'kategori',
    label: 'Kategori',
    singularLabel: 'Kategori',
    secondaryColumnHeader: 'Kelompok layanan',
  },
  {
    key: 'modalitas',
    label: 'Modalitas',
    singularLabel: 'Modalitas',
    secondaryColumnHeader: 'Kode DICOM / jenis',
  },
  {
    key: 'proyeksi',
    label: 'Proyeksi / View',
    singularLabel: 'Proyeksi',
    secondaryColumnHeader: 'Arah berkas sinar',
  },
  {
    key: 'lokasi_anatomi',
    label: 'Lokasi anatomi',
    singularLabel: 'Lokasi Anatomi',
    secondaryColumnHeader: 'Regio / terminologi SNOMED',
  },
  {
    key: 'bahan_kontras',
    label: 'Bahan kontras',
    singularLabel: 'Bahan Kontras',
    secondaryColumnHeader: 'Rute pemberian / zat aktif',
  },
  {
    key: 'mapping',
    label: 'Mapping',
    singularLabel: 'Mapping',
    secondaryColumnHeader: 'Standar LOINC / SNOMED CT',
  },
];

const INITIAL_PEMERIKSAAN_ITEMS: RadiologyCatalogItem[] = [
  {
    id: 'rad-1',
    tab: 'pemeriksaan',
    kode: 'XR-ABDOMEN-3POS',
    nama: 'Abdomen 3 Posisi',
    subInfo: 'Digital Radiography · Abdomen',
    status: 'aktif',
    urutan: 5,
  },
  {
    id: 'rad-2',
    tab: 'pemeriksaan',
    kode: 'XR-ABDOMEN-AP',
    nama: 'Abdomen AP Supine',
    subInfo: 'Digital Radiography · Abdomen',
    status: 'aktif',
    urutan: 4,
  },
  {
    id: 'rad-3',
    tab: 'pemeriksaan',
    kode: 'XR-ANKLE-3V',
    nama: 'Ankle AP, Lateral, dan Oblique',
    subInfo: 'Digital Radiography · Pergelangan kaki',
    status: 'aktif',
    urutan: 17,
  },
  {
    id: 'rad-4',
    tab: 'pemeriksaan',
    kode: 'CT-KUB-NC',
    nama: 'CT KUB Tanpa Kontras',
    subInfo: 'Computed Tomography · Traktus urinarius',
    status: 'aktif',
    urutan: 37,
  },
  {
    id: 'rad-5',
    tab: 'pemeriksaan',
    kode: 'CT-ABDO-PELVIS-CE',
    nama: 'CT Scan Abdomen Pelvis dengan Kontras IV',
    subInfo: 'Computed Tomography · Abdomen',
    status: 'aktif',
    urutan: 36,
  },
  {
    id: 'rad-6',
    tab: 'pemeriksaan',
    kode: 'CT-HEAD-NC',
    nama: 'CT Scan Kepala Tanpa Kontras',
    subInfo: 'Computed Tomography · Kepala',
    status: 'aktif',
    urutan: 33,
  },
  {
    id: 'rad-7',
    tab: 'pemeriksaan',
    kode: 'CT-THORAX-NC',
    nama: 'CT Scan Thorax Tanpa Kontras',
    subInfo: 'Computed Tomography · Thorax',
    status: 'aktif',
    urutan: 34,
  },
  {
    id: 'rad-8',
    tab: 'pemeriksaan',
    kode: 'CT-THORAX-CE',
    nama: 'CT Scan Thorax dengan Kontras IV',
    subInfo: 'Computed Tomography · Thorax',
    status: 'aktif',
    urutan: 35,
  },
  {
    id: 'rad-9',
    tab: 'pemeriksaan',
    kode: 'XR-CSPINE-2V',
    nama: 'Cervical Spine AP dan Lateral',
    subInfo: 'Digital Radiography · Tulang belakang servikal',
    status: 'aktif',
    urutan: 7,
  },
  {
    id: 'rad-10',
    tab: 'pemeriksaan',
    kode: 'XR-ELBOW-2V',
    nama: 'Elbow AP dan Lateral',
    subInfo: 'Digital Radiography · Siku',
    status: 'aktif',
    urutan: 13,
  },
  ...[
    {
      kode: 'XR-THORAX-PA',
      nama: 'Thorax PA Erect',
      subInfo: 'Digital Radiography · Thorax',
      urutan: 1,
    },
    {
      kode: 'XR-THORAX-AP',
      nama: 'Thorax AP Supine',
      subInfo: 'Digital Radiography · Thorax',
      urutan: 2,
    },
    {
      kode: 'XR-THORAX-2V',
      nama: 'Thorax PA dan Lateral',
      subInfo: 'Digital Radiography · Thorax',
      urutan: 3,
    },
    {
      kode: 'XR-CRANIUM-2V',
      nama: 'Cranium AP dan Lateral',
      subInfo: 'Digital Radiography · Kepala',
      urutan: 6,
    },
    {
      kode: 'XR-TSPINE-2V',
      nama: 'Thoracal Spine AP dan Lateral',
      subInfo: 'Digital Radiography · Tulang belakang torakal',
      urutan: 8,
    },
    {
      kode: 'XR-LSPINE-2V',
      nama: 'Lumbosacral Spine AP dan Lateral',
      subInfo: 'Digital Radiography · Tulang belakang lumbal',
      urutan: 9,
    },
    {
      kode: 'XR-PELVIS-AP',
      nama: 'Pelvis AP',
      subInfo: 'Digital Radiography · Pelvis',
      urutan: 10,
    },
    {
      kode: 'XR-SHOULDER-2V',
      nama: 'Shoulder AP dan Axial',
      subInfo: 'Digital Radiography · Bahu',
      urutan: 11,
    },
    {
      kode: 'XR-HUMERUS-2V',
      nama: 'Humerus AP dan Lateral',
      subInfo: 'Digital Radiography · Lengan atas',
      urutan: 12,
    },
    {
      kode: 'XR-ANTEBRACHI-2V',
      nama: 'Antebrachii AP dan Lateral',
      subInfo: 'Digital Radiography · Lengan bawah',
      urutan: 14,
    },
    {
      kode: 'XR-WRIST-2V',
      nama: 'Wrist Joint AP dan Lateral',
      subInfo: 'Digital Radiography · Pergelangan tangan',
      urutan: 15,
    },
    {
      kode: 'XR-MANUS-2V',
      nama: 'Manus AP dan Oblique',
      subInfo: 'Digital Radiography · Tangan',
      urutan: 16,
    },
    {
      kode: 'XR-FEMUR-2V',
      nama: 'Femur AP dan Lateral',
      subInfo: 'Digital Radiography · Paha',
      urutan: 18,
    },
    {
      kode: 'XR-GENU-2V',
      nama: 'Genu (Lutut) AP dan Lateral',
      subInfo: 'Digital Radiography · Lutut',
      urutan: 19,
    },
    {
      kode: 'XR-CRURIS-2V',
      nama: 'Cruris AP dan Lateral',
      subInfo: 'Digital Radiography · Tungkai bawah',
      urutan: 20,
    },
    {
      kode: 'XR-PEDIS-2V',
      nama: 'Pedis AP dan Oblique',
      subInfo: 'Digital Radiography · Kaki',
      urutan: 21,
    },
    {
      kode: 'XR-WATERS',
      nama: 'Sinus Paranasal (Posisi Waters)',
      subInfo: 'Digital Radiography · Sinus paranasal',
      urutan: 22,
    },
    {
      kode: 'XR-BNO-AP',
      nama: 'BNO (Blass Nier Overzicht) AP',
      subInfo: 'Digital Radiography · Traktus urinarius',
      urutan: 23,
    },
    {
      kode: 'USG-ABDO-UPPER',
      nama: 'USG Abdomen Atas (Upper Abdomen)',
      subInfo: 'Ultrasonography · Abdomen',
      urutan: 24,
    },
    {
      kode: 'USG-ABDO-LOWER',
      nama: 'USG Abdomen Bawah (Lower Abdomen)',
      subInfo: 'Ultrasonography · Pelvis',
      urutan: 25,
    },
    {
      kode: 'USG-ABDO-WHOLE',
      nama: 'USG Whole Abdomen',
      subInfo: 'Ultrasonography · Abdomen',
      urutan: 26,
    },
    {
      kode: 'USG-OBSTETRI',
      nama: 'USG Obstetri Dasar',
      subInfo: 'Ultrasonography · Obstetri',
      urutan: 27,
    },
    {
      kode: 'USG-THYROID',
      nama: 'USG Tiroid dan Leher',
      subInfo: 'Ultrasonography · Leher',
      urutan: 28,
    },
    {
      kode: 'USG-MAMMAE',
      nama: 'USG Mammae Bilateral',
      subInfo: 'Ultrasonography · Payudara',
      urutan: 29,
    },
    {
      kode: 'USG-UROLOGI',
      nama: 'USG Ginjal dan Buli (Urologi)',
      subInfo: 'Ultrasonography · Traktus urinarius',
      urutan: 30,
    },
    {
      kode: 'USG-DOPPLER-CAR',
      nama: 'USG Doppler Carotis',
      subInfo: 'Ultrasonography · Vaskular leher',
      urutan: 31,
    },
    {
      kode: 'CT-HEAD-CE',
      nama: 'CT Scan Kepala dengan Kontras IV',
      subInfo: 'Computed Tomography · Kepala',
      urutan: 32,
    },
    {
      kode: 'CT-SINUS-NC',
      nama: 'CT Scan Sinus Paranasal Tanpa Kontras',
      subInfo: 'Computed Tomography · Sinus paranasal',
      urutan: 38,
    },
    {
      kode: 'CT-LSPINE-NC',
      nama: 'CT Scan Lumbal Tanpa Kontras',
      subInfo: 'Computed Tomography · Tulang belakang lumbal',
      urutan: 39,
    },
    {
      kode: 'PANO-DENTAL',
      nama: 'Foto Panoramik Gigi (OPG)',
      subInfo: 'Panoramic Dental · Maksilofasial',
      urutan: 40,
    },
    {
      kode: 'CEPHALO-LAT',
      nama: 'Sefalometri Lateral',
      subInfo: 'Cephalometry · Kraniofasial',
      urutan: 41,
    },
    {
      kode: 'MAMMO-2V',
      nama: 'Mamografi Bilateral CC dan MLO',
      subInfo: 'Mammography · Payudara',
      urutan: 42,
    },
  ].map((item, idx) => ({
    id: `rad-${idx + 11}`,
    tab: 'pemeriksaan' as RadiologyCatalogTabKey,
    kode: item.kode,
    nama: item.nama,
    subInfo: item.subInfo,
    status: 'aktif' as RadiologyRecordStatusKey,
    urutan: item.urutan,
  })),
];

const SECONDARY_TAB_ITEMS: RadiologyCatalogItem[] = [
  {
    id: 'kat-1',
    tab: 'kategori',
    kode: 'RAD-KONVENSIONAL',
    nama: 'Radiologi Konvensional (X-Ray)',
    subInfo: 'Pemeriksaan foto polos standar & kontras',
    status: 'aktif',
    urutan: 1,
  },
  {
    id: 'kat-2',
    tab: 'kategori',
    kode: 'RAD-CT',
    nama: 'Computed Tomography (CT Scan)',
    subInfo: 'Pencitraan tomografi terkomputasi',
    status: 'aktif',
    urutan: 2,
  },
  {
    id: 'kat-3',
    tab: 'kategori',
    kode: 'RAD-USG',
    nama: 'Ultrasonografi (USG)',
    subInfo: 'Diagnostik gelombang ultrasonik & Doppler',
    status: 'aktif',
    urutan: 3,
  },
  {
    id: 'mod-1',
    tab: 'modalitas',
    kode: 'DX',
    nama: 'Digital Radiography',
    subInfo: 'DICOM Modality DX · Sinar-X digital',
    status: 'aktif',
    urutan: 1,
  },
  {
    id: 'mod-2',
    tab: 'modalitas',
    kode: 'CT',
    nama: 'Computed Tomography',
    subInfo: 'DICOM Modality CT · Multi-slice CT',
    status: 'aktif',
    urutan: 2,
  },
  {
    id: 'mod-3',
    tab: 'modalitas',
    kode: 'US',
    nama: 'Ultrasonography',
    subInfo: 'DICOM Modality US · Diagnostik USG',
    status: 'aktif',
    urutan: 3,
  },
  {
    id: 'prj-1',
    tab: 'proyeksi',
    kode: 'AP',
    nama: 'Anteroposterior (AP)',
    subInfo: 'Arah sinar dari anterior ke posterior',
    status: 'aktif',
    urutan: 1,
  },
  {
    id: 'prj-2',
    tab: 'proyeksi',
    kode: 'PA',
    nama: 'Posteroanterior (PA)',
    subInfo: 'Arah sinar dari posterior ke anterior',
    status: 'aktif',
    urutan: 2,
  },
  {
    id: 'prj-3',
    tab: 'proyeksi',
    kode: 'LAT',
    nama: 'Lateral',
    subInfo: 'Proyeksi sisi samping kanan / kiri',
    status: 'aktif',
    urutan: 3,
  },
  {
    id: 'ana-1',
    tab: 'lokasi_anatomi',
    kode: 'ANAT-THORAX',
    nama: 'Thorax',
    subInfo: 'SNOMED CT 51185008 · Rongga dada',
    status: 'aktif',
    urutan: 1,
  },
  {
    id: 'ana-2',
    tab: 'lokasi_anatomi',
    kode: 'ANAT-ABDOMEN',
    nama: 'Abdomen',
    subInfo: 'SNOMED CT 818983003 · Rongga perut',
    status: 'aktif',
    urutan: 2,
  },
  {
    id: 'ana-3',
    tab: 'lokasi_anatomi',
    kode: 'ANAT-HEAD',
    nama: 'Kepala',
    subInfo: 'SNOMED CT 69536005 · Kranium & intrakranial',
    status: 'aktif',
    urutan: 3,
  },
  {
    id: 'knt-1',
    tab: 'bahan_kontras',
    kode: 'KNT-IOHEXOL',
    nama: 'Iohexol 350 mgI/mL',
    subInfo: 'Intravena · Kontras non-ionik rendah osmolar',
    status: 'aktif',
    urutan: 1,
  },
  {
    id: 'knt-2',
    tab: 'bahan_kontras',
    kode: 'KNT-BARIUM',
    nama: 'Barium Sulfat Suspensi',
    subInfo: 'Oral / Rektal · Pemeriksaan saluran cerna',
    status: 'aktif',
    urutan: 2,
  },
  {
    id: 'map-1',
    tab: 'mapping',
    kode: 'MAP-THORAX-PA',
    nama: 'Thorax PA Erect → LOINC 30746-2',
    subInfo: 'LOINC 30746-2 · XR Chest PA view',
    status: 'aktif',
    urutan: 1,
  },
  {
    id: 'map-2',
    tab: 'mapping',
    kode: 'MAP-CT-HEAD',
    nama: 'CT Scan Kepala Tanpa Kontras → LOINC 24725-4',
    subInfo: 'LOINC 24725-4 · CT Head WO contrast',
    status: 'aktif',
    urutan: 2,
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

export default function MasterDataRadiologi({
  initialItems = [...INITIAL_PEMERIKSAAN_ITEMS, ...SECONDARY_TAB_ITEMS],
  onSaveCatalogItem,
  onSaveDevice,
  onSaveParameter,
}: {
  initialItems?: RadiologyCatalogItem[];
  onSaveCatalogItem?: (item: RadiologyCatalogItem) => void;
  onSaveDevice?: (device: RadiologyDeviceItem) => void;
  onSaveParameter?: (param: RadiologyParameterItem) => void;
}) {
  // Unit Radiologi Header
  const [selectedUnitId, setSelectedUnitId] = useState(RADIOLOGY_UNITS[0].id);

  // Tab Katalog Utama
  const [activeCatalogTab, setActiveCatalogTab] =
    useState<RadiologyCatalogTabKey>('pemeriksaan');

  // Data Katalog Radiologi
  const [catalogItems, setCatalogItems] =
    useState<RadiologyCatalogItem[]>(initialItems);

  // Filter, Export Scope & Pagination Katalog
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | RadiologyRecordStatusKey
  >('ALL');
  const [exportScope, setExportScope] = useState<'ALL' | 'AKTIF' | 'FILTERED'>(
    'ALL',
  );
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal Tambah / Ubah Item Katalog
  const [editingCatalogItem, setEditingCatalogItem] =
    useState<RadiologyCatalogItem | null>(null);
  const [isAddCatalogOpen, setIsAddCatalogOpen] = useState(false);
  const [formKode, setFormKode] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formSubInfo, setFormSubInfo] = useState('');
  const [formUrutan, setFormUrutan] = useState<number>(43);

  // Sub-kartu Bawah: Konfigurasi Operasional (Perangkat & Definisi Parameter)
  const [operationalTab, setOperationalTab] = useState<
    'perangkat' | 'parameter'
  >('perangkat');
  const [devices, setDevices] = useState<RadiologyDeviceItem[]>([]);
  const [parameters, setParameters] = useState<RadiologyParameterItem[]>([]);

  // Modal Tambah Perangkat & Parameter
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [devKode, setDevKode] = useState('');
  const [devNama, setDevNama] = useState('');
  const [devModalitas, setDevModalitas] = useState('Digital Radiography (DX)');
  const [devMerkTipe, setDevMerkTipe] = useState('');
  const [devSerial, setDevSerial] = useState('');

  const [isAddParamOpen, setIsAddParamOpen] = useState(false);
  const [paramKode, setParamKode] = useState('');
  const [paramNama, setParamNama] = useState('');
  const [paramSatuan, setParamSatuan] = useState('kVp');
  const [paramTipe, setParamTipe] = useState<'Angka' | 'Teks' | 'Pilihan'>(
    'Angka',
  );
  const [paramKeterangan, setParamKeterangan] = useState('');

  const importFileInputRef = useRef<HTMLInputElement | null>(null);

  const currentTabConfig = useMemo(
    () =>
      CATALOG_TABS.find((t) => t.key === activeCatalogTab) ?? CATALOG_TABS[0],
    [activeCatalogTab],
  );

  // Semua item pada tab aktif
  const currentTabItems = useMemo(
    () => catalogItems.filter((item) => item.tab === activeCatalogTab),
    [catalogItems, activeCatalogTab],
  );

  // Ringkasan 3 kartu kecil (Jumlah data, Aktif, Nonaktif)
  const summaryStats = useMemo(() => {
    const total = currentTabItems.length;
    const aktif = currentTabItems.filter((i) => i.status === 'aktif').length;
    const nonaktif = currentTabItems.filter(
      (i) => i.status === 'nonaktif',
    ).length;
    return { total, aktif, nonaktif };
  }, [currentTabItems]);

  // Item terfilter
  const filteredItems = useMemo(() => {
    return currentTabItems.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.kode.toLowerCase().includes(q) ||
          item.nama.toLowerCase().includes(q) ||
          item.subInfo.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [currentTabItems, statusFilter, searchQuery]);

  // Pagination
  const totalFiltered = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredItems.slice(startIdx, startIdx + pageSize);
  }, [filteredItems, safePage, pageSize]);

  const startNumber = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalFiltered);

  const handleSelectCatalogTab = (tab: RadiologyCatalogTabKey) => {
    setActiveCatalogTab(tab);
    setSearchQuery('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  const handleToggleItemStatus = (target: RadiologyCatalogItem) => {
    const nextStatus: RadiologyRecordStatusKey =
      target.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: RadiologyCatalogItem = { ...target, status: nextStatus };

    setCatalogItems((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onSaveCatalogItem?.(updated);
  };

  const handleDownloadCsv = (onlyTemplate: boolean) => {
    const header = 'kode,nama,modalitas_atau_area,status,urutan';
    let sourceRows = currentTabItems;
    if (exportScope === 'AKTIF') {
      sourceRows = currentTabItems.filter((i) => i.status === 'aktif');
    } else if (exportScope === 'FILTERED') {
      sourceRows = filteredItems;
    }

    const rows = onlyTemplate
      ? ['XR-THORAX-PA,Thorax PA Erect,Digital Radiography · Thorax,aktif,1']
      : sourceRows.map(
          (i) =>
            `${i.kode},"${i.nama.replace(/"/g, '""')}","${i.subInfo.replace(
              /"/g,
              '""',
            )}",${i.status},${i.urutan}`,
        );

    const blob = new Blob([[header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = onlyTemplate
      ? `template-radiologi-${activeCatalogTab}.csv`
      : `export-radiologi-${activeCatalogTab}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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

      const imported: RadiologyCatalogItem[] = lines.slice(1).map((line, idx) => {
        const cols = line
          .split(',')
          .map((c) => c.replace(/^"|"$/g, '').trim());
        return {
          id: `rad-imp-${Date.now()}-${idx}`,
          tab: activeCatalogTab,
          kode: (cols[0] || `ITEM-${idx + 1}`).toUpperCase(),
          nama: cols[1] || 'Item Radiologi Baru',
          subInfo: cols[2] || 'Digital Radiography · Umum',
          status:
            cols[3]?.toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif',
          urutan: Number(cols[4]) || currentTabItems.length + idx + 1,
        };
      });

      setCatalogItems((prev) => [...imported, ...prev]);
      setCurrentPage(1);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleOpenAddCatalogModal = () => {
    setFormKode('');
    setFormNama('');
    setFormSubInfo('');
    setFormUrutan(currentTabItems.length + 1);
    setIsAddCatalogOpen(true);
  };

  const handleCreateCatalogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKode.trim() || !formNama.trim()) return;

    const created: RadiologyCatalogItem = {
      id: `rad-${Date.now()}`,
      tab: activeCatalogTab,
      kode: formKode.trim().toUpperCase().replace(/\s+/g, '-'),
      nama: formNama.trim(),
      subInfo: formSubInfo.trim() || 'Digital Radiography · Umum',
      status: 'aktif',
      urutan: Math.max(1, Number(formUrutan) || 1),
    };

    setCatalogItems((prev) => [created, ...prev]);
    onSaveCatalogItem?.(created);
    setIsAddCatalogOpen(false);
    setCurrentPage(1);
  };

  const handleAddDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devKode.trim() || !devNama.trim()) return;

    const created: RadiologyDeviceItem = {
      id: `dev-${Date.now()}`,
      kodeAlat: devKode.trim().toUpperCase(),
      namaPerangkat: devNama.trim(),
      modalitas: devModalitas,
      merkTipe: devMerkTipe.trim() || 'Standar Klinik',
      nomorSeri: devSerial.trim() || undefined,
      status: 'aktif',
    };

    setDevices((prev) => [...prev, created]);
    onSaveDevice?.(created);
    setIsAddDeviceOpen(false);
    setDevKode('');
    setDevNama('');
    setDevMerkTipe('');
    setDevSerial('');
  };

  const handleAddParamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paramKode.trim() || !paramNama.trim()) return;

    const created: RadiologyParameterItem = {
      id: `prm-${Date.now()}`,
      kodeParameter: paramKode.trim().toUpperCase(),
      namaParameter: paramNama.trim(),
      satuan: paramSatuan.trim() || '-',
      tipeInput: paramTipe,
      keterangan: paramKeterangan.trim() || undefined,
    };

    setParameters((prev) => [...prev, created]);
    onSaveParameter?.(created);
    setIsAddParamOpen(false);
    setParamKode('');
    setParamNama('');
    setParamKeterangan('');
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. HEADER BANNER MASTER DATA RADIOLOGI
         ===================================================================== */}
      <header className="rounded-xl border border-slate-200/90 bg-gradient-to-r from-[#f3f9fc] via-white to-[#f6fbfd] shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Kiri: Ikon + Judul + Subjudul */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-100/80 border border-sky-200/70 text-[#0284c7] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400">
              Referensi Klinis · Radiologi
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] leading-snug">
              Master Data Radiologi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola katalog internal dan pemetaan terminologi berdasarkan bukti
              yang tersedia.
            </p>
          </div>
        </div>

        {/* Tengah: Selector Unit Radiologi */}
        <div className="relative">
          <select
            aria-label="Pilih Unit Radiologi"
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className="appearance-none bg-transparent pr-6 py-1 text-xs sm:text-sm font-bold text-[#0f3d56] focus:outline-none cursor-pointer"
          >
            {RADIOLOGY_UNITS.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#0f3d56] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Kanan: Badge Status Integrasi Eksternal */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/90 border border-amber-200/80 text-[11px] font-semibold text-amber-800">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>Integrasi Eksternal Tidak Dikonfigurasi</span>
        </div>
      </header>

      {/* =====================================================================
          2. BARIS TAB KATALOG RADIOLOGI (7 TAB)
         ===================================================================== */}
      <nav
        aria-label="Kategori Katalog Radiologi"
        className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-3 py-2 flex items-center gap-1.5 overflow-x-auto"
      >
        {CATALOG_TABS.map((tab) => {
          const isActive = tab.key === activeCatalogTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleSelectCatalogTab(tab.key)}
              className={`px-3.5 py-2 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#e6f6f9] text-[#008ba6] font-bold'
                  : 'text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* =====================================================================
          3. KARTU KATALOG & TABEL DATA RADIOLOGI
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Ringkasan 3 Kartu Mini + Pencarian + Status + Tombol Aksi */}
        <div className="p-5 space-y-4">
          {/* 3 Mini-Cards Statistik */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[116px] rounded-xl border border-slate-200/90 bg-slate-50/70 px-4 py-3">
              <p className="text-[11px] font-semibold text-slate-500">
                Jumlah data
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                {summaryStats.total}
              </p>
            </div>

            <div className="min-w-[116px] rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3">
              <p className="text-[11px] font-semibold text-emerald-700">
                Aktif
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                {summaryStats.aktif}
              </p>
            </div>

            <div className="min-w-[116px] rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3">
              <p className="text-[11px] font-semibold text-amber-700">
                Nonaktif
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                {summaryStats.nonaktif}
              </p>
            </div>
          </div>

          {/* Pencarian & Status Data */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari Kode atau Nama"
                className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>

            <div>
              <label
                htmlFor="filter-rad-status"
                className="block text-[11px] font-bold text-[#0f3d56] mb-1.5"
              >
                Status Data
              </label>
              <div className="relative">
                <select
                  id="filter-rad-status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(
                      e.target.value as 'ALL' | RadiologyRecordStatusKey,
                    );
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Baris Tombol Template, Semua Data, Export Data, Import Data, + Tambah */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDownloadCsv(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Template</span>
            </button>

            <div className="relative">
              <select
                aria-label="Cakupan Ekspor Data"
                value={exportScope}
                onChange={(e) =>
                  setExportScope(
                    e.target.value as 'ALL' | 'AKTIF' | 'FILTERED',
                  )
                }
                className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Data</option>
                <option value="AKTIF">Data Aktif</option>
                <option value="FILTERED">Sesuai Filter</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => handleDownloadCsv(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Data</span>
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import Data</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddCatalogModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                Tambah {currentTabConfig.singularLabel.toLowerCase()}
              </span>
            </button>
          </div>
        </div>

        {/* Tabel Data Katalog Radiologi */}
        <div className="overflow-x-auto border-t border-slate-200/80">
          <table className="w-full text-left border-collapse min-w-[880px]">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
              <tr>
                <th className="pl-5 pr-3 py-3.5">Kode</th>
                <th className="px-3 py-3.5">Nama</th>
                <th className="px-3 py-3.5">
                  {currentTabConfig.secondaryColumnHeader}
                </th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Urutan</th>
                <th className="pl-3 pr-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 px-5 text-center text-slate-400"
                  >
                    Tidak ada data {currentTabConfig.label.toLowerCase()} yang
                    sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Kode */}
                    <td className="pl-5 pr-3 py-3.5 align-middle whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200/70 font-mono text-[11px] font-bold text-[#0284c7] uppercase">
                        {item.kode}
                      </span>
                    </td>

                    {/* Nama */}
                    <td className="px-3 py-3.5 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                      {item.nama}
                    </td>

                    {/* Modalitas / area */}
                    <td className="px-3 py-3.5 align-middle text-slate-500 whitespace-nowrap">
                      {item.subInfo}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3.5 align-middle whitespace-nowrap">
                      {item.status === 'aktif' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-700">
                          Nonaktif
                        </span>
                      )}
                    </td>

                    {/* Urutan */}
                    <td className="px-3 py-3.5 align-middle text-slate-600 tabular-nums whitespace-nowrap">
                      {item.urutan}
                    </td>

                    {/* Aksi */}
                    <td className="pl-3 pr-5 py-3.5 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCatalogItem(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-slate-500" />
                          <span>Ubah</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleItemStatus(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
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
                    </td>
                  </tr>
                ))
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
                {totalFiltered}
              </strong>{' '}
              {currentTabConfig.singularLabel}
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="per-halaman-radiologi">Per Halaman</label>
              <div className="relative">
                <select
                  id="per-halaman-radiologi"
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
                  key={`rad-ellipsis-${idx}`}
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

        {/* Catatan Sumber Data Bawah Kartu Katalog */}
        <div className="px-5 py-3 border-t border-slate-100 text-[11px] text-slate-400">
          Sumber data: katalog radiologi terkonfigurasi · Tidak ada data
          eksternal yang diasumsikan.
        </div>
      </section>

      {/* =====================================================================
          4. KARTU KONFIGURASI OPERASIONAL: PERANGKAT & PARAMETER TEKNIS
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Header Kartu */}
        <div className="px-5 py-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#e6f6f9] border border-cyan-100 text-[#008ba6] flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              KONFIGURASI OPERASIONAL
            </p>
            <h2 className="text-base font-extrabold text-[#0f3d56] leading-snug">
              Perangkat &amp; Parameter Teknis
            </h2>
            <p className="text-xs text-slate-400">
              Referensi perangkat dan formulir pengukuran yang digunakan saat
              akuisisi.
            </p>
          </div>
        </div>

        {/* Bar Sub-Tab Perangkat & Definisi Parameter */}
        <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOperationalTab('perangkat')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              operationalTab === 'perangkat'
                ? 'bg-[#e6f6f9] text-[#008ba6] font-bold'
                : 'text-slate-600 font-semibold hover:bg-slate-50'
            }`}
          >
            <span>Perangkat</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] tabular-nums ${
                operationalTab === 'perangkat'
                  ? 'bg-white/90 text-[#008ba6]'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {devices.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOperationalTab('parameter')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              operationalTab === 'parameter'
                ? 'bg-[#e6f6f9] text-[#008ba6] font-bold'
                : 'text-slate-600 font-semibold hover:bg-slate-50'
            }`}
          >
            <span>Definisi parameter</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] tabular-nums ${
                operationalTab === 'parameter'
                  ? 'bg-white/90 text-[#008ba6]'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {parameters.length}
            </span>
          </button>
        </div>

        {/* Konten Sub-Tab */}
        <div className="px-5 py-4 border-t border-slate-100">
          {operationalTab === 'perangkat' ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Daftar alat terdaftar untuk unit ini
                </p>

                <button
                  type="button"
                  onClick={() => setIsAddDeviceOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Perangkat</span>
                </button>
              </div>

              {devices.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xs sm:text-sm font-bold text-[#0f3d56]">
                    Belum ada perangkat radiologi
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Tambahkan data master agar penjadwalan dan pencatatan teknis
                    konsisten.
                  </p>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-slate-200/70 border border-slate-200/80 rounded-xl overflow-hidden text-xs">
                  {devices.map((dev) => (
                    <div
                      key={dev.id}
                      className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-white hover:bg-slate-50/70"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#008ba6]">
                            {dev.kodeAlat}
                          </span>
                          <span className="font-bold text-[#0f3d56]">
                            {dev.namaPerangkat}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {dev.modalitas} · {dev.merkTipe}
                          {dev.nomorSeri ? ` · SN: ${dev.nomorSeri}` : ''}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setDevices((prev) =>
                            prev.filter((d) => d.id !== dev.id),
                          )
                        }
                        aria-label={`Hapus perangkat ${dev.namaPerangkat}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Formulir parameter eksposi &amp; teknis akuisisi citra
                </p>

                <button
                  type="button"
                  onClick={() => setIsAddParamOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Parameter</span>
                </button>
              </div>

              {parameters.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xs sm:text-sm font-bold text-[#0f3d56]">
                    Belum ada definisi parameter teknis
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Tambahkan parameter seperti kVp, mAs, DLP, atau dosis
                    kontras untuk pencatatan akuisisi.
                  </p>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-slate-200/70 border border-slate-200/80 rounded-xl overflow-hidden text-xs">
                  {parameters.map((prm) => (
                    <div
                      key={prm.id}
                      className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-white hover:bg-slate-50/70"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#008ba6]">
                            {prm.kodeParameter}
                          </span>
                          <span className="font-bold text-[#0f3d56]">
                            {prm.namaParameter}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tipe: {prm.tipeInput} · Satuan: {prm.satuan}
                          {prm.keterangan ? ` · ${prm.keterangan}` : ''}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setParameters((prev) =>
                            prev.filter((p) => p.id !== prm.id),
                          )
                        }
                        aria-label={`Hapus parameter ${prm.namaParameter}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =====================================================================
          5. MODAL TAMBAH ITEM KATALOG RADIOLOGI
         ===================================================================== */}
      {isAddCatalogOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  KATALOG RADIOLOGI
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Tambah {currentTabConfig.singularLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCatalogOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateCatalogSubmit}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode {currentTabConfig.singularLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formKode}
                    onChange={(e) => setFormKode(e.target.value)}
                    placeholder="Contoh: XR-THORAX-PA"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Urutan
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formUrutan}
                    onChange={(e) =>
                      setFormUrutan(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama {currentTabConfig.singularLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Contoh: Thorax PA Erect"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {currentTabConfig.secondaryColumnHeader}
                </label>
                <input
                  type="text"
                  required
                  value={formSubInfo}
                  onChange={(e) => setFormSubInfo(e.target.value)}
                  placeholder="Contoh: Digital Radiography · Thorax"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCatalogOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          6. MODAL UBAH ITEM KATALOG RADIOLOGI
         ===================================================================== */}
      {editingCatalogItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingCatalogItem.kode}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Ubah {currentTabConfig.singularLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCatalogItem(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCatalogItems((prev) =>
                  prev.map((item) =>
                    item.id === editingCatalogItem.id
                      ? editingCatalogItem
                      : item,
                  ),
                );
                onSaveCatalogItem?.(editingCatalogItem);
                setEditingCatalogItem(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCatalogItem.kode}
                    onChange={(e) =>
                      setEditingCatalogItem({
                        ...editingCatalogItem,
                        kode: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Urutan
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingCatalogItem.urutan}
                    onChange={(e) =>
                      setEditingCatalogItem({
                        ...editingCatalogItem,
                        urutan: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  required
                  value={editingCatalogItem.nama}
                  onChange={(e) =>
                    setEditingCatalogItem({
                      ...editingCatalogItem,
                      nama: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {currentTabConfig.secondaryColumnHeader}
                </label>
                <input
                  type="text"
                  required
                  value={editingCatalogItem.subInfo}
                  onChange={(e) =>
                    setEditingCatalogItem({
                      ...editingCatalogItem,
                      subInfo: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCatalogItem(null)}
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
          7. MODAL TAMBAH PERANGKAT RADIOLOGI
         ===================================================================== */}
      {isAddDeviceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  KONFIGURASI OPERASIONAL
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Tambah Perangkat Radiologi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDeviceOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleAddDeviceSubmit}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Alat
                  </label>
                  <input
                    type="text"
                    required
                    value={devKode}
                    onChange={(e) => setDevKode(e.target.value)}
                    placeholder="ALAT-DR-01"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Modalitas
                  </label>
                  <select
                    value={devModalitas}
                    onChange={(e) => setDevModalitas(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Digital Radiography (DX)">
                      Digital Radiography (DX)
                    </option>
                    <option value="Computed Tomography (CT)">
                      Computed Tomography (CT)
                    </option>
                    <option value="Ultrasonography (US)">
                      Ultrasonography (US)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Perangkat
                </label>
                <input
                  type="text"
                  required
                  value={devNama}
                  onChange={(e) => setDevNama(e.target.value)}
                  placeholder="Contoh: Mesin X-Ray Digital Ruang 1"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Merk &amp; Tipe
                  </label>
                  <input
                    type="text"
                    value={devMerkTipe}
                    onChange={(e) => setDevMerkTipe(e.target.value)}
                    placeholder="Contoh: Fujifilm FDR"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Seri (Opsional)
                  </label>
                  <input
                    type="text"
                    value={devSerial}
                    onChange={(e) => setDevSerial(e.target.value)}
                    placeholder="SN-..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeviceOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Perangkat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          8. MODAL TAMBAH DEFINISI PARAMETER TEKNIS
         ===================================================================== */}
      {isAddParamOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  KONFIGURASI OPERASIONAL
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Tambah Definisi Parameter
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddParamOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleAddParamSubmit}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Parameter
                  </label>
                  <input
                    type="text"
                    required
                    value={paramKode}
                    onChange={(e) => setParamKode(e.target.value)}
                    placeholder="EXP-KVP"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    required
                    value={paramSatuan}
                    onChange={(e) => setParamSatuan(e.target.value)}
                    placeholder="kVp / mAs / mGy"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Parameter
                  </label>
                  <input
                    type="text"
                    required
                    value={paramNama}
                    onChange={(e) => setParamNama(e.target.value)}
                    placeholder="Contoh: Tegangan Tabung (kVp)"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tipe Input
                  </label>
                  <select
                    value={paramTipe}
                    onChange={(e) =>
                      setParamTipe(
                        e.target.value as 'Angka' | 'Teks' | 'Pilihan',
                      )
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Angka">Angka</option>
                    <option value="Teks">Teks</option>
                    <option value="Pilihan">Pilihan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={paramKeterangan}
                  onChange={(e) => setParamKeterangan(e.target.value)}
                  placeholder="Catatan penggunaan saat akuisisi"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddParamOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Parameter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}