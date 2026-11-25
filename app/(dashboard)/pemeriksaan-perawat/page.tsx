'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import PemeriksaanPerawatPage from '@/features/pelayanan-klinis/pemeriksaan-perawat/page';

export default function PemeriksaanPerawatWorkspace() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Ringkasan');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    return <PemeriksaanPerawatPage />;
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