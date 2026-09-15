/**
 * Versi React-friendly dari pengelolaan video display.
 * Di Laravel elemen dicari lewat `document.querySelectorAll('.display-tv-video video')`.
 * Di Next.js komponen mendaftarkan ref-nya sendiri ke registry ini.
 */

export interface DisplayMediaOptions {
    /** Video latar yang memang selalu bisu (mis. hanya visual). */
    preferMuted?: boolean;
    /** Volume normal 0 - 100. */
    normalVolume?: number;
    /** Volume saat pengumuman berjalan, 0 - 100. */
    duckVolume?: number;
}

interface RegisteredMedia extends Required<DisplayMediaOptions> {
    element: HTMLMediaElement;
    ducked: boolean;
    previousMuted: boolean;
    autoMuted: boolean;
}

const globalState = globalThis as typeof globalThis & {
    __displayMediaRegistry?: Set<RegisteredMedia>;
};

const registry: Set<RegisteredMedia> = (globalState.__displayMediaRegistry ??= new Set());

const clampVolume = (value: number, fallback: number): number => {
    const numericValue = Number(value);

    return Math.min(100, Math.max(0, Number.isFinite(numericValue) ? numericValue : fallback));
};

export const registerDisplayMedia = (
    element: HTMLMediaElement,
    options: DisplayMediaOptions = {},
): (() => void) => {
    const entry: RegisteredMedia = {
        element,
        preferMuted: options.preferMuted ?? false,
        normalVolume: clampVolume(options.normalVolume ?? 25, 25),
        duckVolume: clampVolume(options.duckVolume ?? 4, 4),
        ducked: false,
        previousMuted: element.muted,
        autoMuted: false,
    };

    registry.add(entry);

    return () => {
        registry.delete(entry);
    };
};

const fadeVolume = (media: HTMLMediaElement, targetVolume: number, durationMs: number): Promise<void> =>
    new Promise((resolve) => {
        const startVolume = media.volume;
        const startedAt = performance.now();

        const step = (timestamp: number) => {
            const progress = Math.min(1, (timestamp - startedAt) / durationMs);

            media.volume = startVolume + (targetVolume - startVolume) * progress;

            if (progress < 1) {
                requestAnimationFrame(step);

                return;
            }

            resolve();
        };

        requestAnimationFrame(step);
    });

export const duckDisplayMedia = async (): Promise<void> => {
    const fades: Promise<void>[] = [];

    registry.forEach((entry) => {
        if (entry.ducked || entry.preferMuted) {
            return;
        }

        entry.ducked = true;
        entry.previousMuted = entry.element.muted;

        const duckVolume = entry.duckVolume / 100;

        if (entry.element.muted) {
            entry.element.volume = duckVolume;

            return;
        }

        fades.push(fadeVolume(entry.element, duckVolume, 220));
    });

    await Promise.all(fades);
};

export const restoreDisplayMedia = async (): Promise<void> => {
    const fades: Promise<void>[] = [];

    registry.forEach((entry) => {
        if (! entry.ducked) {
            return;
        }

        entry.ducked = false;

        const shouldStayMuted = entry.preferMuted || (entry.previousMuted && ! entry.autoMuted);

        if (shouldStayMuted) {
            entry.element.muted = true;

            return;
        }

        entry.element.muted = false;
        fades.push(fadeVolume(entry.element, entry.normalVolume / 100, 550));
    });

    await Promise.all(fades);
};

/** Dipanggil saat pengguna menekan tombol "Aktifkan suara". */
export const enableDisplayMediaSound = async (): Promise<boolean> => {
    const results = await Promise.all(
        [...registry].map(async (entry) => {
            if (entry.preferMuted) {
                entry.element.muted = true;

                return false;
            }

            entry.element.muted = false;
            entry.element.volume = (entry.ducked ? entry.duckVolume : entry.normalVolume) / 100;

            try {
                await entry.element.play();
                entry.autoMuted = false;

                return true;
            } catch {
                entry.element.muted = true;
                entry.autoMuted = true;

                return false;
            }
        }),
    );

    return results.some(Boolean);
};