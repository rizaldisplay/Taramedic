'use client';

import React, { useState } from 'react';
import { Brain, Check } from 'lucide-react';

export type ConsciousnessLevel =
  | 'Compos Mentis'
  | 'Apatis'
  | 'Delirium'
  | 'Somnolen'
  | 'Sopor'
  | 'Koma';

interface ConsciousnessFormProps {
  value?: ConsciousnessLevel;
  onChange?: (level: ConsciousnessLevel) => void;
}

const CONSCIOUSNESS_OPTIONS: ConsciousnessLevel[] = [
  'Compos Mentis',
  'Apatis',
  'Delirium',
  'Somnolen',
  'Sopor',
  'Koma',
];

export default function Kesadaran({
  value,
  onChange,
}: ConsciousnessFormProps) {
  // Local state jika digunakan sebagai Uncontrolled Component
  const [internalLevel, setInternalLevel] = useState<ConsciousnessLevel>('Compos Mentis');

  const currentLevel = value !== undefined ? value : internalLevel;

  const handleSelect = (level: ConsciousnessLevel) => {
    if (onChange) {
      onChange(level);
    } else {
      setInternalLevel(level);
    }
  };

  return (
    <div className="w-full max-w-5xl p-6 bg-white rounded-xl border border-gray-200 shadow-sm font-sans">
      {/* Header Bagian C */}
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-600 text-white font-bold text-xs">
          C
        </span>
        <h2 className="text-sm font-bold tracking-wider text-gray-800 uppercase flex items-center gap-2">
          Kesadaran
        </h2>
      </div>

      {/* Container Opsi Kesadaran */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-cyan-500" />
          Tingkat Kesadaran Pasien
        </label>

        {/* Option Pills (Persis seperti UI Gambar) */}
        <div className="flex flex-wrap gap-2.5">
          {CONSCIOUSNESS_OPTIONS.map((option) => {
            const isSelected = currentLevel === option;

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