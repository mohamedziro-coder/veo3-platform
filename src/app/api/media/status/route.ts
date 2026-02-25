import { NextRequest, NextResponse } from "next/server";
import { getOperationResult, deleteOperationResult } from "@/lib/operations";

/**
 * GET /api/media/status?operationId=xxx&userEmail=xxx
 *
 * Shared polling endpoint for image and audio generation operations.
 * Returns status: "processing" | "complete" | "failed"
 * On complete, returns: imageUrl OR audioContent (base64)
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const operationId = searchParams.get("operationId");
        const userEmail = searchParams.get("userEmail");

        if (!operationId || !userEmail) {
            return NextResponse.json({ error: "Missing operationId or userEmail" }, { status: 400 });
        }

        const op = getOperationResult(operationId);

        if (!op) {
            // Not found yet — still starting up
            return NextResponse.json({ status: "processing", message: "Starting generation..." });
        }

        if (op.status === "complete") {
            deleteOperationResult(operationId);
            return NextResponse.json({
                status: "complete",
                // Image result
                ...(op.imageUrl ? { imageUrl: op.imageUrl } : {}),
                // Audio result
                ...(op.audioContent ? { audioContent: op.audioContent } : {}),
                credits: op.credits,
                message: op.message,
            });
        }

        if (op.status === "failed") {
            deleteOperationResult(operationId);
            return NextResponse.json({ status: "failed", error: op.error });
        }

        // Still processing
        return NextResponse.json({ status: "processing", message: op.message || "Generating..." });

    } catch (error: any) {
        console.error("[MEDIA-STATUS] Error:", error);
        return NextResponse.json({ error: error.message || "Status check failed" }, { status: 500 });
    }
}
