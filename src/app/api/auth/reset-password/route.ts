import { NextRequest, NextResponse } from 'next/server';
import { updateUserPassword } from '@/lib/db';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
    try {
        const { email, code, newPassword } = await req.json();

        if (!email || !code || !newPassword) {
            return NextResponse.json({ error: 'Email, code and new password are required' }, { status: 400 });
        }

        const sql = neon(process.env.POSTGRES_URL!);

        // Verify token
        const users = await sql`
            SELECT id, email, verification_token
            FROM users
            WHERE LOWER(email) = ${email.toLowerCase()}
        `;

        if (users.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = users[0];
        if (!user.verification_token || user.verification_token !== code) {
            return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
        }

        // Update password and clear token
        const ok = await updateUserPassword(email, newPassword);
        if (!ok) {
            return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Password updated' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: error.message || 'Reset failed' }, { status: 500 });
    }
}
