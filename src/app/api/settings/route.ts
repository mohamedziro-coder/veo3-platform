import { NextRequest, NextResponse } from "next/server";
import { getGeminiApiKey, saveGeminiApiKey } from "@/lib/config";

// GET /api/settings - Retrieve current configuration status
export async function GET(req: NextRequest) {
    try {
        const apiKey = getGeminiApiKey();

        // Security: NEVER return the full API Key to the client
        // just return a status or a masked version
        const maskedKey = apiKey
            ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
            : null;

        return NextResponse.json({
            configured: !!apiKey,
            maskedKey: maskedKey
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

// POST /api/settings - Update configuration
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { apiKey } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key is required" }, { status: 400 });
        }

        const success = saveGeminiApiKey(apiKey);

        if (success) {
            return NextResponse.json({ success: true, message: "API Key saved successfully" });
        } else {
            return NextResponse.json({ error: "Failed to save API Key to config file" }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
