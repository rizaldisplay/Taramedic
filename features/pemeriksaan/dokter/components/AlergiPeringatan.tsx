import React from 'react';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';

export default function AlergiPeringatan() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 w-full font-sans flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <ClipboardList className="w-5 h-5 text-cyan-600" />
        <h2 className="text-sm font-bold text-cyan-600 tracking-wide uppercase">
          Alergi & Peringatan
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex items-start justify-between mb-6">
        {/* Status Alergi */}
        <div className="flex items-center gap-2.5 mt-1">
          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
          <span className="text-base font-bold text-gray-900">
            Tidak ada alergi
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          <button className="px-5 py-1.5 text-xs font-semibold text-cyan-600 bg-white border border-cyan-600 rounded-md hover:bg-cyan-50 transition-colors w-[100px] text-center">
            Konfirmasi
          </button>
          <button className="px-5 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-[100px] text-center">
            Koreksi
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-auto">
        <Clock className="w-4 h-4 text-gray-400" />
        Sumber: Perawat • 08:25 WIB
      </div>
    </div>
  );
}