'use client';
// Lokasi: src/features/masterdata/components/sdmk/tambahSDMKModal.tsx
// Wizard host Tambah/Ubah SDMK: kerangka modal, navigasi tab, dan tombol simpan.
// Isi tiap tab ada di file masing-masing (IdentitasModal, ProfesiModal, ...).
import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Award, Calendar, FileCheck, FileText, Loader2, MapPin, Shield, User, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import type { SdmkDetail, SdmkTabKey } from '@/types/domain/sdmk';
import {
  closeWizard, fetchOptions, fetchSdmkDetail, fetchSdmkList, fetchStats, saveCatatan, saveIdentitas, saveIntegrasi,
  saveJadwal, saveProfesi, saveStr, setTab,
} from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import { TABS } from '@/features/masterdata/master-sdmk/utils/sdmkHelpers';
import { focusFirstError } from './SdmkFields';
import IdentitasModal from './IdentitasModal';
import ProfesiModal from './ProfesiModal';
import RegistrasiModal from './RegistrasiModal';
import PenempatanModal from './PenempatanModal';
import JadwalPraktikModal from './JadwalPraktikModal';
import IntegrasiModal from './IntegrasiModal';
import CatatanTab from './CatatanTab';

const ICONS: Record<SdmkTabKey, React.ElementType> = {
  identitas: User, profesi: Award, registrasi: FileText, penempatan: MapPin, jadwal: Calendar, integrasi: Shield, catatan: FileCheck,
};

const TAB_BODY: Record<SdmkTabKey, React.ComponentType> = {
  identitas: IdentitasModal, profesi: ProfesiModal, registrasi: RegistrasiModal, penempatan: PenempatanModal,
  jadwal: JadwalPraktikModal, integrasi: IntegrasiModal, catatan: CatatanTab,
};

export default function TambahSDMKModal() {
  const dispatch = useAppDispatch();
  const { wizard, saving, detail, identitas } = useAppSelector((s) => s.sdmk);
  const { open, activeTab, sdmkId, loading } = wizard;

  useEffect(() => {
    if (!open) return;
    dispatch(fetchOptions());
    if (sdmkId) dispatch(fetchSdmkDetail(sdmkId));
    // sdmkId sengaja tidak jadi dependensi: fetch hanya saat wizard dibuka, bukan setiap SDMK baru tersimpan
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dispatch]);

  // Esc menutup modal terluar hanya bila tidak ada sub-modal (SIP/Slot) yang terbuka
  const subOpen = useAppSelector((s) => s.sdmk.sipModal.open || s.sdmk.slotModal.open);
  const tutup = React.useCallback(() => {
    if (!sdmkId && identitas.namaLengkap && !window.confirm('Data belum disimpan. Tutup formulir?')) return;
    dispatch(closeWizard());
    dispatch(fetchSdmkList());
    dispatch(fetchStats());
  }, [dispatch, sdmkId, identitas.namaLengkap]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !subOpen) tutup(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, subOpen, tutup]);

  if (!open) return null;

  const idx = TABS.findIndex((t) => t.key === activeTab);
  const next = TABS[idx + 1];
  const prev = TABS[idx - 1];
  const busy = saving !== null;
  const Body = TAB_BODY[activeTab];

  const run = async (): Promise<SdmkDetail | null | 'skip'> => {
    switch (activeTab) {
      case 'identitas': return dispatch(saveIdentitas()).unwrap();
      case 'profesi': return dispatch(saveProfesi()).unwrap();
      case 'registrasi': return dispatch(saveStr()).unwrap();
      case 'jadwal': return dispatch(saveJadwal()).unwrap();
      case 'integrasi': return dispatch(saveIntegrasi()).unwrap();
      case 'catatan': return dispatch(saveCatatan()).unwrap();
      default: return 'skip'; // penempatan disimpan per baris di dalam tab
    }
  };

  const simpan = async (lanjut: boolean) => {
    try {
      const hasil = await run();
      if (hasil !== 'skip') {
        dispatch(showNotification({ title: 'Tersimpan', message: `Data ${TABS[idx].label} berhasil disimpan.`, type: 'success' }));
      }
      if (activeTab === 'catatan') {
        dispatch(closeWizard()); dispatch(fetchSdmkList()); dispatch(fetchStats());
        return;
      }
      if (lanjut && next) dispatch(setTab(next.key));
    } catch (e) {
      dispatch(showNotification({ title: 'Gagal Menyimpan', message: (e as { message: string }).message, type: 'error' }));
      focusFirstError();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4" role="dialog" aria-modal="true" aria-label="Formulir SDMK">
      <div className="bg-white w-full max-w-7xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        <div className="flex items-start justify-between px-8 py-6 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[#0b2756] tracking-wide">{detail ? `Ubah SDMK ${detail.sdmkId}` : 'Tambah SDMK'}</h2>
            <p className="text-xs text-slate-500 mt-1">Lengkapi data tenaga kesehatan. Data akan digunakan untuk layanan dan integrasi SATUSEHAT.</p>
          </div>
          <button type="button" aria-label="Tutup" onClick={tutup} className="text-slate-400 hover:text-slate-700 p-1"><X size={22} /></button>
        </div>

        <div role="tablist" className="flex border-b border-slate-200 px-8 shrink-0 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = ICONS[t.key];
            const aktif = t.key === activeTab;
            const terkunci = t.key !== 'identitas' && !sdmkId;
            return (
              <button key={t.key} type="button" role="tab" aria-selected={aktif} disabled={terkunci || busy}
                title={terkunci ? 'Simpan identitas terlebih dahulu' : undefined}
                onClick={() => dispatch(setTab(t.key))}
                className={`flex items-center gap-2.5 py-4 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors disabled:cursor-not-allowed ${
                  aktif ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-500'}`}>
                <Icon size={16} />{t.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-400 gap-2 text-sm"><Loader2 className="animate-spin" size={18} /> Memuat data SDMK...</div>
          ) : <Body />}
        </div>

        <div className="px-8 py-5 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <button type="button" onClick={tutup} className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
          <div className="flex gap-3">
            {prev && (
              <button type="button" disabled={busy} onClick={() => dispatch(setTab(prev.key))}
                className="flex items-center gap-2 px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                <ArrowLeft size={16} /> Kembali
              </button>
            )}
            {activeTab !== 'penempatan' && activeTab !== 'catatan' && (
              <button type="button" disabled={busy || loading} onClick={() => simpan(false)}
                className="px-6 py-2.5 border border-cyan-600 rounded-xl text-sm font-semibold text-cyan-600 hover:bg-cyan-50 disabled:opacity-50">
                Simpan
              </button>
            )}
            <button type="button" disabled={busy || loading} onClick={() => simpan(true)}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-60">
              {busy && <Loader2 size={16} className="animate-spin" />}
              {activeTab === 'catatan' ? 'Simpan SDMK' : <>Simpan &amp; Lanjut ke {next?.label} <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
