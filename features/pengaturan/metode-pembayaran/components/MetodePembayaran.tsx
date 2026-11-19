'use client';

import React, { useRef, useState } from 'react';
import { ImagePlus, QrCode, Save, Trash2 } from 'lucide-react';

export interface BankTransferConfig {
  active: boolean;
  methodName: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  patientInstructions: string;
}

export interface DebitEdcConfig {
  active: boolean;
  methodName: string;
  merchantName: string;
  edcTerminalId: string;
  patientInstructions: string;
}

export interface QrisConfig {
  active: boolean;
  methodName: string;
  merchantName: string;
  merchantId: string;
  patientInstructions: string;
  qrisImageUrl: string | null;
  qrisFileName: string | null;
}

export interface PaymentMethodsSettings {
  bankTransfer: BankTransferConfig;
  debitEdc: DebitEdcConfig;
  qris: QrisConfig;
}

const DEFAULT_QRIS_POSTER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="310" viewBox="0 0 220 310">
  <rect width="220" height="310" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <rect x="74" y="10" width="72" height="14" rx="4" fill="#dc2626"/>
  <text x="110" y="20" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="#ffffff">HANYA CONTOH</text>
  <text x="20" y="42" font-family="sans-serif" font-size="14" font-weight="900" fill="#0f172a">QRIS</text>
  <text x="58" y="37" font-family="sans-serif" font-size="5.5" font-weight="bold" fill="#475569">QR Code Standar</text>
  <text x="58" y="44" font-family="sans-serif" font-size="5.5" font-weight="bold" fill="#475569">Pembayaran Nasional</text>
  <polygon points="184,26 196,42 184,42" fill="#dc2626"/>
  <text x="190" y="50" text-anchor="middle" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#1e3a8a">GPN</text>
  <text x="110" y="68" text-anchor="middle" font-family="sans-serif" font-size="7.5" font-weight="800" fill="#0f172a">TARAMEDIC HEALTHCARE INDONESIA</text>
  <text x="110" y="79" text-anchor="middle" font-family="monospace" font-size="6.5" fill="#475569">NMID : ID1023245789123</text>
  <text x="110" y="88" text-anchor="middle" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#334155">A01</text>
  <polygon points="0,120 34,155 0,190" fill="#dc2626"/>
  <polygon points="220,245 220,310 155,310" fill="#dc2626"/>
  <rect x="48" y="96" width="124" height="124" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
  <g fill="#0f172a">
    <rect x="56" y="104" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="4"/>
    <rect x="63" y="111" width="12" height="12"/>
    <rect x="138" y="104" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="4"/>
    <rect x="145" y="111" width="12" height="12"/>
    <rect x="56" y="186" width="26" height="26" fill="none" stroke="#0f172a" stroke-width="4"/>
    <rect x="63" y="193" width="12" height="12"/>
    <rect x="92" y="106" width="8" height="8"/><rect x="108" y="106" width="8" height="16"/><rect x="122" y="112" width="8" height="8"/>
    <rect x="90" y="128" width="14" height="8"/><rect x="112" y="130" width="10" height="10"/><rect x="132" y="136" width="12" height="8"/>
    <rect x="60" y="142" width="12" height="8"/><rect x="80" y="146" width="16" height="10"/><rect x="104" y="148" width="14" height="14"/>
    <rect x="128" y="152" width="12" height="12"/><rect x="148" y="146" width="14" height="10"/>
    <rect x="62" y="162" width="16" height="8"/><rect x="88" y="168" width="10" height="12"/><rect x="108" y="170" width="18" height="8"/>
    <rect x="136" y="172" width="10" height="14"/><rect x="152" y="168" width="10" height="10"/>
    <rect x="92" y="188" width="12" height="12"/><rect x="112" y="192" width="10" height="16"/><rect x="132" y="194" width="14" height="10"/>
    <rect x="150" y="190" width="12" height="18"/>
  </g>
  <text x="110" y="236" text-anchor="middle" font-family="sans-serif" font-size="6.5" font-weight="800" fill="#0f172a">SATU QRIS UNTUK SEMUA</text>
  <text x="110" y="245" text-anchor="middle" font-family="sans-serif" font-size="5.5" fill="#475569">Cek aplikasi penyelenggara</text>
  <text x="110" y="252" text-anchor="middle" font-family="sans-serif" font-size="5.5" fill="#475569">di: www.aspi-qris.id</text>
  <text x="18" y="290" font-family="sans-serif" font-size="5" fill="#64748b">Dicetak oleh: 93600815</text>
  <text x="18" y="297" font-family="sans-serif" font-size="5" fill="#64748b">Versi Cetak : 1.0-2024.12.10</text>
</svg>
`)}`;

const DEFAULT_PAYMENT_SETTINGS: PaymentMethodsSettings = {
  bankTransfer: {
    active: true,
    methodName: 'Transfer bank',
    bankName: 'Bank Mandiri',
    accountHolderName: 'Tarmedic Healthcare Indonesia',
    accountNumber: '950221081115',
    patientInstructions: '',
  },
  debitEdc: {
    active: true,
    methodName: 'Kartu debit',
    merchantName: 'Bank Mandiri',
    edcTerminalId: '1234567',
    patientInstructions: '',
  },
  qris: {
    active: true,
    methodName: 'QRIS',
    merchantName: 'Bank Mandiri',
    merchantId: '124456',
    patientInstructions: '',
    qrisImageUrl: DEFAULT_QRIS_POSTER_SVG,
    qrisFileName: '196395.jpg',
  },
};

const MAX_QRIS_FILE_BYTES = 5 * 1024 * 1024; // 5 MiB

export default function PengaturanMetodePembayaran({
  initialSettings = DEFAULT_PAYMENT_SETTINGS,
  onSaveSettings,
}: {
  initialSettings?: PaymentMethodsSettings;
  onSaveSettings?: (
    settings: PaymentMethodsSettings,
    qrisFile?: File | null,
  ) => void;
}) {
  const [settings, setSettings] =
    useState<PaymentMethodsSettings>(initialSettings);
  const [selectedQrisFile, setSelectedQrisFile] = useState<File | null>(null);
  const [qrisUploadError, setQrisUploadError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectQrisFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setQrisUploadError('Format file harus PNG, JPEG, atau WebP.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_QRIS_FILE_BYTES) {
      setQrisUploadError('Ukuran file maksimal 5 MiB.');
      e.target.value = '';
      return;
    }

    setQrisUploadError(null);
    setSelectedQrisFile(file);

    const previewUrl = URL.createObjectURL(file);
    setSettings((prev) => ({
      ...prev,
      qris: {
        ...prev.qris,
        qrisImageUrl: previewUrl,
        qrisFileName: file.name,
      },
    }));
    e.target.value = '';
  };

  const handleRemoveQris = () => {
    setSelectedQrisFile(null);
    setQrisUploadError(null);
    setSettings((prev) => ({
      ...prev,
      qris: {
        ...prev.qris,
        qrisImageUrl: null,
        qrisFileName: null,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings?.(settings, selectedQrisFile);
    setSaveNotice('Pengaturan metode pembayaran berhasil disimpan.');
    setTimeout(() => {
      setSaveNotice(null);
    }, 3500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full font-sans text-slate-700 space-y-5"
    >
      {/* =====================================================================
          1. GRID ATAS 2 KOLOM: TRANSFER BANK & KARTU DEBIT / EDC
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* -------------------------------------------------------------------
            KARTU 1: TRANSFER BANK
           ------------------------------------------------------------------- */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header Kartu + Checkbox Aktif */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-extrabold text-[#0f3d56]">
                Transfer bank
              </h2>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.bankTransfer.active}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      bankTransfer: {
                        ...prev.bankTransfer,
                        active: e.target.checked,
                      },
                    }))
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#0077b6] focus:ring-[#009bb8]"
                />
                <span>Aktif</span>
              </label>
            </div>

            {/* Form Inputs */}
            <div className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="bank-method-name"
                    className="block font-bold text-slate-500 mb-1.5"
                  >
                    Nama metode
                  </label>
                  <input
                    id="bank-method-name"
                    type="text"
                    value={settings.bankTransfer.methodName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        bankTransfer: {
                          ...prev.bankTransfer,
                          methodName: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bank-name"
                    className="block font-bold text-slate-500 mb-1.5"
                  >
                    Nama bank
                  </label>
                  <input
                    id="bank-name"
                    type="text"
                    value={settings.bankTransfer.bankName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        bankTransfer: {
                          ...prev.bankTransfer,
                          bankName: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="bank-account-holder"
                    className="block font-bold text-slate-500 mb-1.5"
                  >
                    Nama pemilik rekening
                  </label>
                  <input
                    id="bank-account-holder"
                    type="text"
                    value={settings.bankTransfer.accountHolderName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        bankTransfer: {
                          ...prev.bankTransfer,
                          accountHolderName: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bank-account-number"
                    className="block font-bold text-slate-500 mb-1.5"
                  >
                    Nomor rekening
                  </label>
                  <input
                    id="bank-account-number"
                    type="text"
                    value={settings.bankTransfer.accountNumber}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        bankTransfer: {
                          ...prev.bankTransfer,
                          accountNumber: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="bank-patient-instructions"
                  className="block font-bold text-slate-500 mb-1.5"
                >
                  Petunjuk untuk pasien (opsional)
                </label>
                <textarea
                  id="bank-patient-instructions"
                  rows={3}
                  value={settings.bankTransfer.patientInstructions}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      bankTransfer: {
                        ...prev.bankTransfer,
                        patientInstructions: e.target.value,
                      },
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------
            KARTU 2: KARTU DEBIT / EDC
           ------------------------------------------------------------------- */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header Kartu + Checkbox Aktif */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-extrabold text-[#0f3d56]">
                Kartu debit / EDC
              </h2>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.debitEdc.active}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      debitEdc: {
                        ...prev.debitEdc,
                        active: e.target.checked,
                      },
                    }))
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#0077b6] focus:ring-[#009bb8]"
                />
                <span>Aktif</span>
              </label>
            </div>

            {/* Form Inputs */}
            <div className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="edc-method-name"
                    className="block font-bold text-slate-500 mb-1.5"
                  >
                    Nama metode
                  </label>
                  <input
                    id="edc-method-name"
                    type="text"
                    value={settings.debitEdc.methodName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        debitEdc: {
                          ...prev.debitEdc,
                          methodName: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edc-merchant-name"
                    className="block font-bold text-slate-500 mb-1.5"
                  >
                    Nama merchant
                  </label>
                  <input
                    id="edc-merchant-name"
                    type="text"
                    value={settings.debitEdc.merchantName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        debitEdc: {
                          ...prev.debitEdc,
                          merchantName: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="edc-terminal-id"
                    className="block font-bold text-slate-500 mb-1.5"
                  >
                    ID terminal EDC
                  </label>
                  <input
                    id="edc-terminal-id"
                    type="text"
                    value={settings.debitEdc.edcTerminalId}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        debitEdc: {
                          ...prev.debitEdc,
                          edcTerminalId: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edc-patient-instructions"
                  className="block font-bold text-slate-500 mb-1.5"
                >
                  Petunjuk untuk pasien (opsional)
                </label>
                <textarea
                  id="edc-patient-instructions"
                  rows={3}
                  value={settings.debitEdc.patientInstructions}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      debitEdc: {
                        ...prev.debitEdc,
                        patientInstructions: e.target.value,
                      },
                    }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================================
          2. KARTU QRIS & UPLOAD KODE QRIS RESMI
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] p-5 sm:p-6">
        {/* Header Kartu + Checkbox Aktif */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-[#0f3d56]">QRIS</h2>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.qris.active}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  qris: {
                    ...prev.qris,
                    active: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 rounded border-slate-300 text-[#0077b6] focus:ring-[#009bb8]"
            />
            <span>Aktif</span>
          </label>
        </div>

        {/* Form Fields QRIS */}
        <div className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="qris-method-name"
                className="block font-bold text-slate-500 mb-1.5"
              >
                Nama metode
              </label>
              <input
                id="qris-method-name"
                type="text"
                value={settings.qris.methodName}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    qris: {
                      ...prev.qris,
                      methodName: e.target.value,
                    },
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>

            <div>
              <label
                htmlFor="qris-merchant-name"
                className="block font-bold text-slate-500 mb-1.5"
              >
                Nama merchant
              </label>
              <input
                id="qris-merchant-name"
                type="text"
                value={settings.qris.merchantName}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    qris: {
                      ...prev.qris,
                      merchantName: e.target.value,
                    },
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="qris-merchant-id"
                className="block font-bold text-slate-500 mb-1.5"
              >
                ID merchant (opsional)
              </label>
              <input
                id="qris-merchant-id"
                type="text"
                value={settings.qris.merchantId}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    qris: {
                      ...prev.qris,
                      merchantId: e.target.value,
                    },
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium tabular-nums text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="qris-patient-instructions"
              className="block font-bold text-slate-500 mb-1.5"
            >
              Petunjuk untuk pasien (opsional)
            </label>
            <textarea
              id="qris-patient-instructions"
              rows={3}
              value={settings.qris.patientInstructions}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  qris: {
                    ...prev.qris,
                    patientInstructions: e.target.value,
                  },
                }))
              }
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-[#0f3d56] focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
            />
          </div>
        </div>

        {/* Sub-Panel Kode Qris Resmi */}
        <div className="mt-4 rounded-xl border border-slate-200/90 bg-slate-50/40 p-4 sm:p-5">
          <div>
            <h3 className="text-xs sm:text-[13px] font-extrabold text-[#0f3d56]">
              Kode Qris Resmi
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Gambar ini ditampilkan di dialog &ldquo;Lihat QR&rdquo; Kasir.
              Gunakan file QRIS klinik yang resmi.
            </p>
          </div>

          {/* Box Preview Gambar QRIS */}
          <div className="mt-3.5 rounded-xl border border-slate-200/80 bg-white p-4 flex items-center justify-center min-h-[250px]">
            {settings.qris.qrisImageUrl ? (
              <img
                src={settings.qris.qrisImageUrl}
                alt="Kode QRIS Resmi Klinik"
                className="max-h-60 w-auto object-contain rounded"
              />
            ) : (
              <div className="text-center py-8 text-slate-400">
                <QrCode className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-500">
                  Belum ada file gambar QRIS resmi yang diunggah
                </p>
                <p className="text-[11px] mt-0.5">
                  Klik tombol di bawah untuk memilih gambar QRIS klinik.
                </p>
              </div>
            )}
          </div>

          {/* Nama File Tersimpan */}
          {settings.qris.qrisFileName && (
            <p className="text-[11px] text-slate-500 mt-2.5">
              Tersimpan: {settings.qris.qrisFileName}
            </p>
          )}

          {/* Action Bar: Ganti QRIS, Hapus & Info Format */}
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleSelectQrisFile}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 font-semibold text-[#0f3d56] hover:text-[#008ba6] transition-colors cursor-pointer"
            >
              <ImagePlus className="w-4 h-4 text-slate-500" />
              <span>
                {settings.qris.qrisImageUrl ? 'Ganti QRIS' : 'Unggah QRIS'}
              </span>
            </button>

            {settings.qris.qrisImageUrl && (
              <button
                type="button"
                onClick={handleRemoveQris}
                className="inline-flex items-center gap-1.5 font-semibold text-[#0f3d56] hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-slate-500" />
                <span>Hapus</span>
              </button>
            )}

            <span className="text-[11px] text-slate-400">
              PNG, JPEG, WebP &middot; maks. 5 MiB &middot; tersimpan privat.
            </span>
          </div>

          {qrisUploadError && (
            <p className="text-[11px] font-semibold text-rose-600 mt-2">
              {qrisUploadError}
            </p>
          )}
        </div>
      </section>

      {/* =====================================================================
          3. FOOTER TOMBOL SIMPAN METODE PEMBAYARAN
         ===================================================================== */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
        {saveNotice && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2">
            {saveNotice}
          </span>
        )}

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0077b6] hover:bg-[#00669e] active:bg-[#005787] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Simpan metode pembayaran</span>
        </button>
      </div>
    </form>
  );
}