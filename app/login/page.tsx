"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, User } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';

function MicrosoftIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 21" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}
import PageHeader from '@/components/layouts/MobileHeader';
import { LockIllustration } from '@/components/MedicalIllustration';

const loginSchema = z.object({
  username: z.string().min(1, 'Username atau email wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

type LoginForm = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  { label: 'Dokter', username: 'dr.andi', password: 'Demo@1234', role: 'Dokter Umum' },
  { label: 'Petugas', username: 'petugas01', password: 'Demo@1234', role: 'Admin Klinik' },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (_data: LoginForm) => {
    await new Promise(r => setTimeout(r, 800));
    router.push('/dashboard');
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setValue('username', acc.username, { shouldValidate: true });
    setValue('password', acc.password, { shouldValidate: true });
    setShowDemo(false);
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <PageHeader title="Login" backPath="/" />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-sm mx-auto flex flex-col gap-6">
          {/* Illustration */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <LockIllustration className="w-28 h-28" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-welcome">
                Selamat Datang Kembali!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Silakan login untuk melanjutkan</p>
            </div>
          </motion.div>

          {/* Demo Account Banner */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-xl border border-blue-200 bg-blue-50 p-3"
          >
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-between text-sm font-medium text-blue-700"
            >
              <span>🔑 Gunakan Akun Demo</span>
              <span className="text-xs text-blue-500">{showDemo ? 'Tutup ▲' : 'Lihat ▼'}</span>
            </button>
            {showDemo && (
              <div className="mt-2 flex flex-col gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => fillDemo(acc)}
                    className="flex items-center justify-between rounded-lg bg-white border border-blue-100 px-3 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-xs font-semibold text-foreground">{acc.label} — <span className="font-normal text-muted-foreground">{acc.role}</span></p>
                      <p className="text-xs text-muted-foreground mt-0.5">User: <span className="font-mono font-medium text-foreground">{acc.username}</span> · Pass: <span className="font-mono font-medium text-foreground">{acc.password}</span></p>
                    </div>
                    <span className="text-xs text-primary font-medium ml-2 shrink-0">Pakai →</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Form */}
          <motion.form
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="username">
                Username atau Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="username"
                  {...register('username')}
                  data-testid="input-username"
                  placeholder="Masukkan username atau email"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              {errors.username && (
                <p className="text-xs text-destructive" data-testid="error-username">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  {...register('password')}
                  data-testid="input-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-11 py-3 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  data-testid="button-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive" data-testid="error-password">{errors.password.message}</p>
              )}
              <div className="flex justify-end">
                <Link href="/forgot-password" data-testid="link-forgot-password" className="text-xs text-primary font-medium hover:underline">
                  Lupa password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              data-testid="button-submit-login"
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-full text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/25 hover:bg-blue-600 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Login
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex items-center gap-3"
          >
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">atau login dengan</span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* OAuth */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              data-testid="button-google"
              className="w-full py-3 border border-border rounded-xl bg-white text-sm font-medium text-foreground flex items-center justify-center gap-2.5 hover:bg-muted transition-colors shadow-sm"
            >
              <SiGoogle className="w-4 h-4 text-[#4285F4]" />
              Google
            </motion.button>
            {/* <motion.button
              whileTap={{ scale: 0.97 }}
              data-testid="button-microsoft"
              className="w-full py-3 border border-border rounded-xl bg-white text-sm font-medium text-foreground flex items-center justify-center gap-2.5 hover:bg-muted transition-colors shadow-sm"
            >
              <MicrosoftIcon className="w-4 h-4" />
              Microsoft
            </motion.button> */}
          </motion.div>

          {/* Footer */}
          <motion.p
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-center text-sm text-muted-foreground pb-4"
          >
            Belum punya akun?{' '}
            <span className="text-primary font-medium cursor-pointer hover:underline">
              Hubungi Administrator
            </span>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
