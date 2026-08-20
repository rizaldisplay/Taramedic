'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Volume2, Clock, CheckCircle2, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Sub-components Internal ---
const TabButton = ({ label, count, active, onClick }: { label: string, count: number, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
      active ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
    }`}
  >
    {label} <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
  </button>
);

const TableRow = ({ no, name, gender, age, rm, insurance, poli, resepItems, resepNo, status, time, wait, active = false }: any) => {
  
  // Menentukan warna dan ikon berdasarkan status
  let statusStyle = "";
  let StatusIcon = Clock;

  switch (status) {
    case 'Dipanggil':
      statusStyle = "bg-blue-50 text-blue-700 border-blue-200";
      StatusIcon = Volume2;
      break;
    case 'Menunggu':
      statusStyle = "bg-amber-50 text-amber-700 border-amber-200";
      StatusIcon = Clock;
      break;
    case 'Dilayani':
      statusStyle = "bg-purple-50 text-purple-700 border-purple-200";
      StatusIcon = Activity;
      break;
    case 'Selesai':
      statusStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
      StatusIcon = CheckCircle2;
      break;
  }

  return (
    <tr className={`hover:bg-slate-50 transition-colors ${active ? 'bg-blue-50/20' : ''}`}>
      <td className="px-6 py-4">
        <div className={`font-semibold rounded-md inline-block px-2 py-1 text-xs border ${
          status === 'Dipanggil' ? 'border-blue-300 text-blue-700 bg-blue-50' : 
          status === 'Menunggu' ? 'border-amber-200 text-amber-600 bg-amber-50' : 
          status === 'Dilayani' ? 'border-purple-200 text-purple-600 bg-purple-50' :
          'border-emerald-200 text-emerald-600 bg-emerald-50'
        }`}>{no}</div>
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-900 text-sm flex items-center gap-1">
          {name} 
          <span className={gender === 'Perempuan' ? 'text-pink-500 text-lg leading-none' : 'text-blue-500 text-lg leading-none'}>
            {gender === 'Perempuan' ? '♀' : '♂'}
          </span>
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{rm}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-700">{gender}, {age}</div>
        <div className="text-xs mt-0.5 flex items-center gap-1">
          <span className={`font-medium ${insurance === 'BPJS' ? 'text-emerald-600' : 'text-slate-600'}`}>{insurance}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">{poli}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-slate-700">{resepItems}</div>
        <div className="text-xs text-slate-500 mt-0.5">{resepNo}</div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
          <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
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
    <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-2 pt-2 overflow-x-auto">
        <TabButton label="Semua" count={18} active={activeTab === 'Semua'} onClick={() => setActiveTab('Semua')} />
        <TabButton label="Menunggu" count={14} active={activeTab === 'Menunggu'} onClick={() => setActiveTab('Menunggu')} />
        <TabButton label="Dipanggil" count={2} active={activeTab === 'Dipanggil'} onClick={() => setActiveTab('Dipanggil')} />
        <TabButton label="Dilayani" count={2} active={activeTab === 'Dilayani'} onClick={() => setActiveTab('Dilayani')} />
        <TabButton label="Selesai" count={45} active={activeTab === 'Selesai'} onClick={() => setActiveTab('Selesai')} />
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama pasien, no. RM, no. resep, dokter, poli..." 
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <SlidersHorizontal className="w-4 h-4 mr-2" /> Filter
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          Urutkan <ChevronDown className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">No. Antrean</th>
              <th className="px-6 py-4 font-medium">Pasien</th>
              <th className="px-6 py-4 font-medium">Info Pasien</th>
              <th className="px-6 py-4 font-medium">Resep</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium">Waktu Daftar</th>
              <th className="px-6 py-4 font-medium">Estimasi Tunggu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <TableRow no="A013" name="Rizka Amalia" gender="Perempuan" age="8 thn" rm="RM-000036" insurance="BPJS" poli="Poli Anak" resepItems="3 item obat" resepNo="RX-20260816-013" status="Dipanggil" time="08:05 WIB" wait="-" active />
            <TableRow no="A014" name="Fathan Alfarizi" gender="Laki-laki" age="6 thn" rm="RM-000037" insurance="BPJS" poli="Poli Anak" resepItems="2 item obat" resepNo="RX-20260816-014" status="Menunggu" time="08:07 WIB" wait="± 12 menit" />
            <TableRow no="A015" name="Siti Nurhaliza" gender="Perempuan" age="32 thn" rm="RM-000038" insurance="Umum" poli="Poli Umum" resepItems="5 item obat" resepNo="RX-20260816-015" status="Menunggu" time="08:10 WIB" wait="± 18 menit" />
            <TableRow no="A016" name="Andi Saputra" gender="Laki-laki" age="28 thn" rm="RM-000039" insurance="BPJS" poli="Poli Mata" resepItems="1 item obat" resepNo="RX-20260816-016" status="Menunggu" time="08:12 WIB" wait="± 24 menit" />
            <TableRow no="A017" name="Dewi Lestari" gender="Perempuan" age="45 thn" rm="RM-000040" insurance="BPJS" poli="Poli THT" resepItems="4 item obat" resepNo="RX-20260816-017" status="Dilayani" time="08:15 WIB" wait="-" />
            <TableRow no="A018" name="Budi Santoso" gender="Laki-laki" age="50 thn" rm="RM-000041" insurance="Umum" poli="Poli Ortopedi" resepItems="2 item obat" resepNo="RX-20260816-018" status="Selesai" time="08:20 WIB" wait="Selesai" />
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