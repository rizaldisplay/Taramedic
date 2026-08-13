'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { ClinicIllustration } from '@/components/MedicalIllustration';

export default function SplashPage() {
    const router = useRouter();

    return (
        <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-6 py-10">
            <div className="w-full max-w-sm flex flex-col items-center gap-6">

                {/* Logo */}
                <motion.div
                    // initial={false} melembagakan render awal tanpa inline style opacity:0
                    initial={{ y: -10 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg shadow-primary/30">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
                            <path d="M24 4L8 10V24C8 34 16 42 24 44C32 42 40 34 40 24V10L24 4Z" fill="white" opacity="0.15" />
                            <path d="M24 4L8 10V24C8 34 16 42 24 44C32 42 40 34 40 24V10L24 4Z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" />
                            <rect x="21" y="14" width="6" height="20" fill="white" rx="2" />
                            <rect x="14" y="21" width="20" height="6" fill="white" rx="2" />
                            <path d="M21.5 34C21.5 34 18 31.5 18 29.5C18 28.1 19.1 27 20.5 27C21.2 27 21.9 27.3 22.3 27.8L24 29.5L25.7 27.8C26.1 27.3 26.8 27 27.5 27C28.9 27 30 28.1 30 29.5C30 31.5 26.5 34 24 36C22.3 35 21.5 34 21.5 34Z" fill="#EF4444" />
                        </svg>
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground leading-tight" data-testid="text-app-name">
                            Klinik Sehat Sentosa
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-[240px] text-center mx-auto" data-testid="text-tagline">
                            Sistem informasi manajemen klinik terintegrasi dan aman
                        </p>
                    </div>
                </motion.div>

                {/* Clinic Illustration */}
                <motion.div
                    initial={{ y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full"
                >
                    <ClinicIllustration className="w-full h-44 rounded-2xl" />
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="w-full flex flex-col gap-3"
                >
                    <Link href="/login?role=admin" className="w-full">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            data-testid="button-login"
                            className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-full text-base shadow-md shadow-primary/25 hover:bg-blue-600 transition-colors"
                        >
                            Login
                        </motion.button>
                    </Link>

                    <Link href="/login?role=petugas" className="w-full">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            data-testid="button-petugas"
                            className="w-full py-3.5 border-2 border-primary text-primary font-semibold rounded-full text-base flex items-center justify-center gap-2 hover:bg-accent transition-colors"
                        >
                            <User className="w-4 h-4" />
                            Masuk sebagai Petugas
                        </motion.button>
                    </Link>

                </motion.div>

                {/* Version */}
                <motion.p
                    initial={{ y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-xs text-muted-foreground/60"
                    data-testid="text-version"
                >
                    Versi 1.0.0
                </motion.p>
            </div>
        </div>
    );
}