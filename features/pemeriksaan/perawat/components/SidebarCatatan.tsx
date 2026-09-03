"use client";

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
} from "lucide-react";
import { useState } from "react";

interface InternalNote {
  id: string;
  text: string;
  at: string;
}

export default function SidebarCatatan({ internalNote, setInternalNote }: { internalNote: string; setInternalNote: React.Dispatch<React.SetStateAction<string>> }) {
  const [internalNotes, setInternalNotes] = useState<InternalNote[]>([]);
  const [internalNoteDraft, setInternalNoteDraft] = useState("");

  // ---------- Catatan internal ----------
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
    <div className="lg:col-span-3 flex flex-col gap-5 pb-24 md:pb-28 sticky top-6">
      {/* Card Informasi Kunjungan */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-cyan-600 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          Informasi Kunjungan
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
            <span className="px-2 py-0.5 bg-cyan-50 text-cyan-600 font-medium text-[11px] rounded-md">
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

      {/* Card Catatan Internal */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-cyan-600 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          Catatan Internal
        </div>

        {internalNotes.length > 0 && (
          <ul className="space-y-2 max-h-32 overflow-y-auto pr-1">
            {internalNotes.map((n) => (
              <li
                key={n.id}
                className="flex items-start justify-between gap-2 bg-slate-50 rounded-lg p-2 text-[11px]"
              >
                <div>
                  <p className="text-slate-700 whitespace-pre-wrap break-words">
                    {n.text}
                  </p>
                  <p className="text-slate-400 mt-0.5">{n.at}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveInternalNote(n.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                  title="Hapus catatan"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-2">
          <textarea
            value={internalNoteDraft}
            onChange={(e) => setInternalNoteDraft(e.target.value)}
            maxLength={500}
            placeholder="Tulis catatan internal (tidak tampil di resume medis)"
            className="w-full h-24 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none"
          />
          <div className="text-right text-[10px] text-slate-400">
            {internalNoteDraft.length}/500
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddInternalNote}
          disabled={!internalNoteDraft.trim()}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-cyan-200 text-cyan-600 font-semibold text-xs rounded-lg hover:bg-cyan-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Catatan
        </button>
      </div>
    </div>
  );
}

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
