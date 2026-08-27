'use client';

import React from 'react';
import {
  X,
  FileText,
  User,
  Clock,
  Info,
  Calendar,
  Heart,
  Activity,
  Wind,
  Thermometer,
  Shield,
  MapPin,
  Smile,
  Eye,
  Ear,
  Brain,
  Pill,
  AlertCircle,
  Scale,
  Ruler,
} from 'lucide-react';

interface ModalDetailPemeriksaanProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPetaTubuhClick?: () => void;
}

export default function ModalDetailPemeriksaanAwal({ isOpen, onClose, onOpenPetaTubuhClick }: ModalDetailPemeriksaanProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h2 className="text-base font-bold text-slate-800">
            Detail Pemeriksaan Awal Perawat
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          
          {/* Top Metadata Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Banner Kiri - Info Pencatat */}
            <div className="flex flex-wrap items-center gap-3 px-3.5 py-2 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
              <div className="flex items-center gap-1.5 font-semibold text-blue-600">
                <FileText size={14} />
                <span>Data dicatat oleh Perawat</span>
              </div>
              <span className="text-blue-300">&bull;</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <User size={14} className="text-slate-400" />
                <span>Ns. Siti Rahma, A.Md.Kep</span>
              </div>
              <span className="text-blue-300">&bull;</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <Clock size={14} className="text-slate-400" />
                <span>08:25 WIB, 16 Agustus 2026</span>
              </div>
            </div>

            {/* Banner Kanan - Info Disclaimer */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50/40 border border-blue-100/60 text-[11px] text-blue-800">
              <Info size={14} className="text-blue-500 shrink-0" />
              <span>Data ini bersifat informatif. Dokter dapat melakukan pemeriksaan ulang bila diperlukan.</span>
            </div>
          </div>

          {/* Grid Content 6 Section (3x2 Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* A. KELUHAN & RIWAYAT */}
            <div className="border border-gray-200/80 rounded-xl p-4 bg-white space-y-3">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wide flex items-center gap-1">
                A. KELUHAN & RIWAYAT
              </h3>
              
              <div className="space-y-2 text-[12px]">
                <div className="flex items-start gap-2.5">
                  <User size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Keluhan utama</p>
                    <p className="font-bold text-gray-800">Demam sejak 2 hari, badan terasa lemas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <User size={14} className="text-gray-400 shrink-0 mt-0.5 opacity-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Keluhan penyerta</p>
                    <p className="text-gray-600">-</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Lama keluhan</p>
                    <p className="font-semibold text-gray-800">2 hari</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Shield size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Riwayat penyakit</p>
                    <p className="font-semibold text-gray-800">Hipertensi, Diabetes</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <AlertCircle size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Riwayat alergi</p>
                    <p className="font-semibold text-gray-800">Tidak ada alergi</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Pill size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Riwayat pengobatan rutin</p>
                    <p className="text-gray-600">-</p>
                  </div>
                </div>
              </div>
            </div>

            {/* B. TANDA VITAL */}
            <div className="border border-gray-200/80 rounded-xl p-4 bg-white space-y-3">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                B. TANDA VITAL <span className="text-gray-400 font-normal lowercase">(08:25 WIB)</span>
              </h3>

              <div className="space-y-2 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Heart size={14} className="text-gray-400" /> Tekanan darah (TD)
                  </span>
                  <span className="font-bold text-gray-800">120/80 <span className="text-[10px] font-normal text-gray-400">mmHg</span></span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Activity size={14} className="text-gray-400" /> Nadi
                  </span>
                  <span className="font-bold text-gray-800">82 <span className="text-[10px] font-normal text-gray-400">x/menit</span></span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Wind size={14} className="text-gray-400" /> Respirasi
                  </span>
                  <span className="font-bold text-gray-800">20 <span className="text-[10px] font-normal text-gray-400">x/menit</span></span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Thermometer size={14} className="text-gray-400" /> Suhu
                  </span>
                  <span className="font-bold text-gray-800">36.7 <span className="text-[10px] font-normal text-gray-400">&deg;C</span></span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Activity size={14} className="text-gray-400" /> SpO₂
                  </span>
                  <span className="font-bold text-gray-800">98 <span className="text-[10px] font-normal text-gray-400">%</span></span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Ruler size={14} className="text-gray-400" /> Tinggi badan
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Scale size={14} className="text-gray-400" /> Berat badan
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <User size={14} className="text-gray-400" /> IMT
                  </span>
                  <span className="text-gray-400">-</span>
                </div>
              </div>
            </div>

            {/* C. KEADAAN UMUM */}
            <div className="border border-gray-200/80 rounded-xl p-4 bg-white space-y-3">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                C. KEADAAN UMUM
              </h3>

              <div className="space-y-3 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <User size={14} className="text-gray-400" /> Kesadaran
                  </span>
                  <span className="font-bold text-gray-800">Compos Mentis</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Smile size={14} className="text-gray-400" /> Keadaan umum
                  </span>
                  <span className="font-bold text-gray-800">Badan terasa lemas.</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <AlertCircle size={14} className="text-gray-400" /> Nyeri (NRS 0-10)
                  </span>
                  <span className="font-bold text-gray-800">2 / 10 <span className="font-semibold text-gray-500">(Ringan)</span></span>
                </div>

                {/* Visual Slider Skala Nyeri */}
                <div className="pt-2">
                  <p className="text-[10px] text-gray-400 font-medium mb-2">Skala Nyeri</p>
                  <div className="relative w-full">
                    {/* Track Line */}
                    <div className="h-1 bg-gray-200 rounded-full w-full" />
                    <div className="h-1 bg-blue-500 rounded-full absolute top-0 left-0 w-[20%]" />
                    
                    {/* Circle Handle */}
                    <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md absolute top-1/2 -translate-y-1/2 left-[20%] -ml-2 cursor-pointer" />
                    
                    {/* Ticks */}
                    <div className="flex justify-between text-[9px] text-gray-400 mt-2 font-medium">
                      <span>0</span>
                      <span>2</span>
                      <span>4</span>
                      <span>6</span>
                      <span>8</span>
                      <span>10</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 font-semibold mt-0.5">
                      <span>Ringan</span>
                      <span>Berat</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* D. PEMERIKSAAN FISIK SINGKAT */}
            <div className="border border-gray-200/80 rounded-xl p-4 bg-white space-y-3">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                D. PEMERIKSAAN FISIK SINGKAT
              </h3>

              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Smile size={14} className="text-gray-400" /> Keadaan kepala
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Eye size={14} className="text-gray-400" /> Mata
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Ear size={14} className="text-gray-400" /> THT
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Wind size={14} className="text-gray-400" /> Dada / Paru
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Heart size={14} className="text-gray-400" /> Jantung
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Brain size={14} className="text-gray-400" /> Abdomen
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <User size={14} className="text-gray-400" /> Ekstremitas
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <User size={14} className="text-gray-400" /> Kulit
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="pt-2 text-center">
                  <button onClick={onOpenPetaTubuhClick} className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100/70 border border-blue-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer">
                    <MapPin size={13} />
                    <span>Lihat peta tubuh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* E. SKRINING / RISIKO */}
            <div className="border border-gray-200/80 rounded-xl p-4 bg-white space-y-3">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                E. SKRINING / RISIKO
              </h3>

              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <User size={14} className="text-gray-400" /> Riwayat jatuh
                  </span>
                  <span className="font-semibold text-gray-800">Tidak berisiko</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Shield size={14} className="text-gray-400" /> Risiko dekubitus (Braden)
                  </span>
                  <span className="font-semibold text-gray-800">Tidak berisiko</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Scale size={14} className="text-gray-400" /> Status gizi (IMT/U)
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Scale size={14} className="text-gray-400" /> Status nutrisi
                  </span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <AlertCircle size={14} className="text-gray-400" /> Risiko alergi obat
                  </span>
                  <span className="font-semibold text-gray-800">Tidak berisiko</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FileText size={14} className="text-gray-400" /> Catatan skrining
                  </span>
                  <span className="text-gray-400">-</span>
                </div>
              </div>
            </div>

            {/* F. CATATAN PERAWAT */}
            <div className="border border-gray-200/80 rounded-xl p-4 bg-white space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3">
                  F. CATATAN PERAWAT
                </h3>

                <div className="border border-gray-200 rounded-lg p-3 bg-slate-50/50 min-h-[120px] text-xs text-gray-700 font-medium leading-relaxed">
                  Pasien datang dengan keluhan demam 2 hari, badan terasa lemas. Tidak ada alergi yang diketahui. Vital sign dalam batas normal.
                </div>
              </div>

              <div className="text-right text-[10px] text-gray-400 font-medium">
                0 / 1000
              </div>
            </div>

          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex justify-end px-6 py-3.5 border-t border-gray-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}