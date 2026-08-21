'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import RingkasanPage from '@/features/farmasi/ringkasan/page';
import ResepPage from '@/features/farmasi/resep/page';
import TopHeader from '@/features/farmasi/components/TopHeaderInfo';

export default function FarmasiPage() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Ringkasan');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'Ringkasan':
        return <RingkasanPage />
      case 'Resep':
        return <ResepPage />;
      case 'Verifikasi':
        return <div className="p-4">Tampilan Ringkasan (Sedang dikembangkan)</div>;
      case 'Dispensing':
        return <div className="p-4">Tampilan Ringkasan (Sedang dikembangkan)</div>;
      case 'Serah Obat':
        return <div className="p-4">Tampilan Ringkasan (Sedang dikembangkan)</div>;
      default:
        return <div className="p-4">Tampilan Ringkasan (Sedang dikembangkan)</div>;
    }
  };

  return (
    <DashboardLayout>
        {/* Kirim state dan setter-nya ke header sebagai props */}
        <TopHeader activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Area Konten Dinamis */}
        <div className="mt-4 md:mt-6">
          {renderContent()}
        </div>
    </DashboardLayout>
  );
}