import { NextRequest, NextResponse } from "next/server";
import { updateVerificationToken, getUserByEmail } from '@/lib/db';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
    try {
        const { email, purpose } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
        }

        // Generate a random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store token in DB for verification or password reset
        await updateVerificationToken(email, code);

        // Optionally send the code via email (if Resend key is present)
        try {
            const apiKey = process.env.RESEND_API_KEY;
            if (apiKey) {
                const resend = new Resend(apiKey);
                const user = await getUserByEmail(email);
                const subject = purpose === 'reset' ? 'Password Reset Code - Virezo' : 'Verification Code - Virezo';
                const bodyMsg = purpose === 'reset' ? 'Use the following code to reset your password:' : 'Use the following code to verify your account:';

                await resend.emails.send({
                    from: 'Virezo <noreply@onlinetooladvisor.com>',
                    to: email,
                    subject,
                    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><h1>${user?.name || 'Virezo User'}</h1><p>${bodyMsg}</p><div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;"><span style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #333;">${code}</span></div></div>`
                });
            } else {
                console.warn('RESEND_API_KEY not set; skipping actual email send');
            }
        } catch (e) {
            console.warn('Email send failed, continuing (token stored):', e);
        }

        // SIMULATION: Log the code to the console (Server-side) for debugging
        console.log("==========================================");
        console.log(`[EMAIL SIMULATION] Sending ${purpose || 'verify'} code to ${email}`);
        console.log(`[CODE] ${code}`);
        console.log("==========================================");

        // Return success and debugCode for development/testing only
        return NextResponse.json({
            success: true,
            message: "Code sent successfully",
            debugCode: code // Remove this in production!
        });

    } catch (error) {
        console.error("Error sending code:", error);
        return NextResponse.json({ success: false, error: "Failed to send code" }, { status: 500 });
    }
}
