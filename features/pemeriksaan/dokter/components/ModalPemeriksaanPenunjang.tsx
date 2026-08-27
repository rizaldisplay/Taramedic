'use client';

import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  Circle,
} from 'lucide-react';

export type PriorityLevel = 'Rutin' | 'Segera' | 'Stat';

export interface PermintaanPenunjangData {
  kategori: string;
  pemeriksaanList: string[];
  prioritas: PriorityLevel;
  diagnosaIndikasi: string;
  instruksiTambahan?: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  unitRuang: string;
  jenisSampel: string;
  keteranganSampel?: string;
}

interface ModalMintaPemeriksaanPenunjangProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: PermintaanPenunjangData) => void;
}

export default function ModalMintaPemeriksaanPenunjang({
  isOpen,
  onClose,
  onSubmit,
}: ModalMintaPemeriksaanPenunjangProps) {
  // Form State
  const [kategori, setKategori] = useState('Laboratorium');
  const [selectedPemeriksaan, setSelectedPemeriksaan] = useState<string[]>([
    'Darah Lengkap (DL)',
  ]);
  const [prioritas, setPrioritas] = useState<PriorityLevel>('Rutin');
  const [diagnosaIndikasi, setDiagnosaIndikasi] = useState(
    'Demam sejak 2 hari, lemas, dicurigai gastroenteritis akut.'
  );
  const [instruksiTambahan, setInstruksiTambahan] = useState('');
  
  // Date & Time Defaults
  const [tanggal, setTanggal] = useState('16/08/2026');
  const [waktu, setWaktu] = useState('08:52 WIB');

  // Location & Sample Defaults
  const [lokasi, setLokasi] = useState('Laboratorium Klinik');
  const [unitRuang, setUnitRuang] = useState('Laboratorium Utama');
  const [jenisSampel, setJenisSampel] = useState('Darah Vena');
  const [keteranganSampel, setKeteranganSampel] = useState('');

  if (!isOpen) return null;

  const handleRemovePemeriksaan = (itemToRemove: string) => {
    setSelectedPemeriksaan((prev) => prev.filter((item) => item !== itemToRemove));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: PermintaanPenunjangData = {
      kategori,
      pemeriksaanList: selectedPemeriksaan,
      prioritas,
      diagnosaIndikasi,
      instruksiTambahan,
      tanggal,
      waktu,
      lokasi,
      unitRuang,
      jenisSampel,
      keteranganSampel,
    };
    onSubmit?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Minta Pemeriksaan Penunjang
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              Lengkapi data permintaan pemeriksaan penunjang.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Modal (2 Columns Layout) */}
        <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
            
            {/* ================= KOLOM KIRI ================= */}
            <div className="space-y-4">
              
              {/* 1. Jenis Pemeriksaan */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-blue-600">
                  1. Jenis Pemeriksaan
                </h3>

                {/* Kategori */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-gray-500">Kategori</label>
                  <div className="relative">
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Laboratorium">Laboratorium</option>
                      <option value="Radiologi">Radiologi</option>
                      <option value="Patologi Anatomi">Patologi Anatomi</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Select Pemeriksaan */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-gray-500">Pemeriksaan</label>
                  <div className="relative">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value && !selectedPemeriksaan.includes(e.target.value)) {
                          setSelectedPemeriksaan([...selectedPemeriksaan, e.target.value]);
                        }
                      }}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="" disabled>Cari atau pilih pemeriksaan...</option>
                      <option value="Darah Lengkap (DL)">Darah Lengkap (DL)</option>
                      <option value="Urinalisis Lengkap">Urinalisis Lengkap</option>
                      <option value="Gula Darah Sewaktu (GDS)">Gula Darah Sewaktu (GDS)</option>
                      <option value="Widal Test">Widal Test</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Selected Item Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPemeriksaan.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-100/70"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemovePemeriksaan(item)}
                          className="hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Prioritas */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-blue-600">
                  2. Prioritas
                </h3>

                <div className="space-y-2">
                  {/* Option: Rutin */}
                  <div
                    onClick={() => setPrioritas('Rutin')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      prioritas === 'Rutin'
                        ? 'border-blue-500 bg-blue-50/40 text-blue-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {prioritas === 'Rutin' ? (
                        <CheckCircle2 size={16} className="text-blue-600 fill-blue-600 stroke-white" />
                      ) : (
                        <Circle size={16} className="text-gray-300" />
                      )}
                      <span className="text-xs font-bold">Rutin</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">Hasil dalam 1–2 hari kerja</span>
                  </div>

                  {/* Option: Segera */}
                  <div
                    onClick={() => setPrioritas('Segera')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      prioritas === 'Segera'
                        ? 'border-blue-500 bg-blue-50/40 text-blue-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {prioritas === 'Segera' ? (
                        <CheckCircle2 size={16} className="text-blue-600 fill-blue-600 stroke-white" />
                      ) : (
                        <Circle size={16} className="text-gray-300" />
                      )}
                      <span className="text-xs font-bold">Segera</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">Hasil secepat mungkin</span>
                  </div>

                  {/* Option: Stat */}
                  <div
                    onClick={() => setPrioritas('Stat')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      prioritas === 'Stat'
                        ? 'border-blue-500 bg-blue-50/40 text-blue-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {prioritas === 'Stat' ? (
                        <CheckCircle2 size={16} className="text-blue-600 fill-blue-600 stroke-white" />
                      ) : (
                        <Circle size={16} className="text-gray-300" />
                      )}
                      <span className="text-xs font-bold">Stat</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">Hasil segera (emergency)</span>
                  </div>
                </div>
              </div>

              {/* 3. Diagnosa / Indikasi Klinis */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-blue-600">
                  3. Diagnosa / Indikasi Klinis
                </h3>
                <div className="relative">
                  <textarea
                    value={diagnosaIndikasi}
                    onChange={(e) => setDiagnosaIndikasi(e.target.value)}
                    maxLength={500}
                    className="w-full border border-blue-200 rounded-xl p-3 text-xs font-medium text-blue-900 bg-blue-50/30 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[75px] resize-none"
                  />
                  <div className="text-right text-[10px] text-gray-400 font-medium mt-0.5">
                    {diagnosaIndikasi.length} / 500
                  </div>
                </div>
              </div>

              {/* 4. Instruksi Tambahan (Opsional) */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-blue-600">
                  4. Instruksi Tambahan <span className="font-normal text-gray-400">(Opsional)</span>
                </h3>
                <div className="relative">
                  <textarea
                    value={instruksiTambahan}
                    onChange={(e) => setInstruksiTambahan(e.target.value)}
                    maxLength={300}
                    placeholder="Contoh: Puasa 8-12 jam sebelum pengambilan darah,"
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[75px] resize-none placeholder:text-gray-400"
                  />
                  <div className="text-right text-[10px] text-gray-400 font-medium mt-0.5">
                    {instruksiTambahan.length} / 300
                  </div>
                </div>
              </div>

            </div>


            {/* ================= KOLOM KANAN ================= */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* 5. Tanggal & Waktu Permintaan */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-blue-600">
                    5. Tanggal & Waktu Permintaan
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-500">Tanggal</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={tanggal}
                          onChange={(e) => setTanggal(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <Calendar size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-500">Waktu</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={waktu}
                          onChange={(e) => setWaktu(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <Clock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Lokasi / Unit Tujuan */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-blue-600">
                    6. Lokasi / Unit Tujuan
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500">Lokasi</label>
                    <div className="relative">
                      <select
                        value={lokasi}
                        onChange={(e) => setLokasi(e.target.value)}
                        className="w-full appearance-none border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Laboratorium Klinik">Laboratorium Klinik</option>
                        <option value="Radiologi Sentral">Radiologi Sentral</option>
                      </select>
                      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500">Unit / Ruang</label>
                    <div className="relative">
                      <select
                        value={unitRuang}
                        onChange={(e) => setUnitRuang(e.target.value)}
                        className="w-full appearance-none border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Laboratorium Utama">Laboratorium Utama</option>
                        <option value="Laboratorium Cito">Laboratorium Cito</option>
                      </select>
                      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 7. Sampel */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-blue-600">
                    7. Sampel
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500">Jenis Sampel</label>
                    <div className="relative">
                      <select
                        value={jenisSampel}
                        onChange={(e) => setJenisSampel(e.target.value)}
                        className="w-full appearance-none border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Darah Vena">Darah Vena</option>
                        <option value="Darah Kapiler">Darah Kapiler</option>
                        <option value="Urine Midstream">Urine Midstream</option>
                        <option value="Feses">Feses</option>
                      </select>
                      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500">
                      Keterangan Sampel <span className="font-normal text-gray-400">(Opsional)</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={keteranganSampel}
                        onChange={(e) => setKeteranganSampel(e.target.value)}
                        maxLength={100}
                        placeholder="Contoh: EDTA 2 ml"
                        className="w-full border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[75px] resize-none placeholder:text-gray-400"
                      />
                      <div className="text-right text-[10px] text-gray-400 font-medium mt-0.5">
                        {keteranganSampel.length} / 100
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Send size={14} />
                  <span>Kirim Permintaan</span>
                </button>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}