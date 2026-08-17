import React from 'react';
import { Wallet, ShieldPlus } from 'lucide-react';
import { Penjamin } from '@/types/kiosk';

interface Props {
  onSelect: (val: Penjamin) => void;
  selected: Penjamin;
}

export const StepPenjamin: React.FC<Props> = ({ onSelect, selected }) => {
  return (
    <div className="text-center animate-in fade-in slide-in-from-right-8 duration-300">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Pilih penjamin</h2>
      <p className="text-sm text-slate-500 mb-8">Bagaimana biaya kunjungan Anda akan ditanggung?</p>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onSelect('BPJS')}
          className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all h-[240px] ${
            selected === 'BPJS' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          }`}
        >
          <ShieldPlus className="w-12 h-12 mb-4 text-emerald-600" strokeWidth={1.5} />
          <h3 className="text-lg font-bold text-slate-900 mb-1">BPJS</h3>
          <p className="text-xs text-slate-500 mb-4">BPJS Kesehatan</p>
          <div className="mt-auto bg-slate-100 rounded-lg p-2.5 w-full text-[10px] text-slate-600 text-center">
            Pastikan kepesertaan<br/>BPJS Anda aktif.
          </div>
        </button>

        <button 
          onClick={() => onSelect('Umum')}
          className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all h-[240px] ${
            selected === 'Umum' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          }`}
        >
          <Wallet className="w-12 h-12 mb-4 text-blue-500" strokeWidth={1.5} />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Umum</h3>
          <p className="text-xs text-slate-500">Pembayaran pribadi</p>
        </button>
      </div>
    </div>
  );
};