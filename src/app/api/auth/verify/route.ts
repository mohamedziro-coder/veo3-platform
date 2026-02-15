import { NextRequest, NextResponse } from 'next/server';

const PRIMARY_ADMIN_EMAIL = 'm.amine.elamraoui1@gmail.com';

function getEffectiveRole(email: string): 'admin' | 'user' {
    const allowedAdmin = (process.env.PRIMARY_ADMIN_EMAIL || PRIMARY_ADMIN_EMAIL).trim().toLowerCase();
    return email.trim().toLowerCase() === allowedAdmin ? 'admin' : 'user';
}

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();
        const emailNorm = String(email || '').trim().toLowerCase();
        const codeNorm = String(code || '').trim();

        if (!emailNorm || !codeNorm) {
            return NextResponse.json(
                { error: 'Email and code are required' },
                { status: 400 }
            );
        }

        if (!process.env.POSTGRES_URL) {
            return NextResponse.json({ error: 'POSTGRES_URL is not configured' }, { status: 500 });
        }

        const { neon } = await import('@neondatabase/serverless');
        const sql = neon(process.env.POSTGRES_URL);

        // Verify code
        const users = await sql`
            SELECT id, email, name, role, credits, verification_token 
            FROM users 
            WHERE LOWER(email) = ${emailNorm}
        `;

        if (users.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = users[0];

        if (String(user.verification_token || '').trim() !== codeNorm) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        // Mark as verified
        const updated = await sql`
            UPDATE users 
            SET is_verified = TRUE, verification_token = NULL 
            WHERE id = ${user.id}
            RETURNING id, email, name, role, credits
        `;

        const verifiedUser = updated[0] || user;

        return NextResponse.json({
            success: true,
            user: {
                id: verifiedUser.id,
                name: verifiedUser.name,
                email: verifiedUser.email,
                role: getEffectiveRole(verifiedUser.email),
                credits: verifiedUser.credits,
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
