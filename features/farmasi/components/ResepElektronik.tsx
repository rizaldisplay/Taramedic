'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Pill, 
  Eye, 
  ChevronDown, 
  FlaskConical,
  Clock,
  Save,
  ArrowRight,
  X,
  User,
  Route,
  Calendar,
  FileEdit,
  Pill as PillIcon,
  Building2,
  Tag,
  Info,
  Scale,
  Palette,
  Sparkles,
  Smile
} from 'lucide-react';

// --- Types ---
interface Medicine {
  id: string;
  name: string;
  type: string;
  kfa: string;
  isGeneric: boolean;
  dosis: string;
  frekuensi: string;
  rute: string;
  jumlah: string;
  aturanPakai: string;
  status: 'Menunggu' | 'Selesai';
}

interface CompositionItem {
  no: number;
  namaBahan: string;
  kfaZatAktif: string;
  kekuatan: string;
  jumlahPerBungkus: string;
  jumlahTotal: string;
  satuan: string;
  keterangan: string;
}

interface RacikanData {
  id: string;
  noRacikan: string;
  nama: string;
  bentuk: string;
  jumlah: string;
  aturanPakai: string;
  tanggal: string;
  dokter: string;
  poli: string;
  status: string;
  komposisi: CompositionItem[];
}

// --- Component 1: Modal Detail Obat Non-Racikan ---
interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Medicine | null;
}

function DetailModal({ isOpen, onClose, data }: DetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="flex w-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-slate-100 transition-all transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Detail Obat Non-Racikan</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 max-h-[82vh] overflow-y-auto">
          
          {/* Header Banner Obat */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100/60 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Pill className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{data?.name || "Paracetamol"}</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-blue-100">
                    {data?.type || "Tablet"} {data?.dosis || "500 mg"}
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-blue-100">
                    Obat Generik
                  </span>
                </div>
              </div>
            </div>

            <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-amber-200/60 shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Menunggu Verifikasi
            </span>
          </div>

          {/* Section A & B Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Section A: Informasi Resep */}
            <div className="border border-slate-200/80 rounded-xl p-4 bg-white shadow-xs flex flex-col gap-3">
              <h4 className="text-xs font-bold text-blue-600 tracking-wider uppercase border-b border-slate-100 pb-2">
                A. Informasi Resep
              </h4>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">No. Resep</span>
                  <span className="font-semibold text-slate-800">RX-20260816-013</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Tanggal Resep</span>
                  <span className="font-semibold text-slate-800">16 Agustus 2026, 08:18 WIB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Dokter</span>
                  <span className="font-semibold text-slate-800">dr. Bima, Sp.A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Poli</span>
                  <span className="font-semibold text-slate-800">Poli Anak</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Sumber Resep</span>
                  <span className="font-semibold text-slate-800">E-Resep Dokter</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                  <span className="text-slate-500">Status Resep</span>
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[11px] font-medium inline-flex items-center gap-1 border border-amber-200/60">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Menunggu Verifikasi
                  </span>
                </div>
              </div>
            </div>

            {/* Section B: Detail Obat */}
            <div className="border border-slate-200/80 rounded-xl p-4 bg-white shadow-xs flex flex-col gap-3">
              <h4 className="text-xs font-bold text-blue-600 tracking-wider uppercase border-b border-slate-100 pb-2">
                B. Detail Obat
              </h4>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nama Obat</span>
                  <span className="font-semibold text-slate-800">{data?.name || "Paracetamol"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Zat Aktif</span>
                  <span className="font-semibold text-slate-800">Paracetamol</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Kekuatan</span>
                  <span className="font-semibold text-slate-800">{data?.dosis || "500 mg"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Bentuk Sediaan</span>
                  <span className="font-semibold text-slate-800">{data?.type || "Tablet"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Kode KFA</span>
                  <span className="font-semibold text-slate-800">{data?.kfa || "9300089500012"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Kategori Terapi</span>
                  <span className="font-semibold text-slate-800">Analgesik - Antipiretik</span>
                </div>
              </div>
            </div>

          </div>

          {/* Section C: Instruksi Pemberian */}
          <div className="border border-slate-200/80 rounded-xl p-4 bg-white shadow-xs flex flex-col gap-3">
            <h4 className="text-xs font-bold text-blue-600 tracking-wider uppercase border-b border-slate-100 pb-2">
              C. Instruksi Pemberian
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-blue-600 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400">Dosis</span>
                  <span className="text-xs font-bold text-slate-800">{data?.dosis || "500 mg"}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-blue-600 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400">Frekuensi</span>
                  <span className="text-xs font-bold text-slate-800">{data?.frekuensi || "3 x sehari"}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-blue-600 shadow-xs">
                  <Route className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400">Rute Pemberian</span>
                  <span className="text-xs font-bold text-slate-800">{data?.rute || "Oral"}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-blue-600 shadow-xs">
                  <PillIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400">Jumlah Diresepkan</span>
                  <span className="text-xs font-bold text-slate-800">{data?.jumlah || "10 tablet"}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-blue-600 shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400">Aturan Pakai</span>
                  <span className="text-xs font-bold text-slate-800">{data?.aturanPakai || "Sesudah makan"}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-blue-600 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400">Waktu Pemberian</span>
                  <span className="text-xs font-bold text-slate-800">Pagi, Siang, Malam</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
              <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Durasi Pengobatan</span>
                  <span className="text-xs font-medium text-slate-700">-</span>
                </div>
              </div>

              <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <FileEdit className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Instruksi Tambahan</span>
                  <span className="text-xs font-medium text-slate-700">-</span>
                </div>
              </div>

              <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <FileEdit className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Catatan Dokter</span>
                  <span className="text-xs font-medium text-slate-700">-</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Ketersediaan & Stok */}
          <div className="border border-slate-200/80 rounded-xl p-4 bg-white shadow-xs flex flex-col gap-3">
            <h4 className="text-xs font-bold text-blue-600 tracking-wider uppercase border-b border-slate-100 pb-2">
              D. Ketersediaan & Stok
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs pt-1">
              <div className="col-span-2 md:col-span-1">
                <span className="text-slate-400 block mb-1">Produk Diresepkan</span>
                <span className="font-semibold text-slate-800 block">{data?.name || "Paracetamol 500 mg"}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Stok Tersedia</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block">
                  120 tablet
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Lokasi Stok</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Gudang Farmasi
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Batch / No. Lot</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  -
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">ED</span>
                <span className="font-semibold text-slate-800">-</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center px-6 py-3.5 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}

// --- Component 2: Modal Komposisi Racikan ---
interface RacikanModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: RacikanData | null;
}

function RacikanModal({ isOpen, onClose, data }: RacikanModalProps) {
  if (!isOpen) return null;

  const defaultComposition: CompositionItem[] = [
    {
      no: 1,
      namaBahan: 'Paracetamol',
      kfaZatAktif: 'Zat aktif: Paracetamol',
      kekuatan: '500 mg',
      jumlahPerBungkus: '1 tablet',
      jumlahTotal: '10 tablet',
      satuan: 'Tablet',
      keterangan: 'Analgesik - Antipiretik'
    },
    {
      no: 2,
      namaBahan: 'CTM',
      kfaZatAktif: 'Zat aktif: Chlorpheniramine Maleate',
      kekuatan: '4 mg',
      jumlahPerBungkus: '1 tablet',
      jumlahTotal: '10 tablet',
      satuan: 'Tablet',
      keterangan: 'Antihistamin'
    },
    {
      no: 3,
      namaBahan: 'Bahan Pengisi',
      kfaZatAktif: '-',
      kekuatan: '-',
      jumlahPerBungkus: 'secukupnya',
      jumlahTotal: 'secukupnya',
      satuan: '-',
      keterangan: 'Laktosa/Amilum'
    }
  ];

  const compositions = data?.komposisi || defaultComposition;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-slate-100 transition-all transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Komposisi Racikan</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 max-h-[82vh] overflow-y-auto">
          
          {/* Header Banner Racikan */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-purple-50/40 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100/70 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                <FlaskConical className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{data?.nama || "Racikan 1 – Puyer"}</h3>
                <div>
                  <span className="bg-purple-100/80 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-purple-200/60">
                    Racikan Puyer
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-purple-100 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500">Jumlah Racikan</span>
                <span className="text-sm font-bold text-slate-800">{data?.jumlah || "10 bungkus"}</span>
              </div>
              <div className="flex flex-col text-right sm:text-left">
                <span className="text-[11px] text-slate-500">Aturan Pakai</span>
                <span className="text-sm font-bold text-slate-800">{data?.aturanPakai || "3 x sehari sesudah makan"}</span>
              </div>
            </div>
          </div>

          {/* Section A: Informasi Racikan */}
          <div className="border border-purple-100/80 rounded-xl p-4 bg-white shadow-xs flex flex-col gap-3">
            <h4 className="text-xs font-bold text-purple-700 tracking-wider uppercase border-b border-purple-50 pb-2">
              A. Informasi Racikan
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-400 block mb-0.5">No. Racikan</span>
                <span className="font-semibold text-slate-800">{data?.noRacikan || "RAC-20260816-001"}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Tanggal Racikan</span>
                <span className="font-semibold text-slate-800">{data?.tanggal || "16 Agustus 2026"}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Dokter</span>
                <span className="font-semibold text-slate-800">{data?.dokter || "dr. Bima, Sp.A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Poli</span>
                <span className="font-semibold text-slate-800">{data?.poli || "Poli Anak"}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Status</span>
                <span className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 border border-purple-200/60">
                  <Clock className="w-3 h-3 text-purple-600" />
                  {data?.status || "Menunggu Peracikan"}
                </span>
              </div>
            </div>
          </div>

          {/* Section B: Komposisi Racikan */}
          <div className="border border-purple-100/80 rounded-xl p-4 bg-white shadow-xs flex flex-col gap-3">
            <h4 className="text-xs font-bold text-purple-700 tracking-wider uppercase border-b border-purple-50 pb-2">
              B. Komposisi Racikan
            </h4>

            {/* Tabel Bahan */}
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-3 w-10 text-center">No.</th>
                    <th className="p-3">Nama Bahan</th>
                    <th className="p-3">KFA / Zat Aktif</th>
                    <th className="p-3">Kekuatan</th>
                    <th className="p-3">Jumlah per Bungkus</th>
                    <th className="p-3">Jumlah Total</th>
                    <th className="p-3">Satuan</th>
                    <th className="p-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {compositions.map((item) => (
                    <tr key={item.no} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800 text-center">{item.no}</td>
                      <td className="p-3 font-bold text-slate-800">{item.namaBahan}</td>
                      <td className="p-3 text-slate-500">{item.kfaZatAktif}</td>
                      <td className="p-3 font-medium">{item.kekuatan}</td>
                      <td className="p-3 font-medium">{item.jumlahPerBungkus}</td>
                      <td className="p-3 font-medium">{item.jumlahTotal}</td>
                      <td className="p-3 text-slate-500">{item.satuan}</td>
                      <td className="p-3 text-slate-600">{item.keterangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Banner Verifikasi */}
            <div className="bg-purple-50/60 border border-purple-100 rounded-lg p-3 flex items-center gap-2.5 text-purple-800 text-xs font-medium">
              <Info className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Semua bahan telah diverifikasi sesuai resep dokter dan formula racikan.</span>
            </div>
          </div>

          {/* Section C: Detail Racikan */}
          <div className="border border-purple-100/80 rounded-xl p-4 bg-white shadow-xs flex flex-col gap-3">
            <h4 className="text-xs font-bold text-purple-700 tracking-wider uppercase border-b border-purple-50 pb-2">
              C. Detail Racikan
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-purple-600 shadow-xs">
                  <PillIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Bentuk Racikan</span>
                  <span className="text-xs font-bold text-slate-800">{data?.bentuk || "Puyer"}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-purple-600 shadow-xs">
                  <Route className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Rute Pemberian</span>
                  <span className="text-xs font-bold text-slate-800">Oral</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-purple-600 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Frekuensi</span>
                  <span className="text-xs font-bold text-slate-800">3 x sehari</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-purple-600 shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Aturan Pakai</span>
                  <span className="text-xs font-bold text-slate-800">Sesudah makan</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-purple-600 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Jumlah Bungkus</span>
                  <span className="text-xs font-bold text-slate-800">{data?.jumlah || "10 bungkus"}</span>
                </div>
              </div>
            </div>

            {/* Grid Karakteristik Racikan */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-1">
              <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-white border border-slate-100 text-purple-600">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Berat per Bungkus</span>
                  <span className="text-xs font-medium text-slate-700">-</span>
                </div>
              </div>

              <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-white border border-slate-100 text-purple-600">
                  <Palette className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Warna</span>
                  <span className="text-xs font-medium text-slate-700">-</span>
                </div>
              </div>

              <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-white border border-slate-100 text-purple-600">
                  <Smile className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Rasa</span>
                  <span className="text-xs font-medium text-slate-700">-</span>
                </div>
              </div>

              <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-white border border-slate-100 text-purple-600">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Aroma</span>
                  <span className="text-xs font-medium text-slate-700">-</span>
                </div>
              </div>

              <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-white border border-slate-100 text-purple-600">
                  <FileEdit className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Catatan Tambahan</span>
                  <span className="text-xs font-medium text-slate-700">-</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center px-6 py-3.5 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function ResepElektronikComponent() {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isRacikanModalOpen, setIsRacikanModalOpen] = useState<boolean>(false);

  const sampleMedicines: Medicine[] = [
    {
      id: '1',
      name: 'Paracetamol 500 mg',
      type: 'Tablet',
      kfa: '010482',
      isGeneric: true,
      dosis: '500 mg',
      frekuensi: '3 x sehari',
      rute: 'Oral',
      jumlah: '10 tablet',
      aturanPakai: 'Sesudah makan',
      status: 'Menunggu'
    },
    {
      id: '2',
      name: 'Cetirizine 10 mg',
      type: 'Tablet',
      kfa: '010517',
      isGeneric: true,
      dosis: '10 mg',
      frekuensi: '1 x sehari',
      rute: 'Oral',
      jumlah: '5 tablet',
      aturanPakai: 'Malam hari',
      status: 'Menunggu'
    }
  ];

  const handleOpenDetail = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto font-sans p-4 sm:p-6 bg-slate-50/30 min-h-screen">
      
      {/* 1. Header Card Resep Elektronik */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase">Resep Elektronik</h2>
            
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-slate-400 font-medium text-sm">Resep</span>
              <span className="text-lg font-bold text-slate-800">RX-20260816-013</span>
              <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-amber-200/60">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Menunggu Verifikasi
              </span>
            </div>
            
            <div className="flex items-center text-xs text-slate-500 gap-2 flex-wrap">
              <span className="font-semibold text-slate-700">dr. Bima, Sp.A</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Poli Anak</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>16 Agustus 2026</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>08:18 WIB</span>
            </div>
          </div>
        </div>

        {/* Statistik Resep */}
        <div className="flex border border-slate-200 rounded-xl divide-x divide-slate-200 bg-slate-50/50 self-stretch md:self-auto">
          <div className="px-4 py-2.5 flex flex-col items-center justify-center flex-1 md:flex-initial">
            <span className="text-[11px] text-slate-400 mb-0.5">Total Resep</span>
            <span className="font-bold text-slate-800 text-sm">3 <span className="text-xs font-normal text-slate-400">Item</span></span>
          </div>
          <div className="px-4 py-2.5 flex flex-col items-center justify-center flex-1 md:flex-initial">
            <span className="text-[11px] text-slate-400 mb-0.5">Non-Racikan</span>
            <span className="font-bold text-slate-800 text-sm">2 <span className="text-xs font-normal text-slate-400">Item</span></span>
          </div>
          <div className="px-4 py-2.5 flex flex-col items-center justify-center flex-1 md:flex-initial">
            <span className="text-[11px] text-slate-400 mb-0.5">Racikan</span>
            <span className="font-bold text-slate-800 text-sm">1 <span className="text-xs font-normal text-slate-400">Item</span></span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex gap-2">
        <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-xs">
          Semua (3)
        </button>
        <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2 rounded-full text-xs font-semibold transition-colors">
          Non-Racikan (2)
        </button>
        <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2 rounded-full text-xs font-semibold transition-colors">
          Racikan (1)
        </button>
      </div>

      {/* 3. Section A: Non-Racikan */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">A</div>
          <h3 className="font-bold text-slate-800 text-xs tracking-wider">NON-RACIKAN</h3>
          <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-blue-100">2 Item</span>
        </div>

        {sampleMedicines.map((item, index) => (
          <div key={item.id} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col gap-4 relative">
            <div className="absolute left-5 top-5 font-bold text-xs text-slate-300">{index + 1}</div>
            
            <div className="ml-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              
              <div className="md:col-span-4 flex gap-3">
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-blue-600 shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>{item.type}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>KFA: {item.kfa}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-blue-600 font-medium">Generik</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs border-y md:border-y-0 border-slate-100 py-3 md:py-0">
                <div>
                  <span className="text-slate-400 block mb-0.5">Dosis</span>
                  <span className="font-semibold text-slate-800">{item.dosis}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Frekuensi</span>
                  <span className="font-semibold text-slate-800">{item.frekuensi}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Rute</span>
                  <span className="font-semibold text-slate-800">{item.rute}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Jumlah</span>
                  <span className="font-semibold text-slate-800">{item.jumlah}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block mb-0.5">Aturan Pakai</span>
                  <span className="font-semibold text-slate-800">{item.aturanPakai}</span>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-1">
                <span className="text-xs text-slate-400 block md:hidden">Status</span>
                <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 border border-amber-200/60">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Menunggu
                </span>
              </div>
            </div>
            
            <div className="ml-6 border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5">
                Sumber: E-Resep Dokter
              </span>
              <button 
                onClick={() => handleOpenDetail(item)}
                className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Section B: Racikan */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">B</div>
          <h3 className="font-bold text-slate-800 text-xs tracking-wider">RACIKAN</h3>
          <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-blue-100">1 Item</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex gap-3">
              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100 text-purple-600 shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="font-bold text-slate-800 text-base">Racikan 1 — Puyer</h4>
                <div className="flex items-center text-xs text-slate-600 gap-2 flex-wrap">
                  <span>Bentuk: <strong className="text-slate-800">Puyer</strong></span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>Jumlah: <strong className="text-slate-800">10 bungkus</strong></span>
                </div>
                <div className="flex items-center text-xs text-slate-600 gap-2 flex-wrap">
                  <span>Dosis: <strong className="text-slate-800">1 bungkus</strong></span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>Frekuensi: <strong className="text-slate-800">3 x sehari</strong></span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>Rute: <strong className="text-slate-800">Oral</strong></span>
                </div>
                <div className="text-xs text-slate-600">
                  Aturan Pakai: <strong className="text-slate-800">Sesudah makan</strong>
                </div>
              </div>
            </div>
            
            <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-purple-200/60 shrink-0">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              Menunggu Peracikan
            </span>
          </div>

          <div 
            onClick={() => setIsRacikanModalOpen(true)}
            className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/50 flex justify-between items-center cursor-pointer hover:bg-purple-50/40 hover:border-purple-200 transition-all group"
          >
            <span className="text-xs font-semibold text-slate-700 group-hover:text-purple-700 transition-colors">Komposisi (3 bahan)</span>
            <div className="flex items-center gap-1.5 text-blue-600 group-hover:text-purple-700 text-xs font-semibold transition-colors">
              Lihat Komposisi
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
            <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5">
              Sumber: E-Resep Dokter
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        data={selectedMedicine}
      />

      <RacikanModal 
        isOpen={isRacikanModalOpen} 
        onClose={() => setIsRacikanModalOpen(false)} 
      />

    </div>
  );
}