"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  PlusCircle,
  History,
  ShieldAlert,
  Pill,
  Users,
  UserCheck,
  Check,
  Pencil,
  RotateCcw,
  Save,
  Trash2,
  ArrowRight,
} from "lucide-react";

export default function AnamnesisDokterTab() {
  const [keluhanUtama, setKeluhanUtama] = useState("");
  const [keluhanPenyerta, setKeluhanPenyerta] = useState("");
  const [riwayatPenyakitDahulu, setRiwayatPenyakitDahulu] = useState("");
  const [riwayatPengobatan, setRiwayatPengobatan] = useState("");
  const [riwayatPenyakitKeluarga, setRiwayatPenyakitKeluarga] = useState("");
  const [kebiasaanMerokok, setKebiasaanMerokok] = useState("Tidak merokok");
  const [kebiasaanAlkohol, setKebiasaanAlkohol] = useState("Tidak");
  const [aktivitasFisik, setAktivitasFisik] = useState("Aktivitas ringan");
  const [keteranganLainSosial, setKeteranganLainSosial] = useState("");

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 font-sans space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            ANAMNESIS DOKTER
          </h2>
          <p className="text-xs text-slate-500">
            Lengkapi anamnesis berdasarkan data awal dari perawat. Data yang ada
            dapat dikonfirmasi atau dikoreksi.
          </p>
        </div>

        {/* Legend Sumber Data */}
        <div className="flex items-center gap-4 text-xs text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
          <span className="font-medium text-slate-700">Sumber Data:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
            <span>Diisi / Diperbarui Dokter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span>Dari Pemeriksaan Perawat</span>
          </div>
        </div>
      </div>

      {/* Form Content Grid */}
      <div className="space-y-4">
        {/* 1. Keluhan Utama */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-cyan-600 font-semibold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Keluhan Utama</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-400 block mb-1">
                Dari Perawat • 08:25 WIB
              </span>
              <p className="text-xs text-slate-800 font-medium">
                Demam sejak 2 hari, badan terasa lemas.
              </p>
            </div>

            <div className="md:col-span-8 relative">
              <span className="text-[11px] text-slate-500 block mb-1 font-medium">
                Anamnesis Dokter (Tambahan / Perkembangan)
              </span>
              <textarea
                value={keluhanUtama}
                onChange={(e) => setKeluhanUtama(e.target.value)}
                maxLength={1000}
                rows={2}
                placeholder="Tuliskan anamnesis dokter mengenai keluhan utama pasien..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none placeholder:text-slate-300"
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-slate-400">
                {keluhanUtama.length}/1000
              </span>
            </div>
          </div>
        </div>

        {/* 2. Keluhan Penyerta */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-cyan-600 font-semibold text-xs uppercase tracking-wider">
            <PlusCircle className="w-4 h-4" />
            <span>Keluhan Penyerta</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-400 block mb-1">
                Dari Perawat • 08:25 WIB
              </span>
              <p className="text-xs text-slate-800 font-medium">Tidak ada</p>
            </div>

            <div className="md:col-span-8 relative">
              <span className="text-[11px] text-slate-500 block mb-1 font-medium">
                Anamnesis Dokter (Jika ada)
              </span>
              <textarea
                value={keluhanPenyerta}
                onChange={(e) => setKeluhanPenyerta(e.target.value)}
                maxLength={1000}
                rows={2}
                placeholder="Tuliskan keluhan penyerta yang ditemukan dokter..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none placeholder:text-slate-300"
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-slate-400">
                {keluhanPenyerta.length}/1000
              </span>
            </div>
          </div>
        </div>

        {/* 3 & 4. Riwayat Penyakit Dahulu & Riwayat Alergi (2 Kolom) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Riwayat Penyakit Dahulu */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-cyan-600 font-semibold text-xs uppercase tracking-wider">
              <History className="w-4 h-4" />
              <span>Riwayat Penyakit Dahulu</span>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  Dari Perawat • 08:25 WIB
                </span>
                <div className="flex gap-1.5">
                  <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded text-xs font-medium">
                    Hipertensi
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded text-xs font-medium">
                    Diabetes
                  </span>
                </div>
              </div>

              <div className="relative">
                <span className="text-[11px] text-slate-500 block mb-1 font-medium">
                  Anamnesis Dokter
                </span>
                <textarea
                  value={riwayatPenyakitDahulu}
                  onChange={(e) => setRiwayatPenyakitDahulu(e.target.value)}
                  maxLength={1000}
                  rows={2}
                  placeholder="Tambah atau jelaskan riwayat penyakit dahulu..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none placeholder:text-slate-300"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-slate-400">
                  {riwayatPenyakitDahulu.length}/1000
                </span>
              </div>
            </div>
          </div>

          {/* Riwayat Alergi */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-cyan-600 font-semibold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Riwayat Alergi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-2">
                    Dari Perawat • 08:25 WIB
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                    <Check className="w-4 h-4" />
                    <span>Tidak ada alergi</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-slate-500 block font-medium">
                  Konfirmasi / Koreksi oleh Dokter
                </span>
                <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors">
                  <Check className="w-3.5 h-3.5" />
                  Konfirmasi (Sesuai)
                </button>
                <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-cyan-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                  Koreksi / Tambah
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5 & 6. Riwayat Pengobatan & Riwayat Penyakit Keluarga (2 Kolom) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Riwayat Pengobatan */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-cyan-600 font-semibold text-xs uppercase tracking-wider">
              <Pill className="w-4 h-4" />
              <span>Riwayat Pengobatan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-1">
                  Dari Perawat • 08:25 WIB
                </span>
                <p className="text-xs text-slate-800 font-medium">Tidak ada</p>
              </div>

              <div className="sm:col-span-7 relative">
                <span className="text-[11px] text-slate-500 block mb-1 font-medium">
                  Anamnesis Dokter (Jika ada)
                </span>
                <textarea
                  value={riwayatPengobatan}
                  onChange={(e) => setRiwayatPengobatan(e.target.value)}
                  maxLength={1000}
                  rows={2}
                  placeholder="Tuliskan riwayat pengobatan sebelumnya..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none placeholder:text-slate-300"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-slate-400">
                  {riwayatPengobatan.length}/1000
                </span>
              </div>
            </div>
          </div>

          {/* Riwayat Penyakit Keluarga */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-cyan-600 font-semibold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Riwayat Penyakit Keluarga</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-1">
                  Dari Perawat • 08:25 WIB
                </span>
                <p className="text-xs text-slate-800 font-medium">Tidak ada</p>
              </div>

              <div className="sm:col-span-7 relative">
                <span className="text-[11px] text-slate-500 block mb-1 font-medium">
                  Anamnesis Dokter (Jika ada)
                </span>
                <textarea
                  value={riwayatPenyakitKeluarga}
                  onChange={(e) => setRiwayatPenyakitKeluarga(e.target.value)}
                  maxLength={5000}
                  rows={2}
                  placeholder="Tuliskan riwayat penyakit keluarga..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none placeholder:text-slate-300"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-slate-400">
                  {riwayatPenyakitKeluarga.length}/5000
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Riwayat Sosial */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-cyan-600 font-semibold text-xs uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Riwayat Sosial</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] text-slate-500 font-medium">
                Kebiasaan Merokok
              </label>
              <select
                value={kebiasaanMerokok}
                onChange={(e) => setKebiasaanMerokok(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Tidak merokok">Tidak merokok</option>
                <option value="Perokok aktif">Perokok aktif</option>
                <option value="Mantan perokok">Mantan perokok</option>
              </select>
            </div>

            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] text-slate-500 font-medium">
                Kebiasaan Alkohol
              </label>
              <select
                value={kebiasaanAlkohol}
                onChange={(e) => setKebiasaanAlkohol(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
                <option value="Kadang-kadang">Kadang-kadang</option>
              </select>
            </div>

            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] text-slate-500 font-medium">
                Aktivitas Fisik
              </label>
              <select
                value={aktivitasFisik}
                onChange={(e) => setAktivitasFisik(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Aktivitas ringan">Aktivitas ringan</option>
                <option value="Sedang">Sedang</option>
                <option value="Berat">Berat</option>
              </select>
            </div>

            <div className="lg:col-span-6 relative space-y-1">
              <label className="text-[11px] text-slate-500 font-medium">
                Keterangan Lain (Sosial / Lingkungan / Pekerjaan Orang Tua, dll.)
              </label>
              <input
                type="text"
                value={keteranganLainSosial}
                onChange={(e) => setKeteranganLainSosial(e.target.value)}
                maxLength={1000}
                placeholder="Tuliskan keterangan tambahan riwayat sosial pasien..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-300 pr-12"
              />
              <span className="absolute right-3 bottom-2.5 text-[10px] text-slate-400">
                {keteranganLainSosial.length}/1000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            <Save className="w-3.5 h-3.5 text-slate-500" />
            Simpan Draft
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Perubahan
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-rose-200 text-rose-600 bg-rose-50/50 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
            Batalkan Kunjungan
          </button>
          <button className="flex items-center gap-1.5 px-5 py-2 bg-cyan-600 text-white rounded-lg text-xs font-semibold hover:bg-cyan-700 transition-colors shadow-sm">
            Lanjut ke Pemeriksaan
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}