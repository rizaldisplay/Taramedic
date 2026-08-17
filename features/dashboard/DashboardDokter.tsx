'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Calendar, 
  FileText, 
  Bell, 
  ChevronRight, 
  Search,
  Activity,
  Menu,
  X,
  Stethoscope,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  Pill,
  Calculator,
  Database,
  Settings,
  Monitor
} from 'lucide-react';

// --- KOMPONEN SIDEBAR ---
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
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">MENU DOKTER</div>
          <div className="flex items-center px-4 py-2.5 rounded-lg bg-cyan-50 text-cyan-700 font-medium cursor-pointer mx-2">
            <LayoutDashboard className="w-5 h-5 mr-3 text-cyan-600" />
            <span className="text-sm">Dashboard</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <ClipboardList className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Antrean Pasien Poli</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <Stethoscope className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Rekam Medis (EMR)</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <FileText className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Hasil Lab & Radiologi</span>
          </div>
        </nav>
      </div>
      <div className="pb-4">
        <div className="px-6 text-xs text-slate-400 border-t border-slate-100 pt-4">
          <p>© 2026 Taramedic</p>
          <p>Role: Dokter Spesialis</p>
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
        <span className="font-semibold sm:font-normal text-slate-800">Dashboard Dokter</span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Bell className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </div>
      <div className="flex items-center border-l border-slate-200 pl-4">
        <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs mr-2">
          dr
        </div>
        <div className="hidden md:block text-right">
          <div className="text-sm font-semibold text-slate-800">dr. Andi Pratama, Sp.A</div>
          <div className="text-xs text-slate-500">Poli Anak</div>
        </div>
      </div>
    </div>
  </header>
);

// --- HALAMAN UTAMA DASHBOARD DOKTER ---
export default function DoctorDashboard() {
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
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Selamat Pagi, dr. Andi! 👋</h1>
                <p className="text-cyan-100 text-sm mt-1">Anda memiliki 14 antrean pasien hari ini di Poli Anak. 3 pasien sedang menunggu pemeriksaan.</p>
              </div>
              <button className="bg-white text-cyan-700 font-medium px-5 py-2.5 rounded-xl text-sm shadow-sm hover:bg-cyan-50 transition-colors">
                Mulai Periksa Pasien Berikutnya
              </button>
            </div>
          </div>

          {/* Statistik Utama (Grid Responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Total Antrean Hari Ini</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">14 Pasien</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Sudah Dilayani</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">9 Pasien</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Sisa Antrean</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">5 Pasien</h3>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Hasil Lab Keluar</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">2 Baru</h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Bagian Bawah: Tabel Antrean & Jadwal / Notifikasi */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tabel Antrean Pasien (Mengambil 2 Kolom di Layar Besar) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="font-bold text-slate-800">Live Antrean Pasien Poli Anak</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    placeholder="Cari nama / No. RM..." 
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-6">No. Antrean</th>
                      <th className="py-3 px-6">Nama Pasien</th>
                      <th className="py-3 px-6">Penjamin</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-semibold text-slate-800">A-010</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Muhammad Al Fatih</td>
                      <td className="py-3 px-6"><span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">BPJS</span></td>
                      <td className="py-3 px-6"><span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Sedang Diperiksa</span></td>
                      <td className="py-3 px-6 text-right">
                        <button className="text-cyan-600 hover:text-cyan-700 font-medium text-xs bg-cyan-50 px-3 py-1.5 rounded-lg transition-colors">Buka EMR</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-semibold text-slate-800">A-011</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Nayla Putri Az-Zahra</td>
                      <td className="py-3 px-6"><span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">Umum / Pribadi</span></td>
                      <td className="py-3 px-6"><span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">Menunggu</span></td>
                      <td className="py-3 px-6 text-right">
                        <button className="text-slate-600 hover:text-cyan-700 font-medium text-xs bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">Panggil</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-semibold text-slate-800">A-012</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Keanu Reeves Wijaya</td>
                      <td className="py-3 px-6"><span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">BPJS</span></td>
                      <td className="py-3 px-6"><span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">Dalam Antrean</span></td>
                      <td className="py-3 px-6 text-right">
                        <button className="text-slate-400 font-medium text-xs bg-slate-50 px-3 py-1.5 rounded-lg cursor-not-allowed" disabled>Menunggu</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Kanan: Info Jadwal & Notifikasi Laboratorium (1 Kolom) */}
            <div className="space-y-6">
              
              {/* Jadwal Praktik Hari Ini */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Jadwal Praktik</span>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </h3>
                <div className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">Poli Anak - Ruang 3</span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">08:00 - 14:00 WIB</p>
                  <p className="text-xs text-slate-500 mt-1">Status: Aktif Melayani</p>
                </div>
              </div>

              {/* Notifikasi / Update Hasil Penunjang */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4">Hasil Lab Terbaru</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>10 menit lalu</span>
                      <span className="text-emerald-600 font-medium">Normal</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800">Cek Darah Lengkap - M. Al Fatih</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>35 menit lalu</span>
                      <span className="text-amber-600 font-medium">Perlu Perhatian</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800">Tes Urin - Nayla Putri</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}