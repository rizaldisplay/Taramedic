'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Pencil,
  Power,
  Pill,
  Check
} from 'lucide-react';

export interface DetailObatProps {
  onClose?: () => void;
  data?: {
    namaProduk: string;
    kfaCode: string;
    status: 'Aktif' | 'Nonaktif';
    terhubungSatusehat: boolean;
    jenis: string;
    sumber: string;
    kategori: string;
    namaDagang: string;
    bentukSediaan: string;
    namaGenerik: string;
    kekuatan: string;
    manufacturer: string;
    kategoriTerapetik: string;
    nieBpom: string;
    satuanUcum: string;
    produksi: string;
    penyimpanan: string;
    statusRegistrasi: string;
    deskripsi: string;
    tglBerlakuNie: string;
    tglKadaluaarsaNie: string;
    terakhirSinkronisasi: string;
    sumberData: string;
    statusSinkronisasi: string;
    oleh: string;
  };
}

export const DetailObatSidebar: React.FC<DetailObatProps> = ({ onClose, data }) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'komposisi' | 'kemasan' | 'satusehat' | 'penggunaan'>('ringkasan');
  const [copied, setCopied] = useState(false);

  // Fallback / Default Data sesuai Gambar
  const item = data || {
    namaProduk: 'Paracetamol 500 mg Tablet',
    kfaCode: '91111011',
    status: 'Aktif',
    terhubungSatusehat: true,
    jenis: 'Farmasi',
    sumber: 'KFA',
    kategori: 'Obat Generik',
    namaDagang: 'Paracetamol 500 mg Tablet',
    bentukSediaan: 'Tablet',
    namaGenerik: 'Paracetamol',
    kekuatan: '500 mg',
    manufacturer: 'PT. Kimia Farma, Tbk',
    kategoriTerapetik: 'Analgesik - Antipiretik',
    nieBpom: 'DBL1234509876A1',
    satuanUcum: 'mg',
    produksi: 'Lokal',
    penyimpanan: 'Suhu Ruang',
    statusRegistrasi: 'Aktif',
    deskripsi: 'Obat untuk meredakan demam dan nyeri ringan.',
    tglBerlakuNie: '12-05-2023',
    tglKadaluaarsaNie: '12-05-2028',
    terakhirSinkronisasi: '16 Agustus 2026 07:45 WIB',
    sumberData: 'KFA SATUSEHAT API',
    statusSinkronisasi: 'Berhasil',
    oleh: 'Sistem (Auto Sync)',
  };

  const handleCopyKfa = () => {
    navigator.clipboard.writeText(item.kfaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full lg:w-[380px] bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden text-xs">
      {/* Header Sidebar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Detail Obat & Alkes</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* Card Profil Utama */}
        <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 flex items-start gap-3 relative">
          <div className="w-12 h-12 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
            <Pill className="w-6 h-6 -rotate-45" />
          </div>

          <div className="flex-1 min-w-0 pr-12">
            <h4 className="font-bold text-slate-800 text-sm leading-snug">{item.namaProduk}</h4>
            <div className="flex items-center gap-1.5 mt-1 text-slate-500">
              <span>KFA Code: {item.kfaCode}</span>
              <button
                onClick={handleCopyKfa}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Salin KFA Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {item.terhubungSatusehat && (
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Terhubung ke SATUSEHAT</span>
              </div>
            )}
          </div>

          {/* Badge Status Aktif */}
          <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
            {item.status}
          </span>
        </div>

        {/* Ringkasan Parameter 3 Kolom */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50/40 p-3 rounded-lg border border-slate-100 text-center">
          <div>
            <span className="text-slate-400 block text-[10px] mb-0.5">Jenis</span>
            <span className="font-semibold text-slate-700">{item.jenis}</span>
          </div>
          <div className="border-x border-slate-200/60">
            <span className="text-slate-400 block text-[10px] mb-0.5">Sumber</span>
            <span className="font-semibold text-slate-700">{item.sumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] mb-0.5">Kategori</span>
            <span className="font-semibold text-slate-700">{item.kategori}</span>
          </div>
        </div>

        {/* Navigation Tabs Horizontal */}
        <div className="border-b border-slate-200/80 flex gap-4 overflow-x-auto no-scrollbar text-[11px]">
          <button
            onClick={() => setActiveTab('ringkasan')}
            className={`pb-2 border-b-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'ringkasan'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setActiveTab('komposisi')}
            className={`pb-2 border-b-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'komposisi'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Komposisi
          </button>
          <button
            onClick={() => setActiveTab('kemasan')}
            className={`pb-2 border-b-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'kemasan'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Kemasan
          </button>
          <button
            onClick={() => setActiveTab('satusehat')}
            className={`pb-2 border-b-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'satusehat'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Integrasi SATUSEHAT
          </button>
          <button
            onClick={() => setActiveTab('penggunaan')}
            className={`pb-2 border-b-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'penggunaan'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Penggunaan
          </button>
        </div>

        {/* Tab Content: Ringkasan */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-y-3 gap-x-2">
              <div>
                <span className="text-slate-400 block mb-0.5">Nama Dagang</span>
                <span className="font-medium text-slate-800">{item.namaDagang}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Bentuk Sediaan</span>
                <span className="font-medium text-slate-800">{item.bentukSediaan}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Nama Generik</span>
                <span className="font-medium text-slate-800">{item.namaGenerik}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Kekuatan</span>
                <span className="font-medium text-slate-800">{item.kekuatan}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Manufacturer</span>
                <span className="font-medium text-slate-800">{item.manufacturer}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Kategori Terapetik</span>
                <span className="font-medium text-slate-800">{item.kategoriTerapetik}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">NIE (BPOM)</span>
                <span className="font-medium text-slate-800">{item.nieBpom}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Satuan (UCUM)</span>
                <span className="font-medium text-slate-800">{item.satuanUcum}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Produksi</span>
                <span className="font-medium text-slate-800">{item.produksi}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Penyimpanan</span>
                <span className="font-medium text-slate-800">{item.penyimpanan}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Status Registrasi</span>
                <span className="font-medium text-slate-800">{item.statusRegistrasi}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Deskripsi</span>
                <span className="font-medium text-slate-800 leading-tight block">{item.deskripsi}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Tgl. Berlaku NIE</span>
                <span className="font-medium text-slate-800">{item.tglBerlakuNie}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Tgl. Kadaluarsa NIE</span>
                <span className="font-medium text-slate-800">{item.tglKadaluaarsaNie}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Data</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2 px-3 border border-rose-200 bg-rose-50/30 rounded-lg text-rose-600 font-medium hover:bg-rose-100/50 transition-colors">
                <Power className="w-3.5 h-3.5" />
                <span>Nonaktifkan</span>
              </button>
            </div>

            {/* Card Riwayat Sinkronisasi */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 space-y-2 mt-4">
              <h5 className="font-semibold text-slate-700 text-[11px] mb-2">Riwayat Sinkronisasi</h5>
              
              <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Terakhir Sinkronisasi</span>
                  <span className="font-medium text-slate-700">{item.terakhirSinkronisasi}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Sumber Data</span>
                  <span className="font-medium text-slate-700">{item.sumberData}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status</span>
                  <span className="font-semibold text-emerald-600">{item.statusSinkronisasi}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Oleh</span>
                  <span className="font-medium text-slate-700">{item.oleh}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};