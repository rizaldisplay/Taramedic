// Lokasi: src/types/domain/tarifObat.ts
// Master data Farmasi · Tarif Obat: tarif internal per obat, penjamin, satuan, dan masa berlaku.
// Tarif ini untuk invoice internal, bukan nilai klaim BPJS/asuransi.

export type StatusTarif = 'Aktif' | 'Nonaktif';

/** Isian form; semua berupa string ('' = belum diisi). Tanggal berformat YYYY-MM-DD (input type="date"). */
export interface TarifObatForm {
  obatId: string;
  penjamin: string;
  satuan: string;
  tarif: string;
  berlakuMulai: string;
  berlakuSampai: string;
  sumber: string;
  catatan: string;
}

export type TarifObatErrors = Partial<Record<keyof TarifObatForm, string>>;

export interface TarifObatItem {
  id: number;
  obatId: number;
  obatNama: string;
  /** Kode lokal obat, mis. OBT-PCT-500 */
  obatKode: string;
  penjamin: string;
  satuan: string;
  /** Rupiah per satuan (bilangan bulat >= 0) */
  tarif: number;
  /** YYYY-MM-DD */
  berlakuMulai: string;
  /** YYYY-MM-DD; null = berlaku seterusnya */
  berlakuSampai: string | null;
  sumber: string | null;
  catatan: string | null;
  status: StatusTarif;
}

export interface TarifObatListResponse {
  data: TarifObatItem[];
  meta: { currentPage: number; lastPage: number; perPage: number; total: number };
}

export interface TarifObatOptions {
  /** Obat aktif; `satuan` = saran satuan (dari bentuk sediaan) untuk mengisi form otomatis */
  obat: { value: string; label: string; satuan: string }[];
  penjamin: string[];
}

export type AksiRiwayat = 'dibuat' | 'diubah' | 'diaktifkan' | 'dinonaktifkan';

export interface PerubahanTarif {
  field: 'tarif' | 'penjamin' | 'satuan' | 'berlakuMulai' | 'berlakuSampai' | 'sumber' | 'catatan' | 'status';
  label: string;
  dari: string | null;
  ke: string | null;
}

export interface RiwayatTarifItem {
  id: number;
  aksi: AksiRiwayat;
  oleh: string | null;
  /** ISO 8601 */
  waktu: string;
  perubahan: PerubahanTarif[];
}

export interface RiwayatTarifResponse {
  data: RiwayatTarifItem[];
}
