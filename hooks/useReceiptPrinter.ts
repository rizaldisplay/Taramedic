'use client';

/**
 * Hook printer struk kiosk yang mendukung Bluetooth dan USB.
 *
 * Alur kerjanya tidak bergantung pada jenis koneksi: semua operasi
 * (pair, reconnect, write, disconnect, forget) lewat interface PrinterTransport.
 * Pengguna memilih jalur lewat `setTransport`, pilihannya disimpan di localStorage
 * bersama printer terakhir yang dipasangkan untuk masing-masing jalur.
 *
 * File ini dibuat baru karena useReceiptPrinter asli tidak ikut diunggah.
 * Nama field hasil hook mengikuti yang dipakai PrinterStatusWidget.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { encodeEscPosReceipt } from '@/lib/printer/escpos';
import { describePrinterError } from '@/lib/printer/errors';
import { TRANSPORT_LABEL, createTransports } from '@/lib/printer/transports';
import type {
  InstitutionConfig,
  PairedDevice,
  PaperWidth,
  PrinterStatus,
  PrinterTransportType,
  StoredPrinterPrefs,
  Ticket,
} from '@/types/printer';

const STORAGE_KEY = 'kiosk-receipt-printer';
const RECONNECT_DELAY_MS = 2500;

/** Warna titik status. Asumsi latar gelap; ubah di sini bila dipasang di latar terang. */
export const STATUS_TONE: Record<PrinterStatus, string> = {
  idle: 'bg-white/35',
  pairing: 'bg-amber-400',
  connecting: 'bg-amber-400',
  connected: 'bg-emerald-400',
  error: 'bg-rose-400',
};

const DEFAULT_PREFS: StoredPrinterPrefs = {
  paperWidth: 58,
  transport: 'bluetooth',
  devices: {},
  autoReconnectEnabled: true,
};

export interface AutoReconnectOptions {
  /**
   * true  = jalan diam-diam (saat halaman dibuka / sambungan putus), tanpa dialog.
   * false = dipicu klik tombol; jika printer tidak ditemukan, dialog pemilihan dibuka.
   */
  silent?: boolean;
}

export interface UseReceiptPrinterResult {
  /** Apakah jalur yang sedang dipilih didukung browser ini. */
  supported: boolean;
  supportedTransports: Record<PrinterTransportType, boolean>;

  transport: PrinterTransportType;
  transportLabel: string;
  setTransport: (transport: PrinterTransportType) => Promise<void>;

  status: PrinterStatus;
  statusLabel: string;
  statusTone: string;
  lastError: string;

  deviceName: string;
  isPaired: boolean;
  isConnected: boolean;

  paperWidth: PaperWidth;
  setPaperWidth: (width: PaperWidth) => void;

  autoReconnectEnabled: boolean;
  toggleAutoReconnect: () => void;

  pairPrinter: () => Promise<boolean>;
  autoReconnect: (options?: AutoReconnectOptions) => Promise<boolean>;
  disconnect: () => Promise<void>;
  forgetPrinter: () => Promise<void>;

  printTicket: (ticket: Ticket) => Promise<boolean>;
  testPrint: () => Promise<boolean>;
}

function loadPrefs(): StoredPrinterPrefs {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return DEFAULT_PREFS;
    }

    const parsed = JSON.parse(raw) as Partial<StoredPrinterPrefs>;
    const devices = { ...(parsed.devices ?? {}) };

    // Migrasi dari format lama yang hanya mengenal Bluetooth.
    if (!devices.bluetooth && parsed.deviceId) {
      devices.bluetooth = { id: parsed.deviceId, name: parsed.deviceName ?? '' };
    }

    return {
      paperWidth: parsed.paperWidth === 80 ? 80 : 58,
      transport: parsed.transport === 'usb' ? 'usb' : 'bluetooth',
      devices,
      autoReconnectEnabled: parsed.autoReconnectEnabled !== false,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function buildTestTicket(): Ticket {
  const now = new Date();

  return {
    ticket_number: 'A-001',
    service_name: 'Tes Cetak',
    service_code: 'TST',
    estimated_wait_minutes: 5,
    waiting_count: 3,
    queue_date: now.toLocaleDateString('id-ID'),
    issued_at: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function useReceiptPrinter(config: InstitutionConfig): UseReceiptPrinterResult {
  const [transports] = useState(createTransports);
  const [prefs, setPrefs] = useState<StoredPrinterPrefs>(() => loadPrefs());
  const [status, setStatus] = useState<PrinterStatus>('idle');
  const [lastError, setLastError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  const supportedTransports: Record<PrinterTransportType, boolean> = {
    bluetooth: transports.bluetooth.isSupported(),
    usb: transports.usb.isSupported(),
  };

  // Ref agar callback async selalu membaca nilai terbaru tanpa jadi dependency.
  const prefsRef = useRef(prefs);
  const configRef = useRef(config);
  const busyRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoReconnectRef = useRef<(options?: AutoReconnectOptions) => Promise<boolean>>(async () => false);
  const printQueueRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    prefsRef.current = prefs;
    configRef.current = config;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // localStorage bisa penuh atau dinonaktifkan; abaikan.
    }
  }, [prefs]);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const rememberDevice = useCallback((type: PrinterTransportType, device: PairedDevice) => {
    setPrefs((current) => ({ ...current, devices: { ...current.devices, [type]: device } }));
  }, []);

  const fail = useCallback((type: PrinterTransportType, error: unknown) => {
    setLastError(describePrinterError(error, type));
    setStatus('error');
  }, []);

  /** Pasang handler putus-sambung dan jadwalkan sambung ulang otomatis. */
  const watchDisconnect = useCallback(
    (type: PrinterTransportType) => {
      transports[type].setDisconnectHandler(() => {
        if (prefsRef.current.transport !== type) {
          return;
        }

        setStatus('idle');
        clearReconnectTimer();

        if (prefsRef.current.autoReconnectEnabled) {
          reconnectTimerRef.current = setTimeout(() => {
            void autoReconnectRef.current({ silent: true });
          }, RECONNECT_DELAY_MS);
        }
      });
    },
    [transports, clearReconnectTimer],
  );

  const pairPrinter = useCallback(async (): Promise<boolean> => {
    const type = prefsRef.current.transport;
    const transport = transports[type];

    if (!transport.isSupported() || busyRef.current) {
      return false;
    }

    busyRef.current = true;
    clearReconnectTimer();
    setLastError('');
    setStatus('pairing');

    try {
      const device = await transport.pair();

      if (!device) {
        setStatus(transport.isConnected() ? 'connected' : 'idle');

        return false;
      }

      watchDisconnect(type);
      rememberDevice(type, device);
      setStatus('connected');

      return true;
    } catch (error) {
      fail(type, error);

      return false;
    } finally {
      busyRef.current = false;
    }
  }, [transports, clearReconnectTimer, watchDisconnect, rememberDevice, fail]);

  const autoReconnect = useCallback(
    async (options: AutoReconnectOptions = {}): Promise<boolean> => {
      const type = prefsRef.current.transport;
      const transport = transports[type];
      const saved = prefsRef.current.devices[type];

      if (!transport.isSupported() || busyRef.current) {
        return false;
      }

      if (transport.isConnected()) {
        setStatus('connected');

        return true;
      }

      if (!saved) {
        return false;
      }

      busyRef.current = true;
      setLastError('');
      setStatus('connecting');

      let found = false;

      try {
        const device = await transport.reconnect(saved);

        if (device) {
          watchDisconnect(type);
          rememberDevice(type, device);
          setStatus('connected');
          found = true;
        } else {
          setStatus('idle');
        }
      } catch (error) {
        fail(type, error);

        return false;
      } finally {
        busyRef.current = false;
      }

      if (found) {
        return true;
      }

      // Klik manual tapi izin/perangkat hilang: buka dialog pemilihan.
      return options.silent ? false : pairPrinter();
    },
    [transports, watchDisconnect, rememberDevice, fail, pairPrinter],
  );

  useEffect(() => {
    autoReconnectRef.current = autoReconnect;
  }, [autoReconnect]);

  // Sambung otomatis saat halaman dibuka dan saat jalur diganti.
  useEffect(() => {
    if (!hydrated || !prefsRef.current.autoReconnectEnabled) {
      return;
    }

    if (prefsRef.current.devices[prefs.transport]) {
      void autoReconnectRef.current({ silent: true });
    }

    return clearReconnectTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, prefs.transport]);

  const disconnect = useCallback(async () => {
    clearReconnectTimer();

    try {
      await transports[prefsRef.current.transport].disconnect();
    } catch {
      // sudah putus
    }

    setLastError('');
    setStatus('idle');
  }, [transports, clearReconnectTimer]);

  const forgetPrinter = useCallback(async () => {
    const type = prefsRef.current.transport;
    const saved = prefsRef.current.devices[type];

    clearReconnectTimer();

    try {
      await transports[type].forget(saved);
    } catch {
      // izin browser mungkin sudah tercabut
    }

    setPrefs((current) => {
      const devices = { ...current.devices };
      delete devices[type];

      return { ...current, devices };
    });
    setLastError('');
    setStatus('idle');
  }, [transports, clearReconnectTimer]);

  const setTransport = useCallback(
    async (next: PrinterTransportType) => {
      const current = prefsRef.current.transport;

      if (next === current || busyRef.current) {
        return;
      }

      clearReconnectTimer();

      try {
        await transports[current].disconnect();
      } catch {
        // sudah putus
      }

      setPrefs((value) => ({ ...value, transport: next }));
      setLastError('');
      setStatus('idle');
    },
    [transports, clearReconnectTimer],
  );

  const setPaperWidth = useCallback((width: PaperWidth) => {
    setPrefs((current) => ({ ...current, paperWidth: width }));
  }, []);

  const toggleAutoReconnect = useCallback(() => {
    setPrefs((current) => ({ ...current, autoReconnectEnabled: !current.autoReconnectEnabled }));
  }, []);

  /** Cetak berurutan: tiket yang datang bersamaan antre, tidak saling menimpa. */
  const printTicket = useCallback(
    (ticket: Ticket): Promise<boolean> => {
      const job = async (): Promise<boolean> => {
        const type = prefsRef.current.transport;
        const transport = transports[type];

        try {
          if (!transport.isConnected()) {
            const restored = prefsRef.current.autoReconnectEnabled
              ? await autoReconnectRef.current({ silent: true })
              : false;

            if (!restored) {
              throw new Error('Printer belum tersambung.');
            }
          }

          const bytes = await encodeEscPosReceipt(ticket, {
            ...configRef.current,
            paperWidth: prefsRef.current.paperWidth,
          });

          await transport.write(bytes);
          setLastError('');
          setStatus('connected');

          return true;
        } catch (error) {
          fail(type, error);

          return false;
        }
      };

      const run = printQueueRef.current.then(job, job);
      printQueueRef.current = run;

      return run;
    },
    [transports, fail],
  );

  const testPrint = useCallback(() => printTicket(buildTestTicket()), [printTicket]);

  const transport = prefs.transport;
  const saved = prefs.devices[transport];
  const deviceName = saved?.name ?? '';
  const isPaired = Boolean(saved);
  const transportLabel = TRANSPORT_LABEL[transport];

  const statusLabel = (() => {
    switch (status) {
      case 'pairing':
        return 'Memilih printer…';
      case 'connecting':
        return 'Menyambung…';
      case 'connected':
        return `${deviceName || 'Printer'} (${transportLabel})`;
      case 'error':
        return 'Printer bermasalah';
      default:
        return isPaired ? 'Printer terputus' : 'Printer belum siap';
    }
  })();

  return {
    supported: supportedTransports[transport],
    supportedTransports,

    transport,
    transportLabel,
    setTransport,

    status,
    statusLabel,
    statusTone: STATUS_TONE[status],
    lastError,

    deviceName,
    isPaired,
    isConnected: status === 'connected',

    paperWidth: prefs.paperWidth,
    setPaperWidth,

    autoReconnectEnabled: prefs.autoReconnectEnabled,
    toggleAutoReconnect,

    pairPrinter,
    autoReconnect,
    disconnect,
    forgetPrinter,

    printTicket,
    testPrint,
  };
}