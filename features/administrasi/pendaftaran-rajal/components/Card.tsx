'use client';
// Lokasi: src/features/masterdata/components/sdmk/sdmkCard.tsx
import React, { useEffect } from 'react';
import { ClipboardList, Clock, HeartPulse, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStats } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import type { SdmkStats } from '@/types/domain/sdmk';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  iconBg: string;
}

const ListCard: React.FC<CardProps> = ({ icon, title, value, subtitle, iconBg }) => (
  <div className="relative overflow-hidden bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[160px]">
    {/* Ornamen Lingkaran di Kanan Bawah */}
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-100/80 rounded-full pointer-events-none" />

    <div className="relative z-10 flex justify-between items-start mb-6">
      <p className="text-[15px] font-semibold text-slate-600 max-w-[80%]">{title}</p>
      <div className={`p-2.5 rounded-xl ${iconBg} flex-shrink-0`}>{icon}</div>
    </div>
    
    <div className="relative z-10 mt-auto flex flex-col gap-1.5">
      <div className="text-4xl font-bold text-[#0f2537]">
        {value}
      </div>
      <p className="text-[13px] text-slate-400 font-medium">
        {subtitle}
      </p>
    </div>
  </div>
);

const CARDS: { key: keyof SdmkStats; title: string; icon: React.ElementType; color: string; bg: string; subtitle: string }[] = [
  { key: 'total', title: 'Pendaftaran Hari Ini', icon: ClipboardList, color: 'text-sky-600', bg: 'bg-sky-50', subtitle: 'Total kunjungan terdaftar hari ini' },
  { key: 'aktif', title: 'Antrean Menunggu', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', subtitle: 'Menunggu proses pelayanan' },
  { key: 'tidakAktif', title: 'Sedang Dilayani', icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-50', subtitle: 'Kunjungan dalam proses pelayanan' },
  { key: 'izinSegeraBerakhir', title: 'Selesai Hari Ini', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', subtitle: 'Kunjungan selesai hari ini' },
];

export const Card = () => {
  const dispatch = useAppDispatch();
  const { stats, statsLoading } = useAppSelector((s) => s.sdmk);

  useEffect(() => { 
    dispatch(fetchStats()); 
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" aria-busy={statsLoading}>
      {CARDS.map(({ key, title, icon: Icon, color, bg, subtitle }) => (
        <ListCard 
          key={key} 
          title={title} 
          subtitle={subtitle} 
          iconBg={bg}
          icon={<Icon className={`w-5 h-5 ${color}`} strokeWidth={2.5} />} 
          value={stats ? stats[key] : statsLoading ? '…' : '0'} 
        />
      ))}
    </div>
  );
};