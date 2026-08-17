'use client';

import React from 'react';
import { Volume2, Check, X, Lock, User, CheckCircle } from 'lucide-react';

const LastCallItem = ({ no, name, time, status }: { no: string, name: string, time: string, status: string }) => (
  <div className="flex items-center justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
    <div className="flex items-center gap-3">
      <span className="font-semibold text-slate-700 w-8">{no}</span>
      <span className="text-slate-600 truncate w-24">{name}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400">{time}</span>
      <span className="text-xs text-emerald-600 font-medium flex items-center">
        <CheckCircle className="w-3 h-3 mr-1" /> {status}
      </span>
    </div>
  </div>
);

export const ActionPanel = () => {
  return (
    <div className="w-[340px] flex-shrink-0 space-y-4">
      {/* Active Call Card */}
      <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden relative">
        <div className="h-1 bg-blue-500 w-full absolute top-0 left-0"></div>
        <div className="p-5 pt-6">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">SEDANG DIPANGGIL</div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-4xl font-bold text-blue-600 mb-2">A013</h3>
              <h4 className="text-lg font-bold text-slate-900">Rizka Amalia <span className="text-pink-500 font-normal">♀</span></h4>
              <p className="text-xs text-slate-500 mt-1">RM-000036 • Perempuan, 8 thn</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
               <User className="w-6 h-6 text-slate-400" />
            </div>
          </div>
          
          <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100 mb-5 text-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center text-blue-700 font-medium">
                <Volume2 className="w-4 h-4 mr-2" /> Panggilan ke-1
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center py-2.5 border border-emerald-500 text-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-50">
                <Check className="w-4 h-4 mr-2" /> Hadir
              </button>
              <button className="flex-1 flex items-center justify-center py-2.5 border border-red-200 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50">
                <X className="w-4 h-4 mr-2" /> Lewati
              </button>
            </div>
            <button className="w-full flex items-center justify-center py-3 bg-slate-100 text-slate-400 rounded-lg text-sm font-semibold cursor-not-allowed mt-2">
              <Lock className="w-4 h-4 mr-2" /> Mulai Pemeriksaan
            </button>
          </div>
        </div>
      </div>

      {/* Next Patient Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">BERIKUTNYA</div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-amber-500">A014</span>
            <div>
              <div className="font-bold text-slate-800 text-sm">Fathan Alfarizi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Called List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">PANGGILAN TERAKHIR</div>
        </div>
        <div className="space-y-3">
          <LastCallItem no="A009" name="Siti Nurhaliza" time="08:30 WIB" status="Selesai" />
          <LastCallItem no="A010" name="Andi Saputra" time="08:38 WIB" status="Selesai" />
        </div>
      </div>
    </div>
  );
};