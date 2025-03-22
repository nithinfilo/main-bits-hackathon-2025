// app/api/google-sheets/list/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

export async function POST(req) {
  const accessToken = cookies().get('google_access_token');

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated with Google' }, { status: 401 });
  }

  const { url } = await req.json();

  try {
    const spreadsheetId = extractSpreadsheetId(url);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken.value });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });

    const sheetList = response.data.sheets.map((sheet) => ({
      id: sheet.properties.sheetId,
      name: sheet.properties.title,
    }));

    return NextResponse.json({ sheets: sheetList });
  } catch (error) {
    console.error('Error fetching Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to fetch Google Sheets' }, { status: 500 });
  }
}

function extractSpreadsheetId(url) {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) {
    throw new Error('Invalid Google Sheets URL');
  }
  return match[1];
}