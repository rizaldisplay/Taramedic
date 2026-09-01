'use client';

import React from 'react';
import { 
  User, 
  Lock, 
  Phone, 
  Shield, 
  MapPin, 
  CheckCircle2, 
  LockKeyhole,
  AlertTriangle,
  ArrowRight,
  Trash2,
  ChevronDown
} from 'lucide-react';

export default function PatientRegistrationPanel() {
  return (
    // Hapus w-[380px], min-h-screen, bg, border, dan shadow
    // Gunakan w-full, h-full, dan tambahkan overflow-y-auto
    <div className="w-full h-full flex flex-col gap-6 p-6 font-sans overflow-y-auto custom-scrollbar">
      
      {/* SECTION: DATA PASIEN */}
      <section className="flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase mb-4">Data Pasien</h2>
        
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-600 text-xl font-medium tracking-wider flex-shrink-0">
            RA
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Rizka Amalia</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-gray-600 font-medium">RM000036</span>
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Aktif</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-700 font-medium">Perempuan <span className="text-gray-400 mx-1">•</span> 8 Tahun <span className="text-gray-400 mx-1">•</span> 02-03-2016</p>
          </div>
          <div className="flex items-start gap-3">
            <LockKeyhole size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div className="flex gap-4 text-xs">
              <span className="text-gray-500 w-12 shrink-0">NIK</span>
              <span className="text-gray-800 font-medium">3271••••••••9012</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div className="flex gap-4 text-xs">
              <span className="text-gray-500 w-12 shrink-0">No. HP</span>
              <span className="text-gray-800 font-medium">0815••••••••••</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div className="flex gap-4 text-xs">
              <span className="text-gray-500 w-12 shrink-0">Penjamin</span>
              <span className="text-gray-800 font-medium">BPJS Kesehatan</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div className="flex gap-4 text-xs">
              <span className="text-gray-500 w-12 shrink-0">Alamat</span>
              <span className="text-gray-800 font-medium leading-relaxed">Jl. Melati No. 12, Bandung</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SATUSEHAT */}
      <section className="border border-gray-200 rounded-xl p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-bold text-gray-800 tracking-wide">SATUSEHAT</h3>
          <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-100">
            Patient Terhubung
          </span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5">Patient IHS Number</p>
            <p className="text-xs font-semibold text-gray-800 break-all">PXXXXXXXXXXXXXXXXX</p>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-[10px] text-gray-500 mb-0.5">Last successful sync</p>
            <p className="text-xs font-medium text-gray-800 flex items-center gap-1 justify-end">
              16-08-2026 07:58 WIB <CheckCircle2 size={14} className="text-green-500" />
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: DAFTARKAN KUNJUNGAN */}
      <section className="flex-1 flex flex-col flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase mb-3">Daftarkan Kunjungan</h2>
        
        {/* Warning Alert */}
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-2 items-start mb-4">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Proses pendaftaran hanya dapat dilakukan setelah pasien ditandai HADIR dan pasien digunakan untuk pendaftaran.
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <FormSelect label="Poli/Unit Tujuan" required placeholder="Pilih Poli" />
          <FormSelect label="Dokter / Nakes" required placeholder="Pilih Dokter / Nakes" />
          
          <FormSelect label="Jenis Layanan" required placeholder="Pilih Jenis Layanan" />
          <FormSelect label="Cara Masuk" required placeholder="Pilih Cara Masuk" />
          
          <FormSelect label="Penjamin" required placeholder="Pilih Penjamin" />
          <FormSelect label="Jenis Pembayaran" required placeholder="Pilih Jenis Pembayaran" />
          
          <FormSelect label="Prioritas" required placeholder="Normal" />
          <FormSelect label="Loket Pendaftaran" required placeholder="Pilih Loket" />
          
          <div className="col-span-2">
            <FormSelect label="Lokasi Pelayanan" required placeholder="Pilih Lokasi Pelayanan" />
          </div>
        </div>

        {/* Submit Button */}
        <button disabled className="w-full bg-gray-200 text-white rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-bold cursor-not-allowed transition-colors mt-auto">
          DAFTARKAN KUNJUNGAN <ArrowRight size={16} />
        </button>

        {/* SECTION: INFORMASI PENDAFTARAN */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide">Informasi Pendaftaran</h3>
          <div className="grid grid-cols-[120px_10px_1fr] gap-y-2 text-xs mb-4">
            <div className="text-gray-500">Petugas Pendaftaran</div>
            <div className="text-gray-500">:</div>
            <div className="font-semibold text-gray-800">Rohmadi</div>
            
            <div className="text-gray-500">Loket Pendaftaran</div>
            <div className="text-gray-500">:</div>
            <div className="font-semibold text-gray-800">Loket 1</div>
            
            <div className="text-gray-500">Tanggal & Waktu</div>
            <div className="text-gray-500">:</div>
            <div className="font-semibold text-gray-800">16 Agustus 2026 <span className="text-gray-400 mx-1">•</span> 08:03 WIB</div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors">
            <Trash2 size={16} /> Kosongkan Formulir
          </button>
        </div>

      </section>
    </div>
  );
}

// --- Sub-component for Form Select ---
interface FormSelectProps {
  label: string;
  required?: boolean;
  placeholder: string;
}

function FormSelect({ label, required, placeholder }: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-semibold text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative w-full">
        <select 
          className="w-full appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-8 text-xs text-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-ellipsis"
          defaultValue=""
        >
          <option value="" disabled>{placeholder}</option>
          {/* Options will be mapped here dynamically from API */}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}