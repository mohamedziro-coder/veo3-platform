import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
        }

        // Generate a random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // SIMULATION: Log the code to the console (Server-side)
        console.log("==========================================");
        console.log(`[EMAIL SIMULATION] Sending code to ${email}`);
        console.log(`[CODE] ${code}`);
        console.log("==========================================");

        // In a real app, you would send this via Resend/Nodemailer
        // await resend.emails.send({ ... })

        // Return the code in the response ONLY for testing/simulation purposes
        // In production, you would NOT return the code; you'd store it in a DB/Redis
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
