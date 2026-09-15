/* eslint-disable react-hooks/refs */
'use client';

import { useEffect, useRef, useState } from 'react';

import { enqueueAnnouncement } from '@/lib/announcement/queue';
import { getEcho, realtimeStatus, subscribeRealtimeStatus, type RealtimeStatus } from '@/lib/realtime/echo';
import type { RawAnnouncementPayload } from '@/types/announcement';

interface DisplayUpdatedPayload {
    announcement?: RawAnnouncementPayload;
}

interface UseQueueRealtimeOptions {
    /** 'display' = layar TV (audio + ducking video), 'board' = halaman lain. */
    role?: 'display' | 'board';
    /** Dipanggil setiap ada update — biasanya router.refresh() atau mutate() dari SWR. */
    onUpdate?: () => void;
    channel?: string;
    event?: string;
}

export const useQueueRealtime = ({
    role = 'board',
    onUpdate,
    channel = 'display-board',
    event = '.display.updated',
}: UseQueueRealtimeOptions = {}): RealtimeStatus => {
    const [status, setStatus] = useState<RealtimeStatus>(realtimeStatus);
    const onUpdateRef = useRef(onUpdate);

    onUpdateRef.current = onUpdate;

    useEffect(() => subscribeRealtimeStatus(setStatus), []);

    useEffect(() => {
        const echo = getEcho();

        if (! echo) {
            return;
        }

        const subscription = echo.channel(channel).listen(event, (payload: DisplayUpdatedPayload) => {
            const announcement = payload?.announcement;

            if (announcement?.message && role === 'display') {
                enqueueAnnouncement(announcement, { display: true });
            }

            // Refresh data papan setelah pengumuman masuk antrean, supaya kartu
            // "sedang dipanggil" tetap sinkron dengan urutan audio.
            onUpdateRef.current?.();
        });

        return () => {
            subscription.stopListening(event);
            echo.leaveChannel(`${channel}`);
        };
    }, [channel, event, role]);

    return status;
};