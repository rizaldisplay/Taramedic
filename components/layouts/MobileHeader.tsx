'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  backPath?: string;
}

export default function PageHeader({ title, backPath }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back(); // Menggunakan router.back() bawaan Next.js, lebih aman daripada window.history.back()
    }
  };

  return (
    <motion.div
    //   initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 px-4 py-4 bg-white border-b border-border"
    >
      <button
        type="button"
        onClick={handleBack}
        data-testid="button-back"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-accent hover:bg-accent/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-primary" />
      </button>
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
    </motion.div>
  );
}