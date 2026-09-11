"use client";

import React from "react";
import {
  Plus,
  Pencil,
  MoreVertical,
  Info,
  ChevronDown,
  Calendar,
  Filter,
  PlusCircle,
} from "lucide-react";

// --- Types & Interfaces ---
type Role = "Perawat" | "Dokter";

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
    id: "1",
    time: "08:25 WIB",
    date: "16/08/2026",
    role: "Perawat",
    author: "Siti Rahma, A.Md.Kep",
    soap: {
      s: "Demam sejak 2 hari, badan terasa lemas. Nafsu makan menurun.",
      o: [
        "TTV: TD 120/80 mmHg, Nadi 82 x/menit, RR 20 x/menit, Suhu 36.7 °C, SpO2 98%",
        "Kesadaran compos mentis, keadaan umum baik.",
        "Nyeri tekan ringan pada abdomen kanan bawah.",
      ],
      a: "Kondisi umum baik.\nMasalah keperawatan: Risiko hipertermia.",
      p: [
        "Monitor suhu tiap 4 jam.",
        "Berikan kompres hangat.",
        "Edukasi keluarga mengenai tanda bahaya.",
        "Pasien diteruskan untuk pemeriksaan dokter.",
      ],
    },
  },
  {
    id: "2",
    time: "08:45 WIB",
    date: "16/08/2026",
    role: "Dokter",
    author: "dr. Bima, Sp.A",
    soap: {
      s: "Demam masih dirasakan, tidak ada batuk, tidak sesak.",
      o: [
        "Keadaan umum baik, compos mentis.",
        "TTV: TD 118/78 mmHg, Nadi 84 x/menit, RR 20 x/menit, Suhu 37.8 °C, SpO2 98%",
        "Tenggorokan hiperemis, tidak ada tonsil membesar.",
        "Abdomen: nyeri tekan (-), peristaltik (+).",
      ],
      a: "Gastroenteritis akut.",
      p: [
        "Terapi: Parasetamol syrup 3x5 mL.",
        "Oralit 3x100 mL.",
        "Kontrol 3 hari atau bila keluhan memberat.",
        "Edukasi: cairan cukup, makan bertahap.",
      ],
    },
  },
  {
    id: "3",
    time: "09:05 WIB",
    date: "16/08/2026",
    role: "Perawat",
    author: "Siti Rahma, A.Md.Kep",
    soap: {
      s: "---",
      o: "Suhu 37.2 °C, anak tampak lebih segar, minum oralit habis.",
      a: "Kondisi membaik.",
      p: "Lanjutkan terapi dan edukasi sesuai instruksi dokter.",
    },
  },
];

export default function TabCPPT() {
  // Helper untuk styling badge role
  const getRoleBadgeStyle = (role: Role) => {
    return role === "Perawat"
      ? "bg-cyan-50 text-cyan-600 border-cyan-100"
      : "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  const getTimelineDotStyle = (role: Role) => {
    return role === "Perawat" ? "bg-cyan-600" : "bg-emerald-600";
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
    <>
      {/* Header Section */}
      {/* 1. Header & Filter Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 px-6 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900">
            CPPT
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Catatan perkembangan pasien terintegrasi.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Semua Profesi Dropdown */}
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <span>Semua Profesi</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {/* Date Picker Range */}
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar size={14} className="text-gray-400" />
            <span>16/08/2026 – 16/08/2026</span>
          </button>

          {/* Filter Button */}
          <button className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter size={14} className="text-gray-400" />
            <span>Filter</span>
          </button>

          {/* Action Button */}
          <button className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors ml-1">
            <PlusCircle size={15} />
            <span>Entri CPPT</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-5">
        {/* Timeline Section */}
        <div className="relative space-y-5">
          {cpptData.map((entry, index) => (
            <div key={entry.id} className="relative flex gap-4 items-start">
              {/* Timeline Line & Dot Container */}
              <div className="hidden md:flex flex-col items-center self-stretch shrink-0 pt-1">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 z-10 shrink-0 ${getTimelineDotStyle(
                    entry.role,
                  )}`}
                />
                {index !== cpptData.length - 1 && (
                  <div className="w-0.5 bg-gray-200 flex-1 my-1" />
                )}
              </div>

              {/* Left Meta Info (Time, Date, Role, Author) */}
              <div className="w-28 shrink-0 space-y-1 text-left pt-0.5">
                <div className="text-xs font-bold text-gray-900">
                  {entry.time}
                </div>
                <div className="text-[11px] text-gray-400 font-medium">
                  {entry.date}
                </div>

                <div className="pt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${getRoleBadgeStyle(
                      entry.role,
                    )}`}
                  >
                    {entry.role}
                  </span>
                </div>

                <div className="text-xs font-medium text-gray-700 pt-0.5 leading-snug">
                  {entry.author}
                </div>
              </div>

              {/* Clean Integrated SOAP Card */}
              <div className="flex-1 bg-white rounded-xl border border-gray-200/80 shadow-sm flex items-stretch overflow-hidden transition-all hover:border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-4 flex-1 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  {/* S - Subjektif */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[11px] font-bold text-sky-600">
                        S
                      </span>
                      <span className="text-xs font-bold text-sky-600">
                        Subjektif
                      </span>
                    </div>
                    <div className="text-xs text-gray-800 leading-relaxed font-medium">
                      {renderSOAPContent(entry.soap.s)}
                    </div>
                  </div>

                  {/* O - Objektif */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-600">
                        O
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        Objektif
                      </span>
                    </div>
                    <div className="text-xs text-gray-800 leading-relaxed font-medium">
                      {renderSOAPContent(entry.soap.o)}
                    </div>
                  </div>

                  {/* A - Asesmen */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-[11px] font-bold text-purple-600">
                        A
                      </span>
                      <span className="text-xs font-bold text-purple-600">
                        Asesmen
                      </span>
                    </div>
                    <div className="text-xs text-gray-800 leading-relaxed font-medium">
                      {renderSOAPContent(entry.soap.a)}
                    </div>
                  </div>

                  {/* P - Plan */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-700">
                        P
                      </span>
                      <span className="text-xs font-bold text-amber-700">
                        Plan
                      </span>
                    </div>
                    <div className="text-xs text-gray-800 leading-relaxed font-medium">
                      {renderSOAPContent(entry.soap.p, true)}
                    </div>
                  </div>
                </div>

                {/* Action Menu (Kebab) Button */}
                <div className="p-2 border-l border-gray-100 flex items-start bg-gray-50/30">
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Alert Banner */}
        <div className="flex items-center gap-2.5 rounded-lg border border-sky-100 bg-sky-50/80 px-4 py-2.5 text-xs text-sky-800">
          <Info size={15} className="text-sky-600 shrink-0" />
          <span>
            CPPT akan berlanjut oleh tenaga kesehatan lain sesuai kewenangannya.
          </span>
        </div>
      </div>
    </>
  );
}
