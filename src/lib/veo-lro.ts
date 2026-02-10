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

        // Initial attempt with v1beta1 and normalized path
        let pollingUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/${operationName}`;

        // Check if we need to normalize (remove publisher model info) 
        // OR if we should try listing operations to find the real path

        try {
            return await executePoll(pollingUrl, accessToken.token);
        } catch (initialError: any) {
            console.warn(`[VEO-LRO] Direct poll failed: ${initialError.message}. Attempting to find operation in list...`);

            // Fallback: List operations to find the correct path
            const listUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${config.GOOGLE_PROJECT_ID}/locations/${location}/operations`;
            console.log(`[VEO-LRO] Listing operations: ${listUrl}`);

            const listRes = await fetch(listUrl, {
                headers: { 'Authorization': `Bearer ${accessToken.token}` }
            });

            if (!listRes.ok) {
                throw new Error(`Failed to list operations: ${listRes.status} ${await listRes.text()}`);
            }

            const listData = await listRes.json();
            const operations = listData.operations || [];

            // Find operation by UUID matching
            const opUuid = operationName.split('/').pop();
            const foundOp = operations.find((op: any) => op.name.includes(opUuid));

            if (foundOp) {
                console.log(`[VEO-LRO] Found correct operation path: ${foundOp.name}`);
                // Use the name from the list response which is guaranteed to be correct
                pollingUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/${foundOp.name}`;
                return await executePoll(pollingUrl, accessToken.token);
            }

            throw new Error(`Operation ${opUuid} not found in ${location} list.`);
        }

    } catch (error: any) {
        console.error('[VEO-LRO] Failed to poll operation:', error);
        throw error;
    }
}

async function executePoll(url: string, token: string) {
    console.log(`[VEO-LRO] Polling: ${url}`);
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
