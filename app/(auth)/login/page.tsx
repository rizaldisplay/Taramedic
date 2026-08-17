'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import LoginForm from '@/features/auth/components/AuthForm';
import OtpForm from '@/features/auth/components/OtpForm';

export default function LoginPage() {
  const { step } = useAppSelector((state) => state.auth);

  return (
    <main>
      {step === 'LOGIN' ? <LoginForm /> : <OtpForm />}
    </main>
  );
}