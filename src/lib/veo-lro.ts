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

        // Extract UUID from operationName (last part)
        const opUuid = operationName.split('/').pop();
        const projectId = config.GOOGLE_PROJECT_ID;
        let location = config.GOOGLE_LOCATION || 'us-central1';

        // Try to extract location from operation name
        const match = operationName.match(/locations\/([^\/]+)\/operations/);
        if (match && match[1]) {
            location = match[1];
        }

        console.log(`[VEO-LRO] Looking for operation UUID: ${opUuid} in ${location}`);

        // STRATEGY: List operations to find the correct resource path
        // This avoids guessing "long vs uuid" path issues
        const listUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/operations`;

        const listRes = await fetch(listUrl, {
            headers: { 'Authorization': `Bearer ${accessToken.token}` }
        });

        if (!listRes.ok) {
            const errText = await listRes.text();
            console.warn(`[VEO-LRO] Failed to list operations: ${listRes.status} ${errText}`);
            // Fallback: try polling exact name provided
            return await executePoll(`https://${location}-aiplatform.googleapis.com/v1beta1/${operationName}`, accessToken.token);
        }

        const listData = await listRes.json();
        const operations = listData.operations || [];

        // Find operation by UUID matching
        const foundOp = operations.find((op: any) => op.name.includes(opUuid));

        let pollingUrl;
        if (foundOp) {
            console.log(`[VEO-LRO] Found correct operation path: ${foundOp.name}`);
            pollingUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/${foundOp.name}`;
        } else {
            console.warn(`[VEO-LRO] Operation ${opUuid} not found in list. Using original name.`);
            // If not found in list (maybe improper pagination later?), try original name
            // Also try stripping "publishers/..." if present as a Hail Mary
            let cleanName = operationName.replace(/\/publishers\/google\/models\/[^\/]+/, '');
            pollingUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/${cleanName}`;
        }

        return await executePoll(pollingUrl, accessToken.token);

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
        // If 404/400, strictly throw so we know
        throw new Error(`${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
        done: data.done || false,
        error: data.error,
        response: data.response
    };
}
