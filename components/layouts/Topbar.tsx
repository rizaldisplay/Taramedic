/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useEffect, useState } from 'react';
import {
  Bell,
  Calendar,
  ChevronDown,
  Clock,
  Maximize2,
  Menu,
  Minimize2,
  Moon,
  Sun,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface TopbarProps {
  onOpenSidebar: () => void;
  moduleName?: string;
  pageName?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenSidebar,
  moduleName = 'EMR',
  pageName = 'Dashboard',
}) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
    // Cek preferensi tema tersimpan di localStorage atau sistem pengguna
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const isDark =
      savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);

    // Pantau perubahan preferensi tema sistem jika belum diset manual
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  const handleToggleTheme = () => {
    // Aktifkan kelas penanda transisi halus sementara
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    window.clearTimeout(
      (window as unknown as { _themeTimer?: number })._themeTimer,
    );
    (window as unknown as { _themeTimer?: number })._themeTimer =
      window.setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 400);

    const applyThemeChange = () => {
      setIsDarkMode((prev) => {
        const next = !prev;
        root.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
        return next;
      });
    };

    // Gunakan View Transitions API jika didukung oleh browser
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(() => {
        applyThemeChange();
      });
    } else {
      applyThemeChange();
    }
  };

  const formatDateLabel = (date: Date) => {
    const dayName = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
    }).format(date);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(
      date,
    );
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  const formatTimeLabel = (date: Date) => {
    const time = date
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/\./g, ':');

    return `${time} WIB`;
  };

  const getInitials = (name?: string, email?: string) => {
    const source = name?.trim() || email?.trim() || '';
    if (!source) return 'AK';
    const parts = source.split(/[\s@._-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return source.substring(0, 2).toUpperCase();
  };

  const formatRoles = (roles?: string[]) => {
    if (!roles || roles.length === 0) return 'Superadmin';
    return roles
      .map((role) =>
        role
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      )
      .join(', ');
  };

  const primaryRoleLabel = formatRoles(user?.roles);
  const secondaryLabel =
    user?.email || user?.name || 'info@taramedic.id';

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10 w-full font-sans transition-colors duration-200">
      {/* Kiri: Tombol Hamburger & Breadcrumb Dinamis */}
      <div className="flex items-center space-x-3 truncate mr-2">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0f3d56] dark:hover:text-cyan-400 transition-colors flex-shrink-0 cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center text-xs sm:text-sm text-slate-600 dark:text-slate-300 truncate">
          <span className="hidden sm:inline font-bold text-[#0f3d56] dark:text-cyan-400">
            {moduleName}
          </span>
          <span className="hidden sm:mx-2 sm:inline text-slate-300 dark:text-slate-600">
            /
          </span>
          <span className="font-semibold text-slate-600 dark:text-slate-200 truncate">
            {pageName}
          </span>
        </div>
      </div>

      {/* Kanan: Tanggal & Jam, Mode Gelap, Fullscreen, Notifikasi & Profil */}
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-5">
        {/* Tanggal & Waktu Real-Time */}
        <div className="hidden xl:flex items-center text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 tabular-nums">
          <Calendar className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <span className="whitespace-nowrap">
            {currentTime ? formatDateLabel(currentTime) : 'Memuat tanggal...'}
          </span>

          <span className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-4 flex-shrink-0" />

          <Clock className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <span className="whitespace-nowrap min-w-[78px]">
            {currentTime ? formatTimeLabel(currentTime) : '--:--:-- WIB'}
          </span>
        </div>

        {/* Ikon Tema & Fullscreen */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label={
              mounted && isDarkMode
                ? 'Beralih ke mode terang'
                : 'Beralih ke mode gelap'
            }
            title={
              mounted && isDarkMode
                ? 'Beralih ke Mode Terang'
                : 'Beralih ke Mode Gelap'
            }
            className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0f3d56] dark:hover:text-cyan-400 transition-colors duration-200 cursor-pointer overflow-hidden flex items-center justify-center w-8 h-8"
          >
            <Sun
              className={`w-4 h-4 text-amber-500 hover:text-amber-400 absolute transition-all duration-300 transform ${
                mounted && isDarkMode
                  ? 'rotate-0 scale-100 opacity-100'
                  : 'rotate-90 scale-0 opacity-0 pointer-events-none'
              }`}
            />
            <Moon
              className={`w-4 h-4 text-slate-600 dark:text-slate-400 absolute transition-all duration-300 transform ${
                mounted && isDarkMode
                  ? '-rotate-90 scale-0 opacity-0 pointer-events-none'
                  : 'rotate-0 scale-100 opacity-100'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label="Layar penuh"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            className="hidden sm:inline-flex p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0f3d56] dark:hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Pemisah Vertikal & Notifikasi */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <span className="hidden md:inline-block h-4 w-px bg-slate-200 dark:bg-slate-700" />

          <button
            type="button"
            aria-label="Notifikasi"
            className="relative p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0f3d56] dark:hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* Profil User Dinamis */}
        <div className="flex items-center pl-1 md:pl-2 cursor-pointer flex-shrink-0 group">
          <div className="w-9 h-9 rounded-full bg-[#008ba6] dark:bg-cyan-600 text-white flex items-center justify-center font-extrabold text-xs md:mr-3 flex-shrink-0 transition-transform group-hover:scale-105 shadow-sm">
            {getInitials(user?.name, user?.email)}
          </div>

          <div className="hidden md:block text-left mr-2.5 leading-tight">
            <div className="text-xs font-extrabold text-[#0f3d56] dark:text-slate-100">
              {primaryRoleLabel} &middot; {secondaryLabel}
            </div>
            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-0.5">
              {primaryRoleLabel}
            </div>
          </div>

          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-400 hidden md:block group-hover:text-[#008ba6] dark:group-hover:text-cyan-400 transition-colors" />
        </div>
      </div>
    </header>
  );
};