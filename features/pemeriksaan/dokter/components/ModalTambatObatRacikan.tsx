/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  Plus,
  Trash2,
  Lock,
  Search,
  Info,
  CheckCircle2,
  Circle,
} from 'lucide-react';

// --- Types & Interfaces ---
export interface BahanRacikanItem {
  id: string;
  produkObat: string;
  kfaProduk: string;
  zatAktif: string;
  kfaZatAktif: string;
  kekuatan: string;
  jumlahTiapBahan: number;
  satuan: string;
}

export interface MasterBahanKFA {
  id: string;
  produkObat: string;
  kfaProduk: string;
  zatAktif: string;
  kfaZatAktif: string;
  kekuatan: string;
  satuan: string;
  bentukSediaan: string;
  golongan: string;
}

export interface DataRacikanSubmitted {
  namaRacikan: string;
  bentukSediaan: string;
  jumlahRacikan: number;
  dosisTiapBungkus: number;
  aturanPakai: string;
  frekuensi: string;
  rute: string;
  komposisi: BahanRacikanItem[];
}

interface ModalTambahRacikanProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: DataRacikanSubmitted) => void;
}

// Mock Database Bahan KFA untuk Panel Aktif Pencarian
const MOCK_KFA_DATABASE: MasterBahanKFA[] = [
  {
    id: 'kfa-1',
    produkObat: 'Paracetamol 500 mg Tablet',
    kfaProduk: '010482',
    zatAktif: 'Paracetamol',
    kfaZatAktif: '910001',
    kekuatan: '500 mg',
    satuan: 'tablet',
    bentukSediaan: 'Tablet',
    golongan: 'Generik',
  },
  {
    id: 'kfa-2',
    produkObat: 'CTM (Chlorpheniramine maleate) 4 mg Tablet',
    kfaProduk: '010520',
    zatAktif: 'Chlorpheniramine maleate',
    kfaZatAktif: '910045',
    kekuatan: '4 mg',
    satuan: 'tablet',
    bentukSediaan: 'Tablet',
    golongan: 'Generik',
  },
  {
    id: 'kfa-3',
    produkObat: 'Dextromethorphan HBr 10 mg Tablet',
    kfaProduk: '010612',
    zatAktif: 'Dextromethorphan hydrobromide',
    kfaZatAktif: '910088',
    kekuatan: '10 mg',
    satuan: 'tablet',
    bentukSediaan: 'Tablet',
    golongan: 'Generik',
  },
];

export default function ModalTambahRacikan({
  isOpen,
  onClose,
  onSubmit,
}: ModalTambahRacikanProps) {
  // A. Form Header Racikan
  const [namaRacikan, setNamaRacikan] = useState('Racikan 1');
  const [bentukSediaan, setBentukSediaan] = useState('Puyer');
  const [jumlahRacikan, setJumlahRacikan] = useState(10);
  const [dosisTiapBungkus, setDosisTiapBungkus] = useState(1);
  const [aturanPakai, setAturanPakai] = useState('Sesudah makan');
  const [frekuensi, setFrekuensi] = useState('3 × sehari');
  const [rute, setRute] = useState('Oral');

  // B. List Komposisi Bahan Terpilih (Default 3 bahan sesuai gambar)
  const [komposisiList, setKomposisiList] = useState<BahanRacikanItem[]>([
    {
      id: '1',
      produkObat: 'Paracetamol 500 mg Tablet',
      kfaProduk: '010482',
      zatAktif: 'Paracetamol',
      kfaZatAktif: '910001',
      kekuatan: '500 mg',
      jumlahTiapBahan: 1,
      satuan: 'tablet',
    },
    {
      id: '2',
      produkObat: 'CTM (Chlorpheniramine maleate) 4 mg Tablet',
      kfaProduk: '010520',
      zatAktif: 'Chlorpheniramine maleate',
      kfaZatAktif: '910045',
      kekuatan: '4 mg',
      jumlahTiapBahan: 1,
      satuan: 'tablet',
    },
    {
      id: '3',
      produkObat: 'Dextromethorphan HBr 10 mg Tablet',
      kfaProduk: '010612',
      zatAktif: 'Dextromethorphan hydrobromide',
      kfaZatAktif: '910088',
      kekuatan: '10 mg',
      jumlahTiapBahan: 1,
      satuan: 'tablet',
    },
  ]);

  // C. State Panel Kanan (Terkunci vs Aktif)
  const [isPanelBahanOpen, setIsPanelBahanOpen] = useState(false);
  const [searchKFAQuery, setSearchKFAQuery] = useState('');
  const [selectedKFABahan, setSelectedKFABahan] = useState<MasterBahanKFA | null>(
    MOCK_KFA_DATABASE[0]
  );

  if (!isOpen) return null;

  // Hapus Bahan dari Tabel Komposisi
  const handleRemoveBahan = (id: string) => {
    setKomposisiList((prev) => prev.filter((item) => item.id !== id));
  };

  // Tambah Bahan terpilih dari Panel Kanan ke Tabel Komposisi
  const handleAddBahanToTable = () => {
    if (!selectedKFABahan) return;

    const newItem: BahanRacikanItem = {
      id: Date.now().toString(),
      produkObat: selectedKFABahan.produkObat,
      kfaProduk: selectedKFABahan.kfaProduk,
      zatAktif: selectedKFABahan.zatAktif,
      kfaZatAktif: selectedKFABahan.kfaZatAktif,
      kekuatan: selectedKFABahan.kekuatan,
      jumlahTiapBahan: 1,
      satuan: selectedKFABahan.satuan,
    };

    setKomposisiList((prev) => [...prev, newItem]);
    setIsPanelBahanOpen(false); // Kembali mengunci panel setelah bahan ditambahkan
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (komposisiList.length === 0) return;

    onSubmit?.({
      namaRacikan,
      bentukSediaan,
      jumlahRacikan,
      dosisTiapBungkus,
      aturanPakai,
      frekuensi,
      rute,
      komposisi: komposisiList,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h2 className="text-base font-bold text-slate-800">
            Tambah Racikan
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Modal (2 Main Panels Layout) */}
        <form onSubmit={handleSubmitForm}>
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            
            {/* ================= PANEL KIRI: FORM INFORMASI & KOMPOSISI (7/12) ================= */}
            <div className="lg:col-span-7 p-6 space-y-6 border-r border-gray-100 flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Section A: Informasi Racikan */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-cyan-600 text-white font-bold text-[11px] flex items-center justify-center">
                      A
                    </span>
                    <h3 className="text-xs font-bold text-cyan-600">
                      Informasi Racikan
                    </h3>
                  </div>

                  {/* Row 1: Nama, Bentuk, Jumlah */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-5 space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500">Nama/Label Racikan</label>
                      <input
                        type="text"
                        value={namaRacikan}
                        onChange={(e) => setNamaRacikan(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <span className="text-[10px] text-gray-400 block">Label dapat diubah sesuai kebutuhan.</span>
                    </div>

                    <div className="col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500">Bentuk Sediaan</label>
                      <div className="relative">
                        <select
                          value={bentukSediaan}
                          onChange={(e) => setBentukSediaan(e.target.value)}
                          className="w-full appearance-none border border-gray-200 rounded-xl px-3.5 py-2 pr-7 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                        >
                          <option value="Puyer">Puyer</option>
                          <option value="Kapsul">Kapsul</option>
                          <option value="Salep">Salep</option>
                          <option value="Sirup">Sirup</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500">Jumlah Racikan</label>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <input
                          type="number"
                          value={jumlahRacikan}
                          onChange={(e) => setJumlahRacikan(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none text-center"
                        />
                        <span className="bg-slate-50 border-l border-gray-200 px-2 py-2 text-[11px] font-medium text-gray-500 shrink-0">
                          bungkus
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Dosis, Aturan Pakai, Frekuensi, Rute */}
                  <div className="grid grid-cols-12 gap-3 pt-1">
                    <div className="col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500">Dosis Tiap Bungkus</label>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <input
                          type="number"
                          value={dosisTiapBungkus}
                          onChange={(e) => setDosisTiapBungkus(Number(e.target.value))}
                          className="w-full px-2.5 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none text-center"
                        />
                        <span className="bg-slate-50 border-l border-gray-200 px-2 py-2 text-[10px] font-medium text-gray-500 shrink-0">
                          bungkus
                        </span>
                      </div>
                    </div>

                    <div className="col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500">Aturan Pakai</label>
                      <div className="relative">
                        <select
                          value={aturanPakai}
                          onChange={(e) => setAturanPakai(e.target.value)}
                          className="w-full appearance-none border border-gray-200 rounded-xl px-2.5 py-2 pr-6 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                        >
                          <option value="Sesudah makan">Sesudah makan</option>
                          <option value="Sebelum makan">Sebelum makan</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500">Frekuensi</label>
                      <div className="relative">
                        <select
                          value={frekuensi}
                          onChange={(e) => setFrekuensi(e.target.value)}
                          className="w-full appearance-none border border-gray-200 rounded-xl px-2.5 py-2 pr-6 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                        >
                          <option value="3 × sehari">3 × sehari</option>
                          <option value="2 × sehari">2 × sehari</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500">Rute</label>
                      <div className="relative">
                        <select
                          value={rute}
                          onChange={(e) => setRute(e.target.value)}
                          className="w-full appearance-none border border-gray-200 rounded-xl px-2.5 py-2 pr-6 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                        >
                          <option value="Oral">Oral</option>
                          <option value="Topikal">Topikal</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section B: Komposisi Bahan Tabel */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-cyan-600 text-white font-bold text-[11px] flex items-center justify-center">
                      B
                    </span>
                    <h3 className="text-xs font-bold text-cyan-600">
                      Komposisi ({komposisiList.length} bahan)
                    </h3>
                  </div>

                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-gray-200 text-[10px] text-gray-500 font-semibold uppercase">
                          <th className="p-2.5 text-center w-8">No.</th>
                          <th className="p-2.5">Produk Obat<br /><span className="text-[9px] text-gray-400 font-normal">KFA produk</span></th>
                          <th className="p-2.5">Zat aktif<br /><span className="text-[9px] text-gray-400 font-normal">KFA zat aktif</span></th>
                          <th className="p-2.5">Kekuatan</th>
                          <th className="p-2.5 text-center">Jumlah<br /><span className="text-[9px] text-gray-400 font-normal">Tiap Bahan</span></th>
                          <th className="p-2.5">Satuan</th>
                          <th className="p-2.5 text-center w-10">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] divide-y divide-gray-100">
                        {komposisiList.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-2.5 text-center font-bold text-gray-800">{idx + 1}</td>
                            
                            <td className="p-2.5">
                              <p className="font-bold text-gray-800">{item.produkObat}</p>
                              <p className="text-[10px] text-gray-400 font-medium">
                                Produk Obat &bull; KFA produk &bull; Generik
                              </p>
                            </td>

                            <td className="p-2.5">
                              <p className="font-bold text-gray-800">{item.zatAktif}</p>
                              <p className="text-[10px] text-gray-400 font-medium">KFA zat aktif</p>
                            </td>

                            <td className="p-2.5 font-medium text-gray-700">{item.kekuatan}</td>

                            <td className="p-2.5 text-center">
                              <input
                                type="number"
                                value={item.jumlahTiapBahan}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setKomposisiList((prev) =>
                                    prev.map((b) => (b.id === item.id ? { ...b, jumlahTiapBahan: val } : b))
                                  );
                                }}
                                className="w-10 border border-gray-200 rounded px-1 py-0.5 text-xs text-center font-bold text-gray-800 focus:outline-none"
                              />
                            </td>

                            <td className="p-2.5 font-medium text-gray-600">{item.satuan}</td>

                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveBahan(item.id)}
                                className="text-red-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {komposisiList.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-6 text-center text-xs text-gray-400 font-medium">
                              Belum ada bahan racikan yang ditambahkan.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Button Tambah Bahan (Memicu Panel Kanan Aktif) */}
                  <button
                    type="button"
                    onClick={() => setIsPanelBahanOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-cyan-200 text-cyan-600 hover:bg-cyan-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Tambah Bahan</span>
                  </button>
                </div>

              </div>

              {/* Footnote SATUSEHAT */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
                <Info size={14} className="text-cyan-500 shrink-0" />
                <span>Racikan akan disimpan sebagai resep obat racikan (MedicationRequest) sesuai standar Kemenkes dan SATUSEHAT.</span>
              </div>
            </div>


            {/* ================= PANEL KANAN: TAMBAH BAHAN RACIKAN (5/12) ================= */}
            <div className="lg:col-span-5 p-6 bg-slate-50/50 flex flex-col justify-between">
              
              {/* STATE 1: PANEL TERKUNCI (Gambar 01) */}
              {!isPanelBahanOpen ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200/80 rounded-2xl bg-white/60">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-4 shadow-2xs">
                    <Lock size={26} strokeWidth={1.75} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">
                    Panel terkunci
                  </h4>
                  <p className="text-[11px] text-gray-400 max-w-[210px] leading-relaxed">
                    Klik tombol <strong className="text-cyan-600 font-semibold">"Tambah Bahan"</strong> untuk memilih bahan racikan dari master KFA.
                  </p>
                </div>
              ) : (

              /* STATE 2: PANEL AKTIF / PENCARIAN KFA (Gambar 02) */
                <div className="space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    
                    {/* Header Panel Kanan Aktif */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">
                        Tambah Bahan Racikan
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsPanelBahanOpen(false)}
                        className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {/* Alert Banner KFA System */}
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-cyan-50/70 border border-cyan-100 text-[11px] text-cyan-800 font-medium leading-relaxed">
                      <Info size={14} className="text-cyan-500 shrink-0 mt-0.5" />
                      <span>Pilih produk obat. Sistem akan mengambil zat aktif (ingredient) sesuai data KFA untuk keperluan resep racikan.</span>
                    </div>

                    {/* Search Input Box */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cari nama obat, zat aktif, atau kode KFA..."
                        value={searchKFAQuery}
                        onChange={(e) => setSearchKFAQuery(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 pr-9 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium placeholder:text-gray-400"
                      />
                      <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Filter Dropdowns 3 Kolom */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400">Bentuk Sediaan</label>
                        <div className="relative">
                          <select className="w-full appearance-none border border-gray-200 rounded-lg px-2 py-1.5 pr-5 text-[11px] font-semibold text-gray-700 bg-white focus:outline-none cursor-pointer">
                            <option value="Semua">Semua</option>
                            <option value="Tablet">Tablet</option>
                          </select>
                          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400">KFA</label>
                        <div className="relative">
                          <select className="w-full appearance-none border border-gray-200 rounded-lg px-2 py-1.5 pr-5 text-[11px] font-semibold text-gray-700 bg-white focus:outline-none cursor-pointer">
                            <option value="Semua">Semua</option>
                          </select>
                          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400">Golongan</label>
                        <div className="relative">
                          <select className="w-full appearance-none border border-gray-200 rounded-lg px-2 py-1.5 pr-5 text-[11px] font-semibold text-gray-700 bg-white focus:outline-none cursor-pointer">
                            <option value="Semua">Semua</option>
                          </select>
                          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Master Result Card List */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-gray-500 block">Hasil Pencarian</span>
                      
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                        {MOCK_KFA_DATABASE.map((item) => {
                          const isSelected = selectedKFABahan?.id === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedKFABahan(item)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                                isSelected
                                  ? 'border-cyan-500 bg-cyan-50/40 shadow-2xs'
                                  : 'border-gray-200 bg-white hover:bg-slate-50'
                              }`}
                            >
                              {isSelected ? (
                                <CheckCircle2 size={16} className="text-cyan-600 fill-cyan-600 stroke-white shrink-0 mt-0.5" />
                              ) : (
                                <Circle size={16} className="text-gray-300 shrink-0 mt-0.5" />
                              )}

                              <div className="space-y-0.5 min-w-0">
                                <h5 className="text-xs font-bold text-slate-800">
                                  {item.produkObat}
                                </h5>
                                <p className="text-[10px] text-gray-400 font-medium">
                                  Produk Obat &bull; KFA produk &bull; {item.golongan}
                                </p>
                                <p className="text-[10px] text-gray-500 font-medium">
                                  Zat aktif: {item.zatAktif} &bull; KFA zat aktif
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Button Action Tambah Bahan ke Tabel */}
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleAddBahanToTable}
                      className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                    >
                      Tambah Bahan
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Action Buttons Footer Modal Utama */}
          <div className="flex items-center justify-end gap-3 p-4 bg-white border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Simpan Racikan
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}