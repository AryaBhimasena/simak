// /middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { cookies } = request;
  const authToken = cookies.get('authToken')?.value || null;
  const userRole = cookies.get('userRole')?.value || null;

  const { pathname } = request.nextUrl;

  // Kalau belum login → redirect ke /login
  if (!authToken && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Daftar akses per path
  const roleAccess = {
    '/admin': ['admin', 'superadmin'],
    '/staff': ['staff', 'admin', 'superadmin'],
    '/pengaturan': ['admin', 'staff', 'superadmin'], // contoh tambahan
  };

  // Cek akses berdasarkan prefix path
  for (const prefix in roleAccess) {
    if (pathname.startsWith(prefix)) {
      if (!roleAccess[prefix].includes(userRole)) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Middleware aktif hanya di route ini
export const config = {
  matcher: [
    '/admin/:path*',
    '/staff/:path*',
    '/pengaturan/:path*',
  ],
};
