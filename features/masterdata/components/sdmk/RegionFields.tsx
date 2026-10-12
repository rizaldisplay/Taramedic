'use client';
// Lokasi: src/features/masterdata/components/sdmk/RegionFields.tsx
// Dropdown wilayah bertingkat (Wilayah.id) untuk form identitas & SIP.
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWilayahSdmk, type WilayahTarget } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import { FormSelect } from '@/features/masterdata/components/sdmk/SdmkFields';

type RegionField = 'provinsi' | 'kabupatenKota' | 'kecamatan' | 'desaKelurahan';
export type RegionValues = Record<RegionField, string>;

interface Props {
  target: WilayahTarget;
  values: RegionValues;
  errors: Partial<Record<RegionField, string>>;
  onChange: (field: RegionField, value: string) => void;
  disabled?: boolean;
}

export default function RegionFields({ target, values, errors, onChange, disabled }: Props) {
  const dispatch = useAppDispatch();
  const wil = useAppSelector((s) => s.sdmk.wilayah[target]);

  // Muat tiap level begitu induknya terisi dan daftarnya masih kosong.
  // Dependensi memakai panjang daftar, jadi daftar kosong dari server tidak memicu fetch berulang.
  useEffect(() => { if (!wil.provinsi.length) dispatch(fetchWilayahSdmk({ target, level: 'provinsi' })); }, [dispatch, target, wil.provinsi.length]);
  useEffect(() => { if (values.provinsi && !wil.kabupaten.length) dispatch(fetchWilayahSdmk({ target, level: 'kabupaten', parentKode: values.provinsi })); }, [dispatch, target, values.provinsi, wil.kabupaten.length]);
  useEffect(() => { if (values.kabupatenKota && !wil.kecamatan.length) dispatch(fetchWilayahSdmk({ target, level: 'kecamatan', parentKode: values.kabupatenKota })); }, [dispatch, target, values.kabupatenKota, wil.kecamatan.length]);
  useEffect(() => { if (values.kecamatan && !wil.desa.length) dispatch(fetchWilayahSdmk({ target, level: 'desa', parentKode: values.kecamatan })); }, [dispatch, target, values.kecamatan, wil.desa.length]);

  const opts = (l: typeof wil.provinsi) => l.map((w) => ({ value: w.kode, label: w.nama }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <FormSelect label="Provinsi" required placeholder="Pilih Provinsi" value={values.provinsi} options={opts(wil.provinsi)} error={errors.provinsi} disabled={disabled} loading={!wil.provinsi.length} onChange={(v) => onChange('provinsi', v)} />
      <FormSelect label="Kabupaten / Kota" required placeholder="Pilih Kabupaten / Kota" value={values.kabupatenKota} options={opts(wil.kabupaten)} error={errors.kabupatenKota} disabled={disabled || !values.provinsi} loading={!!values.provinsi && !wil.kabupaten.length} onChange={(v) => onChange('kabupatenKota', v)} />
      <FormSelect label="Kecamatan" required placeholder="Pilih Kecamatan" value={values.kecamatan} options={opts(wil.kecamatan)} error={errors.kecamatan} disabled={disabled || !values.kabupatenKota} loading={!!values.kabupatenKota && !wil.kecamatan.length} onChange={(v) => onChange('kecamatan', v)} />
      <FormSelect label="Kelurahan / Desa" required placeholder="Pilih Kelurahan / Desa" value={values.desaKelurahan} options={opts(wil.desa)} error={errors.desaKelurahan} disabled={disabled || !values.kecamatan} loading={!!values.kecamatan && !wil.desa.length} onChange={(v) => onChange('desaKelurahan', v)} />
    </div>
  );
}
