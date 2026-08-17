'use client';

import { useState } from 'react';
import DashboardDokter from '@/features/dashboard/DashboardDokter';
import DashboaardPerawat from '@/features/dashboard/DashboardPerawat';
import DashboardFarmasi from '@/features/dashboard/DashboardFarmasi';
import DashboardAdmin from '@/features/dashboard/DashboardAdmin';
import DashboardLayout from '../layout';

export default function AntreanPoliDashboard() {
  const [activeTab, setActiveTab] = useState('Semua');

  return (
    <DashboardLayout>
      <DashboardAdmin />
    </DashboardLayout>
  );
}