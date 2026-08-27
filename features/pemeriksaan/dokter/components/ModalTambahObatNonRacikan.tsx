'use client';

import React, { useState } from 'react';
import {
  X,
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  Circle,
  Info,
  Plus,
} from 'lucide-react';

export interface MasterObatItem {
  id: string;
  name: string;
  kfa: string;
  bentukSediaan: string;
  status: 'Generik' | 'Brand';
  kekuatan: string;
  stok: number;
  satuanDefault: string;
}

export interface DetailObatNonRacikanData {
  obat: MasterObatItem;
  dosisJumlah: string;
  dosisSatuan: string;
  frekuensi: string;
  rute: string;
  jumlah: string;
  satuan: string;
  aturanPakai: string;
  catatan?: string;
  sumberResep: string;
}

interface ModalTambahObatNonRacikanProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: DetailObatNonRacikanData) => void;
}

// Mock Master Data Obat KFA
const MOCK_MASTER_OBAT: MasterObatItem[] = [
  {
    id: '1',
    name: 'Paracetamol 500 mg',
    kfa: '010482',
    bentukSediaan: 'Tablet',
    status: 'Generik',
    kekuatan: '500 mg',
    stok: 1234,
    satuanDefault: 'Tablet',
  },
  {
    id: '2',
    name: 'Cetirizine 10 mg',
    kfa: '010517',
    bentukSediaan: 'Tablet',
    status: 'Generik',
    kekuatan: '10 mg',
    stok: 836,
    satuanDefault: 'Tablet',
  },
  {
    id: '3',
    name: 'Amlodipine 5 mg',
    kfa: '010218',
    bentukSediaan: 'Tablet',
    status: 'Generik',
    kekuatan: '5 mg',
    stok: 642,
    satuanDefault: 'Tablet',
  },
  {
    id: '4',
    name: 'Amoxicillin 500 mg',
    kfa: '020101',
    bentukSediaan: 'Kapsul',
    status: 'Generik',
    kekuatan: '500 mg',
    stok: 432,
    satuanDefault: 'Kapsul',
  },
  {
    id: '5',
    name: 'Ibuprofen 200 mg',
    kfa: '010273',
    bentukSediaan: 'Tablet',
    status: 'Generik',
    kekuatan: '200 mg',
    stok: 321,
    satuanDefault: 'Tablet',
  },
];

export default function ModalTambahObatNonRacikan({
  isOpen,
  onClose,
  onSubmit,
}: ModalTambahObatNonRacikanProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Generik' | 'Brand'>('Semua');
  
  // Selected Master Obat (Default selected Paracetamol 500 mg sesuai gambar)
  const [selectedObat, setSelectedObat] = useState<MasterObatItem>(MOCK_MASTER_OBAT[0]);

  // Form Detail Resep State
  const [dosisJumlah, setDosisJumlah] = useState('500');
  const [dosisSatuan, setDosisSatuan] = useState('mg');
  const [frekuensi, setFrekuensi] = useState('3 × sehari');
  const [rute, setRute] = useState('Oral');
  const [jumlah, setJumlah] = useState('10');
  const [satuan, setSatuan] = useState('Tablet');
  const [aturanPakai, setAturanPakai] = useState('Sesudah makan');
  const [catatan, setCatatan] = useState('');

  if (!isOpen) return null;

  // Filter Master List
  const filteredObatList = MOCK_MASTER_OBAT.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kfa.includes(searchQuery);

    if (!matchesSearch) return false;
    if (activeTab === 'Generik') return item.status === 'Generik';
    if (activeTab === 'Brand') return item.status === 'Brand';
    return true;
  });

  const handleSelectObat = (obat: MasterObatItem) => {
    setSelectedObat(obat);
    setSatuan(obat.satuanDefault);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedObat) return;

    onSubmit?.({
      obat: selectedObat,
      dosisJumlah,
      dosisSatuan,
      frekuensi,
      rute,
      jumlah,
      satuan,
      aturanPakai,
      catatan: catatan.trim(),
      sumberResep: 'E-Resep Dokter',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Container Modal Large */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h2 className="text-base font-bold text-slate-800">
            Tambah Obat Non-Racikan
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Form 2 Kolom */}
        <form onSubmit={handleSubmitForm} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ================= KOLOM KIRI: CARI & PILIH OBAT (5/12) ================= */}
            <div className="lg:col-span-5 space-y-4 pr-0 lg:pr-2 lg:border-r border-gray-100">
              <h3 className="text-xs font-bold text-slate-800">
                1. Cari & pilih obat
              </h3>

              {/* Search Box Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama obat / KFA / generik / brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 pr-10 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 font-medium"
                />
                <Search
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none"
                />
              </div>

              {/* Filter Tabs & Filter Button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {(['Semua', 'Generik', 'Brand'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === tab
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Filter size={13} className="text-gray-400" />
                  <span>Filter</span>
                </button>
              </div>

              {/* Master Obat Card List */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredObatList.map((item) => {
                  const isSelected = selectedObat?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectObat(item)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/40 shadow-2xs'
                          : 'border-gray-200 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {isSelected ? (
                          <CheckCircle2 size={18} className="text-blue-600 fill-blue-600 stroke-white shrink-0 mt-0.5" />
                        ) : (
                          <Circle size={18} className="text-gray-300 shrink-0 mt-0.5" />
                        )}

                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                            <span>{item.bentukSediaan}</span>
                            <span>&bull;</span>
                            <span>KFA: {item.kfa}</span>
                            <span>&bull;</span>
                            <span>{item.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        <span className="text-[10px] text-gray-400 block font-medium">Stok</span>
                        <span className="text-xs font-bold text-slate-800">{item.stok.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })}

                {filteredObatList.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-400 font-medium">
                    Obat tidak ditemukan.
                  </div>
                )}
              </div>
            </div>


            {/* ================= KOLOM KANAN: DETAIL RESEP OBAT (7/12) ================= */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-bold text-slate-800">
                2. Detail resep obat
              </h3>

              {/* Alert Info Master Data */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-800 font-medium">
                <Info size={14} className="text-blue-500 shrink-0" />
                <span>Informasi obat akan mengisi otomatis sesuai data master.</span>
              </div>

              {/* Row 1: Readonly Master Metadata */}
              <div className="grid grid-cols-12 gap-2.5">
                <div className="col-span-5 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">Nama Obat</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedObat?.name || ''}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 bg-white focus:outline-none"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">KFA</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedObat?.kfa || ''}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 bg-white focus:outline-none text-center"
                  />
                </div>

                <div className="col-span-3 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">Bentuk Sediaan</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedObat?.bentukSediaan || ''}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 bg-white focus:outline-none"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">Status</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedObat?.status || ''}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 bg-white focus:outline-none text-center"
                  />
                </div>
              </div>

              {/* Row 2: Kekuatan */}
              <div className="w-1/2 pr-1.5 space-y-1">
                <label className="text-[11px] font-semibold text-gray-500">Kekuatan</label>
                <input
                  type="text"
                  readOnly
                  value={selectedObat?.kekuatan || ''}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 bg-white focus:outline-none"
                />
              </div>

              {/* Row 3: Dosis, Frekuensi, Rute */}
              <div className="grid grid-cols-12 gap-3">
                {/* Dosis (Input + Dropdown Unit) */}
                <div className="col-span-5 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">
                    Dosis <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={dosisJumlah}
                      onChange={(e) => setDosisJumlah(e.target.value)}
                      className="w-full border border-gray-200 border-r-0 rounded-l-xl px-3 py-2 text-xs font-bold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="relative shrink-0">
                      <select
                        value={dosisSatuan}
                        onChange={(e) => setDosisSatuan(e.target.value)}
                        className="appearance-none border border-gray-200 rounded-r-xl px-2.5 py-2 pr-6 text-xs font-semibold text-gray-700 bg-slate-50 focus:outline-none cursor-pointer"
                      >
                        <option value="mg">mg</option>
                        <option value="mcg">mcg</option>
                        <option value="ml">ml</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Frekuensi */}
                <div className="col-span-4 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">
                    Frekuensi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={frekuensi}
                      onChange={(e) => setFrekuensi(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="3 × sehari">3 × sehari</option>
                      <option value="2 × sehari">2 × sehari</option>
                      <option value="1 × sehari">1 × sehari</option>
                      <option value="Tiap 8 jam">Tiap 8 jam</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Rute */}
                <div className="col-span-3 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">
                    Rute <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={rute}
                      onChange={(e) => setRute(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Oral">Oral</option>
                      <option value="Injeksi IV">Injeksi IV</option>
                      <option value="Topikal">Topikal</option>
                      <option value="Sublingual">Sublingual</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 4: Jumlah, Satuan, Aturan Pakai */}
              <div className="grid grid-cols-12 gap-3">
                {/* Jumlah */}
                <div className="col-span-4 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">
                    Jumlah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Satuan */}
                <div className="col-span-4 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">
                    Satuan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={satuan}
                      onChange={(e) => setSatuan(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Kapsul">Kapsul</option>
                      <option value="Botol">Botol</option>
                      <option value="Tube">Tube</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Aturan Pakai */}
                <div className="col-span-4 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">
                    Aturan Pakai <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={aturanPakai}
                      onChange={(e) => setAturanPakai(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Sesudah makan">Sesudah makan</option>
                      <option value="Sebelum makan">Sebelum makan</option>
                      <option value="Bersama makan">Bersama makan</option>
                      <option value="Sebelum tidur">Sebelum tidur</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 5: Catatan (Opsional) */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500">
                  Catatan <span className="font-normal text-gray-400">(opsional)</span>
                </label>
                <div className="relative">
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    maxLength={200}
                    placeholder="Contoh: Bila perlu, diminum setelah makan"
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[75px] resize-none placeholder:text-gray-400"
                  />
                  <div className="text-right text-[10px] text-gray-400 font-medium mt-0.5">
                    {catatan.length} / 200
                  </div>
                </div>
              </div>

              {/* Bottom Banner Info Sumber Resep */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50/50 border border-blue-100/60 text-[11px] text-gray-600 font-medium">
                <Info size={14} className="text-blue-500 shrink-0" />
                <span>Sumber Resep: <strong className="text-blue-600 font-bold">E-Resep Dokter</strong></span>
              </div>

            </div>

          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>Tambah Obat</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}