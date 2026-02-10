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

        const url = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predictLongRunning`;

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
        // We use v1beta1 to support GenAI operations (UUIDs) AND normalize the path to remove model reference

        let cleanOperationName = operationName;

        // Remove /publishers/google/models/MODEL_ID if present
        if (cleanOperationName.includes('/publishers/google/models/')) {
            cleanOperationName = cleanOperationName.replace(/\/publishers\/google\/models\/[^\/]+/, '');
            console.log(`[VEO-LRO] Normalized operation name: ${cleanOperationName}`);
        }

        let location = config.GOOGLE_LOCATION || 'us-central1';

        // Try to extract location from normalized operation name
        const match = cleanOperationName.match(/locations\/([^\/]+)\/operations/);
        if (match && match[1]) {
            location = match[1];
        }

        // STRATEGY: Try multiple path permutations to find the operation
        // The API is inconsistent: it may return 'gen-lang-client' project or 'publishers/models' paths
        // We will try:
        // 1. Exact name returned by API
        // 2. Name with 'gen-lang-client...' replaced by YOUR project ID
        // 3. Name with '/publishers/...' stripped (normalized) AND project replaced

        let projectId = config.GOOGLE_PROJECT_ID;
        if (!projectId) {
            console.warn('[VEO-LRO] No project ID configured! Polling might fail.');
            projectId = 'veo-demo'; // Fallback
        }

        const exactName = operationName;

        // Construct Candidate 2: Force User Project ID
        let nameWithUserProject = operationName;
        if (operationName.includes('projects/gen-lang-client')) {
            nameWithUserProject = operationName.replace(/projects\/[^\/]+/, `projects/${projectId}`);
        }

        // Construct Candidate 3: Normalized + User Project
        let normalizedName = nameWithUserProject;
        if (normalizedName.includes('/publishers/google/models/')) {
            normalizedName = normalizedName.replace(/\/publishers\/google\/models\/[^\/]+/, '');
        }

        const candidates = [
            `https://${location}-aiplatform.googleapis.com/v1beta1/${exactName}`,
            `https://${location}-aiplatform.googleapis.com/v1beta1/${nameWithUserProject}`,
            `https://${location}-aiplatform.googleapis.com/v1beta1/${normalizedName}`
        ];

        // Unique URLs only
        const uniqueUrls = [...new Set(candidates)];

        let lastError = null;

        for (const url of uniqueUrls) {
            try {
                return await executePoll(url, accessToken.token);
            } catch (error: any) {
                console.warn(`[VEO-LRO] Failed poll on ${url}: ${error.message}`);
                lastError = error;
                // If 403 or 404, continue to next candidate. 
                // If it's a different error (e.g. 500), maybe stop? For now keep trying.
            }
        }

        // If all failed, throw the last error
        throw lastError || new Error('All polling attempts failed.');

    } catch (error: any) {
        console.error('[VEO-LRO] Failed to poll operation:', error);
        throw error;
    }
}

async function executePoll(url: string, token: string) {
    console.log(`[VEO-LRO] Polling Attempt: ${url}`);
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
        done: data.done || false,
        error: data.error,
        response: data.response
    };
}
