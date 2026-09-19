'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { hideNotification } from '@/features/notification/notificationSlice';
import Notification from '@/components/ui/Notification'; // Sesuaikan path

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Fungsi untuk memetakan URL path menjadi Nama Modul dan Nama Halaman
  const getPageInfo = (path: string) => {
    // Pastikan path tidak null
    const currentPath = path || '/';

    // Contoh mapping URL ke teks Topbar (Bisa kamu sesuaikan dengan routing aslimu)
    if (currentPath.includes('/pendaftaran')) {
      return { moduleName: 'Dashboard', pageName: 'Pendaftaran' };
    }

    if (currentPath.includes('/antrean/poli')) {
      return { moduleName: 'Antrean', pageName: 'Poli' };
    }

    if (currentPath.includes('/antrean/farmasi')) {
      return { moduleName: 'Antrean', pageName: 'Farmasi' };
    }

    if (currentPath.includes('/antrean/kasir')) {
      return { moduleName: 'Antrean', pageName: 'Kasir' };
    }

    if (currentPath.includes('/emr/perawat')) {
      return { moduleName: 'EMR', pageName: 'Perawat' };
    }
    if (currentPath.includes('/emr/dokter')) {
      return { moduleName: 'EMR', pageName: 'Dokter' };
    }

    if (currentPath.includes('/kasir')) {
      return { moduleName: 'Dashboard', pageName: 'Kasir & Transaksi' };
    }

    if (currentPath.includes('/settings')) {
      return { moduleName: 'Dashboard', pageName: 'Settings' };
    }

    if (currentPath.includes('/laporan')) {
      return { moduleName: 'Dashboard', pageName: 'Laporan' };
    }

    if (currentPath.includes('/masterdata/sdmk')) {
      return { moduleName: 'Master Data', pageName: 'SDMK' };
    }

    // Default halaman utama atau path yang belum terdaftar
    return { moduleName: 'Dashboard', pageName: 'Overview' };
  };

  const { moduleName, pageName } = getPageInfo(pathname);
  const notif = useSelector((state: RootState) => state.notification);

  useEffect(() => {
    // Jika notifikasi sedang tampil, jalankan timer
    if (notif.show) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 3000); // 3000 milidetik = 3 detik

      // Fungsi cleanup: membatalkan timer jika komponen ditutup manual
      // atau jika ada notifikasi baru yang muncul sebelum 3 detik habis
      return () => clearTimeout(timer);
    }
  }, [notif.show, dispatch]); // Ter-trigger setiap kali status notif.show berubah

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar dengan sistem Drawer untuk Mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar yang menerima props dinamis */}
        <Topbar 
          onOpenSidebar={() => setSidebarOpen(true)} 
          moduleName={moduleName}
          pageName={pageName}
        />

      {/* Toast Notification ditaruh di sini agar selalu ada (fixed) di atas layar */}
        {notif.show && (
          <div className="fixed top-20 right-5 z-50">
            <Notification 
              title={notif.title}
              description={notif.message}
              type={notif.type}
              onClose={() => dispatch(hideNotification())}
            />
          </div>
        )}

        {/* Area Konten Dinamis */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}