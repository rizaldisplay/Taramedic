import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AntreanHeader } from '@/features/antrean/AntreanHeader';
import { MetricCards } from '@/features/antrean/MetricCards';
import { QueueTable } from '@/features/antrean/QueueTabelKasir';
import { ActionPanel } from '@/features/antrean/ActionPanelKasir';

export default function AntreanPoliPage() {
  return (
    <DashboardLayout>
      <AntreanHeader />
      <MetricCards />
      
      <div className="flex gap-6 items-start">
        <QueueTable />
        <ActionPanel />
      </div>
    </DashboardLayout>
  );
}