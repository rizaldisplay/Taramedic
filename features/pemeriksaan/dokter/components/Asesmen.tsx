'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  ChevronDown, 
  Clock 
} from 'lucide-react';


export default function AsesmenDanDiagnosis() {

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* SECTION A: ASESMEN (Clinical Impression) */}
      <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        {/* Header Asesmen */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded text-xs font-bold shadow-sm">
              <FileText size={12} />
            </div>
            <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
              ASESMEN <span className="text-gray-400 font-normal lowercase">(Clinical Impression)</span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Clock size={13} className="text-gray-400" />
            <span>Waktu Asesmen: 08:50 WIB</span>
          </div>
        </div>

        {/* Sub-label & Textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] text-gray-500 font-semibold">
            Penilaian Klinis / Clinical Reasoning
          </label>
          <div className="relative">
            <textarea 
              className="w-full border border-gray-200 rounded-lg p-3 text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[110px] resize-y"
              defaultValue="Pasien mengeluh demam sejak 2 hari disertai badan lemas dan nafsu makan menurun. Tanda vital dalam batas normal. Tidak ditemukan tanda distress pernapasan. Gambaran klinis sesuai dengan gastroenteritis akut."
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-medium bg-white px-1">
              198 / 2000
            </div>
          </div>
        </div>

        {/* Template Asesmen Button */}
        <div className="mt-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer shadow-2xs">
            <FileText size={13} className="text-blue-600" />
            <span>Template Asesmen</span>
            <ChevronDown size={13} className="text-gray-400 ml-1" />
          </button>
        </div>
      </div>

    </div>
  );
}