'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Clock, 
  ClipboardCheck, 
  Activity, 
  Bell, 
  Search, 
  Menu, 
  X, 
  HeartPulse,
  Stethoscope,
  LayoutDashboard,
  ClipboardList,
  FileText
} from 'lucide-react';

// --- KOMPONEN SIDEBAR KHUSUS PERAWAT ---
const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <>
    {isOpen && <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" />}
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 
      flex flex-col justify-between flex-shrink-0 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <img src="/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png" alt="Logo" className="h-10 w-auto object-contain" />
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">MENU PERAWAT</div>
          <div className="flex items-center px-4 py-2.5 rounded-lg bg-cyan-50 text-cyan-700 font-medium cursor-pointer mx-2">
            <LayoutDashboard className="w-5 h-5 mr-3 text-cyan-600" />
            <span className="text-sm">Dashboard</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <HeartPulse className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Asesmen Awal & TTV</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <ClipboardList className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Antrean Poli</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <Users className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Direktori Pasien</span>
          </div>
        </nav>
      </div>
      <div className="pb-4">
        <div className="px-6 text-xs text-slate-400 border-t border-slate-100 pt-4">
          <p>© 2026 Taramedic</p>
          <p>Role: Perawat Poli</p>
        </div>
      </div>
    </aside>
  </>
);

// --- KOMPONEN TOPBAR ---
const Topbar = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10 w-full">
    <div className="flex items-center space-x-3">
      <button onClick={onOpenSidebar} className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex items-center text-sm text-slate-600">
        <span className="hidden sm:inline font-medium text-slate-800">Portal</span>
        <span className="hidden sm:mx-2 sm:inline text-slate-400">/</span>
        <span className="font-semibold sm:font-normal text-slate-800">Dashboard Perawat</span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Bell className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </div>
      <div className="flex items-center border-l border-slate-200 pl-4">
        <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs mr-2">
          SR
        </div>
        <div className="hidden md:block text-right">
          <div className="text-sm font-semibold text-slate-800">Siti Rahma, A.Md.Kep</div>
          <div className="text-xs text-slate-500">Perawat Poli Anak</div>
        </div>
      </div>
    </div>
  </header>
);

// --- HALAMAN UTAMA DASHBOARD PERAWAT ---
export default function NurseDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Responsive */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Halo, Ners Siti! 👋</h1>
                <p className="text-teal-100 text-sm mt-1">Ada 6 pasien baru yang menunggu asesmen tanda-tanda vital (TTV) di ruang tunggu.</p>
              </div>
              <button className="bg-white text-teal-700 font-medium px-5 py-2.5 rounded-xl text-sm shadow-sm hover:bg-teal-50 transition-colors">
                Input Asesmen Baru
              </button>
            </div>
          </div>

          {/* Statistik Utama (Grid Responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Pasien Terdaftar</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">18 Orang</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Sudah Asesmen (TTV)</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">12 Orang</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Belum Asesmen</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">6 Orang</h3>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Rujukan Internal</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">1 Pasien</h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Bagian Bawah: Tabel Antrean Asesmen & Panel Cepat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tabel Antrean Masuk Poli (2 Kolom) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="font-bold text-slate-800">Antrean Masuk Screening & TTV</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    placeholder="Cari pasien / No. RM..." 
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-6">No. RM</th>
                      <th className="py-3 px-6">Nama Pasien</th>
                      <th className="py-3 px-6">Poli Tujuan</th>
                      <th className="py-3 px-6">Status TTV</th>
                      <th className="py-3 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-semibold text-slate-800">RM-00921</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Kenzie Alfarizqi</td>
                      <td className="py-3 px-6 text-slate-600">Poli Anak</td>
                      <td className="py-3 px-6"><span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">Belum Diperiksa</span></td>
                      <td className="py-3 px-6 text-right">
                        <button className="text-teal-700 hover:text-teal-800 font-medium text-xs bg-teal-50 px-3 py-1.5 rounded-lg transition-colors">Input TTV</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-semibold text-slate-800">RM-00922</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Zahra Aulia</td>
                      <td className="py-3 px-6 text-slate-600">Poli Anak</td>
                      <td className="py-3 px-6"><span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">Belum Diperiksa</span></td>
                      <td className="py-3 px-6 text-right">
                        <button className="text-teal-700 hover:text-teal-800 font-medium text-xs bg-teal-50 px-3 py-1.5 rounded-lg transition-colors">Input TTV</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-semibold text-slate-800">RM-00919</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Bagas Satria</td>
                      <td className="py-3 px-6 text-slate-600">Poli Anak</td>
                      <td className="py-3 px-6"><span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Selesai (Ke Dokter)</span></td>
                      <td className="py-3 px-6 text-right">
                        <button className="text-slate-400 font-medium text-xs bg-slate-100 px-3 py-1.5 rounded-lg">Lihat Detail</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Kanan: Pintasan & Catatan Perawat (1 Kolom) */}
            <div className="space-y-6">
              
              {/* Status Ruangan */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Informasi Poli</span>
                  <HeartPulse className="w-4 h-4 text-teal-600" />
                </h3>
                <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Ruang Pemeriksaan 3</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">Dokter: dr. Andi Pratama, Sp.A</p>
                  <p className="text-xs text-slate-500 mt-1">Kapasitas Ruang Tunggu: 12/15 Orang</p>
                </div>
              </div>

              {/* Pengingat / Tugas Cepat */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4">Catatan Tugas Shift</h3>
                <div className="space-y-3 text-sm">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 rounded text-teal-600 focus:ring-teal-500" defaultChecked />
                    <span className="text-slate-600 line-through">Persiapan alat tensi dan termometer digital shift pagi</span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 rounded text-teal-600 focus:ring-teal-500" />
                    <span className="text-slate-800">Sterilisasi alat medis ruang periksa setelah sesi 1</span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 rounded text-teal-600 focus:ring-teal-500" />
                    <span className="text-slate-800">Rekapitulasi jumlah pasien harian sebelum pukul 14.00</span>
                  </label>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}