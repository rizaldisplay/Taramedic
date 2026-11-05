'use client';

import React from 'react';
import { Header } from './components/Header';
import { Card } from './components/Card';
import QueueController from './components/QueueController';
import PatientSearch from './components/CariPasien';
import PatientRegistrationPanel from './components/DataPasien';
import EditPasienModal from './components/EditPasienModal';

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
        
        {/* Section Card (Statistik) */}
        <section>
          <Card />
        </section>

        {/* Section Grid 3 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Kolom 1: Kiri (Kontroler Antrean) */}
          <aside className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <QueueController />
          </aside>

          {/* Kolom 2: Tengah (Pencarian / Tabel Data) */}
          <section className="lg:col-span-6 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <PatientSearch />
          </section>

          {/* Kolom 3: Kanan (Form) - Tetap Sticky mengikuti scroll viewport */}
          <aside className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
            <PatientRegistrationPanel />
          </aside>
          
        </div>
      </main>
    </div>
  );
}