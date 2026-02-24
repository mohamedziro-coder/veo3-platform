import fs from 'fs';
import path from 'path';
import { saveSystemConfig, getSystemConfig } from './db';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'config.json');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
export interface AppConfig {
    RUNWAYML_API_SECRET?: string;
    [key: string]: any;
}

// ──────────────────────────────────────────────────────────────────────────────
// Runtime validation — throws on startup if critical env vars are missing
// ──────────────────────────────────────────────────────────────────────────────
export function validateEnv(): void {
    const required = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'RUNWAYML_API_SECRET',
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(
            `[Security] Missing required environment variables: ${missing.join(', ')}\n` +
            `Set them in your Vercel dashboard or .env.local (never commit secrets to disk).`
        );
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Sync — env only in production, file fallback in development
// ──────────────────────────────────────────────────────────────────────────────
export function getAppConfig(): AppConfig {
    // 🔒 In production: ONLY use environment variables — never disk files
    if (IS_PRODUCTION) {
        return {
            RUNWAYML_API_SECRET: process.env.RUNWAYML_API_SECRET,
        };
    }

    // Development: allow local file override (never committed — add to .gitignore)
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
            const config = JSON.parse(data);
            return {
                RUNWAYML_API_SECRET: config.RUNWAYML_API_SECRET || process.env.RUNWAYML_API_SECRET,
            };
        }
    } catch (e) {
        console.error('[Config] Error reading config.json (dev only):', e);
    }
    return {
        RUNWAYML_API_SECRET: process.env.RUNWAYML_API_SECRET,
    };
}

// ──────────────────────────────────────────────────────────────────────────────
// Async — DB first, then env (production-safe)
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

        // Best-effort local file cache (dev only)
        if (!IS_PRODUCTION) {
            try { saveAppConfig(config); } catch (_) { }
        }

        return { success: true };
    } catch (e: any) {
        console.error('[Config] Error saving app config:', e);
        return { success: false, error: e.message };
    }
}

export function saveAppConfig(config: AppConfig): { success: boolean; error?: string } {
    // 🔒 Blocked in production — use Vercel env vars instead
    if (IS_PRODUCTION) {
        console.warn('[Security] saveAppConfig is disabled in production. Use environment variables.');
        return { success: false, error: 'File-based config is disabled in production.' };
    }

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
// Backward-compatible aliases
// ──────────────────────────────────────────────────────────────────────────────
/** @deprecated use getAppConfigAsync */
export const getVertexConfigAsync = getAppConfigAsync;
/** @deprecated use getAppConfig */
export const getVertexConfig = getAppConfig;
/** @deprecated use saveAppConfigAsync */
export const saveVertexConfigAsync = saveAppConfigAsync;

