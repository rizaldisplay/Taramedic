'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

import { KiosqStep, StatusPasien, Penjamin } from '@/types/kiosk';

import { KiosqHeader } from './KiosqHeader';
import { KiosqFooter } from './KiosqFooter';
import { StepperIndicator } from './StepperIndicator';
import { StepStatusPasien } from './StepStatusPasien';
import { StepPenjamin } from './StepPenjamin';
import { StepSuccess } from './StepSuccess';

export const KiosqFlow = () => {
  const [step, setStep] = useState<KiosqStep>(1);
  const [status, setStatus] = useState<StatusPasien>(null);
  const [penjamin, setPenjamin] = useState<Penjamin>(null);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (step === 3) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleReset();
            return 20;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [step]);

  const handleNextStep = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as KiosqStep);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as KiosqStep);
    }
  };

  const handleReset = () => {
    setStep(1);
    setStatus(null);
    setPenjamin(null);
    setCountdown(20);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 font-sans select-none">
      <div className="flex h-full w-full flex-col bg-white">

        {/* 1. Header Kiosk */}
        <KiosqHeader />

        {/* 2. Main Content Wrapper */}
        <main className="flex flex-1 flex-col overflow-hidden px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8">

          {/* Top Bar Section: Tombol Kembali & Stepper */}
          <div className="mx-auto w-full max-w-5xl shrink-0 mb-4 sm:mb-6">
            <div className="relative flex items-center justify-between min-h-[48px] sm:min-h-[56px]">
              
              {/* Tombol Kembali (Presisi di Kiri Tanpa Menimpa Stepper) */}
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

              {/* Stepper Indicator (Berada tepat di tengah) */}
              <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg mx-auto">
                <StepperIndicator step={step} />
              </div>

              {/* Spacer Seimbang di Kanan */}
              <div className="w-24 sm:w-32 shrink-0" />

            </div>
          </div>

          {/* Step Content Container (Responsive Scrollable Center) */}
          <div className="flex flex-1 items-center justify-center overflow-y-auto min-h-0 py-2 sm:py-4">
            <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl my-auto">
              {step === 1 && (
                <StepStatusPasien
                  selected={status}
                  onSelect={(val) => {
                    setStatus(val);
                    handleNextStep();
                  }}
                />
              )}

              {step === 2 && (
                <StepPenjamin
                  selected={penjamin}
                  onSelect={(val) => {
                    setPenjamin(val);
                    handleNextStep();
                  }}
                />
              )}

              {step === 3 && (
                <StepSuccess
                  status={status}
                  penjamin={penjamin}
                  countdown={countdown}
                  onDone={handleReset}
                />
              )}
            </div>
          </div>

        </main>

        {/* 3. Footer Kiosk */}
        <KiosqFooter />

      </div>
    </div>
  );
};