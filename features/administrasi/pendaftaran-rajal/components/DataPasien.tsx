/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
// src/features/pendaftaran/components/DataPasien.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  User,
  Phone,
  Shield,
  MapPin,
  CheckCircle2,
  LockKeyhole,
  AlertTriangle,
  ArrowRight,
  Trash2,
  ChevronDown,
  Pencil,
  Loader2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import type { VisitForm } from '@/types/domain/kunjungan';
import { fetchPatientSummary } from '../slices/patientSlice';
import {
  fetchVisitOptions,
  registerVisit,
  resetVisitForm,
  setVisitErrors,
  setVisitField,
  validateVisitForm,
} from '../slices/visitSlice';
import EditPasienModal from './EditPasienModal';

interface SelectOption {
  value: string;
  label: string;
}

const toOptions = (items: string[] = []): SelectOption[] =>
  items.map((v) => ({ value: v, label: v }));

export default function PatientRegistrationPanel() {
  const dispatch = useAppDispatch();
  const selectedPatient = useAppSelector((state) => state.patient.selectedPatient);
  const { antreanSaatIni, loket: queueLoket } = useAppSelector((state) => state.queue);
  const { options, optionsLoading, optionsError, form, errors, submitting } = useAppSelector(
    (state) => state.visit,
  );

  console.log("form opsi" + JSON.stringify(form))

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  // Pendaftaran hanya boleh setelah pasien ditandai HADIR (antrean sedang dilayani)
  // dan sebuah pasien sudah dipilih / dipakai untuk pendaftaran.
  const isAntreanSedangDilayani =
    String(antreanSaatIni?.statusAntrean ?? '') === 'Sedang Dilayani';
  const canRegister = Boolean(selectedPatient) && isAntreanSedangDilayani;

  // Muat opsi dropdown sekali
  useEffect(() => {
    if (!options) dispatch(fetchVisitOptions());
  }, [options, dispatch]);

  // Isi otomatis loket sesuai loket yang sedang dipakai di modul antrean
  useEffect(() => {
    if (
      options &&
      form.loketId === '' &&
      queueLoket != null &&
      options.loket.some((l) => l.id === queueLoket)
    ) {
      dispatch(setVisitField({ field: 'loketId', value: String(queueLoket) }));
    }
  }, [options, form.loketId, queueLoket, dispatch]);

  // Jam di "Informasi Pendaftaran" (diisi setelah mount agar tidak beda dengan hasil SSR)
  useEffect(() => {
    const initialTimer = setTimeout(() => setNow(new Date()), 0);
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  const dokterOptions = useMemo<SelectOption[]>(
    () =>
      (options?.dokter ?? [])
        .filter((d) => String(d.poliId) === form.poliId)
        .map((d) => ({ value: String(d.id), label: d.nama })),
    [options, form.poliId],
  );

  const onSelect =
    (field: keyof VisitForm) => (e: React.ChangeEvent<HTMLSelectElement>) =>
      dispatch(setVisitField({ field, value: e.target.value }));

  const handleRegister = async () => {
    if (!selectedPatient) return;

    const validation = validateVisitForm(form);
    dispatch(setVisitErrors(validation));

    if (Object.keys(validation).length > 0) {
      dispatch(
        showNotification({
          title: 'Data Belum Lengkap',
          message: 'Lengkapi semua kolom pendaftaran kunjungan.',
          type: 'error',
        }),
      );
      return;
    }

    try {
      const visit = await dispatch(
        registerVisit({
          patientId: selectedPatient.id,
          form,
          tiketId: antreanSaatIni?.id != null ? String(antreanSaatIni.id) : undefined,
        }),
      ).unwrap();

      dispatch(
        showNotification({
          title: 'Kunjungan Terdaftar',
          message: `${selectedPatient.namaLengkap} terdaftar di ${visit.poli} (${visit.nomorKunjungan}).`,
          type: 'success',
        }),
      );

      dispatch(resetVisitForm());
      // Segarkan "kunjungan terakhir" & penjamin pasien
      dispatch(fetchPatientSummary({ id: selectedPatient.id }));
    } catch (error: any) {
      dispatch(
        showNotification({
          title: 'Gagal Mendaftarkan Kunjungan',
          message: typeof error?.message === 'string' ? error.message : 'Terjadi kesalahan sistem.',
          type: 'error',
        }),
      );
    }
  };

  const loketNama = options?.loket.find((l) => String(l.id) === form.loketId)?.nama ?? '-';
  const waktuTampil = now
    ? `${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • ${now
        .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
        .replace('.', ':')} WIB`
    : '-';

  const formDisabled = !canRegister || submitting;

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 font-sans overflow-y-auto custom-scrollbar">
      {/* SECTION: DATA PASIEN */}
      <section className="shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Data Pasien</h2>
          {selectedPatient && (
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-1 text-[11px] font-semibold text-cyan-600 hover:text-cyan-800 cursor-pointer"
            >
              <Pencil size={12} /> Ubah Data
            </button>
          )}
        </div>

        {selectedPatient ? (
          <>
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-600 text-xl font-medium tracking-wider shrink-0">
                {selectedPatient.inisial}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedPatient.namaLengkap}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-gray-600 font-medium">{selectedPatient.nomorRM}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedPatient.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {selectedPatient.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-700 font-medium">
                  {selectedPatient.jenisKelamin} <span className="text-gray-400 mx-1">•</span>{' '}
                  {selectedPatient.usiaString} <span className="text-gray-400 mx-1">•</span>{' '}
                  {selectedPatient.tanggalLahir}
                </p>
              </div>
              <InfoRow icon={<LockKeyhole size={16} />} label="NIK" value={selectedPatient.nik} />
              <InfoRow icon={<Phone size={16} />} label="No. HP" value={selectedPatient.nomorHP} />
              <InfoRow
                icon={<Shield size={16} />}
                label="Penjamin"
                value={selectedPatient.penjaminLabel}
              />
              <InfoRow
                icon={<MapPin size={16} />}
                label="Alamat"
                value={selectedPatient.alamatRingkas}
                relaxed
              />
            </div>
          </>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-xs font-semibold text-gray-600">Belum ada pasien dipilih</p>
            <p className="text-[11px] text-gray-400 mt-1">
              Cari pasien lalu pilih baris atau gunakan tombol &quot;Gunakan untuk Pendaftaran&quot;.
            </p>
          </div>
        )}
      </section>

      {/* SECTION: SATUSEHAT */}
      {selectedPatient && (
        <section className="border border-gray-200 rounded-xl p-4 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-bold text-gray-800 tracking-wide">SATUSEHAT</h3>
            {selectedPatient.satuSehat.statusTerhubung ? (
              <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-100">
                Patient Terhubung
              </span>
            ) : (
              <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-100">
                Belum Terhubung
              </span>
            )}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-gray-500 mb-0.5">Patient IHS Number</p>
              <p className="text-xs font-semibold text-gray-800 break-all">
                {selectedPatient.satuSehat.ihsNumber ?? '-'}
              </p>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className="text-[10px] text-gray-500 mb-0.5">Last successful sync</p>
              <p className="text-xs font-medium text-gray-800 flex items-center gap-1 justify-end">
                {selectedPatient.satuSehat.lastSyncAt ?? '-'}
                {selectedPatient.satuSehat.lastSyncAt && (
                  <CheckCircle2 size={14} className="text-green-500" />
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION: DAFTARKAN KUNJUNGAN */}
      <section className="flex-1 flex flex-col shrink-0">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase mb-3">
          Daftarkan Kunjungan
        </h2>

        {/* Warning Alert */}
        {!canRegister && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-2 items-start mb-4">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Proses pendaftaran hanya dapat dilakukan setelah pasien ditandai HADIR dan pasien
              digunakan untuk pendaftaran.
            </p>
          </div>
        )}

        {optionsError && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center justify-between gap-2 mb-4">
            <p className="text-[11px] text-red-700">{optionsError}</p>
            <button
              type="button"
              onClick={() => dispatch(fetchVisitOptions())}
              className="text-[11px] font-semibold text-red-700 underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <FormSelect
            label="Poli/Unit Tujuan"
            required
            placeholder="Pilih Poli"
            options={(options?.poli ?? []).map((p) => ({ value: String(p.id), label: p.nama }))}
            value={form.poliId}
            onChange={onSelect('poliId')}
            error={errors.poliId}
            loading={optionsLoading}
            disabled={formDisabled}
          />
          <FormSelect
            label="Dokter / Nakes"
            required
            placeholder={form.poliId ? 'Pilih Dokter / Nakes' : 'Pilih poli dahulu'}
            options={dokterOptions}
            value={form.dokterId}
            onChange={onSelect('dokterId')}
            error={errors.dokterId}
            disabled={formDisabled || !form.poliId}
          />

          <FormSelect
            label="Jenis Layanan"
            required
            placeholder="Pilih Jenis Layanan"
            options={toOptions(options?.jenisLayanan)}
            value={form.jenisLayanan}
            onChange={onSelect('jenisLayanan')}
            error={errors.jenisLayanan}
            loading={optionsLoading}
            disabled={formDisabled}
          />
          <FormSelect
            label="Cara Masuk"
            required
            placeholder="Pilih Cara Masuk"
            options={toOptions(options?.caraMasuk)}
            value={form.caraMasuk}
            onChange={onSelect('caraMasuk')}
            error={errors.caraMasuk}
            loading={optionsLoading}
            disabled={formDisabled}
          />

          <FormSelect
            label="Penjamin"
            required
            placeholder="Pilih Penjamin"
            options={toOptions(options?.penjamin)}
            value={form.penjamin}
            onChange={onSelect('penjamin')}
            error={errors.penjamin}
            loading={optionsLoading}
            disabled={formDisabled}
          />
          <FormSelect
            label="Jenis Pembayaran"
            required
            placeholder="Pilih Jenis Pembayaran"
            options={toOptions(options?.jenisPembayaran)}
            value={form.jenisPembayaran}
            onChange={onSelect('jenisPembayaran')}
            error={errors.jenisPembayaran}
            loading={optionsLoading}
            disabled={formDisabled}
          />

          <FormSelect
            label="Prioritas"
            required
            placeholder="Pilih Prioritas"
            options={toOptions(options?.prioritas)}
            value={form.prioritas}
            onChange={onSelect('prioritas')}
            error={errors.prioritas}
            loading={optionsLoading}
            disabled={formDisabled}
          />
          <FormSelect
            label="Loket Pendaftaran"
            required
            placeholder="Pilih Loket"
            options={(options?.loket ?? []).map((l) => ({ value: String(l.id), label: l.nama }))}
            value={form.loketId}
            onChange={onSelect('loketId')}
            error={errors.loketId}
            loading={optionsLoading}
            disabled={formDisabled}
          />

          <div className="col-span-2">
            <FormSelect
              label="Lokasi Pelayanan"
              required
              placeholder="Pilih Lokasi Pelayanan"
              options={(options?.lokasi ?? []).map((l) => ({ value: String(l.id), label: l.nama }))}
              value={form.lokasiId}
              onChange={onSelect('lokasiId')}
              error={errors.lokasiId}
              loading={optionsLoading}
              disabled={formDisabled}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleRegister}
          disabled={!canRegister || submitting}
          className={`w-full rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-bold transition-colors mt-auto ${
            canRegister && !submitting
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
              : 'bg-gray-200 text-white cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> MENDAFTARKAN...
            </>
          ) : (
            <>
              DAFTARKAN KUNJUNGAN <ArrowRight size={16} />
            </>
          )}
        </button>

        {/* SECTION: INFORMASI PENDAFTARAN */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Informasi Pendaftaran
          </h3>
          <div className="grid grid-cols-[120px_10px_1fr] gap-y-2 text-xs mb-4">
            <div className="text-gray-500">Petugas Pendaftaran</div>
            <div className="text-gray-500">:</div>
            <div className="font-semibold text-gray-800">{options?.petugas.nama ?? '-'}</div>

            <div className="text-gray-500">Loket Pendaftaran</div>
            <div className="text-gray-500">:</div>
            <div className="font-semibold text-gray-800">{loketNama}</div>

            <div className="text-gray-500">Tanggal & Waktu</div>
            <div className="text-gray-500">:</div>
            <div className="font-semibold text-gray-800">{waktuTampil}</div>
          </div>

          <button
            type="button"
            onClick={() => dispatch(resetVisitForm())}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} /> Kosongkan Formulir
          </button>
        </div>
      </section>

      <EditPasienModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        patientId={selectedPatient?.id ?? null}
      />
    </div>
  );
}

// --- Sub-components ---
function InfoRow({
  icon,
  label,
  value,
  relaxed,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  relaxed?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
      <div className="flex gap-4 text-xs">
        <span className="text-gray-500 w-12 shrink-0">{label}</span>
        <span className={`text-gray-800 font-medium ${relaxed ? 'leading-relaxed' : ''}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

interface FormSelectProps {
  label: string;
  required?: boolean;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
}

function FormSelect({
  label,
  required,
  placeholder,
  options,
  value,
  onChange,
  error,
  loading,
  disabled,
}: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-semibold text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative w-full">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled || loading}
          aria-invalid={!!error}
          className={`w-full appearance-none bg-white border rounded-md py-2 pl-3 pr-8 text-xs outline-none focus:ring-1 text-ellipsis disabled:bg-gray-50 disabled:cursor-not-allowed ${
            value ? 'text-gray-800' : 'text-gray-500'
          } ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-500'
          }`}
        >
          <option value="" disabled>
            {loading ? 'Memuat...' : placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <ChevronDown size={14} />}
        </div>
      </div>
      {error && (
        <p role="alert" className="text-[10px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
