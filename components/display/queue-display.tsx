'use client';

import { useAnnouncement } from '@/hooks/useAnnouncement';
import { useQueueRealtime } from '@/hooks/use-queue-realtime';
import type { AnnouncementSettings } from '@/types/announcement';

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

const DISPLAY_SETTINGS: Partial<AnnouncementSettings> = {
    voice_mode: 'online_tts',
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

interface QueueDisplayProps {
    /** Kirim true bila halaman dibuka dengan ?autostart=1 (mode kiosk). */
    autostart?: boolean;
}

export default function QueueDisplay({ autostart = false }: QueueDisplayProps) {
    const { currentCall, unlocked, unlock, ttsStatus } = useAnnouncement(DISPLAY_SETTINGS, {
        autostart,
    });

    // Echo tersambung sejak awal; payload yang datang sebelum audio dibuka
    // tetap masuk antrean dan diputar setelah tombol ditekan.
    const realtime = useQueueRealtime({ role: 'display' });

    const isConnected = realtime === 'connected';

    if (! unlocked) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-900">
                <button
                    type="button"
                    onClick={() => void unlock()}
                    className="transform rounded-full bg-blue-600 px-12 py-6 text-2xl font-bold text-white shadow-xl transition-transform hover:scale-105 hover:bg-blue-500"
                >
                    Mulai layar antrean
                </button>
                <p className="text-sm text-gray-400">
                    Suara panggilan baru bisa diputar setelah tombol ini ditekan.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-gray-900 p-8 text-white shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Layar Antrean</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400" title={ttsStatus.message}>
                        {ttsStatus.status === 'ready' ? 'Suara siap' : ttsStatus.message}
                    </span>
                    <span
                        className={`rounded-full px-3 py-1 text-sm font-bold ${
                            isConnected ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    >
                        {isConnected ? 'Live' : 'Menyambungkan...'}
                    </span>
                </div>
            </div>

            {currentCall ? (
                <div
                    // key memaksa remount tiap panggilan baru, jadi animasinya
                    // berjalan sekali saat berganti — bukan berkedip terus.
                    key={currentCall.call_id ?? currentCall.ticket_number}
                    className="animate-in fade-in zoom-in-95 rounded-xl border-2 border-blue-500 bg-gray-800 p-6 text-center duration-500"
                >
                    {currentCall.service_name ? (
                        <p className="mb-2 text-xl text-blue-400">{currentCall.service_name}</p>
                    ) : null}

                    <h2 className="mb-4 text-7xl font-black tracking-wider text-yellow-400 tabular-nums">
                        {currentCall.ticket_number}
                    </h2>

                    <p className="mb-2 text-3xl font-semibold text-white">
                        Menuju {currentCall.counter_name || 'loket'}
                    </p>

                    <p className="mt-4 text-xl text-gray-400">{currentCall.message}</p>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-700 bg-gray-800 p-12 text-center text-gray-500">
                    <p className="text-3xl">Belum ada panggilan antrean</p>
                </div>
            )}
        </div>
    );
}
