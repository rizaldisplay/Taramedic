import React from 'react';
import AuthSidebar from '@/features/auth/components/AuthSidebar';
import LoginForm from '@/features/auth/components/LoginForm';

const LoginPage = () => {
  return (
    <main className="min-h-screen flex">
      {/* Sisi Kiri - Sidebar (Tampil di Desktop) */}
      <AuthSidebar />

      {/* Sisi Kanan - Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 lg:bg-white min-h-screen lg:min-h-0">
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;