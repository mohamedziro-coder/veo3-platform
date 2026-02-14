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

        // 3. Add verification_token if missing
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='verification_token') THEN 
                    ALTER TABLE users ADD COLUMN verification_token TEXT; 
                END IF; 
            END $$;
        `;

        // 3.1 Add reset_code_expiry if missing
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='reset_code_expiry') THEN 
                    ALTER TABLE users ADD COLUMN reset_code_expiry TIMESTAMP WITH TIME ZONE; 
                END IF; 
            END $$;
        `;

        // 3. Add signup_ip if missing
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='signup_ip') THEN 
                    ALTER TABLE users ADD COLUMN signup_ip TEXT; 
                END IF; 
            END $$;
        `;

        // 3.5 Create activity table if missing
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

        // 4. Add result_url to activity table if missing
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activity' AND column_name='result_url') THEN 
                    ALTER TABLE activity ADD COLUMN result_url TEXT; 
                END IF; 
            END $$;
        `;

        // 5. Create blogs table if missing
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

        return NextResponse.json({ success: true, message: "Database schema updated successfully" });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
