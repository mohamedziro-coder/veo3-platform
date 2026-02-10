import { NextResponse } from "next/server";
import { getVertexConfig } from "@/lib/config";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { getGeminiModel } from "@/lib/vertex"; // Use Vertex for enhancement
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text, voiceId, languageCode, speakingRate, pitch, userEmail, useGemini } = body;

        if (!userEmail) {
            return NextResponse.json({ error: "User authentication required" }, { status: 401 });
        }

        const newBalance = await deductUserCredits(userEmail, COSTS.VOICE);
        if (newBalance === null) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        let processedText = text;

        // 1. Text Enhancement with Vertex AI (Gemini)
        if (useGemini) {
            try {
                const model = getGeminiModel("gemini-1.5-flash-001");
                const prompt = `Improve for TTS (Natural flow, ${languageCode}): ${text}`;

                const result = await model.generateContent(prompt);
                const response = result.response;

                if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
                    processedText = response.candidates[0].content.parts[0].text.trim();
                }
            } catch (e) {
                console.error("Gemini Enhancement Failed:", e);
                // Fallback to original text
            }
        }

        // 2. TTS Generation with Google Cloud (Authenticated via Vertex Credentials)
        const config = getVertexConfig();

        // Prepare Auth Options
        const clientOptions: any = {
            projectId: config.GOOGLE_PROJECT_ID,
        };

        // If JSON credentials provided directly in Admin Panel config
        if (config.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
            try {
                const credentials = JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON);
                clientOptions.credentials = credentials;
            } catch (e) {
                console.error("Invalid Service Account JSON in config");
            }
        }

        // Initialize Client
        const ttsClient = new TextToSpeechClient(clientOptions);

        const ttsLanguageCode = languageCode === 'ar-MA' ? 'ar-XA' : languageCode;

        const request = {
            input: { text: processedText },
            voice: { languageCode: ttsLanguageCode || "ar-XA", name: voiceId || "ar-XA-Wavenet-B" },
            audioConfig: {
                audioEncoding: "MP3" as const, // Cast to expected enum string
                speakingRate: speakingRate || 1.0,
                pitch: pitch || 0.0
            }
        };

        const [response] = await ttsClient.synthesizeSpeech(request);
        const audioContent = response.audioContent;

        if (!audioContent) {
            throw new Error("No audio content returned");
        }

        // Convert Buffer to Base64
        const audioBase64 = Buffer.from(audioContent).toString("base64");

        return NextResponse.json({
            success: true,
            audioContent: audioBase64,
            credits: newBalance,
            enhancedText: useGemini ? processedText : undefined
        });

    } catch (error: any) {
        console.error("TTS Error:", error);
        return NextResponse.json({ error: error.message || "TTS Failed" }, { status: 500 });
    }
}
