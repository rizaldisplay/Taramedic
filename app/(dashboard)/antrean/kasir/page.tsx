import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AntreanHeader } from '@/features/antrean-publik/AntreanHeader';
import { MetricCards } from '@/features/antrean-publik/MetricCards';
import { QueueTable } from '@/features/antrean-publik/QueueTabelKasir';
import { ActionPanel } from '@/features/antrean-publik/ActionPanelKasir';

export default function AntreanPoliPage() {
  return (
    <DashboardLayout>
      <AntreanHeader 
        title="Antrean Kasir"
        subtitle="Kasir Rawat Jalan"
        staffName="Petugas Kasir: Budi Santoso"
      />
      <MetricCards />
      
      <div className="flex gap-6 items-start">
        <QueueTable />
        <ActionPanel />
      </div>
    </DashboardLayout>
  );
}