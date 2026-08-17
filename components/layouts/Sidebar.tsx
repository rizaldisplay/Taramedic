'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
// Sesuaikan path import ini dengan lokasi file slice kamu dan store kamu
import { logoutUser } from '@/features/auth/authSlice'; 
import { AppDispatch } from '@/store'; // (Opsional) Jika kamu mengatur tipe dispatch di store

import {
  ClipboardList,
  Users,
  Activity,
  FileText,
  Calculator,
  LayoutDashboard,
  Pill,
  Database,
  Settings,
  LogOut,
  X
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer transition-colors mx-2 ${
      active 
        ? 'bg-cyan-50 text-cyan-700 font-medium' 
        : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    <Icon className={`w-5 h-5 mr-3 ${active ? 'text-cyan-600' : 'text-slate-400'}`} />
    <span className="text-sm">{label}</span>
  </div>
);

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log('Mengeksekusi proses logout...');
      // Memanggil thunk logoutUser dari Redux
      await dispatch(logoutUser()).unwrap(); 
      
      // Redirect ke halaman login setelah state dan cookie dibersihkan
      router.push('/login');
    } catch (error) {
      console.error('Gagal melakukan logout:', error);
      // Fallback: Tetap arahkan ke login dan bersihkan state meskipun API gagal
      router.push('/login');
    }
  };

  return (
    <>
      {/* Backdrop / Overlay gelap untuk mode Mobile saat drawer terbuka */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Konten Utama Sidebar (Drawer di Mobile, Sticky di Desktop) */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-slate-200 
          flex flex-col justify-between flex-shrink-0 min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div>
          {/* Header Logo & Tombol Close (Khusus Drawer Mobile) */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <img
              src="/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png"
              alt="Logo Taramedic"
              className="h-10 w-auto object-contain"
            />
            <button 
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Navigasi Utama (Otomatis menutup drawer saat menu diklik di mobile) */}
          <nav className="p-4 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">EMR</div>
            <NavItem icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
            <NavItem icon={ClipboardList} label="Antrean Poli" active onClick={onClose} />
            <NavItem icon={Activity} label="Pemeriksaan" onClick={onClose} />
            <NavItem icon={Users} label="Pasien" onClick={onClose} />
            <NavItem icon={Pill} label="Farmasi" onClick={onClose} />
            <NavItem icon={Calculator} label="Kasir" onClick={onClose} />
            <NavItem icon={FileText} label="Laporan" onClick={onClose} />

            {/* Grouping Sistem */}
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-6">Sistem</div>
            <NavItem icon={Database} label="Masterdata" onClick={onClose} />
            <NavItem icon={Settings} label="Settings" onClick={onClose} />
          </nav>
        </div>

        {/* Bagian Bawah Sidebar (Logout & Footer) */}
        <div className="pb-4">
          <div className="mb-4">
            <div
              onClick={handleLogout}
              className="flex items-center px-4 py-2.5 rounded-lg cursor-pointer transition-colors mx-2 text-slate-600 hover:bg-red-50 hover:text-red-600 group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:text-red-500 text-slate-400 transition-colors" />
              <span className="text-sm font-medium">Logout</span>
            </div>
          </div>

          <div className="px-6 text-xs text-slate-400 border-t border-slate-100 pt-4">
            <p>© 2026 Taramedic</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};