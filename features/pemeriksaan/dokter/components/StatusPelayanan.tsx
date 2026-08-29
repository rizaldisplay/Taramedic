import React from 'react';
import { FileText, Check } from 'lucide-react';

type StatusType = 'completed' | 'active' | 'pending';

interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  status: StatusType;
}

const timelineData: TimelineItem[] = [
  {
    id: '1',
    title: 'Pemeriksaan Awal',
    subtitle: 'Perawat • 08:25 WIB',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Pemeriksaan Dokter',
    subtitle: 'Sedang berlangsung',
    status: 'active',
  },
  {
    id: '3',
    title: 'Diagnosis',
    subtitle: 'Belum ditetapkan',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Resep',
    subtitle: 'Belum dikirim',
    status: 'pending',
  },
  {
    id: '5',
    title: 'Farmasi',
    subtitle: 'Menunggu resep',
    status: 'pending',
  },
];

export default function StatusPelayanan() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full p-5 font-sans h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="bg-cyan-600 p-1 rounded">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-sm font-bold text-cyan-600 tracking-wide uppercase">
          Status Pelayanan
        </h2>
      </div>

      {/* Timeline / Stepper */}
      <div className="relative">
        {/* Garis vertikal penghubung */}
        <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gray-200 z-0"></div>

        <ul className="space-y-6 relative z-10">
          {timelineData.map((item) => (
            <li key={item.id} className="flex items-start gap-4">
              {/* Indikator Status (Icon/Circle) */}
              <div className="mt-0.5 shrink-0">
                {item.status === 'completed' && (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                )}
                
                {item.status === 'active' && (
                  <div className="w-5 h-5 bg-cyan-600 rounded-full ring-4 ring-white shadow-sm"></div>
                )}
                
                {item.status === 'pending' && (
                  <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full ring-4 ring-white"></div>
                )}
              </div>

              {/* Teks Status */}
              <div>
                <p
                  className={`text-sm font-semibold mb-0.5 ${
                    item.status === 'active'
                      ? 'text-cyan-600'
                      : 'text-gray-800'
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {item.subtitle}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}