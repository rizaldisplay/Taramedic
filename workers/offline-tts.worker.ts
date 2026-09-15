/// <reference lib="webworker" />

import createPiperPhonemize from '@diffusionstudio/piper-wasm';
import * as ort from 'onnxruntime-web/wasm';

import type {
    OfflineTtsRequest,
    OfflineTtsResponse,
    OfflineTtsStatus,
    PiperVoiceConfig,
    SpeechSegment,
} from '@/types/tts';
import type { TtsStyle } from '@/types/announcement';

declare const self: DedicatedWorkerGlobalScope;

const MODEL_BASE = '/tts/models/id_ID-news_tts-medium/id_ID-news_tts-medium.onnx';
const PIPER_RUNTIME_BASE = '/tts/runtime/piper/piper_phonemize';
const ONNX_RUNTIME_BASE = '/tts/runtime/onnx/';

let modelConfig: PiperVoiceConfig | null = null;
let inferenceSession: ort.InferenceSession | null = null;
let initializationPromise: Promise<void> | null = null;

const post = (message: OfflineTtsResponse, transfer?: Transferable[]) => {
    if (transfer) {
        self.postMessage(message, transfer);

        return;
    }

    self.postMessage(message);
};

const postStatus = (status: OfflineTtsStatus, detail = '') => {
    post({ type: 'status', status, detail });
};

const initialize = async (): Promise<void> => {
    if (inferenceSession && modelConfig) {
        return;
    }

    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = (async () => {
        postStatus('loading', 'Memuat model suara Bahasa Indonesia...');

        ort.env.wasm.numThreads = 1;
        ort.env.wasm.simd = true;
        ort.env.wasm.wasmPaths = ONNX_RUNTIME_BASE;

        const [configResponse, modelResponse] = await Promise.all([
            fetch(`${MODEL_BASE}.json`, { cache: 'force-cache' }),
            fetch(MODEL_BASE, { cache: 'force-cache' }),
        ]);

        if (! configResponse.ok || ! modelResponse.ok) {
            throw new Error('Model suara Bahasa Indonesia tidak ditemukan di folder public/tts.');
        }

        modelConfig = (await configResponse.json()) as PiperVoiceConfig;
        inferenceSession = await ort.InferenceSession.create(
            await modelResponse.arrayBuffer(),
            { executionProviders: ['wasm'] },
        );

        postStatus('ready', 'TTS offline Bahasa Indonesia siap.');
    })().catch((error: unknown) => {
        initializationPromise = null;
        inferenceSession = null;
        modelConfig = null;

        throw error;
    });

    return initializationPromise;
};

const phonemeIdsForSegments = (texts: string[]): Promise<number[][]> =>
    new Promise<number[][]>((resolve, reject) => {
        let settled = false;
        const phonemeGroups: number[][] = [];

        const settle = (action: () => void) => {
            if (settled) {
                return;
            }

            settled = true;
            action();
        };

        void (async () => {
            try {
                const piperModule = await createPiperPhonemize({
                    print: (data: string) => {
                        if (settled) {
                            return;
                        }

                        try {
                            const parsed: unknown = JSON.parse(data);
                            const outputs = Array.isArray(parsed) ? parsed : [parsed];

                            outputs.forEach((output) => {
                                const ids = (output as { phoneme_ids?: unknown })?.phoneme_ids;

                                if (Array.isArray(ids)) {
                                    phonemeGroups.push(ids as number[]);
                                }
                            });

                            if (phonemeGroups.length >= texts.length) {
                                settle(() => resolve(phonemeGroups.slice(0, texts.length)));
                            }
                        } catch (error) {
                            settle(() => reject(error instanceof Error ? error : new Error(String(error))));
                        }
                    },
                    printErr: (message: string) => {
                        settle(() => reject(new Error(message)));
                    },
                    locateFile: (url: string) => {
                        if (url.endsWith('.wasm')) {
                            return `${PIPER_RUNTIME_BASE}.wasm`;
                        }

                        if (url.endsWith('.data')) {
                            return `${PIPER_RUNTIME_BASE}.data`;
                        }

                        return url;
                    },
                });

                piperModule.callMain([
                    '-l',
                    modelConfig!.espeak.voice,
                    '--input',
                    JSON.stringify(texts.map((text) => ({ text: text.trim() }))),
                    '--espeak_data',
                    '/espeak-ng-data',
                ]);

                settle(() => reject(new Error('Phonemizer tidak menghasilkan seluruh segmen ucapan.')));
            } catch (error) {
                settle(() => reject(error instanceof Error ? error : new Error(String(error))));
            }
        })();
    });

interface VoiceScales {
    noiseScale: number;
    noiseW: number;
    lengthMultiplier: number;
}

const voiceStyleScales = (style: TtsStyle, inference: PiperVoiceConfig['inference']): VoiceScales => {
    if (style === 'calm') {
        return { noiseScale: 0.42, noiseW: 0.45, lengthMultiplier: 1.08 };
    }

    if (style === 'expressive') {
        return { noiseScale: 0.92, noiseW: 1.08, lengthMultiplier: 0.96 };
    }

    return {
        noiseScale: inference.noise_scale,
        noiseW: inference.noise_w,
        lengthMultiplier: 1,
    };
};

const softenEdges = (pcm: Float32Array, sampleRate: number): Float32Array => {
    const fadeSamples = Math.min(Math.round(sampleRate * 0.006), Math.floor(pcm.length / 2));

    for (let index = 0; index < fadeSamples; index += 1) {
        const gain = index / fadeSamples;
        pcm[index] *= gain;
        pcm[pcm.length - index - 1] *= gain;
    }

    return pcm;
};

interface AudioSegment {
    pcm: Float32Array;
    pauseAfterMs: number;
}

const mergeAudioSegments = (audioSegments: AudioSegment[], sampleRate: number): Float32Array => {
    const preampGain = 1.55;
    const outputPeak = 0.98;
    const totalSamples = audioSegments.reduce(
        (total, segment) => total + segment.pcm.length + Math.round((sampleRate * segment.pauseAfterMs) / 1000),
        0,
    );
    const merged = new Float32Array(totalSamples);
    let offset = 0;

    audioSegments.forEach((segment) => {
        merged.set(softenEdges(segment.pcm, sampleRate), offset);
        offset += segment.pcm.length + Math.round((sampleRate * segment.pauseAfterMs) / 1000);
    });

    let peak = 0;

    for (let index = 0; index < merged.length; index += 1) {
        peak = Math.max(peak, Math.abs(merged[index]));
    }

    if (peak > 0) {
        const normalizationGain = Math.min(1.5, 1 / peak);
        const limiterCeiling = Math.tanh(preampGain);

        for (let index = 0; index < merged.length; index += 1) {
            const normalizedSample = merged[index] * normalizationGain;

            merged[index] = (outputPeak * Math.tanh(normalizedSample * preampGain)) / limiterCeiling;
        }
    }

    return merged;
};

const normalizeSegments = (segments: unknown): SpeechSegment[] => (Array.isArray(segments) ? segments : [])
    .map((segment: Partial<SpeechSegment> | null) => ({
        text: String(segment?.text ?? '').trim(),
        pauseAfterMs: Math.max(0, Math.min(1000, Number(segment?.pauseAfterMs) || 0)),
        speedMultiplier: Math.max(0.7, Math.min(1.1, Number(segment?.speedMultiplier) || 1)),
    }))
    .filter((segment) => segment.text !== '');

const synthesize = async (
    rawSegments: SpeechSegment[],
    speed = 0.8,
    style: TtsStyle = 'natural',
): Promise<{ pcm: Float32Array; sampleRate: number }> => {
    await initialize();

    if (! modelConfig || ! inferenceSession) {
        throw new Error('Model TTS offline belum siap.');
    }

    const segments = normalizeSegments(rawSegments);

    if (segments.length === 0) {
        throw new Error('Teks panggilan TTS offline kosong.');
    }

    const phonemeGroups = await phonemeIdsForSegments(segments.map((segment) => segment.text));
    const inference = modelConfig.inference;
    const { noiseScale, noiseW, lengthMultiplier } = voiceStyleScales(style, inference);
    const boundedSpeed = Math.max(0.65, Math.min(1, Number(speed) || 0.8));
    const audioSegments: AudioSegment[] = [];

    for (let index = 0; index < segments.length; index += 1) {
        const segment = segments[index];
        const phonemeIds = phonemeGroups[index] ?? [];
        const feeds: Record<string, ort.Tensor> = {
            input: new ort.Tensor(
                'int64',
                BigInt64Array.from(phonemeIds, (id) => BigInt(id)),
                [1, phonemeIds.length],
            ),
            input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(phonemeIds.length)]), [1]),
            scales: new ort.Tensor(
                'float32',
                Float32Array.from([
                    noiseScale,
                    (inference.length_scale * 1.12 * lengthMultiplier)
                        / (boundedSpeed * segment.speedMultiplier),
                    noiseW,
                ]),
                [3],
            ),
        };
        const result = await inferenceSession.run(feeds);

        audioSegments.push({
            pcm: new Float32Array(result.output.data as Float32Array),
            pauseAfterMs: segment.pauseAfterMs,
        });
    }

    return {
        pcm: mergeAudioSegments(audioSegments, modelConfig.audio.sample_rate),
        sampleRate: modelConfig.audio.sample_rate,
    };
};

self.addEventListener('message', (event: MessageEvent<OfflineTtsRequest>) => {
    const data = event.data;
    const requestId = data?.requestId;

    void (async () => {
        try {
            if (data?.type === 'initialize') {
                await initialize();
                post({ type: 'initialized', requestId });

                return;
            }

            if (data?.type !== 'synthesize') {
                return;
            }

            postStatus('synthesizing', 'Membuat audio panggilan secara lokal...');
            const { pcm, sampleRate } = await synthesize(data.segments, data.speed, data.style);
            const durationMs = Math.round((pcm.length / sampleRate) * 1000);

            post({ type: 'audio', requestId, pcm: pcm.buffer as ArrayBuffer, sampleRate, durationMs }, [pcm.buffer]);
            postStatus('ready', 'TTS offline Bahasa Indonesia siap.');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            post({ type: 'error', requestId, message });
            postStatus('error', message);
        }
    })();
});