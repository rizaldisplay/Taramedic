// Lokasi: src/features/masterdata/master-farmasi/tarif-obat/utils/tarifObatHelpers.ts
import type {
  AksiRiwayat, PerubahanTarif, TarifObatErrors, TarifObatForm, TarifObatItem,
} from '@/types/domain/tarifObat';

/** Cadangan bila /options belum dimuat; harus sama dengan App\Enums\Penjamin di backend. */
export const OPSI_PENJAMIN_BAWAAN = ['Umum', 'BPJS Kesehatan', 'Asuransi Swasta'];
export const OPSI_STATUS = [{ value: 'Aktif', label: 'Aktif' }, { value: 'Nonaktif', label: 'Nonaktif' }];
export const OPSI_PER_HALAMAN = [10, 20, 50] as const;

/** Batas atas tarif (sembilan digit) = batas validasi backend. */
export const TARIF_MAKS = 999_999_999;

export const initialTarif: TarifObatForm = {
  obatId: '', penjamin: '', satuan: '', tarif: '', berlakuMulai: '', berlakuSampai: '', sumber: '', catatan: '',
};

export const LABEL_AKSI: Record<AksiRiwayat, string> = {
  dibuat: 'Tarif dibuat',
  diubah: 'Tarif diubah',
  diaktifkan: 'Tarif diaktifkan',
  dinonaktifkan: 'Tarif dinonaktifkan',
};

// ---------------------------------------------------------------- Format & normalisasi
/** Hanya angka, tanpa nol di depan, maksimal sembilan digit. */
export const normalisasiTarif = (v: string) => v.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 9);

export const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

/** "2026-01-01 – seterusnya" */
export const masaBerlaku = (x: Pick<TarifObatItem, 'berlakuMulai' | 'berlakuSampai'>) =>
  `${x.berlakuMulai} – ${x.berlakuSampai ?? 'seterusnya'}`;

/** Tanggal lokal hari ini (YYYY-MM-DD), bukan UTC, agar tidak meleset pada dini hari WIB. */
export function hariIni(now: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

/** Keadaan masa berlaku untuk tarif Aktif; tarif Nonaktif tidak punya keadaan (null). */
export function keadaanMasa(x: TarifObatItem, today: string): 'Berlaku' | 'Belum berlaku' | 'Berakhir' | null {
  if (x.status !== 'Aktif') return null;
  if (x.berlakuMulai > today) return 'Belum berlaku';
  if (x.berlakuSampai !== null && x.berlakuSampai < today) return 'Berakhir';
  return 'Berlaku';
}

export function formatTanggalWaktu(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** Nilai pada riwayat: tarif diformat Rupiah, lainnya apa adanya; kosong = "—". */
export function nilaiPerubahan(p: Pick<PerubahanTarif, 'field'>, v: string | null): string {
  if (v === null || v === '') return '—';
  if (p.field === 'tarif' && /^\d+$/.test(v)) return formatRupiah(Number(v));
  return v;
}

// ---------------------------------------------------------------- Validasi
const tanggalValid = (v: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
};

const AKHIR_WAKTU = '9999-12-31';

/** Dua rentang [mulai, sampai] (sampai null = tanpa batas) beririsan. Format ISO sehingga cukup dibandingkan sebagai teks. */
export const rentangBeririsan = (aMulai: string, aSampai: string | null, bMulai: string, bSampai: string | null) =>
  aMulai <= (bSampai ?? AKHIR_WAKTU) && bMulai <= (aSampai ?? AKHIR_WAKTU);

/**
 * Tarif Aktif lain untuk obat + penjamin + satuan yang sama tidak boleh punya masa berlaku yang beririsan.
 * Hanya pemeriksaan awal di klien atas baris yang sedang dimuat; server tetap yang menentukan.
 */
export function cariTumpangTindih(f: TarifObatForm, items: TarifObatItem[], editing: TarifObatItem | null): TarifObatItem | undefined {
  if (editing && editing.status !== 'Aktif') return undefined; // tarif nonaktif belum dipakai
  const sampai = f.berlakuSampai || null;
  return items.find((x) =>
    x.id !== editing?.id
    && x.status === 'Aktif'
    && String(x.obatId) === f.obatId
    && x.penjamin === f.penjamin
    && x.satuan.trim().toLowerCase() === f.satuan.trim().toLowerCase()
    && rentangBeririsan(f.berlakuMulai, sampai, x.berlakuMulai, x.berlakuSampai));
}

export function validateTarif(f: TarifObatForm, items: TarifObatItem[] = [], editing: TarifObatItem | null = null): TarifObatErrors {
  const e: TarifObatErrors = {};
  if (!f.obatId) e.obatId = 'Obat wajib dipilih';
  if (!f.penjamin) e.penjamin = 'Penjamin wajib dipilih';

  const satuan = f.satuan.trim();
  if (satuan.length < 1) e.satuan = 'Satuan wajib diisi';
  else if (satuan.length > 30) e.satuan = 'Satuan maksimal 30 karakter';

  if (f.tarif === '') e.tarif = 'Tarif wajib diisi (isi 0 bila gratis)';
  else if (!/^\d+$/.test(f.tarif) || Number(f.tarif) > TARIF_MAKS) e.tarif = `Tarif harus bilangan bulat 0 - ${TARIF_MAKS.toLocaleString('id-ID')}`;

  if (!tanggalValid(f.berlakuMulai)) e.berlakuMulai = 'Tanggal mulai wajib diisi';
  if (f.berlakuSampai) {
    if (!tanggalValid(f.berlakuSampai)) e.berlakuSampai = 'Tanggal tidak valid';
    else if (tanggalValid(f.berlakuMulai) && f.berlakuSampai < f.berlakuMulai) e.berlakuSampai = 'Tidak boleh sebelum tanggal mulai';
  }

  if (f.sumber.trim().length > 100) e.sumber = 'Sumber maksimal 100 karakter';
  if (f.catatan.length > 255) e.catatan = 'Maksimal 255 karakter';

  // Pemeriksaan tumpang tindih hanya bila bagian yang menentukannya sudah valid.
  if (!e.obatId && !e.penjamin && !e.satuan && !e.berlakuMulai && !e.berlakuSampai) {
    const bentrok = cariTumpangTindih(f, items, editing);
    if (bentrok) e.berlakuMulai = `Bertabrakan dengan tarif aktif ${formatRupiah(bentrok.tarif)} (${masaBerlaku(bentrok)})`;
  }
  return e;
}

// ---------------------------------------------------------------- Payload & form
/** Hanya dipanggil setelah validateTarif lolos. */
export function toPayload(f: TarifObatForm) {
  return {
    obatId: Number(f.obatId),
    penjamin: f.penjamin,
    satuan: f.satuan.trim(),
    tarif: Number(f.tarif),
    berlakuMulai: f.berlakuMulai,
    berlakuSampai: f.berlakuSampai || null,
    sumber: f.sumber.trim() || null,
    catatan: f.catatan.trim() || null,
  };
}

export const itemToForm = (x: TarifObatItem): TarifObatForm => ({
  obatId: String(x.obatId), penjamin: x.penjamin, satuan: x.satuan, tarif: String(x.tarif),
  berlakuMulai: x.berlakuMulai, berlakuSampai: x.berlakuSampai ?? '', sumber: x.sumber ?? '', catatan: x.catatan ?? '',
});
