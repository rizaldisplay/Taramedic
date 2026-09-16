'use client';

/**
 * Client boundary for the kiosk printer widget. Anything that needs a
 * browser-only hook (useRouter, useState, etc.) or a non-serializable
 * value (a plain function) has to live on this side of the boundary —
 * a Server Component can hand it *data*, never a function.
 */

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { PrinterStatusBadge } from '@/features/kiosq/PrinterStatusBadge';
import { KioskShellProvider } from '@/context/KioskShellContext';

export interface KioskPrinterWidgetProps {
    institutionName?: string;
    institutionAddress?: string;
    institutionPhone?: string;
    idleSeconds?: number;
    /** Pass true while a ticket/success screen is showing, to pause the idle timer. */
    isPaused?: boolean;
    /** Where "resetKiosk" should send the kiosk back to. Defaults to this page. */
    idleRedirectTo?: string;
    /**
     * Your multi-step kiosk flow (StepForm, StepSuccess, ...). Rendered
     * inside the same provider as the status badge, so they share one
     * printer connection. Optional here just so this file still works if
     * you only want the badge on its own for now.
     */
    children?: ReactNode;
}

export function KioskPrinterWidget({
    institutionName,
    institutionAddress,
    institutionPhone,
    idleSeconds = 60,
    isPaused = false,
    idleRedirectTo = '/kiosk',
    children,
}: KioskPrinterWidgetProps) {
    const router = useRouter();

    return (
        <KioskShellProvider
            institutionName={institutionName}
            institutionAddress={institutionAddress}
            institutionPhone={institutionPhone}
            idleSeconds={idleSeconds}
            isPaused={isPaused}
            // This is the $wire?.resetKiosk?.() equivalent — swap for
            // whatever "go back to the idle screen" means in your app.
            onIdle={() => router.push(idleRedirectTo)}
        >
            <PrinterStatusBadge />
            {children}
        </KioskShellProvider>
    );
}