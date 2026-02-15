
import { Storage } from '@google-cloud/storage';
import { getVertexConfigAsync } from '../src/lib/config';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function fixCors() {
    console.log('Starting CORS fix...');
    try {
        const config = await getVertexConfigAsync();
        const storage = new Storage({
            credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                : undefined
        });

        let bucketName = process.env.GCS_BUCKET_NAME || config.GCS_BUCKET_NAME;
        if (!bucketName) {
            console.error('Error: GCS_BUCKET_NAME not configured');
            process.exit(1);
        }
        bucketName = bucketName.replace(/^gs:\/\//, '').trim();

        console.log(`Target Bucket: ${bucketName}`);
        const bucket = storage.bucket(bucketName);

        // Check if bucket exists
        const [exists] = await bucket.exists();
        if (!exists) {
            console.error(`Bucket ${bucketName} does not exist!`);
            process.exit(1);
        }

        console.log('Setting CORS configuration...');
        await bucket.setCorsConfiguration([
            {
                maxAgeSeconds: 3600,
                method: ['GET', 'PUT', 'POST', 'OPTIONS'],
                origin: ['*'], // Allow all origins
                responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
            },
        ]);

        console.log('✅ CORS configuration updated successfully!');
        console.log('You may need to wait a few minutes for changes to propagate.');

    } catch (error: any) {
        console.error("❌ CORS Setup Failed:", error);
        process.exit(1);
    }
}

fixCors();
