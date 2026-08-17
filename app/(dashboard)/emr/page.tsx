'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  ClipboardList,
  Users,
  Activity,
  FileText,
  Monitor,
  Clock,
  Bell,
  ChevronDown,
  ArrowLeft,
  History,
  Phone,
  CheckCircle2,
  Volume2,
  Plus,
  Save,
  Send,
  X
} from 'lucide-react';

export default function PemeriksaanPerawat() {
  const [activeTab, setActiveTab] = useState('Pemeriksaan Awal');
  const [kesadaran, setKesadaran] = useState('Compos Mentis');
  const [painScale, setPainScale] = useState(2);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* ==================== SIDEBAR ==================== */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <HeartHandshake className="w-8 h-8 text-blue-600 mr-2" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-tight">TARAMEDIC</h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium">Excellent Medical IT Partner</p>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">EMR</div>
            <NavItem icon={ClipboardList} label="Antrean Poli" />
            <NavItem icon={Users} label="Pasien" />
            <NavItem icon={Activity} label="Pemeriksaan" active />
            <NavItem icon={FileText} label="Laporan" />
          </nav>
        </div>
      </aside>

      {/* ==================== MAIN WRAPPER ==================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* ==================== TOPBAR ==================== */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center text-sm text-slate-600">
            <span className="font-medium text-slate-800">EMR</span>
            <span className="mx-2 text-slate-400">/</span>
            <span className="font-medium text-slate-800">Antrean Poli</span>
            <span className="mx-2 text-slate-400">/</span>
            <span>Pemeriksaan Perawat</span>
          </div>

          <div className="flex items-center space-x-6">
            <button className="flex items-center text-sm px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Monitor className="w-4 h-4 mr-2 text-slate-500" />
              Public Display
            </button>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-emerald-700 font-medium text-xs">Data tersinkronisasi</span>
            </div>
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-500 cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex items-center border-l border-slate-200 pl-6 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mr-3">AP</div>
              <div className="hidden md:block text-right mr-2">
                <div className="text-sm font-semibold text-slate-800">Admin Perawat</div>
                <div className="text-xs text-slate-500">Perawat Poli Anak</div>
              </div>
            </div>
          </div>
        </header>

        {/* ==================== MAIN SCROLLABLE CONTENT ==================== */}
        <main className="flex-1 overflow-auto bg-slate-50 relative flex flex-col">
          
          {/* --- PATIENT HEADER --- */}
          <div className="bg-white border-b border-slate-200 px-8 py-6 flex-shrink-0">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                  RA
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-slate-900">Rizka Amalia</h2>
                    <span className="text-pink-500">♀</span>
                    <span className="text-sm text-slate-500">Perempuan, 8 thn (02/03/2016)</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>RM-000036</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="font-medium text-emerald-600">BPJS Kesehatan (Aktif)</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> 0812-1234-5678</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke antrean
                </button>
                <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <History className="w-4 h-4 mr-2" /> Riwayat Pemeriksaan
                </button>
              </div>
            </div>

            {/* Quick Info Bar */}
            <div className="flex gap-12 text-sm">
              <div>
                <p className="text-slate-400 text-xs mb-1">No. Antrean</p>
                <p className="font-bold text-slate-800">A013</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Poli</p>
                <p className="font-bold text-slate-800">Poli Anak</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Dokter</p>
                <p className="font-bold text-slate-800">dr. Bima</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Waktu Daftar</p>
                <p className="font-bold text-slate-800">08:05 WIB</p>
              </div>
            </div>
          </div>

          {/* --- TABS --- */}
          <div className="bg-white border-b border-slate-200 px-8 flex-shrink-0">
            <div className="flex space-x-8">
              {['Ringkasan', 'Pemeriksaan Awal', 'Risiko / Skrining', 'CPPT', 'Dokumen'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* --- CONTENT SPLIT --- */}
          <div className="flex-1 flex p-8 gap-8 max-w-[1600px] mx-auto w-full pb-32">
            
            {/* LEFT COLUMN: FORM */}
            <div className="flex-1 space-y-6">
              
              {/* SECTION A: TANDA VITAL */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <SectionHeader letter="A" title="TANDA VITAL" />
                <div className="grid grid-cols-5 gap-4">
                  <InputWithUnit label="Tekanan Darah" defaultValue="120 / 80" unit="mmHg" />
                  <InputWithUnit label="Nadi" defaultValue="82" unit="x/menit" />
                  <InputWithUnit label="Respirasi" defaultValue="20" unit="x/menit" />
                  <InputWithUnit label="Suhu" defaultValue="36.7" unit="°C" />
                  <InputWithUnit label="SpO₂" defaultValue="98" unit="%" />
                </div>
              </div>

              {/* SECTION B & C */}
              <div className="grid grid-cols-2 gap-6">
                {/* SECTION B: KELUHAN UTAMA */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <SectionHeader letter="B" title="KELUHAN UTAMA" />
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase">Keluhan utama</label>
                      <input type="text" defaultValue="Demam sejak 2 hari, badan terasa lemas." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                    <div className="w-1/3">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase">Lama keluhan</label>
                      <input type="text" defaultValue="2 hari" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase">Skala Nyeri (NRS 0-10)</label>
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-800 leading-none">{painScale}</div>
                        <div className="text-[10px] text-slate-400">Ringan</div>
                      </div>
                    </div>
                    <input 
                      type="range" min="0" max="10" 
                      value={painScale} onChange={(e) => setPainScale(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                      <span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span>
                    </div>
                  </div>
                </div>

                {/* SECTION C & D */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <SectionHeader letter="C" title="KESADARAN" />
                    <div className="flex flex-wrap gap-2">
                      {['Compos Mentis', 'Apatis', 'Delirium', 'Somnolen', 'Sopor', 'Koma'].map(item => (
                         <Pill key={item} label={item} active={kesadaran === item} onClick={() => setKesadaran(item)} />
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <SectionHeader letter="D" title="RIWAYAT PENYAKIT" />
                    <div className="flex flex-wrap gap-2">
                      {['Hipertensi', 'Diabetes', 'Jantung', 'Asma', 'Stroke', 'Ginjal', 'Alergi', 'Lainnya'].map(item => (
                         <Pill key={item} label={item} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION E & F */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm col-span-1">
                  <SectionHeader letter="E" title="RIWAYAT ALERGI" />
                  <div className="flex gap-2">
                    <Pill label="Tidak ada alergi" active />
                    <Pill label="Ada alergi" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm col-span-2">
                  <SectionHeader letter="F" title="PEMERIKSAAN FISIK SINGKAT" />
                  <div className="relative">
                    <textarea 
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px] resize-none"
                      defaultValue="Keadaan umum baik. Konjungtiva anemis (-), sklera ikterik (-).&#10;Leher tidak ada pembesaran kelenjar.&#10;Thoraks simetris, suara napas vesikuler.&#10;Abdomen supel, tidak nyeri tekan, tidak ada massa.&#10;Ekstremitas teraba hangat, CRT < 2 detik."
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] text-slate-400">158 / 1000</div>
                  </div>
                </div>
              </div>

              {/* SECTION G: PEMERIKSAAN / PETA TUBUH (TELAH DIPERBAIKI) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-12">
                <div className="flex justify-between items-center mb-6">
                  <SectionHeader letter="G" title="PEMERIKSAAN / PETA TUBUH" />
                  <span className="text-[11px] text-slate-400">Klik pada gambar untuk menandai lokasi</span>
                </div>
                
                <div className="flex gap-8 items-start">
                  {/* Left Column: Tools & Input */}
                  <div className="w-[45%] flex flex-col gap-6">
                    
                    {/* Action Pills */}
                    <div className="flex flex-wrap gap-2.5">
                      <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 text-sm font-bold text-slate-800 bg-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Nyeri
                      </button>
                      <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Luka
                      </button>
                      <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Memar
                      </button>
                      <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <div className="w-3 h-3 rounded-full border-2 border-slate-300"></div> Bersihkan
                      </button>
                    </div>

                    {/* Annotations */}
                    <div className="mt-1">
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Lokasi yang ditandai</label>
                      <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white hover:border-blue-400 transition-colors cursor-default">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                          <span className="text-slate-700 font-medium">Abdomen kanan bawah</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-700 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Keterangan</label>
                      <div className="relative">
                        <textarea 
                          className="w-full border border-slate-200 rounded-lg p-3 text-sm text-slate-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-[72px]"
                          defaultValue="Nyeri tekan ringan"
                        />
                        <div className="absolute right-3 bottom-3 text-[10px] text-slate-400 font-medium">17 / 200</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Body Diagram Vectors */}
                  <div className="flex-1 flex justify-evenly items-center pl-4 border-l border-slate-100">
                    <div className="flex flex-col items-center">
                      <div className="relative w-48 h-[240px] flex items-center justify-center">
                        <BodyFrontSvg className="w-full h-full text-slate-300" />
                        {/* Red dot marker */}
                        <div className="absolute top-[52%] left-[48%] w-3 h-3 bg-red-500 rounded-full ring-[6px] ring-red-500/20"></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold tracking-[0.15em] mt-4">TAMPAK DEPAN</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="relative w-48 h-[240px] flex items-center justify-center">
                        <BodyBackSvg className="w-full h-full text-slate-300" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold tracking-[0.15em] mt-4">TAMPAK BELAKANG</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: SIDEBAR WIDGETS */}
            <div className="w-[340px] flex-shrink-0 space-y-6">
              
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">RINGKASAN KUNJUNGAN</h3>
                <div className="space-y-3">
                  <SummaryRow icon={ClipboardList} label="No. Antrian" value="A013" />
                  <SummaryRow icon={Clock} label="Waktu Daftar" value="08:05 WIB" />
                  <SummaryRow icon={HeartHandshake} label="Lokasi" value="Loket 1" />
                  <SummaryRow icon={Users} label="Penjamin" value="BPJS Kesehatan" />
                  <SummaryRow icon={FileText} label="Cara Bayar" value="BPJS" />
                  <SummaryRow icon={Activity} label="Keluhan Utama" value="Demam sejak 2 hari" />
                  <SummaryRow icon={Monitor} label="Status Terakhir" value="Pemeriksaan Perawat" />
                  <SummaryRow icon={FileText} label="Catatan Pendaftaran" value="Pasien datang sendiri" />
                </div>
              </div>

              <div className="bg-[#FFFDF5] rounded-xl border border-amber-100 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">PANGGILAN</h3>
                <div className="flex items-start gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <p className="text-sm text-slate-700">Pasien telah hadir dan siap diperiksa.</p>
                </div>
                <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                  <Volume2 className="w-4 h-4 mr-1.5" /> Panggilan selesai
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">CATATAN INTERNAL</h3>
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 mb-3">
                  <textarea 
                    className="w-full bg-transparent text-sm outline-none resize-none placeholder-slate-400 min-h-[60px]"
                    placeholder="Tulis catatan internal (tidak tampil di resume medis)"
                  />
                  <div className="text-right text-[10px] text-slate-400">0 / 500</div>
                </div>
                <button className="w-full flex items-center justify-center py-2 border border-slate-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-slate-50">
                  <Plus className="w-4 h-4 mr-1.5" /> Tambah Catatan
                </button>
              </div>

            </div>
          </div>
          
          {/* ==================== BOTTOM STICKY ACTION BAR ==================== */}
          <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-slate-200 p-4 px-8 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <button className="flex items-center px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Save className="w-4 h-4 mr-2" /> Simpan Draft
            </button>
            
            <div className="flex gap-3">
              <button className="px-5 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50">
                Simpan & Tetap di Halaman
              </button>
              <div className="flex flex-col items-end">
                <button className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm">
                  Selesaikan & Kirim ke Dokter <Send className="w-4 h-4 ml-2" />
                </button>
                <span className="text-[10px] text-slate-400 mt-1">Pastikan data sudah lengkap sebelum dikirim ke dokter.</span>
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

// ==================== REUSABLE SUB-COMPONENTS ====================

const NavItem = ({ icon: Icon, label, active = false }: any) => (
  <div className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer transition-colors mx-2 ${
    active ? 'bg-blue-50/60 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
  }`}>
    <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
    <span className="text-sm">{label}</span>
  </div>
);

const SectionHeader = ({ letter, title }: { letter: string, title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
      {letter}
    </div>
    <h3 className="font-bold text-slate-800 tracking-wide text-sm">{title}</h3>
  </div>
);

const InputWithUnit = ({ label, defaultValue, unit }: { label: string, defaultValue: string, unit: string }) => (
  <div>
    <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase">{label}</label>
    <div className="flex items-stretch border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white">
      <input type="text" defaultValue={defaultValue} className="w-full px-3 py-2 outline-none text-sm font-medium text-slate-800" />
      <div className="px-3 bg-slate-50 border-l border-slate-200 flex items-center text-xs text-slate-500 whitespace-nowrap">
        {unit}
      </div>
    </div>
  </div>
);

const Pill = ({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
      active 
        ? 'border-blue-600 bg-blue-50 text-blue-700' 
        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
    }`}
  >
    {label}
  </button>
);

const SummaryRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-start">
    <Icon className="w-4 h-4 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
    <div className="flex-1 flex justify-between gap-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800 text-right">{value}</span>
    </div>
  </div>
);

// ==================== SVG BODY OUTLINES (CUSTOM MADE FOR PETA TUBUH) ====================
// Ilustrasi sederhana yang mirip dengan anatomi medis di desain

const BodyFrontSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 250" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
    <path d="M50,15 C45,15 41,19 41,25 C41,30 44,34 46,36 C45,37 40,38 35,40 C30,42 26,48 24,55 C22,65 19,85 18,95 C17,100 21,102 24,98 C26,95 28,85 30,80 C31,90 31,100 32,105 C33,120 35,120 38,120 C38,135 35,170 33,195 C32,205 38,210 42,205 C44,200 45,185 47,165 C48,155 50,150 50,150 C50,150 52,155 53,165 C55,185 56,200 58,205 C62,210 68,205 67,195 C65,170 62,135 62,120 C65,120 67,120 68,105 C69,100 69,90 70,80 C72,85 74,95 76,98 C79,102 83,100 82,95 C81,85 78,65 76,55 C74,48 70,42 65,40 C60,38 55,37 54,36 C56,34 59,30 59,25 C59,19 55,15 50,15 Z" />
    <path d="M41 45 Q50 55 59 45" /> 
    <path d="M36 60 Q50 65 64 60" /> 
    <circle cx="50" cy="95" r="1.5" fill="currentColor" /> 
    <path d="M42 120 L50 130 L58 120" /> 
  </svg>
);

const BodyBackSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 250" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
    <path d="M50,15 C45,15 41,19 41,25 C41,30 44,34 46,36 C45,37 40,38 35,40 C30,42 26,48 24,55 C22,65 19,85 18,95 C17,100 21,102 24,98 C26,95 28,85 30,80 C31,90 31,100 32,105 C33,120 35,120 38,120 C38,135 35,170 33,195 C32,205 38,210 42,205 C44,200 45,185 47,165 C48,155 50,150 50,150 C50,150 52,155 53,165 C55,185 56,200 58,205 C62,210 68,205 67,195 C65,170 62,135 62,120 C65,120 67,120 68,105 C69,100 69,90 70,80 C72,85 74,95 76,98 C79,102 83,100 82,95 C81,85 78,65 76,55 C74,48 70,42 65,40 C60,38 55,37 54,36 C56,34 59,30 59,25 C59,19 55,15 50,15 Z" />
    <path d="M50 36 V 110" /> 
    <path d="M38 120 Q50 135 62 120" /> 
  </svg>
);