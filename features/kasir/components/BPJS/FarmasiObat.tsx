import React from 'react';
import { Clock } from 'lucide-react';

interface MedicineItem {
  id: number;
  itemName: string;
  category: string; // Jenis (Non-Racikan / Racikan)
  dosageForm: string; // Sediaan (Tablet / Puyer)
  qty: number;
  unit: string; // Satuan (Tablet / Bungkus)
  tariff: number;
  total: number;
  guarantor: string;
  source: string;
  status: 'Dispensed' | string;
}

const medicineData: MedicineItem[] = [
  {
    id: 1,
    itemName: 'Paracetamol 500 mg',
    category: 'Non-Racikan',
    dosageForm: 'Tablet',
    qty: 10,
    unit: 'Tablet',
    tariff: 500,
    total: 5000,
    guarantor: 'BPJS',
    source: 'Farmasi',
    status: 'Dispensed',
  },
  {
    id: 2,
    itemName: 'Cetirizine 10 mg',
    category: 'Non-Racikan',
    dosageForm: 'Tablet',
    qty: 5,
    unit: 'Tablet',
    tariff: 700,
    total: 3500,
    guarantor: 'BPJS',
    source: 'Farmasi',
    status: 'Dispensed',
  },
  {
    id: 3,
    itemName: 'Racikan 1 - Puyer',
    category: 'Racikan',
    dosageForm: 'Puyer',
    qty: 10,
    unit: 'Bungkus',
    tariff: 1500,
    total: 15000,
    guarantor: 'BPJS',
    source: 'Farmasi',
    status: 'Dispensed',
  },
];

export default function PharmacyItemsTable() {
  const subtotal = medicineData.reduce((acc, item) => acc + item.total, 0);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm font-sans">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
            B
          </div>
          <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">
            Farmasi (Obat)
          </h3>
          <span className="bg-emerald-50 text-emerald-600 font-medium text-xs px-2.5 py-0.5 rounded-full border border-emerald-200">
            {medicineData.length} Item
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-medium bg-slate-50/50">
              <th className="py-3 px-4 w-12 text-center">No.</th>
              <th className="py-3 px-4 font-normal">Item Obat</th>
              <th className="py-3 px-4 font-normal">Jenis</th>
              <th className="py-3 px-4 font-normal">Sediaan</th>
              <th className="py-3 px-4 font-normal text-center">Qty</th>
              <th className="py-3 px-4 font-normal">Sat.</th>
              <th className="py-3 px-4 font-normal text-right">Tarif (Rp)</th>
              <th className="py-3 px-4 font-normal text-right">Total (Rp)</th>
              <th className="py-3 px-4 font-normal">Penjamin</th>
              <th className="py-3 px-4 font-normal">Sumber</th>
              <th className="py-3 px-4 font-normal text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {medicineData.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 text-center text-slate-500">{index + 1}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{item.itemName}</td>
                <td className="py-3.5 px-4 text-slate-600">{item.category}</td>
                <td className="py-3.5 px-4 text-slate-600">{item.dosageForm}</td>
                <td className="py-3.5 px-4 text-center">{item.qty}</td>
                <td className="py-3.5 px-4 text-slate-600">{item.unit}</td>
                <td className="py-3.5 px-4 text-right">{formatIDR(item.tariff)}</td>
                <td className="py-3.5 px-4 text-right">{formatIDR(item.total)}</td>
                <td className="py-3.5 px-4 text-slate-600">{item.guarantor}</td>
                <td className="py-3.5 px-4 text-slate-600">{item.source}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="bg-emerald-50 text-emerald-600 text-[11px] font-medium px-2 py-0.5 rounded border border-emerald-200">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Section (Sumber & Subtotal) */}
      <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/30">
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span>Sumber: Dispensing Farmasi</span>
          <span>•</span>
          <span>16/08/2026 09:05 WIB</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-slate-500 font-semibold text-xs">Subtotal Farmasi</span>
          <span className="text-slate-800 font-bold text-sm">
            Rp {formatIDR(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}