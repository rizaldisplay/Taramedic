'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  MoreVertical, 
  Clock 
} from 'lucide-react';

interface DiagnosaItem {
  id: number;
  code: string;
  desc: string;
  snomed: string;
  tipe: string;
  status: string;
}

interface DiagnosisSekunderProps {
  onOpenDiagnosisSekunderClick?: () => void;
}

export default function DiagnosisComponent({ onOpenDiagnosisSekunderClick }: DiagnosisSekunderProps) {
  // State untuk data diagnosa sekunder (bisa dimanipulasi dengan form/modal nantinya)
  const [diagnosaSekunder, setDiagnosaSekunder] = useState<DiagnosaItem[]>([
    { id: 1, code: 'R50.9', desc: 'Demam, tidak spesifik', snomed: '386661006', tipe: 'Akut', status: 'Ditetapkan' },
    { id: 2, code: 'R63.0', desc: 'Anoreksia', snomed: '413240007', tipe: 'Akut', status: 'Ditetapkan' },
  ]);

  const handleTambahDiagnosa = () => {
    const newItem: DiagnosaItem = {
      id: Date.now(),
      code: '',
      desc: 'Pilih diagnosis...',
      snomed: '',
      tipe: 'Akut',
      status: 'Ditetapkan',
    };
    setDiagnosaSekunder([...diagnosaSekunder, newItem]);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      
      {/* Header Diagnosis */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-5 h-5 bg-cyan-600 text-white rounded text-xs font-bold shadow-sm">
            <FileText size={12} />
          </div>
          <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
            DIAGNOSIS
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Clock size={13} className="text-gray-400" />
          <span>Waktu Diagnosis: 08:52 WIB</span>
        </div>
      </div>

      {/* 1. Diagnosa Utama */}
      <div className="flex flex-col gap-3 mb-6">
        <h3 className="text-xs font-bold text-gray-700">Diagnosa Utama</h3>
        
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-gray-200 text-[11px] text-gray-500 font-semibold">
                <th className="p-2.5 w-12 text-center">No.</th>
                <th className="p-2.5 w-40">Diagnosis (ICD-10)</th>
                <th className="p-2.5">Deskripsi</th>
                <th className="p-2.5 w-32">SNOMED CT</th>
                <th className="p-2.5 w-32">Tipe Diagnosis</th>
                <th className="p-2.5 w-32">Status</th>
                <th className="p-2.5 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-gray-800 divide-y divide-gray-100">
              <tr>
                <td className="p-2.5 text-center text-gray-500">1</td>
                <td className="p-2.5">
                  <div className="flex items-center justify-between border border-gray-200 rounded-md px-2 py-1.5 bg-white">
                    <span className="font-semibold text-cyan-600">A09.0</span>
                    <Search size={14} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                  </div>
                </td>
                <td className="p-2.5 text-gray-700 font-medium">Gastroenteritis dan kolitis infeksius, tidak spesifik</td>
                <td className="p-2.5 text-gray-600">22298006</td>
                <td className="p-2.5">
                  <select className="w-full border border-gray-200 rounded-md px-2 py-1.5 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500">
                    <option>Akut</option>
                    <option>Kronis</option>
                  </select>
                </td>
                <td className="p-2.5">
                  <select className="w-full border border-emerald-200 text-emerald-700 bg-emerald-50/50 rounded-md px-2 py-1.5 text-xs font-semibold focus:outline-none">
                    <option>Ditetapkan</option>
                    <option>Menunggu</option>
                  </select>
                </td>
                <td className="p-2.5 text-center">
                  <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Diagnosa Sekunder / Komorbid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-700">
            Diagnosa Sekunder / Komorbid <span className="text-gray-400 font-normal text-[11px]">(Opsional)</span>
          </h3>
        </div>
        
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-gray-200 text-[11px] text-gray-500 font-semibold">
                <th className="p-2.5 w-12 text-center">No.</th>
                <th className="p-2.5 w-40">Diagnosis (ICD-10)</th>
                <th className="p-2.5">Deskripsi</th>
                <th className="p-2.5 w-32">SNOMED CT</th>
                <th className="p-2.5 w-32">Tipe Diagnosis</th>
                <th className="p-2.5 w-32">Status</th>
                <th className="p-2.5 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-gray-800 divide-y divide-gray-100">
              {diagnosaSekunder.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2.5 text-center text-gray-500">{index + 1}</td>
                  <td className="p-2.5">
                    <div className="flex items-center justify-between border border-gray-200 rounded-md px-2 py-1.5 bg-white">
                      <span className="font-semibold text-cyan-600">{item.code || '-'}</span>
                      <Search size={14} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                    </div>
                  </td>
                  <td className="p-2.5 text-gray-700 font-medium">{item.desc}</td>
                  <td className="p-2.5 text-gray-600">{item.snomed || '-'}</td>
                  <td className="p-2.5">
                    <select defaultValue={item.tipe} className="w-full border border-gray-200 rounded-md px-2 py-1.5 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500">
                      <option>Akut</option>
                      <option>Kronis</option>
                    </select>
                  </td>
                  <td className="p-2.5">
                    <select defaultValue={item.status} className="w-full border border-emerald-200 text-emerald-700 bg-emerald-50/50 rounded-md px-2 py-1.5 text-xs font-semibold focus:outline-none">
                      <option>Ditetapkan</option>
                      <option>Menunggu</option>
                    </select>
                  </td>
                  <td className="p-2.5 text-center">
                    <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tombol Tambah Diagnosa Sekunder */}
        <div>
          <button 
            type="button"
            onClick={onOpenDiagnosisSekunderClick}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-700 mt-1 px-1 py-1 cursor-pointer transition-colors"
          >
            <Plus size={14} />
            <span>Tambah Diagnosis Sekunder</span>
          </button>
        </div>
      </div>

    </div>
  );
}