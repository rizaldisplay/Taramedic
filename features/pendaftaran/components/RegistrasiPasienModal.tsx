/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
// src/features/pendaftaran/components/RegistrasiPasienModal.tsx

import React, { useEffect, useState } from 'react';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import type { Pendaftaran } from '@/types/domain/pendaftaran';
import { resetForm, setErrors, simpanPasien } from '../slices/registrationSlice';
import { fetchPatientSummary } from '../slices/patientSlice';
import { validatePendaftaran } from '../utils/pendaftaranHelpers';
import PasienForm, { focusFirstError } from './PasienForm';

interface NewPatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** ID tiket antrean yang sedang dilayani, dikirim ke backend saat simpan */
  ticketId?: string;
  /** Dipanggil setelah pasien berhasil disimpan (kedua tombol simpan) */
  onSaved?: (pasien: Pendaftaran) => void;
  /** Dipanggil untuk "Simpan & Daftarkan Berobat", atau saat memakai pasien yang NIK-nya sudah terdaftar */
  onDaftarBerobat?: (pasien: Pendaftaran) => void;
}

type SubmitMode = 'simpan' | 'berobat';

export default function NewPatientRegistrationModal({
  isOpen,
  onClose,
  ticketId,
  onSaved,
  onDaftarBerobat,
}: NewPatientRegistrationModalProps) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.registration.form);
  const nikStatus = useAppSelector((state) => state.registration.nikStatus);
  const saving = useAppSelector((state) => state.registration.saving);

  const [submitMode, setSubmitMode] = useState<SubmitMode | null>(null);

  const handleClose = () => {
    if (saving) return;
    dispatch(resetForm());
    onClose();
  };

  // Tutup dengan tombol Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) {
        dispatch(resetForm());
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, saving, dispatch, onClose]);

  if (!isOpen) return null;

  // NIK sudah terdaftar -> pakai pasien yang ada untuk pendaftaran berobat
  const handleGunakanPasienTerdaftar = (pasien: Pendaftaran) => {
    dispatch(fetchPatientSummary({ id: pasien.id, select: true }));
    dispatch(resetForm());
    onClose();
    onDaftarBerobat?.(pasien);
  };

  const handleSubmit = async (mode: SubmitMode) => {
    const validation = validatePendaftaran(form, { nikTerdaftar: nikStatus === 'exists' });
    dispatch(setErrors(validation));

    if (Object.keys(validation).length > 0) {
      dispatch(
        showNotification({
          title: 'Data Belum Lengkap',
          message: 'Periksa kembali kolom yang ditandai merah.',
          type: 'error',
        }),
      );
      focusFirstError();
      return;
    }

    setSubmitMode(mode);
    try {
      const pasien = await dispatch(simpanPasien({ data: form, tiketId: ticketId })).unwrap();

      dispatch(
        showNotification({
          title: 'Pasien Tersimpan',
          message: `${pasien.namaLengkap} berhasil didaftarkan dengan No. RM ${pasien.nomorRM}.`,
          type: 'success',
        }),
      );

      // Jadikan pasien terpilih di panel "Data Pasien"
      dispatch(fetchPatientSummary({ id: pasien.id, select: true }));

      onSaved?.(pasien);
      dispatch(resetForm());
      onClose();

      if (mode === 'berobat') onDaftarBerobat?.(pasien);
    } catch (error: any) {
      dispatch(
        showNotification({
          title: 'Gagal Menyimpan',
          message:
            typeof error?.message === 'string' ? error.message : 'Terjadi kesalahan sistem.',
          type: 'error',
        }),
      );
      focusFirstError();
    } finally {
      setSubmitMode(null);
    }
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4">
      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="registrasi-pasien-title"
        className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden"
      >
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-white shrink-0">
          <div>
            <h2
              id="registrasi-pasien-title"
              className="text-lg font-bold text-[#0b2756] tracking-wide uppercase"
            >
              Pendaftaran Pasien Baru
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Lengkapi identitas pasien sesuai dokumen resmi. Data akan digunakan untuk pembuatan
              Rekam Medis dan integrasi SATUSEHAT.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Tutup"
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- SCROLLABLE FORM CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <PasienForm mode="create" onGunakanPasienTerdaftar={handleGunakanPasienTerdaftar} />
        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Tutup
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSubmit('simpan')}
              disabled={saving}
              className="px-6 py-2.5 border border-cyan-600 rounded-lg text-sm font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {submitMode === 'simpan' && <Loader2 size={16} className="animate-spin" />}
              Simpan Data Pasien
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('berobat')}
              disabled={saving}
              className="px-6 py-2.5 bg-cyan-600 rounded-lg text-sm font-semibold text-white hover:bg-cyan-700 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              Simpan & Daftarkan Berobat
              {submitMode === 'berobat' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ArrowRight size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
