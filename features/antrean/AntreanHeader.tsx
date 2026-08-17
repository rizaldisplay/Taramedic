'use client';

import React from 'react';
import { ChevronDown, History, List } from 'lucide-react';

export const AntreanHeader = () => {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Antrean Poli</h2>
        <div className="flex items-center text-sm text-slate-600">
          <span className="font-semibold text-slate-800 mr-2">Poli Anak</span>
          <span className="mr-2">•</span>
          <span>dr. Bima, Sp.A</span>
          <ChevronDown className="w-4 h-4 ml-1 text-slate-400" />
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
          <History className="w-4 h-4 mr-2" />
          Riwayat Antrean
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
          <List className="w-4 h-4 mr-2" />
          Audit Trail
        </button>
      </div>
    </div>
  );
};