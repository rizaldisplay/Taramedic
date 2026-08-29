'use client';

import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Building2, 
  TrendingUp, 
  Bell, 
  Search, 
  Menu, 
  X, 
  LayoutDashboard,
  ClipboardList,
  Database,
  Settings,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

// --- KOMPONEN SIDEBAR KHUSUS ADMIN ---
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
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">MENU UTAMA</div>
          <div className="flex items-center px-4 py-2.5 rounded-lg bg-cyan-50 text-cyan-700 font-medium cursor-pointer mx-2">
            <LayoutDashboard className="w-5 h-5 mr-3 text-cyan-600" />
            <span className="text-sm">Dashboard Admin</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <ClipboardList className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Monitoring Operasional</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <Users className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Manajemen Pengguna</span>
          </div>

          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-6">SISTEM & MASTER</div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <Database className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Master Data Klinik</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <Settings className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Pengaturan Sistem</span>
          </div>
        </nav>
      </div>
      <div className="pb-4">
        <div className="px-6 text-xs text-slate-400 border-t border-slate-100 pt-4">
          <p>© 2026 Taramedic</p>
          <p>Role: Administrator Sistem</p>
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
        <span className="font-semibold sm:font-normal text-slate-800">Dashboard Admin</span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Bell className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </div>
      <div className="flex items-center border-l border-slate-200 pl-4">
        <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs mr-2">
          AD
        </div>
        <div className="hidden md:block text-right">
          <div className="text-sm font-semibold text-slate-800">Admin Taramedic</div>
          <div className="text-xs text-slate-500">IT & Operational Manager</div>
        </div>
      </div>
    </div>
  </header>
);

// --- HALAMAN UTAMA DASHBOARD ADMIN ---
export default function AdminDashboard() {
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
          <div className="bg-gradient-to-r from-slate-800 to-cyan-900 rounded-2xl p-6 text-white mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Panel Kontrol Utama Klinik 🏥</h1>
                <p className="text-slate-300 text-sm mt-1">Semua sistem modul EMR, Kasir, dan Antrean hari ini berjalan normal dan tersinkronisasi.</p>
              </div>
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm shadow-sm transition-colors">
                Unduh Laporan Harian
              </button>
            </div>
          </div>

          {/* Statistik Utama (Grid Responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Total Kunjungan Hari Ini</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">128 Pasien</h3>
              </div>
              <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Pendapatan Kasir</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">Rp 14.5 Juta</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Poli Aktif Berjalan</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">6 Poli</h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Status Server</p>
                <h3 className="text-2xl font-bold text-emerald-600 mt-1">Optimal</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Bagian Bawah: Log Aktivitas Staf & Pengaturan Masterdata */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tabel Log Aktivitas Terbaru (2 Kolom) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="font-bold text-slate-800">Aktivitas & Kinerja Modul Klinik</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    placeholder="Cari aktivitas / user..." 
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-6">Waktu</th>
                      <th className="py-3 px-6">Pengguna</th>
                      <th className="py-3 px-6">Modul / Tindakan</th>
                      <th className="py-3 px-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 text-slate-500 text-xs">19:12 WIB</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Fauzan (Apoteker)</td>
                      <td className="py-3 px-6">Dispensing Resep #RSP-8821</td>
                      <td className="py-3 px-6 text-right"><span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Sukses</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 text-slate-500 text-xs">19:05 WIB</td>
                      <td className="py-3 px-6 font-medium text-slate-800">dr. Andi Pratama</td>
                      <td className="py-3 px-6">Simpan Rekam Medis EMR Pasien</td>
                      <td className="py-3 px-6 text-right"><span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Sukses</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 text-slate-500 text-xs">18:50 WIB</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Siti Rahma (Perawat)</td>
                      <td className="py-3 px-6">Input TTV Pasien #RM-00921</td>
                      <td className="py-3 px-6 text-right"><span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Sukses</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Kanan: Pintasan Administrasi & Info Sistem (1 Kolom) */}
            <div className="space-y-6">
              
              {/* Kontrol Cepat Masterdata */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4">Pintasan Kelola Sistem</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2.5 bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-between">
                    <span>Tambah Data Dokter Baru</span>
                    <span className="text-xs text-slate-400">→</span>
                  </button>
                  <button className="w-full text-left px-4 py-2.5 bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-between">
                    <span>Kelola Tarif Layanan & Poli</span>
                    <span className="text-xs text-slate-400">→</span>
                  </button>
                  <button className="w-full text-left px-4 py-2.5 bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-between">
                    <span>Backup Database Otomatis</span>
                    <span className="text-xs text-slate-400">→</span>
                  </button>
                </div>
              </div>

              {/* Status Keamanan & Lisensi */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-3">Informasi Lisensi</h3>
                <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-100 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status SaaS:</span>
                    <span className="font-semibold text-cyan-800">Aktif (Enterprise)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Masa Berlaku:</span>
                    <span className="font-semibold text-slate-800">Desember 2026</span>
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