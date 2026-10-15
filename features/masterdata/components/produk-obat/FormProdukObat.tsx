'use client';
// Lokasi: src/features/masterdata/components/produk-obat/FormProdukObat.tsx
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { cancelForm, saveProduk, setField } from '@/features/masterdata/master-farmasi/produk-obat/slices/produkObatSlice';
import { OPSI_FORMULARIUM, OPSI_STATUS } from '@/features/masterdata/master-farmasi/produk-obat/utils/produkObatHelpers';
import { FormInput, FormSelect, focusFirstError } from '../sdmk/SdmkFields';
import { btnOutline, btnPrimary, InfoNote, PanelHeader } from './produkObatUi';
import type { ProdukObatForm, StatusProduk } from '@/types/domain/produkObat';

export default function FormProdukObat() {
  const dispatch = useAppDispatch();
  const { form, errors, editingId, saving } = useAppSelector((s) => s.produkObat);
  const edit = editingId !== null;

  const set = (field: keyof ProdukObatForm) => (value: string) => dispatch(setField({ field, value }));

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveProduk()).unwrap()
      .then(() => dispatch(showNotification({
        title: 'Tersimpan', message: edit ? 'Snapshot obat berhasil diperbarui.' : 'Snapshot obat berhasil ditambahkan.', type: 'success',
      })))
      .catch((err: { message: string }) => {
        dispatch(showNotification({ title: 'Gagal Menyimpan', message: err.message, type: 'error' }));
        focusFirstError();
      });
  };

  return (
    <form onSubmit={simpan} noValidate aria-labelledby="judul-form-produk" className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <PanelHeader id="judul-form-produk" title={edit ? 'Ubah Snapshot Obat' : 'Tambah Snapshot Obat'}
        backLabel={edit ? 'Kembali ke detail' : 'Kosongkan form'} onBack={() => dispatch(cancelForm())} />

      <div className="p-5 space-y-4">
        <InfoNote>
          Data identitas disimpan sebagai snapshot. KFA code tidak dapat diubah setelah produk dibuat.
        </InfoNote>

        <div className="grid grid-cols-2 gap-3">
          <FormInput label="KFA code" required disabled={edit} value={form.kfaCode} onChange={set('kfaCode')} error={errors.kfaCode}
            placeholder="Kode dari KFA" maxLength={30} inputMode="text" />
          <FormInput label="Kode lokal" required value={form.kodeLokal} onChange={set('kodeLokal')} error={errors.kodeLokal}
            placeholder="OBT-0001" maxLength={30} />
        </div>

        <FormInput label="Nama produk" required value={form.nama} onChange={set('nama')} error={errors.nama}
          placeholder="Nama tampil di resep" maxLength={150} />
        <FormInput label="Nama generik" value={form.namaGenerik} onChange={set('namaGenerik')} error={errors.namaGenerik} maxLength={150} />
        <FormInput label="Zat aktif" required value={form.zatAktif} onChange={set('zatAktif')} error={errors.zatAktif}
          helperText="Beberapa zat aktif dipisahkan dengan koma." maxLength={200} />

        <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-3">
          <FormInput label="Kekuatan" value={form.kekuatan} onChange={set('kekuatan')} error={errors.kekuatan}
            placeholder="500" inputMode="decimal" maxLength={12} />
          <FormInput label="Satuan" value={form.satuan} onChange={set('satuan')} error={errors.satuan} placeholder="mg" maxLength={20} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Bentuk sediaan" required value={form.bentukSediaan} onChange={set('bentukSediaan')}
            error={errors.bentukSediaan} placeholder="Tablet" maxLength={50} />
          <FormSelect label="Status" value={form.status} onChange={(v) => set('status')(v as StatusProduk)} options={OPSI_STATUS} />
        </div>

        <FormInput label="Rute pemberian" required value={form.ruteText} onChange={set('ruteText')} error={errors.ruteText}
          placeholder="PO=Oral" helperText="Format kode=label, pisahkan dengan koma." />

        <div className="grid grid-cols-2 gap-3">
          <FormSelect label="Status formularium" required value={form.statusFormularium} onChange={set('statusFormularium')}
            options={OPSI_FORMULARIUM} placeholder="Pilih status" error={errors.statusFormularium} />
          <FormInput label="Produsen" value={form.produsen} onChange={set('produsen')} error={errors.produsen} maxLength={100} />
        </div>
      </div>

      <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
        <button type="button" onClick={() => dispatch(cancelForm())} disabled={saving} className={btnOutline}>Batal</button>
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {edit ? 'Simpan perubahan' : 'Tambah snapshot'}
        </button>
      </div>
    </form>
  );
}
