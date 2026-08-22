"use client";

import React, { useState } from "react";

import Riwayat from "@/features/farmasi/components/Riwayat";
import SidebarCatatan from "@/features/farmasi/components/SidebarCatatan";
import FooterTombol from "@/features/farmasi/components/FooterTombol";
import CetakLabelModal, { PrintOptions } from '@/features/farmasi/components/CetakLabelModal';

export default function RingkasanFarmasiPage() {
  const [internalNote, setInternalNote] = useState("");
  // 1. State untuk mengontrol visibilitas Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

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

  const handleKirimDokter = () => {
    alert("Resep diselesaikan dan dikirim ke dokter/pasien");
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
              <Riwayat />
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
      </div>
    </div>
  );
}
