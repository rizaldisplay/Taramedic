import React from 'react';

interface InformasiKunjunganData {
  encounter: string;
  penjamin: string;
  statusFarmasi: string;
  waktuMulai: string;
  noResep: string;
  tanggalResep: string;
}

interface InformasiKunjunganProps {
  data?: InformasiKunjunganData;
}

const defaultData: InformasiKunjunganData = {
  encounter: 'ENC-20260816-0013',
  penjamin: 'BPJS Kesehatan',
  statusFarmasi: 'Sedang Dilayani',
  waktuMulai: '08:25 WIB',
  noResep: 'RX-20260816-013',
  tanggalResep: '16 Agustus 2026',
};

export default function InformasiKunjungan({ data = defaultData }: InformasiKunjunganProps) {
  return (
    <div className="flex w-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-600 text-xs font-bold text-white">
          A
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          INFORMASI KUNJUNGAN
        </h2>
      </div>

      {/* Grid Konten */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        
        {/* Baris 1 */}
        <div>
          <span className="block text-xs font-medium text-slate-500">Encounter</span>
          <span className="mt-1 block text-sm font-semibold text-slate-900">
            {data.encounter}
          </span>
        </div>
        <div>
          <span className="block text-xs font-medium text-slate-500">Penjamin</span>
          <span className="mt-1 block text-sm font-semibold text-slate-900">
            {data.penjamin}
          </span>
        </div>

        {/* Baris 2 */}
        <div>
          <span className="block text-xs font-medium text-slate-500">Status Farmasi</span>
          <span className="mt-1 inline-block rounded-md bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {data.statusFarmasi}
          </span>
        </div>
        <div>
          <span className="block text-xs font-medium text-slate-500">Waktu Mulai Farmasi</span>
          <span className="mt-1 block text-sm font-semibold text-slate-900">
            {data.waktuMulai}
          </span>
        </div>

        {/* Baris 3 */}
        <div>
          <span className="block text-xs font-medium text-slate-500">No. Resep</span>
          <span className="mt-1 block text-sm font-semibold text-slate-900">
            {data.noResep}
          </span>
        </div>
        <div>
          <span className="block text-xs font-medium text-slate-500">Tanggal Resep</span>
          <span className="mt-1 block text-sm font-semibold text-slate-900">
            {data.tanggalResep}
          </span>
        </div>

      </div>
    </div>
  );
}