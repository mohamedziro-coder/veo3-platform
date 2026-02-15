import { neon } from '@neondatabase/serverless';

export async function getPageContent(slug: string) {
    if (!process.env.POSTGRES_URL) return {};

    try {
        const sql = neon(process.env.POSTGRES_URL);
        const rows = await sql`
            SELECT key, content, type FROM page_content WHERE slug = ${slug}
        `;

        const contentMap: Record<string, any> = {};
        rows.forEach((row: any) => {
            contentMap[row.key] = row.content;
        });

        return contentMap;
    } catch (e) {
        console.error("Failed to fetch page content", e);
        return {};
    }
}

export async function upsertPageContent(slug: string, key: string, content: string, type: 'text' | 'image' | 'rich-text' = 'text') {
    if (!process.env.POSTGRES_URL) throw new Error("DB not configured");

    const sql = neon(process.env.POSTGRES_URL);

    try {
        await sql`
        INSERT INTO page_content (slug, key, content, type)
        VALUES (${slug}, ${key}, ${content}, ${type})
        ON CONFLICT (slug, key) 
        DO UPDATE SET content = ${content}, updated_at = NOW();
     `;
    } catch (e: any) {
        // If table doesn't exist (Postgres error 42P01), create it and retry
        if (e.code === '42P01' || e.message.includes('page_content" does not exist')) {
            console.log("Creating missing page_content table...");
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
            // Retry upsert
            await sql`
                INSERT INTO page_content (slug, key, content, type)
                VALUES (${slug}, ${key}, ${content}, ${type})
                ON CONFLICT (slug, key) 
                DO UPDATE SET content = ${content}, updated_at = NOW();
             `;
        } else {
            throw e;
        }
    }

    return true;
}
