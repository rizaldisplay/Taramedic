'use client';

import React from 'react';
import { History, List } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchHistory, openHistory } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  historyButtonText?: string;
  auditButtonText?: string;
  onHistoryClick?: () => void;
  onAuditClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Rujukan Pasien',
  subtitle = '',
  description = 'Catat rujukan masuk dan siapkan rujukan keluar dari EMR.',
  historyButtonText = 'Riwayat Rujukan',
  auditButtonText = 'Audit Trail',
  onHistoryClick,
  onAuditClick,
}) => {
  const dispatch = useAppDispatch();

  const handleHistoryClick = () => {
    if (onHistoryClick) return onHistoryClick();
    try {
      dispatch(openHistory('history'));
      dispatch(fetchHistory('history'));
    } catch {
      // Fallback jika tidak berada dalam slice SDMK
    }
  };

  const handleAuditClick = () => {
    if (onAuditClick) return onAuditClick();
    try {
      dispatch(openHistory('audit'));
      dispatch(fetchHistory('audit'));
    } catch {
      // Fallback jika tidak berada dalam slice SDMK
    }
  };

  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
      {/* Judul & Deskripsi Halaman */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-none">
          {title}
        </h1>

        <div className="flex flex-wrap items-center text-xs md:text-sm text-slate-500 mt-1">
          {subtitle && (
            <>
              <span className="font-semibold text-slate-800">{subtitle}</span>
              <span className="mx-2 text-slate-300">•</span>
            </>
          )}
          <span>{description}</span>
        </div>
      </div>

      {/* Tombol Aksi - Rata Bawah (items-end) sejajar garis maya batas kanan card 3 */}
      <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
        {auditButtonText && (
          <button
            type="button"
            onClick={handleAuditClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100/80 transition-all shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            <List className="w-4 h-4 text-slate-500" />
            <span>{auditButtonText}</span>
          </button>
        )}

        {historyButtonText && (
          <button
            type="button"
            onClick={handleHistoryClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold text-white bg-cyan-600 rounded-xl hover:bg-cyan-700 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <History className="w-4 h-4" />
            <span>{historyButtonText}</span>
          </button>
        )}
      </div>
    </header>
  );
};