/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
// src/features/pendaftaran/components/EditPasienModal.tsx

import React, { useEffect, useState } from 'react';
import { X, ArrowRight, Info, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import {
  fetchWilayah,
  loadForEdit,
  resetForm,
  setErrors,
} from '../slices/registrationSlice';
import { fetchPatientDetail, fetchPatientSummary, updatePatient } from '../slices/patientSlice';
import { validatePendaftaran } from '../utils/pendaftaranHelpers';
import PasienForm, { focusFirstError } from '@/features/pendaftaran/components/PasienForm';

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** ID pasien yang diubah */
  patientId: number | null;
}

type SubmitMode = 'simpan' | 'berobat';

export default function EditPatientModal({ isOpen, onClose, patientId }: EditPatientModalProps) {
  const dispatch = useAppDispatch();
  const { data: detail, loading, error } = useAppSelector((state) => state.patient.detail);
  const form = useAppSelector((state) => state.registration.form);
  const nikStatus = useAppSelector((state) => state.registration.nikStatus);
  const saving = useAppSelector((state) => state.registration.saving);
  const formReady = useAppSelector(
    (state) => state.registration.mode === 'edit' && state.registration.editingId === patientId,
  );

  const [submitMode, setSubmitMode] = useState<SubmitMode | null>(null);

  // Saat dibuka: ambil data lengkap -> isi form -> muat opsi wilayah sesuai alamat pasien
  useEffect(() => {
    if (!isOpen || patientId == null) return;

    let cancelled = false;
    (async () => {
      try {
        const data = await dispatch(fetchPatientDetail(patientId)).unwrap();
        if (cancelled) return;

        dispatch(loadForEdit(data));
        if (data.provinsi)
          dispatch(fetchWilayah({ level: 'kabupaten', parentKode: data.provinsi }));
        if (data.kabupatenKota)
          dispatch(fetchWilayah({ level: 'kecamatan', parentKode: data.kabupatenKota }));
        if (data.kecamatan)
          dispatch(fetchWilayah({ level: 'desa', parentKode: data.kecamatan }));
      } catch {
        // pesan error ditampilkan lewat state.patient.detail.error
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, patientId, dispatch]);

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

  const handleSubmit = async (mode: SubmitMode) => {
    if (patientId == null) return;

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
      const updated = await dispatch(updatePatient({ id: patientId, data: form })).unwrap();

      dispatch(
        showNotification({
          title: 'Perubahan Tersimpan',
          message: `Data ${updated.namaLengkap} (${updated.nomorRM}) berhasil diperbarui.`,
          type: 'success',
        }),
      );

      // Segarkan baris di hasil pencarian & panel Data Pasien.
      // "Simpan & Daftarkan Berobat" -> pasien ini dijadikan pasien terpilih.
      dispatch(fetchPatientSummary({ id: patientId, select: mode === 'berobat' }));

      dispatch(resetForm());
      onClose();
    } catch (err: any) {
      dispatch(
        showNotification({
          title: 'Gagal Menyimpan',
          message: typeof err?.message === 'string' ? err.message : 'Terjadi kesalahan sistem.',
          type: 'error',
        }),
      );
      focusFirstError();
    } finally {
      setSubmitMode(null);
    }
  };

  const retry = () => patientId != null && dispatch(fetchPatientDetail(patientId));

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4">
      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-pasien-title"
        className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden"
      >
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-white shrink-0">
          <div>
            <h2
              id="edit-pasien-title"
              className="text-lg font-bold text-[#0b2756] tracking-wide uppercase"
            >
              Ubah Data Pasien
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ubah data identitas pasien sesuai dokumen resmi. Perubahan akan tersimpan ke Rekam
              Medis dan integrasi SATUSEHAT.
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
          {error ? (
            <div className="py-16 text-center text-sm text-red-600">
              <p>{error}</p>
              <button
                type="button"
                onClick={retry}
                className="mt-3 px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Coba Lagi
              </button>
            </div>
          ) : loading || !formReady ? (
            <div className="py-16 flex flex-col items-center gap-2 text-xs text-slate-400">
              <Loader2 size={24} className="animate-spin text-cyan-600" />
              Memuat data pasien...
            </div>
          ) : (
            <PasienForm mode="edit" nikTerverifikasi={detail?.nikTerverifikasi} />
          )}
        </div>

        {/* --- FOOTER & ALERT --- */}
        <div className="p-6 pt-4 border-t border-slate-200 bg-white shrink-0 flex flex-col gap-4">
          {/* Info Alert */}
          <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3 flex gap-3 items-start">
            <Info size={18} className="text-cyan-600 shrink-0 mt-0.5" />
            <p className="text-xs text-cyan-800 leading-relaxed">
              Perubahan data NIK perlu diverifikasi ulang sebelum disinkronkan ke SATUSEHAT. <br />
              Data yang tidak dapat diubah: No. RM{detail ? ` (${detail.nomorRM})` : ''} dan Nomor
              IHS.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-2">
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
                disabled={saving || !formReady}
                className="px-6 py-2.5 border border-cyan-600 rounded-lg text-sm font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {submitMode === 'simpan' && <Loader2 size={16} className="animate-spin" />}
                Simpan Perubahan
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('berobat')}
                disabled={saving || !formReady}
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
    </div>
  );
}
