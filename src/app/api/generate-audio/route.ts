import { NextResponse } from "next/server";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { generateSpeech } from "@/lib/runway";

// Valid Runway TTS preset names (must match exactly)
const RUNWAY_PRESETS = new Set([
    'Maya', 'Arjun', 'Serene', 'Bernard', 'Billy', 'Mark', 'Clint', 'Mabel', 'Chad',
    'Leslie', 'Eleanor', 'Elias', 'Elliot', 'Grungle', 'Brodie', 'Sandra', 'Kirk',
    'Kylie', 'Lara', 'Lisa', 'Malachi', 'Marlene', 'Martin', 'Miriam', 'Monster',
    'Paula', 'Pip', 'Rusty', 'Ragnar', 'Xylar', 'Maggie', 'Jack', 'Katie',
    'Noah', 'James', 'Rina', 'Ella', 'Mariah', 'Frank', 'Claudia', 'Niki',
    'Vincent', 'Kendrick', 'Myrna', 'Tom', 'Wanda', 'Benjamin', 'Kiana', 'Rachel',
    'Liam', 'Olivia', 'Emma', 'Charlotte',
]);

// Legacy Google TTS voice IDs → Runway preset names
const LEGACY_VOICE_MAP: Record<string, string> = {
    "ar-XA-Wavenet-B": "Liam",
    "ar-XA-Wavenet-A": "Leslie",
    "en-US-Wavenet-D": "James",
    "en-US-Wavenet-F": "Emma",
    "fr-FR-Wavenet-A": "Olivia",
    "es-ES-Wavenet-B": "Noah",
};

function resolveVoice(voiceId?: string, languageCode?: string): string {
    // 1. If it's already a valid Runway preset name, use it directly
    if (voiceId && RUNWAY_PRESETS.has(voiceId)) return voiceId;
    // 2. If it's a legacy Google TTS ID, map it to a preset
    if (voiceId && LEGACY_VOICE_MAP[voiceId]) return LEGACY_VOICE_MAP[voiceId];
    // 3. Language-based fallback
    if (languageCode?.startsWith('ar')) return 'Liam';
    if (languageCode?.startsWith('fr')) return 'Olivia';
    if (languageCode?.startsWith('es')) return 'Noah';
    if (languageCode?.startsWith('de')) return 'Martin';
    if (languageCode?.startsWith('it')) return 'Elias';
    if (languageCode?.startsWith('pt')) return 'Frank';
    if (languageCode?.startsWith('ru')) return 'Ragnar';
    if (languageCode?.startsWith('ja')) return 'Serene';
    if (languageCode?.startsWith('zh')) return 'Kiana';
    if (languageCode?.startsWith('hi')) return 'Arjun';
    if (languageCode?.startsWith('tr')) return 'Eleanor';
    if (languageCode?.startsWith('ko')) return 'Katie';
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
