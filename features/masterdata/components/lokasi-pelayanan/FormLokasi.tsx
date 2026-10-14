'use client';
// Lokasi: src/features/masterdata/components/lokasi/FormLokasi.tsx
import React, { useEffect, useMemo } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { fetchLokasiOptions, resetForm, saveLokasi, setField } from '@/features/masterdata/master-organisasi/lokasi-pelayanan/slices/lokasiPelayananSlice';
import { OPSI_TIPE, idTerlarang } from '@/features/masterdata/master-organisasi/lokasi-pelayanan/utils/lokasiPelayananHelpers';
import { FormInput, FormSelect, Label, focusFirstError, inputCls } from '../sdmk/SdmkFields';
import type { LokasiForm, StatusLokasi } from '@/types/domain/lokasiPelayanan';

export default function FormLokasi() {
  const dispatch = useAppDispatch();
  const { form, errors, editingId, saving, options } = useAppSelector((s) => s.lokasiPelayanan);
  const edit = editingId !== null;

  useEffect(() => { dispatch(fetchLokasiOptions()); }, [dispatch]);

  // Induk: semua lokasi aktif kecuali dirinya sendiri dan turunannya (mencegah siklus).
  const opsiInduk = useMemo(() => {
    const terlarang = idTerlarang(options?.induk ?? [], editingId);
    return (options?.induk ?? []).filter((o) => !terlarang.has(o.value)).map(({ value, label }) => ({ value, label }));
  }, [options, editingId]);

  const set = (field: keyof LokasiForm) => (value: string) => dispatch(setField({ field, value }));

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveLokasi()).unwrap()
      .then(() => dispatch(showNotification({
        title: 'Tersimpan', message: edit ? 'Lokasi pelayanan berhasil diperbarui.' : 'Lokasi pelayanan berhasil ditambahkan.', type: 'success',
      })))
      .catch((err: { message: string }) => {
        dispatch(showNotification({ title: 'Gagal Menyimpan', message: err.message, type: 'error' }));
        focusFirstError();
      });
  };

  return (
    <form onSubmit={simpan} noValidate aria-labelledby="judul-form-lokasi" className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4">
        <h3 id="judul-form-lokasi" className="text-lg font-bold text-[#0b2756] leading-snug">
          {edit ? 'Ubah' : 'Tambah'}<br />Lokasi Pelayanan
        </h3>
        <span className="text-xs text-slate-400 text-right">Tersimpan di<br />database</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Kode" required value={form.kode} onChange={set('kode')} error={errors.kode}
            placeholder="GEDUNG-UTAMA" maxLength={30} />
          <FormInput label="Nama" required value={form.nama} onChange={set('nama')} error={errors.nama}
            placeholder="Nama lokasi" maxLength={100} />
        </div>

        <FormSelect label="Tipe" required value={form.tipe} onChange={set('tipe')} options={OPSI_TIPE}
          placeholder="Pilih tipe" error={errors.tipe} />

        <FormSelect label="Induk lokasi" value={form.indukId} onChange={set('indukId')} options={opsiInduk}
          loading={!options} placeholder="Tingkat atas (tanpa induk)" error={errors.indukId} />

        {form.tipe === 'Ruang' && (
          <FormSelect label="Unit / Poli" value={form.poliId} onChange={set('poliId')}
            options={options?.poli ?? []} loading={!options} placeholder="Tidak terikat poli" error={errors.poliId} />
        )}

        <FormSelect label="Fasyankes" value={form.fasyankesId} onChange={set('fasyankesId')}
          options={options?.fasyankes ?? []} loading={!options} placeholder="Semua fasyankes" error={errors.fasyankesId} />

        <div className="flex flex-col gap-1.5">
          <Label text="Deskripsi" htmlFor="lokasi-deskripsi" />
          <textarea id="lokasi-deskripsi" rows={3} value={form.deskripsi} maxLength={255}
            onChange={(e) => set('deskripsi')(e.target.value)} placeholder="Keterangan atau aturan penggunaan..."
            aria-invalid={!!errors.deskripsi} data-sdmk-error={errors.deskripsi ? 'true' : undefined}
            className={`${inputCls(errors.deskripsi)} resize-y`} />
          <div className="flex justify-between text-[11px]">
            <span role="alert" className="text-red-500">{errors.deskripsi}</span>
            <span className="text-slate-400">{form.deskripsi.length}/255</span>
          </div>
        </div>

        {edit && (
          <FormSelect label="Status" value={form.status} onChange={(v) => set('status')(v as StatusLokasi)}
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
          {edit ? 'Simpan perubahan' : 'Tambah lokasi'}
        </button>
      </div>
    </form>
  );
}