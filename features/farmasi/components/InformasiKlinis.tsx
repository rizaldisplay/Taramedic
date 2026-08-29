import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ClinicalInfoData {
  diagnosis: string;
  alergiObat: string;
  hasAlergi: boolean;
  beratBadan: string;
  tinggiBadan: string;
}

interface ClinicalInfoProps {
  data?: ClinicalInfoData;
}

const defaultData: ClinicalInfoData = {
  diagnosis: 'J06.9 - ISPA (Infeksi Saluran Pernafasan Akut)',
  alergiObat: 'Tidak ada alergi yang dilaporkan',
  hasAlergi: false,
  beratBadan: '25 Kg',
  tinggiBadan: '125 cm',
};

export default function InformasiKlinis({ data = defaultData }: ClinicalInfoProps) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-600 text-xs font-bold text-white">
          C
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          INFORMASI KLINIS
        </h2>
      </div>

      {/* Grid Layout untuk Konten */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Kolom 1: Diagnosis */}
        <div className="flex flex-col gap-1.5 md:col-span-1">
          <span className="text-xs font-medium text-slate-500">Diagnosis</span>
          <span className="text-sm font-semibold text-slate-900 leading-snug">
            {data.diagnosis}
          </span>
        </div>

        {/* Kolom 2: Alergi Obat */}
        <div className="flex flex-col gap-1.5 md:col-span-1">
          <span className="text-xs font-medium text-slate-500">Alergi Obat</span>
          <div className="flex items-start gap-2">
            {/* Menampilkan icon hijau jika tidak ada alergi */}
            {!data.hasAlergi && (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            )}
            <span className="text-sm font-semibold text-slate-900 leading-snug">
              {data.alergiObat}
            </span>
          </div>
        </div>

        {/* Kolom 3: Berat Badan */}
        <div className="flex flex-col gap-1.5 md:col-span-1">
          <span className="text-xs font-medium text-slate-500">Berat Badan</span>
          <span className="text-sm font-semibold text-slate-900">{data.beratBadan}</span>
        </div>

        {/* Kolom 4: Tinggi Badan */}
        <div className="flex flex-col gap-1.5 md:col-span-1">
          <span className="text-xs font-medium text-slate-500">Tinggi Badan</span>
          <span className="text-sm font-semibold text-slate-900">{data.tinggiBadan}</span>
        </div>
      </div>
    </div>
  );
}