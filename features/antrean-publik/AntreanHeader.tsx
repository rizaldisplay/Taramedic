'use client';

import React from 'react';
import { ChevronDown, History, List } from 'lucide-react';

interface AntreanHeaderProps {
  title?: string;
  subtitle?: string;
  staffName?: string;
  historyButtonText?: string;
  auditButtonText?: string;
  onHistoryClick?: () => void;
  onAuditClick?: () => void;
}

export const AntreanHeader: React.FC<AntreanHeaderProps> = ({
  title = "Antrean Farmasi",
  subtitle = "Farmasi Rawat Jalan",
  staffName = "Apoteker: Siti Rahma, A.Md.Kep",
  historyButtonText = "Riwayat Antrean",
  auditButtonText = "Audit Trail",
  onHistoryClick,
  onAuditClick,
}) => {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{title}</h2>
        <div className="flex items-center text-sm text-slate-600">
          <span className="font-semibold text-slate-800 mr-2">{subtitle}</span>
          <span className="mr-2">•</span>
          <span>{staffName}</span>
          <ChevronDown className="w-4 h-4 ml-1 text-slate-400" cursor="pointer" />
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button 
          onClick={onHistoryClick}
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <History className="w-4 h-4 mr-2" />
          {historyButtonText}
        </button>
        <button 
          onClick={onAuditClick}
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <List className="w-4 h-4 mr-2" />
          {auditButtonText}
        </button>
      </div>
    </div>
  );
};