import { NextResponse } from "next/server";
import { deductUserCredits } from "@/lib/db";
import { COSTS } from "@/lib/costs";
import { generateSpeech } from "@/lib/runway";
import { storeOperationResult } from "@/lib/operations";

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

        // ── Create operation and fire async background process ────────────────
        const operationId = `tts-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        console.log(`[AUDIO-GEN] Created operation ${operationId}, voice: ${voice}`);

        storeOperationResult(operationId, {
            status: "processing",
            message: "Starting TTS generation with Runway...",
        });

        // Fire-and-forget
        processTtsGeneration(operationId, text, voice, newBalance).catch((err) => {
            console.error(`[AUDIO-GEN] Background error for ${operationId}:`, err);
            storeOperationResult(operationId, { status: "failed", error: err.message || "TTS failed" });
        });

        // ── Return immediately (no timeout risk) ─────────────────────────────
        return NextResponse.json({
            status: "processing",
            operationId,
            message: "Audio generation started. Poll /api/media/status for updates.",
        });

    } catch (error: any) {
        console.error("[AUDIO-GEN] TTS Error:", error);
        return NextResponse.json({ error: error.message || "TTS Failed" }, { status: 500 });
    }
}

async function processTtsGeneration(
    operationId: string,
    text: string,
    voice: string,
    credits: number
) {
    try {
        storeOperationResult(operationId, { status: "processing", message: "Runway is synthesizing your voice..." });

        const { audioBase64 } = await generateSpeech(text, voice);

        console.log(`[AUDIO-GEN] TTS complete for operation ${operationId}`);
        storeOperationResult(operationId, {
            status: "complete",
            audioContent: audioBase64,
            credits,
            message: "Audio generated successfully!",
        });
    } catch (error: any) {
        console.error(`[AUDIO-GEN] processTtsGeneration error:`, error);
        storeOperationResult(operationId, { status: "failed", error: error.message || "TTS generation failed" });
    }
}
