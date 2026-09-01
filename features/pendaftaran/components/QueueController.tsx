'use client';

import React, { useState } from 'react';
import { 
  Settings2, 
  Volume2, 
  RefreshCw, 
  Check, 
  ChevronsRight, 
  Info, 
  Ticket, 
  ChevronRight,
  LogOut
} from 'lucide-react';

// --- Types ---
interface QueueItem {
  id: string;
  number: string;
  status: string;
  timeTaken: string;
  waitTime: string;
  waitTimeColor: string;
}

// --- Mock Data ---
const waitingQueue: QueueItem[] = [
  { id: '1', number: 'A014', status: 'Menunggu', timeTaken: '08:42', waitTime: '3 mnt', waitTimeColor: 'text-green-500' },
  { id: '2', number: 'A015', status: 'Menunggu', timeTaken: '08:44', waitTime: '1 mnt', waitTimeColor: 'text-green-500' },
  { id: '3', number: 'A016', status: 'Menunggu', timeTaken: '08:46', waitTime: '< 1 mnt', waitTimeColor: 'text-green-500' },
  { id: '4', number: 'A017', status: 'Menunggu', timeTaken: '08:48', waitTime: '< 1 mnt', waitTimeColor: 'text-green-500' },
  { id: '5', number: 'A018', status: 'Menunggu', timeTaken: '08:50', waitTime: '< 1 mnt', waitTimeColor: 'text-green-500' },
];

export default function QueueController() {
  const [activeTab, setActiveTab] = useState<'menunggu' | 'terlewati'>('menunggu');

  return (
    // Menggunakan w-full dan h-full agar elastis mengikuti parent grid-nya
    <div className="w-full h-full flex flex-col p-5 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 tracking-wide">
          <Settings2 size={16} />
          KONTROLER PEMANGGIL ANTREAN
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Settings2 size={16} />
        </button>
      </div>

      {/* Active Queue Card */}
      <div className="bg-[#0b2756] rounded-xl p-4 text-white mb-3 shadow-md relative overflow-hidden flex-shrink-0">
        <p className="text-xs font-medium text-gray-200 mb-2">NOMOR SAAT INI</p>
        <div className="flex justify-between items-start">
          <h1 className="text-5xl font-bold tracking-tight">A013</h1>
          <span className="bg-[#ffdb58] text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Volume2 size={12} /> Dipanggil
          </span>
        </div>
        <div className="mt-4 text-[11px] text-gray-300 flex flex-col gap-0.5">
          <p>Dipanggil : 08:03:21</p>
          <p>Pemanggilan ke-1 dari 3</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mb-4 flex-shrink-0">
        <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors">
          <Volume2 size={18} /> PANGGIL BERIKUTNYA
        </button>
        <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors">
          <RefreshCw size={16} /> PANGGIL ULANG
        </button>
        
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 rounded-lg py-2 flex items-center justify-center gap-2 text-sm font-semibold transition-colors">
            <Check size={16} /> HADIR
          </button>
          <button className="bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-500 rounded-lg py-2 flex items-center justify-center gap-2 text-sm font-semibold transition-colors">
            <ChevronsRight size={16} /> LEWATI
          </button>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3 flex gap-2 items-start mb-6 flex-shrink-0">
        <Info size={16} className="text-cyan-600 mt-0.5 shrink-0" />
        <p className="text-xs text-cyan-800 leading-relaxed">
          Tandai status pasien untuk membuka proses pendaftaran.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-3 flex-shrink-0">
        <button 
          onClick={() => setActiveTab('menunggu')}
          className={`flex-1 pb-2 text-xs font-semibold text-center ${activeTab === 'menunggu' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}
        >
          MENUNGGU (16)
        </button>
        <button 
          onClick={() => setActiveTab('terlewati')}
          className={`flex-1 pb-2 text-xs font-semibold text-center ${activeTab === 'terlewati' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}
        >
          TERLEWATI (2)
        </button>
      </div>

      {/* Queue List */}
      {/* Memberikan flex-1 pada list ini agar bisa mengisi sisa ruang dan di-scroll internal jika kepanjangan */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1 mb-4 scrollbar-thin scrollbar-thumb-gray-200 custom-scrollbar">
        {waitingQueue.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <Ticket size={18} className="text-gray-400" />
              <div>
                <p className="text-sm font-bold text-gray-800">{item.number}</p>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-gray-400"></span> {item.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-500">Diambil {item.timeTaken}</p>
              <p className={`text-[11px] font-medium ${item.waitTimeColor}`}>{item.waitTime}</p>
            </div>
          </div>
        ))}
        
        <button className="w-full mt-2 text-xs text-cyan-600 font-semibold flex items-center justify-center gap-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <ChevronRight size={14} /> LIHAT SEMUA
        </button>
      </div>

      {/* Next Up Section */}
      <div className="mt-auto flex-shrink-0 pt-2 border-t border-slate-100">
        <p className="text-xs font-semibold text-cyan-800 mb-2">BERIKUTNYA (SETELAH A013)</p>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div>
            <p className="text-base font-bold text-gray-800">A014</p>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-cyan-500"></span> Menunggu
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-500">Diambil 08:42</p>
            <p className="text-[11px] font-medium text-green-500">3 mnt</p>
          </div>
        </div>
      </div>

    </div>
  );
}