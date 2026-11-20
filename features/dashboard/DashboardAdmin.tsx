'use client';

import React, { useMemo } from 'react';
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  HeartPulse,
  Pill,
  Receipt,
  Stethoscope,
  Users,
} from 'lucide-react';

export interface DailyVisitPoint {
  dateKey: string;
  label: string; // Contoh: 'Sab, 14'
  count: number;
}

export interface ClinicDashboardData {
  kunjunganTercatat: number;
  antreanPoli: number;
  sedangDilayani: number;
  selesaiDiPoli: number;
  pembayaranPasienNominal: number;
  transaksiLunasHariIni: number;
  kunjungan7Hari: DailyVisitPoint[];
  antreanHariIni: {
    aktifDiPendaftaran: number;
    menungguDiPoli: number;
    sedangDilayaniDiPoli: number;
  };
  handoffDokter: {
    menunggu: number;
    sedangDitangani: number;
  };
  farmasi: {
    dalamTahapTelaah: number;
    sedangDisiapkan: number;
    siapDiserahkan: number;
    diserahkanHariIni: number;
  };
  kasir: {
    antreanAktif: number;
  };
}

const DEFAULT_DASHBOARD_DATA: ClinicDashboardData = {
  kunjunganTercatat: 0,
  antreanPoli: 0,
  sedangDilayani: 0,
  selesaiDiPoli: 0,
  pembayaranPasienNominal: 0,
  transaksiLunasHariIni: 0,
  kunjungan7Hari: [
    { dateKey: '2026-11-14', label: 'Sab, 14', count: 0 },
    { dateKey: '2026-11-15', label: 'Min, 15', count: 0 },
    { dateKey: '2026-11-16', label: 'Sen, 16', count: 0 },
    { dateKey: '2026-11-17', label: 'Sel, 17', count: 0 },
    { dateKey: '2026-11-18', label: 'Rab, 18', count: 0 },
    { dateKey: '2026-11-19', label: 'Kam, 19', count: 0 },
    { dateKey: '2026-11-20', label: 'Jum, 20', count: 0 },
  ],
  antreanHariIni: {
    aktifDiPendaftaran: 0,
    menungguDiPoli: 0,
    sedangDilayaniDiPoli: 0,
  },
  handoffDokter: {
    menunggu: 0,
    sedangDitangani: 0,
  },
  farmasi: {
    dalamTahapTelaah: 0,
    sedangDisiapkan: 0,
    siapDiserahkan: 0,
    diserahkanHariIni: 0,
  },
  kasir: {
    antreanAktif: 0,
  },
};

function formatRupiah(nominal: number): string {
  return `Rp ${nominal.toLocaleString('id-ID')}`;
}

export default function DashboardOperasionalKlinik({
  data = DEFAULT_DASHBOARD_DATA,
  onNavigateAntrean,
  onNavigateEmrDokter,
  onNavigateFarmasi,
  onNavigateKasir,
}: {
  data?: ClinicDashboardData;
  onNavigateAntrean?: () => void;
  onNavigateEmrDokter?: () => void;
  onNavigateFarmasi?: () => void;
  onNavigateKasir?: () => void;
}) {
  const maxDailyVisits = useMemo(() => {
    const maxVal = Math.max(...data.kunjungan7Hari.map((d) => d.count), 0);
    return maxVal > 0 ? maxVal : 1;
  }, [data.kunjungan7Hari]);

  const topKpiCards = [
    {
      title: 'Kunjungan tercatat',
      value: String(data.kunjunganTercatat),
      subtitle: 'Antrean klinik hari ini · WIB',
      icon: Users,
      iconBadgeClass: 'bg-[#edf7fc] text-[#0077b6]',
      cornerTintClass: 'bg-[#edf7fc]/85',
    },
    {
      title: 'Antrean poli',
      value: String(data.antreanPoli),
      subtitle: 'Belum mulai dilayani',
      icon: Clock,
      iconBadgeClass: 'bg-amber-50 text-amber-600',
      cornerTintClass: 'bg-[#edf7fc]/85',
    },
    {
      title: 'Sedang dilayani',
      value: String(data.sedangDilayani),
      subtitle: 'Di seluruh poli',
      icon: HeartPulse,
      iconBadgeClass: 'bg-teal-50 text-teal-600',
      cornerTintClass: 'bg-[#edf7fc]/85',
    },
    {
      title: 'Selesai di poli',
      value: String(data.selesaiDiPoli),
      subtitle: 'Diselesaikan hari ini · WIB',
      icon: CheckCircle2,
      iconBadgeClass: 'bg-emerald-50 text-emerald-600',
      cornerTintClass: 'bg-[#edf7fc]/85',
    },
    {
      title: 'Pembayaran pasien',
      value: formatRupiah(data.pembayaranPasienNominal),
      subtitle: `${data.transaksiLunasHariIni} transaksi lunas tercatat hari ini`,
      icon: Banknote,
      iconBadgeClass: 'bg-[#e6f6f9] text-[#008ba6]',
      cornerTintClass: 'bg-[#edf7fc]/85',
    },
  ];

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-5">
      {/* =====================================================================
          1. BARIS 5 KARTU METRIK UTAMA HARI INI
         ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {topKpiCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="relative overflow-hidden bg-white rounded-xl border border-slate-200/90 px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex flex-col justify-between min-h-[122px]"
            >
              {/* Dekorasi lengkungan sudut kanan bawah sesuai acuan */}
              <span
                aria-hidden="true"
                className={`pointer-events-none w-16 h-16 rounded-full ${card.cornerTintClass} absolute -bottom-5 -right-5`}
              />

              <div className="flex items-start justify-between gap-2 relative z-10">
                <p className="text-xs font-bold text-slate-500">{card.title}</p>
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${card.iconBadgeClass}`}
                >
                  <Icon className="w-4 h-4" />
                </span>
              </div>

              <div className="mt-3 relative z-10">
                <p className="text-xl sm:text-2xl font-extrabold text-[#0f3d56] tabular-nums tracking-tight leading-none">
                  {card.value}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  {card.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          2. GRAFIK KUNJUNGAN TERCATAT (7 HARI) & RINGKASAN ANTREAN HARI INI
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4 items-stretch">
        {/* Kartu Kiri: Grafik Batang Kunjungan Tercatat 7 Hari */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex flex-col">
          <div className="px-5 pt-4 pb-3.5 border-b border-slate-100 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#0f3d56]">
                Kunjungan Tercatat
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Per hari selama tujuh hari terakhir, berdasarkan tanggal
                operasional antrean.
              </p>
            </div>
            <span className="text-[11px] font-medium text-slate-400 shrink-0">
              7 Hari
            </span>
          </div>

          <div className="px-6 pt-6 pb-5 flex-1 flex flex-col justify-end min-h-[210px]">
            <div className="grid grid-cols-7 gap-3 items-end h-36">
              {data.kunjungan7Hari.map((day) => {
                const heightPercent =
                  day.count === 0
                    ? 0
                    : Math.max(12, Math.round((day.count / maxDailyVisits) * 100));

                return (
                  <div
                    key={day.dateKey}
                    className="flex flex-col items-center justify-end h-full group"
                  >
                    {day.count > 0 && (
                      <span className="text-[10px] font-bold text-[#0f3d56] mb-1 tabular-nums">
                        {day.count}
                      </span>
                    )}

                    <div className="w-full flex items-end justify-center flex-1">
                      <div
                        title={`${day.label}: ${day.count} kunjungan`}
                        style={
                          day.count > 0
                            ? { height: `${heightPercent}%` }
                            : undefined
                        }
                        className={`w-7 sm:w-8 rounded-t-[3px] transition-all ${
                          day.count > 0
                            ? 'bg-[#3db8b0] group-hover:bg-[#008ba6]'
                            : 'h-[5px] bg-[#3db8b0]'
                        }`}
                      />
                    </div>

                    <span className="text-[11px] text-slate-400 mt-2.5 whitespace-nowrap">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Kartu Kanan: Antrean Hari Ini */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex flex-col justify-between">
          <div>
            <div className="px-5 pt-4 pb-3.5 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-[#0f3d56]">
                Antrean Hari Ini
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tahap pendaftaran dan poli dihitung terpisah.
              </p>
            </div>

            <div className="px-5 py-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Aktif di pendaftaran</span>
                <span className="font-extrabold text-[#0f3d56] tabular-nums">
                  {data.antreanHariIni.aktifDiPendaftaran}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Menunggu di poli</span>
                <span className="font-extrabold text-[#0f3d56] tabular-nums">
                  {data.antreanHariIni.menungguDiPoli}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Sedang dilayani di poli</span>
                <span className="font-extrabold text-[#0f3d56] tabular-nums">
                  {data.antreanHariIni.sedangDilayaniDiPoli}
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 py-3.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onNavigateAntrean}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0077b6] hover:text-[#005f92] transition-colors cursor-pointer"
            >
              <span>Buka Antrean</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>

      {/* =====================================================================
          3. PEMANTAUAN LINTAS MODUL (HANDOFF DOKTER, FARMASI, KASIR)
         ===================================================================== */}
      <div className="space-y-3 pt-1">
        <div>
          <h2 className="text-sm font-extrabold text-[#0f3d56]">
            Pemantauan Lintas Modul
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Buka modul terkait untuk melihat rincian dan menindaklanjuti.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Kartu 1: Handoff dokter */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex flex-col justify-between">
            <div>
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#008ba6] shrink-0" />
                <h3 className="text-xs font-extrabold text-[#0f3d56]">
                  Handoff dokter
                </h3>
              </div>

              <div className="px-5 py-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Menunggu</span>
                  <span className="font-extrabold text-[#0f3d56] tabular-nums">
                    {data.handoffDokter.menunggu}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Sedang ditangani</span>
                  <span className="font-extrabold text-[#0f3d56] tabular-nums">
                    {data.handoffDokter.sedangDitangani}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onNavigateEmrDokter}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0077b6] hover:text-[#005f92] transition-colors cursor-pointer"
              >
                <span>Buka EMR dokter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Kartu 2: Farmasi */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex flex-col justify-between">
            <div>
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#008ba6] shrink-0" />
                <h3 className="text-xs font-extrabold text-[#0f3d56]">
                  Farmasi
                </h3>
              </div>

              <div className="px-5 py-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Dalam tahap telaah</span>
                  <span className="font-extrabold text-[#0f3d56] tabular-nums">
                    {data.farmasi.dalamTahapTelaah}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Sedang disiapkan</span>
                  <span className="font-extrabold text-[#0f3d56] tabular-nums">
                    {data.farmasi.sedangDisiapkan}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Siap diserahkan</span>
                  <span className="font-extrabold text-[#0f3d56] tabular-nums">
                    {data.farmasi.siapDiserahkan}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Diserahkan hari ini</span>
                  <span className="font-extrabold text-[#0f3d56] tabular-nums">
                    {data.farmasi.diserahkanHariIni}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onNavigateFarmasi}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0077b6] hover:text-[#005f92] transition-colors cursor-pointer"
              >
                <span>Buka Farmasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Kartu 3: Kasir */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex flex-col justify-between">
            <div>
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#008ba6] shrink-0" />
                <h3 className="text-xs font-extrabold text-[#0f3d56]">Kasir</h3>
              </div>

              <div className="px-5 py-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Antrean aktif</span>
                  <span className="font-extrabold text-[#0f3d56] tabular-nums">
                    {data.kasir.antreanAktif}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onNavigateKasir}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0077b6] hover:text-[#005f92] transition-colors cursor-pointer"
              >
                <span>Buka Kasir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. CATATAN KAKI (FOOTNOTE)
         ===================================================================== */}
      <p className="text-[11px] text-slate-400 pt-1">
        Pembayaran pasien hanya mencakup transaksi Kasir berstatus lunas pada
        hari ini. Klaim dan penyelesaian penjamin tidak termasuk.
      </p>
    </div>
  );
}