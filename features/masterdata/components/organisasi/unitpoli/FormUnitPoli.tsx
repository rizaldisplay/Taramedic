'use client';
// Lokasi: src/features/masterdata/components/unitpoli/FormUnitPoli.tsx
import React, { useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { fetchUnitPoliOptions, resetForm, saveUnitPoli, setField } from '@/features/masterdata/master-organisasi/unit-poli/slices/unitPoliSlice';
import { OPSI_JENIS } from '@/features/masterdata/master-organisasi/unit-poli/utils/unitPoliHelpers';
import { FormInput, FormSelect, Label, focusFirstError, inputCls } from '@/features/masterdata/components/sdmk/SdmkFields';
import type { JenisUnit, StatusUnit } from '@/types/domain/unitPoli';

export default function FormUnitPoli() {
  const dispatch = useAppDispatch();
  const { form, errors, editingId, saving, options } = useAppSelector((s) => s.unitPoli);
  const edit = editingId !== null;

  useEffect(() => { dispatch(fetchUnitPoliOptions()); }, [dispatch]);

  const set = (field: Parameters<typeof setField>[0]['field']) => (value: string | boolean) =>
    dispatch(setField({ field, value }));

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveUnitPoli()).unwrap()
      .then(() => dispatch(showNotification({
        title: 'Tersimpan', message: edit ? 'Unit/poli berhasil diperbarui.' : 'Unit/poli berhasil ditambahkan.', type: 'success',
      })))
      .catch((err: { message: string }) => {
        dispatch(showNotification({ title: 'Gagal Menyimpan', message: err.message, type: 'error' }));
        focusFirstError();
      });
  };

  return (
    <form onSubmit={simpan} noValidate aria-labelledby="judul-form-unit-poli"
      className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4">
        <h3 id="judul-form-unit-poli" className="text-lg font-bold text-[#0b2756] leading-snug">
          {edit ? 'Ubah' : 'Tambah'}<br />Unit &amp; Poli
        </h3>
        <span className="text-xs text-slate-400 text-right">Tersimpan di<br />database</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Kode" required value={form.kode} onChange={set('kode')} error={errors.kode}
            placeholder="POLI-UMUM" maxLength={20} />
          <FormInput label="Nama" required value={form.nama} onChange={set('nama')} error={errors.nama}
            placeholder="Nama unit/poli" maxLength={100} />
        </div>

        <FormSelect label="Jenis" required value={form.jenis} onChange={(v) => set('jenis')(v as JenisUnit | '')}
          options={OPSI_JENIS} placeholder="Pilih jenis" error={errors.jenis} />

        <FormSelect label="Fasyankes" value={form.fasyankesId} onChange={set('fasyankesId')}
          options={options?.fasyankes ?? []} loading={!options} placeholder="Semua fasyankes" error={errors.fasyankesId} />

        <div className="flex flex-col gap-1.5">
          <Label text="Deskripsi" htmlFor="unit-poli-deskripsi" />
          <textarea id="unit-poli-deskripsi" rows={3} value={form.deskripsi} maxLength={255}
            onChange={(e) => set('deskripsi')(e.target.value)} placeholder="Keterangan atau aturan penggunaan..."
            aria-invalid={!!errors.deskripsi} data-sdmk-error={errors.deskripsi ? 'true' : undefined}
            className={`${inputCls(errors.deskripsi)} resize-y`} />
          <div className="flex justify-between text-[11px]">
            <span role="alert" className="text-red-500">{errors.deskripsi}</span>
            <span className="text-slate-400">{form.deskripsi.length}/255</span>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.untukAntrean} onChange={(e) => set('untukAntrean')(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
          <span>
            <span className="block text-xs font-semibold text-[#0b2756]">Gunakan sebagai filter antrean</span>
            <span className="block text-[11px] text-slate-400">Unit ini muncul sebagai pilihan pada modul antrean dan pendaftaran.</span>
          </span>
        </label>

        {edit && (
          <FormSelect label="Status" value={form.status} onChange={(v) => set('status')(v as StatusUnit)}
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
          {edit ? 'Simpan perubahan' : 'Tambah unit/poli'}
        </button>
      </div>
    </form>
  );
}
