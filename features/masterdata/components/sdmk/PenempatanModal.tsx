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
  Filter,
  Info,
  Check,
  Edit2,
  Trash2
} from 'lucide-react';

interface AddSdmkPenempatanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PenempatanItem {
  no: number;
  fasyankes: string;
  unitPoli: string;
  lokasiRuangan: string;
  peran: string;
  jabatan: string;
  status: 'Aktif' | 'Nonaktif';
  tglMulai: string;
  tglBerakhir: string;
  isPj: boolean;
}

const mockPenempatanList: PenempatanItem[] = [
  { no: 1, fasyankes: 'Klinik TARAMEDIC', unitPoli: 'Poli Penyakit Dalam', lokasiRuangan: 'Ruang Pemeriksaan 02', peran: 'Dokter', jabatan: 'Dokter Penanggung Jawab', status: 'Aktif', tglMulai: '01-01-2026', tglBerakhir: '-', isPj: true },
  { no: 2, fasyankes: 'Klinik TARAMEDIC', unitPoli: 'UGD', lokasiRuangan: 'Ruang Tindakan 1', peran: 'Dokter', jabatan: 'Dokter Jaga', status: 'Aktif', tglMulai: '15-02-2026', tglBerakhir: '-', isPj: false },
  { no: 3, fasyankes: 'Klinik TARAMEDIC', unitPoli: 'Poli Gigi', lokasiRuangan: 'Ruang Pemeriksaan Gigi 01', peran: 'Dokter Gigi', jabatan: 'Dokter Gigi', status: 'Nonaktif', tglMulai: '01-06-2025', tglBerakhir: '31-12-2025', isPj: false },
];

export default function AddSdmkPenempatanModal({ isOpen, onClose }: AddSdmkPenempatanModalProps) {
  const [activeTab, setActiveTab] = useState('Penempatan');
  const [isPjUnit, setIsPjUnit] = useState(true);

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
          
          {/* SECTION: PENEMPATAN & PERAN (HEADER INFO) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Penempatan & Peran</h3>
            <p className="text-xs text-slate-500">Kelola penempatan SDMK di fasilitas, unit/poli, lokasi/ruangan, dan peran/jabatan.</p>
            
            {/* Info Banner */}
            <div className="bg-cyan-50/60 border border-cyan-100 rounded-lg p-3.5 flex gap-3 items-start">
              <Info size={18} className="text-cyan-600 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-800 leading-relaxed font-medium">
                Satu SDMK dapat memiliki lebih dari satu penempatan di fasilitas yang berbeda atau pada unit/ruangan yang berbeda.
              </p>
            </div>
          </div>

          {/* SECTION: FORM TAMBAH PENEMPATAN */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Tambah Penempatan</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <FormSelect label="Fasyankes" required placeholder="Pilih fasyankes" />
              <FormSelect label="Unit / Poli" required placeholder="Pilih unit / poli" />
              <FormSelect label="Lokasi / Ruangan" required placeholder="Pilih lokasi / ruangan" />
              <FormSelect label="Peran di Unit" required placeholder="Pilih peran" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 items-center">
              <FormSelect label="Jabatan" placeholder="Pilih jabatan (jika ada)" />
              <FormSelect label="Status Penempatan" required defaultValue="Aktif" />
              
              {/* Tanggal Mulai */}
              <div>
                <Label text="Tanggal Mulai" required />
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

              {/* Tanggal Berakhir */}
              <div>
                <Label text="Tanggal Berakhir" />
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

            {/* Penanggung Jawab Unit Toggle */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#0b2756] flex items-center gap-1.5">
                  Penanggung Jawab Unit 
                  <span className="text-slate-400 cursor-pointer" title="Informasi PJ Unit">ℹ</span>
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsPjUnit(!isPjUnit)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPjUnit ? 'bg-cyan-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPjUnit ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-xs font-semibold text-slate-700">Ya</span>
            </div>

            {/* Catatan (opsional) */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label text="Catatan (opsional)" />
              <textarea 
                rows={3}
                maxLength={255}
                placeholder="Masukkan catatan penempatan" 
                className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800 resize-none"
              />
              <div className="flex justify-end">
                <span className="text-[11px] text-slate-400">0 / 255</span>
              </div>
            </div>

            {/* Action Buttons inside Form */}
            <div className="flex justify-end gap-3 pt-2">
              <button className="px-5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Batal
              </button>
              <button className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-xs font-semibold text-white transition-colors">
                Simpan Penempatan
              </button>
            </div>
          </div>

          {/* SECTION: DAFTAR PENEMPATAN */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Daftar Penempatan</h3>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  <Filter size={14} /> Filter
                </button>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-cyan-600 rounded-lg text-xs font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors">
                  <Plus size={14} /> Tambah Penempatan
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[900px]">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5 w-12 text-center">No.</th>
                    <th className="px-4 py-3.5">Fasyankes</th>
                    <th className="px-4 py-3.5">Unit / Poli</th>
                    <th className="px-4 py-3.5">Lokasi / Ruangan</th>
                    <th className="px-4 py-3.5">Peran di Unit</th>
                    <th className="px-4 py-3.5">Jabatan</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Tgl Mulai</th>
                    <th className="px-4 py-3.5">Tgl Berakhir</th>
                    <th className="px-4 py-3.5 text-center">PJ Unit</th>
                    <th className="px-4 py-3.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {mockPenempatanList.map((item) => (
                    <tr key={item.no} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-center text-slate-500 font-medium">{item.no}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{item.fasyankes}</td>
                      <td className="px-4 py-3.5 text-slate-700">{item.unitPoli}</td>
                      <td className="px-4 py-3.5 text-slate-700">{item.lokasiRuangan}</td>
                      <td className="px-4 py-3.5 text-slate-700">{item.peran}</td>
                      <td className="px-4 py-3.5 text-slate-700">{item.jabatan}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{item.tglMulai}</td>
                      <td className="px-4 py-3.5 text-slate-600">{item.tglBerakhir}</td>
                      <td className="px-4 py-3.5 text-center">
                        {item.isPj && <Check size={16} className="text-green-600 mx-auto font-bold" />}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded transition-colors"><Edit2 size={15} /></button>
                          <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination inside Daftar Penempatan */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">Menampilkan 1 - 3 dari 3 data</span>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded border border-slate-200"><ChevronDown size={14} className="rotate-90" /></button>
                  <button className="w-7 h-7 flex items-center justify-center bg-cyan-600 text-white text-xs font-semibold rounded">1</button>
                  <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded border border-slate-200"><ChevronDown size={14} className="-rotate-90" /></button>
                </div>

                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-300 rounded-md py-1 pl-2 pr-7 text-xs text-slate-700 outline-none">
                    <option>10 / halaman</option>
                    <option>20 / halaman</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                    <ChevronDown size={12} />
                  </div>
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
              Simpan & Lanjut
            </button>
            <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2">
              Lanjut ke Jadwal Praktik <ArrowRight size={16} />
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