import { wait } from '@/lib/announcement/audio';
import { duckDisplayMedia, restoreDisplayMedia } from '@/lib/announcement/display-media';
import { playAnnouncementAudio } from '@/lib/announcement/player';
import { currentAnnouncementSettings } from '@/lib/announcement/settings';
import { normalizeAnnouncementPayload } from '@/lib/announcement/speech';
import type {
    AnnouncementQueueEvent,
    QueuedAnnouncement,
    RawAnnouncementPayload,
} from '@/types/announcement';

const MAX_REMEMBERED_CALLS = 200;
const QUEUE_DEBOUNCE_MS = 260;
const GAP_BETWEEN_ANNOUNCEMENTS_MS = 800;

interface QueueState {
    items: QueuedAnnouncement[];
    processedCallIds: Set<string>;
    processedCallOrder: string[];
    processing: boolean;
    active: boolean;
    audioUnlocked: boolean;
    timer: ReturnType<typeof setTimeout> | null;
    sequence: number;
    listeners: Set<(event: AnnouncementQueueEvent) => void>;
}

const globalState = globalThis as typeof globalThis & {
    __announcementQueueState?: QueueState;
};

const state: QueueState = (globalState.__announcementQueueState ??= {
    items: [],
    processedCallIds: new Set(),
    processedCallOrder: [],
    processing: false,
    active: false,
    audioUnlocked: false,
    timer: null,
    sequence: 0,
    listeners: new Set(),
});

const emit = (event: AnnouncementQueueEvent) => {
    state.listeners.forEach((listener) => listener(event));
};

export const subscribeAnnouncementQueue = (
    listener: (event: AnnouncementQueueEvent) => void,
): (() => void) => {
    state.listeners.add(listener);

    return () => {
        state.listeners.delete(listener);
    };
};

/** true selama antrean audio aktif — dipakai untuk menahan update kartu "sedang dipanggil". */
export const isAnnouncementQueueActive = (): boolean => state.active;

export const isDisplayAudioUnlocked = (): boolean => state.audioUnlocked;

const rememberCallId = (callId: number | null) => {
    if (! callId) {
        return;
    }

    const key = String(callId);

    state.processedCallIds.add(key);
    state.processedCallOrder.push(key);

    if (state.processedCallOrder.length > MAX_REMEMBERED_CALLS) {
        const oldest = state.processedCallOrder.shift();

        if (oldest) {
            state.processedCallIds.delete(oldest);
        }
    }
};

const compareAnnouncements = (left: QueuedAnnouncement, right: QueuedAnnouncement): number => {
    if (left.call_id && right.call_id && left.call_id !== right.call_id) {
        return left.call_id - right.call_id;
    }

    if (left.called_at && right.called_at && left.called_at !== right.called_at) {
        return String(left.called_at).localeCompare(String(right.called_at));
    }

    return left.sequence - right.sequence;
};

const processAnnouncementQueue = async (): Promise<void> => {
    if (state.processing || state.items.length === 0) {
        return;
    }

    if (
        state.items[0].display
        && currentAnnouncementSettings().announcement_enabled
        && ! state.audioUnlocked
    ) {
        return;
    }

    state.processing = true;
    state.active = true;
    let displayAudioWasActive = false;

    try {
        while (state.items.length > 0) {
            const announcement = state.items.shift()!;
            const settings = currentAnnouncementSettings();

            if (announcement.display && settings.announcement_enabled && ! state.audioUnlocked) {
                state.items.unshift(announcement);
                break;
            }

            if (announcement.display) {
                if (settings.announcement_enabled) {
                    displayAudioWasActive = true;
                    await duckDisplayMedia();
                }

                // Kartu di layar baru berganti saat gilirannya tiba, bukan saat
                // payload masuk — supaya teks dan suara tidak saling mendahului.
                emit({ type: 'announcement-started', announcement });
            }

            await playAnnouncementAudio(announcement, settings);

            if (state.items.length > 0) {
                await wait(GAP_BETWEEN_ANNOUNCEMENTS_MS);
            }
        }
    } finally {
        if (displayAudioWasActive) {
            await restoreDisplayMedia();
        }

        state.processing = false;

        if (state.items.length === 0) {
            state.active = false;
            emit({ type: 'queue-idle' });
        }
    }
};

export const scheduleAnnouncementQueue = (): void => {
    if (state.timer) {
        clearTimeout(state.timer);
    }

    state.timer = setTimeout(() => {
        void processAnnouncementQueue();
    }, QUEUE_DEBOUNCE_MS);
};

export const enqueueAnnouncement = (
    payload: RawAnnouncementPayload | null | undefined,
    { display = false }: { display?: boolean } = {},
): void => {
    const announcement = normalizeAnnouncementPayload(payload);
    const playbackEnabled = currentAnnouncementSettings().announcement_enabled;

    if (! announcement?.message) {
        return;
    }

    const callKey = announcement.call_id ? String(announcement.call_id) : null;

    if (callKey && state.processedCallIds.has(callKey)) {
        return;
    }

    rememberCallId(announcement.call_id);

    const queued: QueuedAnnouncement = {
        ...announcement,
        display,
        sequence: ++state.sequence,
    };

    state.items.push(queued);
    state.items.sort(compareAnnouncements);

    if (display && playbackEnabled) {
        state.active = true;

        if (! state.audioUnlocked) {
            // Audio masih terkunci: tetap tampilkan panggilan terakhir di layar.
            const latestDisplayAnnouncement = state.items.filter((item) => item.display).at(-1);

            if (latestDisplayAnnouncement) {
                emit({ type: 'announcement-started', announcement: latestDisplayAnnouncement });
            }
        }
    }

    if (! display || ! playbackEnabled || state.audioUnlocked) {
        scheduleAnnouncementQueue();
    }
};

export const markDisplayAudioUnlocked = (): void => {
    state.audioUnlocked = true;

    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('display-audio-unlocked', '1');
    }

    emit({ type: 'audio-unlocked' });
};

export const restoreDisplayAudioUnlockState = (autostart = false): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    state.audioUnlocked = autostart
        || state.audioUnlocked
        || window.sessionStorage.getItem('display-audio-unlocked') === '1';

    return state.audioUnlocked;
};