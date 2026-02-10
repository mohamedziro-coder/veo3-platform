import { VertexAI } from '@google-cloud/vertexai';
import { getVertexConfig } from './config';

const config = getVertexConfig();
const PROJECT_ID = config.GOOGLE_PROJECT_ID;
const LOCATION = config.GOOGLE_LOCATION;

// Initialize Vertex AI
// Ensure GOOGLE_APPLICATION_CREDENTIALS env var is set to the path of the JSON key file
// OR we construct client options if JSON content is provided directly.
export const vertexAI = new VertexAI({
    project: PROJECT_ID || 'your-project-id',
    location: LOCATION || 'us-central1',
    // If JSON is provided in config, we might need a custom Auth client, 
    // but VertexAI SDK usually expects ADC or keyFilename.
    // However, if we populate GOOGLE_APPLICATION_CREDENTIALS env var with a file path, it works.
    // For raw JSON content handling in Node, we might need to write it to a temp file if SDK doesn't support direct object.
    // FORTUNATELY: If we rely on ADC in production, this is fine.
    // For the "Service Account JSON" input case, we might need to use `google-auth-library` manually if we want to support direct JSON string.
    // But for now, let's assume ADC or standard env vars.
});

export const getVeoModel = (modelName: string = 'veo-3.1-fast-generate-001') => {
    return vertexAI.preview.getGenerativeModel({
        model: modelName,
        generationConfig: {
            // Default config
        }
    });
};

export const getImagenModel = (modelName: string = 'imagen-3.0-generate-001') => {
    return vertexAI.preview.getGenerativeModel({
        model: modelName,
    });
};

export const getGeminiModel = (modelName: string = 'gemini-1.5-flash-001') => {
    return vertexAI.preview.getGenerativeModel({
        model: modelName,
    });
};

export const MOCK_PROJECT_ID = "veo-demo-project";
