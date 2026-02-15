import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { getVertexConfigAsync } from '@/lib/config';

export async function GET() {
    try {
        const config = await getVertexConfigAsync();
        const storage = new Storage({
            credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                : undefined
        });

        let bucketName = process.env.GCS_BUCKET_NAME || config.GCS_BUCKET_NAME;
        if (!bucketName) {
            return NextResponse.json({ error: 'GCS_BUCKET_NAME not configured' }, { status: 500 });
        }
        bucketName = bucketName.replace(/^gs:\/\//, '').trim();

        const bucket = storage.bucket(bucketName);

        await bucket.setCorsConfiguration([
            {
                maxAgeSeconds: 3600,
                method: ['GET', 'PUT', 'POST', 'OPTIONS'],
                origin: ['*'], // Allow all origins (required for direct uploads from browser)
                responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
            },
        ]);

        return NextResponse.json({
            success: true,
            message: `CORS configured for bucket: ${bucketName}`
        });

    } catch (error: any) {
        console.error("CORS Setup Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
