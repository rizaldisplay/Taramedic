import React from 'react';
import { AntreanHeader } from '@/features/antrean-publik/AntreanHeader';
import { MetricCards } from '@/features/antrean-publik/MetricCardFarmasi';
import { QueueTable } from '@/features/antrean-publik/QueueTabelFarmasi';
import { ActionPanel } from '@/features/antrean-publik/ActionPanelFarmasi';

export default function AntreanPoliPage() {
  return (
    <>
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
    </>
  );
}