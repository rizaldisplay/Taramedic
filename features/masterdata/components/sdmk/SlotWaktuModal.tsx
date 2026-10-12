'use client';
// Lokasi: src/features/masterdata/components/sdmk/SlotWaktuModal.tsx
// Modal tambah/ubah slot waktu praktik. Dibuka lewat dispatch(openSlot(id?)).
import React from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { closeSlot, saveSlot, setSlotField, toggleJenisPasienSlot } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import { OPSI_HARI, OPSI_STATUS_JADWAL } from '@/features/masterdata/master-sdmk/utils/sdmkHelpers';
import type { Hari, SlotForm } from '@/types/domain/sdmk';
import { CheckboxGroup, DateField, FormSelect, NumberField, TimeField, focusFirstError } from './SdmkFields';

export default function AddSlotWaktuModal() {
  const dispatch = useAppDispatch();
  const { slotModal, slotForm: f, slotErrors: err, options, saving } = useAppSelector((s) => s.sdmk);
  if (!slotModal.open) return null;

  const set = (field: keyof SlotForm) => (value: string) => dispatch(setSlotField({ field, value }));
  const busy = saving === 'slot';

  const submit = async () => {
    try {
      await dispatch(saveSlot()).unwrap();
      dispatch(showNotification({ title: 'Slot Tersimpan', message: `Slot ${f.hari} ${f.jamMulai}-${f.jamSelesai} berhasil disimpan.`, type: 'success' }));
    } catch (e) {
      dispatch(showNotification({ title: 'Slot Belum Tersimpan', message: (e as { message: string }).message, type: 'error' }));
      focusFirstError();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4" role="dialog" aria-modal="true" aria-label="Tambah slot waktu">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        <div className="flex items-start justify-between px-8 py-6 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[#0b2756] tracking-wide">{slotModal.editingId ? 'Ubah Slot Waktu' : 'Tambah Slot Waktu'}</h2>
            <p className="text-xs text-slate-500 mt-1">Atur hari, jam praktik, kuota, dan pola berlaku slot.</p>
          </div>
          <button type="button" aria-label="Tutup" onClick={() => dispatch(closeSlot())} className="text-slate-400 hover:text-slate-700 p-1"><X size={22} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Informasi Hari &amp; Waktu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormSelect label="Hari" required value={f.hari} options={OPSI_HARI} error={err.hari} onChange={(v) => set('hari')(v as Hari)} />
              <TimeField label="Jam Mulai" required value={f.jamMulai} error={err.jamMulai} onChange={set('jamMulai')} />
              <TimeField label="Jam Selesai" required value={f.jamSelesai} error={err.jamSelesai} onChange={set('jamSelesai')} />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={f.adaIstirahat} onChange={(e) => dispatch(setSlotField({ field: 'adaIstirahat', value: e.target.checked }))}
                className="w-4 h-4 rounded text-cyan-600 border-slate-300 focus:ring-cyan-500" />
              Ada jam istirahat
            </label>
            {f.adaIstirahat && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TimeField label="Jam Istirahat Mulai" value={f.istirahatMulai} error={err.istirahatMulai} onChange={set('istirahatMulai')} />
                <TimeField label="Jam Istirahat Selesai" value={f.istirahatSelesai} error={err.istirahatSelesai} onChange={set('istirahatSelesai')} />
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Pengaturan Layanan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormSelect label="Durasi Layanan per Pasien" required placeholder="Pilih durasi" value={f.durasiLayanan} options={options?.durasiLayanan ?? []} loading={!options} error={err.durasiLayanan} onChange={set('durasiLayanan')} />
              <NumberField label="Kapasitas / Kuota" required unit="pasien" value={f.kuota} error={err.kuota} onChange={set('kuota')} />
              <NumberField label="Kuota Online" required unit="pasien" value={f.kuotaOnline} error={err.kuotaOnline} onChange={set('kuotaOnline')} />
            </div>
            <CheckboxGroup label="Jenis Pasien Dilayani" required options={options?.jenisPasien ?? []} values={f.jenisPasien} error={err.jenisPasien} onToggle={(v) => dispatch(toggleJenisPasienSlot(v))} />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Pola Berlaku</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <DateField label="Berlaku Mulai" required value={f.berlakuMulai} error={err.berlakuMulai} onChange={set('berlakuMulai')} />
              <DateField label="Berlaku Hingga (Opsional)" value={f.berlakuHingga} error={err.berlakuHingga} onChange={set('berlakuHingga')} />
              <FormSelect label="Pola" required placeholder="Pilih pola" value={f.pola} options={options?.polaJadwal ?? []} loading={!options} error={err.pola} onChange={set('pola')} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Status</h3>
            <div className="max-w-xs"><FormSelect label="Status Slot" required value={f.status} options={OPSI_STATUS_JADWAL} onChange={set('status')} /></div>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <button type="button" onClick={() => dispatch(closeSlot())} className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
          <button type="button" onClick={submit} disabled={busy}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-semibold text-white disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Simpan Slot
          </button>
        </div>
      </div>
    </div>
  );
}
