import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiApiKey } from "@/lib/config";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/credits";

export async function POST(req: NextRequest) {
    try {
        const { prompt, image, userEmail } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        if (!userEmail) {
            return NextResponse.json(
                { error: "User authentication required" },
                { status: 401 }
            );
        }

        // Deduct credits from database
        const newBalance = await deductUserCredits(userEmail, COSTS.IMAGE);
        if (newBalance === null) {
            // Diagnostic: Check why it failed
            const { getUserByEmail } = await import("@/lib/db");
            const user = await getUserByEmail(userEmail);

            if (!user) {
                return NextResponse.json(
                    { error: `User not found: ${userEmail}` },
                    { status: 401 }
                );
            }

            if (user.credits < COSTS.IMAGE) {
                return NextResponse.json(
                    { error: `Insufficient credits. You have ${user.credits}, but need ${COSTS.IMAGE}.` },
                    { status: 402 }
                );
            }

            return NextResponse.json(
                { error: "Credit deduction failed (System Error)" },
                { status: 500 }
            );
        }

        const apiKey = getGeminiApiKey();
        if (!apiKey) {
            return NextResponse.json({ error: "Server missing API Key. Configure in Admin Panel." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Use 'gemini-2.0-flash-exp' as it has strong multimodal capabilities for "Image to Image" (editing)
        // 'nano-banana-pro-preview' might be text-only or specific. 
        // For consistency, Flash 2.0 is excellent at following visual instructions.
        const modelName = "nano-banana-pro-preview";
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log(`Generating with ${modelName}. Prompt: "${prompt.substring(0, 50)}..." | Image present: ${!!image}`);

        const parts: any[] = [];

        // 1. Add System/User text instruction
        // If image is present, we wrap the prompt to ensure consistency.
        const finalPrompt = image
            ? `Output an IMAGE. Look at the input image carefully. Generate a new photorealistic image of the SAME EXACT PERSON (same face, same identity). Preserve their facial features strictly. \n\nUser instruction: ${prompt}`
            : `Output an IMAGE. ${prompt}`;

        parts.push({ text: finalPrompt });

        // 2. Add Image if present
        if (image) {
            // Expecting data:image/png;base64,.... split it
            const base64Data = image.split(",")[1] || image;
            const mimeType = image.split(";")[0].split(":")[1] || "image/png"; // simple extraction

            parts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            });
        }

        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts: parts }],
            });

            const response = await result.response;
            console.log("Imagen Response Candidates:", JSON.stringify(response.candidates, null, 2));

            // Check for executable code or function call (unlikely for Imagen)
            // Check for inline data (base64)
            if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                const imgData = response.candidates[0].content.parts[0].inlineData;
                const base64Image = `data:${imgData.mimeType};base64,${imgData.data}`;
                return NextResponse.json({
                    success: true,
                    raw: { url: base64Image },
                    credits: newBalance // Return updated credits
                });
            }

            // If it's a URL in text
            const text = response.text();
            if (text && text.startsWith("http")) {
                return NextResponse.json({
                    success: true,
                    raw: { url: text },
                    credits: newBalance // Return updated credits
                });
            }

            return NextResponse.json({
                success: false,
                error: "Model returned text: " + text.substring(0, 100),
                raw: response
            });

        } catch (genError: any) {
            console.error("Nanbanana Generation Error:", genError);
            return NextResponse.json({ error: genError.message || "Generation failed" }, { status: 500 });
        }

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
