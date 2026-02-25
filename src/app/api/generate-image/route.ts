import { NextRequest, NextResponse } from "next/server";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { generateImage } from "@/lib/runway";
import { storeOperationResult } from "@/lib/operations";

// Simple per-user cooldown
const lastRequestTime = new Map<string, number>();
const COOLDOWN_MS = 10_000;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // ── Auth: try Supabase session first, then fall back to body email ────
        let userEmail: string | null = null;
        try {
            const { createServerClient } = await import("@supabase/ssr");
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                { cookies: { getAll: () => req.cookies.getAll(), setAll: () => { } } }
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) userEmail = user.email;
        } catch (_) { }

        if (!userEmail && body.userEmail) userEmail = body.userEmail;
        if (!userEmail) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        // ── Cooldown ──────────────────────────────────────────────────────────
        const now = Date.now();
        const lastTime = lastRequestTime.get(userEmail);
        if (lastTime && now - lastTime < COOLDOWN_MS) {
            const wait = Math.ceil((COOLDOWN_MS - (now - lastTime)) / 1000);
            return NextResponse.json({ error: `Please wait ${wait}s before generating another image` }, { status: 429 });
        }
        lastRequestTime.set(userEmail, now);

        const { prompt, image } = body;
        if (!prompt?.trim()) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // ── Deduct credits ────────────────────────────────────────────────────
        const newBalance = await deductUserCredits(userEmail, COSTS.IMAGE);
        if (newBalance === null) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        // ── Create operation and fire async background process ────────────────
        const operationId = `img-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        console.log(`[IMAGE-GEN] Created operation ${operationId} for user: ${userEmail}`);

        storeOperationResult(operationId, {
            status: "processing",
            message: "Starting image generation with Runway...",
        });

        // Fire-and-forget — does NOT block the response
        processImageGeneration(operationId, prompt, image, newBalance).catch((err) => {
            console.error(`[IMAGE-GEN] Background error for ${operationId}:`, err);
            storeOperationResult(operationId, { status: "failed", error: err.message || "Image generation failed" });
        });

        // ── Return immediately ────────────────────────────────────────────────
        return NextResponse.json({
            status: "processing",
            operationId,
            message: "Image generation started. Poll /api/media/status for updates.",
        });

    } catch (error: any) {
        console.error("[IMAGE-GEN] Error:", error);
        return NextResponse.json({ error: error.message || "Image generation failed. Please try again." }, { status: 500 });
    }
}

async function processImageGeneration(
    operationId: string,
    prompt: string,
    imageBase64: string | undefined,
    credits: number
) {
    try {
        storeOperationResult(operationId, { status: "processing", message: "Runway is generating your image..." });

        let referenceImage: string | undefined;
        if (imageBase64) {
            referenceImage = imageBase64.split(",")[1] || imageBase64;
        }

        const imageUrl = await generateImage(prompt, referenceImage);

        console.log(`[IMAGE-GEN] Image ready: ${imageUrl}`);
        storeOperationResult(operationId, {
            status: "complete",
            imageUrl,
            credits,
            message: "Image generated successfully!",
        });
    } catch (error: any) {
        console.error(`[IMAGE-GEN] processImageGeneration error:`, error);
        storeOperationResult(operationId, { status: "failed", error: error.message || "Image generation failed" });
    }
}
