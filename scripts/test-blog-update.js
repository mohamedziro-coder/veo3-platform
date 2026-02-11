const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function testBlogUpdate() {
    console.log('🧪 Testing Blog Update Functionality...\n');

    if (!process.env.POSTGRES_URL) {
        console.error('❌ POSTGRES_URL not found');
        return;
    }

    const sql = neon(process.env.POSTGRES_URL);

    try {
        // 1. Create a test blog first
        console.log('📝 Creating test blog...');
        const createResult = await sql`
            INSERT INTO blogs (title, slug, content, excerpt, cover_image, author_email, published)
            VALUES ('Test Blog', 'test-blog-' || EXTRACT(EPOCH FROM NOW()), 'Test content', 'Test excerpt', '', 'test@virezo.com', false)
            RETURNING *;
        `;
        const testBlog = createResult[0];
        console.log(`✅ Created blog ID: ${testBlog.id}\n`);

        // 2. Try to update it using the SAME logic as updateBlog()
        console.log('🔧 Attempting update using current method...');
        const updates = {
            title: 'Updated Title',
            published: true,
            updated_at: new Date()
        };

        try {
            const updateResult = await sql`
                UPDATE blogs 
                SET ${sql(updates)}
               WHERE id = ${testBlog.id}
                RETURNING *;
            `;
            console.log('✅ Update SUCCESS:', updateResult[0]);
        } catch (updateError) {
            console.error('❌ Update FAILED with sql(updates) syntax:', updateError.message);
            console.log('\n🔧 Trying alternative method...\n');

            // Try manual SQL construction
            const manualUpdate = await sql`
                UPDATE blogs
                SET 
                    title = ${updates.title},
                    published = ${updates.published},
                    updated_at = ${updates.updated_at}
                WHERE id = ${testBlog.id}
                RETURNING *;
            `;
            console.log('✅ Manual update SUCCESS:', manualUpdate[0]);
        }

        // Cleanup
        await sql`DELETE FROM blogs WHERE id = ${testBlog.id}`;
        console.log('\n🧹 Cleaned up test blog');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testBlogUpdate();
