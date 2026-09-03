'use client';

import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  Edit3, 
  PowerOff,
  User,
  Award,
  FileText,
  MapPin,
  Calendar,
  ShieldCheck
} from 'lucide-react';

interface SdmkDetailPanelProps {
  onClose?: () => void;
}

export default function SdmkDetailPanel({ onClose }: SdmkDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'identitas' | 'profesi' | 'registrasi'>('ringkasan');

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm font-sans flex flex-col h-full overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
        <h2 className="text-xs font-bold text-[#0b2756] tracking-wider uppercase">Detail SDMK</h2>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        
        {/* Profile Card Summary */}
        <div className="flex items-start gap-4 p-4 bg-slate-50/60 border border-slate-100 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-100 border border-cyan-200/60 flex items-center justify-center font-bold text-cyan-700 text-base shrink-0 shadow-inner">
            BS
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">dr. Budi Santoso, Sp.PD</h3>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/50 shrink-0">
                Aktif
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">SDMK-00001</p>
            <div className="mt-2.5 inline-flex items-center bg-cyan-50/80 border border-cyan-100 text-cyan-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
              Dokter Spesialis Penyakit Dalam
            </div>
          </div>
        </div>

        {/* Status Badges Grid (STR, SIP, SATUSEHAT) */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* STR */}
          <div className="border border-slate-200/80 rounded-xl p-3 bg-white shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">STR</p>
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Valid
            </div>
            <p className="text-[11px] font-medium text-slate-800 truncate">123456/STR/...</p>
            <p className="text-[10px] text-slate-400 mt-0.5"> s.d 12-12-2027</p>
          </div>

          {/* SIP */}
          <div className="border border-slate-200/80 rounded-xl p-3 bg-white shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SIP</p>
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aktif
            </div>
            <p className="text-[11px] font-medium text-slate-800 truncate">503/123/SIP/...</p>
            <p className="text-[10px] text-slate-400 mt-0.5"> s.d 12-12-2027</p>
          </div>

          {/* SATUSEHAT */}
          <div className="border border-slate-200/80 rounded-xl p-3 bg-white shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SATUSEHAT</p>
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Terhubung
            </div>
            <p className="text-[10px] text-slate-400">Practitioner IHS</p>
            <p className="text-[11px] font-medium text-slate-800 truncate">N10000012345</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 text-xs font-semibold overflow-x-auto no-scrollbar">
          <TabButton label="Ringkasan" active={activeTab === 'ringkasan'} onClick={() => setActiveTab('ringkasan')} />
          <TabButton label="Identitas" active={activeTab === 'identitas'} onClick={() => setActiveTab('identitas')} />
          <TabButton label="Profesi" active={activeTab === 'profesi'} onClick={() => setActiveTab('profesi')} />
          <TabButton label="Registrasi" active={activeTab === 'registrasi'} onClick={() => setActiveTab('registrasi')} />
        </div>

        {/* --- TAB CONTENT CONTAINER --- */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6 animate-fadeIn">
            {/* SECTION: IDENTITAS */}
            <section className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span> Identitas Pribadi
              </h4>
              
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50/60 border border-slate-100 rounded-2xl p-4">
                <DetailItem label="NIK" value="3271••••••••9012" />
                <DetailItem label="Jenis Kelamin" value="Laki-laki" />
                <DetailItem label="Tempat, Tgl Lahir" value="Bandung, 10-01-1980" />
                <DetailItem label="No. HP" value="0815••••••••" />
              </div>
            </section>

            {/* SECTION: PENEMPATAN UTAMA */}
            <section className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span> Penempatan Utama
              </h4>
              
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50/60 border border-slate-100 rounded-2xl p-4">
                <DetailItem label="Unit / Poli" value="Poli Penyakit Dalam" />
                <DetailItem label="Peran / Jabatan" value="Dokter" />
                <DetailItem label="Lokasi" value="Ruang Pemeriksaan 02" />
                <DetailItem label="Mulai" value="01-01-2024" />
              </div>
            </section>

            {/* SECTION: JADWAL PRAKTIK */}
            <section className="space-y-2.5">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span> Jadwal Praktik (Minggu Ini)
                </h4>
                <button className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-0.5 transition-colors">
                  Lihat Semua <ChevronRight size={14} />
                </button>
              </div>

              <div className="border border-slate-200/80 rounded-2xl overflow-hidden text-xs bg-white">
                <ScheduleRow day="Senin" time="08:00 - 12:00" unit="Poli Penyakit Dalam" room="Ruang 02" />
                <ScheduleRow day="Selasa" time="13:00 - 17:00" unit="Poli Penyakit Dalam" room="Ruang 02" />
                <ScheduleRow day="Rabu" time="08:00 - 12:00" unit="Poli Penyakit Dalam" room="Ruang 02" />
                <ScheduleRow day="Kamis" time="13:00 - 17:00" unit="Poli Penyakit Dalam" room="Ruang 02" />
                <ScheduleRow day="Jumat" time="08:00 - 12:00" unit="Poli Penyakit Dalam" room="Ruang 02" last />
              </div>
            </section>
          </div>
        )}

        {activeTab !== 'ringkasan' && (
          <div className="py-12 text-center text-slate-400 text-xs">
            Informasi detail bagian <span className="font-semibold capitalize">{activeTab}</span> akan ditampilkan di sini.
          </div>
        )}

      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0 grid grid-cols-2 gap-3">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-2xs">
          <Edit3 size={15} className="text-slate-500" /> Edit SDMK
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-100 bg-red-50/30 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors shadow-2xs">
          <PowerOff size={15} className="text-red-500" /> Nonaktifkan
        </button>
      </div>

    </div>
  );
}

// --- Helper Components ---

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`pb-2.5 px-3.5 border-b-2 font-semibold transition-colors shrink-0 ${
        active ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {label}
    </button>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-slate-400 font-medium">{label}</span>
      <span className="text-xs font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function ScheduleRow({ day, time, unit, room, last = false }: { day: string; time: string; unit: string; room: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-white ${!last ? 'border-b border-slate-100' : ''}`}>
      <div className="w-16 font-bold text-slate-800">{day}</div>
      <div className="text-slate-600 font-medium">{time}</div>
      <div className="text-slate-500">{unit}</div>
      <div className="text-slate-500 font-medium">{room}</div>
    </div>
  );
}