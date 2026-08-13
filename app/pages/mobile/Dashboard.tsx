import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  Menu,
  Bell,
  ChevronDown,
  ChevronRight,
  UserPlus,
  UserCheck,
  Clock,
  Stethoscope,
  Pill,
  Wallet,
  DollarSign,
  Package,
  ClipboardList,
  Receipt,
  BarChart2,
  CalendarDays,
  AlertTriangle,
  Info,
} from 'lucide-react';
import BottomNav from '@/components/layouts/MobileBottomNav';

// ─── helpers ────────────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, '0');

function useClock() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── data ────────────────────────────────────────────────────────────────────
const statsRow1 = [
  { icon: UserPlus,    color: '#2563EB', bg: '#EFF6FF', value: '86',           label: 'Total Pasien\nHari Ini' },
  { icon: UserCheck,   color: '#059669', bg: '#F0FDF4', value: '24',           label: 'Pasien Baru\nHari Ini' },
  { icon: Clock,       color: '#D97706', bg: '#FFFBEB', value: '62',           label: 'Antrean Berjalan\nSemua Poli' },
  { icon: Stethoscope, color: '#7C3AED', bg: '#F5F3FF', value: '18',           label: 'Pasien Diperiksa\nHari Ini' },
];

const statsRow2 = [
  { icon: Pill,        color: '#2563EB', bg: '#EFF6FF', value: '15',           label: 'Resep Diproses\ndi Farmasi',      valueColor: undefined },
  { icon: Wallet,      color: '#DC2626', bg: '#FEF2F2', value: '12',           label: 'Menunggu\nPembayaran',           valueColor: undefined },
  { icon: DollarSign,  color: '#059669', bg: '#F0FDF4', value: 'Rp 8.450.000', label: 'Pendapatan\nHari Ini',           valueColor: '#059669' },
  { icon: Package,     color: '#6B7280', bg: '#F9FAFB', value: '27',           label: 'Stok Obat\nMinimum',             valueColor: undefined },
];

const menuCepat = [
  { icon: UserPlus,     color: '#2563EB', bg: '#EFF6FF', label: 'Pendaftaran\nPasien', path: '/pendaftaran' },
  { icon: ClipboardList,color: '#7C3AED', bg: '#F5F3FF', label: 'Antrean\nPasien',     path: '/antrean' },
  { icon: Stethoscope,  color: '#059669', bg: '#F0FDF4', label: 'Poli /\nDokter',      path: '/rme' },
  { icon: Pill,         color: '#D97706', bg: '#FFFBEB', label: 'Farmasi',              path: '/farmasi' },
  { icon: Receipt,      color: '#DC2626', bg: '#FEF2F2', label: 'Kasir',               path: '/kasir' },
  { icon: BarChart2,    color: '#6B7280', bg: '#F9FAFB', label: 'Laporan',             path: '/laporan' },
];

const queues = [
  { abbr: 'PU', abbrColor: '#1D4ED8', abbrBg: '#DBEAFE', poli: 'Poli Umum',  number: 'PU-012', patient: 'Budi Santoso',   wait: '± 25 Menit' },
  { abbr: 'PG', abbrColor: '#15803D', abbrBg: '#DCFCE7', poli: 'Poli Gigi',  number: 'PG-008', patient: 'Siti Nurhaliza', wait: '± 15 Menit' },
  { abbr: 'PA', abbrColor: '#C2410C', abbrBg: '#FFEDD5', poli: 'Poli Anak',  number: 'PA-006', patient: 'Ahmad Fauzi',    wait: '± 20 Menit' },
];

const notifs = [
  { icon: AlertTriangle, iconColor: '#D97706', iconBg: '#FFFBEB', text: 'Stok obat Amoxicillin 500mg hampir habis (Tersisa 8 strip)', time: '5 menit lalu' },
  { icon: Info,          iconColor: '#2563EB', iconBg: '#EFF6FF', text: 'Resep baru dari dr. Andi Wijaya - PU-012',                    time: '10 menit lalu' },
];

// ─── animation variants ──────────────────────────────────────────────────────
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item      = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

// ─── sub-components ──────────────────────────────────────────────────────────
function ClinicSVG() {
  return (
    <svg viewBox="0 0 110 90" className="w-[110px] h-[90px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* sky */}
      <rect width="110" height="90" rx="8" fill="#3B82F6" fillOpacity="0.15" />
      {/* clouds */}
      <ellipse cx="85" cy="18" rx="14" ry="7" fill="white" fillOpacity="0.5" />
      <ellipse cx="95" cy="15" rx="10" ry="6" fill="white" fillOpacity="0.6" />
      {/* building body */}
      <rect x="22" y="36" width="66" height="48" rx="3" fill="white" fillOpacity="0.9" />
      {/* roof */}
      <rect x="18" y="28" width="74" height="14" rx="3" fill="#1D4ED8" fillOpacity="0.85" />
      {/* cross sign on roof */}
      <rect x="49" y="14" width="12" height="18" rx="2" fill="white" fillOpacity="0.95" />
      <rect x="44" y="19" width="22" height="8" rx="2" fill="white" fillOpacity="0.95" />
      {/* windows row */}
      <rect x="28" y="44" width="14" height="12" rx="2" fill="#BFDBFE" />
      <rect x="48" y="44" width="14" height="12" rx="2" fill="#BFDBFE" />
      <rect x="68" y="44" width="14" height="12" rx="2" fill="#BFDBFE" />
      {/* door */}
      <rect x="42" y="62" width="26" height="22" rx="3" fill="#93C5FD" />
      <circle cx="65" cy="73" r="2" fill="#1D4ED8" />
      {/* ground line */}
      <rect x="0" y="84" width="110" height="6" rx="2" fill="#1D4ED8" fillOpacity="0.15" />
      {/* trees */}
      <rect x="7"  y="66" width="5" height="18" rx="2" fill="#4ADE80" fillOpacity="0.7" />
      <ellipse cx="9.5" cy="62" rx="9" ry="10" fill="#22C55E" fillOpacity="0.8" />
      <rect x="98" y="66" width="5" height="18" rx="2" fill="#4ADE80" fillOpacity="0.7" />
      <ellipse cx="100.5" cy="62" rx="9" ry="10" fill="#22C55E" fillOpacity="0.8" />
    </svg>
  );
}

function StatCard({ icon: Icon, color, bg, value, label, valueColor }: {
  icon: React.ElementType; color: string; bg: string;
  value: string; label: string; valueColor?: string;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center py-3 px-1 bg-white rounded-2xl shadow-sm border border-border/50 gap-1"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <span
        className="text-base font-bold leading-tight text-center"
        style={{ color: valueColor ?? '#111827', fontSize: value.length > 4 ? '11px' : undefined }}
      >
        {value}
      </span>
      <span className="text-[9px] text-muted-foreground text-center leading-tight whitespace-pre-line">
        {label}
      </span>
    </motion.div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const clock = useClock();

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col pb-28">

      {/* ── TOP NAVBAR ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-border/60 px-4 pt-10 pb-3 flex items-center justify-between">
        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center leading-none">
          <div className="flex items-center gap-1">
            <span className="text-primary font-black text-lg leading-none">+</span>
            <span className="text-primary font-extrabold text-base leading-none tracking-tight">octamedic</span>
          </div>
          <span className="text-[8px] text-muted-foreground tracking-widest uppercase font-medium mt-0.5">
            Klinik Sehat Sentosa
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-1">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-orange-400 text-white text-[9px] font-bold flex items-center justify-center">
              8
            </span>
          </button>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-[11px] font-bold text-white">AD</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="flex-1 overflow-y-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4 py-4">

          {/* ── HERO CARD ── */}
          <motion.div variants={item} className="mx-4">
            <div className="relative bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] rounded-2xl px-5 py-5 overflow-hidden">
              <div className="flex items-end justify-between">
                {/* left */}
                <div className="flex flex-col gap-0.5 flex-1">
                  <p className="text-blue-200 text-xs">Selamat Pagi,</p>
                  <h1 className="text-white text-xl font-bold leading-tight">dr. Andi Wijaya</h1>
                  <p className="text-blue-300 text-xs">Dokter Umum</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-blue-100 text-[11px]">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>Selasa, 20 Mei 2025</span>
                    </div>
                    <span className="text-blue-300 text-[11px]">|</span>
                    <span className="text-white text-[11px] font-mono font-semibold">{clock}</span>
                  </div>
                </div>
                {/* clinic illustration */}
                <div className="flex-shrink-0 -mb-1">
                  <ClinicSVG />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── STATS 2×4 GRID ── */}
          <motion.div variants={item} className="mx-4 flex flex-col gap-2.5">
            <div className="grid grid-cols-4 gap-2.5">
              {statsRow1.map(s => <StatCard key={s.label} {...s} />)}
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {statsRow2.map(s => <StatCard key={s.label} {...s} />)}
            </div>
          </motion.div>

          {/* ── MENU CEPAT ── */}
          <motion.div variants={item} className="mx-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">Menu Cepat</h2>
              <button className="flex items-center gap-0.5 text-xs text-primary font-medium hover:underline">
                Semua Menu <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 pb-1" style={{ minWidth: 'max-content' }}>
                {menuCepat.map(({ icon: Icon, color, bg, label, path }) => (
                  <motion.button
                    key={label}
                    whileTap={{ scale: 0.90 }}
                    onClick={() => setLocation(path)}
                    className="flex flex-col items-center gap-1.5 min-w-[60px]"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <span className="text-[10px] font-medium text-foreground text-center leading-tight whitespace-pre-line">
                      {label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── ANTREAN BERJALAN ── */}
          <motion.div variants={item} className="mx-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">Antrean Berjalan</h2>
              <button className="flex items-center gap-1 border border-border rounded-lg px-2.5 py-1 text-xs text-foreground bg-white">
                Semua Poli <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {queues.map(({ abbr, abbrColor, abbrBg, poli, number, patient, wait }) => (
                <motion.button
                  key={number}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLocation('/antrean')}
                  className="w-full flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-border/50 px-4 py-3.5 text-left"
                >
                  {/* abbr circle */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: abbrBg }}
                  >
                    <span className="text-sm font-extrabold" style={{ color: abbrColor }}>{abbr}</span>
                  </div>
                  {/* center info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground">{poli}</p>
                    <p className="text-[9px] text-muted-foreground">Nomor Dipanggil</p>
                    <p className="text-base font-bold" style={{ color: abbrColor }}>{number}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Pasien</p>
                    <p className="text-sm font-medium text-foreground">{patient}</p>
                  </div>
                  {/* right */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-[9px] text-muted-foreground">Estimasi Tunggu</p>
                    <p className="text-xs font-bold text-[#059669]">{wait}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                  </div>
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => setLocation('/antrean')}
              className="w-full mt-3 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Lihat Semua Antrean <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* ── NOTIFIKASI ── */}
          <motion.div variants={item} className="mx-4 mb-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">Notifikasi</h2>
              <button className="flex items-center gap-0.5 text-xs text-primary font-medium hover:underline">
                Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
              {notifs.map(({ icon: Icon, iconColor, iconBg, text, time }, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3.5 ${i < notifs.length - 1 ? 'border-b border-border/50' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
                    <Icon className="w-4 h-4" style={{ color: iconColor }} />
                  </div>
                  <p className="flex-1 text-xs text-foreground leading-snug">{text}</p>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-1">{time}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
