import React from 'react';

interface DoctorActionItem {
  id: number;
  actionName: string;
  code: string;
  practitioner: string;
  qty: number;
  tariff: number;
  total: number;
  guarantor: string;
}

const doctorActionsData: DoctorActionItem[] = [
  {
    id: 1,
    actionName: 'Konsultasi dokter spesialis anak',
    code: '89.7',
    practitioner: 'dr. Bima, Sp.A',
    qty: 1,
    tariff: 80000,
    total: 80000,
    guarantor: 'BPJS',
  },
  {
    id: 2,
    actionName: 'Edukasi pasien (medikamentosa & non)',
    code: '87.44',
    practitioner: 'dr. Bima, Sp.A',
    qty: 1,
    tariff: 25000,
    total: 25000,
    guarantor: 'BPJS',
  },
  {
    id: 3,
    actionName: 'Pemeriksaan fisik lanjutan',
    code: '89.9',
    practitioner: 'dr. Bima, Sp.A',
    qty: 1,
    tariff: 45000,
    total: 45000,
    guarantor: 'BPJS',
  },
];

export default function DoctorServicesTable() {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm font-sans">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Badge A Icon */}
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">
            LAYANAN (Tindakan Dokter)
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
              <th className="py-2.5 px-4 font-normal">Tindakan</th>
              <th className="py-2.5 px-4 font-normal">Kode</th>
              <th className="py-2.5 px-4 font-normal">Pelaksana</th>
              <th className="py-2.5 px-4 font-normal text-center">Qty</th>
              <th className="py-2.5 px-4 font-normal text-right">Tarif (Rp)</th>
              <th className="py-2.5 px-4 font-normal text-right">Total (Rp)</th>
              <th className="py-2.5 px-4 font-normal text-center">Penjamin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
            {doctorActionsData.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 text-center text-slate-400">{index + 1}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{item.actionName}</td>
                <td className="py-3 px-4">
                  <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded">
                    {item.code}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">{item.practitioner}</td>
                <td className="py-3 px-4 text-center">{item.qty}</td>
                <td className="py-3 px-4 text-right">{formatIDR(item.tariff)}</td>
                <td className="py-3 px-4 text-right">{formatIDR(item.total)}</td>
                <td className="py-3 px-4 text-center text-slate-600">{item.guarantor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}