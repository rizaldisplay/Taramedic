/**
 * Maps low-level Bluetooth/DOM errors to the same user-facing (Indonesian)
 * messages the original receipt-printer.js's friendlyError() produced.
 */
export function describePrinterError(error: unknown): string {
  const err = error as { name?: string; message?: string } | null | undefined;
  const name = err?.name ?? '';
  const message = String(err?.message ?? '');

  if (name === 'NotFoundError') {
    return 'Printer tidak ditemukan';
  }

  if (name === 'SecurityError') {
    return 'Izin ditolak — pakai HTTPS/localhost';
  }

  if (name === 'NetworkError' || message.includes('no longer in range') || message.includes('Timeout')) {
    return 'Printer di luar jangkauan / timeout';
  }

  return message || 'Koneksi Bluetooth gagal';
}