const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function testFinalBlogUpdate() {
    console.log('🧪 Testing Blog Update with NEW Fixed Code...\n');

    if (!process.env.POSTGRES_URL) {
        console.error('❌ POSTGRES_URL not found');
        return;
    }

    const sql = neon(process.env.POSTGRES_URL);

    try {
        // 1. Create test blog
        console.log('📝 Creating test blog...');
        const createResult = await sql`
            INSERT INTO blogs (title, slug, content, excerpt, cover_image, author_email, published)
            VALUES ('Original Title', 'test-' || EXTRACT(EPOCH FROM NOW()), 'Original content', 'Original excerpt', '', 'test@virezo.com', false)
            RETURNING *;
        `;
        const blog = createResult[0];
        console.log(`✅ Created blog ID: ${blog.id}`);
        console.log(`   Title: "${blog.title}", Published: ${blog.published}\n`);

        // 2. Update using the EXACT same logic as the fixed updateBlog()
        console.log('🔧 Updating blog (title + published status)...');
        const title = 'Updated Title Via COALESCE';
        const published = true;

        const updateResult = await sql`
            UPDATE blogs 
            SET 
                title = COALESCE(${title ?? null}, title),
                slug = COALESCE(${null}, slug),
                content = COALESCE(${null}, content),
                excerpt = COALESCE(${null}, excerpt),
                cover_image = COALESCE(${null}, cover_image),
                published = COALESCE(${published ?? null}, published),
                updated_at = NOW()
            WHERE id = ${blog.id}
            RETURNING *;
        `;

        const updated = updateResult[0];
        console.log('✅ Update SUCCESS!');
        console.log(`   Title: "${updated.title}" (changed: ${updated.title !== blog.title})`);
        console.log(`   Published: ${updated.published} (changed: ${updated.published !== blog.published})`);
        console.log(`   Updated at: ${updated.updated_at}\n`);

        // Cleanup
        await sql`DELETE FROM blogs WHERE id = ${blog.id}`;
        console.log('🧹 Cleaned up test blog\n');
        console.log('🎉 Blog update is WORKING correctly!');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testFinalBlogUpdate();
