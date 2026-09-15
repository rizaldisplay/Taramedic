import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export type RealtimeStatus =
    | 'initialized'
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'unavailable'
    | 'failed';

interface RealtimeState {
    echo: Echo<'reverb'> | null;
    status: RealtimeStatus;
    connectionListenersBound: boolean;
    listeners: Set<(status: RealtimeStatus) => void>;
}

declare global {
    interface Window {
        Pusher?: typeof Pusher;
        Echo?: Echo<'reverb'>;
    }
}

const globalState = globalThis as typeof globalThis & {
    __queueRealtimeState?: RealtimeState;
};

const state: RealtimeState = (globalState.__queueRealtimeState ??= {
    echo: null,
    status: 'initialized',
    connectionListenersBound: false,
    listeners: new Set(),
});

const updateStatus = (status: RealtimeStatus) => {
    state.status = status;

    if (typeof document !== 'undefined') {
        document.documentElement.dataset.realtimeStatus = status;
    }

    state.listeners.forEach((listener) => listener(status));
};

const bindConnectionLifecycle = (echo: Echo<'reverb'>) => {
    const connection = echo.connector?.pusher?.connection;

    if (! connection || state.connectionListenersBound) {
        return;
    }

    connection.bind('state_change', ({ current }: { current: RealtimeStatus }) => {
        updateStatus(current);

        if (current === 'connected') {
            console.info('[Queue] Echo tersambung ke Reverb');
        } else if (current === 'disconnected' || current === 'failed' || current === 'unavailable') {
            console.warn(`[Queue] Status koneksi Reverb: ${current}`);
        }
    });

    connection.bind('error', (error: unknown) => {
        console.error('[Queue] Koneksi Reverb gagal', error);
    });

    state.connectionListenersBound = true;
    updateStatus((connection.state as RealtimeStatus) ?? 'initialized');
};

/**
 * Membuat (atau mengambil ulang) instance Echo. Aman dipanggil berkali-kali.
 * Mengembalikan null bila dijalankan di server atau env belum diisi.
 */
export const getEcho = (): Echo<'reverb'> | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const reverbKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY;

    if (! reverbKey) {
        console.warn(
            '[Queue] NEXT_PUBLIC_REVERB_APP_KEY tidak ditemukan. Real-time nonaktif — isi .env.local lalu restart dev server.',
        );

        return null;
    }

    if (state.echo) {
        return state.echo;
    }

    const reverbHost = String(process.env.NEXT_PUBLIC_REVERB_HOST ?? window.location.hostname)
        .replace(/^https?:\/\//, '')
        .replace(/\/+$/, '');

    window.Pusher = Pusher;

    state.echo = new Echo({
        broadcaster: 'reverb',
        key: reverbKey,
        wsHost: reverbHost,
        wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
        wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 443),
        forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });

    window.Echo = state.echo;
    bindConnectionLifecycle(state.echo);

    return state.echo;
};

export const realtimeStatus = (): RealtimeStatus => state.status;

export const subscribeRealtimeStatus = (
    listener: (status: RealtimeStatus) => void,
): (() => void) => {
    state.listeners.add(listener);

    return () => {
        state.listeners.delete(listener);
    };
};