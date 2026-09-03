"use client";

import React, { useState } from "react";

// Saya import kembali InformasiKunjungan menyesuaikan path barumu
import RingkasanKunjungan from "@/features/kasir/components/RingkasanKunjungan";
import RingkasanTindakanDokter from "@/features/kasir/components/RingkasanTindakanDokter";
import RingkasanFarmasiObat from "@/features/kasir/components/RingkasanFarmasiObat";
import RingkasanPembiayaan from "@/features/kasir/components/RingkasanPembiayaan";
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
            <RingkasanKunjungan />

            {/* Bagian Bawah: Nested Grid (Membagi 9 kolom tadi jadi 6 dan 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
              
              {/* Kiri Bawah: Layanan & Farmasi (6 dari 9 kolom) */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <RingkasanTindakanDokter />
                <RingkasanFarmasiObat />
              </div>

              {/* Tengah Bawah: Pembiayaan (3 dari 9 kolom) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <RingkasanPembiayaan />
              </div>

            </div>
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
        <FooterTombol textButton={""} />
      </div>
    </div>
  );
}