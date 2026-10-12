'use client';
// Lokasi: src/features/masterdata/components/sdmk/RegistrasiModal.tsx
// Tab 3 wizard SDMK: STR, daftar SIP, sertifikat lain, dan ringkasan registrasi.
import React from 'react';
import { Check, Edit2, Loader2, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { deleteSip, openSip, setSertifikatLain, setStrField, verifyStr } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import type { StrForm } from '@/types/domain/sdmk';
import { DateField, FormInput, FormSelect, Label, Section, StatusBadge } from '@/features/masterdata/components/sdmk/SdmkFields';
import AddSipModal from './SIPModal';

export default function RegistrasiModal() {
  const dispatch = useAppDispatch();
  const { str: f, strErrors: err, options, detail, sertifikatLain, saving } = useAppSelector((s) => s.sdmk);
  const set = (field: keyof StrForm) => (value: string) => dispatch(setStrField({ field, value }));
  const sip = detail?.sip ?? [];
  const strServer = detail?.str ?? null;
  const tersimpan = !!strServer;

  const verifikasi = async () => {
    try {
      const d = await dispatch(verifyStr()).unwrap();
      dispatch(showNotification({
        title: d.str?.status === 'Valid' ? 'STR Valid' : 'STR Perlu Perhatian',
        message: `Status STR: ${d.str?.status ?? '-'}`, type: d.str?.status === 'Valid' ? 'success' : 'warning',
      }));
    } catch (e) {
      dispatch(showNotification({ title: 'Verifikasi Gagal', message: (e as { message: string }).message, type: 'error' }));
    }
  };

  const hapus = async (id: number, nomor: string) => {
    if (!window.confirm(`Hapus SIP ${nomor}?`)) return;
    try { await dispatch(deleteSip(id)).unwrap(); }
    catch (e) { dispatch(showNotification({ title: 'Gagal Menghapus SIP', message: (e as { message: string }).message, type: 'error' })); }
  };

  const aktif = sip.filter((x) => x.status === 'Aktif').length;
  const akanBerakhir = sip.filter((x) => x.status === 'Akan Berakhir').length;

  return (
    <div className="space-y-8">
      <Section
        title="STR (Surat Tanda Registrasi)"
        right={
          <button type="button" onClick={verifikasi} disabled={!tersimpan || saving === 'verifyStr'}
            title={tersimpan ? undefined : 'Simpan STR terlebih dahulu'}
            className="flex items-center gap-2 px-4 py-2 border border-cyan-600 rounded-xl text-xs font-semibold text-cyan-600 hover:bg-cyan-50 disabled:opacity-40 disabled:cursor-not-allowed">
            {saving === 'verifyStr' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Verifikasi STR
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <FormInput label="Nomor STR" required value={f.nomorStr} error={err.nomorStr} onChange={set('nomorStr')} />
          <DateField label="Tanggal Terbit" required value={f.tanggalTerbit} error={err.tanggalTerbit} onChange={set('tanggalTerbit')} />
          <DateField label="Berlaku Hingga" required value={f.berlakuHingga} error={err.berlakuHingga} onChange={set('berlakuHingga')} />
          <FormSelect label="Organisasi Penerbit" required placeholder="Pilih organisasi" value={f.organisasiPenerbit} options={options?.organisasiPenerbitStr ?? []} loading={!options} error={err.organisasiPenerbit} onChange={set('organisasiPenerbit')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <Label text="Status STR" />
            <div className="mt-2"><StatusBadge status={strServer?.status ?? 'Belum Diverifikasi'} /></div>
          </div>
          <div>
            <Label text="Tanggal Verifikasi" />
            <p className="mt-2 text-sm text-slate-700">{strServer?.tanggalVerifikasi || '-'}</p>
          </div>
        </div>
      </Section>

      <Section
        title="SIP (Surat Izin Praktik)"
        right={
          <button type="button" disabled={!detail} onClick={() => dispatch(openSip(undefined))}
            className="flex items-center gap-2 px-4 py-2 border border-cyan-600 rounded-xl text-xs font-semibold text-cyan-600 hover:bg-cyan-50 disabled:opacity-40 disabled:cursor-not-allowed">
            <Plus size={16} /> Tambah SIP
          </button>
        }
      >
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No.</th>
                <th className="px-4 py-3.5">Nomor SIP</th>
                <th className="px-4 py-3.5">Tempat Praktik</th>
                <th className="px-4 py-3.5">Wilayah</th>
                <th className="px-4 py-3.5">Tanggal Terbit</th>
                <th className="px-4 py-3.5">Berlaku Hingga</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sip.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-xs text-slate-400">
                  {detail ? 'Belum ada SIP.' : 'Simpan identitas terlebih dahulu untuk menambah SIP.'}
                </td></tr>
              )}
              {sip.map((x, i) => (
                <tr key={x.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 text-center text-slate-500 text-xs">{i + 1}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800 text-xs">{x.nomorSip}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-xs">{x.tempatPraktik}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-xs">{x.wilayah}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-xs">{x.tanggalTerbit}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-xs">{x.berlakuHingga}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={x.status} /></td>
                  <td className="px-4 py-3.5 text-center">
                    <button type="button" aria-label={`Ubah SIP ${x.nomorSip}`} onClick={() => dispatch(openSip(x.id))} className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg"><Edit2 size={16} /></button>
                    <button type="button" aria-label={`Hapus SIP ${x.nomorSip}`} onClick={() => hapus(x.id, x.nomorSip)} disabled={saving === 'sip'} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Sertifikat Lain (Opsional)">
        <FormInput label="Daftar sertifikat" placeholder="Contoh: Sertifikat Kompetensi, ACLS, ATLS, dll." value={sertifikatLain} onChange={(v) => dispatch(setSertifikatLain(v))} maxLength={500} />
      </Section>

      <Section title="Ringkasan Registrasi">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><dt className="text-xs text-slate-500">Status STR</dt><dd className="mt-1"><StatusBadge status={strServer?.status ?? 'Belum Diverifikasi'} /></dd></div>
          <div><dt className="text-xs text-slate-500">Total SIP</dt><dd className="mt-1 font-semibold text-slate-800">{sip.length}</dd></div>
          <div><dt className="text-xs text-slate-500">SIP Aktif</dt><dd className="mt-1 font-semibold text-slate-800">{aktif}</dd></div>
          <div><dt className="text-xs text-slate-500">SIP Akan Berakhir</dt><dd className="mt-1 font-semibold text-slate-800">{akanBerakhir}</dd></div>
        </dl>
      </Section>

      <AddSipModal />
    </div>
  );
}
