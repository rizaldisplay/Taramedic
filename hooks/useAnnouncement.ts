'use client';

import { useCallback } from 'react';

import { useAnnouncementQueue } from '@/hooks/use-announcement-queue';
import { useAnnouncementSettings } from '@/hooks/use-announcement-settings';
import { useOfflineTtsStatus } from '@/hooks/use-offline-tts-status';
import { enqueueAnnouncement as pushToQueue } from '@/lib/announcement/queue';
import type {
    Announcement,
    AnnouncementSettings,
    RawAnnouncementPayload,
} from '@/types/announcement';
import type { OfflineTtsStatusSnapshot } from '@/types/tts';

interface UseAnnouncementOptions {
    /** ?autostart=1 untuk kiosk yang menyala sendiri tanpa ada yang mengklik. */
    autostart?: boolean;
}

interface UseAnnouncementResult {
    /** Masukkan panggilan ke antrean FIFO. Duplikat `call_id` otomatis diabaikan. */
    enqueueAnnouncement: (payload: RawAnnouncementPayload) => void;
    /** Panggilan yang sedang disuarakan — inilah yang harus ditampilkan di kartu. */
    currentCall: Announcement | null;
    unlocked: boolean;
    queueActive: boolean;
    unlock: () => Promise<void>;
    ttsStatus: OfflineTtsStatusSnapshot;
}

/**
 * Pembungkus tipis di atas modul antrean. Satu-satunya hook yang perlu dipanggil
 * komponen layar; sisanya (worker, cache, ducking) dikelola di luar React.
 */
export const useAnnouncement = (
    settings: Partial<Record<keyof AnnouncementSettings, unknown>>,
    { autostart = false }: UseAnnouncementOptions = {},
): UseAnnouncementResult => {
    useAnnouncementSettings(settings);

    const { currentCall, unlocked, queueActive, unlock } = useAnnouncementQueue({ autostart });
    const ttsStatus = useOfflineTtsStatus();

    // Referensinya stabil, jadi aman dipakai di dependency array useEffect.
    const enqueueAnnouncement = useCallback((payload: RawAnnouncementPayload) => {
        pushToQueue(payload, { display: true });
    }, []);

    return { enqueueAnnouncement, currentCall, unlocked, queueActive, unlock, ttsStatus };
};