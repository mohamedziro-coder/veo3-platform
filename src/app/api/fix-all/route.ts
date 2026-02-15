import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { Storage } from '@google-cloud/storage';
import { getVertexConfigAsync } from '@/lib/config';

export async function GET() {
    const results: any = {
        database: { status: 'pending', message: '' },
        cors: { status: 'pending', message: '' },
        admin: { status: 'pending', message: '' }
    };

    try {
        // 1. Database Setup
        if (!process.env.POSTGRES_URL) {
            results.database = { status: 'error', message: 'POSTGRES_URL missing' };
        } else {
            try {
                const sql = neon(process.env.POSTGRES_URL);
                await sql`
                    CREATE TABLE IF NOT EXISTS page_content (
                        id SERIAL PRIMARY KEY,
                        slug TEXT NOT NULL,
                        key TEXT NOT NULL,
                        content TEXT,
                        type TEXT DEFAULT 'text',
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE(slug, key)
                    );
                `;
                results.database = { status: 'success', message: 'Table page_content verified/created' };
            } catch (error: any) {
                results.database = { status: 'error', message: error.message };
            }
        }

        // 2. GCS CORS Setup
        try {
            const config = await getVertexConfigAsync();
            const storage = new Storage({
                credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                    ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                    : undefined
            });

            let bucketName = process.env.GCS_BUCKET_NAME || config.GCS_BUCKET_NAME;
            if (!bucketName) {
                results.cors = { status: 'skipped', message: 'GCS_BUCKET_NAME not configured' };
            } else {
                bucketName = bucketName.replace(/^gs:\/\//, '').trim();
                const bucket = storage.bucket(bucketName);
                await bucket.setCorsConfiguration([
                    {
                        maxAgeSeconds: 3600,
                        method: ['GET', 'PUT', 'POST', 'OPTIONS'],
                        origin: ['*', 'http://localhost:3000'], // Explicitly add localhost
                        responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
                    },
                ]);
                results.cors = { status: 'success', message: `CORS configured for ${bucketName}` };
            }
        } catch (error: any) {
            results.cors = { status: 'error', message: error.message };
        }

        // 3. Admin Promotion
        if (!process.env.POSTGRES_URL) {
            results.admin = { status: 'skipped', message: 'No DB connection' };
        } else {
            const adminEmail = "m.amine.elamraoui1@gmail.com";
            try {
                const sql = neon(process.env.POSTGRES_URL);
                const result = await sql`
                    UPDATE users 
                    SET role = 'admin' 
                    WHERE LOWER(email) = ${adminEmail.toLowerCase()}
                    RETURNING email, role
                `;
                if (result.length > 0) {
                    results.admin = { status: 'success', message: `User promoted to admin` };
                } else {
                    results.admin = { status: 'warning', message: `User ${adminEmail} not found` };
                }
            } catch (error: any) {
                results.admin = { status: 'error', message: error.message };
            }
        }

        return NextResponse.json(results);

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
