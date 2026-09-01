'use client';

import React from 'react';
// Pastikan path import disesuaikan dengan struktur folder kamu
import QueueController from '@/features/pendaftaran/components/QueueController';
import PatientSearch from '@/features/pendaftaran/components/CariPasien';
import PatientRegistrationPanel from '@/features/pendaftaran/components/DataPasien';

export default function PendaftaranWorkspace() {
  return (
    // Menggunakan bg-slate-50 agar ada kontras dengan komponen yang berwarna putih
    <div className="min-h-screen w-full bg-slate-50 font-sans text-gray-800">
      
      {/* =========================================
          MAIN CONTENT WRAPPER
      ========================================= */}
      <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Komponen 1: Kiri (Kontroler Antrean) */}
          <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <QueueController />
          </div>

          {/* Komponen 2: Tengah (Pencarian Pasien) */}
          <div className="lg:col-span-6 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <PatientSearch />
          </div>

          {/* Komponen 3: Kanan (Form Pendaftaran Pasien) */}
          {/* Posisi sticky top-6 dipertahankan agar form tetap terlihat saat pasien dicari */}
          <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
            <PatientRegistrationPanel />
          </div>
          
        </div>
      </div>
      
    </div>
  );
}