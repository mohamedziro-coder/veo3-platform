import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'config.json');

export function getGeminiApiKey(): string | undefined {
    // 1. Try config file first (Dynamic Override)
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
            const config = JSON.parse(data);
            if (config.GEMINI_API_KEY) {
                return config.GEMINI_API_KEY.trim();
            }
        }
    } catch (e) {
        console.error("Error reading config.json:", e);
    }

    // 2. Fallback to Environment Variable
    return process.env.GEMINI_API_KEY;
}

export function saveGeminiApiKey(key: string): boolean {
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
            GEMINI_API_KEY: key.trim()
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
