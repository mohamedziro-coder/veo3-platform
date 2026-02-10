import { NextRequest, NextResponse } from "next/server";
import { getVeoModel, vertexAI } from "@/lib/vertex";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { storeOperationResult } from "@/lib/operations";

export async function POST(req: NextRequest) {
    try {
        const { startImage, endImage, prompt, userEmail, gravityIntensity = 0.5 } = await req.json();

        if (!userEmail) {
            return NextResponse.json({ error: "User authentication required" }, { status: 401 });
        }

        // Deduct Credits
        const newBalance = await deductUserCredits(userEmail, COSTS.VIDEO);
        if (newBalance === null) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        // Generate unique operation ID
        const operationId = `veo-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        console.log(`[GENERATE] Created operation ${operationId} for user: ${userEmail}`);

        // Store initial operation status
        storeOperationResult(operationId, {
            status: "processing",
            message: "Starting video generation..."
        });

        // Spawn async video generation (non-blocking)
        processVideoGeneration(operationId, startImage, endImage, prompt, gravityIntensity, newBalance)
            .catch((error) => {
                console.error(`[GENERATE] Operation ${operationId} failed:`, error);
                storeOperationResult(operationId, {
                    status: "failed",
                    error: error.message || "Video generation failed"
                });
            });

        // Return immediately with operation ID
        return NextResponse.json({
            status: "processing",
            operationId: operationId,
            message: "Video generation started. Poll /api/generate/status for updates."
        });

    } catch (error: any) {
        console.error("Vertex AI Error:", error);
        return NextResponse.json({
            error: error.message || "Vertex AI Generation Failed",
            details: error
        }, { status: 500 });
    }
}

// Background video generation function
async function processVideoGeneration(
    operationId: string,
    startImage: string,
    endImage: string,
    prompt: string,
    gravityIntensity: number,
    credits: number
) {
    try {
        console.log(`[PROCESS] Starting background generation for operation: ${operationId}`);

        // Initialize Vertex AI Model
        const modelName = process.env.VEO_MODEL_NAME || "veo-3.1-fast-generate-001";

        // Helper to process base64/url
        const processImage = async (input: string) => {
            if (input.startsWith("http")) {
                try {
                    const res = await fetch(input);
                    const buf = await res.arrayBuffer();
                    return Buffer.from(buf).toString("base64");
                } catch (e) {
                    console.error("Failed to fetch image:", input);
                    throw new Error("Failed to fetch image URL");
                }
            }
            return input.split(",")[1] || input;
        };

        const parts: any[] = [];
        parts.push({ text: `Generate a video. ${prompt || "Cinematic shot."}` });

        if (startImage) {
            const startBase64 = await processImage(startImage);
            parts.push({ inlineData: { mimeType: "image/jpeg", data: startBase64 } });
        }
        if (endImage) {
            const endBase64 = await processImage(endImage);
            parts.push({ inlineData: { mimeType: "image/jpeg", data: endBase64 } });
        }

        // Vertex AI Configuration - using only valid Veo 3.1 parameters
        const generationConfig = {
            temperature: 0.7, // Controls creativity (0.0-2.0, higher = more creative)
            // Note: aspect_ratio, resolution, duration are not supported in SDK generateContent call
            // These are typically set at model initialization or via specific video generation endpoints
        };

        const generativeModel = await getVeoModel(modelName);

        console.log(`[PROCESS] Calling Vertex AI for operation: ${operationId}`);

        // This is the long-running call that may take 30-120 seconds
        const result = await generativeModel.generateContent({
            contents: [{ role: 'user', parts }],
            generationConfig: generationConfig as any,
        });

        // Parse Response
        const response = result.response;
        let videoUrl = null;

        // Check for fileUri (GCS) or inline data
        if (response.candidates?.[0]?.content?.parts?.[0]?.fileData?.fileUri) {
            videoUrl = response.candidates[0].content.parts[0].fileData.fileUri;
        } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
            const text = response.candidates[0].content.parts[0].text;
            if (text.startsWith("gs://") || text.startsWith("http")) {
                videoUrl = text;
            }
        }

        // Convert gs:// to https://
        if (videoUrl && videoUrl.startsWith("gs://")) {
            videoUrl = videoUrl.replace("gs://", "https://storage.googleapis.com/");
        }

        if (videoUrl) {
            console.log(`[PROCESS] Operation ${operationId} completed successfully`);
            storeOperationResult(operationId, {
                status: "complete",
                videoUrl: videoUrl,
                credits: credits
            });
        } else {
            throw new Error("No video URL in response");
        }

    } catch (error: any) {
        console.error(`[PROCESS] Operation ${operationId} failed:`, error);
        storeOperationResult(operationId, {
            status: "failed",
            error: error.message || "Video generation failed"
        });
        throw error;
    }
}

