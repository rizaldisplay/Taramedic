'use client';

import React, { useState } from 'react';
import { Plus, History, Clock, MoreVertical } from 'lucide-react';

interface PermintaanItem {
  id: number;
  nama: string;
  subNama: string;
  kategori: 'Laboratorium' | 'Radiologi';
  prioritas: 'Rutin' | 'Cito';
  tanggal: string;
  waktu: string;
  status: string;
}

interface PenunjangProps {
  onOpenPenunjangClick?: () => void;
}

export default function PenunjangComponent({ onOpenPenunjangClick }: PenunjangProps) {
  const [activeTab, setActiveTab] = useState<'aktif' | 'hasil'>('aktif');

  const dataPermintaan: PermintaanItem[] = [
    {
      id: 1,
      nama: 'Darah Lengkap (DL)',
      subNama: 'Hemoglobin, Leukosit, Trombosit, Eritrosit, HT, LED, dll.',
      kategori: 'Laboratorium',
      prioritas: 'Rutin',
      tanggal: '16/08/2026',
      waktu: '08:50 WIB',
      status: 'Menunggu Pemeriksaan',
    },
    {
      id: 2,
      nama: 'CRP Kuantitatif',
      subNama: 'C-Reactive Protein',
      kategori: 'Laboratorium',
      prioritas: 'Rutin',
      tanggal: '16/08/2026',
      waktu: '08:50 WIB',
      status: 'Menunggu Pemeriksaan',
    },
    {
      id: 3,
      nama: 'Urinalisis Lengkap',
      subNama: 'Makroskopis & Mikroskopis',
      kategori: 'Laboratorium',
      prioritas: 'Rutin',
      tanggal: '16/08/2026',
      waktu: '08:50 WIB',
      status: 'Menunggu Pemeriksaan',
    },
    {
      id: 4,
      nama: 'Foto Thoraks (Thorax AP/PA)',
      subNama: 'Radiologi',
      kategori: 'Radiologi',
      prioritas: 'Rutin',
      tanggal: '16/08/2026',
      waktu: '08:50 WIB',
      status: 'Menunggu Pemeriksaan',
    },
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
            PENUNJANG / PEMERIKSAAN PENUNJANG
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Kelola permintaan pemeriksaan penunjang (laboratorium, radiologi, EKG, dsb.) dan tinjau hasilnya.
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            type="button"
            onClick={onOpenPenunjangClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100 text-xs font-semibold hover:bg-cyan-100/70 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Minta Pemeriksaan</span>
          </button>

          <button 
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-all cursor-pointer"
          >
            <History size={14} className="text-gray-400" />
            <span>Riwayat Permintaan</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs (Permintaan Aktif vs Hasil Pemeriksaan) */}
      <div className="flex border-b border-gray-200 mt-4">
        <button
          onClick={() => setActiveTab('aktif')}
          className={`pb-2.5 px-1 text-xs font-bold border-b-2 transition-colors cursor-pointer mr-6 ${
            activeTab === 'aktif'
              ? 'border-cyan-600 text-cyan-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Permintaan Aktif
        </button>
        <button
          onClick={() => setActiveTab('hasil')}
          className={`pb-2.5 px-1 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'hasil'
              ? 'border-cyan-600 text-cyan-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Hasil Pemeriksaan
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'aktif' ? (
        <div className="mt-4">
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-200 text-[11px] text-gray-500 font-semibold">
                  <th className="p-3 w-12 text-center">No.</th>
                  <th className="p-3">Pemeriksaan</th>
                  <th className="p-3 w-32">Kategori</th>
                  <th className="p-3 w-24">Prioritas</th>
                  <th className="p-3 w-36">Tanggal Permintaan</th>
                  <th className="p-3 w-44">Status</th>
                  <th className="p-3 w-32 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="text-[12px] divide-y divide-gray-100">
                {dataPermintaan.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 text-center text-gray-500 font-medium">{item.id}</td>
                    
                    {/* Nama & Deskripsi Pemeriksaan */}
                    <td className="p-3">
                      <p className="font-bold text-gray-800 text-[12px]">{item.nama}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.subNama}</p>
                    </td>

                    {/* Kategori Badge */}
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                        item.kategori === 'Laboratorium' 
                          ? 'bg-purple-50 text-purple-600 border-purple-100' 
                          : 'bg-sky-50 text-sky-600 border-sky-100'
                      }`}>
                        {item.kategori}
                      </span>
                    </td>

                    {/* Prioritas Badge */}
                    <td className="p-3">
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] px-2 py-0.5 rounded font-semibold">
                        {item.prioritas}
                      </span>
                    </td>

                    {/* Waktu Permintaan */}
                    <td className="p-3 text-gray-600">
                      <p className="font-medium text-[11px]">{item.tanggal}</p>
                      <p className="text-[10px] text-gray-400">{item.waktu}</p>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/70 text-[11px] px-2.5 py-1 rounded-md font-medium w-fit">
                        <Clock size={12} className="text-amber-600" />
                        <span>{item.status}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          type="button"
                          className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                        <button 
                          type="button"
                          className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info Data */}
          <div className="mt-3 text-[11px] text-gray-400 font-medium">
            Menampilkan 1 - {dataPermintaan.length} dari {dataPermintaan.length} data
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400 text-xs">
          Belum ada hasil pemeriksaan penunjang yang keluar.
        </div>
      )}
    </div>
  );
}