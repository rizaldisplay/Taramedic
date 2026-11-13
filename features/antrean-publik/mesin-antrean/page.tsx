'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { mulaiKiosk } from '@/features/kiosq/slice/kioskSlice';
import { PrinterProvider } from '@/lib/printer/PrinterContext';
import { KiosqHeader } from './components/KiosqHeader';
import { KiosqFooter } from './components/KiosqFooter';
import DisplayAwal from './components/DisplayAwal';
import { StepPenjamin } from './components/StepPenjamin';
import { StepSuccess } from './components/StepSuccess';

const INSTITUTION_CONFIG = {
  institutionName: 'Klinik Taramedic',
  institutionAddress: 'Jl. Merdeka No. 10, Jakarta',
  institutionPhone: '031-1234567',
};

export const KiosqFlow = () => {
  const dispatch = useDispatch();

  // 0: Display Awal, 1: Pilih Jenis Pendaftaran (Langkah 1 dari 2), >= 2: Tiket Berhasil Diterbitkan
  const step = useSelector((state: RootState) => state.kiosk.step);

  const handleStart = () => {
    dispatch(mulaiKiosk());
  };

  return (
    <PrinterProvider config={INSTITUTION_CONFIG}>
      <div className="relative h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans select-none">
        {/* Dekorasi tanda plus medis samar pada latar belakang (tampil setelah layar awal) */}
        {step > 0 && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-24 z-0 opacity-[0.045] text-[#008ba6]"
            >
              <svg width="110" height="110" viewBox="0 0 110 110" fill="currentColor">
                <path d="M38 0h34v38h38v34H72v38H38V72H0V38h38V0z" />
              </svg>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-2 bottom-20 z-0 opacity-[0.045] text-[#008ba6]"
            >
              <svg width="110" height="110" viewBox="0 0 110 110" fill="currentColor">
                <path d="M38 0h34v38h38v34H72v38H38V72H0V38h38V0z" />
              </svg>
            </div>
          </>
        )}

        <div className="relative z-10 flex h-full w-full flex-col">
          {/* 1. Header Kiosk */}
          <KiosqHeader />

          {/* 2. Main Content Wrapper */}
          <main
            className={`flex flex-1 flex-col overflow-hidden ${
              step === 0
                ? 'p-0'
                : 'px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-6'
            }`}
          >
            <div
              className={`flex flex-1 items-center justify-center overflow-y-auto min-h-0 ${
                step === 0 ? 'w-full h-full' : 'py-2'
              }`}
            >
              <div
                className={`w-full flex flex-col ${
                  step === 0
                    ? 'max-w-full h-full'
                    : 'max-w-5xl lg:max-w-6xl my-auto'
                }`}
              >
                {step === 0 && <DisplayAwal onClickMulai={handleStart} />}
                {step === 1 && <StepPenjamin />}
                {step >= 2 && <StepSuccess />}
              </div>
            </div>
          </main>

          {/* 3. Footer Kiosk (tampil pada layar awal & pilih jenis pendaftaran) */}
          {step < 2 && <KiosqFooter />}
        </div>
      </div>
    </PrinterProvider>
  );
};