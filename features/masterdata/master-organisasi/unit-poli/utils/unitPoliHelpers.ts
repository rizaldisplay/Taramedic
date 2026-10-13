// Lokasi: src/features/masterdata/utils/unitPoliHelpers.ts
import type { JenisUnit, UnitPoliErrors, UnitPoliForm, UnitPoliItem } from '@/types/domain/unitPoli';

export const OPSI_JENIS: { value: JenisUnit; label: string }[] = (
  ['Poli', 'Penunjang', 'Rawat Inap', 'Administrasi', 'Lainnya'] as JenisUnit[]
).map((v) => ({ value: v, label: v }));

export const initialUnitPoli: UnitPoliForm = {
  kode: '', nama: '', jenis: '', fasyankesId: '', deskripsi: '', untukAntrean: true, status: 'Aktif',
};

/** Huruf besar, hanya A-Z, 0-9, dan tanda hubung. */
export const normalisasiKode = (v: string) => v.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20);

export function validateUnitPoli(f: UnitPoliForm): UnitPoliErrors {
  const e: UnitPoliErrors = {};
  if (!/^[A-Z0-9][A-Z0-9-]{1,19}$/.test(f.kode)) e.kode = 'Kode 2-20 karakter (huruf besar, angka, tanda hubung)';
  const nama = f.nama.trim();
  if (nama.length < 2) e.nama = 'Nama minimal 2 karakter';
  else if (nama.length > 100) e.nama = 'Nama maksimal 100 karakter';
  if (!f.jenis) e.jenis = 'Jenis wajib dipilih';
  if (f.deskripsi.length > 255) e.deskripsi = 'Maksimal 255 karakter';
  return e;
}

export function toPayload(f: UnitPoliForm) {
  return {
    kode: f.kode,
    nama: f.nama.trim(),
    jenis: f.jenis,
    fasyankesId: f.fasyankesId || null,
    deskripsi: f.deskripsi.trim() || null,
    untukAntrean: f.untukAntrean,
    status: f.status,
  };
}

export const itemToForm = (x: UnitPoliItem): UnitPoliForm => ({
  kode: x.kode, nama: x.nama, jenis: x.jenis, fasyankesId: x.fasyankesId ?? '',
  deskripsi: x.deskripsi ?? '', untukAntrean: x.untukAntrean, status: x.status,
});
