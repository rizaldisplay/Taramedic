export interface AnnouncementSettings {
    voice_mode: 'online_tts' | 'offline_tts';
    announcement_enabled: boolean;
    audio_volume: number; // 0 - 100
    repeat_count: number;
    opening_enabled: boolean;
    closing_enabled: boolean;
    cue_gap_ms: number;
    repeat_pause_ms: number;
    speak_zero_digits: boolean;
    tts_speed: number;
    tts_style: 'calm' | 'expressive' | 'natural';
    online_pitch: number;
}

export interface AnnouncementPayload {
    message: string;
    ticket_number: string;
    service_name?: string;
    service_code?: string;
    counter_name?: string;
    counter_code?: string;
    call_id?: number | null;
    called_at?: string;
}