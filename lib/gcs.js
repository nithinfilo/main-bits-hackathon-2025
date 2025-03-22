import { Storage } from '@google-cloud/storage';
import fs from 'fs'; // Import fs to read the JSON file

// Read the GCS credentials from the .json file path
const gcsCredentialsPath = process.env.GCS_CREDENTIALS_PATH; // Use an environment variable for the path to the .json file
const gcsCredentials = JSON.parse(fs.readFileSync(gcsCredentialsPath, 'utf8'));

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: gcsCredentials, // Use the parsed JSON from the credentials file
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

export async function uploadFile(file) {
  const blob = bucket.file(file.name);
  const blobStream = blob.createWriteStream();

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
}
