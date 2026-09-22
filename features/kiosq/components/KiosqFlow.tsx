"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // Sesuaikan dengan path store Anda
import {
  mulaiKiosk,
  kembaliKeStepSebelumnya,
} from "@/features/kiosq/slice/kioskSlice"; // Sesuaikan path
import { PrinterProvider } from '@/lib/printer/PrinterContext';
import { KiosqHeader } from "./KiosqHeader";
import { KiosqFooter } from "./KiosqFooter";
import DisplayAwal from "./DisplayAwal";
import { StepperIndicator } from "./StepperIndicator";
import { StepStatusPasien } from "./StepStatusPasien";
import { StepPenjamin } from "./StepPenjamin";
import { StepSuccess } from "./StepSuccess";

export const KiosqFlow = () => {
  const dispatch = useDispatch();

  // Ambil posisi step saat ini dari Redux (0: Awal, 1: Status, 2: Penjamin, 3: Sukses)
  const step = useSelector((state: RootState) => state.kiosk.step);

  const handlePrevStep = () => {
    dispatch(kembaliKeStepSebelumnya());
  };

  const handleStart = () => {
    dispatch(mulaiKiosk());
  };

  const INSTITUTION_CONFIG = {
    institutionName: "Klinik Taramedic",
    institutionAddress: "Jl. Merdeka No. 10, Jakarta",
    institutionPhone: "031-1234567",
  };

  return (
    <PrinterProvider config={INSTITUTION_CONFIG}>
      <div className="h-screen w-screen overflow-hidden bg-slate-50 font-sans select-none">
        <div className="flex h-full w-full flex-col bg-white">
          {/* 1. Header Kiosk */}
          <KiosqHeader />

          {/* 2. Main Content Wrapper */}
          <main className="flex flex-1 flex-col overflow-hidden px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8">

            {/* Top Bar Section: Tombol Kembali & Stepper */}
            <div className="mx-auto w-full max-w-5xl shrink-0 mb-4 sm:mb-6">
              <div className="relative flex items-center justify-between min-h-12 sm:min-h-14">

                {/* Tombol Kembali (Hanya tampil di Langkah 2 - Pilih Penjamin) */}
                <div className="w-24 sm:w-32 shrink-0">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="
                      inline-flex items-center gap-2
                      h-10 sm:h-12 px-3.5 sm:px-5 rounded-xl
                      border border-slate-200 bg-white
                      text-sm sm:text-base font-bold text-slate-700
                      shadow-xs transition-all
                      hover:bg-slate-50 hover:border-slate-300
                      active:scale-95 cursor-pointer
                    "
                    >
                      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 shrink-0" />
                      <span>Kembali</span>
                    </button>
                  )}
                </div>

                {/* Stepper Indicator (Berada tepat di tengah, tidak tampil di Display Awal) */}
                {step > 0 && step < 4 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <StepperIndicator />
                  </div>
                )}

                {/* Spacer Seimbang di Kanan */}
                <div className="w-24 sm:w-32 shrink-0" />
              </div>
            </div>

            {/* Step Content Container (Responsive Scrollable Center) */}
            <div className="flex flex-1 items-center justify-center overflow-y-auto min-h-0 py-2 sm:py-4">
              <div className={`w-full flex flex-col ${step === 0 ? 'max-w-full h-full' : 'max-w-4xl lg:max-w-5xl my-auto py-4'}`}>
                {/* Render komponen tanpa perlu passing props lagi karena sudah connect ke Redux */}
                {step === 0 && <DisplayAwal onClickMulai={handleStart} />}
                {step === 1 && <StepStatusPasien />}
                {step === 2 && <StepPenjamin />}
                {step === 3 && <StepSuccess />}
              </div>
            </div>
          </main>

          {/* 3. Footer Kiosk */}
          <KiosqFooter />
        </div>
      </div>

    </PrinterProvider>

  );
};