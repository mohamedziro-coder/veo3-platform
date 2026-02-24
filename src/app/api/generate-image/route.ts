import { NextRequest, NextResponse } from "next/server";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { generateImage } from "@/lib/runway";

// Simple per-user cooldown
const lastRequestTime = new Map<string, number>();
const COOLDOWN_MS = 10000;

export async function POST(req: NextRequest) {
    try {
        const { prompt, image, userEmail } = await req.json();

        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        console.log(`[IMAGE-GEN] User: ${userEmail}, IP: ${ip}, Prompt: "${prompt?.substring(0, 100)}"`);

        if (!userEmail) {
            return NextResponse.json({ error: "User authentication required" }, { status: 401 });
        }

        // Cooldown
        const now = Date.now();
        const lastTime = lastRequestTime.get(userEmail);
        if (lastTime && (now - lastTime) < COOLDOWN_MS) {
            const waitSeconds = Math.ceil((COOLDOWN_MS - (now - lastTime)) / 1000);
            return NextResponse.json({
                error: `Please wait ${waitSeconds} seconds before generating another image`
            }, { status: 429 });
        }
        lastRequestTime.set(userEmail, now);

        // Deduct credits
        const newBalance = await deductUserCredits(userEmail, COSTS.IMAGE);
        if (newBalance === null) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        console.log(`[IMAGE-GEN] Generating via Runway Gen4 Image. Prompt: "${prompt?.substring(0, 50)}..."`);

        // Reference image handling: pass base64 or URL
        let referenceImage: string | undefined;
        if (image) {
            referenceImage = image.split(',')[1] || image; // strip data: prefix if present
        }

        const imageUrl = await generateImage(prompt, referenceImage);

        return NextResponse.json({
            success: true,
            raw: { url: imageUrl },
            credits: newBalance
        });

    } catch (error: any) {
        console.error("[IMAGE-GEN] Error:", error);
        return NextResponse.json({ error: error.message || "Image generation failed" }, { status: 500 });
    }
}
