'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';

export type SupplierReturnStatus =
  | 'draft'
  | 'menunggu_persetujuan'
  | 'disetujui'
  | 'ditolak';

export interface SupplierReturnItemDetail {
  id: string;
  namaProduk: string;
  nomorBatch: string;
  qtyRetur: number;
  satuan: string;
  alasan: string;
}

export interface SupplierReturnItem {
  id: string;
  nomorRetur: string;
  nomorPenerimaan: string;
  pemasok: string;
  gudang: string;
  tanggalLabel: string;
  jumlahItem: number;
  status: SupplierReturnStatus;
  catatan?: string;
  items: SupplierReturnItemDetail[];
}

const RETURN_STATUS_META: Record<
  SupplierReturnStatus,
  { label: string; pillClass: string }
> = {
  draft: {
    label: 'Draft',
    pillClass: 'bg-slate-100 border border-slate-200/80 text-slate-600',
  },
  menunggu_persetujuan: {
    label: 'Menunggu Persetujuan',
    pillClass: 'bg-amber-50 border border-amber-200/80 text-amber-700',
  },
  disetujui: {
    label: 'Disetujui',
    pillClass: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
  },
  ditolak: {
    label: 'Ditolak',
    pillClass: 'bg-rose-50 border border-rose-200/80 text-rose-600',
  },
};

function formatDateIndoShort(date: Date): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agt',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  const d = String(date.getDate()).padStart(2, '0');
  const m = months[date.getMonth()] ?? 'Nov';
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export default function ReturPemasok({
  initialReturns = [],
  onReload,
  onCreateReturn,
  onApproveReturn,
  onRejectReturn,
}: {
  initialReturns?: SupplierReturnItem[];
  onReload?: () => Promise<void> | void;
  onCreateReturn?: (item: SupplierReturnItem) => void;
  onApproveReturn?: (item: SupplierReturnItem) => void;
  onRejectReturn?: (item: SupplierReturnItem) => void;
}) {
  const [returns, setReturns] = useState<SupplierReturnItem[]>(initialReturns);
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReloading, setIsReloading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State Form Buat Retur Pemasok
  const [nomorPenerimaan, setNomorPenerimaan] = useState(
    'GR-20261029-10CCA3A6',
  );
  const [pemasok, setPemasok] = useState('PT. Alkesindo Farma Tara');
  const [gudang, setGudang] = useState('Depo Farmasi');
  const [namaProduk, setNamaProduk] = useState('');
  const [nomorBatch, setNomorBatch] = useState('BCH-AMB-2610');
  const [qtyRetur, setQtyRetur] = useState<number>(5);
  const [satuan, setSatuan] = useState('Tablet');
  const [alasan, setAlasan] = useState('Kemasan penyok saat pengiriman');
  const [catatan, setCatatan] = useState('');

  const filteredReturns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return returns;
    return returns.filter((item) => {
      return (
        item.nomorRetur.toLowerCase().includes(q) ||
        item.nomorPenerimaan.toLowerCase().includes(q) ||
        item.pemasok.toLowerCase().includes(q) ||
        item.gudang.toLowerCase().includes(q)
      );
    });
  }, [returns, searchQuery]);

  const selectedReturn = useMemo(() => {
    if (!selectedReturnId) return null;
    return returns.find((r) => r.id === selectedReturnId) ?? null;
  }, [returns, selectedReturnId]);

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await onReload?.();
    } finally {
      setTimeout(() => setIsReloading(false), 350);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProduk.trim() || !nomorPenerimaan.trim()) return;

    const now = new Date();
    const suffix = Math.random().toString(16).substring(2, 10).toUpperCase();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const retNumber = `RET-${y}${m}${d}-${suffix}`;

    const created: SupplierReturnItem = {
      id: `ret-${Date.now()}`,
      nomorRetur: retNumber,
      nomorPenerimaan: nomorPenerimaan.trim(),
      pemasok: pemasok.trim() || 'Pemasok Umum',
      gudang: gudang.trim() || 'Depo Farmasi',
      tanggalLabel: formatDateIndoShort(now),
      jumlahItem: 1,
      status: 'menunggu_persetujuan',
      catatan: catatan.trim() || undefined,
      items: [
        {
          id: `ritm-${Date.now()}`,
          namaProduk: namaProduk.trim(),
          nomorBatch: nomorBatch.trim() || '-',
          qtyRetur: Math.max(1, Number(qtyRetur) || 1),
          satuan: satuan.trim() || 'Unit',
          alasan: alasan.trim() || 'Retur barang ke pemasok',
        },
      ],
    };

    setReturns((prev) => [created, ...prev]);
    setSelectedReturnId(created.id);
    onCreateReturn?.(created);

    setNamaProduk('');
    setCatatan('');
    setIsCreateModalOpen(false);
  };

  const handleApproveClick = () => {
    if (!selectedReturn) return;
    const updated: SupplierReturnItem = {
      ...selectedReturn,
      status: 'disetujui',
    };
    setReturns((prev) =>
      prev.map((item) => (item.id === selectedReturn.id ? updated : item)),
    );
    onApproveReturn?.(updated);
  };

  const handleRejectClick = () => {
    if (!selectedReturn) return;
    const updated: SupplierReturnItem = {
      ...selectedReturn,
      status: 'ditolak',
    };
    setReturns((prev) =>
      prev.map((item) => (item.id === selectedReturn.id ? updated : item)),
    );
    onRejectReturn?.(updated);
  };

  const selectedStatusMeta = selectedReturn
    ? RETURN_STATUS_META[selectedReturn.status]
    : null;

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* ===================================================================
            1. HEADER HALAMAN: EYEBROW, JUDUL, SUBJUDUL & TOMBOL KANAN ATAS
           =================================================================== */}
        <div className="px-6 pt-5 pb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              JEJAK OPERASIONAL &middot; PENGEMBALIAN KE PEMASOK
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5">
              Retur pemasok
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Retur hanya dari penerimaan yang sudah diposting; persetujuan
              membukukan pergerakan stok negatif tersendiri.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => void handleReload()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-slate-500 ${
                  isReloading ? 'animate-spin text-[#008ba6]' : ''
                }`}
              />
              <span>Muat Ulang</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat retur</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            2. BARIS PENCARIAN & COUNTER REKAM
           =================================================================== */}
        <div className="px-6 pb-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor, pemasok, gudang..."
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian retur"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-xs text-slate-400 tabular-nums shrink-0">
            {filteredReturns.length} rekam
          </span>
        </div>

        {/* ===================================================================
            3. SPLIT LAYOUT: RUANG KERJA RETUR KIRI & PANEL TINJAUAN KANAN
           =================================================================== */}
        <div className="border-t border-slate-200/80 grid grid-cols-1 xl:grid-cols-[1fr_300px] min-h-[450px]">
          {/* KOLOM KIRI: HEADER TABEL & EMPTY STATE / LIST REKAM */}
          <div className="flex flex-col border-b xl:border-b-0 xl:border-r border-slate-200/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="pl-6 pr-3 py-3">RETUR</th>
                    <th className="px-3 py-3">PENERIMAAN</th>
                    <th className="px-3 py-3">PEMASOK</th>
                    <th className="px-3 py-3">GUDANG</th>
                    <th className="pl-3 pr-6 py-3">STATUS</th>
                  </tr>
                </thead>

                {filteredReturns.length > 0 && (
                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {filteredReturns.map((item) => {
                      const isSelected = selectedReturn?.id === item.id;
                      const statusMeta = RETURN_STATUS_META[item.status];

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedReturnId(item.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#edf7fc]/85'
                              : 'bg-white hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="pl-6 pr-3 py-4 align-middle whitespace-nowrap">
                            <p className="font-mono font-bold text-[#0f3d56]">
                              {item.nomorRetur}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                              {item.tanggalLabel} &middot; {item.jumlahItem}{' '}
                              item
                            </p>
                          </td>

                          <td className="px-3 py-4 align-middle font-mono text-xs font-semibold text-[#0f3d56] whitespace-nowrap">
                            {item.nomorPenerimaan}
                          </td>

                          <td className="px-3 py-4 align-middle font-semibold text-[#0f3d56] whitespace-nowrap">
                            {item.pemasok}
                          </td>

                          <td className="px-3 py-4 align-middle text-[#0f3d56] font-medium whitespace-nowrap">
                            {item.gudang}
                          </td>

                          <td className="pl-3 pr-6 py-4 align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusMeta.pillClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>

            {/* Empty State "Belum ada rekam di sini" saat data kosong */}
            {filteredReturns.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center mb-3">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <p className="text-xs font-extrabold text-[#0f3d56]">
                  Belum ada rekam di sini
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Rekam yang tersimpan akan tampil di ruang kerja ini.
                </p>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mulai rekam</span>
                </button>
              </div>
            )}
          </div>

          {/* KOLOM KANAN: PILIH REKAM UNTUK DITINJAU / DETAIL RETUR TERPILIH */}
          <aside className="bg-white p-5 flex flex-col text-xs">
            {selectedReturn && selectedStatusMeta ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      REKAM RETUR TERPILIH
                    </p>
                    <h2 className="text-sm font-extrabold font-mono text-[#0f3d56] mt-1">
                      {selectedReturn.nomorRetur}
                    </h2>
                    <div className="mt-1.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${selectedStatusMeta.pillClass}`}
                      >
                        {selectedStatusMeta.label}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReturnId(null)}
                    aria-label="Tutup detail retur"
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Penerimaan</span>
                    <span className="font-mono font-bold text-[#0f3d56]">
                      {selectedReturn.nomorPenerimaan}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Pemasok</span>
                    <span className="font-bold text-[#0f3d56] text-right">
                      {selectedReturn.pemasok}
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-400">Gudang</span>
                    <span className="font-bold text-[#0f3d56] text-right">
                      {selectedReturn.gudang}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedReturn.items.map((itm) => (
                    <div
                      key={itm.id}
                      className="rounded-xl border border-[#b8e6ef] bg-[#edf7fc]/65 p-3 space-y-1"
                    >
                      <p className="font-bold text-[#0f3d56]">
                        {itm.namaProduk}
                      </p>
                      <p className="text-[11px] text-slate-600 tabular-nums">
                        Retur {itm.qtyRetur} {itm.satuan} &middot; Batch{' '}
                        <span className="font-mono">{itm.nomorBatch}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Alasan: {itm.alasan}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedReturn.catatan && (
                  <p className="text-[11px] text-slate-500">
                    {selectedReturn.catatan}
                  </p>
                )}

                {selectedReturn.status === 'menunggu_persetujuan' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleApproveClick}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white text-[11px] font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Setujui</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectClick}
                      className="py-2 px-3 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-[11px] font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-2.5" />
                <h2 className="text-xs font-extrabold text-[#0f3d56]">
                  Pilih rekam untuk ditinjau
                </h2>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Status, hubungan ke stok/pemasok, dan tindakan yang sesuai
                  kewenangan akan tampil di sini.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* =====================================================================
          4. MODAL BUAT RETUR PEMASOK
         ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  RETUR PEMASOK BARU
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  Catat Pengembalian Barang ke Pemasok
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Nomor Penerimaan (Diposting)
                  </label>
                  <input
                    type="text"
                    required
                    value={nomorPenerimaan}
                    onChange={(e) => setNomorPenerimaan(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Pemasok
                  </label>
                  <input
                    type="text"
                    required
                    value={pemasok}
                    onChange={(e) => setPemasok(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Gudang
                  </label>
                  <input
                    type="text"
                    required
                    value={gudang}
                    onChange={(e) => setGudang(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={namaProduk}
                    onChange={(e) => setNamaProduk(e.target.value)}
                    placeholder="Contoh: Ambroxol 30 mg Tablet"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    No. Batch
                  </label>
                  <input
                    type="text"
                    value={nomorBatch}
                    onChange={(e) => setNomorBatch(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Qty Retur
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={qtyRetur}
                    onChange={(e) => setQtyRetur(Number(e.target.value) || 1)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f3d56] mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    required
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0f3d56] mb-1">
                  Alasan Retur
                </label>
                <input
                  type="text"
                  required
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f3d56] mb-1">
                  Catatan Tambahan (opsional)
                </label>
                <textarea
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                >
                  Simpan Retur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}