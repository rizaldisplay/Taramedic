'use client'; // Jangan lupa tambahkan ini karena kita menggunakan useState

import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import RincianBilling from '@/features/kasir/rincian-billing/page';
import Ringkasan from '@/features/kasir/ringkasan/page';
import Penjamin from '@/features/kasir/penjamin/page';
import RiwayatTransaksi from '@/features/kasir/riwayat-transaksi/page';
import Pembayaran from '@/features/kasir/pembayaran/page';
import TopHeader from '@/features/kasir/components/TopHeaderInfo';

export default function PemeriksaanPage() {
  // Pindahkan state ke sini. Set default tab yang terbuka pertama kali
  const [activeTab, setActiveTab] = useState('Ringkasan');

  // Fungsi untuk me-render komponen berdasarkan tab yang aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'Ringkasan':
        return <Ringkasan />;
      case 'Rincian Billing':
        return <RincianBilling />;
      case 'Penjamin':
        return <Penjamin/>;
      case 'Pembayaran':
        return <Pembayaran />;
      case 'Riwayat Transaksi':
        return <RiwayatTransaksi/>;
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