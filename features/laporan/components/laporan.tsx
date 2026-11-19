'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  Calendar,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  Pill,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react';

export type ReportTabKey =
  | 'ringkasan'
  | 'kunjungan'
  | 'pendaftaran'
  | 'layanan'
  | 'farmasi'
  | 'inventori'
  | 'pembelian'
  | 'pendapatan'
  | 'pembayaran'
  | 'laba_kotor'
  | 'rincian_cogs';

export type ReportPeriodPresetKey =
  | 'hari_ini'
  | '7_hari'
  | '30_hari'
  | 'bulan_ini'
  | 'kustom';

export interface OverviewMetricCardData {
  number: string;
  title: string;
  status: 'Lengkap' | 'Belum lengkap';
  value: string;
  description: string;
  targetTab?: ReportTabKey;
}

export interface VisitTrendBarItem {
  index: string;
  dateLabel: string;
  count: number;
}

export interface OperationalDetailShortcut {
  number: string;
  label: string;
  tabKey: ReportTabKey;
}

const DEFAULT_OVERVIEW_METRICS: OverviewMetricCardData[] = [
  {
    number: '01',
    title: 'Kunjungan',
    status: 'Lengkap',
    value: '3',
    description: 'Rangkuman sesuai catatan yang tersedia.',
    targetTab: 'kunjungan',
  },
  {
    number: '02',
    title: 'Pasien baru',
    status: 'Lengkap',
    value: '0',
    description: 'Rangkuman sesuai catatan yang tersedia.',
    targetTab: 'pendaftaran',
  },
  {
    number: '03',
    title: 'Pendapatan tercatat',
    status: 'Lengkap',
    value: 'Rp 0',
    description: 'Snapshot transaksi Kasir; bukan klaim penjamin.',
    targetTab: 'pendapatan',
  },
  {
    number: '04',
    title: 'Pembayaran pasien',
    status: 'Lengkap',
    value: 'Rp 0',
    description: 'Transaksi Kasir tercatat.',
    targetTab: 'pembayaran',
  },
  {
    number: '05',
    title: 'Piutang terkonfirmasi',
    status: 'Belum lengkap',
    value: 'Tidak diketahui',
    description:
      'Ditahan karena sebagian tagihan belum memiliki snapshot nilai.',
    targetTab: 'pembayaran',
  },
  {
    number: '06',
    title: 'Penerimaan pembelian',
    status: 'Lengkap',
    value: 'Rp 0',
    description: 'Hanya penerimaan berstatus POSTED.',
    targetTab: 'pembelian',
  },
  {
    number: '07',
    title: 'COGS Farmasi',
    status: 'Lengkap',
    value: 'Rp 0',
    description: 'Rangkuman sesuai catatan yang tersedia.',
    targetTab: 'rincian_cogs',
  },
  {
    number: '08',
    title: 'Laba kotor Farmasi',
    status: 'Lengkap',
    value: 'Rp 0',
    description: 'Rangkuman sesuai catatan yang tersedia.',
    targetTab: 'laba_kotor',
  },
];

const DEFAULT_VISIT_TREND: VisitTrendBarItem[] = [
  { index: '01', dateLabel: '3 Nov', count: 1 },
  { index: '02', dateLabel: '5 Nov', count: 2 },
];

const DEFAULT_DATA_NOTICES: string[] = [
  'Pembayaran pasien tercatat bukan pendapatan klinik atau klaim penjamin; transaksi Kasir menjadi sumber pembayaran.',
  'Umur piutang tidak tersedia karena sumber saat ini tidak menyimpan tanggal jatuh tempo.',
  '3 kunjungan belum memiliki snapshot nilai tagihan yang dapat dipakai; total piutang lengkap tidak dihitung.',
  'Pengadaan aktual hanya menghitung penerimaan berstatus POSTED pada waktu posting; nilai PO adalah alur pemesanan dan tidak dihitung sebagai pembelian.',
  'COGS dan laba kotor yang dapat dipastikan pada laporan ini hanya mencakup Farmasi. Sumber biaya layanan/tindakan belum tersedia, sehingga laba kotor klinik gabungan tidak dihitung.',
];

const OPERATIONAL_DETAIL_ITEMS: OperationalDetailShortcut[] = [
  { number: '01', label: 'Kunjungan', tabKey: 'kunjungan' },
  { number: '02', label: 'Pendaftaran', tabKey: 'pendaftaran' },
  { number: '03', label: 'Layanan', tabKey: 'layanan' },
  { number: '04', label: 'Farmasi', tabKey: 'farmasi' },
  { number: '05', label: 'Inventori', tabKey: 'inventori' },
  { number: '06', label: 'Pembelian', tabKey: 'pembelian' },
  { number: '07', label: 'Pendapatan', tabKey: 'pendapatan' },
  { number: '08', label: 'Pembayaran', tabKey: 'pembayaran' },
  { number: '09', label: 'Laba kotor', tabKey: 'laba_kotor' },
];

const REPORT_TABS: {
  key: ReportTabKey;
  label: string;
  Icon: React.ElementType;
}[] = [
  { key: 'ringkasan', label: 'Ringkasan', Icon: Activity },
  { key: 'kunjungan', label: 'Kunjungan', Icon: Users },
  { key: 'pendaftaran', label: 'Pendaftaran', Icon: ClipboardList },
  { key: 'layanan', label: 'Layanan', Icon: Stethoscope },
  { key: 'farmasi', label: 'Farmasi', Icon: Pill },
  { key: 'inventori', label: 'Inventori', Icon: Boxes },
  { key: 'pembelian', label: 'Pembelian', Icon: ShoppingCart },
  { key: 'pendapatan', label: 'Pendapatan', Icon: Receipt },
  { key: 'pembayaran', label: 'Pembayaran', Icon: CreditCard },
  { key: 'laba_kotor', label: 'Laba kotor', Icon: TrendingUp },
  { key: 'rincian_cogs', label: 'Rincian COGS', Icon: FileSpreadsheet },
];

const PERIOD_PRESETS: {
  key: ReportPeriodPresetKey;
  label: string;
  displayRange: string;
  isoStart: string;
  isoEnd: string;
}[] = [
  {
    key: 'hari_ini',
    label: 'Hari ini',
    displayRange: '19 Nov 2026',
    isoStart: '2026-11-19',
    isoEnd: '2026-11-19',
  },
  {
    key: '7_hari',
    label: '7 hari',
    displayRange: '13 Nov 2026 – 19 Nov 2026',
    isoStart: '2026-11-13',
    isoEnd: '2026-11-19',
  },
  {
    key: '30_hari',
    label: '30 hari',
    displayRange: '21 Okt 2026 – 19 Nov 2026',
    isoStart: '2026-10-21',
    isoEnd: '2026-11-19',
  },
  {
    key: 'bulan_ini',
    label: 'Bulan ini',
    displayRange: '1 Nov 2026 – 19 Nov 2026',
    isoStart: '2026-11-01',
    isoEnd: '2026-11-19',
  },
  {
    key: 'kustom',
    label: 'Kustom',
    displayRange: '1 Nov 2026 – 19 Nov 2026',
    isoStart: '2026-11-01',
    isoEnd: '2026-11-19',
  },
];

function formatIndonesianDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PusatLaporanKlinik({
  lastUpdatedText = '19 Nov 2026 09:30 WIB',
  metrics = DEFAULT_OVERVIEW_METRICS,
  visitTrend = DEFAULT_VISIT_TREND,
  dataNotices = DEFAULT_DATA_NOTICES,
  onTabChange,
  onPeriodChange,
}: {
  lastUpdatedText?: string;
  metrics?: OverviewMetricCardData[];
  visitTrend?: VisitTrendBarItem[];
  dataNotices?: string[];
  onTabChange?: (tab: ReportTabKey) => void;
  onPeriodChange?: (range: {
    preset: ReportPeriodPresetKey;
    startDate: string;
    endDate: string;
  }) => void;
}) {
  const [activeTab, setActiveTab] = useState<ReportTabKey>('ringkasan');
  const [selectedPreset, setSelectedPreset] =
    useState<ReportPeriodPresetKey>('bulan_ini');
  const [customStartDate, setCustomStartDate] = useState('2026-11-01');
  const [customEndDate, setCustomEndDate] = useState('2026-11-19');

  const activePeriod = useMemo(() => {
    if (selectedPreset === 'kustom') {
      return {
        displayRange: `${formatIndonesianDate(customStartDate)} – ${formatIndonesianDate(customEndDate)}`,
        isoStart: customStartDate,
        isoEnd: customEndDate,
      };
    }

    const found =
      PERIOD_PRESETS.find((p) => p.key === selectedPreset) ?? PERIOD_PRESETS[3];
    return {
      displayRange: found.displayRange,
      isoStart: found.isoStart,
      isoEnd: found.isoEnd,
    };
  }, [selectedPreset, customStartDate, customEndDate]);

  const maxTrendCount = useMemo(() => {
    if (visitTrend.length === 0) return 1;
    return Math.max(...visitTrend.map((item) => item.count), 1);
  }, [visitTrend]);

  const activeTabMeta = useMemo(
    () => REPORT_TABS.find((t) => t.key === activeTab) ?? REPORT_TABS[0],
    [activeTab],
  );

  const handleSelectTab = (tab: ReportTabKey) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const handleSelectPreset = (preset: ReportPeriodPresetKey) => {
    setSelectedPreset(preset);
    if (preset === 'kustom') {
      onPeriodChange?.({
        preset,
        startDate: customStartDate,
        endDate: customEndDate,
      });
      return;
    }

    const found = PERIOD_PRESETS.find((p) => p.key === preset);
    if (found) {
      setCustomStartDate(found.isoStart);
      setCustomEndDate(found.isoEnd);
      onPeriodChange?.({
        preset,
        startDate: found.isoStart,
        endDate: found.isoEnd,
      });
    }
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-3.5">
      {/* 1. HEADER BANNER GRADIENT PUSAT LAPORAN */}
      <header className="rounded-2xl bg-gradient-to-r from-[#0e7490] via-[#0891b2] to-[#0284c7] px-6 py-5 sm:px-7 sm:py-6 text-white shadow-[0_2px_8px_rgba(8,145,178,0.16)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cyan-100/90">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-200" />
            <span>OPERASIONAL KLINIK</span>
            <span className="opacity-60">/</span>
            <span>PUSAT LAPORAN</span>
          </div>

          <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-white mt-1 leading-tight">
            Laporan
          </h1>

          <p className="text-xs sm:text-[13px] text-cyan-50/90 mt-1">
            Angka operasional yang jelas, terlacak, dan aman untuk dipakai
            selama shift.
          </p>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-[#0f3d56] text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#008ba6] shrink-0" />
            <span>Ringkasan tanpa identitas pasien</span>
          </div>

          <p className="text-[11px] text-cyan-100/90">
            Diperbarui {lastUpdatedText}
          </p>
        </div>
      </header>

      {/* 2. BAR FILTER PERIODE LAPORAN */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-4 sm:px-5 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-500 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                PERIODE LAPORAN
              </p>
              <p className="text-xs sm:text-[13px] font-extrabold text-[#0f3d56] mt-0.5 tabular-nums">
                {activePeriod.displayRange}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {PERIOD_PRESETS.map(({ key, label }) => {
              const isSelected = selectedPreset === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPreset(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#f0f9fb] border border-[#009bb8] text-[#008ba6] font-bold'
                      : 'border border-transparent text-slate-500 font-semibold hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {selectedPreset === 'kustom' && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <label
                htmlFor="laporan-tanggal-mulai"
                className="font-semibold text-slate-500"
              >
                Dari:
              </label>
              <input
                id="laporan-tanggal-mulai"
                type="date"
                value={customStartDate}
                max={customEndDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomStartDate(val);
                  onPeriodChange?.({
                    preset: 'kustom',
                    startDate: val,
                    endDate: customEndDate,
                  });
                }}
                className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
              />
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="laporan-tanggal-akhir"
                className="font-semibold text-slate-500"
              >
                Sampai:
              </label>
              <input
                id="laporan-tanggal-akhir"
                type="date"
                value={customEndDate}
                min={customStartDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomEndDate(val);
                  onPeriodChange?.({
                    preset: 'kustom',
                    startDate: customStartDate,
                    endDate: val,
                  });
                }}
                className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
              />
            </div>
          </div>
        )}
      </section>

      {/* 3. BARIS TAB NAVIGASI PUSAT LAPORAN */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-4 sm:px-5">
        <div
          role="tablist"
          aria-label="Navigasi Kategori Laporan Operasional"
          className="flex items-center gap-5 sm:gap-6 overflow-x-auto"
        >
          {REPORT_TABS.map(({ key, label, Icon }) => {
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectTab(key)}
                className={`relative py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#008ba6] font-bold'
                    : 'text-slate-500 font-semibold hover:text-slate-700'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#008ba6]' : 'text-slate-400'
                  }`}
                />
                <span>{label}</span>

                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. KONTEN UTAMA TAB RINGKASAN */}
      {activeTab === 'ringkasan' ? (
        <div className="space-y-4">
          {/* Header Section: Gambaran Satu Rentang + Pill Rentang Tanggal */}
          <div className="pt-1 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] leading-snug">
                Gambaran Satu Rentang
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ringkasan agregat dari catatan operasional yang tercatat.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                RENTANG
              </p>
              <p className="text-xs font-bold text-[#0f3d56] mt-0.5 tabular-nums">
                {activePeriod.isoStart} — {activePeriod.isoEnd}
              </p>
            </div>
          </div>

          {/* Grid Utama: 8 Kartu KPI (Kiri) + Tren Kunjungan (Kanan) */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-4 items-stretch">
            {/* Kolom Kiri: 8 Kartu Metrik Operasional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {metrics.map((card) => {
                const isComplete = card.status === 'Lengkap';

                return (
                  <div
                    key={card.number}
                    onClick={() =>
                      card.targetTab && handleSelectTab(card.targetTab)
                    }
                    className={`relative overflow-hidden bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 flex flex-col justify-between min-h-[126px] transition-colors ${
                      card.targetTab
                        ? 'hover:border-cyan-200 cursor-pointer'
                        : ''
                    }`}
                  >
                    {/* Header Kartu */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs sm:text-[13px] font-bold text-slate-600">
                        {card.title}
                      </h3>

                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          isComplete
                            ? 'bg-emerald-50 border border-emerald-200/80 text-emerald-700'
                            : 'bg-amber-50 border border-amber-200/80 text-amber-700'
                        }`}
                      >
                        {card.status}
                      </span>
                    </div>

                    {/* Angka Utama & Keterangan */}
                    <div className="mt-4 pr-10">
                      <p className="text-2xl font-extrabold text-[#0f3d56] tracking-tight tabular-nums">
                        {card.value}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    {/* Ornamen Lengkungan Nomor Indeks Pojok Kanan Bawah */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-5 -right-5 w-16 h-16 rounded-full border border-slate-200/70 bg-slate-50/40 flex items-start justify-start pt-3 pl-3.5"
                    >
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                        {card.number}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Kolom Kanan: Kartu Tren Kunjungan */}
            <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 sm:p-6 flex flex-col justify-between min-h-[340px]">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                  Tren Kunjungan
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  {visitTrend.length} hari
                </span>
              </div>

              {visitTrend.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                  Belum ada data tren kunjungan pada rentang ini.
                </div>
              ) : (
                <div className="flex-1 flex items-end justify-around gap-6 pt-10 pb-3 px-4">
                  {visitTrend.map((bar) => {
                    const fillPercent = Math.max(
                      12,
                      Math.round((bar.count / maxTrendCount) * 68),
                    );

                    return (
                      <div
                        key={bar.index}
                        className="flex flex-col items-center"
                      >
                        <span className="text-xs font-extrabold text-[#0f3d56] tabular-nums mb-2">
                          {bar.count}
                        </span>

                        <div className="w-6 sm:w-7 h-56 sm:h-64 rounded-md bg-slate-100/90 flex items-end overflow-hidden">
                          <div
                            style={{ height: `${fillPercent}%` }}
                            className="w-full rounded-t-md bg-gradient-to-t from-[#0e7490] via-[#0891b2] to-[#2dd4bf] transition-all duration-300"
                          />
                        </div>

                        <span className="text-[11px] font-semibold text-slate-500 mt-2.5">
                          {bar.dateLabel}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 mt-0.5 tabular-nums">
                          {bar.index}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Callout Banner: Perhatian pada data */}
          <section className="rounded-xl border border-amber-300/80 bg-amber-50/75 px-5 py-4">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <h3 className="text-xs sm:text-[13px] font-bold">
                Perhatian pada data
              </h3>
            </div>

            <ul className="mt-2 pl-6 space-y-1 text-xs text-amber-900/85 leading-relaxed">
              {dataNotices.map((notice, idx) => (
                <li key={idx}>{notice}</li>
              ))}
            </ul>
          </section>

          {/* Kartu Navigasi Bawah: Pilih Rincian Operasional */}
          <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              TELUSURI LEBIH LANJUT
            </p>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56] mt-0.5">
              Pilih Rincian Operasional
            </h2>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-x-8">
              {OPERATIONAL_DETAIL_ITEMS.map((item) => (
                <button
                  key={item.number}
                  type="button"
                  onClick={() => handleSelectTab(item.tabKey)}
                  className="group py-3 border-b border-slate-100 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 px-1.5 rounded-md transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[11px] font-bold text-slate-400 tabular-nums">
                      {item.number}
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-700 group-hover:text-[#008ba6] transition-colors truncate">
                      {item.label}
                    </span>
                  </div>

                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#008ba6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* Tampilan Sub-Tab Rincian Laporan saat Tab Selain Ringkasan Dipilih */
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                RINCIAN OPERASIONAL · {activePeriod.displayRange}
              </p>
              <h2 className="text-lg font-extrabold text-[#0f3d56] mt-0.5">
                Laporan {activeTabMeta.label}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => handleSelectTab('ringkasan')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Kembali ke Ringkasan</span>
            </button>
          </div>

          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mx-auto mb-3">
              <activeTabMeta.Icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-[#0f3d56]">
              Sub-laporan {activeTabMeta.label}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Hubungkan tabel rincian{' '}
              <code className="text-[#008ba6]">{activeTab}</code> untuk periode{' '}
              <strong className="text-slate-600">
                {activePeriod.isoStart} s/d {activePeriod.isoEnd}
              </strong>{' '}
              melalui prop <code className="text-[#008ba6]">onTabChange</code>.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}