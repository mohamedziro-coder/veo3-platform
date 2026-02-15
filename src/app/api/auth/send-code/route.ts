import { NextRequest, NextResponse } from "next/server";
import { updateVerificationToken, getUserByEmail, setUserResetCode } from '@/lib/db';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
    try {
        const { email, purpose } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Generate a random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store token in DB:
        // - reset flow uses expiring code
        // - verify flow uses verification_token
        if (purpose === 'reset') {
            const stored = await setUserResetCode(email, code, 15);
            if (!stored) {
                return NextResponse.json({ success: false, error: "Failed to store reset code" }, { status: 500 });
            }
        } else {
            const stored = await updateVerificationToken(email, code);
            if (!stored) {
                return NextResponse.json({ success: false, error: "Failed to store verification code" }, { status: 500 });
            }
        }

        // Send via Resend (required)
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, error: "RESEND_API_KEY is not configured" }, { status: 500 });
        }

        const resend = new Resend(apiKey);
        const subject = purpose === 'reset' ? 'Password Reset Code - Virezo' : 'Verification Code - Virezo';
        const bodyMsg = purpose === 'reset' ? 'Use the following code to reset your password:' : 'Use the following code to verify your account:';
        const mail = await resend.emails.send({
            from: 'Virezo <noreply@onlinetooladvisor.com>',
            to: email,
            subject,
            html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><h1>${user.name || 'Virezo User'}</h1><p>${bodyMsg}</p><div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;"><span style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #333;">${code}</span></div><p style="color:#666;font-size:13px;">This code expires in 15 minutes.</p></div>`
        });

        if (mail && typeof mail === 'object' && 'error' in mail && mail.error) {
            return NextResponse.json({ success: false, error: "Failed to send email via Resend" }, { status: 502 });
        }

        return NextResponse.json({
            success: true,
            message: "Code sent successfully"
        });

    } catch (error) {
        console.error("Error sending code:", error);
        return NextResponse.json({ success: false, error: "Failed to send code" }, { status: 500 });
    }
}
