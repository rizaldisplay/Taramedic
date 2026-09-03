"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp } from "lucide-react";

// State type untuk Skrining TB
type SkriningTbState = {
  batuk2Minggu: number; // 0: Tidak, 1: Ya
  demamLama: number; // 0: Tidak, 1: Ya
  bbTurunTanpaSebab: number; // 0: Tidak, 1: Ya
  kontakTb: number; // 0: Tidak, 1: Ya
  keringatMalam: number; // 0: Tidak, 1: Ya
  rekomendasiCustom: string;
};

export default function SkriningTB() {
  const [formData, setFormData] = useState<SkriningTbState>({
    batuk2Minggu: 0,
    demamLama: 0,
    bbTurunTanpaSebab: 0,
    kontakTb: 0,
    keringatMalam: 0,
    rekomendasiCustom: "Edukasi dan skrining ulang bila ada keluhan.",
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Evaluasi Otomatis Hasil Skrining TB
  // Jika ada salah satu atau lebih gejala utama/kontak, maka dikategorikan Terduga / Positif Skrining
  const tbResult = useMemo(() => {
    const isSuspect =
      formData.batuk2Minggu === 1 ||
      formData.demamLama === 1 ||
      formData.bbTurunTanpaSebab === 1 ||
      formData.kontakTb === 1 ||
      formData.keringatMalam === 1;

    if (isSuspect) {
      return {
        label: "Terduga TB",
        badgeBg: "bg-red-100 text-red-700 border-red-200",
        defaultRecommendation:
          "Pemeriksaan dahak Sputum BTA / Tes Cepat Molekuler (TCM) & Foto Thorax.",
      };
    } else {
      return {
        label: "Negatif",
        badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
        defaultRecommendation: "Edukasi dan skrining ulang bila ada keluhan.",
      };
    }
  }, [
    formData.batuk2Minggu,
    formData.demamLama,
    formData.bbTurunTanpaSebab,
    formData.kontakTb,
    formData.keringatMalam,
  ]);

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
            4
          </span>
          <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase">
            SKRINING TB
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium text-[11px]">08:18 WIB</span>
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
          {/* Inputs Grid - 5 Kolom Sesuai Gambar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* 1. Batuk >= 2 minggu */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Batuk ≥ 2 minggu
              </label>
              <select
                name="batuk2Minggu"
                value={formData.batuk2Minggu}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Tidak</option>
                <option value={1}>Ya</option>
              </select>
            </div>

            {/* 2. Demam lama */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Demam lama
              </label>
              <select
                name="demamLama"
                value={formData.demamLama}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Tidak</option>
                <option value={1}>Ya</option>
              </select>
            </div>

            {/* 3. BB turun tanpa sebab */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                BB turun tanpa sebab
              </label>
              <select
                name="bbTurunTanpaSebab"
                value={formData.bbTurunTanpaSebab}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Tidak</option>
                <option value={1}>Ya</option>
              </select>
            </div>

            {/* 4. Kontak TB */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Kontak TB
              </label>
              <select
                name="kontakTB"
                value={formData.kontakTb}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Tidak</option>
                <option value={1}>Ya</option>
              </select>
            </div>

            {/* 5. Keringat malam */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Keringat malam
              </label>
              <select
                name="keringatMalam"
                value={formData.keringatMalam}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={0}>Tidak</option>
                <option value={1}>Ya</option>
              </select>
            </div>
          </div>

          {/* Bottom Section: Result Badge & Action / Recommendation */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
            {/* Hasil Badge */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-600">
                Hasil
              </span>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded flex items-center justify-center text-xs font-bold border ${tbResult.badgeBg}`}
                >
                  {tbResult.label}
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
                  placeholder={tbResult.defaultRecommendation}
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