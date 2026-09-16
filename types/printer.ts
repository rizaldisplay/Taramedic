/**
 * Domain types for the kiosk thermal receipt printer module.
 * Mirrors the shape produced by the queue backend (ticket) and the
 * receipt layout options accepted by the ESC/POS encoder.
 */

export type PrinterStatus = 'idle' | 'pairing' | 'connecting' | 'connected' | 'error';

export type PaperWidth = 58 | 80;

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

export interface Ticket {
    ticket_number: string;
    service_name?: string;
    service_code?: string;
    estimated_wait_minutes?: number;
    waiting_count?: number;
    queue_date?: string;
    issued_at?: string;
}

export interface EscPosOptions {
    paperWidth?: PaperWidth;
    institutionName?: string;
    institutionAddress?: string;
    institutionPhone?: string;
    receiptSettings?: ReceiptSettings;
}

/** Config passed in from the page/layout that hosts the kiosk shell. */
export interface ReceiptPrinterConfig {
    institutionName?: string;
    institutionAddress?: string;
    institutionPhone?: string;
    receiptSettings?: ReceiptSettings;
}

/** Shape persisted to localStorage between sessions. */
export interface ReceiptPrinterPrefs {
    paperWidth: PaperWidth;
    deviceName: string;
    deviceId: string;
    autoReconnectEnabled: boolean;
}