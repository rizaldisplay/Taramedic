'use client';
// Lokasi: src/app/masterdata/lokasi-pelayanan/page.tsx
import { LokasiHeader } from '@/features/masterdata/components/lokasi-pelayanan/LokasiHeader';
import DaftarLokasi from '@/features/masterdata/components/lokasi-pelayanan/DaftarLokasi';
import FormLokasi from '@/features/masterdata/components/lokasi-pelayanan/FormLokasi';

export default function LokasiPelayananPage() {
  return (
    <div className="min-h-screen p-4 md:p-6 pb-24 font-sans text-gray-800">
      <LokasiHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8"><DaftarLokasi /></div>
        <div className="lg:col-span-4 lg:sticky lg:top-6"><FormLokasi /></div>
      </div>
    </div>
  );
}
