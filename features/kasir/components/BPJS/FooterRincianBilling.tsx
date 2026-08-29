import React from 'react';
import { Info } from 'lucide-react';

interface BillingSummaryProps {
  totalBilling?: number;
  totalCovered?: number; // Total Ditanggung Penjamin (BPJS)
  patientResponsibility?: number; // Total Tanggungan Pasien
}

export default function BillingSummaryFooter({
  totalBilling = 250000,
  totalCovered = 250000,
  patientResponsibility = 0,
}: BillingSummaryProps) {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 font-sans">
      {/* Cards Billing Totals (Left Side - 7 Cols) */}
      <div className="md:col-span-7 bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="grid grid-cols-3 gap-4">
          {/* Total Billing */}
          <div className="flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Billing
            </span>
            <span className="text-xl font-bold text-slate-800 mt-2">
              Rp {formatIDR(totalBilling)}
            </span>
          </div>

          {/* Total Ditanggung Penjamin */}
          <div className="flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
              Total Ditanggung Penjamin (BPJS)
            </span>
            <span className="text-xl font-bold text-slate-800 mt-2">
              Rp {formatIDR(totalCovered)}
            </span>
          </div>

          {/* Total Tanggungan Pasien */}
          <div className="flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
              Total Tanggungan Pasien
            </span>
            <span className="text-xl font-bold text-emerald-600 mt-2">
              Rp {formatIDR(patientResponsibility)}
            </span>
          </div>
        </div>
      </div>

      {/* Info Regulation Notice (Right Side - 5 Cols) */}
      <div className="md:col-span-5 bg-blue-50/50 rounded-lg border border-blue-100 p-4 flex items-start gap-3 text-slate-600">
        <div className="p-1 rounded-full bg-blue-100 text-blue-600 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <p className="text-xs leading-relaxed text-slate-600">
          Harga mengikuti tarif yang berlaku dan sumber data terintegrasi sesuai{' '}
          <span className="font-semibold text-slate-700">SATUSEHAT</span> &{' '}
          <span className="font-semibold text-slate-700">
            Permenkes No. 24 Tahun 2022 tentang RME
          </span>
          .
        </p>
      </div>
    </div>
  );
}