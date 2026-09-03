'use client';

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Award, 
  FileText, 
  MapPin, 
  Calendar, 
  Shield, 
  FileCheck, 
  ChevronDown, 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Check
} from 'lucide-react';

interface AddSdmkIntegrasiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSdmkIntegrasiModal({ isOpen, onClose }: AddSdmkIntegrasiModalProps) {
  const [activeTab, setActiveTab] = useState('Integrasi');
  const [syncStatus, setSyncStatus] = useState<'terhubung' | 'belum'>('terhubung');

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-7xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-slate-200 bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[#0b2756] tracking-wide">Tambah SDMK</h2>
            <p className="text-xs text-slate-500 mt-1">
              Lengkapi data tenaga kesehatan. Data akan digunakan untuk layanan dan integrasi SATUSEHAT.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* --- NAVIGATION TABS --- */}
        <div className="flex border-b border-slate-200 px-8 bg-white shrink-0 overflow-x-auto custom-scrollbar">
          <TabItem icon={User} label="Identitas" active={activeTab === 'Identitas'} onClick={() => setActiveTab('Identitas')} />
          <TabItem icon={Award} label="Profesi & Kompetensi" active={activeTab === 'Profesi & Kompetensi'} onClick={() => setActiveTab('Profesi & Kompetensi')} />
          <TabItem icon={FileText} label="Registrasi & Perizinan" active={activeTab === 'Registrasi & Perizinan'} onClick={() => setActiveTab('Registrasi & Perizinan')} />
          <TabItem icon={MapPin} label="Penempatan" active={activeTab === 'Penempatan'} onClick={() => setActiveTab('Penempatan')} />
          <TabItem icon={Calendar} label="Jadwal Praktik" active={activeTab === 'Jadwal Praktik'} onClick={() => setActiveTab('Jadwal Praktik')} />
          <TabItem icon={Shield} label="Integrasi" active={activeTab === 'Integrasi'} onClick={() => setActiveTab('Integrasi')} />
          <TabItem icon={FileCheck} label="Catatan" active={activeTab === 'Catatan'} onClick={() => setActiveTab('Catatan')} />
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50/50 space-y-8">
          
          {/* SECTION 1: SATUSEHAT SDMK INTEGRATION STATUS */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Integrasi SATUSEHAT SDMK</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hubungkan data tenaga medis dengan platform SATUSEHAT Kementerian Kesehatan.</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                syncStatus === 'terhubung' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {syncStatus === 'terhubung' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {syncStatus === 'terhubung' ? 'Terhubung ke SATUSEHAT' : 'Belum Terhubung'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
              <FormInput 
                label="Practitioner IHS Number" 
                required 
                defaultValue="N10000012345" 
                helperText="Nomor identitas unik praktisi di SATUSEHAT"
              />
              
              <FormInput 
                label="Organization ID" 
                defaultValue="OG123456789" 
                helperText="ID Organisasi Fasyankes terdaftar"
              />

              <div>
                <Label text="Sinkronisasi Data Terakhir" />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-semibold text-slate-800">16-08-2026 08:03 WIB</span>
                  <button className="p-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors" title="Sinkronisasi Sekarang">
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold transition-colors">
                Verifikasi IHS ke SATUSEHAT
              </button>
              <button className="flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:underline">
                Panduan Mendapatkan Practitioner IHS <ExternalLink size={13} />
              </button>
            </div>
          </div>

          {/* SECTION 2: MAP KODE & TERMINOLOGI */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Mapping Terminologi & Layanan</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormSelect 
                label="Mapping Spesialisasi Kemenkes" 
                required 
                defaultValue="Spesialis Penyakit Dalam (SP-012)" 
              />
              <FormSelect 
                label="Mapping Tipe Praktisi SATUSEHAT" 
                required 
                defaultValue="Doctor (Practitioner)" 
              />
            </div>
          </div>

          {/* SECTION 3: LOG & RIWAYAT INTEGRASI */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Log Riwayat Pengiriman API</h3>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-3 font-semibold text-slate-600 border-b border-slate-200 grid grid-cols-4">
                <span>Timestamp</span>
                <span>Endpoint / Resource</span>
                <span>Status HTTP</span>
                <span>Keterangan</span>
              </div>
              <div className="divide-y divide-slate-100 font-mono text-[11px]">
                <div className="px-4 py-2.5 grid grid-cols-4 items-center text-slate-700">
                  <span>16-08-2026 08:03:12</span>
                  <span className="text-cyan-600 font-semibold">Practitioner/{'{id}'}</span>
                  <span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-sans font-bold">200 OK</span></span>
                  <span className="text-slate-500 font-sans">Data berhasil disinkronkan</span>
                </div>
                <div className="px-4 py-2.5 grid grid-cols-4 items-center text-slate-700">
                  <span>16-08-2026 08:01:45</span>
                  <span className="text-cyan-600 font-semibold">Schedule & Slot</span>
                  <span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-sans font-bold">201 Created</span></span>
                  <span className="text-slate-500 font-sans">Jadwal praktik terdaftar</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- FOOTER --- */}
        <div className="px-8 py-5 border-t border-slate-200 bg-white shrink-0 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <ArrowLeft size={16} /> Kembali
            </button>
            <button className="px-6 py-2.5 border border-cyan-600 rounded-xl text-sm font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors">
              Simpan Perubahan
            </button>
            <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2">
              Lanjut ke Catatan <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Helper Components ---

function TabItem({ icon: Icon, label, active, onClick }: { icon: React.ElementType; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2.5 py-4 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
        active 
          ? 'border-cyan-600 text-cyan-600' 
          : 'border-transparent text-slate-500 hover:text-slate-800'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-[#0b2756]">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function FormInput({ label, required, placeholder, defaultValue, helperText }: { label: string; required?: boolean; placeholder?: string; defaultValue?: string; helperText?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <input 
        type="text" 
        placeholder={placeholder} 
        defaultValue={defaultValue}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
      />
      {helperText && <span className="text-[11px] text-slate-400">{helperText}</span>}
    </div>
  );
}

function FormSelect({ label, required, defaultValue }: { label: string; required?: boolean; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <div className="relative w-full">
        <select 
          className="w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-10 text-sm text-slate-800 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
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