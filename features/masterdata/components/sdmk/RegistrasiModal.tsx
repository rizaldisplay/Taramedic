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
  CheckCircle2,
  Info,
  Eye,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';

interface AddSdmkRegistrasiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SipItem {
  no: number;
  nomorSip: string;
  tempatPraktik: string;
  poli: string;
  wilayah: string;
  kota: string;
  tanggalTerbit: string;
  berlakuHingga: string;
  status: 'Aktif' | 'Akan Berakhir' | 'Tidak Aktif';
}

const mockSipList: SipItem[] = [
  { no: 1, nomorSip: '503/123/SIP/2023', tempatPraktik: 'Klinik TARAMEDIC', poli: 'Poli Penyakit Dalam', wilayah: 'DKI Jakarta', kota: 'Jakarta Selatan', tanggalTerbit: '12-12-2023', berlakuHingga: '12-12-2028', status: 'Aktif' },
  { no: 2, nomorSip: '503/456/SIP/2022', tempatPraktik: 'RS Sejahtera', poli: 'Instalasi Rawat Inap', wilayah: 'DKI Jakarta', kota: 'Jakarta Timur', tanggalTerbit: '15-06-2022', berlakuHingga: '15-06-2027', status: 'Aktif' },
  { no: 3, nomorSip: '503/789/SIP/2021', tempatPraktik: 'Klinik Sehat', poli: 'Poli Umum', wilayah: 'Banten', kota: 'Tangerang Selatan', tanggalTerbit: '01-01-2021', berlakuHingga: '01-01-2026', status: 'Akan Berakhir' },
];

export default function AddSdmkRegistrasiModal({ isOpen, onClose }: AddSdmkRegistrasiModalProps) {
  const [activeTab, setActiveTab] = useState('Registrasi & Perizinan');

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
            
            {/* KIRI: STR, TABEL SIP, SERTIFIKAT LAIN (Kolom 8) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* SECTION: STR (Surat Tanda Registrasi) */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">STR (Surat Tanda Registrasi)</h3>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">Valid</span>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    <Check size={14} className="text-cyan-600" /> Verifikasi STR
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <FormInput label="Nomor STR" required defaultValue="123456/STR/DKI/2023/12345" />
                  
                  <div className="flex flex-col gap-1.5 w-full">
                    <Label text="Tanggal Terbit" required />
                    <div className="relative w-full">
                      <input 
                        type="text" 
                        defaultValue="10-01-2023" 
                        className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                        <Calendar size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <Label text="Berlaku Hingga" required />
                    <div className="relative w-full">
                      <input 
                        type="text" 
                        defaultValue="10-01-2028" 
                        className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                        <Calendar size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <FormSelect label="Status STR" required defaultValue="Valid" />
                  
                  <FormSelect label="Organisasi Penerbit" required defaultValue="Konsil Kedokteran Indonesia (KKI)" />

                  <div className="flex flex-col gap-1.5 w-full">
                    <Label text="Tanggal Verifikasi" />
                    <div className="relative w-full">
                      <input 
                        type="text" 
                        defaultValue="15-08-2026" 
                        className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                        <Calendar size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Verifikasi Badge Box */}
                <div>
                  <Label text="Status Verifikasi" />
                  <div className="mt-1.5 inline-flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Terverifikasi
                  </div>
                </div>
              </div>

              {/* SECTION: SIP (Surat Izin Praktik) */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">SIP (Surat Izin Praktik)</h3>
                  <button className="flex items-center gap-1.5 px-4 py-2 border border-cyan-600 rounded-lg text-xs font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors">
                    <Plus size={16} /> Tambah SIP
                  </button>
                </div>

                {/* Info Alert SIP */}
                <div className="bg-cyan-50/60 border border-cyan-100 rounded-lg p-3 flex gap-2.5 items-start">
                  <Info size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-cyan-800 leading-relaxed">
                    SDMK dapat memiliki lebih dari satu SIP sesuai tempat praktik.
                  </p>
                </div>

                {/* Table SIP */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3.5 w-12 text-center">No.</th>
                        <th className="px-4 py-3.5">Nomor SIP</th>
                        <th className="px-4 py-3.5">Tempat Praktik</th>
                        <th className="px-4 py-3.5">Wilayah</th>
                        <th className="px-4 py-3.5">Tanggal Terbit</th>
                        <th className="px-4 py-3.5">Berlaku Hingga</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {mockSipList.map((item) => (
                        <tr key={item.no} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 text-center text-slate-500 font-medium">{item.no}</td>
                          <td className="px-4 py-4 font-semibold text-slate-800">{item.nomorSip}</td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-800">{item.tempatPraktik}</p>
                            <p className="text-[11px] text-slate-500">{item.poli}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-slate-800">{item.wilayah}</p>
                            <p className="text-[11px] text-slate-500">{item.kota}</p>
                          </td>
                          <td className="px-4 py-4 text-slate-600">{item.tanggalTerbit}</td>
                          <td className="px-4 py-4 text-slate-600">{item.berlakuHingga}</td>
                          <td className="px-4 py-4">
                            {item.status === 'Aktif' ? (
                              <div className="flex items-center gap-1.5 text-green-600 font-medium">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div> Aktif
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-orange-500 font-medium">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div> Akan Berakhir <br/><span className="text-[10px] text-slate-400">(30 hari)</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors"><Eye size={15} /></button>
                              <button className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded transition-colors"><Edit2 size={15} /></button>
                              <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend Table */}
                <div className="flex items-center gap-6 pt-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Aktif</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Akan Berakhir</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Tidak Aktif / Kedaluwarsa</div>
                </div>
              </div>

              {/* SECTION: SERTIFIKAT LAIN */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">SERTIFIKAT LAIN (Opsional)</h3>
                
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Contoh: Sertifikat Kompetensi, ACLS, ATLS, dll." 
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
                  />
                  <button className="flex items-center gap-1.5 px-4 py-2 border border-cyan-600 rounded-lg text-xs font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors shrink-0">
                    <Plus size={16} /> Tambah Sertifikat
                  </button>
                </div>
              </div>

            </div>

            {/* KANAN: RINGKASAN REGISTRASI & INFORMASI (Kolom 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Box: Ringkasan Registrasi */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider mb-2">RINGKASAN REGISTRASI</h3>
                
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Status STR</span>
                    <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-[10px]">Valid</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Masa Berlaku STR</span>
                    <span className="font-semibold text-slate-800">10-01-2028</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Jumlah SIP Aktif</span>
                    <span className="font-semibold text-slate-800">2</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Jumlah SIP Akan Berakhir</span>
                    <span className="font-semibold text-orange-600">1</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500">Jumlah SIP Tidak Aktif</span>
                    <span className="font-semibold text-slate-800">0</span>
                  </div>
                </div>
              </div>

              {/* Box: Informasi */}
              <div className="bg-cyan-50/40 border border-cyan-100 rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-800">
                  <Info size={16} className="text-cyan-600" /> Informasi
                </div>
                <p className="text-xs text-cyan-900/80 leading-relaxed">
                  Pastikan data STR dan SIP selalu valid. TARAMEDIC akan mengingatkan sebelum masa berlaku berakhir.
                </p>
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
              Lanjut ke Penempatan <ArrowRight size={16} />
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