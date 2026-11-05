import React, { useState } from 'react';
import {
  RotateCw,
  Plus,
  FileText,
  Search,
  LogIn,
  LogOut,
  History,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const IncomingReferralSection = ({
  referralData = [], // Data rujukan: [{ id, noRujukan, patientName, mrn, originFacility, diagnosis, date, status }]
  onRefresh,
  onCreateReferral,
  onSelectReferral,
}: {
  referralData?: any[];
  onRefresh?: () => void;
  onCreateReferral?: () => void;
  onSelectReferral?: (item: any) => void;
}) => {
  const [activeTab, setActiveTab] = useState('masuk'); // 'masuk' | 'keluar' | 'riwayat'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReferral, setSelectedReferral] = useState<any | null>(null);

  // Filter data berdasarkan kata kunci & status
  const filteredData = referralData.filter((item) => {
    const matchesSearch =
      item.noRujukan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mrn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originFacility?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (item: any) => {
    setSelectedReferral(item);
    if (onSelectReferral) onSelectReferral(item);
  };

  return (
    <div className="space-y-5">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Rujukan Pasien</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catat rujukan masuk dan siapkan rujukan keluar dari EMR.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Muat Ulang</span>
        </button>
      </div>

      {/* 2. Tab Navigation */}
      <div className="border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('masuk')}
            className={`flex items-center gap-2 pb-2.5 pt-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'masuk'
                ? 'border-cyan-600 text-cyan-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Rujukan Masuk</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600">
              {referralData.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keluar')}
            className={`flex items-center gap-2 pb-2.5 pt-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'keluar'
                ? 'border-cyan-600 text-cyan-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Rujukan Keluar</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600">
              0
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('riwayat')}
            className={`flex items-center gap-2 pb-2.5 pt-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'riwayat'
                ? 'border-cyan-600 text-cyan-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Rujukan</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600">
              0
            </span>
          </button>
        </div>

        <div className="pb-2.5 pt-1 text-slate-400 text-xs">
          Rujukan balik tertaut: <span className="font-mono text-slate-600 font-medium">0</span>
        </div>
      </div>

      {/* 3. Action Button */}
      <div>
        <button
          type="button"
          onClick={onCreateReferral}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Buat Rujukan Masuk</span>
        </button>
      </div>

      {/* 4. Table / List Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-600" />
            <h2 className="text-sm font-bold text-slate-800">Rujukan Masuk</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredData.length} data
          </span>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor rujukan, nama pasien, RM, fasilitas perujuk, atau diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs text-slate-500 font-medium">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="diproses">Diproses</option>
              <option value="diterima">Diterima</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* List Content / Empty State */}
        {filteredData.length > 0 ? (
          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-4">No. Rujukan</th>
                  <th className="py-2.5 px-4">Pasien</th>
                  <th className="py-2.5 px-4">Fasilitas Perujuk</th>
                  <th className="py-2.5 px-4">Diagnosis</th>
                  <th className="py-2.5 px-4">Tanggal</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedReferral?.id === item.id ? 'bg-cyan-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-cyan-700">
                      {item.noRujukan}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{item.patientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">RM: {item.mrn}</div>
                    </td>
                    <td className="py-3 px-4">{item.originFacility}</td>
                    <td className="py-3 px-4 text-slate-600">{item.diagnosis}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{item.date}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Tidak ada data yang cocok dengan pencarian atau filter.
            </p>
          </div>
        )}
      </div>

      {/* 5. Detail View Empty / Selection Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center space-y-2">
        {selectedReferral ? (
          <div className="text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800">
                Detail Rujukan - {selectedReferral.noRujukan}
              </h3>
              <span className="text-xs font-mono bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded">
                {selectedReferral.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Nama Pasien</span>
                <span className="font-semibold text-slate-700">{selectedReferral.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Fasilitas Perujuk</span>
                <span className="font-semibold text-slate-700">{selectedReferral.originFacility}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Diagnosis Utama</span>
                <span className="font-semibold text-slate-700">{selectedReferral.diagnosis}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Tanggal Rujukan</span>
                <span className="font-semibold text-slate-700">{selectedReferral.date}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-2 max-w-md mx-auto">
            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-700">
              Pilih catatan untuk melihat detail, status, dan riwayat.
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Klik salah satu rujukan pada tabel untuk menampilkan informasi lengkap, tahapan, dan riwayat rujukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};