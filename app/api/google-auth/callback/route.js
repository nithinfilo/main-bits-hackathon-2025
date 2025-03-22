// app/api/google-auth/callback/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}api/google-auth/callback`
);

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store the access token in an HTTP-only cookie
    cookies().set('google_access_token', tokens.access_token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    });

    // Return an HTML page that sends a message to the opener and closes itself
    return new NextResponse(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
            window.close();
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error getting Google tokens:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

