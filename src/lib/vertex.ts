import { VertexAI } from '@google-cloud/vertexai';

const PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const LOCATION = process.env.GOOGLE_LOCATION || 'us-central1';

// Initialize Vertex AI
// Ensure GOOGLE_APPLICATION_CREDENTIALS env var is set to the path of the JSON key file
// OR the environment is already authenticated (e.g. Cloud Shell, GCE).
export const vertexAI = new VertexAI({
    project: PROJECT_ID || 'your-project-id',
    location: LOCATION,
});

export const getVeoModel = (modelName: string = 'veo-3.1-generate-001') => {
    return vertexAI.preview.getGenerativeModel({
        model: modelName,
        generationConfig: {
            // Default config
        }
    });
};

export const MOCK_PROJECT_ID = "veo-demo-project";
