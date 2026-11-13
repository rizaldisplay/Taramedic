/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Volume2, Clock, CheckCircle2, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Sub-components Internal ---
const TabButton = ({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
      active ? 'border-emerald-500 text-emerald-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
    }`}
  >
    {label} 
    <span className={`px-2 py-0.5 rounded-full text-xs font-normal ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
      {count}
    </span>
  </button>
);

const TableRow = ({ no, name, gender, age, rm, poli, billingNo, price, penjamin, penjaminStatus, status, time, wait, active = false }: any) => {
  let statusStyle = "";
  let StatusIcon = Clock;

  switch (status) {
    case 'Dipanggil':
      statusStyle = "bg-cyan-50 text-cyan-600 border-cyan-200";
      StatusIcon = Volume2;
      break;
    case 'Menunggu':
      statusStyle = "bg-amber-50 text-amber-600 border-amber-200";
      StatusIcon = Clock;
      break;
    case 'Dilayani':
      statusStyle = "bg-purple-50 text-purple-600 border-purple-200";
      StatusIcon = Activity;
      break;
    case 'Selesai':
      statusStyle = "bg-emerald-50 text-emerald-600 border-emerald-200";
      StatusIcon = CheckCircle2;
      break;
  }

  return (
    <tr className={`hover:bg-slate-50 transition-colors ${active ? 'bg-cyan-50/30' : ''}`}>
      {/* No. Antrean */}
      <td className="px-6 py-4">
        <div className={`font-bold rounded-lg inline-flex items-center justify-center px-3 py-2 text-sm border ${
          status === 'Dipanggil' ? 'border-cyan-200 text-cyan-600 bg-cyan-50' : 
          status === 'Menunggu' ? 'border-amber-200 text-amber-600 bg-amber-50' : 
          status === 'Dilayani' ? 'border-purple-200 text-purple-600 bg-purple-50' :
          'border-emerald-200 text-emerald-600 bg-emerald-50'
        }`}>
          {no}
        </div>
      </td>

      {/* Pasien */}
      <td className="px-6 py-4">
        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          {name} 
          <span className={gender === 'Perempuan' ? 'text-pink-500 text-base font-normal' : 'text-cyan-500 text-base font-normal'}>
            {gender === 'Perempuan' ? '♀' : '♂'}
          </span>
        </div>
        <div className="text-xs text-slate-400 mt-0.5 font-medium">{rm}</div>
      </td>

      {/* Info Pasien */}
      <td className="px-6 py-4">
        <div className="text-xs text-slate-700 font-medium">{gender}, {age}</div>
        <div className="text-xs font-semibold text-cyan-600 mt-0.5">{poli}</div>
      </td>

      {/* Billing */}
      <td className="px-6 py-4">
        <div className="text-xs text-slate-700 font-medium">{billingNo}</div>
        <div className={`text-xs font-bold mt-0.5 ${price === 'Rp 0' ? 'text-emerald-600' : 'text-rose-500'}`}>
          {price}
        </div>
      </td>

      {/* Penjamin */}
      <td className="px-6 py-4">
        <div className="text-xs text-slate-800 font-semibold">{penjamin}</div>
        {penjaminStatus && (
          <div className="text-xs text-emerald-600 font-medium mt-0.5">{penjaminStatus}</div>
        )}
      </td>

      {/* Status */}
      <td className="px-6 py-4 text-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
          <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
          {status}
        </div>
      </td>

      {/* Waktu Daftar */}
      <td className="px-6 py-4 text-xs text-slate-600 font-medium">{time}</td>

      {/* Estimasi Tunggu */}
      <td className="px-6 py-4 text-xs text-slate-600 font-medium">{wait}</td>
    </tr>
  );
};

export const QueueTable = () => {
  const [activeTab, setActiveTab] = useState('Semua');

  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full font-sans">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-4 pt-2 overflow-x-auto">
        <TabButton label="Semua" count={18} active={activeTab === 'Semua'} onClick={() => setActiveTab('Semua')} />
        <TabButton label="Menunggu" count={14} active={activeTab === 'Menunggu'} onClick={() => setActiveTab('Menunggu')} />
        <TabButton label="Dipanggil" count={2} active={activeTab === 'Dipanggil'} onClick={() => setActiveTab('Dipanggil')} />
        <TabButton label="Dilayani" count={2} active={activeTab === 'Dilayani'} onClick={() => setActiveTab('Dilayani')} />
        <TabButton label="Selesai" count={45} active={activeTab === 'Selesai'} onClick={() => setActiveTab('Selesai')} />
        <TabButton label="Terlewati" count={1} active={activeTab === 'Terlewati'} onClick={() => setActiveTab('Terlewati')} />
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari pasien, no. RM, no. Antrean, no. Billing, no. Kunjungan..." 
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400" 
          />
        </div>
        <button className="flex items-center px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-2" /> Filter
        </button>
        <button className="flex items-center px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          Urutkan <ChevronDown className="w-3.5 h-3.5 ml-2" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">No. Antrean</th>
              <th className="px-6 py-3">Pasien</th>
              <th className="px-6 py-3">Info Pasien</th>
              <th className="px-6 py-3">Billing</th>
              <th className="px-6 py-3">Penjamin</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3">Waktu Daftar</th>
              <th className="px-6 py-3">Estimasi Tunggu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <TableRow 
              no="A013" 
              name="Rizka Amalia" 
              gender="Perempuan" 
              age="8 thn" 
              rm="RM-000036" 
              poli="Poli Anak" 
              billingNo="BL-20260816-013" 
              price="Rp 0" 
              penjamin="BPJS Kesehatan" 
              penjaminStatus="Aktif" 
              status="Dipanggil" 
              time="08:05 WIB" 
              wait="-" 
              active 
            />
            <TableRow 
              no="A014" 
              name="Fathan Alfarizi" 
              gender="Laki-laki" 
              age="6 thn" 
              rm="RM-000037" 
              poli="Poli Anak" 
              billingNo="BL-20260816-014" 
              price="Rp 0" 
              penjamin="BPJS Kesehatan" 
              penjaminStatus="Aktif" 
              status="Menunggu" 
              time="08:07 WIB" 
              wait="± 12 menit" 
            />
            <TableRow 
              no="A015" 
              name="Siti Nurhaliza" 
              gender="Perempuan" 
              age="32 thn" 
              rm="RM-000038" 
              poli="Poli Umum" 
              billingNo="BL-20260816-015" 
              price="Rp 185.000" 
              penjamin="Umum" 
              status="Menunggu" 
              time="08:10 WIB" 
              wait="± 18 menit" 
            />
            <TableRow 
              no="A016" 
              name="Andi Saputra" 
              gender="Laki-laki" 
              age="28 thn" 
              rm="RM-000039" 
              poli="Poli Mata" 
              billingNo="BL-20260816-016" 
              price="Rp 35.000" 
              penjamin="BPJS Kesehatan" 
              penjaminStatus="Aktif" 
              status="Menunggu" 
              time="08:12 WIB" 
              wait="± 24 menit" 
            />
            <TableRow 
              no="A017" 
              name="Dewi Lestari" 
              gender="Perempuan" 
              age="45 thn" 
              rm="RM-000040" 
              poli="Poli THT" 
              billingNo="BL-20260816-017" 
              price="Rp 0" 
              penjamin="BPJS Kesehatan" 
              penjaminStatus="Aktif" 
              status="Dilayani" 
              time="08:15 WIB" 
              wait="-" 
            />
            <TableRow 
              no="A018" 
              name="Budi Santoso" 
              gender="Laki-laki" 
              age="50 thn" 
              rm="RM-000041" 
              poli="Poli Ortopedi" 
              billingNo="BL-20260816-018" 
              price="Rp 150.000" 
              penjamin="Umum" 
              status="Selesai" 
              time="08:20 WIB" 
              wait="Selesai" 
            />
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div>Menampilkan 1 - 6 dari 18 data</div>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-semibold flex items-center justify-center text-xs">
            1
          </button>
          <button className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs font-medium">
            2
          </button>
          <button className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs font-medium">
            3
          </button>
          <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};