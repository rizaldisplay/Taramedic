'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { IncomingReferralSection } from '@/features/administrasi/rujukan-pasien/page';

export default function RujukanPasien() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Pemeriksaan Awal');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    return <IncomingReferralSection />;
  };

  return (
    <DashboardLayout>        
          {renderContent()}
    </DashboardLayout>
  );
}