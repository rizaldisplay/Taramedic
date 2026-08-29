'use client';

import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';

// --- Types & Interfaces ---
export interface KomposisiBahan {
  no: number;
  namaBahan: string;
  kfaZatAktif: string;
  kekuatan: string;
  jumlahPerBungkus: string;
  jumlahTotal: string;
  status: 'Sesuai' | 'Tidak Sesuai';
}

export interface ItemVerifikasiFarmasi {
  no: number;
  jenis: 'Non-Racikan' | 'Racikan';
  namaObat: string;
  bentukSediaan: string;
  kekuatan: string;
  dosis: string;
  frekuensi: string;
  jumlah: string;
  aturanPakai: string;
  rute: string;
  status: 'Sesuai' | 'Tidak Sesuai';
  komposisi?: KomposisiBahan[];
}

interface VerifikasiFarmasiProps {
  items?: ItemVerifikasiFarmasi[];
}

export default function VerifikasiFarmasi({ items }: VerifikasiFarmasiProps) {
  // Toggle collapsible komposisi racikan
  const [expandedRacikan, setExpandedRacikan] = useState<Record<number, boolean>>({
    3: true, // Default ter-expand pada item racikan no 3
  });

  const toggleRacikan = (no: number) => {
    setExpandedRacikan((prev) => ({
      ...prev,
      [no]: !prev[no],
    }));
  };

  // Data acuan dari gambar
  const defaultItems: ItemVerifikasiFarmasi[] = [
    {
      no: 1,
      jenis: 'Non-Racikan',
      namaObat: 'Paracetamol',
      bentukSediaan: 'Tablet',
      kekuatan: '500 mg',
      dosis: '500 mg',
      frekuensi: '3 x sehari',
      jumlah: '10 tablet',
      aturanPakai: 'Sesudah makan',
      rute: 'Oral',
      status: 'Sesuai',
    },
    {
      no: 2,
      jenis: 'Non-Racikan',
      namaObat: 'Cetirizine',
      bentukSediaan: 'Tablet',
      kekuatan: '10 mg',
      dosis: '10 mg',
      frekuensi: '1 x sehari',
      jumlah: '5 tablet',
      aturanPakai: 'Malam hari',
      rute: 'Oral',
      status: 'Sesuai',
    },
    {
      no: 3,
      jenis: 'Racikan',
      namaObat: 'Racikan 1 (Puyer)',
      bentukSediaan: 'Puyer',
      kekuatan: '-',
      dosis: '-',
      frekuensi: '3 x sehari',
      jumlah: '10 bungkus',
      aturanPakai: 'Sesudah makan',
      rute: 'Oral',
      status: 'Sesuai',
      komposisi: [
        {
          no: 1,
          namaBahan: 'Paracetamol',
          kfaZatAktif: 'Zat aktif: Paracetamol',
          kekuatan: '500 mg',
          jumlahPerBungkus: '1 tablet',
          jumlahTotal: '10 tablet',
          status: 'Sesuai',
        },
        {
          no: 2,
          namaBahan: 'CTM',
          kfaZatAktif: 'Zat aktif: Chlorpheniramine Maleate',
          kekuatan: '4 mg',
          jumlahPerBungkus: '1 tablet',
          jumlahTotal: '10 tablet',
          status: 'Sesuai',
        },
        {
          no: 3,
          namaBahan: 'Bahan Pengisi',
          kfaZatAktif: '-',
          kekuatan: '-',
          jumlahPerBungkus: 'secukupnya',
          jumlahTotal: 'secukupnya',
          status: 'Sesuai',
        },
      ],
    },
  ];

  const dataList = items || defaultItems;

  return (
    // Menghapus max-w-5xl agar memenuhi lebar porsi layout utama
    <div className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4 font-sans">
      
      {/* Header Section B */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-6 h-6 rounded-full bg-taramedic text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          B
        </div>
        <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
          VERIFIKASI FARMASI (SETIAP ITEM OBAT)
        </h3>
      </div>

      {/* Table Item Obat */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 w-full">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80">
            <tr>
              <th className="p-3 w-8 text-center">No.</th>
              <th className="p-3">Jenis</th>
              <th className="p-3">Nama Obat</th>
              <th className="p-3">Bentuk Sediaan</th>
              <th className="p-3">Kekuatan</th>
              <th className="p-3">Dosis</th>
              <th className="p-3">Frekuensi</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Aturan Pakai</th>
              <th className="p-3">Rute</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {dataList.map((item) => (
              <React.Fragment key={item.no}>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 font-semibold text-slate-800 text-center">{item.no}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        item.jenis === 'Racikan'
                          ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      }`}
                    >
                      {item.jenis}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-800">{item.namaObat}</td>
                  <td className="p-3">{item.bentukSediaan}</td>
                  <td className="p-3">{item.kekuatan}</td>
                  <td className="p-3">{item.dosis}</td>
                  <td className="p-3">{item.frekuensi}</td>
                  <td className="p-3 font-semibold">{item.jumlah}</td>
                  <td className="p-3">{item.aturanPakai}</td>
                  <td className="p-3">{item.rute}</td>
                  <td className="p-3 text-center">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {item.komposisi && (
                      <button
                        onClick={() => toggleRacikan(item.no)}
                        className="p-1 hover:bg-slate-100 rounded text-taramedic transition-colors cursor-pointer"
                        title="Tampilkan detail komposisi"
                      >
                        {expandedRacikan[item.no] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </td>
                </tr>

                {/* Collapsible Nested Table untuk Komposisi Racikan */}
                {item.komposisi && expandedRacikan[item.no] && (
                  <tr>
                    <td colSpan={12} className="p-0 bg-taramedic-50/30">
                      <div className="p-3 pl-8 border-t border-b border-slate-200/60">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-taramedic-700 mb-2">
                          <FlaskConical className="w-3.5 h-3.5 text-taramedic" />
                          <span>Komposisi {item.namaObat}</span>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-slate-200/70 bg-white w-full">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                              <tr>
                                <th className="p-2.5 w-8 text-center">No.</th>
                                <th className="p-2.5">Nama Bahan</th>
                                <th className="p-2.5">KFA / Zat Aktif</th>
                                <th className="p-2.5">Kekuatan</th>
                                <th className="p-2.5">Jumlah per Bungkus</th>
                                <th className="p-2.5">Jumlah Total</th>
                                <th className="p-2.5 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {item.komposisi.map((comp) => (
                                <tr key={comp.no} className="hover:bg-slate-50/40">
                                  <td className="p-2.5 text-center text-slate-400 font-medium">
                                    {comp.no}
                                  </td>
                                  <td className="p-2.5 font-semibold text-slate-800">
                                    {comp.namaBahan}
                                  </td>
                                  <td className="p-2.5 text-slate-500">{comp.kfaZatAktif}</td>
                                  <td className="p-2.5">{comp.kekuatan}</td>
                                  <td className="p-2.5">{comp.jumlahPerBungkus}</td>
                                  <td className="p-2.5 font-medium">{comp.jumlahTotal}</td>
                                  <td className="p-2.5 text-center">
                                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border border-emerald-200/60">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      {comp.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}