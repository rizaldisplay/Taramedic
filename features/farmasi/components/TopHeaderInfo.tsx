'use client';

import React, { useState } from 'react';
import { ArrowLeft, History, Phone } from 'lucide-react';

interface TopHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TopHeaderInfo({ activeTab, onTabChange }: TopHeaderProps) {
  const tabs = ['Ringkasan', 'Resep', 'Verifikasi', 'Dispensing', 'Serah Obat', 'Riwayat'];

  return (
    <div className="bg-white border-b rounded-xl border-slate-200 overflow-hidden">
      {/* Patient Info Header Card */}
      <div className="p-4 sm:px-6 sm:pt-5 sm:pb-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 xl:gap-4">
          
          {/* Left Section: Avatar & Detail Pasien */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            {/* Avatar Circle */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-600 text-white font-bold text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm mt-1 sm:mt-0">
              RA
            </div>

            {/* Information Stack */}
            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Rizka Amalia
                </h1>
                <span className="text-pink-500 font-bold text-sm leading-none">♀</span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Perempuan, 8 thn (02/03/2016)
                </span>
              </div>

              {/* Badges / Sub-info */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-700">RM-000036</span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                
                {/* Badge BPJS agar lebih menonjol di mobile */}
                <span className="font-medium text-slate-600 bg-slate-50 sm:bg-transparent border sm:border-0 border-slate-200 px-1.5 py-0.5 sm:p-0 rounded">
                  BPJS Kesehatan <span className="text-slate-400 font-normal">(Aktif)</span>
                </span>
                
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 sm:gap-1.5 text-slate-600 w-full sm:w-auto mt-1 sm:mt-0">
                  <Phone className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-400" />
                  0812-1234-5678
                </span>
              </div>
            </div>
          </div>

          {/* Right Area: Visit Info Cards & Action Buttons */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full xl:w-auto">
            
            {/* Middle: Visit Quick Badges (Grid 2 kolom di mobile, sejajar di desktop) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full md:w-auto">
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-lg px-3 py-2 sm:py-1.5 text-left w-full sm:min-w-[85px]">
                <p className="text-[10px] text-slate-400 font-medium">No. Antrian</p>
                <p className="font-bold text-slate-900 text-xs mt-0.5">A013</p>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/80 rounded-lg px-3 py-2 sm:py-1.5 text-left w-full sm:min-w-[85px]">
                <p className="text-[10px] text-slate-400 font-medium">Poli</p>
                <p className="font-bold text-slate-900 text-xs mt-0.5">Poli Anak</p>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/80 rounded-lg px-3 py-2 sm:py-1.5 text-left w-full sm:min-w-[85px]">
                <p className="text-[10px] text-slate-400 font-medium">Dokter</p>
                <p className="font-bold text-slate-900 text-xs mt-0.5">dr. Bima</p>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/80 rounded-lg px-3 py-2 sm:py-1.5 text-left w-full sm:min-w-[85px]">
                <p className="text-[10px] text-slate-400 font-medium">Waktu</p>
                <p className="font-bold text-slate-900 text-xs mt-0.5">08:05 WIB</p>
              </div>
            </div>

            {/* Action Buttons (Full width sejajar di mobile) */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex justify-center items-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors whitespace-nowrap">
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                Kembali
              </button>

              <button className="flex-1 md:flex-none flex justify-center items-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors whitespace-nowrap">
                <History className="w-3.5 h-3.5 text-slate-600" />
                Riwayat
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Sub-Navigation Tabs dengan Horizontal Scroll di Mobile */}
      <div className="px-4 sm:px-6 flex items-center gap-6 border-t border-slate-100 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              // Gunakan onTabChange dari props saat diklik
              onClick={() => onTabChange(tab)}
              className={`py-3 text-[11px] sm:text-xs font-semibold relative transition-colors whitespace-nowrap ${
                isActive ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-cyan-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}