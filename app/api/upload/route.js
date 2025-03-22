import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

// Critical Fix: Use full service account JSON to avoid newline issues
const serviceAccount = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON);

const storage = new Storage({
  projectId: serviceAccount.project_id,
  credentials: {
    ...serviceAccount,
    private_key: serviceAccount.private_key.replace(/\\n/g, '\n')
  }
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const filename = `${uuidv4()}-${encodeURIComponent(file.name)}`;
    const fileUpload = bucket.file(filename);

    // Emergency upload fix with timeout handling
    await Promise.race([
      fileUpload.save(Buffer.from(buffer), {
        metadata: { contentType: file.type },
        resumable: false,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout')), 10000)
      )
    ]);

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 3600000,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("CRITICAL UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}