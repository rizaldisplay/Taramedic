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
  Plus,
  FileText as FileIcon,
  Trash2
} from 'lucide-react';

interface AddSdmkProfesiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Types for Kompetensi Tambahan Table ---
interface KompetensiItem {
  no: number;
  nama: string;
  penyelenggara: string;
  tanggalPeroleh: string;
  berlakuHingga: string;
}

const mockKompetensi: KompetensiItem[] = [
  { no: 1, nama: 'Pelatihan Advanced Cardiac Life Support (ACLS)', penyelenggara: 'IDI', tanggalPeroleh: '10-01-2023', berlakuHingga: '10-01-2026' },
  { no: 2, nama: 'Workshop Manajemen Hipertensi', penyelenggara: 'PERKI', tanggalPeroleh: '15-06-2022', berlakuHingga: '15-06-2025' },
  { no: 3, nama: 'Sertifikat EKG', penyelenggara: 'Kemenkes RI', tanggalPeroleh: '20-03-2021', berlakuHingga: '-' },
];

export default function AddSdmkProfesiModal({ isOpen, onClose }: AddSdmkProfesiModalProps) {
  const [activeTab, setActiveTab] = useState('Profesi & Kompetensi');

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
          
          {/* SECTION 1: PROFESI & KOMPETENSI FORM */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Profesi & Kompetensi</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kiri */}
              <div className="space-y-6">
                <FormSelect label="Jenis SDMK" required defaultValue="Tenaga Medis" />
                <FormSelect label="Profesi" required defaultValue="Dokter" />
                <FormSelect label="Kompetensi Utama" required defaultValue="Dokter Spesialis" />
                <FormSelect label="Spesialisasi" required defaultValue="Ilmu Penyakit Dalam" />
                <FormSelect label="Sub Spesialisasi" placeholder="Pilih Sub Spesialisasi (jika ada)" />
              </div>

              {/* Kanan */}
              <div className="space-y-6">
                <div className="flex flex-col gap-1.5 w-full">
                  <Label text="Kode Profesi (Internal)" />
                  <input 
                    type="text" 
                    defaultValue="DOC-SPPD" 
                    disabled
                    className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-500 outline-none"
                  />
                </div>
                <FormSelect label="Tingkat Pendidikan Terakhir" required defaultValue="Spesialis (Sp-1)" />
                <FormInput label="Institusi Pendidikan" defaultValue="Universitas Indonesia" />
                <FormInput label="Tahun Lulus" defaultValue="2012" />

                {/* Status SDMK Radio Options */}
                <div>
                  <Label text="Status SDMK" required />
                  <div className="flex flex-wrap items-center gap-6 mt-2.5 h-10">
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="radio" name="status_sdmk" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" defaultChecked />
                      Aktif
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="radio" name="status_sdmk" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" />
                      Tidak Aktif
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="radio" name="status_sdmk" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" />
                      Cuti
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="radio" name="status_sdmk" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" />
                      Berakhir Kontrak
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: KOMPETENSI TAMBAHAN TABLE */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
              Kompetensi Tambahan (Sertifikat / Pelatihan / Kompetensi Lain)
            </h3>

            {/* Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5 w-16 text-center">No.</th>
                    <th className="px-4 py-3.5">Nama Kompetensi / Sertifikat</th>
                    <th className="px-4 py-3.5">Penyelenggara</th>
                    <th className="px-4 py-3.5">Tanggal Peroleh</th>
                    <th className="px-4 py-3.5">Berlaku Hingga</th>
                    <th className="px-4 py-3.5 text-center">Dokumen</th>
                    <th className="px-4 py-3.5 text-center w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockKompetensi.map((item) => (
                    <tr key={item.no} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-center text-slate-500 text-xs font-medium">{item.no}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800 text-xs">{item.nama}</td>
                      <td className="px-4 py-3.5 text-slate-600 text-xs">{item.penyelenggara}</td>
                      <td className="px-4 py-3.5 text-slate-600 text-xs">{item.tanggalPeroleh}</td>
                      <td className="px-4 py-3.5 text-slate-600 text-xs">{item.berlakuHingga}</td>
                      <td className="px-4 py-3.5 text-center">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors">
                          <FileIcon size={14} /> Lihat
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Button */}
            <div>
              <button className="flex items-center gap-2 px-4 py-2 border border-cyan-600 rounded-xl text-xs font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors">
                <Plus size={16} /> Tambah Kompetensi
              </button>
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
            <button className="px-6 py-2.5 border border-cyan-600 rounded-xl text-sm font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors">
              Simpan & Lanjut
            </button>
            <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2">
              Lanjut ke Registrasi & Perizinan <ArrowRight size={16} />
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

function FormInput({ label, required, placeholder, defaultValue }: { label: string; required?: boolean; placeholder?: string; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <input 
        type="text" 
        placeholder={placeholder} 
        defaultValue={defaultValue}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
      />
    </div>
  );
}

function FormSelect({ label, required, defaultValue, placeholder }: { label: string; required?: boolean; defaultValue?: string; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <div className="relative w-full">
        <select 
          className="w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-10 text-sm text-slate-800 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          defaultValue={defaultValue || ""}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
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