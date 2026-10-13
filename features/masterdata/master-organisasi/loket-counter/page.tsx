"use client";

// Lokasi: src/app/.../sdmk/page.tsx
import { SdmkCard } from "@/features/masterdata/components/sdmk/sdmkCard";
import { SDMKHeader } from "@/features/masterdata/components/sdmk/sdmkHeader";
import DaftarSDMK from "@/features/masterdata/components/DaftarSDMK";
import DetailSDMK from "@/features/masterdata/components/DetailSDMK";

export default function SdmkPage() {
  return (
    <div className="overflow-hidden">
      <div className="min-h-screen p-4 md:p-6 pb-24 md:pb-28 font-sans text-gray-800">
        <SDMKHeader />
        <SdmkCard />

        {/* Kiri: daftar SDMK (8 kolom) • Kanan: detail SDMK terpilih (4 kolom) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <DaftarSDMK />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6">
            <DetailSDMK />
          </div>
        </div>
      </div>
    </div>
  );
}
