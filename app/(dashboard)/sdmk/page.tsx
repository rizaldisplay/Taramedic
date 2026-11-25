'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import SDMK from '@/features/sdmk/data-sdmk/page';
import TopHeader from '@/features/pemeriksaan/perawat/components/TopHeaderInfo';

export default function PemeriksaanPage() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Pemeriksaan Awal');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    return <SDMK />;
  };

  return (
    <>        
      {renderContent()}
    </>
  );
}