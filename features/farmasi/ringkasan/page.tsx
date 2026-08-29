"use client";

import React, { useState } from "react";

import InformasiKunjungan from "@/features/farmasi/components/InformasiKunjungan";
import RingkasanResep from "@/features/farmasi/components/RingkasanResep";
import InformasiKlinis from "@/features/farmasi/components/InformasiKlinis";
import CatatanDokter from "@/features/farmasi/components/CatatanDokter";
import PerhatianFarmasi from "@/features/farmasi/components/PerhatianFarmasi";
import SidebarCatatan from "@/features/farmasi/components/SidebarCatatan";
import FooterTombol from "@/features/farmasi/components/FooterTombol";

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
          <div className="lg:col-span-9 flex flex-col gap-5">
            {/* Baris 1: Informasi Kunjungan Utama [A] & Ringkasan Resep [B] */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <InformasiKunjungan />
              <RingkasanResep />
            </div>

            {/* Baris 2: Informasi Klinis [C] (Full Width di dalam kolom kiri) */}
            <div className="w-full">
              <InformasiKlinis />
            </div>

            {/* Baris 3: Catatan Dokter [D] & Perhatian Farmasi [E] */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <CatatanDokter />
              <PerhatianFarmasi />
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6 sticky top-6">
            <SidebarCatatan
              internalNote={internalNote}
              setInternalNote={setInternalNote}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <FooterTombol textButton={"Lanjutkan Ke Resep"} textSubButton={""} cetakObat={false} />
      </div>
    </div>
  );
}
