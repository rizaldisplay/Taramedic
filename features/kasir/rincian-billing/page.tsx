"use client";

import React, { useState } from "react";

import HeaderRincianBilling from "@/features/kasir/components/BPJS/HeaderRincianBilling";
import LayananTindakanDokter from "@/features/kasir/components/BPJS/LayananTindakanDokter";
import FarmasiObat from "@/features/kasir/components/BPJS/FarmasiObat";
import FooterRincianBilling from "@/features/kasir/components/BPJS/FooterRincianBilling";
import SidebarPembayaran from "@/features/kasir/components/SidebarPembayaran";
import FooterTombol from "@/features/kasir/components/FooterTombol";

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
            {/** Header */}
            <div className="w-full">
              <HeaderRincianBilling />
            </div>
            {/* Baris 1: Informasi Kunjungan Utama [A] & Ringkasan Resep [B] */}
            <div className="w-full">
              <LayananTindakanDokter />
            </div>

            {/* Baris 2: Informasi Klinis [C] (Full Width di dalam kolom kiri) */}
            <div className="w-full">
              <FarmasiObat />
            </div>

            {/* Baris 3: Catatan Dokter [D] & Perhatian Farmasi [E] */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
              <FooterRincianBilling />
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-5 pb-24 md:pb-28 sticky top-6">
            <SidebarPembayaran />
          </div>
        </div>

        {/* Footer Buttons */}
        <FooterTombol textButton={""} />
      </div>
    </div>
  );
}
