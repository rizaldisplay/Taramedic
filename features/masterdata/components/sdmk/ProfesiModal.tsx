'use client';
// Lokasi: src/features/masterdata/components/sdmk/ProfesiModal.tsx
// Tab 2 wizard SDMK: profesi, kompetensi utama, pendidikan & kompetensi tambahan.
import React, { useState } from 'react';
import { FileText, Loader2, Paperclip, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { addKompetensi, deleteKompetensi, setKompetensiField, setProfesiField } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import { FILE_MIME_DOKUMEN, OPSI_STATUS_SDMK, validasiFile } from '@/features/masterdata/master-sdmk/utils/sdmkHelpers';
import type { KompetensiForm, ProfesiForm, StatusSdmk } from '@/types/domain/sdmk';
import { DateField, FileDrop, FormInput, FormSelect, Label, NumberField, RadioGroup, Section } from '@/features/masterdata/components/sdmk/SdmkFields';

export default function ProfesiModal() {
  const dispatch = useAppDispatch();
  const { profesi: f, profesiErrors: err, options, detail, kodeProfesi, kompetensiForm: kf, kompetensiErrors: kerr, saving } =
    useAppSelector((s) => s.sdmk);
  const [formOpen, setFormOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>();

  const set = (field: keyof ProfesiForm) => (value: string) => dispatch(setProfesiField({ field, value }));
  const setK = (field: keyof KompetensiForm) => (value: string) => dispatch(setKompetensiField({ field, value }));

  const profesiOpts = (options?.profesi ?? []).filter((p) => !f.jenisSdmk || p.jenisSdmk === f.jenisSdmk);
  const subOpts = (options?.subSpesialisasi ?? []).filter((x) => !f.spesialisasi || x.spesialisasi === f.spesialisasi);
  const kode = options?.profesi.find((p) => p.value === f.profesi)?.kode ?? kodeProfesi;
  const kompetensi = detail?.kompetensi ?? [];

  const onPickFile = (picked: File) => {
    const bad = validasiFile(picked, FILE_MIME_DOKUMEN);
    setFileError(bad ?? undefined);
    setFile(bad ? null : picked);
  };

  const tambah = async () => {
    try {
      await dispatch(addKompetensi(file)).unwrap();
      setFile(null); setFileError(undefined); setFormOpen(false);
      dispatch(showNotification({ title: 'Kompetensi Ditambahkan', message: 'Kompetensi tambahan tersimpan.', type: 'success' }));
    } catch (e) {
      dispatch(showNotification({ title: 'Gagal Menambah Kompetensi', message: (e as { message: string }).message, type: 'error' }));
    }
  };

  const hapus = async (id: number) => {
    if (!window.confirm('Hapus kompetensi ini?')) return;
    try { await dispatch(deleteKompetensi(id)).unwrap(); }
    catch (e) { dispatch(showNotification({ title: 'Gagal Menghapus', message: (e as { message: string }).message, type: 'error' })); }
  };

  return (
    <div className="space-y-8">
      <Section title="Profesi & Kompetensi">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormSelect label="Jenis SDMK" required placeholder="Pilih jenis SDMK" value={f.jenisSdmk} options={options?.jenisSdmk ?? []} loading={!options} error={err.jenisSdmk} onChange={set('jenisSdmk')} />
            <FormSelect label="Profesi" required placeholder="Pilih profesi" value={f.profesi} options={profesiOpts} disabled={!f.jenisSdmk} error={err.profesi} onChange={set('profesi')} />
            <FormSelect label="Kompetensi Utama" required placeholder="Pilih kompetensi utama" value={f.kompetensiUtama} options={options?.kompetensiUtama ?? []} loading={!options} error={err.kompetensiUtama} onChange={set('kompetensiUtama')} />
            <FormSelect label="Spesialisasi" placeholder="Pilih spesialisasi (jika ada)" value={f.spesialisasi} options={options?.spesialisasi ?? []} loading={!options} error={err.spesialisasi} onChange={set('spesialisasi')} />
            <FormSelect label="Sub Spesialisasi" placeholder="Pilih sub spesialisasi (jika ada)" value={f.subSpesialisasi} options={subOpts} disabled={!f.spesialisasi} error={err.subSpesialisasi} onChange={set('subSpesialisasi')} />
          </div>
          <div className="space-y-6">
            <div className="flex flex-col gap-1.5 w-full">
              <Label text="Kode Profesi (Internal)" />
              <input type="text" disabled value={kode} placeholder="Terisi otomatis setelah memilih profesi"
                className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-500 outline-none" />
            </div>
            <FormSelect label="Tingkat Pendidikan Terakhir" required placeholder="Pilih tingkat pendidikan" value={f.tingkatPendidikan} options={options?.tingkatPendidikan ?? []} loading={!options} error={err.tingkatPendidikan} onChange={set('tingkatPendidikan')} />
            <FormInput label="Institusi Pendidikan" placeholder="Contoh: Universitas Indonesia" value={f.institusi} error={err.institusi} onChange={set('institusi')} />
            <FormInput label="Tahun Lulus" placeholder="Contoh: 2012" inputMode="numeric" maxLength={4} value={f.tahunLulus} error={err.tahunLulus} onChange={(v) => set('tahunLulus')(v.replace(/\D/g, ''))} />
            <RadioGroup label="Status SDMK" required name="status_sdmk" value={f.status} options={OPSI_STATUS_SDMK} onChange={(v: StatusSdmk) => set('status')(v)} />
          </div>
        </div>
      </Section>

      <Section title="Kompetensi Tambahan (Sertifikat / Pelatihan / Kompetensi Lain)">
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-16 text-center">No.</th>
                <th className="px-4 py-3.5">Nama Kompetensi / Sertifikat</th>
                <th className="px-4 py-3.5">Penyelenggara</th>
                <th className="px-4 py-3.5">Tanggal Peroleh</th>
                <th className="px-4 py-3.5">Berlaku Hingga</th>
                <th className="px-4 py-3.5 text-center">Dokumen</th>
                <th className="px-4 py-3.5 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kompetensi.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-400">
                  {detail ? 'Belum ada kompetensi tambahan.' : 'Simpan identitas terlebih dahulu untuk menambah kompetensi.'}
                </td></tr>
              )}
              {kompetensi.map((k, i) => (
                <tr key={k.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 text-center text-slate-500 text-xs font-medium">{i + 1}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800 text-xs">{k.nama}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-xs">{k.penyelenggara}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-xs">{k.tanggalPeroleh}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-xs">{k.berlakuHingga || '-'}</td>
                  <td className="px-4 py-3.5 text-center">
                    {k.dokumenUrl ? (
                      <a href={k.dokumenUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-cyan-600 hover:bg-cyan-50">
                        <FileText size={14} /> Lihat
                      </a>
                    ) : <span className="text-xs text-slate-400">-</span>}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button type="button" aria-label={`Hapus ${k.nama}`} onClick={() => hapus(k.id)} disabled={saving === 'kompetensi'}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {formOpen ? (
          <div className="border border-cyan-100 bg-cyan-50/30 rounded-xl p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <FormInput label="Nama Kompetensi / Sertifikat" required value={kf.nama} error={kerr.nama} onChange={setK('nama')} />
              <FormInput label="Penyelenggara" required value={kf.penyelenggara} error={kerr.penyelenggara} onChange={setK('penyelenggara')} />
              <DateField label="Tanggal Peroleh" required value={kf.tanggalPeroleh} error={kerr.tanggalPeroleh} onChange={setK('tanggalPeroleh')} />
              <DateField label="Berlaku Hingga" value={kf.berlakuHingga} error={kerr.berlakuHingga} onChange={setK('berlakuHingga')} />
            </div>
            <FileDrop accept="application/pdf,image/jpeg,image/png" title="Unggah dokumen (opsional)" hint="PDF, JPG, PNG maks. 2MB"
              icon={<Paperclip size={18} />} fileName={file?.name} error={fileError} onFile={onPickFile} />
            <div className="flex gap-3">
              <button type="button" onClick={() => { setFormOpen(false); setFile(null); setFileError(undefined); }}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
              <button type="button" onClick={tambah} disabled={saving === 'kompetensi'}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-xs font-semibold text-white disabled:opacity-60 flex items-center gap-2">
                {saving === 'kompetensi' && <Loader2 size={14} className="animate-spin" />} Simpan Kompetensi
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button type="button" disabled={!detail} onClick={() => setFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-cyan-600 rounded-xl text-xs font-semibold text-cyan-600 hover:bg-cyan-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <Plus size={16} /> Tambah Kompetensi
            </button>
          </div>
        )}
      </Section>
    </div>
  );
}
