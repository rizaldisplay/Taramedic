'use client';
// Lokasi: src/features/masterdata/components/sdmk/PenempatanModal.tsx
// Tab 4 wizard SDMK: penempatan & peran di fasyankes/unit/ruangan.
import React, { useState } from 'react';
import { Check, Edit2, Filter, Info, Loader2, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import {
  deletePenempatan, editPenempatan, resetPenempatanForm, savePenempatan, setPenempatanField,
} from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import { OPSI_STATUS_AKTIF } from '@/features/masterdata/master-sdmk/utils/sdmkHelpers';
import type { PenempatanForm } from '@/types/domain/sdmk';
import { DateField, FormSelect, Label, Section, StatusBadge, focusFirstError } from '@/features/masterdata/components/sdmk/SdmkFields';

const PER_PAGE = 5;

export default function PenempatanModal() {
  const dispatch = useAppDispatch();
  const { penempatanForm: f, penempatanErrors: err, penempatanEditingId: editingId, options, detail, saving } = useAppSelector((s) => s.sdmk);
  const [filter, setFilter] = useState<'' | 'Aktif' | 'Nonaktif'>('');
  const [page, setPage] = useState(1);

  const set = (field: keyof PenempatanForm) => (value: string) => dispatch(setPenempatanField({ field, value }));
  const poliOpts = (options?.poli ?? []).filter((p) => !f.fasyankes || !p.fasyankes || p.fasyankes === f.fasyankes);
  const ruanganOpts = (options?.ruangan ?? []).filter((r) => !f.poli || !r.poli || r.poli === f.poli);

  const semua = detail?.penempatan ?? [];
  const tersaring = filter ? semua.filter((p) => p.status === filter) : semua;
  const lastPage = Math.max(1, Math.ceil(tersaring.length / PER_PAGE));
  const aktifPage = Math.min(page, lastPage);
  const tampil = tersaring.slice((aktifPage - 1) * PER_PAGE, aktifPage * PER_PAGE);
  const busy = saving === 'penempatan';

  const simpan = async () => {
    try {
      await dispatch(savePenempatan()).unwrap();
      dispatch(showNotification({ title: 'Penempatan Tersimpan', message: 'Data penempatan berhasil disimpan.', type: 'success' }));
    } catch (e) {
      dispatch(showNotification({ title: 'Penempatan Belum Tersimpan', message: (e as { message: string }).message, type: 'error' }));
      focusFirstError();
    }
  };

  const hapus = async (id: number) => {
    if (!window.confirm('Hapus penempatan ini?')) return;
    try { await dispatch(deletePenempatan(id)).unwrap(); }
    catch (e) { dispatch(showNotification({ title: 'Gagal Menghapus', message: (e as { message: string }).message, type: 'error' })); }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Penempatan &amp; Peran</h3>
        <p className="text-xs text-slate-500">Kelola penempatan SDMK di fasilitas, unit/poli, lokasi/ruangan, dan peran/jabatan.</p>
        <div className="bg-cyan-50/60 border border-cyan-100 rounded-lg p-3.5 flex gap-3 items-start">
          <Info size={18} className="text-cyan-600 shrink-0 mt-0.5" />
          <p className="text-xs text-cyan-800 leading-relaxed font-medium">
            Satu SDMK dapat memiliki lebih dari satu penempatan di fasilitas yang berbeda atau pada unit/ruangan yang berbeda.
          </p>
        </div>
      </div>

      <Section title={editingId ? 'Ubah Penempatan' : 'Tambah Penempatan'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <FormSelect label="Fasyankes" required placeholder="Pilih fasyankes" value={f.fasyankes} options={options?.fasyankes ?? []} loading={!options} error={err.fasyankes} onChange={set('fasyankes')} />
          <FormSelect label="Unit / Poli" required placeholder="Pilih unit / poli" value={f.poli} options={poliOpts} disabled={!f.fasyankes} error={err.poli} onChange={set('poli')} />
          <FormSelect label="Lokasi / Ruangan" required placeholder="Pilih lokasi / ruangan" value={f.ruangan} options={ruanganOpts} disabled={!f.poli} error={err.ruangan} onChange={set('ruangan')} />
          <FormSelect label="Peran di Unit" required placeholder="Pilih peran" value={f.peran} options={options?.peranUnit ?? []} loading={!options} error={err.peran} onChange={set('peran')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 items-start">
          <FormSelect label="Jabatan" placeholder="Pilih jabatan (jika ada)" value={f.jabatan} options={options?.jabatan ?? []} loading={!options} error={err.jabatan} onChange={set('jabatan')} />
          <FormSelect label="Status Penempatan" required value={f.status} options={OPSI_STATUS_AKTIF} error={err.status} onChange={set('status')} />
          <DateField label="Tanggal Mulai" required value={f.tanggalMulai} error={err.tanggalMulai} onChange={set('tanggalMulai')} />
          <DateField label="Tanggal Berakhir" value={f.tanggalBerakhir} error={err.tanggalBerakhir} onChange={set('tanggalBerakhir')} />
        </div>
        <div className="flex items-center gap-3">
          <button type="button" role="switch" aria-checked={f.penanggungJawabUnit} aria-label="Penanggung jawab unit"
            onClick={() => dispatch(setPenempatanField({ field: 'penanggungJawabUnit', value: !f.penanggungJawabUnit }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${f.penanggungJawabUnit ? 'bg-cyan-600' : 'bg-slate-300'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${f.penanggungJawabUnit ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-sm text-slate-700">Penanggung Jawab (PJ) Unit</span>
        </div>
        <div>
          <Label text="Catatan (opsional)" />
          <textarea rows={2} maxLength={255} placeholder="Masukkan catatan penempatan" value={f.catatan} onChange={(e) => set('catatan')(e.target.value)}
            data-sdmk-error={err.catatan ? 'true' : undefined}
            className="mt-1.5 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800 resize-none" />
          <div className="flex justify-between text-[11px] mt-1">
            <span className="text-red-500">{err.catatan}</span><span className="text-slate-400">{f.catatan.length}/255</span>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => dispatch(resetPenempatanForm())} className="px-5 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
          <button type="button" onClick={simpan} disabled={busy || !detail}
            className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-semibold text-white disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Simpan Penempatan
          </button>
        </div>
      </Section>

      <Section
        title="Daftar Penempatan"
        right={
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <Filter size={14} />
            <select value={filter} onChange={(e) => { setFilter(e.target.value as typeof filter); setPage(1); }} aria-label="Filter status penempatan"
              className="border border-slate-300 rounded-lg px-2 py-1 text-xs bg-white">
              <option value="">Semua status</option><option value="Aktif">Aktif</option><option value="Nonaktif">Nonaktif</option>
            </select>
          </label>
        }
      >
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No.</th><th className="px-4 py-3.5">Fasyankes</th><th className="px-4 py-3.5">Unit / Poli</th>
                <th className="px-4 py-3.5">Lokasi / Ruangan</th><th className="px-4 py-3.5">Peran di Unit</th><th className="px-4 py-3.5">Jabatan</th>
                <th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Tgl Mulai</th><th className="px-4 py-3.5">Tgl Berakhir</th>
                <th className="px-4 py-3.5 text-center">PJ Unit</th><th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tampil.length === 0 && (
                <tr><td colSpan={11} className="px-4 py-8 text-center text-xs text-slate-400">
                  {detail ? 'Belum ada penempatan.' : 'Simpan identitas terlebih dahulu untuk menambah penempatan.'}
                </td></tr>
              )}
              {tampil.map((p, i) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 text-center text-slate-500 text-xs">{(aktifPage - 1) * PER_PAGE + i + 1}</td>
                  <td className="px-4 py-3.5 text-xs font-semibold text-slate-800">{p.fasyankesNama}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{p.poliNama}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{p.ruanganNama}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{p.peran}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{p.jabatan || '-'}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{p.tanggalMulai}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{p.tanggalBerakhir || '-'}</td>
                  <td className="px-4 py-3.5 text-center">{p.penanggungJawabUnit ? <Check size={16} className="inline text-emerald-600" aria-label="Ya" /> : <span className="text-slate-300">-</span>}</td>
                  <td className="px-4 py-3.5 text-center">
                    <button type="button" aria-label="Ubah penempatan" onClick={() => dispatch(editPenempatan(p.id))} className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg"><Edit2 size={16} /></button>
                    <button type="button" aria-label="Hapus penempatan" onClick={() => hapus(p.id)} disabled={busy} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {tersaring.length === 0 ? 'Tidak ada data' : `Menampilkan ${(aktifPage - 1) * PER_PAGE + 1} - ${(aktifPage - 1) * PER_PAGE + tampil.length} dari ${tersaring.length} data`}
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={aktifPage <= 1} onClick={() => setPage(aktifPage - 1)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs disabled:opacity-40">Sebelumnya</button>
            <button type="button" disabled={aktifPage >= lastPage} onClick={() => setPage(aktifPage + 1)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs disabled:opacity-40">Berikutnya</button>
          </div>
        </div>
      </Section>
    </div>
  );
}
