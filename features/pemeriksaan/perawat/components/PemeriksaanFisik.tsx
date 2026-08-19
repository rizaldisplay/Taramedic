'use client';

import React, { useState, ChangeEvent } from 'react';
import { Stethoscope } from 'lucide-react';

interface BriefPhysicalExamFormProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

const DEFAULT_PHYSICAL_EXAM_TEXT =
  'Keadaan umum baik. Konjungtiva anemis (-), sklera ikterik (-).\n' +
  'Leher tidak ada pembesaran kelenjar.\n' +
  'Thoraks simetris, suara napas vesikuler.\n' +
  'Abdomen supel, tidak nyeri tekan, tidak ada massa.\n' +
  'Ekstremitas teraba hangat, CRT < 2 detik.';

export default function PemeriksaanFisik({
  value,
  onChange,
  maxLength = 1000,
}: BriefPhysicalExamFormProps) {
  const [internalText, setInternalText] = useState<string>(DEFAULT_PHYSICAL_EXAM_TEXT);

  const currentText = value !== undefined ? value : internalText;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      if (onChange) {
        onChange(newText);
      } else {
        setInternalText(newText);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl p-6 bg-white rounded-xl border border-gray-200 shadow-sm font-sans">
      {/* Header Bagian F */}
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs">
          F
        </span>
        <h2 className="text-sm font-bold tracking-wider text-gray-800 uppercase flex items-center gap-2">
          Pemeriksaan Fisik Singkat
        </h2>
      </div>

      {/* Input Textarea Container */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
          <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
          Hasil Pemeriksaan Fisik
        </label>

        <div className="relative">
          <textarea
            rows={5}
            value={currentText}
            onChange={handleChange}
            placeholder="Tuliskan hasil pemeriksaan fisik singkat pasien..."
            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs leading-relaxed text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y transition-all"
          />

          {/* Counter Karakter (158 / 1000) di pojok kanan bawah */}
          <div className="absolute bottom-3 right-3 text-[11px] font-medium text-gray-400 bg-white/80 px-1.5 py-0.5 rounded backdrop-blur-xs">
            {currentText.length} / {maxLength}
          </div>
        </div>
      </div>
    </div>
  );
}