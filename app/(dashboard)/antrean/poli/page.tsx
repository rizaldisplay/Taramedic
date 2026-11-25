import React from 'react';
import { AntreanHeader } from '@/features/antrean-publik/AntreanHeader';
import { MetricCards } from '@/features/antrean-publik/MetricCards';
import { QueueTable } from '@/features/antrean-publik/QueueTable';
import { ActionPanel } from '@/features/antrean-publik/ActionPanel';

export default function AntreanPoliPage() {
  return (
    <>
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
    </>
  );
}