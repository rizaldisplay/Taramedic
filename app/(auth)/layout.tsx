import React from 'react';

export const metadata = {
  title: 'Autentikasi - Sistem Informasi Klinik',
  description: 'Halaman masuk dan verifikasi autentikasi pengguna klinik',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        {children}
    </div>
  );
}