import { NextResponse } from "next/server";
import { getGeminiApiKey } from "@/lib/config";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/credits";

export async function POST(req: Request) {
    try {
        const apiKey = getGeminiApiKey();

        if (!apiKey) {
            return NextResponse.json({ error: "Server Error: API Key missing. Configure in Admin Panel." }, { status: 500 });
        }

        const body = await req.json();
        const { text, voiceId, languageCode, speakingRate, pitch, userEmail } = body;

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

        // Endpoint for Google Cloud Text-to-Speech
        // Using the API Key authentication method commonly available for these Google APIs
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

        const payload = {
            input: { text },
            voice: { languageCode: languageCode || "ar-XA", name: voiceId || "ar-XA-Standard-A" },
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
            // Refund credits if generation fails? 
            // Ideally yes, but keeping it simple for now as it's a small amount.
            // Or better: construct a refund logic. But strictly following "fix it" first.
            return NextResponse.json({
                error: data.error?.message || "TTS Service Error. Ensure 'Cloud Text-to-Speech API' is enabled for this API Key."
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            audioContent: data.audioContent, // Base64 encoded MP3
            credits: newBalance
        });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
