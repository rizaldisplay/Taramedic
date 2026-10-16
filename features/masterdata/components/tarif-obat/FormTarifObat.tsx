'use client';
// Lokasi: src/features/masterdata/components/tarif-obat/FormTarifObat.tsx
import React, { useEffect, useMemo } from 'react';
import { Check, Loader2, Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { fetchTarifOptions, resetForm, saveTarif, setField } from '@/features/masterdata/master-farmasi/tarif-obat/slices/tarifObatSlice';
import { formatRupiah, OPSI_PENJAMIN_BAWAAN } from '@/features/masterdata/master-farmasi/tarif-obat/utils/tarifObatHelpers';
import { FormInput, FormSelect, Label, focusFirstError, inputCls } from '../sdmk/SdmkFields';
import RiwayatTarifObat from './RiwayatTarifObat';
import { btnOutline, btnPrimary, InfoNote } from './tarifObatUi';
import type { TarifObatForm } from '@/types/domain/tarifObat';

export default function FormTarifObat() {
  const dispatch = useAppDispatch();
  const { form, errors, editingId, saving, options, items } = useAppSelector((s) => s.tarifObat);
  const edit = editingId !== null;

  useEffect(() => { dispatch(fetchTarifOptions()); }, [dispatch]);

  // Obat yang sedang diedit tetap muncul di pilihan walau sudah nonaktif (tidak ada di daftar obat aktif).
  const opsiObat = useMemo(() => {
    const dasar = (options?.obat ?? []).map(({ value, label }) => ({ value, label }));
    const sedangDiedit = edit ? items.find((x) => x.id === editingId) : undefined;
    if (sedangDiedit && !dasar.some((o) => o.value === String(sedangDiedit.obatId))) {
      dasar.unshift({ value: String(sedangDiedit.obatId), label: `${sedangDiedit.obatKode} · ${sedangDiedit.obatNama}` });
    }
    return dasar;
  }, [options, edit, editingId, items]);

  const opsiPenjamin = useMemo(() => {
    const daftar = options?.penjamin ?? OPSI_PENJAMIN_BAWAAN;
    return (form.penjamin && !daftar.includes(form.penjamin) ? [form.penjamin, ...daftar] : daftar).map((v) => ({ value: v, label: v }));
  }, [options, form.penjamin]);

  const set = (field: keyof TarifObatForm) => (value: string) => dispatch(setField({ field, value }));

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveTarif()).unwrap()
      .then(() => dispatch(showNotification({
        title: 'Tersimpan', message: edit ? 'Tarif obat berhasil diperbarui.' : 'Tarif obat berhasil ditambahkan.', type: 'success',
      })))
      .catch((err: { message: string }) => {
        dispatch(showNotification({ title: 'Gagal Menyimpan', message: err.message, type: 'error' }));
        focusFirstError();
      });
  };

  const tarifTeks = form.tarif ? `${formatRupiah(Number(form.tarif))} per ${form.satuan.trim() || 'satuan'}` : undefined;

  return (
    <form onSubmit={simpan} noValidate aria-labelledby="judul-form-tarif" className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
        <h3 id="judul-form-tarif" className="text-lg font-bold text-[#0b2756]">{edit ? 'Edit Tarif Obat' : 'Tambah Tarif Obat'}</h3>
        <span className="text-xs font-semibold text-slate-500">Per penjamin</span>
      </div>

      <div className="p-5 space-y-4">
        <InfoNote>Tarif berlaku sesuai penjamin, satuan, dan masa berlakunya.</InfoNote>

        <FormSelect label="Obat" required value={form.obatId} onChange={set('obatId')} options={opsiObat}
          loading={!options} placeholder="Pilih obat" error={errors.obatId} />

        <div className="grid grid-cols-2 gap-3">
          <FormSelect label="Penjamin" required value={form.penjamin} onChange={set('penjamin')} options={opsiPenjamin}
            placeholder="Pilih penjamin" error={errors.penjamin} />
          <FormInput label="Satuan" required value={form.satuan} onChange={set('satuan')} error={errors.satuan}
            placeholder="tablet" maxLength={30} />
        </div>

        <FormInput label="Tarif per satuan (IDR)" required value={form.tarif} onChange={set('tarif')} error={errors.tarif}
          placeholder="0" inputMode="numeric" maxLength={9} helperText={tarifTeks} />

        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Berlaku mulai" required type="date" value={form.berlakuMulai} onChange={set('berlakuMulai')}
            error={errors.berlakuMulai} />
          <FormInput label="Berlaku sampai" type="date" value={form.berlakuSampai} onChange={set('berlakuSampai')}
            error={errors.berlakuSampai} helperText="Kosongkan bila berlaku seterusnya." />
        </div>

        <FormInput label="Sumber tarif" value={form.sumber} onChange={set('sumber')} error={errors.sumber}
          placeholder="Mis. SK Direktur No. …" maxLength={100} />

        <div className="flex flex-col gap-1.5">
          <Label text="Catatan" htmlFor="tarif-catatan" />
          <textarea id="tarif-catatan" rows={3} value={form.catatan} maxLength={255}
            onChange={(e) => set('catatan')(e.target.value)} placeholder="Keterangan tambahan..."
            aria-invalid={!!errors.catatan} data-sdmk-error={errors.catatan ? 'true' : undefined}
            className={`${inputCls(errors.catatan)} resize-y`} />
          <div className="flex justify-between text-[11px]">
            <span role="alert" className="text-red-500">{errors.catatan}</span>
            <span className="text-slate-400">{form.catatan.length}/255</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
        <button type="button" onClick={() => dispatch(resetForm())} disabled={saving} className={btnOutline}>
          {edit ? 'Batal edit' : 'Bersihkan'}
        </button>
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : edit ? <Save size={16} /> : <Check size={16} />}
          {edit ? 'Simpan perubahan' : 'Tambah tarif'}
        </button>
      </div>

      <div className="pt-1" />
      <RiwayatTarifObat />
    </form>
  );
}
