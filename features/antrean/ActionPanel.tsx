"use client";

import React, { useState } from "react";
import {
  Volume2,
  Check,
  X,
  Lock,
  User,
  CheckCircle,
  RefreshCw,
  ChevronsRight,
  Ticket,
  ChevronRight,
} from "lucide-react";

// --- Types ---
interface QueueItem {
  id: string;
  number: string;
  status: string;
  timeTaken: string;
  waitTime: string;
  waitTimeColor: string;
}

// --- Mock Data ---
const waitingQueue: QueueItem[] = [
  {
    id: "1",
    number: "A014",
    status: "Menunggu",
    timeTaken: "08:42",
    waitTime: "3 mnt",
    waitTimeColor: "text-green-500",
  },
  {
    id: "2",
    number: "A015",
    status: "Menunggu",
    timeTaken: "08:44",
    waitTime: "1 mnt",
    waitTimeColor: "text-green-500",
  },
  {
    id: "3",
    number: "A016",
    status: "Menunggu",
    timeTaken: "08:46",
    waitTime: "< 1 mnt",
    waitTimeColor: "text-green-500",
  },
  {
    id: "4",
    number: "A017",
    status: "Menunggu",
    timeTaken: "08:48",
    waitTime: "< 1 mnt",
    waitTimeColor: "text-green-500",
  },
  {
    id: "5",
    number: "A018",
    status: "Menunggu",
    timeTaken: "08:50",
    waitTime: "< 1 mnt",
    waitTimeColor: "text-green-500",
  },
];

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
}) => (
  <div className="flex items-center justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
    <div className="flex items-center gap-3">
      <span className="font-semibold text-slate-700 w-8">{no}</span>
      <span className="text-slate-600 truncate w-24">{name}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400">{time}</span>
      <span className="text-xs text-emerald-600 font-medium flex items-center">
        <CheckCircle className="w-3 h-3 mr-1" /> {status}
      </span>
    </div>
  </div>
);

export const ActionPanel = () => {
  const [activeTab, setActiveTab] = useState<"menunggu" | "terlewati">(
    "menunggu",
  );

  return (
    <div className="w-[340px] flex-shrink-0 space-y-4">
      {/* Active Call Card */}
      <div className="bg-white rounded-xl border border-cyan-200 shadow-sm overflow-hidden relative">
        <div className="h-1 bg-cyan-500 w-full absolute top-0 left-0"></div>
        <div className="p-5 pt-6">
          <div className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">
            SEDANG DIPANGGIL
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-4xl font-bold text-cyan-600 mb-2">A013</h3>
              <h4 className="text-lg font-bold text-slate-900">
                Rizka Amalia{" "}
                <span className="text-pink-500 font-normal">♀</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                RM-000036 • Perempuan, 8 thn
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <User className="w-6 h-6 text-slate-400" />
            </div>
          </div>

          <div className="bg-cyan-50/50 rounded-lg p-3 border border-cyan-100 mb-5 text-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center text-cyan-700 font-medium">
                <Volume2 className="w-4 h-4 mr-2" /> Panggilan ke-1
              </div>
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

            <div>
              <button className="w-full flex flex-col items-center justify-center py-2.5 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg cursor-not-allowed mt-2">
                <div className="flex items-center text-sm font-semibold mb-0.5">
                  <Lock className="w-4 h-4 mr-2" /> Mulai Pemeriksaan
                </div>
                <div className="text-[10px] text-slate-400">
                  Tandai hadir terlebih dahulu untuk memulai pemeriksaan
                </div>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-3 flex-shrink-0">
            <button
              onClick={() => setActiveTab("menunggu")}
              className={`flex-1 pb-2 text-xs font-semibold text-center ${activeTab === "menunggu" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-500"}`}
            >
              MENUNGGU (16)
            </button>
            <button
              onClick={() => setActiveTab("terlewati")}
              className={`flex-1 pb-2 text-xs font-semibold text-center ${activeTab === "terlewati" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-500"}`}
            >
              TERLEWATI (2)
            </button>
          </div>

          {/* Queue List */}
          {/* Memberikan flex-1 pada list ini agar bisa mengisi sisa ruang dan di-scroll internal jika kepanjangan */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-1 mb-4 scrollbar-thin scrollbar-thumb-gray-200 custom-scrollbar">
            {waitingQueue.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Ticket size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {item.number}
                    </p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>{" "}
                      {item.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-gray-500">
                    Diambil {item.timeTaken}
                  </p>
                  <p
                    className={`text-[11px] font-medium ${item.waitTimeColor}`}
                  >
                    {item.waitTime}
                  </p>
                </div>
              </div>
            ))}

            <button className="w-full mt-2 text-xs text-cyan-600 font-semibold flex items-center justify-center gap-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChevronRight size={14} /> LIHAT SEMUA
            </button>
          </div>
        </div>
      </div>

      {/* Next Patient Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">
          BERIKUTNYA
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-amber-500">A014</span>
            <div>
              <div className="font-bold text-slate-800 text-sm">
                Fathan Alfarizi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Called List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            PANGGILAN TERAKHIR
          </div>
        </div>
        <div className="space-y-3">
          <LastCallItem
            no="A009"
            name="Siti Nurhaliza"
            time="08:30 WIB"
            status="Selesai"
          />
          <LastCallItem
            no="A010"
            name="Andi Saputra"
            time="08:38 WIB"
            status="Selesai"
          />
        </div>
      </div>
    </div>
  );
};
