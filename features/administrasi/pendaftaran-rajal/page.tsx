'use client';

import React from 'react';
import { Header } from './components/Header';
import QueueController from './components/QueueController';
import TabDataPasien from './components/TabDataPasien';
import PatientRegistrationPanel from './components/DataPasien';
import { useAppSelector } from '@/store/hooks';

export default function PendaftaranWorkspace() {
  const isPanelOpen = useAppSelector((state) => state.patient.isPanelOpen);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      {/* Wrapper Utama: Menjamin Header dan Grid Body persis berada dalam 1 garis acuan */}
      <div className="w-full max-w-[1920px] px-4 md:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Header Utama */}
        <Header />

        {/* Grid 3 Kolom */}
        <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-24 md:pb-28">
          {/* Kolom Kiri: Kontroler Antrean */}
          <aside className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-fit">
            <QueueController />
          </aside>

          {/* Kolom Tengah: Data Pasien & Monitoring */}
          <section
            className={`${
              isPanelOpen ? 'lg:col-span-6' : 'lg:col-span-9'
            } flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-fit transition-all duration-300`}
          >
            <TabDataPasien />
          </section>

          {/* Kolom Kanan: Form Pendaftaran Pasien */}
          {isPanelOpen && (
            <aside className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden sticky top-6">
              <PatientRegistrationPanel />
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}