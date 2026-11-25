import React from 'react';
import { AntreanHeader } from '@/features/antrean-publik/AntreanHeader';
import { MetricCards } from '@/features/antrean-publik/MetricCards';
import { QueueTable } from '@/features/antrean-publik/QueueTabelKasir';
import { ActionPanel } from '@/features/antrean-publik/ActionPanelKasir';

export default function AntreanPoliPage() {
  return (
    <>
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
    </>
  );
}