import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth-edge';

export async function middleware(request) {
  const token = request.cookies.get('next-auth-token')?.value;
  const { pathname } = request.nextUrl;

  // validation
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isProtected = pathname.startsWith('/dashboard');

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (isAuthPage && token) {
    const user = await verifyToken(token);
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
