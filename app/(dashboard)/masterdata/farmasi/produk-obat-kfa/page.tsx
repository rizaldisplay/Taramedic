'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProdukObatPage from '@/features/masterdata/master-farmasi/produk-obat/page';

export default function PemeriksaanPage() {
  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
        return <ProdukObatPage />;
  };

  return (
    <DashboardLayout>   
        {/* Area Konten Dinamis */}
        <div className="mt-4 md:mt-6">
          {renderContent()}
        </div>
    </DashboardLayout>
  );
}