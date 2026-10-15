'use client';
// Lokasi: src/app/masterdata/farmasi/produk-obat/page.tsx
import { ProdukObatHeader } from '@/features/masterdata/components/produk-obat/ProdukObatHeader';
import DaftarProdukObat from '@/features/masterdata/components/produk-obat/DaftarProdukObat';
import PanelProdukObat from '@/features/masterdata/components/produk-obat/PanelProdukObat';

export default function ProdukObatPage() {
  return (
    <div className="min-h-screen p-4 md:p-6 pb-24 font-sans text-gray-800">
      <ProdukObatHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 min-w-0"><DaftarProdukObat /></div>
        <div className="lg:col-span-4 lg:sticky lg:top-6"><PanelProdukObat /></div>
      </div>
    </div>
  );
}
