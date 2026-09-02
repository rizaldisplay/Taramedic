"use client";

import React, { useState } from "react";

// Saya import kembali InformasiKunjungan menyesuaikan path barumu
import DaftarSDMK from "@/features/masterdata/components/DaftarSDMK";
import DetailSDMK from "@/features/masterdata/components/DetailSDMK";

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
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Bagian Bawah: Nested Grid (Membagi 9 kolom tadi jadi 6 dan 3) */}
                <DaftarSDMK />
          </div>

          {/* --- AREA KANAN / SIDEBAR (3 KOLOM) --- */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
            <DetailSDMK/>
          </div>

        </div>

        {/* Footer Buttons */}
        <FooterTombol />
      </div>
    </div>
  );
}