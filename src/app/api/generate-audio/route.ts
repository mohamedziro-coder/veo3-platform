import { NextResponse } from "next/server";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { generateSpeech } from "@/lib/runway";

// Allow up to 60 seconds on Vercel Pro (10s on Hobby — upgrade if TTS times out)
export const maxDuration = 60;

// Valid Runway TTS preset names
const RUNWAY_PRESETS = new Set([
    'Maya', 'Arjun', 'Serene', 'Bernard', 'Billy', 'Mark', 'Clint', 'Mabel', 'Chad',
    'Leslie', 'Eleanor', 'Elias', 'Elliot', 'Grungle', 'Brodie', 'Sandra', 'Kirk',
    'Kylie', 'Lara', 'Lisa', 'Malachi', 'Marlene', 'Martin', 'Miriam', 'Monster',
    'Paula', 'Pip', 'Rusty', 'Ragnar', 'Xylar', 'Maggie', 'Jack', 'Katie',
    'Noah', 'James', 'Rina', 'Ella', 'Mariah', 'Frank', 'Claudia', 'Niki',
    'Vincent', 'Kendrick', 'Myrna', 'Tom', 'Wanda', 'Benjamin', 'Kiana', 'Rachel',
    'Liam', 'Olivia', 'Emma', 'Charlotte',
]);

const LEGACY_VOICE_MAP: Record<string, string> = {
    "ar-XA-Wavenet-B": "Liam",
    "ar-XA-Wavenet-A": "Leslie",
    "en-US-Wavenet-D": "James",
    "en-US-Wavenet-F": "Emma",
    "fr-FR-Wavenet-A": "Olivia",
    "es-ES-Wavenet-B": "Noah",
};

function resolveVoice(voiceId?: string, languageCode?: string): string {
    if (voiceId && RUNWAY_PRESETS.has(voiceId)) return voiceId;
    if (voiceId && LEGACY_VOICE_MAP[voiceId]) return LEGACY_VOICE_MAP[voiceId];
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
    return 'Leslie';
}

/**
 * POST /api/generate-audio
 * Synchronous — waits for TTS to complete (up to maxDuration seconds).
 * Returns { audioContent: base64, credits: number } directly.
 */
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

        // ── Deduct credits first ──────────────────────────────────────────────
        const newBalance = await deductUserCredits(userEmail, COSTS.VOICE);
        if (newBalance === null) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
        }

        const voice = resolveVoice(voiceId, languageCode);
        console.log(`[AUDIO-GEN] Generating TTS: voice=${voice}, user=${userEmail}`);

        // ── Call Runway synchronously ─────────────────────────────────────────
        const { audioBase64 } = await generateSpeech(text, voice);

        console.log(`[AUDIO-GEN] TTS complete, credits remaining: ${newBalance}`);

        return NextResponse.json({
            success: true,
            audioContent: audioBase64,
            credits: newBalance,
        });

    } catch (error: any) {
        console.error("[AUDIO-GEN] TTS Error:", error);
        return NextResponse.json(
            { error: error.message || "Voice generation failed" },
            { status: 500 }
        );
    }
}
