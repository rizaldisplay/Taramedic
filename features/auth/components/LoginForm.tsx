/* eslint-disable jsx-a11y/aria-unsupported-elements */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
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
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginCredentials, clearError } from '../authSlice';
import "../auth-login.css";


export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter(); // [UPDATE] Inisialisasi router
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
      dispatch(clearError());
      
      // [UPDATE] Tunggu (await) dispatch selesai untuk mengecek responnya
      const resultAction = await dispatch(loginCredentials({ username, password }));
      
      if (loginCredentials.fulfilled.match(resultAction)) {
        // Jika login berhasil tapi TIDAK ada flag is_2fa (berarti 2FA mati / langsung login)
        if (!resultAction.payload.is_2fa) {
          router.push('/dashboard');
        }
      }
  };

  return (
    <div className="">
        {/* Pesan Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="taramedic-login__form">
          {/* Username Input */}
          <div>
            <label className="taramedic-login__label">
              Username
            </label>
            <div className="taramedic-login__input-wrap">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="taramedic-login__input"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="taramedic-login__label">
              Password
            </label>
            <div className="taramedic-login__input-wrap">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="taramedic-login__input"
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

        <p className="text-slate-400 text-xs font-medium">PT Padat Karya Teknologi . All rights reserved.</p>
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