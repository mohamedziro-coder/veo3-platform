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

        // AUTO-DISCOVERY: Try multiple variations since UUIDs have inconsistent endpoint support
        const variations = [
            // 1. v1 Nested (Most likely for Publisher models)
            `https://${location}-aiplatform.googleapis.com/v1/${cleanOpName}`,
            // 2. v1beta1 Nested (Common for preview features)
            `https://${location}-aiplatform.googleapis.com/v1beta1/${cleanOpName}`,
            // 3. v1beta1 Flat (Often supports UUIDs where v1 flat doesn't)
            `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/operations/${opId}`,
            // 4. v1 Flat (Standard, but known to fail with "Must be a Long" for UUIDs)
            `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/operations/${opId}`
        ];

        let lastError: any = null;

        for (const pollingUrl of variations) {
            try {
                console.log(`[VEO-LRO] Trying Poll URL: ${pollingUrl}`);
                const response = await client.request({
                    url: pollingUrl,
                    method: 'GET',
                    timeout: 5000 // Short timeout for discovery
                });

                if (response.status === 200) {
                    const data = response.data as any;
                    console.log(`[VEO-LRO] Successful poll at: ${pollingUrl}`);
                    return {
                        done: data.done || false,
                        error: data.error,
                        response: data.response
                    };
                }
            } catch (err: any) {
                const status = err.response?.status;
                const errorData = err.response?.data;
                console.warn(`[VEO-LRO] Failed variation (${status || 'NET'}): ${pollingUrl}`, errorData);
                lastError = err;

                // If it's 200/400/403/404 we continue to next variation
                // If it's a success but done=false, the catch won't trigger, we return above.
            }
        }

        // If we reach here, all variations failed
        throw lastError || new Error('All polling endpoint variations failed');

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
