import { boundedNumber } from '@/lib/announcement/settings';
import type { AnnouncementSettings } from '@/types/announcement';

export const AUDIO_PLAY_TIMEOUT_MS = 12_000;
const VOICE_WAIT_TIMEOUT_MS = 1_500;
const INDONESIAN_TTS_LANGUAGE = 'id-ID';

export const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const estimateAnnouncementMs = (message = ''): number => Math.min(
    45_000,
    Math.max(8_000, Math.round(String(message).trim().length * 150) + 3_000),
);

export const createAnnouncementAudio = (source: string, volume = 1): HTMLAudioElement => {
    const audio = new Audio(source);

    audio.preload = 'auto';
    audio.volume = boundedNumber(volume, 1, 0, 1);

    return audio;
};

interface AnnouncementAudioState {
    voicesPromise: Promise<SpeechSynthesisVoice[]> | null;
    cueWarmPromise: Promise<boolean> | null;
    cuesUnlocked: boolean;
    openingAudio: HTMLAudioElement | null;
    closingAudio: HTMLAudioElement | null;
}

const globalState = globalThis as typeof globalThis & {
    __announcementAudioState?: AnnouncementAudioState;
};

const state: AnnouncementAudioState = (globalState.__announcementAudioState ??= {
    voicesPromise: null,
    cueWarmPromise: null,
    cuesUnlocked: false,
    openingAudio: null,
    closingAudio: null,
});

/** Audio dibuat lazy karena `new Audio()` tidak tersedia saat SSR. */
export const openingCueAudio = (): HTMLAudioElement | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return (state.openingAudio ??= createAnnouncementAudio('/sounds/opening.mp3'));
};

export const closingCueAudio = (): HTMLAudioElement | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return (state.closingAudio ??= createAnnouncementAudio('/sounds/closing.mp3'));
};

export const getOnlineTtsVoices = (): Promise<SpeechSynthesisVoice[]> => {
    if (typeof window === 'undefined' || ! window.speechSynthesis) {
        return Promise.resolve([]);
    }

    if (state.voicesPromise) {
        return state.voicesPromise;
    }

    state.voicesPromise = new Promise<SpeechSynthesisVoice[]>((resolve) => {
        const initialVoices = window.speechSynthesis.getVoices();

        if (initialVoices.length > 0) {
            resolve(initialVoices);

            return;
        }

        const finish = () => {
            clearTimeout(timeoutId);
            window.speechSynthesis.removeEventListener('voiceschanged', finish);
            resolve(window.speechSynthesis.getVoices());
        };
        const timeoutId = setTimeout(finish, VOICE_WAIT_TIMEOUT_MS);

        window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
    });

    return state.voicesPromise;
};

const scoreOnlineTtsVoice = (voice: SpeechSynthesisVoice): number => {
    const language = String(voice?.lang ?? '').toLowerCase();
    const name = String(voice?.name ?? '').toLowerCase();
    let score = 0;

    if (language === 'id-id') score += 120;
    else if (language.startsWith('id')) score += 100;
    else if (language.startsWith('ms')) score += 40;

    if (name.includes('indonesia') || name.includes('bahasa')) score += 50;
    if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 30;
    if (name.includes('female') || name.includes('perempuan')) score += 5;
    if (language.startsWith('en')) score -= 80;

    return score;
};

export const selectOnlineTtsVoice = (
    voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null => [...voices]
    .sort((left, right) => scoreOnlineTtsVoice(right) - scoreOnlineTtsVoice(left))[0] ?? null;

export const speakOnlineTts = async (
    message: string,
    settings: AnnouncementSettings,
    preparedVoice: SpeechSynthesisVoice | null = null,
): Promise<void> => {
    if (typeof window === 'undefined' || ! window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
        throw new Error('Browser ini tidak menyediakan Web Speech API.');
    }

    const voice = preparedVoice ?? selectOnlineTtsVoice(await getOnlineTtsVoices());

    await new Promise<void>((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(message);
        let settled = false;

        utterance.lang = voice?.lang ?? INDONESIAN_TTS_LANGUAGE;
        utterance.rate = settings.tts_speed;
        utterance.pitch = settings.online_pitch;
        utterance.volume = settings.audio_volume / 100;

        if (voice) {
            utterance.voice = voice;
        }

        const finish = (error: Error | null = null) => {
            if (settled) {
                return;
            }

            settled = true;
            clearTimeout(timeoutId);

            if (error) {
                reject(error);

                return;
            }

            resolve();
        };
        const timeoutId = setTimeout(() => finish(), estimateAnnouncementMs(message));

        utterance.onend = () => finish();
        utterance.onerror = (event) => finish(new Error(`TTS online gagal: ${event.error || 'unknown'}`));

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    });
};

/** "Membuka kunci" autoplay dengan memutar cue dalam keadaan mute. */
export const warmAnnouncementAudio = async (): Promise<boolean> => {
    if (state.cuesUnlocked) {
        return true;
    }

    if (state.cueWarmPromise) {
        return state.cueWarmPromise;
    }

    const warmCue = async (audio: HTMLAudioElement | null): Promise<boolean> => {
        if (! audio) {
            return false;
        }

        const previouslyMuted = audio.muted;

        try {
            audio.muted = true;
            audio.currentTime = 0;
            await audio.play();
            audio.pause();
            audio.currentTime = 0;

            return true;
        } catch {
            return false;
        } finally {
            audio.muted = previouslyMuted;
        }
    };

    state.cueWarmPromise = Promise.all([warmCue(openingCueAudio()), warmCue(closingCueAudio())])
        .then((results) => {
            state.cuesUnlocked = results.some(Boolean);

            return state.cuesUnlocked;
        })
        .finally(() => {
            if (! state.cuesUnlocked) {
                state.cueWarmPromise = null;
            }
        });

    return state.cueWarmPromise;
};

export const playAnnouncementCue = async (
    audio: HTMLAudioElement | null,
    volume = 1,
    timeoutMs: number = AUDIO_PLAY_TIMEOUT_MS,
): Promise<void> => {
    if (! audio) {
        return;
    }

    await new Promise<void>((resolve) => {
        let settled = false;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const finish = () => {
            if (settled) {
                return;
            }

            settled = true;

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            audio.removeEventListener('ended', finish);
            audio.removeEventListener('error', finish);
            resolve();
        };

        audio.pause();
        audio.currentTime = 0;
        audio.volume = boundedNumber(volume, 1, 0, 1);
        audio.addEventListener('ended', finish, { once: true });
        audio.addEventListener('error', finish, { once: true });

        timeoutId = setTimeout(finish, timeoutMs);

        try {
            void audio.play().catch(finish);
        } catch {
            finish();
        }
    });
};