'use client';

import React, { useState } from 'react';
import {
  Search,
  RefreshCw,
  Plus,
  Filter,
  Eye,
  MoreVertical,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Types untuk Data Obat
export interface ObatItem {
  id: string;
  kfaCode: string;
  isKfaCode: boolean; // Jika false, misal 'KLRES' / 'ALKES'
  namaProduk: string;
  kategori: string;
  bahanAktif: string;
  bentuk: string;
  kemasan: string;
  jenis: 'Farmasi' | 'Alkes';
  sumber: 'KFA' | 'Internal';
  status: 'Aktif' | 'Nonaktif';
  satusehatStatus: 'Terhubung' | 'Tidak Terhubung' | 'Terputus';
}

// Dummy Data berdasarkan Screenshots
const DUMMY_DATA: ObatItem[] = [
  {
    id: '1',
    kfaCode: '91111011',
    isKfaCode: true,
    namaProduk: 'Paracetamol 500 mg Tablet',
    kategori: 'OBAT GENERIK',
    bahanAktif: 'Paracetamol',
    bentuk: 'Tablet',
    kemasan: '10 tablet / strip',
    jenis: 'Farmasi',
    sumber: 'KFA',
    status: 'Aktif',
    satusehatStatus: 'Terhubung',
  },
  {
    id: '2',
    kfaCode: '91107005',
    isKfaCode: true,
    namaProduk: 'Amoxicillin 500 mg Kapsul',
    kategori: 'OBAT GENERIK',
    bahanAktif: 'Amoxicillin',
    bentuk: 'Kapsul',
    kemasan: '10 kapsul / strip',
    jenis: 'Farmasi',
    sumber: 'KFA',
    status: 'Aktif',
    satusehatStatus: 'Terhubung',
  },
  {
    id: '3',
    kfaCode: '91108015',
    isKfaCode: true,
    namaProduk: 'Ambroxol HCl 30 mg Tablet',
    kategori: 'OBAT GENERIK',
    bahanAktif: 'Ambroxol HCl',
    bentuk: 'Tablet',
    kemasan: '10 tablet / strip',
    jenis: 'Farmasi',
    sumber: 'KFA',
    status: 'Aktif',
    satusehatStatus: 'Terhubung',
  },
  {
    id: '4',
    kfaCode: '91202001',
    isKfaCode: true,
    namaProduk: 'Insto Tetes Mata 7.5 mL',
    kategori: 'OBAT BERMEREK',
    bahanAktif: 'Tetrahydrozoline HCl',
    bentuk: 'Tetes Mata',
    kemasan: 'Botol 7.5 mL',
    jenis: 'Farmasi',
    sumber: 'KFA',
    status: 'Aktif',
    satusehatStatus: 'Terhubung',
  },
  {
    id: '5',
    kfaCode: '91305001',
    isKfaCode: true,
    namaProduk: 'NaCl 0.9% Infus 500 mL',
    kategori: 'Cairan Infus',
    bahanAktif: 'Sodium Chloride',
    bentuk: 'Cairan Infus',
    kemasan: 'Botol 500 mL',
    jenis: 'Farmasi',
    sumber: 'KFA',
    status: 'Aktif',
    satusehatStatus: 'Terhubung',
  },
  {
    id: '6',
    kfaCode: '94131605',
    isKfaCode: false,
    namaProduk: 'Syringe 3 mL (Spuit)',
    kategori: 'ALKES',
    bahanAktif: '-',
    bentuk: 'Alat Suntik',
    kemasan: '1 piece / pack',
    jenis: 'Alkes',
    sumber: 'KFA',
    status: 'Aktif',
    satusehatStatus: 'Terhubung',
  },
  {
    id: '7',
    kfaCode: '94022003',
    isKfaCode: false,
    namaProduk: 'Masker Bedah 3 Ply',
    kategori: 'ALKES',
    bahanAktif: '-',
    bentuk: 'Masker',
    kemasan: '50 pcs / box',
    jenis: 'Alkes',
    sumber: 'KFA',
    status: 'Aktif',
    satusehatStatus: 'Terhubung',
  },
  {
    id: '8',
    kfaCode: '91112020',
    isKfaCode: true,
    namaProduk: 'Cetirizine 10 mg Tablet',
    kategori: 'OBAT GENERIK',
    bahanAktif: 'Cetirizine HCl',
    bentuk: 'Tablet',
    kemasan: '10 tablet / strip',
    jenis: 'Farmasi',
    sumber: 'Internal',
    status: 'Aktif',
    satusehatStatus: 'Tidak Terhubung',
  },
  {
    id: '9',
    kfaCode: '94029001',
    isKfaCode: false,
    namaProduk: 'Tensimeter Digital',
    kategori: 'ALKES',
    bahanAktif: '-',
    bentuk: 'Alat Ukur',
    kemasan: '1 unit / box',
    jenis: 'Alkes',
    sumber: 'Internal',
    status: 'Aktif',
    satusehatStatus: 'Tidak Terhubung',
  },
  {
    id: '10',
    kfaCode: '91109002',
    isKfaCode: false,
    namaProduk: 'Ibuprofen 400 mg Tablet',
    kategori: 'OBAT GENERIK',
    bahanAktif: 'Ibuprofen',
    bentuk: 'Tablet',
    kemasan: '10 tablet / strip',
    jenis: 'Farmasi',
    sumber: 'KFA',
    status: 'Nonaktif',
    satusehatStatus: 'Terputus',
  },
];

interface TableObatKfaProps {
  onSelectRow?: (item: ObatItem) => void;
  selectedId?: string;
}

export const TableObatKfa: React.FC<TableObatKfaProps> = ({ onSelectRow, selectedId }) => {
  const [data] = useState<ObatItem[]>(DUMMY_DATA);
  const [search, setSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(selectedId || '1');

  const handleRowClick = (item: ObatItem) => {
    setSelectedRowId(item.id);
    if (onSelectRow) onSelectRow(item);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Header Bar Action */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Cari nama obat, KFA Code, NIE, atau keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Top Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-blue-200 bg-blue-50/50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100/50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Sinkronisasi KFA</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />
            <span>Tambah Internal</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Jenis</label>
          <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500">
            <option>Semua Jenis</option>
            <option>Farmasi</option>
            <option>Alkes</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Kategori</label>
          <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500">
            <option>Semua Kategori</option>
            <option>Obat Generik</option>
            <option>Obat Bermerek</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Sumber</label>
          <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500">
            <option>Semua Sumber</option>
            <option>KFA</option>
            <option>Internal</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Status</label>
          <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500">
            <option>Semua Status</option>
            <option>Aktif</option>
            <option>Nonaktif</option>
          </select>
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors h-[34px]">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Lainnya</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto border border-slate-100 rounded-lg">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="py-3 px-3">KFA Code</th>
              <th className="py-3 px-3">Nama Produk</th>
              <th className="py-3 px-3">Bahan Aktif</th>
              <th className="py-3 px-3">Bentuk</th>
              <th className="py-3 px-3">Kemasan</th>
              <th className="py-3 px-3">Jenis</th>
              <th className="py-3 px-3">Sumber</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">SATUSEHAT</th>
              <th className="py-3 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => {
              const isSelected = selectedRowId === item.id;

              return (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* KFA Code */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-semibold text-blue-600 block">{item.kfaCode}</span>
                    <span className="text-[10px] text-slate-400 block">
                      {item.isKfaCode ? 'KFA Code' : 'KERES'}
                    </span>
                  </td>

                  {/* Nama Produk & Kategori */}
                  <td className="py-3 px-3 min-w-[180px]">
                    <span className="font-semibold text-slate-800 block">{item.namaProduk}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase block">
                      {item.kategori}
                    </span>
                  </td>

                  {/* Bahan Aktif */}
                  <td className="py-3 px-3 text-slate-600">{item.bahanAktif}</td>

                  {/* Bentuk */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{item.bentuk}</td>

                  {/* Kemasan */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{item.kemasan}</td>

                  {/* Jenis */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{item.jenis}</td>

                  {/* Sumber Badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {item.sumber === 'KFA' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                        KFA
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">
                        Internal
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {item.status === 'Aktif' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                        Nonaktif
                      </span>
                    )}
                  </td>

                  {/* SATUSEHAT Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {item.satusehatStatus === 'Terhubung' && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Terhubung
                      </span>
                    )}
                    {item.satusehatStatus === 'Tidak Terhubung' && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-600">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Tidak Terhubung
                      </span>
                    )}
                    {item.satusehatStatus === 'Terputus' && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-600">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Terputus
                      </span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-3 px-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(item);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Opsi Lain"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <span className="text-xs text-slate-500">
          Menampilkan <span className="font-medium text-slate-700">1 - 10</span> dari{' '}
          <span className="font-medium text-slate-700">245</span> data
        </span>

        <div className="flex items-center gap-4">
          {/* Page Buttons */}
          <div className="flex items-center gap-1">
            <button className="p-1.5 border border-slate-200 rounded text-slate-400 hover:bg-slate-50 disabled:opacity-50">
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 border border-slate-200 rounded text-slate-400 hover:bg-slate-50 disabled:opacity-50">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="px-2.5 py-1 text-xs rounded font-medium bg-blue-600 text-white">
              1
            </button>
            <button className="px-2.5 py-1 text-xs rounded font-medium border border-slate-200 text-slate-600 hover:bg-slate-50">
              2
            </button>
            <button className="px-2.5 py-1 text-xs rounded font-medium border border-slate-200 text-slate-600 hover:bg-slate-50">
              3
            </button>
            <button className="px-2.5 py-1 text-xs rounded font-medium border border-slate-200 text-slate-600 hover:bg-slate-50">
              4
            </button>
            <button className="px-2.5 py-1 text-xs rounded font-medium border border-slate-200 text-slate-600 hover:bg-slate-50">
              5
            </button>
            <span className="text-xs text-slate-400 px-1">...</span>
            <button className="px-2.5 py-1 text-xs rounded font-medium border border-slate-200 text-slate-600 hover:bg-slate-50">
              25
            </button>
            <button className="p-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Per halaman */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Per halaman</span>
            <select className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};