'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Ringkasan from '@/features/pemeriksaan/dokter/ringkasan/page';
import Anamnesis from '@/features/pemeriksaan/dokter/anamnesis/page';
import Pemeriksaan from '@/features/pemeriksaan/dokter/pemeriksaan/page';
import AsesmenDanDiagnosis from '@/features/pemeriksaan/dokter/assesmen-diagnosis/page';
import Penunjang from '@/features/pemeriksaan/dokter/penunjang/page';
import TindakanDanRencana from '@/features/pemeriksaan/dokter/tindakan-rencana/page';
import CPPT from '@/features/pemeriksaan/dokter/cppt/page';
import Resep from '@/features/pemeriksaan/dokter/resep/page';
import Dokumen from '@/features/pemeriksaan/dokter/dokumen/page';
import TopHeader from '@/features/pemeriksaan/dokter/components/TopHeaderInfo';

export default function PemeriksaanPage() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Pemeriksaan Awal');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'Anamnesis':
        return <Anamnesis/>
      case 'Pemeriksaan':
        return <Pemeriksaan/>;
      case 'Asesmen & Diagnosis':
        return <AsesmenDanDiagnosis/>;
      case 'Penunjang':
        return <Penunjang/>;
      case 'Tindakan & Rencana':
        return <TindakanDanRencana/>;
      case 'Resep':
        return <Resep/>;
      case 'CPPT':
        return <CPPT/>;
      case 'Dokumen':
        return <Dokumen/>
      default:
        return <Ringkasan/>;
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