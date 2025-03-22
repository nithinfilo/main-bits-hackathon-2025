import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

export async function GET(req) {
  const accessToken = cookies().get('google_access_token');

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated with Google' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get('documentId');

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken.value });

  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: documentId,
      fields: 'sheets.properties',
    });

    const sheetList = response.data.sheets.map((sheet) => ({
      id: sheet.properties.sheetId,
      name: sheet.properties.title,
    }));

    return NextResponse.json({ sheets: sheetList });
  } catch (error) {
    console.error('Error fetching Google Sheet details:', error);
    return NextResponse.json({ error: 'Failed to fetch Google Sheet details' }, { status: 500 });
  }
}