import React from 'react';

interface DoctorNoteData {
  keluhan: string;
  pemeriksaanPenunjang: string;
  catatanDokter: string;
}

interface DoctorNoteProps {
  data?: DoctorNoteData;
}

const defaultData: DoctorNoteData = {
  keluhan: 'Demam sejak 2 hari, batuk, pilek, dan sakit tenggorokan.',
  pemeriksaanPenunjang: '-',
  catatanDokter: 'Minum obat sesuai aturan, banyak minum air putih, istirahat cukup.',
};

export default function CatatanDokter({ data = defaultData }: DoctorNoteProps) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
          D
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-blue-700">
          CATATAN DOKTER
        </h2>
      </div>

      {/* Konten Utama */}
      <div className="flex flex-col gap-6">
        {/* Keluhan */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500">Keluhan</span>
          <span className="text-sm font-semibold text-slate-900 leading-snug">
            {data.keluhan}
          </span>
        </div>

        {/* Pemeriksaan Penunjang */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500">Pemeriksaan Penunjang</span>
          <span className="text-sm font-semibold text-slate-900 leading-snug">
            {data.pemeriksaanPenunjang}
          </span>
        </div>

        {/* Catatan Dokter */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500">Catatan Dokter</span>
          <span className="text-sm font-semibold text-slate-900 leading-snug">
            {data.catatanDokter}
          </span>
        </div>
      </div>
    </div>
  );
}