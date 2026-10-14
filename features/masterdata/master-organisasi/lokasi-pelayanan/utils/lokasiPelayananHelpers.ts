// Lokasi: src/features/masterdata/utils/lokasiPelayananHelpers.ts
import type { LokasiErrors, LokasiForm, LokasiItem, LokasiOptions, TipeLokasi } from '@/types/domain/lokasiPelayanan';

export const OPSI_TIPE: { value: TipeLokasi; label: string }[] = (
  ['Gedung', 'Lantai', 'Ruang', 'Area Lainnya'] as TipeLokasi[]
).map((v) => ({ value: v, label: v }));

export const initialLokasi: LokasiForm = { kode: '', nama: '', tipe: '', indukId: '', fasyankesId: '', poliId: '', deskripsi: '', status: 'Aktif' };

/** Huruf besar, hanya A-Z, 0-9, dan tanda hubung. */
export const normalisasiKode = (v: string) => v.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 30);

/** Id lokasi itu sendiri + semua turunannya (tidak boleh dipilih sebagai induknya, agar tidak melingkar). */
export function idTerlarang(induk: LokasiOptions['induk'], id: number | null): Set<string> {
  if (id === null) return new Set();
  const out = new Set<string>([String(id)]);
  let bertambah = true;
  while (bertambah) {
    bertambah = false;
    for (const o of induk) {
      if (o.indukId && out.has(o.indukId) && !out.has(o.value)) { out.add(o.value); bertambah = true; }
    }
  }
  return out;
}

export function validateLokasi(f: LokasiForm, editingId: number | null, options: LokasiOptions | null): LokasiErrors {
  const e: LokasiErrors = {};
  if (!/^[A-Z0-9][A-Z0-9-]{1,29}$/.test(f.kode)) e.kode = 'Kode 2-30 karakter (huruf besar, angka, tanda hubung)';
  const nama = f.nama.trim();
  if (nama.length < 2) e.nama = 'Nama minimal 2 karakter';
  else if (nama.length > 100) e.nama = 'Nama maksimal 100 karakter';
  if (!f.tipe) e.tipe = 'Tipe wajib dipilih';
  if (f.indukId && idTerlarang(options?.induk ?? [], editingId).has(f.indukId)) {
    e.indukId = 'Induk tidak boleh lokasi itu sendiri atau turunannya';
  }
  if (f.poliId && f.tipe !== 'Ruang') e.poliId = 'Poli hanya untuk lokasi bertipe Ruang';
  if (f.deskripsi.length > 255) e.deskripsi = 'Maksimal 255 karakter';
  return e;
}

export function toPayload(f: LokasiForm) {
  return {
    kode: f.kode,
    nama: f.nama.trim(),
    tipe: f.tipe,
    indukId: f.indukId || null,
    fasyankesId: f.fasyankesId || null,
    // Poli hanya berlaku untuk Ruang; tipe lain selalu dikirim null agar tidak ditolak server.
    poliId: f.tipe === 'Ruang' ? f.poliId || null : null,
    deskripsi: f.deskripsi.trim() || null,
    status: f.status,
  };
}

export const itemToForm = (x: LokasiItem): LokasiForm => ({
  kode: x.kode, nama: x.nama, tipe: x.tipe, indukId: x.indukId ?? '', fasyankesId: x.fasyankesId ?? '', poliId: x.poliId ?? '',
  deskripsi: x.deskripsi ?? '', status: x.status,
});
