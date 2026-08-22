"use client";

import React, { useState } from "react";

import FinalCheck from "@/features/farmasi/components/FinalCheck";
import ObatDiserahkan from "@/features/farmasi/components/ObatDiserahkan";
import IntruksiKhususDokter from "@/features/farmasi/components/IntruksiKhususDokter";
import SidebarCatatan from "@/features/farmasi/components/SidebarCatatan";
import FooterTombol from "@/features/farmasi/components/FooterTombol";
import CetakLabelModal, { PrintOptions } from '@/features/farmasi/components/CetakLabelModal';
import CetakBuktiSerahObatModal from "../components/CetakBuktiSerahObatModal";
import BerhasilSerahObatModal from "../components/BerhasilSerahObatModal";

export default function RingkasanFarmasiPage() {
  const [internalNote, setInternalNote] = useState("");
  // 1. State untuk mengontrol visibilitas Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isResultPrintModalOpen, setIsResultPrintModalOpen ] = useState<boolean>(false);
  const [isCetakPrintModalOpen, setIsCetakPrintModalOpen ] = useState<boolean>(false);
  const [isCetakHasilModalOpen, setIsCetakHasilModalOpen ] = useState<boolean>(false);

  // 2. Handler saat tombol "Cetak Label Obat" di Footer diklik
  const handleOpenPrintModal = () => {
    setIsPrintModalOpen(true);
  };

  // 3. Handler saat tombol "Batal" / Tutup di Modal diklik
  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
  };

  // 4. Handler saat tombol "Cetak Label (N)" di dalam Modal diklik
  const handleExecutePrint = (selectedIds: string[], options: PrintOptions) => {
    console.log("Mencetak label untuk ID:", selectedIds);
    console.log("Opsi cetak:", options);

    // Di sini kamu bisa memanggil API cetak / window.print()
    alert(
      `Mencetak ${selectedIds.length} label obat via printer ${options.printer}`,
    );
  };

  const handleSimpanDraft = () => {
    alert("Draft berhasil disimpan");
  };

  const handleCetakSerahObat = () => {
    setIsCetakHasilModalOpen(true);
  }

  const handleKirimDokter = () => {
    setIsResultPrintModalOpen(true);
  };

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
              <FinalCheck />
            </div>
            
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
              <ObatDiserahkan />
            </div>

            {/* Baris 3: Catatan Dokter [D] & Perhatian Farmasi [E] */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
              <IntruksiKhususDokter />
            </div>
          </div>

          <SidebarCatatan
            internalNote={internalNote}
            setInternalNote={setInternalNote}
          />
        </div>

        {/* Footer Buttons */}
        <FooterTombol
          onSimpanDraft={handleSimpanDraft}
          onCetakLabel={handleOpenPrintModal} // 👈 Menghubungkan klik ke Modal
          onKirimDokter={handleKirimDokter}
        />

        <CetakLabelModal
          isOpen={isPrintModalOpen} // 👈 Mengontrol modal terbuka / tertutup
          onClose={handleClosePrintModal}
          onPrint={handleExecutePrint}
        />

        <BerhasilSerahObatModal 
            isOpen={isResultPrintModalOpen} 
            onClose={() => setIsResultPrintModalOpen(false)} 
            onCetakBukti={handleCetakSerahObat}
        />

        <CetakBuktiSerahObatModal
          isOpen={isCetakHasilModalOpen} // 👈 Mengontrol modal terbuka / tertutup
          onClose={() => setIsCetakHasilModalOpen(false)}
          data={undefined}
          onCetak={() => undefined}
          onDownloadPdf={() => undefined}
        />
      </div>
    </div>
  );
}
