"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp } from "lucide-react";

type SkriningNyeriState = {
  skalaNyeri: number; // 0 - 10
  karakterNyeri: string;
  lokasiNyeri: string;
  sifatNyeri: string;
  rekomendasiCustom: string;
};

export default function SkriningNyeri() {
  const [formData, setFormData] = useState<SkriningNyeriState>({
    skalaNyeri: 2,
    karakterNyeri: "Nyeri ringan",
    lokasiNyeri: "Abdomen kanan bawah",
    sifatNyeri: "Menekan",
    rekomendasiCustom: "Observasi dan tata laksana sesuai indikasi.",
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Evaluasi Otomatis berdasarkan Skala Nyeri (NRS)
  const painAssessment = useMemo(() => {
    const score = formData.skalaNyeri;
    if (score === 0) {
      return {
        label: "Tidak Nyeri",
        badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
        defaultRecommendation: "Tidak diperlukan intervensi nyeri spesifik.",
      };
    } else if (score <= 3) {
      return {
        label: "Nyeri Ringan",
        badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
        defaultRecommendation: "Observasi dan tata laksana sesuai indikasi.",
      };
    } else if (score <= 6) {
      return {
        label: "Nyeri Sedang",
        badgeBg: "bg-yellow-100 text-yellow-700 border-yellow-200",
        defaultRecommendation:
          "Pemberian analgetik sesuai advis dokter, edukasi teknik relaksasi.",
      };
    } else {
      return {
        label: "Nyeri Berat",
        badgeBg: "bg-red-100 text-red-700 border-red-200",
        defaultRecommendation:
          "Kolaborasi penanganan nyeri berat/kronis, evaluasi ulang dalam 30-60 menit.",
      };
    }
  }, [formData.skalaNyeri]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "skalaNyeri" ? Number(value) : value,
    }));
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-lg border border-slate-200 shadow-sm text-slate-800 text-xs">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-blue-600 text-white font-bold text-[11px]">
            3
          </span>
          <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase">
            SKRINING NYERI
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium text-[11px]">08:16 WIB</span>
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
          {/* Main Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Slider Skala Nyeri (NRS 0-10) - Mengambil 6 Kolom */}
            <div className="lg:col-span-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-600">
                  Skala Nyeri (NRS 0–10)
                </label>
                <span className="text-xs font-bold text-blue-600">
                  Nilai: {formData.skalaNyeri}
                </span>
              </div>

              <div className="px-1 py-1">
                <input
                  type="range"
                  name="skalaNyeri"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.skalaNyeri}
                  onChange={handleChange}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                {/* Tanda Angka Slider */}
                <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5 mt-1">
                  <span>0</span>
                  <span>2</span>
                  <span>4</span>
                  <span>6</span>
                  <span>8</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            {/* Dropdowns Section - Mengambil 6 Kolom sisanya */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Karakter Nyeri */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-600 truncate">
                  Karakter Nyeri
                </label>
                <select
                  name="karakterNyeri"
                  value={formData.karakterNyeri}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="Tidak ada">Tidak ada</option>
                  <option value="Nyeri ringan">Nyeri ringan</option>
                  <option value="Nyeri tumpul">Nyeri tumpul</option>
                  <option value="Nyeri tajam">Nyeri tajam</option>
                  <option value="Nyeri terbakar">Nyeri terbakar</option>
                </select>
              </div>

              {/* Lokasi Nyeri */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-600 truncate">
                  Lokasi Nyeri
                </label>
                <select
                  name="lokasiNyeri"
                  value={formData.lokasiNyeri}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="Tidak ada">Tidak ada</option>
                  <option value="Abdomen kanan bawah">Abdomen kanan bawah</option>
                  <option value="Kepala">Kepala</option>
                  <option value="Dada">Dada</option>
                  <option value="Punggung">Punggung</option>
                  <option value="Ekstremitas atas">Ekstremitas atas</option>
                  <option value="Ekstremitas bawah">Ekstremitas bawah</option>
                </select>
              </div>

              {/* Sifat Nyeri */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-600 truncate">
                  Sifat Nyeri
                </label>
                <select
                  name="sifatNyeri"
                  value={formData.sifatNyeri}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="Tidak ada">Tidak ada</option>
                  <option value="Menekan">Menekan</option>
                  <option value="Hilang timbul">Hilang timbul</option>
                  <option value="Mencengkeram">Mencengkeram</option>
                  <option value="Terus menerus">Terus menerus</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Section: Recommendation */}
          <div className="pt-2 flex flex-col gap-1">
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
                placeholder={painAssessment.defaultRecommendation}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white pr-14"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                {formData.rekomendasiCustom.length} / 300
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}