import {
    AUDIO_PLAY_TIMEOUT_MS,
    closingCueAudio,
    createAnnouncementAudio,
    getOnlineTtsVoices,
    openingCueAudio,
    playAnnouncementCue,
    selectOnlineTtsVoice,
    speakOnlineTts,
    wait,
} from '@/lib/announcement/audio';
import {
    currentAnnouncementSettings,
    normalizeAnnouncementSettings,
} from '@/lib/announcement/settings';
import {
    announcementSpeechText,
    normalizeAnnouncementPayload,
    offlineAnnouncementSegments,
} from '@/lib/announcement/speech';
import { synthesizeOfflineTts } from '@/lib/tts/offline-tts';
import type {
    Announcement,
    AnnouncementSettings,
    RawAnnouncementPayload,
} from '@/types/announcement';

interface PlaybackOptions {
    includeOpening?: boolean;
}

const playCueTransition = async (
    settings: AnnouncementSettings,
    enabled: boolean,
    audio: HTMLAudioElement | null,
): Promise<void> => {
    if (! enabled) {
        return;
    }

    await playAnnouncementCue(audio, settings.audio_volume / 100);

    if (settings.cue_gap_ms > 0) {
        await wait(settings.cue_gap_ms);
    }
};

export const playOfflineTtsAnnouncement = async (
    announcement: Announcement,
    settings: AnnouncementSettings,
    { includeOpening = true }: PlaybackOptions = {},
): Promise<void> => {
    const speechSegments = offlineAnnouncementSegments(announcement, settings);
    const volume = settings.audio_volume / 100;

    // Sintesis dijalankan paralel dengan cue pembuka agar tidak terasa jeda.
    const preparedAudio = synthesizeOfflineTts(speechSegments, settings.tts_speed, settings.tts_style)
        .then((result) => ({ ...result, error: null as Error | null }))
        .catch((error: unknown) => ({
            blob: null,
            durationMs: 0,
            error: error instanceof Error ? error : new Error(String(error)),
        }));

    await playCueTransition(settings, includeOpening && settings.opening_enabled, openingCueAudio());

    const { blob, durationMs, error } = await preparedAudio;

    if (error) {
        throw error;
    }

    if (blob) {
        const source = URL.createObjectURL(blob);
        // Timeout mengikuti durasi audio yang sebenarnya (dari jumlah sampel PCM),
        // bukan angka tetap — nomor tiket yang dibacakan karakter demi karakter
        // dengan jeda bisa lebih dari 12 detik dan sempat memutus koneksi blob
        // sebelum selesai diputar (lihat AUDIO_PLAY_TIMEOUT_MS di audio.ts).
        const playbackTimeoutMs = Math.max(AUDIO_PLAY_TIMEOUT_MS, durationMs + 5_000);

        try {
            await playAnnouncementCue(createAnnouncementAudio(source, volume), volume, playbackTimeoutMs);
        } finally {
            // Revoke ditunda sebentar: beberapa browser masih menuntaskan
            // permintaan buffer internal sesaat setelah 'ended' terpicu, dan
            // revoke yang terlalu cepat memunculkan ERR_FILE_NOT_FOUND di
            // console meski audio sudah terdengar tuntas. Fungsi ini sendiri
            // tidak menunggu jeda ini — antrean boleh lanjut ke item berikutnya.
            setTimeout(() => {
                try {
                    URL.revokeObjectURL(source);
                } catch {
                    // URL sudah tidak valid — aman diabaikan.
                }
            }, 1_000);
        }
    }

    if (settings.closing_enabled) {
        await playAnnouncementCue(closingCueAudio(), volume);
    }
};

export const playOnlineTtsAnnouncement = async (
    announcement: Announcement,
    settings: AnnouncementSettings,
    { includeOpening = true }: PlaybackOptions = {},
): Promise<void> => {
    const speechText = announcementSpeechText(announcement, settings);
    const preparedVoice = getOnlineTtsVoices().then((voices) => selectOnlineTtsVoice(voices));

    await playCueTransition(settings, includeOpening && settings.opening_enabled, openingCueAudio());
    await speakOnlineTts(speechText, settings, await preparedVoice);

    if (settings.closing_enabled) {
        await playAnnouncementCue(closingCueAudio(), settings.audio_volume / 100);
    }
};

export const playAnnouncementAudio = async (
    payload: RawAnnouncementPayload | Announcement,
    settingsOverride: AnnouncementSettings | null = null,
): Promise<void> => {
    const announcement = normalizeAnnouncementPayload(payload as RawAnnouncementPayload);

    if (! announcement) {
        return;
    }

    const settings = normalizeAnnouncementSettings(settingsOverride ?? currentAnnouncementSettings());

    if (! settings.announcement_enabled) {
        return;
    }

    for (let repetition = 0; repetition < settings.repeat_count; repetition += 1) {
        if (settings.voice_mode === 'online_tts') {
            try {
                await playOnlineTtsAnnouncement(announcement, settings);
            } catch (error) {
                console.error('TTS online gagal, beralih ke TTS offline lokal.', error);
                await playOfflineTtsAnnouncement(announcement, settings, { includeOpening: false });
            }
        } else {
            try {
                await playOfflineTtsAnnouncement(announcement, settings);
            } catch (error) {
                console.error('TTS offline gagal, beralih ke TTS online browser.', error);
                await playOnlineTtsAnnouncement(announcement, settings, { includeOpening: false });
            }
        }

        if (repetition < settings.repeat_count - 1 && settings.repeat_pause_ms > 0) {
            await wait(settings.repeat_pause_ms);
        }
    }
};