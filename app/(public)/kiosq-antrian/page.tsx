"use client";

/* eslint-disable @next/next/no-img-element */

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { useQueueRealtime } from "@/hooks/use-queue-realtime";
import type { AnnouncementSettings } from "@/types/announcement";
import {
  Volume2,
  Monitor,
  Users,
  Calendar,
  Bell,
  Info,
  Phone,
  AtSign,
  Globe,
  Clock,
  MessageCircle,
  QrCode,
  Headphones,
  type LucideIcon,
} from "lucide-react";

// ================= TIPE & KONSTANTA =================
export interface AnnouncementPayload {
  message: string;
  ticket_number: string;
  service_name?: string;
  service_code?: string;
  counter_name?: string;
  counter_code?: string;
  call_id?: number | null;
  called_at?: string;
}

const LOGO_SRC = "/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png";
const TIME_ZONE = "Asia/Jakarta";
const ANIMATION_DURATION_MS = 2500;

// Di luar komponen supaya referensinya stabil (tidak dibuat ulang tiap render)
const DISPLAY_SETTINGS: Partial<AnnouncementSettings> = {
  voice_mode: "offline_tts",
  announcement_enabled: true,
  audio_volume: 100,
  repeat_count: 1,
  opening_enabled: true,
  closing_enabled: true,
  cue_gap_ms: 0,
  repeat_pause_ms: 800,
  speak_zero_digits: true,
  tts_speed: 0.8,
  tts_style: "natural",
  online_pitch: 1,
};

// Data Dummy Jadwal Dokter
const doctorSchedule = [
  {
    id: 1,
    name: "dr. Andi Wijaya, Sp.PD",
    specialty: "Spesialis Penyakit Dalam",
    time: "08.00 - 12.00",
    room: "Poli 1",
    img: "/images/dokter1.png",
  },
  {
    id: 2,
    name: "dr. Siti Nurhaliza, Sp.OG",
    specialty: "Spesialis Kandungan",
    time: "12.00 - 16.00",
    room: "Poli 2",
    img: "/images/dokter2.png",
  },
  {
    id: 3,
    name: "dr. Budi Santoso, Sp.S",
    specialty: "Spesialis Saraf",
    time: "16.00 - 20.00",
    room: "Poli 3",
    img: "/images/dokter3.png",
  },
  {
    id: 4,
    name: "dr. Maya Lestari, Sp.KK",
    specialty: "Spesialis Kulit & Kelamin",
    time: "09.00 - 13.00",
    room: "Poli 4",
    img: "/images/dokter4.png",
  },
];

const infoItems: {
  icon: LucideIcon;
  title: string;
  desc: string;
  titleColor?: string;
}[] = [
  {
    icon: Clock,
    title: "Jam Operasional",
    desc: "Senin - Sabtu\n08.00 - 20.00 WIB",
  },
  {
    icon: Calendar,
    title: "Reservasi Layanan",
    desc: "Hubungi kami untuk\nbooking kunjungan",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Carezka",
    desc: "0812-3456-7890\n(Chat Only)",
  },
  {
    icon: QrCode,
    title: "Scan untuk Layanan",
    desc: "Pindai QR untuk informasi\nlayanan lengkap",
  },
  {
    icon: Headphones,
    title: "Butuh Bantuan?",
    desc: "Tim kami siap membantu Anda\n0812-3456-7890",
    titleColor: "text-cyan-700",
  },
];

// Perkiraan nomor berikutnya (dipakai hanya jika `nextQueues` tidak dikirim).
// Contoh: "A058" + 1 -> "A059"
function estimateNextTicket(ticket: string, add: number) {
  const num = parseInt(ticket.replace(/\D/g, ""), 10) || 0;
  const prefix = ticket.replace(/[0-9]/g, "") || "A";
  if (ticket === "---" || num === 0) return "---";
  return `${prefix}${String(num + add).padStart(3, "0")}`;
}

interface QueueBoardProps {
  /** Kirim true bila halaman dibuka dengan ?autostart=1 (mode kiosk). */
  autostart?: boolean;
  /**
   * Opsional: maksimal 3 nomor antrean berikutnya dari server.
   * Jika tidak dikirim, nomor diperkirakan dari nomor yang sedang dipanggil.
   */
  nextQueues?: string[];
}

function QueueBoard({
  autostart = false,
  nextQueues,
}: QueueBoardProps) {
  const { currentCall, unlocked, unlock, ttsStatus } = useAnnouncement(
    DISPLAY_SETTINGS,
    { autostart },
  );

  // Echo tersambung sejak awal; payload yang datang sebelum audio dibuka
  // tetap masuk antrean dan diputar setelah tombol ditekan.
  const realtime = useQueueRealtime({ role: "display" });
  const isConnected = realtime === "connected";

  // State untuk jam digital
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Identitas panggilan saat ini. Berganti tiap panggilan baru, dipakai untuk
  // memicu animasi dan sebagai `key` agar elemen di-remount (animasi jalan sekali).
  const callKey = currentCall
    ? String(currentCall.call_id ?? currentCall.ticket_number)
    : null;

  // Effect Jam Digital
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Effect Animasi: jalan setiap ada panggilan baru
  useEffect(() => {
    if (!unlocked || callKey === null) return;

    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), ANIMATION_DURATION_MS);
    return () => clearTimeout(timer);
  }, [callKey, unlocked]);

  // Layar Interaksi Pertama (Wajib untuk Autoplay Policy)
  if (!unlocked) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-slate-50 text-slate-800">
        <img
          src={LOGO_SRC}
          alt="Taramedic Logo"
          className="h-24 w-auto object-contain mb-8"
        />
        <h1 className="text-3xl font-bold mb-2">
          Sistem Antrean & Layar Informasi
        </h1>
        <p className="text-slate-500 mb-10">Klinik Taramedic</p>
        <button
          type="button"
          onClick={() => void unlock()}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-5 px-10 rounded-full text-xl shadow-xl transition-transform transform hover:scale-105 flex items-center gap-3"
        >
          <Monitor className="w-6 h-6" />
          Mulai Layar Antrean
        </button>
        <p className="text-sm text-slate-400 mt-6">
          *Sistem membutuhkan interaksi pengguna untuk mengaktifkan pemanggilan
          suara (Audio TTS)
        </p>
      </div>
    );
  }

  // Data yang ditampilkan
  const currentQueue = currentCall?.ticket_number ?? "---";
  const currentRoom = currentCall ? currentCall.counter_name || "Loket" : "---";

  const upcomingQueues = nextQueues
    ? [0, 1, 2].map((i) => nextQueues[i] ?? "---")
    : [1, 2, 3].map((add) => estimateNextTicket(currentQueue, add));

  // Format jam dan tanggal (hari & tanggal dipisah agar tidak bergantung pada tanda koma locale)
  const formattedTime = currentTime
    ? currentTime
        .toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: TIME_ZONE,
        })
        .replace(/\./g, ":")
    : "--:--:--";

  const dayName = currentTime
    ? currentTime.toLocaleDateString("id-ID", {
        weekday: "long",
        timeZone: TIME_ZONE,
      })
    : "";

  const dateText = currentTime
    ? currentTime.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: TIME_ZONE,
      })
    : "Memuat...";

  return (
    <>
      <CustomAnimations />
      <div className="h-screen w-screen bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-800">
        {/* ================= HEADER ================= */}
        <header className="h-24 bg-white flex items-center justify-between px-8 shadow-sm relative z-10 shrink-0 border-b border-slate-100">
          {/* Logo Kiri */}
          <div className="flex items-center gap-4 w-1/4">
            <img
              src={LOGO_SRC}
              alt="Taramedic Logo"
              className="h-[72px] w-auto object-contain"
            />
          </div>

          {/* Judul Tengah */}
          <div className="flex flex-col items-center justify-center w-2/4">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-cyan-600/30"></div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-wide uppercase">
                Layar Antrean
              </h1>
              <div className="h-px w-12 bg-cyan-600/30"></div>
            </div>
            <h2 className="text-xl font-medium text-cyan-600 mt-0.5 flex items-center gap-2">
              Klinik Taramedic
              {/* Indikator Koneksi Realtime */}
              <span
                className="relative flex h-3 w-3 ml-2"
                title={isConnected ? "Terhubung ke Server" : "Menyambungkan..."}
              >
                {isConnected ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                )}
              </span>
              {/* Status Suara (TTS) */}
              <span
                className="text-xs font-normal text-slate-400"
                title={ttsStatus.message}
              >
                {ttsStatus.status === "ready" ? "Suara siap" : ttsStatus.message}
              </span>
            </h2>
          </div>

          {/* Jam & Tanggal Kanan */}
          <div className="flex items-center justify-end gap-4 w-1/4">
            <div className="flex items-center gap-3 text-cyan-700">
              <Clock className="w-8 h-8" />
              <span className="text-5xl font-bold tracking-tight">
                {formattedTime}
              </span>
            </div>
            <div className="h-12 w-px bg-slate-200 mx-2"></div>
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-700">
                {dayName ? `${dayName},` : ""}
              </span>
              <span className="text-sm text-slate-500">{dateText}</span>
            </div>
          </div>
        </header>

        {/* ================= KONTEN UTAMA ================= */}
        <main className="flex-1 grid grid-cols-12 gap-6 p-6 min-h-0 bg-[#f4f7f9]">
          {/* Kolom Kiri: Antrean (Span 5) */}
          <div className="col-span-5 flex flex-col gap-6 h-full">
            {/* Card Sedang Dipanggil */}
            <div
              className={`flex-1 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700 rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden text-white border-2 transition-all duration-500 ${
                isAnimating
                  ? "border-cyan-300 shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-alert-pulse"
                  : "border-cyan-400/30 shadow-xl shadow-cyan-900/10"
              }`}
            >
              {isAnimating && (
                <div
                  key={`shine-${callKey}`}
                  className="absolute top-0 left-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-striking-shine z-20"
                ></div>
              )}

              <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center gap-4 relative z-10">
                <div
                  className={`bg-white text-cyan-600 p-2.5 rounded-full shadow-md ${
                    isAnimating ? "animate-bounce" : ""
                  }`}
                >
                  <Volume2 className="w-6 h-6" />
                </div>
                <div className="h-px w-8 bg-white/50"></div>
                <h3 className="text-lg font-semibold tracking-[0.2em] uppercase">
                  Sedang Dipanggil
                </h3>
                <div className="h-px w-8 bg-white/50"></div>
              </div>

              <div
                key={callKey ?? "idle"}
                className={`text-[11rem] leading-none font-bold my-4 relative z-10 tracking-tighter ${
                  isAnimating ? "animate-pop-number" : "drop-shadow-2xl"
                }`}
              >
                {currentQueue}
              </div>

              <p className="text-lg font-medium tracking-widest uppercase mb-4 relative z-10">
                Silakan Menuju
              </p>

              <div className="bg-white text-cyan-800 px-10 py-4 rounded-2xl flex items-center gap-4 shadow-lg relative z-10">
                <Monitor className="w-8 h-8 text-cyan-600" />
                <span className="text-4xl font-extrabold tracking-wide uppercase">
                  {currentRoom}
                </span>
              </div>
            </div>

            {/* Card Antrean Berikutnya */}
            <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center shrink-0">
              <div className="flex items-center gap-4 w-full justify-center mb-6">
                <div className="h-px flex-1 bg-slate-100"></div>
                <h4 className="text-sm font-bold text-cyan-700 tracking-[0.15em] uppercase">
                  Antrean Berikutnya
                </h4>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>

              <div className="flex w-full gap-4">
                {upcomingQueues.map((ticket, i) => (
                  <NextQueueCard key={i} number={ticket} />
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Jadwal Dokter & Info (Span 7) */}
          <div className="col-span-7 flex flex-col gap-6 h-full">
            {/* Card Jadwal Dokter */}
            <div className="flex-1 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 flex flex-col overflow-hidden">
              <div className="flex items-center gap-3 mb-6 shrink-0">
                <Calendar className="w-6 h-6 text-cyan-600" />
                <h3 className="text-lg font-bold text-slate-800 tracking-wide uppercase">
                  Jadwal Dokter Hari Ini
                </h3>
              </div>

              <div className="flex-1 overflow-auto pr-2">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b-2 border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="pb-4 font-semibold w-1/3">Dokter</th>
                      <th className="pb-4 font-semibold w-1/4">Spesialis</th>
                      <th className="pb-4 font-semibold w-1/5 text-center">
                        Jam Praktik
                      </th>
                      <th className="pb-4 font-semibold w-1/5 text-center">
                        Ruang Poli
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {doctorSchedule.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={doc.img}
                              alt={doc.name}
                              className="w-12 h-12 rounded-full shadow-sm border border-slate-100 object-cover shrink-0"
                            />
                            <span className="font-bold text-slate-800 text-sm">
                              {doc.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                            {doc.specialty}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-sm font-bold text-slate-700">
                            {doc.time}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-sm font-bold text-cyan-700 bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-100">
                            {doc.room}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs shrink-0">
                <div className="flex items-center gap-2 text-slate-500">
                  <Info className="w-4 h-4" />
                  <span>Jadwal dapat berubah sewaktu-waktu.</span>
                </div>
                <span className="text-cyan-600 font-medium">
                  Layanan profesional untuk kesehatan Anda
                </span>
              </div>
            </div>

            {/* Baris Kotak Informasi Bawah */}
            <div className="grid grid-cols-5 gap-4 shrink-0">
              {infoItems.map((item) => (
                <InfoBox
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  desc={item.desc}
                  titleColor={item.titleColor}
                />
              ))}
            </div>
          </div>
        </main>

        {/* ================= FOOTER INFORMASI ================= */}
        <footer className="shrink-0 flex flex-col">
          <div className="bg-white px-8 py-5 flex items-center gap-8 border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] relative z-10">
            <div className="flex items-center gap-2 bg-cyan-700 text-white px-5 py-2.5 rounded-full shrink-0 shadow-md">
              <div className="bg-white text-cyan-700 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs">
                i
              </div>
              <span className="font-bold tracking-widest text-sm">
                INFORMASI
              </span>
            </div>

            <div className="h-10 w-px bg-slate-200 shrink-0"></div>

            <div className="flex-1 flex justify-between items-center text-slate-600 text-[13px] font-medium px-4">
              <div className="flex items-center gap-3 w-1/3 pr-4">
                <Users className="w-5 h-5 text-cyan-600 shrink-0" />
                <p className="leading-snug">
                  Terima kasih telah mempercayakan kesehatan Anda kepada
                  Taramedic.
                </p>
              </div>
              <div className="w-px h-8 bg-slate-200 shrink-0"></div>
              <div className="flex items-center gap-3 w-1/3 px-4">
                <Calendar className="w-5 h-5 text-cyan-600 shrink-0" />
                <p className="leading-snug">
                  Utamakan antrean sesuai nomor yang dipanggil.
                </p>
              </div>
              <div className="w-px h-8 bg-slate-200 shrink-0"></div>
              <div className="flex items-center gap-3 w-1/3 pl-4">
                <Bell className="w-5 h-5 text-cyan-600 shrink-0" />
                <p className="leading-snug">
                  Jika nomor Anda terlewat, silakan konfirmasi ke petugas.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cyan-800 text-white py-2.5 flex justify-center items-center gap-12 text-[13px] font-medium tracking-wide">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-300" />
              <span>0815 1121 0060</span>
            </div>
            <div className="w-px h-4 bg-cyan-600/50"></div>
            <div className="flex items-center gap-2">
              <AtSign className="w-4 h-4 text-cyan-300" />
              <span>taramedic.id</span>
            </div>
            <div className="w-px h-4 bg-cyan-600/50"></div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-300" />
              <span>www.taramedic.id</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QueueBoardPage />
    </Suspense>
  );
}

function QueueBoardPage() {
  const searchParams = useSearchParams();
  const autostart = searchParams.get("autostart") === "1";

  return <QueueBoard autostart={autostart} />;
}

// Sub-komponen untuk Kotak Antrean Berikutnya
function NextQueueCard({ number }: { number: string }) {
  return (
    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-5 flex flex-col items-center justify-center relative group overflow-hidden">
      <div className="absolute inset-0 bg-cyan-50/0 group-hover:bg-cyan-50/50 transition-colors"></div>
      <span className="text-4xl font-bold text-slate-800 mb-1 relative z-10">
        {number}
      </span>
      <div className="flex items-center gap-2 text-cyan-600/60 relative z-10">
        <div className="h-px w-4 bg-current"></div>
        <Users className="w-4 h-4" />
        <div className="h-px w-4 bg-current"></div>
      </div>
    </div>
  );
}

// Sub-komponen untuk Info Bawah (Jadwal, Reservasi, WA)
function InfoBox({
  icon: Icon,
  title,
  desc,
  titleColor = "text-slate-700",
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  titleColor?: string;
}) {
  return (
    <div className="bg-white p-3.5 rounded-[1rem] shadow-sm border border-slate-100 flex items-center gap-3">
      <div className="text-cyan-600 bg-cyan-50 p-2 rounded-lg shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <span className={`text-[11px] font-bold ${titleColor} mb-0.5`}>
          {title}
        </span>
        <span className="text-[10px] text-slate-500 leading-tight whitespace-pre-line">
          {desc}
        </span>
      </div>
    </div>
  );
}

function CustomAnimations() {
  return (
    <style>{`
      @keyframes striking-shine {
        0% { transform: translateX(-160%) skewX(-20deg); opacity: 0; }
        15% { opacity: 0.15; }
        35% { opacity: 0.65; }
        55% { opacity: 0.35; }
        75% { opacity: 0.1; }
        100% { transform: translateX(180%) skewX(-20deg); opacity: 0; }
      }
      .animate-striking-shine {
        animation: striking-shine 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        will-change: transform, opacity;
        pointer-events: none;
      }
      @keyframes alert-pulse {
        0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.45); }
        35% { box-shadow: 0 0 0 8px rgba(6, 182, 212, 0.18), 0 0 25px rgba(6, 182, 212, 0.15); }
        70% { box-shadow: 0 0 0 18px rgba(6, 182, 212, 0), 0 0 35px rgba(6, 182, 212, 0.08); }
        100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
      }
      .animate-alert-pulse {
        animation: alert-pulse 1.6s cubic-bezier(0.4, 0, 0.2, 1) 2;
        will-change: box-shadow;
      }
      @keyframes pop-number {
        0% { transform: translateY(8px) scale(0.82); opacity: 0; filter: blur(4px); text-shadow: 0 0 0 rgba(255, 255, 255, 0); }
        35% { transform: translateY(-3px) scale(1.08); opacity: 1; filter: blur(0); text-shadow: 0 0 25px rgba(255, 255, 255, 0.45), 0 0 50px rgba(6, 182, 212, 0.2); }
        60% { transform: translateY(1px) scale(0.99); }
        100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); text-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); }
      }
      .animate-pop-number {
        animation: pop-number 900ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        will-change: transform, opacity, filter;
      }
    `}</style>
  );
}