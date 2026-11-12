/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import {
  History,
  X,
  FileClock,
  Calendar,
  Stethoscope,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export interface PatientVisitHistoryItem {
  id: string;
  nomorKunjungan: string;
  tanggalKunjungan: string;
  waktuKunjungan: string;
  poliTujuan: string;
  dokter: string;
  penjamin: string;
  status: 'Selesai' | 'Sedang Dilayani' | 'Menunggu' | 'Batal';
}

export interface PatientVisitModalData {
  id: string | number;
  namaLengkap: string;
  nomorRM: string;
  history?: PatientVisitHistoryItem[];
}

interface RiwayatKunjunganModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientVisitModalData | null;
}

export default function RiwayatKunjunganModal({
  isOpen,
  onClose,
  patient,
}: RiwayatKunjunganModalProps) {
  if (!isOpen || !patient) return null;

  const historyList = patient.history ?? [];
  const hasHistory = historyList.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      {/* Container Modal */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100/60 flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-cyan-600 tracking-wider uppercase">
                Riwayat Pasien
              </p>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">
                {patient.namaLengkap}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                {patient.nomorRM}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {!hasHistory ? (
            /* Empty State (Sesuai Gambar) */
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-cyan-600 flex items-center justify-center mb-4 shadow-2xs">
                <FileClock className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">
                Belum ada riwayat kunjungan
              </h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Belum ditemukan kunjungan tercatat untuk pasien ini.
              </p>
            </div>
          ) : (
            /* Populated State (List Timeline Kunjungan) */
            <div className="space-y-3">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs font-bold text-slate-800">
                      {item.nomorKunjungan}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : item.status === 'Sedang Dilayani'
                          ? 'bg-cyan-50 text-cyan-600 border border-cyan-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.tanggalKunjungan} • {item.waktuKunjungan}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{item.poliTujuan}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 col-span-2">
                      <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.dokter}</span>
                      <span className="ml-auto text-[11px] px-2 py-0.5 bg-slate-200/70 text-slate-600 rounded-md font-medium">
                        {item.penjamin}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}