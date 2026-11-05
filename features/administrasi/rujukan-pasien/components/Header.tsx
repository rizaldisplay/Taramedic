'use client';
// Lokasi: src/features/masterdata/components/sdmk/sdmkHeader.tsx
import React from 'react';
import { History, List, RefreshCcw } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchHistory, openHistory } from '@/features/masterdata/master-sdmk/slices/sdmkSlice';

// Modal sebaiknya tidak di-render di dalam Header untuk menghindari re-render yang tidak perlu.
// Pindahkan <SdmkHistoryModal /> ke tingkat halaman (page level) atau root layout.
// import SdmkHistoryModal from '@/features/masterdata/components/sdmk/SdmkHistoryModal';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    description?: string; // Mengganti 'staffName' agar lebih semantik sesuai default value-nya
    historyButtonText?: string;
    auditButtonText?: string;
    onHistoryClick?: () => void;
    onAuditClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'Pendaftaran Rajal', // Disesuaikan dengan konteks file SDMK
    subtitle = '',
    description = 'Kelola pendaftaran pasien untuk kunjungan rawat jalan.',
    historyButtonText = 'Riwayat Pendaftaran',
    auditButtonText = 'Muat Ulang',
    onHistoryClick,
    onAuditClick,
}) => {
    const dispatch = useAppDispatch();

    // Handler dengan fallback: gunakan props onClick jika dilempar dari parent, 
    // jika tidak, gunakan dispatch Redux bawaan.
    const handleHistoryClick = () => {
        if (onHistoryClick) return onHistoryClick();
        dispatch(openHistory('history'));
        dispatch(fetchHistory('history'));
    };

    const handleAuditClick = () => {
        if (onAuditClick) return onAuditClick();
        dispatch(openHistory('audit'));
        dispatch(fetchHistory('audit'));
    };

    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 p-4 md:p-6 lg:p-8 bg-white border-b border-slate-200 shadow-sm rounded-t-2xl">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{title}</h2>
                <div className="flex flex-wrap items-center text-sm text-slate-600">
                    <span className="font-semibold text-slate-800 mr-2">{subtitle}</span>
                    <span className="mr-2">•</span>
                    <span>{description}</span>
                </div>
            </div>

            {/* Tombol Aksi yang sebelumnya hilang kini diimplementasikan */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleAuditClick}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200"
                >
                    <RefreshCcw className="w-4 h-4" />
                    {auditButtonText}
                </button>
            </div>
        </div>
    );
};