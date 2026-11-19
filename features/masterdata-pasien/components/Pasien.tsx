'use client';

import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  FileText,
  Pencil,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
} from 'lucide-react';

export type PatientGenderKey = 'Perempuan' | 'Laki-laki';
export type PatientStatusKey = 'aktif' | 'tidak_aktif';
export type PatientAgeRangeKey = 'ALL' | 'anak' | 'dewasa' | 'lansia';
export type PatientSortKey =
  | 'terbaru'
  | 'terlama'
  | 'nama_asc'
  | 'nama_desc'
  | 'no_rm';

export interface PatientMasterItem {
  id: string;
  nama: string;
  noRm: string;
  nik: string;
  jenisKelamin: PatientGenderKey;
  tanggalLahir: string;
  usia: number;
  telepon: string;
  alamat: string;
  status: PatientStatusKey;
  isNewThisMonth?: boolean;
  createdOrder: number;
}

const DEFAULT_PATIENT_LIST: PatientMasterItem[] = [
  {
    id: 'pas-2',
    nama: 'Suparni',
    noRm: 'RM00000002',
    nik: '1234567890123456',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '21 Feb 1987',
    usia: 39,
    telepon: '081511210060',
    alamat:
      'Jl. Brigjend Dharsono, Sunyaragi, Kec. Kesambi, Kota Cirebon, Jawa Barat...',
    status: 'aktif',
    isNewThisMonth: true,
    createdOrder: 2,
  },
  {
    id: 'pas-1',
    nama: 'Suparno',
    noRm: 'RM00000001',
    nik: '1351502011111496',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '19 Okt 1988',
    usia: 38,
    telepon: '081511210060',
    alamat:
      'Jl. Cangkring 2 Kel. Kejaksan, Kec. Kejaksan, Kota Cirebon, RT 001, RW...',
    status: 'aktif',
    isNewThisMonth: false,
    createdOrder: 1,
  },
];

export default function DaftarPasienMaster({
  initialPatients = DEFAULT_PATIENT_LIST,
  onUpdatePatient,
  onDeletePatient,
}: {
  initialPatients?: PatientMasterItem[];
  onUpdatePatient?: (patient: PatientMasterItem) => void;
  onDeletePatient?: (id: string) => void;
}) {
  const [patients, setPatients] =
    useState<PatientMasterItem[]>(initialPatients);

  // Filter, Urutkan & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PatientStatusKey>(
    'ALL',
  );
  const [genderFilter, setGenderFilter] = useState<'ALL' | PatientGenderKey>(
    'ALL',
  );
  const [ageRangeFilter, setAgeRangeFilter] =
    useState<PatientAgeRangeKey>('ALL');
  const [sortBy, setSortBy] = useState<PatientSortKey>('terbaru');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal Detail, Edit, dan Konfirmasi Hapus
  const [viewingPatient, setViewingPatient] =
    useState<PatientMasterItem | null>(null);
  const [editingPatient, setEditingPatient] =
    useState<PatientMasterItem | null>(null);
  const [deletingPatient, setDeletingPatient] =
    useState<PatientMasterItem | null>(null);

  // Ringkasan KPI Pasien
  const kpiStats = useMemo(() => {
    const total = patients.length;
    const aktif = patients.filter((p) => p.status === 'aktif').length;
    const baruBulanIni = patients.filter((p) => p.isNewThisMonth).length;
    const tidakAktif = patients.filter(
      (p) => p.status === 'tidak_aktif',
    ).length;

    return { total, aktif, baruBulanIni, tidakAktif };
  }, [patients]);

  // Filter & Pengurutan Daftar Pasien
  const processedPatients = useMemo(() => {
    const filtered = patients.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (genderFilter !== 'ALL' && item.jenisKelamin !== genderFilter) {
        return false;
      }

      if (ageRangeFilter !== 'ALL') {
        if (ageRangeFilter === 'anak' && item.usia >= 18) return false;
        if (
          ageRangeFilter === 'dewasa' &&
          (item.usia < 18 || item.usia >= 60)
        ) {
          return false;
        }
        if (ageRangeFilter === 'lansia' && item.usia < 60) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.nama.toLowerCase().includes(q) ||
          item.noRm.toLowerCase().includes(q) ||
          item.nik.toLowerCase().includes(q) ||
          item.telepon.toLowerCase().includes(q) ||
          item.alamat.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'terlama':
          return a.createdOrder - b.createdOrder;
        case 'nama_asc':
          return a.nama.localeCompare(b.nama, 'id');
        case 'nama_desc':
          return b.nama.localeCompare(a.nama, 'id');
        case 'no_rm':
          return a.noRm.localeCompare(b.noRm);
        case 'terbaru':
        default:
          return b.createdOrder - a.createdOrder;
      }
    });
  }, [
    patients,
    statusFilter,
    genderFilter,
    ageRangeFilter,
    searchQuery,
    sortBy,
  ]);

  // Pagination
  const totalItems = processedPatients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedPatients = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return processedPatients.slice(startIdx, startIdx + pageSize);
  }, [processedPatients, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  const handlePageSizeChange = (nextSize: number) => {
    setPageSize(nextSize);
    setCurrentPage(1);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. BARIS 4 KARTU RINGKASAN KPI PASIEN
         ===================================================================== */}
      <section
        aria-label="Ringkasan Data Pasien"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5"
      >
        {/* Total Pasien */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-5 py-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-sky-50 border border-sky-100 text-[#008ba6] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Total Pasien</p>
            <p className="text-2xl font-extrabold text-[#0f3d56] leading-tight mt-0.5 tabular-nums">
              {kpiStats.total}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Semua pasien</p>
          </div>
        </div>

        {/* Pasien Aktif */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-5 py-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Pasien Aktif</p>
            <p className="text-2xl font-extrabold text-[#0f3d56] leading-tight mt-0.5 tabular-nums">
              {kpiStats.aktif}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Status master aktif
            </p>
          </div>
        </div>

        {/* Pasien Baru Bulan Ini */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-5 py-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">
              Pasien Baru Bulan Ini
            </p>
            <p className="text-2xl font-extrabold text-[#0f3d56] leading-tight mt-0.5 tabular-nums">
              {kpiStats.baruBulanIni}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Terdaftar bulan ini
            </p>
          </div>
        </div>

        {/* Pasien Tidak Aktif */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-5 py-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">
              Pasien Tidak Aktif
            </p>
            <p className="text-2xl font-extrabold text-[#0f3d56] leading-tight mt-0.5 tabular-nums">
              {kpiStats.tidakAktif}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Status master tidak aktif
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. KARTU UTAMA: DAFTAR PASIEN
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
            Daftar Pasien
          </h1>

          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari Nama, No. RM, NIK, Telepon, atau Alamat..."
              className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
          </div>
        </div>

        {/* Bar 5 Filter Dropdown */}
        <div className="px-5 py-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Status */}
          <div>
            <label
              htmlFor="filter-pasien-status"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="filter-pasien-status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'ALL' | PatientStatusKey);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="tidak_aktif">Tidak Aktif</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label
              htmlFor="filter-pasien-gender"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Jenis Kelamin
            </label>
            <div className="relative">
              <select
                id="filter-pasien-gender"
                value={genderFilter}
                onChange={(e) => {
                  setGenderFilter(e.target.value as 'ALL' | PatientGenderKey);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Rentang Usia */}
          <div>
            <label
              htmlFor="filter-pasien-usia"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Rentang Usia
            </label>
            <div className="relative">
              <select
                id="filter-pasien-usia"
                value={ageRangeFilter}
                onChange={(e) => {
                  setAgeRangeFilter(e.target.value as PatientAgeRangeKey);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="ALL">Semua Usia</option>
                <option value="anak">Anak (&lt; 18 thn)</option>
                <option value="dewasa">Dewasa (18–59 thn)</option>
                <option value="lansia">Lansia (&ge; 60 thn)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Urutkan */}
          <div>
            <label
              htmlFor="filter-pasien-urutkan"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Urutkan
            </label>
            <div className="relative">
              <select
                id="filter-pasien-urutkan"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as PatientSortKey)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="nama_asc">Nama (A–Z)</option>
                <option value="nama_desc">Nama (Z–A)</option>
                <option value="no_rm">No. RM</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Tampilkan per Halaman */}
          <div>
            <label
              htmlFor="filter-pasien-per-halaman"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Tampilkan per Halaman
            </label>
            <div className="relative">
              <select
                id="filter-pasien-per-halaman"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-xs font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tabel Daftar Pasien */}
        <div className="overflow-x-auto border-t border-slate-200/80">
          <table className="w-full text-left border-collapse min-w-[1040px]">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
              <tr>
                <th className="pl-5 pr-3 py-3.5 w-14">No.</th>
                <th className="px-3 py-3.5">Nama Pasien</th>
                <th className="px-3 py-3.5">No. RM</th>
                <th className="px-3 py-3.5">NIK</th>
                <th className="px-3 py-3.5">Jenis Kelamin</th>
                <th className="px-3 py-3.5">Tanggal Lahir / Usia</th>
                <th className="px-3 py-3.5">Telepon</th>
                <th className="px-3 py-3.5">Alamat</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="pl-3 pr-5 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 text-xs">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-12 px-5 text-center text-slate-400"
                  >
                    Tidak ada data pasien yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient, idx) => {
                  const rowNumber = (safePage - 1) * pageSize + idx + 1;

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* No. */}
                      <td className="pl-5 pr-3 py-4 align-middle text-slate-500 tabular-nums whitespace-nowrap">
                        {rowNumber}
                      </td>

                      {/* Nama Pasien */}
                      <td className="px-3 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                        {patient.nama}
                      </td>

                      {/* No. RM */}
                      <td className="px-3 py-4 align-middle font-mono font-bold text-[#0f3d56] whitespace-nowrap">
                        {patient.noRm}
                      </td>

                      {/* NIK */}
                      <td className="px-3 py-4 align-middle font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{patient.nik}</span>
                        </span>
                      </td>

                      {/* Jenis Kelamin */}
                      <td className="px-3 py-4 align-middle whitespace-nowrap">
                        {patient.jenisKelamin === 'Perempuan' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/70 text-[11px] font-semibold text-rose-600">
                            Perempuan
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200/70 text-[11px] font-semibold text-sky-700">
                            Laki-laki
                          </span>
                        )}
                      </td>

                      {/* Tanggal Lahir / Usia */}
                      <td className="px-3 py-4 align-middle whitespace-nowrap">
                        <p className="font-bold text-[#0f3d56]">
                          {patient.tanggalLahir}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {patient.usia} thn
                        </p>
                      </td>

                      {/* Telepon */}
                      <td className="px-3 py-4 align-middle text-slate-600 tabular-nums whitespace-nowrap">
                        {patient.telepon}
                      </td>

                      {/* Alamat */}
                      <td className="px-3 py-4 align-middle text-slate-500 max-w-[230px]">
                        <p className="line-clamp-2 leading-relaxed">
                          {patient.alamat}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4 align-middle whitespace-nowrap">
                        {patient.status === 'aktif' ? (
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

                      {/* Tindakan */}
                      <td className="pl-3 pr-5 py-4 align-middle text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingPatient(patient)}
                            aria-label={`Lihat detail ${patient.nama}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#008ba6] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingPatient(patient)}
                            aria-label={`Edit ${patient.nama}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#008ba6] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingPatient(patient)}
                            aria-label={`Hapus ${patient.nama}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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
                {totalItems}
              </strong>{' '}
              Pasien
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="footer-per-halaman-pasien">Per Halaman</label>
              <div className="relative">
                <select
                  id="footer-per-halaman-pasien"
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
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
          3. MODAL DETAIL PASIEN
         ===================================================================== */}
      {viewingPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {viewingPatient.noRm}
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Detail Master Pasien
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingPatient(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div>
                  <p className="text-[11px] text-slate-400">Nama Lengkap</p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {viewingPatient.nama}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">NIK</p>
                  <p className="font-mono font-bold text-[#0f3d56] mt-0.5">
                    {viewingPatient.nik}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Jenis Kelamin</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {viewingPatient.jenisKelamin}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">
                    Tanggal Lahir / Usia
                  </p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {viewingPatient.tanggalLahir} ({viewingPatient.usia} thn)
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Nomor Telepon</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {viewingPatient.telepon}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Status Master</p>
                  <p className="font-semibold text-slate-700 mt-0.5 capitalize">
                    {viewingPatient.status === 'aktif'
                      ? 'Aktif'
                      : 'Tidak Aktif'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-1">
                  Alamat Domisili
                </p>
                <p className="p-3 rounded-xl border border-slate-200/80 text-slate-600 leading-relaxed">
                  {viewingPatient.alamat}
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingPatient;
                    setViewingPatient(null);
                    setEditingPatient(target);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] cursor-pointer"
                >
                  Edit Pasien
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPatient(null)}
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
          4. MODAL EDIT DATA PASIEN
         ===================================================================== */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingPatient.noRm}
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Data Pasien
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingPatient(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPatients((prev) =>
                  prev.map((item) =>
                    item.id === editingPatient.id ? editingPatient : item,
                  ),
                );
                onUpdatePatient?.(editingPatient);
                setEditingPatient(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Pasien
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPatient.nama}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        nama: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIK
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPatient.nik}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        nik: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={editingPatient.jenisKelamin}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        jenisKelamin: e.target.value as PatientGenderKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Telepon
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPatient.telepon}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        telepon: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingPatient.status}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        status: e.target.value as PatientStatusKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alamat
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingPatient.alamat}
                  onChange={(e) =>
                    setEditingPatient({
                      ...editingPatient,
                      alamat: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
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
          5. MODAL KONFIRMASI HAPUS PASIEN
         ===================================================================== */}
      {deletingPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#0f3d56]">
                Hapus Data Pasien
              </h2>
              <button
                type="button"
                onClick={() => setDeletingPatient(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus data pasien{' '}
                <strong className="font-bold text-[#0f3d56]">
                  {deletingPatient.nama}
                </strong>{' '}
                ({deletingPatient.noRm})? Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingPatient(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPatients((prev) =>
                      prev.filter((item) => item.id !== deletingPatient.id),
                    );
                    onDeletePatient?.(deletingPatient.id);
                    setDeletingPatient(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
                >
                  Ya, Hapus Pasien
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}