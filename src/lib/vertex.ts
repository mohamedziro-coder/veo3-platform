import { VertexAI, GenerativeModel } from '@google-cloud/vertexai';
import { getVertexConfigAsync, getVertexConfig } from './config';

// Global instance cache (lazy load) prevents recreating client on every call if mostly static
// But allows re-fetching config if needed (though typically config doesn't change often per container)
// For simplicity and correctness with DB config, we'll fetch config every time or assume short-lived serverless.

// Async helper to get authenticated Vertex client
export async function getVertexClient(): Promise<VertexAI> {
    const config = await getVertexConfigAsync();

    return new VertexAI({
        project: config.GOOGLE_PROJECT_ID || 'your-project-id',
        location: config.GOOGLE_LOCATION || 'us-central1',
        // Google Auth Library will automatically use GOOGLE_APPLICATION_CREDENTIALS_JSON from env 
        // if we set it in process.env dynamically? No, SDK matches GoogleAuth options.
        // VertexAI SDK doesn't straightforwardly take JSON object for credentials in constructor 
        // without passing a custom `googleAuthOptions`.
        // However, standard Google Cloud practice:
        // If we have JSON in DB, we typically write it to a temp file and set GOOGLE_APPLICATION_CREDENTIALS 
        // OR we pass `googleAuthOptions: { credentials: ... }` if SDK supports it.
        googleAuthOptions: config.GOOGLE_APPLICATION_CREDENTIALS_JSON ? {
            credentials: JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
        } : undefined
    });
}

// Deprecated global instance (uses Env/Sync config only)
// Kept for backward compatibility if any file imports 'vertexAI' directly without async
// But we should migrate consumers.
export const vertexAI = new VertexAI({
    project: process.env.GOOGLE_PROJECT_ID || 'veo-demo',
    location: process.env.GOOGLE_LOCATION || 'us-central1',
});

export const getVeoModel = async (modelName: string = 'veo-3.1-fast-generate-001') => {
    const client = await getVertexClient();
    return client.preview.getGenerativeModel({
        model: modelName,
        generationConfig: {
            // Default config
        }
    });
};

export const getImagenModel = async (modelName: string = 'imagen-3.0-generate-001') => {
    const client = await getVertexClient();
    return client.preview.getGenerativeModel({
        model: modelName,
    });
};
// ---- NEW: Google Gen AI SDK for Gemini (replaces deprecated Vertex AI SDK for Gemini) ----
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const getGeminiGenAI = async (): Promise<GoogleGenAI> => {
    const config = await getVertexConfigAsync();

    // If credentials JSON is stored in DB/config, write to temp file for ADC
    if (config.GOOGLE_APPLICATION_CREDENTIALS_JSON && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        try {
            const tmpDir = os.tmpdir();
            const credPath = path.join(tmpDir, 'vertex-sa-key.json');
            fs.writeFileSync(credPath, config.GOOGLE_APPLICATION_CREDENTIALS_JSON);
            process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
        } catch (e) {
            console.error('Failed to write temp credentials file:', e);
        }
    }

    return new GoogleGenAI({
        vertexai: true,
        project: config.GOOGLE_PROJECT_ID || 'your-project-id',
        location: config.GOOGLE_LOCATION || 'us-central1',
    });
};

// Helper to generate text content with Gemini via Gen AI SDK
export const geminiGenerateContent = async (
    prompt: string,
    modelName: string = 'gemini-2.0-flash'
) => {
    const ai = await getGeminiGenAI();
    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
    });
    return response.text || '{}';
};

// Keep old getGeminiModel for backward compat but mark deprecated
/** @deprecated Use geminiGenerateContent() instead */
export const getGeminiModel = async (modelName: string = 'gemini-2.0-flash') => {
    const client = await getVertexClient();
    return client.getGenerativeModel({
        model: modelName,
    });
};

export const MOCK_PROJECT_ID = "veo-demo-project";
