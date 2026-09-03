'use client';

import React from 'react';
import { 
  X, 
  Calendar, 
  ChevronDown, 
  Info, 
  Paperclip,
  Save,
  Plus
} from 'lucide-react';

interface AddSipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSipModal({ isOpen, onClose }: AddSipModalProps) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-slate-200 bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[#0b2756] tracking-wide">Tambah SIP (Surat Izin Praktik)</h2>
            <p className="text-xs text-slate-500 mt-1">
              Lengkapi informasi SIP sesuai dokumen resmi. Data akan digunakan untuk layanan dan integrasi.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50/50 space-y-8">
          
          {/* SECTION 1: INFORMASI SIP */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Informasi SIP</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {/* Nomor SIP */}
              <div>
                <FormInput label="Nomor SIP" required placeholder="Masukkan nomor SIP" helperText="Contoh: 503/123/SIP/2023" />
              </div>

              {/* Jenis SIP */}
              <div>
                <FormSelect label="Jenis SIP" required placeholder="Pilih jenis SIP" />
              </div>

              {/* Tanggal Terbit */}
              <div>
                <Label text="Tanggal Terbit" required />
                <div className="relative w-full mt-1.5">
                  <input 
                    type="text" 
                    placeholder="DD-MM-YYYY" 
                    className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <Calendar size={16} />
                  </div>
                </div>
              </div>

              {/* Berlaku Hingga */}
              <div>
                <Label text="Berlaku Hingga" required />
                <div className="relative w-full mt-1.5">
                  <input 
                    type="text" 
                    placeholder="DD-MM-YYYY" 
                    className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <Calendar size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {/* Status SIP */}
              <div>
                <FormSelect label="Status SIP" required defaultValue="Aktif" />
              </div>

              {/* Tempat Terbit */}
              <div>
                <FormInput label="Tempat Terbit" required placeholder="Masukkan tempat terbit SIP" />
              </div>

              {/* No. SK SIP (Jika Ada) */}
              <div>
                <FormInput label="No. SK SIP (Jika Ada)" placeholder="Masukkan nomor SK SIP" />
              </div>

              {/* Tanggal SK (Jika Ada) */}
              <div>
                <Label text="Tanggal SK (Jika Ada)" />
                <div className="relative w-full mt-1.5">
                  <input 
                    type="text" 
                    placeholder="DD-MM-YYYY" 
                    className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <Calendar size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: TEMPAT PRAKTIK */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Tempat Praktik</h3>
            
            {/* Info Banner */}
            <div className="bg-cyan-50/60 border border-cyan-100 rounded-lg p-3.5 flex gap-3 items-start">
              <Info size={18} className="text-cyan-600 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-800 leading-relaxed font-medium">
                SIP berlaku untuk lokasi/tempat praktik tertentu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormSelect label="Nama Fasilitas / Fasyankes" required placeholder="Pilih fasilitas / fasyankes" />
              <FormSelect label="Unit / Poli" required placeholder="Pilih unit / poli" />
              <FormSelect label="Lokasi / Ruangan (Jika Ada)" placeholder="Pilih lokasi / ruangan" />
            </div>

            <div>
              <FormInput label="Alamat Praktik" required placeholder="Masukkan alamat lengkap tempat praktik" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <FormSelect label="Provinsi" required placeholder="Pilih provinsi" />
              <FormSelect label="Kabupaten / Kota" required placeholder="Pilih kabupaten / kota" />
              <FormSelect label="Kecamatan" required placeholder="Pilih kecamatan" />
              <FormSelect label="Kelurahan / Desa" required placeholder="Pilih kelurahan / desa" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormInput label="Kode Pos" placeholder="Contoh: 40123" />
              <FormInput label="Telepon Fasilitas (Jika Ada)" placeholder="Contoh: 021-1234567" />
              <FormInput label="Email Fasilitas (Jika Ada)" placeholder="Contoh: info@klinik.com" />
            </div>
          </div>

          {/* SECTION 3: LAMPIRAN DOKUMEN */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Lampiran Dokumen</h3>
            
            <div>
              <Label text="Upload File SIP" required />
              <div className="mt-2 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2">
                  <Paperclip size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-800">Klik atau drag & drop file di sini</p>
                <p className="text-[11px] text-slate-400 mt-0.5">PDF, JPG, PNG maks. 2MB</p>
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
            <button className="flex items-center gap-2 px-6 py-2.5 border border-cyan-600 rounded-xl text-sm font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors">
              <Plus size={16} /> Simpan & Tambah Lagi
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-semibold text-white transition-colors">
              <Save size={16} /> Simpan SIP
            </button>
          </div>
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

function FormInput({ label, required, placeholder, helperText }: { label: string; required?: boolean; placeholder?: string; helperText?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} />
      <input 
        type="text" 
        placeholder={placeholder} 
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
      />
      {helperText && <span className="text-[11px] text-slate-400">{helperText}</span>}
    </div>
  );
}

function FormSelect({ label, required, placeholder, defaultValue }: { label: string; required?: boolean; placeholder?: string; defaultValue?: string }) {
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