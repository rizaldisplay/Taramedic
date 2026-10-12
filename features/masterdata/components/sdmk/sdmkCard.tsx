'use client';
// Lokasi: src/features/masterdata/components/sdmk/sdmkCard.tsx
import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, RefreshCcw, UserX, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStats } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import type { SdmkStats } from '@/types/domain/sdmk';

interface SDMKCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  subtitle?: string;
  iconBg: string;
}

const SDMKCard: React.FC<SDMKCardProps> = ({ icon, title, value, unit, subtitle, iconBg }) => (
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

const CARDS: { key: keyof SdmkStats; title: string; icon: React.ElementType; color: string; bg: string; subtitle?: string }[] = [
  { key: 'total', title: 'Total SDMK', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { key: 'aktif', title: 'Aktif', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'tidakAktif', title: 'Tidak Aktif', icon: UserX, color: 'text-slate-600', bg: 'bg-slate-100' },
  { key: 'izinSegeraBerakhir', title: 'Izin Segera Berakhir', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', subtitle: 'Dalam 30 hari' },
  { key: 'izinKadaluwarsa', title: 'Izin Kadaluwarsa', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  { key: 'belumTersinkron', title: 'Belum Tersinkron', icon: RefreshCcw, color: 'text-indigo-600', bg: 'bg-indigo-50', subtitle: 'SATUSEHAT' },
];

export const SdmkCard = () => {
  const dispatch = useAppDispatch();
  const { stats, statsLoading } = useAppSelector((s) => s.sdmk);

  useEffect(() => { dispatch(fetchStats()); }, [dispatch]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6" aria-busy={statsLoading}>
      {CARDS.map(({ key, title, icon: Icon, color, bg, subtitle }) => (
        <SDMKCard key={key} title={title} subtitle={subtitle} unit="Orang" iconBg={bg}
          icon={<Icon className={`w-5 h-5 ${color}`} />} value={stats ? stats[key] : statsLoading ? '…' : '-'} />
      ))}
    </div>
  );
};
