'use client';
// Lokasi: src/features/masterdata/components/produk-obat/DetailProdukObat.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { closeDetail, startEdit, toggleProdukStatus } from '@/features/masterdata/master-farmasi/produk-obat/slices/produkObatSlice';
import { formatTanggalWaktu, labelRute, ringkasKekuatan } from '@/features/masterdata/master-farmasi/produk-obat/utils/produkObatHelpers';
import { btnOutline, btnPrimary, InfoNote, PanelHeader, PillFormularium, PillStatus } from './produkObatUi';

function Info({ label, value, wide }: { label: string; value: string | null | undefined; wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-2' : undefined}>
      <dt className="text-xs font-semibold text-[#0b2756]">{label}</dt>
      <dd className="mt-1 text-sm text-slate-600 wrap-break-word">{value || '—'}</dd>
    </div>
  );
}

export default function DetailProdukObat() {
  const dispatch = useAppDispatch();
  const { selected: x, togglingId } = useAppSelector((s) => s.produkObat);
  if (!x) return null;

  const ubahStatus = () => {
    dispatch(toggleProdukStatus(x)).unwrap()
      .then(() => dispatch(showNotification({
        title: 'Status Diperbarui', message: `${x.nama} ${x.status === 'Aktif' ? 'dinonaktifkan' : 'diaktifkan'}.`, type: 'success',
      })))
      .catch((e: { message: string }) => dispatch(showNotification({ title: 'Gagal', message: e.message, type: 'error' })));
  };

  const bentuk = x.kekuatan ? `${x.bentukSediaan} · ${ringkasKekuatan(x)}` : x.bentukSediaan;

  return (
    <section aria-labelledby="judul-detail-produk" className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <PanelHeader id="judul-detail-produk" title="Detail Produk Obat" backLabel="Tutup detail" onBack={() => dispatch(closeDetail())} />

      <div className="p-5 space-y-5">
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="min-w-0">
            <h4 className="font-bold text-cyan-800 leading-snug">{x.nama}</h4>
            <p className="text-xs text-slate-400 mt-1 wrap-break-word">KFA {x.kfaCode} · Lokal {x.kodeLokal}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <PillStatus value={x.status} />
            <PillFormularium value={x.statusFormularium} />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <Info label="Zat aktif" value={x.zatAktif} />
          <Info label="Nama generik" value={x.namaGenerik} />
          <Info label="Nama dagang" value={x.namaDagang} />
          <Info label="Bentuk sediaan" value={bentuk} />
          <Info label="Rute" value={labelRute(x)} />
          <Info label="Produsen" value={x.produsen} />
          <Info label="Nomor registrasi" value={x.nomorRegistrasi} />
          <Info label="Sumber snapshot" value={x.sumber} />
          <Info label="Sinkronisasi terakhir" value={formatTanggalWaktu(x.sinkronTerakhir)} wide />
        </dl>

        <InfoNote>KFA code adalah identitas sumber dan tetap terkunci saat mengedit snapshot lokal.</InfoNote>
      </div>

      <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
        <button type="button" onClick={ubahStatus} disabled={togglingId === x.id} className={`${btnOutline} min-w-27.5`}>
          {togglingId === x.id ? <Loader2 size={14} className="inline animate-spin" /> : x.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
        </button>
        <button type="button" onClick={() => dispatch(startEdit(x))} className={btnPrimary}>Edit produk</button>
      </div>
    </section>
  );
}
