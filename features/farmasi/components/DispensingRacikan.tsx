'use client';

import React, { useState } from 'react';
import { CheckCircle2, FlaskConical, Plus, Minus } from 'lucide-react';

// --- Types & Interfaces ---
export interface RacikanDispensingItem {
  no: number;
  namaRacikan: string;
  bentukRacikan: string;
  jumlahResep: number;
  jumlahDibuat: number;
  satuan: string;
  status: 'Siap (Racikan)' | 'Proses Peracikan' | 'Belum Dibuat';
}

interface DispensingRacikanProps {
  items?: RacikanDispensingItem[];
  onLihatKomposisi?: (no: number) => void;
  onJumlahDibuatChange?: (no: number, newValue: number) => void;
}

export default function DispensingRacikanComponent({
  items,
  onLihatKomposisi,
  onJumlahDibuatChange,
}: DispensingRacikanProps) {
  // Default data acuan dari screenshot
  const defaultItems: RacikanDispensingItem[] = [
    {
      no: 1,
      namaRacikan: 'Racikan 1 - Puyer',
      bentukRacikan: 'Puyer',
      jumlahResep: 10,
      jumlahDibuat: 10,
      satuan: 'Bungkus',
      status: 'Siap (Racikan)',
    },
  ];

  const [dataList, setDataList] = useState<RacikanDispensingItem[]>(items || defaultItems);

  // Handler increment/decrement jumlah dibuat
  const handleQuantityChange = (no: number, delta: number) => {
    setDataList((prev) =>
      prev.map((item) => {
        if (item.no === no) {
          const newQty = Math.max(0, item.jumlahDibuat + delta);
          if (onJumlahDibuatChange) onJumlahDibuatChange(no, newQty);
          return { ...item, jumlahDibuat: newQty };
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
          B
        </div>
        <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
          RACIKAN
        </h3>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
          {dataList.length} Item
        </span>
      </div>

      {/* Tabel Dispensing Racikan */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80">
            <tr>
              <th className="p-3 w-10 text-center">No.</th>
              <th className="p-3">Nama Racikan</th>
              <th className="p-3">Bentuk Racikan</th>
              <th className="p-3 text-center">Jumlah Resep</th>
              <th className="p-3 text-center">Jumlah Dibuat</th>
              <th className="p-3">Satuan</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {dataList.map((item) => (
              <tr key={item.no} className="hover:bg-slate-50/40 transition-colors">
                <td className="p-3 font-semibold text-slate-800 text-center">{item.no}</td>
                
                {/* Nama Racikan & Trigger Modal Komposisi */}
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{item.namaRacikan}</span>
                    <button
                      onClick={() => onLihatKomposisi && onLihatKomposisi(item.no)}
                      className="text-blue-600 hover:text-blue-700 text-[11px] font-semibold text-left mt-0.5 transition-colors cursor-pointer w-fit"
                    >
                      Lihat Komposisi
                    </button>
                  </div>
                </td>

                <td className="p-3 font-medium text-slate-700">{item.bentukRacikan}</td>
                <td className="p-3 text-center font-semibold text-slate-800">{item.jumlahResep}</td>
                
                {/* Counter Input Jumlah Dibuat */}
                <td className="p-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleQuantityChange(item.no, -1)}
                      className="w-6 h-6 rounded-md border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-bold text-slate-800 text-xs">
                      {item.jumlahDibuat}
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
                
                {/* Status Badge */}
                <td className="p-3 text-center">
                  <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border border-purple-200/60">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}