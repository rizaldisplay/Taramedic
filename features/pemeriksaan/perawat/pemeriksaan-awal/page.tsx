'use client';

import React, { useState } from 'react';

// Import Komponent-komponent Form
import VitalSignsForm from '@/features/pemeriksaan/perawat/components/TandaVital';
import ChiefComplaintForm from '@/features/pemeriksaan/perawat/components/KeluhanUtama';
import ConsciousnessForm from '@/features/pemeriksaan/perawat/components/Kesadaran';
import AllergyHistoryForm from '@/features/pemeriksaan/perawat/components/RiwayatAlergi';
import BriefPhysicalExamForm from '@/features/pemeriksaan/perawat/components/PemeriksaanFisik';
import BodyMapExamForm from '@/features/pemeriksaan/perawat/components/PemeriksaanPetaTubuh';
import SidebarCatatan from '@/features/pemeriksaan/perawat/components/SidebarCatatan';
import FooterTombol from '@/features/pemeriksaan/perawat/components/FooterTombol';

export default function InitialExaminationPage() {
  const [internalNote, setInternalNote] = useState('');

  return (
    <div className="min-h-screen bg-gray-50/60 p-4 md:p-6 pb-24 md:pb-28 font-sans text-gray-800">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Form Examination (8 Cols) */}
        <div className="lg:col-span-9 flex flex-col gap-5">
          {/* Section A: Tanda Vital */}
          <VitalSignsForm />

          {/* Section B & C: Keluhan Utama & Kesadaran (Grid Side by Side) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <ChiefComplaintForm />
            <ConsciousnessForm />
          </div>

          {/* Section E & F: Riwayat Alergi & Pemeriksaan Fisik Singkat */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <AllergyHistoryForm />
            <BriefPhysicalExamForm />
          </div>

          {/* Section G: Peta Tubuh */}
          <BodyMapExamForm />
        </div>

        {/* RIGHT COLUMN: Sidebar Patient & Visit Info (4 Cols) */}
        <SidebarCatatan internalNote={internalNote} setInternalNote={setInternalNote} />
      </div>

      {/* Footer Buttons */}
      <FooterTombol />
    </div>
  );
}