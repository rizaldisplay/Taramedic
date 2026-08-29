import React from 'react';
import { Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PharmacyAlertData {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  description: string;
}

interface PharmacyAlertProps {
  data?: PharmacyAlertData[];
}

const defaultData: PharmacyAlertData[] = [
  {
    id: '1',
    type: 'info',
    title: 'Riwayat medis relevan',
    description: 'Tidak ada riwayat penyakit kronis.',
  },
  {
    id: '2',
    type: 'success',
    title: 'Interaksi Obat',
    description: 'Tidak ditemukan interaksi signifikan.',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Peringatan',
    description: 'Pastikan alergi obat tetap dimonitor.',
  },
];

export default function PerhatianFarmasi({ data = defaultData }: PharmacyAlertProps) {
  // Fungsi bantuan untuk me-render icon dan warna sesuai tipe
  const renderIconAndColor = (type: PharmacyAlertData['type']) => {
    switch (type) {
      case 'info':
        return {
          icon: <Info className="h-5 w-5 text-cyan-500" />,
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-slate-500" />,
        };
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-600 text-xs font-bold text-white">
          E
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          PERHATIAN FARMASI
        </h2>
      </div>

      {/* List Perhatian */}
      <div className="flex flex-col gap-5">
        {data.map((item) => {
          const { icon } = renderIconAndColor(item.type);
          
          return (
            <div key={item.id} className="flex items-start gap-3">
              {/* Icon Container */}
              <div className="mt-0.5 shrink-0">
                {icon}
              </div>
              
              {/* Teks Content */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">
                  {item.title}
                </span>
                <span className="mt-0.5 text-sm text-slate-600 leading-snug">
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}