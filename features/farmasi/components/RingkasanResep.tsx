import React from 'react';
import { Calendar, CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface PrescriptionSummaryData {
  totalResep: number;
  totalNonRacikan: number;
  totalRacikan: number;
  totalItem: number;
}

interface PrescriptionSummaryProps {
  data?: PrescriptionSummaryData;
  onDetailClick?: () => void;
}

const defaultData: PrescriptionSummaryData = {
  totalResep: 1,
  totalNonRacikan: 2,
  totalRacikan: 1,
  totalItem: 3,
};

export default function RingkasanResep({ 
  data = defaultData,
  onDetailClick 
}: PrescriptionSummaryProps) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-600 text-xs font-bold text-white">
          B
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          RINGKASAN RESEP
        </h2>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-3 gap-4">
        {/* Card: Total Resep */}
        <div className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <Calendar className="h-5 w-5 text-cyan-500" />
          <div className="mt-1 flex flex-col">
            <span className="text-xs font-medium text-slate-500">Total Resep</span>
            <span className="text-sm font-bold text-slate-900">{data.totalResep} Resep</span>
          </div>
        </div>

        {/* Card: Non-Racikan */}
        <div className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <div className="mt-1 flex flex-col">
            <span className="text-xs font-medium text-slate-500">Non-Racikan</span>
            <span className="text-sm font-bold text-slate-900">{data.totalNonRacikan} Item Obat</span>
          </div>
        </div>

        {/* Card: Racikan */}
        <div className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <Info className="h-5 w-5 text-orange-400" />
          <div className="mt-1 flex flex-col">
            <span className="text-xs font-medium text-slate-500">Racikan</span>
            <span className="text-sm font-bold text-slate-900">{data.totalRacikan} Racikan</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500 mb-1">Total Item Obat</span>
          <span className="text-sm font-bold text-slate-900">{data.totalItem} Item</span>
        </div>
        
        <button 
          onClick={onDetailClick}
          className="flex items-center gap-2 text-sm font-semibold text-cyan-600 transition-colors hover:text-cyan-800 cursor-pointer"
        >
          Lihat Detail Resep
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}