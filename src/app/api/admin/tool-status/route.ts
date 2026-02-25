import { NextRequest, NextResponse } from "next/server";

/**
 * Tool status toggle — persisted in-memory (for MVP).
 * For production, swap `toolStatus` for a DB/KV read/write.
 */

export type ToolId = "video" | "image" | "voice";

// Default: all tools enabled
const toolStatus: Record<ToolId, boolean> = {
    video: true,
    image: true,
    voice: true,
};

export const WHATSAPP_NUMBER = "212600000000"; // ← Change to real number

/** GET /api/admin/tool-status  — returns all tool statuses */
export async function GET() {
    return NextResponse.json({ success: true, tools: { ...toolStatus } });
}

/** POST /api/admin/tool-status  — toggle a specific tool on/off
 *  Body: { toolId: "video" | "image" | "voice", enabled: boolean, adminEmail: string }
 */
export async function POST(req: NextRequest) {
    try {
        const { toolId, enabled, adminEmail } = await req.json();

        if (!adminEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!["video", "image", "voice"].includes(toolId)) {
            return NextResponse.json({ error: "Invalid tool" }, { status: 400 });
        }

        toolStatus[toolId as ToolId] = Boolean(enabled);
        console.log(`[TOOL-STATUS] ${toolId} set to ${enabled} by ${adminEmail}`);

        return NextResponse.json({ success: true, tools: { ...toolStatus } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
    }
}
