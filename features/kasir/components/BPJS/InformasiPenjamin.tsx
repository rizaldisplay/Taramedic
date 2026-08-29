"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function InformasiPenjamin() {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden font-sans">
      
      {/* Header Section */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase">
          INFORMASI PENJAMIN
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Informasi penjamin dan verifikasi hak pelayanan pasien.
        </p>
      </div>

      {/* Content Section (Grid 12 Kolom dengan Pemisah Vertikal) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        
        {/* =========================================
            BAGIAN KIRI: Logo BPJS (3 Kolom)
        ========================================= */}
        <div className="lg:col-span-3 p-5 flex flex-col items-center justify-center">
          <img
            src="/logo/bpjs.png"
            alt="Logo BPJS Kesehatan"
            className="w-36 max-h-16 object-contain"
          />
        </div>

        {/* =========================================
            BAGIAN TENGAH: Data Kepesertaan (5 Kolom)
        ========================================= */}
        <div className="lg:col-span-5 p-5 grid grid-cols-[100px_1fr_90px_1fr] gap-x-2 gap-y-2.5 text-[12px] items-center">
          
          {/* Baris 1 */}
          <span className="text-slate-500">No. Kartu</span>
          <span className="font-semibold text-slate-800 col-span-3">0001267890123</span>

          {/* Baris 2 */}
          <span className="text-slate-500">No. SEP</span>
          <span className="font-semibold text-slate-800">1018R0020826V000123</span>
          <span className="text-slate-500">Tgl. SEP</span>
          <span className="font-semibold text-slate-800">16/08/2026</span>

          {/* Baris 3 */}
          <span className="text-slate-500">Jenis Peserta</span>
          <span className="font-semibold text-slate-800 col-span-3">PBI (APBN)</span>

          {/* Baris 4 */}
          <span className="text-slate-500">Nama Peserta</span>
          <span className="font-semibold text-slate-800">Rizka Amalia</span>
          <span className="text-slate-500">Tgl. Lahir</span>
          <span className="font-semibold text-slate-800">16/08/2018 (8th)</span>

          {/* Baris 5 */}
          <span className="text-slate-500">Status</span>
          <span className="font-bold text-emerald-600">Aktif</span>
          <span className="text-slate-500">Berlaku s/d</span>
          <span className="font-semibold text-slate-800">31/12/2026</span>

        </div>

        {/* =========================================
            BAGIAN KANAN: Kartu Verifikasi (4 Kolom)
        ========================================= */}
        <div className="lg:col-span-4 p-4">
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-4 h-full flex flex-col justify-between">
            
            <div>
              {/* Status Header */}
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[12px] font-bold text-emerald-700 tracking-wide uppercase">
                  VERIFIKASI BERHASIL
                </span>
              </div>
              
              {/* Status Subtitle */}
              <p className="text-[11px] text-emerald-600/80 font-medium pb-3 border-b border-emerald-200/50">
                Hak pelayanan dijamin sesuai ketentuan
              </p>
            </div>

            {/* Metadata Verifikasi */}
            <div className="grid grid-cols-[110px_1fr] gap-y-1.5 text-[11px] pt-3">
              <span className="text-slate-500">Tanggal Verifikasi</span>
              <span className="font-medium text-slate-800">16/08/2026 09:10 WIB</span>
              
              <span className="text-slate-500">Oleh</span>
              <span className="font-medium text-slate-800">Sistem (V-Klaim)</span>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}