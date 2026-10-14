// Lokasi: src/features/masterdata/utils/lokasiPelayananHelpers.ts
import type { LoketErrors, LoketForm, LoketItem, LoketOptions, TipeLoket } from '@/types/domain/loketCounter';

export const OPSI_TIPE: { value: TipeLoket; label: string }[] = (
  ['Ruang Pendaftaran', 'Ruang Poli', 'Ruang Farmasi', 'Ruang Kasir'] as TipeLoket[]
).map((v) => ({ value: v, label: v }));

export const initialLoket: LoketForm = { kode: '', nama: '', tipe: '', counterId: '', deskripsi: '', status: 'Aktif' };

/** Huruf besar, hanya A-Z, 0-9, dan tanda hubung. */
export const normalisasiKode = (v: string) => v.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 30);

export function validateLoket(f: LoketForm,  options: LoketOptions | null): LoketErrors {
  const e: LoketErrors = {};
  if (!/^[A-Z0-9][A-Z0-9-]{1,29}$/.test(f.kode)) e.kode = 'Kode 2-30 karakter (huruf besar, angka, tanda hubung)';
  const nama = f.nama.trim();
  if (nama.length < 2) e.nama = 'Nama minimal 2 karakter';
  else if (nama.length > 100) e.nama = 'Nama maksimal 100 karakter';
  if (!f.tipe) e.tipe = 'Tipe wajib dipilih';
  if (f.deskripsi.length > 255) e.deskripsi = 'Maksimal 255 karakter';
  return e;
}

export function toPayload(f: LoketForm) {
  return {
    kode: f.kode,
    nama: f.nama.trim(),
    tipe: f.tipe,
    counterId: f.counterId || null,
    deskripsi: f.deskripsi.trim() || null,
    status: f.status,
  };
}

export const itemToForm = (x: LoketItem): LoketForm => ({
  kode: x.kode, nama: x.nama, tipe: x.tipe, counterId: x.counterId ?? '',
  deskripsi: x.deskripsi ?? '', status: x.status,
});