'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

// --- Types & Interfaces ---
export type FinalCheckStatus = 'Sesuai' | 'Tidak Sesuai';

export interface FinalCheckItem {
  id: string;
  no: number;
  title: string;
  subtitle: string;
  status: FinalCheckStatus;
}

interface FinalCheckProps {
  items?: FinalCheckItem[];
  onChangeStatus?: (id: string, newStatus: FinalCheckStatus) => void;
}

export default function FinalCheckComponent({
  items,
  onChangeStatus,
}: FinalCheckProps) {
  // Data acuan dari gambar (Prinsip 5 Benar)
  const defaultItems: FinalCheckItem[] = [
    {
      id: '1',
      no: 1,
      title: '1. Benar Pasien',
      subtitle: 'Rizka Amalia',
      status: 'Sesuai',
    },
    {
      id: '2',
      no: 2,
      title: '2. Benar Obat',
      subtitle: 'Sesuai resep',
      status: 'Sesuai',
    },
    {
      id: '3',
      no: 3,
      title: '3. Benar Dosis',
      subtitle: 'Sesuai aturan pakai',
      status: 'Sesuai',
    },
    {
      id: '4',
      no: 4,
      title: '4. Benar Cara & Waktu',
      subtitle: 'Sesuai instruksi',
      status: 'Sesuai',
    },
    {
      id: '5',
      no: 5,
      title: '5. Benar Jumlah',
      subtitle: 'Sesuai yang disiapkan',
      status: 'Sesuai',
    },
  ];

  const [checkList, setCheckList] = useState<FinalCheckItem[]>(items || defaultItems);

  // Toggle status saat item diklik (Sesuai <-> Tidak Sesuai)
  const handleItemClick = (id: string, currentStatus: FinalCheckStatus) => {
    const newStatus: FinalCheckStatus = currentStatus === 'Sesuai' ? 'Tidak Sesuai' : 'Sesuai';

    setCheckList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    if (onChangeStatus) {
      onChangeStatus(id, newStatus);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4 font-sans">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            A
          </div>
          <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
            FINAL CHECK (5 BENAR)
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pastikan seluruh obat yang diserahkan sesuai sebelum dilakukan penyerahan kepada pasien.</span>
        </div>
      </div>

      {/* Grid 5 Poin 'Benar' */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {checkList.map((item) => {
          const isSesuai = item.status === 'Sesuai';

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id, item.status)}
              className={`border rounded-xl p-3 flex items-start gap-2.5 transition-all cursor-pointer select-none ${
                isSesuai
                  ? 'bg-emerald-50/50 border-emerald-200/70 hover:bg-emerald-50'
                  : 'bg-rose-50/50 border-rose-200/70 hover:bg-rose-50'
              }`}
              title="Klik untuk mengubah verifikasi"
            >
              {isSesuai ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}

              <div className="flex flex-col min-w-0">
                <span className={`text-xs font-bold leading-tight ${
                  isSesuai ? 'text-emerald-800' : 'text-rose-800'
                }`}>
                  {item.title}
                </span>
                <span className="text-[11px] font-medium text-slate-500 truncate mt-0.5" title={item.subtitle}>
                  {item.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}