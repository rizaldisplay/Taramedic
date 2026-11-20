'use client';

import React, { useMemo, useState } from 'react';
import { Clock, RefreshCw, Search, X } from 'lucide-react';

export type AgingBucketKey =
  | 'belum_jatuh_tempo'
  | '1_30_hari'
  | '31_60_hari'
  | '61_90_hari'
  | 'lebih_90_hari';

export type OpenInvoiceStatus = 'belum_dibayar' | 'dibayar_sebagian';

export interface SupplierPayableAgingItem {
  id: string;
  nomorFaktur: string;
  nomorPenerimaan?: string;
  pemasok: string;
  tanggalFakturLabel?: string;
  jatuhTempoLabel: string;
  hariTerlambat: number; // 0 = belum jatuh tempo, >0 = hari lewat jatuh tempo
  umurLabel: string;
  bucket: AgingBucketKey;
  status: OpenInvoiceStatus;
  sisaTagihan: number;
}

const BUCKET_CARDS: {
  key: AgingBucketKey;
  title: string;
}[] = [
  { key: 'belum_jatuh_tempo', title: 'Belum jatuh tempo' },
  { key: '1_30_hari', title: '1–30 hari' },
  { key: '31_60_hari', title: '31–60 hari' },
  { key: '61_90_hari', title: '61–90 hari' },
  { key: 'lebih_90_hari', title: '>90 hari' },
];

const PAYABLE_STATUS_META: Record<
  OpenInvoiceStatus,
  { label: string; pillClass: string }
> = {
  belum_dibayar: {
    label: 'Belum Dibayar',
    pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  dibayar_sebagian: {
    label: 'Dibayar Sebagian',
    pillClass: 'bg-[#edf7fc] border border-[#b8e6ef] text-[#008ba6]',
  },
};

function formatRupiah(nominal: number): string {
  return `Rp ${nominal.toLocaleString('id-ID')}`;
}

export default function UmurUtangPemasok({
  initialItems = [],
  positionDateLabel = '20 Nov 2026',
  onReload,
  onSelectInvoice,
}: {
  initialItems?: SupplierPayableAgingItem[];
  positionDateLabel?: string;
  onReload?: () => Promise<void> | void;
  onSelectInvoice?: (item: SupplierPayableAgingItem) => void;
}) {
  const [items] = useState<SupplierPayableAgingItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBucket, setSelectedBucket] = useState<AgingBucketKey | null>(
    null,
  );
  const [isReloading, setIsReloading] = useState(false);

  const bucketSummaries = useMemo(() => {
    const map: Record<
      AgingBucketKey,
      { count: number; totalAmount: number }
    > = {
      belum_jatuh_tempo: { count: 0, totalAmount: 0 },
      '1_30_hari': { count: 0, totalAmount: 0 },
      '31_60_hari': { count: 0, totalAmount: 0 },
      '61_90_hari': { count: 0, totalAmount: 0 },
      lebih_90_hari: { count: 0, totalAmount: 0 },
    };

    for (const item of items) {
      map[item.bucket].count += 1;
      map[item.bucket].totalAmount += item.sisaTagihan;
    }

    return map;
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (selectedBucket && item.bucket !== selectedBucket) {
        return false;
      }
      if (!q) return true;
      return (
        item.nomorFaktur.toLowerCase().includes(q) ||
        item.pemasok.toLowerCase().includes(q) ||
        (item.nomorPenerimaan ?? '').toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery, selectedBucket]);

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await onReload?.();
    } finally {
      setTimeout(() => setIsReloading(false), 350);
    }
  };

  const handleBucketClick = (key: AgingBucketKey) => {
    setSelectedBucket((prev) => (prev === key ? null : key));
  };

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* ===================================================================
            1. HEADER: EYEBROW, JUDUL, SUBJUDUL & TOMBOL MUAT ULANG
           =================================================================== */}
        <div className="px-6 pt-5 pb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              JEJAK OPERASIONAL &middot; SALDO KEWAJIBAN PEMASOK
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5">
              Umur utang pemasok
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Faktur disetujui dan belum lunas, dikelompokkan berdasarkan
              tanggal jatuh tempo. Tampilan ini hanya-baca.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleReload()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${
                isReloading ? 'animate-spin text-[#008ba6]' : ''
              }`}
            />
            <span>Muat Ulang</span>
          </button>
        </div>

        {/* ===================================================================
            2. BARIS PENCARIAN & COUNTER REKAM
           =================================================================== */}
        <div className="px-6 pb-3 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor faktur atau pemasok..."
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian faktur"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-xs text-slate-400 tabular-nums shrink-0">
            {filteredItems.length} rekam
          </span>
        </div>

        {/* ===================================================================
            3. CAPTION POSISI PER TANGGAL & 5 BUCKET KARTU UMUR UTANG
           =================================================================== */}
        <div className="px-6 pb-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <p>
              Posisi per{' '}
              <strong className="font-bold text-[#0f3d56]">
                {positionDateLabel}
              </strong>{' '}
              &middot; hanya faktur disetujui yang masih memiliki sisa.
            </p>

            {selectedBucket && (
              <button
                type="button"
                onClick={() => setSelectedBucket(null)}
                className="text-[11px] font-bold text-[#008ba6] hover:underline cursor-pointer"
              >
                Reset filter rentang umur
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {BUCKET_CARDS.map((card) => {
              const summary = bucketSummaries[card.key];
              const isSelected = selectedBucket === card.key;

              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => handleBucketClick(card.key)}
                  className={`text-left rounded-xl border px-4 py-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#edf7fc]/80 border-[#009bb8] ring-2 ring-[#009bb8]/15'
                      : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[11px] font-semibold text-slate-500">
                    {card.title}
                  </p>
                  <p className="text-xs font-extrabold text-[#0f3d56] mt-1 tabular-nums">
                    {summary.count} faktur
                  </p>
                  <p className="text-sm font-extrabold text-[#0f3d56] mt-1.5 tabular-nums">
                    {formatRupiah(summary.totalAmount)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            4. HEADER TABEL BERBENTUK KARTU & EMPTY STATE
           =================================================================== */}
        <div className="px-6 pb-6">
          <div className="rounded-xl border border-slate-200/90 bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead className="bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">FAKTUR</th>
                  <th className="px-5 py-3">PEMASOK</th>
                  <th className="px-5 py-3">JATUH TEMPO</th>
                  <th className="px-5 py-3">UMUR</th>
                  <th className="px-5 py-3">STATUS</th>
                  <th className="px-5 py-3">SISA</th>
                </tr>
              </thead>

              {filteredItems.length > 0 && (
                <tbody className="divide-y divide-slate-200/70 border-t border-slate-200/80 text-xs">
                  {filteredItems.map((item) => {
                    const statusMeta = PAYABLE_STATUS_META[item.status];

                    return (
                      <tr
                        key={item.id}
                        onClick={() => onSelectInvoice?.(item)}
                        className="bg-white hover:bg-slate-50/70 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-4 align-middle whitespace-nowrap">
                          <p className="font-mono font-bold text-[#0f3d56]">
                            {item.nomorFaktur}
                          </p>
                          {item.nomorPenerimaan && (
                            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                              {item.nomorPenerimaan}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                          {item.pemasok}
                        </td>

                        <td className="px-5 py-4 align-middle text-[#0f3d56] tabular-nums whitespace-nowrap">
                          {item.jatuhTempoLabel}
                        </td>

                        <td className="px-5 py-4 align-middle text-slate-600 font-medium whitespace-nowrap">
                          {item.umurLabel}
                        </td>

                        <td className="px-5 py-4 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusMeta.pillClass}`}
                          >
                            {statusMeta.label}
                          </span>
                        </td>

                        <td className="px-5 py-4 align-middle font-extrabold text-[#0f3d56] tabular-nums whitespace-nowrap">
                          {formatRupiah(item.sisaTagihan)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>

          {/* Empty State "Belum ada utang faktur terbuka" */}
          {filteredItems.length === 0 && (
            <div className="pt-12 pb-10 px-6 flex flex-col items-center justify-center text-center">
              <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-xs font-extrabold text-[#0f3d56]">
                Belum ada utang faktur terbuka
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Faktur yang disetujui dan belum lunas akan muncul di sini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}