'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserX,
  X,
} from 'lucide-react';

export type StaffAccountStatusKey = 'aktif' | 'nonaktif';

export type StaffRoleKey =
  | 'Dokter'
  | 'Admin Sistem'
  | 'Petugas Pendaftaran'
  | 'Farmasi'
  | 'Pengelola Pembelian & Pengadaan'
  | 'Perawat'
  | 'Kasir & Billing';

export interface StaffAccountItem {
  id: string;
  initials: string;
  namaPegawai: string;
  usernameEmail: string;
  profesi: string;
  jabatan?: string;
  unitKerja?: string;
  role: StaffRoleKey;
  status: StaffAccountStatusKey;
}

const DEFAULT_STAFF_ACCOUNTS: StaffAccountItem[] = [
  {
    id: 'stf-1',
    initials: 'DA',
    namaPegawai: 'dr. Altharrazka Kenigara Rizfani',
    usernameEmail: 'althar@gmail.com',
    profesi: 'Dokter Umum',
    jabatan: 'Dokter',
    unitKerja: 'Poli Umum',
    role: 'Dokter',
    status: 'aktif',
  },
  {
    id: 'stf-2',
    initials: 'BS',
    namaPegawai: 'Budi Santoso S.Kom.',
    usernameEmail: 'budi@taramedic.id',
    profesi: 'Staf Pendaftaran',
    jabatan: undefined,
    unitKerja: undefined,
    role: 'Admin Sistem',
    status: 'aktif',
  },
  {
    id: 'stf-3',
    initials: 'DP',
    namaPegawai: 'Dimas Pratama A.Md.Farm.',
    usernameEmail: 'dimas.pendaftaran@taramedic.id',
    profesi: 'Tenaga Teknis Kefarmasian',
    jabatan: undefined,
    unitKerja: undefined,
    role: 'Petugas Pendaftaran',
    status: 'aktif',
  },
  {
    id: 'stf-4',
    initials: 'AO',
    namaPegawai: 'Apt. Opik Savalas',
    usernameEmail: 'opik@taramedic.id',
    profesi: 'Apoteker',
    jabatan: undefined,
    unitKerja: undefined,
    role: 'Farmasi',
    status: 'aktif',
  },
  {
    id: 'stf-5',
    initials: 'RM',
    namaPegawai: 'Rina Maharani S.Kep., Ns.',
    usernameEmail: 'rina.pengadaan@taramedic.id',
    profesi: 'Perawat',
    jabatan: undefined,
    unitKerja: undefined,
    role: 'Pengelola Pembelian & Pengadaan',
    status: 'aktif',
  },
  {
    id: 'stf-6',
    initials: 'SN',
    namaPegawai: 'Siti Nurhaliza A.Md.Keb.',
    usernameEmail: 'siti.kia@taramedic.id',
    profesi: 'Bidan',
    jabatan: 'Bidan Pelaksana',
    unitKerja: 'Poli KIA & KB',
    role: 'Perawat',
    status: 'aktif',
  },
  {
    id: 'stf-7',
    initials: 'AW',
    namaPegawai: 'Andi Wijaya S.E.',
    usernameEmail: 'andi.kasir@taramedic.id',
    profesi: 'Staf Administrasi & Keuangan',
    jabatan: 'Koordinator Kasir',
    unitKerja: 'Kasir & Billing',
    role: 'Kasir & Billing',
    status: 'aktif',
  },
  {
    id: 'stf-8',
    initials: 'DR',
    namaPegawai: 'drg. Ratna Kumalasari',
    usernameEmail: 'ratna.gigi@taramedic.id',
    profesi: 'Dokter Gigi',
    jabatan: 'Dokter Gigi',
    unitKerja: 'Poli Gigi',
    role: 'Dokter',
    status: 'aktif',
  },
];

const ROLE_OPTIONS: StaffRoleKey[] = [
  'Dokter',
  'Admin Sistem',
  'Petugas Pendaftaran',
  'Farmasi',
  'Pengelola Pembelian & Pengadaan',
  'Perawat',
  'Kasir & Billing',
];

const UNIT_KERJA_OPTIONS = [
  '',
  'Poli Umum',
  'Poli Gigi',
  'Poli KIA & KB',
  'Instalasi Farmasi',
  'Laboratorium',
  'Pendaftaran & Rekam Medis',
  'Kasir & Billing',
];

export default function DaftarAkunStaf({
  initialAccounts = DEFAULT_STAFF_ACCOUNTS,
  isSuperAdmin = true,
  onUpdateAccount,
}: {
  initialAccounts?: StaffAccountItem[];
  isSuperAdmin?: boolean;
  onUpdateAccount?: (account: StaffAccountItem) => void;
}) {
  const [accounts, setAccounts] = useState<StaffAccountItem[]>(initialAccounts);

  // Pencarian, Filter Status & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | StaffAccountStatusKey
  >('aktif');
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dropdown Aksi Baris & Modal Penetapan Peran / Penempatan
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<StaffAccountItem | null>(
    null,
  );

  // Tutup dropdown aksi saat klik di luar
  useEffect(() => {
    if (!openMenuId) return;
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [openMenuId]);

  // Filter Data Akun Staf
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      if (statusFilter !== 'ALL' && acc.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          acc.namaPegawai.toLowerCase().includes(q) ||
          acc.usernameEmail.toLowerCase().includes(q) ||
          acc.profesi.toLowerCase().includes(q) ||
          (acc.jabatan ?? '').toLowerCase().includes(q) ||
          (acc.unitKerja ?? '').toLowerCase().includes(q) ||
          acc.role.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [accounts, statusFilter, searchQuery]);

  // Pagination Calculation
  const totalItems = filteredAccounts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedAccounts = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredAccounts.slice(startIdx, startIdx + pageSize);
  }, [filteredAccounts, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  const handleToggleAccountStatus = (target: StaffAccountItem) => {
    const nextStatus: StaffAccountStatusKey =
      target.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: StaffAccountItem = { ...target, status: nextStatus };

    setAccounts((prev) =>
      prev.map((acc) => (acc.id === target.id ? updated : acc)),
    );
    onUpdateAccount?.(updated);
    setOpenMenuId(null);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. KARTU UTAMA DAFTAR AKUN STAF
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Header Kartu */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-slate-400">
              Akses Pegawai
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5">
              Daftar Akun Staf
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Identitas login, penempatan, peran, dan status akun.
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xl sm:text-2xl font-extrabold text-[#0f3d56] leading-none tabular-nums">
              {totalItems}
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">Akun Staf</p>
          </div>
        </div>

        {/* Bar Pencarian & Filter Status */}
        <div className="px-6 py-4 flex flex-wrap items-end justify-between gap-4 text-xs">
          {/* Search Input */}
          <div className="relative w-full sm:w-[370px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari Nama, Email, Profesi, atau Penempatan..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
          </div>

          {/* Filter Status */}
          <div className="w-full sm:w-44">
            <label
              htmlFor="filter-akun-staf-status"
              className="block text-[11px] font-bold text-[#0f3d56] mb-1.5"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="filter-akun-staf-status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(
                    e.target.value as 'ALL' | StaffAccountStatusKey,
                  );
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-8 py-2.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
              >
                <option value="aktif">Akun Aktif</option>
                <option value="nonaktif">Akun Nonaktif</option>
                <option value="ALL">Semua Status</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tabel Daftar Akun Staf */}
        <div className="overflow-x-auto border-t border-slate-200/80">
          <table className="w-full text-left border-collapse min-w-[940px]">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pl-6 pr-3 py-3.5 w-14">NO.</th>
                <th className="px-3 py-3.5">NAMA PEGAWAI</th>
                <th className="px-3 py-3.5">USERNAME / EMAIL</th>
                <th className="px-3 py-3.5">PROFESI / JABATAN</th>
                <th className="px-3 py-3.5">UNIT KERJA</th>
                <th className="px-3 py-3.5">ROLE</th>
                <th className="px-3 py-3.5">STATUS</th>
                <th className="pl-3 pr-6 py-3.5 text-right">AKSI</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 text-xs">
              {paginatedAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 px-6 text-center text-slate-400"
                  >
                    Tidak ada akun staf yang sesuai dengan pencarian atau filter
                    status.
                  </td>
                </tr>
              ) : (
                paginatedAccounts.map((acc, idx) => {
                  const rowNumber = (safePage - 1) * pageSize + idx + 1;
                  const isMenuOpen = openMenuId === acc.id;

                  return (
                    <tr
                      key={acc.id}
                      className="bg-white hover:bg-slate-50/80 transition-colors"
                    >
                      {/* NO. */}
                      <td className="pl-6 pr-3 py-4 align-middle text-slate-400 font-medium tabular-nums">
                        {rowNumber}
                      </td>

                      {/* NAMA PEGAWAI */}
                      <td className="px-3 py-4 align-middle">
                        <div className="flex items-center gap-3 min-w-0 max-w-[235px]">
                          <div className="w-9 h-9 rounded-full bg-[#e8f5f1] border border-emerald-200/60 text-[#0f3d56] text-xs font-extrabold flex items-center justify-center shrink-0">
                            {acc.initials}
                          </div>

                          <span
                            title={acc.namaPegawai}
                            className="font-bold text-[#0f3d56] truncate"
                          >
                            {acc.namaPegawai}
                          </span>
                        </div>
                      </td>

                      {/* USERNAME / EMAIL */}
                      <td className="px-3 py-4 align-middle text-slate-500 whitespace-nowrap">
                        {acc.usernameEmail}
                      </td>

                      {/* PROFESI / JABATAN */}
                      <td className="px-3 py-4 align-middle whitespace-nowrap">
                        <p className="font-bold text-[#0f3d56] leading-snug">
                          {acc.profesi}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {acc.jabatan || 'Jabatan belum diisi'}
                        </p>
                      </td>

                      {/* UNIT KERJA */}
                      <td className="px-3 py-4 align-middle whitespace-nowrap">
                        {acc.unitKerja ? (
                          <span className="font-bold text-[#0f3d56]">
                            {acc.unitKerja}
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-500">
                            Belum ada penempatan aktif
                          </span>
                        )}
                      </td>

                      {/* ROLE */}
                      <td className="px-3 py-4 align-middle whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#eef6fd] border border-sky-200/70 text-[11px] font-bold text-[#1d70b8]">
                          {acc.role}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-3 py-4 align-middle whitespace-nowrap">
                        {acc.status === 'aktif' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Nonaktif</span>
                          </span>
                        )}
                      </td>

                      {/* AKSI */}
                      <td
                        className="pl-3 pr-6 py-4 align-middle text-right whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(isMenuOpen ? null : acc.id)
                          }
                          aria-label={`Opsi akun ${acc.namaPegawai}`}
                          className="w-8 h-8 rounded-lg hover:bg-slate-100 inline-flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-6 top-12 z-30 w-52 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 text-xs text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAccount(acc);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 flex items-center gap-2 text-[#0f3d56] hover:bg-slate-50 font-semibold cursor-pointer"
                            >
                              <UserCog className="w-3.5 h-3.5 text-[#008ba6]" />
                              <span>Atur Peran &amp; Penempatan</span>
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              type="button"
                              onClick={() => handleToggleAccountStatus(acc)}
                              className={`w-full px-3.5 py-2 flex items-center gap-2 font-semibold cursor-pointer ${
                                acc.status === 'aktif'
                                  ? 'text-rose-600 hover:bg-rose-50/70'
                                  : 'text-emerald-700 hover:bg-emerald-50/70'
                              }`}
                            >
                              {acc.status === 'aktif' ? (
                                <>
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>Nonaktifkan Akun</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Aktifkan Akun</span>
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

        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          {/* Kiri: 1–5 dari 8 Akun Staf + Per Halaman */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="tabular-nums">
              <strong className="font-semibold text-slate-700">
                {startNumber}&ndash;{endNumber}
              </strong>{' '}
              dari{' '}
              <strong className="font-semibold text-slate-700">
                {totalItems}
              </strong>{' '}
              Akun Staf
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="per-halaman-akun-staf">Per Halaman</label>
              <div className="relative">
                <select
                  id="per-halaman-akun-staf"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Kanan: « < [1] [2] > » */}
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
          2. BANNER KEBIJAKAN HAK AKSES BAWAH
         ===================================================================== */}
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 px-4 py-3.5 flex items-center gap-2.5 text-xs text-[#0f3d56]">
        <ShieldCheck className="w-4 h-4 text-[#008ba6] shrink-0" />
        <p className="leading-relaxed">
          Hanya super-admin yang dapat menetapkan peran. Pegawai nonaktif tidak
          dapat masuk; hak akses diperiksa kembali setiap kali digunakan.
        </p>
      </div>

      {/* =====================================================================
          3. MODAL ATUR PERAN, JABATAN & PENEMPATAN UNIT KERJA
         ===================================================================== */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  AKSES PEGAWAI
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Atur Peran &amp; Penempatan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAccounts((prev) =>
                  prev.map((acc) =>
                    acc.id === editingAccount.id ? editingAccount : acc,
                  ),
                );
                onUpdateAccount?.(editingAccount);
                setEditingAccount(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#e8f5f1] text-[#0f3d56] font-extrabold flex items-center justify-center shrink-0">
                  {editingAccount.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#0f3d56] truncate">
                    {editingAccount.namaPegawai}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {editingAccount.usernameEmail}
                  </p>
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
                    value={editingAccount.profesi}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        profesi: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    value={editingAccount.jabatan ?? ''}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        jabatan: e.target.value || undefined,
                      })
                    }
                    placeholder="Jabatan belum diisi"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unit Kerja
                  </label>
                  <select
                    value={editingAccount.unitKerja ?? ''}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        unitKerja: e.target.value || undefined,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="">Belum ada penempatan aktif</option>
                    {UNIT_KERJA_OPTIONS.filter(Boolean).map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Role Sistem
                  </label>
                  <select
                    disabled={!isSuperAdmin}
                    value={editingAccount.role}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        role: e.target.value as StaffRoleKey,
                      })
                    }
                    className="w-full bg-white disabled:bg-slate-50 disabled:text-slate-400 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    {ROLE_OPTIONS.map((roleOpt) => (
                      <option key={roleOpt} value={roleOpt}>
                        {roleOpt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
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