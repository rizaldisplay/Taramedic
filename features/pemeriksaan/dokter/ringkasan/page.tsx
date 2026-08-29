"use client";

import React, { useState } from "react";

// Import Komponent-komponent Form
import RingkasanKunjungan from "@/features/pemeriksaan/dokter/components/RingkasanKunjungan";
import PemeriksaanAwal from "@/features/pemeriksaan/dokter/components/PemeriksaanAwal";
import StatusPelayanan from "@/features/pemeriksaan/dokter/components/StatusPelayanan";
import AlergiPeringatan from "@/features/pemeriksaan/dokter/components/AlergiPeringatan";
import DokumenTerkait from "@/features/pemeriksaan/dokter/components/DokumenTerkait";
import SidebarCatatan from "@/features/pemeriksaan/dokter/components/SidebarCatatan";
import FooterTombol from "@/features/pemeriksaan/dokter/components/FooterTombol";
import ModalDetailPemeriksaanAwal from "../components/ModalDetailPemeriksaanAwal";
import ModalPetaTubuh from "../components/ModalPetaTubuh";

export default function InitialExaminationPage() {
  const [internalNote, setInternalNote] = useState("");
  const [isModalPemeriksaan, setIsModalPemeriksaan] = useState<boolean>(false);
  const [isModalPetaTubuh, setIsModalPetaTubuh] = useState<boolean>(false);

  const handleOpenModalPemeriksaan = () => {
    setIsModalPemeriksaan(true);
  }

  const handleCloseModalPemeriksaan = () => {
    setIsModalPemeriksaan(false);
  };

  const handleOpenModalPetaTubuh = () => {
    setIsModalPetaTubuh(true);
  }

  const handleCloseModalPetaTubuh = () => {
    setIsModalPetaTubuh(false);
  };

  return (
    <div className="bg-white border-b rounded-xl border-slate-200 overflow-hidden">
      <div className="min-h-screen p-4 md:p-6 pb-24 md:pb-28 font-sans text-gray-800">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Main Form Examination (8 Cols) */}
          <div className="lg:col-span-9 flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                RINGKASAN KUNJUNGAN
              </h2>
              <p className="text-sm text-slate-500">
                Ringkasan data dari pemeriksaan awal perawat dan lanjutan
                pemeriksaan dokter.
              </p>
            </div>

            {/* BARIS 1: Pemeriksaan Awal (Lebar) & Status Pelayanan (Lebih Kecil) */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              {/* Mengambil 7 atau 8 kolom dari 12 */}
              <div className="xl:col-span-8">
                <PemeriksaanAwal onOpenDetailClick={handleOpenModalPemeriksaan} />
              </div>
              {/* Mengambil sisa 4 atau 5 kolom */}
              <div className="xl:col-span-4">
                <StatusPelayanan />
              </div>
            </div>

            {/* BARIS 2: Alergi Peringatan & Dokumen Terkait */}
            {/* Anda bisa menggunakan proporsi yang sama (8:4) atau membaginya 50:50 (6:6) */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="xl:col-span-6">
                <AlergiPeringatan />
              </div>
              <div className="xl:col-span-6">
                <DokumenTerkait />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Patient & Visit Info (4 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-5 sticky top-6">
            <SidebarCatatan
              internalNote={internalNote}
              setInternalNote={setInternalNote}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <FooterTombol />

        <ModalDetailPemeriksaanAwal
          isOpen={isModalPemeriksaan} // 👈 Mengontrol modal terbuka / tertutup
          onClose={handleCloseModalPemeriksaan}
          onOpenPetaTubuhClick={handleOpenModalPetaTubuh}
         />

         <ModalPetaTubuh 
          isOpen={isModalPetaTubuh} // 👈 Mengontrol modal terbuka / tertutup
          onClose={handleCloseModalPetaTubuh}
         />
         
      </div>
    </div>
  );
}
