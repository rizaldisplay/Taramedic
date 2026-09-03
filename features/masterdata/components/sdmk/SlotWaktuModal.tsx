'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  ChevronDown, 
  Clock,
  Check
} from 'lucide-react';

interface AddSlotWaktuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSlotWaktuModal({ isOpen, onClose }: AddSlotWaktuModalProps) {
  const [adaIstirahat, setAdaIstirahat] = useState(true);

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-white shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#0b2756] tracking-wide">Tambah Slot Waktu</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Buat waktu praktik untuk hari tertentu. Slot akan dibuat otomatis sesuai durasi layanan.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-white">
          
          {/* SECTION 1: INFORMASI HARI & WAKTU */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Informasi Hari & Waktu</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormSelect label="Hari" required defaultValue="Senin" />
              <FormInputTime label="Jam Mulai" required defaultValue="08:00" />
              <FormInputTime label="Jam Selesai" required defaultValue="12:00" />
            </div>

            {/* Checkbox Istirahat */}
            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer w-fit">
                <input 
                  type="checkbox" 
                  checked={adaIstirahat}
                  onChange={() => setAdaIstirahat(!adaIstirahat)}
                  className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500" 
                />
                Istirahat (Opsional)
              </label>
            </div>

            {adaIstirahat && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <FormInputTime label="Jam Istirahat Mulai" defaultValue="11:45" />
                <FormInputTime label="Jam Istirahat Selesai" defaultValue="12:00" />
                <span className="col-span-full text-[11px] text-slate-400 italic">
                  Istirahat tidak termasuk dalam perhitungan durasi layanan
                </span>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 2: PENGATURAN LAYANAN */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Pengaturan Layanan</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FormSelect label="Durasi Layanan per Pasien" required defaultValue="15 menit" />
                <span className="text-[10px] text-slate-400 mt-1 block">Minimal 10 menit sesuai ketentuan Permenkes</span>
              </div>

              <div>
                <FormInputNumber label="Kapasitas / Kuota" required defaultValue="30" unit="pasien" />
                <span className="text-[10px] text-slate-400 mt-1 block">Jumlah maksimal pasien per hari</span>
              </div>

              <div>
                <FormInputNumber label="Kuota Online" required defaultValue="20" unit="pasien" />
                <span className="text-[10px] text-slate-400 mt-1 block">Kuota antrean/booking online. Maksimal sama dengan kuota total</span>
              </div>
            </div>

            {/* Jenis Pasien Dilayani */}
            <div className="pt-1">
              <Label text="Jenis Pasien Dilayani" required />
              <div className="flex flex-wrap gap-6 mt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500" /> Umum
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500" /> BPJS
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500" /> Asuransi
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500" /> Perusahaan
                </label>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 3: POLA BERLAKU */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Pola Berlaku</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label text="Berlaku Mulai" required />
                <div className="relative w-full mt-1.5">
                  <input 
                    type="text" 
                    defaultValue="27-05-2026" 
                    className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-cyan-500 text-slate-800"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <Calendar size={16} />
                  </div>
                </div>
              </div>

              <div>
                <Label text="Berlaku Hingga (Opsional)" />
                <div className="relative w-full mt-1.5">
                  <input 
                    type="text" 
                    placeholder="DD-MM-YYYY" 
                    className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-cyan-500 text-slate-800"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <Calendar size={16} />
                  </div>
                </div>
              </div>

              <div>
                <FormSelect label="Pola" required defaultValue="Setiap Minggu" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 4: STATUS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Status</h3>
            
            <div className="w-full sm:w-1/3">
              <FormSelect label="Status Slot" required defaultValue="Aktif" />
            </div>
            <span className="text-[11px] text-slate-400 block -mt-2">Slot aktif akan tampil di antrean dan booking online</span>
          </div>

        </div>

        {/* --- FOOTER --- */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white shrink-0 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          
          <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-semibold text-white transition-colors">
            Simpan Slot
          </button>
        </div>

      </div>
    </div>
  );
}

// --- Helper Components ---

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-[#0b2756]">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function FormInputTime({ label, required, defaultValue }: { label: string; required?: boolean; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <div className="relative w-full">
        <input 
          type="text" 
          defaultValue={defaultValue} 
          className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-cyan-500 text-slate-800"
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
          <Clock size={16} />
        </div>
      </div>
    </div>
  );
}

function FormInputNumber({ label, required, defaultValue, unit }: { label: string; required?: boolean; defaultValue?: string; unit?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <div className="relative w-full">
        <input 
          type="number" 
          defaultValue={defaultValue} 
          className="w-full border border-slate-300 rounded-lg pl-3 pr-16 py-2 text-sm outline-none focus:border-cyan-500 text-slate-800"
        />
        {unit && <span className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 pointer-events-none">{unit}</span>}
      </div>
    </div>
  );
}

function FormSelect({ label, required, defaultValue }: { label: string; required?: boolean; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <div className="relative w-full">
        <select 
          className="w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-10 text-sm text-slate-800 outline-none focus:border-cyan-500"
          defaultValue={defaultValue || ""}
        >
          {defaultValue && <option value={defaultValue}>{defaultValue}</option>}
          <option value="lainnya">Pilihan lainnya...</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}