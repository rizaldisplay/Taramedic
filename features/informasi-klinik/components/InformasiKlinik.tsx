'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Info,
  Megaphone,
  Pencil,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

export type PublicDisplayTabKey =
  | 'teks_berjalan'
  | 'jam_operasional'
  | 'reservasi_layanan';

export type TickerSpeedKey = 'Lambat' | 'Normal' | 'Cepat';

export interface PublicDisplayInfoItem {
  id: string;
  kategori: PublicDisplayTabKey;
  judul: string;
  deskripsi: string;
  kontakAtauJam?: string;
  tautanReservasi?: string;
  urutan: string;
  status: 'aktif' | 'nonaktif';
  diperbaruiOleh: string;
  tanggalPembaruan: string;
}

export interface TickerSettings {
  aktif: boolean;
  kecepatan: TickerSpeedKey;
  jedaMs: number;
}

export interface ClinicIdentityProfile {
  logoUrl: string | null;
  namaKlinik: string;
  slogan: string;
  alamatKlinik: string;
  nomorTelepon: string;
  email: string;
  situsWeb: string;
  catatanTiketAntrean: string;
}

const DEFAULT_DISPLAY_ITEMS: PublicDisplayInfoItem[] = [
  {
    id: 'info-1',
    kategori: 'teks_berjalan',
    judul: 'Test',
    deskripsi: 'test',
    urutan: '01',
    status: 'aktif',
    diperbaruiOleh: 'info@taramedic.id',
    tanggalPembaruan: '06 Nov 2026',
  },
  {
    id: 'info-2',
    kategori: 'teks_berjalan',
    judul: 'Test 2',
    deskripsi: 'test 2',
    urutan: '01',
    status: 'aktif',
    diperbaruiOleh: 'info@taramedic.id',
    tanggalPembaruan: '01 Nov 2026',
  },
  {
    id: 'info-3',
    kategori: 'jam_operasional',
    judul: 'Poli Umum · Senin–Jumat',
    deskripsi: 'Pelayanan rawat jalan reguler',
    kontakAtauJam: '08:00–17:00 WIB',
    urutan: '01',
    status: 'aktif',
    diperbaruiOleh: 'info@taramedic.id',
    tanggalPembaruan: '06 Nov 2026',
  },
  {
    id: 'info-4',
    kategori: 'reservasi_layanan',
    judul: 'Hubungi Kami',
    deskripsi: 'Pelayanan Terbaik',
    kontakAtauJam: '0815 1121 0060',
    tautanReservasi: 'http://www.taramedic.id',
    urutan: '01',
    status: 'aktif',
    diperbaruiOleh: 'info@taramedic.id',
    tanggalPembaruan: '06 Nov 2026',
  },
];

const DEFAULT_TICKER_SETTINGS: TickerSettings = {
  aktif: true,
  kecepatan: 'Normal',
  jedaMs: 1200,
};

const DEFAULT_CLINIC_PROFILE: ClinicIdentityProfile = {
  logoUrl: null,
  namaKlinik: 'Taramedic Healthcare Indonesia',
  slogan: 'Sehat Hatinya, Sehat Jiwanya',
  alamatKlinik:
    'Jl. Bima Sakti No. 21 Kec. Bima Kelurahan Bima, Kota Cirebon',
  nomorTelepon: '081511210060',
  email: 'info@taramedic.id',
  situsWeb: 'http://www.taramedic.id',
  catatanTiketAntrean:
    'Harap simpan tiket ini dan tunggu nomor Anda dipanggil.',
};

const TAB_TITLES: Record<PublicDisplayTabKey, string> = {
  teks_berjalan: 'Teks berjalan',
  jam_operasional: 'Jam operasional',
  reservasi_layanan: 'Reservasi layanan',
};

function getTodayFormattedID(): string {
  return new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function DefaultTaramedicLogoMark() {
  return (
    <div className="flex flex-col items-center justify-center select-none">
      <svg
        viewBox="0 0 64 64"
        className="w-12 h-12 text-[#009bb8]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 8h16a4 4 0 0 1 4 4v8h8a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4h-8v8a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4v-8h-8a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4h8v-8a4 4 0 0 1 4-4Z"
          fill="currentColor"
        />
        <path
          d="M15 33h9l4-9 6 17 5-12 3 4h7"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="mt-1 text-[10px] font-extrabold tracking-widest text-[#008ba6]">
        TARAMEDIC
      </span>
    </div>
  );
}

export default function PengaturanLayarDanKlinik({
  initialItems = DEFAULT_DISPLAY_ITEMS,
  initialTickerSettings = DEFAULT_TICKER_SETTINGS,
  initialClinicProfile = DEFAULT_CLINIC_PROFILE,
  currentEditorEmail = 'info@taramedic.id',
  onSaveTickerSettings,
  onSaveDisplayItems,
  onSaveClinicProfile,
}: {
  initialItems?: PublicDisplayInfoItem[];
  initialTickerSettings?: TickerSettings;
  initialClinicProfile?: ClinicIdentityProfile;
  currentEditorEmail?: string;
  onSaveTickerSettings?: (settings: TickerSettings) => void;
  onSaveDisplayItems?: (items: PublicDisplayInfoItem[]) => void;
  onSaveClinicProfile?: (profile: ClinicIdentityProfile) => void;
}) {
  // State Bagian 1: Informasi untuk Pasien (Layar Antrean Publik)
  const [activeTab, setActiveTab] =
    useState<PublicDisplayTabKey>('teks_berjalan');
  const [items, setItems] = useState<PublicDisplayInfoItem[]>(initialItems);
  const [tickerSettings, setTickerSettings] = useState<TickerSettings>(
    initialTickerSettings,
  );
  const [tickerSavedNotice, setTickerSavedNotice] = useState(false);

  // Filter & Pagination Daftar Informasi
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'aktif' | 'nonaktif'>(
    'ALL',
  );
  const [pageSize, setPageSize] = useState<number>(8);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal Tambah / Edit Informasi
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PublicDisplayInfoItem | null>(
    null,
  );
  const [formJudul, setFormJudul] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formKontakAtauJam, setFormKontakAtauJam] = useState('');
  const [formUrutan, setFormUrutan] = useState('01');
  const [formStatus, setFormStatus] = useState<'aktif' | 'nonaktif'>('aktif');

  // State Bagian 2: Informasi Klinik
  const [clinicProfile, setClinicProfile] = useState<ClinicIdentityProfile>(
    initialClinicProfile,
  );
  const [logoError, setLogoError] = useState<string | null>(null);
  const [clinicSavedNotice, setClinicSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Hitung badge jumlah per tab
  const tabCounts = useMemo(() => {
    return {
      teks_berjalan: items.filter((i) => i.kategori === 'teks_berjalan').length,
      jam_operasional: items.filter((i) => i.kategori === 'jam_operasional')
        .length,
      reservasi_layanan: items.filter((i) => i.kategori === 'reservasi_layanan')
        .length,
    };
  }, [items]);

  // Filter item pada tab aktif
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (item.kategori !== activeTab) return false;
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.judul.toLowerCase().includes(q) ||
          item.deskripsi.toLowerCase().includes(q) ||
          (item.kontakAtauJam ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [items, activeTab, statusFilter, searchQuery]);

  // Pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredItems.slice(startIdx, startIdx + pageSize);
  }, [filteredItems, safePage, pageSize]);

  const startNumber = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalItems);

  // Item aktif untuk Pratinjau Layar Antrean
  const activePreviewTicker = useMemo(
    () =>
      items.filter(
        (i) => i.kategori === 'teks_berjalan' && i.status === 'aktif',
      ),
    [items],
  );
  const activePreviewHours = useMemo(
    () =>
      items.filter(
        (i) => i.kategori === 'jam_operasional' && i.status === 'aktif',
      ),
    [items],
  );
  const activePreviewReservation = useMemo(
    () =>
      items.filter(
        (i) => i.kategori === 'reservasi_layanan' && i.status === 'aktif',
      ),
    [items],
  );

  const handleSaveTickerConfig = () => {
    onSaveTickerSettings?.(tickerSettings);
    setTickerSavedNotice(true);
    setTimeout(() => setTickerSavedNotice(false), 2500);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormJudul('');
    setFormDeskripsi('');
    setFormKontakAtauJam('');
    const nextOrder = String(tabCounts[activeTab] + 1).padStart(2, '0');
    setFormUrutan(nextOrder);
    setFormStatus('aktif');
    setIsFormModalOpen(true);
  };

  const openEditModal = (item: PublicDisplayInfoItem) => {
    setEditingItem(item);
    setFormJudul(item.judul);
    setFormDeskripsi(item.deskripsi);
    setFormKontakAtauJam(item.kontakAtauJam ?? '');
    setFormUrutan(item.urutan);
    setFormStatus(item.status);
    setIsFormModalOpen(true);
  };

  const handleSaveDisplayItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim()) return;

    const todayStr = getTodayFormattedID();
    let updatedList: PublicDisplayInfoItem[];

    if (editingItem) {
      updatedList = items.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              judul: formJudul.trim(),
              deskripsi: formDeskripsi.trim() || '-',
              kontakAtauJam: formKontakAtauJam.trim() || undefined,
              urutan: formUrutan.trim() || '01',
              status: formStatus,
              diperbaruiOleh: currentEditorEmail,
              tanggalPembaruan: todayStr,
            }
          : item,
      );
    } else {
      const created: PublicDisplayInfoItem = {
        id: `info-${Date.now()}`,
        kategori: activeTab,
        judul: formJudul.trim(),
        deskripsi: formDeskripsi.trim() || '-',
        kontakAtauJam: formKontakAtauJam.trim() || undefined,
        urutan: formUrutan.trim() || '01',
        status: formStatus,
        diperbaruiOleh: currentEditorEmail,
        tanggalPembaruan: todayStr,
      };
      updatedList = [...items, created];
    }

    setItems(updatedList);
    onSaveDisplayItems?.(updatedList);
    setIsFormModalOpen(false);
  };

  const handleAddExampleItem = () => {
    const todayStr = getTodayFormattedID();
    const examplesByTab: Record<PublicDisplayTabKey, PublicDisplayInfoItem> = {
      teks_berjalan: {
        id: `info-${Date.now()}`,
        kategori: 'teks_berjalan',
        judul: 'Selamat Datang di Klinik',
        deskripsi:
          'Mohon menyiapkan kartu identitas dan menunggu nomor antrean Anda dipanggil.',
        urutan: String(tabCounts.teks_berjalan + 1).padStart(2, '0'),
        status: 'aktif',
        diperbaruiOleh: currentEditorEmail,
        tanggalPembaruan: todayStr,
      },
      jam_operasional: {
        id: `info-${Date.now()}`,
        kategori: 'jam_operasional',
        judul: 'Poli Gigi & KIA · Sabtu',
        deskripsi: 'Pelayanan akhir pekan',
        kontakAtauJam: '08:00–14:00 WIB',
        urutan: String(tabCounts.jam_operasional + 1).padStart(2, '0'),
        status: 'aktif',
        diperbaruiOleh: currentEditorEmail,
        tanggalPembaruan: todayStr,
      },
      reservasi_layanan: {
        id: `info-${Date.now()}`,
        kategori: 'reservasi_layanan',
        judul: 'Pendaftaran Online WhatsApp',
        deskripsi: 'Konfirmasi jadwal kunjungan H-1',
        kontakAtauJam: clinicProfile.nomorTelepon || '0815 1121 0060',
        urutan: String(tabCounts.reservasi_layanan + 1).padStart(2, '0'),
        status: 'aktif',
        diperbaruiOleh: currentEditorEmail,
        tanggalPembaruan: todayStr,
      },
    };

    const updatedList = [...items, examplesByTab[activeTab]];
    setItems(updatedList);
    onSaveDisplayItems?.(updatedList);
  };

  const handleDeleteItem = (id: string) => {
    const updatedList = items.filter((item) => item.id !== id);
    setItems(updatedList);
    onSaveDisplayItems?.(updatedList);
  };

  const handleSelectLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 2 * 1024 * 1024; // 2 MiB
    if (file.size > maxBytes) {
      setLogoError('Ukuran berkas melebihi batas maksimal 2 MiB.');
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setLogoError('Format logo harus PNG, JPEG, atau WebP.');
      return;
    }

    setLogoError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setClinicProfile((prev) => ({ ...prev, logoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveClinicProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicProfile.namaKlinik.trim()) return;

    onSaveClinicProfile?.(clinicProfile);
    setClinicSavedNotice(true);
    setTimeout(() => setClinicSavedNotice(false), 3000);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-6">
      {/* =====================================================================
          BAGIAN 1: LAYAR ANTREAN PUBLIK — INFORMASI UNTUK PASIEN
         ===================================================================== */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Header Kartu */}
        <div className="px-6 py-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
              <Megaphone className="w-3.5 h-3.5" />
              <span>LAYAR ANTREAN PUBLIK</span>
            </div>

            <h1 className="text-xl font-extrabold text-[#0f3d56] mt-0.5">
              Informasi untuk Pasien
            </h1>

            <p className="text-xs text-slate-500 mt-0.5">
              Kelola pesan, jam layanan, dan reservasi yang tampil pada layar
              antrean.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              {tickerSavedNotice
                ? 'Pengaturan tersinkron!'
                : 'Tersinkron setelah disimpan'}
            </span>
          </div>
        </div>

        {/* Baris Sub-Tab & Keterangan Publikasi */}
        <div className="px-6 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Kategori Informasi Layar Antrean"
            className="flex items-center gap-6 overflow-x-auto"
          >
            {(
              [
                {
                  key: 'teks_berjalan',
                  label: 'Teks berjalan',
                  count: tabCounts.teks_berjalan,
                },
                {
                  key: 'jam_operasional',
                  label: 'Jam operasional',
                  count: tabCounts.jam_operasional,
                },
                {
                  key: 'reservasi_layanan',
                  label: 'Reservasi layanan',
                  count: tabCounts.reservasi_layanan,
                },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`relative py-3.5 inline-flex items-center gap-2 text-xs sm:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#008ba6] font-bold'
                      : 'text-slate-500 font-semibold hover:text-slate-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive
                        ? 'bg-[#f0f9fb] text-[#008ba6]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="py-2.5 inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hanya informasi aktif ditampilkan ke publik</span>
          </div>
        </div>

        {/* Grid 2 Kolom: Manajemen Informasi (Kiri) + Pratinjau Layar Antrean (Kanan) */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] divide-y xl:divide-y-0 xl:divide-x divide-slate-200/80">
          {/* KOLOM KIRI: MANAJEMEN INFORMASI */}
          <div className="p-6 flex flex-col justify-between min-w-0">
            <div>
              {/* Header Section + Tombol + Tambah informasi */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                    MANAJEMEN INFORMASI
                  </p>
                  <h2 className="text-lg font-extrabold text-[#0f3d56] mt-0.5">
                    {TAB_TITLES[activeTab]}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atur urutan dan status publikasi informasi.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                  <span>Tambah informasi</span>
                </button>
              </div>

              {/* Bar Pengaturan Teks Berjalan (ditampilkan pada tab Teks berjalan) */}
              {activeTab === 'teks_berjalan' && (
                <div className="mt-5 pb-5 border-b border-slate-100 flex flex-wrap items-end justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-5">
                    {/* Toggle Switch */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={tickerSettings.aktif}
                        onClick={() =>
                          setTickerSettings((prev) => ({
                            ...prev,
                            aktif: !prev.aktif,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                          tickerSettings.aktif ? 'bg-[#009bb8]' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                            tickerSettings.aktif
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>

                      <div>
                        <p className="text-xs font-bold text-[#0f3d56]">
                          Teks Berjalan
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {tickerSettings.aktif
                            ? 'Aktif pada layar antrean'
                            : 'Nonaktif pada layar antrean'}
                        </p>
                      </div>
                    </div>

                    {/* Select Kecepatan */}
                    <div>
                      <label
                        htmlFor="ticker-speed"
                        className="block text-[11px] font-semibold text-slate-400 mb-1"
                      >
                        Kecepatan
                      </label>
                      <div className="relative w-32">
                        <select
                          id="ticker-speed"
                          value={tickerSettings.kecepatan}
                          onChange={(e) =>
                            setTickerSettings((prev) => ({
                              ...prev,
                              kecepatan: e.target.value as TickerSpeedKey,
                            }))
                          }
                          className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                        >
                          <option value="Lambat">Lambat</option>
                          <option value="Normal">Normal</option>
                          <option value="Cepat">Cepat</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Input Jeda Antarpesan (Ms) */}
                    <div>
                      <label
                        htmlFor="ticker-delay"
                        className="block text-[11px] font-semibold text-slate-400 mb-1"
                      >
                        Jeda Antarpesan (Ms)
                      </label>
                      <input
                        id="ticker-delay"
                        type="number"
                        min={200}
                        step={100}
                        value={tickerSettings.jedaMs}
                        onChange={(e) =>
                          setTickerSettings((prev) => ({
                            ...prev,
                            jedaMs: Math.max(200, Number(e.target.value) || 0),
                          }))
                        }
                        className="w-32 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveTickerConfig}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-500" />
                    <span>Simpan pengaturan</span>
                  </button>
                </div>
              )}

              {/* Bar Search + Filter Status + Tambahkan Contoh */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari Informasi..."
                    className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      aria-label="Hapus pencarian"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative w-36">
                  <select
                    aria-label="Filter status informasi"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(
                        e.target.value as 'ALL' | 'aktif' | 'nonaktif',
                      );
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={handleAddExampleItem}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tambahkan contoh</span>
                </button>
              </div>

              {/* Tabel Daftar Informasi */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3 pr-4">INFORMASI</th>
                      <th className="py-3 px-4">URUTAN</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">PEMBARUAN</th>
                      <th className="py-3 pl-4 text-right">
                        <span className="sr-only">Aksi</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-xs">
                    {paginatedItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-slate-400"
                        >
                          Belum ada item informasi pada kategori{' '}
                          <strong className="text-slate-600">
                            {TAB_TITLES[activeTab]}
                          </strong>
                          .
                        </td>
                      </tr>
                    ) : (
                      paginatedItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          {/* INFORMASI */}
                          <td className="py-4 pr-4 align-middle">
                            <p className="font-bold text-[#0f3d56]">
                              {item.judul}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {item.deskripsi}
                              {item.kontakAtauJam
                                ? ` · ${item.kontakAtauJam}`
                                : ''}
                            </p>
                          </td>

                          {/* URUTAN */}
                          <td className="py-4 px-4 align-middle font-mono text-slate-500 font-semibold whitespace-nowrap">
                            {item.urutan}
                          </td>

                          {/* STATUS */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            {item.status === 'aktif' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>Aktif</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                <span>Nonaktif</span>
                              </span>
                            )}
                          </td>

                          {/* PEMBARUAN */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <p className="text-slate-600 font-medium">
                              {item.diperbaruiOleh}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {item.tanggalPembaruan}
                            </p>
                          </td>

                          {/* AKSI */}
                          <td className="py-4 pl-4 align-middle text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                aria-label={`Edit ${item.judul}`}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#008ba6] hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id)}
                                aria-label={`Hapus ${item.judul}`}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Pagination */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span>
                Menampilkan {startNumber}–{endNumber} dari {totalItems}
              </span>

              <div className="flex items-center gap-2">
                <span>Tampilkan</span>
                <div className="relative">
                  <select
                    aria-label="Jumlah baris per halaman"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-6 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value={8}>8</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  aria-label="Halaman sebelumnya"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <span className="px-1 font-semibold text-slate-700 tabular-nums">
                  {safePage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage >= totalPages}
                  aria-label="Halaman berikutnya"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: PRATINJAU LAYAR ANTREAN */}
          <aside className="p-6 bg-slate-50/35">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              PRATINJAU
            </p>
            <h3 className="text-base font-extrabold text-[#0f3d56] mt-0.5">
              Layar antrean
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Konten aktif saat ini
            </p>

            {/* Kartu Mini Layar Antrean */}
            <div className="mt-4 rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden text-xs">
              <div className="px-3.5 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-slate-400">
                <span>LAYAR ANTREAN</span>
                <span>INFORMASI KLINIK</span>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Area 1: Informasi / Teks Berjalan */}
                <div className="p-3.5 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#f0f9fb] text-[#008ba6] flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0f3d56]">
                        Informasi
                      </span>
                      <span className="h-3.5 w-[1.5px] bg-[#009bb8]" />
                    </div>
                    {tickerSettings.aktif && activePreviewTicker.length > 0 ? (
                      <p className="text-[11px] text-slate-500 mt-1 truncate">
                        {activePreviewTicker
                          .map((t) => `${t.judul} — ${t.deskripsi}`)
                          .join('  •  ')}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Teks berjalan nonaktif
                      </p>
                    )}
                  </div>
                </div>

                {/* Area 2: Jam Operasional */}
                <div className="p-3.5 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#f0f9fb] text-[#008ba6] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0f3d56]">Jam Operasional</p>
                    {activePreviewHours.length === 0 ? (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Belum ada jadwal aktif
                      </p>
                    ) : (
                      activePreviewHours.map((jam) => (
                        <div key={jam.id} className="mt-1">
                          <p className="text-[11px] font-bold text-slate-700">
                            {jam.judul}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {jam.kontakAtauJam || jam.deskripsi}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Area 3: Reservasi Layanan */}
                <div className="p-3.5 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#f0f9fb] text-[#008ba6] flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0f3d56]">
                      Reservasi Layanan
                    </p>
                    {activePreviewReservation.length === 0 ? (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Belum ada info reservasi
                      </p>
                    ) : (
                      activePreviewReservation.map((res) => (
                        <div key={res.id} className="mt-1 space-y-0.5">
                          <p className="text-[11px] font-bold text-slate-700">
                            {res.judul}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {res.deskripsi}
                          </p>
                          <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#008ba6]">
                            {res.kontakAtauJam && (
                              <span className="inline-flex items-center gap-1 underline">
                                <Phone className="w-3 h-3" />
                                <span>{res.kontakAtauJam}</span>
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 underline">
                              <ExternalLink className="w-3 h-3" />
                              <span>Reservasi</span>
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Catatan Bawah Pratinjau */}
            <div className="mt-3.5 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Ketiga area memakai data tersimpan yang sama dengan layar
                antrean.
              </span>
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================================
          BAGIAN 2: INFORMASI KLINIK (IDENTITAS, LOGO, KONTAK & CATATAN TIKET)
         ===================================================================== */}
      <form onSubmit={handleSaveClinicProfileSubmit} className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0f3d56]">
            Informasi Klinik
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Identitas ini digunakan bersama di TARAMEDIC dan pada tiket antrean.
            Pengaturan printer tetap tersimpan pada browser/perangkat
            masing-masing.
          </p>
        </div>

        <div className="max-w-4xl space-y-4">
          {/* Kartu 1: Logo Klinik */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#0f3d56]">
                Logo Klinik
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                PNG, JPEG, atau WebP · maksimal 2 MiB
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-36 h-28 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 flex items-center justify-center overflow-hidden p-3">
                  {clinicProfile.logoUrl ? (
                    <img
                      src={clinicProfile.logoUrl}
                      alt="Logo Klinik"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <DefaultTaramedicLogoMark />
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleSelectLogoFile}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pilih Logo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setClinicProfile((prev) => ({ ...prev, logoUrl: null }));
                      setLogoError(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Hapus logo</span>
                  </button>
                </div>
              </div>

              {logoError && (
                <p className="text-xs font-semibold text-rose-600 mt-2.5">
                  {logoError}
                </p>
              )}
            </div>
          </section>

          {/* Kartu 2: Identitas & Kontak */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#0f3d56]">
                Identitas &amp; Kontak
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Isi informasi resmi yang ingin ditampilkan pada dokumen dan
                tiket klinik.
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label
                  htmlFor="clinic-name"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Nama Klinik <span className="text-rose-500">*</span>
                </label>
                <input
                  id="clinic-name"
                  type="text"
                  required
                  value={clinicProfile.namaKlinik}
                  onChange={(e) =>
                    setClinicProfile((prev) => ({
                      ...prev,
                      namaKlinik: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="clinic-slogan"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Slogan (Opsional)
                </label>
                <input
                  id="clinic-slogan"
                  type="text"
                  value={clinicProfile.slogan}
                  onChange={(e) =>
                    setClinicProfile((prev) => ({
                      ...prev,
                      slogan: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="clinic-address"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Alamat Klinik
                </label>
                <textarea
                  id="clinic-address"
                  rows={3}
                  value={clinicProfile.alamatKlinik}
                  onChange={(e) =>
                    setClinicProfile((prev) => ({
                      ...prev,
                      alamatKlinik: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="clinic-phone"
                    className="block font-bold text-[#0f3d56] mb-1.5"
                  >
                    Nomor Telepon
                  </label>
                  <input
                    id="clinic-phone"
                    type="text"
                    value={clinicProfile.nomorTelepon}
                    onChange={(e) =>
                      setClinicProfile((prev) => ({
                        ...prev,
                        nomorTelepon: e.target.value,
                      }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="clinic-email"
                    className="block font-bold text-[#0f3d56] mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="clinic-email"
                    type="email"
                    value={clinicProfile.email}
                    onChange={(e) =>
                      setClinicProfile((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="clinic-website"
                  className="block font-bold text-[#0f3d56] mb-1.5"
                >
                  Situs Web
                </label>
                <input
                  id="clinic-website"
                  type="text"
                  value={clinicProfile.situsWeb}
                  onChange={(e) =>
                    setClinicProfile((prev) => ({
                      ...prev,
                      situsWeb: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>
            </div>
          </section>

          {/* Kartu 3: Catatan Tiket Antrean */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-[#0f3d56]">
                Catatan Tiket Antrean
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pesan singkat di bagian bawah tiket yang dicetak.
              </p>
            </div>

            <div className="p-6">
              <textarea
                aria-label="Catatan Tiket Antrean"
                rows={3}
                value={clinicProfile.catatanTiketAntrean}
                onChange={(e) =>
                  setClinicProfile((prev) => ({
                    ...prev,
                    catatanTiketAntrean: e.target.value,
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>
          </section>

          {/* Footer Simpan Perubahan */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              {clinicSavedNotice ? (
                <span className="font-semibold text-emerald-700">
                  Perubahan informasi klinik berhasil disimpan.
                </span>
              ) : (
                'Perubahan berlaku untuk semua pengguna dan tiket yang diterbitkan setelah disimpan.'
              )}
            </p>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs sm:text-[13px] font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan perubahan</span>
            </button>
          </div>
        </div>
      </form>

      {/* =====================================================================
          MODAL TAMBAH / EDIT INFORMASI LAYAR ANTREAN
         ===================================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  {TAB_TITLES[activeTab]}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  {editingItem ? 'Edit Informasi' : 'Tambah Informasi Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveDisplayItem}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Informasi
                </label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  placeholder={
                    activeTab === 'jam_operasional'
                      ? 'Contoh: Poli Umum · Senin–Jumat'
                      : activeTab === 'reservasi_layanan'
                        ? 'Contoh: Hubungi Kami'
                        : 'Judul pesan layar antrean'
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Isi / Subjudul Informasi
                </label>
                <textarea
                  rows={2}
                  required
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  placeholder="Keterangan singkat yang tampil di layar antrean..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              {activeTab !== 'teks_berjalan' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {activeTab === 'jam_operasional'
                      ? 'Rentang Jam Layanan'
                      : 'Nomor Kontak / WhatsApp'}
                  </label>
                  <input
                    type="text"
                    value={formKontakAtauJam}
                    onChange={(e) => setFormKontakAtauJam(e.target.value)}
                    placeholder={
                      activeTab === 'jam_operasional'
                        ? 'Contoh: 08:00–17:00 WIB'
                        : 'Contoh: 0815 1121 0060'
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="text"
                    value={formUrutan}
                    onChange={(e) => setFormUrutan(e.target.value)}
                    placeholder="01"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status Publikasi
                  </label>
                  <div className="relative">
                    <select
                      value={formStatus}
                      onChange={(e) =>
                        setFormStatus(e.target.value as 'aktif' | 'nonaktif')
                      }
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white text-xs font-semibold cursor-pointer"
                >
                  Simpan Informasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}