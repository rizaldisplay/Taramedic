"use client";

import React, { useState } from "react";

import VerifikasiAdministratif from "@/features/farmasi/components/VerifikasiAdministratif";
import VerifikasiFarmasi from "@/features/farmasi/components/VerifikasiFarmasi";
import VerifikasiKlinis from "@/features/farmasi/components/VerifikasiKlinis";
import SidebarCatatan from "@/features/farmasi/components/SidebarCatatan";
import FooterTombol from "@/features/pemeriksaan/perawat/components/FooterTombol";

export default function RingkasanFarmasiPage() {
  const [internalNote, setInternalNote] = useState("");

  return (
    <div className="bg-white border-b rounded-xl border-slate-200 overflow-hidden">
    <div className="min-h-screen p-4 md:p-6 pb-24 md:pb-28 font-sans text-gray-800">
      {/* Pembungkus Grid Utama (12 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================
            KOLOM KIRI (KONTEN UTAMA)
            Mengambil 8 bagian dari 12 kolom (LG) atau 9 bagian (XL)
        ========================================= */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Baris 1: Informasi Kunjungan Utama [A] & Ringkasan Resep [B] */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <VerifikasiAdministratif />
          </div>

          {/* Baris 2: Informasi Klinis [C] (Full Width di dalam kolom kiri) */}
          <div className="w-full">
            <VerifikasiFarmasi />
          </div>

          {/* Baris 3: Catatan Dokter [D] & Perhatian Farmasi [E] */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <VerifikasiKlinis />
          </div>
        </div>

        <SidebarCatatan
          internalNote={internalNote}
          setInternalNote={setInternalNote}
        />
      </div>

      {/* Footer Buttons */}
      <FooterTombol />
    </div>
    </div>
  );
}
