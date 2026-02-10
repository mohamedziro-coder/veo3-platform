import { NextRequest, NextResponse } from 'next/server';
import { verifyUserEmail } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and code are required' },
                { status: 400 }
            );
        }

        const { neon } = require('@neondatabase/serverless');
        const sql = neon(process.env.POSTGRES_URL);

        // Verify code
        const users = await sql`
            SELECT id, email, verification_token 
            FROM users 
            WHERE email = ${email}
        `;

        if (users.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = users[0];

        if (user.verification_token !== code) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        // Mark as verified
        await sql`
            UPDATE users 
            SET is_verified = TRUE, verification_token = NULL 
            WHERE id = ${user.id}
        `;

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                is_verified: true
            }
        });

    } catch (error: any) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: error.message || 'Verification failed' },
            { status: 500 }
        );
    }
}
