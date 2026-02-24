import { NextResponse } from "next/server";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { generateSpeech } from "@/lib/runway";

// Map legacy Google voice IDs / language codes to Runway preset voices
const VOICE_MAP: Record<string, string> = {
    "ar-XA-Wavenet-B": "Liam",
    "ar-XA-Wavenet-A": "Leslie",
    "en-US-Wavenet-D": "James",
    "en-US-Wavenet-F": "Emma",
    "fr-FR-Wavenet-A": "Olivia",
    "es-ES-Wavenet-B": "Noah",
};

function resolveVoice(voiceId?: string, languageCode?: string): string {
    if (voiceId && VOICE_MAP[voiceId]) return VOICE_MAP[voiceId];
    // Language-based heuristic
    if (languageCode?.startsWith('ar')) return 'Liam';
    if (languageCode?.startsWith('fr')) return 'Olivia';
    if (languageCode?.startsWith('es')) return 'Charlotte';
    return 'Leslie'; // default
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text, voiceId, languageCode, userEmail } = body;

        if (!userEmail) {
            return NextResponse.json({ error: "User authentication required" }, { status: 401 });
        }

        if (!text?.trim()) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const newBalance = await deductUserCredits(userEmail, COSTS.VOICE);
        if (newBalance === null) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        const voice = resolveVoice(voiceId, languageCode);
        console.log(`[AUDIO-GEN] Generating TTS via Runway. Voice: ${voice}, Text: "${text.substring(0, 60)}..."`);

        const { audioBase64 } = await generateSpeech(text, voice);

        return NextResponse.json({
            success: true,
            audioContent: audioBase64,
            credits: newBalance
        });

    } catch (error: any) {
        console.error("[AUDIO-GEN] TTS Error:", error);
        return NextResponse.json({ error: error.message || "TTS Failed" }, { status: 500 });
    }
}
