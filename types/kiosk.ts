export type KiosqStep = 0 | 1 | 2 | 3 ;
export type StatusPasien = 'Baru' | 'Lama' | null;
export type Penjamin = 'BPJS' | 'Umum' | null;

export interface TicketData {
    ticket_number: string;
    ticket_prefix: string;
    ticket_sequence: string;
    service_name: string;
    service_code: string;
    estimated_wait_minutes: number;
    waiting_count: number;
    issued_at: string;
    queue_date: string;
}