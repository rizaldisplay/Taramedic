'use client';

import React, { useMemo, useState } from 'react';
import {
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  FlaskConical,
  Pencil,
  Plus,
  RefreshCw,
  ScanSearch,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
} from 'lucide-react';

export type SdmkGenderKey = 'laki_laki' | 'perempuan' | 'belum_diketahui';
export type SdmkStatusKey = 'aktif' | 'tidak_aktif';
export type SipVerificationStatusKey =
  | 'Valid'
  | 'Menunggu verifikasi'
  | 'Segera berakhir'
  | 'Kedaluwarsa';

export interface SdmkRosterItem {
  id: string;
  kodeSdmk: string;
  nama: string;
  nik: string;
  nomorIhs?: string;
  nomorStr?: string;
  jenisKelamin: SdmkGenderKey;
  profesi: string;
  kompetensi: string;
  statusSip: SipVerificationStatusKey;
  jumlahSip: number;
  unitPoli: string;
  fasilitas: string;
  status: SdmkStatusKey;
  isSynced: boolean;
  isTestData?: boolean;
  hasPendingFile?: boolean;
}

const DEFAULT_SDMK_ROSTER: SdmkRosterItem[] = [
  {
    id: 'sdmk-1',
    kodeSdmk: 'SDMK-0223',
    nama: 'dr. Altharrazka Kenigara Rizfan',
    nik: '9999000000000001',
    nomorStr: '3111100123456789',
    jenisKelamin: 'laki_laki',
    profesi: 'Dokter Umum',
    kompetensi: 'Pelayanan medis umum',
    statusSip: 'Valid',
    jumlahSip: 1,
    unitPoli: 'Poli Umum',
    fasilitas: 'Klinik Taramedika',
    status: 'aktif',
    isSynced: false,
    isTestData: false,
  },
  {
    id: 'sdmk-2',
    kodeSdmk: 'SDMK-0231',
    nama: 'Budi Santoso, S.Kom.',
    nik: '9999000000000009',
    jenisKelamin: 'laki_laki',
    profesi: 'Staf Pendaftaran',
    kompetensi: 'Administrasi Rumah Sakit',
    statusSip: 'Menunggu verifikasi',
    jumlahSip: 0,
    unitPoli: 'Poli Umum',
    fasilitas: 'Klinik Taramedika',
    status: 'aktif',
    isSynced: false,
    isTestData: false,
  },
  {
    id: 'sdmk-3',
    kodeSdmk: 'SDMK-0229',
    nama: 'Dimas Pratama, A.Md.Farm.',
    nik: '9999000000000007',
    nomorStr: '19950412/STRTTK/2023',
    jenisKelamin: 'laki_laki',
    profesi: 'Tenaga Teknis Kefarmasian',
    kompetensi: 'Pelayanan kefarmasian',
    statusSip: 'Menunggu verifikasi',
    jumlahSip: 1,
    unitPoli: 'Poli Umum',
    fasilitas: 'Klinik Taramedika',
    status: 'aktif',
    isSynced: false,
    isTestData: false,
  },
  {
    id: 'sdmk-4',
    kodeSdmk: 'SDMK-0230',
    nama: 'Maya Lestari, A.Md.Kep.',
    nik: '9999000000000008',
    nomorStr: '1301521234567890',
    jenisKelamin: 'perempuan',
    profesi: 'Perawat',
    kompetensi: 'Asuhan keperawatan',
    statusSip: 'Menunggu verifikasi',
    jumlahSip: 1,
    unitPoli: 'Poli Umum',
    fasilitas: 'Klinik Taramedika',
    status: 'aktif',
    isSynced: false,
    isTestData: false,
  },
  {
    id: 'sdmk-5',
    kodeSdmk: 'SDMK-0227',
    nama: 'drg. Nadia Prameswari',
    nik: '9999000000000005',
    nomorStr: '3121100223456781',
    jenisKelamin: 'perempuan',
    profesi: 'Dokter Gigi',
    kompetensi: 'Pelayanan kesehatan gigi',
    statusSip: 'Menunggu verifikasi',
    jumlahSip: 1,
    unitPoli: 'Poli Umum',
    fasilitas: 'Klinik Taramedika',
    status: 'aktif',
    isSynced: false,
    isTestData: false,
  },
  {
    id: 'sdmk-6',
    kodeSdmk: 'SDMK-0224',
    nama: 'apt. Rina Wulandari, S.Farm.',
    nik: '9999000000000002',
    nomorStr: '19940819/STRA/2022',
    jenisKelamin: 'perempuan',
    profesi: 'Apoteker',
    kompetensi: 'Pelayanan farmasi klinis',
    statusSip: 'Menunggu verifikasi',
    jumlahSip: 1,
    unitPoli: 'Farmasi',
    fasilitas: 'Klinik Taramedika',
    status: 'aktif',
    isSynced: false,
    isTestData: false,
  },
  {
    id: 'sdmk-7',
    kodeSdmk: 'SDMK-0225',
    nama: 'dr. Fajar Nugroho',
    nik: '9999000000000003',
    nomorStr: '3111100998877665',
    jenisKelamin: 'laki_laki',
    profesi: 'Dokter Umum',
    kompetensi: 'Pelayanan medis umum',
    statusSip: 'Menunggu verifikasi',
    jumlahSip: 1,
    unitPoli: 'Poli Umum',
    fasilitas: 'Klinik Taramedika',
    status: 'aktif',
    isSynced: false,
    isTestData: false,
  },
  {
    id: 'sdmk-8',
    kodeSdmk: 'SDMK-0226',
    nama: 'Siti Aminah, A.Md.Keb.',
    nik: '9999000000000004',
    nomorStr: '1302521987654321',
    jenisKelamin: 'perempuan',
    profesi: 'Bidan',
    kompetensi: 'Pelayanan kesehatan ibu dan anak',
    statusSip: 'Menunggu verifikasi',
    jumlahSip: 1,
    unitPoli: 'Poli KIA',
    fasilitas: 'Klinik Taramedika',
    status: 'aktif',
    isSynced: false,
    isTestData: false,
  },
  {
    id: 'sdmk-9',
    kodeSdmk: 'SDMK-0228',
    nama: 'Bagus Hidayat, A.Md.AK.',
    nik: '9999000000000006',
    nomorStr: '1314511234987654',
    jenisKelamin: 'laki_laki',
    profesi: 'Ahli Teknologi Laboratorium Medik',
    kompetensi: 'Pelayanan laboratorium klinik',
    statusSip: 'Menunggu verifikasi',
    jumlahSip: 1,
    unitPoli: 'Laboratorium',
    fasilitas: 'Klinik Taramedika',
    status: 'aktif',
    isSynced: false,
    isTestData: false,
  },
  {
    id: 'sdmk-10',
    kodeSdmk: 'SDMK-0232',
    nama: 'Dewi Anggraini, S.KM.',
    nik: '9999000000000010',
    jenisKelamin: 'perempuan',
    profesi: 'Staf Rekam Medis',
    kompetensi: 'Manajemen informasi kesehatan',
    statusSip: 'Menunggu verifikasi',
    jumlahSip: 0,
    unitPoli: 'Poli Umum',
    fasilitas: 'Klinik Taramedika',
    status: 'aktif',
    isSynced: false,
    isTestData: false,
  },
];

function getInitials(fullName: string): string {
  const cleaned = fullName
    .replace(/^(drg\.|dr\.|apt\.|ns\.|bdn\.)\s+/i, '')
    .split(',')[0]
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'SD';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default function DaftarSdmkKlinik({
  initialRoster = DEFAULT_SDMK_ROSTER,
  onSaveSdmk,
  onDeleteInactiveSdmk,
}: {
  initialRoster?: SdmkRosterItem[];
  onSaveSdmk?: (item: SdmkRosterItem) => void;
  onDeleteInactiveSdmk?: (deletedIds: string[]) => void;
}) {
  const [roster, setRoster] = useState<SdmkRosterItem[]>(initialRoster);

  // Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [profesiFilter, setProfesiFilter] = useState('ALL');
  const [kompetensiFilter, setKompetensiFilter] = useState('ALL');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SdmkStatusKey>(
    'ALL',
  );
  const [sipFilter, setSipFilter] = useState<'ALL' | SipVerificationStatusKey>(
    'ALL',
  );

  // Pagination & Seleksi Baris
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dropdown Aksi Lainnya & Feedback Banner
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Modal Detail, Edit, dan Tambah SDMK
  const [viewingSdmk, setViewingSdmk] = useState<SdmkRosterItem | null>(null);
  const [editingSdmk, setEditingSdmk] = useState<SdmkRosterItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State Form Tambah SDMK Baru
  const [newNama, setNewNama] = useState('');
  const [newNik, setNewNik] = useState('');
  const [newGender, setNewGender] = useState<SdmkGenderKey>('laki_laki');
  const [newProfesi, setNewProfesi] = useState('Dokter Umum');
  const [newKompetensi, setNewKompetensi] = useState('Pelayanan medis umum');
  const [newUnitPoli, setNewUnitPoli] = useState('Poli Umum');
  const [newNomorStr, setNewNomorStr] = useState('');

  // Ringkasan KPI Dinamis
  const kpiStats = useMemo(() => {
    const total = roster.length;
    const lakiLaki = roster.filter(
      (r) => r.jenisKelamin === 'laki_laki',
    ).length;
    const perempuan = roster.filter(
      (r) => r.jenisKelamin === 'perempuan',
    ).length;
    const belumDiketahui = roster.filter(
      (r) => r.jenisKelamin === 'belum_diketahui',
    ).length;

    const aktif = roster.filter((r) => r.status === 'aktif').length;
    const tidakAktif = roster.filter((r) => r.status === 'tidak_aktif').length;
    const segeraBerakhir = roster.filter(
      (r) => r.statusSip === 'Segera berakhir',
    ).length;
    const kedaluwarsa = roster.filter(
      (r) => r.statusSip === 'Kedaluwarsa',
    ).length;
    const belumTersinkron = roster.filter((r) => !r.isSynced).length;

    return {
      total,
      lakiLaki,
      perempuan,
      belumDiketahui,
      aktif,
      tidakAktif,
      segeraBerakhir,
      kedaluwarsa,
      belumTersinkron,
    };
  }, [roster]);

  // Opsi unik untuk dropdown filter
  const uniqueProfesiOptions = useMemo(
    () => Array.from(new Set(roster.map((r) => r.profesi))),
    [roster],
  );
  const uniqueKompetensiOptions = useMemo(
    () => Array.from(new Set(roster.map((r) => r.kompetensi))),
    [roster],
  );
  const uniqueUnitOptions = useMemo(
    () => Array.from(new Set(roster.map((r) => r.unitPoli))),
    [roster],
  );

  // Filter data roster
  const filteredRoster = useMemo(() => {
    return roster.filter((item) => {
      if (profesiFilter !== 'ALL' && item.profesi !== profesiFilter) {
        return false;
      }
      if (kompetensiFilter !== 'ALL' && item.kompetensi !== kompetensiFilter) {
        return false;
      }
      if (unitFilter !== 'ALL' && item.unitPoli !== unitFilter) {
        return false;
      }
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }
      if (sipFilter !== 'ALL' && item.statusSip !== sipFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.nama.toLowerCase().includes(q) ||
          item.kodeSdmk.toLowerCase().includes(q) ||
          item.nik.toLowerCase().includes(q) ||
          (item.nomorStr ?? '').toLowerCase().includes(q) ||
          (item.nomorIhs ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [
    roster,
    profesiFilter,
    kompetensiFilter,
    unitFilter,
    statusFilter,
    sipFilter,
    searchQuery,
  ]);

  // Pagination
  const totalFiltered = filteredRoster.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedRoster = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredRoster.slice(startIdx, startIdx + pageSize);
  }, [filteredRoster, safePage, pageSize]);

  const startNumber = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalFiltered);

  const isAllCurrentPageSelected =
    paginatedRoster.length > 0 &&
    paginatedRoster.every((item) => selectedIds.includes(item.id));

  const inactiveCount = kpiStats.tidakAktif;
  const hasSelection = selectedIds.length > 0;

  const showTransientNotice = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setProfesiFilter('ALL');
    setKompetensiFilter('ALL');
    setUnitFilter('ALL');
    setStatusFilter('ALL');
    setSipFilter('ALL');
    setCurrentPage(1);
  };

  const handleToggleSelectAllPage = () => {
    const pageIds = paginatedRoster.map((item) => item.id);
    if (isAllCurrentPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Aksi Batch / Utilitas Roster
  const handleScanTestData = () => {
    const detectedIds = roster
      .filter((item) => item.isTestData || item.nik.startsWith('9999'))
      .map((item) => item.id);

    setSelectedIds(detectedIds);
    showTransientNotice(
      detectedIds.length > 0
        ? `Pemindaian selesai: ${detectedIds.length} kandidat data uji dipilih.`
        : 'Pemindaian selesai: tidak ditemukan pola data uji.',
    );
  };

  const handleMarkTestData = (mark: boolean) => {
    if (!hasSelection) return;
    setRoster((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, isTestData: mark } : item,
      ),
    );
    showTransientNotice(
      mark
        ? `${selectedIds.length} SDMK ditandai sebagai data uji.`
        : `Penanda data uji dihapus dari ${selectedIds.length} SDMK.`,
    );
  };

  const handleDeleteInactivePermanent = () => {
    if (inactiveCount === 0) return;
    const inactiveIds = roster
      .filter((r) => r.status === 'tidak_aktif')
      .map((r) => r.id);

    setRoster((prev) => prev.filter((r) => r.status !== 'tidak_aktif'));
    setSelectedIds((prev) => prev.filter((id) => !inactiveIds.includes(id)));
    onDeleteInactiveSdmk?.(inactiveIds);
    showTransientNotice(
      `${inactiveIds.length} SDMK tidak aktif berhasil dihapus permanen.`,
    );
  };

  const handleRetryPendingFiles = () => {
    showTransientNotice(
      'Pemeriksaan berkas tertunda selesai: tidak ada unggahan dokumen yang gagal.',
    );
  };

  const handleExportCsv = () => {
    const header =
      'kode_sdmk,nama,nik,profesi,kompetensi,status_sip,jumlah_sip,unit_poli,status';
    const rows = filteredRoster.map(
      (r) =>
        `${r.kodeSdmk},"${r.nama.replace(/"/g, '""')}",${r.nik},"${r.profesi}","${r.kompetensi}","${r.statusSip}",${r.jumlahSip},"${r.unitPoli}",${r.status}`,
    );
    const blob = new Blob([[header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'roster-sdmk-klinik.csv';
    link.click();
    URL.revokeObjectURL(url);
    setIsMoreMenuOpen(false);
  };

  const handleCreateSdmkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim() || !newNik.trim()) return;

    const nextNumber = String(223 + roster.length).padStart(4, '0');
    const created: SdmkRosterItem = {
      id: `sdmk-${Date.now()}`,
      kodeSdmk: `SDMK-${nextNumber}`,
      nama: newNama.trim(),
      nik: newNik.trim(),
      nomorStr: newNomorStr.trim() || undefined,
      jenisKelamin: newGender,
      profesi: newProfesi.trim() || 'Dokter Umum',
      kompetensi: newKompetensi.trim() || 'Pelayanan medis umum',
      statusSip: newNomorStr.trim() ? 'Valid' : 'Menunggu verifikasi',
      jumlahSip: newNomorStr.trim() ? 1 : 0,
      unitPoli: newUnitPoli.trim() || 'Poli Umum',
      fasilitas: 'Klinik Taramedika',
      status: 'aktif',
      isSynced: false,
      isTestData: false,
    };

    setRoster((prev) => [created, ...prev]);
    onSaveSdmk?.(created);
    setIsCreateModalOpen(false);
    setNewNama('');
    setNewNik('');
    setNewNomorStr('');
    showTransientNotice(`SDMK baru (${created.nama}) berhasil ditambahkan.`);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. GRID 6 KARTU RINGKASAN KPI SDMK (2 BARIS × 3 KOLOM)
         ===================================================================== */}
      <section
        aria-label="Ringkasan Statistik SDMK"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5"
      >
        {/* Kartu 1: Total SDMK */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 flex flex-col justify-between min-h-[138px]">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xs sm:text-[13px] font-bold text-[#0f3d56]">
              Total SDMK
            </h2>
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 text-[#008ba6] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-2xl sm:text-[26px] font-extrabold text-[#0f3d56] leading-tight tabular-nums">
              {kpiStats.total}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Seluruh tenaga terdaftar
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="text-slate-400">♂</span>
              <span>Laki-laki</span>
              <strong className="font-bold text-[#0f3d56] tabular-nums">
                {kpiStats.lakiLaki}
              </strong>
            </span>

            <span className="inline-flex items-center gap-1">
              <span className="text-slate-400">♀</span>
              <span>Perempuan</span>
              <strong className="font-bold text-[#0f3d56] tabular-nums">
                {kpiStats.perempuan}
              </strong>
            </span>

            <span className="inline-flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 text-[9px] inline-flex items-center justify-center text-slate-400">
                ?
              </span>
              <span>Belum diketahui</span>
              <strong className="font-bold text-[#0f3d56] tabular-nums">
                {kpiStats.belumDiketahui}
              </strong>
            </span>
          </div>
        </div>

        {/* Kartu 2: SDMK Aktif */}
        <div className="relative overflow-hidden bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 flex flex-col justify-between min-h-[138px]">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xs sm:text-[13px] font-bold text-[#0f3d56]">
              SDMK Aktif
            </h2>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-2xl sm:text-[26px] font-extrabold text-[#0f3d56] leading-tight tabular-nums">
              {kpiStats.aktif}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tenaga berstatus aktif
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-7 -right-7 w-24 h-24 rounded-full bg-emerald-50/60"
          />
        </div>

        {/* Kartu 3: SDMK Tidak Aktif */}
        <div className="relative overflow-hidden bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 flex flex-col justify-between min-h-[138px]">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xs sm:text-[13px] font-bold text-[#0f3d56]">
              SDMK Tidak Aktif
            </h2>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/70 text-slate-500 flex items-center justify-center shrink-0">
              <UserX className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-2xl sm:text-[26px] font-extrabold text-[#0f3d56] leading-tight tabular-nums">
              {kpiStats.tidakAktif}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tenaga berstatus tidak aktif
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-7 -right-7 w-24 h-24 rounded-full bg-slate-100/80"
          />
        </div>

        {/* Kartu 4: Izin segera berakhir */}
        <div className="relative overflow-hidden bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 flex flex-col justify-between min-h-[138px]">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xs sm:text-[13px] font-bold text-[#0f3d56]">
              Izin segera berakhir
            </h2>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-2xl sm:text-[26px] font-extrabold text-[#0f3d56] leading-tight tabular-nums">
              {kpiStats.segeraBerakhir}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Izin mendekati tanggal akhir
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-7 -right-7 w-24 h-24 rounded-full bg-slate-100/75"
          />
        </div>

        {/* Kartu 5: Izin kedaluwarsa */}
        <div className="relative overflow-hidden bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 flex flex-col justify-between min-h-[138px]">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xs sm:text-[13px] font-bold text-[#0f3d56]">
              Izin kedaluwarsa
            </h2>
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-2xl sm:text-[26px] font-extrabold text-[#0f3d56] leading-tight tabular-nums">
              {kpiStats.kedaluwarsa}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Izin melewati tanggal akhir
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-7 -right-7 w-24 h-24 rounded-full bg-slate-100/75"
          />
        </div>

        {/* Kartu 6: Belum tersinkron */}
        <div className="relative overflow-hidden bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 flex flex-col justify-between min-h-[138px]">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xs sm:text-[13px] font-bold text-[#0f3d56]">
              Belum tersinkron
            </h2>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-2xl sm:text-[26px] font-extrabold text-[#0f3d56] leading-tight tabular-nums">
              {kpiStats.belumTersinkron}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Menunggu sinkronisasi
            </p>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-7 -right-7 w-24 h-24 rounded-full bg-emerald-50/60"
          />
        </div>
      </section>

      {/* =====================================================================
          2. KARTU UTAMA: ROSTER KLINIK — DAFTAR SDMK
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Header Kartu */}
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold text-slate-400">
              Roster Klinik
            </p>
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56] leading-snug">
              Daftar SDMK
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Identitas, registrasi, penempatan, dan status tenaga fasilitas.
            </p>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="text-right">
              <p className="text-xs font-extrabold text-[#0f3d56] tabular-nums">
                {kpiStats.total}
              </p>
              <p className="text-[11px] text-slate-400">SDMK Terdaftar</p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Aksi Lainnya</span>
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-30 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      setIsCreateModalOpen(true);
                    }}
                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-[#0f3d56] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#008ba6]" />
                    <span>Tambah SDMK Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ekspor Roster CSV</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bar Pencarian + Reset Filter */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari Nama, NIK, STR, SIP, atau Nomor IHS..."
              className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Bar 5 Dropdown Filter */}
        <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Profesi */}
          <div>
            <label
              htmlFor="filter-sdmk-profesi"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Profesi
            </label>
            <div className="relative">
              <select
                id="filter-sdmk-profesi"
                value={profesiFilter}
                onChange={(e) => {
                  setProfesiFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Profesi</option>
                {uniqueProfesiOptions.map((prof) => (
                  <option key={prof} value={prof}>
                    {prof}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Kompetensi */}
          <div>
            <label
              htmlFor="filter-sdmk-kompetensi"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Kompetensi
            </label>
            <div className="relative">
              <select
                id="filter-sdmk-kompetensi"
                value={kompetensiFilter}
                onChange={(e) => {
                  setKompetensiFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Kompetensi</option>
                {uniqueKompetensiOptions.map((komp) => (
                  <option key={komp} value={komp}>
                    {komp}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Unit */}
          <div>
            <label
              htmlFor="filter-sdmk-unit"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Unit
            </label>
            <div className="relative">
              <select
                id="filter-sdmk-unit"
                value={unitFilter}
                onChange={(e) => {
                  setUnitFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Unit</option>
                {uniqueUnitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="filter-sdmk-status"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="filter-sdmk-status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'ALL' | SdmkStatusKey);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="tidak_aktif">Tidak Aktif</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status SIP */}
          <div>
            <label
              htmlFor="filter-sdmk-sip"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Status SIP
            </label>
            <div className="relative">
              <select
                id="filter-sdmk-sip"
                value={sipFilter}
                onChange={(e) => {
                  setSipFilter(
                    e.target.value as 'ALL' | SipVerificationStatusKey,
                  );
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua SIP</option>
                <option value="Valid">Valid</option>
                <option value="Menunggu verifikasi">Menunggu verifikasi</option>
                <option value="Segera berakhir">Segera berakhir</option>
                <option value="Kedaluwarsa">Kedaluwarsa</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bar Pilihan & Tombol Aksi Massal / Utilitas */}
        <div className="px-5 py-3.5 border-t border-slate-200/80 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f3d56]">
              <ShieldCheck className="w-4 h-4 text-[#008ba6]" />
              <span>{selectedIds.length} SDMK dipilih</span>
            </div>

            {actionFeedback && (
              <span className="text-[11px] font-semibold text-[#008ba6] bg-[#f0f9fb] border border-cyan-200/80 px-2.5 py-0.5 rounded-full">
                {actionFeedback}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleDeleteInactivePermanent}
              disabled={inactiveCount === 0}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border font-bold transition-colors ${
                inactiveCount > 0
                  ? 'border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-600 cursor-pointer'
                  : 'border-rose-100 bg-rose-50/30 text-rose-300 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Permanen SDMK Tidak Aktif</span>
            </button>

            <button
              type="button"
              onClick={handleScanTestData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
            >
              <ScanSearch className="w-3.5 h-3.5 text-slate-600" />
              <span>Pindai Data Uji</span>
            </button>

            <button
              type="button"
              onClick={() => handleMarkTestData(true)}
              disabled={!hasSelection}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border font-bold transition-colors ${
                hasSelection
                  ? 'border-slate-200 bg-white hover:bg-slate-50 text-[#0f3d56] cursor-pointer'
                  : 'border-slate-100 bg-slate-50/40 text-slate-300 cursor-not-allowed'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Tandai Data Uji</span>
            </button>

            <button
              type="button"
              onClick={() => handleMarkTestData(false)}
              disabled={!hasSelection}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border font-bold transition-colors ${
                hasSelection
                  ? 'border-slate-200 bg-white hover:bg-slate-50 text-[#0f3d56] cursor-pointer'
                  : 'border-slate-100 bg-slate-50/40 text-slate-300 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Penanda Data Uji</span>
            </button>

            <button
              type="button"
              onClick={handleRetryPendingFiles}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
            >
              <ScanSearch className="w-3.5 h-3.5 text-slate-600" />
              <span>Coba Ulang File Tertunda</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              disabled={!hasSelection}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border font-bold transition-colors ${
                hasSelection
                  ? 'border-slate-200 bg-white hover:bg-slate-50 text-[#0f3d56] cursor-pointer'
                  : 'border-slate-100 bg-slate-50/40 text-slate-300 cursor-not-allowed'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Batalkan Pilihan</span>
            </button>
          </div>
        </div>

        {/* Tabel Daftar SDMK */}
        <div className="overflow-x-auto border-t border-slate-200/80">
          <table className="w-full text-left border-collapse min-w-[920px]">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
              <tr>
                <th className="pl-5 pr-2 py-3.5 w-10">
                  <input
                    type="checkbox"
                    aria-label="Pilih semua SDMK di halaman ini"
                    checked={isAllCurrentPageSelected}
                    onChange={handleToggleSelectAllPage}
                    className="w-4 h-4 rounded border-slate-300 text-[#009bb8] focus:ring-[#009bb8]/25 cursor-pointer"
                  />
                </th>
                <th className="px-3 py-3.5">SDMK</th>
                <th className="px-4 py-3.5">Profesi / Kompetensi</th>
                <th className="px-4 py-3.5">STR / SIP</th>
                <th className="px-4 py-3.5">Unit / Poli</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 text-xs">
              {paginatedRoster.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 px-5 text-center text-slate-400"
                  >
                    Tidak ada data SDMK yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedRoster.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  const initials = getInitials(item.nama);

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isChecked ? 'bg-[#f0f9fb]/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="pl-5 pr-2 py-4 align-middle">
                        <input
                          type="checkbox"
                          aria-label={`Pilih ${item.nama}`}
                          checked={isChecked}
                          onChange={() => handleToggleRow(item.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#009bb8] focus:ring-[#009bb8]/25 cursor-pointer"
                        />
                      </td>

                      {/* SDMK (Avatar Inisial + Nama + Kode · NIK) */}
                      <td className="px-3 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#eef8f7] border border-teal-200/70 text-[#0f3d56] text-xs font-extrabold flex items-center justify-center shrink-0">
                            {initials}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[#0f3d56]">
                                {item.nama}
                              </p>
                              {item.isTestData && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700">
                                  Data Uji
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                              {item.kodeSdmk} · NIK {item.nik}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Profesi / Kompetensi */}
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        <p className="font-bold text-[#0f3d56]">
                          {item.profesi}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.kompetensi}
                        </p>
                      </td>

                      {/* STR / SIP */}
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        {item.statusSip === 'Valid' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Valid</span>
                          </span>
                        ) : item.statusSip === 'Menunggu verifikasi' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200/80 text-[11px] font-semibold text-sky-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            <span>Menunggu verifikasi</span>
                          </span>
                        ) : item.statusSip === 'Segera berakhir' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Segera berakhir</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-[11px] font-semibold text-rose-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Kedaluwarsa</span>
                          </span>
                        )}

                        <p className="text-[11px] text-slate-400 mt-1">
                          {item.jumlahSip} SIP tercatat
                        </p>
                      </td>

                      {/* Unit / Poli */}
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        <p className="font-bold text-[#0f3d56]">
                          {item.unitPoli}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.fasilitas}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        {item.status === 'aktif' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Tidak Aktif</span>
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-4 align-middle text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingSdmk(item)}
                            aria-label={`Lihat detail ${item.nama}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#008ba6] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingSdmk(item)}
                            aria-label={`Edit ${item.nama}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#008ba6] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
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
                {startNumber}–{endNumber}
              </strong>{' '}
              dari{' '}
              <strong className="font-semibold text-slate-700">
                {totalFiltered}
              </strong>{' '}
              SDMK
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="per-halaman-sdmk">Per Halaman</label>
              <div className="relative">
                <select
                  id="per-halaman-sdmk"
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

      {/* =====================================================================
          3. CATATAN KAKI INTEGRASI LOKAL
         ===================================================================== */}
      <footer className="px-1 flex items-center gap-2 text-xs text-slate-400">
        <Users className="w-3.5 h-3.5 shrink-0" />
        <span>
          Integrasi SATUSEHAT, BPJS, dan FHIR belum dikonfigurasi. Data roster
          ini tetap menjadi catatan lokal.
        </span>
      </footer>

      {/* =====================================================================
          4. MODAL DETAIL SDMK
         ===================================================================== */}
      {viewingSdmk && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {viewingSdmk.kodeSdmk} · {viewingSdmk.fasilitas}
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Detail Profil SDMK
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingSdmk(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#eef8f7] border border-teal-200/70 text-[#0f3d56] text-sm font-extrabold flex items-center justify-center">
                  {getInitials(viewingSdmk.nama)}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0f3d56]">
                    {viewingSdmk.nama}
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    {viewingSdmk.profesi} — {viewingSdmk.kompetensi}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div>
                  <p className="text-[11px] text-slate-400">NIK</p>
                  <p className="font-mono font-bold text-[#0f3d56] mt-0.5">
                    {viewingSdmk.nik}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Unit Penempatan</p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {viewingSdmk.unitPoli}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Status STR / SIP</p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {viewingSdmk.statusSip} ({viewingSdmk.jumlahSip} SIP)
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Nomor STR</p>
                  <p className="font-mono font-semibold text-slate-700 mt-0.5">
                    {viewingSdmk.nomorStr || '—'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingSdmk;
                    setViewingSdmk(null);
                    setEditingSdmk(target);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] cursor-pointer"
                >
                  Edit Data
                </button>
                <button
                  type="button"
                  onClick={() => setViewingSdmk(null)}
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. MODAL EDIT SDMK
         ===================================================================== */}
      {editingSdmk && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingSdmk.kodeSdmk}
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Data SDMK
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingSdmk(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRoster((prev) =>
                  prev.map((item) =>
                    item.id === editingSdmk.id ? editingSdmk : item,
                  ),
                );
                onSaveSdmk?.(editingSdmk);
                setEditingSdmk(null);
                showTransientNotice(
                  `Perubahan data ${editingSdmk.nama} disimpan.`,
                );
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  required
                  value={editingSdmk.nama}
                  onChange={(e) =>
                    setEditingSdmk({ ...editingSdmk, nama: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Profesi
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSdmk.profesi}
                    onChange={(e) =>
                      setEditingSdmk({
                        ...editingSdmk,
                        profesi: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unit / Poli
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSdmk.unitPoli}
                    onChange={(e) =>
                      setEditingSdmk({
                        ...editingSdmk,
                        unitPoli: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status STR / SIP
                  </label>
                  <select
                    value={editingSdmk.statusSip}
                    onChange={(e) =>
                      setEditingSdmk({
                        ...editingSdmk,
                        statusSip: e.target.value as SipVerificationStatusKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Valid">Valid</option>
                    <option value="Menunggu verifikasi">
                      Menunggu verifikasi
                    </option>
                    <option value="Segera berakhir">Segera berakhir</option>
                    <option value="Kedaluwarsa">Kedaluwarsa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status Keaktifan
                  </label>
                  <select
                    value={editingSdmk.status}
                    onChange={(e) =>
                      setEditingSdmk({
                        ...editingSdmk,
                        status: e.target.value as SdmkStatusKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSdmk(null)}
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
          6. MODAL TAMBAH SDMK BARU
         ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  ROSTER KLINIK
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Tambah SDMK Baru
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateSdmkSubmit}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  required
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  placeholder="Contoh: dr. Ahmad Fauzi"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIK (16 Digit)
                  </label>
                  <input
                    type="text"
                    required
                    value={newNik}
                    onChange={(e) => setNewNik(e.target.value)}
                    placeholder="327401..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) =>
                      setNewGender(e.target.value as SdmkGenderKey)
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="laki_laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
                    <option value="belum_diketahui">Belum diketahui</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Profesi
                  </label>
                  <input
                    type="text"
                    required
                    value={newProfesi}
                    onChange={(e) => setNewProfesi(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unit / Poli
                  </label>
                  <input
                    type="text"
                    required
                    value={newUnitPoli}
                    onChange={(e) => setNewUnitPoli(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kompetensi
                  </label>
                  <input
                    type="text"
                    value={newKompetensi}
                    onChange={(e) => setNewKompetensi(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor STR (Opsional)
                  </label>
                  <input
                    type="text"
                    value={newNomorStr}
                    onChange={(e) => setNewNomorStr(e.target.value)}
                    placeholder="Nomor STR aktif"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan SDMK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}