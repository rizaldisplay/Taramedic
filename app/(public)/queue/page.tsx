'use client';

import { useEffect, useState, useRef } from "react";
import Echo from "laravel-echo";
import windowPusher from "pusher-js";
import { useAnnouncement } from "@/hooks/useAnnouncement"; // Impor hook TTS yang dibuat sebelumnya

declare global {
  interface Window {
    Pusher?: typeof windowPusher;
  }
}

if (typeof window !== "undefined") {
  window.Pusher = windowPusher;
}

// Gunakan interface baru yang sesuai dengan backend Laravel
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

export default function QueueDisplay() {
  const [announcement, setAnnouncement] = useState<AnnouncementPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const echoInstance = useRef<Echo<any> | null>(null);

  // Inisialisasi Hook TTS dengan pengaturan standar
  const { enqueueAnnouncement } = useAnnouncement({
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
  });

  // Fungsi untuk membuka kunci Audio API browser (harus dipicu oleh onClick)
  const unlockAudioAndStart = () => {
    setIsAudioUnlocked(true);
    
    // Opsional: Mainkan suara kosong (blank audio) pendek di sini jika 
    // browser sangat ketat, namun interaksi klik biasanya sudah cukup.
  };

  useEffect(() => {
    if (!isAudioUnlocked) return;

    // 1. Instansiasi Echo hanya jika belum ada (mencegah duplikasi saat re-render)
    if (!echoInstance.current) {
      const wsPort = process.env.NEXT_PUBLIC_REVERB_PORT
        ? Number(process.env.NEXT_PUBLIC_REVERB_PORT)
        : undefined;

      echoInstance.current = new Echo({
        broadcaster: "reverb",
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
        wsPort,
        wssPort: wsPort,
        forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
        enabledTransports: ["ws", "wss"],
      });
    }

    const echo = echoInstance.current;

    // 2. Bind event koneksi
    echo.connector.pusher.connection.bind('connected', () => setIsConnected(true));
    echo.connector.pusher.connection.bind('disconnected', () => setIsConnected(false));

    // 3. Subscribe ke channel
    const channel = echo.channel("display-board");

    // Sesuaikan parameter data dengan struktur interface yang baru
    channel.listen(".display.updated", (data: { announcement: AnnouncementPayload | null }) => {
      console.log("Pembaruan layar diterima:", data);
      
      if (data.announcement) {
        setAnnouncement(data.announcement);
        
        // Sesuaikan parameter yang dikirim ke TTS hook
        enqueueAnnouncement({
            message: data.announcement.message,
            ticket_number: data.announcement.ticket_number,
            counter_name: data.announcement.counter_name || "Loket"
        });
      }
    });

    // 4. Cleanup function
    return () => {
      echo.leaveChannel("display-board");
      echo.connector.pusher.connection.unbind('connected');
      echo.connector.pusher.connection.unbind('disconnected');
    };
  }, [isAudioUnlocked, enqueueAnnouncement]);

  // Layar Interaksi Pertama (Wajib untuk Autoplay Policy)
  if (!isAudioUnlocked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <button 
          onClick={unlockAudioAndStart}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-xl transition-transform transform hover:scale-105"
        >
          🚀 Mulai Sistem Antrean Layar TV
        </button>
      </div>
    );
  }

  // Layar Antrean Utama
  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Layar Antrean</h1>
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Audio Aktif 🔊</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}>
            {isConnected ? 'Live' : 'Connecting...'}
            </span>
        </div>
      </div>

      {announcement ? (
        <div className="bg-gray-800 border-2 border-blue-500 p-6 rounded-xl animate-pulse text-center transition-all duration-500">
          {/* Tampilkan Nama Layanan jika ada, jika tidak kosongkan */}
          {announcement.service_name && (
              <p className="text-xl text-blue-400 mb-2">Layanan: {announcement.service_name}</p>
          )}
          
          <h2 className="text-7xl font-black text-yellow-400 mb-4 tracking-wider">
            {announcement.ticket_number}
          </h2>
          
          {/* Tampilkan Nama Loket/Ruangan */}
          <p className="text-3xl font-semibold mb-2 text-white">
            Menuju: {announcement.counter_name}
          </p>
          
          <p className="text-gray-400 text-xl mt-4">{announcement.message}</p>
        </div>
      ) : (
        <div className="bg-gray-800 p-12 rounded-xl text-center text-gray-500 border border-gray-700">
          <p className="text-3xl">Belum ada panggilan antrean</p>
        </div>
      )}
    </div>
  );
}