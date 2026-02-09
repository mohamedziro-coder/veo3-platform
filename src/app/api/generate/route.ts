import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiApiKey } from "@/lib/config";

// Helper to get GenAI instance dynamically
const getGenAI = () => {
    const key = getGeminiApiKey();
    if (!key) return null;
    return new GoogleGenerativeAI(key);
}

export async function POST(req: NextRequest) {
    try {
        const { startImage, endImage, prompt } = await req.json();

        if (!startImage || !endImage) {
            return NextResponse.json(
                { error: "Both start and end images are required" },
                { status: 400 }
            );
        }

        let finalPrompt = prompt;
        const genAI = getGenAI();

        if (!genAI) {
            return NextResponse.json({ error: "Server missing API Key. Please configure in Admin Panel." }, { status: 500 });
        }

        // Enhance prompt using Gemini
        if (true) { // Always try if we have the instance
            try {
                // Using Gemini 2.0 Flash as 1.5 Flash was not found in user's project
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                // Remove header from base64 string if present (data:image/jpeg;base64,...)
                const cleanStart = startImage.split(",")[1] || startImage;
                const cleanEnd = endImage.split(",")[1] || endImage;

                const result = await model.generateContent([
                    "Analyze these two images (start and end frames) and the user's prompt (which might be in Moroccan Darija/Arabic). Create a detailed text-to-video prompt for Veo.",
                    "RULES:",
                    "1. Describe the visual motion/transition in English (cinematic style).",
                    "2. IF the user asked for voice/speech: Explicitly add 'Audio: [Character/Voice] speaking in Moroccan Arabic dialect (Darija): \"[Translated dialogue or general topic]\"'.",
                    "3. If no speech requested, suggest cinematic ambient sound.",
                    "User prompt: " + (prompt || "smooth transition"),
                    { inlineData: { data: cleanStart, mimeType: "image/jpeg" } },
                    { inlineData: { data: cleanEnd, mimeType: "image/jpeg" } },
                ]);

                finalPrompt = result.response.text();
                console.log("Gemini Enhanced Prompt:", finalPrompt);

                // ---------------------------------------------------------
                // REAL VEO GENERATION LOGIC
                // ---------------------------------------------------------
                let videoUrl = null;
                let generationStatus = "failed";
                let errorMessage = "Unknown error";

                try {
                    // UPDATED MODEL NAME BASED ON DISCOVERY
                    const modelName = "veo-3.0-generate-001";
                    console.log(`Attempting to generate video with ${modelName}...`);
                    const videoModel = genAI.getGenerativeModel({ model: modelName });

                    const videoResult = await videoModel.generateContent([
                        // Explicitly instruct Veo on start/end frames
                        "Generate a video starting exactly from the first image and ending exactly at the second image. \n\n" + finalPrompt,
                        { inlineData: { data: cleanStart, mimeType: "image/jpeg" } },
                        { inlineData: { data: cleanEnd, mimeType: "image/jpeg" } }
                    ]);

                    const responseText = videoResult.response.text();

                    if (responseText.startsWith("http")) {
                        videoUrl = responseText;
                        generationStatus = "success";
                    } else {
                        console.log("Veo output (raw - might need parsing):", responseText);
                        errorMessage = "Veo returned non-URL response. Check server logs.";
                    }

                } catch (veoError: any) {
                    console.error("--------------- VEO API ERROR ---------------");
                    console.error("Message:", veoError.message);
                    errorMessage = veoError.message;
                    try {
                        if (veoError.response) {
                            console.error("API Response Error:", JSON.stringify(veoError.response, null, 2));
                        }
                    } catch (e) { }
                    console.error("---------------------------------------------");
                }

                return NextResponse.json({
                    videoUrl: videoUrl,
                    status: generationStatus,
                    error: generationStatus === "success" ? null : errorMessage,
                    usedPrompt: finalPrompt
                });

            } catch (geminiError) {
                console.error("Gemini enhancement failed:", geminiError);
                // If enhancement fails, try raw prompt with Veo? 
                // For now, let's error out to be safe, or fallback to raw prompt:
                // return NextResponse.json({ error: "Prompt enhancement failed" }, { status: 500 });
            }
        } else {
            console.warn("GEMINI_API_KEY not found.");
            return NextResponse.json({ error: "Server missing API Key" }, { status: 500 });
        }

    } catch (error) {
        console.error("Error generating video:", error);
        return NextResponse.json(
            { error: "Failed to generate video" },
            { status: 500 }
        );
    }
}
