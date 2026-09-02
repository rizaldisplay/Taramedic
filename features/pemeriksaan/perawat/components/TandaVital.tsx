'use client'; // <-- WAJIB ditambahkan untuk Next.js App Router

import React, { useState, ChangeEvent } from 'react';
import { Activity, Heart, Wind, Thermometer, Percent } from 'lucide-react';

interface VitalSignsData {
  systolic: string;
  diastolic: string;
  heartRate: string;
  respiratoryRate: string;
  temperature: string;
  spo2: string;
}

export default function TandaVital() {
  const [vitals, setVitals] = useState<VitalSignsData>({
    systolic: '120',
    diastolic: '80',
    heartRate: '82',
    respiratoryRate: '20',
    temperature: '36.7',
    spo2: '98',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-5xl p-6 bg-white rounded-xl border border-gray-200 shadow-sm font-sans">
      {/* Header Bagian */}
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-600 text-white font-bold text-xs">
          A
        </span>
        <h2 className="text-sm font-bold tracking-wider text-gray-800 uppercase">
          Tanda Vital
        </h2>
      </div>

      {/* Grid Form Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Tekanan Darah */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-cyan-200 transition-all">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            Tekanan Darah
          </label>
          <div className="relative flex items-center">
            <div className="flex items-center w-full bg-white border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-cyan-500">
              <input
                type="text"
                name="systolic"
                value={vitals.systolic}
                onChange={handleChange}
                placeholder="120"
                className="w-full px-2.5 py-1.5 text-sm font-medium text-gray-800 text-right outline-none"
              />
              <span className="text-gray-400 text-xs px-0.5">/</span>
              <input
                type="text"
                name="diastolic"
                value={vitals.diastolic}
                onChange={handleChange}
                placeholder="80"
                className="w-full px-2.5 py-1.5 text-sm font-medium text-gray-800 text-left outline-none"
              />
            </div>
            <span className="ml-2 text-xs text-gray-400 font-medium whitespace-nowrap">
              mmHg
            </span>
          </div>
        </div>

        {/* Nadi */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-cyan-200 transition-all">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-500" />
            Nadi
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              name="heartRate"
              value={vitals.heartRate}
              onChange={handleChange}
              placeholder="80"
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
            <span className="ml-2 text-xs text-gray-400 font-medium whitespace-nowrap">
              x/menit
            </span>
          </div>
        </div>

        {/* Respirasi */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-cyan-200 transition-all">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-teal-500" />
            Respirasi
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              name="respiratoryRate"
              value={vitals.respiratoryRate}
              onChange={handleChange}
              placeholder="20"
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
            <span className="ml-2 text-xs text-gray-400 font-medium whitespace-nowrap">
              x/menit
            </span>
          </div>
        </div>

        {/* Suhu */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-cyan-200 transition-all">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-orange-500" />
            Suhu
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={vitals.temperature}
              onChange={handleChange}
              placeholder="36.5"
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
            <span className="ml-2 text-xs text-gray-400 font-medium whitespace-nowrap">
              °C
            </span>
          </div>
        </div>

        {/* SpO2 */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-cyan-200 transition-all">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-indigo-500" />
            SpO₂
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              name="spo2"
              value={vitals.spo2}
              onChange={handleChange}
              placeholder="98"
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
            <span className="ml-2 text-xs text-gray-400 font-medium whitespace-nowrap">
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}