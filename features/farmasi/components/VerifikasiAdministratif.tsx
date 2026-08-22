'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

// --- Types ---
export type VerificationStatus = 'Sesuai' | 'Tidak Sesuai' | 'Pending';

export interface AdminCheckItem {
  id: string;
  label: string;
  status: VerificationStatus;
}

interface VerifikasiAdministratifProps {
  items?: AdminCheckItem[];
  onChangeStatus?: (id: string, newStatus: VerificationStatus) => void;
}

export default function VerifikasiAdministratif({
  items,
  onChangeStatus
}: VerifikasiAdministratifProps) {
  // Default checklist items sesuai desain acuan
  const defaultItems: AdminCheckItem[] = [
    { id: '1', label: 'Identitas Pasien', status: 'Sesuai' },
    { id: '2', label: 'No. RM', status: 'Sesuai' },
    { id: '3', label: 'Encounter', status: 'Sesuai' },
    { id: '4', label: 'Dokter Penulis', status: 'Sesuai' },
    { id: '5', label: 'Poli', status: 'Sesuai' },
    { id: '6', label: 'Penjamin', status: 'Sesuai' },
    { id: '7', label: 'Nomor Resep', status: 'Sesuai' },
  ];

  const [checkList, setCheckList] = useState<AdminCheckItem[]>(items || defaultItems);

  // Helper styling berdasarkan status verifikasi
  const getStatusStyles = (status: VerificationStatus) => {
    switch (status) {
      case 'Sesuai':
        return {
          container: 'bg-emerald-50/60 border-emerald-200/70 hover:bg-emerald-50',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
          text: 'text-emerald-700'
        };
      case 'Tidak Sesuai':
        return {
          container: 'bg-rose-50/60 border-rose-200/70 hover:bg-rose-50',
          icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
          text: 'text-rose-700'
        };
      case 'Pending':
      default:
        return {
          container: 'bg-amber-50/60 border-amber-200/70 hover:bg-amber-50',
          icon: <Clock className="w-4 h-4 text-amber-600 shrink-0" />,
          text: 'text-amber-700'
        };
    }
  };

  // Handler toggle sederhana untuk demonstrasi jika item diklik
  const handleItemClick = (id: string, currentStatus: VerificationStatus) => {
    const nextStatusMap: Record<VerificationStatus, VerificationStatus> = {
      'Sesuai': 'Tidak Sesuai',
      'Tidak Sesuai': 'Pending',
      'Pending': 'Sesuai'
    };
    const newStatus = nextStatusMap[currentStatus];

    setCheckList(prev =>
      prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
    );

    if (onChangeStatus) {
      onChangeStatus(id, newStatus);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4 font-sans">
      
      {/* Header Section A */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            A
          </div>
          <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
            VERIFIKASI ADMINISTRATIF
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>7 dari 7 Kelengkapan Terverifikasi</span>
        </div>
      </div>

      {/* Grid Checklist Items */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {checkList.map((item) => {
          const style = getStatusStyles(item.status);
          
          return (
            <div 
              key={item.id}
              onClick={() => handleItemClick(item.id, item.status)}
              className={`border rounded-xl p-2.5 flex items-center gap-2 transition-all cursor-pointer select-none ${style.container}`}
              title="Klik untuk mengubah status"
            >
              {style.icon}
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-500 truncate font-medium">
                  {item.label}
                </span>
                <span className={`text-xs font-bold ${style.text}`}>
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}