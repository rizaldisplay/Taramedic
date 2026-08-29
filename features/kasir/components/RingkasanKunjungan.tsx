import React from 'react';
import { Stethoscope, Pill, FileText, CreditCard, ArrowRight } from 'lucide-react';

interface VisitSummaryProps {
  visitDate?: string;
  location?: string;
  serviceType?: string;
  billingStatus?: string;
  dataSource?: string;
}

export default function VisitSummaryCard({
  visitDate = '16 Agustus 2026',
  location = 'Loket 1',
  serviceType = 'Rawat Jalan',
  billingStatus = 'Siap Dibayar',
  dataSource = 'Terintegrasi (SATUSEHAT)',
}: VisitSummaryProps) {
  const steps = [
    {
      id: 1,
      title: 'Dokter',
      subtitle: '(Tindakan & Resep)',
      status: 'Selesai',
      time: '16/08/2026 08:52',
      icon: Stethoscope,
      isCompleted: true,
    },
    {
      id: 2,
      title: 'Farmasi',
      subtitle: '(Dispensing)',
      status: 'Selesai',
      time: '16/08/2026 09:05',
      icon: Pill,
      isCompleted: true,
    },
    {
      id: 3,
      title: 'Billing Engine',
      subtitle: '',
      status: 'Selesai',
      time: '16/08/2026 09:10',
      icon: FileText,
      isCompleted: true,
    },
    {
      id: 4,
      title: 'Kasir',
      subtitle: '(Pembayaran)',
      status: 'Siap Diproses',
      time: '',
      icon: CreditCard,
      isCompleted: false,
    },
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm font-sans space-y-5">
      {/* Header Title */}
      <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-3">
        RINGKASAN KUNJUNGAN
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Detail Meta Info (5 Cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
          <span className="text-slate-400">Tanggal Kunjungan</span>
          <span className="font-semibold text-slate-700">{visitDate}</span>

          <span className="text-slate-400">Lokasi / Loket</span>
          <span className="font-semibold text-slate-700">{location}</span>

          <span className="text-slate-400">Jenis Layanan</span>
          <span className="font-semibold text-slate-700">{serviceType}</span>

          <span className="text-slate-400">Status Billing</span>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {billingStatus}
            </span>
          </div>

          <span className="text-slate-400">Sumber Data</span>
          <span className="font-semibold text-blue-600">{dataSource}</span>
        </div>

        {/* Stepper Flow Process (7 Cols) */}
        <div className="lg:col-span-7 flex items-center justify-between gap-1 overflow-x-auto py-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div className="flex flex-col items-center text-center min-w-[90px]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                      step.isCompleted
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="text-[11px] font-bold text-slate-800 mt-2 leading-tight">
                    {step.title}
                  </span>
                  {step.subtitle && (
                    <span className="text-[10px] text-slate-400 leading-tight">
                      {step.subtitle}
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-medium mt-1 ${
                      step.isCompleted ? 'text-emerald-600' : 'text-blue-600'
                    }`}
                  >
                    {step.status}
                  </span>

                  {step.time && (
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      {step.time}
                    </span>
                  )}
                </div>

                {/* Arrow Connector */}
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 mb-6" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Satusehat Regulation Footer Note */}
      <div className="pt-3 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400">
          Data terintegrasi sesuai regulasi SATUSEHAT & Permenkes No. 24 Tahun 2022 tentang Rekam Medis.
        </p>
      </div>
    </div>
  );
}