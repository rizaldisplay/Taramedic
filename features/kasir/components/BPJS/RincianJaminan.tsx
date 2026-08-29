"use client";

import React from "react";

export default function RincianJaminan() {
  // Data simulasi untuk dirender secara dinamis
  const rincianData = [
    {
      id: "A",
      label: "Layanan / Tindakan Dokter",
      total: "150.000",
      dijamin: "150.000",
      pasien: "0",
      keterangan: "Dijamin sesuai FKTP",
    },
    {
      id: "B",
      label: "Obat (Farmasi)",
      total: "23.500",
      dijamin: "23.500",
      pasien: "0",
      keterangan: "Dijamin sesuai formularium",
    },
    {
      id: "C",
      label: "Pemeriksaan Penunjang",
      total: "-",
      dijamin: "-",
      pasien: "0",
      keterangan: "Tidak ada item",
    },
    {
      id: "D",
      label: "Administrasi",
      total: "-",
      dijamin: "-",
      pasien: "0",
      keterangan: "Tidak ada item",
    },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden font-sans">
      
      {/* Title Section (Format Card Header) */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase">
          RINCIAN JAMINAN
        </h3>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-[13px] text-left border-collapse">
          
          {/* Table Header */}
          <thead className="border-b-2 border-slate-100 text-[12px] text-slate-500 font-medium">
            <tr>
              <th colSpan={2} className="py-3 px-5">Komponen</th>
              <th className="py-3 px-4 text-right">Total (Rp)</th>
              <th className="py-3 px-4 text-right">Dijamin Penjamin (Rp)</th>
              <th className="py-3 px-4 text-right">Pasien (Rp)</th>
              <th className="py-3 px-5">Keterangan</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100/80">
            {rincianData.map((row) => (
              <tr key={row.id}>
                {/* Kolom Huruf (A, B, C, D) - padding kiri disesuaikan dengan header */}
                <td className="py-3.5 pl-5 pr-2 font-semibold text-slate-800 text-center w-8">
                  {row.id}
                </td>
                {/* Kolom Label Komponen */}
                <td className="py-3.5 px-2 text-slate-700">
                  {row.label}
                </td>
                {/* Kolom Angka (Rata Kanan) */}
                <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                  {row.total}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                  {row.dijamin}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                  {row.pasien}
                </td>
                {/* Kolom Keterangan - padding kanan disesuaikan dengan header */}
                <td className="py-3.5 pl-4 pr-5 text-slate-500 text-[12px]">
                  {row.keterangan}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Table Footer untuk Total */}
          <tfoot>
            <tr className="border-t-2 border-slate-200 font-bold text-slate-800">
              <td colSpan={2} className="py-4 pl-5 pr-2 uppercase tracking-wide text-[12px]">
                TOTAL KEWAJIBAN
              </td>
              <td className="py-4 px-4 text-right">173.500</td>
              <td className="py-4 px-4 text-right">173.500</td>
              <td className="py-4 px-4 text-right">0</td>
              <td className="py-4 pr-5"></td>
            </tr>
          </tfoot>
          
        </table>
      </div>
    </div>
  );
}