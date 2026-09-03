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
  Plus,
  Info,
  Check,
  Edit2,
  Trash2,
  ExternalLink,
  Clock
} from 'lucide-react';

interface AddSdmkJadwalPraktikModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JadwalHariItem {
  hari: string;
  aktif: boolean;
  jamMulai: string;
  jamSelesai: string;
  durasiSlot: string;
  kuota: string;
  kuotaOnline: string;
  istirahat: string;
  jenisPasien: string;
  status: 'Aktif' | 'Tidak Aktif';
}

const initialJadwalList: JadwalHariItem[] = [
  { hari: 'Senin', aktif: true, jamMulai: '08:00', jamSelesai: '12:00', durasiSlot: '15 menit', kuota: '30', kuotaOnline: '20', istirahat: '12:00 - 13:00', jenisPasien: 'Umum, BPJS', status: 'Aktif' },
  { hari: 'Selasa', aktif: false, jamMulai: '-', jamSelesai: '-', durasiSlot: '-', kuota: '-', kuotaOnline: '-', istirahat: '-', jenisPasien: '-', status: 'Tidak Aktif' },
  { hari: 'Rabu', aktif: true, jamMulai: '13:00', jamSelesai: '17:00', durasiSlot: '15 menit', kuota: '30', kuotaOnline: '20', istirahat: '17:00 - 17:30', jenisPasien: 'Umum, BPJS', status: 'Aktif' },
  { hari: 'Kamis', aktif: false, jamMulai: '-', jamSelesai: '-', durasiSlot: '-', kuota: '-', kuotaOnline: '-', istirahat: '-', jenisPasien: '-', status: 'Tidak Aktif' },
  { hari: 'Jumat', aktif: true, jamMulai: '08:00', jamSelesai: '11:00', durasiSlot: '15 menit', kuota: '20', kuotaOnline: '15', istirahat: '-', jenisPasien: 'Umum, BPJS', status: 'Aktif' },
  { hari: 'Sabtu', aktif: false, jamMulai: '-', jamSelesai: '-', durasiSlot: '-', kuota: '-', kuotaOnline: '-', istirahat: '-', jenisPasien: '-', status: 'Tidak Aktif' },
  { hari: 'Minggu', aktif: false, jamMulai: '-', jamSelesai: '-', durasiSlot: '-', kuota: '-', kuotaOnline: '-', istirahat: '-', jenisPasien: '-', status: 'Tidak Aktif' },
];

export default function AddSdmkJadwalPraktikModal({ isOpen, onClose }: AddSdmkJadwalPraktikModalProps) {
  const [activeTab, setActiveTab] = useState('Jadwal Praktik');
  const [jadwalData, setJadwalData] = useState<JadwalHariItem[]>(initialJadwalList);

  if (!isOpen) return null;

  const toggleDayActive = (index: number) => {
    const updated = [...jadwalData];
    updated[index].aktif = !updated[index].aktif;
    updated[index].status = updated[index].aktif ? 'Aktif' : 'Tidak Aktif';
    setJadwalData(updated);
  };

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
          
          {/* SECTION 1: INFORMASI & PENEMPATAN AKTIF */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Info Banner */}
            <div className="lg:col-span-5 bg-cyan-50/60 border border-cyan-100 rounded-xl p-4 flex gap-3 items-start">
              <Info size={18} className="text-cyan-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-cyan-900 uppercase">Informasi</h4>
                <p className="text-xs text-cyan-800 leading-relaxed">
                  Jadwal praktik disusun berdasarkan penempatan aktif. Data jadwal akan digunakan untuk ketersediaan layanan, antrean online, dan integrasi SATUSEHAT (Schedule & Slot).
                </p>
              </div>
            </div>

            {/* Penempatan Aktif Card */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Fasyankes</span>
                  <span className="font-semibold text-slate-800">Klinik TARAMEDIC</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Unit / Poli</span>
                  <span className="font-semibold text-slate-800">Poli Penyakit Dalam</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Lokasi / Ruangan</span>
                  <span className="font-semibold text-slate-800">Ruang Pemeriksaan 02</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Peran</span>
                  <span className="font-semibold text-slate-800">Dokter</span>
                </div>
              </div>

              <button className="flex items-center gap-1.5 px-3 py-2 border border-cyan-200 bg-cyan-50/50 rounded-lg text-xs font-semibold text-cyan-600 hover:bg-cyan-100 transition-colors shrink-0 ml-4">
                Lihat Penempatan <ExternalLink size={14} />
              </button>
            </div>

          </div>

          {/* SECTION 2: PENGATURAN JADWAL */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Pengaturan Jadwal</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              
              {/* Tipe Jadwal */}
              <div>
                <Label text="Tipe Jadwal" required />
                <div className="flex flex-col gap-2 mt-2.5">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="tipe_jadwal" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" defaultChecked />
                    Berulang (Mingguan)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="tipe_jadwal" className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" />
                    Satu Kali / Khusus
                  </label>
                </div>
              </div>

              {/* Kapasitas Per Hari */}
              <div>
                <Label text="Kapasitas Per Hari" required />
                <div className="relative mt-1.5">
                  <input 
                    type="number" 
                    defaultValue={30} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500 text-slate-800"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 pointer-events-none">pasien</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Total kuota pasien per hari untuk jadwal ini</span>
              </div>

              {/* Durasi Layanan */}
              <div>
                <FormSelect label="Durasi Layanan (per pasien)" required defaultValue="15 menit" />
              </div>

              {/* Jenis Pasien Dilayani */}
              <div>
                <Label text="Jenis Pasien Dilayani" required />
                <div className="flex flex-wrap gap-3 mt-2.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500" /> Umum
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500" /> BPJS
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500" /> Asuransi
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500" /> Perusahaan
                  </label>
                </div>
              </div>

              {/* Status Jadwal */}
              <div>
                <FormSelect label="Status Jadwal" required defaultValue="Aktif" />
              </div>

            </div>
          </div>

          {/* SECTION 3: JADWAL MINGGUAN & PREVIEW SLOT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Tabel Jadwal Mingguan (Kolom 8) */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Jadwal Mingguan</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Atur hari dan rentang waktu praktik sesuai ketersediaan layanan.</p>
                </div>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-cyan-600 rounded-lg text-xs font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors">
                  <Plus size={14} /> Tambah Slot Waktu
                </button>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-xl overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm whitespace-nowrap min-w-[750px]">
                  <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-3 w-10 text-center"></th>
                      <th className="px-3 py-3">Hari</th>
                      <th className="px-3 py-3">Jam Mulai</th>
                      <th className="px-3 py-3">Jam Selesai</th>
                      <th className="px-3 py-3">Durasi Slot</th>
                      <th className="px-3 py-3">Kuota</th>
                      <th className="px-3 py-3">Kuota Online</th>
                      <th className="px-3 py-3">Istirahat</th>
                      <th className="px-3 py-3">Jenis Pasien</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {jadwalData.map((item, idx) => (
                      <tr key={item.hari} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-3 text-center text-slate-300 cursor-grab">⋮⋮</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <button 
                              type="button" 
                              onClick={() => toggleDayActive(idx)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.aktif ? 'bg-green-600' : 'bg-slate-300'}`}
                            >
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${item.aktif ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                            <span className="font-semibold text-slate-800">{item.hari}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-700">{item.jamMulai}</td>
                        <td className="px-3 py-3 font-medium text-slate-700">{item.jamSelesai}</td>
                        <td className="px-3 py-3 text-slate-600">{item.durasiSlot}</td>
                        <td className="px-3 py-3 font-medium text-slate-800">{item.kuota}</td>
                        <td className="px-3 py-3 font-medium text-slate-800">{item.kuotaOnline}</td>
                        <td className="px-3 py-3 text-slate-600">{item.istirahat}</td>
                        <td className="px-3 py-3 text-slate-600">{item.jenisPasien}</td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1 text-cyan-600 hover:bg-cyan-50 rounded"><Edit2 size={14} /></button>
                            <button className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Master Status Toggle at bottom of table */}
              <div className="flex items-center gap-3 pt-2">
                <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-green-600">
                  <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white translate-x-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Aktif</span>
                <span className="text-xs font-semibold text-slate-400 ml-4">Tidak Aktif</span>
              </div>
            </div>

            {/* Preview Slot & Ketentuan (Kolom 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Preview Slot Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Preview Slot (Senin)</h3>
                
                <div className="bg-cyan-50/60 border border-cyan-100 rounded-lg p-3 flex gap-2.5 items-start">
                  <Info size={15} className="text-cyan-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-cyan-800 leading-relaxed">
                    Slot akan dibuat otomatis berdasarkan durasi layanan dan jam praktik.
                  </p>
                </div>

                <div className="space-y-2 text-xs font-medium text-slate-700 font-mono">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">08:00 - 08:15</div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">08:15 - 08:30</div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">08:30 - 08:45</div>
                  <div className="text-center text-slate-400 py-1">...</div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">11:45 - 12:00</div>
                </div>
              </div>

              {/* Ketentuan Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Ketentuan</h3>
                
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check size={15} className="text-green-600 shrink-0 mt-0.5" />
                    <span>Durasi minimal 10 menit per pasien</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={15} className="text-green-600 shrink-0 mt-0.5" />
                    <span>Istirahat wajib diisi jika ada jeda waktu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={15} className="text-green-600 shrink-0 mt-0.5" />
                    <span>Kuota online tidak boleh melebihi kuota total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={15} className="text-green-600 shrink-0 mt-0.5" />
                    <span>Data dikirim ke SATUSEHAT sebagai Schedule & Slot</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* SECTION 4: DASAR REGULASI */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase">Dasar Regulasi</h4>
                <div className="text-[11px] text-slate-500 space-y-0.5 mt-0.5">
                  <p>Permenkes No. 7 Tahun 2022 tentang Registrasi Tenaga Medis dan Tenaga Kesehatan</p>
                  <p>Permenkes No. 24 Tahun 2022 tentang Rekam Medis</p>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 border-l border-slate-200 pl-4 shrink-0 hidden md:block">
              <span className="font-semibold text-slate-700 block mb-0.5">SATUSEHAT menggunakan standar FHIR Resource:</span>
              <span>Schedule, Slot, PractitionerRole</span>
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
              Simpan & Lanjut
            </button>
            <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2">
              Lanjut ke Integrasi <ArrowRight size={16} />
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