"use client";

import React from "react";

export default function DiagnosaProsedurJaminan() {
  // Data simulasi Diagnosa (ICD-10)
  const diagnosaData = [
    { id: 1, kode: "A09.0", deskripsi: "Gastroenteritis dan kolitis infeksius, tidak spesifik", status: "Dijamin" },
    { id: 2, kode: "R50.9", deskripsi: "Demam, tidak spesifik", status: "Dijamin" },
    { id: 3, kode: "R63.0", deskripsi: "Anoreksia", status: "Dijamin" },
  ];

  // Data simulasi Prosedur (ICD-9-CM)
  const prosedurData = [
    { id: 1, kode: "89.7", deskripsi: "Konsultasi dokter spesialis anak", status: "Dijamin" },
    { id: 2, kode: "87.44", deskripsi: "Edukasi pasien (medikamentosa & non medikamentosa)", status: "Dijamin" },
    { id: 3, kode: "89.9", deskripsi: "Pemeriksaan fisik lanjutan", status: "Dijamin" },
  ];

  // Reusable Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => (
    <span className="bg-emerald-50 text-emerald-600 font-medium px-2.5 py-0.5 rounded-md text-[11px]">
      {status}
    </span>
  );

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden font-sans">
      
      {/* Title Section (Card Header) */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase">
          DIAGNOSA & PROSEDUR YANG DIJAMIN
        </h3>
      </div>

      {/* Grid Content Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        
        {/* =========================================
            TABEL KIRI: Diagnosa (ICD-10)
        ========================================= */}
        <div className="w-full p-5 overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead className="border-b border-slate-100 text-[12px] text-slate-500 font-medium">
              <tr>
                <th colSpan={3} className="pb-3 px-2">Diagnosa (ICD-10)</th>
                <th className="pb-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {diagnosaData.map((row) => (
                <tr key={`diag-${row.id}`}>
                  {/* Nomor urut */}
                  <td className="py-3 px-2 font-semibold text-slate-800 w-6">
                    {row.id}
                  </td>
                  {/* Kode ICD */}
                  <td className="py-3 px-2 text-slate-800 font-medium w-16">
                    {row.kode}
                  </td>
                  {/* Deskripsi */}
                  <td className="py-3 px-2 text-slate-500">
                    {row.deskripsi}
                  </td>
                  {/* Status */}
                  <td className="py-3 px-2 text-right">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =========================================
            TABEL KANAN: Prosedur / Tindakan (ICD-9-CM)
        ========================================= */}
        <div className="w-full p-5 overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead className="border-b border-slate-100 text-[12px] text-slate-500 font-medium">
              <tr>
                <th colSpan={3} className="pb-3 px-2">Prosedur / Tindakan (ICD-9-CM)</th>
                <th className="pb-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {prosedurData.map((row) => (
                <tr key={`pros-${row.id}`}>
                  {/* Nomor urut */}
                  <td className="py-3 px-2 font-semibold text-slate-800 w-6">
                    {row.id}
                  </td>
                  {/* Kode ICD */}
                  <td className="py-3 px-2 text-slate-800 font-medium w-16">
                    {row.kode}
                  </td>
                  {/* Deskripsi */}
                  <td className="py-3 px-2 text-slate-500">
                    {row.deskripsi}
                  </td>
                  {/* Status */}
                  <td className="py-3 px-2 text-right">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      
    </div>
  );
}