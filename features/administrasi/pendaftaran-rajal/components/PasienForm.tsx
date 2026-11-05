'use client';
// Lokasi yang disarankan: src/features/pendaftaran/components/PasienForm.tsx
// Form data pasien (bagian A-E) yang dipakai bersama oleh RegistrasiPasienModal (create)
// dan EditPasienModal (edit). Seluruh nilainya dibaca/ditulis lewat state.registration.

import React, { useEffect, useId, useRef } from 'react';
import { Calendar, ChevronDown, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { Pendaftaran, PendaftaranForm, WilayahLevel } from '@/types/domain/pendaftaran';
import { cekNik, fetchWilayah, setErrors, setField } from '../slices/registrationSlice';
import {
  OPSI_BAHASA,
  OPSI_HUBUNGAN,
  OPSI_JENIS_IDENTITAS,
  OPSI_JENIS_KELAMIN,
  OPSI_KEWARGANEGARAAN,
  OPSI_STATUS_PERKAWINAN,
  isNikValid,
  isoToTanggal,
  maskTanggal,
  tanggalToIso,
  type Opsi,
} from '../utils/pendaftaranHelpers';

interface PasienFormProps {
  mode: 'create' | 'edit';
  /** Mode edit: tampilkan badge "Terverifikasi" di samping NIK */
  nikTerverifikasi?: boolean;
  /** Mode create: dipanggil bila NIK ternyata sudah terdaftar & petugas ingin memakai pasien itu */
  onGunakanPasienTerdaftar?: (pasien: Pendaftaran) => void;
}

/** Fokuskan kolom error pertama (panggil setelah validasi gagal) */
export function focusFirstError() {
  requestAnimationFrame(() =>
    document.querySelector<HTMLElement>('#pasien-form [aria-invalid="true"]')?.focus(),
  );
}

export default function PasienForm({
  mode,
  nikTerverifikasi = false,
  onGunakanPasienTerdaftar,
}: PasienFormProps) {
  const dispatch = useAppDispatch();
  const { form, errors, nikStatus, nikMessage, pasienTerdaftar, wilayah, wilayahLoading, editingId } =
    useAppSelector((state) => state.registration);

  const nikId = useId();

  // Muat daftar provinsi (sekali; hasilnya dipertahankan saat form di-reset)
  useEffect(() => {
    if (wilayah.provinsi.length === 0) dispatch(fetchWilayah({ level: 'provinsi' }));
  }, [wilayah.provinsi.length, dispatch]);

  // ------------------------------------------------------------------
  // Handler
  // ------------------------------------------------------------------
  const update = (field: keyof PendaftaranForm, value: string) =>
    dispatch(setField({ field, value }));

  const onText =
    (field: keyof PendaftaranForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      update(field, e.target.value);

  const onDigits =
    (field: keyof PendaftaranForm, maxLength: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      update(field, e.target.value.replace(/\D/g, '').slice(0, maxLength));

  // Pilih wilayah -> simpan kode -> muat opsi level di bawahnya
  const onWilayah =
    (field: keyof PendaftaranForm, childLevel: WilayahLevel) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const kode = e.target.value;
      update(field, kode);
      if (kode) dispatch(fetchWilayah({ level: childLevel, parentKode: kode }));
    };

  const handleCekNik = () => {
    if (!isNikValid(form.nik)) {
      dispatch(setErrors({ ...errors, nik: 'NIK harus 16 digit angka' }));
      return;
    }
    dispatch(
      cekNik({ nik: form.nik, exceptId: mode === 'edit' ? (editingId ?? undefined) : undefined }),
    );
  };

  // ------------------------------------------------------------------
  // Turunan tampilan
  // ------------------------------------------------------------------
  const isNik = form.jenisIdentitas === 'NIK';
  const isWna = form.jenisIdentitas === 'WNA';
  const isTanpaNik = form.jenisIdentitas === 'TANPA_NIK';

  const labelIdentitas = isWna ? 'Nomor Paspor' : isTanpaNik ? 'Nomor Identitas' : 'NIK';
  const placeholderIdentitas = isWna
    ? 'Masukkan nomor paspor'
    : isTanpaNik
      ? 'Tidak diperlukan'
      : 'Masukkan 16 digit NIK';

  const checkingNik = nikStatus === 'checking';
  const showVerifiedBadge = mode === 'edit' && nikTerverifikasi && isNik && nikStatus === 'idle';

  return (
    <div id="pasien-form" className="space-y-8">
      {/* Section A: Identitas Pasien */}
      <section>
        <SectionTitle title="A. IDENTITAS PASIEN" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Jenis Identitas */}
          <RadioGroup
            label="Jenis Identitas"
            required
            name="jenisIdentitas"
            value={form.jenisIdentitas}
            options={OPSI_JENIS_IDENTITAS}
            onChange={(v) => update('jenisIdentitas', v)}
            error={errors.jenisIdentitas}
          />

          {/* NIK / Paspor + tombol Cek NIK (create) / Verifikasi Ulang (edit) */}
          <div>
            <Field
              label={labelIdentitas}
              required={!isTanpaNik}
              htmlFor={nikId}
              error={errors.nik}
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id={nikId}
                    type="text"
                    inputMode={isNik ? 'numeric' : 'text'}
                    autoComplete="off"
                    maxLength={isNik ? 16 : 20}
                    placeholder={placeholderIdentitas}
                    value={form.nik}
                    disabled={isTanpaNik}
                    aria-invalid={!!errors.nik}
                    onChange={
                      isNik
                        ? onDigits('nik', 16)
                        : (e) => update('nik', e.target.value.toUpperCase())
                    }
                    className={`${inputClass(!!errors.nik)} ${showVerifiedBadge ? 'pr-28' : ''}`}
                  />
                  {showVerifiedBadge && (
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded">
                        Terverifikasi
                      </span>
                    </div>
                  )}
                </div>
                {isNik && (
                  <button
                    type="button"
                    onClick={handleCekNik}
                    disabled={checkingNik}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60 flex items-center gap-2 whitespace-nowrap"
                  >
                    {checkingNik && <Loader2 size={14} className="animate-spin" />}
                    {mode === 'edit' ? 'Verifikasi Ulang' : 'Cek NIK'}
                  </button>
                )}
              </div>
            </Field>

            {isNik && nikStatus !== 'idle' && nikStatus !== 'checking' && nikMessage && (
              <NikStatusMessage
                status={nikStatus}
                message={nikMessage}
                onLanjut={
                  mode === 'create' &&
                  nikStatus === 'exists' &&
                  pasienTerdaftar &&
                  onGunakanPasienTerdaftar
                    ? () => onGunakanPasienTerdaftar(pasienTerdaftar)
                    : undefined
                }
              />
            )}
          </div>

          {/* Nama Lengkap */}
          <FormInput
            label="Nama Lengkap"
            required
            placeholder={isWna ? 'Sesuai paspor' : 'Sesuai KTP/NIK'}
            value={form.namaLengkap}
            onChange={onText('namaLengkap')}
            error={errors.namaLengkap}
            autoComplete="off"
          />

          {/* Tempat & Tanggal Lahir */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Tempat Lahir"
              placeholder="Contoh: Malang"
              value={form.tempatLahir}
              onChange={onText('tempatLahir')}
              error={errors.tempatLahir}
              autoComplete="off"
            />
            <DateField
              label="Tanggal Lahir"
              required
              value={form.tanggalLahir}
              onChange={(v) => update('tanggalLahir', v)}
              error={errors.tanggalLahir}
            />
          </div>

          {/* Jenis Kelamin */}
          <RadioGroup
            label="Jenis Kelamin"
            required
            name="jenisKelamin"
            value={form.jenisKelamin}
            options={OPSI_JENIS_KELAMIN}
            onChange={(v) => update('jenisKelamin', v)}
            error={errors.jenisKelamin}
          />
        </div>
      </section>

      {/* Section B: Alamat Sesuai Identitas */}
      <section>
        <SectionTitle title="B. ALAMAT SESUAI IDENTITAS" />

        <div className="grid grid-cols-1 gap-5 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <FormInput
              label="Alamat Lengkap"
              required
              placeholder="Nama jalan, nomor rumah, RT/RW"
              value={form.alamatLengkap}
              onChange={onText('alamatLengkap')}
              error={errors.alamatLengkap}
              autoComplete="off"
            />
            <FormSelect
              label="Provinsi"
              required
              placeholder="Pilih Provinsi"
              options={toOpsi(wilayah.provinsi)}
              value={form.provinsi}
              loading={wilayahLoading.provinsi}
              onChange={onWilayah('provinsi', 'kabupaten')}
              error={errors.provinsi}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect
              label="Kabupaten/Kota"
              required
              placeholder="Pilih Kabupaten/Kota"
              options={toOpsi(wilayah.kabupaten)}
              value={form.kabupatenKota}
              loading={wilayahLoading.kabupaten}
              disabled={!form.provinsi}
              onChange={onWilayah('kabupatenKota', 'kecamatan')}
              error={errors.kabupatenKota}
            />
            <FormSelect
              label="Kecamatan"
              required
              placeholder="Pilih Kecamatan"
              options={toOpsi(wilayah.kecamatan)}
              value={form.kecamatan}
              loading={wilayahLoading.kecamatan}
              disabled={!form.kabupatenKota}
              onChange={onWilayah('kecamatan', 'desa')}
              error={errors.kecamatan}
            />
            <FormSelect
              label="Desa/Kelurahan"
              required
              placeholder="Pilih Desa/Kelurahan"
              options={toOpsi(wilayah.desa)}
              value={form.desaKelurahan}
              loading={wilayahLoading.desa}
              disabled={!form.kecamatan}
              onChange={onText('desaKelurahan')}
              error={errors.desaKelurahan}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="RT"
              placeholder="Contoh: 001"
              inputMode="numeric"
              value={form.rt}
              onChange={onDigits('rt', 3)}
              error={errors.rt}
            />
            <FormInput
              label="RW"
              placeholder="Contoh: 002"
              inputMode="numeric"
              value={form.rw}
              onChange={onDigits('rw', 3)}
              error={errors.rw}
            />
            <FormInput
              label="Kode Pos"
              placeholder="Contoh: 65145"
              inputMode="numeric"
              value={form.kodePos}
              onChange={onDigits('kodePos', 5)}
              error={errors.kodePos}
            />
          </div>
        </div>
      </section>

      {/* Section C: Kontak Pasien */}
      <section>
        <SectionTitle title="C. KONTAK PASIEN" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormInput
            label="Nomor HP"
            required
            type="tel"
            inputMode="numeric"
            placeholder="08xxxxxxxxxx"
            value={form.nomorHP}
            onChange={onDigits('nomorHP', 15)}
            error={errors.nomorHP}
          />
          <FormInput
            label="Email"
            type="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={onText('email')}
            error={errors.email}
            autoComplete="off"
          />
        </div>
      </section>

      {/* Section D: Data Administrasi */}
      <section>
        <SectionTitle title="D. DATA ADMINISTRASI" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <FormInput
            label="Nomor Kartu Keluarga"
            placeholder="Masukkan 16 digit nomor KK"
            inputMode="numeric"
            value={form.nomorKK}
            onChange={onDigits('nomorKK', 16)}
            error={errors.nomorKK}
          />
          <FormSelect
            label="Status Perkawinan"
            placeholder="Pilih Status"
            options={OPSI_STATUS_PERKAWINAN}
            value={form.statusPerkawinan}
            onChange={onText('statusPerkawinan')}
            error={errors.statusPerkawinan}
          />
          <FormSelect
            label="Kewarganegaraan"
            required
            placeholder="Pilih Kewarganegaraan"
            options={OPSI_KEWARGANEGARAAN}
            value={form.kewarganegaraan}
            onChange={onText('kewarganegaraan')}
            error={errors.kewarganegaraan}
          />
          <FormSelect
            label="Bahasa Komunikasi"
            placeholder="Pilih Bahasa"
            options={OPSI_BAHASA}
            value={form.bahasa}
            onChange={onText('bahasa')}
            error={errors.bahasa}
          />
        </div>
      </section>

      {/* Section E: Kontak Darurat */}
      <section>
        <SectionTitle title="E. KONTAK DARURAT" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <FormInput
            label="Nama Kontak Darurat"
            placeholder="Nama lengkap"
            value={form.namaKontakDarurat}
            onChange={onText('namaKontakDarurat')}
            error={errors.namaKontakDarurat}
            autoComplete="off"
          />
          <FormSelect
            label="Hubungan"
            placeholder="Pilih Hubungan"
            options={OPSI_HUBUNGAN}
            value={form.hubunganKontakDarurat}
            onChange={onText('hubunganKontakDarurat')}
            error={errors.hubunganKontakDarurat}
          />
          <FormInput
            label="Nomor HP Kontak Darurat"
            type="tel"
            inputMode="numeric"
            placeholder="08xxxxxxxxxx"
            value={form.nomorHPKontakDarurat}
            onChange={onDigits('nomorHPKontakDarurat', 15)}
            error={errors.nomorHPKontakDarurat}
          />
        </div>
      </section>
    </div>
  );
}

// --- Internal Helper Components ---

const toOpsi = (items: { kode: string; nama: string }[]): Opsi[] =>
  items.map((i) => ({ value: i.kode, label: i.nama }));

const inputClass = (hasError: boolean) =>
  `w-full border rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-1 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
      : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-500'
  }`;

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-bold text-cyan-700 border-l-2 border-red-500 pl-2">{title}</h3>
  );
}

function Label({ text, required, htmlFor }: { text: string; required?: boolean; htmlFor?: string }) {
  const className = 'block text-xs font-semibold text-[#0b2756]';
  const content = (
    <>
      {text} {required && <span className="text-red-500">*</span>}
    </>
  );
  return htmlFor ? (
    <label htmlFor={htmlFor} className={className}>
      {content}
    </label>
  ) : (
    <span className={className}>{content}</span>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}

/** Pembungkus label + kontrol + pesan error */
function Field({ label, required, htmlFor, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} htmlFor={htmlFor} />
      {children}
      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  error?: string;
};

function FormInput({ label, required, error, ...inputProps }: FormInputProps) {
  const id = useId();
  return (
    <Field label={label} required={required} htmlFor={id} error={error}>
      <input id={id} aria-invalid={!!error} className={inputClass(!!error)} {...inputProps} />
    </Field>
  );
}

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  error?: string;
  placeholder: string;
  options: Opsi[];
  loading?: boolean;
};

function FormSelect({
  label,
  required,
  error,
  placeholder,
  options,
  loading,
  value,
  disabled,
  ...selectProps
}: FormSelectProps) {
  const id = useId();
  return (
    <Field label={label} required={required} htmlFor={id} error={error}>
      <div className="relative w-full">
        <select
          id={id}
          aria-invalid={!!error}
          value={value ?? ''}
          disabled={disabled || loading}
          className={`${inputClass(!!error)} appearance-none bg-white pr-10 ${
            value ? 'text-slate-800' : 'text-slate-500'
          }`}
          {...selectProps}
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
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
        </div>
      </div>
    </Field>
  );
}

interface RadioGroupProps {
  label: string;
  required?: boolean;
  name: string;
  value: string;
  options: Opsi[];
  onChange: (value: string) => void;
  error?: string;
}

function RadioGroup({ label, required, name, value, options, onChange, error }: RadioGroupProps) {
  return (
    <div role="radiogroup" aria-label={label}>
      <Label text={label} required={required} />
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 min-h-10">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              aria-invalid={!!error}
              className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500"
            />
            {o.label}
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

interface DateFieldProps {
  label: string;
  required?: boolean;
  /** Format DD-MM-YYYY */
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Input tanggal dengan mask DD-MM-YYYY + date picker bawaan browser lewat ikon kalender */
function DateField({ label, required, value, onChange, error }: DateFieldProps) {
  const id = useId();
  const pickerRef = useRef<HTMLInputElement>(null);
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD (waktu lokal)

  return (
    <Field label={label} required={required} htmlFor={id} error={error}>
      <div className="relative w-full">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="DD-MM-YYYY"
          value={value}
          aria-invalid={!!error}
          onChange={(e) => onChange(maskTanggal(e.target.value))}
          className={`${inputClass(!!error)} pr-10`}
        />
        <button
          type="button"
          aria-label="Pilih tanggal"
          onClick={() => pickerRef.current?.showPicker?.()}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
        >
          <Calendar size={16} />
        </button>
        <input
          ref={pickerRef}
          type="date"
          tabIndex={-1}
          aria-hidden="true"
          max={today}
          value={tanggalToIso(value)}
          onChange={(e) => onChange(isoToTanggal(e.target.value))}
          className="absolute bottom-0 right-0 h-0 w-0 opacity-0 pointer-events-none"
        />
      </div>
    </Field>
  );
}

function NikStatusMessage({
  status,
  message,
  onLanjut,
}: {
  status: 'available' | 'exists' | 'error';
  message: string;
  onLanjut?: () => void;
}) {
  const style =
    status === 'available'
      ? 'bg-green-50 text-green-700 border-green-200'
      : status === 'exists'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-red-50 text-red-600 border-red-200';

  return (
    <div className={`mt-2 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${style}`}>
      {status === 'available' ? (
        <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
      ) : (
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
      )}
      <div className="flex-1">
        <p>{message}</p>
        {onLanjut && (
          <button
            type="button"
            onClick={onLanjut}
            className="mt-1 font-semibold underline underline-offset-2 hover:no-underline"
          >
            Lanjutkan pendaftaran berobat dengan pasien ini
          </button>
        )}
      </div>
    </div>
  );
}
