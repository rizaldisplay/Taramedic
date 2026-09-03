"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  History,
  Info,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";

// --- Types & Interfaces ---
interface InternalNote {
  id: string;
  text: string;
  at: string;
}

interface MedicalHistoryItem {
  id: string;
  date: string;
  diagnosis: string;
  doctor: string;
}

interface SidebarCatatanProps {
  internalNote?: string;
  setInternalNote?: React.Dispatch<React.SetStateAction<string>>;
  onViewAllHistory?: () => void;
}

// --- Mock Data Riwayat Singkat ---
const initialHistoryItems: MedicalHistoryItem[] = [
  {
    id: "1",
    date: "16/06/2024",
    diagnosis: "Gastritis",
    doctor: "dr. Bima, Sp.A",
  },
  {
    id: "2",
    date: "10/04/2024",
    diagnosis: "Demam",
    doctor: "dr. Bima, Sp.A",
  },
  {
    id: "3",
    date: "02/01/2024",
    diagnosis: "ISPA",
    doctor: "dr. Bima, Sp.A",
  },
];

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
  onViewAllHistory,
}: SidebarCatatanProps) {
  const [internalNotes, setInternalNotes] = useState<InternalNote[]>([]);
  const [internalNoteDraft, setInternalNoteDraft] = useState("");

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
    <div className="w-full flex flex-col gap-4 font-sans">
      
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
              Pemeriksaan Dokter
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

        {/* List Catatan */}
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
                  className="text-slate-300 hover:text-rose-500 transition-colors shrink-0 p-0.5 cursor-pointer"
                  title="Hapus catatan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Input Field */}
        <div className="space-y-1">
          <textarea
            value={internalNoteDraft}
            onChange={(e) => setInternalNoteDraft(e.target.value)}
            maxLength={500}
            placeholder="Tulis catatan internal (tidak tampil di resume medis)..."
            className="w-full h-20 p-2.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-taramedic-500/20 focus:border-taramedic resize-none transition-all placeholder:text-slate-400"
          />
          <div className="text-right text-[10px] text-slate-400 font-medium">
            {internalNoteDraft.length} / 500
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleAddInternalNote}
          disabled={!internalNoteDraft.trim()}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-taramedic-200 text-taramedic-700 font-semibold text-xs rounded-lg hover:bg-taramedic-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Catatan</span>
        </button>
      </div>

      {/* 3. Card Riwayat Singkat */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-taramedic font-bold text-xs uppercase tracking-wider">
          <History className="w-4 h-4" />
          <span>Riwayat Singkat</span>
        </div>

        {/* Tabel Riwayat */}
        <div className="space-y-2.5 text-xs">
          {initialHistoryItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 w-24 shrink-0 font-medium">
                {item.date}
              </span>
              <span className="font-semibold text-slate-800 flex-1 px-2 truncate">
                {item.diagnosis}
              </span>
              <span className="text-slate-400 text-right w-24 shrink-0 truncate">
                {item.doctor}
              </span>
            </div>
          ))}
        </div>

        {/* Tombol Lihat Semua Riwayat */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onViewAllHistory}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-taramedic hover:text-taramedic-700 transition-colors cursor-pointer"
          >
            <span>Lihat Semua Riwayat</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}