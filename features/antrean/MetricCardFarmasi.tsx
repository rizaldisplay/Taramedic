'use client';

import React from 'react';
import { Users, Clock, CheckCircle2 } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  subtitle?: string;
  iconBg: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, unit, subtitle, iconBg }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
    <div className={`p-3 rounded-full ${iconBg} flex-shrink-0`}>{icon}</div>
    <div>
      <p className="text-xs text-slate-500 font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className="text-sm text-slate-500 font-medium">{unit}</span>
      </div>
      {subtitle && <p className="text-[10px] text-slate-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export const MetricCards = () => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <MetricCard icon={<Users className="w-5 h-5 text-emerald-600" />} title="Total Antrean" value="18" unit="Pasien" subtitle="Resep yang masuk hari ini" iconBg="bg-emerald-50" />
      <MetricCard icon={<Clock className="w-5 h-5 text-amber-600" />} title="Rata-rata Waktu Tunggu" value="32" unit="Menit" subtitle="Rata-rata dari resep diterima sampai mulai dilayani" iconBg="bg-amber-50" />
      <MetricCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />} title="Sudah Dilayani" value="45" unit="Pasien" subtitle="Pasien selesai dilayani hari ini" iconBg="bg-emerald-50" />
      <MetricCard icon={<Clock className="w-5 h-5 text-indigo-600" />} title="Estimasi Selesai" value="15:20" unit="WIB" subtitle="Perkiraan seluruh antrian selesai hari ini" iconBg="bg-indigo-50" />
    </div>
  );
};