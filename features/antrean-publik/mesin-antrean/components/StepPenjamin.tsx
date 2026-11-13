'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Loader2,
  ScanLine,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  pilihPenjamin,
  submitPendaftaranKiosk,
} from '@/features/kiosq/slice/kioskSlice';
import { JenisPenjamin } from '@/types/common';

export type JenisPendaftaranOption = 'BPJS' | 'Umum' | 'Asuransi';

interface RegistrationCardConfig {
  kode: 'A' | 'B' | 'C';
  value: JenisPendaftaranOption;
  title: string;
  subtitle: string;
  description: string;
  cardBg: string;
  cardBorder: string;
  footerBg: string;
  footerBorder: string;
  badgeBg: string;
  arrowBg: string;
  arrowText: string;
  footerIconBg: string;
  footerIconText: string;
  FooterIcon: React.ElementType;
}

const PENDAFTARAN_OPTIONS: RegistrationCardConfig[] = [
  {
    kode: 'A',
    value: 'BPJS',
    title: 'Pasien BPJS',
    subtitle: 'Peserta BPJS / JKN',
    description: 'Menggunakan kartu BPJS untuk berobat di klinik ini.',
    cardBg: 'bg-[#f6faff] hover:bg-[#eff6ff]',
    cardBorder: 'border-sky-200/80 hover:border-[#2579c2]/60',
    footerBg: 'bg-[#eef5fc]/70',
    footerBorder: 'border-sky-200/60',
    badgeBg: 'bg-[#2579c2]',
    arrowBg: 'bg-[#e3effb] group-hover:bg-[#d4e7fa]',
    arrowText: 'text-[#2579c2]',
    footerIconBg: 'bg-[#e0eefb]',
    footerIconText: 'text-[#2579c2]',
    FooterIcon: ScanLine,
  },
  {
    kode: 'B',
    value: 'Umum',
    title: 'Pasien Umum',
    subtitle: 'Pembayaran pribadi',
    description: 'Pasien umum / non-BPJS membayar secara pribadi.',
    cardBg: 'bg-[#f5fbf8] hover:bg-[#edf8f2]',
    cardBorder: 'border-emerald-200/80 hover:border-[#34a86e]/60',
    footerBg: 'bg-[#ebf7f1]/70',
    footerBorder: 'border-emerald-200/60',
    badgeBg: 'bg-[#34a86e]',
    arrowBg: 'bg-[#e2f4eb] group-hover:bg-[#d2eedf]',
    arrowText: 'text-[#34a86e]',
    footerIconBg: 'bg-[#dcf2e7]',
    footerIconText: 'text-[#34a86e]',
    FooterIcon: WalletCards,
  },
  {
    kode: 'C',
    value: 'Asuransi',
    title: 'Pasien Asuransi',
    subtitle: 'Penjamin asuransi',
    description: 'Gunakan penjamin asuransi sesuai otorisasi klinik.',
    cardBg: 'bg-[#fdf9f2] hover:bg-[#fbf3e6]',
    cardBorder: 'border-amber-200/80 hover:border-[#c88628]/60',
    footerBg: 'bg-[#f9f1e4]/70',
    footerBorder: 'border-amber-200/60',
    badgeBg: 'bg-[#c88628]',
    arrowBg: 'bg-[#f8ecd8] group-hover:bg-[#f3e1c3]',
    arrowText: 'text-[#c88628]',
    footerIconBg: 'bg-[#f5e6ce]',
    footerIconText: 'text-[#c88628]',
    FooterIcon: ShieldCheck,
  },
];

export const StepPenjamin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selected = useSelector((state: RootState) => state.kiosk.jenisPenjamin);
  const [submittingValue, setSubmittingValue] =
    useState<JenisPendaftaranOption | null>(null);

  const handleSelect = async (val: JenisPendaftaranOption) => {
    if (submittingValue) return;

    setSubmittingValue(val);
    try {
      dispatch(pilihPenjamin(val as JenisPenjamin));
      await dispatch(submitPendaftaranKiosk(val as JenisPenjamin));
    } finally {
      setSubmittingValue(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Pill Badge Langkah */}
      <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-[#e6f4f8] text-[#007a99] text-[11px] font-extrabold tracking-wider uppercase mb-3">
        LANGKAH 1 DARI 2
      </div>

      {/* Judul & Subjudul */}
      <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#0b2c4d] tracking-tight uppercase">
        PILIH JENIS PENDAFTARAN
      </h2>
      <p className="text-xs sm:text-sm lg:text-base text-slate-500 mt-1.5 mb-7 sm:mb-9">
        Silakan Pilih Sesuai Kepesertaan Anda.
      </p>

      {/* Grid 3 Kartu Pilihan (A, B, C) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 text-left">
        {PENDAFTARAN_OPTIONS.map((item) => {
          const isLoading =
            submittingValue === item.value ||
            (Boolean(submittingValue) && selected === item.value);
          const FooterIcon = item.FooterIcon;

          return (
            <button
              key={item.kode}
              type="button"
              disabled={Boolean(submittingValue)}
              onClick={() => handleSelect(item.value)}
              className={`group flex flex-col justify-between rounded-2xl border transition-all overflow-hidden shadow-[0_2px_10px_-4px_rgba(15,23,42,0.05)] active:scale-[0.985] disabled:cursor-not-allowed cursor-pointer ${item.cardBg} ${item.cardBorder}`}
            >
              {/* Bagian Atas Kartu */}
              <div className="flex items-center justify-between gap-3.5 p-5 sm:p-6">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Kotak Huruf A / B / C */}
                  <div
                    className={`w-15 h-15 sm:w-16 sm:h-16 rounded-2xl ${item.badgeBg} text-white flex items-center justify-center text-2xl sm:text-3xl font-extrabold shrink-0 shadow-xs transition-transform group-hover:scale-105`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-7 h-7 animate-spin" />
                    ) : (
                      item.kode
                    )}
                  </div>

                  {/* Judul & Subjudul Kartu */}
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-[19px] font-extrabold text-[#0f2942] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-medium text-slate-500 mt-0.5 leading-snug">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Tombol Panah Kanan */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${item.arrowBg} ${item.arrowText} flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5`}
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.25]" />
                </div>
              </div>

              {/* Bagian Bawah Kartu (Keterangan) */}
              <div
                className={`flex items-center gap-3 px-5 py-3.5 border-t ${item.footerBorder} ${item.footerBg}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg ${item.footerIconBg} ${item.footerIconText} flex items-center justify-center shrink-0`}
                >
                  <FooterIcon className="w-4 h-4 stroke-[2]" />
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};