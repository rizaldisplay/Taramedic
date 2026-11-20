'use client';

import React from 'react';
import { Header } from './components/Header';
import Body from './components/UmurUtangPemasok';


export default function RujukanPasienWorkspace() {
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      {/* Wrapper Utama: Menjamin Header dan Grid Body persis berada dalam 1 garis acuan */}
      <div className="w-full max-w-[1920px] px-4 md:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Header Utama */}
        <Header />
        {/* Konten Utama */}
        <Body />
      </div>
    </div>
  );
}