'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PendaftaranPage from '@/features/administrasi/pendaftaran-rajal/page';

export default function PendaftaranRajal() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Pemeriksaan Awal');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    return <PendaftaranPage />;
  };

  return (
    <DashboardLayout>        
          {renderContent()}
    </DashboardLayout>
  );
}