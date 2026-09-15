import type { TtsStyle } from '@/types/announcement';
import type {
    OfflineTtsRequest,
    OfflineTtsResponse,
    OfflineTtsStatusSnapshot,
    SpeechSegment,
} from '@/types/tts';

const MAX_CACHED_UTTERANCES = 8;
const REQUEST_TIMEOUT_MS = 90_000;
const VOICE_ID = 'id_ID-news_tts-medium';

/** Hasil sintesis: blob WAV plus durasi asli dalam ms, dihitung dari jumlah sampel PCM. */
export interface SynthesizedAudio {
    blob: Blob;
    durationMs: number;
}

interface PendingRequest {
    resolve: (value: SynthesizedAudio | true) => void;
    reject: (reason: Error) => void;
    timeoutId: ReturnType<typeof setTimeout>;
}

interface OfflineTtsState {
    worker: Worker | null;
    pendingRequests: Map<number, PendingRequest>;
    pendingSyntheses: Map<string, Promise<SynthesizedAudio>>;
    synthesisCache: Map<string, SynthesizedAudio>;
    listeners: Set<(snapshot: OfflineTtsStatusSnapshot) => void>;
    snapshot: OfflineTtsStatusSnapshot;
    requestSequence: number;
}

/**
 * Disimpan di globalThis supaya Fast Refresh di dev tidak membuat worker ganda.
 */
const globalState = globalThis as typeof globalThis & {
    __offlineTtsState?: OfflineTtsState;
};

const state: OfflineTtsState = (globalState.__offlineTtsState ??= {
    worker: null,
    pendingRequests: new Map(),
    pendingSyntheses: new Map(),
    synthesisCache: new Map(),
    listeners: new Set(),
    snapshot: { status: 'idle', message: 'TTS offline belum dimuat.' },
    requestSequence: 0,
});

const wavBlob = (pcm: Float32Array, sampleRate: number): Blob => {
    const bytesPerSample = 2;
    const buffer = new ArrayBuffer(44 + pcm.length * bytesPerSample);
    const view = new DataView(buffer);
    const writeText = (offset: number, text: string) => {
        for (let index = 0; index < text.length; index += 1) {
            view.setUint8(offset + index, text.charCodeAt(index));
        }
    };

    writeText(0, 'RIFF');
    view.setUint32(4, 36 + pcm.length * bytesPerSample, true);
    writeText(8, 'WAVE');
    writeText(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * bytesPerSample, true);
    view.setUint16(32, bytesPerSample, true);
    view.setUint16(34, 16, true);
    writeText(36, 'data');
    view.setUint32(40, pcm.length * bytesPerSample, true);

    for (let index = 0; index < pcm.length; index += 1) {
        const sample = Math.max(-1, Math.min(1, pcm[index]));

        view.setInt16(44 + index * bytesPerSample, sample < 0 ? sample * 32768 : sample * 32767, true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
};

const publishStatus = (snapshot: OfflineTtsStatusSnapshot) => {
    state.snapshot = snapshot;
    state.listeners.forEach((listener) => listener(snapshot));
};

const handleMessage = ({ data }: MessageEvent<OfflineTtsResponse>) => {
    if (data?.type === 'status') {
        publishStatus({ status: data.status, message: data.detail });

        return;
    }

    const request = state.pendingRequests.get(data?.requestId);

    if (! request) {
        return;
    }

    state.pendingRequests.delete(data.requestId);
    clearTimeout(request.timeoutId);

    if (data.type === 'error') {
        request.reject(new Error(data.message));

        return;
    }

    if (data.type === 'audio') {
        request.resolve({
            blob: wavBlob(new Float32Array(data.pcm), data.sampleRate),
            durationMs: data.durationMs,
        });

        return;
    }

    request.resolve(true);
};

const getWorker = (): Worker => {
    if (typeof window === 'undefined') {
        throw new Error('TTS offline hanya dapat dijalankan di browser.');
    }

    if (! state.worker) {
        state.worker = new Worker(new URL('../../workers/offline-tts.worker.ts', import.meta.url), {
            type: 'module',
        });
        state.worker.addEventListener('message', handleMessage as EventListener);
        state.worker.addEventListener('error', (event) => {
            publishStatus({ status: 'error', message: event.message || 'Worker TTS offline gagal dimuat.' });
        });
    }

    return state.worker;
};

const request = (
    type: 'initialize' | 'synthesize',
    payload: Record<string, unknown> = {},
): Promise<SynthesizedAudio | true> =>
    new Promise((resolve, reject) => {
        let worker: Worker;

        try {
            worker = getWorker();
        } catch (error) {
            reject(error instanceof Error ? error : new Error(String(error)));

            return;
        }

        const requestId = ++state.requestSequence;
        const timeoutId = setTimeout(() => {
            state.pendingRequests.delete(requestId);
            reject(new Error('TTS offline melewati batas waktu 90 detik.'));
        }, REQUEST_TIMEOUT_MS);

        state.pendingRequests.set(requestId, { resolve, reject, timeoutId });
        worker.postMessage({ type, requestId, ...payload } as OfflineTtsRequest);
    });

export const initializeOfflineTts = (): Promise<true> =>
    request('initialize') as Promise<true>;

export const synthesizeOfflineTts = (
    segments: SpeechSegment[],
    speed = 0.8,
    style: TtsStyle = 'natural',
): Promise<SynthesizedAudio> => {
    const cacheKey = `${VOICE_ID}|${speed}|${style}|${JSON.stringify(segments)}`;
    const cached = state.synthesisCache.get(cacheKey);

    if (cached) {
        // Refresh posisi LRU.
        state.synthesisCache.delete(cacheKey);
        state.synthesisCache.set(cacheKey, cached);

        return Promise.resolve(cached);
    }

    const inFlight = state.pendingSyntheses.get(cacheKey);

    if (inFlight) {
        return inFlight;
    }

    const synthesisPromise = (request('synthesize', { segments, speed, style }) as Promise<SynthesizedAudio>)
        .then((result) => {
            state.synthesisCache.set(cacheKey, result);

            while (state.synthesisCache.size > MAX_CACHED_UTTERANCES) {
                const oldestKey = state.synthesisCache.keys().next().value;

                if (oldestKey === undefined) {
                    break;
                }

                state.synthesisCache.delete(oldestKey);
            }

            return result;
        })
        .finally(() => state.pendingSyntheses.delete(cacheKey));

    state.pendingSyntheses.set(cacheKey, synthesisPromise);

    return synthesisPromise;
};

export const offlineTtsStatus = (): OfflineTtsStatusSnapshot => state.snapshot;

/** Dipakai oleh useSyncExternalStore di hook React. */
export const subscribeOfflineTtsStatus = (
    listener: (snapshot: OfflineTtsStatusSnapshot) => void,
): (() => void) => {
    state.listeners.add(listener);

    return () => {
        state.listeners.delete(listener);
    };
};