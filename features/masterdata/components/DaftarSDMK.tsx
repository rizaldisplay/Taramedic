'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown
} from 'lucide-react';

// --- Types ---
interface SdmkData {
  id: string;
  sdmkId: string;
  name: string;
  nik: string;
  profesi: string;
  kompetensi: string;
  strStatus: 'Valid' | 'Kedaluwarsa' | null;
  sipStatus: 'Aktif' | null;
  unitPoli: string;
  satusehatStatus: 'Terhubung' | 'Belum Terhubung';
  status: 'Aktif' | 'Nonaktif';
  avatarInitials: string;
}

// --- Mock Data ---
const mockSdmkList: SdmkData[] = [
  {
    id: '1',
    sdmkId: 'SDMK-00001',
    name: 'dr. Budi Santoso, Sp.PD',
    nik: '3271••••••••9012',
    profesi: 'Dokter',
    kompetensi: 'Spesialis Penyakit Dalam',
    strStatus: 'Valid',
    sipStatus: 'Aktif',
    unitPoli: 'Poli Penyakit Dalam',
    satusehatStatus: 'Terhubung',
    status: 'Aktif',
    avatarInitials: 'BS'
  },
  {
    id: '2',
    sdmkId: 'SDMK-00002',
    name: 'drg. Siti Aisyah',
    nik: '3271••••••••1122',
    profesi: 'Dokter Gigi',
    kompetensi: 'Dokter Gigi',
    strStatus: 'Valid',
    sipStatus: 'Aktif',
    unitPoli: 'Poli Gigi',
    satusehatStatus: 'Terhubung',
    status: 'Aktif',
    avatarInitials: 'SA'
  },
  {
    id: '3',
    sdmkId: 'SDMK-00003',
    name: 'Ns. Rina Marlina, S.Kep',
    nik: '3271••••••••2233',
    profesi: 'Perawat',
    kompetensi: 'Perawat Klinik',
    strStatus: 'Valid',
    sipStatus: null,
    unitPoli: 'Poli Umum',
    satusehatStatus: 'Terhubung',
    status: 'Aktif',
    avatarInitials: 'RM'
  },
  {
    id: '4',
    sdmkId: 'SDMK-00004',
    name: 'Apt. Dwi Putra, S.Farm',
    nik: '3271••••••••3444',
    profesi: 'Apoteker',
    kompetensi: 'Apoteker',
    strStatus: 'Valid',
    sipStatus: 'Aktif',
    unitPoli: 'Farmasi',
    satusehatStatus: 'Terhubung',
    status: 'Aktif',
    avatarInitials: 'DP'
  },
  {
    id: '5',
    sdmkId: 'SDMK-00005',
    name: 'An. Farhan Maulana',
    nik: '3271••••••••4455',
    profesi: 'Analis Kesehatan',
    kompetensi: 'Analis Laboratorium',
    strStatus: 'Valid',
    sipStatus: null,
    unitPoli: 'Laboratorium',
    satusehatStatus: 'Terhubung',
    status: 'Aktif',
    avatarInitials: 'FM'
  },
  {
    id: '6',
    sdmkId: 'SDMK-00006',
    name: 'Radianty Putri, A.Md.Rad',
    nik: '3271••••••••5566',
    profesi: 'Radiografer',
    kompetensi: 'Radiografer',
    strStatus: 'Valid',
    sipStatus: null,
    unitPoli: 'Radiologi',
    satusehatStatus: 'Terhubung',
    status: 'Aktif',
    avatarInitials: 'RP'
  },
  {
    id: '7',
    sdmkId: 'SDMK-00007',
    name: 'Bdn. Nurul Hidayah',
    nik: '3271••••••••6677',
    profesi: 'Bidan',
    kompetensi: 'Bidan Klinik',
    strStatus: 'Valid',
    sipStatus: null,
    unitPoli: 'Poli KIA',
    satusehatStatus: 'Terhubung',
    status: 'Aktif',
    avatarInitials: 'NH'
  },
  {
    id: '8',
    sdmkId: 'SDMK-00008',
    name: 'dr. Andi Wijaya',
    nik: '3271••••••••7788',
    profesi: 'Dokter',
    kompetensi: 'Dokter Umum',
    strStatus: 'Kedaluwarsa',
    sipStatus: 'Aktif',
    unitPoli: 'Poli Umum',
    satusehatStatus: 'Belum Terhubung',
    status: 'Nonaktif',
    avatarInitials: 'AW'
  }
];

export default function SdmkList() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm font-sans overflow-hidden">
      
      {/* --- HEADER SECTION --- */}
      <div className="p-6 pb-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-lg font-bold text-[#0b2756] mb-4">Daftar SDMK</h2>
        
        {/* Search & Add Button */}
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
              placeholder="Cari nama, NIK, STR, SIP, atau Practitioner IHS Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shrink-0">
            <Plus size={18} />
            Tambah SDMK
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect label="Profesi" defaultValue="Semua Profesi" />
          <FilterSelect label="Kompetensi" defaultValue="Semua Kompetensi" />
          <FilterSelect label="Unit/Poli" defaultValue="Semua Unit" />
          <FilterSelect label="Status" defaultValue="Semua Status" />
          <FilterSelect label="Status SIP" defaultValue="Semua" />
          
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors ml-auto">
            <Filter size={16} />
            Filter Lainnya
          </button>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[1000px]">
          <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">SDMK ID</th>
              <th className="px-6 py-4">Nama SDMK</th>
              <th className="px-6 py-4">Profesi / Kompetensi</th>
              <th className="px-6 py-4">STR</th>
              <th className="px-6 py-4">SIP</th>
              <th className="px-6 py-4">Unit / Poli</th>
              <th className="px-6 py-4">SATUSEHAT</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockSdmkList.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors bg-white">
                <td className="px-6 py-4 text-blue-600 font-medium text-xs">{item.sdmkId}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {item.avatarInitials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500">NIK {item.nik}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-800">{item.profesi}</p>
                  <p className="text-[11px] text-slate-500">{item.kompetensi}</p>
                </td>
                <td className="px-6 py-4">
                  {item.strStatus ? <StatusDot status={item.strStatus} /> : <span className="text-slate-400">-</span>}
                </td>
                <td className="px-6 py-4">
                  {item.sipStatus ? <StatusDot status={item.sipStatus} /> : <span className="text-slate-400">-</span>}
                </td>
                <td className="px-6 py-4 text-sm text-slate-800">{item.unitPoli}</td>
                <td className="px-6 py-4">
                  <StatusDot status={item.satusehatStatus} />
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION SECTION --- */}
      <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
        <span className="text-xs text-slate-500">Menampilkan 1 - 8 dari 24 data</span>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <PaginationButton icon={ChevronsLeft} />
            <PaginationButton icon={ChevronLeft} />
            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-xs font-semibold rounded-md">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-md border border-transparent hover:border-slate-200 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-md border border-transparent hover:border-slate-200 transition-colors">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs">...</span>
            <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-md border border-transparent hover:border-slate-200 transition-colors">6</button>
            <PaginationButton icon={ChevronRight} />
            <PaginationButton icon={ChevronsRight} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Per halaman</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-300 rounded-md py-1.5 pl-3 pr-8 text-xs text-slate-700 outline-none focus:border-blue-500">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// --- Helper Components ---

function FilterSelect({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="flex flex-col gap-1 w-full sm:w-auto">
      <label className="text-[10px] font-semibold text-slate-500 uppercase">{label}</label>
      <div className="relative">
        <select className="w-full sm:w-40 appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <option>{defaultValue}</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const isPositive = ['Valid', 'Aktif', 'Terhubung'].includes(status);
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className={isPositive ? 'text-green-700' : 'text-red-600'}>{status}</span>
    </div>
  );
}

function PaginationButton({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-md border border-slate-200 transition-colors">
      <Icon size={16} />
    </button>
  );
}