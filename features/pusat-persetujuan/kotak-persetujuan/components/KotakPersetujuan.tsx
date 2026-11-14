'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  HelpCircle,
  History,
  Inbox,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  X,
  XCircle,
} from 'lucide-react';

export type ApprovalTabKey = 'kotak_masuk' | 'pengajuan_saya' | 'riwayat';
export type ApprovalDecisionStatus =
  | 'menunggu'
  | 'disetujui'
  | 'ditolak'
  | 'revisi';

export interface ApprovalChainStep {
  id: string;
  peran: string;
  namaApprover: string;
  status: 'selesai' | 'aktif' | 'menunggu' | 'ditolak';
  waktu?: string;
  catatan?: string;
}

export interface ApprovalDocumentItem {
  id: string;
  nomorDokumen: string;
  judulDokumen: string;
  modulSumber: string;
  pengaju: string;
  unitPengaju: string;
  tanggalPengajuan: string;
  ringkasan: string;
  status: ApprovalDecisionStatus;
  isSelfSubmission?: boolean;
  rantaiPersetujuan: ApprovalChainStep[];
}

const DEFAULT_HISTORY_ITEMS: ApprovalDocumentItem[] = [
  {
    id: 'doc-hist-1',
    nomorDokumen: 'SOP-KLN-2026-014',
    judulDokumen: 'Pembaruan Alur Triase & Pendaftaran Rawat Jalan',
    modulSumber: 'Manajemen SOP & Mutu',
    pengaju: 'Ns. Ratna Sari, S.Kep',
    unitPengaju: 'Poli Umum & Triase',
    tanggalPengajuan: '12 Nov 2026 · 14:20 WIB',
    ringkasan:
      'Penyesuaian standar waktu tanggap pengkajian awal perawat sebelum serah terima ke dokter poli.',
    status: 'disetujui',
    rantaiPersetujuan: [
      {
        id: 'step-1',
        peran: 'Koordinator Keperawatan',
        namaApprover: 'Ns. Budi Santoso, S.Kep',
        status: 'selesai',
        waktu: '12 Nov 2026 · 15:05 WIB',
        catatan: 'Sesuai standar akreditasi klinik.',
      },
      {
        id: 'step-2',
        peran: 'Penanggung Jawab Klinik',
        namaApprover: 'dr. Altharrazka Kenigara Rizfan',
        status: 'selesai',
        waktu: '12 Nov 2026 · 16:10 WIB',
        catatan: 'Disetujui untuk diberlakukan.',
      },
    ],
  },
];

const DECISION_BADGE_META: Record<
  ApprovalDecisionStatus,
  { label: string; className: string }
> = {
  menunggu: {
    label: 'Menunggu Tinjauan',
    className: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  disetujui: {
    label: 'Disetujui',
    className: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  ditolak: {
    label: 'Ditolak',
    className: 'bg-rose-50 border border-rose-200/80 text-rose-700',
  },
  revisi: {
    label: 'Perlu Revisi',
    className: 'bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6]',
  },
};

export default function PusatPersetujuanDokumen({
  initialInbox = [],
  initialMySubmissions = [],
  initialHistory = DEFAULT_HISTORY_ITEMS,
  onReload,
  onApproveDocument,
  onRejectDocument,
  onOpenSourceModule,
}: {
  initialInbox?: ApprovalDocumentItem[];
  initialMySubmissions?: ApprovalDocumentItem[];
  initialHistory?: ApprovalDocumentItem[];
  onReload?: () => Promise<void> | void;
  onApproveDocument?: (doc: ApprovalDocumentItem, note: string) => void;
  onRejectDocument?: (doc: ApprovalDocumentItem, note: string) => void;
  onOpenSourceModule?: (doc: ApprovalDocumentItem) => void;
}) {
  const [activeTab, setActiveTab] = useState<ApprovalTabKey>('kotak_masuk');
  const [inboxItems, setInboxItems] =
    useState<ApprovalDocumentItem[]>(initialInbox);
  const [mySubmissions] =
    useState<ApprovalDocumentItem[]>(initialMySubmissions);
  const [historyItems, setHistoryItems] =
    useState<ApprovalDocumentItem[]>(initialHistory);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [decisionNote, setDecisionNote] = useState('');
  const [isReloading, setIsReloading] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Pintasan keyboard "/" untuk fokus ke kolom pencarian
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Daftar dokumen berdasarkan tab aktif
  const currentTabList = useMemo(() => {
    if (activeTab === 'pengajuan_saya') return mySubmissions;
    if (activeTab === 'riwayat') return historyItems;
    return inboxItems;
  }, [activeTab, inboxItems, mySubmissions, historyItems]);

  // Filter berdasarkan kata kunci pencarian
  const filteredDocuments = useMemo(() => {
    if (searchQuery.trim() === '') return currentTabList;

    const q = searchQuery.toLowerCase();
    return currentTabList.filter(
      (doc) =>
        doc.judulDokumen.toLowerCase().includes(q) ||
        doc.nomorDokumen.toLowerCase().includes(q) ||
        doc.pengaju.toLowerCase().includes(q) ||
        doc.modulSumber.toLowerCase().includes(q),
    );
  }, [currentTabList, searchQuery]);

  // Dokumen yang sedang dipilih untuk ditinjau di panel kanan
  const selectedDocument = useMemo(() => {
    if (!selectedDocId) return null;
    return (
      [...inboxItems, ...mySubmissions, ...historyItems].find(
        (d) => d.id === selectedDocId,
      ) ?? null
    );
  }, [selectedDocId, inboxItems, mySubmissions, historyItems]);

  const handleTabChange = (tab: ApprovalTabKey) => {
    setActiveTab(tab);
    setSelectedDocId(null);
    setDecisionNote('');
  };

  const handleReloadClick = async () => {
    try {
      setIsReloading(true);
      await onReload?.();
    } finally {
      setTimeout(() => setIsReloading(false), 350);
    }
  };

  const handleDecision = (decision: 'disetujui' | 'ditolak') => {
    if (!selectedDocument || selectedDocument.isSelfSubmission) return;

    const updatedDoc: ApprovalDocumentItem = {
      ...selectedDocument,
      status: decision,
    };

    setInboxItems((prev) => prev.filter((d) => d.id !== selectedDocument.id));
    setHistoryItems((prev) => [updatedDoc, ...prev]);

    if (decision === 'disetujui') {
      onApproveDocument?.(updatedDoc, decisionNote);
    } else {
      onRejectDocument?.(updatedDoc, decisionNote);
    }

    setDecisionNote('');
    setSelectedDocId(updatedDoc.id);
  };

  const TOP_TABS: {
    key: ApprovalTabKey;
    label: string;
    count: number;
    Icon: React.ElementType;
  }[] = [
    {
      key: 'kotak_masuk',
      label: 'Kotak masuk',
      count: inboxItems.length,
      Icon: Inbox,
    },
    {
      key: 'pengajuan_saya',
      label: 'Pengajuan saya',
      count: mySubmissions.length,
      Icon: FileCheck2,
    },
    {
      key: 'riwayat',
      label: 'Riwayat',
      count: historyItems.length,
      Icon: History,
    },
  ];

  const HEADER_META: Record<
    ApprovalTabKey,
    {
      eyebrow: string;
      title: string;
      subtitle: string;
      emptyTitle: string;
      emptyDesc: string;
      EmptyIcon: React.ElementType;
    }
  > = {
    kotak_masuk: {
      eyebrow: 'DAFTAR TUGAS',
      title: 'Perlu Perhatian Anda',
      subtitle: 'Tinjau dokumen pada tahap yang menjadi tanggung jawab Anda.',
      emptyTitle: 'Kotak masuk sudah bersih',
      emptyDesc:
        'Pengajuan baru yang ditugaskan kepada Anda akan muncul di sini.',
      EmptyIcon: Inbox,
    },
    pengajuan_saya: {
      eyebrow: 'DOKUMEN SAYA',
      title: 'Pengajuan Saya',
      subtitle: 'Pantau status dokumen yang Anda ajukan ke alur persetujuan.',
      emptyTitle: 'Belum ada pengajuan aktif',
      emptyDesc:
        'Dokumen yang Anda kirimkan dari modul sumber akan tampil di sini.',
      EmptyIcon: FileCheck2,
    },
    riwayat: {
      eyebrow: 'ARSIP KEPUTUSAN',
      title: 'Riwayat Tinjauan',
      subtitle: 'Daftar dokumen yang telah selesai diputuskan pada jejak audit.',
      emptyTitle: 'Belum ada riwayat keputusan',
      emptyDesc: 'Keputusan persetujuan atau penolakan akan tercatat di sini.',
      EmptyIcon: History,
    },
  };

  const activeHeaderMeta = HEADER_META[activeTab];
  const ActiveEmptyIcon = activeHeaderMeta.EmptyIcon;

  return (
    <div className="w-full h-full font-sans text-slate-700">
      {/* 1. BARIS TAB NAVIGASI ATAS */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] mb-3.5 px-4 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        {/* Kiri: 3 Tab */}
        <div
          role="tablist"
          aria-label="Navigasi Persetujuan Dokumen"
          className="flex items-center gap-5 sm:gap-7 overflow-x-auto"
        >
          {TOP_TABS.map(({ key, label, count, Icon }) => {
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabChange(key)}
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
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-cyan-100/80 text-[#007b94]'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>

                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Kanan: Badge Jejak Audit */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 py-2">
          <ShieldCheck className="w-4 h-4 text-[#008ba6] shrink-0" />
          <span>Keputusan tersimpan pada jejak audit</span>
        </div>
      </div>

      {/* 2. CONTAINER UTAMA SPLIT-PANE (KIRI: DAFTAR TUGAS, KANAN: PANEL TINJAUAN) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] grid grid-cols-1 lg:grid-cols-[360px_1fr] min-h-[560px] overflow-hidden">
        {/* KOLOM KIRI: DAFTAR DOKUMEN */}
        <section className="flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200/80">
          {/* Header Daftar Tugas */}
          <div className="p-5 pb-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  {activeHeaderMeta.eyebrow}
                </p>
                <h2 className="text-lg font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
                  {activeHeaderMeta.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => void handleReloadClick()}
                title="Muat ulang daftar dokumen"
                aria-label="Muat ulang daftar dokumen"
                className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    isReloading ? 'animate-spin text-[#008ba6]' : ''
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {activeHeaderMeta.subtitle}
            </p>

            {/* Search Input dengan Pintasan "/" */}
            <div className="relative mt-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Dokumen, Nomor, atau Pengaju..."
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-400">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Area List / Empty State */}
          <div className="flex-1 flex flex-col px-5 pb-4 overflow-y-auto">
            {filteredDocuments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-14 h-14 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mb-3.5">
                  <ActiveEmptyIcon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <p className="text-sm font-bold text-[#0f3d56]">
                  {searchQuery
                    ? 'Dokumen tidak ditemukan'
                    : activeHeaderMeta.emptyTitle}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-[235px] leading-relaxed">
                  {searchQuery
                    ? 'Coba ubah kata kunci pencarian dokumen atau nomor.'
                    : activeHeaderMeta.emptyDesc}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                {filteredDocuments.map((doc) => {
                  const isSelected = selectedDocument?.id === doc.id;
                  const badge = DECISION_BADGE_META[doc.status];

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setDecisionNote('');
                      }}
                      className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#f0f9fb]/70 border-[#009bb8] shadow-2xs'
                          : 'bg-white border-slate-200/90 hover:border-[#009bb8]/40 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold text-[#008ba6]">
                          {doc.nomorDokumen}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-[#0f3d56] mt-1.5 line-clamp-2 leading-snug">
                        {doc.judulDokumen}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate max-w-[160px]">
                          {doc.pengaju}
                        </span>
                        <span>{doc.modulSumber}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Status Panel Kiri */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {filteredDocuments.length} dari {currentTabList.length} dokumen
            </span>
            <span>Data langsung · TARAMEDIC</span>
          </div>
        </section>

        {/* KOLOM KANAN: PANEL TINJAUAN DOKUMEN */}
        <section className="flex flex-col bg-white">
          {!selectedDocument ? (
            /* Empty State Panel Kanan (Sesuai Gambar) */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-10">
              <div className="w-14 h-14 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 stroke-[1.75]" />
              </div>

              <h3 className="text-base sm:text-[17px] font-bold text-[#0f3d56]">
                Pilih Dokumen Untuk Ditinjau
              </h3>

              <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                Ringkasan, pemilik, rantai persetujuan, dan catatan keputusan
                akan tampil di sini.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200/90 bg-slate-50/60 text-xs font-medium text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#008ba6] shrink-0" />
                <span>Tindakan akhir tetap melalui modul sumber</span>
              </div>
            </div>
          ) : (
            /* Detail Tinjauan Dokumen Terpilih */
            <div className="flex-1 flex flex-col justify-between p-5 sm:p-7 overflow-y-auto">
              <div>
                {/* Header Dokumen */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#f0f9fb] border border-cyan-200/70 text-[#008ba6] text-xs font-extrabold">
                        {selectedDocument.nomorDokumen}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        · {selectedDocument.modulSumber}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0f3d56] mt-2">
                      {selectedDocument.judulDokumen}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      DECISION_BADGE_META[selectedDocument.status].className
                    }`}
                  >
                    {DECISION_BADGE_META[selectedDocument.status].label}
                  </span>
                </div>

                {/* Info Pemilik / Pengaju */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4 p-4 rounded-xl bg-[#f8fafc] border border-slate-200/80 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">
                        Pemilik / Pengaju
                      </p>
                      <p className="font-bold text-[#0f3d56]">
                        {selectedDocument.pengaju}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {selectedDocument.unitPengaju}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-white border border-slate-200/80 text-slate-500 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">
                        Waktu Pengajuan
                      </p>
                      <p className="font-bold text-slate-700">
                        {selectedDocument.tanggalPengajuan}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ringkasan Dokumen */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Ringkasan Dokumen
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed bg-white rounded-xl border border-slate-200/80 p-3.5">
                    {selectedDocument.ringkasan}
                  </p>
                </div>

                {/* Rantai Persetujuan */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Rantai Persetujuan
                  </h4>
                  <div className="space-y-2.5">
                    {selectedDocument.rantaiPersetujuan.map((step, idx) => (
                      <div
                        key={step.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-200/80 p-3.5 text-xs"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6] font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-[#0f3d56]">
                              {step.peran}
                            </p>
                            <p className="text-slate-600 mt-0.5">
                              {step.namaApprover}
                            </p>
                            {step.catatan && (
                              <p className="text-[11px] text-slate-500 italic mt-1">
                                &ldquo;{step.catatan}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            {step.status === 'selesai'
                              ? 'Tervalidasi'
                              : 'Menunggu'}
                          </span>
                          {step.waktu && (
                            <p className="text-[10px] text-slate-400 mt-1">
                              {step.waktu}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catatan Keputusan (jika status menunggu & bukan pengajuan sendiri) */}
                {selectedDocument.status === 'menunggu' &&
                  !selectedDocument.isSelfSubmission && (
                    <div className="mb-4">
                      <label
                        htmlFor="catatan-keputusan-dokumen"
                        className="block text-xs font-bold text-slate-600 mb-1.5"
                      >
                        Catatan Keputusan (Opsional)
                      </label>
                      <textarea
                        id="catatan-keputusan-dokumen"
                        rows={2}
                        value={decisionNote}
                        onChange={(e) => setDecisionNote(e.target.value)}
                        placeholder="Tambahkan catatan audit sebelum menyimpan keputusan..."
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                      />
                    </div>
                  )}
              </div>

              {/* Footer Aksi Panel Kanan */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenSourceModule?.(selectedDocument)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#008ba6]" />
                  <span>Buka Modul Sumber</span>
                </button>

                {selectedDocument.status === 'menunggu' &&
                  !selectedDocument.isSelfSubmission && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecision('ditolak')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 text-xs font-bold text-rose-700 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDecision('disetujui')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-xs font-bold text-white shadow-2xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Setujui Dokumen</span>
                      </button>
                    </div>
                  )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* 3. CATATAN KEBIJAKAN BAWAH */}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <HelpCircle className="w-4 h-4 text-[#008ba6] shrink-0" />
        <p>
          Pengaju tidak dapat memutuskan pengajuannya sendiri. Penyelesaian akhir
          mengikuti validasi modul sumber.
        </p>
      </div>
    </div>
  );
}