import { Storage } from '@google-cloud/storage';
import { getVertexConfigAsync } from './config';

/**
 * Upload base64 image to Google Cloud Storage
 * Returns GCS URI (gs://bucket/path)
 */
export async function uploadBase64ToGCS(
    base64Data: string,
    filename: string
): Promise<string> {
    try {
        const config = await getVertexConfigAsync();

        // Initialize GCS client
        const storage = new Storage({
            credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                : undefined
        });

        let bucketName = process.env.GCS_BUCKET_NAME || config.GCS_BUCKET_NAME;

        if (!bucketName) {
            console.error('[GCS] No bucket name configured in env or settings');
            throw new Error('GCS_BUCKET_NAME not configured');
        }

        // Sanitize: Remove gs:// prefix if present and trim whitespace
        bucketName = bucketName.replace(/^gs:\/\//, '').trim();

        if (!bucketName) {
            throw new Error('Invalid GCS bucket name (empty after sanitization)');
        }

        console.log(`[GCS] Using bucket: "${bucketName}"`);

        const bucket = storage.bucket(bucketName);

        // Check if bucket exists, try to create if not
        try {
            const [exists] = await bucket.exists();
            if (!exists) {
                console.log(`[GCS] Bucket ${bucketName} does not exist. Attempting to create...`);
                try {
                    await bucket.create({ location: config.GOOGLE_LOCATION || 'us-central1' });
                    console.log(`[GCS] Bucket ${bucketName} created successfully.`);
                } catch (createError: any) {
                    console.error('[GCS] Failed to create bucket:', createError);
                    throw new Error(`Bucket "${bucketName}" does not exist and could not be created. Please create it manually in Google Cloud Console.`);
                }
            }
        } catch (error: any) {
            console.error('[GCS] Error checking bucket existence:', error);
            // specific handling if we want, or just proceed and let the upload fail if it really doesn't exist
        }

        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        const filePath = `veo-inputs/${timestamp}-${randomId}-${filename}`;
        const file = bucket.file(filePath);

        // Remove data URI prefix if present
        const base64Clean = base64Data.includes(',')
            ? base64Data.split(',')[1]
            : base64Data;

        const buffer = Buffer.from(base64Clean, 'base64');

        console.log(`[GCS] Uploading ${filename} to gs://${bucketName}/${filePath} (${buffer.length} bytes)`);

        await file.save(buffer, {
            metadata: {
                contentType: 'image/jpeg'
            },
            resumable: false
        });

        const gcsUri = `gs://${bucketName}/${filePath}`;
        console.log(`[GCS] Upload successful: ${gcsUri}`);

        return gcsUri;

    } catch (error: any) {
        console.error('[GCS] Upload failed:', error);
        throw new Error(`Failed to upload to GCS: ${error.message}`);
    }
}

/**
 * Check if video file has been generated in GCS output directory
 * Returns public URL if found, null otherwise
 */
export async function checkGcsOutput(operationId: string): Promise<string | null> {
    try {
        const config = await getVertexConfigAsync();
        const storage = new Storage({
            credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                : undefined
        });

        let bucketName = process.env.GCS_BUCKET_NAME || config.GCS_BUCKET_NAME;
        if (!bucketName) return null;
        bucketName = bucketName.replace(/^gs:\/\//, '').trim();

        const bucket = storage.bucket(bucketName);
        const prefix = `veo-outputs/${operationId}/`;

        console.log(`[GCS] Checking for outputs in: gs://${bucketName}/${prefix}`);

        const [files] = await bucket.getFiles({ prefix });

        // Look for any .mp4 file
        const videoFile = files.find(file => file.name.endsWith('.mp4'));

        if (videoFile) {
            const gcsUri = `gs://${bucketName}/${videoFile.name}`;
            console.log(`[GCS] Found generated video: ${gcsUri}`);
            return gcsUriToHttps(gcsUri);
        }

        return null;
    } catch (error) {
        console.error('[GCS] Error checking output:', error);
        return null;
    }
}

/**
 * Get public URL from GCS URI (converts gs:// to https://)
 */
export function gcsUriToHttps(gcsUri: string): string {
    if (gcsUri.startsWith('gs://')) {
        return gcsUri.replace('gs://', 'https://storage.googleapis.com/');
    }
    return gcsUri;
}
