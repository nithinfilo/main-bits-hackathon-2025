// app/api/google-auth/check/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const accessToken = cookies().get('google_access_token');
  return NextResponse.json({ isAuthenticated: !!accessToken });
}