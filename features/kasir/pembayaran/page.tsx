"use client";

import React, { useState } from "react";

// Saya import kembali InformasiKunjungan menyesuaikan path barumu
import HeaderPembayaran from "@/features/kasir/components/BPJS/HeaderPembayaran";
import RingkasanTagihan from "@/features/kasir/components/BPJS/RingkasanTagihan";
import MetodePembayaran from "@/features/kasir/components/BPJS/MetodePembayaran";
import DetailPenjamin from "@/features/kasir/components/BPJS/DetailPenjaminan";

import SidebarBilling from "@/features/kasir/components/SidebarBilling";
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
            <HeaderPembayaran />

            {/* Bagian Bawah: Nested Grid (Membagi 9 kolom tadi jadi 6 dan 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
              
              {/* Kiri Bawah: Layanan & Farmasi (6 dari 9 kolom) */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <RingkasanTagihan />
                <DetailPenjamin />
              </div>

              {/* Tengah Bawah: Pembiayaan (3 dari 9 kolom) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <MetodePembayaran />
              </div>

            </div>
          </div>

          {/* --- AREA KANAN / SIDEBAR (3 KOLOM) --- */}
          <div className="lg:col-span-3 flex flex-col gap-6 sticky top-6">
            <SidebarBilling
              subtotalLayanan={120000}
              subtotalObat={18000}
              diskon={0}
              biayaTambahan={0}
              statusPembayaran="Belum Dibayar"
              noInvoice="INV-20260816-0027"
              waktuPembayaran="-"
              kasirName="-"
              metodePembayaran="-"
              nominalDibayar={0}
              statusSatusehat="Belum Sinkron"
            />
          </div>

        </div>

        {/* Footer Buttons */}
        <FooterTombol textButton={"Bayar Rp 138.000"} />
      </div>
    </div>
  );
}