"use client";

import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import windowPusher from "pusher-js";

declare global {
  interface Window {
    Pusher?: typeof windowPusher;
  }
}

if (typeof window !== "undefined") {
  window.Pusher = windowPusher;
}

// Definisikan tipe data agar sesuai dengan broadcastWith() di Laravel
interface AnnouncementData {
  title: string;
  message: string;
  queue_number: string;
  room: string;
}

export default function QueueDisplay() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Inisialisasi Echo (sesuaikan env dengan arsitektur Nginx/Docker kamu)
    const wsPort = process.env.NEXT_PUBLIC_REVERB_PORT
      ? Number(process.env.NEXT_PUBLIC_REVERB_PORT)
      : undefined;

    const echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort,
      wssPort: wsPort,
      forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
      enabledTransports: ["ws", "wss"],
    });

    echo.connector.pusher.connection.bind('connected', () => setIsConnected(true));

    // Subscribe ke channel 'display-board'
    const channel = echo.channel("display-board");

    // WAJIB: Gunakan awalan titik (.) karena Laravel menggunakan broadcastAs()
    channel.listen(".display.updated", (data: { announcement: AnnouncementData | null }) => {
      console.log("Pembaruan layar diterima:", data);
      setAnnouncement(data.announcement);
    });

    return () => {
      echo.leaveChannel("display-board");
    };
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Layar Antrean</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
          {isConnected ? 'Live' : 'Connecting...'}
        </span>
      </div>

      {announcement ? (
        <div className="bg-gray-800 border-2 border-blue-500 p-6 rounded-xl animate-pulse text-center">
          <p className="text-xl text-blue-400 mb-2">{announcement.title}</p>
          <h2 className="text-6xl font-black text-yellow-400 mb-4 tracking-wider">
            {announcement.queue_number}
          </h2>
          <p className="text-2xl font-semibold mb-2">Menuju: {announcement.room}</p>
          <p className="text-gray-400 text-lg mt-4">{announcement.message}</p>
        </div>
      ) : (
        <div className="bg-gray-800 p-12 rounded-xl text-center text-gray-500">
          <p className="text-2xl">Belum ada panggilan antrean</p>
        </div>
      )}
    </div>
  );
}