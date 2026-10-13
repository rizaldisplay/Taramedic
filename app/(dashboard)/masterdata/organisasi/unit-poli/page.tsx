'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import DashboardLayout from '@/components/layouts/DashboardLayout';
import UnitPoli from '@/features/masterdata/master-organisasi/unit-poli/page'

export default function PemeriksaanPage() {
  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
        return <UnitPoli/>;
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