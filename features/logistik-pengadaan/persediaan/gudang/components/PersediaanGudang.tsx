'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ArrowLeftRight,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  ClipboardList,
  Landmark,
  Pencil,
  RotateCcw,
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

export type WarehouseTypeKey =
  | 'pharmacy'
  | 'main_warehouse'
  | 'unit_depot'
  | 'general_store';

export interface InventoryWarehouseItem {
  id: string;
  kodeGudang: string;
  namaGudang: string;
  tipe: WarehouseTypeKey | string;
  lokasi: string;
  status: 'aktif' | 'nonaktif';
  catatan?: string;
}

const DEFAULT_WAREHOUSES: InventoryWarehouseItem[] = [
  {
    id: 'wh-1',
    kodeGudang: 'GDF',
    namaGudang: 'Depo Farmasi',
    tipe: 'pharmacy',
    lokasi: 'Klinik',
    status: 'aktif',
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

export default function GudangInventaris({
  initialWarehouses = DEFAULT_WAREHOUSES,
  onMainTabChange,
  onUpdateWarehouse,
  onToggleArchiveWarehouse,
  onDeletePermanentWarehouse,
}: {
  initialWarehouses?: InventoryWarehouseItem[];
  onMainTabChange?: (tab: InventoryMainTabKey) => void;
  onUpdateWarehouse?: (warehouse: InventoryWarehouseItem) => void;
  onToggleArchiveWarehouse?: (warehouse: InventoryWarehouseItem) => void;
  onDeletePermanentWarehouse?: (warehouse: InventoryWarehouseItem) => void;
}) {
  const [activeMainTab, setActiveMainTab] =
    useState<InventoryMainTabKey>('gudang');

  const [warehouses, setWarehouses] =
    useState<InventoryWarehouseItem[]>(initialWarehouses);
  const [showInactive, setShowInactive] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State Modal Edit Gudang
  const [editingWarehouse, setEditingWarehouse] =
    useState<InventoryWarehouseItem | null>(null);
  const [formKodeGudang, setFormKodeGudang] = useState('');
  const [formNamaGudang, setFormNamaGudang] = useState('');
  const [formTipe, setFormTipe] = useState('pharmacy');
  const [formLokasi, setFormLokasi] = useState('');
  const [formCatatan, setFormCatatan] = useState('');

  // State Modal Konfirmasi Hapus Permanen
  const [deletingWarehouse, setDeletingWarehouse] =
    useState<InventoryWarehouseItem | null>(null);

  // Filter gudang berdasarkan status aktif / nonaktif
  const filteredWarehouses = useMemo(() => {
    if (showInactive) return warehouses;
    return warehouses.filter((wh) => wh.status === 'aktif');
  }, [warehouses, showInactive]);

  // Pagination
  const totalItems = filteredWarehouses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedWarehouses = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredWarehouses.slice(startIdx, startIdx + pageSize);
  }, [filteredWarehouses, safePage, pageSize]);

  const startItemNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItemNumber = Math.min(safePage * pageSize, totalItems);

  const handleSelectMainTab = (tab: InventoryMainTabKey) => {
    setActiveMainTab(tab);
    onMainTabChange?.(tab);
  };

  const openEditModal = (wh: InventoryWarehouseItem) => {
    setEditingWarehouse(wh);
    setFormKodeGudang(wh.kodeGudang);
    setFormNamaGudang(wh.namaGudang);
    setFormTipe(wh.tipe);
    setFormLokasi(wh.lokasi);
    setFormCatatan(wh.catatan ?? '');
  };

  const handleSaveEditWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWarehouse || !formNamaGudang.trim()) return;

    const updated: InventoryWarehouseItem = {
      ...editingWarehouse,
      kodeGudang: formKodeGudang.trim() || editingWarehouse.kodeGudang,
      namaGudang: formNamaGudang.trim(),
      tipe: formTipe.trim() || editingWarehouse.tipe,
      lokasi: formLokasi.trim() || editingWarehouse.lokasi,
      catatan: formCatatan.trim() || undefined,
    };

    setWarehouses((prev) =>
      prev.map((item) => (item.id === editingWarehouse.id ? updated : item)),
    );
    onUpdateWarehouse?.(updated);
    setEditingWarehouse(null);
  };

  const handleToggleArchive = (wh: InventoryWarehouseItem) => {
    const updated: InventoryWarehouseItem = {
      ...wh,
      status: wh.status === 'aktif' ? 'nonaktif' : 'aktif',
    };

    setWarehouses((prev) =>
      prev.map((item) => (item.id === wh.id ? updated : item)),
    );
    onToggleArchiveWarehouse?.(updated);
  };

  const handleConfirmDeletePermanent = () => {
    if (!deletingWarehouse) return;
    setWarehouses((prev) =>
      prev.filter((item) => item.id !== deletingWarehouse.id),
    );
    onDeletePermanentWarehouse?.(deletingWarehouse);
    setDeletingWarehouse(null);
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

      {/* 2. KONTEN UTAMA OPERATIONAL MASTER · GUDANG */}
      {activeMainTab === 'gudang' ? (
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Header Kartu */}
          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              OPERATIONAL MASTER
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5 leading-snug">
              Gudang
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Nonaktifkan dengan aman agar referensi dokumen dan ledger tetap
              utuh.
            </p>
          </div>

          {/* Baris Filter Checkbox + Pill Jumlah Gudang */}
          <div className="px-5 py-3.5 border-t border-slate-200/80 flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => {
                  setShowInactive(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded border-slate-300 text-[#009bb8] focus:ring-[#009bb8]/25 cursor-pointer"
              />
              <span>Tampilkan Nonaktif</span>
            </label>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700">
              {filteredWarehouses.length} gudang
            </span>
          </div>

          {/* Tabel Daftar Gudang */}
          <div className="overflow-x-auto border-t border-slate-200/80">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">GUDANG</th>
                  <th className="px-4 py-3.5">TIPE</th>
                  <th className="px-4 py-3.5">LOKASI</th>
                  <th className="px-4 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5">AKSI</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 text-xs">
                {paginatedWarehouses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 px-5 text-center text-slate-500"
                    >
                      Tidak ada gudang aktif yang ditampilkan. Centang{' '}
                      <strong className="text-slate-700">
                        Tampilkan Nonaktif
                      </strong>{' '}
                      untuk melihat gudang yang diarsipkan.
                    </td>
                  </tr>
                ) : (
                  paginatedWarehouses.map((wh) => (
                    <tr
                      key={wh.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* GUDANG */}
                      <td className="px-5 py-4 align-middle whitespace-nowrap">
                        <p className="font-bold text-[#0f3d56]">
                          {wh.namaGudang}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 uppercase">
                          {wh.kodeGudang}
                        </p>
                      </td>

                      {/* TIPE */}
                      <td className="px-4 py-4 align-middle text-slate-600 font-medium whitespace-nowrap">
                        {wh.tipe}
                      </td>

                      {/* LOKASI */}
                      <td className="px-4 py-4 align-middle text-slate-600 font-medium whitespace-nowrap">
                        {wh.lokasi}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        {wh.status === 'aktif' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                            Nonaktif
                          </span>
                        )}
                      </td>

                      {/* AKSI */}
                      <td className="px-5 py-4 align-middle whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(wh)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#008ba6] transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleArchive(wh)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#008ba6] transition-colors cursor-pointer"
                          >
                            {wh.status === 'aktif' ? (
                              <>
                                <Archive className="w-3.5 h-3.5" />
                                <span>Arsipkan</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Aktifkan</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingWarehouse(wh)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200/80 bg-white hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Permanen</span>
                          </button>
                        </div>
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
                  {startItemNumber}–{endItemNumber}
                </strong>{' '}
                dari{' '}
                <strong className="font-semibold text-slate-700">
                  {totalItems}
                </strong>{' '}
                Gudang
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="per-halaman-gudang">Per Halaman</label>
                <div className="relative">
                  <select
                    id="per-halaman-gudang"
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

      {/* 3. MODAL EDIT IDENTITAS GUDANG */}
      {editingWarehouse && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  OPERATIONAL MASTER · GUDANG
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Identitas Gudang
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingWarehouse(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveEditWarehouse}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Gudang
                  </label>
                  <input
                    type="text"
                    required
                    value={formKodeGudang}
                    onChange={(e) => setFormKodeGudang(e.target.value)}
                    placeholder="GDF"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tipe Gudang
                  </label>
                  <div className="relative">
                    <select
                      value={formTipe}
                      onChange={(e) => setFormTipe(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="pharmacy">pharmacy</option>
                      <option value="main_warehouse">main_warehouse</option>
                      <option value="unit_depot">unit_depot</option>
                      <option value="general_store">general_store</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Gudang
                  </label>
                  <input
                    type="text"
                    required
                    value={formNamaGudang}
                    onChange={(e) => setFormNamaGudang(e.target.value)}
                    placeholder="Depo Farmasi"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lokasi Fasilitas
                  </label>
                  <input
                    type="text"
                    required
                    value={formLokasi}
                    onChange={(e) => setFormLokasi(e.target.value)}
                    placeholder="Klinik"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Operasional (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Keterangan penanggung jawab atau fungsi penyimpanan..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingWarehouse(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL KONFIRMASI HAPUS PERMANEN GUDANG */}
      {deletingWarehouse && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-5">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <h3 className="text-base font-extrabold text-[#0f3d56]">
                Hapus Permanen Gudang?
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Anda akan menghapus permanen{' '}
                <strong className="text-slate-700">
                  {deletingWarehouse.namaGudang} (
                  {deletingWarehouse.kodeGudang})
                </strong>
                . Pastikan gudang ini belum memiliki riwayat transaksi maupun
                saldo lot; gunakan <strong>Arsipkan</strong> agar referensi
                dokumen dan ledger tetap utuh.
              </p>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingWarehouse(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeletePermanent}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Ya, Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}