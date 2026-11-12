'use client';

import React from 'react';
import { Header } from './components/Header';

export default function RujukanPasienWorkspace() {
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      {/* Wrapper Utama: Menjamin Header dan Grid Body persis berada dalam 1 garis acuan */}
      <div className="w-full max-w-[1920px] px-4 md:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Header Utama */}
        <Header />

        {/* Grid 3 Kolom */}
        <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-24 md:pb-28">
          {/* Kolom Kiri: Kontroler Antrean */}

        </main>
      </div>
    </div>
  );
}