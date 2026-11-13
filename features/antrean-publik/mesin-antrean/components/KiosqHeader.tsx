/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Minimize2, Scan } from 'lucide-react';
import { PrinterStatusWidget } from '@/features/kiosq/components/PrinterStatusWidget';

const INSTITUTION_CONFIG = {
  institutionName: 'Klinik Taramedic',
  institutionAddress: 'Jl. Merdeka No. 10, Jakarta',
  institutionPhone: '031-1234567',
};

export const KiosqHeader = () => {
  const [now, setNow] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Gagal mengubah mode layar penuh:', err);
    }
  };

  const formattedTime = now
    ? now
        .toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/\./g, ':')
    : '--:--:--';

  const formattedDate = now
    ? now.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Memuat tanggal...';

  return (
    <header className="w-full shrink-0 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-6 py-4 sm:px-10 sm:py-5 flex flex-wrap items-center justify-between gap-4">
        {/* Kiri: Brand Logo Taramedic */}
        <div className="flex items-center gap-3">
          <img
            src="/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png"
            alt="Logo Taramedic"
            className="h-9 sm:h-11 lg:h-12 w-auto object-contain cursor-pointer"
          />
        </div>

        {/* Kanan: Info Mesin Antrean, Jam/Tanggal, Tombol Fullscreen & Status Printer */}
        <div className="flex items-center gap-4 sm:gap-5 ml-auto">
          {/* Blok Info Mesin Antrean */}
          <div className="flex flex-col items-start">
            <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#0f2942] uppercase leading-tight">
              MESIN ANTREAN
            </span>

            {/* Baris Jam Real-time */}
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-4 h-4 text-[#009bb8] shrink-0" />
              <span className="text-sm sm:text-[15px] font-bold text-[#008ba6] tabular-nums tracking-tight">
                {formattedTime}
              </span>
              <span className="text-[11px] font-bold text-[#009bb8] uppercase">
                WIB
              </span>
            </div>

            {/* Baris Tanggal */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#009bb8] shrink-0" />
              <span className="text-xs font-medium text-slate-500">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Tombol Full Screen Kiosk */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            aria-label={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            className="w-11 h-11 rounded-xl bg-white hover:bg-[#f0f9fb] active:scale-95 border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center justify-center text-[#008ba6] transition-all cursor-pointer shrink-0"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 stroke-[2]" />
            ) : (
              <Scan className="w-4 h-4 stroke-[2]" />
            )}
          </button>

          {/* Widget Status & Koneksi Printer Thermal */}
          <div className="flex items-center rounded-xl bg-slate-900 shadow-xs shrink-0">
            <PrinterStatusWidget {...INSTITUTION_CONFIG} />
          </div>
        </div>
      </div>
    </header>
  );
};