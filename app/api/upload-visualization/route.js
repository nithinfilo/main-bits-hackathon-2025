// app/api/upload-visualization/route.js
import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

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
    const { rasterData, sessionId } = await req.json();

    if (!rasterData) {
      return NextResponse.json({ error: "No raster data provided" }, { status: 400 });
    }

    // Convert the base64 raster data to a buffer
    const buffer = Buffer.from(rasterData, 'base64');
    
    // Construct the filename with the sessionId and a unique id
    const filename = `visualizations/${sessionId}/${uuidv4()}.png`;
    const file = bucket.file(filename);

    // Save the file to the Google Cloud Storage bucket
    await file.save(buffer, {
      metadata: {
        contentType: 'image/png',
      },
    });

    // Generate a signed URL for the uploaded file, valid for 1 year
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    return NextResponse.json({ imageUrl: url });
  } catch (error) {
    console.error("Error uploading visualization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}