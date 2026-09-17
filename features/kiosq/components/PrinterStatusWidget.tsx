'use client';

/**
 * Status pill + dropdown menu for the kiosk receipt printer.
 * Functional port of the (Blade-rendered) template that presumably drove
 * receipt-printer.js's statusLabel()/statusTone()/menuOpen fields — that
 * markup wasn't included in the source files, so this is a reasonable
 * from-scratch rebuild, not a byte-for-byte port.
 *
 * Assumes a dark toolbar/header background (the idle-state dot uses
 * `bg-white/35`, matching the original) — adjust the tone tokens in
 * useReceiptPrinter's STATUS_TONE map if you mount this on a light surface.
 */

import { useEffect, useRef, useState } from 'react';
import type { InstitutionConfig, PaperWidth } from '@/types/printer';
import { useReceiptPrinter } from '@/hooks/useReceiptPrinter';

export interface PrinterStatusWidgetProps extends InstitutionConfig {
  className?: string;
}

export function PrinterStatusWidget({ className, ...institutionConfig }: PrinterStatusWidgetProps) {
  const printer = useReceiptPrinter(institutionConfig);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handlePair = async () => {
    const ok = await printer.pairPrinter();

    if (ok) {
      setMenuOpen(false);
    }
  };

  const handlePaperWidth = (width: PaperWidth) => {
    printer.setPaperWidth(width);
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-sm ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-white/90 transition hover:bg-white/15"
      >
        <span className={`h-2.5 w-2.5 rounded-full ${printer.statusTone}`} aria-hidden />
        <span className="max-w-36 truncate">{printer.statusLabel}</span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-white/10 bg-slate-900 p-3 text-white/90 shadow-xl">
          {!printer.supported && (
            <p className="mb-3 rounded-lg bg-amber-500/10 p-2 text-xs text-amber-300">
              Web Bluetooth tidak tersedia di browser ini. Gunakan Chrome atau Edge.
            </p>
          )}

          <div className="mb-3">
            <p className="text-xs uppercase tracking-wide text-white/40">Printer</p>
            <p className="mt-0.5 truncate">{printer.deviceName || 'Belum dipasangkan'}</p>
            {printer.lastError && <p className="mt-1 text-xs text-rose-300">{printer.lastError}</p>}
          </div>

          <div className="mb-3 flex gap-2">
            {printer.isPaired ? (
              <button
                type="button"
                onClick={() => void printer.autoReconnect()}
                disabled={!printer.supported || printer.status === 'connecting'}
                className="flex-1 rounded-lg bg-white/10 px-3 py-1.5 text-center transition hover:bg-white/20 disabled:opacity-40"
              >
                Sambungkan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handlePair()}
                disabled={!printer.supported || printer.status === 'pairing'}
                className="flex-1 rounded-lg bg-white/10 px-3 py-1.5 text-center transition hover:bg-white/20 disabled:opacity-40"
              >
                Pasangkan Printer
              </button>
            )}

            <button
              type="button"
              onClick={() => void printer.testPrint()}
              disabled={!printer.isPaired}
              className="flex-1 rounded-lg bg-white/10 px-3 py-1.5 text-center transition hover:bg-white/20 disabled:opacity-40"
            >
              Tes Cetak
            </button>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-white/70">Kertas</span>
            <div className="flex overflow-hidden rounded-lg border border-white/10">
              {([58, 80] as PaperWidth[]).map((width) => (
                <button
                  key={width}
                  type="button"
                  onClick={() => handlePaperWidth(width)}
                  className={`px-2.5 py-1 text-xs transition ${
                    printer.paperWidth === width ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  {width}mm
                </button>
              ))}
            </div>
          </div>

          <label className="mb-3 flex items-center justify-between">
            <span className="text-white/70">Sambung otomatis</span>
            <input
              type="checkbox"
              checked={printer.autoReconnectEnabled}
              onChange={printer.toggleAutoReconnect}
              className="h-4 w-4 accent-emerald-500"
            />
          </label>

          {printer.isPaired && (
            <div className="flex gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => void printer.disconnect()}
                className="flex-1 rounded-lg px-3 py-1.5 text-center text-white/60 transition hover:bg-white/10"
              >
                Putuskan
              </button>
              <button
                type="button"
                onClick={() => void printer.forgetPrinter()}
                className="flex-1 rounded-lg px-3 py-1.5 text-center text-rose-300 transition hover:bg-rose-500/10"
              >
                Lupakan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
