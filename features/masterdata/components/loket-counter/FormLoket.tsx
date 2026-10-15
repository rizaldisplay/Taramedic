'use client';
// Loket: src/features/masterdata/components/loket-counter/FormLoket.tsx
import React, { useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { fetchLoketOptions, resetForm, saveLoket, setField } from '@/features/masterdata/master-organisasi/loket-counter/slices/loketCounterSclice';
import { OPSI_TIPE } from '@/features/masterdata/master-organisasi/loket-counter/utils/loketCounterHelpers';
import { FormInput, FormSelect, Label, focusFirstError, inputCls } from '../sdmk/SdmkFields';
import type { LoketForm, StatusLoket } from '@/types/domain/loketCounter';

export default function FormLoket() {
  const dispatch = useAppDispatch();
  const { form, errors, editingId, saving, options } = useAppSelector((s) => s.loketCounter);
  const edit = editingId !== null;

  useEffect(() => { dispatch(fetchLoketOptions()); }, [dispatch]);

  const set = (field: keyof LoketForm) => (value: string) => dispatch(setField({ field, value }));

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveLoket()).unwrap()
      .then(() => dispatch(showNotification({
        title: 'Tersimpan', message: edit ? 'Loket / counter berhasil diperbarui.' : 'Loket / counter berhasil ditambahkan.', type: 'success',
      })))
      .catch((err: { message: string }) => {
        dispatch(showNotification({ title: 'Gagal Menyimpan', message: err.message, type: 'error' }));
        focusFirstError();
      });
  };

  return (
    <form onSubmit={simpan} noValidate aria-labelledby="judul-form-loket" className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4">
        <h3 id="judul-form-loket" className="text-lg font-bold text-[#0b2756] leading-snug">
          {edit ? 'Ubah' : 'Tambah'}<br />Loket / Counter
        </h3>
        <span className="text-xs text-slate-400 text-right">Tersimpan di<br />database</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Kode" required value={form.code} onChange={set('code')} error={errors.code}
            placeholder="LOKET-1" maxLength={30} />
          <FormInput label="Nama" required value={form.nama} onChange={set('nama')} error={errors.nama}
            placeholder="Nama loket/counter" maxLength={100} />
        </div>

        <FormSelect label="Tipe" required value={form.tipe} onChange={set('tipe')} options={options?.tipe ?? OPSI_TIPE}
          placeholder="Pilih tipe" error={errors.tipe} />

        <div className="flex flex-col gap-1.5">
          <Label text="Deskripsi" htmlFor="loket-deskripsi" />
          <textarea id="loket-deskripsi" rows={3} value={form.deskripsi} maxLength={255}
            onChange={(e) => set('deskripsi')(e.target.value)} placeholder="Keterangan atau aturan penggunaan..."
            aria-invalid={!!errors.deskripsi} data-sdmk-error={errors.deskripsi ? 'true' : undefined}
            className={`${inputCls(errors.deskripsi)} resize-y`} />
          <div className="flex justify-between text-[11px]">
            <span role="alert" className="text-red-500">{errors.deskripsi}</span>
            <span className="text-slate-400">{form.deskripsi.length}/255</span>
          </div>
        </div>

        {edit && (
          <FormSelect label="Status" value={form.status} onChange={(v) => set('status')(v as StatusLoket)}
            options={[{ value: 'Aktif', label: 'Aktif' }, { value: 'Nonaktif', label: 'Nonaktif' }]} />
        )}
      </div>

      <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
        <button type="button" onClick={() => dispatch(resetForm())} disabled={saving}
          className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
          {edit ? 'Batal' : 'Bersihkan'}
        </button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-semibold text-white disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {edit ? 'Simpan perubahan' : 'Tambah loket / counter'}
        </button>
      </div>
    </form>
  );
}
