'use client';

import React, { useState } from 'react';
import PatientSearch from './DataPasienNew';
import MonitoringKunjungan from './MonitoringKunjungan';

export default function PatientSectionContainer() {
  const [activeTab, setActiveTab] = useState<'data' | 'monitoring'>('data');

  return (
    <div className="w-full h-full">
      {activeTab === 'data' ? (
        <PatientSearch activeTab={activeTab} onTabChange={setActiveTab} />
      ) : (
        <MonitoringKunjungan activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}