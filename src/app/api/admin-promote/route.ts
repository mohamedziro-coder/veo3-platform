import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const secret = searchParams.get('secret');

    if (secret !== 'veo3-setup-2024') {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
    }

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    if (!process.env.POSTGRES_URL) {
        return NextResponse.json({ error: "POSTGRES_URL missing in server env" }, { status: 500 });
    }

    try {
        const sql = neon(process.env.POSTGRES_URL);

        // Update user role
        const result = await sql`
            UPDATE users 
            SET role = 'admin' 
            WHERE LOWER(email) = ${email.toLowerCase()}
            RETURNING id, email, role
        `;

        if (result.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: result[0],
            message: "User promoted to admin! Please refresh your browser."
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
