import { GoogleAuth } from 'google-auth-library';
import { getVertexConfigAsync } from './config';

/**
 * Start Veo 3.1 video generation using REST API :predictLongRunning
 * Returns operation name for polling
 */
export async function startVideoGeneration(params: {
    prompt: string;
    startImageGcsUri: string;
    endImageGcsUri?: string;
    outputGcsUri: string;
}): Promise<{ operationName: string }> {
    try {
        const config = await getVertexConfigAsync();

        // Create OAuth2 client for Vertex AI
        const auth = new GoogleAuth({
            credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                : undefined,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();

        if (!accessToken.token) {
            throw new Error('Failed to get access token');
        }

        const projectId = config.GOOGLE_PROJECT_ID || 'veo-demo';
        const location = config.GOOGLE_LOCATION || 'us-central1';
        const model = 'veo-3.1-fast-generate-001';

        const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predictLongRunning`;

        console.log(`[VEO-LRO] Starting video generation: ${url}`);
        console.log(`[VEO-LRO] Start frame: ${params.startImageGcsUri}`);
        console.log(`[VEO-LRO] End frame: ${params.endImageGcsUri || 'none'}`);

        const requestBody: any = {
            instances: [{
                prompt: params.prompt,
                image: {
                    gcsUri: params.startImageGcsUri,
                    mimeType: 'image/jpeg'
                }
            }],
            parameters: {
                storageUri: params.outputGcsUri,
                sampleCount: 1,
                aspectRatio: '16:9'
            }
        };

        // Add last frame if provided
        if (params.endImageGcsUri) {
            requestBody.instances[0].lastFrame = {
                gcsUri: params.endImageGcsUri,
                mimeType: 'image/jpeg'
            };
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[VEO-LRO] API Error (${response.status}):`, errorText);
            throw new Error(`Vertex AI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log(`[VEO-LRO] Operation started: ${data.name}`);

        return { operationName: data.name };

    } catch (error: any) {
        console.error('[VEO-LRO] Failed to start video generation:', error);
        throw error;
    }
}

/**
 * Poll Vertex AI operation status
 * Returns operation details including done status and result
 */
export async function pollOperationStatus(operationName: string): Promise<{
    done: boolean;
    error?: any;
    response?: any;
}> {
    try {
        const config = await getVertexConfigAsync();

        const auth = new GoogleAuth({
            credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                : undefined,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();

        if (!accessToken.token) {
            throw new Error('Failed to get access token');
        }

        // Expected operationName format: projects/PROJECT_ID/locations/LOCATION/operations/OP_ID
        // Issue: API might return projects/.../publishers/google/models/.../operations/OP_ID
        // Fix: Normalize to standard operations path

        let cleanOperationName = operationName;

        // Remove /publishers/google/models/MODEL_ID if present
        if (cleanOperationName.includes('/publishers/google/models/')) {
            cleanOperationName = cleanOperationName.replace(/\/publishers\/google\/models\/[^\/]+/, '');
            console.log(`[VEO-LRO] Normalized operation name: ${cleanOperationName}`);
        }

        // Try to extract location from operation name
        let location = config.GOOGLE_LOCATION || 'us-central1';
        const match = cleanOperationName.match(/locations\/([^\/]+)\/operations/);
        if (match && match[1]) {
            location = match[1];
        }

        const url = `https://${location}-aiplatform.googleapis.com/v1/${cleanOperationName}`;

        console.log(`[VEO-LRO] Polling URL: ${url}`);

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken.token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            // If 404, it might mean the operation is not found in this region or API version issue
            console.error(`[VEO-LRO] Poll Error (${response.status}) for ${url}:`, errorText);
            throw new Error(`Failed to poll operation: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        return {
            done: data.done || false,
            error: data.error,
            response: data.response
        };

    } catch (error: any) {
        console.error('[VEO-LRO] Failed to poll operation:', error);
        throw error;
    }
}
