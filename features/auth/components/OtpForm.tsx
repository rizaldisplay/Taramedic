'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Headset, 
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyOtp, resetToLoginStep, clearError } from '../authSlice';

export default function OtpFormStandalone() {
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { userIdForOtp, maskedPhone, loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdForOtp) return;

    dispatch(clearError());
    const resultAction = await dispatch(verifyOtp({ user_id: userIdForOtp, otp }));

    // Jika verifikasi OTP sukses, langsung arahkan ke Dashboard
    if (verifyOtp.fulfilled.match(resultAction)) {
      router.push('/dashboard');
    }
  };

  const handleBackToLogin = () => {
    dispatch(resetToLoginStep());
  };

  return (
    // Container utama: Layar penuh, background slate muda, dan konten di tengah
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      
      {/* Card OTP */}
      <div className="w-full max-w-[480px] rounded-[2rem] bg-white p-8 sm:p-10 shadow-2xl shadow-cyan-900/10 border border-slate-100 flex flex-col justify-between relative overflow-hidden">
        
        {/* Aksen Garis Atas */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 to-blue-600"></div>

        <div>
          {/* Bagian Logo Atas */}
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 sm:p-4 rounded-2xl shadow-lg shadow-cyan-500/30 mb-4 mt-2">
               <img
                src="/logo/03%20Taramedic%20Logo%20-%20Full%20Putih%20Main%20Center.png"
                alt="Logo Taramedic"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">TaraMedic</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Sistem Informasi Manajemen Klinik</p>
          </div>

          {/* Informasi Konteks OTP */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-3.5 bg-cyan-50/80 border border-cyan-100 text-cyan-600 rounded-full mb-4 shadow-sm">
              <ShieldCheck className="w-7 h-7" strokeWidth={2} />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">Verifikasi Keamanan</h3>
            <p className="text-sm text-slate-500 mt-2.5 leading-relaxed px-4">
              Kode 6 digit telah dikirimkan ke WhatsApp <br />
              <span className="font-bold text-slate-800">{maskedPhone || 'Anda'}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Form OTP */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3 text-center">
                Masukkan Kode OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Hanya izinkan angka
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 text-center text-3xl sm:text-4xl tracking-[0.4em] sm:tracking-[0.5em] text-slate-900 font-mono font-bold focus:bg-white focus:border-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-600/10 transition-all placeholder:text-slate-300 placeholder:font-normal"
                placeholder="••••••"
              />
            </div>

            <div className="space-y-3 pt-2">
              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full rounded-xl bg-cyan-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 hover:bg-cyan-700 hover:shadow-cyan-600/40 focus:outline-none focus:ring-4 focus:ring-cyan-600/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memverifikasi...
                  </div>
                ) : (
                  <>
                    Verifikasi & Masuk
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Tombol Kembali */}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full rounded-xl bg-white border border-slate-200 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-cyan-600 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all flex items-center justify-center gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:-translate-x-1 transition-all" />
                Kembali ke Login
              </button>
            </div>
          </form>
        </div>

        {/* Footer Support */}
        <div className="mt-10 text-center">
          <div className="flex items-center gap-4 justify-center mb-6">
            <div className="h-px bg-slate-100 flex-grow"></div>
            <span className="text-xs text-slate-400 font-medium bg-white px-2">Butuh bantuan?</span>
            <div className="h-px bg-slate-100 flex-grow"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
            <SupportCard icon={Headset} title="Hubungi Support" value="support@taramedic.id" />
            <SupportCard icon={BookOpen} title="Panduan Pengguna" value="Lihat dokumentasi" />
          </div>

          <p className="text-slate-400 text-xs font-medium">© 2026 TaraMedic. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}

// Sub-komponen untuk Footer Support
interface SupportCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
}

const SupportCard: React.FC<SupportCardProps> = ({ icon: Icon, title, value }) => (
  <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left hover:bg-slate-100 hover:border-slate-200 cursor-pointer transition-all group">
    <div className="p-2 rounded-full bg-white text-cyan-600 shadow-sm border border-slate-100 flex-shrink-0 group-hover:scale-110 transition-transform">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
    </div>
    <div className="overflow-hidden">
      <h5 className="font-semibold text-slate-800 text-[11px] sm:text-xs truncate">{title}</h5>
      <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">{value}</p>
    </div>
  </div>
);