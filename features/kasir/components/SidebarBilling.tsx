"use client";

import React from "react";
import { Info } from "lucide-react";

interface SidebarPembayaranProps {
  subtotalLayanan?: number;
  subtotalObat?: number;
  diskon?: number;
  biayaTambahan?: number;
  statusPembayaran?: string;
  noInvoice?: string;
  waktuPembayaran?: string;
  kasirName?: string;
  metodePembayaran?: string;
  nominalDibayar?: number;
  statusSatusehat?: string;
}

export default function SidebarPembayaran({
  subtotalLayanan = 120000,
  subtotalObat = 18000,
  diskon = 0,
  biayaTambahan = 0,
  statusPembayaran = "Belum Dibayar",
  noInvoice = "INV-20260816-0027",
  waktuPembayaran = "-",
  kasirName = "-",
  metodePembayaran = "-",
  nominalDibayar = 0,
  statusSatusehat = "Belum Sinkron",
}: SidebarPembayaranProps) {
  // Kalkulasi Total
  const totalTagihan = subtotalLayanan + subtotalObat;
  const totalHarusDibayar = totalTagihan - diskon + biayaTambahan;

  return (
    <div className="w-full flex flex-col gap-4 font-sans text-slate-800">
      
      {/* 1. Card Ringkasan Tagihan */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
          RINGKASAN TAGIHAN
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Subtotal Layanan</span>
            <span className="font-semibold text-slate-800">{formatRupiah(subtotalLayanan)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Subtotal Obat</span>
            <span className="font-semibold text-slate-800">{formatRupiah(subtotalObat)}</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="font-bold text-slate-700">Total Tagihan</span>
            <span className="font-extrabold text-cyan-600 text-sm">{formatRupiah(totalTagihan)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Diskon</span>
            <span className="font-semibold text-slate-800">{formatRupiah(diskon)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Biaya Tambahan</span>
            <span className="font-semibold text-slate-800">{formatRupiah(biayaTambahan)}</span>
          </div>

          {/* Total Harus Dibayar Box */}
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="font-extrabold text-slate-900 uppercase text-xs">
              TOTAL HARUS DIBAYAR
            </span>
            <span className="font-extrabold text-cyan-600 text-base">
              {formatRupiah(totalHarusDibayar)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Card Status Pembayaran */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
          STATUS PEMBAYARAN
        </h3>

        {/* Status Badge Box */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg text-center">
          <span className="text-xs font-bold text-amber-800 tracking-wide">
            {statusPembayaran}
          </span>
        </div>

        {/* Detail Transaksi */}
        <div className="space-y-2 text-xs pt-1">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Invoice</span>
            <span className="font-bold text-slate-800">{noInvoice}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Waktu</span>
            <span className="font-semibold text-slate-800">{waktuPembayaran}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Kasir</span>
            <span className="font-semibold text-slate-800">{kasirName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Metode</span>
            <span className="font-semibold text-slate-800">{metodePembayaran}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Nominal Dibayar</span>
            <span className="font-semibold text-slate-800">
              {nominalDibayar > 0 ? formatRupiah(nominalDibayar) : "-"}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500">Status Sinkronisasi SATUSEHAT</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold text-[10px] rounded">
              {statusSatusehat}
            </span>
          </div>
        </div>

        {/* Alert Information Box */}
        <div className="mt-3 p-3 bg-cyan-50/50 border border-cyan-100 rounded-lg flex items-start gap-2.5 text-[11px] text-cyan-900 leading-relaxed">
          <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
          <div>
            <p>Pastikan nominal pembayaran sesuai.</p>
            <p className="text-slate-500">Struk akan tercetak setelah pembayaran berhasil.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

// --- Helper Formatting Rupiah ---
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount).replace("Rp", "Rp ");
}