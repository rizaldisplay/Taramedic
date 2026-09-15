import type { AnnouncementSettings, TtsStyle } from '@/types/announcement';

export const DEFAULT_ANNOUNCEMENT_SETTINGS: AnnouncementSettings = {
    voice_mode: 'offline_tts',
    announcement_enabled: true,
    audio_volume: 100,
    repeat_count: 1,
    opening_enabled: true,
    closing_enabled: true,
    cue_gap_ms: 0,
    repeat_pause_ms: 800,
    speak_zero_digits: true,
    tts_speed: 0.8,
    tts_style: 'natural',
    online_pitch: 1,
};

export const toBoolean = (value: unknown, fallback = false): boolean => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (value === '1' || value === 1 || value === 'true') {
        return true;
    }

    if (value === '0' || value === 0 || value === 'false') {
        return false;
    }

    return fallback;
};

export const boundedNumber = (value: unknown, fallback: number, min: number, max: number): number => {
    const numericValue = Number(value);

    return Math.min(max, Math.max(min, Number.isFinite(numericValue) ? numericValue : fallback));
};

export const normalizeAnnouncementSettings = (
    settings: Partial<Record<keyof AnnouncementSettings, unknown>> = {},
): AnnouncementSettings => ({
    voice_mode: settings.voice_mode === 'online_tts' ? 'online_tts' : 'offline_tts',
    announcement_enabled: toBoolean(settings.announcement_enabled, true),
    audio_volume: boundedNumber(settings.audio_volume, 100, 0, 100),
    repeat_count: boundedNumber(settings.repeat_count, 1, 1, 3),
    opening_enabled: toBoolean(settings.opening_enabled, true),
    closing_enabled: toBoolean(settings.closing_enabled, true),
    cue_gap_ms: boundedNumber(settings.cue_gap_ms, 0, 0, 500),
    repeat_pause_ms: boundedNumber(settings.repeat_pause_ms, 800, 0, 5000),
    speak_zero_digits: toBoolean(settings.speak_zero_digits, true),
    tts_speed: boundedNumber(settings.tts_speed, 0.8, 0.65, 1),
    tts_style: (['calm', 'expressive'].includes(String(settings.tts_style))
        ? settings.tts_style
        : 'natural') as TtsStyle,
    online_pitch: boundedNumber(settings.online_pitch, 1, 0.7, 1.3),
});

interface SettingsStore {
    value: AnnouncementSettings;
    listeners: Set<() => void>;
}

const globalStore = globalThis as typeof globalThis & {
    __announcementSettingsStore?: SettingsStore;
};

const store: SettingsStore = (globalStore.__announcementSettingsStore ??= {
    value: DEFAULT_ANNOUNCEMENT_SETTINGS,
    listeners: new Set(),
});

/**
 * Di Laravel pengaturan dibaca dari atribut `data-announcement-settings` pada DOM.
 * Di Next.js pengaturan didorong dari server (props/fetch) lewat fungsi ini,
 * lalu dibaca oleh antrean audio yang berjalan di luar React.
 */
export const setAnnouncementSettings = (
    settings: Partial<Record<keyof AnnouncementSettings, unknown>>,
): AnnouncementSettings => {
    store.value = normalizeAnnouncementSettings(settings);
    store.listeners.forEach((listener) => listener());

    return store.value;
};

export const currentAnnouncementSettings = (): AnnouncementSettings => store.value;

export const subscribeAnnouncementSettings = (listener: () => void): (() => void) => {
    store.listeners.add(listener);

    return () => {
        store.listeners.delete(listener);
    };
};