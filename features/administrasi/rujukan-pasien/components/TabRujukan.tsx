'use client';

import React, { useMemo, useState } from 'react';
import { FileInput, FileOutput, History } from 'lucide-react';
import RujukanMasuk from './RujukanMasuk';
import RujukanKeluar from './RujukanKeluar';
import RiwayatRujukan from './RiwayatRujukan';
import ModalCatatRujukanMasuk, {
  type RujukanMasukFormPayload,
} from './ModalCatatRujukanMasuk';

export type ReferralTab = 'dataMasuk' | 'dataKeluar' | 'riwayat';
export type ReferralStatus = 'all' | 'menunggu' | 'diterima' | 'selesai' | 'ditolak';

export interface ReferralItem {
  id: string;
  nomorRujukan: string;
  tipe: 'masuk' | 'keluar';
  namaPasien: string;
  nomorRM: string;
  fasilitasPerujuk: string;
  fasilitasTujuan: string;
  diagnosis: string;
  tanggalRujukan: string;
  status: Exclude<ReferralStatus, 'all'>;
  isRujukanBalik?: boolean;
  catatan?: string;
}

export interface ReferralTabComponentProps {
  activeTab: ReferralTab;
  onTabChange: (tab: ReferralTab) => void;
  data?: ReferralItem[];
  onOpenCreateModal?: (tipe: 'masuk' | 'keluar') => void;
}

export const STATUS_BADGE: Record<
  Exclude<ReferralStatus, 'all'>,
  { label: string; className: string }
> = {
  menunggu: {
    label: 'Menunggu',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  diterima: {
    label: 'Diterima',
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  selesai: {
    label: 'Selesai',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  ditolak: {
    label: 'Ditolak',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
};

const TAB_ITEMS: {
  key: ReferralTab;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: 'dataMasuk', label: 'Rujukan Masuk', icon: FileInput },
  { key: 'dataKeluar', label: 'Rujukan Keluar', icon: FileOutput },
  { key: 'riwayat', label: 'Riwayat Rujukan', icon: History },
];

export default function PatientSectionContainer({
  initialData = [],
  defaultTab = 'dataMasuk',
  onOpenCreateModal,
  onSaveRujukanMasuk,
}: {
  initialData?: ReferralItem[];
  defaultTab?: ReferralTab;
  onOpenCreateModal?: (tipe: 'masuk' | 'keluar') => void;
  onSaveRujukanMasuk?: (payload: RujukanMasukFormPayload) => Promise<void> | void;
}) {
  const [activeTab, setActiveTab] = useState<ReferralTab>(defaultTab);
  const [referrals, setReferrals] = useState<ReferralItem[]>(initialData);
  const [isModalMasukOpen, setIsModalMasukOpen] = useState<boolean>(false);

  const { masukData, keluarData, riwayatData, rujukanBalikCount } = useMemo(() => {
    const masuk = referrals.filter((item) => item.tipe === 'masuk');
    const keluar = referrals.filter((item) => item.tipe === 'keluar');
    const riwayat = referrals.filter(
      (item) => item.status === 'selesai' || item.status === 'ditolak',
    );
    const rujukanBalik = referrals.filter((item) => item.isRujukanBalik).length;

    return {
      masukData: masuk,
      keluarData: keluar,
      riwayatData: riwayat,
      rujukanBalikCount: rujukanBalik,
    };
  }, [referrals]);

  const tabCounts: Record<ReferralTab, number> = {
    dataMasuk: masukData.length,
    dataKeluar: keluarData.length,
    riwayat: riwayatData.length,
  };

  // Setiap perpindahan tab ke Rujukan Masuk, modal otomatis tampil
  const handleTabChange = (tab: ReferralTab) => {
    setActiveTab(tab);
    if (tab === 'dataMasuk') {
      setIsModalMasukOpen(true);
    }
  };

  // Handler ketika tombol "Buat Rujukan Masuk" / "Buat Rujukan Keluar" diklik
  const handleTriggerCreateModal = (tipe: 'masuk' | 'keluar') => {
    if (tipe === 'masuk') {
      setIsModalMasukOpen(true);
    }
    onOpenCreateModal?.(tipe);
  };

  // Handler submit modal Catat Rujukan Masuk
  const handleSubmitRujukanMasuk = async (payload: RujukanMasukFormPayload) => {
    await onSaveRujukanMasuk?.(payload);

    const newItem: ReferralItem = {
      id: `ruj-${Date.now()}`,
      nomorRujukan: payload.nomorSuratAsal || `RM-${Date.now().toString().slice(-6)}`,
      tipe: 'masuk',
      namaPasien: payload.pasienQuery || 'Pasien Baru',
      nomorRM: '-',
      fasilitasPerujuk: payload.fasilitasPengirim || '-',
      fasilitasTujuan: payload.unitPenerima,
      diagnosis: payload.alasanSesuaiSurat || payload.tujuanLayanan || '-',
      tanggalRujukan: payload.tanggalDiterima || payload.tanggalSurat || '-',
      status: 'menunggu',
      catatan: payload.catatanAdministratif,
    };

    setReferrals((prev) => [newItem, ...prev]);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700">
      {/* Top Segmented Tabs */}
      <div
        role="tablist"
        aria-label="Navigasi Rujukan Pasien"
        className="grid grid-cols-1 sm:grid-cols-3 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80"
      >
        {TAB_ITEMS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const badgeCount = tabCounts[tab.key];

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.key)}
              className={`relative flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#f0f9fb] text-[#008ba6] font-bold'
                  : 'bg-white text-slate-500 font-semibold hover:bg-slate-50/80 hover:text-slate-700'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-[#009bb8]' : 'text-slate-400'
                }`}
              />
              <span>{tab.label}</span>
              <span
                className={`ml-0.5 px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                  isActive
                    ? 'bg-cyan-100/80 text-[#007b94]'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {badgeCount}
              </span>

              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#009bb8]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Metric Kanan Atas: Rujukan Balik Tertaut */}
      <div className="flex items-center justify-end gap-2 my-3.5 px-1">
        <span className="text-xs font-semibold text-slate-600">
          Rujukan balik tertaut
        </span>
        <span className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-xs font-bold flex items-center justify-center">
          {rujukanBalikCount}
        </span>
      </div>

      {/* Konten Tab Aktif */}
      {activeTab === 'dataMasuk' ? (
        <RujukanMasuk
          activeTab={activeTab}
          onTabChange={handleTabChange}
          data={masukData}
          onOpenCreateModal={handleTriggerCreateModal}
        />
      ) : activeTab === 'dataKeluar' ? (
        <RujukanKeluar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          data={keluarData}
          onOpenCreateModal={handleTriggerCreateModal}
        />
      ) : (
        <RiwayatRujukan
          activeTab={activeTab}
          onTabChange={handleTabChange}
          data={riwayatData}
        />
      )}

      {/* Modal Catat Rujukan Masuk */}
      <ModalCatatRujukanMasuk
        isOpen={isModalMasukOpen}
        onClose={() => setIsModalMasukOpen(false)}
        onSubmit={handleSubmitRujukanMasuk}
      />
    </div>
  );
}