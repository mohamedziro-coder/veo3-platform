import { NextResponse } from "next/server";
import { getGeminiApiKey } from "@/lib/config";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const apiKey = getGeminiApiKey();

        if (!apiKey) {
            return NextResponse.json({ error: "Server Error: API Key missing. Configure in Admin Panel." }, { status: 500 });
        }

        const body = await req.json();
        const { text, voiceId, languageCode, speakingRate, pitch, userEmail, useGemini } = body;

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        if (!userEmail) {
            return NextResponse.json({ error: "User authentication required" }, { status: 401 });
        }

        // Deduct Verify Credits
        const newBalance = await deductUserCredits(userEmail, COSTS.VOICE);
        if (newBalance === null) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        let processedText = text;

        // Optional: Enhance text with Gemini 2.5 Flash
        if (useGemini) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                const languageMap: Record<string, string> = {
                    "ar-MA": "Moroccan Arabic (Darija)",
                    "de-DE": "German",
                    "en-US": "English (US)",
                    "en-GB": "English (UK)",
                    "fr-FR": "French",
                    "es-ES": "Spanish"
                };

                const targetLang = languageMap[languageCode] || "the target language";

                const prompt = `Improve the following text for natural ${targetLang} text-to-speech pronunciation. 
                
Rules:
1. Fix grammar and punctuation for better TTS flow
2. Preserve the original meaning and tone
3. For Moroccan Arabic (Darija), keep the dialect authentic - do NOT convert to Modern Standard Arabic
4. Return ONLY the improved text, no explanations

Text: ${text}`;

                const result = await model.generateContent(prompt);
                processedText = result.response.text().trim();
                console.log("Gemini Enhanced Text:", processedText);
            } catch (geminiError) {
                console.error("Gemini enhancement failed, using original text:", geminiError);
                // Continue with original text if Gemini fails
            }
        }

        // Endpoint for Google Cloud Text-to-Speech
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

        const payload = {
            input: { text: processedText },
            voice: { languageCode: languageCode || "ar-MA", name: voiceId || "ar-XA-Standard-A" },
            audioConfig: {
                audioEncoding: "MP3",
                speakingRate: speakingRate || 1.0,
                pitch: pitch || 0.0
            }
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("TTS API Error:", data);
            return NextResponse.json({
                error: data.error?.message || "TTS Service Error. Ensure 'Cloud Text-to-Speech API' is enabled for this API Key."
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            audioContent: data.audioContent,
            credits: newBalance,
            enhancedText: useGemini ? processedText : undefined
        });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
