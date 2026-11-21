'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';

export type ProcedureOrderStatus = 'baru' | 'diterima' | 'berlangsung' | 'selesai';

export interface ProcedureExecutionLog {
  id: string;
  waktuLabel: string;
  pelaksana: string;
  keterangan: string;
}

export interface ProcedureOrderItem {
  id: string;
  nomorOrder: string;
  namaPasien: string;
  noRm: string;
  noKunjungan: string;
  namaProsedur: string;
  unitAsal: string;
  dokterPeminta: string;
  instruksiKlinis: string;
  status: ProcedureOrderStatus;
  pelaksanaTerakhir?: string;
  tanggalLabel: string;
  riwayat: ProcedureExecutionLog[];
}

type ProcedureQueueTab = ProcedureOrderStatus | 'semua';

const PROCEDURE_STATUS_META: Record<
  ProcedureOrderStatus,
  { label: string; pillClass: string }
> = {
  baru: {
    label: 'Baru',
    pillClass: 'bg-sky-50 border border-sky-200/80 text-sky-700',
  },
  diterima: {
    label: 'Diterima',
    pillClass: 'bg-[#edf7fc] border border-[#b8e6ef] text-[#008ba6]',
  },
  berlangsung: {
    label: 'Berlangsung',
    pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  selesai: {
    label: 'Selesai',
    pillClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
};

const QUEUE_TABS: { key: ProcedureQueueTab; label: string }[] = [
  { key: 'baru', label: 'Baru' },
  { key: 'diterima', label: 'Diterima' },
  { key: 'berlangsung', label: 'Berlangsung' },
  { key: 'semua', label: 'Semua' },
];

export default function OrderProsedur({
  initialOrders = [],
  currentUserName = 'Ns. Rina Wijayanti, S.Kep',
  onReload,
  onStatusChange,
}: {
  initialOrders?: ProcedureOrderItem[];
  currentUserName?: string;
  onReload?: () => Promise<void> | void;
  onStatusChange?: (item: ProcedureOrderItem) => void;
}) {
  const [orders, setOrders] = useState<ProcedureOrderItem[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<ProcedureQueueTab>('baru');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReloading, setIsReloading] = useState(false);

  const tabOrders = useMemo(() => {
    if (activeTab === 'semua') return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tabOrders;
    return tabOrders.filter((o) => {
      return (
        o.namaPasien.toLowerCase().includes(q) ||
        o.noRm.toLowerCase().includes(q) ||
        o.namaProsedur.toLowerCase().includes(q) ||
        o.nomorOrder.toLowerCase().includes(q) ||
        o.unitAsal.toLowerCase().includes(q)
      );
    });
  }, [tabOrders, searchQuery]);

  const pendingActionCount = useMemo(() => {
    return orders.filter(
      (o) => o.status === 'baru' || o.status === 'diterima' || o.status === 'berlangsung',
    ).length;
  }, [orders]);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return orders.find((o) => o.id === selectedOrderId) ?? null;
  }, [orders, selectedOrderId]);

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await onReload?.();
    } finally {
      setTimeout(() => setIsReloading(false), 350);
    }
  };

  const handleTransitionStatus = (nextStatus: ProcedureOrderStatus, note: string) => {
    if (!selectedOrder) return;

    const nowLabel = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updated: ProcedureOrderItem = {
      ...selectedOrder,
      status: nextStatus,
      pelaksanaTerakhir: currentUserName,
      riwayat: [
        {
          id: `log-${Date.now()}`,
          waktuLabel: `${selectedOrder.tanggalLabel} · ${nowLabel}`,
          pelaksana: currentUserName,
          keterangan: note,
        },
        ...selectedOrder.riwayat,
      ],
    };

    setOrders((prev) =>
      prev.map((item) => (item.id === selectedOrder.id ? updated : item)),
    );
    onStatusChange?.(updated);
  };

  const selectedStatusMeta = selectedOrder
    ? PROCEDURE_STATUS_META[selectedOrder.status]
    : null;

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* =====================================================================
          1. TOP STRIP: 2 METRIK COUNTER & BANNER KONTROL KLINIS
         ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[235px_245px_1fr] gap-3.5 items-stretch">
        {/* Metrik 1: Dalam tampilan */}
        <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex items-center gap-2.5">
          <span className="text-xs font-medium text-slate-500">
            Dalam tampilan
          </span>
          <span className="text-lg font-extrabold text-[#0f3d56] tabular-nums leading-none">
            {filteredOrders.length}
          </span>
          <span className="text-xs text-slate-400">order prosedur</span>
        </div>

        {/* Metrik 2: Menunggu tindakan */}
        <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex items-center gap-2.5">
          <span className="text-xs font-medium text-slate-500">
            Menunggu tindakan
          </span>
          <span className="text-lg font-extrabold text-[#0f3d56] tabular-nums leading-none">
            {pendingActionCount}
          </span>
          <span className="text-xs text-slate-400">perlu ditindaklanjuti</span>
        </div>

        {/* Banner Kontrol Klinis */}
        <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex items-center gap-2.5 sm:col-span-2 lg:col-span-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008b74] shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#008b74]" />
            <span>Kontrol klinis</span>
          </span>
          <span className="text-xs text-slate-500">
            Validasi harus dilakukan oleh tenaga kesehatan yang berbeda dari
            pelaksana.
          </span>
        </div>
      </div>

      {/* =====================================================================
          2. SPLIT WORKSPACE: PANEL KIRI (ANTREAN KLINIS) & PANEL KANAN (DETAIL)
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[345px_1fr] gap-4 items-stretch min-h-[520px]">
        {/* KOLOM KIRI: ANTREAN KLINIS · ORDER PROSEDUR */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex flex-col overflow-hidden">
          {/* Header Panel Kiri */}
          <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-400">
                Antrean Klinis
              </p>
              <h1 className="text-base font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                Order Prosedur
              </h1>
            </div>

            <button
              type="button"
              onClick={() => void handleReload()}
              aria-label="Muat ulang order prosedur"
              className="w-8 h-8 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 active:bg-slate-100 inline-flex items-center justify-center text-slate-500 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isReloading ? 'animate-spin text-[#008ba6]' : ''
                }`}
              />
            </button>
          </div>

          {/* Pencarian Pasien */}
          <div className="px-5 pb-3">
            <label className="block text-[11px] font-bold text-[#0f3d56] mb-1.5">
              Pencarian Pasien
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Pasien, No. RM, Prosedur..."
                className="w-full pl-8 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian prosedur"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sub-Tabs Antrean (Baru, Diterima, Berlangsung, Semua) */}
          <div
            role="tablist"
            aria-label="Tab status order prosedur"
            className="px-5 border-b border-slate-200/80 flex items-center gap-5 overflow-x-auto"
          >
            {QUEUE_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative pb-2.5 pt-1 text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#0077b6] font-bold'
                      : 'text-slate-500 font-medium hover:text-[#0f3d56]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0077b6] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* List Item atau Empty State */}
          {filteredOrders.length === 0 ? (
            <div className="flex-1 px-6 py-14 flex flex-col items-center justify-center text-center">
              <div className="w-11 h-11 rounded-xl bg-[#edf7fc] border border-[#cde7f6] text-[#008ba6] flex items-center justify-center mb-3">
                <ClipboardList className="w-5 h-5" />
              </div>
              <p className="text-xs font-extrabold text-[#0f3d56]">
                Belum ada order pada antrean ini
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[230px] leading-relaxed">
                Order baru dari kunjungan rawat jalan akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                const statusMeta = PROCEDURE_STATUS_META[order.status];

                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`w-full text-left px-5 py-3.5 transition-colors cursor-pointer block ${
                      isSelected
                        ? 'bg-[#edf7fc]/85 border-l-2 border-l-[#0077b6]'
                        : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-extrabold text-[#0f3d56]">
                          {order.namaPasien}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {order.noRm} &middot; {order.nomorOrder}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${statusMeta.pillClass}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#0077b6] mt-2">
                      {order.namaProsedur}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {order.unitAsal} &middot; {order.tanggalLabel}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* KOLOM KANAN: DETAIL ORDER / PILIH ORDER UNTUK DITINJAU */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.02)] flex flex-col overflow-hidden">
          {selectedOrder && selectedStatusMeta ? (
            <div className="p-6 space-y-5 text-xs flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      RINCIAN ORDER PROSEDUR KLINIS
                    </p>
                    <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                      <h2 className="text-base font-extrabold text-[#0f3d56]">
                        {selectedOrder.namaProsedur}
                      </h2>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${selectedStatusMeta.pillClass}`}
                      >
                        {selectedStatusMeta.label}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1">
                      Pasien:{' '}
                      <strong className="text-[#0f3d56]">
                        {selectedOrder.namaPasien}
                      </strong>{' '}
                      &middot; No. RM{' '}
                      <span className="font-mono">{selectedOrder.noRm}</span>{' '}
                      &middot; Order{' '}
                      <span className="font-mono">
                        {selectedOrder.nomorOrder}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOrderId(null)}
                    aria-label="Tutup rincian order prosedur"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                  <div>
                    <p className="text-[11px] text-slate-400">Unit Asal</p>
                    <p className="font-bold text-[#0f3d56] mt-0.5">
                      {selectedOrder.unitAsal}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Dokter Peminta</p>
                    <p className="font-bold text-[#0f3d56] mt-0.5">
                      {selectedOrder.dokterPeminta}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">No. Kunjungan</p>
                    <p className="font-mono font-bold text-[#0f3d56] mt-0.5">
                      {selectedOrder.noKunjungan}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#b8e6ef] bg-[#edf7fc]/65 p-4">
                  <p className="text-[11px] font-extrabold text-[#0f3d56] mb-1">
                    Instruksi Klinis &amp; Pelaksanaan
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedOrder.instruksiKlinis}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-extrabold text-[#0f3d56]">
                    Riwayat Pelaksanaan &amp; Validasi
                  </p>
                  {selectedOrder.riwayat.length === 0 ? (
                    <p className="text-[11px] text-slate-400">
                      Belum ada catatan pelaksanaan untuk order ini.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-white px-4">
                      {selectedOrder.riwayat.map((log) => (
                        <div
                          key={log.id}
                          className="py-2.5 flex flex-wrap items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-semibold text-[#0f3d56]">
                              {log.keterangan}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Oleh: {log.pelaksana}
                            </p>
                          </div>
                          <span className="text-[11px] text-slate-400 tabular-nums">
                            {log.waktuLabel}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
                {selectedOrder.status === 'baru' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTransitionStatus(
                        'diterima',
                        'Order prosedur diterima oleh perawat/tenaga pelaksana.',
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>Terima Order</span>
                  </button>
                )}

                {selectedOrder.status === 'diterima' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTransitionStatus(
                        'berlangsung',
                        'Pelaksanaan prosedur klinis dimulai.',
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Mulai Prosedur</span>
                  </button>
                )}

                {selectedOrder.status === 'berlangsung' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTransitionStatus(
                        'selesai',
                        'Pelaksanaan prosedur selesai dan divalidasi.',
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Selesaikan &amp; Validasi</span>
                  </button>
                )}

                {selectedOrder.status === 'selesai' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Prosedur telah selesai &amp; tercatat</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 px-6 py-16 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#edf7fc] border border-[#cde7f6] text-[#0077b6] flex items-center justify-center mb-3">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-extrabold text-[#0f3d56]">
                Pilih order untuk ditinjau
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Instruksi dan riwayat pelaksanaan akan tampil di sini.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}