import React from 'react';
import { CreditCard } from 'lucide-react';

interface FinancialSummaryProps {
  totalBilling?: number;
  coveredByGuarantor?: number;
  patientResponsibility?: number;
  paymentMethod?: string;
}

export default function FinancialSummaryCard({
  totalBilling = 250000,
  coveredByGuarantor = 250000,
  patientResponsibility = 0,
  paymentMethod = 'Penjamin / BPJS',
}: FinancialSummaryProps) {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="w-full space-y-4 font-sans">
      {/* 1. Card Ringkasan Pembiayaan */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-2.5">
          RINGKASAN PEMBIAYAAN
        </h3>

        <div className="space-y-2 text-xs">
          {/* Total Billing */}
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Total Billing</span>
            <span className="font-bold text-slate-800">
              Rp {formatIDR(totalBilling)}
            </span>
          </div>

          {/* Ditanggung Penjamin */}
          <div className="flex justify-between items-start">
            <span className="text-slate-600 font-medium">
              Ditanggung Penjamin (BPJS)
            </span>
            <span className="font-bold text-slate-800">
              Rp {formatIDR(coveredByGuarantor)}
            </span>
          </div>

          <div className="border-t border-slate-100 my-1"></div>

          {/* Tanggungan Pasien */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-600 font-medium">
              Tanggungan Pasien
            </span>
            <span className="font-bold text-emerald-600">
              Rp {formatIDR(patientResponsibility)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Card Total Harus Dibayar Pasien */}
      <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 p-4 text-center">
        <p className="text-xs font-bold text-slate-800 tracking-wide">
          Total Harus Dibayar Pasien
        </p>
        <p className="text-2xl font-extrabold text-emerald-600 mt-1">
          Rp {formatIDR(patientResponsibility)}
        </p>
      </div>

      {/* 3. Card Metode Pembayaran */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-2.5">
          METODE PEMBIAYAAN
        </h3>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
            <span className="text-xs font-bold text-slate-800">
              {paymentMethod}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pl-4">
            Tidak ada pembayaran pasien
          </p>
        </div>
      </div>
    </div>
  );
}