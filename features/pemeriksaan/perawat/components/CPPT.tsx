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
    date: '12 Mei 2024',
    role: 'Perawat',
    author: 'Admin Perawat',
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
    date: '12 Mei 2024',
    role: 'Dokter',
    author: 'dr. Bima',
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
    date: '12 Mei 2024',
    role: 'Perawat',
    author: 'Admin Perawat',
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
      ? 'bg-blue-50 text-blue-600'
      : 'bg-green-50 text-green-600';
  };

  const getTimelineDotStyle = (role: Role) => {
    return role === 'Perawat' ? 'bg-blue-600' : 'bg-green-600';
  };

  // Helper untuk merender isi SOAP (teks biasa atau list)
  const renderSOAPContent = (content: string | string[], isPlan = false) => {
    if (Array.isArray(content)) {
      if (isPlan) {
        return (
          <ol className="list-decimal pl-4 space-y-1">
            {content.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="list-disc pl-4 space-y-1">
          {content.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="whitespace-pre-line">{content}</p>;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-lg">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8 border-b pb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            CPPT (Catatan Perkembangan Pasien Terintegrasi)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Dokumentasi perkembangan kondisi dan rencana pelayanan pasien pada kunjungan ini.
          </p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors whitespace-nowrap">
          <Plus size={16} />
          Tambah Entri
        </button>
      </div>

      {/* Timeline Section */}
      <div className="relative">
        {cpptData.map((entry, index) => (
          <div key={entry.id} className="relative flex flex-col md:flex-row gap-3 md:gap-6 mb-6 md:mb-8 last:mb-0">
            
            {/* Meta Info (Mobile: Horizontal di atas, Desktop: Vertikal di kiri) */}
            <div className="md:w-28 flex-shrink-0 flex flex-wrap md:flex-col items-center md:items-end justify-start gap-2 md:gap-0 pt-1 text-left md:text-right">
              <div className="flex items-center gap-2 md:block">
                <span className="text-sm font-bold md:font-medium text-gray-900">{entry.time}</span>
                <span className="text-xs text-gray-500 md:block md:mb-2">{entry.date}</span>
              </div>
              <div className="flex items-center gap-2 md:block">
                <span className={`px-2 py-0.5 rounded text-[10px] md:text-xs font-medium md:inline-block md:mb-1 ${getRoleBadgeStyle(entry.role)}`}>
                  {entry.role}
                </span>
                <span className="text-xs text-gray-600 font-medium md:font-normal md:block">{entry.author}</span>
              </div>
            </div>

            {/* Timeline Line & Dot (Hanya tampil di Desktop/md ke atas) */}
            <div className="hidden md:flex relative flex-col items-center w-6">
              <div className={`w-3.5 h-3.5 rounded-full z-10 mt-1.5 outline outline-4 outline-white ${getTimelineDotStyle(entry.role)}`} />
              {index !== cpptData.length - 1 && (
                <div className="w-px h-full bg-gray-200 absolute top-4" />
              )}
            </div>

            {/* SOAP Card */}
            <div className="flex-1 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="p-4 relative">
                
                {/* Action Buttons */}
                <div className="absolute top-3 right-2 sm:top-4 sm:right-4 flex gap-0.5 sm:gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* SOAP Rows (Mobile: Atas-bawah, Desktop: Kiri-kanan) */}
                <div className="space-y-4 pr-10 sm:pr-12 text-sm text-gray-700 mt-2 sm:mt-0">
                  {/* Subjektif */}
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                    <div className="w-fit sm:w-32 flex-shrink-0 bg-indigo-50 text-indigo-700 px-2.5 py-1 sm:py-1.5 rounded-md font-medium text-[11px] sm:text-xs">
                      S (Subjektif)
                    </div>
                    <div className="flex-1 sm:pt-1">{renderSOAPContent(entry.soap.s)}</div>
                  </div>
                  
                  <hr className="border-gray-100" />

                  {/* Objektif */}
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                    <div className="w-fit sm:w-32 flex-shrink-0 bg-emerald-50 text-emerald-700 px-2.5 py-1 sm:py-1.5 rounded-md font-medium text-[11px] sm:text-xs">
                      O (Objektif)
                    </div>
                    <div className="flex-1 sm:pt-1">{renderSOAPContent(entry.soap.o)}</div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Assessment */}
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                    <div className="w-fit sm:w-32 flex-shrink-0 bg-purple-50 text-purple-700 px-2.5 py-1 sm:py-1.5 rounded-md font-medium text-[11px] sm:text-xs">
                      A (Assessment)
                    </div>
                    <div className="flex-1 sm:pt-1">{renderSOAPContent(entry.soap.a)}</div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Plan */}
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                    <div className="w-fit sm:w-32 flex-shrink-0 bg-amber-50 text-amber-700 px-2.5 py-1 sm:py-1.5 rounded-md font-medium text-[11px] sm:text-xs">
                      P (Plan)
                    </div>
                    <div className="flex-1 sm:pt-1">{renderSOAPContent(entry.soap.p, true)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Alert Footer */}
      <div className="mt-6 flex items-start gap-3 p-3 sm:p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-700">
        <Info size={20} className="flex-shrink-0 mt-0.5 text-blue-500" />
        <p className="text-xs sm:text-sm">CPPT akan berlanjut oleh tenaga kesehatan lain sesuai kewenangannya.</p>
      </div>

    </div>
  );
}