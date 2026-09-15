/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getOnlineTtsVoices, warmAnnouncementAudio } from '@/lib/announcement/audio';
import { enableDisplayMediaSound } from '@/lib/announcement/display-media';
import {
    isAnnouncementQueueActive,
    markDisplayAudioUnlocked,
    restoreDisplayAudioUnlockState,
    scheduleAnnouncementQueue,
    subscribeAnnouncementQueue,
} from '@/lib/announcement/queue';
import { currentAnnouncementSettings } from '@/lib/announcement/settings';
import { normalizeAnnouncementPayload } from '@/lib/announcement/speech';
import { initializeOfflineTts } from '@/lib/tts/offline-tts';
import type { Announcement, RawAnnouncementPayload } from '@/types/announcement';

interface UseAnnouncementQueueOptions {
    /** Panggilan terbaru dari server (props/SWR). */
    serverCall?: RawAnnouncementPayload | null;
    /** ?autostart=1 pada mode kiosk otomatis membuka kunci audio. */
    autostart?: boolean;
}

interface UseAnnouncementQueueResult {
    /** Panggilan yang sedang ditampilkan — tertahan sampai audio selesai. */
    currentCall: Announcement | null;
    unlocked: boolean;
    queueActive: boolean;
    unlock: () => Promise<void>;
}

/**
 * Menggabungkan Alpine `displayTvNowServing` + `displayTvShell`:
 * data dari server hanya diterapkan ke layar saat antrean audio idle,
 * sehingga kartu "sedang dipanggil" tidak mendahului suaranya.
 */
export const useAnnouncementQueue = ({
    serverCall = null,
    autostart = false,
}: UseAnnouncementQueueOptions = {}): UseAnnouncementQueueResult => {
    const [currentCall, setCurrentCall] = useState<Announcement | null>(() =>
        normalizeAnnouncementPayload(serverCall),
    );
    const [unlocked, setUnlocked] = useState(false);
    const [queueActive, setQueueActive] = useState(false);
    const pendingCallRef = useRef<Announcement | null>(null);
    const hasPendingRef = useRef(false);

    const applyPendingCall = useCallback(() => {
        if (! hasPendingRef.current) {
            return;
        }

        setCurrentCall(pendingCallRef.current);
        pendingCallRef.current = null;
        hasPendingRef.current = false;
    }, []);

    useEffect(() => {
        setUnlocked(restoreDisplayAudioUnlockState(autostart));
    }, [autostart]);

    // `serverCall` biasanya objek baru tiap render, jadi efek dikunci ke isinya.
    const serverCallKey = serverCall ? JSON.stringify(serverCall) : '';

    // Sinkronisasi data server: tunda bila audio sedang berjalan.
    useEffect(() => {
        const syncedCall = normalizeAnnouncementPayload(
            serverCallKey ? (JSON.parse(serverCallKey) as RawAnnouncementPayload) : null,
        );

        setCurrentCall((previous) => {
            if (
                syncedCall?.call_id
                && previous?.call_id
                && syncedCall.call_id < previous.call_id
            ) {
                return previous;
            }

            pendingCallRef.current = syncedCall;
            hasPendingRef.current = true;

            if (! isAnnouncementQueueActive()) {
                pendingCallRef.current = null;
                hasPendingRef.current = false;

                return syncedCall;
            }

            return previous;
        });
    }, [serverCallKey]);

    useEffect(() => subscribeAnnouncementQueue((event) => {
        if (event.type === 'announcement-started') {
            setQueueActive(true);
            setCurrentCall(event.announcement);
            pendingCallRef.current = null;
            hasPendingRef.current = false;

            return;
        }

        if (event.type === 'queue-idle') {
            setQueueActive(false);
            applyPendingCall();

            return;
        }

        if (event.type === 'audio-unlocked') {
            setUnlocked(true);
        }
    }), [applyPendingCall]);

    const unlock = useCallback(async () => {
        markDisplayAudioUnlocked();
        setUnlocked(true);

        const ttsWarmPromise = currentAnnouncementSettings().voice_mode === 'offline_tts'
            ? initializeOfflineTts().catch(() => false)
            : getOnlineTtsVoices().catch(() => []);

        await Promise.all([
            enableDisplayMediaSound(),
            warmAnnouncementAudio(),
            ttsWarmPromise,
        ]);

        scheduleAnnouncementQueue();
    }, []);

    // Mode kiosk: langsung buka kunci tanpa interaksi.
    useEffect(() => {
        if (autostart) {
            void unlock();
        }
    }, [autostart, unlock]);

    return { currentCall, unlocked, queueActive, unlock };
};