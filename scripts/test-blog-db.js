
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function testBlogCreation() {
    if (!process.env.POSTGRES_URL) {
        console.error("❌ POSTGRES_URL not found");
        return;
    }

    const sql = neon(process.env.POSTGRES_URL);

    // 1. Check table structure (by inspecting information_schema)
    console.log("🔍 Inspecting 'blogs' table columns...");
    try {
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'blogs';
        `;
        console.table(columns);
    } catch (e) {
        console.error("❌ Failed to inspect table:", e.message);
    }

    // 2. Try to insert a dummy blog
    console.log("\n🚀 Attempting to insert test blog...");
    const blog = {
        title: "Test Blog " + Date.now(),
        slug: "test-blog-" + Date.now(),
        content: "This is a test content.",
        excerpt: "Test excerpt",
        cover_image: "https://example.com/image.jpg",
        author_email: "admin@virezo.com",
        published: true
    };

    try {
        const result = await sql`
            INSERT INTO blogs (title, slug, content, excerpt, cover_image, author_email, published)
            VALUES (${blog.title}, ${blog.slug}, ${blog.content}, ${blog.excerpt}, ${blog.cover_image}, ${blog.author_email}, ${blog.published})
            RETURNING *;
        `;
        console.log("✅ Blog created successfully:", result[0].id);

        // Cleanup
        await sql`DELETE FROM blogs WHERE id = ${result[0].id}`;
        console.log("valid cleanup");
    } catch (e) {
        console.error("❌ INSERT FAILED:", e.message);
        console.error("   Detail:", e);
    }
}

testBlogCreation();
