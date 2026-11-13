'use client';

import React, { useMemo, useState } from 'react';
import {
  FileText,
  Search,
  ChevronDown,
  X,
  Building2,
  User,
  Calendar,
  Stethoscope,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import {
  STATUS_BADGE,
  type ReferralItem,
  type ReferralStatus,
  type ReferralTabComponentProps,
} from './TabRujukan';

export default function RiwayatRujukan({
  data = [],
}: ReferralTabComponentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus>('all');
  const [selectedReferral, setSelectedReferral] = useState<ReferralItem | null>(
    null,
  );

  const filteredReferrals = useMemo(() => {
    return data.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.nomorRujukan.toLowerCase().includes(q) ||
          item.namaPasien.toLowerCase().includes(q) ||
          item.nomorRM.toLowerCase().includes(q) ||
          item.fasilitasPerujuk.toLowerCase().includes(q) ||
          item.fasilitasTujuan.toLowerCase().includes(q) ||
          item.diagnosis.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [data, statusFilter, searchQuery]);

  return (
    <>
      {/* Card Utama: Filter & Tabel */}
      <section className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#008ba6]" />
            <h2 className="text-sm font-bold text-[#0f3d56]">
              Riwayat Rujukan
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {filteredReferrals.length} data
          </span>
        </div>

        {/* Baris Pencarian & Filter Status */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor rujukan, nama pasien, nomor RM, atau tujuan rujukan..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <label
              htmlFor="riwayat-rujukan-status-filter"
              className="text-xs text-slate-500 font-medium"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="riwayat-rujukan-status-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ReferralStatus)
                }
                className="appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="diterima">Diterima</option>
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Empty State atau Tabel */}
        {filteredReferrals.length === 0 ? (
          <div className="mt-4 rounded-lg bg-[#f8fafc] border border-slate-200/80 py-9 px-4 text-center">
            <p className="text-xs text-slate-500">
              Tidak ada data yang cocok dengan pencarian atau filter.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600 border-collapse min-w-[780px]">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">No. Rujukan</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Pasien</th>
                  <th className="px-4 py-3">Tujuan Rujukan</th>
                  <th className="px-4 py-3">Diagnosis</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReferrals.map((item) => {
                  const isSelected = selectedReferral?.id === item.id;
                  const badge = STATUS_BADGE[item.status];

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedReferral(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-50/60' : 'hover:bg-slate-50/90'
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {item.nomorRujukan}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            item.tipe === 'masuk'
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {item.tipe === 'masuk' ? (
                            <>
                              <ArrowDownLeft className="w-3 h-3" /> Masuk
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="w-3 h-3" /> Keluar
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">
                          {item.namaPasien}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {item.nomorRM}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.tipe === 'masuk'
                          ? item.fasilitasPerujuk
                          : item.fasilitasTujuan}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.diagnosis}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {item.tanggalRujukan}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Panel Bawah: Detail & Riwayat */}
      <section className="mt-4 bg-white rounded-xl border border-slate-200/90 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        {!selectedReferral ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-[#fafcfd] py-9 px-4 flex flex-col items-center justify-center text-center">
            <FileText className="w-7 h-7 text-slate-400 mb-2.5 stroke-[1.5]" />
            <p className="text-xs font-bold text-slate-800">
              Pilih catatan untuk melihat detail, status, dan riwayat.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Klik salah satu rujukan pada tabel untuk menampilkan informasi
              lengkap, tahapan, dan riwayat rujukan.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#008ba6]">
                    {selectedReferral.nomorRujukan}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      STATUS_BADGE[selectedReferral.status].className
                    }`}
                  >
                    {STATUS_BADGE[selectedReferral.status].label}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-1">
                  {selectedReferral.namaPasien}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    ({selectedReferral.nomorRM})
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReferral(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Tutup detail"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Fasilitas Perujuk</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {selectedReferral.fasilitasPerujuk}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Tujuan Rujukan</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {selectedReferral.fasilitasTujuan}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Stethoscope className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Diagnosis</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {selectedReferral.diagnosis}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Tanggal Rujukan</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {selectedReferral.tanggalRujukan}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}