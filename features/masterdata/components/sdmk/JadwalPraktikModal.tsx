'use client';
// Lokasi: src/features/masterdata/components/sdmk/JadwalPraktikModal.tsx
// Tab 5 wizard SDMK: pengaturan jadwal, jadwal mingguan, slot tambahan, preview slot.
import React, { useMemo, useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import {
  deleteSlot, openSlot, setJadwalHariField, setJadwalSettingField, setSlotField, toggleHariAktif, toggleJenisPasienSetting,
} from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import { OPSI_STATUS_JADWAL, buatPreviewSlot, HARI } from '@/features/masterdata/master-sdmk/utils/sdmkHelpers';
import type { Hari, JadwalSettingForm } from '@/types/domain/sdmk';
import { CheckboxGroup, FormSelect, Label, NumberField, Section, StatusBadge, inputCls } from '@/features/masterdata/components/sdmk/SdmkFields';
import AddSlotWaktuModal from './SlotWaktuModal';

export default function JadwalPraktikModal() {
  const dispatch = useAppDispatch();
  const { jadwalSetting: st, jadwalSettingErrors: serr, jadwalHari: rows, jadwalHariErrors: herr, options, detail, saving } = useAppSelector((s) => s.sdmk);
  const [previewHari, setPreviewHari] = useState<Hari>('Senin');
  const set = (field: keyof JadwalSettingForm) => (value: string) => dispatch(setJadwalSettingField({ field, value }));
  const durasi = options?.durasiLayanan ?? [];

  const previewRow = rows.find((r) => r.hari === previewHari);
  const preview = useMemo(() => (previewRow?.aktif ? buatPreviewSlot(previewRow) : []), [previewRow]);
  const slots = detail?.slots ?? [];

  const tambahSlot = (hari?: Hari) => {
    dispatch(openSlot(undefined));
    if (hari) dispatch(setSlotField({ field: 'hari', value: hari }));
  };

  const hapusSlot = async (id: number) => {
    if (!window.confirm('Hapus slot ini?')) return;
    try { await dispatch(deleteSlot(id)).unwrap(); }
    catch (e) { dispatch(showNotification({ title: 'Gagal Menghapus Slot', message: (e as { message: string }).message, type: 'error' })); }
  };

  const cell = 'w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:bg-slate-50 disabled:text-slate-400';

  return (
    <div className="space-y-8">
      <Section title="Pengaturan Jadwal">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <FormSelect label="Tipe Jadwal" required placeholder="Pilih tipe jadwal" value={st.tipeJadwal} options={options?.tipeJadwal ?? []} loading={!options} error={serr.tipeJadwal} onChange={set('tipeJadwal')} />
          <NumberField label="Kapasitas Per Hari" required unit="pasien" value={st.kapasitasPerHari} error={serr.kapasitasPerHari} onChange={set('kapasitasPerHari')} />
          <FormSelect label="Durasi Layanan (per pasien)" required placeholder="Pilih durasi" value={st.durasiLayanan} options={durasi} loading={!options} error={serr.durasiLayanan} onChange={set('durasiLayanan')} />
          <FormSelect label="Status Jadwal" required value={st.status} options={OPSI_STATUS_JADWAL} onChange={set('status')} />
        </div>
        <CheckboxGroup label="Jenis Pasien Dilayani" required options={options?.jenisPasien ?? []} values={st.jenisPasien} error={serr.jenisPasien} onToggle={(v) => dispatch(toggleJenisPasienSetting(v))} />
      </Section>

      <Section title="Jadwal Mingguan">
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 w-10 text-center"><span className="sr-only">Aktif</span></th><th className="px-3 py-3">Hari</th><th className="px-3 py-3">Jam Mulai</th><th className="px-3 py-3">Jam Selesai</th>
                <th className="px-3 py-3">Durasi Slot</th><th className="px-3 py-3">Kuota</th><th className="px-3 py-3">Kuota Online</th><th className="px-3 py-3">Istirahat</th>
                <th className="px-3 py-3">Jenis Pasien</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, idx) => (
                <React.Fragment key={r.hari}>
                  <tr className={r.aktif ? '' : 'bg-slate-50/60'}>
                    <td className="px-3 py-2 text-center">
                      <input type="checkbox" aria-label={`Aktifkan ${r.hari}`} checked={r.aktif} onChange={() => dispatch(toggleHariAktif(idx))} className="w-4 h-4 rounded text-cyan-600 border-slate-300" />
                    </td>
                    <td className="px-3 py-2 text-xs font-semibold text-slate-800">{r.hari}</td>
                    <td className="px-3 py-2"><input type="time" aria-label={`Jam mulai ${r.hari}`} disabled={!r.aktif} value={r.jamMulai} onChange={(e) => dispatch(setJadwalHariField({ index: idx, field: 'jamMulai', value: e.target.value }))} className={cell} /></td>
                    <td className="px-3 py-2"><input type="time" aria-label={`Jam selesai ${r.hari}`} disabled={!r.aktif} value={r.jamSelesai} onChange={(e) => dispatch(setJadwalHariField({ index: idx, field: 'jamSelesai', value: e.target.value }))} className={cell} /></td>
                    <td className="px-3 py-2">
                      <select aria-label={`Durasi slot ${r.hari}`} disabled={!r.aktif} value={r.durasiSlot} onChange={(e) => dispatch(setJadwalHariField({ index: idx, field: 'durasiSlot', value: e.target.value }))} className={cell}>
                        <option value="">Pilih</option>{durasi.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2"><input type="text" inputMode="numeric" aria-label={`Kuota ${r.hari}`} disabled={!r.aktif} value={r.kuota} onChange={(e) => dispatch(setJadwalHariField({ index: idx, field: 'kuota', value: e.target.value.replace(/\D/g, '') }))} className={`${cell} w-16`} /></td>
                    <td className="px-3 py-2"><input type="text" inputMode="numeric" aria-label={`Kuota online ${r.hari}`} disabled={!r.aktif} value={r.kuotaOnline} onChange={(e) => dispatch(setJadwalHariField({ index: idx, field: 'kuotaOnline', value: e.target.value.replace(/\D/g, '') }))} className={`${cell} w-16`} /></td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <input type="time" aria-label={`Istirahat mulai ${r.hari}`} disabled={!r.aktif} value={r.istirahatMulai} onChange={(e) => dispatch(setJadwalHariField({ index: idx, field: 'istirahatMulai', value: e.target.value }))} className={cell} />
                        <span className="text-slate-400">-</span>
                        <input type="time" aria-label={`Istirahat selesai ${r.hari}`} disabled={!r.aktif} value={r.istirahatSelesai} onChange={(e) => dispatch(setJadwalHariField({ index: idx, field: 'istirahatSelesai', value: e.target.value }))} className={cell} />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">{r.jenisPasien.length ? r.jenisPasien.join(', ') : '-'}</td>
                    <td className="px-3 py-2"><StatusBadge status={r.aktif ? r.status : 'Tidak Aktif'} /></td>
                    <td className="px-3 py-2 text-center">
                      <button type="button" disabled={!detail} onClick={() => tambahSlot(r.hari)} aria-label={`Tambah slot ${r.hari}`} className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg disabled:opacity-40"><Plus size={16} /></button>
                    </td>
                  </tr>
                  {herr[r.hari] && (
                    <tr><td colSpan={11} role="alert" data-sdmk-error="true" tabIndex={-1} className="px-3 pb-2 text-[11px] text-red-500">{r.hari}: {herr[r.hari]}</td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400">Pilih hari yang praktik lalu isi jam dan kuota. Jadwal disimpan lewat tombol Simpan di bawah.</p>
      </Section>

      <Section title="Slot Waktu Tambahan" right={
        <button type="button" disabled={!detail} onClick={() => tambahSlot()} className="flex items-center gap-2 px-4 py-2 border border-cyan-600 rounded-xl text-xs font-semibold text-cyan-600 hover:bg-cyan-50 disabled:opacity-40"><Plus size={16} /> Tambah Slot</button>
      }>
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr><th className="px-4 py-3">Hari</th><th className="px-4 py-3">Jam</th><th className="px-4 py-3">Kuota</th><th className="px-4 py-3">Pola</th><th className="px-4 py-3">Berlaku</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-center">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slots.length === 0 && <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-400">Belum ada slot tambahan.</td></tr>}
              {slots.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{s.hari}</td>
                  <td className="px-4 py-3 text-slate-600">{s.jamMulai} - {s.jamSelesai}</td>
                  <td className="px-4 py-3 text-slate-600">{s.kuota} ({s.kuotaOnline} online)</td>
                  <td className="px-4 py-3 text-slate-600">{options?.polaJadwal.find((p) => p.value === s.pola)?.label ?? s.pola}</td>
                  <td className="px-4 py-3 text-slate-600">{s.berlakuMulai}{s.berlakuHingga ? ` s/d ${s.berlakuHingga}` : ''}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3 text-center">
                    <button type="button" aria-label="Ubah slot" onClick={() => dispatch(openSlot(s.id))} className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg"><Edit2 size={16} /></button>
                    <button type="button" aria-label="Hapus slot" onClick={() => hapusSlot(s.id)} disabled={saving === 'slot'} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={`Preview Slot (${previewHari})`} right={
        <select aria-label="Hari preview" value={previewHari} onChange={(e) => setPreviewHari(e.target.value as Hari)} className={`${inputCls()} w-auto py-1 text-xs`}>
          {HARI.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>
      }>
        {preview.length === 0 ? (
          <p className="text-xs text-slate-400">{previewRow?.aktif ? 'Lengkapi jam mulai, jam selesai, dan durasi slot untuk melihat preview.' : `${previewHari} belum diaktifkan.`}</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {preview.map((p) => <span key={p} className="px-3 py-1.5 bg-cyan-50 border border-cyan-100 text-cyan-800 rounded-lg text-xs font-medium">{p}</span>)}
            </div>
            <p className="text-[11px] text-slate-400">{preview.length} slot. Preview hanya perkiraan; kuota dibatasi oleh kolom Kuota.</p>
          </>
        )}
      </Section>

      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-xs text-amber-800 space-y-1">
        <Label text="Ketentuan" />
        <ul className="list-disc pl-5 space-y-0.5">
          <li>Jam selesai harus setelah jam mulai, dan jam istirahat berada di dalam jam praktik.</li>
          <li>Kuota online tidak boleh melebihi kuota hari tersebut.</li>
          <li>Pastikan SDMK memiliki SIP aktif di unit yang dijadwalkan.</li>
        </ul>
      </div>

      <AddSlotWaktuModal />
    </div>
  );
}
