/**
 * app/kiosk/page.tsx — routes to /kiosk
 *
 * Stays a plain (Server Component) page: this is where you'd fetch the
 * institution/settings row from your DB or API. Only serializable data
 * crosses into <KioskPrinterWidget>; the interactive bits (onIdle, the
 * hooks) live entirely on the client side, in KioskPrinterWidget.tsx.
 */

import { KioskPrinterWidget } from '@/features/kiosq/KioskPrinter';

// import { getKioskSettings } from '@/lib/kiosk-settings'; // your own data source

export default async function KioskPrinterPage() {
    // const settings = await getKioskSettings();
    const settings = {
        institutionName: 'Puskesmas Melati',
        idleSeconds: 60,
    };

    return (
        <main className="flex min-h-dvh items-center justify-end bg-neutral-950 p-4">
            <KioskPrinterWidget institutionName={settings.institutionName} idleSeconds={settings.idleSeconds} />
        </main>
    );
}
