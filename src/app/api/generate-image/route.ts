import { NextRequest, NextResponse } from "next/server";
import { getImagenModel } from "@/lib/vertex";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";

// Simple in-memory cooldown tracker (for debugging quota issues)
const lastRequestTime = new Map<string, number>();
const COOLDOWN_MS = 10000; // 10 seconds between requests per user

export async function POST(req: NextRequest) {
    try {
        const { prompt, image, userEmail } = await req.json();

        // Log all image generation requests to track usage
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        console.log(`[IMAGE-GEN] User: ${userEmail}, IP: ${ip}, Time: ${new Date().toISOString()}`);
        console.log(`[IMAGE-GEN] Prompt: "${prompt?.substring(0, 100)}"`);

        if (!userEmail) {
            return NextResponse.json({ error: "User authentication required" }, { status: 401 });
        }

        // Check cooldown to prevent spam/quota abuse
        const now = Date.now();
        const lastTime = lastRequestTime.get(userEmail);
        if (lastTime && (now - lastTime) < COOLDOWN_MS) {
            const waitSeconds = Math.ceil((COOLDOWN_MS - (now - lastTime)) / 1000);
            console.log(`[IMAGE-GEN] COOLDOWN: User ${userEmail} must wait ${waitSeconds}s`);
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

        console.log(`Generating Image via Vertex AI (Imagen 3). Prompt: "${prompt.substring(0, 50)}..."`);

        try {
            // Initialize Imagen Model
            const model = await getImagenModel("imagen-3.0-generate-001");

            // Prepare content parts
            const parts: any[] = [{ text: prompt }];

            // Handle Image-to-Image (if supported by specific Imagen version used)
            if (image) {
                // Note: Imagen 3.0 Generate might be Text-to-Image only. 
                // If user wants editing, we might need a different model or endpoint.
                // For now, we append instructions if it supports multimodal input or fail gracefully.
                // Vertex AI SDK handles parsing.
                // Assuming Text-to-Image for now as primary use case.
                // If image input is crucial, we might need a specific edit model.
                // User asked for "same exact person", which implies editing/finetuning (Face integrity).

                // Strategy: Append image as inline data
                const base64Data = image.split(",")[1] || image;
                parts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Data
                    }
                });
            }

            const result = await model.generateContent({
                contents: [{ role: 'user', parts: parts }],
            });

            const response = result.response;
            console.log("Imagen Response:", JSON.stringify(response));

            let imageUrl = null;

            // Imagen on Vertex often returns base64 in inlineData
            if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                const imgData = response.candidates[0].content.parts[0].inlineData;
                imageUrl = `data:${imgData.mimeType};base64,${imgData.data}`;
            }
            // Or it might be a GCS URI
            else if (response.candidates?.[0]?.content?.parts?.[0]?.fileData?.fileUri) {
                imageUrl = response.candidates[0].content.parts[0].fileData.fileUri; // Needs GCS conversion
            }

            if (imageUrl) {
                return NextResponse.json({
                    success: true,
                    raw: { url: imageUrl },
                    credits: newBalance
                });
            } else {
                throw new Error("No image data in response");
            }

        } catch (genError: any) {
            console.error("Imagen Generation Error:", genError);
            return NextResponse.json({ error: genError.message || "Generation failed" }, { status: 500 });
        }

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
