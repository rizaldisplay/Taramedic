"use client";

import React from "react";

export default function DetailPenjamin() {
  const detailData = [
    { label: "Penjamin", value: "BPJS Kesehatan" },
    { label: "No. Kartu", value: "0001267890123" },
    { label: "No. SEP", value: "1018R0020826V000123" },
    { label: "Jenis Peserta", value: "PBI (APBN)" },
    { label: "Status Verifikasi", value: "Terverifikasi", isBadge: true },
    { label: "Tanggal Verifikasi", value: "16/08/2026 09:10 WIB" },
    { label: "Oleh", value: "Sistem (V-Klaim)" },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden font-sans">
      
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase">
          DETAIL PENJAMIN
        </h3>
      </div>

      {/* Card Body / Metadata List */}
      <div className="p-5 flex flex-col gap-3 text-[12px]">
        {detailData.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[130px_1fr] items-center gap-2"
          >
            <span className="text-slate-500">{item.label}</span>
            {item.isBadge ? (
              <div>
                <span className="bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded text-[11px] inline-block">
                  {item.value}
                </span>
              </div>
            ) : (
              <span className="font-semibold text-slate-800">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}