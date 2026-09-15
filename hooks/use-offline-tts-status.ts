'use client';

import { useSyncExternalStore } from 'react';

import { offlineTtsStatus, subscribeOfflineTtsStatus } from '@/lib/tts/offline-tts';
import type { OfflineTtsStatusSnapshot } from '@/types/tts';

const serverSnapshot: OfflineTtsStatusSnapshot = {
    status: 'idle',
    message: 'TTS offline belum dimuat.',
};

/** Status pemuatan model Piper: idle → loading → ready → synthesizing. */
export const useOfflineTtsStatus = (): OfflineTtsStatusSnapshot =>
    useSyncExternalStore(subscribeOfflineTtsStatus, offlineTtsStatus, () => serverSnapshot);