'use client';

import React from 'react';
import { ListFilter } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchHistory, openHistory } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  actionButtonText?: string;
  historyButtonText?: string;
  onActionClick?: () => void;
  onHistoryClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Pemeriksaan Perawat',
  subtitle = '',
  description = 'Pilih kunjungan untuk membuka pemeriksaan awal pasien.',
  actionButtonText,
  historyButtonText = 'Lihat Antrean Poli',
  onActionClick,
  onHistoryClick,
}) => {
  const dispatch = useAppDispatch();

  const buttonLabel = actionButtonText ?? historyButtonText;

  const handleClick = () => {
    if (onActionClick) return onActionClick();
    if (onHistoryClick) return onHistoryClick();
    try {
      dispatch(openHistory('history'));
      dispatch(fetchHistory('history'));
    } catch {
      // Fallback jika tidak berada dalam slice SDMK
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

      {/* Kanan: Tombol Outlined Sekunder */}
      {buttonLabel && (
        <div className="flex items-center shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#0f3d56] bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.03)] cursor-pointer shrink-0"
          >
            <ListFilter className="w-3.5 h-3.5 text-[#0f3d56] shrink-0" />
            <span>{buttonLabel}</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;