import { NextRequest, NextResponse } from 'next/server';
import { updateUserPassword, verifyResetCode } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { email, code, newPassword } = await req.json();
        const emailNorm = String(email || '').trim().toLowerCase();
        const codeNorm = String(code || '').trim();

        if (!emailNorm || !codeNorm || !newPassword) {
            return NextResponse.json({ error: 'Email, code and new password are required' }, { status: 400 });
        }

        // Verify code (includes expiry check)
        const isValid = await verifyResetCode(emailNorm, codeNorm);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
        }

        // Update password and clear token
        const ok = await updateUserPassword(emailNorm, newPassword);
        if (!ok) {
            return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Password updated' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: error.message || 'Reset failed' }, { status: 500 });
    }
}
