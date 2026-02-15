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

    await sql`
        INSERT INTO page_content (slug, key, content, type)
        VALUES (${slug}, ${key}, ${content}, ${type})
        ON CONFLICT (slug, key) 
        DO UPDATE SET content = ${content}, updated_at = NOW();
     `;

    return true;
}
