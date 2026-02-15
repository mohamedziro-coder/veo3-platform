
import { neon } from '@neondatabase/serverless';
import { Storage } from '@google-cloud/storage';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables manually
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    console.log("🚀 Starting Comprehensive System Fix...");

    // 1. Database Setup
    console.log("\n[1/3] Checking Database...");
    if (!process.env.POSTGRES_URL) {
        console.error("❌ POSTGRES_URL is missing in .env.local");
        process.exit(1);
    }
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
        console.log("✅ Database table 'page_content' verified/created.");
    } catch (error: any) {
        console.error("❌ Database Error:", error.message);
    }

    // 2. GCS CORS Setup
    console.log("\n[2/3] Configuring GCS CORS...");
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        console.error("❌ GOOGLE_APPLICATION_CREDENTIALS_JSON is missing");
    } else {
        try {
            const storage = new Storage({
                credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
            });

            // Try to find bucket name
            let bucketName = process.env.GCS_BUCKET_NAME;
            if (!bucketName) {
                // If not in env, try to guess from config if possible, or fail
                // We'll rely on the one in gcs-upload usually, but here request env
                console.warn("⚠️ GCS_BUCKET_NAME not found in .env.local. Skipping CORS.");
            } else {
                bucketName = bucketName.replace(/^gs:\/\//, '').trim();
                const bucket = storage.bucket(bucketName);
                await bucket.setCorsConfiguration([
                    {
                        maxAgeSeconds: 3600,
                        method: ['GET', 'PUT', 'POST', 'OPTIONS'],
                        origin: ['*'],
                        responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
                    },
                ]);
                console.log(`✅ CORS configured for bucket: ${bucketName}`);
            }
        } catch (error: any) {
            console.error("❌ GCS Error:", error.message);
        }
    }

    // 3. Admin Promotion
    console.log("\n[3/3] Promoting Admin...");
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
            console.log(`✅ User ${result[0].email} is now ${result[0].role}.`);
        } else {
            console.warn(`⚠️ User ${adminEmail} not found in database. Sign up first.`);
        }
    } catch (error: any) {
        console.error("❌ Admin Promotion Error:", error.message);
    }

    console.log("\n✨ System Fix Complete!");
}

main().catch(console.error);
