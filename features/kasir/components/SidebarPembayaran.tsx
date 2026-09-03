"use client";

import React from "react";

interface SidebarBillingUmumProps {
  subtotalLayanan?: number;
  subtotalObat?: number;
  diskon?: number;
  biayaTambahan?: number;
  pajak?: number;
  ditanggungPenjamin?: number;
  sudahDibayar?: number;
  noInvoice?: string;
  statusInvoice?: string;
  penerbit?: string;
  akunPembiayaan?: string;
}

export default function SidebarBillingUmum({
  subtotalLayanan = 120000,
  subtotalObat = 18000,
  diskon = 0,
  biayaTambahan = 0,
  pajak = 0,
  ditanggungPenjamin = 0,
  sudahDibayar = 0,
  noInvoice = "INV-20260816-0027",
  statusInvoice = "Issued / Belum Dibayar",
  penerbit = "Klinik Taramedic",
  akunPembiayaan = "Sujewo - Pembiayaan Mandiri",
}: SidebarBillingUmumProps) {
  // Kalkulasi Total
  const totalTagihan = subtotalLayanan + subtotalObat - diskon + biayaTambahan + pajak;
  const tanggunganPasien = totalTagihan - ditanggungPenjamin - diskon;
  const sisaTagihan = tanggunganPasien - sudahDibayar;

  return (
    <div className="w-full flex flex-col gap-4 font-sans text-slate-800">
      
      {/* 1. Card Ringkasan Pembiayaan */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
          RINGKASAN PEMBIAYAAN
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Subtotal Layanan</span>
            <span className="font-semibold text-slate-800">{formatRupiah(subtotalLayanan)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Subtotal Obat</span>
            <span className="font-semibold text-slate-800">{formatRupiah(subtotalObat)}</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-600">
            <span>Diskon</span>
            <span className="font-semibold text-slate-800">{formatRupiah(diskon)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Biaya Tambahan</span>
            <span className="font-semibold text-slate-800">{formatRupiah(biayaTambahan)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Pajak</span>
            <span className="font-semibold text-slate-800">{formatRupiah(pajak)}</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="font-extrabold text-cyan-600 uppercase text-xs">TOTAL TAGIHAN</span>
            <span className="font-extrabold text-cyan-600 text-sm">{formatRupiah(totalTagihan)}</span>
          </div>
        </div>
      </div>

      {/* 2. Card Tanggungan Pembayaran */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
          TANGGUNGAN PEMBAYARAN
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Total Tagihan</span>
            <span className="font-semibold text-slate-800">{formatRupiah(totalTagihan)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Ditanggung Penjamin</span>
            <span className="font-semibold text-slate-800">{formatRupiah(ditanggungPenjamin)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Diskon</span>
            <span className="font-semibold text-slate-800">{formatRupiah(diskon)}</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="font-bold text-cyan-600">Tanggungan Pasien</span>
            <span className="font-extrabold text-cyan-600">{formatRupiah(tanggunganPasien)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Sudah Dibayar</span>
            <span className="font-semibold text-slate-800">{formatRupiah(sudahDibayar)}</span>
          </div>

          {/* Sisa Tagihan Box Highlight */}
          <div className="mt-2 p-3 bg-emerald-50/60 rounded-lg flex justify-between items-center border border-emerald-100">
            <span className="font-bold text-emerald-700">Sisa Tagihan</span>
            <span className="font-extrabold text-emerald-600 text-sm">{formatRupiah(sisaTagihan)}</span>
          </div>
        </div>
      </div>

      {/* 3. Card Invoice */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
          INVOICE
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">No. Invoice</span>
            <span className="font-bold text-slate-800">{noInvoice}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status</span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-semibold text-[11px] rounded-md">
              {statusInvoice}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Penerbit</span>
            <span className="font-semibold text-slate-800">{penerbit}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Akun Pembiayaan</span>
            <span className="font-semibold text-slate-800">{akunPembiayaan}</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="font-bold text-slate-700">Total Invoice</span>
            <span className="font-extrabold text-cyan-600 text-sm">{formatRupiah(totalTagihan)}</span>
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