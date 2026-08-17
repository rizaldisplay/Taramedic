// app/page.tsx
import Link from 'next/link';

export default function RootPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Sistem Informasi Klinik
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Selamat datang di platform manajemen layanan kesehatan klinik. Silakan masuk untuk mengakses dasbor operasi dan rekam medis.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Masuk ke Sistem
          </Link>
        </div>
      </div>
    </main>
  );
}