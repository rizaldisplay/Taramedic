'use client';

import React, { useState } from 'react';
import { ShieldAlert, Check } from 'lucide-react';

export type AllergyStatus = 'Tidak ada alergi' | 'Ada alergi';

interface AllergyHistoryFormProps {
  value?: AllergyStatus;
  onChange?: (status: AllergyStatus) => void;
}

export default function RiwayatAlergi({
  value,
  onChange,
}: AllergyHistoryFormProps) {
  // Local state jika tidak dikontrol dari parent component
  const [internalStatus, setInternalStatus] = useState<AllergyStatus>('Tidak ada alergi');

  const currentStatus = value !== undefined ? value : internalStatus;

  const handleSelect = (status: AllergyStatus) => {
    if (onChange) {
      onChange(status);
    } else {
      setInternalStatus(status);
    }
  };

  return (
    <div className="w-full max-w-5xl p-6 bg-white rounded-xl border border-gray-200 shadow-sm font-sans">
      {/* Header Bagian E */}
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-600 text-white font-bold text-xs">
          E
        </span>
        <h2 className="text-sm font-bold tracking-wider text-gray-800 uppercase flex items-center gap-2">
          Riwayat Alergi
        </h2>
      </div>

      {/* Container Pilihan Status Alergi */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-500" />
          Status Alergi
        </label>

        {/* Option Pills (Persis seperti UI Gambar) */}
        <div className="flex flex-wrap gap-2.5">
          {(['Tidak ada alergi', 'Ada alergi'] as AllergyStatus[]).map((option) => {
            const isSelected = currentStatus === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  isSelected
                    ? 'bg-cyan-50 border-cyan-600 text-cyan-700 font-semibold shadow-xs'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-cyan-600 stroke-[2.5]" />
                )}
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}