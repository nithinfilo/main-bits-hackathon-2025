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
    // Handle form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}-${encodeURIComponent(file.name)}`;
    
    // Upload directly using the uploadFromBuffer method
    await bucket.file(filename).save(buffer, {
      contentType: file.type,
      public: false,
      validation: false,
      resumable: false, // Disable resumable uploads for serverless environments
    });

    // Generate a signed URL after upload completes
    const [url] = await bucket.file(filename).getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });

    // Return the URL
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    console.error(error.stack);
    
    // Return detailed error information
    return NextResponse.json({ 
      error: "File upload failed", 
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}