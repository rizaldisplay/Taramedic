"use client";

import React, { useState } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

interface TransaksiItem {
  no: number;
  tanggal: string;
  waktu: string;
  noTransaksi: string;
  jenisTransaksi: "Pembayaran" | "Invoice" | "Klaim BPJS" | "Billing" | "Registrasi";
  uraian: string;
  nominal: string;
  penjaminMetode: string;
  status: "Lunas / Covered" | "Final" | "Disetujui" | "Selesai";
  user: string;
}

export default function RiwayatTransaksi() {
  const [selectedNoTransaksi, setSelectedNoTransaksi] = useState<string>("PAY-20260816-013");

  const transactions: TransaksiItem[] = [
    {
      no: 1,
      tanggal: "16/08/2026",
      waktu: "09:12 WIB",
      noTransaksi: "PAY-20260816-013",
      jenisTransaksi: "Pembayaran",
      uraian: "Pembayaran Pasien (Tanggungan)",
      nominal: "Rp 0",
      penjaminMetode: "BPJS Kesehatan",
      status: "Lunas / Covered",
      user: "Kasir Loket 1",
    },
    {
      no: 2,
      tanggal: "16/08/2026",
      waktu: "09:10 WIB",
      noTransaksi: "INV-20260816-013",
      jenisTransaksi: "Invoice",
      uraian: "Invoice / Tagihan Kunjungan",
      nominal: "Rp 250.000",
      penjaminMetode: "BPJS Kesehatan",
      status: "Final",
      user: "Sistem",
    },
    {
      no: 3,
      tanggal: "16/08/2026",
      waktu: "09:05 WIB",
      noTransaksi: "CLAIM-20260816-013",
      jenisTransaksi: "Klaim BPJS",
      uraian: "Klaim BPJS (V-Klaim)",
      nominal: "Rp 250.000",
      penjaminMetode: "BPJS Kesehatan",
      status: "Disetujui",
      user: "Kasir Loket 1",
    },
    {
      no: 4,
      tanggal: "16/08/2026",
      waktu: "09:04 WIB",
      noTransaksi: "CLAIM-20260816-013-R",
      jenisTransaksi: "Klaim BPJS",
      uraian: "Response Klaim BPJS",
      nominal: "Rp 250.000",
      penjaminMetode: "BPJS Kesehatan",
      status: "Disetujui",
      user: "Sistem BPJS",
    },
    {
      no: 5,
      tanggal: "16/08/2026",
      waktu: "08:52 WIB",
      noTransaksi: "BILL-20260816-013",
      jenisTransaksi: "Billing",
      uraian: "Pembentukan Billing",
      nominal: "Rp 250.000",
      penjaminMetode: "BPJS Kesehatan",
      status: "Selesai",
      user: "Sistem",
    },
    {
      no: 6,
      tanggal: "16/08/2026",
      waktu: "08:05 WIB",
      noTransaksi: "REG-20260816-013",
      jenisTransaksi: "Registrasi",
      uraian: "Registrasi Kunjungan",
      nominal: "-",
      penjaminMetode: "-",
      status: "Selesai",
      user: "Petugas FO",
    },
  ];

  // Helper Badge Jenis Transaksi
  const getJenisBadge = (jenis: TransaksiItem["jenisTransaksi"]) => {
    switch (jenis) {
      case "Pembayaran":
        return "bg-cyan-50 text-cyan-600";
      case "Invoice":
        return "bg-slate-100 text-slate-600";
      case "Klaim BPJS":
        return "bg-sky-50 text-sky-600";
      case "Billing":
        return "bg-cyan-50/80 text-cyan-500";
      case "Registrasi":
        return "bg-emerald-50 text-emerald-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // Helper Badge Status Transaksi
  const getStatusBadge = (status: TransaksiItem["status"]) => {
    switch (status) {
      case "Lunas / Covered":
      case "Disetujui":
        return "bg-emerald-50 text-emerald-600";
      case "Final":
      case "Selesai":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="w-full bg-white font-sans space-y-6">
      
      {/* Title Section */}
      <div>
        <h2 className="text-[14px] font-bold text-slate-800 tracking-wide uppercase">
          RIWAYAT TRANSAKSI
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Riwayat transaksi keuangan dan klaim terkait kunjungan pasien sesuai regulasi SATUSEHAT & Permenkes No. 24 Tahun 2022.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
        {/* Input Search */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari no. transaksi, jenis transaksi, atau keterangan..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-[12px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Date Range Picker */}
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>16/08/2026 - 16/08/2026</span>
          </button>

          {/* Select Jenis */}
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 transition-colors">
            <span>Semua Jenis</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Filter Button */}
          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Tabel Riwayat Transaksi */}
      <div className="w-full overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-[12px] text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="py-3 px-3 text-center w-10">No.</th>
              <th className="py-3 px-3">Tanggal</th>
              <th className="py-3 px-3">No. Transaksi</th>
              <th className="py-3 px-3">Jenis Transaksi</th>
              <th className="py-3 px-3">Uraian</th>
              <th className="py-3 px-3 text-right">Nominal</th>
              <th className="py-3 px-3">Penjamin/Metode</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((row) => {
              const isSelected = selectedNoTransaksi === row.noTransaksi;
              return (
                <tr
                  key={row.no}
                  onClick={() => setSelectedNoTransaksi(row.noTransaksi)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-cyan-50/30" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-3 px-3 text-center text-slate-500 font-medium">
                    {row.no}
                  </td>
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                    <div>{row.tanggal}</div>
                    <div className="text-[10px] text-slate-400">{row.waktu}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {row.noTransaksi}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${getJenisBadge(
                        row.jenisTransaksi
                      )}`}
                    >
                      {row.jenisTransaksi}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{row.uraian}</td>
                  <td className="py-3 px-3 text-right font-medium text-slate-800 whitespace-nowrap">
                    {row.nominal}
                  </td>
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                    {row.penjaminMetode}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${getStatusBadge(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {row.user}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-500">
          <span>Menampilkan 1 - 6 dari 6 data</span>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="p-1 border border-slate-200 rounded opacity-40 cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 bg-cyan-600 text-white font-medium rounded flex items-center justify-center">
              1
            </button>
            <button
              disabled
              className="p-1 border border-slate-200 rounded opacity-40 cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Transaksi Terpilih */}
      <div className="w-full bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        {/* Card Header Detail */}
        <div className="flex items-center gap-3">
          <h3 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase">
            DETAIL TRANSAKSI TERPILIH
          </h3>
          <span className="bg-emerald-50 text-emerald-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
            {selectedNoTransaksi}
          </span>
        </div>

        {/* 3 Columns Layout Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 text-[12px]">
          {/* Kolom 1: Informasi Transaksi */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800 mb-3">Informasi Transaksi</h4>
            <div className="grid grid-cols-[110px_1fr] gap-y-2">
              <span className="text-slate-500">Jenis Transaksi</span>
              <span className="font-medium text-slate-800">Pembayaran</span>

              <span className="text-slate-500">Tanggal & Waktu</span>
              <span className="font-medium text-slate-800">16/08/2026 09:12 WIB</span>

              <span className="text-slate-500">Nomor Transaksi</span>
              <span className="font-medium text-slate-800">PAY-20260816-013</span>

              <span className="text-slate-500">Metode</span>
              <span className="font-medium text-slate-800">BPJS Kesehatan (V-Klaim)</span>

              <span className="text-slate-500">User</span>
              <span className="font-medium text-slate-800">Kasir Loket 1</span>
            </div>
          </div>

          {/* Kolom 2: Rincian Pembayaran */}
          <div className="space-y-2.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
            <h4 className="font-bold text-slate-800 mb-3">Rincian Pembayaran</h4>
            <div className="grid grid-cols-[130px_1fr] gap-y-2">
              <span className="text-slate-500">Total Billing</span>
              <span className="font-semibold text-slate-800 text-right">Rp 250.000</span>

              <span className="text-slate-500">Ditanggung Penjamin</span>
              <span className="font-semibold text-slate-800 text-right">Rp 250.000</span>

              <span className="text-slate-500">Tanggungan Pasien</span>
              <span className="font-semibold text-slate-800 text-right">Rp 0</span>

              <span className="text-slate-500">Jumlah Dibayar Pasien</span>
              <span className="font-semibold text-slate-800 text-right">Rp 0</span>

              <span className="text-slate-500">Status</span>
              <div className="text-right">
                <span className="bg-emerald-50 text-emerald-600 text-[11px] font-semibold px-2 py-0.5 rounded-md inline-block">
                  Lunas / Covered
                </span>
              </div>
            </div>
          </div>

          {/* Kolom 3: Informasi Klaim BPJS */}
          <div className="space-y-2.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
            <h4 className="font-bold text-slate-800 mb-3">Informasi Klaim BPJS</h4>
            <div className="grid grid-cols-[120px_1fr] gap-y-2">
              <span className="text-slate-500">No. SEP</span>
              <span className="font-medium text-slate-800">1018R0020826V000123</span>

              <span className="text-slate-500">Tanggal SEP</span>
              <span className="font-medium text-slate-800">16/08/2026</span>

              <span className="text-slate-500">Jenis Peserta</span>
              <span className="font-medium text-slate-800">PBI (APBN)</span>

              <span className="text-slate-500">FKTP</span>
              <span className="font-medium text-slate-800">Klinik Taramedic</span>

              <span className="text-slate-500">No. Referensi Klaim</span>
              <span className="font-medium text-slate-800">0001267890123</span>
            </div>
          </div>
        </div>

        {/* SATUSEHAT Integration Banner Note */}
        <div className="bg-cyan-50/50 border border-cyan-100 rounded-lg p-3 flex items-start gap-2.5 text-[11px] text-slate-600 mt-4">
          <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
          <span>
            Seluruh data transaksi tersinkronisasi dan terintegrasi dengan SATUSEHAT sesuai resource: Encounter, Procedure, MedicationRequest, MedicationDispense, Coverage, Claim, Payment. Sesuai Permenkes No. 24 Tahun 2022 tentang Rekam Medis Pasal 42-46 terkait keamanan, kerahasiaan, dan ketersediaan data.
          </span>
        </div>
      </div>

    </div>
  );
}