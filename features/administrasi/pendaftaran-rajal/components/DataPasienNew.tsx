/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  UserPlus,
  Activity,
  CheckCircle2,
  User,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  FileText,
  History,
  UserCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectPatient,
  setSearchQuery as setReduxSearchQuery,
} from "../slices/patientSlice";
import RiwayatKunjunganModal, {
  PatientVisitModalData,
} from "./RiwayatKunjunganModal";

export interface Patient {
  id: string;
  namaLengkap: string;
  nomorRM: string;
  nik: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  usia: number;
  usiaString?: string;
  tanggalLahir?: string;
  nomorHP: string;
  penjaminLabel: string;
  kunjunganTerakhir?: string;
  isActive: boolean;
  inisial?: string;
  alamatRingkas?: string;
  satuSehat?: {
    statusTerhubung: boolean;
    ihsNumber?: string;
    lastSyncAt?: string;
  };
}

interface PatientSearchProps {
  activeTab: "data" | "monitoring";
  onTabChange: (tab: "data" | "monitoring") => void;
}

export default function PatientSearch({
  activeTab,
  onTabChange,
}: PatientSearchProps) {
  const dispatch = useAppDispatch();
  const selectedPatient = useAppSelector(
    (state) => state.patient.selectedPatient,
  );
  const reduxSearchQuery = useAppSelector((state) => state.patient.searchQuery);

  const [statusFilter, setStatusFilter] = useState<
    "Semua" | "Aktif" | "Tidak Aktif"
  >("Semua");
  const [genderFilter, setGenderFilter] = useState<
    "Semua" | "Laki-laki" | "Perempuan"
  >("Semua");
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [selectedHistoryPatient, setSelectedHistoryPatient] =
    useState<PatientVisitModalData | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const patients: Patient[] = [
    {
      id: "1",
      namaLengkap: "Neneng nihayatul aini",
      nomorRM: "RM00000003",
      nik: "3209306312910002",
      jenisKelamin: "Perempuan",
      usia: 34,
      usiaString: "34 th",
      tanggalLahir: "1991-12-23",
      nomorHP: "081314390562",
      penjaminLabel: "Umum",
      kunjunganTerakhir: "Belum ada kunjungan",
      isActive: true,
      inisial: "Nn",
      alamatRingkas:
        "Jalan salam bahagia III NO 181 A KAVLING AGRARIA BEKASI SELATAN",
      satuSehat: {
        statusTerhubung: true,
        ihsNumber: "P000293847",
        lastSyncAt: "10 Nov 2026",
      },
    },
    {
      id: "2",
      namaLengkap: "Suparna",
      nomorRM: "RM00000002",
      nik: "Tanpa NIK",
      jenisKelamin: "Laki-laki",
      usia: 36,
      usiaString: "36 th",
      tanggalLahir: "1990-05-14",
      nomorHP: "081511210080",
      penjaminLabel: "Umum",
      kunjunganTerakhir: "09 Nov 2026",
      isActive: true,
      inisial: "Sp",
      alamatRingkas: "Jl. Melati No. 45, Malang",
      satuSehat: {
        statusTerhubung: false,
      },
    },
    {
      id: "3",
      namaLengkap: "Suparno",
      nomorRM: "RM00000001",
      nik: "1351502011111496",
      jenisKelamin: "Laki-laki",
      usia: 38,
      usiaString: "38 th",
      tanggalLahir: "1988-08-20",
      nomorHP: "081511210060",
      penjaminLabel: "Umum",
      kunjunganTerakhir: "07 Nov 2026",
      isActive: true,
      inisial: "Sp",
      alamatRingkas: "Jl. Mawar No. 12, Malang",
      satuSehat: {
        statusTerhubung: true,
        ihsNumber: "P000102938",
        lastSyncAt: "07 Nov 2026",
      },
    },
  ];

  const filteredPatients = patients.filter((patient) => {
    const query = reduxSearchQuery.toLowerCase();
    const matchesSearch =
      patient.namaLengkap.toLowerCase().includes(query) ||
      patient.nomorRM.toLowerCase().includes(query) ||
      patient.nik.includes(query) ||
      patient.nomorHP.includes(query);

    const matchesStatus =
      statusFilter === "Semua"
        ? true
        : statusFilter === "Aktif"
          ? patient.isActive
          : !patient.isActive;

    const matchesGender =
      genderFilter === "Semua" ? true : patient.jenisKelamin === genderFilter;

    return matchesSearch && matchesStatus && matchesGender;
  });

  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.isActive).length;
  const newPatients = patients.filter(
    (p) => p.kunjunganTerakhir === "Belum ada kunjungan",
  ).length;
  const inactivePatients = totalPatients - activePatients;

  const handleSelectPatient = (patient: Patient) => {
    dispatch(selectPatient(patient as any));
  };

  const handleOpenHistory = (patient: any) => {
    setSelectedHistoryPatient({
      id: patient.id,
      namaLengkap: patient.namaLengkap,
      nomorRM: patient.nomorRM,
      history: [], // Atau lempar array data riwayat kunjungan dari backend
    });
    setIsHistoryOpen(true);
    setOpenActionId(null);
  };

  return (
    <div className="w-full h-full p-6 font-sans text-slate-700 flex flex-col bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-cyan-900">Data Pasien</h1>
            <p className="text-xs text-slate-500">
              Kelola identitas dan informasi pasien klinik.
            </p>
          </div>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-emerald-50 border border-teal-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer">
          <UserPlus className="w-4 h-4" /> Daftar Baru
        </button>
      </div>

      {/* Tabs Navigation & Notice */}
      <div className="border-b border-slate-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex gap-6">
          <button
            onClick={() => onTabChange("data")}
            className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "data"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Users className="w-4 h-4" /> Data Pasien
          </button>
          <button
            onClick={() => onTabChange("monitoring")}
            className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "monitoring"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Activity className="w-4 h-4" /> Monitoring Pendaftaran & Kunjungan
          </button>
        </div>
        <div className="flex items-center gap-1.5 pb-3 text-xs text-slate-500">
          <ShieldAlert className="w-4 h-4 text-slate-400" />
          <span>Transaksi baru tersedia setelah antrean</span>
          <span className="font-bold text-cyan-700">HADIR</span>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-cyan-50 text-cyan-500 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Pasien</p>
            <p className="text-2xl font-bold text-slate-800">{totalPatients}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pasien Aktif</p>
            <p className="text-2xl font-bold text-slate-800">
              {activePatients}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-cyan-50 text-cyan-500 rounded-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pasien Baru</p>
            <p className="text-2xl font-bold text-slate-800">{newPatients}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-slate-100 text-slate-400 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Pasien Tidak Aktif
            </p>
            <p className="text-2xl font-bold text-slate-800">
              {inactivePatients}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, No. RM, NIK, atau telepon"
            value={reduxSearchQuery}
            onChange={(e) => dispatch(setReduxSearchQuery(e.target.value))}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="appearance-none flex items-center gap-2 px-3 py-2 pr-8 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 outline-none cursor-pointer"
            >
              <option value="Semua">Semua status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="appearance-none flex items-center gap-2 px-3 py-2 pr-8 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 outline-none cursor-pointer"
            >
              <option value="Semua">Semua gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
            <span>Semua usia</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
            <span>Terbaru</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 py-2 border-b border-slate-200 mb-4 gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            <strong className="text-slate-700">
              {filteredPatients.length}
            </strong>{" "}
            pasien ditemukan
          </span>
        </div>
        <div>Pilih pasien untuk melihat detail atau memulai pendaftaran.</div>
      </div>

      {/* Tabel Data Pasien */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto flex-1 flex flex-col justify-between">
        <table className="w-full text-left text-xs text-slate-600 border-collapse min-w-[800px]">
          <thead className="bg-slate-50 uppercase text-[11px] font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                Identitas Pasien
              </th>
              <th scope="col" className="px-4 py-3.5">
                Jenis Kelamin / Usia
              </th>
              <th scope="col" className="px-4 py-3.5">
                Telepon
              </th>
              <th scope="col" className="px-4 py-3.5">
                Penjamin
              </th>
              <th scope="col" className="px-4 py-3.5">
                Kunjungan Terakhir
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.map((patient) => {
              const isSelected = selectedPatient?.id?.toString() === patient.id;
              return (
                <tr
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`transition-colors cursor-pointer ${
                    isSelected ? "bg-cyan-50/60" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-full shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {patient.namaLengkap}
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          {patient.nomorRM} • NIK {patient.nik}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-slate-700 font-medium">
                      {patient.jenisKelamin}
                    </p>
                    <p className="text-slate-400">
                      {patient.usiaString || `${patient.usia} th`}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-700 font-medium">
                    {patient.nomorHP}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded text-[11px] font-medium">
                      {patient.penjaminLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-600">
                    {patient.kunjunganTerakhir === "Belum ada kunjungan" ? (
                      <span className="text-amber-800/80">
                        {patient.kunjunganTerakhir}
                      </span>
                    ) : (
                      <div>
                        <p className="text-slate-800 font-semibold">
                          {patient.kunjunganTerakhir}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Riwayat tercatat
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                        patient.isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          patient.isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      ></span>
                      {patient.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-4 text-center relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setOpenActionId(
                          openActionId === patient.id ? null : patient.id,
                        )
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Aksi
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {openActionId === patient.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-4 top-12 z-30 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 text-left text-xs font-medium animate-in fade-in zoom-in-95 duration-150"
                      >
                        <button
                          onClick={() => {
                            handleSelectPatient(patient);
                            setOpenActionId(null);
                          }}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          Detail Pasien
                        </button>
                        <button
                          onClick={() => {
                            handleSelectPatient(patient);
                            setOpenActionId(null);
                          }}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          <History className="w-4 h-4 text-slate-400" />
                          Riwayat Kunjungan
                        </button>
                        <div className="my-1 border-t border-slate-100"></div>
                        <button
                          onClick={() => {
                            handleOpenHistory(patient);
                            // setOpenActionId(null);
                          }}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-cyan-50 text-cyan-700 font-semibold cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4 text-cyan-600" />
                          Daftarkan Kunjungan
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            <RiwayatKunjunganModal
              isOpen={true}
              onClose={() => setIsHistoryOpen(false)}
              patient={selectedHistoryPatient}
            />
          </tbody>
        </table>

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-200 gap-3 text-xs text-slate-500">
          <div>
            Menampilkan{" "}
            <strong className="text-slate-700">
              1–{filteredPatients.length}
            </strong>{" "}
            dari{" "}
            <strong className="text-slate-700">
              {filteredPatients.length}
            </strong>{" "}
            data
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Baris</span>
              <button className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 cursor-pointer">
                10
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="p-1 border border-slate-200 rounded text-slate-300 cursor-not-allowed bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-slate-700">1 / 1</span>
              <button
                disabled
                className="p-1 border border-slate-200 rounded text-slate-300 cursor-not-allowed bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
