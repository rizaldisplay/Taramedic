'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { KiosqStep, StatusPasien, Penjamin } from '@/types/kiosk';

// Impor komponen yang sudah dipecah
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
    if (step < 3) setStep((prev) => (prev + 1) as KiosqStep);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((prev) => (prev - 1) as KiosqStep);
  };

  const handleReset = () => {
    setStep(1);
    setStatus(null);
    setPenjamin(null);
    setCountdown(20);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col min-h-[720px]">
        
        <KiosqHeader />

        <main className="flex-1 flex flex-col p-6 relative">
          {step === 2 && (
            <button 
              onClick={handlePrevStep}
              className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          )}

          <StepperIndicator step={step} />

          <div className="flex-1 flex flex-col h-full">
            {step === 1 && (
              <StepStatusPasien 
                onSelect={(val) => { setStatus(val); handleNextStep(); }} 
                selected={status} 
              />
            )}
            
            {step === 2 && (
              <StepPenjamin 
                onSelect={(val) => { setPenjamin(val); handleNextStep(); }} 
                selected={penjamin} 
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
        </main>

        <KiosqFooter />
      </div>
    </div>
  );
};