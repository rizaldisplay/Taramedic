'use client';
// Lokasi: src/features/masterdata/components/sdmk/SIPModal.tsx
// Modal tambah/ubah SIP. Dibuka lewat dispatch(openSip(id?)) dari tab Registrasi & Perizinan.
import React, { useState } from 'react';
import { Info, Loader2, Paperclip, Plus, Save, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { closeSip, openSip, saveSip, setSipField, setSipFileError } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import { FILE_MIME_DOKUMEN, OPSI_STATUS_IZIN, validasiFile } from '@/features/masterdata/master-sdmk/utils/sdmkHelpers';
import type { SipForm, StatusIzin } from '@/types/domain/sdmk';
import { DateField, FileDrop, FormInput, FormSelect } from './SdmkFields';
import { focusFirstError } from './SdmkFields';
import RegionFields from './RegionFields';

export default function AddSipModal() {
  const { open, editingId } = useAppSelector((s) => s.sdmk.sipModal);
  if (!open) return null;
  return <SipModalContent key={editingId ?? 'new'} />;
}

function SipModalContent() {
  const dispatch = useAppDispatch();
  const { sipModal, sipForm: f, sipErrors: err, options, saving, detail } = useAppSelector((s) => s.sdmk);
  const [file, setFile] = useState<File | null>(null);

  const set = (field: keyof SipForm) => (value: string) => dispatch(setSipField({ field, value }));
  const busy = saving === 'sip';
  const existing = sipModal.editingId ? detail?.sip.find((x) => x.id === sipModal.editingId) : undefined;

  const poliOpts = (options?.poli ?? []).filter((p) => !f.fasyankes || !p.fasyankes || p.fasyankes === f.fasyankes);
  const ruanganOpts = (options?.ruangan ?? []).filter((r) => !f.poli || !r.poli || r.poli === f.poli);

  const onPick = (picked: File) => {
    const bad = validasiFile(picked, FILE_MIME_DOKUMEN);
    dispatch(setSipFileError(bad ?? undefined));
    setFile(bad ? null : picked);
  };

  const submit = async (again: boolean) => {
    try {
      await dispatch(saveSip({ file })).unwrap();
      dispatch(showNotification({ title: 'SIP Tersimpan', message: `SIP ${f.nomorSip} berhasil disimpan.`, type: 'success' }));
      if (again) dispatch(openSip(undefined));
    } catch (e) {
      dispatch(showNotification({ title: 'SIP Belum Tersimpan', message: (e as { message: string }).message, type: 'error' }));
      focusFirstError();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4" role="dialog" aria-modal="true" aria-label="Tambah SIP">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        <div className="flex items-start justify-between px-8 py-6 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[#0b2756] tracking-wide">{sipModal.editingId ? 'Ubah SIP' : 'Tambah SIP (Surat Izin Praktik)'}</h2>
            <p className="text-xs text-slate-500 mt-1">Lengkapi informasi SIP sesuai dokumen resmi. Data akan digunakan untuk layanan dan integrasi.</p>
          </div>
          <button type="button" aria-label="Tutup" onClick={() => dispatch(closeSip())} className="text-slate-400 hover:text-slate-700 p-1"><X size={22} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Informasi SIP</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <FormInput label="Nomor SIP" required placeholder="Masukkan nomor SIP" helperText="Contoh: 503/123/SIP/2023" value={f.nomorSip} error={err.nomorSip} onChange={set('nomorSip')} />
              <FormSelect label="Jenis SIP" required placeholder="Pilih jenis SIP" value={f.jenisSip} options={options?.jenisSip ?? []} loading={!options} error={err.jenisSip} onChange={set('jenisSip')} />
              <DateField label="Tanggal Terbit" required value={f.tanggalTerbit} error={err.tanggalTerbit} onChange={set('tanggalTerbit')} />
              <DateField label="Berlaku Hingga" required value={f.berlakuHingga} error={err.berlakuHingga} onChange={set('berlakuHingga')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <FormSelect label="Status SIP" required value={f.status} options={OPSI_STATUS_IZIN} error={err.status} onChange={(v) => set('status')(v as StatusIzin)} />
              <FormInput label="Tempat Terbit" required placeholder="Masukkan tempat terbit SIP" value={f.tempatTerbit} error={err.tempatTerbit} onChange={set('tempatTerbit')} />
              <FormInput label="No. SK SIP (Jika Ada)" placeholder="Masukkan nomor SK SIP" value={f.nomorSk} error={err.nomorSk} onChange={set('nomorSk')} />
              <DateField label="Tanggal SK (Jika Ada)" value={f.tanggalSk} error={err.tanggalSk} onChange={set('tanggalSk')} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Tempat Praktik</h3>
            <div className="bg-cyan-50/60 border border-cyan-100 rounded-lg p-3.5 flex gap-3 items-start">
              <Info size={18} className="text-cyan-600 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-800 leading-relaxed font-medium">SIP berlaku untuk lokasi/tempat praktik tertentu.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormSelect label="Nama Fasilitas / Fasyankes" required placeholder="Pilih fasilitas / fasyankes" value={f.fasyankes} options={options?.fasyankes ?? []} loading={!options} error={err.fasyankes} onChange={set('fasyankes')} />
              <FormSelect label="Unit / Poli" required placeholder="Pilih unit / poli" value={f.poli} options={poliOpts} disabled={!f.fasyankes} error={err.poli} onChange={set('poli')} />
              <FormSelect label="Lokasi / Ruangan (Jika Ada)" placeholder="Pilih lokasi / ruangan" value={f.ruangan} options={ruanganOpts} disabled={!f.poli} error={err.ruangan} onChange={set('ruangan')} />
            </div>
            <FormInput label="Alamat Praktik" required placeholder="Masukkan alamat lengkap tempat praktik" value={f.alamatPraktik} error={err.alamatPraktik} onChange={set('alamatPraktik')} />
            <RegionFields target="sip" values={f} errors={err} onChange={(field, value) => dispatch(setSipField({ field, value }))} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormInput label="Kode Pos" placeholder="Contoh: 40123" maxLength={5} inputMode="numeric" value={f.kodePos} error={err.kodePos} onChange={(v) => set('kodePos')(v.replace(/\D/g, ''))} />
              <FormInput label="Telepon Fasilitas (Jika Ada)" placeholder="Contoh: 021-1234567" inputMode="tel" value={f.telepon} error={err.telepon} onChange={(v) => set('telepon')(v.replace(/[^\d+\-\s]/g, ''))} />
              <FormInput label="Email Fasilitas (Jika Ada)" placeholder="Contoh: info@klinik.com" type="email" value={f.emailFasilitas} error={err.emailFasilitas} onChange={set('emailFasilitas')} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Lampiran Dokumen</h3>
            <label className="block text-xs font-semibold text-[#0b2756]">Upload File SIP <span className="text-red-500">*</span></label>
            <FileDrop
              accept="application/pdf,image/jpeg,image/png" title="Klik atau drag & drop file di sini" hint="PDF, JPG, PNG maks. 2MB"
              icon={<Paperclip size={20} />} error={err.file}
              fileName={file?.name ?? (existing?.dokumenUrl ? 'Dokumen sudah terunggah (klik untuk mengganti)' : null)} onFile={onPick}
            />
          </div>
        </div>

        <div className="px-8 py-5 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <button type="button" onClick={() => dispatch(closeSip())} className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
          <div className="flex gap-3">
            {!sipModal.editingId && (
              <button type="button" disabled={busy} onClick={() => submit(true)}
                className="flex items-center gap-2 px-6 py-2.5 border border-cyan-600 rounded-xl text-sm font-semibold text-cyan-600 hover:bg-cyan-50 disabled:opacity-60">
                <Plus size={16} /> Simpan &amp; Tambah Lagi
              </button>
            )}
            <button type="button" disabled={busy} onClick={() => submit(false)}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-semibold text-white disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Simpan SIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
