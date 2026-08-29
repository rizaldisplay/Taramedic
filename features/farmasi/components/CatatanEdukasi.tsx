'use client';

import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Plus } from 'lucide-react';

// --- Types & Interfaces ---
export interface ChecklistEdukasiItem {
  id: string;
  label: string;
  checked: boolean;
}

interface CatatanEdukasiProps {
  initialText?: string;
  onChangeEdukasi?: (items: ChecklistEdukasiItem[], catatan: string) => void;
}

export default function CatatanEdukasiComponent({
  initialText = "Ibu sudah memahami aturan pakai obat dan efek samping.",
  onChangeEdukasi,
}: CatatanEdukasiProps) {
  // --- Checklist Edukasi State (8 Poin Utama) ---
  const [checkList, setCheckList] = useState<ChecklistEdukasiItem[]>([
    { id: '1', label: 'Nama & fungsi obat', checked: true },
    { id: '2', label: 'Dosis', checked: true },
    { id: '3', label: 'Cara penggunaan', checked: true },
    { id: '4', label: 'Waktu penggunaan', checked: true },
    { id: '5', label: 'Lama penggunaan', checked: true },
    { id: '6', label: 'Efek samping / perhatian', checked: true },
    { id: '7', label: 'Penyimpanan', checked: true },
    { id: '8', label: 'Instruksi khusus', checked: true },
  ]);

  // --- Catatan Edukasi Opsional State ---
  const [catatan, setCatatan] = useState<string>(initialText);

  // Handlers
  const toggleCheck = (id: string) => {
    const updated = checkList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setCheckList(updated);
    if (onChangeEdukasi) onChangeEdukasi(updated, catatan);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCatatan(val);
    if (onChangeEdukasi) onChangeEdukasi(checkList, val);
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col gap-4 font-sans">
      
      {/* Header Section Sidebar */}
      <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase border-b border-slate-100 pb-3">
        <BookOpen className="w-4 h-4 text-cyan-600 shrink-0" />
        <span>CATATAN EDUKASI</span>
      </div>

      <div className="flex flex-col gap-3.5 text-xs">
        
        {/* Grid 8 Checklist Edukasi Pasien (2 Kolom Presisi) */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-2">
          {checkList.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-1.5 cursor-pointer select-none group"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheck(item.id)}
                className="hidden" // Sembunyikan checkbox bawaan untuk diganti ikon medis
              />
              <CheckCircle2
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  item.checked ? 'text-emerald-600' : 'text-slate-300 group-hover:text-slate-400'
                }`}
              />
              <span
                className={`text-[11px] font-medium transition-colors truncate ${
                  item.checked ? 'text-slate-800' : 'text-slate-400'
                }`}
                title={item.label}
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>

        {/* Textarea Catatan Edukasi Opsional */}
        <div className="flex flex-col gap-1 pt-1">
          <label className="text-[11px] font-medium text-slate-500">
            Catatan edukasi (opsional)
          </label>
          
          <div className="relative">
            <textarea
              value={catatan}
              onChange={handleTextChange}
              placeholder="Tulis catatan edukasi tambahan..."
              rows={3}
              maxLength={500}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none resize-none placeholder:text-slate-400 bg-white leading-relaxed text-slate-800 font-medium"
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 font-mono font-medium">
              {catatan.length} / 500
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}