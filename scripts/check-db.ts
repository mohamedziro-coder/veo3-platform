import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').forEach(line => {
            const [key, ...values] = line.split('=');
            if (key && values.length > 0) {
                const val = values.join('=').trim().replace(/^["'](.*)["']$/, '$1');
                if (!process.env[key.trim()]) {
                    process.env[key.trim()] = val;
                }
            }
        });
    }
}

async function main() {
    loadEnv();
    if (!process.env.POSTGRES_URL) {
        console.error("POSTGRES_URL missing");
        process.exit(1);
    }

    try {
        const sql = neon(process.env.POSTGRES_URL);
        const result = await sql`
            SELECT to_regclass('public.page_content');
        `;

        console.log("Table check result:", result);

        if (result[0].to_regclass) {
            console.log("✅ page_content table EXISTS!");
        } else {
            console.error("❌ page_content table MISSING! You must run the migration.");
            // Try to auto-create if missing
            console.log("Attempting auto-creation...");
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
            console.log("✅ Created page_content table.");
        }
    } catch (error) {
        console.error("DB Connection Failed:", error);
    }
}

main();
