"use client";

import React from "react";
import { X, Info } from "lucide-react";

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PatientDetailModal({
  isOpen,
  onClose,
}: PatientDetailModalProps) {
  if (!isOpen) return null;

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
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-md">
              Aktif
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Top Profile Summary */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-6 pb-6 border-b border-slate-200">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4 min-w-fit">
              <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-bold text-[#0b2756] shrink-0">
                RA
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Rizka Amalia
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-600 font-medium">
                    RM000036
                  </span>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    Aktif
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-slate-200"></div>

            {/* NIK */}
            <div className="flex flex-col min-w-fit">
              <span className="text-xs font-semibold text-slate-700 mb-1">
                NIK
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">
                  3271123456789012
                </span>
                <span className="bg-green-50 text-green-600 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  Terverifikasi
                </span>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-slate-200"></div>

            {/* No. IHS */}
            <div className="flex flex-col min-w-fit">
              <span className="text-xs font-semibold text-slate-700 mb-1">
                No. IHS (SATUSEHAT)
              </span>
              <span className="text-sm font-medium text-slate-900">
                0011-22-3311-0001234
              </span>
            </div>

            <div className="hidden md:block w-px h-12 bg-slate-200"></div>

            {/* No. KK */}
            <div className="flex flex-col min-w-fit">
              <span className="text-xs font-semibold text-slate-700 mb-1">
                No. KK
              </span>
              <span className="text-sm font-medium text-slate-900">
                3271121809123456
              </span>
            </div>
          </div>

          {/* Section A: Identitas Pasien */}
          <section>
            <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
              A. Identitas Pasien
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
              <DataItem label="Nama Lengkap" value="Rizka Amalia" />
              <DataItem label="Jenis Identitas" value="NIK" />
              <DataItem label="NIK" value="3271123456789012" />
              <div className="hidden md:block"></div>{" "}
              {/* Empty column for layout */}
              <DataItem label="Tempat Lahir" value="Bandung" />
              <DataItem label="Tanggal Lahir" value="02-03-2016" />
              <DataItem label="Jenis Kelamin" value="Perempuan" />
              <DataItem label="Status Perkawinan" value="Belum Kawin" />
              <DataItem label="Kewarganegaraan" value="WNI" />
              <DataItem label="Bahasa Komunikasi" value="Bahasa Indonesia" />
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section B: Alamat Sesuai Identitas */}
          <section>
            <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
              B. Alamat Sesuai Identitas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
              <DataItem
                label="Alamat Lengkap"
                value="Jl. Melati No. 12, Lebak Gede"
              />
              <DataItem label="RT / RW" value="003 / 005" />
              <DataItem label="Kode Pos" value="40132" />
              <DataItem label="Provinsi" value="Jawa Barat" />

              <DataItem label="Kabupaten/Kota" value="Kota Bandung" />
              <DataItem label="Kecamatan" value="Coblong" />
              <DataItem label="Desa/Kelurahan" value="Lebak Gede" />
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section C: Kontak Pasien */}
          <section>
            <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
              C. Kontak Pasien
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
              <DataItem label="Nomor HP" value="0815********" />
              <DataItem label="Email" value="rizka.amalia@email.com" />
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section D: Data Administrasi */}
          <section>
            <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
              D. Data Administrasi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
              <DataItem label="Nomor Kartu Keluarga" value="3271121809123456" />
              <DataItem label="Kewarganegaraan" value="WNI" />
              <DataItem label="Status Perkawinan" value="Belum Kawin" />
              <DataItem label="Bahasa Komunikasi" value="Bahasa Indonesia" />
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section E: Kontak Darurat */}
          <section>
            <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
              E. Kontak Darurat
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
              <DataItem label="Nama Kontak Darurat" value="Siti Nurhaliza" />
              <DataItem label="Hubungan" value="Ibu Kandung" />
              <DataItem label="Nomor HP Kontak Darurat" value="0812********" />
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section F: Informasi Sistem & Integrasi */}
          <section>
            <h4 className="text-xs font-bold text-cyan-700 uppercase mb-4">
              F. Informasi Sistem & Integrasi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-y-5 gap-x-6">
              <DataItem label="No. Rekam Medis (RM)" value="RM000036" />
              <DataItem
                label="No. IHS (SATUSEHAT)"
                value="0011-22-3311-0001234"
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#0b2756]">
                  Status SATUSEHAT
                </span>
                <div className="w-fit">
                  <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded">
                    Terverifikasi
                  </span>
                </div>
              </div>

              <DataItem label="Tanggal Registrasi" value="16-08-2026 08:01" />
              <DataItem label="Terakhir Diperbarui" value="16-08-2026 08:03" />

              <DataItem label="Dibuat Oleh" value="Admin Taramedic" />
              <DataItem label="Sumber Registrasi" value="Petugas Pendaftaran" />
            </div>
          </section>
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
              onClick={onClose}
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

// --- Internal Helper Component ---
function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-[#0b2756]">{label}</span>
      <span className="text-sm text-slate-700">{value}</span>
    </div>
  );
}
