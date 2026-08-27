import React from 'react';
import { 
  UserRound, 
  Briefcase, 
  Brain, 
  Feather, 
  CircleDot, 
  ShieldPlus, 
  Activity, 
  HeartPulse, 
  Wind, 
  Thermometer, 
  Droplet,
  Eye
} from 'lucide-react';

interface PemeriksaanAwalProps {
  onOpenDetailClick?: () => void;
}

export default function PemeriksaanAwal({ onOpenDetailClick }: PemeriksaanAwalProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 gap-2 sm:gap-0">
        <div className="flex items-center gap-2.5">
          <UserRound className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-blue-600 tracking-wide uppercase">
            Pemeriksaan Awal{' '}
            <span className="text-gray-400 font-normal capitalize normal-case">
              (Data dari Perawat)
            </span>
          </h2>
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Perawat &bull; 08:25 WIB
        </div>
      </div>

      {/* Body Section */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column - Pemeriksaan Fisik / Anamnesis */}
        <div className="space-y-5">
          {/* Keluhan Utama */}
          <div className="flex gap-3">
            <Briefcase className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Keluhan utama</p>
              <p className="text-sm font-medium text-gray-800 leading-snug">
                Demam sejak 2 hari, badan terasa lemas.
              </p>
            </div>
          </div>

          {/* Kesadaran */}
          <div className="flex gap-3">
            <Brain className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Kesadaran</p>
              <p className="text-sm font-medium text-gray-800">Compos Mentis</p>
            </div>
          </div>

          {/* Nyeri */}
          <div className="flex gap-3">
            <Feather className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Nyeri</p>
              <p className="text-sm font-medium text-gray-800">2 / 10 (Ringan)</p>
            </div>
          </div>

          {/* Alergi */}
          <div className="flex gap-3">
            <CircleDot className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Alergi</p>
              <p className="text-sm font-medium text-gray-800">Tidak ada alergi</p>
            </div>
          </div>

          {/* Riwayat Penyakit */}
          <div className="flex gap-3">
            <ShieldPlus className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Riwayat penyakit</p>
              <p className="text-sm font-medium text-gray-800">Hipertensi, Diabetes</p>
            </div>
          </div>
        </div>

        {/* Right Column - Vital Sign */}
        <div>
          <div className="bg-gray-50/70 border border-gray-100 rounded-lg p-4 h-full">
            <h3 className="text-xs font-semibold text-gray-700 mb-4">
              Vital Sign (08:25 WIB)
            </h3>
            
            <div className="space-y-4">
              {/* Tekanan Darah (TD) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">TD</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  120/80 <span className="text-xs font-normal text-gray-500">mmHg</span>
                </div>
              </div>

              {/* Nadi */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <HeartPulse className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Nadi</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  82 <span className="text-xs font-normal text-gray-500">x/menit</span>
                </div>
              </div>

              {/* Respirasi */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Respirasi</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  20 <span className="text-xs font-normal text-gray-500">x/menit</span>
                </div>
              </div>

              {/* Suhu */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Thermometer className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Suhu</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  36.7 <span className="text-xs font-normal text-gray-500">°C</span>
                </div>
              </div>

              {/* SpO2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Droplet className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">SpO₂</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  98 <span className="text-xs font-normal text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Section */}
      <div className="px-5 py-4 border-t border-gray-100">
        <button onClick={onOpenDetailClick} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer">
          <Eye className="w-4 h-4" />
          Lihat detail pemeriksaan awal
        </button>
      </div>
    </div>
  );
}