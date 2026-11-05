import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Clock, 
  User, 
  Stethoscope, 
  Filter, 
  Plus, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

type Schedule = {
  id: string | number;
  patientName?: string;
  mrn?: string;
  poli?: string;
  doctorName?: string;
  time?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
};

type ScheduleListSectionProps = {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  schedules?: Schedule[];
  onAddSchedule?: () => void;
  onSelectSchedule?: (schedule: Schedule) => void;
};

export const ScheduleListSection = ({
  selectedDate = '2026-10-28',
  onDateChange,
  schedules = [], // Format: [{ id, patientName, mrn, poli, doctorName, time, status: 'scheduled'|'completed'|'cancelled' }]
  onAddSchedule,
  onSelectSchedule,
}: ScheduleListSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter jadwal berdasarkan keyword pencarian dan status
  const filteredSchedules = schedules.filter((item) => {
    const matchesSearch = 
      item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mrn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.poli?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Schedule['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Selesai
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Batal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
            <AlertCircle className="w-3 h-3" /> Terjadwal
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-800">
              Daftar Jadwal Kunjungan - <span className="font-mono text-cyan-700">{selectedDate}</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Menampilkan daftar antrean dan reservasi pasien pada tanggal yang dipilih.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange && onDateChange(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer"
          />

          {onAddSchedule && (
            <button
              type="button"
              onClick={onAddSchedule}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Jadwal</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Status Filter Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pasien, No. RM, atau dokter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="scheduled">Terjadwal</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Batal</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredSchedules.length > 0 ? (
        <div className="overflow-x-auto border border-slate-100 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-4">Waktu</th>
                <th className="py-2.5 px-4">Pasien</th>
                <th className="py-2.5 px-4">Poli / Layanan</th>
                <th className="py-2.5 px-4">Dokter</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredSchedules.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => onSelectSchedule && onSelectSchedule(item)}
                >
                  <td className="py-3 px-4 font-mono font-medium text-cyan-700 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.time}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{item.patientName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">RM: {item.mrn || '-'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[11px]">
                      {item.poli}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                      {item.doctorName}
                    </div>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSchedule && onSelectSchedule(item);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-50/70 border border-dashed border-slate-200 rounded-xl p-8 text-center">
          <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-slate-600">
            Belum ada jadwal kunjungan pada tanggal ini.
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Gunakan form diatas atau tombol "Tambah Jadwal" untuk mendaftarkan antrean pasien.
          </p>
        </div>
      )}
    </div>
  );
};