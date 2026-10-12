'use client';
// Lokasi: src/features/masterdata/components/sdmk/sdmkHeader.tsx
import React from 'react';
import { History, List } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchHistory, openHistory } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';
import SdmkHistoryModal from '@/features/masterdata/components/sdmk/SdmkHistoryModal';

interface SDMKHeaderProps {
  title?: string;
  subtitle?: string;
  staffName?: string;
  historyButtonText?: string;
  auditButtonText?: string;
  /** Opsional: timpa perilaku bawaan (membuka modal riwayat/audit) */
  onHistoryClick?: () => void;
  onAuditClick?: () => void;
}

export const SDMKHeader: React.FC<SDMKHeaderProps> = ({
  title = 'Master SDMK',
  subtitle = 'Data SDMK',
  staffName = 'Kelola tenaga medis, tenaga kesehatan, dan tenaga pendukung di fasilitas.',
  historyButtonText = 'Riwayat SDMK',
  auditButtonText = 'Audit Trail',
  onHistoryClick,
  onAuditClick,
}) => {
  const dispatch = useAppDispatch();
  const buka = (kind: 'history' | 'audit') => { dispatch(openHistory(kind)); dispatch(fetchHistory(kind)); };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{title}</h2>
        <div className="flex flex-wrap items-center text-sm text-slate-600">
          <span className="font-semibold text-slate-800 mr-2">{subtitle}</span>
          <span className="mr-2">•</span>
          <span>{staffName}</span>
        </div>
      </div>
      <div className="flex space-x-3">
        <button type="button" onClick={onHistoryClick ?? (() => buka('history'))}
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <History className="w-4 h-4 mr-2" />{historyButtonText}
        </button>
        <button type="button" onClick={onAuditClick ?? (() => buka('audit'))}
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <List className="w-4 h-4 mr-2" />{auditButtonText}
        </button>
      </div>
      <SdmkHistoryModal />
    </div>
  );
};
