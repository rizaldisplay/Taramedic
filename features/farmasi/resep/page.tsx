"use client";

import React, { useState } from "react";

import ResepElektronik from "@/features/farmasi/components/ResepElektronik";
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
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                <ResepElektronik/>
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
