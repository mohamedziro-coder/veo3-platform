import fs from 'fs';
import path from 'path';
import { saveSystemConfig, getSystemConfig } from './db';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'config.json');

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
export interface AppConfig {
    RUNWAYML_API_SECRET?: string;
    [key: string]: any;
}

// ──────────────────────────────────────────────────────────────────────────────
// Sync (file/env) — for local dev or edge fallback
// ──────────────────────────────────────────────────────────────────────────────
export function getAppConfig(): AppConfig {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
            const config = JSON.parse(data);
            return {
                RUNWAYML_API_SECRET: config.RUNWAYML_API_SECRET || process.env.RUNWAYML_API_SECRET,
            };
        }
    } catch (e) {
        console.error('Error reading config.json:', e);
    }
    return {
        RUNWAYML_API_SECRET: process.env.RUNWAYML_API_SECRET,
    };
}

// ──────────────────────────────────────────────────────────────────────────────
// Async (DB first, then file/env)
// ──────────────────────────────────────────────────────────────────────────────
export async function getAppConfigAsync(): Promise<AppConfig> {
    const dbConfig = await getSystemConfig('app_config');
    if (dbConfig) {
        return {
            RUNWAYML_API_SECRET: dbConfig.RUNWAYML_API_SECRET || process.env.RUNWAYML_API_SECRET,
        };
    }
    return getAppConfig();
}

export async function saveAppConfigAsync(config: AppConfig): Promise<{ success: boolean; error?: string }> {
    try {
        const saved = await saveSystemConfig('app_config', config);
        if (!saved) throw new Error('Database save failed');

        // Best-effort local file cache
        try { saveAppConfig(config); } catch (_) { }

        return { success: true };
    } catch (e: any) {
        console.error('Error saving app config:', e);
        return { success: false, error: e.message };
    }
}

export function saveAppConfig(config: AppConfig): { success: boolean; error?: string } {
    try {
        let current = {};
        if (fs.existsSync(CONFIG_PATH)) {
            try { current = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')); } catch (_) { }
        }
        const dir = path.dirname(CONFIG_PATH);
        if (!fs.existsSync(dir)) {
            try { fs.mkdirSync(dir, { recursive: true }); }
            catch (_) { return { success: false, error: 'Cannot create config directory' }; }
        }
        fs.writeFileSync(CONFIG_PATH, JSON.stringify({ ...current, ...config }, null, 2));
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Backward-compatible aliases (so we don't break any code that still imports
// the old Vertex names before we finish the migration)
// ──────────────────────────────────────────────────────────────────────────────
/** @deprecated use getAppConfigAsync */
export const getVertexConfigAsync = getAppConfigAsync;
/** @deprecated use getAppConfig */
export const getVertexConfig = getAppConfig;
/** @deprecated use saveAppConfigAsync */
export const saveVertexConfigAsync = saveAppConfigAsync;
