'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
// Sesuaikan path import ini dengan lokasi file slice kamu dan store kamu
import { logoutUser } from '@/features/auth/authSlice'; 
import { AppDispatch } from '@/store'; 

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
  X,
  ChevronDown
} from 'lucide-react';

interface SubNavItem {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  defaultOpen?: boolean;
  onClick?: () => void;
  subItems?: SubNavItem[];
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  label, 
  active = false, 
  defaultOpen = false,
  onClick, 
  subItems 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasSubItems = subItems && subItems.length > 0;

  const handleParentClick = () => {
    if (hasSubItems) {
      setIsOpen(!isOpen);
    }
    if (onClick && !hasSubItems) {
      onClick();
    }
  };

  return (
    <div className="flex flex-col mb-1">
      {/* Menu Utama */}
      <div
        onClick={handleParentClick}
        className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-colors mx-2 ${
          active && !hasSubItems
            ? 'bg-cyan-50 text-cyan-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center">
          <Icon className={`w-5 h-5 mr-3 ${active && !hasSubItems ? 'text-cyan-600' : 'text-slate-400'}`} />
          <span className={`text-sm ${active && hasSubItems ? 'font-medium text-slate-800' : ''}`}>
            {label}
          </span>
        </div>
        
        {/* Indikator Dropdown jika ada sub menu */}
        {hasSubItems && (
          <ChevronDown 
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </div>

      {/* Sub Menu */}
      {hasSubItems && (
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 mx-2">
            {subItems.map((sub, index) => (
              <div
                key={index}
                onClick={sub.onClick}
                className={`flex items-center pl-11 pr-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  sub.active 
                    ? 'bg-cyan-50 text-cyan-700 font-medium' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mr-2.5 ${sub.active ? 'bg-cyan-500' : 'bg-slate-300'}`} />
                <span className="text-sm">{sub.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
      await dispatch(logoutUser()).unwrap(); 
      router.push('/login');
    } catch (error) {
      console.error('Gagal melakukan logout:', error);
      router.push('/login');
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
        />
      )}

      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-slate-200 
          flex flex-col justify-between flex-shrink-0 min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 sticky top-0 bg-white z-10">
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

          <nav className="p-4 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Menu Utama</div>
            <NavItem icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
            
            {/* Menu Antrean dengan Sub Menu */}
            <NavItem 
              icon={ClipboardList} 
              label="Antrean" 
              active={true}
              defaultOpen={true}
              subItems={[
                { label: 'Poli', active: true, onClick: onClose },
                { label: 'Farmasi', active: false, onClick: onClose },
                { label: 'Kasir', active: false, onClick: onClose }
              ]}
            />
            
            <NavItem 
              icon={Activity} 
              label="EMR" 
              active={false}
              defaultOpen={true}
              subItems={[
                { label: 'Perawat', active: true, onClick: onClose },
                { label: 'Dokter', active: false, onClick: onClose }
              ]}
            />

            <NavItem icon={Users} label="Pendaftaran" onClick={onClose} />
            <NavItem icon={Pill} label="Farmasi" onClick={onClose} />
            <NavItem icon={Calculator} label="Kasir" onClick={onClose} />
            <NavItem icon={FileText} label="Laporan" onClick={onClose} />

            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-6">Sistem</div>
            <NavItem icon={Database} label="Masterdata" onClick={onClose} />
            <NavItem icon={Settings} label="Settings" onClick={onClose} />
          </nav>
        </div>

        <div className="pb-4 shrink-0 bg-white">
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