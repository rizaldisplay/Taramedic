'use client';

import React from 'react';
import {
  CalendarX,
  UserCheck,
  Clock,
  Building2,
  Stethoscope,
  MapPin,
  CreditCard,
  Activity,
  FileText,
} from 'lucide-react';

export interface VisitInfoData {
  queueNumber: string;
  registrationTime: string;
  polyclinic: string;
  doctor: string;
  location: string;
  guarantor: string; // Penjamin (e.g., BPJS Kesehatan)
  lastStatus: string;
  registrationNotes: string;
}

interface VisitInfoCardProps {
  data?: VisitInfoData;
}

const DEFAULT_VISIT_DATA: VisitInfoData = {
  queueNumber: 'A013',
  registrationTime: '08:05 WIB',
  polyclinic: 'Poli Anak',
  doctor: 'dr. Bima, Sp.A',
  location: 'Loket 1',
  guarantor: 'BPJS Kesehatan',
  lastStatus: 'Pemeriksaan Perawat',
  registrationNotes: 'Pasien datang sendiri',
};

export default function InformasiKunjungan({
  data = DEFAULT_VISIT_DATA,
}: VisitInfoCardProps) {
  return (
    <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm p-5 font-sans">
      {/* Header Panel */}
      <div className="flex items-center gap-2 mb-4">
        <CalendarX className="w-4 h-4 text-cyan-600" />
        <h2 className="text-xs font-bold tracking-wider text-cyan-600 uppercase">
          Informasi Kunjungan
        </h2>
      </div>

      {/* List Informasi Kunjungan */}
      <div className="flex flex-col gap-3.5 text-xs text-gray-700">
        
        {/* No. Antrean */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-gray-500">
            <UserCheck className="w-4 h-4 text-gray-400 shrink-0" />
            <span>No. Antrean</span>
          </div>
          <span className="font-bold text-gray-900">{data.queueNumber}</span>
        </div>

        {/* Waktu Daftar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-gray-500">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Waktu Daftar</span>
          </div>
          <span className="font-semibold text-gray-900">
            {data.registrationTime}
          </span>
        </div>

        {/* Poli */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-gray-500">
            <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Poli</span>
          </div>
          <span className="font-bold text-gray-900">{data.polyclinic}</span>
        </div>

        {/* Dokter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-gray-500">
            <Stethoscope className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Dokter</span>
          </div>
          <span className="font-bold text-gray-900">{data.doctor}</span>
        </div>

        {/* Lokasi */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-gray-500">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Lokasi</span>
          </div>
          <span className="font-semibold text-gray-900">{data.location}</span>
        </div>

        {/* Penjamin */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-gray-500">
            <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Penjamin</span>
          </div>
          <span className="font-bold text-gray-900">{data.guarantor}</span>
        </div>

        {/* Status Terakhir */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2.5 text-gray-500">
            <Activity className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Status Terakhir</span>
          </div>
          <span className="px-2.5 py-1 bg-cyan-50 text-cyan-600 font-semibold text-[11px] rounded-md border border-cyan-100">
            {data.lastStatus}
          </span>
        </div>

        {/* Catatan Pendaftaran */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-gray-500">
            <FileText className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Catatan Pendaftaran</span>
          </div>
          <span className="font-semibold text-gray-900">
            {data.registrationNotes}
          </span>
        </div>

      </div>
    </div>
  );
}