'use client';

import React, { useState } from 'react';
import {
  X,
  Search,
  Calendar,
  Clock,
  FileSearch,
} from 'lucide-react';

export interface ICD9CMItem {
  code: string;
  name: string;
}

export interface TambahTindakanData {
  tindakan: ICD9CMItem;
  pelaksana: string;
  tanggal: string;
  waktu: string;
  keterangan?: string;
}

interface ModalTambahTindakanProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: TambahTindakanData) => void;
  defaultPelaksana?: string;
}

// Mock Database Prosedur ICD-9-CM
const MOCK_ICD9_DATABASE: ICD9CMItem[] = [
  { code: '96.07', name: 'Insertion of nasogastric tube' },
  { code: '99.18', name: 'Injection or infusion of electrolytes' },
  { code: '89.52', name: 'Electrocardiogram (ECG/EKG)' },
  { code: '93.96', name: 'Other oxygen enrichment' },
  { code: '96.59', name: 'Other irrigation of wound' },
  { code: '86.04', name: 'Other incision with drainage of skin and subcutaneous tissue' },
];

export default function ModalTambahTindakan({
  isOpen,
  onClose,
  onSubmit,
  defaultPelaksana = 'dr. Bima, Sp.A',
}: ModalTambahTindakanProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTindakan, setSelectedTindakan] = useState<ICD9CMItem | null>(null);

  // Metadata Form
  const [pelaksana, setPelaksana] = useState(defaultPelaksana);
  const [tanggal, setTanggal] = useState('16/08/2026');
  const [waktu, setWaktu] = useState('08:50 WIB');
  const [keterangan, setKeterangan] = useState('');

  if (!isOpen) return null;

  // Filter ICD-9-CM
  const filteredResults = searchQuery.trim()
    ? MOCK_ICD9_DATABASE.filter(
        (item) =>
          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectTindakan = (item: ICD9CMItem) => {
    setSelectedTindakan(item);
    setSearchQuery(`${item.code} - ${item.name}`);
    setIsSearching(false);
  };

  const handleResetSelected = () => {
    setSelectedTindakan(null);
    setSearchQuery('');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTindakan) return;

    onSubmit?.({
      tindakan: selectedTindakan,
      pelaksana,
      tanggal,
      waktu,
      keterangan: keterangan.trim(),
    });

    handleResetSelected();
    setKeterangan('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h2 className="text-base font-bold text-slate-800">
            Tambah Tindakan
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Modal Form */}
        <form onSubmit={handleSubmitForm} className="p-6 space-y-5">
          
          {/* 1. Cari Tindakan (ICD-9-CM) */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-gray-500">
              Cari Tindakan (ICD-9-CM)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari kode ICD-9-CM atau nama tindakan"
                value={searchQuery}
                onFocus={() => setIsSearching(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                  if (selectedTindakan) setSelectedTindakan(null);
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-gray-400 font-medium"
              />
              <Search
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-800 pointer-events-none"
              />
            </div>

            {/* Dropdown Result Autocompletion */}
            {isSearching && searchQuery.trim().length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSearching(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto divide-y divide-gray-100 py-1">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleSelectTindakan(item)}
                        className="w-full text-left px-4 py-2.5 hover:bg-cyan-50/50 transition-colors flex items-center justify-between text-xs cursor-pointer"
                      >
                        <span className="font-bold text-cyan-600 w-16">{item.code}</span>
                        <span className="text-gray-700 font-medium flex-1 truncate ml-2">{item.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-gray-400 text-center font-medium">
                      Tindakan tidak ditemukan.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* 2. Tindakan Terpilih / Empty State */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">
              Tindakan Terpilih
            </label>

            {selectedTindakan ? (
              <div className="border border-cyan-200 bg-cyan-50/40 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="bg-cyan-600 text-white font-bold text-[11px] px-2 py-0.5 rounded">
                    {selectedTindakan.code}
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    {selectedTindakan.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetSelected}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <div className="border border-gray-100 rounded-xl p-6 bg-slate-50/30 flex flex-col items-center justify-center min-h-[140px]">
                {/* Visual Vector Icon Placeholder */}
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center mb-3 text-slate-400">
                  <FileSearch size={28} strokeWidth={1.5} />
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Belum ada tindakan yang dipilih
                </p>
              </div>
            )}
          </div>

          {/* 3. Grid Metadata: Kode, Pelaksana, Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
            
            {/* Kode ICD-9-CM (Auto Terisi) */}
            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">
                Kode ICD-9-CM
              </label>
              <input
                type="text"
                readOnly
                value={selectedTindakan ? selectedTindakan.code : 'Auto terisi'}
                className="w-full border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-gray-400 bg-slate-50/70 focus:outline-none"
              />
            </div>

            {/* Pelaksana */}
            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">
                Pelaksana
              </label>
              <input
                type="text"
                value={pelaksana}
                onChange={(e) => setPelaksana(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Waktu Tindakan (Tanggal + Jam) */}
            <div className="sm:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">
                Waktu Tindakan
              </label>
              <div className="flex items-center gap-1.5">
                {/* Tanggal */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 pr-7 text-[11px] font-bold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <Calendar size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* Jam */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 pr-7 text-[11px] font-bold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <Clock size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

          </div>

          {/* 4. Keterangan / Alasan (Opsional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">
              Keterangan / Alasan <span className="font-normal text-gray-400">(Opsional)</span>
            </label>
            <div className="relative">
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                maxLength={255}
                placeholder="Tambahkan keterangan jika diperlukan"
                className="w-full border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all min-h-[90px] resize-none placeholder:text-gray-400"
              />
              <div className="absolute bottom-2.5 right-3 text-[10px] text-gray-400 font-medium bg-white px-1">
                {keterangan.length} / 255
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!selectedTindakan}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer ${
                selectedTindakan
                  ? 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white'
                  : 'bg-cyan-600 opacity-90 text-white cursor-pointer'
              }`}
            >
              Simpan Tindakan
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}