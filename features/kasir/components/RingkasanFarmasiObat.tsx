import React from 'react';
import { ExternalLink } from 'lucide-react';

interface PharmacyItem {
  id: number;
  medicineName: string;
  type: string;
  qty: number;
  unit: string;
  tariff: number;
  total: number;
  guarantor: string;
}

const pharmacyData: PharmacyItem[] = [
  {
    id: 1,
    medicineName: 'Paracetamol 500 mg',
    type: 'Non-Racikan',
    qty: 10,
    unit: 'Tablet',
    tariff: 500,
    total: 5000,
    guarantor: 'BPJS',
  },
  {
    id: 2,
    medicineName: 'Cetirizine 10 mg',
    type: 'Non-Racikan',
    qty: 5,
    unit: 'Tablet',
    tariff: 700,
    total: 3500,
    guarantor: 'BPJS',
  },
  {
    id: 3,
    medicineName: 'Racikan 1 - Puyer',
    type: 'Racikan',
    qty: 10,
    unit: 'Bungkus',
    tariff: 1500,
    total: 15000,
    guarantor: 'BPJS',
  },
];

interface PharmacyServicesTableProps {
  dispensingTime?: string;
  onViewDetail?: () => void;
}

export default function PharmacyServicesTable({
  dispensingTime = '16/08/2026 09:05 WIB',
  onViewDetail,
}: PharmacyServicesTableProps) {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm font-sans">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Badge B Icon */}
          <div className="w-6 h-6 bg-cyan-600 rounded flex items-center justify-center text-white font-bold text-xs">
            B
          </div>
          <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
            FARMASI (Obat)
          </h3>
        </div>
        {/* Status Selesai Badge */}
        <span className="text-emerald-600 text-xs font-semibold">
          Selesai
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-normal">
              <th className="py-2.5 px-4 w-10 text-center font-normal">No.</th>
              <th className="py-2.5 px-4 font-normal">Obat</th>
              <th className="py-2.5 px-4 font-normal">Jenis</th>
              <th className="py-2.5 px-4 font-normal text-center">Qty</th>
              <th className="py-2.5 px-4 font-normal">Satuan</th>
              <th className="py-2.5 px-4 font-normal text-right">Tarif (Rp)</th>
              <th className="py-2.5 px-4 font-normal text-right">Total (Rp)</th>
              <th className="py-2.5 px-4 font-normal text-center">Penjamin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
            {pharmacyData.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 text-center text-slate-400">{index + 1}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{item.medicineName}</td>
                <td className="py-3 px-4 text-slate-600">{item.type}</td>
                <td className="py-3 px-4 text-center">{item.qty}</td>
                <td className="py-3 px-4 text-slate-600">{item.unit}</td>
                <td className="py-3 px-4 text-right">{formatIDR(item.tariff)}</td>
                <td className="py-3 px-4 text-right">{formatIDR(item.total)}</td>
                <td className="py-3 px-4 text-center text-slate-600">{item.guarantor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50/40 border-t border-slate-100 text-xs gap-2">
        <div className="text-[11px] text-slate-400">
          Sumber: Dispensing Farmasi • {dispensingTime}
        </div>
        <button
          onClick={onViewDetail}
          className="flex items-center gap-1.5 text-cyan-600 hover:text-cyan-700 font-medium text-xs transition-colors self-end sm:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Lihat Detail Farmasi</span>
        </button>
      </div>
    </div>
  );
}