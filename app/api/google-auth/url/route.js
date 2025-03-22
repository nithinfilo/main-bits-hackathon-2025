// app/api/google-auth/url/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}api/google-auth/callback`
);

export async function GET() {
  const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  return NextResponse.json({ url });
}