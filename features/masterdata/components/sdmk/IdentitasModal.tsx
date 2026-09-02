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
  Camera, 
  ChevronDown, 
  ArrowRight,
  Check
} from 'lucide-react';

interface AddSdmkIdentitasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSdmkIdentitasModal({ isOpen, onClose }: AddSdmkIdentitasModalProps) {
  const [activeTab, setActiveTab] = useState('Identitas');

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
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* KIRI: IDENTITAS PRIBADI & ALAMAT DOMISILI (Kolom 8) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Box 1: Identitas Pribadi */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Identitas Pribadi</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* NIK */}
                  <div>
                    <Label text="NIK" required />
                    <div className="flex gap-2 mt-1.5">
                      <input 
                        type="text" 
                        placeholder="Masukkan 16 digit NIK" 
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
                      />
                      <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                        Cek NIK
                      </button>
                    </div>
                  </div>

                  {/* Nama Lengkap */}
                  <FormInput label="Nama Lengkap" required placeholder="Masukkan nama lengkap sesuai identitas" />

                  {/* Gelar Depan */}
                  <FormInput label="Gelar Depan" placeholder="Contoh: dr., apt., Ns." />

                  {/* Gelar Belakang */}
                  <FormInput label="Gelar Belakang" placeholder="Contoh: Sp.PD, M.Kes" />

                  {/* Tempat Lahir */}
                  <FormInput label="Tempat Lahir" placeholder="Contoh: Bandung" />

                  {/* Tanggal Lahir */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <Label text="Tanggal Lahir" required />
                    <div className="relative w-full">
                      <input 
                        type="text" 
                        placeholder="DD-MM-YYYY" 
                        className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                        <Calendar size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Jenis Kelamin */}
                  <div>
                    <Label text="Jenis Kelamin" required />
                    <div className="flex items-center gap-6 mt-2.5 h-10">
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="radio" name="gender_add" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" defaultChecked />
                        Laki-laki
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="radio" name="gender_add" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                        Perempuan
                      </label>
                    </div>
                  </div>

                  {/* Kewarganegaraan */}
                  <FormSelect label="Kewarganegaraan" required placeholder="Pilih Kewarganegaraan" />

                  {/* No. HP */}
                  <FormInput label="No. HP" required placeholder="08xxxxxxxxxx" />

                  {/* Email */}
                  <FormInput label="Email" placeholder="nama@email.com" />
                </div>
              </div>

              {/* Box 2: Alamat Domisili */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Alamat Domisili</h3>
                
                <div className="grid grid-cols-1 gap-5">
                  <FormInput label="Alamat Lengkap" required placeholder="Nama jalan, nomor, RT/RW, kelurahan/desa" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <FormSelect label="Provinsi" required placeholder="Pilih Provinsi" />
                    <FormSelect label="Kabupaten / Kota" required placeholder="Pilih Kabupaten / Kota" />
                    <FormSelect label="Kecamatan" required placeholder="Pilih Kecamatan" />
                    <FormSelect label="Kelurahan / Desa" required placeholder="Pilih Kelurahan / Desa" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormInput label="RT" placeholder="Contoh: 001" />
                    <FormInput label="RW" placeholder="Contoh: 002" />
                    <FormInput label="Kode Pos" placeholder="Contoh: 40123" />
                  </div>
                </div>
              </div>

            </div>

            {/* KANAN: IDENTITAS SISTEM, FOTO PROFIL, KONTAK DARURAT (Kolom 4) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Box 3: Identitas Sistem */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Identitas Sistem</h3>
                <div className="flex flex-col gap-1.5 w-full">
                  <Label text="SDMK ID" />
                  <input 
                    type="text" 
                    disabled 
                    placeholder="Akan dibuat otomatis oleh sistem" 
                    className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-400 outline-none"
                  />
                </div>
              </div>

              {/* Box 4: Foto Profil */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Foto Profil</h3>
                
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Camera size={22} />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">Upload Foto</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">PNG/JPG maksimal 2MB</p>
                </div>
                <p className="text-[11px] text-slate-500 text-center">Gunakan foto formal dengan latar belakang polos</p>
              </div>

              {/* Box 5: Kontak Darurat */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Kontak Darurat</h3>
                
                <div className="space-y-4">
                  <FormInput label="Nama Kontak Darurat" required placeholder="Masukkan nama lengkap" />
                  <FormSelect label="Hubungan" required placeholder="Pilih Hubungan" />
                  <FormInput label="No. HP Kontak Darurat" required placeholder="08xxxxxxxxxx" />
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
            <button className="px-6 py-2.5 border border-blue-600 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
              Simpan & Lanjut
            </button>
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2">
              Lanjut ke Profesi & Kompetensi <ArrowRight size={16} />
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
          ? 'border-blue-600 text-blue-600' 
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

function FormInput({ label, required, placeholder }: { label: string; required?: boolean; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <input 
        type="text" 
        placeholder={placeholder} 
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
      />
    </div>
  );
}

function FormSelect({ label, required, placeholder }: { label: string; required?: boolean; placeholder: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <div className="relative w-full">
        <select 
          className="w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-10 text-sm text-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled>{placeholder}</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}