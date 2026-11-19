'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Box,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  ClipboardList,
  FileText,
  History,
  Landmark,
  Package,
  PackagePlus,
  PackageX,
  Plus,
  Send,
  SlidersHorizontal,
  Stethoscope,
  Trash2,
  Wrench,
  X,
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

export type TransactionAreaKey = 'obat' | 'alkes_bmhp';

export type TransactionOperationKey =
  | 'penerimaan'
  | 'pengeluaran'
  | 'transfer'
  | 'opname'
  | 'koreksi'
  | 'pemusnahan'
  | 'saldo_awal';

export type TransactionSubTabKey =
  | 'dokumen'
  | 'persetujuan_opname'
  | 'mutasi';

export type StockDocumentStatus =
  | 'Draft'
  | 'Menunggu Persetujuan'
  | 'Posted'
  | 'Ditolak';

export interface StockDocumentLine {
  id: string;
  kodeItem: string;
  namaItem: string;
  batch: string;
  qty: number;
  satuan: string;
}

export interface StockTransactionDocument {
  id: string;
  nomorDokumen: string;
  referensiKode: string;
  actorId: string;
  area: TransactionAreaKey;
  operasi: TransactionOperationKey;
  jenisLabel: string;
  gudang: string;
  gudangTujuan?: string;
  jumlahBaris: number;
  status: StockDocumentStatus;
  dibuatWaktu: string;
  postingWaktu?: string;
  catatan?: string;
  items: StockDocumentLine[];
}

export interface StockMutationRecord {
  id: string;
  nomorDokumen: string;
  kodeItem: string;
  namaItem: string;
  batch: string;
  gudang: string;
  jenisLabel: string;
  perubahanQty: number;
  satuan: string;
  waktuPosting: string;
}

const DEFAULT_DOCUMENTS: StockTransactionDocument[] = [
  {
    id: 'doc-1',
    nomorDokumen: 'INV-20261029-000002',
    referensiKode: 'GR-20261029-10CCA3A6',
    actorId: '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
    area: 'obat',
    operasi: 'penerimaan',
    jenisLabel: 'Penerimaan non-PO',
    gudang: 'Depo Farmasi',
    jumlahBaris: 1,
    status: 'Posted',
    dibuatWaktu: '29 Okt 19:38 WIB',
    postingWaktu: 'Posting 29 Okt 19:38 WIB',
    items: [
      {
        id: 'line-1',
        kodeItem: 'MED-72',
        namaItem: 'Ambroxol 30 mg Tablet',
        batch: '4568',
        qty: 60,
        satuan: 'Tablet',
      },
    ],
  },
  {
    id: 'doc-2',
    nomorDokumen: 'INV-20261029-000001',
    referensiKode: 'GR-20261029-BBA764A7',
    actorId: '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
    area: 'obat',
    operasi: 'penerimaan',
    jenisLabel: 'Penerimaan non-PO',
    gudang: 'Depo Farmasi',
    jumlahBaris: 1,
    status: 'Posted',
    dibuatWaktu: '29 Okt 19:29 WIB',
    postingWaktu: 'Posting 29 Okt 19:29 WIB',
    items: [
      {
        id: 'line-2',
        kodeItem: 'OBT-0010',
        namaItem: 'Amlodipine 5 mg Tablet',
        batch: '4567',
        qty: 60,
        satuan: 'Tablet',
      },
    ],
  },
  {
    id: 'doc-3',
    nomorDokumen: 'INV-20261011130241-5B0WN',
    referensiKode: 'RX-20261008-0035',
    actorId: 'e5485c03-f060-44d8-a2ee-3fc3927f3436',
    area: 'obat',
    operasi: 'pengeluaran',
    jenisLabel: 'Pengeluaran stok',
    gudang: 'Depo Farmasi',
    jumlahBaris: 2,
    status: 'Posted',
    dibuatWaktu: '11 Okt 20:02 WIB',
    postingWaktu: 'Posting 11 Okt 20:02 WIB',
    items: [
      {
        id: 'line-3a',
        kodeItem: 'OBT-0010',
        namaItem: 'Amlodipine 5 mg Tablet',
        batch: '01234',
        qty: 15,
        satuan: 'Tablet',
      },
      {
        id: 'line-3b',
        kodeItem: 'MED-72',
        namaItem: 'Ambroxol 30 mg Tablet',
        batch: '04321',
        qty: 10,
        satuan: 'Tablet',
      },
    ],
  },
  {
    id: 'doc-4',
    nomorDokumen: 'INV-20261010182939-AARJH',
    referensiKode: 'GR-20261011-73299FB3',
    actorId: '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
    area: 'obat',
    operasi: 'penerimaan',
    jenisLabel: 'Penerimaan non-PO',
    gudang: 'Depo Farmasi',
    jumlahBaris: 2,
    status: 'Posted',
    dibuatWaktu: '11 Okt 01:29 WIB',
    postingWaktu: 'Posting 11 Okt 01:29 WIB',
    items: [
      {
        id: 'line-4a',
        kodeItem: 'OBT-0010',
        namaItem: 'Amlodipine 5 mg Tablet',
        batch: '01234',
        qty: 20,
        satuan: 'Tablet',
      },
      {
        id: 'line-4b',
        kodeItem: 'MED-72',
        namaItem: 'Ambroxol 30 mg Tablet',
        batch: '04321',
        qty: 10,
        satuan: 'Tablet',
      },
    ],
  },
];

const OPERATION_CARDS: {
  key: TransactionOperationKey;
  title: string;
  descPrefix: string;
  jenisDokumenLabel: string;
  refPrefix: string;
  borderAccentClass: string;
  iconBoxClass: string;
  badgeClass: string;
  Icon: React.ElementType;
}[] = [
  {
    key: 'penerimaan',
    title: 'Penerimaan',
    descPrefix: 'Non-PO',
    jenisDokumenLabel: 'Penerimaan non-PO',
    refPrefix: 'GR',
    borderAccentClass: 'border-l-[3px] border-l-emerald-600',
    iconBoxClass: 'bg-emerald-50 text-emerald-700',
    badgeClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
    Icon: PackagePlus,
  },
  {
    key: 'pengeluaran',
    title: 'Pengeluaran',
    descPrefix: 'Pakai internal',
    jenisDokumenLabel: 'Pengeluaran stok',
    refPrefix: 'RX',
    borderAccentClass: 'border-l-[3px] border-l-sky-600',
    iconBoxClass: 'bg-sky-50 text-sky-700',
    badgeClass: 'bg-sky-50 border border-sky-200/80 text-sky-700',
    Icon: Package,
  },
  {
    key: 'transfer',
    title: 'Transfer',
    descPrefix: 'Antar gudang',
    jenisDokumenLabel: 'Transfer gudang',
    refPrefix: 'TR',
    borderAccentClass: 'border-l-[3px] border-l-teal-600',
    iconBoxClass: 'bg-teal-50 text-teal-700',
    badgeClass: 'bg-teal-50 border border-teal-200/80 text-teal-700',
    Icon: ArrowLeftRight,
  },
  {
    key: 'opname',
    title: 'Opname',
    descPrefix: 'Bandingkan fisik',
    jenisDokumenLabel: 'Stok opname',
    refPrefix: 'OP',
    borderAccentClass: 'border-l-[3px] border-l-purple-600',
    iconBoxClass: 'bg-purple-50 text-purple-700',
    badgeClass: 'bg-purple-50 border border-purple-200/80 text-purple-700',
    Icon: ClipboardCheck,
  },
  {
    key: 'koreksi',
    title: 'Koreksi',
    descPrefix: 'Selisih stok',
    jenisDokumenLabel: 'Koreksi stok',
    refPrefix: 'ADJ',
    borderAccentClass: 'border-l-[3px] border-l-amber-500',
    iconBoxClass: 'bg-amber-50 text-amber-600',
    badgeClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
    Icon: SlidersHorizontal,
  },
  {
    key: 'pemusnahan',
    title: 'Pemusnahan',
    descPrefix: 'Rusak / expired',
    jenisDokumenLabel: 'Pemusnahan stok',
    refPrefix: 'DSP',
    borderAccentClass: 'border-l-[3px] border-l-rose-600',
    iconBoxClass: 'bg-rose-50 text-rose-700',
    badgeClass: 'bg-rose-50 border border-rose-200/80 text-rose-700',
    Icon: PackageX,
  },
  {
    key: 'saldo_awal',
    title: 'Saldo awal',
    descPrefix: 'Setup awal',
    jenisDokumenLabel: 'Saldo awal',
    refPrefix: 'OB',
    borderAccentClass: 'border-l-[3px] border-l-slate-700',
    iconBoxClass: 'bg-slate-100 text-slate-700',
    badgeClass: 'bg-slate-100 border border-slate-200/80 text-slate-700',
    Icon: Box,
  },
];

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

function getJenisBadgeClass(operasi: TransactionOperationKey): string {
  return (
    OPERATION_CARDS.find((op) => op.key === operasi)?.badgeClass ??
    'bg-emerald-50 border border-emerald-200/80 text-emerald-700'
  );
}

function getStatusBadgeClass(status: StockDocumentStatus): string {
  switch (status) {
    case 'Posted':
      return 'bg-emerald-50 border border-emerald-200/80 text-emerald-700';
    case 'Menunggu Persetujuan':
      return 'bg-amber-50 border border-amber-200/80 text-amber-700';
    case 'Ditolak':
      return 'bg-rose-50 border border-rose-200/80 text-rose-700';
    default:
      return 'bg-slate-100 border border-slate-200/80 text-slate-600';
  }
}

function getCurrentTimeWIB(): string {
  const now = new Date();
  const datePart = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
  });
  const timePart = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${datePart} ${timePart.replace('.', ':')} WIB`;
}

export default function TransaksiStok({
  initialDocuments = DEFAULT_DOCUMENTS,
  currentActorId = '9f33bd7a-9ab7-4c4f-ad26-b3d3e7854ec8',
  onMainTabChange,
  onCreateDocument,
  onApproveOpname,
  onRejectOpname,
}: {
  initialDocuments?: StockTransactionDocument[];
  currentActorId?: string;
  onMainTabChange?: (tab: InventoryMainTabKey) => void;
  onCreateDocument?: (doc: StockTransactionDocument) => void;
  onApproveOpname?: (doc: StockTransactionDocument) => void;
  onRejectOpname?: (doc: StockTransactionDocument) => void;
}) {
  const [activeMainTab, setActiveMainTab] =
    useState<InventoryMainTabKey>('transaksi_stok');
  const [selectedArea, setSelectedArea] =
    useState<TransactionAreaKey>('obat');
  const [activeSubTab, setActiveSubTab] =
    useState<TransactionSubTabKey>('dokumen');

  const [documents, setDocuments] =
    useState<StockTransactionDocument[]>(initialDocuments);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State Modal Detail Dokumen
  const [inspectingDoc, setInspectingDoc] =
    useState<StockTransactionDocument | null>(null);

  // State Modal Buat Dokumen Operasi
  const [creatingOperation, setCreatingOperation] =
    useState<TransactionOperationKey | null>(null);
  const [formGudang, setFormGudang] = useState('Depo Farmasi');
  const [formGudangTujuan, setFormGudangTujuan] = useState('Gudang Utama');
  const [formCatatan, setFormCatatan] = useState('');
  const [formLines, setFormLines] = useState<
    {
      kodeItem: string;
      namaItem: string;
      batch: string;
      qty: string;
      satuan: string;
    }[]
  >([
    {
      kodeItem: 'OBT-0010',
      namaItem: 'Amlodipine 5 mg Tablet',
      batch: '4567',
      qty: '10',
      satuan: 'Tablet',
    },
  ]);

  // Daftar opname menunggu persetujuan
  const pendingOpnameDocs = useMemo(
    () => documents.filter((doc) => doc.status === 'Menunggu Persetujuan'),
    [documents],
  );

  // Mutasi stok terbentuk otomatis dari dokumen Posted
  const mutationRecords = useMemo<StockMutationRecord[]>(() => {
    return documents
      .filter((doc) => doc.status === 'Posted')
      .flatMap((doc) => {
        const isOutgoing =
          doc.operasi === 'pengeluaran' || doc.operasi === 'pemusnahan';

        return doc.items.map((line) => ({
          id: `mut-${doc.id}-${line.id}`,
          nomorDokumen: doc.nomorDokumen,
          kodeItem: line.kodeItem,
          namaItem: line.namaItem,
          batch: line.batch,
          gudang: doc.gudang,
          jenisLabel: doc.jenisLabel,
          perubahanQty: isOutgoing ? -Math.abs(line.qty) : Math.abs(line.qty),
          satuan: line.satuan,
          waktuPosting: doc.postingWaktu ?? doc.dibuatWaktu,
        }));
      });
  }, [documents]);

  // Pagination Dokumen
  const totalDocs = documents.length;
  const totalPages = Math.max(1, Math.ceil(totalDocs / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedDocs = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return documents.slice(startIdx, startIdx + pageSize);
  }, [documents, safePage, pageSize]);

  const startDocNumber = totalDocs === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endDocNumber = Math.min(safePage * pageSize, totalDocs);

  const activeOperationMeta = useMemo(
    () =>
      OPERATION_CARDS.find((op) => op.key === creatingOperation) ??
      OPERATION_CARDS[0],
    [creatingOperation],
  );

  const handleSelectMainTab = (tab: InventoryMainTabKey) => {
    setActiveMainTab(tab);
    onMainTabChange?.(tab);
  };

  const openOperationModal = (opKey: TransactionOperationKey) => {
    setCreatingOperation(opKey);
    setFormGudang('Depo Farmasi');
    setFormGudangTujuan('Gudang Utama');
    setFormCatatan('');
    setFormLines([
      selectedArea === 'obat'
        ? {
            kodeItem: 'OBT-0010',
            namaItem: 'Amlodipine 5 mg Tablet',
            batch: '4567',
            qty: '10',
            satuan: 'Tablet',
          }
        : {
            kodeItem: 'BMHP-001',
            namaItem: 'Spuit 3 cc Steril',
            batch: 'B2026-01',
            qty: '25',
            satuan: 'Pcs',
          },
    ]);
  };

  const handleAddFormLine = () => {
    setFormLines((prev) => [
      ...prev,
      selectedArea === 'obat'
        ? {
            kodeItem: 'MED-72',
            namaItem: 'Ambroxol 30 mg Tablet',
            batch: '4568',
            qty: '10',
            satuan: 'Tablet',
          }
        : {
            kodeItem: 'ALK-004',
            namaItem: 'Kasa Steril 16x16 cm',
            batch: 'B2026-09',
            qty: '15',
            satuan: 'Box',
          },
    ]);
  };

  const handleRemoveFormLine = (idx: number) => {
    if (formLines.length <= 1) return;
    setFormLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreateTransactionDocument = (publishMode: 'draft' | 'post') => {
    if (!creatingOperation) return;

    const validItems: StockDocumentLine[] = formLines
      .map((row, idx) => {
        const qty = Math.max(0, Number(row.qty) || 0);
        if (!row.namaItem.trim() || qty <= 0) return null;

        return {
          id: `line-${Date.now()}-${idx}`,
          kodeItem: row.kodeItem.trim() || 'ITEM-NEW',
          namaItem: row.namaItem.trim(),
          batch: row.batch.trim() || 'NON-LOT',
          qty,
          satuan: row.satuan.trim() || 'Unit',
        };
      })
      .filter((item): item is StockDocumentLine => item !== null);

    if (validItems.length === 0) return;

    const opMeta =
      OPERATION_CARDS.find((op) => op.key === creatingOperation) ??
      OPERATION_CARDS[0];

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seqSuffix = String(documents.length + 1).padStart(6, '0');
    const hexRef = Math.random().toString(16).slice(2, 10).toUpperCase();
    const nowWIB = getCurrentTimeWIB();

    let status: StockDocumentStatus = 'Draft';
    if (publishMode === 'post') {
      status =
        creatingOperation === 'opname' ? 'Menunggu Persetujuan' : 'Posted';
    }

    const createdDoc: StockTransactionDocument = {
      id: `doc-${Date.now()}`,
      nomorDokumen: `INV-${todayStr}-${seqSuffix}`,
      referensiKode: `${opMeta.refPrefix}-${todayStr}-${hexRef}`,
      actorId: currentActorId,
      area: selectedArea,
      operasi: creatingOperation,
      jenisLabel: opMeta.jenisDokumenLabel,
      gudang: formGudang,
      gudangTujuan:
        creatingOperation === 'transfer' ? formGudangTujuan : undefined,
      jumlahBaris: validItems.length,
      status,
      dibuatWaktu: nowWIB,
      postingWaktu: status === 'Posted' ? `Posting ${nowWIB}` : undefined,
      catatan: formCatatan.trim() || undefined,
      items: validItems,
    };

    setDocuments((prev) => [createdDoc, ...prev]);
    setCurrentPage(1);
    onCreateDocument?.(createdDoc);
    setCreatingOperation(null);
  };

  const handleApproveOpnameDoc = (doc: StockTransactionDocument) => {
    const nowWIB = getCurrentTimeWIB();
    const updated: StockTransactionDocument = {
      ...doc,
      status: 'Posted',
      postingWaktu: `Posting ${nowWIB}`,
    };

    setDocuments((prev) =>
      prev.map((item) => (item.id === doc.id ? updated : item)),
    );
    onApproveOpname?.(updated);
  };

  const handleRejectOpnameDoc = (doc: StockTransactionDocument) => {
    const updated: StockTransactionDocument = {
      ...doc,
      status: 'Ditolak',
    };

    setDocuments((prev) =>
      prev.map((item) => (item.id === doc.id ? updated : item)),
    );
    onRejectOpname?.(updated);
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

  const areaSuffixText =
    selectedArea === 'obat' ? 'obat' : 'alkes & bmhp';

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

      {/* 2. KONTEN UTAMA TRANSAKSI STOK */}
      {activeMainTab === 'transaksi_stok' ? (
        <div className="space-y-3.5">
          {/* KARTU JALUR TRANSAKSI */}
          <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                Jalur Transaksi
              </h1>
              <span className="text-[11px] text-slate-400">
                Pilih area sebelum operasi
              </span>
            </div>

            {/* Area Selector Pills: Obat | Alkes & BMHP */}
            <div className="mt-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedArea('obat')}
                className={`px-3.5 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  selectedArea === 'obat'
                    ? 'bg-[#f0f9fb] border-[#009bb8] text-[#008ba6] font-bold'
                    : 'bg-white border-slate-200 text-slate-600 font-semibold hover:bg-slate-50'
                }`}
              >
                Obat
              </button>

              <button
                type="button"
                onClick={() => setSelectedArea('alkes_bmhp')}
                className={`px-3.5 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  selectedArea === 'alkes_bmhp'
                    ? 'bg-[#f0f9fb] border-[#009bb8] text-[#008ba6] font-bold'
                    : 'bg-white border-slate-200 text-slate-600 font-semibold hover:bg-slate-50'
                }`}
              >
                Alkes &amp; BMHP
              </button>
            </div>

            {/* 7 Kartu Operasi Transaksi */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {OPERATION_CARDS.map(
                ({
                  key,
                  title,
                  descPrefix,
                  borderAccentClass,
                  iconBoxClass,
                  Icon,
                }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => openOperationModal(key)}
                    className={`text-left rounded-xl border border-slate-200/90 ${borderAccentClass} bg-white hover:bg-slate-50/70 hover:border-slate-300/90 px-3.5 py-3.5 flex items-center gap-3 transition-all shadow-[0_1px_2px_rgba(15,23,42,0.02)] cursor-pointer`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBoxClass}`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-[#0f3d56] truncate">
                        {title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {descPrefix} · {areaSuffixText}
                      </p>
                    </div>
                  </button>
                ),
              )}
            </div>
          </section>

          {/* BARIS SUB-TAB: DOKUMEN | PERSETUJUAN OPNAME | MUTASI */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-4 sm:px-5">
            <div
              role="tablist"
              aria-label="Sub-navigasi Dokumen dan Mutasi Stok"
              className="flex items-center gap-6 overflow-x-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeSubTab === 'dokumen'}
                onClick={() => setActiveSubTab('dokumen')}
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
                onClick={() => setActiveSubTab('persetujuan_opname')}
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
                  {pendingOpnameDocs.length}
                </span>
                {activeSubTab === 'persetujuan_opname' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeSubTab === 'mutasi'}
                onClick={() => setActiveSubTab('mutasi')}
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

          {/* KETERANGAN KONVENSI DOKUMEN & MUTASI */}
          <p className="text-xs text-slate-500 px-0.5">
            Draft, opname menunggu persetujuan, dan dokumen yang sudah diposting
            tampil di sini. Dokumen posted membentuk mutasi stok.
          </p>

          {/* KONTEN SUB-TAB: DOKUMEN TRANSAKSI */}
          {activeSubTab === 'dokumen' && (
            <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
              <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                  Dokumen Transaksi
                </h2>

                <button
                  type="button"
                  onClick={() => openOperationModal('penerimaan')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-[#008ba6] transition-colors cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>
                    {selectedArea === 'obat'
                      ? 'Penerimaan obat'
                      : 'Penerimaan alkes & bmhp'}
                  </span>
                </button>
              </div>

              <div className="overflow-x-auto border-t border-slate-200/80">
                <table className="w-full text-left border-collapse min-w-[920px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">DOKUMEN</th>
                      <th className="px-4 py-3.5">JENIS</th>
                      <th className="px-4 py-3.5">GUDANG</th>
                      <th className="px-4 py-3.5">BARIS</th>
                      <th className="px-4 py-3.5">STATUS</th>
                      <th className="px-5 py-3.5">DIBUAT</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {paginatedDocs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 px-5 text-center text-slate-500"
                        >
                          Belum ada dokumen transaksi stok.
                        </td>
                      </tr>
                    ) : (
                      paginatedDocs.map((doc) => (
                        <tr
                          key={doc.id}
                          onClick={() => setInspectingDoc(doc)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          {/* DOKUMEN */}
                          <td className="px-5 py-4 align-middle whitespace-nowrap">
                            <p className="font-bold text-[#0f3d56]">
                              {doc.nomorDokumen}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                              {doc.referensiKode} · {doc.actorId}
                            </p>
                          </td>

                          {/* JENIS */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getJenisBadgeClass(
                                doc.operasi,
                              )}`}
                            >
                              {doc.jenisLabel}
                            </span>
                          </td>

                          {/* GUDANG */}
                          <td className="px-4 py-4 align-middle text-slate-700 font-medium whitespace-nowrap">
                            {doc.gudang}
                          </td>

                          {/* BARIS */}
                          <td className="px-4 py-4 align-middle text-slate-600 tabular-nums whitespace-nowrap">
                            {doc.jumlahBaris} item
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadgeClass(
                                doc.status,
                              )}`}
                            >
                              {doc.status}
                            </span>
                          </td>

                          {/* DIBUAT */}
                          <td className="px-5 py-4 align-middle whitespace-nowrap">
                            <p className="text-slate-700 font-medium">
                              {doc.dibuatWaktu}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {doc.postingWaktu ?? 'Belum diposting'}
                            </p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Pagination */}
              <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    <strong className="font-semibold text-slate-700">
                      {startDocNumber}–{endDocNumber}
                    </strong>{' '}
                    dari{' '}
                    <strong className="font-semibold text-slate-700">
                      {totalDocs}
                    </strong>{' '}
                    Dokumen
                  </span>

                  <div className="flex items-center gap-2">
                    <label htmlFor="per-halaman-dokumen">Per Halaman</label>
                    <div className="relative">
                      <select
                        id="per-halaman-dokumen"
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={safePage <= 1}
                    aria-label="Halaman pertama"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    aria-label="Halaman sebelumnya"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                    (page) => {
                      const isCurrent = page === safePage;
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#f0f9fb] border-[#009bb8] text-[#008ba6]'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={safePage >= totalPages}
                    aria-label="Halaman berikutnya"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safePage >= totalPages}
                    aria-label="Halaman terakhir"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* KONTEN SUB-TAB: PERSETUJUAN OPNAME */}
          {activeSubTab === 'persetujuan_opname' && (
            <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                  Persetujuan Stok Opname
                </h2>
              </div>

              {pendingOpnameDocs.length === 0 ? (
                <div className="py-14 px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#f0f9fb] border border-cyan-100 text-[#008ba6] flex items-center justify-center mx-auto mb-3">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-[#0f3d56]">
                    Tidak ada opname menunggu persetujuan
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Dokumen opname yang diajukan akan muncul di daftar ini untuk
                    disahkan ke mutasi stok.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {pendingOpnameDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="px-5 py-4 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-bold text-[#0f3d56]">
                          {doc.nomorDokumen}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {doc.gudang} · {doc.jumlahBaris} item ·{' '}
                          {doc.dibuatWaktu}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRejectOpnameDoc(doc)}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100/80 font-semibold text-rose-700 cursor-pointer"
                        >
                          Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveOpnameDoc(doc)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] font-semibold text-white cursor-pointer"
                        >
                          Sahkan &amp; Posting
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* KONTEN SUB-TAB: MUTASI STOK */}
          {activeSubTab === 'mutasi' && (
            <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                  Mutasi Stok (Ledger Terposting)
                </h2>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700">
                  {mutationRecords.length} mutasi
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[780px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">ITEM &amp; BATCH</th>
                      <th className="px-4 py-3.5">DOKUMEN SUMBER</th>
                      <th className="px-4 py-3.5">GUDANG</th>
                      <th className="px-4 py-3.5">PERUBAHAN</th>
                      <th className="px-5 py-3.5">WAKTU POSTING</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {mutationRecords.map((mut) => {
                      const isPositive = mut.perubahanQty >= 0;
                      return (
                        <tr key={mut.id} className="hover:bg-slate-50/80">
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-[#0f3d56]">
                              {mut.namaItem}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {mut.kodeItem} · Batch {mut.batch}
                            </p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-slate-700">
                              {mut.nomorDokumen}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {mut.jenisLabel}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">
                            {mut.gudang}
                          </td>
                          <td className="px-4 py-3.5 font-extrabold tabular-nums">
                            <span
                              className={`inline-flex items-center gap-1 ${
                                isPositive
                                  ? 'text-emerald-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {isPositive ? (
                                <ArrowDownToLine className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpFromLine className="w-3.5 h-3.5" />
                              )}
                              {isPositive
                                ? `+${mut.perubahanQty}`
                                : mut.perubahanQty}{' '}
                              {mut.satuan}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">
                            {mut.waktuPosting}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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

      {/* 3. MODAL BUAT DOKUMEN TRANSAKSI STOK */}
      {creatingOperation && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  JALUR TRANSAKSI · AREA {areaSuffixText.toUpperCase()}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  {activeOperationMeta.title} ({activeOperationMeta.descPrefix})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreatingOperation(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {creatingOperation === 'transfer'
                      ? 'Gudang Asal'
                      : 'Gudang Operasi'}
                  </label>
                  <div className="relative">
                    <select
                      value={formGudang}
                      onChange={(e) => setFormGudang(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="Depo Farmasi">Depo Farmasi</option>
                      <option value="Gudang Utama">Gudang Utama</option>
                      <option value="Logistik Alkes">Logistik Alkes</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {creatingOperation === 'transfer' ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Gudang Tujuan
                    </label>
                    <div className="relative">
                      <select
                        value={formGudangTujuan}
                        onChange={(e) => setFormGudangTujuan(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                      >
                        <option value="Gudang Utama">Gudang Utama</option>
                        <option value="Depo Farmasi">Depo Farmasi</option>
                        <option value="Unit UGD">Unit UGD</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Catatan Dokumen (Opsional)
                    </label>
                    <input
                      type="text"
                      value={formCatatan}
                      onChange={(e) => setFormCatatan(e.target.value)}
                      placeholder="Keterangan batch, berita acara, atau referensi..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                    />
                  </div>
                )}
              </div>

              {/* Baris Item Transaksi */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700">
                    Daftar Item ({formLines.length} baris)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddFormLine}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008ba6] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah baris</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-0.5">
                  {formLines.map((row, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-2.5 grid grid-cols-1 sm:grid-cols-[95px_1fr_90px_70px_75px_28px] gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={row.kodeItem}
                        onChange={(e) =>
                          setFormLines((prev) =>
                            prev.map((r, i) =>
                              i === idx
                                ? { ...r, kodeItem: e.target.value }
                                : r,
                            ),
                          )
                        }
                        placeholder="Kode"
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                      />

                      <input
                        type="text"
                        value={row.namaItem}
                        onChange={(e) =>
                          setFormLines((prev) =>
                            prev.map((r, i) =>
                              i === idx
                                ? { ...r, namaItem: e.target.value }
                                : r,
                            ),
                          )
                        }
                        placeholder="Nama item"
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                      />

                      <input
                        type="text"
                        value={row.batch}
                        onChange={(e) =>
                          setFormLines((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, batch: e.target.value } : r,
                            ),
                          )
                        }
                        placeholder="Batch"
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                      />

                      <input
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={(e) =>
                          setFormLines((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, qty: e.target.value } : r,
                            ),
                          )
                        }
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-right font-bold tabular-nums focus:outline-none focus:border-[#009bb8]"
                      />

                      <input
                        type="text"
                        value={row.satuan}
                        onChange={(e) =>
                          setFormLines((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, satuan: e.target.value } : r,
                            ),
                          )
                        }
                        placeholder="Satuan"
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                      />

                      <button
                        type="button"
                        disabled={formLines.length <= 1}
                        onClick={() => handleRemoveFormLine(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer justify-self-end"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreatingOperation(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={() => handleCreateTransactionDocument('draft')}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Simpan Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleCreateTransactionDocument('post')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {creatingOperation === 'opname'
                      ? 'Ajukan Persetujuan'
                      : 'Posting Dokumen'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL DETAIL DOKUMEN TRANSAKSI */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {inspectingDoc.jenisLabel} · {inspectingDoc.gudang}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  {inspectingDoc.nomorDokumen}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingDoc(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Referensi</span>
                  <span className="font-mono font-semibold text-slate-700">
                    {inspectingDoc.referensiKode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Waktu Dibuat</span>
                  <span className="font-medium text-slate-700">
                    {inspectingDoc.dibuatWaktu}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Ledger</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadgeClass(
                      inspectingDoc.status,
                    )}`}
                  >
                    {inspectingDoc.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Rincian Baris Item ({inspectingDoc.items.length})
                </h4>
                <div className="space-y-2">
                  {inspectingDoc.items.map((line) => (
                    <div
                      key={line.id}
                      className="rounded-xl border border-slate-200/80 p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-[#0f3d56]">
                          {line.namaItem}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {line.kodeItem} · Batch {line.batch}
                        </p>
                      </div>
                      <span className="font-extrabold text-[#008ba6] tabular-nums">
                        {line.qty} {line.satuan}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {inspectingDoc.status === 'Draft' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const nowWIB = getCurrentTimeWIB();
                      const posted: StockTransactionDocument = {
                        ...inspectingDoc,
                        status:
                          inspectingDoc.operasi === 'opname'
                            ? 'Menunggu Persetujuan'
                            : 'Posted',
                        postingWaktu:
                          inspectingDoc.operasi === 'opname'
                            ? undefined
                            : `Posting ${nowWIB}`,
                      };
                      setDocuments((prev) =>
                        prev.map((d) => (d.id === posted.id ? posted : d)),
                      );
                      setInspectingDoc(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Posting Sekarang</span>
                  </button>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={() => setInspectingDoc(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}