'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PemeriksaanAwal from '@/features/pemeriksaan/perawat/pemeriksaan-awal/page';
import RisikoSkriningPage from '@/features/pemeriksaan/perawat/risiko-skrining/page';
import CPPTPage from '@/features/pemeriksaan/perawat/cppt/page';
import DokumenPage from '@/features/pemeriksaan/perawat/components/Dokumen';
import TopHeader from '@/features/pemeriksaan/perawat/components/TopHeaderInfo';

export default function PemeriksaanPage() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Pemeriksaan Awal');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'Ringkasan':
        return <div className="p-4">Tampilan Ringkasan (Sedang dikembangkan)</div>;
      case 'Pemeriksaan Awal':
        return <PemeriksaanAwal />;
      case 'Risiko / Skrining':
        return <RisikoSkriningPage />;
      case 'CPPT':
        return <CPPTPage />;
      case 'Dokumen':
        return <DokumenPage />;
      default:
        return <PemeriksaanAwal />;
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