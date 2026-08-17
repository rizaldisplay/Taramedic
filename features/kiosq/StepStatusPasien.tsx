import React from 'react';
import { User, Users } from 'lucide-react';
import { StatusPasien } from '@/types/kiosk';

interface Props {
  onSelect: (val: StatusPasien) => void;
  selected: StatusPasien;
}

export const StepStatusPasien: React.FC<Props> = ({ onSelect, selected }) => {
  return (
    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Pilih status pasien</h2>
      <p className="text-sm text-slate-500 mb-8">Apakah Anda sudah pernah berobat di klinik ini?</p>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onSelect('Baru')}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all h-[200px] ${
            selected === 'Baru' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          }`}
        >
          <User className={`w-12 h-12 mb-4 ${selected === 'Baru' ? 'text-blue-600' : 'text-blue-500'}`} strokeWidth={1.5} />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Pasien Baru</h3>
          <p className="text-xs text-slate-500">Belum pernah memiliki rekam medis di klinik ini</p>
        </button>

        <button 
          onClick={() => onSelect('Lama')}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all h-[200px] ${
            selected === 'Lama' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          }`}
        >
          <Users className={`w-12 h-12 mb-4 ${selected === 'Lama' ? 'text-blue-600' : 'text-blue-500'}`} strokeWidth={1.5} />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Pasien Lama</h3>
          <p className="text-xs text-slate-500">Sudah memiliki rekam medis</p>
        </button>
      </div>
    </div>
  );
};