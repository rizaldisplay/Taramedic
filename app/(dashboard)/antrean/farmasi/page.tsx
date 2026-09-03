import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AntreanHeader } from '@/features/antrean/AntreanHeader';
import { MetricCards } from '@/features/antrean/MetricCardFarmasi';
import { QueueTable } from '@/features/antrean/QueueTabelFarmasi';
import { ActionPanel } from '@/features/antrean/ActionPanelFarmasi';

export default function AntreanPoliPage() {
  return (
    <DashboardLayout>
      <AntreanHeader 
        title="Antrean Farmasi"
        subtitle="Farmasi Rawat Jalan"
        staffName="Apoteker: Siti Nurhaliza, S.Farm"
      />
      <MetricCards />

      <div className="flex gap-6 items-start">
        <QueueTable />
        <ActionPanel />
      </div>
    </DashboardLayout>
  );
}