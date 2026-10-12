'use client';
// Lokasi: src/features/masterdata/components/DetailSDMK.tsx
// (File ini tidak ada di unggahan; dibuat sebagai panel ringkas SDMK terpilih.)
import React from 'react';
import { Edit2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openWizardEdit } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import { getInisial } from '@/features/masterdata/master-sdmk/utils/sdmkHelpers';
import { StatusBadge } from '@/features/masterdata/components/sdmk/SdmkFields';

const Row = ({ k, v }: { k: string; v?: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-2 text-xs"><dt className="text-slate-500">{k}</dt><dd className="text-slate-800 font-medium text-right">{v || '-'}</dd></div>
);

export default function DetailSDMK() {
  const dispatch = useAppDispatch();
  const { detail, detailLoading, detailError, selectedId, options } = useAppSelector((s) => s.sdmk);

  if (!selectedId) return <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-400">Pilih SDMK untuk melihat detail.</div>;
  if (detailLoading && !detail) return <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400"><Loader2 className="inline animate-spin" size={18} /></div>;
  if (detailError && !detail) return <div role="alert" className="bg-white rounded-xl border border-red-200 p-6 text-sm text-red-500">{detailError}</div>;
  if (!detail || detail.id !== selectedId) return null;

  const i = detail.identitas;
  const nama = [i.gelarDepan, i.namaLengkap].filter(Boolean).join(' ') + (i.gelarBelakang ? `, ${i.gelarBelakang}` : '');
  const profesi = options?.profesi.find((p: { value: string; label: string }) => p.value === detail.profesi.profesi)?.label ?? detail.profesi.profesi;
  const utama = detail.penempatan.find((p: { status: string; poliNama: string; fasyankesNama: string }) => p.status === 'Aktif');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200 flex items-start gap-4">
        {i.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={i.fotoUrl} alt={`Foto ${i.namaLengkap}`} className="w-16 h-16 rounded-full object-cover" />
        ) : <span className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-700 text-lg font-bold flex items-center justify-center">{getInisial(i.namaLengkap)}</span>}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm truncate">{nama}</h3>
          <p className="text-xs text-slate-500">{detail.sdmkId}</p>
          <div className="mt-2 flex gap-2"><StatusBadge status={detail.profesi.status} /><StatusBadge status={detail.statusIzin} /></div>
        </div>
        <button type="button" aria-label="Ubah SDMK" onClick={() => dispatch(openWizardEdit(detail.id))} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"><Edit2 size={16} /></button>
      </div>
      <dl className="px-6 py-3 divide-y divide-slate-100">
        <Row k="Profesi" v={profesi} />
        <Row k="No. HP" v={i.nomorHP} />
        <Row k="Email" v={i.email} />
        <Row k="No. STR" v={detail.str?.nomorStr} />
        <Row k="STR berlaku hingga" v={detail.str?.berlakuHingga} />
        <Row k="Jumlah SIP" v={detail.sip.length} />
        <Row k="Penempatan aktif" v={utama ? `${utama.poliNama} (${utama.fasyankesNama})` : undefined} />
        <Row k="Practitioner IHS" v={detail.integrasi.ihsNumber} />
        <Row k="Diperbarui" v={detail.updatedAt} />
      </dl>
    </div>
  );
}
