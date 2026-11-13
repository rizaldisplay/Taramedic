/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Volume2, Clock, ChevronLeft, ChevronRight  } from 'lucide-react';

// --- Sub-components Internal ---
const TabButton = ({ label, count, active, onClick }: { label: string, count: number, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${active ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
      }`}
  >
    {label} <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
  </button>
);

const TableRow = ({ no, name, gender, age, rm, insurance, status, time, wait, active = false }: any) => {
  const isDipanggil = status === 'Dipanggil';
  return (
    <tr className={`hover:bg-slate-50 transition-colors ${active ? 'bg-cyan-50/30' : ''}`}>
      <td className="px-6 py-4">
        <div className={`font-semibold rounded-md inline-block px-2 py-1 text-xs border ${active ? 'border-cyan-300 text-cyan-700' : 'border-amber-200 text-amber-600'}`}>{no}</div>
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-900 text-sm">{name} <span className={gender === 'Perempuan' ? 'text-pink-500' : 'text-cyan-500'}>{gender === 'Perempuan' ? '♀' : '♂'}</span></div>
        <div className="text-xs text-slate-500">{rm}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-700">{gender}, {age}</div>
        <div className={`text-xs font-medium ${insurance.includes('BPJS') ? 'text-emerald-600' : 'text-amber-600'}`}>{insurance}</div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${isDipanggil ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
          {isDipanggil ? <Volume2 className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
          {status}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">{time}</td>
      <td className="px-6 py-4 text-sm text-slate-600">{wait}</td>
    </tr>
  );
};

export const QueueTable = () => {
  const [activeTab, setActiveTab] = useState('Semua');

  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="flex border-b border-slate-100 px-2 pt-2 overflow-x-auto">
        <TabButton label="Semua" count={18} active={activeTab === 'Semua'} onClick={() => setActiveTab('Semua')} />
        <TabButton label="Menunggu" count={14} active={activeTab === 'Menunggu'} onClick={() => setActiveTab('Menunggu')} />
        <TabButton label="Dipanggil" count={2} active={activeTab === 'Dipanggil'} onClick={() => setActiveTab('Dipanggil')} />
      </div>

      <div className="p-4 border-b border-slate-100 flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Cari nama pasien, no. RM..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
          <SlidersHorizontal className="w-4 h-4 mr-2" /> Filter
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
          Urutkan <ChevronDown className="w-4 h-4 ml-2" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">No. Antrean</th>
              <th className="px-6 py-4 font-medium">Pasien</th>
              <th className="px-6 py-4 font-medium">Info Pasien</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium">Waktu Daftar</th>
              <th className="px-6 py-4 font-medium">Estimasi Tunggu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <TableRow no="A013" name="Rizka Amalia" gender="Perempuan" age="8 thn" rm="RM-000036" insurance="BPJS" status="Dipanggil" time="08:05 WIB" wait="-" active />
            <TableRow no="A014" name="Fathan Alfarizi" gender="Laki-laki" age="6 thn" rm="RM-000037" insurance="BPJS" status="Menunggu" time="08:07 WIB" wait="± 12 menit" />
            <TableRow no="A014" name="Fathan Alfarizi" gender="Laki-laki" age="6 thn" rm="RM-000037" insurance="BPJS" status="Menunggu" time="08:07 WIB" wait="± 12 menit" />
            <TableRow no="A014" name="Fathan Alfarizi" gender="Laki-laki" age="6 thn" rm="RM-000037" insurance="BPJS" status="Menunggu" time="08:07 WIB" wait="± 12 menit" />
            <TableRow no="A014" name="Fathan Alfarizi" gender="Laki-laki" age="6 thn" rm="RM-000037" insurance="BPJS" status="Menunggu" time="08:07 WIB" wait="± 12 menit" />
            <TableRow no="A014" name="Fathan Alfarizi" gender="Laki-laki" age="6 thn" rm="RM-000037" insurance="BPJS" status="Menunggu" time="08:07 WIB" wait="± 12 menit" />
            <TableRow no="A014" name="Fathan Alfarizi" gender="Laki-laki" age="6 thn" rm="RM-000037" insurance="BPJS" status="Menunggu" time="08:07 WIB" wait="± 12 menit" />
            <TableRow no="A014" name="Fathan Alfarizi" gender="Laki-laki" age="6 thn" rm="RM-000037" insurance="BPJS" status="Menunggu" time="08:07 WIB" wait="± 12 menit" />
            <TableRow no="A014" name="Fathan Alfarizi" gender="Laki-laki" age="6 thn" rm="RM-000037" insurance="BPJS" status="Menunggu" time="08:07 WIB" wait="± 12 menit" />
            {/* Tambahkan row lainnya di sini saat integrasi API */}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
        <div>Menampilkan 1 - 6 dari 18 data</div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
          <button className="w-8 h-8 rounded-md bg-emerald-500 text-white font-medium flex items-center justify-center">1</button>
          <button className="w-8 h-8 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">2</button>
          <button className="w-8 h-8 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">3</button>
          <button className="p-1.5 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};