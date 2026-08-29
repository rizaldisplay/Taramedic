"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Info,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import PenerimaObatComponent from "./PenerimaObat";
import CatatanEdukasiComponent from "./CatatanEdukasi";
import RingkasanSerahObatComponent from "./RingkasanSerahObat";

// --- Types & Interfaces ---
interface InternalNote {
  id: string;
  text: string;
  at: string;
}

interface AlergiDipandu {
  hasAlergi?: boolean;
  keterangan?: string;
  onLihatRiwayat?: () => void;
}

interface SidebarCatatanProps {
  internalNote: string;
  setInternalNote: React.Dispatch<React.SetStateAction<string>>;
}

// --- Helper Functions ---
function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatDateID(date: Date): string {
  const datePart = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} - ${timePart} WIB`;
}

export default function SidebarCatatan({
  internalNote,
  setInternalNote,
}: SidebarCatatanProps) {
  const [internalNotes, setInternalNotes] = useState<InternalNote[]>([]);
  const [internalNoteDraft, setInternalNoteDraft] = useState("");
  const [alergi, setAlergi] = useState<AlergiDipandu>({});

  // ---------- Handler Catatan Internal ----------
  const handleAddInternalNote = () => {
    const text = internalNoteDraft.trim();
    if (!text) return;
    setInternalNotes((prev) => [
      { id: makeId(), text, at: formatDateID(new Date()) },
      ...prev,
    ]);
    setInternalNoteDraft("");
  };

  const handleRemoveInternalNote = (id: string) => {
    setInternalNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-5 font-sans">
      
      {/* 1. Card Informasi Kunjungan */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-taramedic font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Informasi Kunjungan</span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> No. Antrean
            </span>
            <span className="font-semibold text-slate-800">A013</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Waktu Daftar
            </span>
            <span className="font-semibold text-slate-800">08:05 WIB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Poli
            </span>
            <span className="font-semibold text-slate-800">Poli Anak</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Dokter
            </span>
            <span className="font-semibold text-slate-800">dr. Bima, Sp.A</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Lokasi
            </span>
            <span className="font-semibold text-slate-800">Loket 1</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Penjamin
            </span>
            <span className="font-semibold text-slate-800">BPJS Kesehatan</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Status Terakhir
            </span>
            <span className="px-2 py-0.5 bg-taramedic-50 text-taramedic-700 font-semibold text-[11px] rounded-md">
              Pemeriksaan Perawat
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Catatan Pendaftaran
            </span>
            <span className="font-semibold text-slate-800">
              Pasien datang sendiri
            </span>
          </div>
        </div>
      </div>

      {/* 2. Card Catatan Internal */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-taramedic font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Catatan Internal</span>
        </div>

        {/* Daftar Catatan Tersimpan */}
        {internalNotes.length > 0 && (
          <ul className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {internalNotes.map((n) => (
              <li
                key={n.id}
                className="flex items-start justify-between gap-2 bg-slate-50 rounded-lg p-2.5 text-[11px]"
              >
                <div>
                  <p className="text-slate-700 whitespace-pre-wrap break-words">
                    {n.text}
                  </p>
                  <p className="text-slate-400 mt-1">{n.at}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveInternalNote(n.id)}
                  className="text-slate-300 hover:text-rose-500 transition-colors shrink-0 p-0.5"
                  title="Hapus catatan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Form Input Catatan Baru */}
        <div className="space-y-1">
          <textarea
            value={internalNoteDraft}
            onChange={(e) => setInternalNoteDraft(e.target.value)}
            maxLength={500}
            placeholder="Tulis catatan internal (tidak tampil di resume medis)..."
            className="w-full h-24 p-2.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-taramedic-500/20 focus:border-taramedic resize-none transition-all placeholder:text-slate-400"
          />
          <div className="text-right text-[10px] text-slate-400 font-medium">
            {internalNoteDraft.length} / 500
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddInternalNote}
          disabled={!internalNoteDraft.trim()}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-taramedic-200 text-taramedic-700 font-semibold text-xs rounded-lg hover:bg-taramedic-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Catatan</span>
        </button>
      </div>

      {/* 3. Sub-komponen Tambahan */}
      <PenerimaObatComponent />
      <CatatanEdukasiComponent />
      <RingkasanSerahObatComponent />

      {/* 4. Card Alergi Yang Dipandu */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-taramedic text-white shrink-0">
            <ShieldAlert className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-taramedic">
            ALERGI YANG DIPANDU
          </h2>
        </div>

        {/* Status Alergi */}
        <div className="flex items-start gap-2.5 text-xs">
          {alergi.hasAlergi ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          )}
          <span className="font-medium leading-snug text-slate-800">
            {alergi.keterangan ?? "Tidak ada alergi yang tercatat"}
          </span>
        </div>

        {/* Tombol Aksi */}
        <button
          type="button"
          onClick={alergi.onLihatRiwayat}
          className="w-full flex items-center justify-center rounded-lg border border-slate-200 py-2 text-xs font-semibold text-taramedic hover:bg-taramedic-50 hover:text-taramedic-700 transition-colors"
        >
          Lihat Riwayat Alergi
        </button>
      </div>

    </div>
  );
}