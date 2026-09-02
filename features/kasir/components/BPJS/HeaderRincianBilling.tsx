"use client";

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

type TabType = 'all' | 'service' | 'pharmacy';

interface BillingBreakdownHeaderProps {
  totalCount?: number;
  serviceCount?: number;
  pharmacyCount?: number;
  onFilterChange?: (filter: TabType) => void;
  onToggleGroup?: () => void;
}

export default function BillingBreakdownHeader({
  totalCount = 6,
  serviceCount = 3,
  pharmacyCount = 3,
  onFilterChange,
  onToggleGroup,
}: BillingBreakdownHeaderProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Konfigurasi Tab dideklarasikan secara modular
  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'all', label: 'Semua', count: totalCount },
    { id: 'service', label: 'Layanan', count: serviceCount },
    { id: 'pharmacy', label: 'Farmasi', count: pharmacyCount },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    if (onFilterChange) onFilterChange(tabId);
  };

  return (
    <div className="w-full bg-white font-sans space-y-5">
      
      {/* Title & Description */}
      <div>
        <h3 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase">
          RINCIAN BILLING
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Breakdown tagihan berdasarkan layanan yang diberikan.
        </p>
      </div>

      {/* Filter Tabs & Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-200">
        
        {/* Left Side: Filter Tabs Ter-map Otomatis */}
        <div className="flex items-center gap-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`group flex items-center gap-2 pb-3 text-[13px] font-medium transition-all border-b-2 -mb-[1px] ${
                  isActive
                    ? 'border-cyan-600 text-cyan-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-600'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Group Action */}
        <button
          onClick={onToggleGroup}
          className="group flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-cyan-600 transition-colors pb-3"
        >
          <SlidersHorizontal className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Lihat Per Group</span>
        </button>

      </div>
    </div>
  );
}