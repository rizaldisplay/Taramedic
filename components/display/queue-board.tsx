// app/(public)/kiosq-antrian/QueueBoard.tsx
'use client'; // Gunakan ini jika komponen butuh state/hook (useEffect, useState)

interface QueueBoardProps {
  /** Kirim true bila halaman dibuka dengan ?autostart=1 (mode kiosk). */
  autostart?: boolean;
  /**
   * Opsional: maksimal 3 nomor antrean berikutnya dari server.
   * Jika tidak dikirim, nomor diperkirakan dari nomor yang sedang dipanggil.
   */
  nextQueues?: string[];
}

export default function QueueBoard({ autostart, nextQueues }: QueueBoardProps) {
  return (
    <div>
      <h1>Papan Antrean</h1>
      <p>Mode Autostart: {autostart ? 'Aktif' : 'Tidak Aktif'}</p>
    </div>
  );
}