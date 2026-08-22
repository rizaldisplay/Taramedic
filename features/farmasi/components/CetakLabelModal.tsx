/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState } from "react";
import { X, Info, Printer, Plus, Minus, QrCode } from "lucide-react";

// --- Interfaces & Types ---
export interface LabelItem {
  id: string;
  no: number;
  namaObat: string;
  bentuk: string;
  jumlah: string;
  aturanPakai: string;
  rute: string;
  tanggal: string;
  noAntreanRM: string;
  namaPasien: string;
  umurPasien: string;
  dokter: string;
  kategori: "Non-Racikan" | "Racikan";
}

export interface PrintOptions {
  ukuranKertas: string;
  jumlahCopy: number;
  printer: string;
  jenisLabel: "Standar" | "Besar";
  urutanCetak: "Sesuai Urutan Obat" | "Berdasarkan Jenis (Kelompok)";
}

export interface CetakLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint?: (selectedIds: string[], printOptions: PrintOptions) => void;
}

export default function CetakLabelModal({
  isOpen,
  onClose,
  onPrint,
}: CetakLabelModalProps) {
  if (!isOpen) return null;

  // Data acuan dari gambar
  const itemsList: LabelItem[] = [
    {
      id: "1",
      no: 1,
      namaObat: "Paracetamol 500 mg",
      bentuk: "Tablet",
      jumlah: "10 Tablet",
      aturanPakai: "3 x sehari sesudah makan",
      rute: "Oral",
      tanggal: "16/08/2026",
      noAntreanRM: "A013 / RM-000036",
      namaPasien: "Rizka Amalia",
      umurPasien: "8 thn",
      dokter: "dr. Bima, Sp.A",
      kategori: "Non-Racikan",
    },
    {
      id: "2",
      no: 2,
      namaObat: "Cetirizine 10 mg",
      bentuk: "Tablet",
      jumlah: "5 Tablet",
      aturanPakai: "1 x sehari malam hari",
      rute: "Oral",
      tanggal: "16/08/2026",
      noAntreanRM: "A013 / RM-000036",
      namaPasien: "Rizka Amalia",
      umurPasien: "8 thn",
      dokter: "dr. Bima, Sp.A",
      kategori: "Non-Racikan",
    },
    {
      id: "3",
      no: 3,
      namaObat: "Racikan 1 - Puyer",
      bentuk: "Puyer",
      jumlah: "10 Bungkus",
      aturanPakai: "3 x sehari sesudah makan",
      rute: "Oral",
      tanggal: "16/08/2026",
      noAntreanRM: "A013 / RM-000036",
      namaPasien: "Rizka Amalia",
      umurPasien: "8 thn",
      dokter: "dr. Bima, Sp.A",
      kategori: "Racikan",
    },
  ];

  // State
  const [activeTab, setActiveTab] = useState<
    "Semua" | "Non-Racikan" | "Racikan"
  >("Non-Racikan");
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "2"]); // Default item 1 & 2 tercentang

  // Form State Opsi Cetak
  const [ukuranKertas, setUkuranKertas] = useState<string>(
    "Label 4 x 6 cm (2 Kolom)",
  );
  const [jumlahCopy, setJumlahCopy] = useState<number>(1);
  const [printer, setPrinter] = useState<string>("Zebra ZD420 (Label)");
  const [jenisLabel, setJenisLabel] = useState<"Standar" | "Besar">("Standar");
  const [urutanCetak, setUrutanCetak] = useState<
    "Sesuai Urutan Obat" | "Berdasarkan Jenis (Kelompok)"
  >("Sesuai Urutan Obat");

  // Checkbox Select Handler
  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isAllSelected = selectedIds.length === itemsList.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(itemsList.map((item) => item.id));
    }
  };

  const filteredItems = itemsList.filter((item) => {
    if (activeTab === "Non-Racikan") return item.kategori === "Non-Racikan";
    if (activeTab === "Racikan") return item.kategori === "Racikan";
    return true;
  });

  const handlePrintSubmit = () => {
    if (onPrint) {
      onPrint(selectedIds, {
        ukuranKertas,
        jumlahCopy,
        printer,
        jenisLabel,
        urutanCetak,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden my-auto border border-slate-100 transition-all transform animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            Cetak Label Obat
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 max-h-[82vh] overflow-y-auto bg-slate-50/30">
          {/* Info Banner */}
          <div className="bg-blue-50/60 border border-blue-100/80 rounded-xl p-3 flex items-center gap-2.5 text-blue-700 text-xs">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Pilih obat untuk dicetak labelnya. Label akan dicetak sesuai
              format standar.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: SELEKSI ITEM OBAT & PREVIEW ETIKET (7 COLS) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Tabs Filter */}
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
                <button
                  onClick={() => setActiveTab("Non-Racikan")}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === "Non-Racikan"
                      ? "text-blue-600 border-b-2 border-blue-600 rounded-b-none bg-blue-50/40"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Non-Racikan (2)
                </button>
                <button
                  onClick={() => setActiveTab("Racikan")}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === "Racikan"
                      ? "text-blue-600 border-b-2 border-blue-600 rounded-b-none bg-blue-50/40"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Racikan (1)
                </button>
              </div>

              {/* Items List dengan Label Preview */}
              <div className="flex flex-col gap-4">
                {filteredItems.map((item) => {
                  const isChecked = selectedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 w-full"
                    >
                      {/* Checkbox & Nomor Item (Di-lock agar tidak memengecil/mengembang) */}
                      <label className="flex items-center gap-2 mt-3 cursor-pointer select-none shrink-0 w-36">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                        />
                        <span
                          className="text-xs font-bold text-slate-800 truncate"
                          title={`${item.no}. ${item.namaObat}`}
                        >
                          {item.no}. {item.namaObat}
                        </span>
                      </label>

                      {/* Card Preview Etiket Obat (Terkunci dengan min-w-0) */}
                      <div className="flex-1 min-w-0 bg-white border border-dashed border-slate-300 rounded-xl p-3.5 shadow-2xs relative flex flex-col justify-between">
                        <div>
                          {/* 1. Header Label */}
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-2">
                            <div className="flex items-center gap-1 text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                              <span className="text-blue-500">✦</span> TARAMEDIC
                            </div>
                            <span className="text-[9px] font-mono text-slate-400 uppercase">
                              ETIKET APOTEK
                            </span>
                          </div>

                          {/* 2. Nama Obat (Dibatasi maksimal 1 baris dengan truncation) */}
                          <h4
                            className="text-xs font-extrabold text-slate-900 uppercase tracking-tight truncate leading-tight"
                            title={item.namaObat}
                          >
                            {item.namaObat}
                          </h4>

                          {/* 3. Grid Dosis, Informasi & QR Code (Flex-Row Presisi Kanan-Kiri) */}
                          <div className="flex items-start justify-between gap-3 mt-2">
                            {/* Kolom Informasi Teks Kiri */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1 text-[11px] text-slate-700">
                              {/* Aturan Pakai (Maksimal 2 baris agar tidak merusak tinggi card) */}
                              <div className="flex items-start gap-1">
                                <span className="text-slate-400 text-[10px] shrink-0">
                                  Aturan Pakai:
                                </span>
                                <span className="font-bold text-slate-900 line-clamp-2 leading-snug">
                                  {item.aturanPakai}
                                </span>
                              </div>

                              {/* Badge Jumlah & Rute */}
                              <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-0.5">
                                <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80 shrink-0">
                                  {item.jumlah}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="font-medium text-slate-600 truncate">
                                  {item.rute}
                                </span>
                              </div>

                              {/* Tanggal & No. RM */}
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                                <span className="shrink-0">{item.tanggal}</span>
                                <span className="text-slate-300">•</span>
                                <span className="font-mono font-semibold text-slate-700 truncate">
                                  {item.noAntreanRM}
                                </span>
                              </div>
                            </div>

                            {/* QR Code Container (Fixed Size 48x48 / 12x12 tailwind) */}
                            <div className="shrink-0 w-12 h-12 p-1 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                              <QrCode className="w-10 h-10 text-slate-800" />
                            </div>
                          </div>
                        </div>

                        {/* 4. Footer Pasien & Dokter (Terkunci di paling bawah) */}
                        <div className="border-t border-slate-100 pt-2 mt-3 flex justify-between items-center text-[10px] bg-slate-50/60 -mx-3.5 -mb-3.5 p-2.5 rounded-b-xl">
                          <div className="min-w-0 pr-2">
                            <span
                              className="font-bold text-slate-900 block truncate"
                              title={`${item.namaPasien} (${item.umurPasien})`}
                            >
                              {item.namaPasien} ({item.umurPasien})
                            </span>
                          </div>
                          <div className="shrink-0 text-right">
                            <span
                              className="text-slate-500 block truncate max-w-[120px]"
                              title={item.dokter}
                            >
                              {item.dokter}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Checkbox Pilih Semua */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-blue-600 hover:text-blue-700 w-fit">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Pilih Semua</span>
                </label>
              </div>
            </div>

            {/* RIGHT COLUMN: OPSI CETAK & PREVIEW HALAMAN (5 COLS) */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-2">
                Opsi Cetak
              </h3>

              <div className="space-y-3 text-xs">
                {/* Ukuran Kertas */}
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">
                    Ukuran Kertas
                  </label>
                  <select
                    value={ukuranKertas}
                    onChange={(e) => setUkuranKertas(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 bg-white"
                  >
                    <option>Label 4 x 6 cm (2 Kolom)</option>
                    <option>Label 5 x 7 cm (1 Kolom)</option>
                    <option>Thermal Roll 80mm</option>
                  </select>
                </div>

                {/* Jumlah Copy */}
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">
                    Jumlah Copy
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setJumlahCopy((prev) => Math.max(1, prev - 1))
                      }
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-800 text-sm">
                      {jumlahCopy}
                    </span>
                    <button
                      onClick={() => setJumlahCopy((prev) => prev + 1)}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Printer */}
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">
                    Printer
                  </label>
                  <select
                    value={printer}
                    onChange={(e) => setPrinter(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 bg-white"
                  >
                    <option>Zebra ZD420 (Label)</option>
                    <option>EPSON TM-T82 (Receipt)</option>
                    <option>Printer Sistem (Default)</option>
                  </select>
                </div>

                {/* Jenis Label */}
                <div>
                  <label className="block text-slate-500 mb-1.5 font-medium">
                    Jenis Label
                  </label>
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="jenisLabel"
                        checked={jenisLabel === "Standar"}
                        onChange={() => setJenisLabel("Standar")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Label Obat Standar</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="jenisLabel"
                        checked={jenisLabel === "Besar"}
                        onChange={() => setJenisLabel("Besar")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Label Obat Besar</span>
                    </label>
                  </div>
                </div>

                {/* Urutan Cetak */}
                <div>
                  <label className="block text-slate-500 mb-1.5 font-medium">
                    Urutan Cetak
                  </label>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="urutanCetak"
                        checked={urutanCetak === "Sesuai Urutan Obat"}
                        onChange={() => setUrutanCetak("Sesuai Urutan Obat")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Sesuai Urutan Obat</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="urutanCetak"
                        checked={urutanCetak === "Berdasarkan Jenis (Kelompok)"}
                        onChange={() =>
                          setUrutanCetak("Berdasarkan Jenis (Kelompok)")
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Berdasarkan Jenis (Kelompok)</span>
                    </label>
                  </div>
                </div>

                {/* Preview Halaman Layout */}
                <div className="pt-2">
                  <label className="block text-slate-500 mb-1.5 font-medium">
                    Preview Halaman
                  </label>
                  <div className="grid grid-cols-2 gap-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                    <div className="border border-slate-300 bg-white rounded p-2 text-center text-xs font-bold text-slate-700 shadow-2xs">
                      1
                    </div>
                    <div className="border border-slate-300 bg-white rounded p-2 text-center text-xs font-bold text-slate-700 shadow-2xs">
                      2
                    </div>
                    <div className="border border-slate-300 bg-white rounded p-2 text-center text-xs font-bold text-slate-700 shadow-2xs">
                      3
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Options Column */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={handlePrintSubmit}
                  disabled={selectedIds.length === 0}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Label ({selectedIds.length})</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
