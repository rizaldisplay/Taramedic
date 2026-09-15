import type { TtsStyle } from './announcement';

export interface SpeechSegment {
    text: string;
    /** Jeda setelah segmen, 0 - 1000 ms. */
    pauseAfterMs: number;
    /** 0.7 - 1.1 */
    speedMultiplier: number;
}

export type OfflineTtsStatus = 'idle' | 'loading' | 'ready' | 'synthesizing' | 'error';

export interface OfflineTtsStatusSnapshot {
    status: OfflineTtsStatus;
    message: string;
}

/** Struktur file <voice>.onnx.json bawaan Piper. */
export interface PiperVoiceConfig {
    espeak: { voice: string };
    inference: {
        noise_scale: number;
        length_scale: number;
        noise_w: number;
    };
    audio: { sample_rate: number };
}

export type OfflineTtsRequest =
    | { type: 'initialize'; requestId: number }
    | {
          type: 'synthesize';
          requestId: number;
          segments: SpeechSegment[];
          speed: number;
          style: TtsStyle;
      };

export type OfflineTtsResponse =
    | { type: 'status'; status: OfflineTtsStatus; detail: string }
    | { type: 'initialized'; requestId: number }
    | { type: 'audio'; requestId: number; pcm: ArrayBuffer; sampleRate: number; durationMs: number }
    | { type: 'error'; requestId: number; message: string };