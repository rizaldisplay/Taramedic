import type { PrinterTransportType } from '@/types/printer';

/** Ubah error browser (DOMException dll.) menjadi pesan yang bisa ditindaklanjuti operator. */
export function describePrinterError(error: unknown, transport: PrinterTransportType): string {
  const name = error instanceof Error ? error.name : '';
  const message = error instanceof Error ? error.message : String(error ?? '');

  if (transport === 'usb') {
    if (name === 'SecurityError') {
      return 'Akses USB ditolak. Gunakan HTTPS dan izinkan perangkat saat diminta.';
    }

    if (name === 'NetworkError') {
      return 'Printer USB tidak bisa dibuka. Tutup aplikasi lain yang memakai printer. Di Windows pasang driver WinUSB (mis. lewat Zadig), di Linux atur udev rule.';
    }

    if (name === 'NotFoundError') {
      return 'Printer USB tidak ditemukan. Cek kabel lalu coba lagi.';
    }
  } else {
    if (name === 'NetworkError') {
      return 'Gagal tersambung ke printer. Pastikan printer menyala dan dekat dengan perangkat.';
    }

    if (name === 'SecurityError' || name === 'NotAllowedError') {
      return 'Akses Bluetooth ditolak. Izinkan Bluetooth untuk situs ini.';
    }
  }

  return message || 'Terjadi kesalahan pada printer.';
}