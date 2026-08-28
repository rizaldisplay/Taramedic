"use client";

import React, { useState } from "react";

// Import Komponent-komponent Form
import PemeriksaanAwalPenunjang from "@/features/pemeriksaan/dokter/components/PemeriksaanPenunjang";
import SidebarCatatan from "@/features/pemeriksaan/dokter/components/SidebarCatatan";
import FooterTombol from "@/features/pemeriksaan/dokter/components/FooterTombol";
import ModalMintaPemeriksaanPenunjang from "../components/ModalPemeriksaanPenunjang";

export default function InitialExaminationPage() {
  const [internalNote, setInternalNote] = useState("");
  const [isModalMintaPemeriksaan, setIsModalTambahMintaPemeriksaan] = useState<boolean>(false);
  
  const handleOpenModalMintaPemeriksaan = () => {
    setIsModalTambahMintaPemeriksaan(true);
  }

  const handleCloseModalMintaPemeriksaan = () => {
    setIsModalTambahMintaPemeriksaan(false);
  }

  return (
    <div className="bg-white border-b rounded-xl border-slate-200 overflow-hidden">
      <div className="min-h-screen p-4 md:p-6 pb-24 md:pb-28 font-sans text-gray-800">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Main Form Examination (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* BARIS 1: Pemeriksaan Awal (Lebar) & Status Pelayanan (Lebih Kecil) */}
            <div className="grid grid-cols-1 gap-6">
              <PemeriksaanAwalPenunjang 
                onOpenPenunjangClick = {handleOpenModalMintaPemeriksaan}
              />
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

        <ModalMintaPemeriksaanPenunjang 
          isOpen={isModalMintaPemeriksaan} // 👈 Mengontrol modal terbuka / tertutup
          onClose={handleCloseModalMintaPemeriksaan}
        />
      </div>
    </div>
  );
}
