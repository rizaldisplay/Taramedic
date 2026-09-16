"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Info,
  Plus,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  searchPatients,
  setSearchQuery,
  selectPatient,
  setPage,
  setPerPage,
} from "../slices/patientSlice"; // Sesuaikan path slice

// --- Types ---
interface PatientData {
  id: string;
  noRm: string;
  name: string;
  genderAge: string;
  nik: string;
  insurance: "BPJS" | "UMUM";
  lastVisitDate: string;
  lastVisitPoli: string;
  satusehatStatus: "Terhubung" | "Belum Terhubung";
  isActive?: boolean;
}

// --- Mock Data ---
const mockPatients: PatientData[] = [
  {
    id: "1",
    noRm: "RM000036",
    name: "Rizka Amalia",
    genderAge: "P / 8 th",
    nik: "3271••••••••9012",
    insurance: "BPJS",
    lastVisitDate: "11-08-2026",
    lastVisitPoli: "Poli Anak",
    satusehatStatus: "Terhubung",
    isActive: true,
  },
  {
    id: "2",
    noRm: "RM000112",
    name: "Raka Pratama",
    genderAge: "L / 7 th",
    nik: "3271••••••••9012",
    insurance: "BPJS",
    lastVisitDate: "03-08-2026",
    lastVisitPoli: "Poli Anak",
    satusehatStatus: "Terhubung",
  },
  {
    id: "3",
    noRm: "RM000205",
    name: "Rizka A.",
    genderAge: "P / 7 th",
    nik: "3271••••••••9012",
    insurance: "UMUM",
    lastVisitDate: "25-07-2026",
    lastVisitPoli: "Poli Umum",
    satusehatStatus: "Belum Terhubung",
  },
  {
    id: "4",
    noRm: "RM000278",
    name: "Riska Amelia",
    genderAge: "P / 7 th",
    nik: "3271••••••••9012",
    insurance: "BPJS",
    lastVisitDate: "10-07-2026",
    lastVisitPoli: "Poli Anak",
    satusehatStatus: "Terhubung",
  },
  {
    id: "5",
    noRm: "RM000321",
    name: "Rizka Amalia",
    genderAge: "P / 7 th",
    nik: "-",
    insurance: "UMUM",
    lastVisitDate: "-",
    lastVisitPoli: "-",
    satusehatStatus: "Belum Terhubung",
  },
];

import RegisterPasienModal from "@/features/pendaftaran/components/RegistrasiPasienModal";
import DetailPasienModal from "@/features/pendaftaran/components/DetailPasienModal";

export default function PatientSearch() {
  const dispatch = useAppDispatch();
  // Ambil state dari Redux Toolkit
  const { searchQuery, searchResults, selectedPatient, pagination, loading } =
    useAppSelector((state) => state.patient);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isRegistrasiModalOpen, setIsRegistrasiModalOpen] =
    useState<boolean>(false);

  // Handler tombol pencarian
  const handleSearch = () => {
    dispatch(setPage(1)); // Reset halaman ke 1 saat pencarian baru
    dispatch(
      searchPatients({
        query: searchQuery,
        page: 1,
        limit: pagination.perPage,
      }),
    );
  };

  // Opsional: Jika ingin pencarian otomatis (Debounce) saat mengetik
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        searchPatients({
          query: searchQuery,
          page: pagination.currentPage,
          limit: pagination.perPage,
        }),
      );
    }, 400); // Tunggu 400ms setelah user selesai mengetik

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery, pagination.currentPage, pagination.perPage]);

  // Hitung batas pagination untuk label info
  const startData = (pagination.currentPage - 1) * pagination.perPage + 1;
  const endData = Math.min(
    pagination.currentPage * pagination.perPage,
    pagination.totalData,
  );

  return (
    <div className="w-full h-full flex flex-col p-6 font-sans">
      {/* SECTION: CARI PASIEN */}
      <section className="flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide mb-3 uppercase">
          Cari Pasien
        </h2>

        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Cari berdasarkan Nama, NIK, No. RM..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors flex-shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            <span className="hidden sm:inline">Cari Pasien</span>
          </button>
        </div>

        {/* Info Alert */}
        <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3 flex gap-2 items-start mb-4">
          <Info size={18} className="text-cyan-600 shrink-0 mt-0.5" />
          <p className="text-xs text-cyan-800 leading-relaxed">
            Pencarian dapat dilakukan kapan saja untuk melihat data pasien.
            Proses pendaftaran hanya dapat dilakukan setelah pasien ditandai{" "}
            <strong>HADIR</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors bg-white w-full text-left cursor-pointer"
            onClick={() => setIsRegistrasiModalOpen(true)}
          >
            <div className="text-green-500 bg-green-50 p-1.5 rounded-md flex-shrink-0">
              <Plus size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-green-600 truncate">
                Pasien Baru
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                (Aktif setelah HADIR)
              </p>
            </div>
          </button>

          <button className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors bg-white w-full text-left cursor-pointer">
            <div className="text-cyan-600 bg-cyan-50 p-1.5 rounded-md flex-shrink-0">
              <ClipboardList size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-cyan-600 truncate">
                Riwayat Kunjungan
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                Lihat riwayat kunjungan
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* SECTION: HASIL PENCARIAN */}
      <section className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">
            Hasil Pencarian
          </h2>
          <p className="text-xs text-gray-500">
            {pagination.totalData > 0
              ? `Menampilkan ${startData} - ${endData} dari ${pagination.totalData} data`
              : "Data tidak ditemukan"}
          </p>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-x-auto mb-4 custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 text-[11px] uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center w-10"></th>
                <th className="px-4 py-3">No. RM</th>
                <th className="px-4 py-3">Nama Pasien</th>
                <th className="px-4 py-3">JK / Usia</th>
                <th className="px-4 py-3">NIK</th>
                <th className="px-4 py-3">Penjamin</th>
                <th className="px-4 py-3">Kunjungan Terakhir</th>
                <th className="px-4 py-3">Status SATUSEHAT</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-400 text-xs"
                  >
                    <Loader2
                      size={24}
                      className="animate-spin mx-auto mb-2 text-cyan-600"
                    />
                    Memuat data pasien...
                  </td>
                </tr>
              ) : searchResults.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-400 text-xs"
                  >
                    Tidak ada data pasien yang cocok.
                  </td>
                </tr>
              ) : (
                searchResults.map((patient) => {
                  const isSelected =
                    selectedPatient?.nomorRM === patient.nomorRM;
                  const isSatuSehatConnected =
                    patient.satuSehat?.statusTerhubung;

                  return (
                    <tr
                      key={patient.nomorRM}
                      onClick={() => dispatch(selectPatient(patient))}
                      className={`hover:bg-cyan-50/30 transition-colors cursor-pointer ${
                        isSelected ? "bg-cyan-50/20" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 mx-auto ${
                            isSelected
                              ? "border-cyan-600 bg-cyan-600"
                              : "border-gray-300"
                          }`}
                        />
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-xs">
                        {patient.nomorRM}
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-800 text-xs">
                        {patient.namaLengkap}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-xs">
                        {patient.jenisKelamin} / {patient.usiaString}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-xs">
                        {patient.nik}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            patient.penjaminUtama === "BPJS"
                              ? "bg-green-100 text-green-700"
                              : "bg-cyan-100 text-cyan-700"
                          }`}
                        >
                          {patient.penjaminUtama}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs">
                        <p className="text-gray-800">
                          {patient.tanggalKunjunganTerakhir || "-"}
                        </p>
                        <p className="text-gray-500 text-[10px]">
                          {patient.poliKunjunganTerakhir || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        {isSatuSehatConnected ? (
                          <div className="flex items-center gap-1.5 text-green-600 text-xs">
                            <CheckCircle2 size={14} /> Terhubung
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-orange-500 text-xs">
                            <AlertTriangle size={14} /> Belum Terhubung
                          </div>
                        )}
                      </td>
                      <td
                        className="px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-1">
                          <button
                            className="flex items-center gap-1 text-cyan-600 hover:text-cyan-800 text-[11px] font-semibold cursor-pointer"
                            onClick={() => {
                              dispatch(selectPatient(patient));
                              setIsDetailModalOpen(true);
                            }}
                          >
                            Lihat Data Lengkap <ExternalLink size={12} />
                          </button>
                          <button
                            className={`text-[10px] text-left cursor-pointer ${
                              isSelected
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            Gunakan untuk
                            <br />
                            Pendaftaran
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mb-8 flex-shrink-0 overflow-x-auto custom-scrollbar pb-2">
          <div className="flex items-center gap-1">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => dispatch(setPage(1))}
              className="p-1.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => dispatch(setPage(pagination.currentPage - 1))}
              className="p-1.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>

            <button className="px-3 py-1 bg-cyan-600 text-white text-xs font-semibold rounded">
              {pagination.currentPage}
            </button>

            <button
              onClick={() => dispatch(setPage(pagination.currentPage + 1))}
              className="p-1.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50"
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() =>
                dispatch(
                  setPage(Math.ceil(pagination.totalData / pagination.perPage)),
                )
              }
              className="p-1.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50"
            >
              <ChevronsRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Per halaman
            </span>
            <select
              value={pagination.perPage}
              onChange={(e) => dispatch(setPerPage(Number(e.target.value)))}
              className="border border-gray-200 rounded p-1 text-xs text-gray-700 outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Bottom Info Panels */}
        <div className="mt-auto grid grid-cols-1 xl:grid-cols-2 gap-4 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2 mb-2">
              <Search size={14} className="text-gray-500" /> INFORMASI PENCARIAN
            </h3>
            <ul className="text-[11px] text-gray-600 space-y-1 list-disc pl-4 marker:text-gray-400">
              <li>Anda dapat mencari dan melihat data pasien kapan saja.</li>
              <li>
                Proses pendaftaran kunjungan hanya dapat dilakukan setelah
                pasien ditandai HADIR.
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-cyan-600" /> KEAMANAN &
                PRIVASI
              </h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Data pasien hanya dapat diakses dan diproses sesuai kewenangan
                pengguna.
              </p>
            </div>
            <div className="flex justify-end mt-2">
              <button className="text-cyan-600 text-[11px] font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                Lihat Kebijakan Akses <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <DetailPasienModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <RegisterPasienModal
        isOpen={isRegistrasiModalOpen}
        onClose={() => setIsRegistrasiModalOpen(false)}
      />
    </div>
  );
}
