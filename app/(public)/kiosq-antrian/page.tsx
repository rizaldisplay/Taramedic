/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

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

export default function QueueBoard() {
  // State untuk jam digital
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // State Logika Antrean
  const [queueNumber, setQueueNumber] = useState(58);
  const [isAnimating, setIsAnimating] = useState(false);

  // Effect Jam Digital
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Effect Simulasi Panggilan Antrean (Bisa diganti dengan WebSocket nanti)
  useEffect(() => {
    const queueInterval = setInterval(() => {
      setQueueNumber((prev) => prev + 1); // Naikkan nomor antrean
      setIsAnimating(true); // Nyalakan animasi

      // Matikan animasi setelah 2.5 detik agar kembali clean
      setTimeout(() => {
        setIsAnimating(false);
      }, 2500);
    }, 10000); // Berganti otomatis setiap 10 detik untuk testing

    return () => clearInterval(queueInterval);
  }, []);

  // Format jam dan tanggal
  const formattedTime = currentTime
    ? currentTime
        .toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/\./g, ":")
    : "--:--:--";

  const formattedDate = currentTime
    ? currentTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Memuat...";

  // Helper untuk format angka (contoh: 58 -> A058)
  const formatQueue = (num: number) => `A${String(num).padStart(3, "0")}`;

  return (
    <>
      <CustomAnimations />
      <div className="h-screen w-screen bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-800">
        {/* ================= HEADER ================= */}
        <header className="h-24 bg-white flex items-center justify-between px-8 shadow-sm relative z-10 shrink-0 border-b border-slate-100">
          {/* Logo Kiri */}
          <div className="flex items-center gap-4 w-1/4">
            <img
              src="/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png"
              alt="Taramedic Logo"
              className="h-18 w-auto object-contain"
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
            <h2 className="text-xl font-medium text-cyan-600 mt-0.5">
              Klinik Taramedic
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
                {formattedDate.split(",")[0]},
              </span>
              <span className="text-sm text-slate-500">
                {formattedDate.split(",")[1]?.trim()}
              </span>
            </div>
          </div>
        </header>

        {/* ================= KONTEN UTAMA ================= */}
        <main className="flex-1 grid grid-cols-12 gap-6 p-6 min-h-0 bg-[#f4f7f9]">
          {/* Kolom Kiri: Antrean (Span 5) */}
          <div className="col-span-5 flex flex-col gap-6 h-full">
            {/* Card Sedang Dipanggil (Animasi Terkontrol) */}
            <div
              className={`flex-1 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700 rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden text-white border-2 transition-all duration-500 ${
                isAnimating
                  ? "border-cyan-300 shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-alert-pulse"
                  : "border-cyan-400/30 shadow-xl shadow-cyan-900/10"
              }`}
            >
              {/* Efek Sapuan Cahaya Kilat (Hanya muncul saat transisi) */}
              {isAnimating && (
                <div className="absolute top-0 left-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-striking-shine z-20"></div>
              )}

              {/* Dekorasi Background Statis */}
              <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center gap-4 relative z-10">
                <div
                  className={`bg-white text-cyan-600 p-2.5 rounded-full shadow-md ${isAnimating ? "animate-bounce" : ""}`}
                >
                  <Volume2 className="w-6 h-6" />
                </div>
                <div className="h-px w-8 bg-white/50"></div>
                <h3 className="text-lg font-semibold tracking-[0.2em] uppercase">
                  Sedang Dipanggil
                </h3>
                <div className="h-px w-8 bg-white/50"></div>
              </div>

              {/* Nomor Antrean (Gunakan key agar animasi re-render saat angka berubah) */}
              <div
                key={queueNumber}
                className={`text-[11rem] leading-none font-bold my-4 relative z-10 tracking-tighter ${
                  isAnimating ? "animate-pop-number" : "drop-shadow-2xl"
                }`}
              >
                {formatQueue(queueNumber)}
              </div>

              <p className="text-lg font-medium tracking-widest uppercase mb-4 relative z-10">
                Silakan Menuju
              </p>

              <div className="bg-white text-cyan-800 px-10 py-4 rounded-2xl flex items-center gap-4 shadow-lg relative z-10">
                <Monitor className="w-8 h-8 text-cyan-600" />
                <span className="text-4xl font-extrabold tracking-wide">
                  LOKET 02
                </span>
              </div>
            </div>

            {/* Card Antrean Berikutnya Dinamis */}
            <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center shrink-0">
              <div className="flex items-center gap-4 w-full justify-center mb-6">
                <div className="h-px flex-1 bg-slate-100"></div>
                <h4 className="text-sm font-bold text-cyan-700 tracking-[0.15em] uppercase">
                  Antrean Berikutnya
                </h4>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>

              <div className="flex w-full gap-4">
                <NextQueueCard number={formatQueue(queueNumber + 1)} />
                <NextQueueCard number={formatQueue(queueNumber + 2)} />
                <NextQueueCard number={formatQueue(queueNumber + 3)} />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Media/Video/Slider (Span 7) */}
          {/* Kolom Kanan: Jadwal Dokter & Info (Span 7) */}
          <div className="col-span-7 flex flex-col gap-6 h-full">
            {/* Card Jadwal Dokter */}
            <div className="flex-1 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 flex flex-col overflow-hidden">
              {/* Header Jadwal */}
              <div className="flex items-center gap-3 mb-6 shrink-0">
                <Calendar className="w-6 h-6 text-cyan-600" />
                <h3 className="text-lg font-bold text-slate-800 tracking-wide uppercase">
                  Jadwal Dokter Hari Ini
                </h3>
              </div>

              {/* Tabel Area (Scrollable) */}
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
                        {/* Kolom Profil Dokter */}
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={doc.img}
                              alt={doc.name}
                              className="w-12 h-12 rounded-full shadow-sm border border-slate-100 object-cover shrink-0"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-sm">
                                {doc.name}
                              </span>
                              <span className="text-xs text-slate-500 mt-0.5">
                                {doc.specialty}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Kolom Label Spesialis */}
                        <td className="py-4">
                          <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                            {doc.specialty}
                          </span>
                        </td>

                        {/* Kolom Jam Praktik */}
                        <td className="py-4 text-center">
                          <span className="text-sm font-bold text-slate-700">
                            {doc.time}
                          </span>
                        </td>

                        {/* Kolom Ruang Poli */}
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

              {/* Footer Keterangan Jadwal */}
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
              <InfoBox
                icon={<Clock className="w-5 h-5" />}
                title="Jam Operasional"
                desc="Senin - Sabtu\n08.00 - 20.00 WIB"
              />
              <InfoBox
                icon={<Calendar className="w-5 h-5" />}
                title="Reservasi Layanan"
                desc="Hubungi kami untuk\nbooking kunjungan"
              />
              <InfoBox
                icon={<MessageCircle className="w-5 h-5" />}
                title="WhatsApp Carezka"
                desc="0812-3456-7890\n(Chat Only)"
              />
              <InfoBox
                icon={<QrCode className="w-5 h-5" />}
                title="Scan untuk Layanan"
                desc="Pindai QR untuk informasi\nlayanan lengkap"
              />
              <InfoBox
                icon={<Headphones className="w-5 h-5" />}
                title="Butuh Bantuan?"
                desc="Tim kami siap membantu Anda\n0812-3456-7890"
                titleColor="text-cyan-700"
              />
            </div>
          </div>
        </main>

        {/* ================= FOOTER INFORMASI ================= */}
        <footer className="shrink-0 flex flex-col">
          {/* Bar Informasi Utama */}
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

          {/* Bar Kontak Bawah */}
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
  icon,
  title,
  desc,
  titleColor = "text-slate-700",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  titleColor?: string;
}) {
  return (
    <div className="bg-white p-3.5 rounded-[1rem] shadow-sm border border-slate-100 flex items-center gap-3">
      <div className="text-cyan-600 bg-cyan-50 p-2 rounded-lg shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className={`text-[11px] font-bold ${titleColor} mb-0.5`}>
          {title}
        </span>
        <span className="text-[10px] text-slate-500 leading-tight whitespace-pre-line">
          {desc.replace(/\\n/g, "\n")}
        </span>
      </div>
    </div>
  );
}

function CustomAnimations() {
  return (
    <style>{`
      /* =========================================================
         PREMIUM UI ANIMATIONS
         ========================================================= */

      /* ---------------------------------------------------------
         Shine Sweep
         Efek cahaya menyapu sekali dari kiri ke kanan
         --------------------------------------------------------- */

      @keyframes striking-shine {
        0% {
          transform: translateX(-160%) skewX(-20deg);
          opacity: 0;
        }

        15% {
          opacity: 0.15;
        }

        35% {
          opacity: 0.65;
        }

        55% {
          opacity: 0.35;
        }

        75% {
          opacity: 0.1;
        }

        100% {
          transform: translateX(180%) skewX(-20deg);
          opacity: 0;
        }
      }

      .animate-striking-shine {
        animation: striking-shine 1.8s
          cubic-bezier(0.22, 1, 0.36, 1)
          forwards;

        will-change: transform, opacity;

        pointer-events: none;
      }


      /* ---------------------------------------------------------
         Soft Alert Pulse
         Pulse lembut untuk notification / alert / important card
         --------------------------------------------------------- */

      @keyframes alert-pulse {
        0% {
          box-shadow:
            0 0 0 0 rgba(6, 182, 212, 0.45);
        }

        35% {
          box-shadow:
            0 0 0 8px rgba(6, 182, 212, 0.18),
            0 0 25px rgba(6, 182, 212, 0.15);
        }

        70% {
          box-shadow:
            0 0 0 18px rgba(6, 182, 212, 0),
            0 0 35px rgba(6, 182, 212, 0.08);
        }

        100% {
          box-shadow:
            0 0 0 0 rgba(6, 182, 212, 0);
        }
      }

      .animate-alert-pulse {
        animation:
          alert-pulse 1.6s
          cubic-bezier(0.4, 0, 0.2, 1)
          2;

        will-change: box-shadow;
      }


      /* ---------------------------------------------------------
         Pop Number
         Untuk angka statistik / total transaksi / revenue
         --------------------------------------------------------- */

      @keyframes pop-number {
        0% {
          transform:
            translateY(8px)
            scale(0.82);

          opacity: 0;

          filter: blur(4px);

          text-shadow:
            0 0 0 rgba(255, 255, 255, 0);
        }

        35% {
          transform:
            translateY(-3px)
            scale(1.08);

          opacity: 1;

          filter: blur(0);

          text-shadow:
            0 0 25px rgba(255, 255, 255, 0.45),
            0 0 50px rgba(6, 182, 212, 0.2);
        }

        60% {
          transform:
            translateY(1px)
            scale(0.99);
        }

        100% {
          transform:
            translateY(0)
            scale(1);

          opacity: 1;

          filter: blur(0);

          text-shadow:
            0 4px 10px rgba(0, 0, 0, 0.15);
        }
      }

      .animate-pop-number {
        animation:
          pop-number 900ms
          cubic-bezier(0.175, 0.885, 0.32, 1.275)
          forwards;

        will-change: transform, opacity, filter;
      }


      /* ---------------------------------------------------------
         Number Glow
         Glow sangat halus setelah angka muncul
         --------------------------------------------------------- */

      @keyframes number-glow {
        0% {
          text-shadow:
            0 0 0 rgba(6, 182, 212, 0);
        }

        40% {
          text-shadow:
            0 0 20px rgba(6, 182, 212, 0.35);
        }

        100% {
          text-shadow:
            0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }

      .animate-number-glow {
        animation:
          number-glow 1.2s
          cubic-bezier(0.4, 0, 0.2, 1)
          forwards;
      }


      /* ---------------------------------------------------------
         Card Entrance
         Untuk card dashboard ketika pertama kali muncul
         --------------------------------------------------------- */

      @keyframes card-enter {
        0% {
          opacity: 0;
          transform:
            translateY(12px)
            scale(0.98);
        }

        100% {
          opacity: 1;
          transform:
            translateY(0)
            scale(1);
        }
      }

      .animate-card-enter {
        animation:
          card-enter 500ms
          cubic-bezier(0.22, 1, 0.36, 1)
          forwards;

        will-change: transform, opacity;
      }


      /* ---------------------------------------------------------
         Smooth Float
         Sangat subtle untuk icon / decorative element
         --------------------------------------------------------- */

      @keyframes smooth-float {
        0%,
        100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-4px);
        }
      }

      .animate-smooth-float {
        animation:
          smooth-float 3s
          ease-in-out
          infinite;

        will-change: transform;
      }


      /* ---------------------------------------------------------
         Success Check
         Cocok untuk status berhasil
         --------------------------------------------------------- */

      @keyframes success-pop {
        0% {
          transform: scale(0.5);
          opacity: 0;
        }

        60% {
          transform: scale(1.15);
          opacity: 1;
        }

        80% {
          transform: scale(0.96);
        }

        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .animate-success-pop {
        animation:
          success-pop 600ms
          cubic-bezier(0.175, 0.885, 0.32, 1.275)
          forwards;
      }


      /* ---------------------------------------------------------
         Subtle Hover Lift
         Untuk card/button
         --------------------------------------------------------- */

      .animate-hover-lift {
        transition:
          transform 250ms cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 250ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .animate-hover-lift:hover {
        transform: translateY(-3px);
      }


      /* ---------------------------------------------------------
         Reduced Motion
         Accessibility
         --------------------------------------------------------- */

      @media (prefers-reduced-motion: reduce) {
        .animate-striking-shine,
        .animate-alert-pulse,
        .animate-pop-number,
        .animate-number-glow,
        .animate-card-enter,
        .animate-smooth-float,
        .animate-success-pop {
          animation: none !important;
        }

        .animate-hover-lift {
          transition: none !important;
        }
      }
    `}</style>
  );
}
