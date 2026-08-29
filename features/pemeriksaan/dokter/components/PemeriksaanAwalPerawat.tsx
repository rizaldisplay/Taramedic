import React from 'react';

// Mendefinisikan interface untuk tipe data pemeriksaan
export interface NurseExaminationData {
  bloodPressure: string; // TD
  heartRate: string;     // Nadi
  respiration: string;   // Respirasi
  temperature: string;   // Suhu
  spo2: string;          // SpO2
  consciousness: string; // Kesadaran
  painScale: string;     // Nyeri
  time: string;
}

interface PemeriksaanAwalPerawatProps {
  data?: NurseExaminationData;
}

export default function PemeriksaanAwalPerawat({ data }: PemeriksaanAwalPerawatProps) {
  // Mock data default untuk menyesuaikan dengan tampilan desain UI
  const examination = data || {
    bloodPressure: '120/80',
    heartRate: '82',
    respiration: '20',
    temperature: '36.7',
    spo2: '98',
    consciousness: 'Compos Mentis',
    painScale: '2 (Ringan)',
    time: '08:25 WIB',
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Badge 'A' */}
          <div className="flex items-center justify-center w-6 h-6 bg-cyan-600 text-white rounded text-sm font-bold">
            A
          </div>
          
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Pemeriksaan Awal Perawat
          </h2>
          
          {/* Tag Data dari Perawat */}
          <span className="bg-purple-50 text-purple-600 text-[11px] px-2.5 py-1 rounded-md font-medium border border-purple-100">
            Data dari Perawat
          </span>
        </div>

        {/* Info Sumber & Waktu */}
        <div className="text-xs text-gray-500 font-medium">
          Sumber: Perawat &bull; {examination.time}
        </div>
      </div>

      {/* Tanda Vital (Baris Pertama) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        {/* TD */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <p className="text-xs text-gray-500 mb-1">TD</p>
          <div className="flex items-end justify-between">
            <span className="text-lg font-bold text-gray-900">{examination.bloodPressure}</span>
            <span className="text-xs text-gray-400 font-medium mb-0.5">mmHg</span>
          </div>
        </div>

        {/* Nadi */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <p className="text-xs text-gray-500 mb-1">Nadi</p>
          <div className="flex items-end justify-between">
            <span className="text-lg font-bold text-gray-900">{examination.heartRate}</span>
            <span className="text-xs text-gray-400 font-medium mb-0.5">x/menit</span>
          </div>
        </div>

        {/* Respirasi */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <p className="text-xs text-gray-500 mb-1">Respirasi</p>
          <div className="flex items-end justify-between">
            <span className="text-lg font-bold text-gray-900">{examination.respiration}</span>
            <span className="text-xs text-gray-400 font-medium mb-0.5">x/menit</span>
          </div>
        </div>

        {/* Suhu */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <p className="text-xs text-gray-500 mb-1">Suhu</p>
          <div className="flex items-end justify-between">
            <span className="text-lg font-bold text-gray-900">{examination.temperature}</span>
            <span className="text-xs text-gray-400 font-medium mb-0.5">&deg;C</span>
          </div>
        </div>

        {/* SpO2 */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <p className="text-xs text-gray-500 mb-1">SpO2</p>
          <div className="flex items-end justify-between">
            <span className="text-lg font-bold text-gray-900">{examination.spo2}</span>
            <span className="text-xs text-gray-400 font-medium mb-0.5">%</span>
          </div>
        </div>
      </div>

      {/* Kondisi Tambahan (Baris Kedua) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Kesadaran */}
        <div className="lg:col-span-1 border border-gray-200 rounded-lg p-3 bg-white">
          <p className="text-xs text-gray-500 mb-1">Kesadaran</p>
          <div className="flex items-end justify-between mt-1">
            <span className="text-sm font-semibold text-gray-900">{examination.consciousness}</span>
          </div>
        </div>

        {/* Nyeri */}
        <div className="lg:col-span-2 border border-gray-200 rounded-lg p-3 bg-white">
          <p className="text-xs text-gray-500 mb-1">Nyeri (NRS 0-10)</p>
          <div className="flex items-end justify-between mt-1">
            <span className="text-sm font-semibold text-gray-900">{examination.painScale}</span>
          </div>
        </div>
      </div>
    </div>
  );
}