import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, updateVerificationToken } from '@/lib/db';
import { Resend } from 'resend';
import crypto from 'crypto';

const resendInfo = {
    apiKey: process.env.RESEND_API_KEY
};

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Get IP address
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        // Create user
        const user = await createUser(name, email, password, ip);

        if (!user) {
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        // Generate Verification Token
        const token = crypto.randomBytes(32).toString('hex');
        await updateVerificationToken(email, token);

        // Send Verification Email
        // Initialize Resend dynamically to avoid build-time errors if key is missing
        const resend = new Resend(process.env.RESEND_API_KEY);

        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is missing");
            // We could return error, but let's allow signup without verification if key is missing (fallback)
            // or better, fail gracefully. For now, let's try to send.
        }

        await resend.emails.send({
            from: 'Veo 3 <onboarding@resend.dev>', // Use default Resend testing domain or configured domain
            to: email,
            subject: 'Verify your Veo 3 Account',
            html: `
                <h1>Welcome to Veo 3, ${name}!</h1>
                <p>Click the link below to verify your email address and activate your 50 credits:</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}">Verify Email</a>
                <p>If you didn't create an account, you can ignore this email.</p>
            `
        });

        // Return success but indicate verification check needed
        return NextResponse.json({
            success: true,
            message: "verification_required",
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: error.message || 'Registration failed' },
            { status: 500 }
        );
    }
}
