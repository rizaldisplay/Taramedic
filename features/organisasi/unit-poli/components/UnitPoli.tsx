'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eraser,
  MoreVertical,
  Pencil,
  Plus,
  Power,
  Save,
  Search,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';

export type ReferensiMasterTabKey =
  | 'unit_poli'
  | 'pengaturan_unit'
  | 'master_penjamin';

export type UnitJenisKey = 'poli' | 'penunjang' | 'unit';
export type ReferenceStatusKey = 'aktif' | 'nonaktif';
export type AppointmentModeKey = 'walk_in' | 'scheduled_slot' | 'hybrid';

export interface UnitPoliItem {
  id: string;
  kode: string;
  nama: string;
  jenis: UnitJenisKey;
  deskripsi?: string;
  status: ReferenceStatusKey;
  modeAppointment: AppointmentModeKey;
  kuotaHarian: number;
  petugasDitugaskan: string[];
}

export interface MasterPenjaminItem {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  tariffType: string;
  status: ReferenceStatusKey;
}

const DEFAULT_UNIT_POLI: UnitPoliItem[] = [
  {
    id: 'up-1',
    kode: 'FARMASI',
    nama: 'Farmasi',
    jenis: 'penunjang',
    status: 'aktif',
    modeAppointment: 'walk_in',
    kuotaHarian: 120,
    petugasDitugaskan: ['apt. Rina Wulandari, S.Farm'],
  },
  {
    id: 'up-2',
    kode: 'UP-000002',
    nama: 'Laboratorium',
    jenis: 'penunjang',
    status: 'aktif',
    modeAppointment: 'walk_in',
    kuotaHarian: 80,
    petugasDitugaskan: ['Bagus Santoso, A.Md.AK'],
  },
  {
    id: 'up-3',
    kode: 'POLI-ANAK',
    nama: 'Poli Anak',
    jenis: 'poli',
    deskripsi: 'Poli Anak',
    status: 'nonaktif',
    modeAppointment: 'hybrid',
    kuotaHarian: 40,
    petugasDitugaskan: ['dr. Nadia Kusuma, Sp.A'],
  },
  {
    id: 'up-4',
    kode: 'POLI-GIGI',
    nama: 'Poli Gigi',
    jenis: 'poli',
    status: 'nonaktif',
    modeAppointment: 'scheduled_slot',
    kuotaHarian: 25,
    petugasDitugaskan: ['drg. Hendra Wijaya'],
  },
  {
    id: 'up-5',
    kode: 'POLI-UMUM',
    nama: 'Poli Umum',
    jenis: 'poli',
    status: 'aktif',
    modeAppointment: 'hybrid',
    kuotaHarian: 100,
    petugasDitugaskan: ['dr. Dimas Pratama', 'Ns. Siti Aminah, S.Kep'],
  },
  {
    id: 'up-6',
    kode: 'POLI-KIA',
    nama: 'Poli KIA',
    jenis: 'poli',
    deskripsi: 'Kesehatan Ibu dan Anak',
    status: 'aktif',
    modeAppointment: 'hybrid',
    kuotaHarian: 35,
    petugasDitugaskan: ['Bdn. Ratna Dewi, S.Keb'],
  },
  {
    id: 'up-7',
    kode: 'UGD',
    nama: 'Unit Gawat Darurat',
    jenis: 'unit',
    deskripsi: 'Layanan gawat darurat 24 jam',
    status: 'aktif',
    modeAppointment: 'walk_in',
    kuotaHarian: 200,
    petugasDitugaskan: ['dr. Fajar Nugroho'],
  },
];

const DEFAULT_MASTER_PENJAMIN: MasterPenjaminItem[] = [
  {
    id: 'mp-1',
    kode: 'ASURANSI_INTERNAL',
    nama: 'Asuransi · tarif internal klinik',
    deskripsi: 'Bukan nilai klaim atau tarif resmi penjamin.',
    tariffType: 'asuransi',
    status: 'aktif',
  },
  {
    id: 'mp-2',
    kode: 'BPJS_INTERNAL',
    nama: 'BPJS · tarif internal klinik',
    deskripsi: 'Bukan nilai klaim atau tarif resmi penjamin.',
    tariffType: 'bpjs_internal',
    status: 'aktif',
  },
  {
    id: 'mp-3',
    kode: 'UMUM',
    nama: 'Umum',
    deskripsi: 'Tarif internal klinik untuk pasien Umum.',
    tariffType: 'umum',
    status: 'aktif',
  },
];

function slugifyTariffType(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export default function MasterUnitDanPenjamin({
  initialUnits = DEFAULT_UNIT_POLI,
  initialPenjamins = DEFAULT_MASTER_PENJAMIN,
  onAddUnitPoli,
  onUpdateUnitPoli,
  onDeleteUnitPoli,
  onSaveUnitSetting,
  onAddPenjamin,
  onUpdatePenjamin,
  onDeletePenjamin,
}: {
  initialUnits?: UnitPoliItem[];
  initialPenjamins?: MasterPenjaminItem[];
  onAddUnitPoli?: (unit: UnitPoliItem) => void;
  onUpdateUnitPoli?: (unit: UnitPoliItem) => void;
  onDeleteUnitPoli?: (id: string) => void;
  onSaveUnitSetting?: (unit: UnitPoliItem) => void;
  onAddPenjamin?: (penjamin: MasterPenjaminItem) => void;
  onUpdatePenjamin?: (penjamin: MasterPenjaminItem) => void;
  onDeletePenjamin?: (id: string) => void;
}) {
  const [activeTab, setActiveTab] =
    useState<ReferensiMasterTabKey>('unit_poli');

  // State Data Master
  const [units, setUnits] = useState<UnitPoliItem[]>(initialUnits);
  const [penjamins, setPenjamins] =
    useState<MasterPenjaminItem[]>(initialPenjamins);

  // Filter & Pagination: Unit & Poli
  const [unitSearch, setUnitSearch] = useState('');
  const [unitJenisFilter, setUnitJenisFilter] = useState<'ALL' | UnitJenisKey>(
    'ALL',
  );
  const [unitStatusFilter, setUnitStatusFilter] = useState<
    'ALL' | ReferenceStatusKey
  >('ALL');
  const [unitPageSize, setUnitPageSize] = useState<number>(5);
  const [unitCurrentPage, setUnitCurrentPage] = useState<number>(1);
  const [openUnitMenuId, setOpenUnitMenuId] = useState<string | null>(null);

  // Filter & Pagination: Master Penjamin
  const [penjaminSearch, setPenjaminSearch] = useState('');
  const [penjaminStatusFilter, setPenjaminStatusFilter] = useState<
    'ALL' | ReferenceStatusKey
  >('ALL');
  const [penjaminPageSize, setPenjaminPageSize] = useState<number>(5);
  const [penjaminCurrentPage, setPenjaminCurrentPage] = useState<number>(1);
  const [openPenjaminMenuId, setOpenPenjaminMenuId] = useState<string | null>(
    null,
  );

  // Sidebar Form "Tambah Referensi"
  const [formCategory, setFormCategory] = useState<
    'unit_poli' | 'master_penjamin'
  >('unit_poli');
  const [formUnitJenis, setFormUnitJenis] = useState<'' | UnitJenisKey>('');
  const [formKode, setFormKode] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  // Tab 2: Pengaturan Unit
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [newAssigneeName, setNewAssigneeName] = useState('');
  const [unitSettingSaved, setUnitSettingSaved] = useState(false);

  // Modal Edit Referensi
  const [editingUnit, setEditingUnit] = useState<UnitPoliItem | null>(null);
  const [editingPenjamin, setEditingPenjamin] =
    useState<MasterPenjaminItem | null>(null);

  // Sinkronisasi tab utama dengan kategori sidebar form
  const handleSwitchMainTab = (tab: ReferensiMasterTabKey) => {
    setActiveTab(tab);
    setOpenUnitMenuId(null);
    setOpenPenjaminMenuId(null);

    if (tab === 'unit_poli') {
      setFormCategory('unit_poli');
    } else if (tab === 'master_penjamin') {
      setFormCategory('master_penjamin');
    }
  };

  // Filtered Unit & Poli
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (unitJenisFilter !== 'ALL' && u.jenis !== unitJenisFilter) {
        return false;
      }
      if (unitStatusFilter !== 'ALL' && u.status !== unitStatusFilter) {
        return false;
      }
      if (unitSearch.trim() !== '') {
        const q = unitSearch.toLowerCase();
        const match =
          u.kode.toLowerCase().includes(q) ||
          u.nama.toLowerCase().includes(q) ||
          (u.deskripsi ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [units, unitJenisFilter, unitStatusFilter, unitSearch]);

  const activeUnitsCount = useMemo(
    () => units.filter((u) => u.status === 'aktif').length,
    [units],
  );

  const unitTotalPages = Math.max(
    1,
    Math.ceil(filteredUnits.length / unitPageSize),
  );
  const safeUnitPage = Math.min(unitCurrentPage, unitTotalPages);
  const paginatedUnits = useMemo(() => {
    const startIdx = (safeUnitPage - 1) * unitPageSize;
    return filteredUnits.slice(startIdx, startIdx + unitPageSize);
  }, [filteredUnits, safeUnitPage, unitPageSize]);

  const unitStartNumber =
    filteredUnits.length === 0 ? 0 : (safeUnitPage - 1) * unitPageSize + 1;
  const unitEndNumber = Math.min(
    safeUnitPage * unitPageSize,
    filteredUnits.length,
  );

  // Filtered Master Penjamin
  const filteredPenjamins = useMemo(() => {
    return penjamins.filter((p) => {
      if (penjaminStatusFilter !== 'ALL' && p.status !== penjaminStatusFilter) {
        return false;
      }
      if (penjaminSearch.trim() !== '') {
        const q = penjaminSearch.toLowerCase();
        const match =
          p.kode.toLowerCase().includes(q) ||
          p.nama.toLowerCase().includes(q) ||
          p.deskripsi.toLowerCase().includes(q) ||
          p.tariffType.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [penjamins, penjaminStatusFilter, penjaminSearch]);

  const activePenjaminsCount = useMemo(
    () => penjamins.filter((p) => p.status === 'aktif').length,
    [penjamins],
  );

  const penjaminTotalPages = Math.max(
    1,
    Math.ceil(filteredPenjamins.length / penjaminPageSize),
  );
  const safePenjaminPage = Math.min(penjaminCurrentPage, penjaminTotalPages);
  const paginatedPenjamins = useMemo(() => {
    const startIdx = (safePenjaminPage - 1) * penjaminPageSize;
    return filteredPenjamins.slice(startIdx, startIdx + penjaminPageSize);
  }, [filteredPenjamins, safePenjaminPage, penjaminPageSize]);

  const penjaminStartNumber =
    filteredPenjamins.length === 0
      ? 0
      : (safePenjaminPage - 1) * penjaminPageSize + 1;
  const penjaminEndNumber = Math.min(
    safePenjaminPage * penjaminPageSize,
    filteredPenjamins.length,
  );

  const selectedUnitForSetting = useMemo(
    () => units.find((u) => u.id === selectedUnitId) ?? null,
    [units, selectedUnitId],
  );

  const isSidebarFormValid =
    formCategory === 'unit_poli'
      ? formUnitJenis !== '' && formNama.trim() !== ''
      : formKode.trim() !== '' && formNama.trim() !== '';

  const handleClearSidebarForm = () => {
    setFormUnitJenis('');
    setFormKode('');
    setFormNama('');
    setFormDeskripsi('');
  };

  const handleSubmitSidebarForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSidebarFormValid) return;

    if (formCategory === 'unit_poli' && formUnitJenis !== '') {
      const nextSeq = String(units.length + 1).padStart(6, '0');
      const generatedCode =
        formUnitJenis === 'poli'
          ? `POLI-${formNama
              .trim()
              .replace(/^poli\s+/i, '')
              .toUpperCase()
              .replace(/\s+/g, '-')}`
          : `UP-${nextSeq}`;

      const createdUnit: UnitPoliItem = {
        id: `up-${Date.now()}`,
        kode: generatedCode,
        nama: formNama.trim(),
        jenis: formUnitJenis,
        deskripsi: formDeskripsi.trim() || undefined,
        status: 'aktif',
        modeAppointment: formUnitJenis === 'poli' ? 'hybrid' : 'walk_in',
        kuotaHarian: 60,
        petugasDitugaskan: [],
      };

      setUnits((prev) => [...prev, createdUnit]);
      onAddUnitPoli?.(createdUnit);
      handleClearSidebarForm();
      setActiveTab('unit_poli');
    } else if (formCategory === 'master_penjamin') {
      const normalizedCode = formKode
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '_');

      const createdPenjamin: MasterPenjaminItem = {
        id: `mp-${Date.now()}`,
        kode: normalizedCode,
        nama: formNama.trim(),
        deskripsi:
          formDeskripsi.trim() ||
          `Tarif internal klinik untuk kategori ${formNama.trim()}.`,
        tariffType: slugifyTariffType(normalizedCode) || 'umum',
        status: 'aktif',
      };

      setPenjamins((prev) => [...prev, createdPenjamin]);
      onAddPenjamin?.(createdPenjamin);
      handleClearSidebarForm();
      setActiveTab('master_penjamin');
    }
  };

  // CSV Template & Ekspor / Impor Unit & Poli
  const handleDownloadCsv = (onlyTemplate: boolean) => {
    const header = 'kode,nama,jenis,deskripsi,status';
    const rows = onlyTemplate
      ? ['POLI-JANTUNG,Poli Jantung,poli,Layanan spesialis jantung,aktif']
      : units.map(
          (u) =>
            `${u.kode},"${u.nama.replace(/"/g, '""')}",${u.jenis},"${(
              u.deskripsi ?? ''
            ).replace(/"/g, '""')}",${u.status}`,
        );

    const blob = new Blob([[header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = onlyTemplate
      ? 'template-unit-poli.csv'
      : 'data-unit-poli.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const lines = reader.result
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length <= 1) return;

      const imported: UnitPoliItem[] = lines.slice(1).map((line, idx) => {
        const cols = line
          .split(',')
          .map((c) => c.replace(/^"|"$/g, '').trim());
        const jenisRaw = cols[2]?.toLowerCase();
        const jenis: UnitJenisKey =
          jenisRaw === 'poli' ||
          jenisRaw === 'penunjang' ||
          jenisRaw === 'unit'
            ? jenisRaw
            : 'poli';
        const status: ReferenceStatusKey =
          cols[4]?.toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif';

        return {
          id: `up-imp-${Date.now()}-${idx}`,
          kode: cols[0] || `UP-${String(units.length + idx + 1).padStart(6, '0')}`,
          nama: cols[1] || 'Unit Baru',
          jenis,
          deskripsi: cols[3] || undefined,
          status,
          modeAppointment: jenis === 'poli' ? 'hybrid' : 'walk_in',
          kuotaHarian: 50,
          petugasDitugaskan: [],
        };
      });

      setUnits((prev) => [...prev, ...imported]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-4">
      {/* 1. BARIS TAB NAVIGASI UTAMA */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] px-3.5 py-2.5">
        <div
          role="tablist"
          aria-label="Navigasi Master Unit dan Penjamin"
          className="flex items-center gap-2 overflow-x-auto"
        >
          {(
            [
              { key: 'unit_poli', label: 'Unit & Poli' },
              { key: 'pengaturan_unit', label: 'Pengaturan Unit' },
              { key: 'master_penjamin', label: 'Master Penjamin' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSwitchMainTab(tab.key)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#e6f6f9] text-[#008ba6] font-bold'
                    : 'text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. KONTEN BERDASARKAN TAB AKTIF */}
      {activeTab === 'pengaturan_unit' ? (
        /* TAB 2: PENGATURAN UNIT */
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="p-5">
            <label
              htmlFor="select-pengaturan-unit"
              className="block text-xs font-bold text-[#0f3d56] mb-2"
            >
              Pilih Unit / Poli
            </label>

            <div className="relative">
              <select
                id="select-pengaturan-unit"
                value={selectedUnitId}
                onChange={(e) => {
                  setSelectedUnitId(e.target.value);
                  setUnitSettingSaved(false);
                }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-xs sm:text-[13px] font-bold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 cursor-pointer"
              >
                <option value="">Pilih Unit / Poli</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nama} ({u.kode}) — {u.jenis}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="px-5 py-4 border-t border-slate-100">
            {!selectedUnitForSetting ? (
              <p className="text-xs sm:text-[13px] text-slate-500">
                Pilih Unit/Poli untuk melihat assignment dan mode appointment.
              </p>
            ) : (
              <div className="space-y-5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-extrabold text-[#0f3d56]">
                        {selectedUnitForSetting.nama}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-mono font-semibold text-slate-600">
                        {selectedUnitForSetting.kode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          selectedUnitForSetting.status === 'aktif'
                            ? 'bg-emerald-50 border border-emerald-200/80 text-emerald-700'
                            : 'bg-amber-50 border border-amber-200/80 text-amber-700'
                        }`}
                      >
                        {selectedUnitForSetting.status === 'aktif'
                          ? 'Aktif'
                          : 'Nonaktif'}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-0.5">
                      Konfigurasi mode antrean/appointment dan penugasan petugas
                      unit.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSaveUnitSetting?.(selectedUnitForSetting);
                      setUnitSettingSaved(true);
                      setTimeout(() => setUnitSettingSaved(false), 2500);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {unitSettingSaved
                        ? 'Pengaturan Tersimpan'
                        : 'Simpan Pengaturan Unit'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Pengaturan Mode Appointment & Kuota */}
                  <div className="space-y-3">
                    <label className="block font-bold text-[#0f3d56]">
                      Mode Appointment Layanan
                    </label>
                    <div className="relative">
                      <select
                        value={selectedUnitForSetting.modeAppointment}
                        onChange={(e) => {
                          const mode = e.target.value as AppointmentModeKey;
                          setUnits((prev) =>
                            prev.map((u) =>
                              u.id === selectedUnitForSetting.id
                                ? { ...u, modeAppointment: mode }
                                : u,
                            ),
                          );
                        }}
                        className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                      >
                        <option value="walk_in">
                          Walk-in (Antrean Langsung di Tempat)
                        </option>
                        <option value="scheduled_slot">
                          Scheduled Slot (Reservasi Jam Terjadwal)
                        </option>
                        <option value="hybrid">
                          Hybrid (Walk-in &amp; Reservasi Terjadwal)
                        </option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div>
                      <label className="block font-bold text-[#0f3d56] mb-1">
                        Kuota Kunjungan Harian
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={selectedUnitForSetting.kuotaHarian}
                        onChange={(e) => {
                          const quota = Math.max(1, Number(e.target.value) || 1);
                          setUnits((prev) =>
                            prev.map((u) =>
                              u.id === selectedUnitForSetting.id
                                ? { ...u, kuotaHarian: quota }
                                : u,
                            ),
                          );
                        }}
                        className="w-40 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                      />
                    </div>
                  </div>

                  {/* Assignment Tenaga Medis / Staf Unit */}
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-1.5 font-bold text-[#0f3d56]">
                      <Users className="w-3.5 h-3.5 text-[#008ba6]" />
                      <span>
                        Assignment Tenaga Medis / Petugas (
                        {selectedUnitForSetting.petugasDitugaskan.length})
                      </span>
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAssigneeName}
                        onChange={(e) => setNewAssigneeName(e.target.value)}
                        placeholder="Nama dokter, perawat, atau apoteker..."
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newAssigneeName.trim()) return;
                          setUnits((prev) =>
                            prev.map((u) =>
                              u.id === selectedUnitForSetting.id
                                ? {
                                    ...u,
                                    petugasDitugaskan: [
                                      ...u.petugasDitugaskan,
                                      newAssigneeName.trim(),
                                    ],
                                  }
                                : u,
                            ),
                          );
                          setNewAssigneeName('');
                        }}
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#008ba6] cursor-pointer"
                      >
                        + Tugaskan
                      </button>
                    </div>

                    {selectedUnitForSetting.petugasDitugaskan.length === 0 ? (
                      <p className="text-[11px] text-slate-400">
                        Belum ada petugas yang ditugaskan ke unit ini.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedUnitForSetting.petugasDitugaskan.map(
                          (staff, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f9fb] border border-cyan-200/80 text-[11px] font-semibold text-[#0f3d56]"
                            >
                              <span>{staff}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setUnits((prev) =>
                                    prev.map((u) =>
                                      u.id === selectedUnitForSetting.id
                                        ? {
                                            ...u,
                                            petugasDitugaskan:
                                              u.petugasDitugaskan.filter(
                                                (_, i) => i !== idx,
                                              ),
                                          }
                                        : u,
                                    ),
                                  )
                                }
                                className="text-slate-400 hover:text-rose-600 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* TAB 1 (UNIT & POLI) ATAU TAB 3 (MASTER PENJAMIN) + SIDEBAR TAMBAH REFERENSI */
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 items-start">
          {/* KOLOM KIRI: TABEL MASTER DATA */}
          {activeTab === 'unit_poli' ? (
            <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden min-w-0">
              {/* Header Bar */}
              <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                  Unit &amp; Poli
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium mr-1">
                    {filteredUnits.length} hasil · {activeUnitsCount} aktif
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDownloadCsv(true)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    Template
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadCsv(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ekspor</span>
                  </button>

                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleImportCsvFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => importInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Impor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormCategory('unit_poli');
                      nameInputRef.current?.focus();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Subheader Deskripsi */}
              <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
                Kelola unit, poli, dan penunjang yang digunakan dalam layanan
                klinik.
              </div>

              {/* Filter Bar */}
              <div className="px-5 py-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-[1.15fr_1fr_1fr] gap-4 items-end">
                {/* Input Pencarian */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 mb-1.5" />
                  <input
                    type="text"
                    value={unitSearch}
                    onChange={(e) => {
                      setUnitSearch(e.target.value);
                      setUnitCurrentPage(1);
                    }}
                    placeholder="Cari Kode, Nama, atau Deskr"
                    className="w-full bg-transparent border-b border-transparent focus:border-[#009bb8] py-1 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                {/* Filter Jenis */}
                <div>
                  <label
                    htmlFor="filter-unit-jenis"
                    className="block text-xs font-bold text-[#0f3d56] mb-1.5"
                  >
                    Jenis
                  </label>
                  <div className="relative">
                    <select
                      id="filter-unit-jenis"
                      value={unitJenisFilter}
                      onChange={(e) => {
                        setUnitJenisFilter(
                          e.target.value as 'ALL' | UnitJenisKey,
                        );
                        setUnitCurrentPage(1);
                      }}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="ALL">Semua jenis</option>
                      <option value="poli">poli</option>
                      <option value="penunjang">penunjang</option>
                      <option value="unit">unit</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Filter Status */}
                <div>
                  <label
                    htmlFor="filter-unit-status"
                    className="block text-xs font-bold text-[#0f3d56] mb-1.5"
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="filter-unit-status"
                      value={unitStatusFilter}
                      onChange={(e) => {
                        setUnitStatusFilter(
                          e.target.value as 'ALL' | ReferenceStatusKey,
                        );
                        setUnitCurrentPage(1);
                      }}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="ALL">Semua status</option>
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Tabel Unit & Poli */}
              <div className="overflow-x-auto border-t border-slate-200/80">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">KODE</th>
                      <th className="px-4 py-3.5">NAMA UNIT / POLI</th>
                      <th className="px-4 py-3.5">JENIS</th>
                      <th className="px-4 py-3.5">DESKRIPSI / INFORMASI</th>
                      <th className="px-4 py-3.5">STATUS</th>
                      <th className="px-5 py-3.5 text-right">AKSI</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {paginatedUnits.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 px-5 text-center text-slate-400"
                        >
                          Tidak ada data Unit &amp; Poli yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedUnits.map((unit) => (
                        <tr
                          key={unit.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-5 py-4 align-middle font-mono text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                            {unit.kode}
                          </td>

                          <td className="px-4 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                            {unit.nama}
                          </td>

                          <td className="px-4 py-4 align-middle text-slate-600 whitespace-nowrap">
                            {unit.jenis}
                          </td>

                          <td className="px-4 py-4 align-middle text-slate-500">
                            {unit.deskripsi || '—'}
                          </td>

                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            {unit.status === 'aktif' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-700">
                                Nonaktif
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 align-middle text-right whitespace-nowrap">
                            <div className="relative inline-block">
                              <button
                                type="button"
                                aria-label={`Aksi ${unit.nama}`}
                                onClick={() =>
                                  setOpenUnitMenuId((prev) =>
                                    prev === unit.id ? null : unit.id,
                                  )
                                }
                                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 cursor-pointer"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {openUnitMenuId === unit.id && (
                                <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-30 text-left text-xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingUnit(unit);
                                      setOpenUnitMenuId(null);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-[#008ba6]" />
                                    <span>Edit Unit / Poli</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextStatus: ReferenceStatusKey =
                                        unit.status === 'aktif'
                                          ? 'nonaktif'
                                          : 'aktif';
                                      const updated = {
                                        ...unit,
                                        status: nextStatus,
                                      };
                                      setUnits((prev) =>
                                        prev.map((item) =>
                                          item.id === unit.id ? updated : item,
                                        ),
                                      );
                                      onUpdateUnitPoli?.(updated);
                                      setOpenUnitMenuId(null);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                                  >
                                    <Power className="w-3.5 h-3.5 text-amber-600" />
                                    <span>
                                      {unit.status === 'aktif'
                                        ? 'Nonaktifkan'
                                        : 'Aktifkan'}
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setUnits((prev) =>
                                        prev.filter(
                                          (item) => item.id !== unit.id,
                                        ),
                                      );
                                      onDeleteUnitPoli?.(unit.id);
                                      setOpenUnitMenuId(null);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-rose-50 flex items-center gap-2 font-semibold text-rose-600 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Hapus</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Pagination Unit & Poli */}
              <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    <strong className="font-semibold text-slate-700">
                      {unitStartNumber}–{unitEndNumber}
                    </strong>{' '}
                    dari{' '}
                    <strong className="font-semibold text-slate-700">
                      {filteredUnits.length}
                    </strong>{' '}
                    Referensi
                  </span>

                  <div className="flex items-center gap-2">
                    <label htmlFor="per-halaman-unit">Per Halaman</label>
                    <div className="relative">
                      <select
                        id="per-halaman-unit"
                        value={unitPageSize}
                        onChange={(e) => {
                          setUnitPageSize(Number(e.target.value));
                          setUnitCurrentPage(1);
                        }}
                        className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUnitCurrentPage(1)}
                    disabled={safeUnitPage <= 1}
                    aria-label="Halaman pertama"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setUnitCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={safeUnitPage <= 1}
                    aria-label="Halaman sebelumnya"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from(
                    { length: unitTotalPages },
                    (_, idx) => idx + 1,
                  ).map((page) => {
                    const isCurrent = page === safeUnitPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setUnitCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[#e6f6f9] border-[#009bb8] text-[#008ba6]'
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
                      setUnitCurrentPage((p) =>
                        Math.min(unitTotalPages, p + 1),
                      )
                    }
                    disabled={safeUnitPage >= unitTotalPages}
                    aria-label="Halaman berikutnya"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setUnitCurrentPage(unitTotalPages)}
                    disabled={safeUnitPage >= unitTotalPages}
                    aria-label="Halaman terakhir"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>
          ) : (
            /* TAB 3: MASTER PENJAMIN */
            <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden min-w-0">
              {/* Header Bar */}
              <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
                  Master Penjamin
                </h1>

                <span className="text-xs text-slate-400 font-medium">
                  {filteredPenjamins.length} hasil · {activePenjaminsCount}{' '}
                  aktif
                </span>
              </div>

              {/* Subheader Deskripsi */}
              <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
                Kelola kategori penjamin internal yang digunakan untuk
                menentukan tarif klinik.
              </div>

              {/* Filter Bar */}
              <div className="px-5 py-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-4 items-end">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 mb-1.5" />
                  <input
                    type="text"
                    value={penjaminSearch}
                    onChange={(e) => {
                      setPenjaminSearch(e.target.value);
                      setPenjaminCurrentPage(1);
                    }}
                    placeholder="Cari Kode, Nama, atau Deskr"
                    className="w-full bg-transparent border-b border-transparent focus:border-[#009bb8] py-1 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="filter-penjamin-status"
                    className="block text-xs font-bold text-[#0f3d56] mb-1.5"
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="filter-penjamin-status"
                      value={penjaminStatusFilter}
                      onChange={(e) => {
                        setPenjaminStatusFilter(
                          e.target.value as 'ALL' | ReferenceStatusKey,
                        );
                        setPenjaminCurrentPage(1);
                      }}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="ALL">Semua status</option>
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Tabel Master Penjamin */}
              <div className="overflow-x-auto border-t border-slate-200/80">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3.5">KODE</th>
                      <th className="px-4 py-3.5">MASTER PENJAMIN</th>
                      <th className="px-4 py-3.5">DESKRIPSI / INFORMASI</th>
                      <th className="px-4 py-3.5">STATUS</th>
                      <th className="px-5 py-3.5 text-right">AKSI</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200/70 text-xs">
                    {paginatedPenjamins.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 px-5 text-center text-slate-400"
                        >
                          Tidak ada data Master Penjamin yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedPenjamins.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-5 py-4 align-middle font-mono text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                            {item.kode}
                          </td>

                          <td className="px-4 py-4 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                            {item.nama}
                          </td>

                          <td className="px-4 py-4 align-middle">
                            <p className="text-slate-500">{item.deskripsi}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              <strong className="font-bold text-slate-600">
                                Tariff Type:
                              </strong>{' '}
                              {item.tariffType}
                            </p>
                          </td>

                          <td className="px-4 py-4 align-middle whitespace-nowrap">
                            {item.status === 'aktif' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-700">
                                Nonaktif
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 align-middle text-right whitespace-nowrap">
                            <div className="relative inline-block">
                              <button
                                type="button"
                                aria-label={`Aksi ${item.nama}`}
                                onClick={() =>
                                  setOpenPenjaminMenuId((prev) =>
                                    prev === item.id ? null : item.id,
                                  )
                                }
                                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-slate-500 cursor-pointer"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {openPenjaminMenuId === item.id && (
                                <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-30 text-left text-xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingPenjamin(item);
                                      setOpenPenjaminMenuId(null);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-[#008ba6]" />
                                    <span>Edit Penjamin</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextStatus: ReferenceStatusKey =
                                        item.status === 'aktif'
                                          ? 'nonaktif'
                                          : 'aktif';
                                      const updated = {
                                        ...item,
                                        status: nextStatus,
                                      };
                                      setPenjamins((prev) =>
                                        prev.map((p) =>
                                          p.id === item.id ? updated : p,
                                        ),
                                      );
                                      onUpdatePenjamin?.(updated);
                                      setOpenPenjaminMenuId(null);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer"
                                  >
                                    <Power className="w-3.5 h-3.5 text-amber-600" />
                                    <span>
                                      {item.status === 'aktif'
                                        ? 'Nonaktifkan'
                                        : 'Aktifkan'}
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPenjamins((prev) =>
                                        prev.filter((p) => p.id !== item.id),
                                      );
                                      onDeletePenjamin?.(item.id);
                                      setOpenPenjaminMenuId(null);
                                    }}
                                    className="w-full px-3.5 py-2 hover:bg-rose-50 flex items-center gap-2 font-semibold text-rose-600 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Hapus</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Pagination Master Penjamin */}
              <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    <strong className="font-semibold text-slate-700">
                      {penjaminStartNumber}–{penjaminEndNumber}
                    </strong>{' '}
                    dari{' '}
                    <strong className="font-semibold text-slate-700">
                      {filteredPenjamins.length}
                    </strong>{' '}
                    Referensi
                  </span>

                  <div className="flex items-center gap-2">
                    <label htmlFor="per-halaman-penjamin">Per Halaman</label>
                    <div className="relative">
                      <select
                        id="per-halaman-penjamin"
                        value={penjaminPageSize}
                        onChange={(e) => {
                          setPenjaminPageSize(Number(e.target.value));
                          setPenjaminCurrentPage(1);
                        }}
                        className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPenjaminCurrentPage(1)}
                    disabled={safePenjaminPage <= 1}
                    aria-label="Halaman pertama"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPenjaminCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={safePenjaminPage <= 1}
                    aria-label="Halaman sebelumnya"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from(
                    { length: penjaminTotalPages },
                    (_, idx) => idx + 1,
                  ).map((page) => {
                    const isCurrent = page === safePenjaminPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setPenjaminCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[#e6f6f9] border-[#009bb8] text-[#008ba6]'
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
                      setPenjaminCurrentPage((p) =>
                        Math.min(penjaminTotalPages, p + 1),
                      )
                    }
                    disabled={safePenjaminPage >= penjaminTotalPages}
                    aria-label="Halaman berikutnya"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPenjaminCurrentPage(penjaminTotalPages)}
                    disabled={safePenjaminPage >= penjaminTotalPages}
                    aria-label="Halaman terakhir"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* KOLOM KANAN: SIDEBAR FORM TAMBAH REFERENSI */}
          <aside className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-extrabold text-[#0f3d56]">
                Tambah Referensi
              </h2>
              <span className="text-[11px] text-slate-400">
                Tersimpan di database
              </span>
            </div>

            <form
              onSubmit={handleSubmitSidebarForm}
              className="mt-4 space-y-3.5 text-xs"
            >
              {/* Select Kategori */}
              <div>
                <label
                  htmlFor="sidebar-kategori"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Kategori
                </label>
                <div className="relative">
                  <select
                    id="sidebar-kategori"
                    value={formCategory}
                    onChange={(e) => {
                      const nextCat = e.target.value as
                        | 'unit_poli'
                        | 'master_penjamin';
                      setFormCategory(nextCat);
                      setActiveTab(nextCat);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="unit_poli">Unit &amp; Poli</option>
                    <option value="master_penjamin">Master Penjamin</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {formCategory === 'unit_poli' ? (
                <>
                  {/* Select Jenis Unit/Poli */}
                  <div>
                    <label
                      htmlFor="sidebar-jenis-unit"
                      className="block font-bold text-[#0f3d56] mb-1.5"
                    >
                      Jenis Unit/Poli
                    </label>
                    <div className="relative">
                      <select
                        id="sidebar-jenis-unit"
                        value={formUnitJenis}
                        onChange={(e) =>
                          setFormUnitJenis(e.target.value as '' | UnitJenisKey)
                        }
                        className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                      >
                        <option value="">Pilih jenis</option>
                        <option value="poli">poli</option>
                        <option value="penunjang">penunjang</option>
                        <option value="unit">unit</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Input Nama */}
                  <div>
                    <label
                      htmlFor="sidebar-nama-unit"
                      className="block font-bold text-[#0f3d56] mb-1.5"
                    >
                      Nama
                    </label>
                    <input
                      ref={nameInputRef}
                      id="sidebar-nama-unit"
                      type="text"
                      value={formNama}
                      onChange={(e) => setFormNama(e.target.value)}
                      placeholder="Nama referensi"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8]"
                    />
                  </div>
                </>
              ) : (
                /* Grid 2 Kolom Kode + Nama saat Kategori = Master Penjamin */
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label
                      htmlFor="sidebar-kode-penjamin"
                      className="block font-bold text-[#0f3d56] mb-1.5"
                    >
                      Kode
                    </label>
                    <input
                      id="sidebar-kode-penjamin"
                      type="text"
                      value={formKode}
                      onChange={(e) => setFormKode(e.target.value)}
                      placeholder="KODE-001"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sidebar-nama-penjamin"
                      className="block font-bold text-[#0f3d56] mb-1.5"
                    >
                      Nama
                    </label>
                    <input
                      ref={nameInputRef}
                      id="sidebar-nama-penjamin"
                      type="text"
                      value={formNama}
                      onChange={(e) => setFormNama(e.target.value)}
                      placeholder="Nama referensi"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8]"
                    />
                  </div>
                </div>
              )}

              {/* Textarea Deskripsi */}
              <div>
                <label
                  htmlFor="sidebar-deskripsi"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Deskripsi
                </label>
                <textarea
                  id="sidebar-deskripsi"
                  rows={3}
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  placeholder="Keterangan atau aturan penggunaan..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              {/* Footer Buttons: Bersihkan + Tambah referensi */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClearSidebarForm}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bersihkan</span>
                </button>

                <button
                  type="submit"
                  disabled={!isSidebarFormValid}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-colors ${
                    isSidebarFormValid
                      ? 'bg-[#009bb8] hover:bg-[#00859e] cursor-pointer shadow-2xs'
                      : 'bg-[#7dc4e3] cursor-not-allowed'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.4]" />
                  <span>Tambah referensi</span>
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}

      {/* 3. MODAL EDIT UNIT & POLI */}
      {editingUnit && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingUnit.kode}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Unit &amp; Poli
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingUnit(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setUnits((prev) =>
                  prev.map((u) => (u.id === editingUnit.id ? editingUnit : u)),
                );
                onUpdateUnitPoli?.(editingUnit);
                setEditingUnit(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Unit / Poli
                </label>
                <input
                  type="text"
                  required
                  value={editingUnit.nama}
                  onChange={(e) =>
                    setEditingUnit({ ...editingUnit, nama: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis
                  </label>
                  <select
                    value={editingUnit.jenis}
                    onChange={(e) =>
                      setEditingUnit({
                        ...editingUnit,
                        jenis: e.target.value as UnitJenisKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="poli">poli</option>
                    <option value="penunjang">penunjang</option>
                    <option value="unit">unit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingUnit.status}
                    onChange={(e) =>
                      setEditingUnit({
                        ...editingUnit,
                        status: e.target.value as ReferenceStatusKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi / Informasi
                </label>
                <textarea
                  rows={2}
                  value={editingUnit.deskripsi ?? ''}
                  onChange={(e) =>
                    setEditingUnit({
                      ...editingUnit,
                      deskripsi: e.target.value || undefined,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUnit(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL EDIT MASTER PENJAMIN */}
      {editingPenjamin && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {editingPenjamin.kode}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Edit Master Penjamin
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPenjamin(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPenjamins((prev) =>
                  prev.map((p) =>
                    p.id === editingPenjamin.id ? editingPenjamin : p,
                  ),
                );
                onUpdatePenjamin?.(editingPenjamin);
                setEditingPenjamin(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Master Penjamin
                </label>
                <input
                  type="text"
                  required
                  value={editingPenjamin.nama}
                  onChange={(e) =>
                    setEditingPenjamin({
                      ...editingPenjamin,
                      nama: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tariff Type
                  </label>
                  <input
                    type="text"
                    value={editingPenjamin.tariffType}
                    onChange={(e) =>
                      setEditingPenjamin({
                        ...editingPenjamin,
                        tariffType: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingPenjamin.status}
                    onChange={(e) =>
                      setEditingPenjamin({
                        ...editingPenjamin,
                        status: e.target.value as ReferenceStatusKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi / Informasi
                </label>
                <textarea
                  rows={2}
                  value={editingPenjamin.deskripsi}
                  onChange={(e) =>
                    setEditingPenjamin({
                      ...editingPenjamin,
                      deskripsi: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPenjamin(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}