"use client";

import React from "react";
import {
  Volume2,
  Check,
  X,
  Lock,
  User,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  UserRound,
  ChevronsRight,
  RefreshCw,
} from "lucide-react";

const LastCallItem = ({
  no,
  name,
  time,
  status,
}: {
  no: string;
  name: string;
  time: string;
  status: string;
}) => {
  const isSelesai = status === "Selesai";

  return (
    <div className="flex items-center justify-between text-sm py-1.5">
      <div className="flex items-center gap-3">
        <span className="font-bold text-slate-900 w-8">{no}</span>
        <span className="text-slate-600 truncate w-24">{name}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-500">{time}</span>
        <span
          className={`text-xs font-medium flex items-center w-[72px] justify-start ${isSelesai ? "text-emerald-600" : "text-amber-500"}`}
        >
          {isSelesai ? (
            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
          )}
          {status}
        </span>
      </div>
    </div>
  );
};

export const ActionPanel = () => {
  return (
    <div className="w-[340px] flex-shrink-0 space-y-4">
      {/* Active Call Card */}
      <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden relative">
        <div className="h-1 bg-taramedic-500 w-full absolute top-0 left-0"></div>
        <div className="p-5 pt-6">
          <div className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider mb-2">
            SEDANG DIPANGGIL
          </div>
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="text-4xl font-bold text-cyan-600 mb-1">A013</h3>
              <h4 className="text-[17px] font-bold text-slate-900 flex items-center gap-1 mb-1">
                Rizka Amalia{" "}
                <span className="text-pink-500 font-normal text-xl leading-none">
                  ♀
                </span>
              </h4>
              <div className="text-[13px] text-slate-500 space-y-0.5">
                <p>RM-000036 • Perempuan, 8 thn</p>
                <p>
                  <span className="text-emerald-600 font-medium">BPJS</span> •
                  Poli Anak
                </p>
              </div>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border-2 border-slate-100 shadow-sm overflow-hidden flex-shrink-0">
              <User className="w-6 h-6 text-slate-300" />
            </div>
          </div>

          {/* Resep Info Block */}
          <div className="mb-5">
            <div className="text-sm font-semibold text-cyan-700 mb-3">
              Resep #RX-20260816-013
            </div>
            <div className="flex items-center justify-between text-[13px] text-slate-600 mb-2">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-slate-400" /> 3 item obat
              </div>
              <div className="flex items-center gap-2">
                <UserRound className="w-4 h-4 text-slate-400" /> dr. Bima, Sp.A
              </div>
            </div>
            <div className="text-[13px] text-slate-500">Masuk: 08:05 WIB</div>
          </div>

          <div className="bg-cyan-50/70 rounded-lg p-2.5 border border-cyan-100 mb-5 flex justify-center items-center">
            <div className="flex items-center text-cyan-700 font-medium text-sm">
              <Volume2 className="w-4 h-4 mr-2" /> Panggilan ke-1
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-4 flex-shrink-0">
            {/* Tombol Aksi Utama */}
            <button
              type="button"
              onClick={() => console.log("Panggil Berikutnya")}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <Volume2 size={18} /> PANGGIL BERIKUTNYA
            </button>

            <button
              type="button"
              onClick={() => console.log("Panggil Ulang")}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none"
            >
              <RefreshCw size={16} /> PANGGIL ULANG
            </button>

            {/* Tombol Status */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => console.log("Hadir")}
                className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-green-300 focus:outline-none"
              >
                <Check size={16} /> HADIR
              </button>

              <button
                type="button"
                onClick={() => console.log("Lewati")}
                className="bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-orange-300 focus:outline-none"
              >
                <ChevronsRight size={16} /> LEWATI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Next Patient Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mb-2">
          BERIKUTNYA
        </div>
        <div className="flex justify-between items-center">
          {/* Bagian Kiri: Nomor dan Nama */}
          <div className="flex items-center gap-3.5">
            <div className="text-xl font-bold text-amber-500 leading-none">
              A014
            </div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5 leading-none">
              Fathan Alfarizi
              <span className="text-cyan-500 font-normal text-base">♂</span>
            </div>
          </div>

          {/* Bagian Kanan: Info Status */}
          <div className="text-xs text-slate-500 flex items-center">
            2 item obat
            <span className="mx-1.5 text-slate-300">•</span>
            Menunggu
          </div>
        </div>
      </div>

      {/* Last Called List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          PANGGILAN TERAKHIR
        </div>
        <div className="space-y-1">
          <LastCallItem
            no="A011"
            name="Andi Saputra"
            time="08:30 WIB"
            status="Selesai"
          />
          <LastCallItem
            no="A012"
            name="Dewi Lestari"
            time="08:38 WIB"
            status="Selesai"
          />
          <LastCallItem
            no="A010"
            name="Budi Santoso"
            time="08:25 WIB"
            status="Dilewati"
          />
        </div>
      </div>
    </div>
  );
};
