import React from 'react';
import {
  User,
  Activity,
  Gauge,
  Thermometer,
  Wind,
  ShieldAlert,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';

export default function SummaryTab() {
  return (
    <div className="min-h-screen text-slate-800 font-sans space-y-6">
      
      {/* Header Ringkasan Kunjungan */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">RINGKASAN KUNJUNGAN</h2>
        <p className="text-sm text-slate-500">
          Ringkasan data dari pemeriksaan awal perawat dan lanjutan pemeriksaan dokter.
        </p>
      </div>

      {/* Grid Utama: 2 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Pemeriksaan Awal & Alergi */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card: Pemeriksaan Awal */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
                <User className="w-4 h-4" />
                <span>PEMERIKSAAN AWAL</span>
                <span className="text-xs text-slate-400 font-normal">(Data dari Perawat)</span>
              </div>
              <span className="text-xs text-slate-500">Perawat • 08:25 WIB</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {/* Data Anamnesis Awal */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Keluhan utama</div>
                  <p className="font-medium text-slate-800">Demam sejak 2 hari, badan terasa lemas.</p>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Kesadaran</div>
                  <p className="font-medium text-slate-800">Compos Mentis</p>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Nyeri</div>
                  <p className="font-medium text-slate-800">2 / 10 <span className="text-slate-400 text-xs">(Ringan)</span></p>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Alergi</div>
                  <p className="font-medium text-slate-800">Tidak ada alergi</p>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Riwayat penyakit</div>
                  <p className="font-medium text-slate-800">Hipertensi, Diabetes</p>
                </div>
              </div>

              {/* Vital Sign */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-2.5">
                <div className="text-xs font-semibold text-slate-500 pb-1 border-b border-slate-200">
                  Vital Sign (08:25 WIB)
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <Gauge className="w-3.5 h-3.5 text-cyan-500" /> TD
                  </span>
                  <span className="font-semibold text-xs">120/80 <span className="text-slate-400 font-normal">mmHg</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <Activity className="w-3.5 h-3.5 text-cyan-500" /> Nadi
                  </span>
                  <span className="font-semibold text-xs">82 <span className="text-slate-400 font-normal">x/menit</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <Wind className="w-3.5 h-3.5 text-cyan-500" /> Respirasi
                  </span>
                  <span className="font-semibold text-xs">20 <span className="text-slate-400 font-normal">x/menit</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-500" /> Suhu
                  </span>
                  <span className="font-semibold text-xs">36.7 <span className="text-slate-400 font-normal">°C</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <Activity className="w-3.5 h-3.5 text-cyan-500" /> SpO₂
                  </span>
                  <span className="font-semibold text-xs">98 <span className="text-slate-400 font-normal">%</span></span>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-1.5 text-xs text-cyan-600 font-medium hover:underline pt-2">
              <Eye className="w-3.5 h-3.5" />
              Lihat detail pemeriksaan awal
            </button>
          </div>

          {/* Card: Alergi & Peringatan */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>ALERGI & PERINGATAN</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-sm">Tidak ada alergi</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-cyan-600 text-cyan-600 rounded-md text-xs font-medium hover:bg-cyan-50">
                  Konfirmasi
                </button>
                <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-50">
                  Koreksi
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
              Sumber: Perawat • 08:25 WIB
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Status Pelayanan & Dokumen Terkait */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: Status Pelayanan */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
              <Activity className="w-4 h-4" />
              <span>STATUS PELAYANAN</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              
              {/* Step 1 - Completed */}
              <div className="relative">
                <div className="absolute -left-[1.65rem] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Pemeriksaan Awal</p>
                  <p className="text-[11px] text-slate-400">Perawat • 08:25 WIB</p>
                </div>
              </div>

              {/* Step 2 - In Progress */}
              <div className="relative">
                <div className="absolute -left-[1.65rem] top-0.5 w-4 h-4 rounded-full bg-cyan-600 border-2 border-white"></div>
                <div>
                  <p className="text-xs font-bold text-cyan-600">Pemeriksaan Dokter</p>
                  <p className="text-[11px] text-slate-400">Sedang berlangsung</p>
                </div>
              </div>

              {/* Step 3 - Pending */}
              <div className="relative">
                <div className="absolute -left-[1.65rem] top-0.5 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Diagnosis</p>
                  <p className="text-[11px] text-slate-400">Belum ditetapkan</p>
                </div>
              </div>

              {/* Step 4 - Pending */}
              <div className="relative">
                <div className="absolute -left-[1.65rem] top-0.5 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Resep</p>
                  <p className="text-[11px] text-slate-400">Belum dikirim</p>
                </div>
              </div>

              {/* Step 5 - Pending */}
              <div className="relative">
                <div className="absolute -left-[1.65rem] top-0.5 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Farmasi</p>
                  <p className="text-[11px] text-slate-400">Menunggu resep</p>
                </div>
              </div>

            </div>
          </div>

          {/* Card: Dokumen Terkait */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm">
              <FileText className="w-4 h-4" />
              <span>DOKUMEN TERKAIT</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">Hasil Skrining Perawat</span>
                  <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-600 rounded text-[10px] font-bold">PDF</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">16/08/2026 08:25</span>
                  <button className="text-slate-500 hover:text-cyan-600">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">Formulir Anamnesis Perawat</span>
                  <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-600 rounded text-[10px] font-bold">PDF</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">16/08/2026 08:25</span>
                  <button className="text-slate-500 hover:text-cyan-600">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">Surat Rujukan <span className="text-slate-400">(jika ada)</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">-</span>
                  <button className="text-slate-400 hover:text-cyan-600">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-1.5 text-xs text-cyan-600 font-medium border border-cyan-200 px-3 py-1.5 rounded-lg hover:bg-cyan-50">
              <Eye className="w-3.5 h-3.5" />
              Lihat Semua Dokumen
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}