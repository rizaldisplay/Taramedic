'use client';

import { useEffect, useSyncExternalStore } from 'react';

import {
    currentAnnouncementSettings,
    setAnnouncementSettings,
    subscribeAnnouncementSettings,
} from '@/lib/announcement/settings';
import type { AnnouncementSettings } from '@/types/announcement';

/**
 * Mendorong pengaturan dari server ke store yang dibaca antrean audio,
 * sekaligus mengembalikannya untuk dipakai komponen.
 *
 * Antrean audio berjalan di luar React, jadi ia tidak bisa membaca props.
 * Hook ini jembatannya: panggil sekali di komponen teratas halaman yang
 * memutar suara. Tanpa itu, antrean memakai nilai default.
 */
export const useAnnouncementSettings = (
    settings?: Partial<Record<keyof AnnouncementSettings, unknown>>,
): AnnouncementSettings => {
    // Objek literal selalu punya identitas baru tiap render, jadi efek
    // dikunci ke isinya, bukan ke referensinya.
    const settingsKey = settings ? JSON.stringify(settings) : '';

    useEffect(() => {
        if (! settingsKey) {
            return;
        }

        setAnnouncementSettings(JSON.parse(settingsKey) as Partial<AnnouncementSettings>);
    }, [settingsKey]);

    return useSyncExternalStore(
        subscribeAnnouncementSettings,
        currentAnnouncementSettings,
        currentAnnouncementSettings,
    );
};