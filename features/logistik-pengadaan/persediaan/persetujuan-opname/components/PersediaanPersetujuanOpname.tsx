'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeftRight,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Eye,
  FileText,
  History,
  Landmark,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';

export type InventoryMainTabKey =
  | 'dasbor'
  | 'obat'
  | 'alkes_bmhp'
  | 'alat_reusable'
  | 'saldo_batch'
  | 'transaksi_stok'
  | 'persetujuan_opname'
  | 'gudang';

export type OpnameQueueSubTabKey =
  | 'dokumen'
  | 'persetujuan_opname'
  | 'mutasi';

export interface OpnameCountLine {
  id: string;
  kodeItem: string;
  namaItem: string;
  batch: string;
  stokSistem: number;
  stokFisik: number;
  satuan: string;
}

export interface PendingOpnameSubmission {
  id: string;
  nomorDokumen: string;
  referensiKode: string;
  area: 'Obat' | 'Alkes & BMHP';
  gudang: string;
  dibuatOlehId: string;
  dibuatOlehNama: string;
  waktuPengajuan: string;
  catatan?: string;
  items: OpnameCountLine[];
}

const MAIN_TAB_LABELS: Record<InventoryMainTabKey, string> = {
  dasbor: 'Dasbor',
  obat: 'Obat',
  alkes_bmhp: 'Alkes & BMHP',
  alat_reusable: 'Alat reusable',
  saldo_batch: 'Saldo & batch',
  transaksi_stok: 'Transaksi Stok',
  persetujuan_opname: 'Persetujuan Opname',
  gudang: 'Gudang',
};

const SUB_TAB_LABELS: Record<OpnameQueueSubTabKey, string> = {
  dokumen: 'Dokumen',
  persetujuan_opname: 'Persetujuan Opname',
  mutasi: 'Mutasi',
};

export default function PersetujuanOpname({
  initialQueue = [],
  currentUserId = 'user-approver-01',
  onMainTabChange,
  onSubTabChange,
  onRefreshQueue,
  onApproveOpname,
  onRejectOpname,
}: {
  initialQueue?: PendingOpnameSubmission[];
  currentUserId?: string;
  onMainTabChange?: (tab: InventoryMainTabKey) => void;
  onSubTabChange?: (subTab: OpnameQueueSubTabKey) => void;
  onRefreshQueue?: () => Promise<void> | void;
  onApproveOpname?: (opname: PendingOpnameSubmission) => void;
  onRejectOpname?: (opname: PendingOpnameSubmission, alasan: string) => void;
}) {
  const [activeMainTab, setActiveMainTab] =
    useState<InventoryMainTabKey>('persetujuan_opname');
  const [activeSubTab, setActiveSubTab] =
    useState<OpnameQueueSubTabKey>('persetujuan_opname');

  const [queue, setQueue] = useState<PendingOpnameSubmission[]>(initialQueue);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal Tinjau Rincian Opname
  const [inspectingOpname, setInspectingOpname] =
    useState<PendingOpnameSubmission | null>(null);

  // Modal Tolak Opname
  const [rejectingOpname, setRejectingOpname] =
    useState<PendingOpnameSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingCount = useMemo(() => queue.length, [queue]);

  const handleSelectMainTab = (tab: InventoryMainTabKey) => {
    setActiveMainTab(tab);
    onMainTabChange?.(tab);
  };

  const handleSelectSubTab = (subTab: OpnameQueueSubTabKey) => {
    setActiveSubTab(subTab);
    onSubTabChange?.(subTab);
  };

  const handleRefreshClick = async () => {
    try {
      setIsRefreshing(true);
      await onRefreshQueue?.();
    } finally {
      setTimeout(() => setIsRefreshing(false), 350);
    }
  };

  const handleApproveSubmission = (opname: PendingOpnameSubmission) => {
    if (opname.dibuatOlehId === currentUserId) return;

    setQueue((prev) => prev.filter((item) => item.id !== opname.id));
    if (inspectingOpname?.id === opname.id) {
      setInspectingOpname(null);
    }
    onApproveOpname?.(opname);
  };

  const handleConfirmRejectSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingOpname || !rejectReason.trim()) return;

    setQueue((prev) => prev.filter((item) => item.id !== rejectingOpname.id));
    if (inspectingOpname?.id === rejectingOpname.id) {
      setInspectingOpname(null);
    }
    onRejectOpname?.(rejectingOpname, rejectReason.trim());
    setRejectingOpname(null);
    setRejectReason('');
  };

  const MAIN_TABS: {
    key: InventoryMainTabKey;
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

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-3.5">
      {/* 1. BARIS TAB NAVIGASI UTAMA MODUL INVENTARIS */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-4 sm:px-5">
        <div
          role="tablist"
          aria-label="Navigasi Modul Inventaris"
          className="flex items-center gap-5 sm:gap-6 overflow-x-auto"
        >
          {MAIN_TABS.map(({ key, label, Icon }) => {
            const isActive = activeMainTab === key;

            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectMainTab(key)}
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

      {/* 2. KONTEN UTAMA PERSETUJUAN OPNAME */}
      {activeMainTab === 'persetujuan_opname' ? (
        <div className="space-y-3.5">
          {/* Sub-Tab Navigasi: Dokumen | Persetujuan Opname | Mutasi */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-4 sm:px-5">
            <div
              role="tablist"
              aria-label="Sub-navigasi Persetujuan Opname"
              className="flex items-center gap-6 overflow-x-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeSubTab === 'dokumen'}
                onClick={() => handleSelectSubTab('dokumen')}
                className={`relative py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                  activeSubTab === 'dokumen'
                    ? 'text-[#008ba6] font-bold'
                    : 'text-slate-500 font-semibold hover:text-slate-700'
                }`}
              >
                <FileText
                  className={`w-4 h-4 ${
                    activeSubTab === 'dokumen'
                      ? 'text-[#008ba6]'
                      : 'text-slate-400'
                  }`}
                />
                <span>Dokumen</span>
                {activeSubTab === 'dokumen' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeSubTab === 'persetujuan_opname'}
                onClick={() => handleSelectSubTab('persetujuan_opname')}
                className={`relative py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                  activeSubTab === 'persetujuan_opname'
                    ? 'text-[#008ba6] font-bold'
                    : 'text-slate-500 font-semibold hover:text-slate-700'
                }`}
              >
                <ClipboardCheck
                  className={`w-4 h-4 ${
                    activeSubTab === 'persetujuan_opname'
                      ? 'text-[#008ba6]'
                      : 'text-slate-400'
                  }`}
                />
                <span>Persetujuan Opname</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 text-[11px] font-bold">
                  {pendingCount}
                </span>
                {activeSubTab === 'persetujuan_opname' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeSubTab === 'mutasi'}
                onClick={() => handleSelectSubTab('mutasi')}
                className={`relative py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                  activeSubTab === 'mutasi'
                    ? 'text-[#008ba6] font-bold'
                    : 'text-slate-500 font-semibold hover:text-slate-700'
                }`}
              >
                <History
                  className={`w-4 h-4 ${
                    activeSubTab === 'mutasi'
                      ? 'text-[#008ba6]'
                      : 'text-slate-400'
                  }`}
                />
                <span>Mutasi</span>
                {activeSubTab === 'mutasi' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
                )}
              </button>
            </div>
          </div>

          {activeSubTab === 'persetujuan_opname' ? (
            <>
              {/* Keterangan Kebijakan Pemisahan Kewenangan */}
              <p className="text-xs text-slate-500 px-0.5">
                Antrean ini hanya menampilkan stok opname yang menunggu
                keputusan. Pembuat opname tidak dapat menyetujui pengajuannya
                sendiri.
              </p>

              {/* Kartu Antrean Persetujuan Opname */}
              <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
                <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                  <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                    Antrean Persetujuan Opname
                  </h1>

                  <button
                    type="button"
                    onClick={() => void handleRefreshClick()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-[#008ba6] transition-colors cursor-pointer"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        isRefreshing ? 'animate-spin' : ''
                      }`}
                    />
                    <span>Perbarui antrean</span>
                  </button>
                </div>

                {queue.length === 0 ? (
                  /* Empty State Sesuai Gambar */
                  <div className="border-t border-slate-200/80 min-h-[340px] flex flex-col items-center justify-center text-center px-6 py-16">
                    <div className="w-12 h-12 rounded-full bg-emerald-50/90 border border-emerald-100 text-emerald-700 flex items-center justify-center mb-3.5">
                      <ClipboardCheck className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    <h2 className="text-sm sm:text-[15px] font-bold text-[#0f3d56]">
                      Tidak Ada Opname Menunggu
                    </h2>

                    <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                      Opname yang diajukan akan muncul di antrean ini.
                    </p>
                  </div>
                ) : (
                  /* Tabel Antrean Opname Menunggu Keputusan */
                  <div className="overflow-x-auto border-t border-slate-200/80">
                    <table className="w-full text-left border-collapse min-w-[920px]">
                      <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-5 py-3.5">DOKUMEN OPNAME</th>
                          <th className="px-4 py-3.5">AREA &amp; GUDANG</th>
                          <th className="px-4 py-3.5">PENGAJU</th>
                          <th className="px-4 py-3.5">RINGKASAN ITEM</th>
                          <th className="px-5 py-3.5 text-right">KEPUTUSAN</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200/70 text-xs">
                        {queue.map((item) => {
                          const isSelfSubmitted =
                            item.dibuatOlehId === currentUserId;
                          const totalDiscrepancy = item.items.reduce(
                            (acc, line) =>
                              acc + (line.stokFisik - line.stokSistem),
                            0,
                          );

                          return (
                            <tr
                              key={item.id}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              {/* DOKUMEN OPNAME */}
                              <td className="px-5 py-4 align-middle whitespace-nowrap">
                                <p className="font-bold text-[#0f3d56]">
                                  {item.nomorDokumen}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                  {item.referensiKode} · {item.waktuPengajuan}
                                </p>
                              </td>

                              {/* AREA & GUDANG */}
                              <td className="px-4 py-4 align-middle whitespace-nowrap">
                                <p className="font-semibold text-slate-700">
                                  {item.gudang}
                                </p>
                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200/80 text-[10px] font-semibold text-purple-700">
                                  {item.area}
                                </span>
                              </td>

                              {/* PENGAJU */}
                              <td className="px-4 py-4 align-middle whitespace-nowrap">
                                <p className="font-semibold text-slate-700">
                                  {item.dibuatOlehNama}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  {item.dibuatOlehId}
                                </p>
                              </td>

                              {/* RINGKASAN ITEM */}
                              <td className="px-4 py-4 align-middle whitespace-nowrap">
                                <p className="font-bold text-[#0f3d56] tabular-nums">
                                  {item.items.length} item dihitung
                                </p>
                                <p
                                  className={`text-[11px] font-semibold mt-0.5 tabular-nums ${
                                    totalDiscrepancy === 0
                                      ? 'text-slate-400'
                                      : totalDiscrepancy > 0
                                        ? 'text-emerald-700'
                                        : 'text-rose-700'
                                  }`}
                                >
                                  Selisih bersih:{' '}
                                  {totalDiscrepancy > 0
                                    ? `+${totalDiscrepancy}`
                                    : totalDiscrepancy}
                                </p>
                              </td>

                              {/* KEPUTUSAN */}
                              <td className="px-5 py-4 align-middle text-right whitespace-nowrap">
                                <div className="inline-flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setInspectingOpname(item)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Tinjau</span>
                                  </button>

                                  {isSelfSubmitted ? (
                                    <span
                                      title="Pembuat opname tidak dapat menyetujui pengajuannya sendiri"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-800"
                                    >
                                      <ShieldAlert className="w-3.5 h-3.5" />
                                      <span>Pengaju sendiri</span>
                                    </span>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setRejectingOpname(item);
                                          setRejectReason('');
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100/80 text-xs font-semibold text-rose-700 transition-colors cursor-pointer"
                                      >
                                        <XCircle className="w-3.5 h-3.5" />
                                        <span>Tolak</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleApproveSubmission(item)
                                        }
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Setujui</span>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          ) : (
            /* Placeholder saat sub-tab Dokumen atau Mutasi diklik */
            <section className="bg-white rounded-xl border border-slate-200/90 p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mx-auto mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#0f3d56]">
                {SUB_TAB_LABELS[activeSubTab]} Stok
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Hubungkan ke sub-tampilan{' '}
                <code className="text-[#008ba6]">{activeSubTab}</code> melalui
                prop <code className="text-[#008ba6]">onSubTabChange</code>.
              </p>
            </section>
          )}
        </div>
      ) : (
        /* Placeholder Tab Utama Inventaris Lainnya */
        <section className="bg-white rounded-xl border border-slate-200/90 p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mx-auto mb-3">
            <Boxes className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#0f3d56]">
            Modul {MAIN_TAB_LABELS[activeMainTab]}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hubungkan ke tampilan modul{' '}
            <code className="text-[#008ba6]">{activeMainTab}</code> melalui prop{' '}
            <code className="text-[#008ba6]">onMainTabChange</code>.
          </p>
        </section>
      )}

      {/* 3. MODAL TINJAU RINCIAN STOK OPNAME */}
      {inspectingOpname && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {inspectingOpname.area} · {inspectingOpname.gudang}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  {inspectingOpname.nomorDokumen}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingOpname(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-1">
                <p className="text-slate-600">
                  Diajukan oleh{' '}
                  <strong className="text-[#0f3d56]">
                    {inspectingOpname.dibuatOlehNama}
                  </strong>{' '}
                  pada {inspectingOpname.waktuPengajuan}
                </p>
                {inspectingOpname.catatan && (
                  <p className="text-slate-500">
                    Catatan: {inspectingOpname.catatan}
                  </p>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-3.5 py-2.5">ITEM &amp; BATCH</th>
                      <th className="px-3 py-2.5 text-right">SISTEM</th>
                      <th className="px-3 py-2.5 text-right">FISIK</th>
                      <th className="px-3.5 py-2.5 text-right">SELISIH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inspectingOpname.items.map((line) => {
                      const diff = line.stokFisik - line.stokSistem;
                      return (
                        <tr key={line.id}>
                          <td className="px-3.5 py-2.5">
                            <p className="font-bold text-[#0f3d56]">
                              {line.namaItem}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {line.kodeItem} · Batch {line.batch}
                            </p>
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                            {line.stokSistem} {line.satuan}
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums font-bold text-[#0f3d56]">
                            {line.stokFisik} {line.satuan}
                          </td>
                          <td
                            className={`px-3.5 py-2.5 text-right tabular-nums font-extrabold ${
                              diff === 0
                                ? 'text-slate-400'
                                : diff > 0
                                  ? 'text-emerald-700'
                                  : 'text-rose-700'
                            }`}
                          >
                            {diff > 0 ? `+${diff}` : diff}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingOpname(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Tutup
                </button>

                {inspectingOpname.dibuatOlehId !== currentUserId && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectingOpname(inspectingOpname);
                        setRejectReason('');
                      }}
                      className="px-3.5 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 font-semibold text-rose-700 cursor-pointer"
                    >
                      Tolak Opname
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveSubmission(inspectingOpname)}
                      className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                    >
                      Setujui &amp; Posting
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL TOLAK PENGAJUAN OPNAME */}
      {rejectingOpname && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-5">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-3">
                <AlertCircle className="w-5 h-5" />
              </div>

              <h3 className="text-base font-extrabold text-[#0f3d56]">
                Tolak Pengajuan Opname?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Dokumen{' '}
                <strong className="text-slate-700">
                  {rejectingOpname.nomorDokumen}
                </strong>{' '}
                tidak akan membentuk mutasi penyesuaian stok.
              </p>

              <form
                onSubmit={handleConfirmRejectSubmission}
                className="mt-3.5 space-y-3.5 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alasan Penolakan (Wajib)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Contoh: Mohon hitung ulang fisik batch 4567 di rak lemari pendingin..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectingOpname(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
                  >
                    Konfirmasi Tolak
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}