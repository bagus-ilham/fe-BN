import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Proteksi khusus untuk seluruh rute /admin
  if (url.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      const validUser = process.env.ADMIN_USERNAME || 'admin';
      const validPwd = process.env.ADMIN_PASSWORD || 'rahasia123';

      if (user === validUser && pwd === validPwd) {
        return NextResponse.next(); // Login berhasil
      }
    }

    // Jika belum login atau kredensial salah, tampilkan popup login bawaan browser (Basic Auth)
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Aktifkan middleware ini HANYA untuk halaman admin
  matcher: ['/admin', '/admin/:path*'],
};
