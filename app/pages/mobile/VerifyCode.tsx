import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { OTPInput, SlotProps } from 'input-otp';
import PageHeader from '@/components/PageHeader';
import { EnvelopeIllustration } from '@/components/MedicalIllustration';

function Slot(props: SlotProps) {
  return (
    <motion.div
      whileFocus={{ scale: 1.08 }}
      className={`w-11 h-14 border-2 rounded-xl flex items-center justify-center text-xl font-bold transition-all ${
        props.isActive
          ? 'border-primary bg-accent text-primary shadow-sm'
          : props.char
          ? 'border-primary/50 bg-accent/50 text-foreground'
          : 'border-border bg-muted/30 text-foreground'
      }`}
    >
      {props.char ?? <span className="text-muted-foreground/30 text-2xl">–</span>}
    </motion.div>
  );
}

export default function VerifyCodePage() {
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 800));
    setIsVerifying(false);
    setLocation('/reset-password');
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <PageHeader title="Verifikasi Kode" backPath="/forgot-password" />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-sm mx-auto flex flex-col gap-6">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <EnvelopeIllustration className="w-44 h-36" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-title">
                Verifikasi Kode
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Masukkan kode verifikasi yang telah kami kirimkan ke email Anda.
              </p>
            </div>
          </motion.div>

          {/* Email info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center justify-between p-3 bg-accent rounded-xl"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs text-primary font-bold">@</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email terkirim ke</p>
                <p className="text-sm font-semibold text-foreground" data-testid="text-email">
                  andi.wijaya@email.com
                </p>
              </div>
            </div>
            <button data-testid="button-change-email" className="text-xs text-primary font-semibold hover:underline">
              Ubah
            </button>
          </motion.div>

          {/* OTP Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <OTPInput
              maxLength={6}
              value={otp}
              onChange={setOtp}
              data-testid="input-otp"
              render={({ slots }: { slots: SlotProps[] }) => (
                <div className="flex gap-2">
                  {slots.map((slot, i) => (
                    <Slot key={i} {...slot} />
                  ))}
                </div>
              )}
            />

            {/* Countdown */}
            <p className="text-sm text-muted-foreground" data-testid="text-countdown">
              {countdown > 0 ? (
                <>Kirim ulang kode dalam <span className="font-semibold text-foreground">0:{String(countdown).padStart(2, '0')}</span></>
              ) : (
                <button
                  data-testid="button-resend"
                  onClick={() => setCountdown(45)}
                  className="text-primary font-semibold hover:underline"
                >
                  Kirim ulang kode
                </button>
              )}
            </p>
          </motion.div>

          {/* Verify button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleVerify}
            data-testid="button-verify"
            disabled={otp.length < 6 || isVerifying}
            className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-full text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/25 hover:bg-blue-600 transition-colors disabled:opacity-60"
          >
            {isVerifying ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Verifikasi
          </motion.button>
        </div>
      </div>
    </div>
  );
}
