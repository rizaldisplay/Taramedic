/* eslint-disable react-hooks/refs */
'use client';

/**
 * React port of receipt-printer.js's Alpine controller (createReceiptPrinterController).
 *
 * Behavioural parity notes:
 * - Pairing, connecting, auto-reconnect-on-visibility, and the "1 silent
 *   retry per page load" throttle are all preserved.
 * - `menuOpen` from the original is UI/presentation state, not printer
 *   state — it now lives in the component that renders the widget
 *   (see PrinterStatusWidget.tsx), not in this hook.
 * - `_device` / `_server` stay as plain refs (not React state), same as
 *   the original kept them as non-reactive instance properties.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { BluetoothService } from '@/lib/printer/bluetooth-service';
import { encodeEscPosReceipt } from '@/lib/printer/escpos';
import { describePrinterError } from '@/lib/printer/errors';
import type {
  InstitutionConfig,
  PaperWidth,
  PrinterStatus,
  StoredPrinterPrefs,
  Ticket,
} from '@/types/printer';

const STORAGE_KEY = 'kiosk.blePrinter.v2';
const ROLE = 'kiosk';

const STATUS_TONE: Record<PrinterStatus, string> = {
  connected: 'bg-emerald-500',
  pairing: 'bg-sky-400 animate-pulse',
  connecting: 'bg-amber-400 animate-pulse',
  error: 'bg-rose-500',
  idle: 'bg-white/35',
};

function readStoredPrefs(): Partial<StoredPrinterPrefs> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const legacyId = window.localStorage.getItem(`printer_device_${ROLE}`);

    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredPrinterPrefs>;

      return {
        paperWidth: parsed.paperWidth === 80 ? 80 : 58,
        deviceName: parsed.deviceName ?? '',
        deviceId: parsed.deviceId ?? legacyId ?? '',
        autoReconnectEnabled: parsed.autoReconnectEnabled !== false,
      };
    }

    // Compatibility with POS-style key if ever shared on same origin.
    if (legacyId) {
      return { deviceId: legacyId };
    }
  } catch {
    // Ignore malformed/unavailable storage.
  }

  return {};
}

function writeStoredPrefs(prefs: StoredPrinterPrefs): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));

    if (prefs.deviceId) {
      window.localStorage.setItem(`printer_device_${ROLE}`, prefs.deviceId);
    } else {
      window.localStorage.removeItem(`printer_device_${ROLE}`);
    }
  } catch {
    // Ignore storage failures (private browsing, quota, etc.).
  }
}

function shortText(value: string, max: number): string {
  const text = String(value || '');

  return text.length > max ? `${text.slice(0, max - 2)}…` : text;
}

export interface UseReceiptPrinterResult {
  status: PrinterStatus;
  /** Human-readable status pill text (mirrors statusLabel()/shortName()/shortError()). */
  statusLabel: string;
  /** Tailwind classes for a status dot (mirrors statusTone()). */
  statusTone: string;
  paperWidth: PaperWidth;
  deviceName: string;
  deviceId: string;
  lastError: string;
  autoReconnectEnabled: boolean;
  supported: boolean;
  isPaired: boolean;
  pairPrinter: () => Promise<boolean>;
  autoReconnect: () => Promise<boolean>;
  printTicket: (ticket: Ticket) => Promise<boolean>;
  testPrint: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  forgetPrinter: () => Promise<void>;
  toggleAutoReconnect: () => void;
  setPaperWidth: (width: PaperWidth) => void;
}

export function useReceiptPrinter(config: InstitutionConfig = {}): UseReceiptPrinterResult {
  const [status, setStatus] = useState<PrinterStatus>('idle');
  const [paperWidth, setPaperWidthState] = useState<PaperWidth>(58);
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [lastError, setLastError] = useState('');
  const [autoReconnectEnabled, setAutoReconnectEnabled] = useState(true);
  const [supported, setSupported] = useState(false);

  // Source of truth for values async callbacks need to read without going stale.
  const prefsRef = useRef<StoredPrinterPrefs>({
    paperWidth: 58,
    deviceName: '',
    deviceId: '',
    autoReconnectEnabled: true,
  });
  const lastErrorRef = useRef('');
  useEffect(() => {
    lastErrorRef.current = lastError;
  }, [lastError]);

  // Non-reactive handles — mirror the original controller's `_device` / `_server`.
  const nativeDeviceRef = useRef<BluetoothDevice | null>(null);
  const serverRef = useRef<BluetoothRemoteGATTServer | null>(null);
  const restoreInProgressRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);

  const serviceRef = useRef<BluetoothService | null>(null);
  if (!serviceRef.current) {
    serviceRef.current = new BluetoothService({
      onDisconnected: (device) => {
        if (prefsRef.current.deviceId && device.id !== prefsRef.current.deviceId) {
          return;
        }

        serverRef.current = null;
        setStatus('idle');
        setLastError('Printer terputus.');
      },
    });
  }
  const service = serviceRef.current;

  const isReady = useCallback(
    () => Boolean(nativeDeviceRef.current && serverRef.current?.connected),
    [],
  );

  const fail = useCallback((message: string) => {
    setLastError(message);
    setStatus('error');
  }, []);

  /** Updates local state + the ref + localStorage together, in one place. */
  const applyPrefs = useCallback(
    (patch: Partial<StoredPrinterPrefs>, opts: { persist?: boolean } = {}) => {
      const next: StoredPrinterPrefs = { ...prefsRef.current, ...patch };
      prefsRef.current = next;
      setPaperWidthState(next.paperWidth);
      setDeviceName(next.deviceName);
      setDeviceId(next.deviceId);
      setAutoReconnectEnabled(next.autoReconnectEnabled);

      if (opts.persist !== false) {
        writeStoredPrefs(next);
      }
    },
    [],
  );

  /**
   * Restore saved device id via getDevices() then connect — mirrors POS
   * loadSavedDevices() / the original's loadSavedDeviceAndConnect().
   */
  const loadSavedDeviceAndConnect = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}): Promise<boolean> => {
      if (restoreInProgressRef.current || !service.isSupported()) {
        return false;
      }

      const savedId = prefsRef.current.deviceId;

      if (!savedId) {
        return false;
      }

      if (!savedId && !prefsRef.current.autoReconnectEnabled) {
        return false;
      }

      if (isReady()) {
        setStatus('connected');

        return true;
      }

      restoreInProgressRef.current = true;

      if (!silent) {
        setStatus('connecting');
        setLastError('');
      } else {
        setStatus((prev) => (prev !== 'connected' ? 'connecting' : prev));
      }

      try {
        const permitted = await service.getDevices();
        const device = permitted.find((item) => item.id === savedId);

        if (!device) {
          nativeDeviceRef.current = null;
          serverRef.current = null;
          setStatus('idle');
          setLastError('Izin printer hilang. Pasangkan ulang.');

          return false;
        }

        nativeDeviceRef.current = device;
        applyPrefs({
          deviceName: device.name || prefsRef.current.deviceName || 'Thermal Printer',
          deviceId: device.id,
        });

        // POS limits aggressive auto-reconnect; keep 1 silent attempt per page load unless manual.
        if (silent && reconnectAttemptsRef.current >= 1) {
          setStatus('idle');
          setLastError('Belum terhubung. Tekan Sambungkan.');

          return false;
        }

        reconnectAttemptsRef.current += 1;
        serverRef.current = await service.connect(device, silent ? 1 : 3);
        setStatus('connected');
        setLastError('');

        return true;
      } catch (error) {
        serverRef.current = null;
        setStatus(silent ? 'idle' : 'error');
        setLastError(
          silent ? 'Gagal sambung otomatis. Pastikan printer nyala/dekat.' : describePrinterError(error),
        );

        return false;
      } finally {
        restoreInProgressRef.current = false;
      }
    },
    [service, isReady, applyPrefs],
  );

  /**
   * Pair printer (user gesture) — mirrors POS setupPrinter().
   */
  const pairPrinter = useCallback(async (): Promise<boolean> => {
    if (!service.isSupported()) {
      fail('Web Bluetooth tidak tersedia. Gunakan Chrome/Edge.');

      return false;
    }

    setStatus('pairing');
    setLastError('');

    try {
      const device = await service.requestDevice();
      nativeDeviceRef.current = device;
      applyPrefs({
        deviceName: device.name || 'Thermal Printer',
        deviceId: device.id || '',
      });

      setStatus('connecting');
      serverRef.current = await service.connect(device, 3);
      reconnectAttemptsRef.current = 0;
      setStatus('connected');
      setLastError('');

      return true;
    } catch (error) {
      const err = error as { name?: string };

      if (err?.name === 'NotFoundError') {
        setStatus('idle');
        setLastError('Printer tidak dipilih.');

        return false;
      }

      fail(describePrinterError(error));

      return false;
    }
  }, [service, applyPrefs, fail]);

  const autoReconnect = useCallback(async (): Promise<boolean> => {
    reconnectAttemptsRef.current = 0;

    return loadSavedDeviceAndConnect({ silent: false });
  }, [loadSavedDeviceAndConnect]);

  const ensureConnection = useCallback(async (): Promise<BluetoothRemoteGATTServer> => {
    if (isReady() && serverRef.current) {
      return serverRef.current;
    }

    if (!nativeDeviceRef.current && prefsRef.current.deviceId) {
      const ok = await loadSavedDeviceAndConnect({ silent: false });

      if (!ok || !serverRef.current) {
        throw new Error(lastErrorRef.current || 'Printer belum siap');
      }

      return serverRef.current;
    }

    if (!nativeDeviceRef.current) {
      throw new Error('Printer belum dipasangkan');
    }

    setStatus('connecting');
    serverRef.current = await service.connect(nativeDeviceRef.current, 3);
    setStatus('connected');
    setLastError('');

    return serverRef.current;
  }, [isReady, loadSavedDeviceAndConnect, service]);

  const printTicket = useCallback(
    async (ticket: Ticket): Promise<boolean> => {
      if (!ticket?.ticket_number) {
        return false;
      }

      try {
        const server = await ensureConnection();
        const payload = await encodeEscPosReceipt(ticket, {
          paperWidth,
          institutionName: config.institutionName,
          institutionAddress: config.institutionAddress,
          institutionPhone: config.institutionPhone,
          receiptSettings: config.receiptSettings,
        });

        await service.print(server, payload);
        setStatus('connected');
        setLastError('');

        return true;
      } catch (error) {
        serverRef.current = null;
        fail(describePrinterError(error));

        return false;
      }
    },
    [
      ensureConnection,
      service,
      paperWidth,
      config.institutionName,
      config.institutionAddress,
      config.institutionPhone,
      config.receiptSettings,
      fail,
    ],
  );

  const testPrint = useCallback((): Promise<boolean> => {
    return printTicket({
      ticket_number: 'RPP001',
      service_code: 'T',
      service_name: 'Tes Printer',
      estimated_wait_minutes: 0,
      waiting_count: 0,
      issued_at: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      queue_date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
  }, [printTicket]);

  const disconnect = useCallback(async (): Promise<void> => {
    service.disconnect(nativeDeviceRef.current);
    serverRef.current = null;
    setStatus('idle');
    setLastError('');
  }, [service]);

  const forgetPrinter = useCallback(async (): Promise<void> => {
    service.disconnect(nativeDeviceRef.current);
    nativeDeviceRef.current = null;
    serverRef.current = null;
    reconnectAttemptsRef.current = 0;
    setLastError('');
    setStatus('idle');
    applyPrefs({ deviceName: '', deviceId: '' });
  }, [service, applyPrefs]);

  const toggleAutoReconnect = useCallback(() => {
    const next = !prefsRef.current.autoReconnectEnabled;
    applyPrefs({ autoReconnectEnabled: next });

    if (next) {
      void loadSavedDeviceAndConnect({ silent: true });
    }
  }, [applyPrefs, loadSavedDeviceAndConnect]);

  const setPaperWidth = useCallback(
    (width: PaperWidth) => {
      applyPrefs({ paperWidth: width === 80 ? 80 : 58 });
    },
    [applyPrefs],
  );

  // Mirrors the original controller's init(): load prefs, attempt a silent
  // restore, and re-attempt on tab focus.
  useEffect(() => {
    setSupported(service.isSupported());

    const stored = readStoredPrefs();
    applyPrefs(
      {
        paperWidth: stored.paperWidth ?? 58,
        deviceName: stored.deviceName ?? '',
        deviceId: stored.deviceId ?? '',
        autoReconnectEnabled: stored.autoReconnectEnabled ?? true,
      },
      { persist: false },
    );

    void loadSavedDeviceAndConnect({ silent: true });

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && prefsRef.current.autoReconnectEnabled) {
        void loadSavedDeviceAndConnect({ silent: true });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
    // Intentionally run once on mount, same as the original's init().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusLabel = (() => {
    if (status === 'connected') {
      return shortText(deviceName, 16) || 'Terhubung';
    }

    if (status === 'pairing') {
      return 'Pilih printer...';
    }

    if (status === 'connecting') {
      return 'Menghubungkan...';
    }

    if (status === 'error') {
      return shortText(lastError || 'Error', 24);
    }

    return deviceId ? 'Tidak terhubung' : 'Belum dipasang';
  })();

  return {
    status,
    statusLabel,
    statusTone: STATUS_TONE[status] ?? 'bg-white/35',
    paperWidth,
    deviceName,
    deviceId,
    lastError,
    autoReconnectEnabled,
    supported,
    isPaired: Boolean(deviceId),
    pairPrinter,
    autoReconnect,
    printTicket,
    testPrint,
    disconnect,
    forgetPrinter,
    toggleAutoReconnect,
    setPaperWidth,
  };
}