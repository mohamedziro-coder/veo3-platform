import { GoogleAuth } from 'google-auth-library';
import { getVertexConfigAsync } from './config';

/**
 * Helper to sanitize string for URL construction
 */
function sanitize(val: any): string {
    if (typeof val !== 'string') return '';
    const clean = val.trim().replace(/[\r\n]/g, '');
    if (clean !== val) {
        console.warn(`[VEO-LRO] Sanitized input: "${val.replace(/\n/g, '\\n')}" -> "${clean}"`);
    }
    return clean;
}

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
        const projectId = sanitize(config.GOOGLE_PROJECT_ID || 'veo-demo');
        const location = sanitize(config.GOOGLE_LOCATION || 'us-central1');
        const model = sanitize('veo-3.1-fast-generate-001');

        const url = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predictLongRunning`;

        console.log(`[VEO-LRO] Starting video generation: ${url}`);

        // Validate URL
        try { new URL(url); } catch (e) {
            throw new Error(`Invalid Vertex URL: ${url}`);
        }

        // Create OAuth2 client
        const auth = new GoogleAuth({
            credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                : undefined,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        const client = await auth.getClient();

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

        if (params.endImageGcsUri) {
            requestBody.instances[0].lastFrame = {
                gcsUri: params.endImageGcsUri,
                mimeType: 'image/jpeg'
            };
        }

        // CRITICAL: Use client.request (gaxios) instead of fetch
        console.log(`[VEO-LRO] Executing Request via Gaxios...`);
        const response = await client.request({
            url,
            method: 'POST',
            data: requestBody,
            timeout: 20000 // 20s timeout
        });

        const data = response.data as any;
        console.log(`[VEO-LRO] Operation started: ${data.name}`);

        return { operationName: data.name };

    } catch (error: any) {
        console.error('[VEO-LRO] Failed to start video generation:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause,
            response: error.response?.data
        });
        throw error;
    }
}

/**
 * Poll Vertex AI operation status
 */
export async function pollOperationStatus(operationName: string): Promise<{
    done: boolean;
    error?: any;
    response?: any;
}> {
    try {
        const config = await getVertexConfigAsync();
        const projectId = sanitize(config.GOOGLE_PROJECT_ID);
        if (!projectId) throw new Error('GOOGLE_PROJECT_ID is not configured');
        let location = sanitize(config.GOOGLE_LOCATION || 'us-central1');

        // IMPROVED: Non-greedy location extraction (don't capture model path)
        const locMatch = operationName.match(/locations\/([^/]+)/);
        if (locMatch && locMatch[1]) {
            location = sanitize(locMatch[1]);
        } else {
            console.log(`[VEO-LRO] Could not extract location from ${operationName}, using config fallback: ${location}`);
        }

        const auth = new GoogleAuth({
            credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                : undefined,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        const client = await auth.getClient();

        const opId = sanitize(operationName.split('/').pop() || '');
        const cleanOpName = operationName.startsWith('/') ? operationName.substring(1) : operationName;

        // FINAL FIX: Use the FULL raw operation name provided by the API
        // This includes the "publishers/google/models/..." nested path which is REQUIRED for UUIDs.
        // v1beta1 is used for maximum compatibility with these nested LROs.
        const pollingUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/${cleanOpName}`;

        console.log(`[VEO-LRO] Polling via Gaxios (v1beta1 Raw Name): ${pollingUrl}`);

        const response = await client.request({
            url: pollingUrl,
            method: 'GET',
            timeout: 10000
        });

        const data = response.data as any;
        return {
            done: data.done || false,
            error: data.error,
            response: data.response
        };

    } catch (error: any) {
        // Advanced logging for fetch-like failures in gaxios
        if (error.message?.includes('fetch failed') || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.error('[VEO-LRO] NETWORK ERROR in Gaxios:', {
                code: error.code,
                message: error.message,
                cause: error.cause
            });
        }
        console.error('[VEO-LRO] Failed to poll operation:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause,
            response: error.response?.data
        });
        throw error;
    }
}
