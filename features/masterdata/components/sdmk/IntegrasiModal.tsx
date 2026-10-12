'use client';
// Lokasi: src/features/masterdata/components/sdmk/IntegrasiModal.tsx
// Tab 6 wizard SDMK: status integrasi SATUSEHAT, mapping terminologi, log API.
import React from 'react';
import { Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { fetchSdmkDetail, setIntegrasiField, verifyIhs } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import type { IntegrasiForm } from '@/types/domain/sdmk';
import { FormInput, FormSelect, Label, Section, StatusBadge } from '@/features/masterdata/components/sdmk/SdmkFields';

export default function IntegrasiModal() {
  const dispatch = useAppDispatch();
  const { integrasi: f, detail, options, saving, wizard } = useAppSelector((s) => s.sdmk);
  const server = detail?.integrasi;
  const status = server?.statusIhs ?? 'belum';
  const set = (field: keyof IntegrasiForm) => (value: string) => dispatch(setIntegrasiField({ field, value }));

  const verifikasi = async () => {
    try {
      const d = await dispatch(verifyIhs()).unwrap();
      dispatch(showNotification({
        title: d.integrasi.statusIhs === 'terhubung' ? 'IHS Terverifikasi' : 'IHS Belum Terhubung',
        message: d.integrasi.ihsNumber ? `Practitioner IHS: ${d.integrasi.ihsNumber}` : 'Data praktisi belum ditemukan di SATUSEHAT.',
        type: d.integrasi.statusIhs === 'terhubung' ? 'success' : 'warning',
      }));
    } catch (e) {
      dispatch(showNotification({ title: 'Verifikasi IHS Gagal', message: (e as { message: string }).message, type: 'error' }));
    }
  };

  const muatUlang = () => { if (wizard.sdmkId) dispatch(fetchSdmkDetail(wizard.sdmkId)); };
  const ro = 'w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none';

  return (
    <div className="space-y-8">
      <Section title="Integrasi SATUSEHAT SDMK" right={<StatusBadge status={status} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <Label text="Practitioner IHS Number" />
            <input readOnly value={server?.ihsNumber ?? ''} placeholder="Diisi setelah verifikasi berhasil" className={ro} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label text="Organization ID" />
            <input readOnly value={server?.organizationId ?? ''} placeholder="Mengikuti konfigurasi fasyankes" className={ro} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label text="Sinkronisasi Data Terakhir" />
            <div className="flex gap-2">
              <input readOnly value={server?.terakhirSinkron ?? 'Belum pernah'} className={ro} />
              <button type="button" aria-label="Muat ulang status" onClick={muatUlang} className="px-3 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"><RefreshCw size={16} /></button>
            </div>
          </div>
          <div className="flex items-end">
            <button type="button" onClick={verifikasi} disabled={!detail || saving === 'verifyIhs'}
              className="flex items-center gap-2 px-5 py-2.5 border border-cyan-600 rounded-xl text-sm font-semibold text-cyan-600 hover:bg-cyan-50 disabled:opacity-40 disabled:cursor-not-allowed">
              {saving === 'verifyIhs' ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />} Verifikasi IHS ke SATUSEHAT
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-400">Verifikasi memakai NIK SDMK yang tersimpan. Nomor IHS dan Organization ID tidak dapat diubah manual.</p>
      </Section>

      <Section title="Mapping Terminologi & Layanan">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormSelect label="Mapping Spesialisasi Kemenkes" placeholder="Pilih mapping spesialisasi" value={f.mappingSpesialisasi} options={options?.mappingSpesialisasi ?? []} loading={!options} onChange={set('mappingSpesialisasi')} />
          <FormSelect label="Mapping Tipe Praktisi SATUSEHAT" placeholder="Pilih tipe praktisi" value={f.mappingTipePraktisi} options={options?.tipePraktisi ?? []} loading={!options} onChange={set('mappingTipePraktisi')} />
        </div>
      </Section>

      <Section title="Log Riwayat Pengiriman API">
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr><th className="px-4 py-3">Waktu</th><th className="px-4 py-3">Aksi</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Pesan</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(server?.logs ?? []).length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Belum ada riwayat pengiriman.</td></tr>}
              {(server?.logs ?? []).map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 text-slate-600">{l.waktu}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{l.aksi}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-3 text-slate-600">{l.pesan ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
