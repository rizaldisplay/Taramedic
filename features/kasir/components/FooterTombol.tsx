"use client";

import React from "react";
import { ArrowRight, FileText, X, Stethoscope, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FooterTombolProps {
  onSimpanDraft?: () => void;
  onReset?: () => void;
  onBatalkanKunjungan?: () => void;
  onLanjutPemeriksaan?: () => void;
  isSubmitting?: boolean;
  textButton: string;
}

export default function FooterTombol({
  onSimpanDraft,
  onReset,
  onBatalkanKunjungan,
  onLanjutPemeriksaan,
  isSubmitting = false,
  textButton,
}: FooterTombolProps) {
  return (
    <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white border-t border-slate-200 p-4 sm:p-5 z-40 shadow-xl transition-all duration-300 font-sans">
      <div className="max-w-[1440px] mx-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Tombol Sekunder (Kiri) */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            size="md"
            variant="secondary"
            leftIcon={<SquarePen className="w-5 h-5 text-slate-500" />}
            onClick={onSimpanDraft}
            className="flex-1 sm:flex-none text-sm font-bold"
          >
            Ajukan Koreksi Billing
          </Button>
        </div>

        {/* Tombol Aksi Utama (Kanan) */}
        <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            size="md"
            variant="danger"
            leftIcon={<X className="w-5 h-5" />}
            onClick={onBatalkanKunjungan}
            className="flex-1 sm:flex-none text-sm font-bold"
          >
            Batalkan Proses
          </Button>

          <Button
            size="md"
            variant="primary"
            leftIcon={<Stethoscope className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={onLanjutPemeriksaan}
            isLoading={isSubmitting}
            className="flex-1 sm:flex-none text-sm font-bold px-6"
          >
            {textButton}
          </Button>
        </div>

      </div>
    </div>
  );
}