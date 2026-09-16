'use client';

/**
 * Example wiring for useKioskShell — the visual counterpart of the Alpine
 * markup that read `statusLabel()`, `statusTone()`, `menuOpen`, etc.
 * Tweak the Tailwind classes to match your design system; the color
 * mapping mirrors the original `statusTone()` (success/sky/orange/error/idle).
 *
 * Reads the shared printer instance from context — must be rendered inside
 * a <KioskShellProvider>. See context/KioskShellContext.tsx.
 */

import { useKioskShellContext } from '@/context/KioskShellContext';

const TONE_CLASSES: Record<string, string> = {
    'bg-success-500': 'bg-green-500',
    'bg-sky-400 animate-pulse': 'bg-sky-400 animate-pulse',
    'bg-orange-400 animate-pulse': 'bg-amber-400 animate-pulse',
    'bg-error-500': 'bg-red-500',
    'bg-white/35': 'bg-white/40',
};

export function PrinterStatusBadge() {
    const printer = useKioskShellContext();

    return (
        <div className="relative inline-flex items-center gap-2 text-sm text-white">
            <button
                type="button"
                onClick={printer.toggleMenu}
                className="flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5"
            >
                <span className={`h-2.5 w-2.5 rounded-full ${TONE_CLASSES[printer.statusTone()] ?? 'bg-white/40'}`} />
                <span>{printer.statusLabel()}</span>
            </button>

            {printer.menuOpen && (
                <div className="absolute right-0 top-full z-10 mt-2 w-56 rounded-lg bg-neutral-900 p-2 text-neutral-100 shadow-lg">
                    {!printer.supported && (
                        <p className="px-2 py-1 text-xs text-red-400">Web Bluetooth tidak tersedia di browser ini.</p>
                    )}

                    <button
                        type="button"
                        onClick={() => void printer.pairPrinter()}
                        className="block w-full rounded px-2 py-1.5 text-left hover:bg-white/10"
                    >
                        Pasangkan printer
                    </button>

                    <button
                        type="button"
                        onClick={() => void printer.autoReconnect()}
                        className="block w-full rounded px-2 py-1.5 text-left hover:bg-white/10"
                        disabled={!printer.deviceId}
                    >
                        Sambungkan ulang
                    </button>

                    <button
                        type="button"
                        onClick={() => void printer.testPrint()}
                        className="block w-full rounded px-2 py-1.5 text-left hover:bg-white/10"
                        disabled={printer.status !== 'connected'}
                    >
                        Cetak tes
                    </button>

                    <div className="my-1 flex items-center justify-between px-2 py-1">
                        <span>Kertas 80mm</span>
                        <input
                            type="checkbox"
                            checked={printer.paperWidth === 80}
                            onChange={(event) => printer.setPaperWidth(event.target.checked ? 80 : 58)}
                        />
                    </div>

                    <div className="my-1 flex items-center justify-between px-2 py-1">
                        <span>Sambung otomatis</span>
                        <input
                            type="checkbox"
                            checked={printer.autoReconnectEnabled}
                            onChange={printer.toggleAutoReconnect}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => void printer.disconnect()}
                        className="block w-full rounded px-2 py-1.5 text-left hover:bg-white/10"
                        disabled={printer.status !== 'connected'}
                    >
                        Putuskan
                    </button>

                    <button
                        type="button"
                        onClick={() => void printer.forgetPrinter()}
                        className="block w-full rounded px-2 py-1.5 text-left text-red-400 hover:bg-white/10"
                        disabled={!printer.deviceId}
                    >
                        Lupakan printer
                    </button>
                </div>
            )}
        </div>
    );
}
