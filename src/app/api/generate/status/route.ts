import { NextRequest, NextResponse } from "next/server";

// In-memory storage for operation tracking (replace with Redis/DB in production)
// This is a simple solution that works for single-instance deployments
const operations = new Map<string, any>();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const operationId = searchParams.get("operationId");
        const userEmail = searchParams.get("userEmail");

        if (!operationId || !userEmail) {
            return NextResponse.json({ error: "Missing operationId or userEmail" }, { status: 400 });
        }

        console.log(`[STATUS-CHECK] Polling operation: ${operationId} for user: ${userEmail}`);

        // Check if operation is stored locally
        const storedOp = operations.get(operationId);

        if (!storedOp) {
            console.log(`[STATUS-CHECK] Operation not found, assuming processing: ${operationId}`);
            return NextResponse.json({
                status: "processing",
                message: "Video generation in progress..."
            });
        }

        if (storedOp.status === "complete") {
            console.log(`[STATUS-CHECK] Operation complete: ${operationId}`);
            operations.delete(operationId); // Clean up
            return NextResponse.json({
                status: "complete",
                videoUrl: storedOp.videoUrl,
                credits: storedOp.credits
            });
        } else if (storedOp.status === "failed") {
            console.log(`[STATUS-CHECK] Operation failed: ${operationId}`);
            operations.delete(operationId);
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

// Helper function to store operation results (called by generate route)
export function storeOperationResult(operationId: string, result: any) {
    operations.set(operationId, result);
    console.log(`[STATUS-CHECK] Stored operation result: ${operationId}, status: ${result.status}`);

    // Automatically clean up after 10 minutes
    setTimeout(() => {
        operations.delete(operationId);
        console.log(`[STATUS-CHECK] Cleaned up operation: ${operationId}`);
    }, 10 * 60 * 1000);
}

