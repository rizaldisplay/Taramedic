"use client";

import React, { useState } from "react";
import { Printer, X, Minus, Plus, QrCode } from "lucide-react";

interface ModalCetakStrukProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint?: () => void;
  dataStruk?: {
    noInvoice?: string;
    noKunjungan?: string;
    tanggal?: string;
    kasir?: string;
    namaPasien?: string;
    noRM?: string;
    poli?: string;
    dokter?: string;
    items?: Array<{
      id: number;
      komponen: string;
      qty: number;
      harga: number;
      total: number;
    }>;
    subtotalLayanan?: number;
    subtotalObat?: number;
    diskon?: number;
    biayaTambahan?: number;
    totalDibayar?: number;
    metodePembayaran?: string;
    nominalDibayar?: number;
    kembalian?: number;
  };
}

export default function ModalCetakStruk({
  isOpen,
  onClose,
  onPrint,
  dataStruk = {
    noInvoice: "INV-20260816-027",
    noKunjungan: "KJ-20260816-027",
    tanggal: "24/06/2026 10:30 WIB",
    kasir: "Kasir Loket 1",
    namaPasien: "Sujewo",
    noRM: "RM-000647",
    poli: "Poli Umum",
    dokter: "dr. Andi Pratama",
    items: [
      { id: 1, komponen: "Konsultasi Dokter Umum", qty: 1, harga: 100000, total: 100000 },
      { id: 2, komponen: "Pemeriksaan Fisik Umum", qty: 1, harga: 20000, total: 20000 },
      { id: 3, komponen: "Paracetamol 500 mg", qty: 1, harga: 5000, total: 5000 },
      { id: 4, komponen: "Loratadine 10 mg", qty: 1, harga: 6000, total: 6000 },
      { id: 5, komponen: "Ambroxol 30 mg", qty: 1, harga: 7000, total: 7000 },
    ],
    subtotalLayanan: 120000,
    subtotalObat: 18000,
    diskon: 0,
    biayaTambahan: 0,
    totalDibayar: 138000,
    metodePembayaran: "Tunai",
    nominalDibayar: 150000,
    kembalian: 12000,
  },
}: ModalCetakStrukProps) {
  const [selectedPrinter, setSelectedPrinter] = useState("Printer Kasir (POS-80mm)");
  const [paperSize, setPaperSize] = useState<"80mm" | "A4">("80mm");
  const [printCount, setPrintCount] = useState(1);
  const [showLogo, setShowLogo] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showQrCode, setShowQrCode] = useState(true);
  const [autoCut, setAutoCut] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 font-sans text-slate-800">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Cetak Struk Pembayaran</h2>
            <p className="text-xs text-slate-500 mt-0.5">Pratinjau struk pembayaran Anda.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          
          {/* KOLOM KIRI: Pratinjau Struk (Thermal POS Look) */}
          <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center">
            <div className="bg-white w-full max-w-[280px] border border-slate-200 shadow-xs p-4 text-[10px] font-mono leading-tight space-y-2 text-slate-800">
              
              {/* Logo Header Struk */}
              {showLogo && (
                <div className="text-center pb-2 border-b border-dashed border-slate-300">
                  <div className="flex items-center justify-center gap-1 font-bold text-blue-600 text-xs uppercase mb-0.5">
                    <span className="text-blue-600 font-extrabold">+</span> KLINIK TARAMEDIC
                  </div>
                  <p className="text-[9px] text-slate-500">Jl. Melati No. 12, Bandung 40123</p>
                  <p className="text-[9px] text-slate-500">Telp. (022) 1234567</p>
                </div>
              )}

              {/* Detail Transaksi */}
              <div className="py-1 border-b border-dashed border-slate-300 text-[9.5px]">
                <p className="font-bold text-center mb-1 uppercase tracking-wider text-[10px]">STRUK PEMBAYARAN</p>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500">Invoice</span>
                  <span className="col-span-7 font-bold">: {dataStruk.noInvoice}</span>
                  <span className="col-span-5 text-slate-500">No. Kunjungan</span>
                  <span className="col-span-7">: {dataStruk.noKunjungan}</span>
                  <span className="col-span-5 text-slate-500">Tanggal / Waktu</span>
                  <span className="col-span-7">: {dataStruk.tanggal}</span>
                  <span className="col-span-5 text-slate-500">Kasir</span>
                  <span className="col-span-7">: {dataStruk.kasir}</span>
                </div>
                <div className="mt-1 pt-1 border-t border-slate-100 grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-500">Pasien</span>
                  <span className="col-span-7 font-bold">: {dataStruk.namaPasien}</span>
                  <span className="col-span-5 text-slate-500">No. RM</span>
                  <span className="col-span-7">: {dataStruk.noRM}</span>
                  <span className="col-span-5 text-slate-500">Poli</span>
                  <span className="col-span-7">: {dataStruk.poli}</span>
                  <span className="col-span-5 text-slate-500">Dokter</span>
                  <span className="col-span-7">: {dataStruk.dokter}</span>
                </div>
              </div>

              {/* Tabel Item Struk */}
              <div className="py-1 border-b border-dashed border-slate-300">
                <div className="grid grid-cols-12 font-bold mb-1 border-b border-slate-100 pb-1">
                  <span className="col-span-1">No.</span>
                  <span className="col-span-6">Komponen</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-3 text-right">Total</span>
                </div>
                <div className="space-y-1">
                  {dataStruk.items?.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 items-start">
                      <span className="col-span-1 text-slate-500">{item.id}</span>
                      <span className="col-span-6 leading-tight">{item.komponen}</span>
                      <span className="col-span-2 text-center">{item.qty}</span>
                      <span className="col-span-3 text-right font-medium">{formatRupiahSimple(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ringkasan Subtotal */}
              <div className="py-1 border-b border-dashed border-slate-300 space-y-0.5 text-[9.5px]">
                <div className="flex justify-between">
                  <span>Subtotal Layanan</span>
                  <span>{formatRupiahSimple(dataStruk.subtotalLayanan || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal Obat</span>
                  <span>{formatRupiahSimple(dataStruk.subtotalObat || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Diskon</span>
                  <span>{formatRupiahSimple(dataStruk.diskon || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Tambahan</span>
                  <span>{formatRupiahSimple(dataStruk.biayaTambahan || 0)}</span>
                </div>
              </div>

              {/* Total & Pembayaran */}
              <div className="py-1 space-y-0.5 text-[10px]">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>TOTAL DIBAYAR</span>
                  <span>{formatRupiahSimple(dataStruk.totalDibayar || 0)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Metode Pembayaran</span>
                  <span>{dataStruk.metodePembayaran}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Nominal Dibayar</span>
                  <span>{formatRupiahSimple(dataStruk.nominalDibayar || 0)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Kembalian</span>
                  <span>{formatRupiahSimple(dataStruk.kembalian || 0)}</span>
                </div>
              </div>

              {/* QR Code & Footer Struk */}
              {(showQrCode || showFooter) && (
                <div className="pt-2 text-center border-t border-dashed border-slate-300 space-y-1">
                  {showQrCode && (
                    <div className="flex justify-center py-1">
                      <QrCode className="w-10 h-10 text-slate-800" />
                    </div>
                  )}
                  {showFooter && (
                    <div className="text-[8.5px] text-slate-500 leading-tight">
                      <p>Terima kasih atas kepercayaan Anda.</p>
                      <p>Semoga lekas sembuh.</p>
                      <p className="mt-1 text-[8px] italic">--- Struk ini bukan sebagai bukti klaim asuransi ---</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* KOLOM KANAN: Form Pengaturan Cetak */}
          <div className="md:col-span-6 space-y-5 text-xs">
            
            {/* Pilih Printer */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                PILIH PRINTER
              </label>
              <div className="relative">
                <select
                  value={selectedPrinter}
                  onChange={(e) => setSelectedPrinter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="Printer Kasir (POS-80mm)">Printer Kasir (POS-80mm)</option>
                  <option value="Printer Kantor (Epson L3110)">Printer Kantor (Epson L3110)</option>
                </select>
                <Printer className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-400">USB001</p>
            </div>

            {/* Ukuran Kertas */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                UKURAN KERTAS
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paperSize"
                    checked={paperSize === "80mm"}
                    onChange={() => setPaperSize("80mm")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-700">80 mm (Struk Kecil)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paperSize"
                    checked={paperSize === "A4"}
                    onChange={() => setPaperSize("A4")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-700">A4 (Struk Besar)</span>
                </label>
              </div>
            </div>

            {/* Jumlah Cetak */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                JUMLAH CETAK
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPrintCount((prev) => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm w-6 text-center">{printCount}</span>
                <button
                  type="button"
                  onClick={() => setPrintCount((prev) => prev + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Opsi Cetak */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                OPSI CETAK
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-700">Tampilkan Logo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFooter}
                    onChange={(e) => setShowFooter(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-700">Tampilkan Footer</span>
                </label>

                <div className="flex items-start gap-2">
                  <label className="flex items-center gap-2 cursor-pointer mt-0.5">
                    <input
                      type="checkbox"
                      checked={showQrCode}
                      onChange={(e) => setShowQrCode(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-700">Tampilkan Kode QR</span>
                  </label>
                  <span className="text-[10px] text-slate-400 leading-tight">Untuk validasi pembayaran</span>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCut}
                      onChange={(e) => setAutoCut(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-slate-700 block">Potong otomatis kertas</span>
                      <span className="text-[10px] text-slate-400 block">Setelah selesai mencetak</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer (Action Buttons) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Sekarang</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// --- Helper Formatting Rupiah ---
function formatRupiahSimple(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount).replace("Rp", "Rp ");
}