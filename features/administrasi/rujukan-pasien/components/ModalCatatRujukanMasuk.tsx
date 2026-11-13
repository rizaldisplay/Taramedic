/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useEffect, useState } from 'react';
import { FileInput, X, ChevronDown, Save, Loader2 } from 'lucide-react';

export interface RujukanMasukFormPayload {
  unitPenerima: string;
  pasienQuery: string;
  fasilitasPengirim: string;
  dokterPengirim: string;
  nomorSuratAsal: string;
  tanggalSurat: string;
  tanggalDiterima: string;
  tujuanLayanan: string;
  alasanSesuaiSurat: string;
  catatanAdministratif: string;
}

export interface UnitOption {
  value: string;
  label: string;
}

const DEFAULT_UNITS: UnitOption[] = [
  { value: 'POLI-ANAK', label: 'Poli Anak · POLI-ANAK' },
  { value: 'POLI-UMUM', label: 'Poli Umum · POLI-UMUM' },
  { value: 'POLI-PD', label: 'Poli Penyakit Dalam · POLI-PD' },
  { value: 'POLI-OBGYN', label: 'Poli Kandungan · POLI-OBGYN' },
  { value: 'POLI-GIGI', label: 'Poli Gigi · POLI-GIGI' },
  { value: 'IGD', label: 'Instalasi Gawat Darurat · IGD' },
];

const INITIAL_FORM: RujukanMasukFormPayload = {
  unitPenerima: 'POLI-ANAK',
  pasienQuery: '',
  fasilitasPengirim: '',
  dokterPengirim: '',
  nomorSuratAsal: '',
  tanggalSurat: '',
  tanggalDiterima: '',
  tujuanLayanan: '',
  alasanSesuaiSurat: '',
  catatanAdministratif: '',
};

export default function ModalCatatRujukanMasuk({
  isOpen,
  onClose,
  onSubmit,
  unitOptions = DEFAULT_UNITS,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: RujukanMasukFormPayload) => Promise<void> | void;
  unitOptions?: UnitOption[];
}) {
  const [form, setForm] = useState<RujukanMasukFormPayload>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setForm({
        ...INITIAL_FORM,
        unitPenerima: unitOptions[0]?.value ?? 'POLI-ANAK',
      });
    }
  }, [isOpen, unitOptions]);

  // Tutup modal dengan tombol Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = <K extends keyof RujukanMasukFormPayload>(
    field: K,
    value: RujukanMasukFormPayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit?.(form);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-catat-rujukan-masuk-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-[1px] p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl border border-slate-200/90 shadow-xl p-5 sm:p-7 font-sans text-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#e6f6fa] border border-cyan-100 flex items-center justify-center shrink-0">
                <FileInput className="w-4 h-4 text-[#008ba6]" />
              </div>
              <h2
                id="modal-catat-rujukan-masuk-title"
                className="text-base sm:text-lg font-bold text-[#0f3d56]"
              >
                Catat Rujukan Masuk
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Informasi pasien dan kunjungan diverifikasi oleh server.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Input */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Unit Penerima (Full Width) */}
          <div>
            <label
              htmlFor="unit-penerima"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Unit penerima
            </label>
            <div className="relative">
              <select
                id="unit-penerima"
                value={form.unitPenerima}
                onChange={(e) => handleChange('unitPenerima', e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all cursor-pointer"
              >
                {unitOptions.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Baris 2: Cari Pasien & Fasilitas Pengirim */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cari-pasien"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Cari pasien (nama, No. RM, atau NIK)
              </label>
              <input
                id="cari-pasien"
                type="text"
                value={form.pasienQuery}
                onChange={(e) => handleChange('pasienQuery', e.target.value)}
                placeholder="Ketik minimal 2 karakter"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="fasilitas-pengirim"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Fasilitas pengirim
              </label>
              <input
                id="fasilitas-pengirim"
                type="text"
                value={form.fasilitasPengirim}
                onChange={(e) =>
                  handleChange('fasilitasPengirim', e.target.value)
                }
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
            </div>
          </div>

          {/* Baris 3: Dokter Pengirim & Nomor Surat Asal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dokter-pengirim"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Dokter pengirim (jika tercantum)
              </label>
              <input
                id="dokter-pengirim"
                type="text"
                value={form.dokterPengirim}
                onChange={(e) => handleChange('dokterPengirim', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="nomor-surat-asal"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Nomor surat asal
              </label>
              <input
                id="nomor-surat-asal"
                type="text"
                value={form.nomorSuratAsal}
                onChange={(e) => handleChange('nomorSuratAsal', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
            </div>
          </div>

          {/* Baris 4: Tanggal Surat & Tanggal Diterima */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="tanggal-surat"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Tanggal surat
              </label>
              <input
                id="tanggal-surat"
                type="date"
                value={form.tanggalSurat}
                onChange={(e) => handleChange('tanggalSurat', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="tanggal-diterima"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Tanggal diterima
              </label>
              <input
                id="tanggal-diterima"
                type="date"
                value={form.tanggalDiterima}
                onChange={(e) =>
                  handleChange('tanggalDiterima', e.target.value)
                }
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
            </div>
          </div>

          {/* Baris 5: Tujuan Layanan (Setengah Lebar Kiri) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="tujuan-layanan"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Tujuan layanan
              </label>
              <input
                id="tujuan-layanan"
                type="text"
                value={form.tujuanLayanan}
                onChange={(e) => handleChange('tujuanLayanan', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all"
              />
            </div>
          </div>

          {/* Baris 6: Alasan Sesuai Surat */}
          <div>
            <label
              htmlFor="alasan-sesuai-surat"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Alasan sesuai surat
            </label>
            <textarea
              id="alasan-sesuai-surat"
              rows={3}
              value={form.alasanSesuaiSurat}
              onChange={(e) =>
                handleChange('alasanSesuaiSurat', e.target.value)
              }
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all resize-y"
            />
          </div>

          {/* Baris 7: Catatan Administratif */}
          <div>
            <label
              htmlFor="catatan-administratif"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Catatan administratif
            </label>
            <textarea
              id="catatan-administratif"
              rows={3}
              value={form.catatanAdministratif}
              onChange={(e) =>
                handleChange('catatanAdministratif', e.target.value)
              }
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15 transition-all resize-y"
            />
          </div>

          {/* Tombol Simpan Full Width */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#00939c] hover:bg-[#007f87] active:bg-[#006d74] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}