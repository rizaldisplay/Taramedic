'use client';

/**
 * Shares ONE useKioskShell instance across the whole kiosk flow (idle-screen,
 * form steps, success screen, status badge, ...). Without this, every
 * component that called useKioskShell/useReceiptPrinter directly would open
 * its own independent Bluetooth connection — wrong device state, duplicate
 * event listeners, duplicate localStorage reads.
 *
 * Wrap the flow ONCE, near the top (e.g. in KioskPrinterWidget.tsx or your
 * multi-step kiosk container):
 *
 *   <KioskShellProvider institutionName="..." idleSeconds={60} isPaused={step === 'success'} onIdle={...}>
 *     <KioskFlow />   // StepForm, StepSuccess, PrinterStatusBadge, etc.
 *   </KioskShellProvider>
 *
 * Then, anywhere inside it:
 *
 *   const printer = useKioskShellContext();
 *   printer.printTicket(ticket);
 */

import { createContext, useContext, type ReactNode } from 'react';

import { useKioskShell, type UseKioskShellOptions, type UseKioskShellResult } from '@/hooks/useKioskShell';

const KioskShellContext = createContext<UseKioskShellResult | null>(null);

export interface KioskShellProviderProps extends UseKioskShellOptions {
    children: ReactNode;
}

export function KioskShellProvider({ children, ...options }: KioskShellProviderProps) {
    const shell = useKioskShell(options);

    return <KioskShellContext.Provider value={shell}>{children}</KioskShellContext.Provider>;
}

export function useKioskShellContext(): UseKioskShellResult {
    const ctx = useContext(KioskShellContext);

    if (!ctx) {
        throw new Error('useKioskShellContext must be used within a <KioskShellProvider>.');
    }

    return ctx;
}
