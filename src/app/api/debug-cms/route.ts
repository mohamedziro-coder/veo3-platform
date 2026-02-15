import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
    if (!process.env.POSTGRES_URL) {
        return NextResponse.json({ error: "POSTGRES_URL missing" }, { status: 500 });
    }

    try {
        const sql = neon(process.env.POSTGRES_URL);

        // 1. Check if table exists
        const tableCheck = await sql`
            SELECT to_regclass('public.page_content');
        `;
        const tableExists = !!tableCheck[0].to_regclass;

        // 2. Check table schema (columns)
        let columns: any[] = [];
        if (tableExists) {
            columns = await sql`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'page_content';
            `;
        }

        // 3. Check for admin users
        const admins = await sql`
            SELECT email, role FROM users WHERE role = 'admin';
        `;

        return NextResponse.json({
            table_exists: tableExists,
            columns: columns.map(c => c.column_name),
            admin_count: admins.length,
            admins: admins.map(a => a.email),
            env: {
                has_postgres: !!process.env.POSTGRES_URL,
                has_gcs: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
