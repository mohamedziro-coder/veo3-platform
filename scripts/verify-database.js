const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function verifyDatabaseSetup() {
    console.log('🔍 Verifying Database Configuration...\n');

    // 1. Check if POSTGRES_URL exists
    if (!process.env.POSTGRES_URL) {
        console.error('❌ POSTGRES_URL is NOT set in .env.local');
        console.log('\n📝 To fix this:');
        console.log('   1. Get your connection string from https://console.neon.tech');
        console.log('   2. Add it to .env.local:');
        console.log('      POSTGRES_URL=postgresql://...');
        console.log('   3. Run this script again\n');
        return;
    }

    console.log('✅ POSTGRES_URL is set\n');

    // 2. Test connection
    try {
        const sql = neon(process.env.POSTGRES_URL);
        await sql`SELECT 1`;
        console.log('✅ Database connection successful\n');
    } catch (e) {
        console.error('❌ Database connection failed:', e.message);
        console.log('\n📝 Check that your POSTGRES_URL is correct\n');
        return;
    }

    // 3. Check if blogs table exists
    try {
        const sql = neon(process.env.POSTGRES_URL);
        const result = await sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'blogs'
            );
        `;

        if (result[0].exists) {
            console.log('✅ "blogs" table exists');

            // Show columns
            const columns = await sql`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'blogs'
                ORDER BY ordinal_position;
            `;
            console.log('\n📊 Table structure:');
            console.table(columns);
        } else {
            console.log('⚠️  "blogs" table does NOT exist');
            console.log('\n📝 To create it:');
            console.log('   Visit: http://localhost:3000/api/setup-db');
            console.log('   This will automatically create all required tables\n');
        }
    } catch (e) {
        console.error('❌ Error checking table:', e.message);
    }

    console.log('\n✅ Database setup verification complete!');
}

verifyDatabaseSetup();
