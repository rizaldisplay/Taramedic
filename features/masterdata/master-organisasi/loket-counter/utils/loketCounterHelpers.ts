// Loket: src/features/masterdata/master-organisasi/loket-counter/utils/loketCounterHelpers.ts
import type { LoketErrors, LoketForm, LoketItem, TipeLoket } from '@/types/domain/loketCounter';

export const OPSI_TIPE: { value: TipeLoket; label: string }[] = (
  ['Ruang Pendaftaran', 'Ruang Poli', 'Ruang Farmasi', 'Ruang Kasir'] as TipeLoket[]
).map((v) => ({ value: v, label: v }));

export const initialLoket: LoketForm = { code: '', nama: '', tipe: '', deskripsi: '', status: 'Aktif' };

/** Huruf besar, hanya A-Z, 0-9, dan tanda hubung. */
export const normalisasiKode = (v: string) => v.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 30);

export function validateLoket(f: LoketForm): LoketErrors {
  const e: LoketErrors = {};
  if (!/^[A-Z0-9][A-Z0-9-]{1,29}$/.test(f.code)) e.code = 'Kode 2-30 karakter (huruf besar, angka, tanda hubung)';
  const nama = f.nama.trim();
  if (nama.length < 2) e.nama = 'Nama minimal 2 karakter';
  else if (nama.length > 100) e.nama = 'Nama maksimal 100 karakter';
  if (!f.tipe) e.tipe = 'Tipe wajib dipilih';
  if (f.deskripsi.length > 255) e.deskripsi = 'Maksimal 255 karakter';
  return e;
}

export function toPayload(f: LoketForm) {
  return {
    code: f.code,
    nama: f.nama.trim(),
    tipe: f.tipe,
    deskripsi: f.deskripsi.trim() || null,
    status: f.status,
  };
}

export const itemToForm = (x: LoketItem): LoketForm => ({
  code: x.code, nama: x.nama, tipe: x.tipe, deskripsi: x.deskripsi ?? '', status: x.status,
});
