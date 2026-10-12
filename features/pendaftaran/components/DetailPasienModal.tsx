"use client";
// src/features/pendaftaran/components/DetailPasienModal.tsx

import React, { useEffect } from "react";
import { X, Info, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearDetail, fetchPatientDetail } from "../slices/patientSlice";
import { getInitials, isoToTanggal } from "../utils/pendaftaranHelpers";

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** ID pasien yang ditampilkan */
  patientId: number | null;
}

const LABEL_IDENTITAS: Record<string, string> = {
  NIK: "NIK",
  TANPA_NIK: "Pasien Tanpa NIK",
  WNA: "WNA",
};

const show = (value?: string | null) => (value && value.trim() !== "" ? value : "-");

export default function PatientDetailModal({
  isOpen,
  onClose,
  patientId,
}: PatientDetailModalProps) {
  const dispatch = useAppDispatch();
  const { data: p, loading, error } = useAppSelector((state) => state.patient.detail);

  // Ambil data lengkap saat modal dibuka
  useEffect(() => {
    if (isOpen && patientId != null) dispatch(fetchPatientDetail(patientId));
  }, [isOpen, patientId, dispatch]);

  const handleClose = () => {
    dispatch(clearDetail());
    onClose();
  };

  if (!isOpen) return null;

  const isWna = p?.jenisIdentitas === "WNA";
  const labelNomorIdentitas = isWna ? "Nomor Paspor" : "NIK";

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#0b2756] tracking-wide uppercase">
              Data Pasien Lengkap
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Informasi ini sesuai dengan identitas resmi yang terdaftar dan
              digunakan untuk integrasi SATUSEHAT.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {p && <StatusBadge active={p.isActive} />}
            <button
              onClick={handleClose}
              aria-label="Tutup"
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {error ? (
            <div className="py-16 text-center text-sm text-red-600">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => patientId != null && dispatch(fetchPatientDetail(patientId))}
                className="mt-3 px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Coba Lagi
              </button>
            </div>
          ) : loading || !p ? (
            <div className="py-16 flex flex-col items-center gap-2 text-xs text-slate-400">
              <Loader2 size={24} className="animate-spin text-cyan-600" />
              Memuat data pasien...
            </div>
          ) : (
            <>
              {/* Top Profile Summary */}
              <div className="flex flex-wrap md:flex-nowrap items-center gap-6 pb-6 border-b border-slate-200">
                {/* Avatar & Name */}
                <div className="flex items-center gap-4 min-w-fit">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-bold text-[#0b2756] shrink-0">
                    {getInitials(p.namaLengkap)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{p.namaLengkap}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-600 font-medium">{p.nomorRM}</span>
                      <StatusBadge active={p.isActive} small />
                    </div>
                  </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-slate-200"></div>

                {/* NIK / Paspor */}
                <div className="flex flex-col min-w-fit">
                  <span className="text-xs font-semibold text-slate-700 mb-1">
                    {labelNomorIdentitas}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{show(p.nik)}</span>
                    {p.nikTerverifikasi && (
                      <span className="bg-green-50 text-green-600 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        Terverifikasi
                      </span>
                    )}
                  </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-slate-200"></div>

                {/* No. IHS */}
                <div className="flex flex-col min-w-fit">
                  <span className="text-xs font-semibold text-slate-700 mb-1">
                    No. IHS (SATUSEHAT)
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {show(p.satuSehat.ihsNumber)}
                  </span>
                </div>

                <div className="hidden md:block w-px h-12 bg-slate-200"></div>

                {/* No. KK */}
                <div className="flex flex-col min-w-fit">
                  <span className="text-xs font-semibold text-slate-700 mb-1">No. KK</span>
                  <span className="text-sm font-medium text-slate-900">{show(p.nomorKK)}</span>
                </div>
              </div>

              {/* Section A: Identitas Pasien */}
              <section>
                <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
                  A. Identitas Pasien
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
                  <DataItem label="Nama Lengkap" value={p.namaLengkap} />
                  <DataItem
                    label="Jenis Identitas"
                    value={LABEL_IDENTITAS[p.jenisIdentitas] ?? p.jenisIdentitas}
                  />
                  <DataItem label={labelNomorIdentitas} value={show(p.nik)} />
                  <div className="hidden md:block"></div>{" "}
                  {/* Empty column for layout */}
                  <DataItem label="Tempat Lahir" value={show(p.tempatLahir)} />
                  <DataItem label="Tanggal Lahir" value={isoToTanggal(p.tanggalLahir)} />
                  <DataItem label="Jenis Kelamin" value={p.jenisKelamin} />
                  <DataItem label="Status Perkawinan" value={show(p.statusPerkawinan)} />
                  <DataItem label="Kewarganegaraan" value={show(p.kewarganegaraan)} />
                  <DataItem label="Bahasa Komunikasi" value={show(p.bahasa)} />
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Section B: Alamat Sesuai Identitas */}
              <section>
                <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
                  B. Alamat Sesuai Identitas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
                  <DataItem label="Alamat Lengkap" value={p.alamatLengkap} />
                  <DataItem label="RT / RW" value={`${show(p.rt)} / ${show(p.rw)}`} />
                  <DataItem label="Kode Pos" value={show(p.kodePos)} />
                  <DataItem label="Provinsi" value={show(p.wilayahNama.provinsi)} />

                  <DataItem label="Kabupaten/Kota" value={show(p.wilayahNama.kabupatenKota)} />
                  <DataItem label="Kecamatan" value={show(p.wilayahNama.kecamatan)} />
                  <DataItem label="Desa/Kelurahan" value={show(p.wilayahNama.desaKelurahan)} />
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Section C: Kontak Pasien */}
              <section>
                <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
                  C. Kontak Pasien
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
                  <DataItem label="Nomor HP" value={show(p.nomorHP)} />
                  <DataItem label="Email" value={show(p.email)} />
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Section D: Data Administrasi */}
              <section>
                <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
                  D. Data Administrasi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
                  <DataItem label="Nomor Kartu Keluarga" value={show(p.nomorKK)} />
                  <DataItem label="Kewarganegaraan" value={show(p.kewarganegaraan)} />
                  <DataItem label="Status Perkawinan" value={show(p.statusPerkawinan)} />
                  <DataItem label="Bahasa Komunikasi" value={show(p.bahasa)} />
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Section E: Kontak Darurat */}
              <section>
                <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
                  E. Kontak Darurat
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
                  <DataItem label="Nama Kontak Darurat" value={show(p.namaKontakDarurat)} />
                  <DataItem label="Hubungan" value={show(p.hubunganKontakDarurat)} />
                  <DataItem
                    label="Nomor HP Kontak Darurat"
                    value={show(p.nomorHPKontakDarurat)}
                  />
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Section F: Informasi Sistem & Integrasi */}
              <section>
                <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
                  F. Informasi Sistem & Integrasi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-y-5 gap-x-6">
                  <DataItem label="No. Rekam Medis (RM)" value={p.nomorRM} />
                  <DataItem
                    label="No. IHS (SATUSEHAT)"
                    value={show(p.satuSehat.ihsNumber)}
                  />

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-[#0b2756]">Status SATUSEHAT</span>
                    <div className="w-fit">
                      {p.satuSehat.statusTerhubung ? (
                        <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded">
                          Terhubung
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded">
                          Belum Terhubung
                        </span>
                      )}
                    </div>
                  </div>

                  <DataItem label="Tanggal Registrasi" value={show(p.tanggalRegistrasi)} />
                  <DataItem label="Terakhir Diperbarui" value={show(p.terakhirDiperbarui)} />

                  <DataItem label="Dibuat Oleh" value={show(p.dibuatOleh)} />
                  <DataItem label="Sumber Registrasi" value={show(p.sumberRegistrasi)} />
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer Section */}
        <div className="flex flex-col gap-4 p-6 bg-white border-t border-slate-200 shrink-0">
          {/* Info Banner */}
          <div className="flex items-center justify-between gap-4 p-3 border rounded-lg bg-cyan-50/50 border-cyan-100">
            {/* Pesan Informasi */}
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 text-cyan-600 shrink-0" />
              <p className="max-w-3xl text-xs leading-relaxed text-cyan-800">
                Data pasien terhubung dengan SATUSEHAT untuk mendukung layanan
                kesehatan yang terintegrasi. Pastikan data identitas selalu
                sesuai dengan dokumen resmi.
              </p>
            </div>

            {/* SATUSEHAT Logo */}
            <div className="flex items-center gap-1.5 opacity-90 shrink-0">
              <img
                src="/logo/satusehat-share.png"
                alt="Logo SATUSEHAT"
                className="w-[11.5rem] max-h-[6.5rem] object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-sm font-semibold transition-colors border rounded-lg text-slate-700 border-slate-300 hover:bg-slate-50"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Internal Helper Components ---
function StatusBadge({ active, small }: { active: boolean; small?: boolean }) {
  const color = active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600";
  return (
    <span
      className={`${color} font-bold ${
        small ? "text-[10px] px-2 py-0.5 rounded" : "text-xs px-3 py-1 rounded-md"
      }`}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-[#0b2756]">{label}</span>
      <span className="text-sm text-slate-700">{value}</span>
    </div>
  );
}
