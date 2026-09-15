export type VoiceMode = 'offline_tts' | 'online_tts';

export type TtsStyle = 'natural' | 'calm' | 'expressive';

export interface AnnouncementSettings {
    voice_mode: VoiceMode;
    announcement_enabled: boolean;
    /** 0 - 100 */
    audio_volume: number;
    /** 1 - 3 */
    repeat_count: number;
    opening_enabled: boolean;
    closing_enabled: boolean;
    /** 0 - 500 ms */
    cue_gap_ms: number;
    /** 0 - 5000 ms */
    repeat_pause_ms: number;
    speak_zero_digits: boolean;
    /** 0.65 - 1 */
    tts_speed: number;
    tts_style: TtsStyle;
    /** 0.7 - 1.3 */
    online_pitch: number;
}

/** Bentuk payload mentah dari broadcast Reverb (snake_case maupun camelCase). */
export interface RawAnnouncementPayload {
    message?: string;
    ticket_number?: string;
    ticketNumber?: string;
    service_name?: string;
    serviceName?: string;
    service_code?: string;
    serviceCode?: string;
    counter_name?: string;
    counterName?: string;
    counter_code?: string;
    counterCode?: string;
    call_id?: number | string | null;
    callId?: number | string | null;
    called_at?: string;
    calledAt?: string;
}

export interface Announcement {
    message: string;
    ticket_number: string;
    service_name: string;
    service_code: string;
    counter_name: string;
    counter_code: string;
    call_id: number | null;
    called_at: string;
}

export interface QueuedAnnouncement extends Announcement {
    /** true bila berasal dari layar display (butuh unlock audio & ducking video). */
    display: boolean;
    sequence: number;
}

export type AnnouncementQueueEvent =
    | { type: 'announcement-started'; announcement: QueuedAnnouncement }
    | { type: 'queue-idle' }
    | { type: 'audio-unlocked' };