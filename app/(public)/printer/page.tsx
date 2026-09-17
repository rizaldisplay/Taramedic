'use client';

/**
 * Demo page showing how the pieces fit together — the equivalent of the
 * Blade view that used to render `x-data="kioskShell(...)"`.
 */

import { useReceiptPrinter } from '@/hooks/useReceiptPrinter';
import { PrinterStatusWidget } from '@/features/kiosq/PrinterStatusWidget';

const INSTITUTION_CONFIG = {
  institutionName: 'Klinik Sehat Sentosa',
  institutionAddress: 'Jl. Merdeka No. 10, Surabaya',
  institutionPhone: '031-1234567',
};

export default function PrinterDemoPage() {
  // A page that only needs to trigger prints (no status UI) can call the
  // hook directly instead of rendering <PrinterStatusWidget />.
  const printer = useReceiptPrinter(INSTITUTION_CONFIG);

  const handlePrintSample = () => {
    void printer.printTicket({
      ticket_number: 'A012',
      service_name: 'Pendaftaran Umum',
      service_code: 'A',
      estimated_wait_minutes: 15,
      waiting_count: 4,
      queue_date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      issued_at: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 p-8 text-white">
      <header className="flex w-full max-w-md items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
        <span className="font-medium">{INSTITUTION_CONFIG.institutionName}</span>
        <PrinterStatusWidget {...INSTITUTION_CONFIG} />
      </header>

      <button
        type="button"
        onClick={handlePrintSample}
        disabled={!printer.isPaired}
        className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium transition hover:bg-emerald-500 disabled:opacity-40"
      >
        Cetak Tiket Contoh
      </button>

      {!printer.isPaired && (
        <p className="max-w-xs text-center text-sm text-white/50">
          Pasangkan printer melalui menu di kanan atas terlebih dahulu.
        </p>
      )}
    </main>
  );
}
