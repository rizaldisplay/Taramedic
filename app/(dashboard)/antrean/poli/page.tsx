import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AntreanHeader } from '@/features/antrean/AntreanHeader';
import { MetricCards } from '@/features/antrean/MetricCards';
import { QueueTable } from '@/features/antrean/QueueTable';
import { ActionPanel } from '@/features/antrean/ActionPanel';

export default function AntreanPoliPage() {
  return (
    <DashboardLayout>
      <AntreanHeader 
        title="Antrean Poli"
        subtitle="Poli Rawat Jalan"
        staffName="Dokter: Dr. John Doe, Sp.M"
      />
      <MetricCards />
      
      <div className="flex gap-6 items-start">
        <QueueTable />
        <ActionPanel />
      </div>
    </DashboardLayout>
  );
}