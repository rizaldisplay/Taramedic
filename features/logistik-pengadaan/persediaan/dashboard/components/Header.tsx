"use client";

import React, { useState } from "react";
import { History, List, RefreshCw } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchHistory,
  openHistory,
} from "@/features/masterdata/master-sdmk/slices/sdmkSlice";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  lastUpdatedLabel?: string;
  refreshButtonText?: string;
  isRefreshing?: boolean;
  onRefresh?: () => Promise<void> | void;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Dashboard",
  subtitle = "",
  description = "Ringkasan stok consumable, nilai estimasi, aktivitas terbaru, dan akses cepat ke pekerjaan inventori.",
  lastUpdatedLabel = 'Diperbarui 15:53 WIB',
  refreshButtonText = 'Perbarui Data',
  isRefreshing: externalRefreshing = false,
  onRefresh,
}) => {
  const dispatch = useAppDispatch();
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
        <button
          type="button"
          onClick={() => void handleRefreshClick()}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#0f3d56] bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 active:bg-slate-100 disabled:opacity-60 transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.03)] cursor-pointer shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
              refreshing ? "animate-spin text-[#008ba6]" : ""
            }`}
          />
          <span>{refreshButtonText}</span>
        </button>
      </div>
    </header>
  );
};
