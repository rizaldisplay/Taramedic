'use client';

import React from 'react';
import { Plus, Pencil, MoreVertical, Info } from 'lucide-react';

// --- Types & Interfaces ---
type Role = 'Perawat' | 'Dokter';

interface SOAPData {
  s: string;
  o: string | string[];
  a: string;
  p: string | string[];
}

interface CPPTEntry {
  id: string;
  time: string;
  date: string;
  role: Role;
  author: string;
  soap: SOAPData;
}

// --- Mock Data berdasarkan gambar referensi ---
const cpptData: CPPTEntry[] = [
  {
    id: '1',
    time: '08:25 WIB',
    date: '16/08/2026',
    role: 'Perawat',
    author: 'Siti Rahma, A.Md.Kep',
    soap: {
      s: 'Demam sejak 2 hari, badan terasa lemas. Nafsu makan menurun.',
      o: [
        'TTV: TD 120/80 mmHg, Nadi 82 x/menit, RR 20 x/menit, Suhu 36.7 °C, SpO2 98%',
        'Kesadaran compos mentis, keadaan umum baik.',
        'Nyeri tekan ringan pada abdomen kanan bawah.'
      ],
      a: 'Kondisi umum baik.\nMasalah keperawatan: Risiko hipertermia.',
      p: [
        'Monitor suhu tiap 4 jam.',
        'Berikan kompres hangat.',
        'Edukasi keluarga mengenai tanda bahaya.',
        'Pasien diteruskan untuk pemeriksaan dokter.'
      ]
    }
  },
  {
    id: '2',
    time: '08:45 WIB',
    date: '16/08/2026',
    role: 'Dokter',
    author: 'dr. Bima, Sp.A',
    soap: {
      s: 'Demam masih dirasakan, tidak ada batuk, tidak sesak.',
      o: [
        'Keadaan umum baik, compos mentis.',
        'TTV: TD 118/78 mmHg, Nadi 84 x/menit, RR 20 x/menit, Suhu 37.8 °C, SpO2 98%',
        'Tenggorokan hiperemis, tidak ada tonsil membesar.',
        'Abdomen: nyeri tekan (-), peristaltik (+).'
      ],
      a: 'Gastroenteritis akut.',
      p: [
        'Terapi: Parasetamol syrup 3x5 mL.',
        'Oralit 3x100 mL.',
        'Kontrol 3 hari atau bila keluhan memberat.',
        'Edukasi: cairan cukup, makan bertahap.'
      ]
    }
  },
  {
    id: '3',
    time: '09:05 WIB',
    date: '16/08/2026',
    role: 'Perawat',
    author: 'Siti Rahma, A.Md.Kep',
    soap: {
      s: '---',
      o: 'Suhu 37.2 °C, anak tampak lebih segar, minum oralit habis.',
      a: 'Kondisi membaik.',
      p: 'Lanjutkan terapi dan edukasi sesuai instruksi dokter.'
    }
  }
];

export default function TabCPPT() {
  // Helper untuk styling badge role
  const getRoleBadgeStyle = (role: Role) => {
    return role === 'Perawat'
      ? 'bg-blue-50 text-blue-600 border-blue-100'
      : 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  const getTimelineDotStyle = (role: Role) => {
    return role === 'Perawat' ? 'bg-blue-600' : 'bg-emerald-600';
  };

  // Helper untuk merender isi SOAP (teks biasa atau list)
  const renderSOAPContent = (content: string | string[], isPlan = false) => {
    if (Array.isArray(content)) {
      if (isPlan) {
        return (
          <ol className="list-decimal pl-4 space-y-0.5 text-[12px]">
            {content.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="list-disc pl-4 space-y-0.5 text-[12px]">
          {content.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="whitespace-pre-line text-[12px]">{content}</p>;
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
            CPPT (CATATAN PERKEMBANGAN PASIEN TERINTEGRASI)
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Dokumentasi perkembangan kondisi dan rencana pelayanan pasien pada kunjungan ini.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold hover:bg-blue-100/70 transition-all cursor-pointer">
          <Plus size={14} />
          <span>Tambah Entri</span>
        </button>
      </div>

      {/* Timeline Section */}
      <div className="relative">
        {cpptData.map((entry, index) => (
          <div key={entry.id} className="relative flex flex-col md:flex-row gap-3 md:gap-5 mb-5 last:mb-0">
            
            {/* Meta Info */}
            <div className="md:w-28 flex-shrink-0 flex flex-wrap md:flex-col items-center md:items-end justify-start gap-2 md:gap-0.5 pt-0.5 text-left md:text-right">
              <span className="text-xs font-bold text-gray-800">{entry.time}</span>
              <span className="text-[10px] text-gray-400 font-medium md:mb-1.5">{entry.date}</span>
              
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleBadgeStyle(entry.role)}`}>
                {entry.role}
              </span>
              <span className="text-[11px] text-gray-600 font-medium md:mt-0.5">{entry.author}</span>
            </div>

            {/* Timeline Line & Dot (Desktop) */}
            <div className="hidden md:flex relative flex-col items-center w-5">
              <div className={`w-3 h-3 rounded-full z-10 mt-1.5 ring-4 ring-white ${getTimelineDotStyle(entry.role)}`} />
              {index !== cpptData.length - 1 && (
                <div className="w-px h-full bg-gray-200 absolute top-3" />
              )}
            </div>

            {/* SOAP Card */}
            <div className="flex-1 border border-gray-200 rounded-lg bg-white shadow-2xs overflow-hidden">
              <div className="p-3.5 relative">
                
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                    <Pencil size={14} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                    <MoreVertical size={14} />
                  </button>
                </div>

                {/* SOAP Rows */}
                <div className="space-y-2.5 pr-14 text-[12px] text-gray-700">
                  {/* Subjektif */}
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                    <div className="w-fit sm:w-28 flex-shrink-0 bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded font-bold text-[10px] text-center">
                      S (Subjektif)
                    </div>
                    <div className="flex-1 text-gray-800">{renderSOAPContent(entry.soap.s)}</div>
                  </div>
                  
                  <hr className="border-gray-100" />

                  {/* Objektif */}
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                    <div className="w-fit sm:w-28 flex-shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded font-bold text-[10px] text-center">
                      O (Objektif)
                    </div>
                    <div className="flex-1 text-gray-800">{renderSOAPContent(entry.soap.o)}</div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Assessment */}
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                    <div className="w-fit sm:w-28 flex-shrink-0 bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded font-bold text-[10px] text-center">
                      A (Assessment)
                    </div>
                    <div className="flex-1 text-gray-800">{renderSOAPContent(entry.soap.a)}</div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Plan */}
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                    <div className="w-fit sm:w-28 flex-shrink-0 bg-amber-50 text-amber-700 border border-amber-200/70 px-2 py-0.5 rounded font-bold text-[10px] text-center">
                      P (Plan)
                    </div>
                    <div className="flex-1 text-gray-800">{renderSOAPContent(entry.soap.p, true)}</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Info Alert Footer */}
      <div className="mt-5 flex items-center gap-2 pt-3 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
        <Info size={13} className="text-gray-400 shrink-0" />
        <span>CPPT akan berlanjut oleh tenaga kesehatan lain sesuai kewenangannya.</span>
      </div>

    </div>
  );
}