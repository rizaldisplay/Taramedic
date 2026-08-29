"use client";

import React from "react";

interface RingkasanTagihanProps {
  totalBilling?: string;
  ditanggungPenjamin?: string;
  tanggunganPasien?: string;
}

export default function RingkasanTagihan({
  totalBilling = "250.000",
  ditanggungPenjamin = "250.000",
  tanggunganPasien = "0",
}: RingkasanTagihanProps) {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden font-sans">
      
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase">
          RINGKASAN TAGIHAN
        </h3>
      </div>

      {/* Card Body / Financial Breakdown */}
      <div className="p-5 flex flex-col gap-3 text-[13px]">
        
        {/* Total Billing */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Total Billing</span>
          <span className="font-semibold text-slate-800">Rp {totalBilling}</span>
        </div>

        {/* Ditanggung Penjamin */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Ditanggung Penjamin (BPJS)</span>
          <span className="font-semibold text-slate-800">Rp {ditanggungPenjamin}</span>
        </div>

        {/* Separator Line */}
        <div className="border-t border-slate-100 my-1" />

        {/* Tanggungan Pasien */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800">Tanggungan Pasien</span>
          <span className="font-bold text-emerald-600">Rp {tanggunganPasien}</span>
        </div>

      </div>

    </div>
  );
}