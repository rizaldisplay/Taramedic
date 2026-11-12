// src/features/pendaftaran/components/PasienMenuAction.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  UserCheck,
  Eye,
  History,
  Pencil,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPatient, togglePatientPanel, fetchPatientDetail } from '../slices/patientSlice';
import type { PatientListItem } from '@/types/domain/pasien';

interface PatientActionMenuProps {
  patient: PatientListItem;
  onEdit?: (id: number) => void;
}

export const PatientActionMenu: React.FC<PatientActionMenuProps> = ({ patient, onEdit }) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Status antrean saat ini
  const { antreanSaatIni } = useAppSelector((state) => state.queue);
  const isAntreanHadir = String(antreanSaatIni?.statusAntrean ?? '') === 'Sedang Dilayani';

  // Close dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Opsi 1: Gunakan Pendaftaran -> Pilih Pasien & Buka Panel Kanan
  const handleSelectForRegistration = () => {
    dispatch(selectPatient(patient));
    dispatch(togglePatientPanel(true)); // Membuka panel kanan
    setIsOpen(false);
  };

  // Opsi 2 & 3: Detail Pasien / Riwayat Kunjungan -> Pilih Pasien & Buka Panel Kanan
  const handleOpenDetailPanel = () => {
    dispatch(selectPatient(patient));
    dispatch(togglePatientPanel(true)); // Membuka panel kanan
    setIsOpen(false);
  };

  // Opsi 4: Ubah Data Pasien -> Panggil Modal Edit
  const handleOpenEdit = () => {
    const patientIdNumber = typeof patient.id === 'string' ? parseInt(patient.id, 10) : patient.id;
    dispatch(fetchPatientDetail(patientIdNumber));
    if (onEdit) {
      onEdit(patientIdNumber);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors shadow-sm cursor-pointer"
      >
        Aksi
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white border border-slate-200 shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Opsi 1: Gunakan untuk Pendaftaran */}
          <button
            type="button"
            onClick={handleSelectForRegistration}
            disabled={!isAntreanHadir}
            className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors ${
              isAntreanHadir
                ? 'text-cyan-700 hover:bg-cyan-50 cursor-pointer'
                : 'text-slate-300 cursor-not-allowed bg-slate-50/50'
            }`}
          >
            <UserCheck
              className={`w-4 h-4 ${isAntreanHadir ? 'text-cyan-600' : 'text-slate-300'}`}
            />
            <div className="flex flex-col">
              <span>Gunakan Pendaftaran</span>
              {!isAntreanHadir && (
                <span className="text-[10px] text-slate-400 font-normal">
                  Antrean harus HADIR
                </span>
              )}
            </div>
          </button>

          <div className="my-1 border-t border-slate-100" />

          {/* Opsi 2: Detail Pasien (Membuka Panel Kanan) */}
          <button
            type="button"
            onClick={handleOpenDetailPanel}
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            <span>Detail Pasien</span>
          </button>

          {/* Opsi 3: Riwayat Kunjungan (Membuka Panel Kanan) */}
          <button
            type="button"
            onClick={handleOpenDetailPanel}
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>Riwayat Kunjungan</span>
          </button>

          {/* Opsi 4: Ubah Data Pasien (Membuka Modal Edit) */}
          <button
            type="button"
            onClick={handleOpenEdit}
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4 text-slate-400" />
            <span>Ubah Data Pasien</span>
          </button>
        </div>
      )}
    </div>
  );
};