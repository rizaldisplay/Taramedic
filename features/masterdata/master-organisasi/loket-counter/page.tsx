'use client';
// Lokasi: src/app/masterdata/lokasi-pelayanan/page.tsx
import { LoketHeader } from '@/features/masterdata/components/loket-counter/LoketHeader';
import DaftarLoket from '@/features/masterdata/components/loket-counter/DaftarLoket';
import FormLoket from '@/features/masterdata/components/loket-counter/FormLoket';

export default function LoketCounterPage() {
  return (
    <div className="min-h-screen p-4 md:p-6 pb-24 font-sans text-gray-800">
      <LoketHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8"><DaftarLoket /></div>
        <div className="lg:col-span-4 lg:sticky lg:top-6"><FormLoket /></div>
      </div>
    </div>
  );
}
