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
    if (currentPath.includes('/farmasi')) {
      return { moduleName: 'Dashboard', pageName: 'Farmasi' };
    }
    if (currentPath.includes('/emr/pasien')) {
      return { moduleName: 'EMR', pageName: 'Data Pasien' };
    }
    if (currentPath.includes('/pos/kasir')) {
      return { moduleName: 'POS UMKM', pageName: 'Kasir & Transaksi' };
    }
    if (currentPath.includes('/pos/inventaris')) {
      return { moduleName: 'ERP', pageName: 'Manajemen Stok' };
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