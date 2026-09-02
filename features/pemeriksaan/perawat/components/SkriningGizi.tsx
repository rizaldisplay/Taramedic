"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp } from "lucide-react";

// Types untuk MNA Screening Form
type MnaState = {
  asupanMakanan: number; // 0: Penurunan berat, 1: Sedang, 2: Tidak ada penurunan
  penurunanBB: number; // 0: >3 kg, 1: Tidak tahu, 2: 1-3 kg, 3: Tidak ada penurunan
  mobilitas: number; // 0: Kasur/kursi roda, 1: Dapat bangkit tapi tak keluar, 2: Normal/bebas
  penyakitAkut: number; // 0: Ya, 2: Tidak
  bmiScore: number; // 0: <19, 1: 19 - <21, 2: 21 - <23, 3: >=23
  bmiValueInput: string; // Tampilan angka IMT (contoh: 18.5)
  rekomendasiCustom: string;
};

export default function MiniNutritionalAssessment() {
  const [formData, setFormData] = useState<MnaState>({
    asupanMakanan: 2,
    penurunanBB: 3,
    mobilitas: 2,
    penyakitAkut: 2,
    bmiScore: 2,
    bmiValueInput: "18.5",
    rekomendasiCustom:
      "Pertahankan pola makan seimbang. Monitor status gizi secara berkala.",
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Kalkulasi Skor Total MNA Screening (Skor maksimal = 14)
  const totalScore = useMemo(() => {
    return (
      Number(formData.asupanMakanan) +
      Number(formData.penurunanBB) +
      Number(formData.mobilitas) +
      Number(formData.penyakitAkut) +
      Number(formData.bmiScore)
    );
  }, [formData]);

  // Evaluasi Status Gizi berdasarkan Skor Total MNA
  const nutritionStatus = useMemo(() => {
    if (totalScore >= 12) {
      return {
        label: "Status Gizi Normal",
        badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
        defaultRecommendation:
          "Pertahankan pola makan seimbang. Monitor status gizi secara berkala.",
      };
    } else if (totalScore >= 8) {
      return {
        label: "Beresiko Malnutrisi",
        badgeBg: "bg-yellow-100 text-yellow-700 border-yellow-200",
        defaultRecommendation:
          "Lakukan asesmen gizi lebih mendalam dan pemantauan asupan makan mingguan.",
      };
    } else {
      return {
        label: "Malnutrisi",
        badgeBg: "bg-red-100 text-red-700 border-red-200",
        defaultRecommendation:
          "Konsul ke Ahli Gizi / Dietisien untuk penanganan intervensi nutrisi khusus.",
      };
    }
  }, [totalScore]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rekomendasiCustom" || name === "bmiValueInput" ? value : Number(value),
    }));
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-lg border border-slate-200 shadow-sm text-slate-800 text-xs">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-cyan-600 text-white font-bold text-[11px]">
            2
          </span>
          <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase">
            SKRINING GIZI – Mini Nutritional Assessment (MNA)
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium text-[11px]">08:15 WIB</span>
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
          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* 1. Asupan Makanan Menurun */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Asupan makanan menurun
              </label>
              <select
                name="asupanMakanan"
                value={formData.asupanMakanan}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={2}>Tidak</option>
                <option value={1}>Sedang</option>
                <option value={0}>Berat</option>
              </select>
            </div>

            {/* 2. Penurunan Berat Badan */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Penurunan berat badan
              </label>
              <select
                name="penurunanBB"
                value={formData.penurunanBB}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={3}>Tidak ada</option>
                <option value={2}>1 - 3 kg</option>
                <option value={1}>Tidak tahu</option>
                <option value={0}>&gt; 3 kg</option>
              </select>
            </div>

            {/* 3. Mobilitas */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Mobilitas
              </label>
              <select
                name="mobilitas"
                value={formData.mobilitas}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={2}>Normal / Bebas</option>
                <option value={1}>Dapat bangun dari tempat tidur</option>
                <option value={0}>Terbatas di kasur / kursi roda</option>
              </select>
            </div>

            {/* 4. Penyakit Akut / Stres */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Penyakit akut / stres
              </label>
              <select
                name="penyakitAkut"
                value={formData.penyakitAkut}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              >
                <option value={2}>Tidak</option>
                <option value={0}>Ya</option>
              </select>
            </div>

            {/* 5. Indeks Massa Tubuh (IMT / BMI) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600 truncate">
                Indeks Massa Tubuh (IMT)
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="bmiValueInput"
                  value={formData.bmiValueInput}
                  onChange={handleChange}
                  placeholder="18.5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md pl-2.5 pr-8 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
                <span className="absolute right-2.5 text-[10px] text-slate-400 font-medium select-none">
                  kg/m²
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Section: Total Score & Action / Recommendation */}
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
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${nutritionStatus.badgeBg}`}
                >
                  {nutritionStatus.label}
                </span>
              </div>
            </div>

            {/* Recommendation Field */}
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
                  placeholder={nutritionStatus.defaultRecommendation}
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