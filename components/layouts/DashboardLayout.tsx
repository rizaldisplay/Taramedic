'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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

        {/* Area Konten Dinamis */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}