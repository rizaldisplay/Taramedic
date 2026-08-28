'use client';

import React from 'react';
import { 
  Plus, 
  MoreVertical, 
  Pill, 
  HeartHandshake, 
  GraduationCap, 
  Activity, 
  Calendar, 
  ExternalLink 
} from 'lucide-react';

interface TindakanItem {
  id: number;
  nama: string;
  kodeICD: string;
  pelaksana: string;
  tanggal: string;
  waktu: string;
  keterangan: string;
}

interface RencanaItem {
  id: string;
  aspek: string;
  icon: React.ElementType;
  detail: string;
  target: string;
  waktuTindakLanjut: string;
}

interface TambahTindakanProps {
  onOpenTambahTindakanClick?: () => void;
}

export default function TindakanDanRencanaComponent() {
  const dataTindakan: TindakanItem[] = [
    {
      id: 1,
      nama: 'Konsultasi dokter spesialis anak',
      kodeICD: '89.7',
      pelaksana: 'dr. Bima, Sp.A',
      tanggal: '16/08/2026',
      waktu: '08:50 WIB',
      keterangan: 'Konsultasi awal',
    },
    {
      id: 2,
      nama: 'Edukasi pasien (medikamentosa & non medikamentosa)',
      kodeICD: '87.44',
      pelaksana: 'dr. Bima, Sp.A',
      tanggal: '16/08/2026',
      waktu: '08:50 WIB',
      keterangan: 'Edukasi tentang obat dan diet',
    },
    {
      id: 3,
      nama: 'Pemeriksaan fisik lanjutan',
      kodeICD: '89.9',
      pelaksana: 'dr. Bima, Sp.A',
      tanggal: '16/08/2026',
      waktu: '08:50 WIB',
      keterangan: 'Pemeriksaan lanjutan',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header Utama Tab */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
          TINDAKAN & RENCANA
        </h2>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Pencatatan tindakan yang diberikan serta rencana penatalaksanaan pasien.
        </p>

        {/* SECTION A: TINDAKAN (Procedure) */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded text-xs font-bold shadow-sm">
                A
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  TINDAKAN <span className="text-gray-400 font-normal lowercase">(Procedure)</span>
                </h3>
                <p className="text-[11px] text-gray-400">Tindakan yang telah diberikan kepada pasien.</p>
              </div>
            </div>

            <button 
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blue-200 bg-white text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Tambah Tindakan</span>
            </button>
          </div>

          {/* Tabel Tindakan */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-200 text-[11px] text-gray-500 font-semibold">
                  <th className="p-2.5 w-12 text-center">No.</th>
                  <th className="p-2.5">Tindakan</th>
                  <th className="p-2.5 w-36">Kode (ICD-9-CM)</th>
                  <th className="p-2.5 w-36">Pelaksana</th>
                  <th className="p-2.5 w-36">Waktu</th>
                  <th className="p-2.5">Keterangan</th>
                  <th className="p-2.5 w-12 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-[12px] divide-y divide-gray-100">
                {dataTindakan.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2.5 text-center text-gray-500 font-medium">{item.id}</td>
                    <td className="p-2.5 font-semibold text-gray-800">{item.nama}</td>
                    <td className="p-2.5">
                      <span className="bg-slate-100 text-slate-700 font-semibold text-[10px] px-2 py-0.5 rounded border border-slate-200">
                        {item.kodeICD}
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-700 font-medium">{item.pelaksana}</td>
                    <td className="p-2.5 text-gray-600">
                      <p className="font-medium text-[11px]">{item.tanggal}</p>
                      <p className="text-[10px] text-gray-400">{item.waktu}</p>
                    </td>
                    <td className="p-2.5 text-gray-600">{item.keterangan}</td>
                    <td className="p-2.5 text-center">
                      <button type="button" className="text-gray-400 hover:text-gray-600 cursor-pointer p-1">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-2 text-[11px] text-gray-400 font-medium">
            Menampilkan 1 - {dataTindakan.length} dari {dataTindakan.length} data
          </div>
        </div>
      </div>

    </div>
  );
}