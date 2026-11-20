'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  dateLabel?: string;
  lastUpdatedLabel?: string;
  refreshButtonText?: string;
  isRefreshing?: boolean;
  onRefresh?: () => Promise<void> | void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Dasbor',
  subtitle = '',
  description = 'Ringkasan lintas modul tanpa data identitas pasien.',
  dateLabel = 'Jumat, 20 November 2026',
  lastUpdatedLabel = 'Diperbarui 15:53 WIB',
  refreshButtonText = 'Perbarui',
  isRefreshing: externalRefreshing = false,
  onRefresh,
}) => {
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const refreshing = externalRefreshing || internalRefreshing;

  const handleRefreshClick = async () => {
    try {
      setInternalRefreshing(true);
      await onRefresh?.();
    } finally {
      setTimeout(() => {
        setInternalRefreshing(false);
      }, 350);
    }
  };

  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 font-sans">
      {/* Kiri: Judul & Deskripsi Halaman */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-extrabold text-[#0f3d56] tracking-tight leading-tight">
          {title}
        </h1>

        <div className="flex flex-wrap items-center text-xs text-slate-400">
          {subtitle && (
            <>
              <span className="font-semibold text-slate-600">{subtitle}</span>
              <span className="mx-2 text-slate-300">&bull;</span>
            </>
          )}
          <span>{description}</span>
        </div>
      </div>

      {/* Kanan: Tanggal, Waktu Pembaruan & Tombol Perbarui */}
      <div className="flex items-center gap-3.5 shrink-0 self-start sm:self-center">
        <div className="text-right leading-snug">
          <p className="text-xs font-bold text-[#0f3d56] tabular-nums">
            {dateLabel}
          </p>
          {lastUpdatedLabel && (
            <p className="text-[11px] text-slate-400 tabular-nums mt-0.5">
              {lastUpdatedLabel}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => void handleRefreshClick()}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#0f3d56] bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 active:bg-slate-100 disabled:opacity-60 transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.03)] cursor-pointer shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
              refreshing ? 'animate-spin text-[#008ba6]' : ''
            }`}
          />
          <span>{refreshButtonText}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;