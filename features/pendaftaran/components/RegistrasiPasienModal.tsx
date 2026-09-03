'use client';

import React from 'react';
import { X, Calendar, ChevronDown, ArrowRight } from 'lucide-react';

interface NewPatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewPatientRegistrationModal({ isOpen, onClose }: NewPatientRegistrationModalProps) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-white shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#0b2756] tracking-wide uppercase">Pendaftaran Pasien Baru</h2>
            <p className="text-xs text-slate-500 mt-1">
              Lengkapi identitas pasien sesuai dokumen resmi. Data akan digunakan untuk pembuatan Rekam Medis dan integrasi SATUSEHAT.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- SCROLLABLE FORM CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* Section A: Identitas Pasien */}
          <section>
            <SectionTitle title="A. IDENTITAS PASIEN" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Jenis Identitas */}
              <div>
                <Label text="Jenis Identitas" required />
                <div className="flex items-center gap-4 mt-2 h-10">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="identitas" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" defaultChecked />
                    NIK
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="identitas" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" />
                    Pasien Tanpa NIK
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="identitas" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" />
                    WNA
                  </label>
                </div>
              </div>

              {/* NIK Input + Button */}
              <div>
                <Label text="NIK" required />
                <div className="flex gap-2 mt-1.5">
                  <input 
                    type="text" 
                    placeholder="Masukkan 16 digit NIK" 
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    Cek NIK
                  </button>
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <FormInput label="Nama Lengkap" required placeholder="Sesuai KTP/NIK" />
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Tempat Lahir" placeholder="Contoh: Bandung" />
                <div className="flex flex-col gap-1.5 w-full">
                  <Label text="Tanggal Lahir" required />
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      placeholder="DD-MM-YYYY" 
                      className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                      <Calendar size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Jenis Kelamin */}
              <div>
                <Label text="Jenis Kelamin" required />
                <div className="flex items-center gap-6 mt-2 h-10">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="gender" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" />
                    Laki-laki
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="gender" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" defaultChecked />
                    Perempuan
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Section B: Alamat Sesuai Identitas */}
          <section>
            <SectionTitle title="B. ALAMAT SESUAI IDENTITAS" />
            
            <div className="grid grid-cols-1 gap-5 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                <FormInput label="Alamat Lengkap" required placeholder="Nama jalan, nomor rumah, RT/RW" />
                <FormSelect label="Provinsi" required placeholder="Pilih Provinsi" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect label="Kabupaten/Kota" required placeholder="Pilih Kabupaten/Kota" />
                <FormSelect label="Kecamatan" required placeholder="Pilih Kecamatan" />
                <FormSelect label="Desa/Kelurahan" required placeholder="Pilih Desa/Kelurahan" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="RT" placeholder="Contoh: 001" />
                <FormInput label="RW" placeholder="Contoh: 002" />
                <FormInput label="Kode Pos" placeholder="Contoh: 40123" />
              </div>
            </div>
          </section>

          {/* Section C: Kontak Pasien */}
          <section>
            <SectionTitle title="C. KONTAK PASIEN" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormInput label="Nomor HP" required placeholder="08xxxxxxxxxx" />
              <FormInput label="Email" placeholder="nama@email.com" />
            </div>
          </section>

          {/* Section D: Data Administrasi */}
          <section>
            <SectionTitle title="D. DATA ADMINISTRASI" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <FormInput label="Nomor Kartu Keluarga" placeholder="Masukkan 16 digit nomor KK" />
              <FormSelect label="Status Perkawinan" placeholder="Pilih Status" />
              <FormSelect label="Kewarganegaraan" required placeholder="Pilih Kewarganegaraan" />
              <FormSelect label="Bahasa Komunikasi" placeholder="Bahasa Indonesia" />
            </div>
          </section>

          {/* Section E: Kontak Darurat */}
          <section>
            <SectionTitle title="E. KONTAK DARURAT" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <FormInput label="Nama Kontak Darurat" placeholder="Nama lengkap" />
              <FormSelect label="Hubungan" placeholder="Pilih Hubungan" />
              <FormInput label="Nomor HP Kontak Darurat" placeholder="08xxxxxxxxxx" />
            </div>
          </section>

        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex items-center justify-between gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
          
          <div className="flex gap-3">
            <button className="px-6 py-2.5 border border-cyan-600 rounded-lg text-sm font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors">
              Simpan Data Pasien
            </button>
            <button className="px-6 py-2.5 bg-cyan-600 rounded-lg text-sm font-semibold text-white hover:bg-cyan-700 transition-colors flex items-center gap-2">
              Simpan & Daftarkan Berobat <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Internal Helper Components ---

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-bold text-cyan-700 border-l-2 border-red-500 pl-2">
      {title}
    </h3>
  );
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-[#0b2756]">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

interface FormInputProps {
  label: string;
  required?: boolean;
  placeholder: string;
  type?: string;
}

function FormInput({ label, required, placeholder, type = "text" }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <input 
        type={type} 
        placeholder={placeholder} 
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
      />
    </div>
  );
}

interface FormSelectProps {
  label: string;
  required?: boolean;
  placeholder: string;
}

function FormSelect({ label, required, placeholder }: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <div className="relative w-full">
        <select 
          className="w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-10 text-sm text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
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