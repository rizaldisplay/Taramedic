'use client';

/**
 * Status pill + dropdown menu for the kiosk receipt printer.
 * Mendukung dua jalur koneksi (Bluetooth dan USB) yang dipilih dari menu.
 *
 * Assumes a dark toolbar/header background (the idle-state dot uses
 * `bg-white/35`) — adjust the tone tokens in useReceiptPrinter's STATUS_TONE
 * map if you mount this on a light surface.
 */

import { useEffect, useRef, useState } from 'react';
import type { InstitutionConfig, PaperWidth, PrinterTransportType } from '@/types/printer';
import { usePrinter } from '@/lib/printer/PrinterContext';
import { TRANSPORT_LABEL, TRANSPORT_TYPES } from '@/lib/printer/transports';

export interface PrinterStatusWidgetProps extends InstitutionConfig {
  className?: string;
}

const UNSUPPORTED_MESSAGE: Record<PrinterTransportType, string> = {
  bluetooth: 'Web Bluetooth tidak tersedia di browser ini. Gunakan Chrome atau Edge.',
  usb: 'WebUSB tidak tersedia di browser ini. Gunakan Chrome atau Edge lewat HTTPS.',
};

export function PrinterStatusWidget({ className }: PrinterStatusWidgetProps) {
  const printer = usePrinter();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const busy = printer.status === 'pairing' || printer.status === 'connecting';

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

  const handleConnect = async () => {
    const ok = await printer.autoReconnect();

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
          <div className="mb-3 flex items-center justify-between">
            <span className="text-white/70">Koneksi</span>
            <div className="flex overflow-hidden rounded-lg border border-white/10">
              {TRANSPORT_TYPES.map((type) => {
                const available = printer.supportedTransports[type];
                const selected = printer.transport === type;

                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={selected}
                    disabled={busy || (!available && !selected)}
                    title={available ? undefined : UNSUPPORTED_MESSAGE[type]}
                    onClick={() => void printer.setTransport(type)}
                    className={`px-2.5 py-1 text-xs transition disabled:opacity-40 ${
                      selected ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    {TRANSPORT_LABEL[type]}
                  </button>
                );
              })}
            </div>
          </div>

          {!printer.supported && (
            <p className="mb-3 rounded-lg bg-amber-500/10 p-2 text-xs text-amber-300">
              {UNSUPPORTED_MESSAGE[printer.transport]}
            </p>
          )}

          <div className="mb-3">
            <p className="text-xs text-white/40">Printer {printer.transportLabel}</p>
            <p className="mt-0.5 truncate">{printer.deviceName || 'Belum dipasangkan'}</p>
            {printer.lastError && <p className="mt-1 text-xs text-rose-300">{printer.lastError}</p>}
            {printer.transport === 'usb' && printer.supported && !printer.isPaired && (
              <p className="mt-1 text-xs text-white/40">
                Di Windows, printer perlu driver WinUSB agar bisa dipakai browser.
              </p>
            )}
          </div>

          <div className="mb-3 flex gap-2">
            {printer.isPaired ? (
              <button
                type="button"
                onClick={() => void handleConnect()}
                disabled={!printer.supported || busy || printer.isConnected}
                className="flex-1 rounded-lg bg-white/10 px-3 py-1.5 text-center transition hover:bg-white/20 disabled:opacity-40"
              >
                Sambungkan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handlePair()}
                disabled={!printer.supported || busy}
                className="flex-1 rounded-lg bg-white/10 px-3 py-1.5 text-center transition hover:bg-white/20 disabled:opacity-40"
              >
                Pasangkan Printer
              </button>
            )}

            <button
              type="button"
              onClick={() => void printer.testPrint()}
              disabled={!printer.isPaired || busy}
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
                  aria-pressed={printer.paperWidth === width}
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
              onChange={() => printer.toggleAutoReconnect()}
              className="h-4 w-4 accent-emerald-500"
            />
          </label>

          {printer.isPaired && (
            <div className="flex gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => void printer.disconnect()}
                disabled={!printer.isConnected}
                className="flex-1 rounded-lg px-3 py-1.5 text-center text-white/60 transition hover:bg-white/10 disabled:opacity-40"
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
