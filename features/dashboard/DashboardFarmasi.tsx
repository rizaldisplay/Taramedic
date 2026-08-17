'use client';

import React, { useState } from 'react';
import { 
  Pill, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Bell, 
  Search, 
  Menu, 
  X, 
  PackageCheck,
  LayoutDashboard,
  ClipboardList,
  Database,
  FileText
} from 'lucide-react';

// --- KOMPONEN SIDEBAR KHUSUS FARMASI ---
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
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">MENU FARMASI</div>
          <div className="flex items-center px-4 py-2.5 rounded-lg bg-cyan-50 text-cyan-700 font-medium cursor-pointer mx-2">
            <LayoutDashboard className="w-5 h-5 mr-3 text-cyan-600" />
            <span className="text-sm">Dashboard</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <ClipboardList className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Antrean Resep Masuk</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <Pill className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Dispensing & Racik</span>
          </div>
          <div className="flex items-center px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer mx-2">
            <Database className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Stok & Inventaris Obat</span>
          </div>
        </nav>
      </div>
      <div className="pb-4">
        <div className="px-6 text-xs text-slate-400 border-t border-slate-100 pt-4">
          <p>© 2026 Taramedic</p>
          <p>Role: Apoteker / Farmasi</p>
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
        <span className="font-semibold sm:font-normal text-slate-800">Dashboard Farmasi</span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Bell className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </div>
      <div className="flex items-center border-l border-slate-200 pl-4">
        <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs mr-2">
          FA
        </div>
        <div className="hidden md:block text-right">
          <div className="text-sm font-semibold text-slate-800">Fauzan, S.Farm., Apt</div>
          <div className="text-xs text-slate-500">Kepala Instalasi Farmasi</div>
        </div>
      </div>
    </div>
  </header>
);

// --- HALAMAN UTAMA DASHBOARD FARMASI ---
export default function PharmacyDashboard() {
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
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Halo, Apoteker Fauzan! 👋</h1>
                <p className="text-blue-100 text-sm mt-1">Ada 5 resep elektronik baru dari dokter yang belum diproses dan 2 item obat menipis.</p>
              </div>
              <button className="bg-white text-blue-700 font-medium px-5 py-2.5 rounded-xl text-sm shadow-sm hover:bg-blue-50 transition-colors">
                Proses Antrean Resep
              </button>
            </div>
          </div>

          {/* Statistik Utama (Grid Responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Resep Masuk</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">19 Resep</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Pill className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Sedang Diracik</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">5 Resep</h3>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Siap / Selesai</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">14 Resep</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Stok Menipis</p>
                <h3 className="text-2xl font-bold text-red-600 mt-1">2 Item</h3>
              </div>
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Bagian Bawah: Antrean Resep & Peringatan Stok Obat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tabel Antrean Resep Masuk (2 Kolom) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="font-bold text-slate-800">Live Antrean Resep Elektronik</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    placeholder="Cari pasien / No. Resep..." 
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-6">No. Resep</th>
                      <th className="py-3 px-6">Nama Pasien</th>
                      <th className="py-3 px-6">Dokter Pengirim</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-semibold text-slate-800">RSP-8821</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Muhammad Al Fatih</td>
                      <td className="py-3 px-6 text-slate-600">dr. Andi Pratama, Sp.A</td>
                      <td className="py-3 px-6"><span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">Sedang Diracik</span></td>
                      <td className="py-3 px-6 text-right">
                        <button className="text-blue-700 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Selesaikan</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-semibold text-slate-800">RSP-8822</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Nayla Putri Az-Zahra</td>
                      <td className="py-3 px-6 text-slate-600">dr. Andi Pratama, Sp.A</td>
                      <td className="py-3 px-6"><span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">Resep Masuk</span></td>
                      <td className="py-3 px-6 text-right">
                        <button className="text-blue-700 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Mulai Racik</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-semibold text-slate-800">RSP-8820</td>
                      <td className="py-3 px-6 font-medium text-slate-800">Keanu Reeves</td>
                      <td className="py-3 px-6 text-slate-600">dr. Siska, Sp.PD</td>
                      <td className="py-3 px-6"><span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Siap Diambil</span></td>
                      <td className="py-3 px-6 text-right">
                        <button className="text-slate-500 font-medium text-xs bg-slate-100 px-3 py-1.5 rounded-lg">Serah Terima</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Kanan: Peringatan Stok Obat Menipis (1 Kolom) */}
            <div className="space-y-6">
              
              {/* Peringatan Stok Menipis */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Peringatan Stok Menipis</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-red-700">Paracetamol Syrup 60ml</span>
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">Sisa 4 Botol</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Batas minimum sistem: 10 botol</p>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-amber-700">Amoxicillin 500mg Tab</span>
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Sisa 15 Strip</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Batas minimum sistem: 20 strip</p>
                  </div>
                </div>
              </div>

              {/* Status Apotek */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-3">Informasi Shift</h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shift Petugas:</span>
                    <span className="font-semibold text-slate-800">Pagi (08:00 - 15:00)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Resep Hari Ini:</span>
                    <span className="font-semibold text-slate-800">42 Resep</span>
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