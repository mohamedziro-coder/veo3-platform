import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Manual env parsing since dotenv failed
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').forEach(line => {
            const [key, ...values] = line.split('=');
            if (key && values.length > 0) {
                const val = values.join('=').trim().replace(/^["'](.*)["']$/, '$1'); // clean quotes
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
        console.error("POSTGRES_URL missing even after manual load");
        // Try fallback to standard .env if needed, but error for now
        process.exit(1);
    }

    try {
        const sql = neon(process.env.POSTGRES_URL);
        console.log("Connected to DB, running migration...");

        // exact copy of the migration logic for page_content
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

        await sql`
            CREATE INDEX IF NOT EXISTS idx_page_content_slug ON page_content(slug);
        `;

        console.log("Migration successful: page_content table created.");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

main();
