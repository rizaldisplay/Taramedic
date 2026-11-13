'use client';

import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Clipboard,
  ClipboardCheck,
  Info,
  Loader2,
  Maximize2,
  RotateCcw,
  Volume2,
} from 'lucide-react';

export type DisplayMode = 'tv' | 'preview';

export interface UnitOption {
  value: string;
  label: string;
}

export interface QueueDisplayConfig {
  unitId: string;
  displayMode: DisplayMode;
  autoFullScreen: boolean;
  showAudioReminder: boolean;
  showDoctorSchedule: boolean;
}

const DEFAULT_UNITS: UnitOption[] = [
  { value: 'all', label: 'Semua Unit' },
  { value: 'POLI-UMUM', label: 'Poli Umum' },
  { value: 'POLI-ANAK', label: 'Poli Anak' },
  { value: 'POLI-GIGI', label: 'Poli Gigi' },
  { value: 'POLI-OBGYN', label: 'Poli Kandungan' },
];

const DEFAULT_CONFIG: QueueDisplayConfig = {
  unitId: 'all',
  displayMode: 'tv',
  autoFullScreen: false,
  showAudioReminder: false,
  showDoctorSchedule: true,
};

export default function KonfigurasiTampilanAntrean({
  units = DEFAULT_UNITS,
  initialConfig = DEFAULT_CONFIG,
  baseDisplayUrl = 'https://taramedicweb.vercel.app/public/queue-display',
  onSaveConfig,
  onResetTodayQueue,
  onOpenFullScreen,
}: {
  units?: UnitOption[];
  initialConfig?: QueueDisplayConfig;
  baseDisplayUrl?: string;
  onSaveConfig?: (config: QueueDisplayConfig) => Promise<void> | void;
  onResetTodayQueue?: (unitId: string) => Promise<void> | void;
  onOpenFullScreen?: (url: string, config: QueueDisplayConfig) => void;
}) {
  const [config, setConfig] = useState<QueueDisplayConfig>(initialConfig);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedUnitLabel = useMemo(() => {
    return (
      units.find((u) => u.value === config.unitId)?.label ?? 'Semua Unit'
    );
  }, [units, config.unitId]);

  const displayUrl = useMemo(() => {
    if (config.unitId === 'all') return baseDisplayUrl;
    const separator = baseDisplayUrl.includes('?') ? '&' : '?';
    return `${baseDisplayUrl}${separator}unit=${encodeURIComponent(config.unitId)}`;
  }, [baseDisplayUrl, config.unitId]);

  const updateConfig = <K extends keyof QueueDisplayConfig>(
    key: K,
    value: QueueDisplayConfig[K],
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSaveConfig?.(config);
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetQueue = async () => {
    try {
      setIsResetting(true);
      await onResetTodayQueue?.(config.unitId);
    } finally {
      setIsResetting(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = displayUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full h-full font-sans text-slate-700">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 items-start">
        {/* KOLOM KIRI: KONFIGURASI TAMPILAN */}
        <section className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <h2 className="text-base sm:text-lg font-bold text-[#0f3d56] mb-5">
            Konfigurasi Tampilan
          </h2>

          <form onSubmit={handleSave}>
            {/* Pilih Unit Layanan */}
            <div className="mb-5">
              <label
                htmlFor="pilih-unit-layanan"
                className="block text-xs font-bold text-slate-600 mb-2"
              >
                Pilih Unit Layanan
              </label>
              <div className="relative max-w-[440px]">
                <select
                  id="pilih-unit-layanan"
                  value={config.unitId}
                  onChange={(e) => updateConfig('unitId', e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Mode Tampilan */}
            <div className="mb-5">
              <span className="block text-xs font-bold text-slate-600 mb-2.5">
                Mode Tampilan
              </span>
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="displayMode"
                    value="tv"
                    checked={config.displayMode === 'tv'}
                    onChange={() => updateConfig('displayMode', 'tv')}
                    className="w-4 h-4 accent-[#009bb8] cursor-pointer"
                  />
                  <span>Mode TV (tanpa Kontrol Pratinjau)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="displayMode"
                    value="preview"
                    checked={config.displayMode === 'preview'}
                    onChange={() => updateConfig('displayMode', 'preview')}
                    className="w-4 h-4 accent-[#009bb8] cursor-pointer"
                  />
                  <span>Mode Pratinjau (dengan Kontrol Petugas)</span>
                </label>
              </div>
            </div>

            {/* Opsi Perilaku Layar */}
            <div className="space-y-2.5 mb-6">
              <label className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.autoFullScreen}
                  onChange={(e) =>
                    updateConfig('autoFullScreen', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 accent-[#009bb8] cursor-pointer"
                />
                <span>Aktifkan Full Screen saat layar dibuka</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.showAudioReminder}
                  onChange={(e) =>
                    updateConfig('showAudioReminder', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 accent-[#009bb8] cursor-pointer"
                />
                <span>Tampilkan pengingat aktivasi suara panggilan</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.showDoctorSchedule}
                  onChange={(e) =>
                    updateConfig('showDoctorSchedule', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 accent-[#009bb8] cursor-pointer"
                />
                <span>Tampilkan jadwal dokter (jika tersedia)</span>
              </label>
            </div>

            {/* Tombol Simpan & Status Perubahan */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Simpan Konfigurasi</span>
              </button>

              {hasUnsavedChanges ? (
                <span className="text-xs text-slate-500">
                  Perubahan belum disimpan.
                </span>
              ) : (
                <span className="text-xs text-[#008ba6] font-semibold">
                  Konfigurasi tersimpan.
                </span>
              )}
            </div>
          </form>

          {/* Info Callout Box */}
          <div className="rounded-lg bg-[#f0f9fb] border border-cyan-200/70 p-3.5 mb-5">
            <Info className="w-3.5 h-3.5 text-[#008ba6] mb-1.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Pengaturan disimpan di server per unit dan digunakan perangkat
              yang sudah diaktivasi. Browser tetap meminta interaksi petugas
              untuk mengaktifkan Full Screen atau suara.
            </p>
          </div>

          {/* Tombol Reset Antrean Hari Ini */}
          <div>
            <button
              type="button"
              onClick={handleResetQueue}
              disabled={isResetting}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#fffafa] hover:bg-rose-50 active:bg-rose-100/70 disabled:opacity-60 border border-rose-200/90 text-rose-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {isResetting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-700" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5 text-rose-700" />
              )}
              <span>Reset antrean hari ini</span>
            </button>
          </div>
        </section>

        {/* KOLOM KANAN: PRATINJAU & TAUTAN MONITOR */}
        <aside className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <h2 className="text-base sm:text-lg font-bold text-[#0f3d56] mb-4">
            Pratinjau &amp; Tautan Monitor
          </h2>

          {/* Box Unit yang Dipilih */}
          <div className="rounded-lg bg-[#f8fafc] border border-slate-200/80 p-3.5 mb-4">
            <p className="text-xs font-semibold text-slate-500">
              Unit yang Dipilih
            </p>
            <p className="text-sm font-bold text-[#008ba6] mt-1">
              {selectedUnitLabel}
            </p>
          </div>

          {/* Mini Live Preview Monitor */}
          <div className="rounded-xl border border-slate-200/90 bg-[#f8fafc] p-2.5 mb-4 max-h-[275px] overflow-y-auto relative">
            {/* Bar Kontrol Pratinjau Mengambang */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-2.5 flex items-center justify-between gap-2 relative z-10">
              <span className="text-xs font-bold text-slate-800 leading-snug pl-1">
                {config.displayMode === 'preview'
                  ? 'Pratinjau (dengan kontrol)'
                  : 'Pratinjau (mode TV)'}
              </span>
              <button
                type="button"
                onClick={() =>
                  onOpenFullScreen
                    ? onOpenFullScreen(displayUrl, config)
                    : window.open(displayUrl, '_blank', 'noopener,noreferrer')
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Aktifkan Full Screen</span>
              </button>
            </div>

            {/* Sub-header Simulasi Layar TV */}
            <div className="flex items-center justify-between px-2 pt-2.5 pb-2 text-[9px] text-slate-400 select-none">
              <span className="font-bold tracking-wider uppercase text-slate-400">
                TARAMEDIC · {selectedUnitLabel}
              </span>
              <span>
                {new Date().toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Kartu Gradient Cyan "Sedang Dipanggil" */}
            <div className="rounded-2xl bg-gradient-to-br from-[#00b4cc] via-[#009bb8] to-[#00748f] p-6 text-white flex flex-col items-center justify-center min-h-[155px] relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>Sedang Dipanggil</span>
                <span className="w-7 h-[1.5px] bg-white/75 inline-block ml-1" />
              </div>

              {/* Placeholder Nomor Antrean */}
              <div className="w-16 h-3 bg-white rounded-[2px] mt-7 shadow-xs" />

              {/* Indikator Tambahan Sesuai Opsi Checkbox */}
              {(config.showDoctorSchedule || config.showAudioReminder) && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
                  {config.showDoctorSchedule && (
                    <span className="px-2 py-0.5 rounded-full bg-white/15 text-[9px] font-medium text-white/95">
                      Jadwal Dokter Aktif
                    </span>
                  )}
                  {config.showAudioReminder && (
                    <span className="px-2 py-0.5 rounded-full bg-white/15 text-[9px] font-medium text-white/95">
                      Pengingat Suara
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Box URL Tautan Monitor */}
          <div className="rounded-lg bg-[#f8fafc] border border-slate-200/80 p-3 mb-3">
            <p className="text-xs text-slate-600 break-all leading-relaxed">
              {displayUrl}
            </p>
          </div>

          {/* Tombol Salin Tautan Layar */}
          <button
            type="button"
            onClick={handleCopyUrl}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-[#f0f9fb] active:bg-cyan-50/70 border border-slate-200 hover:border-[#009bb8]/40 rounded-lg text-xs font-bold text-slate-700 hover:text-[#008ba6] transition-colors cursor-pointer mb-3.5"
          >
            {copied ? (
              <>
                <ClipboardCheck className="w-4 h-4 text-[#008ba6]" />
                <span className="text-[#008ba6]">Tautan Tersalin</span>
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4 text-slate-500" />
                <span>Salin Tautan Layar</span>
              </>
            )}
          </button>

          {/* Keterangan Bawah */}
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Tautan membuka layar aktivasi perangkat. Setelah dipasang, layar
            mengambil unit dan konfigurasi tersimpan dari server.
          </p>
        </aside>
      </div>
    </div>
  );
}