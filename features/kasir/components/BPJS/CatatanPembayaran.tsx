"use client";

import React, { useState } from "react";

interface CatatanPembayaranProps {
  maxLength?: number;
  onNoteChange?: (note: string) => void;
}

export default function CatatanPembayaran({
  maxLength = 500,
  onNoteChange,
}: CatatanPembayaranProps) {
  const [note, setNote] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setNote(value);
      if (onNoteChange) onNoteChange(value);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden font-sans">
      
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase">
          CATATAN PEMBAYARAN
        </h3>
      </div>

      {/* Card Body / Textarea Form */}
      <div className="p-5 flex flex-col gap-2">
        <label className="text-[12px] text-slate-500 font-medium">
          Catatan (opsional)
        </label>
        
        <div className="relative">
          <textarea
            rows={4}
            value={note}
            onChange={handleChange}
            placeholder="Tulis catatan pembayaran..."
            className="w-full p-3 text-[13px] text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none transition-all"
          />
          
          {/* Character Count Indicator */}
          <span className="absolute bottom-3 right-3 text-[11px] text-slate-400 font-medium select-none">
            {note.length} / {maxLength}
          </span>
        </div>
      </div>

    </div>
  );
}