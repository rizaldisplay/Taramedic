"use client";

import React, { useState } from "react";

// Import Komponent-komponent Form
import KeluhanUtama from "@/features/pemeriksaan/dokter/components/KeluhanUtama";
import KeluhanPenyerta from "@/features/pemeriksaan/dokter/components/KeluhanPenyerta";
import RiwayatPenyakitDahulu from "@/features/pemeriksaan/dokter/components/RiwayatPenyakitDahulu";
import RiwayatAlergi from "@/features/pemeriksaan/dokter/components/RiwayatAlergi";
import RiwayatPengobatan  from "@/features/pemeriksaan/dokter/components/RiwayatPengebotan";
import RiwayatPenyakitKeluarga from "@/features/pemeriksaan/dokter/components/RiwayatPenyakitKeluarga";
import RiwayatSosial from "@/features/pemeriksaan/dokter/components/RiwayatSosial";
import SidebarCatatan from "@/features/pemeriksaan/dokter/components/SidebarCatatan";
import FooterTombol from "@/features/pemeriksaan/dokter/components/FooterTombol";

export default function InitialExaminationPage() {
  const [internalNote, setInternalNote] = useState("");

  return (
    <div className="bg-white border-b rounded-xl border-slate-200 overflow-hidden">
      <div className="min-h-screen p-4 md:p-6 pb-24 md:pb-28 font-sans text-gray-800">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Main Form Examination (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* BARIS 1: Pemeriksaan Awal (Lebar) & Status Pelayanan (Lebih Kecil) */}
            <div className="grid grid-cols-1 gap-6">
                <KeluhanUtama/>
            </div>

            {/* BARIS 2: Pemeriksaan Awal (Lebar) & Status Pelayanan (Lebih Kecil) */}
            <div className="grid grid-cols-1 gap-6">
                <KeluhanPenyerta/>
            </div>

            {/* BARIS 3: Alergi Peringatan & Dokumen Terkait */}
            {/* Anda bisa menggunakan proporsi yang sama (8:4) atau membaginya 50:50 (6:6) */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="xl:col-span-6">
                <RiwayatPenyakitDahulu />
              </div>
              <div className="xl:col-span-6">
                <RiwayatAlergi />
              </div>
            </div>

            {/* BARIS 4: Alergi Peringatan & Dokumen Terkait */}
            {/* Anda bisa menggunakan proporsi yang sama (8:4) atau membaginya 50:50 (6:6) */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="xl:col-span-5">
                <RiwayatPengobatan />
              </div>
              <div className="xl:col-span-7">
                <RiwayatPenyakitKeluarga />
              </div>
            </div>

            {/* BARIS 5: Pemeriksaan Awal (Lebar) & Status Pelayanan (Lebih Kecil) */}
            <div className="grid grid-cols-1 gap-6">
                <RiwayatSosial/>
            </div>
          </div>
          

          {/* RIGHT COLUMN: Sidebar Patient & Visit Info (4 Cols) */}
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
