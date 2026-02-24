import { NextRequest, NextResponse } from 'next/server';
import { verifyUser } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        const emailNorm = String(email || '').trim().toLowerCase();

        // Validation
        if (!emailNorm || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Verify user
        const auth = await verifyUser(emailNorm, password);

        if (!auth.ok) {
            if (auth.reason === 'unverified') {
                return NextResponse.json(
                    {
                        error: 'Please verify your email before logging in',
                        verificationRequired: true,
                        verificationLink: `/verify?email=${encodeURIComponent(emailNorm)}`,
                        email: emailNorm
                    },
                    { status: 403 }
                );
            }
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const user = auth.user;

        // Return user data (frontend will store in localStorage for now)
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                credits: user.credits
            }
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Login failed';
        console.error('Login error:', error);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
