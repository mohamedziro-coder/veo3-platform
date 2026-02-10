import { NextRequest, NextResponse } from "next/server";
import { getVertexConfig, saveVertexConfig } from "@/lib/config";

// GET /api/settings - Retrieve current configuration status
export async function GET(req: NextRequest) {
    try {
        const config = getVertexConfig();

        // Security: Mask sensitive data
        const maskedJson = config.GOOGLE_APPLICATION_CREDENTIALS_JSON
            ? "configured (hidden)"
            : null;

        return NextResponse.json({
            configured: !!config.GOOGLE_PROJECT_ID,
            projectId: config.GOOGLE_PROJECT_ID || "",
            location: config.GOOGLE_LOCATION || "us-central1",
            hasCredentials: !!config.GOOGLE_APPLICATION_CREDENTIALS_JSON
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

// POST /api/settings - Update configuration
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { projectId, location, serviceAccountJson } = body;

        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        const newConfig: any = {
            GOOGLE_PROJECT_ID: projectId,
            GOOGLE_LOCATION: location || "us-central1"
        };

        if (serviceAccountJson) {
            newConfig.GOOGLE_APPLICATION_CREDENTIALS_JSON = serviceAccountJson;
        }

        const success = saveVertexConfig(newConfig);

        if (success) {
            return NextResponse.json({ success: true, message: "Vertex AI Configuration saved successfully" });
        } else {
            return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

