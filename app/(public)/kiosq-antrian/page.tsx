'use client';

import React, { useState, useEffect } from 'react';
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
  Clock
} from 'lucide-react';

export default function QueueBoard() {
  // State untuk jam digital agar real-time
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date()); // Set initial time on client
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format jam dan tanggal (Bahasa Indonesia)
  const formattedTime = currentTime 
    ? currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
    : '--:--';
  
  const formattedDate = currentTime
    ? currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'Memuat...';

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
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-wide uppercase">Papan Antrean</h1>
            <div className="h-px w-12 bg-cyan-600/30"></div>
          </div>
          <h2 className="text-xl font-medium text-cyan-600 mt-0.5">Klinik Taramedic</h2>
        </div>

        {/* Jam & Tanggal Kanan */}
        <div className="flex items-center justify-end gap-4 w-1/4">
          <div className="flex items-center gap-3 text-cyan-700">
            <Clock className="w-8 h-8" />
            <span className="text-5xl font-bold tracking-tight">{formattedTime}</span>
          </div>
          <div className="h-12 w-px bg-slate-200 mx-2"></div>
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-700">
              {formattedDate.split(',')[0]},
            </span>
            <span className="text-sm text-slate-500">
              {formattedDate.split(',')[1]?.trim()}
            </span>
          </div>
        </div>
      </header>

      {/* ================= KONTEN UTAMA ================= */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6 min-h-0 bg-[#f4f7f9]">
        
        {/* Kolom Kiri: Antrean (Span 5) */}
        <div className="col-span-5 flex flex-col gap-6 h-full">
          
          {/* Card Sedang Dipanggil */}
          <div className="flex-1 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700 rounded-[2rem] shadow-xl shadow-cyan-900/10 p-8 flex flex-col items-center justify-center relative overflow-hidden text-white border border-cyan-400/30">
            {/* Dekorasi Background */}
            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-white text-cyan-600 p-2.5 rounded-full shadow-md">
                <Volume2 className="w-6 h-6" />
              </div>
              <div className="h-px w-8 bg-white/50"></div>
              <h3 className="text-lg font-semibold tracking-[0.2em] uppercase">Sedang Dipanggil</h3>
              <div className="h-px w-8 bg-white/50"></div>
            </div>

            <div className="text-[11rem] leading-none font-bold my-4 drop-shadow-2xl relative z-10 tracking-tighter">
              A058
            </div>

            <p className="text-lg font-medium tracking-widest uppercase mb-4 relative z-10">
              Silakan Menuju
            </p>
            
            <div className="bg-white text-cyan-800 px-10 py-4 rounded-2xl flex items-center gap-4 shadow-lg relative z-10">
              <Monitor className="w-8 h-8 text-cyan-600" />
              <span className="text-4xl font-extrabold tracking-wide">LOKET 02</span>
            </div>
          </div>

          {/* Card Antrean Berikutnya */}
          <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center shrink-0">
            <div className="flex items-center gap-4 w-full justify-center mb-6">
              <div className="h-px flex-1 bg-slate-100"></div>
              <h4 className="text-sm font-bold text-cyan-700 tracking-[0.15em] uppercase">Antrean Berikutnya</h4>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>

            <div className="flex w-full gap-4">
              <NextQueueCard number="A059" />
              <NextQueueCard number="A060" />
              <NextQueueCard number="A061" />
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Media/Video/Slider (Span 7) */}
        <div className="col-span-7 bg-slate-200 rounded-[2rem] overflow-hidden relative shadow-lg shadow-slate-200/50 border border-slate-100 h-full">
          {/* Ganti src ini dengan video looping profil klinik atau gambar lobby */}
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop" 
            alt="Lobby Klinik" 
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient tipis agar tidak terlalu silau */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
        </div>

      </main>

      {/* ================= FOOTER INFORMASI ================= */}
      <footer className="shrink-0 flex flex-col">
        {/* Bar Informasi Utama */}
        <div className="bg-white px-8 py-5 flex items-center gap-8 border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] relative z-10">
          
          <div className="flex items-center gap-2 bg-cyan-700 text-white px-5 py-2.5 rounded-full shrink-0 shadow-md">
            <div className="bg-white text-cyan-700 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs">i</div>
            <span className="font-bold tracking-widest text-sm">INFORMASI</span>
          </div>

          <div className="h-10 w-px bg-slate-200 shrink-0"></div>

          <div className="flex-1 flex justify-between items-center text-slate-600 text-[13px] font-medium px-4">
            <div className="flex items-center gap-3 w-1/3 pr-4">
              <Users className="w-5 h-5 text-cyan-600 shrink-0" />
              <p className="leading-snug">Terima kasih telah mempercayakan kesehatan Anda kepada Taramedic.</p>
            </div>
            <div className="w-px h-8 bg-slate-200 shrink-0"></div>
            <div className="flex items-center gap-3 w-1/3 px-4">
              <Calendar className="w-5 h-5 text-cyan-600 shrink-0" />
              <p className="leading-snug">Utamakan antrean sesuai nomor yang dipanggil.</p>
            </div>
            <div className="w-px h-8 bg-slate-200 shrink-0"></div>
            <div className="flex items-center gap-3 w-1/3 pl-4">
              <Bell className="w-5 h-5 text-cyan-600 shrink-0" />
              <p className="leading-snug">Jika nomor Anda terlewat, silakan konfirmasi ke petugas.</p>
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
      <span className="text-4xl font-bold text-slate-800 mb-1 relative z-10">{number}</span>
      <div className="flex items-center gap-2 text-cyan-600/60 relative z-10">
        <div className="h-px w-4 bg-current"></div>
        <Users className="w-4 h-4" />
        <div className="h-px w-4 bg-current"></div>
      </div>
    </div>
  );
}

function CustomAnimations() {
  return (
    <style>{`
      @keyframes sweep {
        0% { left: -100%; }
        100% { left: 200%; }
      }
      .animate-sweep { animation: sweep 2s ease-in-out; }
      @keyframes flare-pulse {
        0% { opacity: 0; transform: translateX(-50%) scaleX(0.5); }
        50% { opacity: 1; transform: translateX(-50%) scaleX(1.2); }
        100% { opacity: 0; transform: translateX(-50%) scaleX(0.5); }
      }
      .animate-flare { animation: flare-pulse 2s ease-in-out; }
    `}</style>
  );
}