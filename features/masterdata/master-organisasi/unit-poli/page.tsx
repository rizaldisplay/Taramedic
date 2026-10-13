'use client';
// Lokasi: src/app/masterdata/unit-poli/page.tsx
import { UnitPoliHeader } from '@/features/masterdata/components/organisasi/unitpoli/UnitPoliHeader';
import DaftarUnitPoli from '@/features/masterdata/components/organisasi/unitpoli/DaftarUnitPoli';
import FormUnitPoli from '@/features/masterdata/components/organisasi/unitpoli/FormUnitPoli';

export default function UnitPoliPage() {
  return (
    <div className="min-h-screen p-4 md:p-6 pb-24 font-sans text-gray-800">
      <UnitPoliHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8"><DaftarUnitPoli /></div>
        <div className="lg:col-span-4 lg:sticky lg:top-6"><FormUnitPoli /></div>
      </div>
    </div>
  );
}
