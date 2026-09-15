'use client';

import { useEffect, useRef, useState } from 'react';

import { registerDisplayMedia } from '@/lib/announcement/display-media';

interface DisplayVideoProps {
    mediaUrls: string[];
    preferMuted?: boolean;
    /** 0 - 100 */
    normalVolume?: number;
    /** 0 - 100, volume saat pengumuman berjalan. */
    duckVolume?: number;
}

export const DisplayVideo = ({
    mediaUrls,
    preferMuted = false,
    normalVolume = 25,
    duckVolume = 4,
}: DisplayVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [needsInteraction, setNeedsInteraction] = useState(false);

    useEffect(() => {
        const video = videoRef.current;

        if (! video) {
            return;
        }

        return registerDisplayMedia(video, { preferMuted, normalVolume, duckVolume });
    }, [preferMuted, normalVolume, duckVolume]);

    useEffect(() => {
        const video = videoRef.current;

        if (! video || mediaUrls.length === 0) {
            return;
        }

        video.src = mediaUrls[currentIndex];
        video.volume = normalVolume / 100;
        video.muted = preferMuted;

        void video.play()
            .then(() => setNeedsInteraction(false))
            .catch(async () => {
                if (preferMuted) {
                    return;
                }

                // Autoplay dengan suara ditolak: mainkan bisu dulu, minta satu klik.
                video.muted = true;
                setNeedsInteraction(true);

                try {
                    await video.play();
                } catch {
                    // Browser memblokir autoplay sepenuhnya.
                }
            });
    }, [currentIndex, mediaUrls, normalVolume, preferMuted]);

    const handleEnded = () => {
        setCurrentIndex((index) => (mediaUrls.length > 1 ? (index + 1) % mediaUrls.length : 0));
    };

    const tryUnmute = async () => {
        const video = videoRef.current;

        if (! video || preferMuted) {
            return;
        }

        video.muted = false;
        video.volume = normalVolume / 100;

        try {
            await video.play();
            setNeedsInteraction(false);
        } catch {
            video.muted = true;
            setNeedsInteraction(true);
        }
    };

    return (
        <div className="relative h-full w-full">
            <video
                ref={videoRef}
                onEnded={handleEnded}
                playsInline
                className="h-full w-full object-cover"
            />

            {needsInteraction ? (
                <button
                    type="button"
                    onClick={() => void tryUnmute()}
                    className="absolute bottom-4 right-4 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-50"
                >
                    Nyalakan suara video
                </button>
            ) : null}
        </div>
    );
};
