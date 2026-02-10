import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'config.json');

interface VertexConfig {
    GOOGLE_PROJECT_ID?: string;
    GOOGLE_LOCATION?: string;
    GOOGLE_APPLICATION_CREDENTIALS_JSON?: string;
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
                GOOGLE_APPLICATION_CREDENTIALS_JSON: config.GOOGLE_APPLICATION_CREDENTIALS_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
            };
        }
    } catch (e) {
        console.error("Error reading config.json:", e);
    }

    // 2. Fallback to Environment Variables
    return {
        GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
        GOOGLE_LOCATION: process.env.GOOGLE_LOCATION || 'us-central1',
        GOOGLE_APPLICATION_CREDENTIALS_JSON: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
    };
}

export function saveVertexConfig(config: VertexConfig): boolean {
    try {
        let currentConfig = {};

        // Read existing config to preserve other potential keys
        if (fs.existsSync(CONFIG_PATH)) {
            try {
                currentConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
            } catch (e) {
                // Ignore parsing error, start fresh
            }
        }

        const newConfig = {
            ...currentConfig,
            ...config
        };

        const dir = path.dirname(CONFIG_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
        return true;
    } catch (e) {
        console.error("Error writing config.json:", e);
        return false;
    }
}

// Deprecated: For backward compatibility during migration
export function getGeminiApiKey(): string | undefined {
    const config = getVertexConfig();
    return "deprecated"; // Or handle if gemini key is strictly needed elsewhere
}
