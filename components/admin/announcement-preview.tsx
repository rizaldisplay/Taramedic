'use client';

import { useState } from 'react';

import { useOfflineTtsStatus } from '@/hooks/use-offline-tts-status';
import { playAnnouncementAudio } from '@/lib/announcement/player';
import { normalizeAnnouncementSettings } from '@/lib/announcement/settings';
import type { AnnouncementSettings } from '@/types/announcement';

const SAMPLE_CALL = {
    message: 'Nomor antrian A001, silakan menuju loket 1.',
    ticket_number: 'A001',
    service_name: 'Pendaftaran',
    service_code: 'A',
    counter_name: 'Loket 1',
    counter_code: '1',
};

interface AnnouncementPreviewProps {
    /** Nilai form pengaturan yang sedang diedit admin. */
    settings: Partial<AnnouncementSettings>;
}

/**
 * Port dari Alpine `announcementAudioPreview`. Bedanya, nilai pengaturan
 * datang dari state form React, bukan dibaca ulang dari elemen DOM.
 * Preview memanggil pemutar langsung — tidak lewat antrean — supaya
 * tidak mengganggu panggilan asli yang mungkin sedang berjalan.
 */
export const AnnouncementPreview = ({ settings }: AnnouncementPreviewProps) => {
    const [playing, setPlaying] = useState(false);
    const ttsStatus = useOfflineTtsStatus();

    const preview = async () => {
        if (playing) {
            return;
        }

        setPlaying(true);

        try {
            await playAnnouncementAudio(SAMPLE_CALL, normalizeAnnouncementSettings(settings));
        } finally {
            setPlaying(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={() => void preview()}
                disabled={playing}
                className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-60"
            >
                {playing ? 'Memutar contoh...' : 'Dengarkan contoh'}
            </button>

            <p className="text-sm text-gray-400">{ttsStatus.message}</p>
        </div>
    );
};
