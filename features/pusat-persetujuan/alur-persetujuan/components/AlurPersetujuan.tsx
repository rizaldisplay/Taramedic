'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eraser,
  FileText,
  ListPlus,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';

export type TargetType = 'peran' | 'pengguna' | 'divisi';

export interface DocumentTypeOption {
  id: string;
  nama: string;
  aksiLabel: string;
}

export interface ApproverTargetOption {
  id: string;
  type: TargetType;
  label: string;
  sdmkId?: string;
  divisi?: string;
}

export interface WorkflowStageDraft {
  id: string;
  namaTahap: string;
  targetType: TargetType;
  targetSearch: string;
  selectedTargetId: string;
  targets: ApproverTargetOption[];
}

export interface WorkflowVersionHistory {
  versi: string;
  statusLabel: string;
  updatedAt: string;
  oleh: string;
}

export interface SavedApprovalWorkflow {
  id: string;
  namaAlur: string;
  statusTerbit: 'aktif' | 'draf';
  versiInfo: string;
  updatedAt: string;
  aktif: boolean;
  jenisDokumen: string[];
  tahapan: {
    id: string;
    namaTahap: string;
    jumlahTarget: number;
    targets: ApproverTargetOption[];
  }[];
  riwayatVersi: WorkflowVersionHistory[];
}

const DOCUMENT_TYPES: DocumentTypeOption[] = [
  {
    id: 'purchase_order',
    nama: 'Purchase Order',
    aksiLabel: 'Setuju · Kembali · Tolak',
  },
  {
    id: 'permintaan_pengadaan',
    nama: 'Permintaan Pengadaan',
    aksiLabel: 'Setuju · Kembali · Tolak',
  },
  {
    id: 'retur_pemasok',
    nama: 'Retur Pemasok',
    aksiLabel: 'Setuju · Kembali · Tolak',
  },
  {
    id: 'faktur_pemasok',
    nama: 'Faktur Pemasok',
    aksiLabel: 'Setuju · Kembali · Tolak',
  },
  {
    id: 'pembayaran_pemasok',
    nama: 'Pembayaran Pemasok',
    aksiLabel: 'Setuju · Tolak',
  },
  {
    id: 'penyesuaian_stok',
    nama: 'Penyesuaian Stok',
    aksiLabel: 'Setuju · Kembali · Tolak',
  },
  {
    id: 'pemusnahan_obat',
    nama: 'Pemusnahan Obat / BHP',
    aksiLabel: 'Setuju · Tolak',
  },
  {
    id: 'koreksi_catatan_klinis',
    nama: 'Koreksi Catatan Klinis',
    aksiLabel: 'Setuju · Kembali · Tolak',
  },
];

const TARGET_DIRECTORY: ApproverTargetOption[] = [
  { id: 'role-superadmin', type: 'peran', label: 'Superadmin Klinik' },
  { id: 'role-pj-klinik', type: 'peran', label: 'Penanggung Jawab Klinik' },
  { id: 'role-kepala-unit', type: 'peran', label: 'Kepala Unit Pelayanan' },
  { id: 'role-apt-pj', type: 'peran', label: 'Apoteker Penanggung Jawab' },
  { id: 'role-keuangan', type: 'peran', label: 'Koordinator Keuangan & Kasir' },
  {
    id: 'usr-1',
    type: 'pengguna',
    label: 'dr. Altharrazka Kenigara Rizfan',
    sdmkId: 'SDMK-2026001',
    divisi: 'Pelayanan Medis',
  },
  {
    id: 'usr-2',
    type: 'pengguna',
    label: 'apt. Nabila Kusuma, S.Farm',
    sdmkId: 'SDMK-2026004',
    divisi: 'Instalasi Farmasi',
  },
  {
    id: 'usr-3',
    type: 'pengguna',
    label: 'Ns. Budi Santoso, S.Kep',
    sdmkId: 'SDMK-2026007',
    divisi: 'Keperawatan',
  },
  { id: 'div-medis', type: 'divisi', label: 'Divisi Pelayanan Medis' },
  { id: 'div-farmasi', type: 'divisi', label: 'Divisi Farmasi & Gudang' },
  { id: 'div-keuangan', type: 'divisi', label: 'Divisi Keuangan & Pengadaan' },
];

const INITIAL_WORKFLOWS: SavedApprovalWorkflow[] = [
  {
    id: 'wf-1',
    namaAlur: 'Koreksi klinis — persetujuan superadmin (sementara)',
    statusTerbit: 'aktif',
    versiInfo: 'Versi terbit aktif',
    updatedAt: 'diperbarui Sabtu, 10 Oktober 2026 13:44:09 WIB',
    aktif: true,
    jenisDokumen: ['Koreksi catatan klinis'],
    tahapan: [
      {
        id: 'st-init-1',
        namaTahap: 'Telaah superadmin',
        jumlahTarget: 1,
        targets: [{ id: 'role-superadmin', type: 'peran', label: 'Superadmin Klinik' }],
      },
    ],
    riwayatVersi: [
      {
        versi: 'v1.0 (Aktif)',
        statusLabel: 'Diterbitkan',
        updatedAt: 'Sabtu, 10 Oktober 2026 13:44:09 WIB',
        oleh: 'Superadmin Klinik',
      },
    ],
  },
];

const createEmptyStage = (index: number): WorkflowStageDraft => ({
  id: `stage-${Date.now()}-${index}`,
  namaTahap: '',
  targetType: 'peran',
  targetSearch: '',
  selectedTargetId: '',
  targets: [],
});

export default function PengelolaanAlurPersetujuan({
  initialWorkflows = INITIAL_WORKFLOWS,
  onSaveWorkflow,
  onToggleWorkflowActive,
}: {
  initialWorkflows?: SavedApprovalWorkflow[];
  onSaveWorkflow?: (workflow: SavedApprovalWorkflow, publish: boolean) => void;
  onToggleWorkflowActive?: (workflowId: string, active: boolean) => void;
}) {
  const [workflows, setWorkflows] =
    useState<SavedApprovalWorkflow[]>(initialWorkflows);
  const [expandedHistoryIds, setExpandedHistoryIds] = useState<
    Record<string, boolean>
  >({});

  // State Form Rancang Alur Persetujuan
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(
    null,
  );
  const [namaAlur, setNamaAlur] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [docPage, setDocPage] = useState(1);
  const [docPageSize, setDocPageSize] = useState(5);

  const [stages, setStages] = useState<WorkflowStageDraft[]>([
    createEmptyStage(1),
  ]);
  const [activateOnPublish, setActivateOnPublish] = useState(true);

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const designerSectionRef = useRef<HTMLDivElement>(null);

  // Pagination Jenis Dokumen
  const totalDocs = DOCUMENT_TYPES.length;
  const totalDocPages = Math.max(1, Math.ceil(totalDocs / docPageSize));
  const safeDocPage = Math.min(docPage, totalDocPages);

  const paginatedDocTypes = useMemo(() => {
    const startIdx = (safeDocPage - 1) * docPageSize;
    return DOCUMENT_TYPES.slice(startIdx, startIdx + docPageSize);
  }, [safeDocPage, docPageSize]);

  const docStartNumber =
    totalDocs === 0 ? 0 : (safeDocPage - 1) * docPageSize + 1;
  const docEndNumber = Math.min(safeDocPage * docPageSize, totalDocs);

  const toggleDocSelection = (docId: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  };

  // Toggle status aktif pada daftar konfigurasi atas
  const handleToggleSavedActive = (wfId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== wfId) return wf;
        const nextActive = !wf.aktif;
        onToggleWorkflowActive?.(wfId, nextActive);
        return { ...wf, aktif: nextActive };
      }),
    );
  };

  const toggleHistoryAccordion = (wfId: string) => {
    setExpandedHistoryIds((prev) => ({ ...prev, [wfId]: !prev[wfId] }));
  };

  // Muat alur tersimpan ke editor atau reset untuk alur baru
  const handleNewWorkflow = () => {
    setEditingWorkflowId(null);
    setNamaAlur('');
    setSelectedDocIds([]);
    setStages([createEmptyStage(1)]);
    setActivateOnPublish(true);
    setFeedbackMessage(null);
    designerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditWorkflow = (wf: SavedApprovalWorkflow) => {
    setEditingWorkflowId(wf.id);
    setNamaAlur(wf.namaAlur);

    const matchedDocIds = DOCUMENT_TYPES.filter((d) =>
      wf.jenisDokumen.some(
        (label) => label.toLowerCase() === d.nama.toLowerCase(),
      ),
    ).map((d) => d.id);
    setSelectedDocIds(matchedDocIds);

    setStages(
      wf.tahapan.map((t, idx) => ({
        id: t.id || `stage-edit-${idx}`,
        namaTahap: t.namaTahap,
        targetType: t.targets[0]?.type ?? 'peran',
        targetSearch: '',
        selectedTargetId: '',
        targets: t.targets,
      })),
    );
    setActivateOnPublish(wf.aktif);
    setFeedbackMessage(null);
    designerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Manajemen Tahapan (Rantai Tahapan)
  const handleAddStage = () => {
    setStages((prev) => [...prev, createEmptyStage(prev.length + 1)]);
  };

  const handleRemoveStage = (stageId: string) => {
    if (stages.length <= 1) return;
    setStages((prev) => prev.filter((s) => s.id !== stageId));
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= stages.length) return;

    setStages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
  };

  const updateStage = (
    stageId: string,
    patch: Partial<WorkflowStageDraft>,
  ) => {
    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, ...patch } : s)),
    );
  };

  const handleAddTargetToStage = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    if (!stage || !stage.selectedTargetId) return;

    const targetObj = TARGET_DIRECTORY.find(
      (t) => t.id === stage.selectedTargetId,
    );
    if (!targetObj) return;

    const alreadyAdded = stage.targets.some((t) => t.id === targetObj.id);
    if (alreadyAdded) return;

    updateStage(stageId, {
      targets: [...stage.targets, targetObj],
      selectedTargetId: '',
    });
  };

  const handleRemoveTargetFromStage = (stageId: string, targetId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    if (!stage) return;

    updateStage(stageId, {
      targets: stage.targets.filter((t) => t.id !== targetId),
    });
  };

  // Validasi & Buka Modal Tinjau Sebelum Simpan
  const handleOpenReview = () => {
    if (!namaAlur.trim()) {
      setFeedbackMessage({
        type: 'error',
        text: 'Nama alur wajib diisi sebelum melakukan tinjauan.',
      });
      return;
    }

    if (selectedDocIds.length === 0) {
      setFeedbackMessage({
        type: 'error',
        text: 'Pilih minimal satu jenis dokumen untuk aturan alur ini.',
      });
      return;
    }

    const emptyStageIndex = stages.findIndex((s) => !s.namaTahap.trim());
    if (emptyStageIndex !== -1) {
      setFeedbackMessage({
        type: 'error',
        text: `Nama tahap pada Tahap ${String(emptyStageIndex + 1).padStart(2, '0')} wajib diisi.`,
      });
      return;
    }

    setFeedbackMessage(null);
    setShowReviewModal(true);
  };

  const handleCommitWorkflow = (publishNow: boolean) => {
    const nowFormatted = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeFormatted = new Date()
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/\./g, ':');

    const docLabels = DOCUMENT_TYPES.filter((d) =>
      selectedDocIds.includes(d.id),
    ).map((d) => d.nama);

    const builtWorkflow: SavedApprovalWorkflow = {
      id: editingWorkflowId ?? `wf-${Date.now()}`,
      namaAlur: namaAlur.trim(),
      statusTerbit: publishNow ? 'aktif' : 'draf',
      versiInfo: publishNow ? 'Versi terbit aktif' : 'Draf tersimpan',
      updatedAt: `diperbarui ${nowFormatted} ${timeFormatted} WIB`,
      aktif: publishNow ? activateOnPublish : false,
      jenisDokumen: docLabels,
      tahapan: stages.map((st) => ({
        id: st.id,
        namaTahap: st.namaTahap.trim(),
        jumlahTarget: st.targets.length,
        targets: st.targets,
      })),
      riwayatVersi: [
        {
          versi: publishNow ? 'v1.0 (Aktif)' : 'v0.1 (Draf)',
          statusLabel: publishNow ? 'Diterbitkan' : 'Disimpan sebagai draf',
          updatedAt: `${nowFormatted} ${timeFormatted} WIB`,
          oleh: 'Pengguna Aktif',
        },
      ],
    };

    setWorkflows((prev) => {
      if (editingWorkflowId) {
        return prev.map((w) =>
          w.id === editingWorkflowId
            ? {
                ...builtWorkflow,
                riwayatVersi: [
                  ...builtWorkflow.riwayatVersi,
                  ...w.riwayatVersi,
                ],
              }
            : w,
        );
      }
      return [builtWorkflow, ...prev];
    });

    onSaveWorkflow?.(builtWorkflow, publishNow);
    setShowReviewModal(false);
    setFeedbackMessage({
      type: 'success',
      text: publishNow
        ? 'Alur persetujuan berhasil diterbitkan dan diaktifkan.'
        : 'Perubahan alur berhasil disimpan sebagai draf.',
    });
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* 1. HEADER BANNER ATAS */}
      <section className="bg-white rounded-xl border border-slate-200/90 px-5 py-4 sm:px-6 sm:py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6] flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              PENGELOLAAN ALUR
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
              Satu Aturan, Satu Rantai yang Jelas.
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur satu atau beberapa jenis dokumen pada rangkaian tahap
              bersama. Perubahan tersimpan sebagai draf sampai diterbitkan.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#f0f9fb] border border-cyan-200/80 text-xs font-bold text-[#008ba6] shrink-0">
          {workflows.length} alur tersimpan
        </span>
      </section>

      {/* 2. BARIS TENGAH: DAFTAR KONFIGURASI (KIRI) & KONTROL TIDAK BISA DILEWATI (KANAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
        {/* Kiri: Alur Aktif, Draf & Riwayat */}
        <section className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                DAFTAR KONFIGURASI
              </p>
              <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56] mt-0.5">
                Alur Aktif, Draf &amp; Riwayat
              </h2>
            </div>

            <button
              type="button"
              onClick={handleNewWorkflow}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              <span>Alur baru</span>
            </button>
          </div>

          {/* Daftar Kartu Konfigurasi Tersimpan */}
          <div className="space-y-3">
            {workflows.map((wf) => {
              const isHistoryOpen = Boolean(expandedHistoryIds[wf.id]);
              const totalTargets = wf.tahapan.reduce(
                (acc, t) => acc + t.jumlahTarget,
                0,
              );

              return (
                <div
                  key={wf.id}
                  className="rounded-xl border border-slate-200/90 bg-white p-4 transition-all"
                >
                  {/* Baris Judul & Tombol Konfigurasi */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          wf.aktif ? 'bg-[#009bb8]' : 'bg-slate-300'
                        }`}
                      />
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-[#0f3d56] leading-snug">
                          {wf.namaAlur}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {wf.versiInfo} · {wf.updatedAt}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEditWorkflow(wf)}
                      title="Edit konfigurasi alur"
                      aria-label="Edit konfigurasi alur"
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-[#008ba6] transition-colors cursor-pointer shrink-0"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Pill Jenis Dokumen */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {wf.jenisDokumen.map((docName) => (
                      <span
                        key={docName}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f0f9fb] border border-cyan-200/80 text-[11px] font-semibold text-[#008ba6]"
                      >
                        {docName}
                      </span>
                    ))}
                  </div>

                  {/* Rangkaian Tahap */}
                  <div className="mt-3 space-y-1.5">
                    {wf.tahapan.map((tahap, idx) => (
                      <div
                        key={tahap.id}
                        className="rounded-lg border border-slate-200/80 bg-[#f8fafc] px-3 py-2 flex items-center gap-2.5 text-xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#e6f6fa] text-[#008ba6] text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-700">
                          {tahap.namaTahap}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Meta Tahap & Switch Aktif */}
                  <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span>
                      {wf.tahapan.length} tahap · {totalTargets} target
                    </span>

                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={wf.aktif}
                        onClick={() => handleToggleSavedActive(wf.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer ${
                          wf.aktif ? 'bg-[#009bb8]' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                            wf.aktif ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span
                        className={`font-semibold ${
                          wf.aktif ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {wf.aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </label>
                  </div>

                  {/* Riwayat Versi Accordion */}
                  <div className="border-t border-slate-100 mt-3 pt-2.5">
                    <button
                      type="button"
                      onClick={() => toggleHistoryAccordion(wf.id)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-[#008ba6] transition-colors cursor-pointer"
                    >
                      <span
                        className={`inline-block transition-transform ${
                          isHistoryOpen ? 'rotate-90' : ''
                        }`}
                      >
                        ▸
                      </span>
                      <span>Riwayat versi · {wf.riwayatVersi.length}</span>
                    </button>

                    {isHistoryOpen && (
                      <div className="mt-2 space-y-1.5 pl-3">
                        {wf.riwayatVersi.map((ver, vIdx) => (
                          <div
                            key={`${wf.id}-ver-${vIdx}`}
                            className="rounded-lg bg-slate-50 border border-slate-200/70 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px]"
                          >
                            <div>
                              <span className="font-bold text-[#0f3d56]">
                                {ver.versi}
                              </span>
                              <span className="text-slate-400 ml-2">
                                {ver.updatedAt}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-[#f0f9fb] text-[#008ba6] font-semibold">
                              {ver.statusLabel}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Kanan: Kontrol yang tidak bisa dilewati */}
        <aside className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="w-9 h-9 rounded-xl bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
          </div>

          <h2 className="text-sm sm:text-[15px] font-extrabold text-[#0f3d56] mt-3">
            Kontrol yang tidak bisa dilewati
          </h2>

          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Aturan hanya menentukan siapa yang dapat memutuskan. Modul pembelian,
            persediaan, atau farmasi tetap memvalidasi dan mengeksekusi tindakan
            akhirnya.
          </p>

          <div className="mt-4 space-y-2.5 text-[11px] text-slate-500 leading-relaxed">
            <div className="rounded-lg bg-[#f8fafc] border border-slate-200/70 px-3 py-2.5">
              Pengaju dikecualikan dari persetujuannya sendiri.
            </div>
            <div className="rounded-lg bg-[#f8fafc] border border-slate-200/70 px-3 py-2.5">
              Satu target yang cocok cukup untuk menyelesaikan tahap.
            </div>
            <div className="rounded-lg bg-[#f8fafc] border border-slate-200/70 px-3 py-2.5">
              Perubahan aturan tidak menghapus jejak persetujuan.
            </div>
          </div>
        </aside>
      </div>

      {/* 3. BAGIAN BAWAH: RANCANG ALUR PERSETUJUAN */}
      <section
        ref={designerSectionRef}
        className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
      >
        {/* Header Designer */}
        <div className="pb-4 border-b border-slate-100">
          <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            {editingWorkflowId ? 'SUNTING ATURAN' : 'ATURAN BARU'}
          </p>
          <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56] mt-0.5">
            Rancang Alur Persetujuan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simpan sebagai draf; hanya versi yang diterbitkan yang digunakan
            untuk pengajuan berikutnya.
          </p>
        </div>

        {/* Grid Form Builder (Kiri) + Pratinjau Rantai (Kanan) */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_310px] gap-6 pt-5 items-start">
          {/* KOLOM KIRI: FORM RANCANGAN */}
          <div className="space-y-6">
            {/* Field 1: Nama alur */}
            <div>
              <div className="flex items-center justify-between max-w-md mb-1.5">
                <label
                  htmlFor="input-nama-alur"
                  className="text-xs font-bold text-slate-700"
                >
                  Nama alur
                </label>
                <span className="text-[11px] font-semibold text-amber-700">
                  wajib
                </span>
              </div>
              <input
                id="input-nama-alur"
                type="text"
                value={namaAlur}
                onChange={(e) => setNamaAlur(e.target.value)}
                placeholder="Contoh: Pembelian rutin klinik"
                className="w-full max-w-md bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
            </div>

            {/* Field 2: Jenis dokumen (pilih satu atau lebih) */}
            <div>
              <div className="flex items-baseline gap-2 mb-2.5">
                <span className="text-xs font-bold text-slate-700">
                  Jenis dokumen
                </span>
                <span className="text-[11px] text-slate-400">
                  pilih satu atau lebih
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {paginatedDocTypes.map((doc) => {
                  const isChecked = selectedDocIds.includes(doc.id);

                  return (
                    <label
                      key={doc.id}
                      className={`flex items-start gap-3 rounded-xl border p-3 transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-[#f0f9fb]/70 border-[#009bb8]'
                          : 'bg-white border-slate-200/90 hover:border-[#009bb8]/40 hover:bg-slate-50/70'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDocSelection(doc.id)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#009bb8] cursor-pointer"
                      />
                      <FileText
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isChecked ? 'text-[#008ba6]' : 'text-emerald-600'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0f3d56]">
                          {doc.nama}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {doc.aksiLabel}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Pagination Jenis Dokumen */}
              <div className="mt-3 rounded-xl border border-slate-200/80 bg-[#f8fafc]/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    <strong className="font-semibold text-slate-700">
                      {docStartNumber}–{docEndNumber}
                    </strong>{' '}
                    dari{' '}
                    <strong className="font-semibold text-slate-700">
                      {totalDocs}
                    </strong>{' '}
                    Jenis Dokumen
                  </span>

                  <div className="flex items-center gap-2">
                    <label htmlFor="per-halaman-dokumen">Per Halaman</label>
                    <div className="relative">
                      <select
                        id="per-halaman-dokumen"
                        value={docPageSize}
                        onChange={(e) => {
                          setDocPageSize(Number(e.target.value));
                          setDocPage(1);
                        }}
                        className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                      >
                        <option value={5}>5</option>
                        <option value={8}>8</option>
                        <option value={10}>10</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDocPage(1)}
                    disabled={safeDocPage <= 1}
                    aria-label="Halaman pertama"
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDocPage((p) => Math.max(1, p - 1))}
                    disabled={safeDocPage <= 1}
                    aria-label="Halaman sebelumnya"
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from(
                    { length: totalDocPages },
                    (_, idx) => idx + 1,
                  ).map((page) => {
                    const isCurrent = page === safeDocPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setDocPage(page)}
                        className={`w-7 h-7 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[#f0f9fb] border-[#009bb8] text-[#008ba6]'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setDocPage((p) => Math.min(totalDocPages, p + 1))
                    }
                    disabled={safeDocPage >= totalDocPages}
                    aria-label="Halaman berikutnya"
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDocPage(totalDocPages)}
                    disabled={safeDocPage >= totalDocPages}
                    aria-label="Halaman terakhir"
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Field 3: RANTAI TAHAPAN — Urutan keputusan */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                    RANTAI TAHAPAN
                  </p>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0f3d56]">
                    Urutan keputusan
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleAddStage}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <ListPlus className="w-4 h-4 text-[#008ba6]" />
                  <span>Tambah tahap</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {stages.map((stage, stageIndex) => {
                  const availableTargets = TARGET_DIRECTORY.filter((t) => {
                    if (t.type !== stage.targetType) return false;
                    if (stage.targets.some((added) => added.id === t.id)) {
                      return false;
                    }
                    if (stage.targetSearch.trim() !== '') {
                      const q = stage.targetSearch.toLowerCase();
                      const matchLabel = t.label.toLowerCase().includes(q);
                      const matchSdmk = t.sdmkId?.toLowerCase().includes(q);
                      const matchDiv = t.divisi?.toLowerCase().includes(q);
                      return Boolean(matchLabel || matchSdmk || matchDiv);
                    }
                    return true;
                  });

                  return (
                    <div
                      key={stage.id}
                      className="rounded-xl border border-[#009bb8]/70 bg-white p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        {/* Nomor Tahap */}
                        <span className="w-7 h-7 rounded-full bg-[#e6f6fa] text-[#008ba6] text-xs font-extrabold flex items-center justify-center shrink-0 mt-5">
                          {String(stageIndex + 1).padStart(2, '0')}
                        </span>

                        <div className="flex-1 min-w-0 space-y-3.5">
                          {/* Nama Tahap & Kontrol Urutan */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5 pr-24">
                              <label
                                htmlFor={`nama-tahap-${stage.id}`}
                                className="text-xs font-bold text-slate-700"
                              >
                                Nama tahap
                              </label>
                              <span className="text-[11px] font-semibold text-amber-700">
                                wajib
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                id={`nama-tahap-${stage.id}`}
                                type="text"
                                value={stage.namaTahap}
                                onChange={(e) =>
                                  updateStage(stage.id, {
                                    namaTahap: e.target.value,
                                  })
                                }
                                placeholder="Contoh: Tinjauan kepala unit"
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                              />

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  disabled={stageIndex === 0}
                                  onClick={() =>
                                    handleMoveStage(stageIndex, 'up')
                                  }
                                  title="Geser tahap ke atas"
                                  aria-label="Geser tahap ke atas"
                                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={stageIndex === stages.length - 1}
                                  onClick={() =>
                                    handleMoveStage(stageIndex, 'down')
                                  }
                                  title="Geser tahap ke bawah"
                                  aria-label="Geser tahap ke bawah"
                                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={stages.length <= 1}
                                  onClick={() => handleRemoveStage(stage.id)}
                                  title="Hapus tahap"
                                  aria-label="Hapus tahap"
                                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center text-slate-500 hover:text-rose-600 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Sub-bagian Approver */}
                          <div className="space-y-3 pt-1">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="text-xs font-bold text-slate-700">
                                Approver
                              </span>
                              <span className="text-[11px] text-slate-400">
                                Siapa pun dari target berikut dapat
                                menyelesaikan tahap.
                              </span>
                            </div>

                            {/* Jenis Target */}
                            <div className="max-w-xs">
                              <label
                                htmlFor={`jenis-target-${stage.id}`}
                                className="block text-[11px] font-semibold text-slate-500 mb-1"
                              >
                                Jenis target
                              </label>
                              <div className="relative">
                                <select
                                  id={`jenis-target-${stage.id}`}
                                  value={stage.targetType}
                                  onChange={(e) =>
                                    updateStage(stage.id, {
                                      targetType: e.target.value as TargetType,
                                      selectedTargetId: '',
                                    })
                                  }
                                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                                >
                                  <option value="peran">Peran</option>
                                  <option value="pengguna">
                                    Pengguna / Staff SDMK
                                  </option>
                                  <option value="divisi">Divisi / Unit</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>

                            {/* Cari nama, ID SDMK, divisi, atau jabatan */}
                            <div>
                              <label
                                htmlFor={`cari-target-${stage.id}`}
                                className="block text-[11px] font-semibold text-slate-500 mb-1"
                              >
                                Cari nama, ID SDMK, divisi, atau jabatan
                              </label>
                              <div className="relative">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  id={`cari-target-${stage.id}`}
                                  type="text"
                                  value={stage.targetSearch}
                                  onChange={(e) =>
                                    updateStage(stage.id, {
                                      targetSearch: e.target.value,
                                    })
                                  }
                                  placeholder="Nama, ID SDMK, divisi, jabatan..."
                                  className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8]"
                                />
                              </div>
                            </div>

                            {/* Pilih target + Tombol Tambah */}
                            <div>
                              <label
                                htmlFor={`pilih-target-${stage.id}`}
                                className="block text-[11px] font-semibold text-slate-500 mb-1"
                              >
                                Pilih target
                              </label>
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <select
                                    id={`pilih-target-${stage.id}`}
                                    value={stage.selectedTargetId}
                                    onChange={(e) =>
                                      updateStage(stage.id, {
                                        selectedTargetId: e.target.value,
                                      })
                                    }
                                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                                  >
                                    <option value="">Pilih target...</option>
                                    {availableTargets.map((t) => (
                                      <option key={t.id} value={t.id}>
                                        {t.label}
                                        {t.sdmkId ? ` (${t.sdmkId})` : ''}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>

                                <button
                                  type="button"
                                  disabled={!stage.selectedTargetId}
                                  onClick={() =>
                                    handleAddTargetToStage(stage.id)
                                  }
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-[#f0f9fb] hover:border-[#009bb8]/50 disabled:opacity-45 disabled:pointer-events-none text-xs font-semibold text-slate-600 hover:text-[#008ba6] transition-colors cursor-pointer shrink-0"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Tambah</span>
                                </button>
                              </div>
                            </div>

                            {/* Daftar Target Terpilih */}
                            {stage.targets.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                {stage.targets.map((target) => (
                                  <span
                                    key={target.id}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f9fb] border border-cyan-200/80 text-[11px] font-semibold text-[#008ba6]"
                                  >
                                    <span>
                                      {target.label}
                                      {target.sdmkId
                                        ? ` · ${target.sdmkId}`
                                        : ''}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveTargetFromStage(
                                          stage.id,
                                          target.id,
                                        )
                                      }
                                      aria-label={`Hapus ${target.label}`}
                                      className="text-[#008ba6] hover:text-rose-600 cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Field 4: Checkbox Aktifkan saat draf diterbitkan */}
            <label className="flex items-start gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={activateOnPublish}
                onChange={(e) => setActivateOnPublish(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#009bb8] cursor-pointer"
              />
              <div>
                <p className="text-xs font-bold text-[#0f3d56]">
                  Aktifkan saat draf diterbitkan
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pengaturan ini berlaku setelah draf diterbitkan.
                </p>
              </div>
            </label>

            {/* Pesan Validasi / Status Simpan */}
            {feedbackMessage && (
              <div
                className={`rounded-xl border px-4 py-3 text-xs font-medium flex items-center justify-between gap-2 ${
                  feedbackMessage.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-[#f0f9fb] border-cyan-200 text-[#008ba6]'
                }`}
              >
                <span>{feedbackMessage.text}</span>
                <button
                  type="button"
                  onClick={() => setFeedbackMessage(null)}
                  className="opacity-70 hover:opacity-100 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Tombol Aksi Bawah */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setFeedbackMessage(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5 text-slate-500" />
                <span>Bersihkan pesan</span>
              </button>

              <button
                type="button"
                onClick={handleOpenReview}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.2]" />
                <span>Tinjau sebelum simpan</span>
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: PRATINJAU RANTAI */}
          <aside className="rounded-xl border border-slate-200/90 bg-[#f8fafc]/70 p-4 sm:p-5 xl:sticky xl:top-4">
            <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              PRATINJAU RANTAI
            </p>

            <h3 className="text-base font-extrabold text-[#0f3d56] mt-1 break-words">
              {namaAlur.trim() || 'Nama alur Anda'}
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              {selectedDocIds.length} jenis dokumen · {stages.length} tahap ·{' '}
              {activateOnPublish ? 'Aktif' : 'Nonaktif'}
            </p>

            {/* Daftar Tahap Pratinjau */}
            <div className="mt-4 space-y-2.5">
              {stages.map((st, idx) => (
                <div
                  key={`preview-${st.id}`}
                  className="flex items-start gap-2.5 text-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-[#e6f6fa] text-[#008ba6] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0f3d56] truncate">
                      {st.namaTahap.trim() || `Tahap ${idx + 1}`}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {st.targets.length} target · salah satu dapat menyetujui
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200/70 mt-4 pt-3 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#008ba6] shrink-0" />
              <span>Identitas staff tersimpan dengan ID SDMK</span>
            </div>
          </aside>
        </div>

        {/* Footer Catatan Validasi Server */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#008ba6] shrink-0" />
          <p>
            Perubahan aturan melewati validasi server dan konflik akan
            ditampilkan tanpa mengubah konfigurasi lokal.
          </p>
        </div>
      </section>

      {/* MODAL TINJAU SEBELUM SIMPAN */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  KONFIRMASI ATURAN ALUR
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Tinjau Sebelum Simpan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <p className="text-slate-400">Nama Alur</p>
                <p className="text-sm font-bold text-[#0f3d56] mt-0.5">
                  {namaAlur}
                </p>
              </div>

              <div>
                <p className="text-slate-400 mb-1.5">
                  Jenis Dokumen Terpilih ({selectedDocIds.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DOCUMENT_TYPES.filter((d) =>
                    selectedDocIds.includes(d.id),
                  ).map((d) => (
                    <span
                      key={d.id}
                      className="px-2.5 py-1 rounded-md bg-[#f0f9fb] border border-cyan-200/80 text-[#008ba6] font-semibold"
                    >
                      {d.nama}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-slate-400 mb-1.5">
                  Rangkaian Tahapan ({stages.length})
                </p>
                <div className="space-y-1.5">
                  {stages.map((st, idx) => (
                    <div
                      key={`modal-${st.id}`}
                      className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 flex items-center justify-between"
                    >
                      <span className="font-bold text-[#0f3d56]">
                        {idx + 1}. {st.namaTahap}
                      </span>
                      <span className="text-slate-500">
                        {st.targets.length} target
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleCommitWorkflow(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Simpan sebagai Draf
              </button>
              <button
                type="button"
                onClick={() => handleCommitWorkflow(true)}
                className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
              >
                Simpan &amp; Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}