'use client';

import React, { useState } from 'react';
import {
  Activity,
  User,
  FileText,
  Clock,
  CheckCircle2,
  Search,
  Calendar,
  ChevronDown,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Eye,
  Users,
} from 'lucide-react';

export interface MonitoringItem {
  id: string;
  nomorAntrean: string;
  namaPasien: string;
  nomorRM: string;
  nik: string;
  waktuAmbil: string;
  waktuPanggil?: string;
  poliTujuan?: string;
  dokter?: string;
  status: 'Belum Dibuat Kunjungan' | 'Menunggu' | 'Sedang Dilayani' | 'Selesai';
}

interface MonitoringProps {
  activeTab: 'data' | 'monitoring';
  onTabChange: (tab: 'data' | 'monitoring') => void;
}

export default function MonitoringKunjungan({
  activeTab,
  onTabChange,
}: MonitoringProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('2026-11-11');
  const [endDate, setEndDate] = useState('2026-11-11');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  const [transactions] = useState<MonitoringItem[]>([]);

  const filteredData = transactions.filter((item) => {
    const matchesSearch =
      item.namaPasien.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorRM.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorAntrean.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nik.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'Semua' ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRekam = transactions.length;
  const belumDibuat = transactions.filter(
    (t) => t.status === 'Belum Dibuat Kunjungan'
  ).length;
  const menungguCount = transactions.filter((t) => t.status === 'Menunggu').length;
  const sedangDilayaniCount = transactions.filter(
    (t) => t.status === 'Sedang Dilayani'
  ).length;
  const selesaiCount = transactions.filter((t) => t.status === 'Selesai').length;

  return (
    <div className="w-full h-full p-6 font-sans text-slate-700 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Monitoring Pendaftaran & Kunjungan
          </h1>
          <p className="text-xs text-slate-500">
            Pantau status dan perjalanan pelayanan pasien.
          </p>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="border-b border-slate-200 mb-6 flex gap-6">
        <button
          onClick={() => onTabChange('data')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'data'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" />
          Data Pasien
        </button>
        <button
          onClick={() => onTabChange('monitoring')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'monitoring'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Activity className="w-4 h-4" />
          Monitoring Pendaftaran & Kunjungan
        </button>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Semua Rekam</p>
            <p className="text-xl font-bold text-slate-800">{totalRekam}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">
              Belum Dibuat Kunjungan
            </p>
            <p className="text-xl font-bold text-slate-800">{belumDibuat}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Menunggu</p>
            <p className="text-xl font-bold text-slate-800">{menungguCount}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-lg shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Sedang Dilayani</p>
            <p className="text-xl font-bold text-slate-800">{sedangDilayaniCount}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Selesai</p>
            <p className="text-xl font-bold text-slate-800">{selesaiCount}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pasien, No. RM, kunjungan, atau antrean"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <span className="text-slate-400 mr-2">Dari</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="outline-none bg-transparent text-slate-700 cursor-pointer font-medium"
            />
          </div>

          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <span className="text-slate-400 mr-2">Sampai</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="outline-none bg-transparent text-slate-700 cursor-pointer font-medium"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="Semua">Semua status</option>
              <option value="Belum Dibuat Kunjungan">Belum Dibuat Kunjungan</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Sedang Dilayani">Sedang Dilayani</option>
              <option value="Selesai">Selesai</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content Body: Empty State / Table */}
      {filteredData.length === 0 ? (
        <div className="flex-1 min-h-[320px] flex flex-col items-center justify-center p-8 border border-slate-100 rounded-2xl bg-white text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            Tidak ada rekam pada filter ini
          </h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Ubah rentang tanggal, status, atau kata kunci untuk melihat transaksi.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto flex-1 flex flex-col justify-between">
          <table className="w-full text-left text-xs text-slate-600 border-collapse min-w-[750px]">
            <thead className="bg-slate-50/50 uppercase text-[11px] font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-4 py-3.5">No. Antrean</th>
                <th scope="col" className="px-4 py-3.5">Identitas Pasien</th>
                <th scope="col" className="px-4 py-3.5">Waktu Ambil / Panggil</th>
                <th scope="col" className="px-4 py-3.5">Tujuan & Dokter</th>
                <th scope="col" className="px-4 py-3.5">Status</th>
                <th scope="col" className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-4 font-bold text-slate-800">
                    {item.nomorAntrean}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-slate-800 text-xs">
                      {item.namaPasien}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {item.nomorRM} • NIK {item.nik}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    <p>{item.waktuAmbil}</p>
                    {item.waktuPanggil && (
                      <p className="text-[10px] text-slate-400">
                        Dipanggil: {item.waktuPanggil}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-700">
                      {item.poliTujuan ?? '-'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.dokter ?? '-'}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                        item.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-600'
                          : item.status === 'Sedang Dilayani'
                          ? 'bg-cyan-50 text-cyan-600'
                          : item.status === 'Menunggu'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'Selesai'
                            ? 'bg-emerald-500'
                            : item.status === 'Sedang Dilayani'
                            ? 'bg-cyan-500'
                            : item.status === 'Menunggu'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                      ></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-200 gap-3 text-xs text-slate-500">
            <div>
              Menampilkan <strong className="text-slate-700">1–{filteredData.length}</strong> dari{' '}
              <strong className="text-slate-700">{filteredData.length}</strong> data
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>Baris</span>
                <button className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 cursor-pointer">
                  10
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled
                  className="p-1 border border-slate-200 rounded text-slate-300 cursor-not-allowed bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-medium text-slate-700">1 / 1</span>
                <button
                  disabled
                  className="p-1 border border-slate-200 rounded text-slate-300 cursor-not-allowed bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}