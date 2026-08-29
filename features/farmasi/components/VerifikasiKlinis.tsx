'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

// --- Types & Interfaces ---
export type KlinisStatus = 'Sesuai' | 'Warning' | 'Issue';

export interface KlinisCheckItem {
  id: string;
  title: string;
  subtitle: string;
  status: KlinisStatus;
}

interface VerifikasiKlinisProps {
  items?: KlinisCheckItem[];
  onChangeStatus?: (id: string, newStatus: KlinisStatus) => void;
}

export default function VerifikasiKlinis({
  items,
  onChangeStatus,
}: VerifikasiKlinisProps) {
  // Data default acuan dari screenshot
  const defaultItems: KlinisCheckItem[] = [
    { id: '1', title: 'Alergi Obat', subtitle: 'Tidak ada alergi', status: 'Sesuai' },
    { id: '2', title: 'Interaksi Obat', subtitle: 'Tidak ada interaksi signifikan', status: 'Sesuai' },
    { id: '3', title: 'Duplikasi Terapi', subtitle: 'Tidak ditemukan', status: 'Sesuai' },
    { id: '4', title: 'Kontraindikasi', subtitle: 'Tidak ditemukan', status: 'Sesuai' },
    { id: '5', title: 'Kesesuaian Dosis', subtitle: 'Sesuai usia & BB', status: 'Sesuai' },
    { id: '6', title: 'Rute Pemberian', subtitle: 'Sesuai', status: 'Sesuai' },
    { id: '7', title: 'Kondisi Khusus', subtitle: 'Tidak ada', status: 'Sesuai' },
    { id: '8', title: 'Catatan Dokter', subtitle: 'Lengkap', status: 'Sesuai' },
  ];

  const [checkList, setCheckList] = useState<KlinisCheckItem[]>(items || defaultItems);

  // Helper styling berdasarkan status keamanan obat
  const getStatusStyles = (status: KlinisStatus) => {
    switch (status) {
      case 'Sesuai':
        return {
          container: 'bg-emerald-50/40 border-emerald-200/60 hover:bg-emerald-50',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
          titleText: 'text-slate-800',
          subText: 'text-slate-500',
        };
      case 'Warning':
        return {
          container: 'bg-amber-50/40 border-amber-200/60 hover:bg-amber-50',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
          titleText: 'text-slate-800',
          subText: 'text-amber-700',
        };
      case 'Issue':
      default:
        return {
          container: 'bg-rose-50/40 border-rose-200/60 hover:bg-rose-50',
          icon: <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
          titleText: 'text-slate-800',
          subText: 'text-rose-700 font-semibold',
        };
    }
  };

  // Handler toggle status untuk kebebasan pengujian/interaksi
  const handleItemClick = (id: string, currentStatus: KlinisStatus) => {
    const nextStatusMap: Record<KlinisStatus, KlinisStatus> = {
      Sesuai: 'Warning',
      Warning: 'Issue',
      Issue: 'Sesuai',
    };
    const newStatus = nextStatusMap[currentStatus];

    setCheckList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    if (onChangeStatus) {
      onChangeStatus(id, newStatus);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4 font-sans">
      
      {/* Header Section C */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            C
          </div>
          <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
            VERIFIKASI KLINIS & KEAMANAN OBAT
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-600" />
          <span>8 Poin Keamanan Terverifikasi</span>
        </div>
      </div>

      {/* Grid Checklist Klinis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {checkList.map((item) => {
          const style = getStatusStyles(item.status);

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id, item.status)}
              className={`border rounded-xl p-3 flex items-start gap-2.5 transition-colors cursor-pointer select-none ${style.container}`}
              title="Klik untuk mengubah status (Sesuai / Warning / Issue)"
            >
              {style.icon}
              <div className="flex flex-col min-w-0">
                <span className={`text-xs font-bold ${style.titleText}`}>{item.title}</span>
                <span className={`text-[11px] font-medium truncate mt-0.5 ${style.subText}`}>
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