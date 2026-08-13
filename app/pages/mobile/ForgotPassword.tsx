import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { User, Send } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { PadlockIllustration } from '@/components/MedicalIllustration';

const forgotSchema = z.object({
  email: z.string().min(1, 'Email atau username wajib diisi'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (_data: ForgotForm) => {
    await new Promise(r => setTimeout(r, 800));
    setLocation('/verify-code');
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <PageHeader title="Lupa Password" backPath="/login" />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-sm mx-auto flex flex-col gap-6">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <PadlockIllustration className="w-36 h-36" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-title">
                Lupa Password?
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Masukkan email atau username Anda. Kami akan mengirimkan link reset password ke email Anda.
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
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email atau Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="email"
                  {...register('email')}
                  data-testid="input-email"
                  placeholder="Masukkan email atau username"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive" data-testid="error-email">{errors.email.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              data-testid="button-send-reset"
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-full text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/25 hover:bg-blue-600 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Kirim Link Reset
            </motion.button>
          </motion.form>

          {/* Back to login */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center text-sm text-muted-foreground"
          >
            Ingat password Anda?{' '}
            <Link href="/login" data-testid="link-back-to-login" className="text-primary font-medium hover:underline">
              Kembali ke halaman login
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
