'use client';

import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Minus, Eye, MapPin, Tag, Calendar } from 'lucide-react';

// --- Types & Interfaces ---
export interface NonRacikanItem {
  no: number;
  namaObat: string;
  kfa: string;
  resep: string;
  sediaanKekuatan: string;
  jumlahResep: number;
  disiapkan: number;
  satuan: string;
  stokTersedia: number;
  status: 'Siap' | 'Belum Siap' | 'Proses';
  detail: {
    produk: string;
    pabrikProdusen: string;
    noRegistrasi: string;
    kategori: string;
    noBatch: string;
    expDate: string;
    sisaStok: string;
    lokasiGudang: string;
    lokasiRak: string;
  };
}

interface DispensingNonRacikanProps {
  items?: NonRacikanItem[];
  onDisiapkanChange?: (no: number, newValue: number) => void;
}

export default function DispensingNonRacikanComponent({
  items,
  onDisiapkanChange,
}: DispensingNonRacikanProps) {
  // Default data acuan dari gambar
  const defaultItems: NonRacikanItem[] = [
    {
      no: 1,
      namaObat: 'Paracetamol',
      kfa: 'KFA: 9300089500012',
      resep: 'Tablet 500 mg',
      sediaanKekuatan: 'Tablet 500 mg',
      jumlahResep: 10,
      disiapkan: 10,
      satuan: 'Tablet',
      stokTersedia: 120,
      status: 'Siap',
      detail: {
        produk: 'Paracetamol 500 mg (Generik)',
        pabrikProdusen: 'PT. Kimia Farma Tbk',
        noRegistrasi: 'GKL1234567890A1',
        kategori: 'Obat Generik',
        noBatch: 'PCT240501',
        expDate: '01/05/2027',
        sisaStok: '120 Tablet',
        lokasiGudang: 'Gudang Farmasi',
        lokasiRak: 'Rak A - Laci 2 - Baris 1',
      },
    },
    {
      no: 2,
      namaObat: 'Cetirizine',
      kfa: 'KFA: 9300023400017',
      resep: 'Tablet 10 mg',
      sediaanKekuatan: 'Tablet 10 mg',
      jumlahResep: 5,
      disiapkan: 5,
      satuan: 'Tablet',
      stokTersedia: 30,
      status: 'Siap',
      detail: {
        produk: 'Cetirizine 10 mg (Generik)',
        pabrikProdusen: 'PT. Indofarma Tbk',
        noRegistrasi: 'GKL0987654321B2',
        kategori: 'Obat Generik',
        noBatch: 'CTZ240102',
        expDate: '15/08/2027',
        sisaStok: '30 Tablet',
        lokasiGudang: 'Gudang Farmasi',
        lokasiRak: 'Rak B - Laci 1 - Baris 3',
      },
    },
  ];

  const [dataList, setDataList] = useState<NonRacikanItem[]>(items || defaultItems);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({
    1: true, // Default row 1 ter-expand
  });

  // Toggle detail accordion
  const toggleRow = (no: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [no]: !prev[no],
    }));
  };

  // Handler increment/decrement jumlah disiapkan
  const handleQuantityChange = (no: number, delta: number) => {
    setDataList((prev) =>
      prev.map((item) => {
        if (item.no === no) {
          const newQty = Math.max(0, item.disiapkan + delta);
          if (onDisiapkanChange) onDisiapkanChange(no, newQty);
          return { ...item, disiapkan: newQty };
        }
        return item;
      })
    );
  };

  return (
    <div className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4 font-sans">
      
      {/* Section Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          A
        </div>
        <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
          NON-RACIKAN
        </h3>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
          {dataList.length} Item
        </span>
      </div>

      {/* Tabel Dispensing Non-Racikan */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80">
            <tr>
              <th className="p-3 w-10 text-center">No.</th>
              <th className="p-3">Nama Obat</th>
              <th className="p-3">Resep</th>
              <th className="p-3 text-center">Jumlah Resep</th>
              <th className="p-3 text-center">Disiapkan</th>
              <th className="p-3">Satuan</th>
              <th className="p-3 text-center">Stok Tersedia</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {dataList.map((item) => {
              const isExpanded = expandedRows[item.no];

              return (
                <React.Fragment key={item.no}>
                  {/* Row Utama Item */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-800 text-center">{item.no}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{item.namaObat}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">{item.kfa}</span>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{item.resep}</td>
                    <td className="p-3 text-center font-semibold text-slate-800">{item.jumlahResep}</td>
                    
                    {/* Input Counter Disiapkan */}
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleQuantityChange(item.no, -1)}
                          className="w-6 h-6 rounded-md border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-800 text-xs">
                          {item.disiapkan}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.no, 1)}
                          className="w-6 h-6 rounded-md border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="p-3 text-slate-600">{item.satuan}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{item.stokTersedia}</td>
                    
                    {/* Status Badge */}
                    <td className="p-3 text-center">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {item.status}
                      </span>
                    </td>

                    {/* Expand Toggle */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleRow(item.no)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Row Detail Ekspedisi & Informasi Obat */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={9} className="p-0 bg-blue-50/20">
                        <div className="p-4 pl-10 border-t border-b border-slate-100 flex flex-col gap-3">
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            
                            {/* Panel 1: Informasi Produk */}
                            <div className="flex flex-col gap-1.5 border-r border-slate-200/60 pr-4">
                              <span className="text-xs font-bold text-blue-600 tracking-tight">
                                Informasi Produk
                              </span>
                              <div className="grid grid-cols-3 gap-1 text-[11px] mt-1">
                                <span className="text-slate-400">Produk</span>
                                <span className="col-span-2 font-medium text-slate-800">: {item.detail.produk}</span>
                                
                                <span className="text-slate-400">Pabrik / Produsen</span>
                                <span className="col-span-2 font-medium text-slate-800">: {item.detail.pabrikProdusen}</span>
                                
                                <span className="text-slate-400">No. Registrasi</span>
                                <span className="col-span-2 font-medium text-slate-800">: {item.detail.noRegistrasi}</span>
                                
                                <span className="text-slate-400">Kategori</span>
                                <span className="col-span-2 font-medium text-slate-800">: {item.detail.kategori}</span>
                              </div>
                            </div>

                            {/* Panel 2: Batch / ED */}
                            <div className="flex flex-col gap-1.5 border-r border-slate-200/60 pr-4">
                              <span className="text-xs font-bold text-blue-600 tracking-tight">
                                Batch / ED
                              </span>
                              <div className="grid grid-cols-3 gap-1 text-[11px] mt-1">
                                <span className="text-slate-400">No. Batch</span>
                                <span className="col-span-2 font-semibold text-slate-800">: {item.detail.noBatch}</span>
                                
                                <span className="text-slate-400">Exp. Date (ED)</span>
                                <span className="col-span-2 font-semibold text-slate-800">: {item.detail.expDate}</span>
                                
                                <span className="text-slate-400">Sisa Stok</span>
                                <span className="col-span-2 font-bold text-emerald-600">: {item.detail.sisaStok}</span>
                              </div>
                            </div>

                            {/* Panel 3: Lokasi Penyimpanan */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-xs font-bold text-blue-600 tracking-tight">
                                Lokasi Penyimpanan
                              </span>
                              <div className="flex flex-col gap-1 text-[11px] mt-1">
                                <span className="font-semibold text-slate-800">{item.detail.lokasiGudang}</span>
                                <span className="font-bold text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded border border-blue-200/60 w-fit mt-1">
                                  {item.detail.lokasiRak}
                                </span>
                              </div>
                            </div>

                          </div>

                          <div className="flex justify-end pt-1">
                            <button className="text-blue-600 hover:text-blue-700 text-[11px] font-semibold flex items-center gap-1 transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                              Lihat Detail &gt;
                            </button>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}