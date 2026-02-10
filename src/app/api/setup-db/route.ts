import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
    if (!process.env.POSTGRES_URL) {
        return NextResponse.json({ error: "POSTGRES_URL missing" }, { status: 500 });
    }

    try {
        const sql = neon(process.env.POSTGRES_URL);

        // 1. Add is_verified if missing
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_verified') THEN 
                    ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE; 
                END IF; 
            END $$;
        `;

        // 2. Add verification_token if missing
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='verification_token') THEN 
                    ALTER TABLE users ADD COLUMN verification_token TEXT; 
                END IF; 
            END $$;
        `;

        // 3. Add signup_ip if missing (good practice since we saw errors about it)
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='signup_ip') THEN 
                    ALTER TABLE users ADD COLUMN signup_ip TEXT; 
                END IF; 
            END $$;
        `;

        return NextResponse.json({ success: true, message: "Database schema updated successfully" });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
