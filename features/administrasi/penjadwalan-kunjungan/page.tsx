"use client";

import React from "react";
import { Header } from "./components/Header";
import { PatientScheduleSection } from "./components/JadwalPasien";
import { CreateVisitScheduleSection } from "./components/BuatJadwal";
import { DoctorControlRequestSection } from "./components/PermintaanKontrol";
import { ScheduleListSection } from "./components/DaftarJadwal";

export default function PendaftaranWorkspace() {
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-[1920px] px-4 md:px-6 lg:px-8 py-6 flex flex-col gap-6">
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
    </div>
  );
}
