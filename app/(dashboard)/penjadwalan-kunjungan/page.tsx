'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PenjadwalanPage from '@/features/administrasi/penjadwalan-kunjungan/page';

export default function PendaftaranRajal() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Pemeriksaan Awal');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    return <PenjadwalanPage />;
  };

  return (
    <DashboardLayout>        
          {renderContent()}
    </DashboardLayout>
  );
}