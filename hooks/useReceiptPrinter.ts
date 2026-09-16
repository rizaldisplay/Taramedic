'use client';

/**
 * React port of the Alpine `createReceiptPrinterController` (receipt-printer.js).
 * Same Web Bluetooth flow, same localStorage prefs, same status machine —
 * just expressed as a hook instead of a mutable Alpine data object.
 *
 * Usage:
 *   const printer = useReceiptPrinter({ institutionName: 'Puskesmas Melati' });
 *   printer.pairPrinter();
 *   printer.printTicket(ticket);
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { bluetoothService } from '@/lib/printer/bluetooth-service';
import { encodeEscPosReceipt } from '@/lib/printer/ecpos';
import type { PaperWidth, PrinterStatus, ReceiptPrinterConfig, ReceiptPrinterPrefs, Ticket } from '@/types/printer';

const STORAGE_KEY = 'kiosk.blePrinter.v2';
const ROLE = 'kiosk';

interface PrinterState {
    status: PrinterStatus;
    paperWidth: PaperWidth;
    deviceName: string;
    deviceId: string;
    lastError: string;
    menuOpen: boolean;
    autoReconnectEnabled: boolean;
    supported: boolean;
}

const initialState: PrinterState = {
    status: 'idle',
    paperWidth: 58,
    deviceName: '',
    deviceId: '',
    lastError: '',
    menuOpen: false,
    autoReconnectEnabled: true,
    supported: false,
};

export interface UseReceiptPrinterResult extends PrinterState {
    isReady: () => boolean;
    statusLabel: () => string;
    statusTone: () => string;
    shortName: () => string;
    shortError: () => string;
    pairPrinter: () => Promise<boolean>;
    loadSavedDeviceAndConnect: (opts?: { silent?: boolean }) => Promise<boolean>;
    autoReconnect: () => Promise<boolean>;
    ensureConnection: () => Promise<BluetoothRemoteGATTServer>;
    printTicket: (ticket: Ticket) => Promise<boolean>;
    testPrint: () => Promise<boolean>;
    disconnect: () => Promise<void>;
    forgetPrinter: () => Promise<void>;
    setPaperWidth: (width: PaperWidth) => void;
    toggleAutoReconnect: () => void;
    toggleMenu: () => void;
    closeMenu: () => void;
}

export function useReceiptPrinter(config: ReceiptPrinterConfig = {}): UseReceiptPrinterResult {
    const institutionName = config.institutionName ?? '';
    const institutionAddress = config.institutionAddress ?? '';
    const institutionPhone = config.institutionPhone ?? '';
    const receiptSettings = config.receiptSettings ?? {};

    const [state, setState] = useState<PrinterState>(initialState);

    // "latest ref" mirror so imperative async methods below never read a
    // stale value from an old render's closure (same trick Alpine gets for
    // free via `this`).
    const stateRef = useRef<PrinterState>(state);
    const patch = useCallback((partial: Partial<PrinterState>) => {
        stateRef.current = { ...stateRef.current, ...partial };
        setState(stateRef.current);
    }, []);

    const deviceRef = useRef<BluetoothDevice | null>(null);
    const serverRef = useRef<BluetoothRemoteGATTServer | null>(null);
    const restoreInProgressRef = useRef(false);
    const reconnectAttemptsRef = useRef(0);

    const fail = useCallback(
        (message: string) => {
            patch({ lastError: message, status: 'error' });
        },
        [patch],
    );

    const isReady = useCallback(() => {
        return Boolean(deviceRef.current && serverRef.current?.connected);
    }, []);

    const savePrefs = useCallback((next: ReceiptPrinterPrefs) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

            // Same key pattern as the POS PrinterManager, for consistency.
            if (next.deviceId) {
                localStorage.setItem(`printer_device_${ROLE}`, next.deviceId);
            } else {
                localStorage.removeItem(`printer_device_${ROLE}`);
            }
        } catch {
            // Ignore (private mode, quota, etc).
        }
    }, []);

    const loadPrefs = useCallback((): Partial<PrinterState> => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const legacyId = localStorage.getItem(`printer_device_${ROLE}`);

            if (raw) {
                const prefs = JSON.parse(raw) as Partial<ReceiptPrinterPrefs>;

                return {
                    paperWidth: prefs.paperWidth === 80 ? 80 : 58,
                    deviceName: prefs.deviceName ?? '',
                    deviceId: prefs.deviceId ?? legacyId ?? '',
                    autoReconnectEnabled: prefs.autoReconnectEnabled !== false,
                };
            }

            // Compatibility with POS-style key if ever shared on same origin.
            if (legacyId) {
                return { deviceId: legacyId };
            }

            return {};
        } catch {
            return {};
        }
    }, []);

    const statusLabel = useCallback((): string => {
        const s = stateRef.current;

        if (s.status === 'connected') {
            return shortName() || 'Terhubung';
        }

        if (s.status === 'pairing') {
            return 'Pilih printer...';
        }

        if (s.status === 'connecting') {
            return 'Menghubungkan...';
        }

        if (s.status === 'error') {
            return shortError();
        }

        return s.deviceId ? 'Tidak terhubung' : 'Belum dipasang';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const shortName = useCallback((): string => {
        const name = String(stateRef.current.deviceName || '');

        return name.length > 16 ? `${name.slice(0, 14)}…` : name;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const shortError = useCallback((): string => {
        const message = String(stateRef.current.lastError || 'Error');

        return message.length > 24 ? `${message.slice(0, 22)}…` : message;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const statusTone = useCallback((): string => {
        const tones: Record<PrinterStatus, string> = {
            connected: 'bg-success-500',
            pairing: 'bg-sky-400 animate-pulse',
            connecting: 'bg-orange-400 animate-pulse',
            error: 'bg-error-500',
            idle: 'bg-white/35',
        };

        return tones[stateRef.current.status] ?? 'bg-white/35';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    /**
     * Pair printer (user gesture) — mirrors POS setupPrinter().
     */
    const pairPrinter = useCallback(async (): Promise<boolean> => {
        if (!stateRef.current.supported) {
            fail('Web Bluetooth tidak tersedia. Gunakan Chrome/Edge.');

            return false;
        }

        patch({ status: 'pairing', lastError: '' });

        try {
            const device = await bluetoothService.requestDevice();
            deviceRef.current = device;

            const deviceName = device.name || 'Thermal Printer';
            const deviceId = device.id || '';
            patch({ deviceName, deviceId });
            savePrefs({
                paperWidth: stateRef.current.paperWidth,
                deviceName,
                deviceId,
                autoReconnectEnabled: stateRef.current.autoReconnectEnabled,
            });

            patch({ status: 'connecting' });
            serverRef.current = await bluetoothService.connect(device, 3);
            reconnectAttemptsRef.current = 0;
            patch({ status: 'connected', lastError: '', menuOpen: false });

            return true;
        } catch (error) {
            if ((error as { name?: string })?.name === 'NotFoundError') {
                patch({ status: 'idle', lastError: 'Printer tidak dipilih.' });

                return false;
            }

            fail(friendlyError(error));

            return false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fail, patch, savePrefs]);

    /**
     * Restore saved device id via getDevices() then connect — mirrors POS loadSavedDevices().
     */
    const loadSavedDeviceAndConnect = useCallback(
        async ({ silent = false }: { silent?: boolean } = {}): Promise<boolean> => {
            if (restoreInProgressRef.current) {
                return false;
            }

            if (!stateRef.current.supported) {
                return false;
            }

            if (!stateRef.current.deviceId && !stateRef.current.autoReconnectEnabled) {
                return false;
            }

            const savedId = stateRef.current.deviceId || localStorage.getItem(`printer_device_${ROLE}`);

            if (!savedId) {
                return false;
            }

            if (isReady()) {
                patch({ status: 'connected' });

                return true;
            }

            restoreInProgressRef.current = true;

            if (!silent) {
                patch({ status: 'connecting', lastError: '' });
            } else if (stateRef.current.status !== 'connected') {
                patch({ status: 'connecting' });
            }

            try {
                const permitted = await bluetoothService.getDevices();
                const device = permitted.find((item) => item.id === savedId);

                if (!device) {
                    deviceRef.current = null;
                    serverRef.current = null;
                    patch({ status: 'idle', lastError: 'Izin printer hilang. Pasangkan ulang.' });

                    return false;
                }

                deviceRef.current = device;
                const deviceName = device.name || stateRef.current.deviceName || 'Thermal Printer';
                patch({ deviceName, deviceId: device.id });
                savePrefs({
                    paperWidth: stateRef.current.paperWidth,
                    deviceName,
                    deviceId: device.id,
                    autoReconnectEnabled: stateRef.current.autoReconnectEnabled,
                });

                // Limit aggressive auto-reconnect: 1 silent attempt per page load unless manual.
                if (silent && reconnectAttemptsRef.current >= 1) {
                    patch({ status: 'idle', lastError: 'Belum terhubung. Tekan Sambungkan.' });

                    return false;
                }

                reconnectAttemptsRef.current += 1;
                serverRef.current = await bluetoothService.connect(device, silent ? 1 : 3);
                patch({ status: 'connected', lastError: '' });

                return true;
            } catch (error) {
                serverRef.current = null;

                const message = silent
                    ? 'Gagal sambung otomatis. Pastikan printer nyala/dekat.'
                    : friendlyError(error);

                patch({ status: silent ? 'idle' : 'error', lastError: message });

                return false;
            } finally {
                restoreInProgressRef.current = false;
            }
        },
        [isReady, patch, savePrefs],
    );

    const autoReconnect = useCallback(async (): Promise<boolean> => {
        reconnectAttemptsRef.current = 0;

        return loadSavedDeviceAndConnect({ silent: false });
    }, [loadSavedDeviceAndConnect]);

    const ensureConnection = useCallback(async (): Promise<BluetoothRemoteGATTServer> => {
        if (isReady() && serverRef.current) {
            return serverRef.current;
        }

        if (!deviceRef.current && stateRef.current.deviceId) {
            const ok = await loadSavedDeviceAndConnect({ silent: false });

            if (!ok || !serverRef.current) {
                throw new Error(stateRef.current.lastError || 'Printer belum siap');
            }

            return serverRef.current;
        }

        if (!deviceRef.current) {
            throw new Error('Printer belum dipasangkan');
        }

        patch({ status: 'connecting' });
        serverRef.current = await bluetoothService.connect(deviceRef.current, 3);
        patch({ status: 'connected', lastError: '' });

        return serverRef.current;
    }, [isReady, loadSavedDeviceAndConnect, patch]);

    const printTicket = useCallback(
        async (ticket: Ticket): Promise<boolean> => {
            if (!ticket?.ticket_number) {
                return false;
            }

            try {
                const server = await ensureConnection();
                const payload = await encodeEscPosReceipt(ticket, {
                    paperWidth: stateRef.current.paperWidth,
                    institutionName,
                    institutionAddress,
                    institutionPhone,
                    receiptSettings,
                });

                await bluetoothService.print(server, payload);
                patch({ status: 'connected', lastError: '' });

                return true;
            } catch (error) {
                serverRef.current = null;
                fail(friendlyError(error));

                return false;
            }
        },
        [ensureConnection, fail, institutionAddress, institutionName, institutionPhone, patch, receiptSettings],
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
        bluetoothService.disconnect(deviceRef.current);
        serverRef.current = null;
        patch({ status: 'idle', lastError: '', menuOpen: false });
    }, [patch]);

    const forgetPrinter = useCallback(async (): Promise<void> => {
        bluetoothService.disconnect(deviceRef.current);
        deviceRef.current = null;
        serverRef.current = null;
        reconnectAttemptsRef.current = 0;
        patch({ deviceName: '', deviceId: '', lastError: '', status: 'idle', menuOpen: false });
        savePrefs({
            paperWidth: stateRef.current.paperWidth,
            deviceName: '',
            deviceId: '',
            autoReconnectEnabled: stateRef.current.autoReconnectEnabled,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patch, savePrefs]);

    const setPaperWidth = useCallback(
        (width: PaperWidth) => {
            const paperWidth = width === 80 ? 80 : 58;
            patch({ paperWidth });
            savePrefs({
                paperWidth,
                deviceName: stateRef.current.deviceName,
                deviceId: stateRef.current.deviceId,
                autoReconnectEnabled: stateRef.current.autoReconnectEnabled,
            });
        },
        [patch, savePrefs],
    );

    const toggleAutoReconnect = useCallback(() => {
        const autoReconnectEnabled = !stateRef.current.autoReconnectEnabled;
        patch({ autoReconnectEnabled });
        savePrefs({
            paperWidth: stateRef.current.paperWidth,
            deviceName: stateRef.current.deviceName,
            deviceId: stateRef.current.deviceId,
            autoReconnectEnabled,
        });

        if (autoReconnectEnabled) {
            void loadSavedDeviceAndConnect({ silent: true });
        }
    }, [loadSavedDeviceAndConnect, patch, savePrefs]);

    const toggleMenu = useCallback(() => {
        patch({ menuOpen: !stateRef.current.menuOpen });
    }, [patch]);

    const closeMenu = useCallback(() => {
        patch({ menuOpen: false });
    }, [patch]);

    // Mount-time init, mirrors Alpine's init(): detect support, load prefs,
    // wire the disconnect + visibility listeners, then try a silent reconnect.
    useEffect(() => {
        patch({
            supported: bluetoothService.isSupported(),
            ...loadPrefs(),
        });

        const handlePrinterDisconnected = (event: WindowEventMap['kiosk-printer-disconnected']) => {
            const device = event.detail?.device;

            if (device && stateRef.current.deviceId && device.id !== stateRef.current.deviceId) {
                return;
            }

            serverRef.current = null;
            patch({ status: 'idle', lastError: 'Printer terputus.' });
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && stateRef.current.autoReconnectEnabled) {
                void loadSavedDeviceAndConnect({ silent: true });
            }
        };

        window.addEventListener('kiosk-printer-disconnected', handlePrinterDisconnected);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        void loadSavedDeviceAndConnect({ silent: true });

        return () => {
            window.removeEventListener('kiosk-printer-disconnected', handlePrinterDisconnected);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        // Intentionally run once on mount, like Alpine's init().
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        ...state,
        isReady,
        statusLabel,
        statusTone,
        shortName,
        shortError,
        pairPrinter,
        loadSavedDeviceAndConnect,
        autoReconnect,
        ensureConnection,
        printTicket,
        testPrint,
        disconnect,
        forgetPrinter,
        setPaperWidth,
        toggleAutoReconnect,
        toggleMenu,
        closeMenu,
    };
}

function friendlyError(error: unknown): string {
    const err = error as { name?: string; message?: string } | undefined;
    const name = err?.name ?? '';
    const message = String(err?.message ?? '');

    if (name === 'NotFoundError') {
        return 'Printer tidak ditemukan';
    }

    if (name === 'SecurityError') {
        return 'Izin ditolak — pakai HTTPS/localhost';
    }

    if (name === 'NetworkError' || message.includes('no longer in range') || message.includes('Timeout')) {
        return 'Printer di luar jangkauan / timeout';
    }

    return message || 'Koneksi Bluetooth gagal';
}