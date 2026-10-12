'use client';
// Lokasi: src/features/masterdata/components/sdmk/IdentitasModal.tsx
// Tab 1 wizard SDMK. Hanya isi tab; kerangka modal, navigasi & tombol ada di tambahSDMKModal.tsx
import React from 'react';
import { Camera } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showNotification } from '@/features/notification/notificationSlice';
import { cekNikSdmk, setIdentitasField, uploadFoto } from'@/features/masterdata/master-sdmk/slices/sdmkSlice';
import { FILE_MIME_FOTO, validasiFile } from '@/features/masterdata/master-sdmk/utils/sdmkHelpers';
import type { IdentitasForm } from '@/types/domain/sdmk';
import { FileDrop, FormInput, FormSelect, DateField, Label, RadioGroup, Section } from '@/features/masterdata/components/sdmk/SdmkFields';
import RegionFields from '@/features/masterdata/components/sdmk/RegionFields';

export default function IdentitasModal() {
  const dispatch = useAppDispatch();
  const { identitas: f, identitasErrors: err, options, nikStatus, nikMessage, wizard, fotoUrl, saving, detail } =
    useAppSelector((s) => s.sdmk);
  const set = (field: keyof IdentitasForm) => (value: string) => dispatch(setIdentitasField({ field, value }));

  const cekNik = () => {
    if (!/^\d{16}$/.test(f.nik)) {
      dispatch(showNotification({ title: 'NIK Tidak Valid', message: 'NIK harus 16 digit angka.', type: 'error' }));
      return;
    }
    dispatch(cekNikSdmk({ nik: f.nik, exceptId: wizard.sdmkId ?? undefined }));
  };

  const onFoto = (file: File) => {
    const bad = validasiFile(file, FILE_MIME_FOTO);
    if (bad) { dispatch(showNotification({ title: 'Foto Ditolak', message: bad, type: 'error' })); return; }
    dispatch(uploadFoto(file)).unwrap().catch((e: { message: string }) =>
      dispatch(showNotification({ title: 'Gagal Mengunggah', message: e.message, type: 'error' })));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 space-y-8">
        <Section title="Identitas Pribadi">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label text="NIK" required />
              <div className="flex gap-2 mt-1.5">
                <input
                  type="text" inputMode="numeric" maxLength={16} placeholder="Masukkan 16 digit NIK" value={f.nik}
                  onChange={(e) => set('nik')(e.target.value.replace(/\D/g, ''))}
                  data-sdmk-error={err.nik ? 'true' : undefined} aria-invalid={!!err.nik}
                  className={`flex-1 border rounded-lg px-3 py-2 text-sm outline-none text-slate-800 focus:ring-1 ${err.nik ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-500'}`}
                />
                <button type="button" onClick={cekNik} disabled={nikStatus === 'checking'}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  {nikStatus === 'checking' ? 'Memeriksa...' : 'Cek NIK'}
                </button>
              </div>
              {err.nik && <p role="alert" className="text-[11px] text-red-500 mt-1">{err.nik}</p>}
              {!err.nik && nikMessage && (
                <p className={`text-[11px] mt-1 ${nikStatus === 'exists' || nikStatus === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>{nikMessage}</p>
              )}
            </div>
            <FormInput label="Nama Lengkap" required placeholder="Masukkan nama lengkap sesuai identitas" value={f.namaLengkap} error={err.namaLengkap} onChange={set('namaLengkap')} />
            <FormInput label="Gelar Depan" placeholder="Contoh: dr., apt., Ns." value={f.gelarDepan} error={err.gelarDepan} onChange={set('gelarDepan')} />
            <FormInput label="Gelar Belakang" placeholder="Contoh: Sp.PD, M.Kes" value={f.gelarBelakang} error={err.gelarBelakang} onChange={set('gelarBelakang')} />
            <FormInput label="Tempat Lahir" placeholder="Contoh: Bandung" value={f.tempatLahir} error={err.tempatLahir} onChange={set('tempatLahir')} />
            <DateField label="Tanggal Lahir" required value={f.tanggalLahir} error={err.tanggalLahir} onChange={set('tanggalLahir')} />
            <RadioGroup label="Jenis Kelamin" required name="jenis_kelamin_sdmk" value={f.jenisKelamin} options={['Laki-laki', 'Perempuan'] as const} onChange={set('jenisKelamin') as (v: 'Laki-laki' | 'Perempuan') => void} />
            <FormSelect label="Kewarganegaraan" required placeholder="Pilih Kewarganegaraan" value={f.kewarganegaraan} options={options?.kewarganegaraan ?? []} loading={!options} error={err.kewarganegaraan} onChange={set('kewarganegaraan')} />
            <FormInput label="No. HP" required placeholder="08xxxxxxxxxx" inputMode="tel" maxLength={16} value={f.nomorHP} error={err.nomorHP} onChange={(v) => set('nomorHP')(v.replace(/[^\d+]/g, ''))} />
            <FormInput label="Email" placeholder="nama@email.com" type="email" value={f.email} error={err.email} onChange={set('email')} />
          </div>
        </Section>

        <Section title="Alamat Domisili">
          <div className="grid grid-cols-1 gap-5">
            <FormInput label="Alamat Lengkap" required placeholder="Nama jalan, nomor, RT/RW, kelurahan/desa" value={f.alamatLengkap} error={err.alamatLengkap} onChange={set('alamatLengkap')} />
            <RegionFields target="identitas" values={f} errors={err} onChange={(field, value) => dispatch(setIdentitasField({ field, value }))} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput label="RT" placeholder="Contoh: 001" maxLength={3} inputMode="numeric" value={f.rt} error={err.rt} onChange={(v) => set('rt')(v.replace(/\D/g, ''))} />
              <FormInput label="RW" placeholder="Contoh: 002" maxLength={3} inputMode="numeric" value={f.rw} error={err.rw} onChange={(v) => set('rw')(v.replace(/\D/g, ''))} />
              <FormInput label="Kode Pos" placeholder="Contoh: 40123" maxLength={5} inputMode="numeric" value={f.kodePos} error={err.kodePos} onChange={(v) => set('kodePos')(v.replace(/\D/g, ''))} />
            </div>
          </div>
        </Section>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <Section title="Identitas Sistem">
          <div className="flex flex-col gap-1.5 w-full">
            <Label text="SDMK ID" />
            <input type="text" disabled value={detail?.sdmkId ?? ''} placeholder="Akan dibuat otomatis oleh sistem"
              className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-500 outline-none" />
          </div>
        </Section>

        <Section title="Foto Profil">
          {fotoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt="Foto profil SDMK" className="w-24 h-24 rounded-full object-cover mx-auto border border-slate-200" />
          )}
          <FileDrop
            accept="image/png,image/jpeg" title={fotoUrl ? 'Ganti Foto' : 'Upload Foto'} hint="PNG/JPG maksimal 2MB"
            icon={<Camera size={22} />} disabled={saving === 'foto' || !wizard.sdmkId} onFile={onFoto}
          />
          <p className="text-[11px] text-slate-500 text-center">
            {wizard.sdmkId ? 'Gunakan foto formal dengan latar belakang polos' : 'Simpan identitas terlebih dahulu untuk mengunggah foto'}
          </p>
        </Section>

        <Section title="Kontak Darurat">
          <div className="space-y-4">
            <FormInput label="Nama Kontak Darurat" required placeholder="Masukkan nama lengkap" value={f.namaKontakDarurat} error={err.namaKontakDarurat} onChange={set('namaKontakDarurat')} />
            <FormSelect label="Hubungan" required placeholder="Pilih Hubungan" value={f.hubunganKontakDarurat} options={options?.hubungan ?? []} loading={!options} error={err.hubunganKontakDarurat} onChange={set('hubunganKontakDarurat')} />
            <FormInput label="No. HP Kontak Darurat" required placeholder="08xxxxxxxxxx" inputMode="tel" maxLength={16} value={f.nomorHPKontakDarurat} error={err.nomorHPKontakDarurat} onChange={(v) => set('nomorHPKontakDarurat')(v.replace(/[^\d+]/g, ''))} />
          </div>
        </Section>
      </div>
    </div>
  );
}
