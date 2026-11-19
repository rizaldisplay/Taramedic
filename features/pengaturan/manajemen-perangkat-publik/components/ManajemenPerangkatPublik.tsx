/* eslint-disable react-hooks/purity */
'use client';

import React, { useState } from 'react';
import {
  Ban,
  Check,
  ClipboardCopy,
  KeyRound,
  Pencil,
  RefreshCw,
  X,
} from 'lucide-react';

export type DeviceStatusKey = 'aktif' | 'belum_diaktivasi' | 'akses_dicabut';

export interface TerminalDeviceItem {
  id: string;
  namaPerangkat: string;
  idPerangkat: string;
  jenis: string;
  klinik: string;
  unit: string;
  registrasi: string;
  aktivitasTerakhir: string;
  status: DeviceStatusKey;
  pairingCode?: string;
}

const DEFAULT_DEVICES: TerminalDeviceItem[] = [
  {
    id: 'dev-1',
    namaPerangkat: 'Kiosk',
    idPerangkat: '5d1c211e-c4b4-4385-93a6-559f75516771',
    jenis: 'Mesin Antrean',
    klinik: 'Tarmedic Healthcare Indonesia',
    unit: 'Pendaftaran',
    registrasi: '30/10/2026',
    aktivitasTerakhir: '13/11/2026, 13.27.25',
    status: 'akses_dicabut',
  },
  {
    id: 'dev-2',
    namaPerangkat: 'Layar Antrean Unit Pendaftaran',
    idPerangkat: '62a0ea07-1c81-4bac-8624-056af2131e48',
    jenis: 'Layar Antrean',
    klinik: 'Tarmedic Healthcare Indonesia',
    unit: 'Pendaftaran',
    registrasi: '31/10/2026',
    aktivitasTerakhir: '1/11/2026, 15.17.23',
    status: 'akses_dicabut',
  },
  {
    id: 'dev-3',
    namaPerangkat: 'Layar Antrean Pendaftaran 2',
    idPerangkat: '1982559e-c0e9-49d6-bd4f-af71f195870f',
    jenis: 'Layar Antrean',
    klinik: 'Tarmedic Healthcare Indonesia',
    unit: 'Pendaftaran',
    registrasi: '3/11/2026',
    aktivitasTerakhir: '9/11/2026, 15.14.08',
    status: 'akses_dicabut',
  },
  {
    id: 'dev-4',
    namaPerangkat: 'Display Pendaftaran',
    idPerangkat: '298090f9-4fdb-4cd9-960a-b1dcb61b035a',
    jenis: 'Layar Antrean',
    klinik: 'Tarmedic Healthcare Indonesia',
    unit: 'Pendaftaran',
    registrasi: '13/11/2026',
    aktivitasTerakhir: 'Belum aktif',
    status: 'belum_diaktivasi',
    pairingCode: 'TRM-849-204',
  },
];

function formatNowWib(): string {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${d}/${m}/${y}, ${hh}.${mm}.${ss}`;
}

export default function DaftarPerangkat({
  initialDevices = DEFAULT_DEVICES,
  onRefresh,
  onUpdateDevice,
  onActivateDevice,
  onRevokeDevice,
}: {
  initialDevices?: TerminalDeviceItem[];
  onRefresh?: () => void;
  onUpdateDevice?: (device: TerminalDeviceItem) => void;
  onActivateDevice?: (device: TerminalDeviceItem) => void;
  onRevokeDevice?: (device: TerminalDeviceItem) => void;
}) {
  const [devices, setDevices] = useState<TerminalDeviceItem[]>(initialDevices);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [detailDevice, setDetailDevice] = useState<TerminalDeviceItem | null>(
    null,
  );
  const [editingDevice, setEditingDevice] = useState<TerminalDeviceItem | null>(
    null,
  );
  const [activationCode, setActivationCode] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 350);
  };

  const handleCopyId = async (idPerangkat: string) => {
    try {
      await navigator.clipboard?.writeText(idPerangkat);
      setCopiedId(idPerangkat);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Abaikan jika clipboard diblokir browser
    }
  };

  const handleActivate = (target: TerminalDeviceItem) => {
    const generatedCode =
      target.pairingCode ||
      `TRM-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;

    const updated: TerminalDeviceItem = {
      ...target,
      status: 'aktif',
      aktivitasTerakhir: formatNowWib(),
      pairingCode: generatedCode,
    };

    setDevices((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    setActivationCode(generatedCode);
    onActivateDevice?.(updated);
  };

  const handleRevoke = (target: TerminalDeviceItem) => {
    const updated: TerminalDeviceItem = {
      ...target,
      status: 'akses_dicabut',
      aktivitasTerakhir: formatNowWib(),
    };

    setDevices((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onRevokeDevice?.(updated);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDevice) return;

    setDevices((prev) =>
      prev.map((item) =>
        item.id === editingDevice.id ? editingDevice : item,
      ),
    );
    onUpdateDevice?.(editingDevice);
    setEditingDevice(null);
  };

  return (
    <div className="w-full h-full font-sans text-slate-700 space-y-3.5">
      {/* =====================================================================
          1. KARTU TABEL DAFTAR PERANGKAT
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Header Kartu + Tombol Refresh Kanan Atas */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <h1 className="text-base sm:text-lg font-extrabold text-[#0f3d56]">
            Daftar Perangkat
          </h1>

          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Muat ulang daftar perangkat"
            className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-flex items-center justify-center text-[#0f3d56] transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#008ba6]' : ''}`}
            />
          </button>
        </div>

        {/* Tabel Perangkat */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1020px]">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pl-6 pr-3 py-3.5">NAMA PERANGKAT</th>
                <th className="px-3 py-3.5">ID PERANGKAT</th>
                <th className="px-3 py-3.5">JENIS</th>
                <th className="px-3 py-3.5">KLINIK / UNIT</th>
                <th className="px-3 py-3.5">REGISTRASI</th>
                <th className="px-3 py-3.5">AKTIVITAS TERAKHIR</th>
                <th className="px-3 py-3.5">STATUS</th>
                <th className="pl-3 pr-6 py-3.5 text-right">AKSI</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 text-xs">
              {devices.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 px-6 text-center text-slate-400"
                  >
                    Belum ada perangkat terminal yang terdaftar.
                  </td>
                </tr>
              ) : (
                devices.map((dev) => {
                  const showActivateAndRevoke = dev.status === 'belum_diaktivasi';

                  return (
                    <tr
                      key={dev.id}
                      className="bg-white hover:bg-slate-50/70 transition-colors"
                    >
                      {/* NAMA PERANGKAT */}
                      <td className="pl-6 pr-4 py-5 align-middle font-bold text-[#0f3d56] whitespace-nowrap">
                        {dev.namaPerangkat}
                      </td>

                      {/* ID PERANGKAT */}
                      <td className="px-3 py-5 align-middle font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {dev.idPerangkat}
                      </td>

                      {/* JENIS */}
                      <td className="px-3 py-5 align-middle font-semibold text-[#0f3d56] whitespace-nowrap">
                        {dev.jenis}
                      </td>

                      {/* KLINIK / UNIT */}
                      <td className="px-3 py-5 align-middle whitespace-nowrap">
                        <p className="font-bold text-[#0f3d56] leading-snug">
                          {dev.klinik}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {dev.unit}
                        </p>
                      </td>

                      {/* REGISTRASI */}
                      <td className="px-3 py-5 align-middle text-[#0f3d56] tabular-nums whitespace-nowrap">
                        {dev.registrasi}
                      </td>

                      {/* AKTIVITAS TERAKHIR */}
                      <td className="px-3 py-5 align-middle text-[#0f3d56] tabular-nums whitespace-nowrap">
                        {dev.aktivitasTerakhir}
                      </td>

                      {/* STATUS */}
                      <td className="px-3 py-5 align-middle whitespace-nowrap">
                        {dev.status === 'akses_dicabut' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#fdf3e7] text-[#c27803] text-[11px] font-bold">
                            Akses Dicabut
                          </span>
                        )}

                        {dev.status === 'belum_diaktivasi' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e8f2fc] text-[#2563eb] text-[11px] font-bold">
                            Belum Diaktivasi
                          </span>
                        )}

                        {dev.status === 'aktif' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold">
                            Aktif
                          </span>
                        )}
                      </td>

                      {/* AKSI */}
                      <td className="pl-3 pr-6 py-4 align-middle text-right whitespace-nowrap">
                        {showActivateAndRevoke ? (
                          <div className="inline-flex flex-col items-end gap-2">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setDetailDevice(dev)}
                                className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                              >
                                Detail
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditingDevice({ ...dev })}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                                <span>Ubah</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleActivate(dev)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                              >
                                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                                <span>Aktivasi</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRevoke(dev)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50/60 text-xs font-bold text-rose-600 transition-colors cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5 text-rose-500" />
                              <span>Cabut</span>
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setDetailDevice(dev)}
                              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                            >
                              Detail
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingDevice({ ...dev })}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-[#0f3d56] transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5 text-slate-500" />
                              <span>Ubah</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================================
          2. CATATAN KEAMANAN COOKIE & KODE PAIRING DI BAWAH TABEL
         ===================================================================== */}
      <div className="px-1 flex items-center gap-2 text-xs text-slate-400">
        <ClipboardCopy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <p>
          Kode pairing hanya ditampilkan satu kali. Perangkat publik memakai
          cookie HttpOnly khusus perangkat, bukan akun staf.
        </p>
      </div>

      {/* =====================================================================
          3. MODAL DETAIL PERANGKAT
         ===================================================================== */}
      {detailDevice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  DETAIL PERANGKAT TERMINAL
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  {detailDevice.namaPerangkat}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailDevice(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <p className="text-[11px] font-bold text-slate-400">
                  ID Perangkat
                </p>
                <div className="mt-1 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 font-mono text-[11px] text-[#0f3d56]">
                  <span className="truncate">{detailDevice.idPerangkat}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyId(detailDevice.idPerangkat)}
                    className="inline-flex items-center gap-1 font-sans font-bold text-[#008ba6] hover:underline shrink-0 cursor-pointer"
                  >
                    {copiedId === detailDevice.idPerangkat ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <span>Salin</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-400">Jenis</p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {detailDevice.jenis}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400">
                    Unit Layanan
                  </p>
                  <p className="font-bold text-[#0f3d56] mt-0.5">
                    {detailDevice.unit}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400">
                    Registrasi
                  </p>
                  <p className="font-semibold text-slate-700 mt-0.5 tabular-nums">
                    {detailDevice.registrasi}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400">
                    Aktivitas Terakhir
                  </p>
                  <p className="font-semibold text-slate-700 mt-0.5 tabular-nums">
                    {detailDevice.aktivitasTerakhir}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDetailDevice(null)}
                  className="px-4 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. MODAL UBAH PERANGKAT
         ===================================================================== */}
      {editingDevice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  UBAH KONFIGURASI PERANGKAT
                </p>
                <h2 className="text-base font-extrabold text-[#0f3d56]">
                  {editingDevice.namaPerangkat}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingDevice(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveEdit}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Perangkat
                </label>
                <input
                  type="text"
                  required
                  value={editingDevice.namaPerangkat}
                  onChange={(e) =>
                    setEditingDevice({
                      ...editingDevice,
                      namaPerangkat: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis Perangkat
                  </label>
                  <select
                    value={editingDevice.jenis}
                    onChange={(e) =>
                      setEditingDevice({
                        ...editingDevice,
                        jenis: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Mesin Antrean">Mesin Antrean</option>
                    <option value="Layar Antrean">Layar Antrean</option>
                    <option value="Kiosk Mandiri">Kiosk Mandiri</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unit Layanan
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDevice.unit}
                    onChange={(e) =>
                      setEditingDevice({
                        ...editingDevice,
                        unit: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDevice(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. MODAL KODE PAIRING AKTIVASI PERANGKAT
         ===================================================================== */}
      {activationCode && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-xl p-5 text-xs space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                AKTIVASI PERANGKAT BERHASIL
              </p>
              <h2 className="text-base font-extrabold text-[#0f3d56] mt-0.5">
                Kode Pairing Perangkat
              </h2>
              <p className="text-slate-500 mt-1 leading-relaxed">
                Masukkan kode berikut pada layar terminal. Kode ini hanya
                ditampilkan satu kali.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-[#009bb8] bg-[#edf7fc] py-3.5 px-4 text-center font-mono text-base font-extrabold tracking-widest text-[#0f3d56]">
              {activationCode}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActivationCode(null)}
                className="px-4 py-2 rounded-lg bg-[#0077b6] hover:bg-[#00669e] text-white font-bold cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}