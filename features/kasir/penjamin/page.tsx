"use client";

import React, { useState } from "react";

// Saya import kembali InformasiKunjungan menyesuaikan path barumu
import InformasiPenjamin from "@/features/kasir/components/BPJS/InformasiPenjamin";
import RincianJaminan from "@/features/kasir/components/BPJS/RincianJaminan";
import DiagnosaProsedurJaminan from "@/features/kasir/components/BPJS/DiagnosaProsedurJaminan";

import SidebarCatatan from "@/features/kasir/components/SidebarCatatan";
import FooterTombol from "@/features/kasir/components/FooterTombol";

export default function RingkasanFarmasiPage() {
  const [internalNote, setInternalNote] = useState("");

  return (
    <div className="bg-white border-b rounded-xl border-slate-200 overflow-hidden">
      <div className="min-h-screen p-4 md:p-6 pb-24 md:pb-28 font-sans text-gray-800">
        
        {/* =========================================
            PEMBUNGKUS UTAMA: Membagi Layar Kiri (9) & Kanan (3)
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* --- AREA KIRI UTAMA (9 KOLOM) --- */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Bagian Atas: Lebar penuh mengikuti pembungkusnya */}
            <InformasiPenjamin />
            <RincianJaminan />
            <DiagnosaProsedurJaminan />
          </div>

          {/* --- AREA KANAN / SIDEBAR (3 KOLOM) --- */}
          <div className="lg:col-span-3 flex flex-col gap-6 sticky top-6">
            <SidebarCatatan
              internalNote={internalNote}
              setInternalNote={setInternalNote}
            />
          </div>

        </div>

        {/* Footer Buttons */}
        <FooterTombol />
      </div>
    </div>
  );
}