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

// Background video generation function using REST API
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

        // Import helpers (dynamic import to avoid circular dependencies)
        const { uploadBase64ToGCS, gcsUriToHttps } = await import('@/lib/gcs-upload');
        const { startVideoGeneration, pollOperationStatus } = await import('@/lib/veo-lro');

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

        // Step 1: Upload images to GCS (Veo requires GCS URIs)
        storeOperationResult(operationId, {
            status: "processing",
            message: "Uploading images to Cloud Storage..."
        });

        let startImageGcsUri: string;
        let endImageGcsUri: string | undefined;

        if (startImage) {
            const startBase64 = await processImage(startImage);
            startImageGcsUri = await uploadBase64ToGCS(startBase64, 'start-frame.jpg');
            console.log(`[PROCESS] Start image uploaded: ${startImageGcsUri}`);
        } else {
            throw new Error('Start image is required');
        }

        if (endImage) {
            const endBase64 = await processImage(endImage);
            endImageGcsUri = await uploadBase64ToGCS(endBase64, 'end-frame.jpg');
            console.log(`[PROCESS] End image uploaded: ${endImageGcsUri}`);
        }

        // Step 2: Start Veo LRO via REST API
        storeOperationResult(operationId, {
            status: "processing",
            message: "Generating video with Veo 3.1..."
        });

        const bucketName = process.env.GCS_BUCKET_NAME || process.env.GOOGLE_CLOUD_BUCKET;
        if (!bucketName) {
            throw new Error('GCS_BUCKET_NAME not configured in environment');
        }

        const outputGcsUri = `gs://${bucketName}/veo-outputs/${operationId}/`;

        const { operationName } = await startVideoGeneration({
            prompt: prompt || "Cinematic video shot",
            startImageGcsUri,
            endImageGcsUri,
            outputGcsUri
        });

        console.log(`[PROCESS] Vertex AI operation started: ${operationName}`);

        // Step 3: Poll operation status
        let attempts = 0;
        const MAX_ATTEMPTS = 80; // 4 minutes (3s intervals)
        let lastMessage = "Generating video...";

        while (attempts < MAX_ATTEMPTS) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds

            const { done, error, response } = await pollOperationStatus(operationName);

            // Update progress message every 10 attempts (30 seconds)
            if (attempts % 10 === 0) {
                const elapsed = Math.floor((attempts * 3) / 60);
                lastMessage = `Generating video... ${elapsed}m ${(attempts * 3) % 60}s elapsed`;
                storeOperationResult(operationId, {
                    status: "processing",
                    message: lastMessage
                });
            }

            if (done) {
                if (error) {
                    console.error(`[PROCESS] Vertex AI operation failed:`, error);
                    storeOperationResult(operationId, {
                        status: "failed",
                        error: error.message || "Video generation failed"
                    });
                    return;
                }

                // Extract video GCS URI from response
                console.log(`[PROCESS] Operation completed! Response:`, JSON.stringify(response));

                // The response structure should contain the generated video
                // Response format: { generatedVideos: [{ video: { gcsUri: "gs://..." } }] }
                let videoUrl = null;

                if (response?.generatedVideos?.[0]?.video?.gcsUri) {
                    const gcsUri = response.generatedVideos[0].video.gcsUri;
                    videoUrl = gcsUriToHttps(gcsUri);
                    console.log(`[PROCESS] Video URL: ${videoUrl}`);
                } else if (response?.generatedSamples?.[0]?.video?.uri) {
                    // Alternative response format
                    videoUrl = response.generatedSamples[0].video.uri;
                    if (videoUrl.startsWith('gs://')) {
                        videoUrl = gcsUriToHttps(videoUrl);
                    }
                } else {
                    console.error('[PROCESS] Unexpected response format:', response);
                    throw new Error('Could not extract video URL from response');
                }

                // Success!
                storeOperationResult(operationId, {
                    status: "complete",
                    videoUrl,
                    credits,
                    message: "Video generated successfully!"
                });

                console.log(`[PROCESS] Operation ${operationId} completed successfully`);
                return;
            }

            attempts++;
        }

        // Timeout
        console.error(`[PROCESS] Operation ${operationId} timed out after ${MAX_ATTEMPTS * 3}s`);
        storeOperationResult(operationId, {
            status: "failed",
            error: "Video generation timed out. Please try again."
        });

    } catch (error: any) {
        console.error(`[PROCESS] Operation ${operationId} error:`, error);
        storeOperationResult(operationId, {
            status: "failed",
            error: error.message || "Video generation failed"
        });
    }
}
