'use client';
// Lokasi: src/app/masterdata/farmasi/tarif-obat/page.tsx
import { TarifObatHeader } from '@/features/masterdata/components/tarif-obat/TarifObatHeader';
import DaftarTarifObat from '@/features/masterdata/components/tarif-obat/DaftarTarifObat';
import FormTarifObat from '@/features/masterdata/components/tarif-obat/FormTarifObat';

export default function TarifObatPage() {
  return (
    <div className="min-h-screen p-4 md:p-6 pb-24 font-sans text-gray-800">
      <TarifObatHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 min-w-0"><DaftarTarifObat /></div>
        <div className="lg:col-span-4 lg:sticky lg:top-6"><FormTarifObat /></div>
      </div>
    </div>
  );
}
