import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    message: 'User logged out successfully!',
  });

  // clear cookie
  response.cookies.set('next-auth-token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return response;
}
