'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Box,
  Boxes,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Landmark,
  Package,
  Stethoscope,
  Wrench,
} from 'lucide-react';

export type InventoryTabKey =
  | 'dasbor'
  | 'obat'
  | 'alkes_bmhp'
  | 'alat_reusable'
  | 'saldo_batch'
  | 'transaksi_stok'
  | 'persetujuan_opname'
  | 'gudang';

export interface InventorySummaryMetrics {
  totalProduk: number;
  produkTersedia: number;
  nilaiStok: number;
  stokMenipis: number;
}

export interface LowStockProductItem {
  id: string;
  kodeProduk: string;
  namaProduk: string;
  gudang: string;
  saldoSaatIni: number;
  batasReorder: number;
  satuan: string;
}

export interface StockActivityItem {
  id: string;
  kodeProduk: string;
  namaProduk: string;
  gudang: string;
  waktu: string;
  tipe: 'masuk' | 'keluar';
  jumlahPerubahan: number;
  saldoAkhir: number;
}

const DEFAULT_METRICS: InventorySummaryMetrics = {
  totalProduk: 3,
  produkTersedia: 2,
  nilaiStok: 31950000,
  stokMenipis: 1,
};

const DEFAULT_LOW_STOCK_ITEMS: LowStockProductItem[] = [
  {
    id: 'low-1',
    kodeProduk: 'OBT-0024',
    namaProduk: 'Paracetamol 500 mg Tablet',
    gudang: 'Depo Farmasi',
    saldoSaatIni: 4,
    batasReorder: 10,
    satuan: 'Box',
  },
];

const DEFAULT_RECENT_ACTIVITIES: StockActivityItem[] = [
  {
    id: 'act-1',
    kodeProduk: 'MED-72',
    namaProduk: 'Ambroxol 30 mg Tablet',
    gudang: 'Depo Farmasi',
    waktu: '29 Okt 19:38 WIB',
    tipe: 'masuk',
    jumlahPerubahan: 60,
    saldoAkhir: 60,
  },
  {
    id: 'act-2',
    kodeProduk: 'OBT-0010',
    namaProduk: 'Amlodipine 5 mg Tablet',
    gudang: 'Depo Farmasi',
    waktu: '29 Okt 19:29 WIB',
    tipe: 'masuk',
    jumlahPerubahan: 60,
    saldoAkhir: 60,
  },
  {
    id: 'act-3',
    kodeProduk: 'OBT-0010',
    namaProduk: 'Amlodipine 5 mg Tablet',
    gudang: 'Depo Farmasi',
    waktu: '11 Okt 20:02 WIB',
    tipe: 'keluar',
    jumlahPerubahan: -15,
    saldoAkhir: 5,
  },
  {
    id: 'act-4',
    kodeProduk: 'MED-72',
    namaProduk: 'Ambroxol 30 mg Tablet',
    gudang: 'Depo Farmasi',
    waktu: '11 Okt 20:02 WIB',
    tipe: 'keluar',
    jumlahPerubahan: -10,
    saldoAkhir: 0,
  },
  {
    id: 'act-5',
    kodeProduk: 'OBT-0010',
    namaProduk: 'Amlodipine 5 mg Tablet',
    gudang: 'Depo Farmasi',
    waktu: '11 Okt 01:29 WIB',
    tipe: 'masuk',
    jumlahPerubahan: 20,
    saldoAkhir: 20,
  },
];

const TAB_LABELS: Record<InventoryTabKey, string> = {
  dasbor: 'Dasbor',
  obat: 'Obat',
  alkes_bmhp: 'Alkes & BMHP',
  alat_reusable: 'Alat reusable',
  saldo_batch: 'Saldo & batch',
  transaksi_stok: 'Transaksi Stok',
  persetujuan_opname: 'Persetujuan Opname',
  gudang: 'Gudang',
};

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default function DasborInventaris({
  metrics = DEFAULT_METRICS,
  lowStockItems = DEFAULT_LOW_STOCK_ITEMS,
  recentActivities = DEFAULT_RECENT_ACTIVITIES,
  onTabChange,
  onViewAllActivities,
  onSelectActivity,
}: {
  metrics?: InventorySummaryMetrics;
  lowStockItems?: LowStockProductItem[];
  recentActivities?: StockActivityItem[];
  onTabChange?: (tab: InventoryTabKey) => void;
  onViewAllActivities?: () => void;
  onSelectActivity?: (activity: StockActivityItem) => void;
}) {
  const [activeTab, setActiveTab] = useState<InventoryTabKey>('dasbor');
  const [showLowStockDetail, setShowLowStockDetail] = useState(false);

  const handleSelectTab = (tab: InventoryTabKey) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const TOP_TABS: {
    key: InventoryTabKey;
    label: string;
    Icon: React.ElementType;
  }[] = [
    { key: 'dasbor', label: 'Dasbor', Icon: Boxes },
    { key: 'obat', label: 'Obat', Icon: Stethoscope },
    { key: 'alkes_bmhp', label: 'Alkes & BMHP', Icon: ClipboardList },
    { key: 'alat_reusable', label: 'Alat reusable', Icon: Wrench },
    { key: 'saldo_batch', label: 'Saldo & batch', Icon: Boxes },
    { key: 'transaksi_stok', label: 'Transaksi Stok', Icon: ArrowLeftRight },
    {
      key: 'persetujuan_opname',
      label: 'Persetujuan Opname',
      Icon: ClipboardCheck,
    },
    { key: 'gudang', label: 'Gudang', Icon: Landmark },
  ];

  const kpiCards = useMemo(
    () => [
      {
        key: 'total_produk',
        title: 'Total produk',
        value: metrics.totalProduk.toLocaleString('id-ID'),
        subtitle: 'item stok aktif',
        Icon: Box,
        onClick: undefined,
      },
      {
        key: 'produk_tersedia',
        title: 'Produk tersedia',
        value: metrics.produkTersedia.toLocaleString('id-ID'),
        subtitle: 'item dengan saldo > 0',
        Icon: Boxes,
        onClick: undefined,
      },
      {
        key: 'nilai_stok',
        title: 'Nilai stok',
        value: formatRupiah(metrics.nilaiStok),
        subtitle: 'estimasi · saldo × biaya unit',
        Icon: Landmark,
        onClick: undefined,
      },
      {
        key: 'stok_menipis',
        title: 'Stok menipis',
        value: metrics.stokMenipis.toLocaleString('id-ID'),
        subtitle: 'item di bawah reorder',
        Icon: AlertTriangle,
        onClick:
          metrics.stokMenipis > 0
            ? () => setShowLowStockDetail((prev) => !prev)
            : undefined,
      },
    ],
    [metrics],
  );

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-3.5">
      {/* 1. BARIS TAB NAVIGASI INVENTARIS */}
      {/* <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-4 sm:px-5">
        <div
          role="tablist"
          aria-label="Navigasi Modul Inventaris & Farmasi"
          className="flex items-center gap-5 sm:gap-6 overflow-x-auto"
        >
          {TOP_TABS.map(({ key, label, Icon }) => {
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
      </div> */}

      {/* 2. KONTEN UTAMA DASBOR INVENTARIS */}
      {activeTab === 'dasbor' ? (
        <div className="space-y-3.5">
          {/* Grid 4 Kartu KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {kpiCards.map(({ key, title, value, subtitle, Icon, onClick }) => (
              <div
                key={key}
                onClick={onClick}
                className={`bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 flex items-start justify-between gap-3 transition-colors ${
                  onClick ? 'hover:border-cyan-200 cursor-pointer' : ''
                }`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500">
                    {title}
                  </p>
                  <p className="text-2xl font-extrabold text-[#0f3d56] mt-2.5 tracking-tight tabular-nums truncate">
                    {value}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
                </div>

                <div className="w-9 h-9 rounded-lg bg-[#f0f9fb] border border-cyan-100/80 text-[#008ba6] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 stroke-[1.9]" />
                </div>
              </div>
            ))}
          </div>

          {/* Banner Peringatan Stok Menipis */}
          {metrics.stokMenipis > 0 && (
            <div className="rounded-xl border border-amber-300/80 bg-amber-50/75 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowLowStockDetail((prev) => !prev)}
                className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs sm:text-[13px] font-bold text-amber-950">
                    {metrics.stokMenipis} produk stok menipis
                  </span>
                </div>

                {lowStockItems.length > 0 && (
                  <span className="text-[11px] font-semibold text-amber-800 hover:underline">
                    {showLowStockDetail ? 'Sembunyikan' : 'Lihat detail'}
                  </span>
                )}
              </button>

              {showLowStockDetail && lowStockItems.length > 0 && (
                <div className="px-4 pb-3 pt-1 border-t border-amber-200/70 divide-y divide-amber-200/50 text-xs">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-2 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-[#0f3d56]">
                          {item.namaProduk}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-2">
                          {item.kodeProduk} · {item.gudang}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-800 tabular-nums">
                        Sisa {item.saldoSaatIni} {item.satuan} (Min. reorder{' '}
                        {item.batasReorder})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Kartu Aktivitas Terbaru */}
          <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                Aktivitas Terbaru
              </h2>

              <button
                type="button"
                onClick={() => {
                  if (onViewAllActivities) {
                    onViewAllActivities();
                  } else {
                    handleSelectTab('transaksi_stok');
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                <span>Lihat semua</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {recentActivities.length === 0 ? (
              <div className="py-12 px-5 text-center text-xs text-slate-400">
                Belum ada aktivitas pergerakan stok terbaru.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentActivities.map((act) => {
                  const isIncoming = act.tipe === 'masuk';
                  const formattedDelta =
                    act.jumlahPerubahan > 0
                      ? `+${act.jumlahPerubahan}`
                      : String(act.jumlahPerubahan);

                  return (
                    <li
                      key={act.id}
                      onClick={() => onSelectActivity?.(act)}
                      className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                        onSelectActivity
                          ? 'hover:bg-slate-50/90 cursor-pointer'
                          : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                            isIncoming
                              ? 'bg-emerald-50/90 border-emerald-200/70 text-emerald-700'
                              : 'bg-rose-50/90 border-rose-200/70 text-rose-700'
                          }`}
                        >
                          {isIncoming ? (
                            <ArrowDownToLine className="w-4 h-4 stroke-[2]" />
                          ) : (
                            <ArrowUpFromLine className="w-4 h-4 stroke-[2]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs sm:text-[13px] font-bold text-[#0f3d56] truncate">
                            {act.namaProduk}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {act.kodeProduk} · {act.gudang} · {act.waktu}
                          </p>
                        </div>
                      </div>

                      <div className="text-right tabular-nums shrink-0">
                        <p
                          className={`text-xs sm:text-[13px] font-extrabold ${
                            isIncoming ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {formattedDelta}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          saldo {act.saldoAkhir}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      ) : (
        /* Placeholder saat tab inventaris lainnya diklik */
        <section className="bg-white rounded-xl border border-slate-200/90 p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mx-auto mb-3">
            <Package className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#0f3d56]">
            Modul {TAB_LABELS[activeTab]}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hubungkan ke tampilan sub-modul{' '}
            <code className="text-[#008ba6]">{activeTab}</code> melalui prop{' '}
            <code className="text-[#008ba6]">onTabChange</code>.
          </p>
        </section>
      )}
    </div>
  );
}