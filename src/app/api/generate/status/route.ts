import { NextRequest, NextResponse } from "next/server";
import { getOperationResult, deleteOperationResult } from "@/lib/operations";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const operationId = searchParams.get("operationId");
        const userEmail = searchParams.get("userEmail");

        if (!operationId || !userEmail) {
            return NextResponse.json({ error: "Missing operationId or userEmail" }, { status: 400 });
        }

        console.log(`[STATUS-CHECK] Polling operation: ${operationId} for user: ${userEmail}`);

        // Check if operation is stored
        const storedOp = getOperationResult(operationId);

        if (!storedOp) {
            console.log(`[STATUS-CHECK] Operation not found, assuming processing: ${operationId}`);
            return NextResponse.json({
                status: "processing",
                message: "Video generation in progress..."
            });
        }

        if (storedOp.status === "complete") {
            console.log(`[STATUS-CHECK] Operation complete: ${operationId}`);
            deleteOperationResult(operationId); // Clean up
            return NextResponse.json({
                status: "complete",
                videoUrl: storedOp.videoUrl,
                credits: storedOp.credits
            });
        } else if (storedOp.status === "failed") {
            console.log(`[STATUS-CHECK] Operation failed: ${operationId}`);
            deleteOperationResult(operationId);
            return NextResponse.json({
                status: "failed",
                error: storedOp.error
            });
        }

        // Still processing
        return NextResponse.json({
            status: "processing",
            message: storedOp.message || "Generating your video..."
        });

    } catch (error: any) {
        console.error("[STATUS-CHECK] Error:", error);
        return NextResponse.json({
            error: error.message || "Status check failed"
        }, { status: 500 });
    }
}
