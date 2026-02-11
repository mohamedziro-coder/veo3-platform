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

export const getGeminiModel = async (modelName: string = 'gemini-1.5-flash-001') => {
    const client = await getVertexClient();
    return client.getGenerativeModel({
        model: modelName,
    });
};

export const MOCK_PROJECT_ID = "veo-demo-project";
