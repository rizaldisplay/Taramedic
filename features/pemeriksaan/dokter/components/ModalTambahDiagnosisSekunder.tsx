/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/purity */
'use client';

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ChevronDown, 
  GripVertical, 
  Trash2, 
  FileSearch 
} from 'lucide-react';

// --- Types & Interfaces ---
export interface ICD10Item {
  code: string;
  name: string;
}

export interface SelectedDiagnosisItem extends ICD10Item {
  id: string;
  tipe: 'Akut' | 'Kronis';
  status: 'Ditetapkan' | 'Menunggu';
}

interface ModalTambahDiagnosisSekunderProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDiagnoses?: (diagnoses: SelectedDiagnosisItem[], deskripsi: string) => void;
}

// --- Mock Database ICD-10 ---
const MOCK_ICD10_DATABASE: ICD10Item[] = [
  { code: 'A09.0', name: 'Gastroenteritis dan kolitis infeksius, tidak spesifik' },
  { code: 'K29.00', name: 'Gastritis akut, tanpa perdarahan' },
  { code: 'K29.50', name: 'Gastritis kronik, tidak spesifik' },
  { code: 'K29.70', name: 'Gastritis, tidak spesifik' },
  { code: 'K25.3', name: 'Tukak lambung akut dengan perdarahan' },
  { code: 'K25.9', name: 'Tukak lambung, tidak spesifik' },
  { code: 'K20.9', name: 'Esofagitis, tidak spesifik' },
  { code: 'K31.84', name: 'Gastroparesis' },
  { code: 'R50.9', name: 'Demam, tidak spesifik' },
  { code: 'R63.0', name: 'Anoreksia' },
  { code: 'J06.9', name: 'Infeksi saluran napas akut, tidak spesifik' },
];

export default function ModalTambahDiagnosisSekunder({
  isOpen,
  onClose,
  onAddDiagnoses,
}: ModalTambahDiagnosisSekunderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Form states untuk item baru yang akan dipilih
  const [defaultTipe, setDefaultTipe] = useState<'Akut' | 'Kronis'>('Akut');
  const [defaultStatus, setDefaultStatus] = useState<'Ditetapkan' | 'Menunggu'>('Ditetapkan');
  const [deskripsi, setDeskripsi] = useState('');

  // List item diagnosis yang dipilih
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<SelectedDiagnosisItem[]>([]);

  if (!isOpen) return null;

  // Filter pencarian ICD-10
  const filteredResults = searchQuery.trim()
    ? MOCK_ICD10_DATABASE.filter(
        (item) =>
          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handler memilih item dari dropdown autocomplete
  const handleSelectICD = (item: ICD10Item) => {
    // Hindari duplikasi item
    if (selectedDiagnoses.some((d) => d.code === item.code)) {
      setSearchQuery('');
      setIsSearching(false);
      return;
    }

    const newItem: SelectedDiagnosisItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      code: item.code,
      name: item.name,
      tipe: defaultTipe,
      status: defaultStatus,
    };

    setSelectedDiagnoses((prev) => [...prev, newItem]);
    setSearchQuery('');
    setIsSearching(false);
  };

  // Handler hapus item dari list
  const handleRemoveItem = (id: string) => {
    setSelectedDiagnoses((prev) => prev.filter((item) => item.id !== id));
  };

  // Handler update status per row
  const handleUpdateStatusRow = (id: string, status: 'Ditetapkan' | 'Menunggu') => {
    setSelectedDiagnoses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDiagnoses.length === 0) return;

    onAddDiagnoses?.(selectedDiagnoses, deskripsi.trim());
    
    // Reset state & close modal
    setSelectedDiagnoses([]);
    setSearchQuery('');
    setDeskripsi('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-[540px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h2 className="text-base font-bold text-slate-800">
            Tambah Diagnosis Sekunder
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Section 1: Cari Diagnosis (ICD-10) */}
          <div className="space-y-1.5 relative">
            <label className="text-xs text-gray-500 font-semibold">
              Cari Diagnosis (ICD-10)
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="Cari kode ICD-10 atau nama diagnosis"
                value={searchQuery}
                onFocus={() => setIsSearching(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                }}
                className={`w-full border rounded-xl px-4 py-2.5 pr-20 text-xs text-gray-800 bg-white transition-all placeholder:text-gray-400 focus:outline-none ${
                  isSearching && searchQuery.trim().length > 0
                    ? 'border-2 border-cyan-500 font-semibold'
                    : 'border-gray-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500'
                }`}
              />

              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
                <Search size={16} className="text-slate-800 pointer-events-none" />
              </div>
            </div>

            {/* Dropdown Autocomplete Result (Gambar 03) */}
            {isSearching && searchQuery.trim().length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSearching(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden animate-in fade-in-50 duration-150">
                  <div className="p-3 border-b border-gray-100 bg-slate-50/50">
                    <span className="text-[11px] font-bold text-gray-500">Hasil Pencarian</span>
                  </div>

                  <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleSelectICD(item)}
                          className="w-full text-left px-4 py-2.5 hover:bg-cyan-50/50 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <span className="font-bold text-cyan-600 w-14 shrink-0">
                              {item.code}
                            </span>
                            <span className="text-gray-700 font-medium truncate group-hover:text-cyan-900">
                              {item.name}
                            </span>
                          </div>
                          <span className="bg-cyan-50 text-cyan-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-cyan-100 shrink-0">
                            ICD-10
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-xs text-gray-400 text-center font-medium">
                        Diagnosis tidak ditemukan.
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-100 bg-white">
                    <button
                      type="button"
                      className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors cursor-pointer"
                    >
                      Lihat semua hasil untuk "{searchQuery}"
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section 2: Diagnosis Terpilih */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-semibold">
              Diagnosis Terpilih {selectedDiagnoses.length > 0 && `(${selectedDiagnoses.length})`}
            </label>

            {/* State 1: Multi Item List (Gambar 02) */}
            {selectedDiagnoses.length > 0 ? (
              <div className="border border-gray-200/80 rounded-xl divide-y divide-gray-100 bg-white overflow-hidden">
                {selectedDiagnoses.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 gap-3 hover:bg-slate-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <GripVertical size={16} className="text-gray-300 cursor-grab shrink-0" />
                      <span className="font-bold text-gray-900 text-xs shrink-0">{item.code}</span>
                      <span className="text-xs text-gray-700 font-medium truncate" title={item.name}>
                        {item.name}
                      </span>
                      <span className="bg-cyan-50 text-cyan-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-cyan-100/60 shrink-0">
                        ICD-10
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-gray-800">{item.tipe}</span>

                      <div className="relative">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleUpdateStatusRow(item.id, e.target.value as 'Ditetapkan' | 'Menunggu')
                          }
                          className="appearance-none border border-emerald-200 text-emerald-700 bg-emerald-50/50 rounded-lg px-2.5 py-1 pr-6 text-xs font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="Ditetapkan">Ditetapkan</option>
                          <option value="Menunggu">Menunggu</option>
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-0.5"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* State 2: Empty State (Gambar 01) */
              <div className="border border-gray-100 rounded-xl p-6 bg-slate-50/30 flex flex-col items-center justify-center min-h-[140px]">
                <div className="w-16 h-16 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex items-center justify-center mb-3 text-cyan-400">
                  <FileSearch size={28} strokeWidth={1.5} />
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Belum ada diagnosis yang dipilih
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Dropdown Tipe Diagnosis & Status Default */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-semibold">
                Tipe Diagnosis
              </label>
              <div className="relative">
                <select
                  value={defaultTipe}
                  onChange={(e) => setDefaultTipe(e.target.value as 'Akut' | 'Kronis')}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                >
                  <option value="Akut">Akut</option>
                  <option value="Kronis">Kronis</option>
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-semibold">
                Status
              </label>
              <div className="relative">
                <select
                  value={defaultStatus}
                  onChange={(e) => setDefaultStatus(e.target.value as 'Ditetapkan' | 'Menunggu')}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-emerald-600 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                >
                  <option value="Ditetapkan">Ditetapkan</option>
                  <option value="Menunggu">Menunggu</option>
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Deskripsi Tambahan (Opsional) */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-semibold">
              Deskripsi Tambahan <span className="font-normal text-gray-400">(Opsional)</span>
            </label>
            <div className="relative">
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                maxLength={255}
                placeholder="Tambahkan deskripsi jika diperlukan"
                className="w-full border border-gray-200 rounded-xl p-3 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all min-h-[85px] resize-none placeholder:text-gray-400"
              />
              <div className="absolute bottom-2.5 right-3 text-[10px] text-gray-400 font-medium bg-white px-1">
                {deskripsi.length} / 255
              </div>
            </div>
          </div>

          {/* Footer Actions */}
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
              disabled={selectedDiagnoses.length === 0}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer ${
                selectedDiagnoses.length > 0
                  ? 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white'
                  : 'bg-cyan-300 text-white cursor-not-allowed'
              }`}
            >
              Tambah Diagnosis
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}