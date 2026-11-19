'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
<<<<<<< HEAD
import ReturPemasok from '@/features/logistik-pengadaan/pembelian-pengadaan/retur-pemasok/page';
=======
import ReturPemasokPage from '@/features/logistik-pengadaan/pembelian-pengadaan/retur-pemasok/page';
>>>>>>> a73e591d0c8ca39182825f03702a9b9ca376bfa0

export default function KasirWorkspace() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Ringkasan');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
<<<<<<< HEAD
    return <ReturPemasok />;
=======
    return <ReturPemasokPage />;
>>>>>>> a73e591d0c8ca39182825f03702a9b9ca376bfa0
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