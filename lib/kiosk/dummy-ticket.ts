import type { Ticket } from '@/types/printer';
import type { Penjamin } from '@/types/kiosk';

export interface CreateDummyTicketOptions {
    penjamin: Penjamin;
    serviceName?: string;
    serviceCode?: string;
    waitingCount?: number;
    /** Override the generated ticket number, e.g. to keep parity with a real counter. */
    ticketNumber?: string;
}

/**
 * Dummy `Ticket` for wiring/testing StepSuccess + the printer before the
 * real registration API is hooked up. Every field matches the same
 * `Ticket` type the API response will eventually fill in, so swapping
 * `createDummyTicket(...)` for `await registerQueue(...)` later is a
 * one-line change — nothing else (StepSuccess, escpos, printer hook)
 * needs to change.
 */
export function createDummyTicket({
    penjamin,
    serviceName = 'Poli Umum',
    serviceCode,
    waitingCount = 5,
    ticketNumber,
}: CreateDummyTicketOptions): Ticket {
    const now = new Date();
    const prefix = penjamin === 'BPJS' ? 'A' : 'B';
    const randomSeq = String(Math.floor(Math.random() * 99) + 1).padStart(3, '0');

    return {
        ticket_number: ticketNumber ?? `${prefix}${randomSeq}`,
        service_name: serviceName,
        service_code: serviceCode ?? prefix,
        estimated_wait_minutes: waitingCount * 5,
        waiting_count: waitingCount,
        queue_date: now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        issued_at: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
}
