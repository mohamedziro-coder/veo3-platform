const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function initializeDatabase() {
    console.log('🔧 Initializing Virezo Database...\n');

    if (!process.env.POSTGRES_URL) {
        console.error('❌ POSTGRES_URL not found');
        return;
    }

    const sql = neon(process.env.POSTGRES_URL);

    try {
        // 1. Create users table if needed
        console.log('📊 Setting up users table...');
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                credits INTEGER DEFAULT 100,
                is_verified BOOLEAN DEFAULT FALSE,
                verification_token TEXT,
                signup_ip TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('✅ Users table ready\n');

        // 2. Create activity table
        console.log('📊 Setting up activity table...');
        await sql`
            CREATE TABLE IF NOT EXISTS activity (
                id SERIAL PRIMARY KEY,
                user_email TEXT NOT NULL,
                user_name TEXT,
                tool TEXT NOT NULL,
                details TEXT,
                result_url TEXT,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('✅ Activity table ready\n');

        // 3. Create blogs table
        console.log('📊 Setting up blogs table...');
        await sql`
            CREATE TABLE IF NOT EXISTS blogs (
                id SERIAL PRIMARY KEY,
                slug TEXT UNIQUE NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                cover_image TEXT,
                published BOOLEAN DEFAULT FALSE,
                author_email TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('✅ Blogs table ready\n');

        // 4. Create system_settings table
        console.log('📊 Setting up system_settings table...');
        await sql`
            CREATE TABLE IF NOT EXISTS system_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
        `;
        console.log('✅ System settings table ready\n');

        console.log('🎉 Database initialization complete!');
        console.log('\n📝 Next steps:');
        console.log('   1. Start dev server: npm run dev');
        console.log('   2. Go to: http://localhost:3000/admin/blogs');
        console.log('   3. Try creating and publishing a blog!\n');

    } catch (error) {
        console.error('❌ Error initializing database:', error);
    }
}

initializeDatabase();
