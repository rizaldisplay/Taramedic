/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
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
  href: string;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  subItems?: SubNavItem[];
  onNavClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  label, 
  href,
  subItems,
  onNavClick
}) => {
  const pathname = usePathname();
  const hasSubItems = subItems && subItems.length > 0;

  // Cek apakah halaman saat ini cocok dengan href menu utama
  const isParentActive = href ? pathname === href : false;

  // Cek apakah salah satu sub-item cocok dengan pathname saat ini
  const isChildActive = hasSubItems 
    ? subItems.some((sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`))
    : false;

  const isActive = isParentActive || isChildActive;

  // Otomatis buka accordion jika anak menu sedang aktif
  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  const handleParentClick = () => {
    if (hasSubItems) {
      setIsOpen(!isOpen);
    } else if (onNavClick) {
      onNavClick();
    }
  };

  // Wrapper untuk render sebagai Link atau Div biasa (jika ber-submenu)
  const ParentContent = (
    <div
      onClick={handleParentClick}
      className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-colors mx-2 ${
        isActive
          ? 'bg-cyan-50 text-cyan-700 font-medium' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center min-w-0">
        <Icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
        <span className="text-sm truncate">{label}</span>
      </div>
      
      {hasSubItems && (
        <ChevronDown 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col mb-1">
      {/* Menu Utama (Jika tidak punya submenu, bungkus pakai Link) */}
      {!hasSubItems && href ? (
        <Link href={href} passHref>
          {ParentContent}
        </Link>
      ) : (
        ParentContent
      )}

      {/* Dropdown Sub-menu */}
      {hasSubItems && (
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 mx-2">
            {subItems.map((sub, index) => {
              const isSubActive = pathname === sub.href || pathname.startsWith(`${sub.href}/`);
              
              return (
                <Link key={index} href={sub.href} passHref>
                  <div
                    onClick={onNavClick}
                    className={`flex items-center pl-11 pr-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      isSubActive 
                        ? 'bg-cyan-50 text-cyan-700 font-medium' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mr-2.5 shrink-0 ${isSubActive ? 'bg-cyan-500' : 'bg-slate-300'}`} />
                    <span className="text-sm truncate">{sub.label}</span>
                  </div>
                </Link>
              );
            })}
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
      await dispatch(logoutUser()).unwrap(); 
      router.push('/login');
    } catch (error) {
      console.error('Gagal melakukan logout:', error);
      router.push('/login');
    }
  };

  return (
    <>
      {/* Overlay Mobile */}
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Header Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 sticky top-0 bg-white z-10">
            <Link href="/dashboard">
              <img
                src="/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png"
                alt="Logo Taramedic"
                className="h-10 w-auto object-contain cursor-pointer"
              />
            </Link>
            <button 
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Menu Utama
            </div>
            
            <NavItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              href="/dashboard" 
              onNavClick={onClose} 
            />

            <NavItem icon={Users} label="Pendaftaran" href="/pendaftaran" onNavClick={onClose} />
            
            <NavItem 
              icon={ClipboardList} 
              label="Antrean" 
              subItems={[
                { label: 'Poli', href: '/antrean/poli' },
                { label: 'Farmasi', href: '/antrean/farmasi' },
                { label: 'Kasir', href: '/antrean/kasir' },
                { label: 'Mesin Antrean', href: '/kiosq-pendaftaran' }
              ]}
              onNavClick={onClose}
            />
            
            <NavItem 
              icon={Activity} 
              label="EMR" 
              subItems={[
                { label: 'Perawat', href: '/emr/perawat' },
                { label: 'Dokter', href: '/emr/dokter' }
              ]}
              onNavClick={onClose}
            />

            <NavItem icon={Pill} label="Farmasi" href="/farmasi" onNavClick={onClose} />
            <NavItem icon={Calculator} label="Kasir" href="/kasir" onNavClick={onClose} />
            <NavItem icon={FileText} label="Laporan" href="/laporan" onNavClick={onClose} />

            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-6">
              Sistem
            </div>

            <NavItem 
              icon={Database} 
              label="Masterdata" 
              subItems={[
                { label: 'Pasien', href: '/masterdata/pasien' },
                { label: 'SDMK', href: '/masterdata/sdmk' },
                { label: 'Fasyankes & Organisasi', href: '/masterdata/fasyankes-organisasi' },
                { label: 'Unit & Poli', href: '/masterdata/unit-poli' },
                { label: 'Layanan & Tindakan', href: '/masterdata/layanan-tindakan' },
                { label: 'Diagnosis (ICD-10)', href: '/masterdata/diagnosis' },
                { label: 'Obat & Alkes (KFA)', href: '/masterdata/obat-alkes' },
                { label: 'Penjamin', href: '/masterdata/penjamin' },
                { label: 'BPJS', href: '/masterdata/bpjs' },
                { label: 'Wilayah', href: '/masterdata/wilayah' },
                { label: 'Terminologi & Mapping', href: '/masterdata/terminologi' },
              ]}
              onNavClick={onClose}
            />

            <NavItem icon={Settings} label="Settings" href="/settings" onNavClick={onClose} />
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="pb-4 shrink-0 bg-white border-t border-slate-100 pt-3">
          <div className="mb-2">
            <div
              onClick={handleLogout}
              className="flex items-center px-4 py-2.5 rounded-lg cursor-pointer transition-colors mx-2 text-slate-600 hover:bg-red-50 hover:text-red-600 group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:text-red-500 text-slate-400 transition-colors shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </div>
          </div>

          <div className="px-6 text-xs text-slate-400">
            <p>© 2026 Taramedic</p>
            <p className="text-[10px]">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};