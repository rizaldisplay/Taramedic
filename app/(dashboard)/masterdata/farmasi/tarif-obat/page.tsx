'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import TarifObatPage from '@/features/masterdata/master-farmasi/tarif-obat/page';

export default function PemeriksaanPage() {
  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
        return <TarifObatPage />;
  };

  return (
    <>   
        {/* Area Konten Dinamis */}
        <div className="mt-4 md:mt-6">
          {renderContent()}
        </div>
    </>
  );
}