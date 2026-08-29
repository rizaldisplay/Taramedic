"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface HeaderPembayaranProps {
  title?: string;
  description?: string;
  infoMessage?: string;
}

export default function HeaderPembayaran({
  title = "PEMBAYARAN",
  description = "Proses pembayaran untuk tagihan pasien.",
  infoMessage = "Transaksi ini ditanggung penuh oleh penjamin. Tidak ada pembayaran dari pasien.",
}: HeaderPembayaranProps) {
  return (
    <div className="w-full font-sans space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-[14px] font-bold text-slate-800 tracking-wide uppercase">
          {title}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {description}
        </p>
      </div>

      {/* Info Banner (Ditanggung Penjamin) */}
      <div className="w-full bg-emerald-50/80 border border-emerald-100 rounded-xl p-3.5 flex items-center gap-2.5 text-emerald-700 text-[12px] font-medium">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{infoMessage}</span>
      </div>
    </div>
  );
}