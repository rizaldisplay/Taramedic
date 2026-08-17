import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Ambil token dari Cookies (rekomendasi terbaik untuk Next.js Middleware)
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Daftar route terproteksi yang membutuhkan autentikasi
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/rekam-medis') ||
                           pathname.startsWith('/devices') ||
                           pathname.startsWith('/audit-logs');

  // 3. Daftar route khusus Guest (Auth Page)
  const isAuthRoute = pathname.startsWith('/login') || 
                      pathname.startsWith('/verify-otp');

  // CASE A: User BELUM LOGIN mencoba akses Route Terproteksi -> Redirect ke /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Simpan URL asal di query param agar bisa auto-redirect setelah login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // CASE B: User SUDAH LOGIN mencoba akses Halaman Auth (/login /verify-otp) -> Redirect ke /dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Izinkan request berlanjut jika tidak melanggar aturan di atas
  return NextResponse.next();
}

/**
 * Matcher Configuration:
 * Menentukan halaman mana saja yang diproses oleh middleware ini.
 * Mengabaikan file statis, API routes bawaan Next.js, _next internal, dan favicon.
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};