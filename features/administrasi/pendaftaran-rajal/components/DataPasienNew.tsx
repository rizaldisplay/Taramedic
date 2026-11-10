import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Activity,
  CheckCircle2,
  User,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  rmNumber: string;
  nik: string;
  gender: 'Laki-laki' | 'Perempuan';
  age: number;
  phone: string;
  guarantor: string;
  lastVisit: string;
  status: 'Aktif' | 'Tidak Aktif';
}

const PatientManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'data' | 'monitoring'>('data');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data sesuai tampilan gambar
  const patients: Patient[] = [
    {
      id: '1',
      name: 'Suparno',
      rmNumber: 'RM00000001',
      nik: '1351502011111496',
      gender: 'Laki-laki',
      age: 38,
      phone: '081511210060',
      guarantor: 'Umum',
      lastVisit: 'Belum ada kunjungan',
      status: 'Aktif',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-cyan-900">Data Pasien</h1>
            <p className="text-xs text-slate-500">
              Kelola identitas dan informasi pasien klinik.
            </p>
          </div>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-emerald-50 border border-teal-200 rounded-lg hover:bg-emerald-100 transition-colors">
          <UserPlus className="w-4 h-4" />
          Daftar Baru
        </button>
      </div>

      {/* Tabs & Alert */}
      <div className="border-b border-slate-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'data'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users className="w-4 h-4" />
            Data Pasien
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'monitoring'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Activity className="w-4 h-4" />
            Monitoring Pendaftaran & Kunjungan
          </button>
        </div>
        <div className="flex items-center gap-1.5 pb-3 text-xs text-slate-500">
          <ShieldAlert className="w-4 h-4 text-slate-400" />
          <span>Transaksi baru tersedia setelah antrean</span>
          <span className="font-bold text-cyan-700">HADIR</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Pasien */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-cyan-50 text-cyan-500 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Pasien</p>
            <p className="text-2xl font-bold text-slate-800">1</p>
          </div>
        </div>

        {/* Pasien Aktif */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pasien Aktif</p>
            <p className="text-2xl font-bold text-slate-800">1</p>
          </div>
        </div>

        {/* Pasien Baru */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-cyan-50 text-cyan-500 rounded-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pasien Baru</p>
            <p className="text-2xl font-bold text-slate-800">0</p>
          </div>
        </div>

        {/* Pasien Tidak Aktif */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-100 text-slate-400 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pasien Tidak Aktif</p>
            <p className="text-2xl font-bold text-slate-800">0</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, No. RM, NIK, atau telepon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Semua status</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Semua gender</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">
            <span>Semua usia</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">
            <span>Terbaru</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 py-2 border-b border-slate-200 mb-4 gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span><strong className="text-slate-700">1</strong> pasien ditemukan</span>
        </div>
        <div>Pilih pasien untuk melihat detail atau memulai pendaftaran.</div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse min-w-[800px]">
          <thead className="bg-slate-50/50 uppercase text-[11px] font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3.5">Identitas Pasien</th>
              <th scope="col" className="px-4 py-3.5">Jenis Kelamin / Usia</th>
              <th scope="col" className="px-4 py-3.5">Telepon</th>
              <th scope="col" className="px-4 py-3.5">Penjamin</th>
              <th scope="col" className="px-4 py-3.5">Kunjungan Terakhir</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-full shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{patient.name}</p>
                      <p className="text-slate-400 text-[11px]">
                        {patient.rmNumber} • NIK {patient.nik}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-slate-700 font-medium">{patient.gender}</p>
                  <p className="text-slate-400">{patient.age} th</p>
                </td>
                <td className="px-4 py-4 text-slate-700 font-medium">{patient.phone}</td>
                <td className="px-4 py-4">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded text-[11px] font-medium">
                    {patient.guarantor}
                  </span>
                </td>
                <td className="px-4 py-4 text-amber-800/80 font-medium">
                  {patient.lastVisit}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {patient.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    Aksi
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-200 gap-3 text-xs text-slate-500">
          <div>
            Menampilkan <strong className="text-slate-700">1–1</strong> dari{' '}
            <strong className="text-slate-700">1</strong> data
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Baris</span>
              <button className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">
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
    </div>
  );
};

export default PatientManagement;