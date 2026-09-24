import type { PairedDevice, PrinterTransportType } from '@/types/printer';

/**
 * Kontrak tunggal untuk semua jalur koneksi printer.
 * Hook `useReceiptPrinter` hanya bicara lewat interface ini, jadi menambah
 * jalur baru (misalnya Serial atau jaringan) cukup dengan satu class baru.
 */
export interface PrinterTransport {
  readonly type: PrinterTransportType;

  /** Apakah browser/konteks saat ini mendukung jalur ini. */
  isSupported(): boolean;

  /** Apakah saat ini sedang tersambung dan siap menerima data. */
  isConnected(): boolean;

  /**
   * Menampilkan dialog pemilihan perangkat lalu menyambung.
   * Harus dipanggil dari gesture pengguna (klik/tap).
   * Mengembalikan `null` jika pengguna membatalkan dialog.
   */
  pair(): Promise<PairedDevice | null>;

  /**
   * Menyambung ulang ke printer yang sudah pernah diizinkan, tanpa dialog.
   * Mengembalikan `null` jika perangkat tidak ditemukan atau izin sudah hilang.
   */
  reconnect(saved: PairedDevice): Promise<PairedDevice | null>;

  /** Mengirim byte ESC/POS ke printer. */
  write(data: Uint8Array): Promise<void>;

  /** Memutus sambungan. Tidak memicu disconnect handler. */
  disconnect(): Promise<void>;

  /** Memutus dan mencabut izin browser untuk printer ini (jika didukung). */
  forget(saved?: PairedDevice): Promise<void>;

  /** Dipanggil ketika sambungan putus tanpa diminta (kabel dicabut, printer mati). */
  setDisconnectHandler(handler: (() => void) | null): void;
}