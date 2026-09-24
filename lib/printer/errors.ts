import type { PrinterTransportType } from '@/types/printer';

/** Ubah error browser (DOMException dll.) menjadi pesan yang bisa ditindaklanjuti operator. */
export function describePrinterError(error: unknown, transport: PrinterTransportType): string {
  const name = error instanceof Error ? error.name : '';
  const message = error instanceof Error ? error.message : String(error ?? '');

  if (transport === 'usb') {
    if (name === 'SecurityError') {
      const detail = message.toLowerCase();

      if (detail.includes('user gesture')) {
        return 'Dialog USB harus dibuka dari klik langsung. Klik "Pasangkan Printer" sekali lagi.';
      }

      if (detail.includes('permissions policy') || detail.includes('feature policy')) {
        return 'Fitur USB diblokir oleh Permissions-Policy atau iframe. Tambahkan header Permissions-Policy: usb=(self), atau atribut allow="usb" pada iframe.';
      }

      if (detail.includes('protected class')) {
        return 'Interface USB ini termasuk kelas terlindungi (mis. penyimpanan atau HID) dan tidak boleh dipakai browser.';
      }

      if (detail.includes('blocklist')) {
        return 'Perangkat ini masuk daftar blokir WebUSB di Chrome dan tidak bisa dipakai.';
      }

      return `Akses USB ditolak browser${message ? `: ${message}` : '.'}`;
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