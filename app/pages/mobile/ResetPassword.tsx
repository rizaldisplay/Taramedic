import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Save, Check, Circle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { PadlockIllustration } from '@/components/MedicalIllustration';

const resetSchema = z.object({
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

type ResetForm = z.infer<typeof resetSchema>;

function getPasswordStrength(password: string) {
  if (!password) return { label: '', color: '', width: '0%' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: 'Lemah', color: 'bg-red-400', width: '25%' };
  if (score === 2) return { label: 'Sedang', color: 'bg-yellow-400', width: '50%' };
  if (score === 3) return { label: 'Kuat', color: 'bg-green-400', width: '75%' };
  return { label: 'Sangat Kuat', color: 'bg-green-500', width: '100%' };
}

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const strength = getPasswordStrength(passwordValue);

  const checks = [
    { label: 'Minimal 8 karakter', met: passwordValue.length >= 8 },
    { label: 'Huruf besar dan kecil', met: /[A-Z]/.test(passwordValue) && /[a-z]/.test(passwordValue) },
    { label: 'Angka', met: /\d/.test(passwordValue) },
    { label: 'Simbol (opsional)', met: /[^A-Za-z0-9]/.test(passwordValue), optional: true },
  ];

  const onSubmit = async (_data: ResetForm) => {
    await new Promise(r => setTimeout(r, 800));
    setLocation('/login');
  };

  const { ref: passwordRef, onChange: passwordOnChange, ...passwordRest } = register('password');

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <PageHeader title="Reset Password" backPath="/verify-code" />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-sm mx-auto flex flex-col gap-6">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <PadlockIllustration className="w-36 h-36" />
            {/* Star decorations */}
            <div className="flex items-center gap-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary opacity-60" />
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-title">
                Buat Password Baru
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Silakan buat password baru yang kuat dan mudah Anda ingat.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  ref={passwordRef}
                  onChange={e => {
                    setPasswordValue(e.target.value);
                    passwordOnChange(e);
                  }}
                  {...passwordRest}
                  data-testid="input-new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password baru"
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
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}

              {/* Strength bar */}
              {passwordValue && (
                <div className="flex flex-col gap-1">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3 }}
                      className={`h-full rounded-full ${strength.color}`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Kekuatan password: <span className="font-semibold text-foreground">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="confirmPassword">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  data-testid="input-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Masukkan ulang password baru"
                  className="w-full pl-10 pr-11 py-3 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  data-testid="button-toggle-confirm"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Checklist */}
            <div className="flex flex-col gap-2 p-3 bg-muted/40 rounded-xl">
              {checks.map((check, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {check.met ? (
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${check.met ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>

            <motion.button
              type="submit"
              data-testid="button-save-password"
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-full text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/25 hover:bg-blue-600 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Password
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
