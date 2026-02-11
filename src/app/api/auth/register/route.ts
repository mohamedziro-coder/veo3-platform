import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, updateVerificationToken } from '@/lib/db';
import { Resend } from 'resend';
import crypto from 'crypto';

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

        // Generate 6-Digit Verification Code (OTP)
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("GENERATED_OTP:", token); // Debug log
        await updateVerificationToken(email, token);

        // Send Verification Email
        // Initialize Resend dynamically
        // Fallback to provided key if env var is missing
        const apiKey = process.env.RESEND_API_KEY || 're_2VeZePpi_QqupWcvwheBs8P3Se53re7Be';
        const resend = new Resend(apiKey);

        if (!process.env.RESEND_API_KEY) {
            console.warn("RESEND_API_KEY is missing from env, using fallback key.");
        }

        await resend.emails.send({
            from: 'Virezo <noreply@onlinetooladvisor.com>', // Verified domain
            to: email,
            subject: 'Your Verification Code - Virezo',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Welcome to Virezo, ${name}!</h1>
                    <p>Use the following code to verify your account:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #333;">${token}</span>
                    </div>
                    <p>Enter this code on the signup page to activate your 50 credits.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't create an account, please ignore this email.</p>
                </div>
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
