"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp } from "lucide-react";

// Types untuk opsi penilaian Morse Fall Scale
type MorseState = {
  riwayatJatuh: number; // 0: Tidak, 25: Ya
  diagnosisSekunder: number; // 0: Tidak, 15: Ya
  alatBantuBerjalan: number; // 0: Tidak / Bed rest, 15: Tongkat / Alat penopang, 30: Mendorong furnitur
  terpasangInfus: number; // 0: Tidak, 20: Ya
  gayaBerjalan: number; // 0: Normal / Bed rest, 10: Lemah, 20: Terganggu / Terpincang
  statusMental: number; // 0: Orientasi baik, 15: Lupa keterbatasan / Tidak sadar diri
  rekomendasiCustom: string;
};

export default function MorseFallScale() {
  const [formData, setFormData] = useState<MorseState>({
    riwayatJatuh: 0,
    diagnosisSekunder: 0,
    alatBantuBerjalan: 0,
    terpasangInfus: 0,
    gayaBerjalan: 0,
    statusMental: 0,
    rekomendasiCustom: "Pertahankan upaya pencegahan jatuh standar.",
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Kalkulasi Skor Total
  const totalScore = useMemo(() => {
    return (
      Number(formData.riwayatJatuh) +
      Number(formData.diagnosisSekunder) +
      Number(formData.alatBantuBerjalan) +
      Number(formData.terpasangInfus) +
      Number(formData.gayaBerjalan) +
      Number(formData.statusMental)
    );
  }, [formData]);

  // Evaluasi Risiko berdasarkan Skor Total
  const riskAssessment = useMemo(() => {
    if (totalScore >= 45) {
      return {
        label: "Risiko Tinggi",
        badgeBg: "bg-red-100 text-red-700 border-red-200",
        defaultRecommendation:
          "Lakukan intervensi risiko jatuh tinggi (pasang gelang kuning, kunci roda tempat tidur, dampingi saat mobilitas).",
      };
    } else if (totalScore >= 25) {
      return {
        label: "Risiko Sedang",
        badgeBg: "bg-yellow-100 text-yellow-700 border-yellow-200",
        defaultRecommendation:
          "Lakukan intervensi risiko jatuh sedang (edukasi pasien/keluarga, pastikan pencerahan ruangan cukup).",
      };
    } else {
      return {
        label: "Risiko Rendah",
        badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
        defaultRecommendation: "Pertahankan upaya pencegahan jatuh standar.",
      };
    }
  }, [totalScore]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rekomendasiCustom" ? value : Number(value),
    }));
  };

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 shadow-sm text-slate-800 text-xs">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-cyan-600 text-white font-bold text-[11px]">
            1
          </span>
          <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase">
            RISIKO JATUH – Morse Fall Scale
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium text-[11px]">08:12 WIB</span>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <ChevronUp
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Form Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Grid Select Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* 1. Riwayat Jatuh */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">
                Riwayat jatuh
              </label>
              <select
                name="riwayatJatuh"
                value={formData.riwayatJatuh}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Tidak</option>
                <option value={25}>Ya</option>
              </select>
            </div>

            {/* 2. Diagnosis Sekunder */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">
                Diagnosis sekunder
              </label>
              <select
                name="diagnosisSekunder"
                value={formData.diagnosisSekunder}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Tidak</option>
                <option value={15}>Ya</option>
              </select>
            </div>

            {/* 3. Alat Bantu Berjalan */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Alat bantu berjalan
              </label>
              <select
                name="alatBantuBerjalan"
                value={formData.alatBantuBerjalan}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Tidak</option>
                <option value={15}>Tongkat / Alat Penopang</option>
                <option value={30}>Mendorong Furnitur</option>
              </select>
            </div>

            {/* 4. Terpasang Infus */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Terpasang infus/terapi IV
              </label>
              <select
                name="terpasangInfus"
                value={formData.terpasangInfus}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Tidak</option>
                <option value={20}>Ya</option>
              </select>
            </div>

            {/* 5. Gaya Berjalan */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">
                Gaya berjalan
              </label>
              <select
                name="gayaBerjalan"
                value={formData.gayaBerjalan}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Normal / Bed rest</option>
                <option value={10}>Lemah</option>
                <option value={20}>Terganggu / Terpincang</option>
              </select>
            </div>

            {/* 6. Status Mental */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">
                Status mental
              </label>
              <select
                name="statusMental"
                value={formData.statusMental}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Orientasi baik</option>
                <option value={15}>Lupa keterbatasan</option>
              </select>
            </div>
          </div>

          {/* Bottom Section: Total Score & Action/Recommendation */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
            {/* Score & Badge */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-600">
                Skor Total
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 leading-none">
                  {totalScore}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${riskAssessment.badgeBg}`}
                >
                  {riskAssessment.label}
                </span>
              </div>
            </div>

            {/* Tindakan / Rekomendasi Field */}
            <div className="flex-1 w-full max-w-xl flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">
                Tindakan / Rekomendasi
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="rekomendasiCustom"
                  maxLength={300}
                  value={formData.rekomendasiCustom}
                  onChange={handleChange}
                  placeholder={riskAssessment.defaultRecommendation}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white pr-14"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                  {formData.rekomendasiCustom.length} / 300
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}