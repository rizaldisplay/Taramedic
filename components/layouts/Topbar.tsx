"use client";

import React, { useState, useEffect } from "react";
import { Monitor, Clock, Bell, ChevronDown, Menu } from "lucide-react";

interface TopbarProps {
  onOpenSidebar: () => void;
  // Tambahkan props baru untuk breadcrumb/judul halaman
  moduleName?: string;
  pageName?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenSidebar,
  moduleName = "EMR", // Nilai default jika tidak diisi
  pageName = "Dashboard", // Nilai default jika tidak diisi
}) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const dayName = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
    }).format(date);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
      date,
    );
    const year = date.getFullYear();

    const time = date
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\./g, ":");

    return `${dayName}, ${day} ${month} ${year} ${time} WIB`;
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10 w-full">
      {/* Kiri: Tombol Hamburger & Breadcrumb Dinamis */}
      <div className="flex items-center space-x-3 truncate mr-2">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center text-sm text-slate-600 truncate">
          {/* Tampilkan moduleName secara dinamis */}
          <span className="hidden sm:inline font-medium text-slate-800">
            {moduleName}
          </span>
          <span className="hidden sm:mx-2 sm:inline text-slate-400">/</span>
          {/* Tampilkan pageName secara dinamis */}
          <span className="font-semibold sm:font-normal text-slate-800 sm:text-slate-600 truncate">
            {pageName}
          </span>
        </div>
      </div>

      {/* Kanan: Fitur, Status, Waktu, Notifikasi & Profil */}
      <div className="flex items-center space-x-3 md:space-x-6">
        {/* ... (Bagian kanan tidak ada yang berubah, sama seperti sebelumnya) ... */}

        <button
          onClick={() => window.open("/kiosq-antrian", "_blank")}
          className="hidden lg:flex items-center text-sm px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex-shrink-0"
        >
          <Monitor className="w-4 h-4 mr-2 text-slate-500" />
          Public Display
        </button>

        <div className="hidden xl:flex items-center text-sm flex-shrink-0">
          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
          <span className="text-emerald-700 font-medium text-xs">
            Tersinkronisasi
          </span>
        </div>

        <div className="hidden xl:flex items-center text-slate-500 text-sm flex-shrink-0 w-[300px]">
          <Clock className="w-4 h-4 mr-2" />
          {currentTime ? formatDateTime(currentTime) : "Memuat waktu..."}
        </div>

        <div className="relative flex-shrink-0 p-1">
          <Bell className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700 transition-colors" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
        </div>

        <div className="flex items-center border-l border-slate-200 pl-3 md:pl-6 cursor-pointer flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs md:mr-3 flex-shrink-0">
            SR
          </div>
          <div className="hidden md:block text-right mr-2">
            <div className="text-sm font-semibold text-slate-800 leading-tight">
              Siti Rahma, A.Md.Kep
            </div>
            <div className="text-xs text-slate-500">Perawat Poli Anak</div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
};
