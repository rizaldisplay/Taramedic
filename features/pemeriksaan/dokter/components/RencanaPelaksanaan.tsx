'use client';

import React from 'react';
import { 
  Plus, 
  Pill, 
  HeartHandshake, 
  GraduationCap, 
  Activity, 
  Calendar, 
  ExternalLink 
} from 'lucide-react';

interface RencanaItem {
  id: string;
  aspek: string;
  icon: React.ElementType;
  detail: string;
  target: string;
  waktuTindakLanjut: string;
}

export default function RencanaPenatalaksanaanComponent() {
  const dataRencana: RencanaItem[] = [
    {
      id: 'terapi-farmakologis',
      aspek: 'Terapi Farmakologis',
      icon: Pill,
      detail: 'Sesuaikan dengan resep (lihat tab Resep)',
      target: 'Reda demam dan keluhan',
      waktuTindakLanjut: 'Kontrol ulang 3 hari',
    },
    {
      id: 'terapi-non-farmakologis',
      aspek: 'Terapi Non Farmakologis',
      icon: HeartHandshake,
      detail: 'Istirahat cukup, banyak minum, makan makanan lunak dan mudah dicerna',
      target: 'Pemulihan kondisi umum',
      waktuTindakLanjut: 'Selama sakit',
    },
    {
      id: 'edukasi',
      aspek: 'Edukasi',
      icon: GraduationCap,
      detail: 'Edukasi orang tua mengenai tanda bahaya dan kepatuhan obat',
      target: 'Meningkatkan pemahaman',
      waktuTindakLanjut: 'Selesai edukasi',
    },
    {
      id: 'monitoring',
      aspek: 'Monitoring',
      icon: Activity,
      detail: 'Observasi demam, muntah, BAB, asupan cairan dan makan',
      target: 'Mencegah dehidrasi',
      waktuTindakLanjut: 'Harian di rumah',
    },
    {
      id: 'tindak-lanjut',
      aspek: 'Tindak Lanjut',
      icon: Calendar,
      detail: 'Kontrol ulang atau segera kembali jika keluhan memberat',
      target: 'Evaluasi perbaikan kondisi',
      waktuTindakLanjut: '16/08/2026 (3 hari)',
    },
    {
      id: 'rujukan',
      aspek: 'Rujukan',
      icon: ExternalLink,
      detail: 'Tidak diperlukan saat ini',
      target: '-',
      waktuTindakLanjut: '-',
    },
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-5 h-5 bg-cyan-600 text-white rounded text-xs font-bold shadow-sm">
            B
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
              RENCANA PENATALAKSANAAN <span className="text-gray-400 font-normal lowercase">(Care Plan)</span>
            </h3>
            <p className="text-[11px] text-gray-400">Rencana penatalaksanaan dan tindak lanjut untuk pasien.</p>
          </div>
        </div>

        <button 
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-cyan-200 bg-white text-cyan-600 text-xs font-semibold hover:bg-cyan-50 transition-all cursor-pointer shadow-2xs"
        >
          <Plus size={14} />
          <span>Tambah Rencana</span>
        </button>
      </div>

      {/* Tabel Rencana Penatalaksanaan */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-gray-200 text-[11px] text-gray-500 font-semibold">
              <th className="p-2.5 w-52">Aspek Rencana</th>
              <th className="p-2.5">Rencana / Detail</th>
              <th className="p-2.5 w-52">Target / Tujuan</th>
              <th className="p-2.5 w-44">Waktu Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody className="text-[12px] divide-y divide-gray-100">
            {dataRencana.map((item) => {
              const Icon = item.icon;
              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-2.5 font-semibold text-gray-800">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-cyan-600 shrink-0" />
                      <span>{item.aspek}</span>
                    </div>
                  </td>
                  <td className="p-2.5 text-gray-700">{item.detail}</td>
                  <td className="p-2.5 text-gray-600">{item.target}</td>
                  <td className="p-2.5 text-gray-600 font-medium">{item.waktuTindakLanjut}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}