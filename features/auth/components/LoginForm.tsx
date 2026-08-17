'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Headset,
  BookOpen,
  User,
  AlertCircle
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginCredentials, clearError } from '../authSlice';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginCredentials({ username, password }));
  };

  return (
    <div className="w-full max-w-[480px] rounded-[2rem] bg-white p-8 sm:p-10 shadow-2xl shadow-cyan-900/10 border border-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Aksen Garis Atas */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 to-blue-600"></div>

      <div>
        {/* Logo Mobile / Top Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 rounded-2xl shadow-lg shadow-cyan-500/30 mb-6 mt-2">
            <img
              src="/logo/03%20Taramedic%20Logo%20-%20Full%20Putih%20Main%20Center.png"
              alt="Logo Taramedic"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Greeting */}
          <div className="text-center">
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-2">
              Selamat Datang
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Masuk ke Sistem
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Silakan masukkan kredensial Anda untuk melanjutkan
            </p>
          </div>
        </div>

        {/* Pesan Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:bg-white focus:border-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-600/10 transition-all placeholder:text-slate-400"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-12 py-3.5 text-sm text-slate-900 focus:bg-white focus:border-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-600/10 transition-all placeholder:text-slate-400"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-cyan-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-600 py-3.5 mt-4 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 hover:bg-cyan-700 hover:shadow-cyan-600/40 focus:outline-none focus:ring-4 focus:ring-cyan-600/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Memproses...
              </div>
            ) : (
              <>
                Masuk ke Sistem
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
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
  );
}

// Sub-component SupportCard
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