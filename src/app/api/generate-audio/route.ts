import { NextResponse } from "next/server";
import { getGeminiApiKey } from "@/lib/config";

export async function POST(req: Request) {
    try {
        const apiKey = getGeminiApiKey();

        if (!apiKey) {
            return NextResponse.json({ error: "Server Error: API Key missing. Configure in Admin Panel." }, { status: 500 });
        }

        const body = await req.json();
        const { text, voiceId, languageCode } = body;

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        // Endpoint for Google Cloud Text-to-Speech
        // Using the API Key authentication method commonly available for these Google APIs
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

        const payload = {
            input: { text },
            voice: { languageCode: languageCode || "ar-XA", name: voiceId || "ar-XA-Standard-A" },
            audioConfig: { audioEncoding: "MP3" }
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
            audioContent: data.audioContent // Base64 encoded MP3
        });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
