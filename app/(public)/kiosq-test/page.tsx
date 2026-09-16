'use client';

/**
 * DEV-ONLY preview route — exercises StepSuccess and the real printer
 * connection with dummy ticket data, without needing the full multi-step
 * registration form or a live API. Countdown auto-cycles and hands out a
 * fresh dummy ticket each time, so you can repeatedly hit "Cetak Tiket"
 * against real hardware.
 *
 * Delete this route (or gate it behind an env check, e.g.
 * `if (process.env.NODE_ENV === 'production') notFound();`) before
 * shipping to production kiosks.
 */

import { useEffect, useState } from 'react';

import { StepSuccess } from '@/features/kiosq/StepSuccess';
import { KioskShellProvider } from '@/context/KioskShellContext';
import { createDummyTicket } from '@/lib/kiosk/dummy-ticket';
import type { Penjamin, StatusPasien } from '@/types/kiosk';

// Placeholders — swap these two for real members of the Penjamin /
// StatusPasien unions in your own types/kiosk.ts.
const DUMMY_PENJAMIN = 'BPJS' as Penjamin;
const DUMMY_STATUS = 'BARU' as StatusPasien;
const RESET_SECONDS = 30;

export default function DevSuccessPreviewPage() {
    const [countdown, setCountdown] = useState(RESET_SECONDS);
    const [ticket, setTicket] = useState(() => createDummyTicket({ penjamin: DUMMY_PENJAMIN }));

    const handleDone = () => {
        setTicket(createDummyTicket({ penjamin: DUMMY_PENJAMIN }));
        setCountdown(RESET_SECONDS);
    };

    useEffect(() => {
        if (countdown <= 0) {
            handleDone();

            return;
        }

        const timer = setTimeout(() => setCountdown((seconds) => seconds - 1), 1000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown]);

    return (
        <KioskShellProvider institutionName="Puskesmas Melati" idleSeconds={9999} isPaused onIdle={() => {}}>
            <main className="flex min-h-dvh items-center justify-center bg-slate-50 p-4">
                <StepSuccess
                    status={DUMMY_STATUS}
                    penjamin={DUMMY_PENJAMIN}
                    countdown={countdown}
                    ticket={ticket}
                    onDone={handleDone}
                />
            </main>
        </KioskShellProvider>
    );
}
