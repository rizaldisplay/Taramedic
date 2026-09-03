'use client';

import React, { useState } from 'react';
import Dokumen from '@/features/pemeriksaan/perawat/components/Dokumen';
import SidebarCatatan from '@/features/pemeriksaan/perawat/components/SidebarCatatan';
import FooterTombol from '@/features/pemeriksaan/perawat/components/FooterTombol';


export default function DokumenPage() {
  const [internalNote, setInternalNote] = useState('');
  
  return (
    <div className="min-h-screen bg-gray-50/60 p-4 md:p-6 pb-24 md:pb-28 font-sans text-gray-800">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Form Examination (8 Cols) */}
        <div className="lg:col-span-9 flex flex-col gap-5">
          {/* Dokumen Form */}
          <Dokumen />
        </div>

        {/* RIGHT COLUMN: Sidebar Patient & Visit Info (4 Cols) */}
        <SidebarCatatan internalNote={internalNote} setInternalNote={setInternalNote} />
      </div>

      {/* Footer Buttons */}
      <FooterTombol />
    </div>
  );
}