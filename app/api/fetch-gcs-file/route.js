// app/api/fetch-gcs-file/route.js
import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
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

    const bucketName = process.env.GCS_BUCKET_NAME;
    
    // Extract the file name from the URL, ignoring query parameters
    const urlParts = new URL(url);
    const fileName = decodeURIComponent(path.basename(urlParts.pathname));

    console.log('Attempting to fetch file:', fileName);

    const [file] = await storage.bucket(bucketName).file(fileName).download();
    const [metadata] = await storage.bucket(bucketName).file(fileName).getMetadata();

    console.log('File fetched successfully');
    console.log('Metadata:', metadata);

    let contentType = metadata.contentType;
    
    // If content type is not set or is generic, try to infer from file extension
    if (!contentType || contentType === 'application/octet-stream') {
      const ext = path.extname(fileName).toLowerCase();
      if (ext === '.csv') {
        contentType = 'text/csv';
      } else if (ext === '.json') {
        contentType = 'application/json';
      }
    }

    const content = file.toString('utf-8');
    console.log('File content preview:', content.slice(0, 200)); // Log the first 200 characters

    return NextResponse.json({
      content,
      contentType,
      fileName,
      size: metadata.size,
      updated: metadata.updated,
    });
  } catch (error) {
    console.error('Error fetching file from GCS:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch file from GCS', 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}