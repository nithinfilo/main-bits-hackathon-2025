import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { stringify } from 'csv-stringify/sync';

// Configure Google Cloud Storage with environment variables
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id: process.env.GCP_PRIVATE_KEY_ID,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle escaped newlines
    client_email: process.env.GCP_CLIENT_EMAIL,
    client_id: process.env.GCP_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.GCP_CLIENT_X509_CERT_URL,
    universe_domain: 'googleapis.com'
  }
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export async function POST(req) {
  try {
    const { username, password, host, port, database, tableName } = await req.json();

    const connection = await mysql.createConnection({
      host,
      port: parseInt(port, 10),
      user: username,
      password,
      database,
    });

    const [rows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 1000`);
    await connection.end();

    // Convert the rows to CSV
    const csv = stringify(rows, { header: true });

    // Upload the CSV to Google Cloud Storage
    const filename = `${uuidv4()}-${tableName}.csv`;
    const file = bucket.file(filename);

    await file.save(Buffer.from(csv), {
      metadata: {
        contentType: 'text/csv',
      },
      resumable: false, // Disable resumable uploads
    });

    // Generate a signed URL valid for 1 hour
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error querying MySQL and uploading to GCS:', error);
    return NextResponse.json({ error: 'Failed to query database and upload results' }, { status: 500 });
  }
}