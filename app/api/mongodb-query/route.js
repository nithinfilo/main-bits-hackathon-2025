import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
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
    const { uri, database, collectionName } = await req.json();

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(database);
    const collection = db.collection(collectionName);

    const documents = await collection.find({}).limit(1000).toArray();

    await client.close();

    // Convert the documents to CSV
    const csv = stringify(documents, { header: true });

    // Upload the CSV to Google Cloud Storage
    const filename = `${uuidv4()}-${collectionName}.csv`;
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
    console.error('Error querying MongoDB and uploading to GCS:', error);
    return NextResponse.json({ error: 'Failed to query database and upload results' }, { status: 500 });
  }
}