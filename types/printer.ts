/**
 * Domain types for the kiosk receipt-printer module.
 * Mirrors the shapes implicitly used by the original escpos.js / receipt-printer.js.
 */

export type PaperWidth = 58 | 80;

export type PrinterStatus = 'idle' | 'pairing' | 'connecting' | 'connected' | 'error';

/** Jalur koneksi ke printer thermal. */
export type PrinterTransportType = 'bluetooth' | 'usb';

/** Perangkat yang sudah dipasangkan (disimpan per jenis koneksi). */
export interface PairedDevice {
  /** Bluetooth: BluetoothDevice.id. USB: `usb:<vendorId>:<productId>:<serial>`. */
  id: string;
  name: string;
}

/** Toggle/label overrides for the printed receipt layout (all optional; defaults live in escpos.ts). */
export interface ReceiptSettings {
  show_institution_name?: boolean;
  show_institution_address?: boolean;
  show_institution_phone?: boolean;
  show_receipt_title?: boolean;
  show_ticket_label?: boolean;
  show_service_name?: boolean;
  show_service_code?: boolean;
  show_estimated_wait?: boolean;
  show_waiting_count?: boolean;
  show_queue_date?: boolean;
  show_issued_time?: boolean;
  show_footer?: boolean;

  receipt_title_label?: string;
  ticket_number_label?: string;
  service_name_label?: string;
  service_code_label?: string;
  estimated_wait_label?: string;
  waiting_count_label?: string;
  queue_date_label?: string;
  issued_time_label?: string;
  estimated_wait_suffix?: string;
  waiting_count_suffix?: string;
  footer_line_1?: string;
  footer_line_2?: string;
  thank_you_label?: string;
}

/** A queue ticket, as printed on the receipt. */
export interface Ticket {
  ticket_number: string;
  service_name?: string;
  service_code?: string;
  estimated_wait_minutes?: number;
  waiting_count?: number;
  queue_date?: string;
  issued_at?: string;
}

/** Static institution/branding info supplied by the hosting page. */
export interface InstitutionConfig {
  institutionName?: string;
  institutionAddress?: string;
  institutionPhone?: string;
  receiptSettings?: ReceiptSettings;
}

export interface EncodeReceiptOptions extends InstitutionConfig {
  paperWidth?: PaperWidth;
}

/** Shape persisted to localStorage under STORAGE_KEY (see useReceiptPrinter). */
export interface StoredPrinterPrefs {
  paperWidth: PaperWidth;
  /** Jalur koneksi yang sedang dipilih. */
  transport: PrinterTransportType;
  /** Printer terakhir yang dipasangkan, terpisah untuk Bluetooth dan USB. */
  devices: Partial<Record<PrinterTransportType, PairedDevice>>;
  autoReconnectEnabled: boolean;

  /** @deprecated Format lama (hanya Bluetooth). Dibaca sekali untuk migrasi, tidak ditulis lagi. */
  deviceName?: string;
  /** @deprecated Lihat `deviceName`. */
  deviceId?: string;
}