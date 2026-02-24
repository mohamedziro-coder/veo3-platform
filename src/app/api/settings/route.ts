import { NextRequest, NextResponse } from "next/server";
import { getAppConfigAsync, saveAppConfigAsync } from "@/lib/config";

// GET /api/settings — Return current Runway API key status
export async function GET(req: NextRequest) {
    try {
        const config = await getAppConfigAsync();
        return NextResponse.json({
            configured: !!config.RUNWAYML_API_SECRET,
            hasApiKey: !!config.RUNWAYML_API_SECRET,
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

// POST /api/settings — Save Runway API key
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { runwayApiSecret } = body;

        if (!runwayApiSecret) {
            return NextResponse.json({ error: "Runway API secret is required" }, { status: 400 });
        }

        const result = await saveAppConfigAsync({ RUNWAYML_API_SECRET: runwayApiSecret });

        if (result.success) {
            return NextResponse.json({ success: true, message: "Runway API key saved successfully" });
        } else {
            return NextResponse.json({ error: `Failed to save: ${result.error}` }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Settings save error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
