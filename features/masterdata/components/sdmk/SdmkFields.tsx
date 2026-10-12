'use client';
// Lokasi: src/features/masterdata/components/sdmk/SdmkFields.tsx
// Komponen field terkontrol yang dipakai bersama oleh semua tab & modal SDMK.
import React, { useRef } from 'react';
import { Calendar, ChevronDown, Loader2 } from 'lucide-react';
import type { Opsi } from '@/types/domain/sdmk';
import { maskTanggal } from '@/features/masterdata/master-sdmk/utils/sdmkHelpers';

export const inputCls = (error?: string, disabled?: boolean) =>
  `w-full border rounded-lg px-3 py-2 text-sm outline-none text-slate-800 focus:ring-1 ${
    error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-500'
  } ${disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-white'}`;

/** Fokuskan field pertama yang bertanda error (atribut data-error). */
export const focusFirstError = () => {
  requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>('[data-sdmk-error="true"]');
    el?.focus();
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
};

export function Label({ text, required, htmlFor }: { text: string; required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#0b2756]">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

const FieldError = ({ id, error }: { id: string; error?: string }) =>
  error ? <p id={id} role="alert" className="text-[11px] text-red-500">{error}</p> : null;

interface BaseProps { label: string; required?: boolean; error?: string; helperText?: string; disabled?: boolean }

export function FormInput({
  label, required, error, helperText, disabled, value, onChange, placeholder, maxLength, inputMode, type = 'text', onBlur,
}: BaseProps & {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; type?: string; onBlur?: () => void;
}) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} htmlFor={id} />
      <input
        id={id} type={type} value={value} disabled={disabled} placeholder={placeholder} maxLength={maxLength}
        inputMode={inputMode} onBlur={onBlur} onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} data-sdmk-error={error ? 'true' : undefined}
        className={inputCls(error, disabled)}
      />
      {helperText && !error && <span className="text-[11px] text-slate-400">{helperText}</span>}
      <FieldError id={`${id}-err`} error={error} />
    </div>
  );
}

export function FormSelect({
  label, required, error, disabled, value, onChange, options, placeholder, loading,
}: BaseProps & { value: string; onChange: (v: string) => void; options: Opsi[]; placeholder?: string; loading?: boolean }) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} htmlFor={id} />
      <div className="relative w-full">
        <select
          id={id} value={value} disabled={disabled || loading} onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} data-sdmk-error={error ? 'true' : undefined}
          className={`${inputCls(error, disabled || loading)} appearance-none pr-10 ${value ? '' : 'text-slate-500'}`}
        >
          <option value="">{loading ? 'Memuat...' : placeholder ?? 'Pilih'}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
        </div>
      </div>
      <FieldError id={`${id}-err`} error={error} />
    </div>
  );
}

export function DateField({
  label, required, error, disabled, value, onChange,
}: BaseProps & { value: string; onChange: (v: string) => void }) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} htmlFor={id} />
      <div className="relative w-full">
        <input
          id={id} type="text" inputMode="numeric" placeholder="DD-MM-YYYY" maxLength={10} value={value} disabled={disabled}
          onChange={(e) => onChange(maskTanggal(e.target.value))}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} data-sdmk-error={error ? 'true' : undefined}
          className={`${inputCls(error, disabled)} pr-10`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400"><Calendar size={16} /></div>
      </div>
      <FieldError id={`${id}-err`} error={error} />
    </div>
  );
}

/** Input jam HH:MM (type=time menghasilkan format 24 jam yang sama dengan backend). */
export function TimeField({
  label, required, error, disabled, value, onChange, compact,
}: BaseProps & { value: string; onChange: (v: string) => void; compact?: boolean }) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {!compact && <Label text={label} required={required} htmlFor={id} />}
      <input
        id={id} type="time" value={value} disabled={disabled} aria-label={label} onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error} data-sdmk-error={error ? 'true' : undefined} className={inputCls(error, disabled)}
      />
      {!compact && <FieldError id={`${id}-err`} error={error} />}
    </div>
  );
}

export function NumberField({
  label, required, error, disabled, value, onChange, unit, max,
}: BaseProps & { value: string; onChange: (v: string) => void; unit?: string; max?: number }) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label text={label} required={required} htmlFor={id} />
      <div className="relative">
        <input
          id={id} type="text" inputMode="numeric" value={value} disabled={disabled}
          onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); onChange(max !== undefined && Number(v) > max ? String(max) : v); }}
          aria-invalid={!!error} data-sdmk-error={error ? 'true' : undefined} className={`${inputCls(error, disabled)} ${unit ? 'pr-16' : ''}`}
        />
        {unit && <span className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">{unit}</span>}
      </div>
      <FieldError id={`${id}-err`} error={error} />
    </div>
  );
}

export function RadioGroup<T extends string>({
  label, required, name, value, options, onChange, error,
}: { label: string; required?: boolean; name: string; value: T; options: readonly T[]; onChange: (v: T) => void; error?: string }) {
  return (
    <div>
      <Label text={label} required={required} />
      <div role="radiogroup" className="flex flex-wrap items-center gap-6 mt-2.5 min-h-10">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="radio" name={name} checked={value === o} onChange={() => onChange(o)} className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500" />
            {o}
          </label>
        ))}
      </div>
      <FieldError id={`${name}-err`} error={error} />
    </div>
  );
}

export function CheckboxGroup({
  label, required, options, values, onToggle, error,
}: { label: string; required?: boolean; options: Opsi[]; values: string[]; onToggle: (v: string) => void; error?: string }) {
  return (
    <div>
      <Label text={label} required={required} />
      <div className="flex flex-wrap items-center gap-5 mt-2.5">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" checked={values.includes(o.value)} onChange={() => onToggle(o.value)} className="w-4 h-4 rounded text-cyan-600 border-slate-300 focus:ring-cyan-500" />
            {o.label}
          </label>
        ))}
      </div>
      <FieldError id="cb-err" error={error} />
    </div>
  );
}

/** Area unggah file (klik atau drag & drop). Validasi tipe/ukuran dilakukan pemanggil. */
export function FileDrop({
  accept, title, hint, icon, fileName, error, disabled, onFile,
}: { accept: string; title: string; hint: string; icon: React.ReactNode; fileName?: string | null; error?: string; disabled?: boolean; onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = React.useState(false);
  return (
    <div>
      <div
        role="button" tabIndex={0} aria-disabled={disabled}
        onClick={() => !disabled && ref.current?.click()}
        onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); ref.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f && !disabled) onFile(f); }}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'} ${drag ? 'bg-cyan-50 border-cyan-400' : error ? 'border-red-300' : 'border-slate-300'}`}
      >
        <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2">{icon}</div>
        <p className="text-sm font-semibold text-slate-800">{fileName ?? title}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
      </div>
      <FieldError id="file-err" error={error} />
    </div>
  );
}

export function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls = status === 'Aktif' || status === 'Valid' || status === 'Berhasil' || status === 'terhubung'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : status === 'Akan Berakhir' || status === 'Cuti' || status === 'Belum Diverifikasi' || status === 'belum'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-slate-100 text-slate-600 border-slate-200';
  return <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${cls}`}>{status === 'terhubung' ? 'Terhubung' : status === 'belum' ? 'Belum terhubung' : status}</span>;
}
