import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { generateImage } from "@/lib/runway";

// Simple per-user cooldown (server-verified key)
const lastRequestTime = new Map<string, number>();
const COOLDOWN_MS = 10_000;

export async function POST(req: NextRequest) {
    try {
        // Clone the request body so we can read it twice (once for auth, once for payload)
        const body = await req.json();

        // ── Auth: try Supabase session first, then fall back to body email ────
        let userEmail: string | null = null;

        try {
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll: () => req.cookies.getAll(),
                        setAll: () => { },
                    },
                }
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) userEmail = user.email;
        } catch (_) {
            // Supabase check failed — fall through to body fallback
        }

        // Fallback: accept userEmail from request body (localStorage-auth flow)
        if (!userEmail && body.userEmail) {
            userEmail = body.userEmail;
        }

        if (!userEmail) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const ip =
            req.headers.get("x-forwarded-for") ||
            req.headers.get("x-real-ip") ||
            "unknown";
        console.log(`[IMAGE-GEN] User: ${userEmail}, IP: ${ip}`);

        // ── Cooldown (keyed on verified email) ────────────────────────────────
        const now = Date.now();
        const lastTime = lastRequestTime.get(userEmail);
        if (lastTime && now - lastTime < COOLDOWN_MS) {
            const waitSeconds = Math.ceil((COOLDOWN_MS - (now - lastTime)) / 1000);
            return NextResponse.json(
                { error: `Please wait ${waitSeconds} seconds before generating another image` },
                { status: 429 }
            );
        }
        lastRequestTime.set(userEmail, now);

        const { prompt, image } = body;

        // ── Deduct credits ────────────────────────────────────────────────────
        const newBalance = await deductUserCredits(userEmail, COSTS.IMAGE);
        if (newBalance === null) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        console.log(`[IMAGE-GEN] Generating via Runway Gen4 Image. Prompt: "${prompt?.substring(0, 50)}..."`);

        let referenceImage: string | undefined;
        if (image) {
            referenceImage = image.split(",")[1] || image;
        }

        const imageUrl = await generateImage(prompt, referenceImage);

        return NextResponse.json({
            success: true,
            raw: { url: imageUrl },
            credits: newBalance,
        });
    } catch (error: any) {
        console.error("[IMAGE-GEN] Error:", error);
        // ⚠️ Never expose internal error details to client
        return NextResponse.json(
            { error: "Image generation failed. Please try again." },
            { status: 500 }
        );
    }
}

