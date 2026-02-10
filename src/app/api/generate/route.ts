import { NextRequest, NextResponse } from "next/server";
import { getVeoModel, vertexAI } from "@/lib/vertex";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";

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

        // Initialize Vertex AI Model
        const modelName = process.env.VEO_MODEL_NAME || "veo-3.1-fast-generate-001";
        console.log(`Starting Vertex AI Generation (${modelName})...`);

        // Helper to process base64/url
        const processImage = async (input: string) => {
            if (input.startsWith("http")) {
                // Vertex AI often accepts GCS URIs directly (gs://). 
                // If it's a public URL, we might need to download and base64 it, 
                // OR passing it as 'fileUri' if supported.
                // For safety with base64 compatible models, we convert to base64.
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

        // Vertex AI Configuration for Physics
        // Note: 'motion_physics' parameter structure depends on specific model version.
        // Assuming Veo 3.1 supports this structure based on user request.
        const generationConfig = {
            temperature: 0.2,
            // Custom parameters often go into 'video_generation_config' or top-level depending on SDK version
            // For now, we follow user's specified structure
            motion_physics: {
                gravity_intensity: parseFloat(gravityIntensity),
                motion_fluidity: 0.9,
                stabilization: true
            }
        };

        const generativeModel = await getVeoModel(modelName);

        // Execute Generation
        // Using standard generateContent. If it supports LRO, SDK might handle it or return Op.
        // If it blocks, Vercel might timeout.
        // We catch inputs and hope it returns fast or we handle the promise.

        const result = await generativeModel.generateContent({
            contents: [{ role: 'user', parts }],
            generationConfig: generationConfig as any, // Cast to any to bypass strict type checks if fields are experimental
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

        // If videoUrl is a gs:// URI, we need to convert to https://storage.googleapis.com/... 
        // or signed URL. For public buckets:
        if (videoUrl && videoUrl.startsWith("gs://")) {
            videoUrl = videoUrl.replace("gs://", "https://storage.googleapis.com/");
        }

        return NextResponse.json({
            status: videoUrl ? "success" : "failed",
            videoUrl: videoUrl,
            credits: newBalance
        });

    } catch (error: any) {
        console.error("Vertex AI Error:", error);
        return NextResponse.json({
            error: error.message || "Vertex AI Generation Failed",
            details: error
        }, { status: 500 });
    }
}
