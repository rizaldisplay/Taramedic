'use client';

/**
 * Combines the printer controller and the idle timer, mirroring Alpine's
 *
 *   Alpine.data('kioskShell', (config, fallbackIdleSeconds = 60) => ({
 *       ...createReceiptPrinterController(config),
 *       idleTimer, idleSeconds, boot(), resetIdle(),
 *   }));
 *
 * Usage in a page/component:
 *
 *   const shell = useKioskShell({
 *       institutionName: 'Puskesmas Melati',
 *       idleSeconds: 60,
 *       isPaused: Boolean(issuedTicket),   // pause while showing the ticket
 *       onIdle: () => router.push('/kiosk'), // your "resetKiosk" equivalent
 *   });
 *
 *   shell.printTicket(ticket);
 *   shell.statusLabel();
 *   <div onClick={shell.resetIdle}>...</div>
 */

import type { ReceiptPrinterConfig } from '@/types/printer';

import { useKioskIdleTimer, type UseKioskIdleTimerOptions } from './useKioskIdleTimer';
import { useReceiptPrinter, type UseReceiptPrinterResult } from './useReceiptPrinter';

export interface UseKioskShellOptions extends ReceiptPrinterConfig {
    idleSeconds?: number;
    isPaused?: boolean;
    onIdle: UseKioskIdleTimerOptions['onIdle'];
    resetOnActivity?: boolean;
}

export interface UseKioskShellResult extends UseReceiptPrinterResult {
    resetIdle: () => void;
}

export function useKioskShell({
    idleSeconds,
    isPaused,
    onIdle,
    resetOnActivity,
    ...printerConfig
}: UseKioskShellOptions): UseKioskShellResult {
    const printer = useReceiptPrinter(printerConfig);
    const { resetIdle } = useKioskIdleTimer({ idleSeconds, isPaused, onIdle, resetOnActivity });

    return { ...printer, resetIdle };
}