'use client';

import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchHistory, openHistory } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  refreshButtonText?: string;
  createButtonText?: string;
  historyButtonText?: string;
  auditButtonText?: string;
  isRefreshing?: boolean;
  onRefresh?: () => Promise<void> | void;
  onCreateClick?: () => void;
  onHistoryClick?: () => void;
  onAuditClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Persetujuan Opname',
  subtitle = '',
  description = 'Tinjau hasil opname yang diajukan. Persetujuan mengikuti kewenangan dan pemisahan pembuat dengan peninjau.',
  refreshButtonText = 'Perbarui data',
  createButtonText = 'Alat baru',
  historyButtonText,
  auditButtonText,
  isRefreshing: externalRefreshing = false,
  onRefresh,
  onCreateClick,
  onHistoryClick,
  onAuditClick,
}) => {
  const dispatch = useAppDispatch();
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const refreshing = externalRefreshing || internalRefreshing;
  const secondaryLabel = refreshButtonText ?? auditButtonText;
  const primaryLabel = createButtonText ?? historyButtonText;

  const handleRefreshClick = async () => {
    if (onRefresh) {
      try {
        setInternalRefreshing(true);
        await onRefresh();
      } finally {
        setTimeout(() => setInternalRefreshing(false), 350);
      }
      return;
    }

    if (onAuditClick) {
      onAuditClick();
      return;
    }

    try {
      setInternalRefreshing(true);
      dispatch(openHistory('audit'));
      dispatch(fetchHistory('audit'));
    } catch {
      // Fallback jika tidak berada dalam slice SDMK
    } finally {
      setTimeout(() => setInternalRefreshing(false), 350);
    }
  };

  const handleCreateClick = () => {
    if (onCreateClick) return onCreateClick();
    if (onHistoryClick) return onHistoryClick();
    try {
      dispatch(openHistory('history'));
      dispatch(fetchHistory('history'));
    } catch {
      // Fallback jika tidak berada dalam slice SDMK
    }
  };

  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 font-sans">
      {/* Judul & Deskripsi Halaman */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f3d56] tracking-tight leading-none">
          {title}
        </h1>

        <div className="flex flex-wrap items-center text-xs md:text-sm text-slate-400 mt-1">
          {subtitle && (
            <>
              <span className="font-semibold text-slate-600">{subtitle}</span>
              <span className="mx-2 text-slate-300">&bull;</span>
            </>
          )}
          <span>{description}</span>
        </div>
      </div>

      {/* Tombol Aksi - Rata Bawah */}
      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end">
        {secondaryLabel && (
          <button
            type="button"
            onClick={() => void handleRefreshClick()}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0f3d56] bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 active:bg-slate-100 disabled:opacity-60 transition-all shadow-[0_1px_2px_rgba(15,23,42,0.03)] cursor-pointer active:scale-[0.98] shrink-0"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#0f3d56] shrink-0 transition-transform ${
                refreshing ? 'animate-spin text-[#008ba6]' : ''
              }`}
            />
            <span>{secondaryLabel}</span>
          </button>
        )}

        {/* {primaryLabel && (
          <button
            type="button"
            onClick={handleCreateClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] rounded-lg transition-all shadow-[0_1px_2px_rgba(15,23,42,0.06)] cursor-pointer active:scale-[0.98] shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-white shrink-0" />
            <span>{primaryLabel}</span>
          </button>
        )} */}
      </div>
    </header>
  );
};

export default Header;