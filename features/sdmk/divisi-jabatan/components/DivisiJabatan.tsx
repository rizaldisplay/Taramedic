'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Info,
  Pencil,
  Save,
  Search,
  Upload,
  X,
} from 'lucide-react';

export type MasterOrgTabKey = 'divisi' | 'jabatan';
export type OrgRecordStatusKey = 'aktif' | 'nonaktif';

export interface MasterDivisiItem {
  id: string;
  kode: string;
  nama: string;
  keterangan?: string;
  status: OrgRecordStatusKey;
}

export interface MasterJabatanItem {
  id: string;
  kode: string;
  divisiId: string;
  namaDivisi: string;
  nama: string;
  keterangan?: string;
  status: OrgRecordStatusKey;
}

const DEFAULT_DIVISI_LIST: MasterDivisiItem[] = [
  {
    id: 'div-1',
    kode: 'DIR',
    nama: 'Direksi dan Manajemen',
    keterangan:
      'Kepemimpinan, kebijakan, dan pengelolaan fasilitas pelayanan kesehatan.',
    status: 'aktif',
  },
  {
    id: 'div-2',
    kode: 'FARMASI',
    nama: 'Farmasi',
    keterangan: 'Pelayanan kefarmasian, pengelolaan obat, dan BMHP.',
    status: 'aktif',
  },
  {
    id: 'div-3',
    kode: 'FRM',
    nama: 'Farmasi',
    keterangan: 'Farmasi',
    status: 'aktif',
  },
  {
    id: 'div-4',
    kode: 'GIZI',
    nama: 'Gizi dan Nutrisi',
    keterangan: 'Asuhan gizi atau pelayanan nutrisi jika tersedia.',
    status: 'aktif',
  },
  {
    id: 'div-5',
    kode: 'GUDANG-FARMASI',
    nama: 'Gudang Farmasi',
    keterangan: 'Penerimaan, penyimpanan, dan distribusi persediaan farmasi.',
    status: 'aktif',
  },
  {
    id: 'div-6',
    kode: 'INTEGRASI-PELAPORAN',
    nama: 'Integrasi dan Pelaporan Kesehatan',
    keterangan: 'Pengelolaan interoperabilitas SATUSEHAT, BPJS, dan pelaporan.',
    status: 'aktif',
  },
  {
    id: 'div-7',
    kode: 'TI-GA',
    nama: 'Teknologi Informasi dan General Affairs',
    keterangan: 'Infrastruktur sistem informasi klinik dan urusan umum.',
    status: 'aktif',
  },
  {
    id: 'div-8',
    kode: 'LABORATORIUM',
    nama: 'Laboratorium',
    keterangan: 'Pemeriksaan penunjang diagnostik laboratorium klinik.',
    status: 'aktif',
  },
  {
    id: 'div-9',
    kode: 'KEUANGAN',
    nama: 'Keuangan dan Akuntansi',
    keterangan: 'Pengelolaan anggaran, kasir, penagihan, dan akuntansi.',
    status: 'aktif',
  },
  {
    id: 'div-10',
    kode: 'POLI-UMUM',
    nama: 'Poliklinik Umum',
    keterangan: 'Pelayanan pemeriksaan medis rawat jalan umum.',
    status: 'aktif',
  },
  {
    id: 'div-11',
    kode: 'POLI-GIGI',
    nama: 'Poliklinik Gigi dan Mulut',
    keterangan: 'Pelayanan kesehatan gigi dan tindakan odontologi.',
    status: 'aktif',
  },
  {
    id: 'div-12',
    kode: 'POLI-KIA',
    nama: 'Kesehatan Ibu dan Anak (KIA)',
    keterangan: 'Pelayanan antenatal, imunisasi, dan kesehatan anak.',
    status: 'aktif',
  },
  {
    id: 'div-13',
    kode: 'UGD',
    nama: 'Unit Gawat Darurat',
    keterangan: 'Penanganan kegawatdaruratan medis dan triase awal.',
    status: 'aktif',
  },
  {
    id: 'div-14',
    kode: 'KEPERAWATAN',
    nama: 'Keperawatan dan Kebidanan',
    keterangan: 'Koordinasi asuhan keperawatan dan praktik kebidanan.',
    status: 'aktif',
  },
  {
    id: 'div-15',
    kode: 'REKAM-MEDIS',
    nama: 'Rekam Medis dan Informasi Kesehatan',
    keterangan: 'Pengelolaan rekam medis elektronik dan koding diagnosis.',
    status: 'aktif',
  },
  {
    id: 'div-16',
    kode: 'PENDAFTARAN',
    nama: 'Pendaftaran dan Admisi',
    keterangan: 'Registrasi pasien, penjadwalan, dan informasi layanan.',
    status: 'aktif',
  },
  {
    id: 'div-17',
    kode: 'KASIR',
    nama: 'Kasir dan Penagihan',
    keterangan: 'Transaksi pembayaran pasien dan verifikasi tagihan.',
    status: 'aktif',
  },
  {
    id: 'div-18',
    kode: 'RADIOLOGI',
    nama: 'Radiologi dan Pencitraan',
    keterangan: 'Layanan diagnostik pencitraan medis.',
    status: 'aktif',
  },
  {
    id: 'div-19',
    kode: 'FISIOTERAPI',
    nama: 'Rehabilitasi Medik dan Fisioterapi',
    keterangan: 'Pemulihan fungsi fisik dan terapi rehabilitatif.',
    status: 'aktif',
  },
  {
    id: 'div-20',
    kode: 'CSSD',
    nama: 'Sterilisasi Sentral (CSSD)',
    keterangan: 'Dekontaminasi, pengemasan, dan sterilisasi instrumen medis.',
    status: 'aktif',
  },
  {
    id: 'div-21',
    kode: 'PPI',
    nama: 'Pencegahan dan Pengendalian Infeksi',
    keterangan: 'Surveilans dan kepatuhan standar pencegahan infeksi klinik.',
    status: 'aktif',
  },
  {
    id: 'div-22',
    kode: 'MUTU-K3',
    nama: 'Mutu dan Keselamatan Pasien',
    keterangan: 'Audit mutu klinis, manajemen risiko, dan K3 fasilitas.',
    status: 'aktif',
  },
  {
    id: 'div-23',
    kode: 'SDM-HRD',
    nama: 'Sumber Daya Manusia dan Diklat',
    keterangan: 'Administrasi kepegawaian, kredensial SDMK, dan pelatihan.',
    status: 'aktif',
  },
  {
    id: 'div-24',
    kode: 'PENGADAAN',
    nama: 'Pengadaan dan Logistik',
    keterangan: 'Perencanaan pembelian, vendor, dan persediaan non-medis.',
    status: 'aktif',
  },
  {
    id: 'div-25',
    kode: 'PEMELIHARAAN',
    nama: 'Pemeliharaan Sarana dan Alkes',
    keterangan: 'Kalibrasi alat kesehatan dan pemeliharaan gedung.',
    status: 'aktif',
  },
  {
    id: 'div-26',
    kode: 'KESLING',
    nama: 'Kesehatan Lingkungan dan Limbah B3',
    keterangan: 'Pengelolaan sanitasi klinik dan limbah medis.',
    status: 'aktif',
  },
  {
    id: 'div-27',
    kode: 'HUMAS',
    nama: 'Hubungan Masyarakat dan Pemasaran',
    keterangan: 'Komunikasi publik, kemitraan, dan edukasi kesehatan.',
    status: 'aktif',
  },
  {
    id: 'div-28',
    kode: 'CASEMIX',
    nama: 'Penjaminan dan Klaim',
    keterangan: 'Verifikasi berkas klaim BPJS Kesehatan dan asuransi mitra.',
    status: 'aktif',
  },
  {
    id: 'div-29',
    kode: 'MCU',
    nama: 'Medical Check Up (MCU)',
    keterangan: 'Layanan pemeriksaan kesehatan berkala dan korporasi.',
    status: 'aktif',
  },
  {
    id: 'div-30',
    kode: 'HOMECARE',
    nama: 'Layanan Kunjungan Rumah',
    keterangan: 'Pelayanan medis dan keperawatan di rumah pasien.',
    status: 'aktif',
  },
  {
    id: 'div-31',
    kode: 'SEKRETARIAT',
    nama: 'Sekretariat dan Legal',
    keterangan: 'Tata persuratan, perizinan operasional, dan kepatuhan regulasi.',
    status: 'aktif',
  },
  {
    id: 'div-32',
    kode: 'KEAMANAN',
    nama: 'Keamanan dan Ketertiban',
    keterangan: 'Pengamanan area fasilitas kesehatan dan parkir.',
    status: 'aktif',
  },
  {
    id: 'div-33',
    kode: 'KEBERSIHAN',
    nama: 'Tata Graha dan Kebersihan',
    keterangan: 'Kebersihan ruang pelayanan dan area publik klinik.',
    status: 'aktif',
  },
];

const DEFAULT_JABATAN_LIST: MasterJabatanItem[] = [
  {
    id: 'jab-1',
    kode: 'SATUSEHAT-ADMIN',
    divisiId: 'div-6',
    namaDivisi: 'Integrasi dan Pelaporan Kesehatan',
    nama: 'Admin Integrasi SATUSEHAT',
    keterangan:
      'Administrasi pemetaan dan pemantauan integrasi sesuai kewenangan.',
    status: 'aktif',
  },
  {
    id: 'jab-2',
    kode: 'SYSADMIN',
    divisiId: 'div-7',
    namaDivisi: 'Teknologi Informasi dan General Affairs',
    nama: 'Administrator Sistem',
    keterangan:
      'Pengelolaan akun, konfigurasi, dan sistem sesuai kewenangan.',
    status: 'aktif',
  },
  {
    id: 'jab-3',
    kode: 'AHLI-GIZI',
    divisiId: 'div-4',
    namaDivisi: 'Gizi dan Nutrisi',
    nama: 'Ahli Gizi',
    keterangan: 'Asuhan gizi sesuai kompetensi dan penugasan.',
    status: 'aktif',
  },
  {
    id: 'jab-4',
    kode: 'ATLM',
    divisiId: 'div-8',
    namaDivisi: 'Laboratorium',
    nama: 'Ahli Teknologi Laboratorium Medik',
    keterangan:
      'Pemeriksaan laboratorium sesuai kompetensi dan izin layanan.',
    status: 'aktif',
  },
  {
    id: 'jab-5',
    kode: 'AKUNTAN',
    divisiId: 'div-9',
    namaDivisi: 'Keuangan dan Akuntansi',
    nama: 'Akuntan',
    keterangan: 'Pencatatan dan pelaporan akuntansi.',
    status: 'aktif',
  },
  ...Array.from({ length: 51 }, (_, index) => {
    const seq = index + 6;
    const samples: Array<{
      kode: string;
      nama: string;
      divisiId: string;
      namaDivisi: string;
      keterangan: string;
    }> = [
      {
        kode: 'APOTEKER',
        nama: 'Apoteker Penanggung Jawab',
        divisiId: 'div-2',
        namaDivisi: 'Farmasi',
        keterangan: 'Pelayanan farmasi klinis dan verifikasi resep.',
      },
      {
        kode: 'BIDAN-PELAKSANA',
        nama: 'Bidan Pelaksana',
        divisiId: 'div-12',
        namaDivisi: 'Kesehatan Ibu dan Anak (KIA)',
        keterangan: 'Asuhan kebidanan ibu hamil, nifas, dan imunisasi.',
      },
      {
        kode: 'DOKTER-GIGI',
        nama: 'Dokter Gigi',
        divisiId: 'div-11',
        namaDivisi: 'Poliklinik Gigi dan Mulut',
        keterangan: 'Pemeriksaan dan tindakan medis kesehatan gigi.',
      },
      {
        kode: 'DOKTER-UMUM',
        nama: 'Dokter Umum',
        divisiId: 'div-10',
        namaDivisi: 'Poliklinik Umum',
        keterangan: 'Pemeriksaan medis, diagnosis, dan tata laksana pasien.',
      },
      {
        kode: 'PERAWAT-PELAKSANA',
        nama: 'Perawat Pelaksana',
        divisiId: 'div-14',
        namaDivisi: 'Keperawatan dan Kebidanan',
        keterangan: 'Pengkajian awal dan tindakan keperawatan.',
      },
      {
        kode: 'STAF-PENDAFTARAN',
        nama: 'Staf Pendaftaran & Admisi',
        divisiId: 'div-16',
        namaDivisi: 'Pendaftaran dan Admisi',
        keterangan: 'Registrasi pasien baru, lama, dan antrean poli.',
      },
      {
        kode: 'STAF-KASIR',
        nama: 'Staf Kasir',
        divisiId: 'div-17',
        namaDivisi: 'Kasir dan Penagihan',
        keterangan: 'Penyelesaian transaksi pembayaran dan kuitansi.',
      },
      {
        kode: 'TTK-FARMASI',
        nama: 'Tenaga Teknis Kefarmasian',
        divisiId: 'div-2',
        namaDivisi: 'Farmasi',
        keterangan: 'Penyiapan dan peracikan obat sesuai resep dokter.',
      },
      {
        kode: 'PMIK-RM',
        nama: 'Perekam Medis dan Informasi Kesehatan',
        divisiId: 'div-15',
        namaDivisi: 'Rekam Medis dan Informasi Kesehatan',
        keterangan: 'Koding ICD-10/ICD-9-CM dan pengelolaan rekam medis.',
      },
      {
        kode: 'KEPALA-KLINIK',
        nama: 'Kepala Klinik',
        divisiId: 'div-1',
        namaDivisi: 'Direksi dan Manajemen',
        keterangan: 'Penanggung jawab operasional dan mutu klinik.',
      },
    ];
    const template = samples[index % samples.length];
    const suffix = Math.floor(index / samples.length) + 1;

    return {
      id: `jab-${seq}`,
      kode: suffix > 1 ? `${template.kode}-${suffix}` : template.kode,
      divisiId: template.divisiId,
      namaDivisi: template.namaDivisi,
      nama:
        suffix > 1 ? `${template.nama} (Unit ${suffix})` : template.nama,
      keterangan: template.keterangan,
      status: 'aktif' as OrgRecordStatusKey,
    };
  }),
];

function generateUpperCode(rawName: string, fallbackPrefix: string): string {
  const cleaned = rawName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || `${fallbackPrefix}-${Date.now().toString().slice(-4)}`;
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

export default function MasterDivisiDanJabatan({
  initialDivisi = DEFAULT_DIVISI_LIST,
  initialJabatan = DEFAULT_JABATAN_LIST,
  onAddDivisi,
  onUpdateDivisi,
  onAddJabatan,
  onUpdateJabatan,
}: {
  initialDivisi?: MasterDivisiItem[];
  initialJabatan?: MasterJabatanItem[];
  onAddDivisi?: (item: MasterDivisiItem) => void;
  onUpdateDivisi?: (item: MasterDivisiItem) => void;
  onAddJabatan?: (item: MasterJabatanItem) => void;
  onUpdateJabatan?: (item: MasterJabatanItem) => void;
}) {
  const [activeTab, setActiveTab] = useState<MasterOrgTabKey>('divisi');

  // State Data Master Divisi & Master Jabatan
  const [divisiList, setDivisiList] =
    useState<MasterDivisiItem[]>(initialDivisi);
  const [jabatanList, setJabatanList] =
    useState<MasterJabatanItem[]>(initialJabatan);

  // State Form Tambah Divisi
  const [newDivisiNama, setNewDivisiNama] = useState('');
  const [newDivisiKeterangan, setNewDivisiKeterangan] = useState('');

  // State Form Tambah Jabatan
  const [newJabatanDivisiId, setNewJabatanDivisiId] = useState('');
  const [newJabatanNama, setNewJabatanNama] = useState('');
  const [newJabatanKeterangan, setNewJabatanKeterangan] = useState('');

  // State Filter & Pagination Divisi
  const [divisiSearch, setDivisiSearch] = useState('');
  const [divisiStatusFilter, setDivisiStatusFilter] = useState<
    'ALL' | OrgRecordStatusKey
  >('ALL');
  const [divisiPageSize, setDivisiPageSize] = useState<number>(5);
  const [divisiCurrentPage, setDivisiCurrentPage] = useState<number>(1);

  // State Filter & Pagination Jabatan
  const [jabatanSearch, setJabatanSearch] = useState('');
  const [jabatanStatusFilter, setJabatanStatusFilter] = useState<
    'ALL' | OrgRecordStatusKey
  >('ALL');
  const [jabatanPageSize, setJabatanPageSize] = useState<number>(5);
  const [jabatanCurrentPage, setJabatanCurrentPage] = useState<number>(1);

  // Modal Edit
  const [editingDivisi, setEditingDivisi] = useState<MasterDivisiItem | null>(
    null,
  );
  const [editingJabatan, setEditingJabatan] =
    useState<MasterJabatanItem | null>(null);

  const importFileInputRef = useRef<HTMLInputElement | null>(null);

  // Divisi aktif untuk dropdown pendaftaran jabatan baru
  const activeDivisiOptions = useMemo(
    () => divisiList.filter((d) => d.status === 'aktif'),
    [divisiList],
  );

  // Hitungan statistik header
  const activeDivisiCount = useMemo(
    () => divisiList.filter((d) => d.status === 'aktif').length,
    [divisiList],
  );
  const activeJabatanCount = useMemo(
    () => jabatanList.filter((j) => j.status === 'aktif').length,
    [jabatanList],
  );

  // Filter Divisi
  const filteredDivisi = useMemo(() => {
    return divisiList.filter((item) => {
      if (
        divisiStatusFilter !== 'ALL' &&
        item.status !== divisiStatusFilter
      ) {
        return false;
      }

      if (divisiSearch.trim() !== '') {
        const q = divisiSearch.toLowerCase();
        const match =
          item.nama.toLowerCase().includes(q) ||
          item.kode.toLowerCase().includes(q) ||
          (item.keterangan ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [divisiList, divisiStatusFilter, divisiSearch]);

  // Filter Jabatan
  const filteredJabatan = useMemo(() => {
    return jabatanList.filter((item) => {
      if (
        jabatanStatusFilter !== 'ALL' &&
        item.status !== jabatanStatusFilter
      ) {
        return false;
      }

      if (jabatanSearch.trim() !== '') {
        const q = jabatanSearch.toLowerCase();
        const match =
          item.nama.toLowerCase().includes(q) ||
          item.kode.toLowerCase().includes(q) ||
          item.namaDivisi.toLowerCase().includes(q) ||
          (item.keterangan ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [jabatanList, jabatanStatusFilter, jabatanSearch]);

  // Pagination Divisi
  const divisiTotalPages = Math.max(
    1,
    Math.ceil(filteredDivisi.length / divisiPageSize),
  );
  const safeDivisiPage = Math.min(divisiCurrentPage, divisiTotalPages);
  const paginatedDivisi = useMemo(() => {
    const startIdx = (safeDivisiPage - 1) * divisiPageSize;
    return filteredDivisi.slice(startIdx, startIdx + divisiPageSize);
  }, [filteredDivisi, safeDivisiPage, divisiPageSize]);

  const divisiStartNum =
    filteredDivisi.length === 0
      ? 0
      : (safeDivisiPage - 1) * divisiPageSize + 1;
  const divisiEndNum = Math.min(
    safeDivisiPage * divisiPageSize,
    filteredDivisi.length,
  );

  // Pagination Jabatan
  const jabatanTotalPages = Math.max(
    1,
    Math.ceil(filteredJabatan.length / jabatanPageSize),
  );
  const safeJabatanPage = Math.min(jabatanCurrentPage, jabatanTotalPages);
  const paginatedJabatan = useMemo(() => {
    const startIdx = (safeJabatanPage - 1) * jabatanPageSize;
    return filteredJabatan.slice(startIdx, startIdx + jabatanPageSize);
  }, [filteredJabatan, safeJabatanPage, jabatanPageSize]);

  const jabatanStartNum =
    filteredJabatan.length === 0
      ? 0
      : (safeJabatanPage - 1) * jabatanPageSize + 1;
  const jabatanEndNum = Math.min(
    safeJabatanPage * jabatanPageSize,
    filteredJabatan.length,
  );

  // Handlers Tambah Divisi
  const handleAddDivisiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDivisiNama.trim()) return;

    const created: MasterDivisiItem = {
      id: `div-${Date.now()}`,
      kode: generateUpperCode(newDivisiNama, 'DIV'),
      nama: newDivisiNama.trim(),
      keterangan: newDivisiKeterangan.trim() || undefined,
      status: 'aktif',
    };

    setDivisiList((prev) => [created, ...prev]);
    onAddDivisi?.(created);
    setNewDivisiNama('');
    setNewDivisiKeterangan('');
    setDivisiCurrentPage(1);
  };

  // Handlers Tambah Jabatan
  const handleAddJabatanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJabatanDivisiId || !newJabatanNama.trim()) return;

    const targetDivisi = divisiList.find((d) => d.id === newJabatanDivisiId);
    if (!targetDivisi) return;

    const created: MasterJabatanItem = {
      id: `jab-${Date.now()}`,
      kode: generateUpperCode(newJabatanNama, 'JAB'),
      divisiId: targetDivisi.id,
      namaDivisi: targetDivisi.nama,
      nama: newJabatanNama.trim(),
      keterangan: newJabatanKeterangan.trim() || undefined,
      status: 'aktif',
    };

    setJabatanList((prev) => [created, ...prev]);
    onAddJabatan?.(created);
    setNewJabatanNama('');
    setNewJabatanKeterangan('');
    setJabatanCurrentPage(1);
  };

  // Toggle Status Divisi
  const handleToggleDivisiStatus = (item: MasterDivisiItem) => {
    const nextStatus: OrgRecordStatusKey =
      item.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: MasterDivisiItem = { ...item, status: nextStatus };

    setDivisiList((prev) =>
      prev.map((d) => (d.id === item.id ? updated : d)),
    );
    if (nextStatus === 'nonaktif' && newJabatanDivisiId === item.id) {
      setNewJabatanDivisiId('');
    }
    onUpdateDivisi?.(updated);
  };

  // Toggle Status Jabatan
  const handleToggleJabatanStatus = (item: MasterJabatanItem) => {
    const nextStatus: OrgRecordStatusKey =
      item.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: MasterJabatanItem = { ...item, status: nextStatus };

    setJabatanList((prev) =>
      prev.map((j) => (j.id === item.id ? updated : j)),
    );
    onUpdateJabatan?.(updated);
  };

  // CSV Template & Ekspor Data
  const handleDownloadCsv = (onlyTemplate: boolean) => {
    if (activeTab === 'divisi') {
      const header = 'kode,nama_divisi,keterangan,status';
      const rows = onlyTemplate
        ? ['TI,Teknologi Informasi,Pengelolaan sistem informasi klinik,aktif']
        : divisiList.map(
            (d) =>
              `${d.kode},"${d.nama.replace(/"/g, '""')}","${(
                d.keterangan ?? ''
              ).replace(/"/g, '""')}",${d.status}`,
          );
      const blob = new Blob([[header, ...rows].join('\n')], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = onlyTemplate
        ? 'template-master-divisi.csv'
        : 'data-master-divisi.csv';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const header = 'kode,kode_divisi,nama_divisi,nama_jabatan,keterangan,status';
      const rows = onlyTemplate
        ? [
            'STAF-IT,TI-GA,Teknologi Informasi dan General Affairs,Staf IT,Dukungan teknis perangkat klinik,aktif',
          ]
        : jabatanList.map((j) => {
            const divCode =
              divisiList.find((d) => d.id === j.divisiId)?.kode ?? 'UMUM';
            return `${j.kode},${divCode},"${j.namaDivisi.replace(
              /"/g,
              '""',
            )}","${j.nama.replace(/"/g, '""')}","${(
              j.keterangan ?? ''
            ).replace(/"/g, '""')}",${j.status}`;
          });
      const blob = new Blob([[header, ...rows].join('\n')], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = onlyTemplate
        ? 'template-master-jabatan.csv'
        : 'data-master-jabatan.csv';
      link.click();
      URL.revokeObjectURL(url);
    }
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

      if (activeTab === 'divisi') {
        const imported: MasterDivisiItem[] = lines.slice(1).map((line, idx) => {
          const cols = line
            .split(',')
            .map((c) => c.replace(/^"|"$/g, '').trim());
          return {
            id: `div-imp-${Date.now()}-${idx}`,
            kode: cols[0] || generateUpperCode(cols[1] || 'DIV', 'DIV'),
            nama: cols[1] || 'Divisi Baru',
            keterangan: cols[2] || undefined,
            status:
              cols[3]?.toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif',
          };
        });
        setDivisiList((prev) => [...imported, ...prev]);
      } else {
        const fallbackDiv = activeDivisiOptions[0] ?? divisiList[0];
        const imported: MasterJabatanItem[] = lines
          .slice(1)
          .map((line, idx) => {
            const cols = line
              .split(',')
              .map((c) => c.replace(/^"|"$/g, '').trim());
            const matchedDiv =
              divisiList.find(
                (d) =>
                  d.kode.toLowerCase() === (cols[1] ?? '').toLowerCase() ||
                  d.nama.toLowerCase() === (cols[2] ?? '').toLowerCase(),
              ) ?? fallbackDiv;

            return {
              id: `jab-imp-${Date.now()}-${idx}`,
              kode: cols[0] || generateUpperCode(cols[3] || 'JAB', 'JAB'),
              divisiId: matchedDiv?.id ?? 'div-1',
              namaDivisi: matchedDiv?.nama ?? 'Direksi dan Manajemen',
              nama: cols[3] || 'Jabatan Baru',
              keterangan: cols[4] || undefined,
              status:
                cols[5]?.toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif',
            };
          });
        setJabatanList((prev) => [...imported, ...prev]);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-3.5">
      {/* 1. BANNER INFORMASI ATAS */}
      <div className="rounded-xl border border-sky-200/80 bg-[#f0f8fc] px-4 py-3 flex items-center gap-2.5 text-xs text-[#0f3d56]">
        <Info className="w-4 h-4 text-[#008ba6] shrink-0" />
        <p>
          Setiap jabatan terhubung ke satu divisi. Data yang dinonaktifkan tidak
          muncul pada pilihan pendaftaran baru, tetapi tetap tersimpan pada
          catatan SDMK lama.
        </p>
      </div>

      {/* 2. KARTU UTAMA MASTER DIVISI & MASTER JABATAN */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Baris Tab Navigasi */}
        <div
          role="tablist"
          aria-label="Navigasi Master Divisi dan Jabatan"
          className="px-5 border-b border-slate-200/80 flex items-center gap-6 overflow-x-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'divisi'}
            onClick={() => setActiveTab('divisi')}
            className={`relative py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'divisi'
                ? 'text-[#008ba6] font-bold'
                : 'text-slate-500 font-semibold hover:text-slate-700'
            }`}
          >
            <Building2
              className={`w-4 h-4 ${
                activeTab === 'divisi' ? 'text-[#008ba6]' : 'text-slate-400'
              }`}
            />
            <span>Master Divisi</span>
            {activeTab === 'divisi' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'jabatan'}
            onClick={() => setActiveTab('jabatan')}
            className={`relative py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'jabatan'
                ? 'text-[#008ba6] font-bold'
                : 'text-slate-500 font-semibold hover:text-slate-700'
            }`}
          >
            <Briefcase
              className={`w-4 h-4 ${
                activeTab === 'jabatan' ? 'text-[#008ba6]' : 'text-slate-400'
              }`}
            />
            <span>Master Jabatan</span>
            {activeTab === 'jabatan' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Header Judul + Tombol Template / Ekspor Data / Impor */}
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e6f6f9] text-[#008ba6] flex items-center justify-center shrink-0">
              {activeTab === 'divisi' ? (
                <Building2 className="w-5 h-5" />
              ) : (
                <Briefcase className="w-5 h-5" />
              )}
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56] leading-snug">
                {activeTab === 'divisi' ? 'Master Divisi' : 'Master Jabatan'}
              </h1>
              <p className="text-xs text-slate-400">
                {activeTab === 'divisi'
                  ? `${activeDivisiCount} aktif · ${divisiList.length} total`
                  : `${activeJabatanCount} aktif · ${jabatanList.length} total`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadCsv(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Template</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadCsv(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Impor</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            KONTEN TAB 1: MASTER DIVISI
           =================================================================== */}
        {activeTab === 'divisi' ? (
          <div>
            {/* Form Inline Tambah Divisi */}
            <form
              onSubmit={handleAddDivisiSubmit}
              className="px-5 pb-4 grid grid-cols-1 lg:grid-cols-[1.45fr_1fr_auto] gap-3 items-start text-xs"
            >
              <div>
                <label
                  htmlFor="input-nama-divisi"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Nama divisi <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-nama-divisi"
                  type="text"
                  required
                  value={newDivisiNama}
                  onChange={(e) => setNewDivisiNama(e.target.value)}
                  placeholder="Contoh: Teknologi Informasi"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Kode divisi akan dibuat otomatis setelah disimpan.
                </p>
              </div>

              <div>
                <label
                  htmlFor="input-ket-divisi"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Keterangan
                </label>
                <input
                  id="input-ket-divisi"
                  type="text"
                  value={newDivisiKeterangan}
                  onChange={(e) => setNewDivisiKeterangan(e.target.value)}
                  placeholder="Keterangan singkat (opsional)"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>

              <div className="lg:pt-[22px]">
                <button
                  type="submit"
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0d7c94] hover:bg-[#0a687d] active:bg-[#085668] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Tambah divisi</span>
                </button>
              </div>
            </form>

            {/* Bar Pencarian + Filter Status */}
            <div className="px-5 pb-4 grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3 items-end text-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={divisiSearch}
                  onChange={(e) => {
                    setDivisiSearch(e.target.value);
                    setDivisiCurrentPage(1);
                  }}
                  placeholder="Cari Nama atau Kode Divisi"
                  className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="filter-status-divisi"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Status
                </label>
                <div className="relative">
                  <select
                    id="filter-status-divisi"
                    value={divisiStatusFilter}
                    onChange={(e) => {
                      setDivisiStatusFilter(
                        e.target.value as 'ALL' | OrgRecordStatusKey,
                      );
                      setDivisiCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="ALL">Semua status</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Daftar Kartu Divisi */}
            <div className="px-5 pb-4 space-y-2.5">
              {paginatedDivisi.length === 0 ? (
                <div className="rounded-xl border border-slate-200/80 py-10 px-4 text-center text-xs text-slate-400">
                  Tidak ada data divisi yang sesuai filter pencarian.
                </div>
              ) : (
                paginatedDivisi.map((div) => (
                  <div
                    key={div.id}
                    className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300/90 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-[#0f3d56]">
                        {div.nama}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-mono font-bold text-[#0f3d56] uppercase">
                          {div.kode}
                        </span>
                        {div.keterangan && <span>{div.keterangan}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {div.status === 'aktif' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                          Nonaktif
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setEditingDivisi(div)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleDivisiStatus(div)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                      >
                        {div.status === 'aktif' ? (
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
                  </div>
                ))
              )}
            </div>

            {/* Footer Pagination Divisi */}
            <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  <strong className="font-semibold text-slate-700">
                    {divisiStartNum}–{divisiEndNum}
                  </strong>{' '}
                  dari{' '}
                  <strong className="font-semibold text-slate-700">
                    {filteredDivisi.length}
                  </strong>{' '}
                  Divisi
                </span>

                <div className="flex items-center gap-2">
                  <label htmlFor="per-halaman-divisi">Per Halaman</label>
                  <div className="relative">
                    <select
                      id="per-halaman-divisi"
                      value={divisiPageSize}
                      onChange={(e) => {
                        setDivisiPageSize(Number(e.target.value));
                        setDivisiCurrentPage(1);
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
                  onClick={() => setDivisiCurrentPage(1)}
                  disabled={safeDivisiPage <= 1}
                  aria-label="Halaman pertama"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDivisiCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={safeDivisiPage <= 1}
                  aria-label="Halaman sebelumnya"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {buildPaginationPages(safeDivisiPage, divisiTotalPages).map(
                  (entry, idx) =>
                    entry === 'ellipsis' ? (
                      <span
                        key={`div-ellipsis-${idx}`}
                        className="px-1 text-slate-400 select-none"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={entry}
                        type="button"
                        onClick={() => setDivisiCurrentPage(entry)}
                        className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                          entry === safeDivisiPage
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
                    setDivisiCurrentPage((p) =>
                      Math.min(divisiTotalPages, p + 1),
                    )
                  }
                  disabled={safeDivisiPage >= divisiTotalPages}
                  aria-label="Halaman berikutnya"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDivisiCurrentPage(divisiTotalPages)}
                  disabled={safeDivisiPage >= divisiTotalPages}
                  aria-label="Halaman terakhir"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ===================================================================
              KONTEN TAB 2: MASTER JABATAN
             =================================================================== */
          <div>
            {/* Form Inline Tambah Jabatan */}
            <form
              onSubmit={handleAddJabatanSubmit}
              className="px-5 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[0.8fr_1.05fr_0.8fr_auto] gap-3 items-start text-xs"
            >
              <div>
                <label
                  htmlFor="select-divisi-jabatan"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Divisi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="select-divisi-jabatan"
                    required
                    value={newJabatanDivisiId}
                    onChange={(e) => setNewJabatanDivisiId(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-8 py-2.5 text-xs sm:text-[13px] font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 cursor-pointer"
                  >
                    <option value="">Pilih divisi</option>
                    {activeDivisiOptions.map((div) => (
                      <option key={div.id} value={div.id}>
                        {div.nama} ({div.kode})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="input-nama-jabatan"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Nama jabatan <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-nama-jabatan"
                  type="text"
                  required
                  value={newJabatanNama}
                  onChange={(e) => setNewJabatanNama(e.target.value)}
                  placeholder="Contoh: Staf IT"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Kode jabatan akan dibuat otomatis setelah disimpan.
                </p>
              </div>

              <div>
                <label
                  htmlFor="input-ket-jabatan"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Keterangan
                </label>
                <input
                  id="input-ket-jabatan"
                  type="text"
                  value={newJabatanKeterangan}
                  onChange={(e) => setNewJabatanKeterangan(e.target.value)}
                  placeholder="Keterangan singkat (opsional)"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>

              <div className="lg:pt-[22px]">
                <button
                  type="submit"
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0d7c94] hover:bg-[#0a687d] active:bg-[#085668] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Tambah jabatan</span>
                </button>
              </div>
            </form>

            {/* Bar Pencarian + Filter Status */}
            <div className="px-5 pb-4 grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3 items-end text-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={jabatanSearch}
                  onChange={(e) => {
                    setJabatanSearch(e.target.value);
                    setJabatanCurrentPage(1);
                  }}
                  placeholder="Cari Nama atau Kode Jabatan"
                  className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="filter-status-jabatan"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Status
                </label>
                <div className="relative">
                  <select
                    id="filter-status-jabatan"
                    value={jabatanStatusFilter}
                    onChange={(e) => {
                      setJabatanStatusFilter(
                        e.target.value as 'ALL' | OrgRecordStatusKey,
                      );
                      setJabatanCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="ALL">Semua status</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Daftar Kartu Jabatan */}
            <div className="px-5 pb-4 space-y-2.5">
              {paginatedJabatan.length === 0 ? (
                <div className="rounded-xl border border-slate-200/80 py-10 px-4 text-center text-xs text-slate-400">
                  Tidak ada data jabatan yang sesuai filter pencarian.
                </div>
              ) : (
                paginatedJabatan.map((jab) => (
                  <div
                    key={jab.id}
                    className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300/90 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-[#0f3d56]">
                        {jab.nama}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-mono font-bold text-[#0f3d56] uppercase">
                          {jab.kode}
                        </span>
                        <span>
                          {jab.namaDivisi}
                          {jab.keterangan ? ` · ${jab.keterangan}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {jab.status === 'aktif' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                          Nonaktif
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setEditingJabatan(jab)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleJabatanStatus(jab)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                      >
                        {jab.status === 'aktif' ? (
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
                  </div>
                ))
              )}
            </div>

            {/* Footer Pagination Jabatan */}
            <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  <strong className="font-semibold text-slate-700">
                    {jabatanStartNum}–{jabatanEndNum}
                  </strong>{' '}
                  dari{' '}
                  <strong className="font-semibold text-slate-700">
                    {filteredJabatan.length}
                  </strong>{' '}
                  Jabatan
                </span>

                <div className="flex items-center gap-2">
                  <label htmlFor="per-halaman-jabatan">Per Halaman</label>
                  <div className="relative">
                    <select
                      id="per-halaman-jabatan"
                      value={jabatanPageSize}
                      onChange={(e) => {
                        setJabatanPageSize(Number(e.target.value));
                        setJabatanCurrentPage(1);
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
                  onClick={() => setJabatanCurrentPage(1)}
                  disabled={safeJabatanPage <= 1}
                  aria-label="Halaman pertama"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setJabatanCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={safeJabatanPage <= 1}
                  aria-label="Halaman sebelumnya"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {buildPaginationPages(safeJabatanPage, jabatanTotalPages).map(
                  (entry, idx) =>
                    entry === 'ellipsis' ? (
                      <span
                        key={`jab-ellipsis-${idx}`}
                        className="px-1 text-slate-400 select-none"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={entry}
                        type="button"
                        onClick={() => setJabatanCurrentPage(entry)}
                        className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                          entry === safeJabatanPage
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
                    setJabatanCurrentPage((p) =>
                      Math.min(jabatanTotalPages, p + 1),
                    )
                  }
                  disabled={safeJabatanPage >= jabatanTotalPages}
                  aria-label="Halaman berikutnya"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setJabatanCurrentPage(jabatanTotalPages)}
                  disabled={safeJabatanPage >= jabatanTotalPages}
                  aria-label="Halaman terakhir"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          3. MODAL EDIT MASTER DIVISI
         ===================================================================== */}
      {editingDivisi && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingDivisi.kode}
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Master Divisi
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingDivisi(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDivisiList((prev) =>
                  prev.map((d) =>
                    d.id === editingDivisi.id ? editingDivisi : d,
                  ),
                );
                setJabatanList((prev) =>
                  prev.map((j) =>
                    j.divisiId === editingDivisi.id
                      ? { ...j, namaDivisi: editingDivisi.nama }
                      : j,
                  ),
                );
                onUpdateDivisi?.(editingDivisi);
                setEditingDivisi(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kode Divisi
                </label>
                <input
                  type="text"
                  required
                  value={editingDivisi.kode}
                  onChange={(e) =>
                    setEditingDivisi({
                      ...editingDivisi,
                      kode: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Divisi
                </label>
                <input
                  type="text"
                  required
                  value={editingDivisi.nama}
                  onChange={(e) =>
                    setEditingDivisi({
                      ...editingDivisi,
                      nama: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan
                </label>
                <textarea
                  rows={2}
                  value={editingDivisi.keterangan ?? ''}
                  onChange={(e) =>
                    setEditingDivisi({
                      ...editingDivisi,
                      keterangan: e.target.value || undefined,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDivisi(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0d7c94] hover:bg-[#0a687d] text-white font-semibold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. MODAL EDIT MASTER JABATAN
         ===================================================================== */}
      {editingJabatan && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingJabatan.kode}
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Master Jabatan
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingJabatan(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setJabatanList((prev) =>
                  prev.map((j) =>
                    j.id === editingJabatan.id ? editingJabatan : j,
                  ),
                );
                onUpdateJabatan?.(editingJabatan);
                setEditingJabatan(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Divisi Terkait
                </label>
                <select
                  value={editingJabatan.divisiId}
                  onChange={(e) => {
                    const selected = divisiList.find(
                      (d) => d.id === e.target.value,
                    );
                    if (selected) {
                      setEditingJabatan({
                        ...editingJabatan,
                        divisiId: selected.id,
                        namaDivisi: selected.nama,
                      });
                    }
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                >
                  {divisiList.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.nama} ({div.kode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Jabatan
                </label>
                <input
                  type="text"
                  required
                  value={editingJabatan.nama}
                  onChange={(e) =>
                    setEditingJabatan({
                      ...editingJabatan,
                      nama: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan
                </label>
                <textarea
                  rows={2}
                  value={editingJabatan.keterangan ?? ''}
                  onChange={(e) =>
                    setEditingJabatan({
                      ...editingJabatan,
                      keterangan: e.target.value || undefined,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingJabatan(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0d7c94] hover:bg-[#0a687d] text-white font-semibold cursor-pointer"
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