'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DivisiJabatanPage from '@/features/sdmk/divisi-jabatan/page';

export default function PemeriksaanPage() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Pemeriksaan Awal');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    return <DivisiJabatanPage />;
  };

  return (
    <DashboardLayout>        
          {renderContent()}
    </DashboardLayout>
  );
}