import React from 'react';
import { Stethoscope } from 'lucide-react';

interface DoctorActionItem {
  id: number;
  itemName: string;
  code: string;
  practitioner: string;
  qty: number;
  tariff: number;
  total: number;
  guarantor: string;
  source: string;
  status: 'Billable' | string;
}

const doctorActionsData: DoctorActionItem[] = [
  {
    id: 1,
    itemName: 'Konsultasi dokter spesialis anak',
    code: '89.7',
    practitioner: 'dr. Bima, Sp.A',
    qty: 1,
    tariff: 80000,
    total: 80000,
    guarantor: 'BPJS',
    source: 'Dokter',
    status: 'Billable',
  },
  {
    id: 2,
    itemName: 'Edukasi pasien (medikamentosa & non medikamentosa)',
    code: '87.44',
    practitioner: 'dr. Bima, Sp.A',
    qty: 1,
    tariff: 25000,
    total: 25000,
    guarantor: 'BPJS',
    source: 'Dokter',
    status: 'Billable',
  },
  {
    id: 3,
    itemName: 'Pemeriksaan fisik lanjutan',
    code: '89.9',
    practitioner: 'dr. Bima, Sp.A',
    qty: 1,
    tariff: 45000,
    total: 45000,
    guarantor: 'BPJS',
    source: 'Dokter',
    status: 'Billable',
  },
];

export default function DoctorServicesTable() {
  const subtotal = doctorActionsData.reduce((acc, item) => acc + item.total, 0);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm font-sans">
      {/* Table Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-cyan-600 rounded flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">
            Layanan (Tindakan Dokter)
          </h3>
          <span className="bg-emerald-50 text-emerald-600 font-medium text-xs px-2.5 py-0.5 rounded-full border border-emerald-200">
            {doctorActionsData.length} Item
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-medium bg-slate-50/50">
              <th className="py-3 px-4 w-12 text-center">No.</th>
              <th className="py-3 px-4 font-normal">Item Layanan</th>
              <th className="py-3 px-4 font-normal">Kode</th>
              <th className="py-3 px-4 font-normal">Pelaksana</th>
              <th className="py-3 px-4 font-normal text-center">Qty</th>
              <th className="py-3 px-4 font-normal text-right">Tarif (Rp)</th>
              <th className="py-3 px-4 font-normal text-right">Total (Rp)</th>
              <th className="py-3 px-4 font-normal">Penjamin</th>
              <th className="py-3 px-4 font-normal">Sumber</th>
              <th className="py-3 px-4 font-normal text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {doctorActionsData.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 text-center text-slate-500">{index + 1}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{item.itemName}</td>
                <td className="py-3.5 px-4">
                  <span className="bg-cyan-50 text-cyan-600 text-[11px] font-bold px-2 py-0.5 rounded">
                    {item.code}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">{item.practitioner}</td>
                <td className="py-3.5 px-4 text-center">{item.qty}</td>
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

      {/* Table Footer / Subtotal */}
      <div className="flex justify-end items-center gap-6 p-4 border-t border-slate-100 bg-slate-50/30">
        <span className="text-slate-500 font-semibold text-xs">Subtotal Layanan</span>
        <span className="text-slate-800 font-bold text-sm">
          Rp {formatIDR(subtotal)}
        </span>
      </div>
    </div>
  );
}