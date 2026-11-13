'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import RingkasanPage from '@/features/farmasi/ringkasan/page';
import ResepPage from '@/features/farmasi/resep/page';
import VerifikasiPage from '@/features/farmasi/verifikasi/page';
import DispensingPage from '@/features/farmasi/dispensing/page';
import SerahObatPage from '@/features/farmasi/serah-obat/page';
import RiwayatPage from '@/features/farmasi/riwayat/page';
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
        return <VerifikasiPage />;
      case 'Dispensing':
        return <DispensingPage />;
      case 'Serah Obat':
        return <SerahObatPage />;
      default:
        return <RiwayatPage />;
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