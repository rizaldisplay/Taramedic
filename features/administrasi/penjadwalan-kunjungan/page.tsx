'use client';

import React from 'react';
import { Header } from './components/Header';
import { PatientScheduleSection } from './components/JadwalPasien';
import { CreateVisitScheduleSection } from './components/BuatJadwal';
import { DoctorControlRequestSection } from './components/PermintaanKontrol';
import { ScheduleListSection } from './components/DaftarJadwal';

export default function PendaftaranWorkspace() {
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* 
        Header mengambil full width, padding internalnya (p-4 md:p-6 lg:p-8) 
        akan otomatis sejajar dengan kontainer main di bawahnya.
      */}
      <Header />
      
      {/* =========================================
          MAIN CONTENT WRAPPER
          Padding X sejajar dengan Header. Gap-6 memberi jarak vertikal yang konsisten.
      ========================================= */}
      <main className="flex-1 flex flex-col px-4 md:px-6 lg:px-0 py-6 pb-24 md:pb-28 gap-6">
        <PatientScheduleSection />
        <CreateVisitScheduleSection />
        <DoctorControlRequestSection />
        <ScheduleListSection />
      </main>
    </div>
  );
}