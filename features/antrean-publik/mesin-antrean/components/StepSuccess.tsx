/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Lock, Printer, RotateCcw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { mulaiKiosk } from '@/features/kiosq/slice/kioskSlice';
import { usePrinter } from '@/lib/printer/PrinterContext';

const DEFAULT_PREFIX: Record<string, string> = {
  BPJS: 'A001',
  Umum: 'B001',
  Asuransi: 'C001',
};

export const StepSuccess: React.FC = () => {
  const dispatch = useDispatch();
  const printer = usePrinter();
  const kioskState = useSelector((state: RootState) => state.kiosk) as Record<
    string,
    any
  >;

  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);
  const hasAutoPrintedRef = useRef(false);

  const kategori: string = kioskState?.jenisPenjamin || 'Asuransi';
  const nomorAntrean: string =
    kioskState?.nomorAntrean ||
    kioskState?.queueNumber ||
    kioskState?.ticket?.nomorAntrean ||
    kioskState?.dataAntrean?.nomorAntrean ||
    DEFAULT_PREFIX[kategori] ||
    'C001';
  const layanan: string =
    kioskState?.layanan ||
    kioskState?.namaPoli ||
    kioskState?.ticket?.layanan ||
    'Pendaftaran';
  const statusAntrean: string = 'Menunggu';

  const handlePrintTicket = async () => {
    if (isPrinting) return;
    setIsPrinting(true);

    try {
      const payload = {
        nomorAntrean,
        queueNumber: nomorAntrean,
        kategori,
        jenisPenjamin: kategori,
        layanan,
        status: statusAntrean,
        waktu: new Date().toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta',
          dateStyle: 'full',
          timeStyle: 'short',
        }),
      };

      const printerAny = printer as Record<string, any>;

      if (typeof printerAny.printTicket === 'function') {
        await printerAny.printTicket(payload);
      } else if (typeof printerAny.printReceipt === 'function') {
        await printerAny.printReceipt(payload);
      } else if (typeof printerAny.printQueueTicket === 'function') {
        await printerAny.printQueueTicket(payload);
      } else if (typeof printerAny.print === 'function') {
        await printerAny.print(payload);
      } else if (printer.isPaired && typeof printer.testPrint === 'function') {
        await printer.testPrint();
      } else {
        window.print();
      }

      setPrintSuccess(true);
      setTimeout(() => setPrintSuccess(false), 2500);
    } catch (error) {
      console.error('Gagal mencetak tiket antrean:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  // Otomatis cetak saat tiket diterbitkan apabila printer thermal sudah terhubung
  useEffect(() => {
    if (printer.isConnected && !hasAutoPrintedRef.current) {
      hasAutoPrintedRef.current = true;
      void handlePrintTicket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printer.isConnected]);

  const handleAmbilNomorBaru = () => {
    // Kembali ke layar Pilih Jenis Pendaftaran (Langkah 1 dari 2)
    dispatch(mulaiKiosk());
  };

  return (
    <div className="w-full max-w-[530px] mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_14px_40px_-14px_rgba(15,23,42,0.08)] px-6 py-7 sm:px-10 sm:py-9 text-center">
        {/* Badge Status Penerbitan */}
        <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#e6f7ef] text-[#219653] text-[11px] font-extrabold tracking-wider uppercase">
          TIKET BERHASIL DITERBITKAN
        </div>

        {/* Judul */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2942] mt-4">
          Nomor Antrean Anda
        </h2>

        {/* Nomor Antrean Besar */}
        <div className="text-6xl sm:text-[72px] font-black text-[#007a99] tracking-tight leading-none my-4 sm:my-5 tabular-nums">
          {nomorAntrean}
        </div>

        {/* Kotak Ringkasan Kategori, Status, Layanan */}
        <div className="rounded-2xl border border-slate-200/80 bg-[#fafcfd] overflow-hidden text-left my-5 sm:my-6">
          {/* Baris Atas: Kategori & Status */}
          <div className="grid grid-cols-2 divide-x divide-slate-200/80 border-b border-slate-200/80">
            <div className="p-3.5 sm:p-4">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                KATEGORI
              </p>
              <p className="text-sm sm:text-base font-extrabold text-[#0f2942] mt-1">
                {kategori}
              </p>
            </div>

            <div className="p-3.5 sm:p-4">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                STATUS
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0" />
                <span className="text-sm sm:text-base font-extrabold text-[#16a34a]">
                  {statusAntrean}
                </span>
              </div>
            </div>
          </div>

          {/* Baris Bawah: Layanan */}
          <div className="p-3.5 sm:p-4">
            <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              LAYANAN
            </p>
            <p className="text-sm sm:text-base font-extrabold text-[#0f2942] mt-1">
              {layanan}
            </p>
          </div>
        </div>

        {/* Teks Instruksi */}
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Harap tunggu hingga nomor Anda dipanggil oleh petugas.
        </p>

        {/* Dua Tombol Aksi: Ambil Nomor Baru & Cetak Tiket */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAmbilNomorBaru}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#1b75bc] hover:bg-[#15619d] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.25]" />
            <span>Ambil nomor baru</span>
          </button>

          <button
            type="button"
            onClick={() => void handlePrintTicket()}
            disabled={isPrinting}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] disabled:opacity-60 border border-slate-200/90 text-[#0f2942] text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            {printSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span className="text-emerald-700">Tiket Tercetak</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 text-[#007a99] stroke-[2]" />
                <span>{isPrinting ? 'Mencetak...' : 'Cetak Tiket'}</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Privasi di Dalam Kartu */}
        <div className="border-t border-slate-100 pt-4 mt-6 flex items-center gap-3 text-left">
          <Lock className="w-4 h-4 text-[#007a99] shrink-0" />
          <div>
            <p className="text-xs font-extrabold text-[#0f2942]">
              Privasi terjaga
            </p>
            <p className="text-[11px] text-slate-400">
              Tiket antrean tidak menampilkan data pribadi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};