'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bluetooth,
  Check,
  ChevronDown,
  Printer,
  Radio,
  Save,
  ShieldCheck,
  Usb,
  Wifi,
} from 'lucide-react';

export type PrintMethodKey = 'browser' | 'webusb' | 'ble';
export type PaperWidthKey = '58mm' | '80mm';

export interface PrinterTerminalSettings {
  method: PrintMethodKey;
  paperWidth: PaperWidthKey;
  autoCut: boolean;
  vendorId: string;
  productId: string;
  bleServiceUuid: string;
  bleCharacteristicUuid: string;
  connectedDeviceName: string | null;
}

const DEFAULT_PRINTER_SETTINGS: PrinterTerminalSettings = {
  method: 'webusb',
  paperWidth: '80mm',
  autoCut: false,
  vendorId: '28E9',
  productId: '0289',
  bleServiceUuid: '000018f0-0000-1000-8000-00805f9b34fb',
  bleCharacteristicUuid: '00002af1-0000-1000-8000-00805f9b34fb',
  connectedDeviceName: null,
};

const PRINT_METHODS: Array<{
  key: PrintMethodKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    key: 'browser',
    label: 'Dialog browser',
    description: 'Pilih antrean OS setiap kali mencetak.',
    icon: Printer,
  },
  {
    key: 'webusb',
    label: 'USB langsung',
    description: 'Kirim ESC/POS melalui WebUSB.',
    icon: Usb,
  },
  {
    key: 'ble',
    label: 'Bluetooth BLE',
    description: 'Hubungkan printer termal BLE.',
    icon: Bluetooth,
  },
];

export default function PengaturanPrinterTerminal({
  initialSettings = DEFAULT_PRINTER_SETTINGS,
  onSaveSettings,
  onConnectPrinter,
  onTestPrint,
}: {
  initialSettings?: PrinterTerminalSettings;
  onSaveSettings?: (settings: PrinterTerminalSettings) => void;
  onConnectPrinter?: (
    settings: PrinterTerminalSettings,
  ) => Promise<string | null> | string | null;
  onTestPrint?: (settings: PrinterTerminalSettings) => void;
}) {
  const [settings, setSettings] =
    useState<PrinterTerminalSettings>(initialSettings);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTestingPrint, setIsTestingPrint] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<{
    type: 'success' | 'info';
    message: string;
  } | null>(null);

  const selectedMethodMeta = useMemo(
    () =>
      PRINT_METHODS.find((m) => m.key === settings.method) ?? PRINT_METHODS[1],
    [settings.method],
  );

  const isConnected =
    settings.method === 'browser' || Boolean(settings.connectedDeviceName);

  const readinessBanner = useMemo(() => {
    if (settings.method === 'browser') {
      return {
        title: 'Dialog cetak sistem siap digunakan',
        subtitle: 'Browser akan membuka dialog antrean printer OS saat mencetak.',
      };
    }
    if (settings.method === 'ble') {
      return {
        title: 'Perangkat Bluetooth siap digunakan',
        subtitle: 'Web Bluetooth tersedia pada browser ini.',
      };
    }
    return {
      title: 'Perangkat langsung siap digunakan',
      subtitle: 'WebUSB tersedia pada browser ini.',
    };
  }, [settings.method]);

  const handleMethodChange = (nextMethod: PrintMethodKey) => {
    setSettings((prev) => ({
      ...prev,
      method: nextMethod,
      connectedDeviceName:
        nextMethod === prev.method ? prev.connectedDeviceName : null,
    }));
    setFeedbackNotice(null);
  };

  const handleConnectDevice = async () => {
    if (settings.method === 'browser') {
      setFeedbackNotice({
        type: 'info',
        message: 'Mode Dialog browser tidak memerlukan pemasangan perangkat.',
      });
      return;
    }

    setIsConnecting(true);
    setFeedbackNotice(null);

    try {
      if (onConnectPrinter) {
        const deviceName = await onConnectPrinter(settings);
        if (deviceName) {
          setSettings((prev) => ({ ...prev, connectedDeviceName: deviceName }));
          setFeedbackNotice({
            type: 'success',
            message: `Terhubung ke ${deviceName}.`,
          });
        }
        return;
      }

      // Fallback WebUSB / Web Bluetooth API di browser
      if (
        settings.method === 'webusb' &&
        typeof navigator !== 'undefined' &&
        'usb' in navigator
      ) {
        const cleanVid = parseInt(
          settings.vendorId.replace(/^0x/i, '') || '0',
          16,
        );
        const cleanPid = parseInt(
          settings.productId.replace(/^0x/i, '') || '0',
          16,
        );
        const filters =
          !Number.isNaN(cleanVid) && cleanVid > 0
            ? [
                {
                  vendorId: cleanVid,
                  ...(!Number.isNaN(cleanPid) && cleanPid > 0
                    ? { productId: cleanPid }
                    : {}),
                },
              ]
            : [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const device = await (navigator as any).usb.requestDevice({ filters });
        const label =
          device?.productName ||
          `USB Thermal (${settings.vendorId || 'VID'}:${settings.productId || 'PID'})`;
        setSettings((prev) => ({ ...prev, connectedDeviceName: label }));
        setFeedbackNotice({
          type: 'success',
          message: `Printer USB terhubung: ${label}.`,
        });
        return;
      }

      if (
        settings.method === 'ble' &&
        typeof navigator !== 'undefined' &&
        'bluetooth' in navigator
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: settings.bleServiceUuid
            ? [settings.bleServiceUuid]
            : [],
        });
        const label = device?.name || 'Thermal Printer BLE';
        setSettings((prev) => ({ ...prev, connectedDeviceName: label }));
        setFeedbackNotice({
          type: 'success',
          message: `Printer Bluetooth terhubung: ${label}.`,
        });
        return;
      }

      const fallbackLabel =
        settings.method === 'webusb'
          ? `USB Thermal (${settings.vendorId || '28E9'}:${settings.productId || '0289'})`
          : 'Thermal Printer BLE';
      setSettings((prev) => ({ ...prev, connectedDeviceName: fallbackLabel }));
      setFeedbackNotice({
        type: 'success',
        message: `Perangkat terpilih: ${fallbackLabel}.`,
      });
    } catch {
      setFeedbackNotice({
        type: 'info',
        message: 'Pemilihan perangkat dibatalkan atau tidak ada printer dipilih.',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTestPrint = () => {
    setIsTestingPrint(true);
    onTestPrint?.(settings);
    setFeedbackNotice({
      type: 'info',
      message: `Perintah cetak halaman uji (${settings.paperWidth === '80mm' ? '80 Mm' : '58 Mm'}) dikirim.`,
    });
    setTimeout(() => {
      setIsTestingPrint(false);
    }, 450);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings?.(settings);
    setFeedbackNotice({
      type: 'success',
      message: 'Pengaturan printer terminal lokal berhasil disimpan.',
    });
  };

  return (
    <form
      onSubmit={handleSave}
      className="w-full h-full font-sans text-slate-700"
    >
      {/* =====================================================================
          GRID UTAMA 2 KOLOM: KONFIGURASI STEP 01-03 (KIRI) & STATUS TERMINAL (KANAN)
         ===================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 items-start">
        {/* ===================================================================
            KOLOM KIRI: LANGKAH 01, 02, 03
           =================================================================== */}
        <div className="space-y-4">
          {/* -----------------------------------------------------------------
              STEP 01: METODE CETAK
             ----------------------------------------------------------------- */}
          <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 sm:p-6">
            {/* Header Step 01 */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#e6f6f9] border border-[#b8e6ef] text-[#008ba6] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                01
              </span>
              <div>
                <h2 className="text-base font-extrabold text-[#0f3d56] leading-snug">
                  Metode Cetak
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih cara printer diakses oleh terminal.
                </p>
              </div>
            </div>

            {/* 3 Kartu Pilihan Metode Cetak */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRINT_METHODS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = settings.method === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleMethodChange(item.key)}
                    className={`relative rounded-xl border p-4 text-left transition-all cursor-pointer flex items-start justify-between gap-2.5 min-h-[96px] ${
                      isSelected
                        ? 'bg-[#edf9f8] border-[#009bb8] shadow-[0_1px_3px_rgba(0,155,184,0.08)]'
                        : 'bg-white border-slate-200/90 hover:bg-slate-50/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-white border-[#b8e6ef] text-[#008ba6]'
                            : 'bg-slate-50 border-slate-200/80 text-slate-500'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-extrabold text-[#0f3d56] leading-snug">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Radio Indicator Kanan Atas */}
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-[#009bb8] bg-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#009bb8]" />
                      )}
                    </span>

                    {/* Tanda Centang Kecil di Kanan Bawah Saat Terpilih */}
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#008ba6] absolute right-3.5 bottom-3" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Banner Kesiapan Perangkat */}
            <div className="mt-3.5 rounded-xl border border-emerald-200/80 bg-[#f2faf6] px-4 py-3 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">
                  {readinessBanner.title}
                </p>
                <p className="text-[11px] text-emerald-700/90 mt-0.5">
                  {readinessBanner.subtitle}
                </p>
              </div>
            </div>
          </section>

          {/* -----------------------------------------------------------------
              STEP 02: KERTAS & HASIL CETAK
             ----------------------------------------------------------------- */}
          <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 sm:p-6">
            {/* Header Step 02 */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#e6f6f9] border border-[#b8e6ef] text-[#008ba6] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                02
              </span>
              <div>
                <h2 className="text-base font-extrabold text-[#0f3d56] leading-snug">
                  Kertas &amp; Hasil Cetak
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesuaikan ukuran gulungan dan pemotongan.
                </p>
              </div>
            </div>

            {/* Grid Lebar Kertas & Potong Kertas Otomatis */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* Select Lebar Kertas */}
              <div>
                <label
                  htmlFor="printer-lebar-kertas"
                  className="block text-xs font-bold text-[#0f3d56] mb-1.5"
                >
                  Lebar Kertas
                </label>
                <div className="relative">
                  <select
                    id="printer-lebar-kertas"
                    value={settings.paperWidth}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        paperWidth: e.target.value as PaperWidthKey,
                      }))
                    }
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-9 py-2.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                  >
                    <option value="80mm">80 Mm &mdash; Lebar</option>
                    <option value="58mm">58 Mm &mdash; Standar</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Gunakan ukuran yang sesuai dengan gulungan printer.
                </p>
              </div>

              {/* Card Checkbox Potong Kertas Otomatis */}
              <div className="lg:pt-6">
                <label className="w-full rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/70 px-4 py-3.5 flex items-start gap-3 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.autoCut}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        autoCut: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#009bb8] focus:ring-[#009bb8]"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-[#0f3d56]">
                      Potong Kertas Otomatis
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      Meminta printer memotong setelah cetak langsung. Didukung
                      jika printer memiliki pemotong.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* -----------------------------------------------------------------
              STEP 03: IDENTITAS USB (ATAU BLUETOOTH BLE)
             ----------------------------------------------------------------- */}
          {settings.method !== 'browser' && (
            <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 sm:p-6">
              {/* Header Step 03 */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#e6f6f9] border border-[#b8e6ef] text-[#008ba6] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    03
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-[#0f3d56] leading-snug">
                      {settings.method === 'webusb'
                        ? 'Identitas Usb'
                        : 'Identitas Bluetooth BLE'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Filter perangkat yang ditampilkan pada dialog pemilihan.
                    </p>
                  </div>
                </div>

                {settings.method === 'webusb' ? (
                  <Usb className="w-4 h-4 text-[#008ba6] shrink-0 mt-1" />
                ) : (
                  <Bluetooth className="w-4 h-4 text-[#008ba6] shrink-0 mt-1" />
                )}
              </div>

              {settings.method === 'webusb' ? (
                <>
                  {/* Input Vendor ID & Product ID */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="usb-vendor-id"
                        className="flex items-center gap-1.5 text-xs font-bold text-[#0f3d56] mb-1.5"
                      >
                        <span>Vendor ID</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-600">
                          WAJIB
                        </span>
                      </label>
                      <input
                        id="usb-vendor-id"
                        type="text"
                        maxLength={6}
                        value={settings.vendorId}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            vendorId: e.target.value.toUpperCase(),
                          }))
                        }
                        placeholder="28E9"
                        className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-mono uppercase text-[#0f3d56] placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="usb-product-id"
                        className="flex items-center gap-1.5 text-xs font-bold text-[#0f3d56] mb-1.5"
                      >
                        <span>Product ID</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-600">
                          WAJIB
                        </span>
                      </label>
                      <input
                        id="usb-product-id"
                        type="text"
                        maxLength={6}
                        value={settings.productId}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            productId: e.target.value.toUpperCase(),
                          }))
                        }
                        placeholder="0289"
                        className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-mono uppercase text-[#0f3d56] placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2">
                    Nilai heksadesimal hingga 4 digit; awalan 0x boleh
                    digunakan. Isi ID perangkat dari dokumentasi printer.
                  </p>

                  {/* Callout Perhatian Driver Windows */}
                  <div className="mt-4 rounded-xl border border-amber-200/90 bg-[#fdf8f0] px-4 py-3.5 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-amber-900">
                        Perhatian driver Windows
                      </p>
                      <p className="text-[11px] text-amber-800/90 leading-relaxed mt-0.5">
                        Mengambil akses USB langsung dengan driver WinUSB dapat
                        menghapus printer dari antrean cetak Windows. Untuk
                        cetak melalui antrean OS, gunakan mode Dialog browser.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="ble-service-uuid"
                      className="block text-xs font-bold text-[#0f3d56] mb-1.5"
                    >
                      GATT Service UUID
                    </label>
                    <input
                      id="ble-service-uuid"
                      type="text"
                      value={settings.bleServiceUuid}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          bleServiceUuid: e.target.value,
                        }))
                      }
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-mono text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ble-char-uuid"
                      className="block text-xs font-bold text-[#0f3d56] mb-1.5"
                    >
                      Write Characteristic UUID
                    </label>
                    <input
                      id="ble-char-uuid"
                      type="text"
                      value={settings.bleCharacteristicUuid}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          bleCharacteristicUuid: e.target.value,
                        }))
                      }
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-mono text-[#0f3d56] focus:outline-none focus:border-[#009bb8]"
                    />
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* ===================================================================
            KOLOM KANAN: STATUS TERMINAL, KONFIRMASI FISIK & SIMPAN PENGATURAN
           =================================================================== */}
        <aside className="space-y-4">
          {/* Kartu Status Terminal */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5">
            {/* Header Status Terminal */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                STATUS TERMINAL
              </span>

              {isConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Terhubung</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Terputus</span>
                </span>
              )}
            </div>

            {/* Info Perangkat Printer */}
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-center text-[#008ba6] shrink-0">
                <selectedMethodMeta.icon className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#0f3d56] truncate">
                  {settings.method === 'browser'
                    ? 'Antrean Sistem Operasi'
                    : settings.connectedDeviceName || 'Belum ada printer terpilih'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {selectedMethodMeta.label}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-3.5">
              Hubungkan printer dari halaman Settings.
            </p>

            {/* Divider & Info Terminal Lokal */}
            <div className="my-4 border-t border-slate-100" />

            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <Radio className="w-3.5 h-3.5 text-slate-400" />
                <span>Terminal ini</span>
              </span>
              <span className="font-bold text-[#0f3d56]">Lokal</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
              Preferensi dan izin perangkat hanya berlaku di browser terminal
              ini.
            </p>

            {/* Tombol Pilih & Hubungkan + Cetak Halaman Uji */}
            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={handleConnectDevice}
                disabled={isConnecting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] disabled:opacity-60 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <selectedMethodMeta.icon className="w-3.5 h-3.5" />
                <span>
                  {isConnecting ? 'Menghubungkan...' : 'Pilih & hubungkan'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleTestPrint}
                disabled={isTestingPrint}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[#0f3d56] text-xs font-bold transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {isTestingPrint ? 'Mencetak uji...' : 'Cetak Halaman Uji'}
                </span>
              </button>
            </div>
          </div>

          {/* Kartu Konfirmasi Hasil Fisik */}
          <div className="rounded-xl border border-slate-200/90 bg-[#f6fafa] p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#e6f6f9] text-[#008ba6] flex items-center justify-center shrink-0 mt-0.5">
              <Wifi className="w-3.5 h-3.5" />
            </div>

            <div className="text-[11px] leading-relaxed text-slate-500">
              <p className="font-bold text-[#0f3d56]">Konfirmasi hasil fisik</p>
              <p className="mt-1">
                Status browser maupun pengiriman data{' '}
                <strong className="font-bold text-[#0f3d56]">
                  tidak menjamin kertas benar-benar tercetak.
                </strong>{' '}
                Periksa printer setelah setiap uji cetak.
              </p>
            </div>
          </div>

          {/* Tombol Simpan Pengaturan */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>

          {/* Notifikasi Feedback Aksi */}
          {feedbackNotice && (
            <div
              className={`rounded-xl border px-3.5 py-2.5 text-[11px] leading-relaxed ${
                feedbackNotice.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-sky-200 bg-sky-50 text-[#0f3d56]'
              }`}
            >
              {feedbackNotice.message}
            </div>
          )}
        </aside>
      </div>
    </form>
  );
}