import {
    formatTicketNumberForSpeech,
    spokenCharacter,
    spokenTicketCharacters,
} from '@/lib/tts/ticket-pronunciation';
import type {
    Announcement,
    AnnouncementSettings,
    RawAnnouncementPayload,
} from '@/types/announcement';
import type { SpeechSegment } from '@/types/tts';

interface SplitMessage {
    intro: string;
    ticket: string;
    outro: string;
}

export const splitAnnouncementMessage = (
    message: string | null | undefined,
    ticketNumber: string | null | undefined,
): SplitMessage => {
    const spokenMessage = String(message ?? '').trim();
    const ticket = String(ticketNumber ?? '').trim();
    const ticketPosition = spokenMessage.toLowerCase().indexOf(ticket.toLowerCase());

    if (! ticket || ticketPosition < 0) {
        return { intro: spokenMessage, ticket: '', outro: '' };
    }

    return {
        intro: spokenMessage.slice(0, ticketPosition).trim().replace(/[,:;-]+$/, ''),
        ticket,
        outro: spokenMessage
            .slice(ticketPosition + ticket.length)
            .trim()
            .replace(/^[,:;-]+/, '')
            .trim(),
    };
};

export const normalizeAnnouncementPayload = (
    payload: RawAnnouncementPayload | RawAnnouncementPayload[] | null | undefined,
): Announcement | null => {
    const data = Array.isArray(payload) ? payload[0] : payload;

    if (! data || typeof data !== 'object') {
        return null;
    }

    return {
        message: data.message ?? '',
        ticket_number: data.ticket_number ?? data.ticketNumber ?? '',
        service_name: data.service_name ?? data.serviceName ?? '',
        service_code: data.service_code ?? data.serviceCode ?? '',
        counter_name: data.counter_name ?? data.counterName ?? '',
        counter_code: data.counter_code ?? data.counterCode ?? '',
        call_id: Number(data.call_id ?? data.callId) || null,
        called_at: data.called_at ?? data.calledAt ?? '',
    };
};

/** Teks datar untuk Web Speech API (TTS online). */
export const announcementSpeechText = (
    announcement: Announcement,
    settings: AnnouncementSettings,
): string => {
    const { intro, ticket, outro } = splitAnnouncementMessage(
        announcement.message,
        announcement.ticket_number,
    );

    return [intro, ticket ? formatTicketNumberForSpeech(ticket, settings.speak_zero_digits) : '', outro]
        .filter(Boolean)
        .join(', ')
        .replace(/\s+/g, ' ')
        .replace(/\s+([,.!?])/g, '$1')
        .trim();
};

/** Segmen per karakter tiket agar Piper melafalkannya satu per satu. */
export const offlineAnnouncementSegments = (
    announcement: Announcement,
    settings: AnnouncementSettings,
): SpeechSegment[] => {
    const { intro, ticket, outro } = splitAnnouncementMessage(
        announcement.message,
        announcement.ticket_number,
    );
    const segments: SpeechSegment[] = [];

    if (intro) {
        segments.push({ text: intro, pauseAfterMs: ticket ? 180 : 0, speedMultiplier: 1 });
    }

    if (ticket) {
        const ticketCharacters = spokenTicketCharacters(ticket, settings.speak_zero_digits);

        ticketCharacters.forEach((character, index) => {
            segments.push({
                text: spokenCharacter(character),
                pauseAfterMs: index === ticketCharacters.length - 1 ? 320 : 240,
                speedMultiplier: 0.82,
            });
        });
    }

    if (outro) {
        segments.push({ text: outro, pauseAfterMs: 0, speedMultiplier: 1 });
    }

    return segments.length > 0
        ? segments
        : [{ text: announcementSpeechText(announcement, settings), pauseAfterMs: 0, speedMultiplier: 1 }];
};