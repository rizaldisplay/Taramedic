'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import TindakanKlinisPage from '@/features/pelayanan-klinis/tindakan-klinis/page';

export default function TindakanKlinisWorkspace() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Pemeriksaan Awal');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    return <TindakanKlinisPage />;
  };

  return (
    <>        
      {renderContent()}
    </>
  );
}