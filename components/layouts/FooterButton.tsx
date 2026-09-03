"use client";

import React from "react";
import { ArrowRight, FileText, Trash2, Stethoscope, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button"; // Sesuaikan path komponen Button kamu

interface FooterTombolProps {
  onSimpanDraft?: () => void;
  onReset?: () => void;
  onBatalkanKunjungan?: () => void;
  onLanjutPemeriksaan?: () => void;
  isSubmitting?: boolean;
}

export default function FooterTombol({
  onSimpanDraft,
  onReset,
  onBatalkanKunjungan,
  onLanjutPemeriksaan,
  isSubmitting = false,
}: FooterTombolProps) {
  return (
    <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white border-t border-slate-200 p-3 sm:p-4 z-40 shadow-lg transition-all duration-300 font-sans">
      <div className="max-w-[1440px] mx-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Tombol Sekunder (Kiri) */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <Button
            variant="secondary"
            leftIcon={<FileText className="w-4 h-4 text-slate-500" />}
            onClick={onSimpanDraft}
            className="flex-1 sm:flex-none"
          >
            Simpan Draft
          </Button>

          <Button
            variant="secondary"
            leftIcon={<RotateCcw className="w-4 h-4 text-cyan-600" />}
            onClick={onReset}
            className="flex-1 sm:flex-none border-cyan-200 bg-cyan-50/60 text-cyan-700 hover:bg-cyan-100/70"
          >
            Reset Perubahan
          </Button>
        </div>

        {/* Tombol Aksi Utama (Kanan) */}
        <div className="flex flex-row items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="danger"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={onBatalkanKunjungan}
            className="flex-1 sm:flex-none"
          >
            Batalkan Kunjungan
          </Button>

          <Button
            variant="primary"
            leftIcon={<Stethoscope className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onLanjutPemeriksaan}
            isLoading={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            Lanjut Pemeriksaan
          </Button>
        </div>

      </div>
    </div>
  );
}