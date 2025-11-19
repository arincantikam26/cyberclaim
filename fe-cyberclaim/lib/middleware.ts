// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const roleAccessMap = {
  superadmin: ['dashboard', 'claim', 'validation', 'verification', 'fraud', 'tindakan', 'diagnosa', 'tarif', 'faskes', 'doctor', 'patient', 'users', 'analytics', 'profile'],
  admin: ['dashboard', 'claim', 'validation', 'verification', 'fraud', 'users', 'analytics', 'profile'],
  faskes: ['dashboard', 'claim', 'validation', 'verification', 'profile']
};

export function middleware(req: NextRequest) {
  const session = req.cookies.get('session');

  if (!session) return NextResponse.next();

  let user;
  try {
    user = JSON.parse(session.value);
  } catch {
    return NextResponse.next();
  }

  const { role } = user;
  const path = req.nextUrl.pathname.split('/')[1];

  // allow public pages
  if (path === '' || path === 'auth') return NextResponse.next();

  const allowed = roleAccessMap[role] ?? [];

  if (!allowed.includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/(.*)'],
};
