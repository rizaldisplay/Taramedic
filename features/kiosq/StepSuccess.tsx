import React from 'react';
import { CheckCircle2, Monitor, Printer, Clock } from 'lucide-react';
import { StatusPasien, Penjamin } from '@/types/kiosk';

interface Props {
  status: StatusPasien;
  penjamin: Penjamin;
  countdown: number;
  onDone: () => void;
}

export const StepSuccess: React.FC<Props> = ({ status, penjamin, countdown, onDone }) => {
  const queueCode = penjamin === 'BPJS' ? 'A081' : 'B042';

  return (
    <div className="text-center flex flex-col h-full animate-in zoom-in-95 duration-500">
      <div className="flex-1 flex flex-col items-center justify-center -mt-6">
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        
        <h2 className="text-lg font-semibold text-emerald-600 mb-1">Pendaftaran berhasil</h2>
        <p className="text-sm text-slate-500 mb-2">Nomor antrean Anda</p>
        
        <div className="text-7xl font-black text-blue-600 tracking-tight mb-4 leading-none">
          {queueCode}
        </div>
        
        <div className="text-xs font-bold text-slate-500 tracking-widest uppercase flex items-center gap-2 mb-8">
          <span>{penjamin}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>PASIEN {status}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 px-4 py-3 rounded-xl">
          <Monitor className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-left">Silakan menunggu nomor Anda dipanggil di layar antrean utama.</p>
        </div>
      </div>

      <div className="mt-auto pt-6 space-y-4">
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
            <Printer className="w-5 h-5" /> Cetak tiket
          </button>
          <button 
            onClick={onDone}
            className="flex-1 py-3.5 bg-[#0A1128] rounded-xl font-bold text-white hover:bg-[#152243] transition-colors shadow-lg shadow-slate-900/10"
          >
            Selesai
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Layar akan kembali ke halaman awal dalam <strong className="text-blue-600">{countdown} detik</strong>. Terima kasih.</span>
        </div>
      </div>
    </div>
  );
};