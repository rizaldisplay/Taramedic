import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Bell, ClipboardList, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import BottomNav from '@/components/layouts/MobileBottomNav';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type AntreanStatus = 'Menunggu' | 'Dipanggil' | 'Selesai';

interface AntreanItem {
  noAntrean: string;
  nama: string;
  poli: string;
  status: AntreanStatus;
  waktu: string;
}

const antreanData: AntreanItem[] = [
  {
    noAntrean: 'PU-010',
    nama: 'Budi Santoso',
    poli: 'Poli Umum',
    status: 'Dipanggil',
    waktu: '09:15',
  },
  {
    noAntrean: 'PU-011',
    nama: 'Dewi Anggraini',
    poli: 'Poli Umum',
    status: 'Menunggu',
    waktu: '09:22',
  },
  {
    noAntrean: 'PG-003',
    nama: 'Rizky Maulana',
    poli: 'Poli Gigi',
    status: 'Selesai',
    waktu: '08:50',
  },
];

function StatusBadge({ status }: { status: AntreanStatus }) {
  const config = {
    Menunggu: {
      icon: Clock,
      className: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    Dipanggil: {
      icon: AlertCircle,
      className: 'bg-blue-50 text-primary border-blue-200',
    },
    Selesai: {
      icon: CheckCircle2,
      className: 'bg-green-50 text-green-600 border-green-200',
    },
  };

  const { icon: Icon, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export default function AntreanPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] px-5 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white leading-tight" data-testid="text-antrean-title">
              Antrean Berjalan
            </h1>
            <p className="text-sm text-blue-200 mt-0.5">Pantau antrean per poli</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              data-testid="button-notif-antrean"
              className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
              <span className="text-sm font-bold text-white">AW</span>
            </div>
          </div>
        </div>

        {/* Summary pill */}
        <div className="mt-4 flex gap-3">
          <div className="flex-1 bg-white/15 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-200" />
            <div>
              <p className="text-[10px] text-blue-200 font-medium">Total Antrean</p>
              <p className="text-base font-bold text-white">12</p>
            </div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-200" />
            <div>
              <p className="text-[10px] text-blue-200 font-medium">Sedang Dilayani</p>
              <p className="text-base font-bold text-white">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-5">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-foreground">Daftar Antrean</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
                Hari Ini
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {antreanData.map((item, i) => (
                <motion.div
                  key={item.noAntrean}
                  variants={itemVariants}
                  data-testid={`card-antrean-${i}`}
                  className="bg-white rounded-2xl shadow-sm border border-border/50 px-4 py-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {/* No antrean badge */}
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary leading-tight text-center">
                          {item.noAntrean}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground" data-testid={`antrean-nama-${i}`}>
                          {item.nama}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.poli}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Daftar {item.waktu}</span>
                    </div>
                    {item.status === 'Dipanggil' && (
                      <div className="flex items-center gap-3">
                        <button
                          className="text-xs text-muted-foreground font-semibold"
                          data-testid={`button-panggil-${i}`}
                        >
                          Panggil Ulang
                        </button>
                        <button
                          onClick={() => setLocation('/rme')}
                          className="text-xs bg-primary text-white px-3 py-1 rounded-full font-semibold"
                          data-testid={`button-periksa-${i}`}
                        >
                          Periksa
                        </button>
                      </div>
                    )}
                    {item.status === 'Menunggu' && (
                      <button
                        className="text-xs text-primary font-semibold"
                        data-testid={`button-panggil-${i}`}
                      >
                        Panggil
                      </button>
                    )}
                    {item.status === 'Selesai' && (
                      <span className="text-xs text-green-600 font-semibold">Sudah dilayani</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA: Tambah Antrean */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => setLocation('/pendaftaran')}
              data-testid="button-tambah-antrean"
              className="w-full py-3.5 rounded-full border-2 border-primary text-primary text-sm font-bold flex items-center justify-center gap-2 bg-white active:scale-[0.98] transition-all"
            >
              <ClipboardList className="w-4 h-4" />
              Daftarkan Pasien Baru
            </button>
          </motion.div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
