// Lokasi: src/features/masterdata/master-farmasi/produk-obat/utils/produkObatHelpers.ts
import type {
  ClientFilters, ProdukObatErrors, ProdukObatForm, ProdukObatItem, RuteItem, SortDir, SortKey, StatusFormularium,
} from '@/types/domain/produkObat';

/** Batas baris endpoint (harus sama dengan backend). */
export const LIMIT_BARIS = 100;
export const OPSI_PER_HALAMAN = [10, 20, 50, 100] as const;

export const OPSI_FORMULARIUM: { value: StatusFormularium; label: string }[] = (
  ['Formularium', 'Non-formularium', 'Perlu persetujuan'] as StatusFormularium[]
).map((v) => ({ value: v, label: v }));

export const OPSI_STATUS = [{ value: 'Aktif', label: 'Aktif' }, { value: 'Nonaktif', label: 'Nonaktif' }];

export const OPSI_URUTAN: { value: SortKey; label: string }[] = [
  { value: 'nama', label: 'Nama produk' },
  { value: 'kfaCode', label: 'Kode KFA' },
  { value: 'zatAktif', label: 'Zat aktif' },
  { value: 'bentukSediaan', label: 'Sediaan' },
  { value: 'statusFormularium', label: 'Status katalog' },
];

export const initialProduk: ProdukObatForm = {
  kfaCode: '', kodeLokal: '', nama: '', namaGenerik: '', zatAktif: '', kekuatan: '', satuan: '',
  bentukSediaan: '', status: 'Aktif', ruteText: '', statusFormularium: 'Formularium', produsen: '',
};

export const initialFilters: ClientFilters = { formularium: '', sediaan: '', rute: '', produsen: '' };

// ---------------------------------------------------------------- Normalisasi input
export const normalisasiKfa = (v: string) => v.replace(/[^0-9A-Za-z-]/g, '').slice(0, 30);
/** Huruf besar, hanya A-Z, 0-9, dan tanda hubung. */
export const normalisasiKodeLokal = (v: string) => v.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 30);
/** Angka dengan satu pemisah desimal; koma diubah menjadi titik. */
export const normalisasiKekuatan = (v: string) => {
  const bersih = v.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const [bulat, ...desimal] = bersih.split('.');
  return (desimal.length ? `${bulat}.${desimal.join('')}` : bulat).slice(0, 12);
};

// ---------------------------------------------------------------- Rute "KODE=Label, KODE=Label"
export function parseRute(text: string): { rute: RuteItem[]; error?: string } {
  const bagian = text.split(',').map((p) => p.trim()).filter(Boolean);
  if (bagian.length === 0) return { rute: [], error: 'Rute pemberian wajib diisi' };
  if (bagian.length > 10) return { rute: [], error: 'Maksimal 10 rute' };

  const rute: RuteItem[] = [];
  const dipakai = new Set<string>();
  for (const b of bagian) {
    const m = /^([A-Za-z0-9]{1,10})\s*=\s*(.+)$/.exec(b);
    if (!m) return { rute: [], error: `"${b}" tidak sesuai format kode=label (contoh: PO=Oral)` };
    const kode = m[1].toUpperCase();
    const label = m[2].trim();
    if (label.length > 50) return { rute: [], error: `Label "${kode}" maksimal 50 karakter` };
    if (dipakai.has(kode)) return { rute: [], error: `Kode rute "${kode}" dobel` };
    dipakai.add(kode);
    rute.push({ kode, label });
  }
  return { rute };
}

export const formatRute = (rute: RuteItem[]) => rute.map((r) => `${r.kode}=${r.label}`).join(', ');

// ---------------------------------------------------------------- Validasi & payload
const panjang = (v: string, min: number, max: number, nama: string): string | undefined => {
  const n = v.trim().length;
  if (n < min) return min <= 1 ? `${nama} wajib diisi` : `${nama} minimal ${min} karakter`;
  if (n > max) return `${nama} maksimal ${max} karakter`;
  return undefined;
};

export function validateProduk(f: ProdukObatForm): ProdukObatErrors {
  const e: ProdukObatErrors = {};
  if (!/^[0-9A-Za-z-]{3,30}$/.test(f.kfaCode)) e.kfaCode = 'KFA code 3-30 karakter (huruf, angka, tanda hubung)';
  if (!/^[A-Z0-9][A-Z0-9-]{1,29}$/.test(f.kodeLokal)) e.kodeLokal = 'Kode lokal 2-30 karakter (huruf besar, angka, tanda hubung)';

  const nama = panjang(f.nama, 2, 150, 'Nama produk');
  if (nama) e.nama = nama;
  if (f.namaGenerik.trim().length > 150) e.namaGenerik = 'Nama generik maksimal 150 karakter';
  const zat = panjang(f.zatAktif, 1, 200, 'Zat aktif');
  if (zat) e.zatAktif = zat;

  // Kekuatan dan satuan diisi berpasangan.
  const kekuatan = f.kekuatan.trim();
  const satuan = f.satuan.trim();
  if (kekuatan && !/^\d+(\.\d+)?$/.test(kekuatan)) e.kekuatan = 'Kekuatan harus berupa angka';
  else if (kekuatan && !satuan) e.satuan = 'Isi satuan';
  else if (!kekuatan && satuan) e.kekuatan = 'Isi kekuatan';
  if (satuan.length > 20) e.satuan = 'Satuan maksimal 20 karakter';

  const bentuk = panjang(f.bentukSediaan, 1, 50, 'Bentuk sediaan');
  if (bentuk) e.bentukSediaan = bentuk;

  const rute = parseRute(f.ruteText);
  if (rute.error) e.ruteText = rute.error;

  if (!f.statusFormularium) e.statusFormularium = 'Status formularium wajib dipilih';
  if (f.produsen.trim().length > 100) e.produsen = 'Produsen maksimal 100 karakter';
  return e;
}

/** Hanya dipanggil setelah validateProduk lolos (rute pasti valid). */
export function toPayload(f: ProdukObatForm) {
  return {
    kfaCode: f.kfaCode.trim(),
    kodeLokal: f.kodeLokal,
    nama: f.nama.trim(),
    namaGenerik: f.namaGenerik.trim() || null,
    zatAktif: f.zatAktif.trim(),
    kekuatan: f.kekuatan.trim() || null,
    satuan: f.satuan.trim() || null,
    bentukSediaan: f.bentukSediaan.trim(),
    rute: parseRute(f.ruteText).rute,
    produsen: f.produsen.trim() || null,
    statusFormularium: f.statusFormularium,
    status: f.status,
  };
}

export const itemToForm = (x: ProdukObatItem): ProdukObatForm => ({
  kfaCode: x.kfaCode, kodeLokal: x.kodeLokal, nama: x.nama, namaGenerik: x.namaGenerik ?? '', zatAktif: x.zatAktif,
  kekuatan: x.kekuatan ?? '', satuan: x.satuan ?? '', bentukSediaan: x.bentukSediaan, status: x.status,
  ruteText: formatRute(x.rute), statusFormularium: x.statusFormularium, produsen: x.produsen ?? '',
});

/** Error dari server memakai kunci payload; `rute*` dipetakan ke kolom form `ruteText`. */
export function mapServerErrors(fieldErrors?: Record<string, string>): ProdukObatErrors {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fieldErrors ?? {})) {
    const key = k.startsWith('rute') ? 'ruteText' : k;
    if (!(key in out)) out[key] = v;
  }
  return out as ProdukObatErrors;
}

// ---------------------------------------------------------------- Tampilan
/** "500 mg", "100 mcg/puff"; kosong bila kekuatan tidak diisi. */
export const ringkasKekuatan = (x: Pick<ProdukObatItem, 'kekuatan' | 'satuan'>) =>
  x.kekuatan ? `${x.kekuatan}${x.satuan ? ` ${x.satuan}` : ''}` : '—';

export const labelRute = (x: Pick<ProdukObatItem, 'rute'>) => (x.rute.length ? x.rute.map((r) => r.label).join(', ') : '—');

/** Produk bermerek bila ada nama dagang, selain itu generik. */
export const jenisProduk = (x: Pick<ProdukObatItem, 'namaDagang'>) => (x.namaDagang ? 'Bermerek' : 'Generik');

export function formatTanggalWaktu(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ---------------------------------------------------------------- Filter & urutan di klien
export function filterItems(items: ProdukObatItem[], f: ClientFilters): ProdukObatItem[] {
  return items.filter((x) =>
    (!f.formularium || x.statusFormularium === f.formularium)
    && (!f.sediaan || x.bentukSediaan === f.sediaan)
    && (!f.rute || x.rute.some((r) => r.label === f.rute))
    && (!f.produsen || (x.produsen ?? '') === f.produsen));
}

const collator = new Intl.Collator('id', { sensitivity: 'base', numeric: true });

export function sortItems(items: ProdukObatItem[], key: SortKey, dir: SortDir): ProdukObatItem[] {
  const faktor = dir === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    const c = collator.compare(a[key], b[key]);
    return c !== 0 ? c * faktor : collator.compare(a.nama, b.nama) || a.id - b.id;
  });
}

const unik = (nilai: (string | null | undefined)[], wajibAda: string) =>
  [...new Set([...nilai, wajibAda].filter((v): v is string => !!v))].sort(collator.compare);

/** Pilihan dropdown dari baris yang dimuat; nilai filter yang sedang aktif selalu ikut agar select tidak kosong. */
export function buildFilterOptions(items: ProdukObatItem[], f: ClientFilters) {
  return {
    sediaan: unik(items.map((x) => x.bentukSediaan), f.sediaan),
    rute: unik(items.flatMap((x) => x.rute.map((r) => r.label)), f.rute),
    produsen: unik(items.map((x) => x.produsen), f.produsen),
  };
}

export const adaFilterAktif = (f: ClientFilters) => Object.values(f).some(Boolean);
