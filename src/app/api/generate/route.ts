import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { storeOperationResult } from "@/lib/operations";
import { startVideoGeneration, pollRunwayTask } from "@/lib/runway";

// ── Rate Limiting ────────────────────────────────────────────────────────────
// Simple sliding-window: max 5 requests per user per 60 seconds
const rateMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(key: string): boolean {
    const now = Date.now();
    const timestamps = (rateMap.get(key) ?? []).filter(
        (t) => now - t < RATE_LIMIT_WINDOW_MS
    );
    if (timestamps.length >= RATE_LIMIT_MAX) return true;
    timestamps.push(now);
    rateMap.set(key, timestamps);
    return false;
}

export async function POST(req: NextRequest) {
    try {
        // ── Auth: verify session server-side ──────────────────────────────────
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
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user?.email) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }
        const userEmail = user.email;

        // ── Rate limiting (per user) ──────────────────────────────────────────
        if (isRateLimited(userEmail)) {
            return NextResponse.json(
                { error: "Too many requests. Please wait before generating again." },
                { status: 429 }
            );
        }

        const { startImage, endImage, prompt, aspectRatio = "9:16", duration = 10 } =
            await req.json();

        // Deduct Credits
        const newBalance = await deductUserCredits(userEmail, COSTS.VIDEO);
        if (newBalance === null) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        const operationId = `runway-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        console.log(`[GENERATE] Created operation ${operationId} for user: ${userEmail}`);

        storeOperationResult(operationId, {
            status: "processing",
            message: "Starting video generation with Runway...",
        });

        processVideoGeneration(
            operationId,
            startImage,
            endImage,
            prompt,
            aspectRatio,
            duration as 5 | 10,
            newBalance
        ).catch((error) => {
            console.error(`[GENERATE] Operation ${operationId} failed:`, error);
            storeOperationResult(operationId, {
                status: "failed",
                error: error.message || "Video generation failed",
            });
        });

        return NextResponse.json({
            status: "processing",
            operationId,
            message: "Video generation started. Poll /api/generate/status for updates.",
        });
    } catch (error: any) {
        // ⚠️ Never expose internal error details to the client
        console.error("Runway Error:", error);
        return NextResponse.json(
            { error: "Video generation failed. Please try again." },
            { status: 500 }
        );
    }
}


async function processVideoGeneration(
    operationId: string,
    startImage: string,
    endImage: string | undefined,
    prompt: string,
    aspectRatio: string,
    duration: 5 | 10,
    credits: number
) {
    try {
        console.log(`[PROCESS] Starting Runway generation for operation: ${operationId}`);

        storeOperationResult(operationId, {
            status: "processing",
            message: "Submitting to Runway AI..."
        });

        // Start video generation via Runway
        const { taskId } = await startVideoGeneration({
            prompt: prompt || "Cinematic video shot",
            startImage: startImage || undefined,
            ratio: aspectRatio,
            duration,
        });

        console.log(`[PROCESS] Runway task started: ${taskId}`);

        storeOperationResult(operationId, {
            status: "processing",
            message: "Runway is generating your video..."
        });

        // Poll task status
        const MAX_ATTEMPTS = 120; // 4 minutes (2s intervals)
        let attempts = 0;

        while (attempts < MAX_ATTEMPTS) {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const result = await pollRunwayTask(taskId);

            if (result.done) {
                if (result.status === "FAILED") {
                    storeOperationResult(operationId, {
                        status: "failed",
                        error: result.error || "Runway generation failed"
                    });
                    return;
                }

                const videoUrl = result.videoUrl;
                if (videoUrl) {
                    console.log(`[PROCESS] Video ready: ${videoUrl}`);
                    storeOperationResult(operationId, {
                        status: "complete",
                        videoUrl,
                        credits,
                        message: "Video generated successfully!"
                    });
                    return;
                }

                storeOperationResult(operationId, {
                    status: "failed",
                    error: "No video URL in Runway response"
                });
                return;
            }

            // Update progress every 10 attempts (~30s)
            if (attempts % 10 === 0 && attempts > 0) {
                const elapsed = Math.round((attempts * 3) / 60);
                storeOperationResult(operationId, {
                    status: "processing",
                    message: `Generating... (~${elapsed}m elapsed)`
                });
            }

            attempts++;
        }

        storeOperationResult(operationId, {
            status: "failed",
            error: "Video generation timed out after 4 minutes"
        });

    } catch (error: any) {
        console.error(`[PROCESS] Operation ${operationId} error:`, error);
        storeOperationResult(operationId, {
            status: "failed",
            error: error.message || "Video generation failed"
        });
    }
}
