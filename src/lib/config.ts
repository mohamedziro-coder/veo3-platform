import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'config.json');

interface VertexConfig {
    GOOGLE_PROJECT_ID?: string;
    GOOGLE_LOCATION?: string;
    GOOGLE_APPLICATION_CREDENTIALS_JSON?: string;
    GCS_BUCKET_NAME?: string;
    [key: string]: any;
}

export function getVertexConfig(): VertexConfig {
    // 1. Try config file first (Dynamic Override)
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
            const config = JSON.parse(data);
            return {
                GOOGLE_PROJECT_ID: config.GOOGLE_PROJECT_ID || process.env.GOOGLE_PROJECT_ID,
                GOOGLE_LOCATION: config.GOOGLE_LOCATION || process.env.GOOGLE_LOCATION || 'us-central1',
                GOOGLE_APPLICATION_CREDENTIALS_JSON: config.GOOGLE_APPLICATION_CREDENTIALS_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
                GCS_BUCKET_NAME: config.GCS_BUCKET_NAME || process.env.GCS_BUCKET_NAME
            };
        }
    } catch (e) {
        console.error("Error reading config.json:", e);
    }

    // 2. Fallback to Environment Variables
    return {
        GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
        GOOGLE_LOCATION: process.env.GOOGLE_LOCATION || 'us-central1',
        GOOGLE_APPLICATION_CREDENTIALS_JSON: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
        GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME
    };
}

import { saveSystemConfig, getSystemConfig } from './db';

export async function getVertexConfigAsync(): Promise<VertexConfig> {
    // 1. Try DB first
    const dbConfig = await getSystemConfig('vertex_config');
    if (dbConfig) {
        return {
            GOOGLE_PROJECT_ID: dbConfig.GOOGLE_PROJECT_ID || process.env.GOOGLE_PROJECT_ID,
            GOOGLE_LOCATION: dbConfig.GOOGLE_LOCATION || process.env.GOOGLE_LOCATION || 'us-central1',
            GOOGLE_APPLICATION_CREDENTIALS_JSON: dbConfig.GOOGLE_APPLICATION_CREDENTIALS_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
            GCS_BUCKET_NAME: dbConfig.GCS_BUCKET_NAME || process.env.GCS_BUCKET_NAME
        };
    }

    // 2. Fallback to File (Dev) or Env (Prod)
    // (Reusing synchronous logic wrapper or just duplicating for safety)
    return getVertexConfig();
}

export async function saveVertexConfigAsync(config: VertexConfig): Promise<{ success: boolean; error?: string }> {
    try {
        // Save to DB
        const saved = await saveSystemConfig('vertex_config', config);
        if (!saved) throw new Error("Database save failed");

        // Also try to save to file for local dev cache (optional, best effort)
        try {
            saveVertexConfig(config);
        } catch (e) {
            // Ignore file write error in prod
        }

        return { success: true };
    } catch (e: any) {
        console.error("Error saving vertex config:", e);
        return { success: false, error: e.message };
    }
}

export function saveVertexConfig(config: VertexConfig): { success: boolean; error?: string } {
    // Legacy File Sync Save
    try {
        // ... (keep existing implementation for local dev)
        console.log("Saving config to:", CONFIG_PATH);
        let currentConfig = {};

        if (fs.existsSync(CONFIG_PATH)) {
            try {
                currentConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
            } catch (e) { }
        }

        const newConfig = { ...currentConfig, ...config };
        const dir = path.dirname(CONFIG_PATH);

        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir, { recursive: true });
            } catch (e) {
                // Return simple error if we can't create dir (likely Vercel)
                return { success: false, error: "Cannot create directory (Read-only System)" };
            }
        }

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
        return { success: true };
    } catch (e: any) {
        console.error("Error writing config.json:", e);
        return { success: false, error: e.message || "File write failed" };
    }
}

// Deprecated: For backward compatibility during migration
export function getGeminiApiKey(): string | undefined {
    const config = getVertexConfig();
    return "deprecated"; // Or handle if gemini key is strictly needed elsewhere
}
